---
created: 2026-03-27T07:09:47Z
updated: 2026-03-27T07:09:47Z
---

# Pattern Library

**Automated duplicate detection and pattern reuse for consistent codebase**

## Purpose

Solve the "10 implementations of formatCurrency" problem by:

1. **Detecting duplicates** automatically across the codebase
2. **Cataloguing reusable patterns** for consistent implementation
3. **Suggesting existing solutions** before writing new code
4. **Maintaining canonical implementations** for common functionality

## Pattern Categories

### 📁 Common Functions (`common-functions.md`)
Utility functions used throughout the application
- Currency formatting
- Date/time helpers
- String manipulation
- Number formatting
- Validation functions

### 🎨 UI Patterns (`ui-patterns.md`)
Reusable UI component patterns
- Button variants and states
- Modal patterns and animations
- Form layouts and validation
- Loading states and skeletons
- Error boundaries and fallbacks

### 🌐 API Patterns (`api-patterns.md`)
Consistent API interaction patterns
- Fetch wrappers and error handling
- Request/response typing
- Cache management
- Optimistic updates
- Loading states

### 🗄️ State Patterns (`state-patterns.md`)
State management patterns
- Store structure and organization
- Action creators and reducers
- Selectors and computed values
- Async state handling
- Local vs global state decisions

## Pattern Detection Process

### 1. Automated Scanning
```bash
/oden:context detect
```
- Scans all source files for function definitions
- Compares function signatures and implementations
- Identifies similar patterns using AST analysis
- Generates duplicate report with suggestions

### 2. Pattern Analysis
- Groups similar functions by purpose (format*, is*, get*, etc.)
- Analyzes parameter signatures and return types
- Detects implementation variations
- Suggests canonical version

### 3. Consolidation Recommendations
- Identifies the best implementation to keep
- Provides refactoring steps for duplicates
- Suggests import paths for reuse
- Updates pattern library with new canonical versions

## Pattern Entry Format

Each pattern follows this structure:

```markdown
## Pattern: functionName

### Purpose
{What this pattern does and when to use it}

### Canonical Implementation
{The recommended implementation to use}

### Usage Examples
{How to import and use the pattern}

### Alternative Implementations Found
{Other variations detected in the codebase}

### Migration Steps
{How to replace duplicates with canonical version}

### Test Coverage
{Associated test patterns}
```

## Current Status

- **Patterns catalogued:** 0
- **Duplicates detected:** 0
- **Last scan:** Never
- **Coverage:** 0%

## Quick Actions

```bash
# Scan for patterns and duplicates
/oden:context detect

# View specific pattern category
cat .claude/memory/patterns/common-functions.md

# Add new pattern manually
/oden:context memory add pattern "formatCurrency implementation"

# Check compliance with established patterns
/oden:context drift
```

## Integration with Development Workflow

### Before Writing New Code
1. **Check existing patterns:** Search pattern library for similar functionality
2. **Use canonical implementation:** Import existing pattern if available
3. **Extend carefully:** If customization needed, extend canonical version

### During Code Review
1. **Pattern compliance:** Verify new code follows established patterns
2. **Duplicate detection:** Check for reimplementation of existing functionality
3. **Library updates:** Add new reusable patterns to library

### After Implementation
1. **Pattern extraction:** Identify reusable patterns in new code
2. **Library update:** Add valuable patterns for future reuse
3. **Cleanup:** Remove or consolidate any duplicates found

## Success Metrics

### Target Goals
- 🎯 **Zero functional duplicates:** All common functions have single canonical implementation
- 🎯 **Pattern reuse rate:** >80% of new implementations use existing patterns
- 🎯 **Discovery time:** <30 seconds to find existing implementation
- 🎯 **Consistency score:** >95% adherence to established patterns

### Expected Outcomes
- **Reduced code duplication:** From 10+ formatCurrency to 1 canonical
- **Faster development:** Reuse instead of rewrite
- **Consistent UX:** Same patterns = same behavior
- **Easier maintenance:** Changes in one place update everywhere

---

*Pattern library initialized: 2026-03-27T07:09:47Z*
*Ready for first pattern detection scan*