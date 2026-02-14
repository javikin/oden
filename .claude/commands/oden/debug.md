---
allowed-tools: Bash, Read, Write, LS, Task, TeamCreate, SendMessage, TaskCreate, TaskList, TaskUpdate, TaskGet
description: Sistema de debug con orquestación de cola - ejecución continua y contexto máximo
---

# Oden Debug - Queue-Based Orchestration System

Sistema de debug inteligente que orquesta solicitudes en cola usando sub-agentes especializados para máxima preservación de contexto.

## Usage

```bash
/oden:debug                    # Iniciar sesión de debug
/oden:debug add "descripción"  # Agregar tarea a la cola
/oden:debug status             # Ver estado de la cola
/oden:debug pause              # Pausar procesamiento
/oden:debug resume             # Reanudar procesamiento
/oden:debug priority N "desc"  # Insertar con prioridad
/oden:debug clear              # Limpiar cola
/oden:debug stop               # Terminar sesión
```

## Arquitectura del Sistema

### Componentes Core

1. **Queue Manager** - Gestión de cola inteligente
2. **Orchestrator** - Coordinación de sub-agentes
3. **Context Engine** - Preservación de contexto
4. **Progress Reporter** - Reportes en tiempo real
5. **Dependency Analyzer** - Auto-detección de dependencias

### Flujo de Trabajo

```
Solicitud → Queue → Dependency Analysis → Agent Selection → Execution → Context Update → Report
```

## Modos de Operación

### INTERACTIVE MODE (Default)
Sesión interactiva con cola persistente:

```bash
🔧 ODEN DEBUG SESSION STARTED
Queue: 0 tasks | Active: none | Status: waiting

debug> add "fix login validation error"
✅ Task #1 added to queue (complexity: M)

debug> add "update test coverage for auth module"
✅ Task #2 added to queue (complexity: S)
Dependencies detected: Task #2 depends on Task #1

debug> status
📊 DEBUG QUEUE STATUS
┌─────┬──────────────────────────────┬────────────┬──────────────┬──────────┐
│ ID  │ Description                  │ Complexity │ Dependencies │ Status   │
├─────┼──────────────────────────────┼────────────┼──────────────┼──────────┤
│ 1   │ fix login validation error   │ M          │ -            │ queued   │
│ 2   │ update test coverage...      │ S          │ depends on 1 │ waiting  │
└─────┴──────────────────────────────┴────────────┴──────────────┴──────────┘

Auto-executing Task #1...
🔄 [debugger] Analyzing login validation error...
```

### BATCH MODE
Procesamiento automático de cola:

```bash
/oden:debug --batch task1.txt task2.txt task3.txt
```

## Context Management Engine

### Context Layers

1. **Global Context** - Estado del proyecto, arquitectura, decisiones
2. **Session Context** - Historia de la sesión de debug
3. **Task Context** - Contexto específico de cada tarea
4. **Agent Context** - Estado y aprendizajes de sub-agentes

### Context Preservation Strategy

```markdown
## Context Continuity Protocol

1. **Pre-Task Analysis**
   - Scan recent commits, error logs, test failures
   - Extract relevant code context
   - Identify related files and dependencies

2. **Cross-Task Learning**
   - Lessons learned from previous tasks
   - Pattern recognition across errors
   - Common root causes identification

3. **Context Compression**
   - Summarize completed work
   - Preserve key insights and decisions
   - Maintain critical debugging paths
```

## Intelligent Agent Selection

### Agent Specialization Matrix

| Error Type | Primary Agent | Secondary Agent | Context Needs |
|------------|---------------|-----------------|---------------|
| Syntax/Logic | `debugger` | `code-reviewer` | File + Git history |
| Test Failures | `test-engineer` | `debugger` | Test logs + coverage |
| Performance | `performance-engineer` | `debugger` | Metrics + profiling |
| Security | `security-auditor` | `code-reviewer` | OWASP + dependencies |
| Database | `database-architect` | `debugger` | Schema + queries |
| API Issues | `backend-architect` | `debugger` | Endpoints + logs |
| UI/Frontend | `frontend-developer` | `debugger` | Browser + components |
| DevOps | `devops-engineer` | `debugger` | Deployment + config |

### Complexity Assessment

```yaml
Complexity Scoring:
  XS (< 1h):   Typos, config tweaks, simple fixes
  S (1-2h):    Single file logic, minor refactor
  M (2-4h):    Multi-file changes, moderate complexity
  L (4-8h):    Architecture changes, major refactor
  XL (8h+):    System-wide changes, new patterns

Auto-routing:
  XS-S:  Single agent execution
  M:     Primary + secondary agent coordination
  L-XL:  Multi-agent teams with orchestration
```

## Dependency Detection Engine

### Automatic Analysis

```python
# Pseudo-code for dependency analysis
def analyze_dependencies(task_description, codebase_context):
    dependencies = {
        'file_dependencies': scan_file_relations(task_description),
        'test_dependencies': find_related_tests(task_description),
        'integration_points': identify_api_dependencies(task_description),
        'data_dependencies': check_database_relations(task_description),
        'prerequisite_tasks': analyze_task_ordering(task_description, existing_queue)
    }
    return dependencies
```

### Smart Queue Reordering

```markdown
## Dependency Resolution Algorithm

1. **Scan new task** for keywords, file patterns, error signatures
2. **Match against existing queue** for related work
3. **Identify prerequisites** using AST analysis and git history
4. **Auto-reorder queue** to respect dependencies
5. **Notify user** of any reordering with explanation
```

## Progress Reporting System

### Real-Time Updates

```bash
🔄 TASK #1: fix login validation error
├── 🔍 [debugger] Analyzing error patterns... (30s)
├── 📋 [debugger] Found 3 potential root causes
├── 🔧 [debugger] Implementing fix for validation logic... (45s)
├── ✅ [debugger] Fix applied to src/auth/validation.ts
├── 🧪 [test-runner] Running affected tests... (20s)
└── ✅ TASK #1 COMPLETED (2m 35s)

🔄 TASK #2: update test coverage for auth module
├── 🔍 [test-engineer] Analyzing current coverage... (15s)
├── 📊 [test-engineer] Coverage: 67% → Target: 80%
├── ✍️ [test-engineer] Writing missing test cases... (60s)
└── 🔄 In progress...
```

### Context-Aware Status

```bash
debug> status --detailed
📊 DEBUG SESSION OVERVIEW
Session: 45 minutes | Tasks completed: 3/5 | Success rate: 100%

🧠 CONTEXT INSIGHTS:
- Common pattern: validation errors in auth module
- Root cause: insufficient input sanitization
- Recommendation: Add validation middleware

📈 LEARNING TRAJECTORY:
- Task #1 revealed auth architecture issue
- Task #2 benefits from #1 insights
- Task #3 can leverage shared validation patterns

⏱️ ESTIMATED TIME TO COMPLETION: 15 minutes
```

## Dynamic Control Features

### Priority Insertion

```bash
debug> priority 1 "critical: production login broken"
🚨 HIGH PRIORITY task inserted at position #1
Queue reordered based on dependencies:
1. critical: production login broken (NEW)
2. fix login validation error (moved from #1)
3. update test coverage for auth module
```

### Queue Management

```bash
debug> pause
⏸️ Queue processing paused
Current task will complete, new tasks will queue

debug> reorder 3 1
✅ Moved task #3 to position #1
Dependencies checked: ✅ No conflicts

debug> remove 2
✅ Task #2 removed from queue
```

## Auto-Close & Session Management

### Inactivity Detection

```markdown
## Session Lifecycle

1. **Active**: Processing tasks or recent user interaction
2. **Idle**: No activity for 10 minutes - show idle warning
3. **Extended Idle**: No activity for 20 minutes - prepare for shutdown
4. **Auto-Close**: No activity for 30 minutes - save and close

## Graceful Shutdown Process

1. Complete current task if < 5 minutes remaining
2. Save queue state to `.claude/debug-sessions/YYYYMMDD-HHMMSS.json`
3. Generate session summary report
4. Release all sub-agents gracefully
5. Close Teams and cleanup resources
```

### Session Recovery

```bash
/oden:debug recover
📁 Found 3 previous sessions:
1. 2024-01-15-14:30 (auth-fixes) - 3 tasks completed
2. 2024-01-15-09:15 (performance-improvements) - 2 tasks completed
3. 2024-01-14-16:45 (ui-bugs) - 5 tasks completed

Recover which session? [1-3]: 1
✅ Session recovered with 2 pending tasks
```

## Implementation Details

### Queue Data Structure

```yaml
debug_session:
  id: debug_20240115_143045
  status: active
  created: 2024-01-15T14:30:45Z
  last_activity: 2024-01-15T15:15:22Z
  team_id: debug_team_001

  queue:
    - id: task_001
      description: "fix login validation error"
      complexity: M
      estimated_time: 120
      dependencies: []
      status: completed
      assigned_agent: debugger
      started_at: 2024-01-15T14:31:00Z
      completed_at: 2024-01-15T14:33:35Z

    - id: task_002
      description: "update test coverage for auth module"
      complexity: S
      estimated_time: 60
      dependencies: [task_001]
      status: in_progress
      assigned_agent: test-engineer
      started_at: 2024-01-15T14:34:00Z

  context:
    global_context: "..."
    session_learnings: "..."
    agent_insights: {...}
```

### Agent Coordination Protocol

```markdown
## Multi-Agent Coordination

1. **Task Assignment**
   - Select primary agent based on error type
   - Assign secondary agent for validation/review
   - Create team for complex tasks (L/XL)

2. **Context Sharing**
   - Primary agent gets full context
   - Secondary agent gets relevant subset
   - Team members get specialized context

3. **Progress Synchronization**
   - Agents report progress every 30 seconds
   - Orchestrator aggregates and reports to user
   - Context updates flow between agents

4. **Conflict Resolution**
   - File-level locking for simultaneous edits
   - Human intervention for complex conflicts
   - Automatic rollback on failures
```

## Error Handling & Resilience

### Failure Recovery

```markdown
## Failure Modes & Recovery

1. **Agent Failure**: Reassign to backup agent with context transfer
2. **Task Timeout**: Split task or escalate complexity
3. **Context Loss**: Rebuild from git history and logs
4. **Queue Corruption**: Restore from last checkpoint
5. **Network Issues**: Local fallback mode with sync later
```

### Health Monitoring

```bash
debug> health
🏥 DEBUG SYSTEM HEALTH
┌─────────────────┬─────────┬───────────┐
│ Component       │ Status  │ Uptime    │
├─────────────────┼─────────┼───────────┤
│ Queue Manager   │ ✅ OK   │ 45m       │
│ Orchestrator    │ ✅ OK   │ 45m       │
│ Context Engine  │ ✅ OK   │ 45m       │
│ Team debug_001  │ ✅ OK   │ 45m       │
│ Agent: debugger │ 🔄 BUSY │ 3m (T#2)  │
└─────────────────┴─────────┴───────────┘

Memory: 156MB | Context: 2.1MB | Queue: 3 tasks
```

## Analytics & Learning

### Session Analytics

```bash
debug> analytics
📈 DEBUG SESSION ANALYTICS

🎯 Success Metrics:
- Tasks completed: 8/10 (80%)
- Average completion time: 3m 15s
- Context preservation: 94%
- Agent efficiency: 87%

🧠 Learning Insights:
- Most common error type: validation (40%)
- Best performing agent: debugger (95% success)
- Optimal queue size: 3-5 tasks
- Peak efficiency time: 10-20 minutes

📊 Recommendations:
- Consider validation middleware refactor
- Queue 4 tasks for optimal flow
- Schedule complex tasks early in session
```

## Advanced Features

### Smart Batching

```bash
# Auto-group related tasks
debug> add "fix user login"
debug> add "fix admin login"
debug> add "update login tests"

🤖 Smart batching detected:
Grouping 3 related authentication tasks
Estimated total time: 8 minutes (vs 12 minutes individual)
Proceed with batch? [y/N]: y
```

### Code Pattern Recognition

```markdown
## Pattern Learning Engine

1. **Error Pattern Database**
   - Common error signatures → solutions
   - Project-specific patterns
   - Performance bottleneck patterns
   - Security vulnerability patterns

2. **Solution Reuse**
   - Detect similar previous fixes
   - Suggest proven solution patterns
   - Auto-apply safe, repetitive fixes

3. **Preventive Suggestions**
   - "This pattern often causes X"
   - "Consider adding Y to prevent Z"
   - "Similar code in file.js might need fixing"
```

## Command Implementation

### Core Commands

```python
# Command routing logic
def handle_debug_command(args):
    if not args:
        return start_interactive_session()

    command = args[0].lower()

    commands = {
        'add': add_task_to_queue,
        'status': show_queue_status,
        'pause': pause_processing,
        'resume': resume_processing,
        'priority': insert_with_priority,
        'clear': clear_queue,
        'stop': stop_session,
        'recover': recover_session,
        'health': show_system_health,
        'analytics': show_session_analytics
    }

    return commands.get(command, show_help)(args[1:])
```

### Interactive Session Flow

```bash
def start_interactive_session():
    """
    1. Create debug team
    2. Initialize context engine
    3. Start interactive prompt
    4. Process user commands
    5. Auto-save session state
    """

    # Create specialized debug team
    team_id = create_debug_team()

    # Initialize components
    queue_manager = QueueManager()
    orchestrator = TaskOrchestrator(team_id)
    context_engine = ContextEngine()

    # Start interactive loop
    while True:
        command = prompt("debug> ")
        if command == "exit":
            graceful_shutdown()
            break

        process_command(command, queue_manager, orchestrator)
        auto_save_session()
```

## Integration con Oden Ecosystem

### Seamless Integration

```markdown
## Ecosystem Integration

1. **Epic/Task Sync**
   - Detect if debug tasks relate to existing epics
   - Auto-link completed debug work to GitHub issues
   - Update epic progress based on debug completion

2. **Context Inheritance**
   - Use technical-decisions.md for architecture context
   - Leverage PRD insights for business logic context
   - Access competitive analysis for feature context

3. **Knowledge Transfer**
   - Debug learnings feed into future architect decisions
   - Common patterns influence spec writing
   - Performance insights guide technical decisions
```

## Output Examples

### Successful Session

```bash
🎉 DEBUG SESSION COMPLETED

📊 Session Summary:
Duration: 47 minutes
Tasks processed: 8
Success rate: 100% (8/8)
Context preservation: 96%

🏆 Key Accomplishments:
✅ Fixed authentication validation bug
✅ Improved test coverage from 67% to 85%
✅ Optimized database query performance
✅ Resolved 3 security vulnerabilities
✅ Updated error handling middleware
✅ Fixed 2 UI rendering issues
✅ Improved API response time by 40%
✅ Added comprehensive error logging

🧠 Insights Discovered:
- Root cause: insufficient input validation across auth module
- Pattern identified: similar issues in 3 other modules
- Recommendation: implement global validation middleware
- Performance boost: query optimization reduced load time 40%

📈 Metrics:
Average task time: 5m 52s
Fastest completion: 2m 15s (syntax fix)
Most complex: 12m 30s (performance optimization)
Context switches: 14 (excellent preservation)

💡 Next Steps:
1. Consider implementing global validation middleware
2. Review similar patterns in user, admin, and billing modules
3. Schedule performance audit for database layer
4. Update technical-decisions.md with new patterns

Session saved to: .claude/debug-sessions/20240115-debug-auth-fixes.json
```

## Important Notes

- **Context Preservation**: El sistema mantiene máximo contexto entre tareas
- **Intelligent Routing**: Auto-selección de agentes basada en tipo de error
- **Dynamic Control**: Inserción de prioridad y reordenamiento en tiempo real
- **Graceful Shutdown**: Auto-close después de 30min de inactividad
- **Session Recovery**: Recuperar sesiones interrumpidas
- **Learning Engine**: Mejora continua basada en patrones de éxito

## Next Steps

After implementing Oden Debug:

```bash
1. /oden:debug           # Start debugging session
2. Add tasks to queue    # "fix X", "improve Y", "resolve Z"
3. Monitor progress      # Real-time orchestration
4. Let system optimize   # Dependency detection + smart routing
5. Review insights       # Session analytics + learnings
```