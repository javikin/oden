---
name: landing-page-product-strategy
status: in-progress
created: 2026-03-27T00:00:00Z
updated: 2026-03-27T00:00:00Z
---

# Oden Forge Landing Page -- Product Strategy

## Executive Summary

User feedback across 5 segments reveals a single root cause: **the page explains WHAT Oden Forge does (commands) but never explains WHAT Oden Forge IS**. Every user type left with a different (wrong) mental model. The fix is not cosmetic -- it requires restructuring the information architecture around a clear identity statement, segmented value propositions, and missing trust signals.

---

## 1. Diagnosis: Why the Current Page Fails

### The Identity Crisis

The current hero reads: *"V2 de Oden ya esta aqui"* followed by *"Documentation-First Development revolucionario."*

This tells a returning user about an update but tells a new visitor nothing. There is no answer to the three questions every landing page must answer in 5 seconds:

1. **What is this?** -- No clear category definition
2. **Who is it for?** -- No target audience signal
3. **Why should I care?** -- No outcome-based value proposition

### Feedback Pattern Matrix

| Pain Point | Junior | Senior | Mgr | DevOps | Freelancer | Root Cause |
|---|---|---|---|---|---|---|
| "What IS this?" | X | X | | | X | Missing identity statement |
| Claude Code dependency unclear | X | X | | | | No prerequisite explanation |
| No pricing | | | X | | X | Missing business model info |
| No ROI / outcomes | | | X | X | | Feature-focused, not outcome-focused |
| No architecture / integration details | | X | | X | | Too high-level for technical evaluators |
| Team vs solo confusion | | | X | | X | Single messaging track for all segments |
| Enterprise readiness unknown | | | X | X | | No trust signals (security, compliance) |

### Critical Observation

The page currently has **zero differentiation from generic Claude Code usage**. A senior dev reading this asks: "Why wouldn't I just write my own CLAUDE.md with similar prompts?" The page never answers this question.

---

## 2. Value Proposition Clarity

### Current (Broken) Positioning

> "Documentation-First Development toolkit for Claude Code"

Problems:
- "Documentation-First" sounds like overhead, not value
- "toolkit for Claude Code" positions it as optional add-on
- No outcome mentioned

### Recommended Core Message

**For all segments, the identity statement should be:**

> **Oden Forge is a development methodology engine that runs inside Claude Code.** It replaces ad-hoc AI prompting with a structured pipeline -- from architecture decisions to production deployment -- ensuring every project starts with complete specs, follows a proven workflow, and maintains quality gates throughout.

### Segment-Specific Value Hooks

These are not separate landing pages. They are short "If you are X, here is why this matters" blocks.

| Segment | Value Hook | Key Feature Emphasis |
|---|---|---|
| **Junior Dev** | "Stop guessing what to build next. Oden guides you step by step from idea to production-ready code." | `/oden:init` wizard, guided workflow, built-in best practices |
| **Senior Dev** | "Your Claude Code sessions produce throwaway context. Oden makes them produce persistent, reusable architecture docs and specs that compound across sessions." | Context preservation, `/oden:architect`, integration with existing projects |
| **Engineering Mgr** | "Standardize how your team uses AI-assisted development. Every project follows the same methodology, produces the same artifacts, hits the same quality gates." | Teams orchestration, GitHub sync, measurable outputs (8000+ lines of specs) |
| **DevOps / Platform** | "Oden generates structured artifacts (PRDs, epics, tasks) that sync directly to GitHub Issues. It fits into your existing workflow, not around it." | `/oden:sync`, GitHub integration, git workflow commands |
| **Freelancer** | "Ship professional-grade projects solo. Oden gives one developer the planning discipline of an entire product team." | Full pipeline solo, multi-project support, `/oden:debug` for maintenance |

---

## 3. Information Architecture Restructure

### Current Structure (Problems Annotated)

```
Hero: "V2 is here"                    -- Says nothing to new visitors
Core Philosophy                       -- Abstract, no concrete value
8 Commands                            -- Feature dump, no context
Debug System Highlight                -- Deep feature before basics
Workflow Steps                        -- Visual but no explanation
Metrics                               -- Unverified vanity metrics
Project Types                         -- Good but buried too low
Quick Start                           -- Should be higher
Ecosystem                             -- Fine
```

### Recommended Structure

```
1. HERO: Identity + Outcome
   "Oden Forge -- A development methodology engine for Claude Code"
   Subhead: outcome-focused (ships faster, better architecture, etc.)
   Single CTA: "Get Started" + quick install command
   Prerequisite badge: "Requires Claude Code CLI"

2. WHAT IS THIS (30-second explanation)
   Before/After comparison:
   - Without Oden: ad-hoc prompting, lost context, no structure
   - With Oden: pipeline from architecture to deploy, persistent docs, quality gates
   Optionally: 60-second demo GIF or video

3. WHO IS THIS FOR (segmented value)
   3-4 cards with segment-specific hooks
   Each card has: segment name, 1-sentence value, primary feature, CTA

4. HOW IT WORKS (simplified workflow)
   3-phase visual: Plan (architect/prd) -> Build (work/debug) -> Ship (sync/deploy)
   Each phase: 1 sentence + primary command
   NOT the 8-step pipeline -- too much for a landing page

5. KEY CAPABILITIES (feature depth)
   Expandable sections or tabs:
   - Methodology Engine (architect, prd, spec, checklist)
   - Development Orchestration (work, debug, teams)
   - Project Management (epic, tasks, sync, daily)
   - Ecosystem (mcp, templates, agents)

6. INTEGRATION & ARCHITECTURE
   How it fits: diagram showing Claude Code + Oden Forge + GitHub + your stack
   Answers: "Does it work with my setup?" and "What does it touch?"

7. QUICK START
   3 steps, copy-paste ready
   Split path: New Project | Existing Project

8. PRICING / MODEL
   Even if free/open-source, state it explicitly
   "Free and open source. MIT License. No account required."
   If future plans exist: "Enterprise support coming Q3 2026"

9. FAQ
   Address the top confusion points directly:
   - "Do I need Claude Code?" -- Yes, explain why
   - "Can I use this solo?" -- Yes, here is how
   - "How is this different from writing my own CLAUDE.md?" -- Explain the compound value
   - "Does this work with existing projects?" -- Yes, link to guide
   - "Is there a cost?" -- Free, MIT
```

### Information Hierarchy Principles

1. **Identity before features.** Nobody cares about `/oden:debug` until they understand what Oden is.
2. **Outcome before mechanism.** "Ship with complete specs" before "8000+ lines of documentation."
3. **Segmented entry points before universal depth.** Let each user type find their path fast.
4. **Prerequisites up front.** The Claude Code dependency must be visible in the hero, not discovered after installation.

---

## 4. Positioning Strategy

### Category Definition

Oden Forge does not fit neatly into existing categories. It is not:
- A CLI tool (it runs inside Claude Code, not standalone)
- A project template (it generates structure but also orchestrates development)
- An AI agent framework (it uses Claude's agent system but is not a framework)

**Recommended category: "AI Development Methodology Engine"**

This positions it as:
- More structured than raw Claude Code usage
- More opinionated than generic project scaffolders
- More integrated than separate planning tools (Linear, Notion) used alongside AI

### Competitive Positioning Map

```
                    MORE STRUCTURED
                         |
                    Oden Forge
                         |
    SOLO ----------+------------- TEAM
                   |
              Raw Claude Code
              Cursor Rules
              Custom CLAUDE.md
                   |
                    LESS STRUCTURED
```

**Direct alternatives** (what users do today without Oden):
- Write their own CLAUDE.md with custom prompts
- Use Claude Code with no methodology
- Combine Notion/Linear for planning + Claude Code for coding

**Oden's differentiation:**
- Integrated pipeline (planning and execution in the same tool)
- Compound knowledge (architecture docs feed into epics feed into work sessions)
- Methodology enforcement (quality gates, checklists, documentation thresholds)
- Context preservation across sessions

### Positioning Statement (for internal alignment)

> For developers and small teams who use Claude Code, Oden Forge is the development methodology engine that transforms ad-hoc AI-assisted coding into a structured, documentation-first pipeline. Unlike writing custom prompts or using separate planning tools, Oden Forge integrates architecture, specification, implementation, and project management into a single compound workflow where every phase feeds the next.

---

## 5. Specific Tactical Recommendations

### 5.1 Fix the Hero (highest impact, lowest effort)

**Current:**
```
V2 de Oden ya esta aqui
Documentation-First Development revolucionario...
```

**Recommended:**
```
Oden Forge
A development methodology engine for Claude Code.

From architecture decisions to production deployment --
structured pipeline, persistent specs, quality gates.

[Get Started]  [See How It Works]

npm install -g oden-forge
Requires Claude Code CLI
```

### 5.2 Add "What Is This" Section

A before/after comparison is the fastest way to communicate value:

**Without Oden:**
- "Build me auth" -> Claude generates code -> context lost next session
- No architecture record, no specs, no traceability
- Each session starts from zero

**With Oden:**
- `/oden:architect` -> persistent technical decisions document (2000+ lines)
- `/oden:prd auth` -> complete requirements with competitive analysis
- `/oden:work auth` -> implementation guided by specs, with parallel agents
- Every session builds on previous artifacts

### 5.3 Make Claude Code Dependency Explicit

Add a visible badge/callout near the hero:

> "Oden Forge runs as slash commands inside Claude Code (Anthropic's CLI). You need Claude Code installed to use it."
> [What is Claude Code?] -> link to Anthropic docs

This eliminates confusion for juniors and seniors alike.

### 5.4 Add Pricing Section

Even though it is free:

```
Free & Open Source

Oden Forge is MIT licensed. No account needed.
No usage limits. No premium tier.

Install and start building.
```

This removes the engineering manager's "no pricing = dealbreaker" concern. If enterprise plans are on the roadmap, add: "Enterprise support and private templates coming later."

### 5.5 Add Architecture Diagram

For DevOps and senior devs, add a simple diagram:

```
Your Terminal
  |
  Claude Code CLI (Anthropic)
  |
  Oden Forge (slash commands + agents + rules)
  |--- reads/writes ---> docs/ (specs, architecture, PRDs)
  |--- orchestrates ---> .claude/ (agents, commands, rules)
  |--- syncs ---------> GitHub Issues
  |--- manages -------> MCPs (optional integrations)
```

This answers: "What does it touch?", "Where does data go?", "How does it integrate?"

### 5.6 Replace Vanity Metrics with Outcome Metrics

**Current metrics (vague):**
- 8,000+ lines of documentation
- 90%+ success rate debugging
- 8-20 weeks MVP to Enterprise
- 95%+ context preservation

**Recommended metrics (outcome-oriented):**
- "Architecture decisions documented before first line of code"
- "Full traceability: PRD -> Epic -> Task -> GitHub Issue -> Code"
- "Context preserved across Claude Code sessions (no re-explaining)"
- "Works with any stack (Node, Python, Go, React Native, etc.)"

### 5.7 Language Consistency

The page mixes English and Spanish unpredictably. Given the package is on npm (global audience) with English package name and English README, the landing page should pick one language and commit. Recommendation:

- **Primary language: English** (npm audience, international reach)
- **Spanish landing page: separate URL** (if the primary market is LATAM)

At minimum, do not mix languages within the same section.

---

## 6. Conversion Funnel Optimization

### Current Funnel (Estimated)

```
Visit -> Confused about what it is (70% bounce)
       -> Understand it needs Claude Code (20% drop)
       -> Try to install (10% reach this point)
       -> No pricing clarity (5% convert to install)
```

### Target Funnel

```
Visit -> Immediately understand category + prerequisite (hero)
       -> Find their segment value hook (10 seconds)
       -> See how it works (30 seconds)
       -> Quick start (2 minutes to first command)
       -> Convert: npm install (target: 25%+ of visitors who have Claude Code)
```

### Key Conversion Levers

1. **Reduce time-to-understanding** from 60+ seconds to under 10 seconds
2. **Eliminate surprise prerequisites** (Claude Code dependency up front)
3. **Provide segment-specific entry** so no user type feels "this is not for me"
4. **Show, don't tell** (demo GIF/video worth more than 8 feature cards)

---

## 7. Implementation Priority

| Priority | Change | Effort | Impact | Addresses |
|---|---|---|---|---|
| P0 | Rewrite hero with identity + outcome | Low | Critical | All segments |
| P0 | Add Claude Code prerequisite badge | Low | High | Junior, Senior |
| P0 | Add explicit pricing/model section | Low | High | Mgr, Freelancer |
| P1 | Add "What Is This" before/after section | Medium | High | All segments |
| P1 | Add segment value hook cards | Medium | High | All segments |
| P1 | Simplify workflow to 3 phases | Low | Medium | Junior, Freelancer |
| P2 | Add architecture diagram | Medium | High | Senior, DevOps |
| P2 | Add FAQ section | Medium | Medium | All segments |
| P2 | Fix language consistency | Medium | Medium | International audience |
| P3 | Create demo GIF/video | High | Very High | All segments |
| P3 | Segment-specific landing paths | High | High | If traffic justifies it |

---

## 8. Success Metrics for the Redesign

| Metric | Current (Estimated) | Target | How to Measure |
|---|---|---|---|
| Bounce rate | 70%+ | Under 45% | Analytics |
| Time on page | Under 30s | 90s+ | Analytics |
| npm installs / week | Baseline TBD | 2x baseline | npm stats |
| GitHub stars growth | Baseline TBD | 3x weekly rate | GitHub |
| "How did you find us" = AI search | Unknown | Track | Add to README/onboarding |

---

## 9. AI Discovery Optimization (GEO)

Per the project's AI SEO rules, the redesigned page should also optimize for generative engine discovery:

- **H1:** "Oden Forge -- Development Methodology Engine for Claude Code"
- **Meta description:** "Open-source development methodology engine for Claude Code. Structured pipeline from architecture to deployment with documentation-first specs, team orchestration, and GitHub sync."
- **FAQ section** with natural-language questions users would ask ChatGPT/Perplexity
- **Schema markup** (SoftwareApplication type) with category, OS, license, features
- **Explicit feature descriptions** in H2 sections (not just command names)

---

## Summary of Strategic Recommendations

1. **Lead with identity, not features.** The page must answer "What is this?" in the first 5 seconds.
2. **Make the Claude Code dependency a feature, not a footnote.** Position it as "runs inside the tool you already use" rather than hiding the prerequisite.
3. **Segment the value proposition.** Four user types need four different reasons to care. Use cards, not paragraphs.
4. **Show the transformation.** Before/after is the most powerful communication pattern for methodology tools.
5. **State the business model explicitly.** "Free and open source" is a positioning advantage -- use it.
6. **Add an architecture diagram.** Technical users need to understand what Oden touches before they trust it.
7. **Simplify the workflow presentation.** Three phases (Plan / Build / Ship) instead of eight granular steps.
8. **Pick a language and commit.** English primary for npm global audience, Spanish as a separate path if needed.
