#!/bin/bash

# ============================================================================
# ODEN FORGE - LEGACY CLEANER
# ============================================================================
# Limpia comandos legacy que el migrador no detectó
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  ODEN FORGE LEGACY CLEANER                   ║${NC}"
echo -e "${BLUE}║            Remove old v1 commands from ~/.claude             ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

CLAUDE_DIR="$HOME/.claude/commands/oden"

if [ ! -d "$CLAUDE_DIR" ]; then
    echo -e "${RED}❌ Oden commands directory not found: $CLAUDE_DIR${NC}"
    exit 1
fi

# Lista de comandos legacy que deben ser eliminados
LEGACY_COMMANDS=(
    "analyze.md"
    "blocked.md"
    "clean.md"
    "dev.md"
    "epic-close.md"
    "epic-decompose.md"
    "epic-edit.md"
    "epic-list.md"
    "epic-merge.md"
    "epic-oneshot.md"
    "epic-refresh.md"
    "epic-show.md"
    "epic-start-worktree.md"
    "epic-start.md"
    "epic-status.md"
    "epic-sync.md"
    "import.md"
    "in-progress.md"
    "issue-analyze.md"
    "issue-close.md"
    "issue-edit.md"
    "issue-reopen.md"
    "issue-show.md"
    "issue-start.md"
    "issue-status.md"
    "issue-sync.md"
    "next.md"
    "plan.md"
    "prd-edit.md"
    "prd-list.md"
    "prd-new.md"
    "prd-parse.md"
    "prd-status.md"
    "search.md"
    "standup.md"
    "status.md"
    "test-reference-update.md"
    "validate.md"
)

echo -e "${YELLOW}📋 Checking for legacy commands...${NC}"
echo ""

FOUND_LEGACY=()
for cmd in "${LEGACY_COMMANDS[@]}"; do
    if [ -f "$CLAUDE_DIR/$cmd" ]; then
        FOUND_LEGACY+=("$cmd")
    fi
done

if [ ${#FOUND_LEGACY[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ No legacy commands found - you're clean!${NC}"
    echo ""
    echo -e "${BLUE}Current v2 commands:${NC}"
    ls "$CLAUDE_DIR" | grep -E "\.md$" | sort
    exit 0
fi

echo -e "${YELLOW}Found ${#FOUND_LEGACY[@]} legacy commands to remove:${NC}"
for cmd in "${FOUND_LEGACY[@]}"; do
    echo -e "${RED}   ❌ $cmd${NC}"
done
echo ""

echo -e "${YELLOW}These will be kept (v2 commands):${NC}"
V2_COMMANDS=(
    "architect.md"
    "checklist.md"
    "daily.md"
    "debug.md"
    "epic.md"
    "git.md"
    "help.md"
    "init-agents.md"
    "init-mcp.md"
    "init.md"
    "mcp.md"
    "prd.md"
    "research.md"
    "review.md"
    "spec.md"
    "sync.md"
    "tasks.md"
    "test.md"
    "work.md"
)

for cmd in "${V2_COMMANDS[@]}"; do
    if [ -f "$CLAUDE_DIR/$cmd" ]; then
        echo -e "${GREEN}   ✅ $cmd${NC}"
    fi
done
echo ""

read -p "Continue with cleanup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}❌ Cleanup cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}🧹 Removing legacy commands...${NC}"

REMOVED_COUNT=0
for cmd in "${FOUND_LEGACY[@]}"; do
    if [ -f "$CLAUDE_DIR/$cmd" ]; then
        rm "$CLAUDE_DIR/$cmd"
        echo -e "${GREEN}   ✅ Removed $cmd${NC}"
        ((REMOVED_COUNT++))
    fi
done

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    CLEANUP COMPLETED                         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 RESULTS:${NC}"
echo -e "   Removed: $REMOVED_COUNT legacy commands"
echo -e "   Kept: $(ls "$CLAUDE_DIR" | grep -E "\.md$" | wc -l | tr -d ' ') v2 commands"
echo ""
echo -e "${BLUE}🚀 NEXT STEPS:${NC}"
echo -e "   1. Restart Claude Code"
echo -e "   2. Type /oden and verify you only see v2 commands"
echo -e "   3. Run /oden:help to confirm"
echo ""