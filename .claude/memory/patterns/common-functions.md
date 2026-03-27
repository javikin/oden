---
created: 2026-03-27T07:09:47Z
updated: 2026-03-27T07:09:47Z
category: common-functions
patterns_count: 0
duplicates_detected: 0
---

# Common Function Patterns

**Canonical implementations of frequently used utility functions**

## Purpose

Prevent duplication of common functionality by maintaining single-source-of-truth implementations for:
- Currency and number formatting
- Date/time manipulation
- String utilities
- Validation functions
- Array/object helpers

## Pattern Template

When adding new patterns, follow this format:

```markdown
## Pattern: functionName

### Purpose
{What this function does and when to use it}

### Canonical Implementation
```typescript
// src/utils/category.ts
export const functionName = (params: Type): ReturnType => {
  // Implementation
  return result;
};
```

### Usage Examples
```typescript
import { functionName } from '@/utils/category';

const result = functionName(input);
```

### Test Pattern
```typescript
// src/utils/category.test.ts
describe('functionName', () => {
  it('should handle typical case', () => {
    expect(functionName(input)).toBe(expectedOutput);
  });
});
```

### Alternative Implementations Found
- `src/path/file.ts:line` - {description of difference}
- `src/other/place.tsx:line` - {description}

### Migration Steps
1. Replace all occurrences with canonical import
2. Remove duplicate implementations
3. Update tests if needed
```

---

## Current Patterns

*No patterns catalogued yet. Run `/oden:context detect` to scan for duplicates and start building the library.*

## Common Categories to Watch

### 💰 Currency/Number Formatting
- `formatCurrency(amount, currency?)`
- `formatNumber(value, decimals?)`
- `formatPercent(value, decimals?)`

### 📅 Date/Time Utilities
- `formatDate(date, format?)`
- `formatRelativeTime(date)`
- `isDateInRange(date, start, end)`

### 📝 String Manipulation
- `slugify(text)`
- `capitalize(text)`
- `truncate(text, maxLength)`
- `sanitizeInput(text)`

### ✅ Validation Functions
- `isValidEmail(email)`
- `isValidPhone(phone)`
- `isValidUrl(url)`
- `validateRequired(value)`

### 🔧 Array/Object Helpers
- `groupBy(array, key)`
- `sortBy(array, key)`
- `unique(array)`
- `pick(object, keys)`
- `omit(object, keys)`

### 🎲 Random/ID Generation
- `generateId(prefix?)`
- `randomString(length)`
- `uuid()`

## Next Steps

1. **Scan codebase:** `/oden:context detect` to find existing functions
2. **Identify patterns:** Group similar functions by purpose
3. **Create canonical versions:** Choose best implementation for each pattern
4. **Document usage:** Add examples and test patterns
5. **Refactor duplicates:** Replace with canonical imports

---

*Pattern library ready for population: 2026-03-27T07:09:47Z*
*Run pattern detection to begin cataloguing existing code*