# Oden Forge

[![NPM Version](https://img.shields.io/npm/v/oden-forge)](https://npmjs.com/package/oden-forge)
[![Downloads](https://img.shields.io/npm/dm/oden-forge)](https://npmjs.com/package/oden-forge)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://javikin.github.io/oden-forge)

**Sistema de skills para Claude Code que implementa la metodología Documentation-First Development**

> "Documenta y diseña COMPLETAMENTE antes de codificar"

## 🎯 Filosofía Core

**Documentation-First Development** con tres principios fundamentales:

1. **Documentation-First** - Todo se documenta antes de codificar
2. **Design Sprint Adaptado** - Diseño rápido → Validación → Iteración
3. **Entrega Incremental** - Valor tangible cada semana

## 🚀 Instalación Ultra-Rápida

```bash
# Instalación NPM (recomendado)
npm install -g oden-forge

# Verificar instalación
oden-forge --version  # 2.2.1

# Wizard de setup
cd tu-proyecto
/oden:init
```

## ⚡ 8 Comandos Esenciales

### Setup y Configuración
- **`/oden:init`** - Wizard interactivo completo para crear proyectos
- **`/oden:mcp`** - Gestionar MCPs (install, status, update, recommend)
- **`/oden:help`** - Documentación completa y guías

### Pre-Desarrollo (ejecutar en orden)
- **`/oden:architect`** - Technical decisions + DB schema (2000+ líneas)
- **`/oden:prd`** - PRD con brainstorming inteligente
- **`/oden:epic`** - PRD → Epic técnico con work streams

### Desarrollo Inteligente ⭐
- **`/oden:work`** - **Orquestador automático** con Teams y agentes paralelos
- **`/oden:debug`** - **🆕 Queue-Based Debug Orchestration** - debugging continuo
- **`/oden:sync`** - Sincronización perfecta con GitHub Issues

## 🔥 Nuevas Funcionalidades v2.2.1

### `/oden:debug` - Revolutionary Debugging System

**Queue-based orchestration** para debugging continuo con máximo contexto:

```bash
/oden:debug                    # Iniciar sesión interactiva

debug> add "fix login validation error"
debug> add "improve test coverage"
debug> status                  # Ver progreso en tiempo real
debug> priority 1 "critical: production issue"
```

**Características:**
- ✅ **Cola inteligente** con auto-detección de dependencias
- ✅ **8+ agentes especializados** (debugger, test-engineer, security-auditor...)
- ✅ **Context preservation** máximo entre tareas
- ✅ **Smart agent selection** basada en tipo de error
- ✅ **Session recovery** para sesiones interrumpidas
- ✅ **Auto-close** después de 30min de inactividad

### `/oden:work` - Intelligent Orchestrator

**Orquestador supremo** que selecciona automáticamente agentes especializados:

```bash
/oden:work epic-auth         # Teams paralelos automáticos
/oden:work smart             # Análisis inteligente del contexto
/oden:work config            # Configuración personalizada
```

**Agentes disponibles:** fullstack, frontend, backend, mobile, ios, database-architect, test-engineer, debugger, performance-engineer, security-auditor, devops-engineer, y más.

## 🏗️ Flujo de Trabajo Completo

```mermaid
graph LR
    A[/oden:init] --> B[/oden:architect]
    B --> C[/oden:prd]
    C --> D[/oden:epic]
    D --> E[/oden:work]
    E --> F[/oden:debug]
    F --> G[/oden:sync]
```

### 1. Inicialización
```bash
/oden:init                   # Wizard completo
```

### 2. Pre-Desarrollo (Documentation-First)
```bash
/oden:architect              # Technical decisions (2000+ líneas)
/oden:prd feature-auth       # PRD con competitive analysis
/oden:epic feature-auth      # Epic + work streams + tasks
```

### 3. Desarrollo con Teams
```bash
/oden:work epic-auth         # Desarrollo paralelo automático
/oden:debug                  # Debugging continuo
/oden:sync feature-auth      # Push to GitHub Issues
```

## 📊 Métricas de Éxito

### Pre-Desarrollo
- ✅ **100%** módulos definidos antes de codificar
- ✅ **8,000+** líneas de documentación
- ✅ **0** dependencias circulares
- ✅ Schema de BD completo

### Durante Desarrollo
- ✅ **Daily progress** logging automático
- ✅ **Context preservation** 95%+
- ✅ **Agent efficiency** 85%+
- ✅ **Success rate** en debugging 90%+

### Post-Lanzamiento
- ✅ **Performance:** < 100ms latencia crítica
- ✅ **Uptime:** 99.9%
- ✅ **NPS:** > 50

## 🎨 Integración con MCP

**Model Context Protocol** para funcionalidades avanzadas:

```bash
/oden:mcp install           # MCPs recomendados automáticos
/oden:mcp status            # Estado de todos los MCPs
/oden:mcp recommend         # Recomendaciones personalizadas
```

**MCPs incluidos:** Browser automation, iOS Simulator, Memory management, Notion integration, y más.

## 🏆 Casos de Uso Exitosos

- **Startups** - MVP en 8-10 semanas con specs completas
- **Enterprise** - Productos profesionales en 14-20 semanas
- **Development Teams** - Coordinación perfecta con Teams paralelos
- **Solo Developers** - Metodología estructurada y agentes especializados

## 📚 Estructura de Documentación

```
docs/
├── guides/                 # Guías permanentes
├── reference/             # Documentación técnica
│   ├── technical-decisions.md
│   └── modules/
├── development/
│   ├── current/           # Work in progress
│   └── completed/         # Features terminadas
└── archived/             # Documentación histórica
```

## 🔧 Reglas de Oro

### ✅ SIEMPRE
1. **Documenta** TODO antes de codificar
2. **Analiza** 3+ competidores mínimo
3. **Crea specs** de 800+ líneas por módulo
4. **Registra** progreso diario

### ❌ NUNCA
1. **No empieces** sin specs completas
2. **No documentes** cambios triviales
3. **No dupliques** información

## 🌟 ¿Por qué Oden Forge?

- **🎯 Metodología probada** - Documentation-First Development
- **🤖 Agentes inteligentes** - 15+ especialistas automáticos
- **⚡ Setup ultra-rápido** - `npm install` y listo
- **🔄 Debugging revolucionario** - Queue-based orchestration
- **📈 Métricas reales** - Success rate 90%+
- **🏗️ Escalable** - De MVP a Enterprise
- **🎨 Integración perfecta** - Claude Code + GitHub + MCP

## 🛠️ Troubleshooting

### Instalación
```bash
# Si no encuentra el comando
npm install -g oden-forge@latest

# PATH issues (macOS/ASDF)
export PATH="$HOME/.npm-packages/bin:$PATH"
```

### Migración v1 → v2.2.1
```bash
oden-forge migrate          # Auto-migración detectada
```

### Debug Common Issues
```bash
/oden:debug
debug> add "investigate installation issues"
debug> add "check PATH configuration"
debug> add "verify MCP connections"
```

## 📖 Documentación Completa

- **[GitHub Pages](https://javikin.github.io/oden-forge)** - Documentación completa
- **[NPM Package](https://npmjs.com/package/oden-forge)** - Instalación oficial
- **[GitHub Repository](https://github.com/javikin/oden-forge)** - Código fuente

## 🤝 Contribuir

```bash
git clone https://github.com/javikin/oden-forge.git
cd oden-forge
npm install
```

## 📄 Licencia

MIT License - Consulta [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**[⭐ Star en GitHub](https://github.com/javikin/oden-forge)** | **[📦 NPM Package](https://npmjs.com/package/oden-forge)** | **[📚 Documentación](https://javikin.github.io/oden-forge)**

*Construido con ❤️ para developers que valoran la calidad y la metodología*

</div>