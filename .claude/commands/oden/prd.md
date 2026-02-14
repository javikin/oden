---
allowed-tools: Bash, Read, Write, LS
description: Crear PRD con brainstorming inteligente (nativo, sin CCPM)
---

# PRD - Product Requirements Document

Crea un PRD completo con brainstorming inteligente y contexto del proyecto.

## Usage
```
/oden:prd <feature_name>
```

## Preflight

Silently validate:

1. **Feature name**: Must be kebab-case (lowercase, numbers, hyphens, starts with letter).
   - If invalid: "Feature name must be kebab-case. Examples: user-auth, payment-v2"

2. **Existing PRD**: Check `.claude/prds/$ARGUMENTS.md`
   - If exists, ask to overwrite

3. **Directory**: Create `.claude/prds/` if needed

## Context Gathering

Before brainstorming, silently scan for project context:

1. **Technical context** (if available):
   - Read `docs/reference/technical-decisions.md` for stack/architecture
   - Read `docs/reference/competitive-analysis.md` for market context
   - Read any existing module specs in `docs/reference/modules/`

2. **Existing PRDs**: Scan `.claude/prds/` for related features
   - Identify potential overlaps or dependencies

3. **Project CLAUDE.md**: Read for project conventions

This context informs smarter questions and better PRD quality.

## Brainstorming Session

You are a product manager creating a PRD for: **$ARGUMENTS**

### Smart Questions
Ask 3-5 focused questions based on project context. Adapt questions to what you already know:

- If technical-decisions.md exists: Skip stack questions, focus on feature-specific concerns
- If competitive-analysis exists: Reference competitors in questions
- If related PRDs exist: Ask about integration/overlap

**Question areas:**
- Problem: What specific user pain does this solve?
- Users: Who benefits most? (reference existing personas if available)
- Scope: What's MVP vs full vision?
- Constraints: Timeline, budget, technical limitations?
- Success: How do we measure this worked?

### PRD Creation

After gathering answers, create the PRD.

#### File: `.claude/prds/$ARGUMENTS.md`

```markdown
---
name: $ARGUMENTS
description: [One-line summary]
status: backlog
created: [Real datetime from: date -u +"%Y-%m-%dT%H:%M:%SZ"]
---

# PRD: $ARGUMENTS

## Executive Summary
[Value proposition and brief overview]

## Problem Statement
[What problem, why now, evidence/data]

## User Stories
[Personas, journeys, acceptance criteria per story]

## Requirements

### Functional Requirements
[Core features with clear acceptance criteria]

### Non-Functional Requirements
[Performance, security, scalability, accessibility]

## Success Criteria
[Measurable KPIs and metrics]

## Constraints & Assumptions
[Technical, timeline, resource limitations]

## Out of Scope
[What we explicitly won't build]

## Dependencies
[External and internal dependencies]
```

## Quality Checks

Before saving, verify:
- All sections complete (no placeholders)
- User stories have acceptance criteria
- Success criteria are measurable
- Out of scope is explicit

## Output

```
PRD created: .claude/prds/$ARGUMENTS.md

Summary:
  - [problem in one sentence]
  - [number] user stories
  - [number] functional requirements
  - [key constraint]

Next: /oden:epic $ARGUMENTS
```

## Important

- Get REAL datetime: `date -u +"%Y-%m-%dT%H:%M:%SZ"`
- Never use placeholder dates
- Leverage existing project context for smarter brainstorming
- Keep brainstorming focused (3-5 questions, not 10+)
