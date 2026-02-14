#!/bin/bash

# ============================================================================
# ODEN FORGE 2.0 - INSTALADOR DIRECTO
# ============================================================================
# Instala directamente desde GitHub sin NPM
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
echo -e "${BLUE}║                    ODEN FORGE 2.0 INSTALLER                  ║${NC}"
echo -e "${BLUE}║            Direct Install from GitHub (No NPM)               ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

TEMP_DIR="/tmp/oden-forge-install-$$"
CLAUDE_DIR="$HOME/.claude"
INSTALL_LOG="$TEMP_DIR/install.log"

# ============================================================================
# CLEANUP FUNCTION
# ============================================================================
cleanup() {
    echo -e "${YELLOW}Cleaning up temporary files...${NC}"
    rm -rf "$TEMP_DIR" 2>/dev/null || true
}
trap cleanup EXIT

# ============================================================================
# CREATE TEMP DIRECTORY
# ============================================================================
mkdir -p "$TEMP_DIR"
echo "Installation log: $INSTALL_LOG" > "$INSTALL_LOG"

# ============================================================================
# DOWNLOAD FROM GITHUB
# ============================================================================
echo -e "${YELLOW}📥 Downloading Oden Forge 2.0 from GitHub...${NC}"

if command -v curl >/dev/null 2>&1; then
    curl -fsSL https://github.com/javikin/oden-forge/archive/main.zip -o "$TEMP_DIR/oden-forge.zip" 2>>"$INSTALL_LOG"
elif command -v wget >/dev/null 2>&1; then
    wget -q https://github.com/javikin/oden-forge/archive/main.zip -O "$TEMP_DIR/oden-forge.zip" 2>>"$INSTALL_LOG"
else
    echo -e "${RED}❌ curl or wget required for download${NC}"
    exit 1
fi

# ============================================================================
# EXTRACT
# ============================================================================
echo -e "${YELLOW}📦 Extracting archive...${NC}"

cd "$TEMP_DIR"
if command -v unzip >/dev/null 2>&1; then
    unzip -q oden-forge.zip 2>>"$INSTALL_LOG"
else
    echo -e "${RED}❌ unzip required for extraction${NC}"
    exit 1
fi

EXTRACTED_DIR="$TEMP_DIR/oden-forge-main"

if [ ! -d "$EXTRACTED_DIR" ]; then
    echo -e "${RED}❌ Extraction failed${NC}"
    exit 1
fi

# ============================================================================
# DETECT AND MIGRATE FROM V1
# ============================================================================
echo -e "${YELLOW}🔍 Checking for previous installations...${NC}"

LEGACY_FOUND=false
LEGACY_PATHS=(
    "$CLAUDE_DIR/commands/pm"
    "$CLAUDE_DIR/commands/ccpm"
    "$CLAUDE_DIR/scripts/pm"
    "$CLAUDE_DIR/scripts/ccpm"
    "$HOME/.ccpm"
)

echo "Legacy paths found:" >> "$INSTALL_LOG"
for path in "${LEGACY_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "  - $path" >> "$INSTALL_LOG"
        LEGACY_FOUND=true
    fi
done

if [ "$LEGACY_FOUND" = true ]; then
    echo -e "${YELLOW}⚠️  Found legacy Oden Forge v1 or CCPM installations${NC}"
    echo -e "${YELLOW}Would you like to clean them up? (y/N)${NC}"
    read -r CLEANUP_LEGACY

    if [[ "$CLEANUP_LEGACY" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🧹 Cleaning legacy installations...${NC}"

        for path in "${LEGACY_PATHS[@]}"; do
            if [ -d "$path" ]; then
                echo "Removing: $path" >> "$INSTALL_LOG"
                rm -rf "$path" 2>>"$INSTALL_LOG" || true
                echo -e "${GREEN}   ✅ Removed $(basename "$path")${NC}"
            fi
        done
    fi
fi

# ============================================================================
# INSTALL NEW VERSION
# ============================================================================
echo -e "${YELLOW}📝 Installing Oden Forge 2.0...${NC}"

# Create directory structure
mkdir -p "$CLAUDE_DIR"

# Install commands
echo -e "${YELLOW}Installing commands...${NC}"
if [ -d "$EXTRACTED_DIR/.claude/commands/oden" ]; then
    mkdir -p "$CLAUDE_DIR/commands"
    cp -r "$EXTRACTED_DIR/.claude/commands/oden" "$CLAUDE_DIR/commands/"
    COMMAND_COUNT=$(find "$CLAUDE_DIR/commands/oden" -name "*.md" | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ $COMMAND_COUNT commands installed${NC}"
fi

# Install scripts
echo -e "${YELLOW}Installing scripts...${NC}"
if [ -d "$EXTRACTED_DIR/.claude/scripts/oden" ]; then
    mkdir -p "$CLAUDE_DIR/scripts"
    cp -r "$EXTRACTED_DIR/.claude/scripts/oden" "$CLAUDE_DIR/scripts/"
    chmod +x "$CLAUDE_DIR/scripts/oden/"*.sh 2>/dev/null || true
    SCRIPT_COUNT=$(find "$CLAUDE_DIR/scripts/oden" -name "*.sh" | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ $SCRIPT_COUNT scripts installed${NC}"
fi

# Install rules
echo -e "${YELLOW}Installing rules...${NC}"
if [ -d "$EXTRACTED_DIR/.claude/rules" ]; then
    mkdir -p "$CLAUDE_DIR/rules"
    cp -r "$EXTRACTED_DIR/.claude/rules/"* "$CLAUDE_DIR/rules/"
    RULES_COUNT=$(find "$CLAUDE_DIR/rules" -name "*.md" | wc -l | tr -d ' ')
    echo -e "${GREEN}✅ $RULES_COUNT rules installed${NC}"
fi

# Install hooks
if [ -d "$EXTRACTED_DIR/.claude/hooks" ]; then
    mkdir -p "$CLAUDE_DIR/hooks"
    cp -r "$EXTRACTED_DIR/.claude/hooks/"* "$CLAUDE_DIR/hooks/"
    chmod +x "$CLAUDE_DIR/hooks/"*.sh 2>/dev/null || true
    echo -e "${GREEN}✅ Hooks installed${NC}"
fi

# Create working directories
mkdir -p "$CLAUDE_DIR/prds"
mkdir -p "$CLAUDE_DIR/epics"
touch "$CLAUDE_DIR/prds/.gitkeep" 2>/dev/null || true
touch "$CLAUDE_DIR/epics/.gitkeep" 2>/dev/null || true

# ============================================================================
# INSTALL NODE.JS BINARIES (OPTIONAL)
# ============================================================================
echo -e "${YELLOW}📦 Installing CLI tools...${NC}"

if command -v node >/dev/null 2>&1 && command -v npm >/dev/null 2>&1; then
    echo -e "${YELLOW}Installing Node.js dependencies...${NC}"
    cd "$EXTRACTED_DIR"
    npm install --production --silent 2>>"$INSTALL_LOG" || {
        echo -e "${YELLOW}⚠️  NPM install failed, CLI tools won't be available${NC}"
    }

    # Create global symlinks if npm install succeeded
    if [ -d "$EXTRACTED_DIR/node_modules" ]; then
        mkdir -p "$HOME/.local/bin" 2>/dev/null || true
        if [ -w "$HOME/.local/bin" ]; then
            ln -sf "$EXTRACTED_DIR/bin/oden-forge.js" "$HOME/.local/bin/oden-forge" 2>/dev/null || true
            echo -e "${GREEN}✅ CLI tools available: oden-forge${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Node.js not found, skipping CLI tools${NC}"
    echo -e "${GRAY}   CLI tools require Node.js 16+${NC}"
fi

# ============================================================================
# SUCCESS MESSAGE
# ============================================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  INSTALLATION COMPLETED                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📍 LOCATION:${NC} $CLAUDE_DIR"
echo -e "${BLUE}📝 COMMANDS:${NC} /oden:* (19 available)"
echo -e "${BLUE}📊 LOG:${NC} $INSTALL_LOG"
echo ""
echo -e "${BLUE}🚀 QUICK START:${NC}"
echo -e "${WHITE}   1. Open Claude Code in your project${NC}"
echo -e "${WHITE}   2. Run: /oden:init${NC}"
echo -e "${WHITE}   3. Follow the wizard${NC}"
echo ""
if command -v node >/dev/null 2>&1; then
    echo -e "${BLUE}🔧 CLI TOOLS:${NC}"
    echo -e "${WHITE}   oden-forge status    # Check installation${NC}"
    echo -e "${WHITE}   oden-forge migrate   # Migrate from v1${NC}"
    echo ""
fi
echo -e "${BLUE}📚 HELP:${NC} /oden:help"
echo -e "${BLUE}📖 DOCS:${NC} https://javikin.github.io/oden-forge"
echo ""