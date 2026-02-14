# Oden Forge

**Forja proyectos profesionales desde cero usando la metodología Documentation-First Development.**

Oden Forge es un sistema de skills para Claude Code que guía a desarrolladores a través de un wizard inteligente para crear proyectos completos siguiendo las mejores prácticas de la metodología Oden.

## Filosofía

> "Documenta y diseña COMPLETAMENTE antes de codificar"

La metodología Oden se basa en tres principios:

1. **Documentation-First**: Todo se documenta antes de escribir código
2. **Design Sprint Adaptado**: Diseño rápido → Validación → Iteración
3. **Entrega incremental**: Valor tangible cada semana

## 🚀 Instalación

### Método 1: NPM (Recomendado)
```bash
# Instalación global
npm install -g oden-forge

# Uso inmediato en cualquier proyecto
cd tu-proyecto
claude-code
/oden:init
```

### Método 2: Instalación Directa
```bash
# One-liner desde GitHub
curl -fsSL https://raw.githubusercontent.com/javikin/oden-forge/main/install-direct.sh | bash

# O descargar y ejecutar
wget https://raw.githubusercontent.com/javikin/oden-forge/main/install-direct.sh
chmod +x install-direct.sh
./install-direct.sh
```

### Método 3: Git Clone (Legacy)
```bash
git clone https://github.com/javikin/oden-forge.git
cd oden-forge
./install.sh
```

### ✅ Verificar Instalación
```bash
# Si instalaste con NPM
oden-forge status

# Si no funciona (común con ASDF/NVM):
npx oden-forge status

# En Claude Code (todos los métodos)
/oden:help
```

### 🔧 Troubleshooting

#### ❌ "command not found: oden-forge"
**Causa**: Usas ASDF, NVM u otro Node version manager.

**Solución 1 (Rápida)**:
```bash
# Usar npx (funciona siempre)
npx oden-forge status
npx oden-forge migrate
```

**Solución 2 (Permanente)**:
```bash
# Arreglar PATH
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
oden-forge status  # Ahora debería funcionar
```

## 🚀 Comandos Esenciales (Solo 8)

| Comando | Descripción | Funcionalidad |
|---------|-------------|---------------|
| `/oden:init` | **Wizard completo** | Setup + agentes + MCPs + configuración |
| `/oden:architect` | **Decisiones técnicas** | Architecture + specs + DB schema + checklist |
| `/oden:prd` | **PRD inteligente** | Product requirements con brainstorming |
| `/oden:epic` | **Epic + Tasks** | Work streams + descomposición automática |
| `/oden:work` | **🔥 Orquestador** | Desarrollo con Teams + debug + test + research |
| `/oden:sync` | **GitHub nativo** | Issues + branches + PRs (sin CCPM) |
| `/oden:mcp` | **Gestión MCPs** | Install + recommend + manage |
| `/oden:help` | **Ayuda completa** | Guías + docs + troubleshooting |

---

## Agentes de Desarrollo (`/oden:dev`)

Durante la implementación, invoca agentes especializados:

### Desarrollo de Código
| Comando | Agente | Uso |
|---------|--------|-----|
| `/oden:dev fullstack` | fullstack-developer | Desarrollo end-to-end |
| `/oden:dev frontend` | frontend-developer | UI/React components |
| `/oden:dev backend` | backend-architect | APIs y servicios |
| `/oden:dev mobile` | mobile-developer | React Native/Flutter |
| `/oden:dev ios` | ios-developer | Swift/SwiftUI nativo |

### Base de Datos
| Comando | Agente | Uso |
|---------|--------|-----|
| `/oden:dev db` | database-architect | Diseño de schema |
| `/oden:dev db-optimize` | database-optimization | Optimizar queries |
| `/oden:dev supabase` | supabase-schema-architect | Supabase específico |

### Testing y QA
| Comando | Agente | Uso |
|---------|--------|-----|
| `/oden:dev test` | test-engineer | Estrategia de testing |
| `/oden:dev debug` | debugger | Debugging de errores |
| `/oden:dev review` | code-reviewer | Code review |

### DevOps
| Comando | Agente | Uso |
|---------|--------|-----|
| `/oden:dev devops` | devops-engineer | CI/CD, infraestructura |
| `/oden:dev deploy` | deployment-engineer | Deployments |
| `/oden:dev perf` | performance-engineer | Performance tuning |

### Utilidades
| Comando | Agente | Uso |
|---------|--------|-----|
| `/oden:dev git` | git-flow-manager | Git workflow |
| `/oden:dev docs` | technical-writer | Documentación |
| `/oden:dev analyze-code` | code-analyzer | Análisis de código |

---

## Testing (`/oden:test`)

| Comando | Descripción |
|---------|-------------|
| `/oden:test strategy` | Crear estrategia de testing |
| `/oden:test run` | Ejecutar tests y analizar |
| `/oden:test fix` | Analizar fallos y sugerir fixes |
| `/oden:test coverage` | Analizar cobertura |
| `/oden:test generate [mod]` | Generar tests desde specs |

---

## Debugging (`/oden:debug`)

| Comando | Descripción |
|---------|-------------|
| `/oden:debug error [msg]` | Analizar error y sugerir solución |
| `/oden:debug logs [file]` | Analizar logs para patrones |
| `/oden:debug trace [fn]` | Trazar flujo de función |
| `/oden:debug perf [area]` | Analizar performance |
| `/oden:debug compare [branch]` | Comparar para encontrar regresión |

---

## Research (`/oden:research`)

| Comando | Descripción |
|---------|-------------|
| `/oden:research how [pregunta]` | Cómo implementar algo |
| `/oden:research compare [a] vs [b]` | Comparar tecnologías |
| `/oden:research best-practice [topic]` | Mejores prácticas |
| `/oden:research library [name]` | Investigar librería |
| `/oden:research docs [lib] [topic]` | Buscar documentación |

---

## Git Workflow (`/oden:git`)

| Comando | Descripción |
|---------|-------------|
| `/oden:git start [feature]` | Iniciar nueva feature |
| `/oden:git sync` | Sincronizar con main |
| `/oden:git pr` | Preparar y crear PR |
| `/oden:git status` | Estado detallado |
| `/oden:git finish` | Finalizar feature |

---

## El Wizard `/oden:init`

El wizard te guía a través de:

### 1. Tipo de Proyecto
- Web Application (React, Next.js, Vue, etc.)
- Mobile App (React Native, Flutter, iOS, Android)
- Backend/API (Node.js, Python, Go, etc.)
- Full-Stack (combinaciones)

### 2. Nivel de Experiencia
- Principiante: Explicaciones detalladas + guías de System Design
- Intermedio: Guías contextuales + mejores prácticas
- Avanzado: Solo lo esencial, decisiones rápidas

### 3. Scope del Proyecto
- MVP (8-10 semanas): 30-40% features, rápido al mercado
- Modo Turbo (14-20 semanas): 100% profesional, enterprise-ready

### 4. Stack Tecnológico
Basado en tus respuestas, recomienda:
- Framework frontend/backend
- Base de datos
- Servicios cloud
- Herramientas de desarrollo

### 5. Estructura de Documentación
Crea automáticamente:
```
docs/
├── README.md
├── guides/
├── reference/
│   ├── technical-decisions.md
│   ├── competitive-analysis.md
│   ├── implementation-plan.md
│   └── modules/
├── development/
│   ├── current/
│   └── completed/
├── archived/
└── temp/
```

---

## Agentes Pre-Desarrollo

| Agente | Rol | Entregables |
|--------|-----|-------------|
| `technical-architect` | Arquitectura y decisiones técnicas | technical-decisions.md (2000+ líneas) |
| `domain-expert` | Análisis de competencia y requisitos | competitive-analysis.md, user stories |
| `spec-writer` | Especificaciones detalladas | Specs de 800-1200 líneas por módulo |
| `implementation-planner` | Planificación semana por semana | implementation-plan.md |
| `daily-logger` | Documentación de progreso | DAY_X_COMPLETED.md |

---

## Métricas de Éxito

### Durante Desarrollo
- 100% de módulos definidos antes de codificar
- 0 dependencias circulares
- Documentación > 8,000 líneas antes de primera línea de código
- Progreso diario documentado

### Post-Lanzamiento
- Performance: < 100ms latencia crítica
- Uptime: 99.9%
- User satisfaction: NPS > 50

---

## Estructura del Proyecto

```
oden/
├── .claude/
│   ├── commands/oden/      # 52 comandos unificados
│   ├── scripts/oden/       # 14 scripts de soporte
│   ├── hooks/              # Hooks de git
│   ├── rules/              # 10 reglas de metodología
│   ├── prds/               # PRDs locales
│   └── epics/              # Epics locales
├── install.sh              # Instalador automático
├── INSTALL.md              # Guía de instalación
└── README.md
```

---

## Flujo de Trabajo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                  SETUP INICIAL                              │
├─────────────────────────────────────────────────────────────┤
│  /oden:init             →  Wizard de proyecto               │
│  /oden:init-agents      →  Instalar agentes de desarrollo   │
│  /oden:init-mcp         →  Instalar MCPs recomendados       │
│  /oden:sync setup       →  Configurar GitHub                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    PRE-DESARROLLO (1-2 semanas)             │
├─────────────────────────────────────────────────────────────┤
│  /oden:architect     →  technical-decisions.md (2000+ loc)  │
│     ↓                                                       │
│  /oden:analyze       →  competitive-analysis.md             │
│     ↓                                                       │
│  /oden:spec auth     →  auth-spec.md (800+ loc)            │
│  /oden:spec orders   →  orders-spec.md (800+ loc)          │
│     ↓                                                       │
│  /oden:plan          →  implementation-plan.md              │
│     ↓                                                       │
│  /oden:checklist     →  ✅ Ready to code!                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CREAR FEATURES (CCPM)                    │
├─────────────────────────────────────────────────────────────┤
│  /oden:sync prd auth      →  Crear PRD                      │
│     ↓                                                       │
│  /oden:sync epic auth     →  Convertir a Epic técnico       │
│     ↓                                                       │
│  /oden:sync tasks auth    →  Descomponer en tasks           │
│     ↓                                                       │
│  /oden:sync github auth   →  Push a GitHub como issues      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DESARROLLO (8-18 semanas)                │
├─────────────────────────────────────────────────────────────┤
│  /oden:sync start auth    →  Iniciar epic (worktree)        │
│     ↓                                                       │
│  /oden:sync issue #123    →  Trabajar en issue              │
│  /oden:dev fullstack      →  Implementar según specs        │
│  /oden:test run           →  Ejecutar tests                 │
│  /oden:debug error        →  Resolver problemas             │
│     ↓                                                       │
│  /oden:daily              →  DAY_X_COMPLETED.md             │
│     ↓                                                       │
│  /oden:sync close #123    →  Cerrar issue                   │
│  /oden:review             →  Code review                    │
│  /oden:git pr             →  Create PR                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Requisitos

```bash
# GitHub CLI instalado y autenticado (para sync con GitHub)
gh auth status

# Git configurado
git --version
```

---

## Inspiración

Oden está inspirado en:
- [CCPM](https://github.com/automazeio/ccpm) - Claude Code Project Manager
- Metodología Oden - Documentation-First Development
- Design Sprints de Google Ventures

## Contribuir

¿Ideas para mejorar Oden Forge? Abre un issue o PR.

## Licencia

MIT
