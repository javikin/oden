---
allowed-tools: Read, LS
description: Mostrar ayuda y guías de Oden Forge
---

# Oden Forge - Help

Muestra información sobre los comandos disponibles y cómo usar Oden Forge.

## Usage

```
/oden:help [topic]
```

Topics disponibles:
- `commands` - Lista de todos los comandos
- `workflow` - Flujo de trabajo recomendado
- `philosophy` - Filosofía de la metodología
- `agents` - Agentes especializados
- `faq` - Preguntas frecuentes

## Output Principal

```
╔══════════════════════════════════════════════════════════════╗
║                      🔨 ODEN FORGE                           ║
║         Documentation-First Development Toolkit              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  "Documenta y diseña COMPLETAMENTE antes de codificar"       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  COMANDOS DISPONIBLES                                        ║
║                                                              ║
║  Setup:                                                      ║
║  ├─ /oden:init         Wizard para crear proyecto            ║
║  ├─ /oden:init-agents  Instalar agentes de desarrollo        ║
║  ├─ /oden:init-mcp     Instalar MCPs recomendados            ║
║  ├─ /oden:mcp [sub]    Gestionar MCPs (install/status/etc)   ║
║  └─ /oden:help         Esta ayuda                            ║
║                                                              ║
║  Pre-Desarrollo (ejecutar en orden):                         ║
║  ├─ /oden:architect    Technical decisions + DB schema       ║
║  ├─ /oden:spec [mod]   Especificación de módulo              ║
║  └─ /oden:checklist    Verificar todo listo                  ║
║                                                              ║
║  Feature Pipeline (nativo):                                  ║
║  ├─ /oden:prd [name]   Crear PRD con brainstorming           ║
║  ├─ /oden:epic [name]  PRD -> Epic con work streams          ║
║  ├─ /oden:tasks [name] Epic -> Issues desglosados            ║
║  └─ /oden:sync [sub]   Sincronizar con GitHub Issues         ║
║                                                              ║
║  Durante Desarrollo:                                         ║
║  ├─ /oden:work [epic]  Orquestador con Teams (auto/config)   ║
║  ├─ /oden:test [sub]   Testing                               ║
║  ├─ /oden:debug [sub]  Debugging                             ║
║  ├─ /oden:git [sub]    Git workflow                          ║
║  ├─ /oden:review       Code review antes de merge            ║
║  ├─ /oden:research     Investigación técnica                 ║
║  └─ /oden:daily        Registrar progreso del día            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FLUJO TÍPICO                                                ║
║                                                              ║
║  SETUP:                                                      ║
║  /oden:init myproject      → Crear proyecto                  ║
║  /oden:init-agents         → Instalar agentes                ║
║  /oden:init-mcp            → Instalar MCPs                   ║
║                                                              ║
║  PRE-DEV:                                                    ║
║  /oden:architect           → Arquitectura                    ║
║  /oden:spec auth           → Specs por módulo                ║
║  /oden:checklist           → Verificar                       ║
║                                                              ║
║  FEATURES (pipeline nativo):                                 ║
║  /oden:prd auth            → Crear PRD                       ║
║  /oden:epic auth           → PRD -> Epic tecnico             ║
║  /oden:tasks auth          → Epic -> Issues                  ║
║  /oden:sync auth           → Push a GitHub Issues            ║
║                                                              ║
║  DESARROLLO:                                                 ║
║  /oden:work epic/auth      → Orquestador con Teams           ║
║  /oden:test run            → Testing                         ║
║  /oden:review branch       → Code review                     ║
║  /oden:daily               → Log diario                      ║
║  /oden:git pr              → Create PR                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FILOSOFÍA                                                   ║
║                                                              ║
║  ✅ Documenta TODO antes de codificar                        ║
║  ✅ Analiza 3+ competidores                                  ║
║  ✅ Specs de 800+ líneas por módulo                          ║
║  ✅ Progreso diario documentado                              ║
║  ✅ Define máquinas de estado                                ║
║                                                              ║
║  ❌ NO empieces sin specs completas                          ║
║  ❌ NO documentes cambios triviales                          ║
║  ❌ NO dupliques información                                 ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  MÁS INFO                                                    ║
║                                                              ║
║  /oden:help workflow    - Flujo detallado                    ║
║  /oden:help agents      - Sobre los agentes                  ║
║  /oden:help faq         - Preguntas frecuentes               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Help: Workflow

```
╔══════════════════════════════════════════════════════════════╗
║                    FLUJO DE TRABAJO ODEN                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  FASE 1: PRE-DESARROLLO (1-2 semanas)                        ║
║  ════════════════════════════════════                        ║
║                                                              ║
║  Objetivo: Documentar TODO antes de escribir código          ║
║                                                              ║
║  Día 1-2: /oden:init + /oden:architect                       ║
║  ├─ Inicializar proyecto                                     ║
║  ├─ Definir stack tecnológico                                ║
║  ├─ Diseñar schema de BD                                     ║
║  └─ Documentar arquitectura (2000+ líneas)                   ║
║                                                              ║
║  Día 3-7: /oden:spec (por módulo)                            ║
║  ├─ Spec de auth (800+ líneas)                               ║
║  ├─ Spec de módulo principal                                 ║
║  └─ Specs de otros módulos                                   ║
║                                                              ║
║  Día 9: /oden:checklist                                      ║
║  └─ Verificar TODO completo antes de codificar               ║
║                                                              ║
║  ════════════════════════════════════════════════════════════║
║                                                              ║
║  FEATURE PIPELINE (por cada feature)                         ║
║  ════════════════════════════════════                        ║
║                                                              ║
║  /oden:prd auth         → Crear PRD con brainstorming        ║
║  /oden:epic auth        → PRD -> Epic con work streams       ║
║  /oden:tasks auth       → Epic -> Issues individuales        ║
║  /oden:sync auth        → Push a GitHub Issues               ║
║                                                              ║
║  ════════════════════════════════════════════════════════════║
║                                                              ║
║  FASE 2: IMPLEMENTACION (8-18 semanas)                       ║
║  ═════════════════════════════════════                       ║
║                                                              ║
║  /oden:work epic/auth   → Orquestador con Teams              ║
║                                                              ║
║  Cada dia:                                                   ║
║  ├─ Trabajar segun plan                                      ║
║  ├─ Seguir specs al pie de la letra                          ║
║  └─ /oden:daily al final del dia                             ║
║                                                              ║
║  Cada semana:                                                ║
║  ├─ Review de progreso                                       ║
║  ├─ Ajustar plan si necesario                                ║
║  └─ Validar contra specs                                     ║
║                                                              ║
║  Cada milestone:                                             ║
║  ├─ Demo con stakeholders                                    ║
║  ├─ QA intensivo                                             ║
║  └─ Actualizar documentación                                 ║
║                                                              ║
║  ════════════════════════════════════════════════════════════║
║                                                              ║
║  FASE 3: POST-DESARROLLO                                     ║
║  ════════════════════════════                                ║
║                                                              ║
║  ├─ Mover docs a completed/                                  ║
║  ├─ Archivar docs obsoletos                                  ║
║  ├─ Crear guías de usuario                                   ║
║  └─ Mantener índices actualizados                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Help: Agents

```
╔══════════════════════════════════════════════════════════════╗
║                 AGENTES DE DESARROLLO                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  INSTALACIÓN: /oden:init-agents [categoría]                  ║
║                                                              ║
║  Categorías disponibles:                                     ║
║  • core      → Agentes esenciales (7)                        ║
║  • frontend  → React, Vue, UX (4)                            ║
║  • backend   → APIs, BD, arquitectura (5)                    ║
║  • mobile    → React Native, iOS (2)                         ║
║  • devops    → CI/CD, deploy (3)                             ║
║  • data      → ETL, análisis (3)                             ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  🔧 AGENTES CORE (instalados por defecto)                    ║
║  ─────────────────────────────────────                       ║
║  fullstack-developer   Desarrollo end-to-end                 ║
║  code-reviewer         Revisión de código                    ║
║  debugger              Debugging de errores                  ║
║  test-engineer         Estrategia de testing                 ║
║  code-analyzer         Análisis de código                    ║
║  technical-writer      Documentación                         ║
║  git-flow-manager      Workflow de Git                       ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  USO VIA /oden:work (auto-selecciona agentes)                ║
║  ──────────────────────────────────────────                  ║
║  /oden:work epic/auth   → Orquesta agentes automaticamente   ║
║  /oden:test run         → Testing                            ║
║  /oden:debug            → Debugging                          ║
║  /oden:review           → Code review                        ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  NOTA: Los agentes son archivos .md en ~/.claude/agents/     ║
║  que definen roles especializados para el Task tool.         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

## Help: FAQ

```
╔══════════════════════════════════════════════════════════════╗
║                   PREGUNTAS FRECUENTES                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  P: ¿Por qué tanta documentación antes de codificar?         ║
║  ─────────────────────────────────────────────────           ║
║  R: Porque documentar primero:                               ║
║     • Evita retrabajo (90% menos bugs de diseño)             ║
║     • Acelera desarrollo (el dev sabe qué construir)         ║
║     • Reduce ambigüedad (specs claras = menos preguntas)     ║
║     • Facilita colaboración (todos entienden el proyecto)    ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  P: ¿Puedo saltar algún paso?                                ║
║  ─────────────────────────────                               ║
║  R: NO recomendado. Cada paso construye sobre el anterior.   ║
║     Si saltas:                                               ║
║     • Sin architect → Decisiones inconsistentes              ║
║     • Sin specs → Implementación ambigua                     ║
║     • Sin plan → Caos y retrabajo                            ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  P: ¿Qué es MVP vs Modo Turbo?                               ║
║  ─────────────────────────────                               ║
║  R: Son dos enfoques de scope:                               ║
║                                                              ║
║     MVP (8-10 semanas):                                      ║
║     • 30-40% de features                                     ║
║     • Rápido al mercado                                      ║
║     • Mayor deuda técnica                                    ║
║                                                              ║
║     Modo Turbo (14-20 semanas):                              ║
║     • 100% features profesionales                            ║
║     • Enterprise-ready desde día 1                           ║
║     • Menor deuda técnica                                    ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  P: ¿Cuántas líneas es "suficiente" documentación?           ║
║  ───────────────────────────────────────────────             ║
║  R: Como mínimo:                                             ║
║     • technical-decisions.md: 2000+ líneas                   ║
║     • competitive-analysis.md: 1000+ líneas                  ║
║     • {module}-spec.md: 800+ líneas cada uno                 ║
║     • Total antes de código: 8000+ líneas                    ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  P: ¿Qué hago si cambio algo durante desarrollo?             ║
║  ───────────────────────────────────────────────             ║
║  R: Actualiza la documentación correspondiente:              ║
║     • Si es técnico → technical-decisions.md                 ║
║     • Si es feature → spec del módulo                        ║
║     • Documenta el "por qué" del cambio                      ║
║     • Registra en el daily log                               ║
║                                                              ║
║  ──────────────────────────────────────────────────────────  ║
║                                                              ║
║  P: ¿Funciona para proyectos pequeños?                       ║
║  ─────────────────────────────────────                       ║
║  R: Sí, pero ajusta el nivel de detalle:                     ║
║     • Proyecto pequeño: 4000+ líneas total                   ║
║     • Proyecto mediano: 8000+ líneas total                   ║
║     • Proyecto grande: 15000+ líneas total                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```
