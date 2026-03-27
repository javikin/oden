#!/bin/bash
# Context Preservation Utility Script
# Created: 2026-03-27T07:09:47Z
# Purpose: Implement context preservation commands

set -e

# Configuration
MEMORY_DIR=".claude/memory"
SESSIONS_DIR="$MEMORY_DIR/sessions"
PATTERNS_DIR="$MEMORY_DIR/patterns"
DECISIONS_DIR="$MEMORY_DIR/decisions"
KNOWLEDGE_DIR="$MEMORY_DIR/knowledge"

# Ensure memory directories exist
ensure_memory_structure() {
    mkdir -p "$SESSIONS_DIR" "$PATTERNS_DIR" "$DECISIONS_DIR" "$KNOWLEDGE_DIR"
}

# Get current timestamp in ISO format
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%SZ"
}

# Create session snapshot
create_snapshot() {
    local description="${1:-"Work session snapshot"}"
    local timestamp=$(get_timestamp)
    local branch=$(git branch --show-current 2>/dev/null || echo "main")
    local session_file="$SESSIONS_DIR/$(echo $timestamp | sed 's/[:-]//g' | sed 's/T.*//g')-snapshot.md"

    echo "📸 Creating context snapshot..."

    # Get git status info
    local changed_files=$(git diff --name-only 2>/dev/null | head -10 | tr '\n' ' ' || echo "none")
    local staged_files=$(git diff --staged --name-only 2>/dev/null | head -5 | tr '\n' ' ' || echo "none")
    local recent_commit=$(git log -1 --oneline 2>/dev/null || echo "No commits")
    local git_status=$(git status --porcelain 2>/dev/null || echo "No changes")

    # Create snapshot file
    cat > "$session_file" << EOF
---
created: $timestamp
session_type: implementation
branch: $branch
status: active
context_size: medium
description: $description
---

# Session Snapshot: $description

## Quick Summary
- **What:** $description
- **Files changed:** $changed_files
- **Files staged:** $staged_files
- **Current state:** Active development

## Context for Next Session

### Recent Activity
$recent_commit

### Current Working State
\`\`\`
$git_status
\`\`\`

### Architectural Decisions Made
$(git log --oneline -3 2>/dev/null | sed 's/^/- /' || echo "- No recent commits")

### Known Issues
- None identified yet

### Next Steps
- Continue current implementation
- Run tests when ready
- Review for pattern compliance

## Files Modified This Session
$(echo "$changed_files" | tr ' ' '\n' | sed 's/^/- /' | grep -v '^- $')

## Patterns Potentially Created
- Check for reusable functions in modified files
- Update pattern library if valuable patterns found

## Session Notes
Add any important context, decisions, or learnings from this session here.

---
*Session captured: $timestamp*
*Next session: Run '/oden:context restore' to load this context*
EOF

    echo "✅ Context snapshot saved: $session_file"
    echo "📝 Description: $description"
    echo "🌿 Branch: $branch"
    echo "📁 Files: $changed_files"
}

# Detect duplicate patterns
detect_patterns() {
    echo "🔍 Scanning for duplicate patterns..."

    local report_file="$PATTERNS_DIR/duplicate-report.md"
    local timestamp=$(get_timestamp)

    # Create report header
    cat > "$report_file" << EOF
---
created: $timestamp
scan_type: duplicate_detection
files_scanned: 0
duplicates_found: 0
---

# Duplicate Pattern Detection Report

**Generated:** $timestamp
**Scan scope:** src/

## Summary
EOF

    # Find source files
    local source_files=$(find src -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null || echo "")

    if [ -z "$source_files" ]; then
        echo "No source files found in src/ directory" >> "$report_file"
        echo "⚠️ No source files found to scan"
        return 0
    fi

    # Count files
    local file_count=$(echo "$source_files" | wc -l)

    # Extract function definitions
    local temp_functions="/tmp/oden-functions-$$.txt"
    echo "$source_files" | xargs grep -n "function\|const.*=.*=>\|export.*function\|export.*const.*=" 2>/dev/null | \
        grep -v "test\|spec" > "$temp_functions" || touch "$temp_functions"

    local total_functions=$(wc -l < "$temp_functions" 2>/dev/null || echo 0)

    # Update summary
    sed -i '' "s/files_scanned: 0/files_scanned: $file_count/" "$report_file"
    echo "- **Files scanned:** $file_count" >> "$report_file"
    echo "- **Functions found:** $total_functions" >> "$report_file"
    echo "" >> "$report_file"

    # Analyze for duplicates (simple name-based detection for now)
    if [ -s "$temp_functions" ]; then
        echo "## Potential Duplicates" >> "$report_file"
        echo "" >> "$report_file"

        # Extract function names and count occurrences
        local duplicates_found=false
        sed 's/.*function \([^(]*\).*/\1/' "$temp_functions" | \
        sed 's/.*const \([^=]*\) *=.*/\1/' | \
        sed 's/.*export.*\(function\|const\) \([^(= ]*\).*/\2/' | \
        sort | uniq -c | sort -nr | while read count name; do
            if [ "$count" -gt 1 ] && [ -n "$name" ]; then
                echo "### 🚨 Potential Duplicate: \`$name\` ($count occurrences)" >> "$report_file"

                # Find specific occurrences
                grep "$name" "$temp_functions" | head -3 | while read line; do
                    echo "- $line" >> "$report_file"
                done
                echo "" >> "$report_file"
                duplicates_found=true
            fi
        done

        if ! $duplicates_found; then
            echo "✅ No obvious duplicates detected!" >> "$report_file"
        fi
    else
        echo "No functions found to analyze" >> "$report_file"
    fi

    # Add recommendations
    cat >> "$report_file" << EOF

## Recommendations

### For Detected Duplicates
1. **Review** each duplicate to confirm they serve the same purpose
2. **Choose** the best implementation as canonical
3. **Refactor** others to use the canonical version
4. **Update** imports throughout codebase

### Prevention
1. **Search existing patterns** before implementing new functions
2. **Use** \`/oden:context detect\` regularly during development
3. **Establish** canonical patterns in pattern library

## Next Steps
1. Review flagged duplicates above
2. Run \`/oden:context patterns\` to see established patterns
3. Consider adding valuable patterns to library

---
*Scan completed: $timestamp*
*Next scan: Re-run after major changes or weekly*
EOF

    # Cleanup
    rm -f "$temp_functions"

    echo "✅ Pattern detection completed"
    echo "📊 Report saved: $report_file"
    echo "📁 Files scanned: $file_count"
    echo "🔍 Functions analyzed: $total_functions"
}

# Check architecture compliance
check_drift() {
    echo "🎯 Checking architecture compliance..."

    local report_file="$DECISIONS_DIR/drift-report.md"
    local timestamp=$(get_timestamp)
    local violations=0

    cat > "$report_file" << EOF
---
created: $timestamp
check_type: architecture_drift
violations_found: 0
compliance_score: 100
---

# Architecture Drift Report

**Generated:** $timestamp
**Rules:** compliance-rules.yaml

## Summary
- **Total violations:** 0
- **Compliance score:** 100%
- **Status:** ✅ All checks passed

## Detailed Analysis

EOF

    # Check file size violations
    echo "### 📏 File Size Check" >> "$report_file"
    local size_violations=0

    find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | while read file; do
        if [ -f "$file" ]; then
            local lines=$(wc -l < "$file")
            if [ "$lines" -gt 500 ]; then
                echo "❌ \`$file\`: $lines lines (limit: 500)" >> "$report_file"
                size_violations=$((size_violations + 1))
                violations=$((violations + 1))
            fi
        fi
    done

    if [ "$size_violations" -eq 0 ]; then
        echo "✅ All files within size limits" >> "$report_file"
    fi

    echo "" >> "$report_file"

    # Check import patterns
    echo "### 📦 Import Pattern Check" >> "$report_file"
    local import_violations=0

    if find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "from 'axios'" 2>/dev/null; then
        echo "❌ Direct axios imports found (use fetch wrapper)" >> "$report_file"
        import_violations=$((import_violations + 1))
        violations=$((violations + 1))
    fi

    if find src -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs grep -l "from '../../../" 2>/dev/null; then
        echo "❌ Deep relative imports found (use absolute imports)" >> "$report_file"
        import_violations=$((import_violations + 1))
        violations=$((violations + 1))
    fi

    if [ "$import_violations" -eq 0 ]; then
        echo "✅ No problematic import patterns detected" >> "$report_file"
    fi

    echo "" >> "$report_file"

    # Calculate compliance score
    local total_checks=2
    local passed_checks=$((total_checks - violations))
    local compliance_score=$((passed_checks * 100 / total_checks))

    # Update summary
    sed -i '' "s/violations_found: 0/violations_found: $violations/" "$report_file"
    sed -i '' "s/compliance_score: 100/compliance_score: $compliance_score/" "$report_file"

    if [ "$violations" -eq 0 ]; then
        sed -i '' "s/Status:.*/Status: ✅ All checks passed/" "$report_file"
        echo "✅ Architecture compliance: 100%"
    else
        sed -i '' "s/Status:.*/Status: ❌ $violations violations found/" "$report_file"
        echo "❌ Architecture violations: $violations"
        echo "📊 Compliance score: $compliance_score%"
    fi

    echo "📊 Report saved: $report_file"
}

# Restore context for new session
restore_context() {
    echo "🧠 Restoring context for new session..."

    # Find most recent session
    local latest_session=$(ls -t "$SESSIONS_DIR"/*.md 2>/dev/null | head -1)

    if [ -z "$latest_session" ]; then
        echo "⚠️ No previous session found"
        echo "💡 Start with: /oden:context snapshot 'session description'"
        return 1
    fi

    echo "📖 Loading context from: $(basename "$latest_session")"
    echo ""

    # Extract key information
    local branch=$(grep "^branch:" "$latest_session" | cut -d: -f2 | tr -d ' ' || echo "unknown")
    local description=$(grep "^description:" "$latest_session" | cut -d: -f2- | tr -d ' ')
    local created=$(grep "^created:" "$latest_session" | cut -d: -f2- | tr -d ' ')

    echo "🌿 **Previous branch:** $branch"
    echo "📝 **Previous work:** $description"
    echo "⏰ **Last session:** $created"
    echo ""

    # Show quick summary
    echo "📋 **Quick Summary:**"
    sed -n '/## Quick Summary/,/## Context for Next Session/p' "$latest_session" | \
        grep -v "^## " | sed 's/^/   /'

    echo ""
    echo "🎯 **Recommended next actions:**"
    echo "   1. Review latest changes: git status"
    echo "   2. Check for patterns: /oden:context detect"
    echo "   3. Verify compliance: /oden:context drift"
    echo "   4. Continue with: /oden:work [epic/issue]"
}

# Show memory statistics
show_memory() {
    echo "📚 Project Memory Statistics"
    echo "═══════════════════════════"
    echo ""

    local sessions=$(ls "$SESSIONS_DIR"/*.md 2>/dev/null | wc -l || echo 0)
    local patterns=$(ls "$PATTERNS_DIR"/*.md 2>/dev/null | wc -l || echo 0)
    local decisions=$(ls "$DECISIONS_DIR"/*.md 2>/dev/null | wc -l || echo 0)
    local knowledge=$(ls "$KNOWLEDGE_DIR"/*.md 2>/dev/null | wc -l || echo 0)

    echo "📊 **Components:**"
    echo "   Sessions recorded: $sessions"
    echo "   Pattern files: $patterns"
    echo "   Decision logs: $decisions"
    echo "   Knowledge docs: $knowledge"
    echo ""

    if [ "$sessions" -gt 0 ]; then
        local latest_session=$(ls -t "$SESSIONS_DIR"/*.md 2>/dev/null | head -1)
        local latest_date=$(basename "$latest_session" | cut -d'-' -f1-3 | sed 's/-//g')
        echo "🕒 **Latest activity:** $latest_date"
    else
        echo "🕒 **Latest activity:** No sessions recorded"
    fi

    echo ""
    echo "💾 **Storage usage:**"
    echo "   Total size: $(du -sh "$MEMORY_DIR" 2>/dev/null | cut -f1 || echo "0B")"
    echo ""

    echo "🎯 **Quick actions:**"
    echo "   Create snapshot: /oden:context snapshot 'description'"
    echo "   Detect patterns: /oden:context detect"
    echo "   Check compliance: /oden:context drift"
    echo "   Restore context: /oden:context restore"
}

# Clean old memory
clean_memory() {
    echo "🧹 Cleaning old memory..."

    # Remove sessions older than 30 days
    find "$SESSIONS_DIR" -name "*.md" -mtime +30 -delete 2>/dev/null || true

    # Remove temporary files
    find "$MEMORY_DIR" -name "*.tmp" -delete 2>/dev/null || true

    echo "✅ Memory cleaned"
    echo "📊 Current usage: $(du -sh "$MEMORY_DIR" 2>/dev/null | cut -f1 || echo "0B")"
}

# Main command dispatcher
main() {
    local command="${1:-help}"
    local description="$2"

    ensure_memory_structure

    case "$command" in
        "snapshot")
            create_snapshot "$description"
            ;;
        "detect")
            detect_patterns
            ;;
        "drift")
            check_drift
            ;;
        "restore")
            restore_context
            ;;
        "memory")
            show_memory
            ;;
        "clean")
            clean_memory
            ;;
        "help")
            echo "Context Preservation System"
            echo ""
            echo "Usage:"
            echo "  $0 snapshot [description]  - Create context snapshot"
            echo "  $0 detect                  - Detect duplicate patterns"
            echo "  $0 drift                   - Check architecture compliance"
            echo "  $0 restore                 - Restore context from last session"
            echo "  $0 memory                  - Show memory statistics"
            echo "  $0 clean                   - Clean old memory files"
            echo ""
            ;;
        *)
            echo "❌ Unknown command: $command"
            echo "💡 Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"