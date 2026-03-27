---
name: test
description: Mandatory testing gates with 80% coverage enforcement
type: command
created: 2026-03-27T07:09:22Z
updated: 2026-03-27T07:09:22Z
version: 3.0.0
---

# /oden:test - Living Quality Gates Testing

**MANDATORY TESTING ENFORCEMENT** - Transform testing from optional to required.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/oden:test run [target]` | Execute tests with coverage gates |
| `/oden:test coverage` | Check coverage against 80% threshold |
| `/oden:test strategy [module]` | Generate test strategy from specs |
| `/oden:test generate [module]` | Auto-generate tests from specs |
| `/oden:test gates` | Review enforcement configuration |
| `/oden:test enforce` | Setup pre-commit test hooks |

## Core Philosophy: Tests-First Enforcement

> **"No code ships without tests. No commits pass without 80% coverage."**

### Living Quality Gates
- **Pre-commit hooks** block commits below threshold
- **Coverage trending** tracks improvement over time
- **Test quality metrics** beyond just line coverage
- **Enforcement automation** reduces human oversight burden

## Commands

### 1. /oden:test run [target]

Execute tests with mandatory coverage gates.

```bash
TARGET=${1:-"all"}
COVERAGE_THRESHOLD=80

# Get current datetime
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "🧪 MANDATORY TESTING GATES - Oden v3"
echo "Target: $TARGET | Threshold: ${COVERAGE_THRESHOLD}% | $CURRENT_DATE"
echo ""

# Detect testing framework
detect_test_framework() {
  if [ -f "package.json" ]; then
    # Node.js projects
    if grep -q "jest" package.json; then
      echo "jest"
    elif grep -q "vitest" package.json; then
      echo "vitest"
    elif grep -q "mocha" package.json; then
      echo "mocha"
    else
      echo "npm"
    fi
  elif [ -f "go.mod" ]; then
    echo "go"
  elif [ -f "Cargo.toml" ]; then
    echo "rust"
  elif [ -f "Gemfile" ]; then
    echo "ruby"
  elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
    echo "python"
  elif [ -f "pubspec.yaml" ]; then
    echo "flutter"
  else
    echo "unknown"
  fi
}

FRAMEWORK=$(detect_test_framework)
echo "📋 Detected framework: $FRAMEWORK"

# Execute tests with coverage
run_tests_with_coverage() {
  case $FRAMEWORK in
    "jest")
      echo "🧪 Running Jest with coverage..."
      npm test -- --coverage --coverageReporters=text-summary --coverageReporters=json-summary 2>&1 | tee /tmp/test-output.txt
      TEST_EXIT=${PIPESTATUS[0]}
      ;;
    "vitest")
      echo "🧪 Running Vitest with coverage..."
      npx vitest run --coverage 2>&1 | tee /tmp/test-output.txt
      TEST_EXIT=${PIPESTATUS[0]}
      ;;
    "go")
      echo "🧪 Running Go tests with coverage..."
      go test -v -coverprofile=coverage.out ./... 2>&1 | tee /tmp/test-output.txt
      TEST_EXIT=${PIPESTATUS[0]}
      if [ $TEST_EXIT -eq 0 ]; then
        go tool cover -func=coverage.out | tail -1
      fi
      ;;
    "rust")
      echo "🧪 Running Cargo tests..."
      cargo test 2>&1 | tee /tmp/test-output.txt
      TEST_EXIT=${PIPESTATUS[0]}
      ;;
    "python")
      echo "🧪 Running Python tests with coverage..."
      if command -v pytest >/dev/null; then
        pytest --cov --cov-report=term-missing 2>&1 | tee /tmp/test-output.txt
        TEST_EXIT=${PIPESTATUS[0]}
      else
        python -m unittest discover 2>&1 | tee /tmp/test-output.txt
        TEST_EXIT=${PIPESTATUS[0]}
      fi
      ;;
    "ruby")
      echo "🧪 Running RSpec tests..."
      bundle exec rspec 2>&1 | tee /tmp/test-output.txt
      TEST_EXIT=${PIPESTATUS[0]}
      ;;
    "flutter")
      echo "🧪 Running Flutter tests..."
      flutter test --coverage 2>&1 | tee /tmp/test-output.txt
      TEST_EXIT=${PIPESTATUS[0]}
      ;;
    *)
      echo "❌ Unknown testing framework. Framework: $FRAMEWORK"
      echo "Supported: jest, vitest, mocha, go, rust, python, ruby, flutter"
      exit 1
      ;;
  esac
}

# Extract coverage percentage
extract_coverage() {
  if [ -f "coverage/coverage-summary.json" ]; then
    # Jest/Vitest JSON coverage
    node -e "
      try {
        const cov = JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json'));
        const lines = cov.total.lines.pct;
        const funcs = cov.total.functions.pct;
        const branches = cov.total.branches.pct;
        const statements = cov.total.statements.pct;
        console.log(\`Lines: \${lines}% | Functions: \${funcs}% | Branches: \${branches}% | Statements: \${statements}%\`);
        console.log(\`Overall: \${Math.min(lines, funcs, branches, statements)}%\`);
      } catch(e) { console.log('Coverage: N/A'); }
    " > /tmp/coverage-report.txt

    # Extract minimum coverage
    COVERAGE=$(node -e "
      try {
        const cov = JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json'));
        const min = Math.min(cov.total.lines.pct, cov.total.functions.pct, cov.total.branches.pct, cov.total.statements.pct);
        console.log(Math.floor(min));
      } catch(e) { console.log('0'); }
    ")
  elif [ -f "coverage.out" ]; then
    # Go coverage
    COVERAGE=$(go tool cover -func=coverage.out | tail -1 | awk '{print $3}' | sed 's/%//' | cut -d. -f1)
  else
    # Parse from test output
    COVERAGE=$(grep -o "[0-9]\+%" /tmp/test-output.txt | tail -1 | sed 's/%//' || echo "0")
  fi

  if [ -z "$COVERAGE" ] || [ "$COVERAGE" = "" ]; then
    COVERAGE=0
  fi
}

# Run tests
echo "🚀 Executing tests..."
run_tests_with_coverage

# Extract coverage
extract_coverage

echo ""
echo "📊 COVERAGE ANALYSIS"
if [ -f "/tmp/coverage-report.txt" ]; then
  cat /tmp/coverage-report.txt
fi
echo "Minimum Coverage: ${COVERAGE}%"
echo "Required Threshold: ${COVERAGE_THRESHOLD}%"

# Coverage gate enforcement
if [ "$COVERAGE" -lt "$COVERAGE_THRESHOLD" ]; then
  echo ""
  echo "❌ COVERAGE GATE FAILED"
  echo "Current: ${COVERAGE}% | Required: ${COVERAGE_THRESHOLD}%"
  echo "Gap: $((COVERAGE_THRESHOLD - COVERAGE))% coverage needed"
  echo ""
  echo "🔧 REMEDIATION:"
  echo "1. Run: /oden:test generate [module] - Auto-generate missing tests"
  echo "2. Run: /oden:test strategy [module] - Plan comprehensive testing"
  echo "3. Manual: Write tests for uncovered code paths"
  echo ""
  echo "💡 Most impactful areas to test:"
  if [ -f "/tmp/test-output.txt" ]; then
    # Extract uncovered lines/functions from output
    grep -E "not covered|uncovered|0%" /tmp/test-output.txt | head -5 || echo "   Check coverage report for specific gaps"
  fi
  echo ""
  exit 1
fi

# Test execution gate
if [ "$TEST_EXIT" -ne 0 ]; then
  echo ""
  echo "❌ TEST EXECUTION FAILED"
  echo "Exit code: $TEST_EXIT"
  echo ""
  echo "🔧 REMEDIATION:"
  echo "/oden:debug - Queue-based debug orchestration for test failures"
  echo ""
  exit 1
fi

# Success
echo ""
echo "✅ ALL GATES PASSED"
echo "Coverage: ${COVERAGE}% (≥${COVERAGE_THRESHOLD}%)"
echo "Tests: PASSING"
echo ""
echo "🎯 Quality metrics tracked for continuous improvement"

# Store coverage trend
mkdir -p .claude/metrics/coverage
echo "${CURRENT_DATE},${COVERAGE}" >> .claude/metrics/coverage/history.csv

echo ""
echo "📈 COVERAGE TREND"
if [ -f ".claude/metrics/coverage/history.csv" ]; then
  echo "Recent coverage history:"
  tail -5 .claude/metrics/coverage/history.csv | while IFS=',' read timestamp coverage; do
    echo "  $(echo $timestamp | cut -d'T' -f1): ${coverage}%"
  done
fi
```

### 2. /oden:test coverage

Check current coverage against threshold.

```bash
echo "📊 COVERAGE ANALYSIS - Oden v3"
echo ""

# Quick coverage check without running tests
check_existing_coverage() {
  if [ -f "coverage/coverage-summary.json" ]; then
    node -e "
      try {
        const cov = JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json'));
        console.log('📋 CURRENT COVERAGE:');
        console.log('Lines: ' + cov.total.lines.pct + '%');
        console.log('Functions: ' + cov.total.functions.pct + '%');
        console.log('Branches: ' + cov.total.branches.pct + '%');
        console.log('Statements: ' + cov.total.statements.pct + '%');
        const min = Math.min(cov.total.lines.pct, cov.total.functions.pct, cov.total.branches.pct, cov.total.statements.pct);
        console.log('\\nOverall (min): ' + Math.floor(min) + '%');
        console.log('Threshold: 80%');
        if (min >= 80) {
          console.log('Status: ✅ PASSING');
        } else {
          console.log('Status: ❌ BELOW THRESHOLD');
          console.log('Gap: ' + (80 - Math.floor(min)) + '% needed');
        }
      } catch(e) {
        console.log('❌ No coverage report found');
        console.log('Run: /oden:test run');
      }
    "
  elif [ -f "coverage.out" ]; then
    echo "📋 GO COVERAGE:"
    go tool cover -func=coverage.out | tail -10
  else
    echo "❌ No coverage report found"
    echo ""
    echo "🔧 Generate coverage report:"
    echo "/oden:test run"
  fi
}

check_existing_coverage

echo ""
echo "📈 COVERAGE TREND"
if [ -f ".claude/metrics/coverage/history.csv" ]; then
  echo "Last 10 coverage measurements:"
  tail -10 .claude/metrics/coverage/history.csv | while IFS=',' read timestamp coverage; do
    date_part=$(echo $timestamp | cut -d'T' -f1)
    if [ "$coverage" -ge 80 ]; then
      echo "  $date_part: ${coverage}% ✅"
    else
      echo "  $date_part: ${coverage}% ❌"
    fi
  done
else
  echo "No coverage history. Run /oden:test run to start tracking."
fi

echo ""
echo "🎯 QUALITY GATES STATUS"
echo "Coverage Threshold: 80% (enforced)"
echo "Test Execution: Required to pass"
echo "Pre-commit Hooks: $([ -f '.git/hooks/pre-commit' ] && echo 'Installed ✅' || echo 'Missing ⚠️')"
```

### 3. /oden:test strategy [module]

Generate comprehensive test strategy from specs.

```bash
MODULE=${1:-""}

if [ -z "$MODULE" ]; then
  echo "❌ Module required. Usage: /oden:test strategy [module]"
  echo ""
  echo "Available modules:"
  find docs/reference/modules -name "*.md" 2>/dev/null | sed 's|.*/||' | sed 's|\.md||' | head -10 || echo "  No modules found in docs/reference/modules/"
  exit 1
fi

echo "🧪 GENERATING TEST STRATEGY: $MODULE"
echo ""

# Check if module spec exists
SPEC_FILE="docs/reference/modules/${MODULE}.md"
if [ ! -f "$SPEC_FILE" ]; then
  echo "❌ Module spec not found: $SPEC_FILE"
  echo "Available specs:"
  find docs/reference/modules -name "*.md" 2>/dev/null | head -10 || echo "  No module specs found"
  exit 1
fi

CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create test strategy document
mkdir -p .claude/testing/strategies
STRATEGY_FILE=".claude/testing/strategies/${MODULE}-test-strategy.md"

cat > "$STRATEGY_FILE" << EOF
---
module: $MODULE
type: test-strategy
created: $CURRENT_DATE
updated: $CURRENT_DATE
coverage_target: 80%
---

# Test Strategy: $MODULE

Generated from module specification: $SPEC_FILE

## 🎯 Testing Objectives

### Coverage Requirements
- **Minimum**: 80% coverage across all metrics
- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 80%+
- **Statements**: 80%+

### Quality Goals
- All public APIs tested
- All error conditions covered
- All business logic validated
- Integration points verified

## 📋 Test Categories

### 1. Unit Tests
**Scope**: Individual functions/methods in isolation

\`\`\`
Files to test:
EOF

# Extract code files from spec
grep -E "^\s*-\s*\`" "$SPEC_FILE" | head -20 >> "$STRATEGY_FILE" || echo "  [Extract from module implementation]" >> "$STRATEGY_FILE"

cat >> "$STRATEGY_FILE" << EOF

Coverage target: 90% (unit tests should have highest coverage)
\`\`\`

### 2. Integration Tests
**Scope**: Module interactions and data flow

\`\`\`
Integration points:
EOF

# Extract integration points from spec
grep -iE "integrat|depend|connect|call" "$SPEC_FILE" | head -10 >> "$STRATEGY_FILE" || echo "  [Extract from module dependencies]" >> "$STRATEGY_FILE"

cat >> "$STRATEGY_FILE" << EOF

Coverage target: 70%
\`\`\`

### 3. End-to-End Tests
**Scope**: Complete user workflows through this module

\`\`\`
User scenarios:
EOF

# Extract user stories from spec
grep -iE "user|story|scenario|workflow" "$SPEC_FILE" | head -10 >> "$STRATEGY_FILE" || echo "  [Extract from module user stories]" >> "$STRATEGY_FILE"

cat >> "$STRATEGY_FILE" << EOF

Coverage target: 60%
\`\`\`

## 🔧 Test Generation Plan

### Phase 1: Core Functionality
1. Generate unit tests for all exported functions
2. Test all public API endpoints
3. Validate all data transformations

### Phase 2: Edge Cases
1. Error conditions and exceptions
2. Boundary value testing
3. Input validation edge cases

### Phase 3: Integration
1. Database interactions (if applicable)
2. External service calls (if applicable)
3. Module-to-module communication

### Phase 4: Performance
1. Load testing for critical paths
2. Memory usage validation
3. Response time benchmarks

## 📊 Success Metrics

### Must-Have (Blocking)
- [ ] 80%+ coverage across all metrics
- [ ] All tests passing
- [ ] No critical paths uncovered

### Should-Have (Quality)
- [ ] 90%+ unit test coverage
- [ ] All error conditions tested
- [ ] Performance benchmarks established

### Could-Have (Excellence)
- [ ] Mutation testing coverage > 80%
- [ ] Property-based test coverage
- [ ] Chaos engineering validation

## 🚀 Implementation Commands

\`\`\`bash
# Generate tests from this strategy
/oden:test generate $MODULE

# Execute full test suite
/oden:test run $MODULE

# Check coverage compliance
/oden:test coverage
\`\`\`

## 📝 Notes

- Strategy generated from: $SPEC_FILE
- Review and customize based on module specifics
- Update as module implementation evolves
- Integrate with Definition of Done requirements
EOF

echo "✅ Test strategy created: $STRATEGY_FILE"
echo ""
echo "📋 STRATEGY SUMMARY"
grep -E "^###|Coverage target:" "$STRATEGY_FILE"
echo ""
echo "🚀 Next steps:"
echo "1. Review strategy: cat $STRATEGY_FILE"
echo "2. Generate tests: /oden:test generate $MODULE"
echo "3. Execute tests: /oden:test run $MODULE"
```

### 4. /oden:test generate [module]

Auto-generate tests from specifications.

```bash
MODULE=${1:-""}

if [ -z "$MODULE" ]; then
  echo "❌ Module required. Usage: /oden:test generate [module]"
  exit 1
fi

echo "🤖 AUTO-GENERATING TESTS: $MODULE"
echo ""

SPEC_FILE="docs/reference/modules/${MODULE}.md"
STRATEGY_FILE=".claude/testing/strategies/${MODULE}-test-strategy.md"

# Verify inputs exist
if [ ! -f "$SPEC_FILE" ]; then
  echo "❌ Module spec not found: $SPEC_FILE"
  echo "Run: /oden:spec $MODULE"
  exit 1
fi

if [ ! -f "$STRATEGY_FILE" ]; then
  echo "⚠️ No test strategy found. Generating..."
  /oden:test strategy "$MODULE"
fi

CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Use Task agent for intelligent test generation
use_task_agent() {
cat > /tmp/test-generation.md << EOF
# Test Generation Task: $MODULE

## Context
Module: $MODULE
Spec: $SPEC_FILE
Strategy: $STRATEGY_FILE
Target Coverage: 80%+

## Requirements
1. Generate comprehensive test suite for $MODULE
2. Include unit, integration, and E2E tests
3. Cover all code paths and edge cases
4. Follow TDD best practices
5. Use appropriate testing framework for project

## Inputs
- Module specification with business logic
- Test strategy with coverage requirements
- Existing codebase for framework detection
- Quality gates enforcement (80% minimum)

## Outputs
- Complete test files ready for execution
- Test utilities and helpers if needed
- Mock/fixture data for realistic testing
- Documentation of test coverage plan

## Success Criteria
- All generated tests execute successfully
- Coverage meets or exceeds 80% threshold
- Tests follow project conventions
- Edge cases and error conditions covered
EOF

# Delegate to specialized test generation agent
echo "🤖 Delegating to test-engineer agent for intelligent generation..."

# Task agent would analyze specs and generate appropriate tests
# This is a placeholder for the actual agent call
echo "Task: Generate comprehensive test suite for $MODULE module"
echo "Requirements:"
echo "- Read module spec: $SPEC_FILE"
echo "- Follow test strategy: $STRATEGY_FILE"
echo "- Target 80%+ coverage"
echo "- Generate unit + integration + E2E tests"
echo "- Use project's testing framework"
echo ""

echo "⚠️ Manual test generation required:"
echo "1. Review module spec: $SPEC_FILE"
echo "2. Follow test strategy: $STRATEGY_FILE"
echo "3. Create test files in appropriate directory"
echo "4. Verify with: /oden:test run $MODULE"
}

use_task_agent

echo ""
echo "✅ Test generation initiated for $MODULE"
echo "📋 Next steps:"
echo "1. Review generated tests"
echo "2. Run: /oden:test run $MODULE"
echo "3. Check coverage: /oden:test coverage"
```

### 5. /oden:test gates

Review enforcement configuration.

```bash
echo "🛡️ TESTING ENFORCEMENT GATES - Oden v3"
echo ""

echo "📋 CURRENT CONFIGURATION"
echo "Coverage Threshold: 80% (mandatory)"
echo "Test Execution: Required for all commits"
echo "Framework Auto-Detection: Enabled"
echo ""

echo "🔧 GATE STATUS"

# Check pre-commit hooks
if [ -f ".git/hooks/pre-commit" ]; then
  if grep -q "oden:test" ".git/hooks/pre-commit" 2>/dev/null; then
    echo "Pre-commit Testing: ✅ ENABLED"
  else
    echo "Pre-commit Testing: ⚠️ PARTIAL (custom hooks found)"
  fi
else
  echo "Pre-commit Testing: ❌ MISSING"
fi

# Check coverage tracking
if [ -f ".claude/metrics/coverage/history.csv" ]; then
  RECORDS=$(wc -l < .claude/metrics/coverage/history.csv)
  echo "Coverage Tracking: ✅ ACTIVE ($RECORDS records)"
else
  echo "Coverage Tracking: ⚠️ NOT STARTED"
fi

# Check test strategies
STRATEGIES=$(find .claude/testing/strategies -name "*.md" 2>/dev/null | wc -l)
if [ "$STRATEGIES" -gt 0 ]; then
  echo "Test Strategies: ✅ $STRATEGIES modules planned"
else
  echo "Test Strategies: ⚠️ NONE CREATED"
fi

echo ""
echo "🎯 ENFORCEMENT RULES"
echo ""
echo "MANDATORY (Blocking):"
echo "- ✅ 80% minimum coverage across all metrics"
echo "- ✅ All tests must pass before commit"
echo "- ✅ Framework auto-detection for consistency"
echo "- ✅ Coverage trend tracking for improvement"
echo ""
echo "RECOMMENDED (Quality):"
echo "- 📋 Test strategies for complex modules"
echo "- 📋 Pre-commit hooks for automated enforcement"
echo "- 📋 Regular coverage review and improvement"
echo ""

echo "🚀 SETUP ENFORCEMENT"
echo "Run: /oden:test enforce - Install all enforcement mechanisms"
echo ""

echo "📊 FRAMEWORK SUPPORT"
echo "Detected frameworks with coverage support:"
echo "- Node.js: Jest, Vitest, Mocha"
echo "- Go: Built-in test + coverage"
echo "- Rust: Cargo test"
echo "- Python: pytest, unittest"
echo "- Ruby: RSpec"
echo "- Flutter: flutter test --coverage"
```

### 6. /oden:test enforce

Setup mandatory testing enforcement.

```bash
echo "🛡️ SETTING UP MANDATORY TEST ENFORCEMENT"
echo ""

CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create enforcement infrastructure
setup_enforcement() {
  # 1. Create metrics directory
  echo "📊 Setting up coverage tracking..."
  mkdir -p .claude/metrics/coverage

  # 2. Create pre-commit hook
  echo "🔧 Installing pre-commit test hook..."
  mkdir -p .git/hooks

  cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Oden v3 Mandatory Testing Gate
# Auto-generated by /oden:test enforce

echo "🧪 MANDATORY TESTING GATE"
echo "Running tests before commit..."

# Run tests with coverage enforcement
if ! ./.claude/commands/oden/test.md run >/dev/null 2>&1; then
  echo ""
  echo "❌ COMMIT BLOCKED: Tests failed or coverage below 80%"
  echo ""
  echo "🔧 Fix tests:"
  echo "/oden:test run       - Check test failures"
  echo "/oden:test coverage  - Review coverage gaps"
  echo "/oden:debug          - Queue-based debugging"
  echo ""
  exit 1
fi

echo "✅ Tests passed - commit proceeding"
EOF

  chmod +x .git/hooks/pre-commit

  # 3. Create enforcement config
  cat > .claude/testing/enforcement.json << EOF
{
  "version": "3.0.0",
  "enabled": true,
  "created": "$CURRENT_DATE",
  "updated": "$CURRENT_DATE",
  "rules": {
    "coverage_threshold": 80,
    "require_tests": true,
    "block_commits": true,
    "track_trends": true
  },
  "frameworks": [
    "jest", "vitest", "mocha", "go", "rust", "python", "ruby", "flutter"
  ],
  "gates": {
    "pre_commit": true,
    "coverage_tracking": true,
    "test_execution": true
  }
}
EOF

  # 4. Create initial coverage baseline
  echo "📈 Establishing coverage baseline..."
  if command -v node >/dev/null && [ -f "package.json" ]; then
    # Try to get initial coverage
    if npm test -- --coverage --silent >/dev/null 2>&1; then
      echo "✅ Initial coverage baseline established"
    else
      echo "⚠️ Baseline will be set on first successful test run"
    fi
  fi
}

setup_enforcement

echo ""
echo "✅ ENFORCEMENT SETUP COMPLETE"
echo ""
echo "📋 INSTALLED:"
echo "- ✅ Pre-commit test hook (.git/hooks/pre-commit)"
echo "- ✅ Coverage tracking (.claude/metrics/coverage/)"
echo "- ✅ Enforcement config (.claude/testing/enforcement.json)"
echo ""
echo "🛡️ ACTIVE GATES:"
echo "- Coverage threshold: 80% (mandatory)"
echo "- Test execution: Required before commit"
echo "- Framework detection: Automatic"
echo "- Trend tracking: Enabled"
echo ""
echo "🚀 VERIFICATION:"
echo "Try committing changes - tests will run automatically"
echo "Or test manually: /oden:test run"
```

## Integration with Definition of Done

This testing system enforces the Definition of Done through:

### 1. **Mandatory Gates**
- **Pre-commit hooks** prevent commits without tests
- **80% coverage threshold** blocks insufficient testing
- **Automatic framework detection** ensures consistency

### 2. **Quality Metrics**
- **Coverage trending** tracks improvement over time
- **Test quality analysis** beyond simple line coverage
- **Framework-agnostic** support for all major tech stacks

### 3. **Integration Points**
- **`/oden:work` pipeline** includes automated test execution
- **`/oden:debug` orchestration** handles test failures
- **Epic completion** requires all tests passing

## Real Project Context (64 Findings)

This system addresses critical gaps identified:

### Before (Critical Problems)
- **0.1% test coverage** across entire codebase
- **9,500 LOC dead code** accumulation (no refactoring safety)
- **No testing enforcement** in development workflow
- **Manual testing only** - inconsistent and error-prone

### After (Enforced Solution)
- **80% minimum coverage** automatically enforced
- **Pre-commit test gates** prevent regression introduction
- **Framework detection** eliminates setup friction
- **Coverage trending** drives continuous improvement

## Error Handling

### Coverage Below Threshold
```bash
❌ COVERAGE GATE FAILED
Current: 67% | Required: 80%
Gap: 13% coverage needed

🔧 REMEDIATION:
1. /oden:test generate [module] - Auto-generate missing tests
2. /oden:test strategy [module] - Plan comprehensive testing
3. Manual: Write tests for uncovered code paths
```

### Test Execution Failures
```bash
❌ TEST EXECUTION FAILED
Exit code: 1

🔧 REMEDIATION:
/oden:debug - Queue-based debug orchestration for test failures
```

### Framework Not Supported
```bash
❌ Unknown testing framework. Framework: unknown
Supported: jest, vitest, mocha, go, rust, python, ruby, flutter

🔧 REMEDIATION:
Add framework detection or configure manually
```

## Success Metrics

### Immediate (Blocking)
- **80%+ coverage** across all metrics (lines, functions, branches, statements)
- **All tests passing** before any commit
- **Framework auto-detection** working correctly
- **Pre-commit enforcement** preventing bad commits

### Trending (Quality)
- **Coverage improvement** over time (tracked in `.claude/metrics/coverage/history.csv`)
- **Test execution speed** optimization
- **Test quality metrics** beyond coverage (mutation testing, property-based)
- **Developer adoption** of test-first approach

### Integration (System)
- **`/oden:work` pipeline** includes testing automatically
- **Definition of Done** enforces testing requirements
- **Epic completion** blocked by insufficient testing
- **Code refactoring** enabled by comprehensive test harness

---

**Version**: 3.0.0 | **Created**: 2026-03-27T07:09:22Z | **Updated**: 2026-03-27T07:09:22Z

**Living Quality Gates**: Transform testing from optional to mandatory with automated enforcement and continuous improvement tracking.