---
allowed-tools: Bash, Read, Write, LS, Task
description: Convertir PRD a Epic tecnico con work streams, criterios de aceptacion y plan de implementacion
---

# Epic - Convert PRD to Technical Epic

Convierte un PRD en un Epic tecnico con enfoque de implementacion, work streams paralelos y criterios de aceptacion.

## Usage
```
/oden:epic <feature_name>
```

## Preflight

Silently validate:

1. **Feature name**: If not provided, show: "Usage: /oden:epic <feature_name>"

2. **PRD exists**: Check `.claude/prds/$ARGUMENTS.md`
   - If not found: "PRD not found. Create it first: /oden:prd $ARGUMENTS"

3. **PRD frontmatter**: Verify has name, description, status, created
   - If invalid: "Invalid PRD. Check: .claude/prds/$ARGUMENTS.md"

4. **Existing epic**: Check `.claude/epics/$ARGUMENTS/epic.md`
   - If exists, ask to overwrite

5. **Directory**: Create `.claude/epics/$ARGUMENTS/` if needed

## Context Gathering

Silently scan for context to produce a better epic:

1. **PRD** (required): Read `.claude/prds/$ARGUMENTS.md`
   - Extract requirements, user stories, constraints, success criteria

2. **Technical context** (if available):
   - Read `docs/reference/technical-decisions.md` for stack, DB schema, architecture
   - Read module specs in `docs/reference/modules/` for related specs

3. **Other epics**: Scan `.claude/epics/` for related work
   - Identify dependencies or shared infrastructure

4. **Codebase structure**: Quick scan of `src/` or main source dirs
   - Understand existing patterns, shared modules, naming conventions
   - Identify code to reuse instead of building from scratch

## Instructions

You are a technical lead converting the PRD into an implementation epic for: **$ARGUMENTS**

### Analysis Steps

1. **Map requirements to technical components**
   - Each functional requirement becomes one or more technical tasks
   - Group by layer: data, backend/API, frontend/UI, infrastructure

2. **Identify architecture decisions**
   - New patterns or technologies needed
   - Integration points with existing system
   - Data model changes (new tables, columns, relations)

3. **Define work streams**
   - Independent streams that can run in parallel
   - Streams that must be sequential
   - Shared dependencies between streams

4. **Estimate complexity**
   - Per task: XS (< 2h), S (2-4h), M (4-8h), L (1-2d), XL (2-3d)
   - Total timeline considering parallelism

### Epic Creation

#### File: `.claude/epics/$ARGUMENTS/epic.md`

```markdown
---
name: $ARGUMENTS
status: backlog
created: [Real datetime from: date -u +"%Y-%m-%dT%H:%M:%SZ"]
updated: [Same datetime]
progress: 0%
prd: .claude/prds/$ARGUMENTS.md
github:
---

# Epic: [Descriptive Title]

## Overview
[2-3 sentences: what we're building, why, and the technical approach]

## Architecture Decisions

### Data Model
[New or modified tables/collections, key relationships, indexes]

### API Design
[New endpoints, request/response contracts, auth requirements]

### Frontend
[New screens/components, state management, user flows]

### Infrastructure
[Deployment, caching, background jobs, external services]

## Work Streams

### Stream A: [Name] (e.g., Data Layer)
**Parallel:** Yes
**Files:** [file patterns this stream touches]

Tasks:
1. [Task description] - [Size: XS/S/M/L/XL]
2. [Task description] - [Size]

### Stream B: [Name] (e.g., API Layer)
**Parallel:** After Stream A tasks 1-2
**Files:** [file patterns]

Tasks:
1. [Task description] - [Size]
2. [Task description] - [Size]

### Stream C: [Name] (e.g., UI Layer)
**Parallel:** After Stream B
**Files:** [file patterns]

Tasks:
1. [Task description] - [Size]
2. [Task description] - [Size]

## Task Summary

| # | Task | Stream | Size | Depends On | Parallel |
|---|------|--------|------|------------|----------|
| 1 | [desc] | A | M | - | Yes |
| 2 | [desc] | A | S | 1 | Yes |
| 3 | [desc] | B | L | 1 | Yes |
| ... | ... | ... | ... | ... | ... |

**Total tasks:** [count]
**Estimated effort:** [sum]
**Critical path:** [longest sequential chain]

## Acceptance Criteria (Technical)

- [ ] All data model changes migrated and tested
- [ ] API endpoints return correct responses with validation
- [ ] UI renders correctly on target devices/browsers
- [ ] Error states handled gracefully
- [ ] Performance within targets ([specific metrics])
- [ ] Tests passing ([coverage target]%)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| [risk] | [H/M/L] | [mitigation] |

## Dependencies

- **Internal:** [other epics, shared modules]
- **External:** [third-party APIs, services, credentials]
```

## Guidelines

### Task Count
- Aim for **5-10 tasks** per epic
- If more than 10 tasks emerge, split into sub-epics
- Each task should be completable in 1-3 days

### Work Streams
- Group tasks by the files/layers they touch
- Streams that touch different files can run in parallel
- Explicitly mark dependencies between streams
- Name streams after the layer or concern (Data, API, UI, Tests)

### Sizing
- Be realistic. Include time for tests and edge cases
- XS: Trivial change, config, rename (< 2h)
- S: Single file change, simple logic (2-4h)
- M: Multiple files, moderate logic, some edge cases (4-8h)
- L: Cross-cutting change, complex logic, new patterns (1-2d)
- XL: Architecture change, new subsystem, significant scope (2-3d)

### Leveraging Existing Code
- Before proposing new abstractions, check if similar patterns exist
- Reference existing utilities, helpers, or shared modules
- Prefer extending existing code over creating new silos

## Quality Checks

Before saving, verify:
- [ ] Every PRD requirement maps to at least one task
- [ ] No orphan tasks (every task traces back to a requirement)
- [ ] Dependencies are logical (no circular references)
- [ ] Parallel streams don't touch the same files
- [ ] Sizes sum to a reasonable total
- [ ] Acceptance criteria are testable

## Output

```
Epic created: .claude/epics/$ARGUMENTS/epic.md

Summary:
  - [total] tasks across [stream_count] work streams
  - Estimated effort: [total]
  - Critical path: [length]
  - [parallel_count] tasks can run in parallel

Next: /oden:tasks $ARGUMENTS
```

## Important

- Get REAL datetime: `date -u +"%Y-%m-%dT%H:%M:%SZ"`
- Never use placeholder dates
- Keep task count to 10 or fewer
- Focus on practical implementation, not theory
- Reference existing code patterns when available


---

## TASKS MODE: /oden:epic tasks [nombre]

Descompone Epic en tasks/issues individuales listos para implementación.

### Features:
- **Análisis inteligente** del Epic existente
- **Descomposición automática** en tasks parallelizables
- **Dependencias detectadas** automáticamente
- **Estimaciones** de complejidad
- **Work streams** optimizados para Teams

### Usage:
```bash
/oden:epic tasks auth        # Tasks para Epic de auth
/oden:epic tasks orders      # Tasks para Epic de orders
```

### Output:
- `.claude/epics/[nombre]/tasks/` directory
- Task files individuales con criterios de aceptación
- Dependency mapping para Teams
- Ready para `/oden:sync`

### Example Output:
```
📋 TASKS GENERATED FOR: auth

✅ 8 tasks created:
├── 001-database-schema.md      (Backend, 2 days)
├── 002-auth-models.md          (Backend, 1 day)  
├── 003-login-api.md            (Backend, 2 days)
├── 004-registration-api.md     (Backend, 2 days)
├── 005-jwt-middleware.md       (Backend, 1 day)
├── 006-login-ui.md             (Frontend, 2 days)
├── 007-registration-ui.md      (Frontend, 2 days)
└── 008-integration-tests.md    (QA, 1 day)

📊 WORK STREAMS:
Stream A (Backend): Tasks 1-5  (8 days)
Stream B (Frontend): Tasks 6-7 (4 days) 
Stream C (QA): Task 8          (1 day)

🔄 DEPENDENCIES:
Tasks 6-7 depend on tasks 1-5
Task 8 depends on all tasks

NEXT: /oden:sync auth  # Push to GitHub Issues
```
