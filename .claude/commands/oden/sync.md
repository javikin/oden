---
allowed-tools: Bash, Read, Write, LS, Task
description: Sincronizar epic y tasks con GitHub Issues (nativo, sin CCPM)
---

# Sync - GitHub Issues Synchronization

Sincroniza epics y tasks locales con GitHub Issues. Comando nativo sin dependencia de CCPM.

## Usage
```
/oden:sync <feature_name> [subcommand]
/oden:sync status
```

## Subcommands

- `/oden:sync <name>` - Full sync: push epic + tasks to GitHub, create branch
- `/oden:sync <name> push` - Same as above (explicit)
- `/oden:sync <name> update` - Update existing GitHub issues from local changes
- `/oden:sync status` - Show sync status of all epics

## Preflight

### Repository Protection
```bash
remote_url=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$remote_url" == *"automazeio/ccpm"* ]] || [[ "$remote_url" == *"automazeio/ccpm.git"* ]]; then
  echo "Cannot sync to CCPM template repository!"
  echo "Update remote: git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
  exit 1
fi
```

### Validation
1. **Epic exists**: Check `.claude/epics/$ARGUMENTS/epic.md`
   - If not found: "Epic not found. Create it: /oden:prd $ARGUMENTS && /oden:epic $ARGUMENTS && /oden:tasks $ARGUMENTS"

2. **Tasks exist**: Check for numbered task files in `.claude/epics/$ARGUMENTS/`
   - If none found: "No tasks found. Create them: /oden:tasks $ARGUMENTS"

3. **Git remote**: Verify origin is configured
   - If not: "No remote. Run: git remote add origin <url>"

## Instructions

### Detect Repository
```bash
remote_url=$(git remote get-url origin 2>/dev/null || echo "")
REPO=$(echo "$remote_url" | sed 's|.*github.com[:/]||' | sed 's|\.git$||')
[ -z "$REPO" ] && REPO="user/repo"
```

### Setup Labels
Create labels if they don't exist (silently):
```bash
gh label create "epic" --color "0E8A16" --description "Epic issue" 2>/dev/null || true
gh label create "task" --color "1D76DB" --description "Task issue" 2>/dev/null || true
gh label create "feature" --color "A2EEEF" --description "New feature" 2>/dev/null || true
```

---

## Full Sync Flow (`/oden:sync <name>`)

### Step 1: Create Epic Issue

Strip frontmatter and prepare body:
```bash
# Extract content without frontmatter
sed '1,/^---$/d; 1,/^---$/d' .claude/epics/$ARGUMENTS/epic.md > /tmp/epic-body-raw.md

# Remove "## Tasks Created" section (will be auto-generated from sub-issues)
awk '
  /^## Tasks Created/ { skip=1; next }
  /^## / && skip { skip=0 }
  !skip { print }
' /tmp/epic-body-raw.md > /tmp/epic-body.md

# Create epic issue
epic_number=$(gh issue create \
  --repo "$REPO" \
  --title "Epic: $ARGUMENTS" \
  --body-file /tmp/epic-body.md \
  --label "epic,epic:$ARGUMENTS,feature" \
  --json number -q .number)
```

### Step 2: Create Task Sub-Issues

Check for gh-sub-issue extension:
```bash
if gh extension list | grep -q "yahsan2/gh-sub-issue"; then
  use_subissues=true
else
  use_subissues=false
fi
```

For each task file:
```bash
for task_file in .claude/epics/$ARGUMENTS/[0-9][0-9][0-9].md; do
  [ -f "$task_file" ] || continue

  task_name=$(grep '^name:' "$task_file" | sed 's/^name: *//')
  sed '1,/^---$/d; 1,/^---$/d' "$task_file" > /tmp/task-body.md

  if [ "$use_subissues" = true ]; then
    task_number=$(gh sub-issue create \
      --parent "$epic_number" \
      --title "$task_name" \
      --body-file /tmp/task-body.md \
      --label "task,epic:$ARGUMENTS" \
      --json number -q .number)
  else
    task_number=$(gh issue create \
      --repo "$REPO" \
      --title "$task_name" \
      --body-file /tmp/task-body.md \
      --label "task,epic:$ARGUMENTS" \
      --json number -q .number)
  fi

  echo "$task_file:$task_number" >> /tmp/task-mapping.txt
done
```

**For 5+ tasks**: Use Task tool for parallel creation in batches of 3-4.

### Step 3: Rename Files and Update References

Build old-to-new mapping:
```bash
> /tmp/id-mapping.txt
while IFS=: read -r task_file task_number; do
  old_num=$(basename "$task_file" .md)
  echo "$old_num:$task_number" >> /tmp/id-mapping.txt
done < /tmp/task-mapping.txt
```

Rename and update references:
```bash
repo_name=$(gh repo view --json nameWithOwner -q .nameWithOwner)
current_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

while IFS=: read -r task_file task_number; do
  new_name="$(dirname "$task_file")/${task_number}.md"
  content=$(cat "$task_file")

  # Update depends_on and conflicts_with references
  while IFS=: read -r old_num new_num; do
    content=$(echo "$content" | sed "s/\b$old_num\b/$new_num/g")
  done < /tmp/id-mapping.txt

  echo "$content" > "$new_name"
  [ "$task_file" != "$new_name" ] && rm "$task_file"

  # Update frontmatter
  github_url="https://github.com/$repo_name/issues/$task_number"
  sed -i.bak "/^github:/c\github: $github_url" "$new_name"
  sed -i.bak "/^updated:/c\updated: $current_date" "$new_name"
  rm "${new_name}.bak"
done < /tmp/task-mapping.txt
```

### Step 4: Update Epic with Task List (fallback without sub-issues)

If NOT using gh-sub-issue, add task list to epic issue body:
```bash
if [ "$use_subissues" = false ]; then
  gh issue view ${epic_number} --json body -q .body > /tmp/epic-body.md
  # Append task checklist
  echo "" >> /tmp/epic-body.md
  echo "## Tasks" >> /tmp/epic-body.md
  while IFS=: read -r task_file task_number; do
    task_name=$(grep '^name:' "$(dirname "$task_file")/${task_number}.md" | sed 's/^name: *//')
    echo "- [ ] #${task_number} ${task_name}" >> /tmp/epic-body.md
  done < /tmp/task-mapping.txt
  gh issue edit ${epic_number} --body-file /tmp/epic-body.md
fi
```

### Step 5: Update Local Epic File

```bash
epic_url="https://github.com/$repo_name/issues/$epic_number"
current_date=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Update frontmatter
sed -i.bak "/^github:/c\github: $epic_url" .claude/epics/$ARGUMENTS/epic.md
sed -i.bak "/^updated:/c\updated: $current_date" .claude/epics/$ARGUMENTS/epic.md
rm .claude/epics/$ARGUMENTS/epic.md.bak
```

Update "## Tasks Created" section with real issue numbers.

### Step 6: Create Mapping File

Create `.claude/epics/$ARGUMENTS/github-mapping.md`:
```markdown
# GitHub Issue Mapping

Epic: #{epic_number} - https://github.com/{repo}/issues/{epic_number}

Tasks:
- #{task_number}: {task_name} - https://github.com/{repo}/issues/{task_number}
- ...

Synced: {current_datetime}
```

### Step 7: Create Branch

Follow `/rules/branch-operations.md`:
```bash
git checkout main && git pull origin main
git checkout -b epic/$ARGUMENTS
git push -u origin epic/$ARGUMENTS
```

### Output

```
Synced to GitHub
  Epic: #{epic_number}
  Tasks: {count} issues created
  Labels: epic, task, epic:{name}
  Files renamed: 001.md -> {issue_id}.md
  Branch: epic/$ARGUMENTS

Next: /oden:epic-start $ARGUMENTS
View: https://github.com/{repo}/issues/{epic_number}
```

---

## Update Flow (`/oden:sync <name> update`)

For syncing local changes to existing GitHub issues:

1. Read github-mapping.md for issue numbers
2. For each task with local changes since last sync:
   - Update GitHub issue body if task description changed
   - Add progress comment if updates exist
3. Update epic progress on GitHub
4. Update local sync timestamps

---

## Status Flow (`/oden:sync status`)

Scan all epics and show sync state:

```
SYNC STATUS

Epics:
  {name} (#{number}) - {closed}/{total} tasks | {progress}%
  {name} (#{number}) - {closed}/{total} tasks | {progress}%

Issues in progress:
  #{number}: {title}
  #{number}: {title}

Local only (not synced):
  {name} - Run: /oden:sync {name}
```

---

## Error Handling

Follow `/rules/github-operations.md` for GitHub CLI errors.

If any issue creation fails:
- Report what succeeded and what failed
- Don't attempt rollback (partial sync is fine)
- Suggest: "Retry failed items with: /oden:sync $ARGUMENTS update"

## Important Notes

- **No CCPM dependency** - this is fully native
- Always check remote origin before GitHub writes
- Get REAL datetime: `date -u +"%Y-%m-%dT%H:%M:%SZ"`
- Update frontmatter only after successful creation
- Clean up temp files after operations
