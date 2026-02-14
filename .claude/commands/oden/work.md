---
allowed-tools: Bash, Read, Write, Edit, LS, Glob, Grep, Task
description: Orquestador inteligente de trabajo - desarrollo con agentes paralelos y Teams
---

# Oden Forge - Work Orchestrator

Comando principal para ejecutar trabajo de desarrollo con orquestacion inteligente de agentes.

## Usage

```
/oden:work [epic/issue] [--mode auto|config|smart]
```

**Ejemplos:**
```
/oden:work                        # Lista epics/issues disponibles
/oden:work epic/payments          # Trabaja en epic "payments"
/oden:work #42                    # Trabaja en issue #42
/oden:work epic/auth --mode auto  # Modo automatico
```

---

## Paso 0: Sin Argumentos - Listar Trabajo Disponible

Si `$ARGUMENTS` esta vacio, mostrar trabajo disponible:

### Buscar Epics Activos

```bash
# Buscar epics con estado in-progress o backlog
for epic_dir in .claude/epics/*/; do
  [ -d "$epic_dir" ] || continue
  epic_file="$epic_dir/epic.md"
  [ -f "$epic_file" ] || continue

  epic_name=$(basename "$epic_dir")
  status=$(grep '^status:' "$epic_file" | head -1 | cut -d: -f2 | tr -d ' ')
  progress=$(grep '^progress:' "$epic_file" | head -1 | cut -d: -f2 | tr -d ' ')

  echo "$epic_name | $status | $progress"
done
```

### Buscar Issues Abiertos en GitHub

```bash
gh issue list --state open --limit 20 --json number,title,labels,assignees
```

### Output de Listado

```
Trabajo disponible:

EPICS:
  1. payments (in-progress) - 40% completado
     Issues: 3 open, 2 closed
  2. auth (backlog) - 0%
     Issues: 5 open

ISSUES SIN EPIC:
  #42 - Fix login redirect (bug)
  #45 - Add dark mode support (enhancement)

Usa: /oden:work epic/payments
     /oden:work #42
```

---

## Paso 1: Identificar Target

### Si es Epic
```
/oden:work epic/{name}
```

1. Verificar que existe `.claude/epics/{name}/epic.md`
2. Leer todos los task files del epic
3. Identificar issues open/ready

### Si es Issue
```
/oden:work #{number}
```

1. Obtener detalles: `gh issue view {number} --json state,title,body,labels`
2. Buscar task file local: `.claude/epics/*/{number}.md`
3. Si no existe task file, crear contexto desde GitHub issue body

---

## Paso 2: Analizar Complejidad

Analizar los archivos involucrados para determinar la estrategia:

### Para Epic
```bash
# Contar issues open
open_issues=$(ls .claude/epics/{name}/[0-9]*.md 2>/dev/null | wc -l)

# Revisar cada issue para estimar archivos
total_files=0
for task_file in .claude/epics/{name}/[0-9]*.md; do
  [ -f "$task_file" ] || continue
  # Contar archivos mencionados en el body
  file_count=$(grep -cE '\.(ts|tsx|js|jsx|py|go|rs|rb|swift|sql|css|html)' "$task_file" 2>/dev/null || echo 0)
  total_files=$((total_files + file_count))
done
```

### Para Issue Individual
```bash
# Analizar el body del issue para archivos afectados
gh issue view {number} --json body -q .body | grep -cE '\.(ts|tsx|js|jsx|py|go|rs|rb|swift|sql|css|html)'
```

### Reglas de Complejidad

| Archivos | Complejidad | Estrategia |
|----------|-------------|------------|
| 1-2      | Baja        | 1 agente individual |
| 3-5      | Media       | 2 agentes paralelos |
| 6+       | Alta        | Teams coordinados |

---

## Paso 3: Seleccionar Modo de Trabajo

Preguntar al usuario (a menos que se pase `--mode`):

```
Analisis de complejidad:
  Target: epic/payments (3 issues, ~8 archivos)
  Complejidad: Alta
  Recomendacion: Teams coordinados (3 agentes)

Selecciona modo de trabajo:

  [A] Automatico - Oden decide todo (recomendado)
      → Asigna agentes, define streams, ejecuta

  [C] Configurar - Tu decides
      → Elige agentes, define scope, aprueba plan

  [S] Smart - Oden sugiere, tu apruebas
      → Oden propone plan, tu ajustas antes de ejecutar

Modo [A/C/S]:
```

---

## Paso 4: Generar Plan de Trabajo

### Modo Automatico (A)

Generar plan automaticamente basado en:

1. **Leer specs y technical-decisions.md** para entender arquitectura
2. **Analizar dependencias** entre issues/archivos
3. **Asignar agentes** segun tipo de trabajo:

```yaml
# Mapping automatico de trabajo a agentes
database_work:
  agent: backend-architect
  patterns: ["migrations/*", "src/db/*", "*.sql"]

api_work:
  agent: backend-architect
  patterns: ["src/api/*", "src/services/*", "src/routes/*"]

frontend_work:
  agent: frontend-developer
  patterns: ["src/components/*", "src/pages/*", "src/hooks/*"]

fullstack_work:
  agent: fullstack-developer
  patterns: ["src/**"]

test_work:
  agent: test-engineer
  patterns: ["tests/*", "*.test.*", "*.spec.*"]

devops_work:
  agent: devops-engineer
  patterns: ["Dockerfile", "docker-compose*", ".github/*", "CI/*"]
```

### Modo Configurar (C)

Mostrar opciones interactivas:

```
Plan propuesto:

Stream 1: Database Layer
  Agente: backend-architect
  Archivos: migrations/*, src/db/*
  Issues: #41, #42

Stream 2: API Endpoints
  Agente: backend-architect
  Archivos: src/api/*, src/services/*
  Issues: #43

Stream 3: Frontend
  Agente: frontend-developer
  Archivos: src/components/*, src/pages/*
  Issues: #44, #45

Quieres modificar algo?
  [1] Cambiar agente de un stream
  [2] Reagrupar archivos
  [3] Agregar/quitar stream
  [4] Aceptar plan
  [5] Cancelar

Opcion:
```

### Modo Smart (S)

Mostrar plan con recomendaciones:

```
Plan sugerido por Oden:

Stream 1: Database + API (backend-architect)
  Razon: DB y API estan acoplados, mejor un solo agente
  Archivos: migrations/*, src/db/*, src/api/*
  Issues: #41, #42, #43

Stream 2: Frontend (frontend-developer)
  Razon: UI es independiente del backend
  Archivos: src/components/*, src/pages/*
  Issues: #44, #45

Stream 3: Tests (test-engineer)
  Razon: Tests deben ejecutarse despues de streams 1 y 2
  Depende de: Stream 1, Stream 2
  Archivos: tests/*

Aprobar plan? [Y/n]:
```

---

## Paso 5: Preparar Branch y Workspace

### Crear o Entrar al Branch

```bash
# Determinar branch name
branch_name="epic/{epic_name}"
# Si es issue individual sin epic:
# branch_name="issue/{number}-{slug}"

# Verificar cambios no committeados
if [ -n "$(git status --porcelain)" ]; then
  echo "Tienes cambios sin committear. Committea o stash antes de continuar."
  exit 1
fi

# Crear branch si no existe
if ! git branch -a | grep -q "$branch_name"; then
  git checkout main
  git pull origin main
  git checkout -b "$branch_name"
  git push -u origin "$branch_name"
else
  git checkout "$branch_name"
  git pull origin "$branch_name"
fi
```

### Crear Estructura de Tracking

Get current datetime: `date -u +"%Y-%m-%dT%H:%M:%SZ"`

Crear `.claude/epics/{name}/work-session.md`:

```markdown
---
started: {current_datetime}
branch: {branch_name}
mode: {auto|config|smart}
status: active
---

# Work Session: {epic_name}

## Streams

### Stream 1: {name}
- Agent: {agent_type}
- Status: pending
- Files: {patterns}
- Issues: {numbers}

### Stream 2: {name}
- Agent: {agent_type}
- Status: pending
- Files: {patterns}
- Issues: {numbers}

## Timeline
- {datetime} - Session started
```

---

## Paso 6: Lanzar Agentes (Teams Integration)

### Complejidad Baja (1-2 archivos) - Agente Individual

Usar Task tool con un solo agente:

```yaml
Task:
  description: "Work on {target}"
  subagent_type: "{best_agent}"
  prompt: |
    Working in branch: {branch_name}

    Target: {issue_title}

    Requirements:
    - Read the full issue/spec before starting
    - Implement all changes needed
    - Write tests for new functionality
    - Commit frequently: "Issue #{number}: {change}"

    Files to modify:
    {file_list}

    Context:
    - Technical decisions: docs/reference/technical-decisions.md
    - Spec (if exists): docs/reference/modules/{module}-spec.md

    When done:
    - Ensure all tests pass
    - Update work-session.md with completion status
```

### Complejidad Media (3-5 archivos) - 2 Agentes Paralelos

Lanzar 2 Task tools en paralelo:

```yaml
# Agent 1: Primary work
Task:
  description: "Stream 1: {name} for {target}"
  subagent_type: "{agent_1_type}"
  prompt: |
    Working in branch: {branch_name}
    Stream: {stream_1_name}

    Your scope:
    - Files: {stream_1_files}
    - Issues: {stream_1_issues}

    IMPORTANT: Only modify files in your scope.
    Another agent is working on: {stream_2_files}

    Commit format: "Issue #{number}: {change}"

    Read requirements from:
    - .claude/epics/{name}/{task_files}
    - docs/reference/modules/{module}-spec.md

# Agent 2: Secondary work
Task:
  description: "Stream 2: {name} for {target}"
  subagent_type: "{agent_2_type}"
  prompt: |
    Working in branch: {branch_name}
    Stream: {stream_2_name}

    Your scope:
    - Files: {stream_2_files}
    - Issues: {stream_2_issues}

    IMPORTANT: Only modify files in your scope.
    Another agent is working on: {stream_1_files}

    Commit format: "Issue #{number}: {change}"
```

### Complejidad Alta (6+ archivos) - Teams Coordinados

Lanzar N Task tools en paralelo, respetando dependencias:

```yaml
# Launch independent streams first
# Then launch dependent streams as predecessors complete

# Phase 1: Independent streams (launch in parallel)
Task[1..N]:
  description: "Stream {X}: {name}"
  subagent_type: "{agent_type}"
  prompt: |
    Working in branch: {branch_name}
    Stream: {stream_name}
    Team role: {role}

    Your scope:
    - Files: {file_patterns}
    - Issues: {issue_numbers}

    Other active streams:
    {list_of_other_streams_and_their_files}

    Coordination rules:
    - ONLY modify files in your scope
    - Commit frequently
    - If you need a file from another stream, wait
    - Follow /rules/agent-coordination.md

    Commit format: "Issue #{number}: {change}"

# Phase 2: Dependent streams (launch after Phase 1)
# Only launch these after their dependencies complete
```

---

## Paso 7: Monitorear y Reportar Progreso

Mientras los agentes trabajan, actualizar `work-session.md`:

```markdown
## Timeline
- {datetime} - Session started
- {datetime} - Stream 1 (Database) started - backend-architect
- {datetime} - Stream 2 (API) started - backend-architect
- {datetime} - Stream 1 completed (3 commits)
- {datetime} - Stream 3 (Tests) started - test-engineer (was waiting for Stream 1)
```

### Output Durante Ejecucion

```
Work session active: epic/payments

Agents:
  Stream 1: Database (backend-architect) .... working
  Stream 2: API (backend-architect) ......... working
  Stream 3: Tests (test-engineer) ........... waiting (depends on 1, 2)

Commits: 5 total
  latest: "Issue #42: Add payment table migration"

Progress: 2/3 streams active
```

---

## Paso 8: Post-Trabajo - Verificacion

Cuando TODOS los streams completan:

### 8.1 Ejecutar Tests E2E

```bash
# Detectar framework de testing
if [ -f package.json ]; then
  # Check for test script
  test_cmd=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('package.json')).scripts.test||'')}catch(e){}" 2>/dev/null)
  if [ -n "$test_cmd" ]; then
    npm test 2>&1 | tee /tmp/test-output.txt
    test_exit=$?
  fi
elif [ -f go.mod ]; then
  go test ./... 2>&1 | tee /tmp/test-output.txt
  test_exit=$?
elif [ -f Cargo.toml ]; then
  cargo test 2>&1 | tee /tmp/test-output.txt
  test_exit=$?
elif [ -f Gemfile ]; then
  bundle exec rspec 2>&1 | tee /tmp/test-output.txt
  test_exit=$?
elif [ -f pubspec.yaml ]; then
  flutter test 2>&1 | tee /tmp/test-output.txt
  test_exit=$?
fi
```

Si tests fallan:

```
Tests fallaron (exit code: {code})

Failures:
  {parsed test failures}

Opciones:
  [1] Lanzar agente debugger para fix automatico
  [2] Ver output completo
  [3] Continuar sin fix (no recomendado)
  [4] Abortar

Opcion:
```

Si se elige opcion 1, lanzar debugger:

```yaml
Task:
  description: "Fix test failures for {target}"
  subagent_type: "debugger"
  prompt: |
    Tests are failing after parallel development.

    Branch: {branch_name}
    Test output: {test_output}

    Fix the failing tests. Common causes:
    - Import paths changed by another stream
    - Missing type definitions
    - Integration mismatches between streams

    Commit fixes with: "fix: Resolve test failures after parallel merge"
```

### 8.2 Code Review Automatico

Ejecutar review del branch completo:

```yaml
Task:
  description: "Code review for {target}"
  subagent_type: "code-reviewer"
  prompt: |
    Review all changes in branch {branch_name} vs main.

    Get changes with: git diff main...HEAD

    Check for:
    1. Consistency between streams (naming, patterns)
    2. Missing error handling
    3. Security issues
    4. Performance concerns
    5. Compliance with docs/reference/technical-decisions.md

    Output format:
    - CRITICAL: {issues that block merge}
    - WARNING: {issues to review}
    - OK: {things that look good}

    Final verdict: APPROVE / REQUEST_CHANGES
```

### Output de Review

```
Code Review Results:

  Verdict: APPROVE (with warnings)

  Warnings:
    - src/api/payments.ts:45 - Missing input validation
    - src/db/schema.ts:12 - Consider adding index

  Approved:
    - Architecture follows technical-decisions.md
    - Error handling is consistent
    - No security issues found
```

---

## Paso 9: Auto-Crear Pull Request

Si review pasa (APPROVE o APPROVE with warnings):

### Generar PR Body

```bash
# Recopilar informacion del branch
commits=$(git log main..HEAD --oneline)
files_changed=$(git diff main...HEAD --stat)
```

### Crear PR

```bash
# Verificar remote origin (proteccion de repositorio)
remote_url=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$remote_url" == *"automazeio/ccpm"* ]]; then
  echo "ERROR: No se puede crear PR en el repositorio template"
  exit 1
fi

REPO=$(echo "$remote_url" | sed 's|.*github.com[:/]||' | sed 's|\.git$||')

gh pr create --repo "$REPO" \
  --title "{pr_title}" \
  --body "$(cat <<'PREOF'
## Summary
{summary_from_work_session}

## Changes by Stream
### Stream 1: {name}
- {changes}

### Stream 2: {name}
- {changes}

## Issues Addressed
- Closes #{issue_1}
- Closes #{issue_2}

## Testing
- [x] Unit tests passing
- [x] E2E tests passing
- [x] Code review: {verdict}

## Review Notes
{review_warnings_if_any}

---
Generated by Oden Forge /oden:work
PREOF
)"
```

### Output PR

```
Pull Request creado:

  PR: #{pr_number} - {title}
  URL: {pr_url}
  Branch: {branch_name} -> main

  Incluye:
    {commit_count} commits
    {files_count} archivos modificados
    {issues_count} issues referenciados

  Review: {verdict}
  Tests: Passing

Next:
  - Revisar PR en GitHub: {pr_url}
  - Merge cuando listo: /oden:epic-merge {name}
  - O desde GitHub: Merge pull request
```

---

## Paso 10: Cierre de Issues (Post-Merge)

Cuando el PR se mergea (manual o automatico via GitHub):

### Cerrar Issues Relacionados

```bash
# Los issues se cierran automaticamente si el PR body tiene "Closes #N"
# Pero si no, cerrarlos manualmente:

for issue_num in {related_issues}; do
  gh issue close $issue_num -c "Completed in PR #{pr_number}"
done
```

### Actualizar Estado Local

```bash
# Actualizar work-session.md
# Actualizar task files con status: closed
# Actualizar epic progress
```

### Limpiar Branch

```bash
# Despues de merge exitoso
git checkout main
git pull origin main
git branch -d {branch_name}
git push origin --delete {branch_name} 2>/dev/null || true
```

---

## Resumen de Flujo Completo

```
/oden:work epic/payments --mode auto

1. Analizar complejidad .................. 8 archivos (Alta)
2. Generar plan .......................... 3 streams
3. Crear branch .......................... epic/payments
4. Lanzar Stream 1 (DB) ................. backend-architect
   Lanzar Stream 2 (API) ................ backend-architect
5. [Esperar Stream 1, 2]
6. Lanzar Stream 3 (Tests) .............. test-engineer
7. [Esperar Stream 3]
8. Ejecutar tests E2E ................... PASS
9. Code review .......................... APPROVE
10. Crear PR ............................. #15
11. [Merge manual o auto]
12. Cerrar issues ........................ #41, #42, #43
13. Limpiar branch ....................... Done
```

---

## Error Handling

### Agente Falla

```
Stream 2 (API) fallo:
  Error: {error_message}

Opciones:
  [1] Reintentar stream con mismo agente
  [2] Reintentar con agente diferente
  [3] Continuar sin este stream
  [4] Abortar sesion

Los demas streams continuan trabajando.
```

### Tests Fallan Despues de Fix

```
Tests siguen fallando despues de fix automatico.

Failures restantes:
  {remaining_failures}

Opciones:
  [1] Intentar fix manual (te muestro los errores)
  [2] Crear PR como draft (con tests fallando)
  [3] Abortar y volver a main
```

### Conflictos en Branch

```
Conflictos detectados al hacer pull:
  {conflicted_files}

El branch epic/payments tiene conflictos con main.
Resuelve manualmente y luego ejecuta: /oden:work epic/payments --resume
```

---

## Flags Adicionales

| Flag | Descripcion |
|------|-------------|
| `--mode auto\|config\|smart` | Modo de trabajo |
| `--resume` | Reanudar sesion interrumpida |
| `--skip-tests` | Saltar tests E2E |
| `--skip-review` | Saltar code review |
| `--draft` | Crear PR como draft |
| `--no-pr` | No crear PR automaticamente |

---

## Integracion con Otros Comandos

| Comando | Cuando se usa |
|---------|---------------|
| `/oden:review` | Paso 8.2 - Code review automatico |
| `/oden:test run` | Paso 8.1 - Tests E2E |
| `/oden:git pr` | Paso 9 - Crear PR (fallback manual) |
| `/oden:daily` | Registrar trabajo del dia |
| `/oden:epic-merge` | Merge final si no se usa PR auto |
| `/oden:debug` | Fix de tests fallidos |

---

## Important Notes

- Follow `/rules/branch-operations.md` for git operations
- Follow `/rules/agent-coordination.md` for parallel work
- Follow `/rules/github-operations.md` for GitHub operations
- Follow `/rules/datetime.md` for timestamps
- Maximum parallel agents: 5 (to avoid resource exhaustion)
- Always verify remote origin before GitHub write operations


---

## 🔥 CONSOLIDATED MODES - Todo en Uno

### DEBUG MODE: /oden:work debug [error/issue]
Debugging especializado integrado en el workflow.

**Funcionalidad completa de /oden:debug:**
- Análisis automático de stack traces
- Detección de patterns en logs
- Sugerencias de fixes específicas
- Integration con Teams para debugging paralelo

**Usage:**
```bash
/oden:work debug "TypeError: Cannot read property"
/oden:work debug logs error.log
/oden:work debug performance api/slow-endpoint
```

---

### TEST MODE: /oden:work test [target]
Testing completo integrado en el desarrollo.

**Funcionalidad completa de /oden:test:**
- Estrategia de testing automática
- Ejecución con análisis de fallos  
- Coverage reports con insights
- Test generation desde specs

**Usage:**
```bash
/oden:work test strategy          # Crear estrategia
/oden:work test run              # Ejecutar todos
/oden:work test coverage         # Analizar cobertura
/oden:work test generate auth    # Tests desde specs
```

---

### REVIEW MODE: /oden:work review [scope]
Code review antes de PRs y merges.

**Funcionalidad completa de /oden:review:**
- Review automático con checklist
- Security scan integrado
- Performance analysis
- Best practices validation

**Usage:**
```bash
/oden:work review              # Review completo
/oden:work review security     # Focus en seguridad  
/oden:work review performance  # Focus en performance
```

---

### RESEARCH MODE: /oden:work research [topic]
Investigación técnica durante desarrollo.

**Funcionalidad completa de /oden:research:**
- Búsqueda de soluciones técnicas
- Comparación de librerías/approaches
- Best practices research
- Documentation lookup

**Usage:**
```bash
/oden:work research "rate limiting approaches"
/oden:work research library axios vs fetch
/oden:work research best-practice "error handling React"
```

---

### GIT MODE: /oden:work git [operation]
Git workflow integrado en el desarrollo.

**Funcionalidad completa de /oden:git:**
- Branch management automático
- Smart commits con context
- PR creation con análisis
- Merge strategy optimization

**Usage:**
```bash
/oden:work git start feature-auth    # Nueva feature branch
/oden:work git commit "Add auth"     # Smart commit
/oden:work git pr                    # Create PR con análisis  
/oden:work git sync                  # Sync con main
```

---

### DAILY MODE: /oden:work daily
Registro de progreso diario automático.

**Funcionalidad completa de /oden:daily:**
- Auto-tracking de archivos modificados
- Progress analysis con metrics
- Blockers detection
- Daily summary generation

**Usage:**
```bash
/oden:work daily                 # Registro completo del día
```

**Output Example:**
```
📅 DAY_3_COMPLETED.md

## Progreso del Día
- ✅ API authentication endpoints (3h)
- ✅ JWT middleware integration (2h)  
- 🔄 Frontend login form (in progress)

## Archivos Modificados
- src/api/auth.ts (new)
- src/middleware/jwt.ts (updated)
- src/types/user.ts (updated)

## Blockers
- None

## Siguiente Día
- Completar frontend login
- Add registration flow
```

---

## 🎯 Smart Mode Selection

El comando `/oden:work` selecciona automáticamente el mejor approach:

- **1-2 archivos** → Single agent
- **3-5 archivos** → Parallel agents  
- **6+ archivos** → Full Teams orchestration
- **Error detection** → Auto-trigger debug mode
- **Test failures** → Auto-trigger test mode
- **PR ready** → Auto-trigger review mode

**Example:**
```bash
/oden:work auth-epic
# → Detecta 8 archivos → Teams mode
# → 2 test failures → Auto-trigger test mode
# → Security concerns → Auto-trigger review mode
```
