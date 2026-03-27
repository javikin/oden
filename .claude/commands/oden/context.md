---
allowed-tools: Bash, Read, Write, Edit, LS, Glob, Grep, Task
description: Context preservation system - solve "context amnesia" in AI-first development
---

# Oden Forge - Context Preservation System

Sistema para preservar conocimiento arquitectónico entre sesiones de Claude y detectar patrones duplicados.

## Problem Statement

**Critical Gap Identified:** Context amnesia en desarrollo AI-first
- Cada sesión Claude = contexto nuevo
- Result: 10 implementaciones de formatCurrency
- Architectural decisions perdidas entre sesiones
- No pattern reuse detection

## Usage

```bash
/oden:context snapshot [description]    # Capture current context
/oden:context restore                   # Restore context for new session
/oden:context detect                    # Find duplicate patterns
/oden:context drift                     # Check architecture compliance
/oden:context patterns                  # Show reusable patterns
/oden:context memory [add/show/clean]   # Manage project memory
```

## Architecture

### Core Components

1. **Session Context Snapshots**
2. **Pattern Library with Duplicate Detection**
3. **Architecture Drift Detection**
4. **Cross-Session Memory System**
5. **Smart Context Handoff**

---

## Component 1: Session Context Snapshots

### Purpose
Capture current session state, decisions, and context for next session restoration.

### Implementation

```bash
/oden:context snapshot "completed auth implementation"
```

Creates: `.claude/memory/sessions/{timestamp}-snapshot.md`

### Snapshot Content Structure

```markdown
---
created: {current_datetime}
session_type: implementation|debugging|architecture|review
branch: {current_branch}
status: active|completed|interrupted
context_size: estimated_tokens
---

# Session Snapshot: {description}

## Quick Summary
- **What:** {1-line description}
- **Files changed:** {list of modified files}
- **Decisions made:** {key architectural decisions}
- **Current state:** {what's working/broken}

## Context for Next Session

### Architectural Decisions Made
{decisions that should persist}

### Patterns Established
{reusable patterns created this session}

### Known Issues
{technical debt or problems to remember}

### Next Steps
{what the next session should focus on}

## Files Modified
{git diff --name-only summary}

## Key Functions/Components Created
{exportable patterns for reuse}
```

---

## Component 2: Pattern Library with Duplicate Detection

### Purpose
Automatically detect code duplication and suggest existing implementations.

### Implementation

```bash
/oden:context detect
```

### Pattern Detection Algorithm

```bash
# 1. Scan codebase for function definitions
find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" |
  xargs grep -l "function\|const.*=.*=>.*function" |
  while read file; do
    # Extract function signatures and patterns
    grep -n "export\|function\|const.*=" "$file" |
      sed 's/^/'"${file}"':/g' >> /tmp/functions.txt
  done

# 2. Detect similar patterns
sort /tmp/functions.txt |
  awk '{
    # Simple similarity detection
    gsub(/[a-zA-Z]+/, "X", $0)  # Replace names with X
    if (seen[$0]) {
      print "DUPLICATE PATTERN:", $0
      print "  Files:", seen[$0], $1
    } else {
      seen[$0] = $1
    }
  }'

# 3. Store in pattern library
```

### Pattern Library Structure

```
.claude/memory/patterns/
├── common-functions.md        # formatCurrency, dateHelpers, etc.
├── ui-patterns.md            # Button variants, Modal patterns
├── api-patterns.md           # Fetch patterns, error handling
├── state-patterns.md         # Redux/Zustand patterns
└── duplicate-report.md       # Current duplications found
```

### Pattern Entry Format

```markdown
## Pattern: formatCurrency

### Usage Count: 3 implementations found

### Canonical Implementation
```typescript
// src/utils/currency.ts (recommended)
export const formatCurrency = (amount: number, currency = 'MXN') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
  }).format(amount);
};
```

### Duplicate Locations
- `src/components/PriceDisplay.tsx:15` (inline)
- `src/hooks/useOrderTotal.ts:23` (slightly different)
- `src/pages/checkout.tsx:67` (different format)

### Suggested Action
Replace all with import from `src/utils/currency.ts`
```

---

## Component 3: Architecture Drift Detection

### Purpose
Monitor compliance with architectural decisions from technical-decisions.md.

### Implementation

```bash
/oden:context drift
```

### Drift Detection Rules

```yaml
# .claude/memory/compliance-rules.yaml
rules:
  file_size_limit:
    max_lines: 500
    scan_patterns: ["src/**/*.ts", "src/**/*.tsx"]
    exceptions: ["src/types/index.ts"]

  import_patterns:
    forbidden_imports:
      - pattern: "import.*from 'axios'"
        message: "Use fetch wrapper from src/lib/api.ts"
      - pattern: "import.*direct.*'../../../"
        message: "Deep relative imports not allowed. Use absolute imports."

  architecture_layers:
    src/pages:
      can_import: ["src/components", "src/hooks", "src/services"]
      cannot_import: ["src/lib/database", "src/utils/server"]
    src/components:
      can_import: ["src/hooks", "src/utils", "src/types"]
      cannot_import: ["src/services", "src/pages"]
```

### Drift Report Format

```markdown
# Architecture Drift Report

## Violations Found: 3

### 🚨 CRITICAL: File Size Violations
- `src/store/index.ts`: 2,392 lines (limit: 500)
  - **Action:** Split into modules using pattern from technical-decisions.md

### ⚠️ WARNING: Import Violations
- `src/pages/dashboard.tsx:5`: Direct database import
  - **Action:** Use service layer pattern instead

### ✅ COMPLIANT: 47 files following patterns
```

---

## Component 4: Cross-Session Memory System

### Purpose
Persistent knowledge base that grows with each session.

### Memory Structure

```
.claude/memory/
├── sessions/              # Session snapshots
├── patterns/              # Pattern library
├── decisions/             # Architectural decisions log
├── knowledge/             # Accumulated learnings
└── index.md              # Quick reference
```

### Knowledge Accumulation

```markdown
# .claude/memory/knowledge/auth-patterns.md

## Authentication Implementation Learnings

### Session 2026-03-15: JWT Implementation
- **Decision:** Use httpOnly cookies instead of localStorage
- **Reason:** XSS protection
- **Pattern:** AuthContext + useAuth hook
- **Files:** src/contexts/AuthContext.tsx

### Session 2026-03-20: Refresh Token Logic
- **Issue:** Token refresh race condition
- **Solution:** Axios interceptor with queue pattern
- **Files:** src/lib/api.ts:45-78

### Session 2026-03-25: Role-Based Access
- **Pattern:** HOC + hook combo for route protection
- **Files:** src/components/ProtectedRoute.tsx
```

---

## Component 5: Smart Context Handoff

### Purpose
Intelligently restore relevant context when starting new sessions.

### Handoff Process

```bash
# When starting new session
/oden:context restore

# 1. Detect current work context
current_branch=$(git branch --show-current)
changed_files=$(git diff main --name-only)
open_issues=$(gh issue list --state open --limit 5 --json number,title)

# 2. Find relevant snapshots
grep -l "$current_branch" .claude/memory/sessions/*.md | head -3

# 3. Build context briefing
```

### Context Briefing Format

```markdown
# Context Briefing for New Session

## Current Situation
- **Branch:** epic/authentication-system
- **Last session:** 2026-03-25T14:30:45Z
- **Files changed:** src/auth/*, src/components/LoginForm.tsx

## Relevant History
- **Authentication patterns established:** JWT + httpOnly cookies
- **Known issues:** Refresh token race condition (solved)
- **Reusable patterns:** AuthContext, ProtectedRoute HOC

## Current Architecture State
- **Compliance:** 94% (3 minor violations)
- **Patterns available:** 15 reusable components
- **Duplicates detected:** 0 (cleaned last session)

## Recommended Next Actions
1. Complete registration flow (50% done)
2. Add email verification
3. Update tests for new auth patterns
```

---

## Commands Implementation

### /oden:context snapshot [description]

```bash
#!/bin/bash
description="${1:-"Work session snapshot"}"
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
branch=$(git branch --show-current)
session_file=".claude/memory/sessions/${timestamp//[:T-]/}-snapshot.md"

# Create snapshot
cat > "$session_file" << EOF
---
created: $timestamp
session_type: implementation
branch: $branch
status: active
context_size: medium
---

# Session Snapshot: $description

## Quick Summary
- **What:** $description
- **Files changed:** $(git diff --name-only | tr '\n' ', ')
- **Current state:** In progress

## Context for Next Session

### Architectural Decisions Made
$(git log -1 --oneline)

### Files Modified
\`\`\`
$(git status --porcelain)
\`\`\`

## Next Steps
- Continue current implementation
- Run tests when ready
EOF

echo "✅ Context snapshot saved: $session_file"
```

### /oden:context detect

```bash
#!/bin/bash
echo "🔍 Scanning for duplicate patterns..."

# Create temp analysis
mkdir -p .claude/memory/patterns
report_file=".claude/memory/patterns/duplicate-report.md"

# Function to detect patterns
detect_functions() {
  find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" |
    xargs grep -n "function\|const.*=.*=>" |
    grep -v "test\|spec" > /tmp/all-functions.txt

  # Simple duplicate detection
  echo "# Duplicate Pattern Report" > "$report_file"
  echo "Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$report_file"
  echo "" >> "$report_file"

  # Group by similar function names
  cat /tmp/all-functions.txt |
    sed 's/.*function \([^(]*\).*/\1/' |
    sed 's/.*const \([^=]*\) *=.*/\1/' |
    sort | uniq -c | sort -nr |
    awk '$1 > 1 {print "## Potential duplicate: " $2 " (" $1 " occurrences)"}' >> "$report_file"
}

detect_functions
echo "✅ Duplicate patterns report: $report_file"
```

### /oden:context drift

```bash
#!/bin/bash
echo "🎯 Checking architecture compliance..."

# Check file sizes
echo "## File Size Check"
find src -name "*.ts" -o -name "*.tsx" | while read file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 500 ]; then
    echo "❌ $file: $lines lines (limit: 500)"
  fi
done

# Check import patterns
echo "## Import Pattern Check"
grep -r "from 'axios'" src/ && echo "❌ Direct axios imports found" || echo "✅ No direct axios imports"

echo "✅ Architecture drift report completed"
```

### /oden:context memory

```bash
#!/bin/bash
action="${1:-show}"

case "$action" in
  "add")
    echo "Adding to project memory..."
    # Implementation for adding knowledge
    ;;
  "show")
    echo "📚 Project Memory Summary"
    echo "Sessions: $(ls .claude/memory/sessions/ 2>/dev/null | wc -l)"
    echo "Patterns: $(find .claude/memory/patterns/ -name "*.md" 2>/dev/null | wc -l)"
    echo "Last update: $(ls -t .claude/memory/sessions/ 2>/dev/null | head -1)"
    ;;
  "clean")
    echo "Cleaning old memory..."
    find .claude/memory/sessions/ -name "*.md" -mtime +30 -delete 2>/dev/null || true
    echo "✅ Old sessions cleaned"
    ;;
esac
```

---

## Integration with Existing Commands

### Enhanced /oden:work Integration

```yaml
# When /oden:work starts
pre_work_hooks:
  - /oden:context restore    # Load relevant context
  - /oden:context detect     # Check for patterns before coding

# During work
session_hooks:
  - /oden:context drift      # Monitor compliance

# After work
post_work_hooks:
  - /oden:context snapshot   # Save session state
```

### Enhanced /oden:architect Integration

```yaml
# When creating technical decisions
pattern_awareness:
  - Scan existing patterns before defining new ones
  - Reference established architectural decisions
  - Update compliance rules automatically
```

---

## Installation & Setup

### Automatic Setup

```bash
# Create memory structure
mkdir -p .claude/memory/{sessions,patterns,decisions,knowledge}

# Initialize index
cat > .claude/memory/index.md << 'EOF'
# Project Memory Index

## Quick Access
- [Latest Session](sessions/)
- [Common Patterns](patterns/common-functions.md)
- [Architecture Decisions](decisions/)

## Stats
- Sessions: 0
- Patterns: 0
- Last Update: Never
EOF

# Create compliance rules template
cat > .claude/memory/compliance-rules.yaml << 'EOF'
rules:
  file_size_limit:
    max_lines: 500
    scan_patterns: ["src/**/*.ts", "src/**/*.tsx"]
EOF

echo "✅ Context preservation system initialized"
```

---

## Expected Outcomes

### Metrics to Track

1. **Context Continuity**
   - Sessions starting with relevant context: >90%
   - Time to context restoration: <30 seconds

2. **Pattern Reuse**
   - Duplicate functions detected: All
   - Pattern reuse rate: >80%

3. **Architecture Compliance**
   - Files exceeding size limits: 0
   - Import violations: 0
   - Decision compliance: >95%

### Success Indicators

- **No more 10 formatCurrency implementations**
- **No 2,392 line God files**
- **Consistent patterns across entire codebase**
- **New sessions start with full context awareness**

---

## Integration with Living Quality Gates

This context preservation system is **foundational** for other Stream work:

- **Stream A (Quality Gates):** Uses pattern detection for compliance
- **Stream B (Enhanced Architecture):** Uses memory for decision tracking
- **Stream C (Testing Integration):** Uses context for test pattern reuse

**The context amnesia problem solved = All other quality improvements become possible.**

---

## Implementation Timeline

### Phase 1: Core Memory (Today)
- Session snapshots
- Basic pattern detection
- Memory directory structure

### Phase 2: Smart Detection (Week 1)
- Advanced duplicate detection
- Architecture drift monitoring
- Pattern library building

### Phase 3: Integration (Week 2)
- /oden:work integration
- Automatic context restoration
- Cross-session learning accumulation

**Ready to begin implementation with other streams coordinating.**