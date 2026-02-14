# Oden Forge

Sistema de skills para crear proyectos profesionales usando la metodología Documentation-First Development.

## Filosofía Core

> "Documenta y diseña COMPLETAMENTE antes de codificar"

## Comandos Disponibles

### Setup
- `/oden:init` - Wizard interactivo para crear proyecto
- `/oden:init-agents` - Instalar agentes de desarrollo
- `/oden:init-mcp` - Instalar MCPs recomendados
- `/oden:mcp [sub]` - Gestionar MCPs (install, status, update, recommend)
- `/oden:help` - Mostrar ayuda

### Pre-Desarrollo (ejecutar en orden)
1. `/oden:architect` - Technical decisions + DB schema
2. `/oden:spec [módulo]` - Especificación de módulo
3. `/oden:checklist` - Verificar todo listo

### Feature Pipeline
1. `/oden:prd [nombre]` - Crear PRD con brainstorming inteligente
2. `/oden:epic [nombre]` - PRD -> Epic tecnico con work streams
3. `/oden:tasks [nombre]` - Descomponer Epic en issues
4. `/oden:sync [nombre]` - Sincronizar con GitHub Issues
5. `/oden:sync status` - Ver estado de sincronizacion

### Durante Desarrollo
- `/oden:work [epic/issue]` - Orquestador inteligente con Teams (auto/config/smart)
- `/oden:test [sub]` - Testing
- `/oden:debug [sub]` - Debugging
- `/oden:git [sub]` - Git workflow
- `/oden:research [topic]` - Investigación técnica
- `/oden:daily` - Registrar progreso del día
- `/oden:review [scope]` - Code review antes de merge

## Reglas de Oro

### ✅ SIEMPRE
1. Documenta TODO antes de codificar
2. Analiza 3+ competidores
3. Crea specs de 800+ líneas por módulo
4. Registra progreso diario

### ❌ NUNCA
1. No empieces a codificar sin specs completas
2. No documentes cambios triviales
3. No dupliques información

## Estructura de Documentación

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

## Métricas de Éxito

- technical-decisions.md: 2000+ líneas
- competitive-analysis.md: 1000+ líneas
- Specs de módulos: 800+ líneas c/u
- Total pre-código: 8000+ líneas
