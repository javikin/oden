---
allowed-tools: Bash, Read, Write, LS, Glob, Grep, Task
description: Living Architecture Decision Records (ADR) system with AI-suggested missing ADRs and compliance validation
created: 2026-03-27T15:02:15Z
updated: 2026-03-27T15:02:15Z
---

# Oden Forge - Architecture Decision Records (ADR)

Sistema **Living ADR** con detección inteligente de decisiones faltantes, validación de compliance y mantenimiento automático.

## Usage

```bash
/oden:adr                         # Lista ADRs existentes y sugiere faltantes
/oden:adr create [título]         # Crear nuevo ADR interactivo
/oden:adr suggest                 # AI-suggested missing ADRs
/oden:adr validate               # Validar compliance con ADRs
/oden:adr update [número]        # Actualizar ADR existente
/oden:adr review                 # Revisar ADRs obsoletos
```

## 🎯 Living ADR Philosophy

### Problema Resuelto
- ❌ **Antes**: Decisiones arquitectónicas perdidas o desactualizadas
- ❌ **Antes**: No hay sistema para detectar decisiones faltantes  
- ❌ **Antes**: Compliance manual e inconsistente
- ✅ **Ahora**: ADRs vivientes con AI-assisted management y validación automática

### Living ADR Features
1. **AI-Suggested Missing ADRs** - Detecta automáticamente decisiones no documentadas
2. **Compliance Validation** - Verifica que el código sigue las decisiones registradas
3. **Update Workflows** - Mantiene ADRs actualizados con cambios del proyecto
4. **Cross-Reference Detection** - Encuentra conflictos entre ADRs
5. **Template-Based Creation** - Templates inteligentes según tipo de decisión

## Directory Structure

```
docs/reference/
├── adrs/
│   ├── 0001-record-architecture-decisions.md    # Meta-ADR
│   ├── 0002-database-technology-choice.md        # Example ADR
│   ├── 0003-api-authentication-strategy.md      # Example ADR
│   └── template.md                               # ADR template
└── adr-index.md                                  # Generated index
```

## Implementation

### 1. List ADRs and Suggest Missing (`/oden:adr`)

**Preflight:**
- Crear `docs/reference/adrs/` si no existe
- Verificar que existe template
- Escanear technical-decisions.md para contexto

**Main Algorithm:**
```bash
echo "📋 Architecture Decision Records Status"
echo ""

# Create directory if needed
mkdir -p docs/reference/adrs/

# List existing ADRs
echo "## Existing ADRs"
if ls docs/reference/adrs/*-*.md 2>/dev/null | grep -q .; then
    ls -1 docs/reference/adrs/ | grep -E "^[0-9]{4}-.*\.md$" | while read adr; do
        number=$(echo "$adr" | cut -d'-' -f1)
        title=$(grep "^# " "docs/reference/adrs/$adr" | head -1 | sed 's/^# //' | sed "s/^ADR-[0-9]*: //")
        status=$(grep "^Status:" "docs/reference/adrs/$adr" | head -1 | sed 's/^Status: //')
        echo "- ADR-$number: $title [$status]"
    done
else
    echo "No ADRs found. Use '/oden:adr create' to start."
fi

echo ""
echo "## 🤖 AI-Suggested Missing ADRs"
echo ""
echo "Analyzing codebase for undocumented architectural decisions..."
```

### 2. Create ADR (`/oden:adr create [título]`)

**Interactive Creation Process:**
- Determine ADR type from title or interactive selection
- Generate next sequential ADR number
- Create from appropriate template
- Auto-populate with project context

### 3. Validate Compliance (`/oden:adr validate`)

**Compliance Validation Engine:**
```bash
echo "🔍 Validating ADR Compliance"
echo ""

VIOLATIONS=0

# Read all ADRs and extract compliance rules
echo "Loading ADR compliance rules..."
for adr in docs/reference/adrs/[0-9]*.md; do
    if [ -f "$adr" ]; then
        ADR_NUM=$(basename "$adr" | cut -d'-' -f1)
        TITLE=$(grep "^# " "$adr" | head -1)
        STATUS=$(grep "^Status:" "$adr" | head -1 | sed 's/^Status: //')
        
        # Only validate accepted ADRs
        if [ "$STATUS" = "Accepted" ]; then
            echo "  - Validating ADR-$ADR_NUM"
            
            # Extract validation rules from "Compliance" section
            if grep -q "## Compliance" "$adr"; then
                # Perform compliance validation
                validate_adr_compliance "$adr" || VIOLATIONS=$((VIOLATIONS + 1))
            fi
        fi
    fi
done

if [ $VIOLATIONS -eq 0 ]; then
    echo "✅ All ADRs are in compliance"
    echo "Compliance Score: 100%"
else
    echo "⚠️  Found $VIOLATIONS compliance violations"
    echo "Compliance Score: $((100 - VIOLATIONS * 10))%"
fi

# Integration with Context Preservation System (Stream D)
if command -v /oden:context >/dev/null 2>&1; then
    echo ""
    echo "📊 Recording compliance metrics in context system..."
fi
```

### 4. AI-Suggested Missing ADRs (`/oden:adr suggest`)

**Deep Gap Analysis:**
Uses specialized AI agents to analyze:
- Technical decisions documentation gaps
- Code pattern analysis for undocumented decisions
- Dependency analysis for technology choices
- API design pattern gaps
- Database and storage decision gaps

### 5. Update and Review ADRs

**Maintenance Workflows:**
- Smart update suggestions based on codebase changes
- Obsolescence detection for outdated decisions
- Cross-reference validation
- Status transition management

## ADR Templates

### Core Template Structure
```markdown
# ADR-{NNNN}: {Title}

**Status**: {Proposed|Accepted|Deprecated|Superseded}  
**Date**: {YYYY-MM-DD}  
**Decision**: {Single sentence summary}  

## Context and Problem Statement
{Describe the architectural decision and problem}

## Decision Drivers
- {Driver 1}
- {Driver 2}

## Considered Options  
### Option 1: {Name}
**Pros**: {Benefits}
**Cons**: {Drawbacks}

## Decision Outcome
**Chosen Option**: Option X
**Rationale**: {Why selected}

## Consequences
### Positive
- {Positive consequence 1}
### Negative  
- {Negative consequence 1}

## Compliance
### Validation Rules
- {Rule 1: How to verify this decision is followed}
### Implementation Requirements
- {Requirement 1}

## Related Decisions
- ADR-{NNNN}: {Related decision}

## Implementation Notes
{Code links, configuration files, etc.}
```

## Integration with Quality Gates

### Pre-commit Integration
```bash
# ADR Compliance Gate
echo "📋 Checking ADR compliance..."
/oden:adr validate --quiet
if [ $? -ne 0 ]; then
    echo "❌ ADR compliance violations detected"
    echo "Run '/oden:adr validate' for details"
    exit 1
fi
```

### Stream Integration
- **Stream B (Architecture)**: Enhanced architect command uses ADRs
- **Stream C (Testing)**: Testing requirements defined in ADRs
- **Stream D (Context)**: Architecture drift monitoring via ADR compliance

## Living ADR Benefits

### For Development Teams
1. **Never lose architectural decisions** - Everything documented and maintained
2. **AI-suggested missing ADRs** - Proactive decision documentation  
3. **Automated compliance checking** - Ensure decisions are followed
4. **Template-guided creation** - Consistent, high-quality ADRs
5. **Cross-reference detection** - Avoid conflicting decisions

### For Oden Forge Quality Gates
1. **Measurable architecture compliance** - Foundation for quality gates
2. **Decision impact tracking** - Understand architectural consequences
3. **Evolution visibility** - Track how architecture changes over time
4. **Knowledge preservation** - No lost institutional knowledge
5. **Automated governance** - Remove manual architecture oversight

---

**Living ADRs transform architecture from invisible to visible, from static to dynamic, from forgotten to enforced.**

They solve the real-world problem of "invisible architecture" - architectural decisions that exist in code but are never documented, leading to inconsistent implementations and lost knowledge between team members and across time.
