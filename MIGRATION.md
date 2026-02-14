# 🔄 Migración de Oden Forge v1 → v2

Esta guía te ayudará a migrar de Oden Forge v1 (o CCPM) a la nueva versión 2.0.

## 📋 Resumen de Cambios

### ✅ Lo que MEJORA en v2:
- **67% menos comandos** (57 → 19 comandos esenciales)
- **Teams integrado** para desarrollo paralelo
- **CCPM nativo** (sin dependencia externa)
- **Gestión de MCPs** con instalación one-click
- **Documentación profesional** con GitHub Pages

### ⚠️ Lo que CAMBIA:
- Comandos `/pm:*` → `/oden:*`
- Estructura de archivos simplificada
- Workflow con Teams para epics grandes

---

## 🚀 Métodos de Migración

### Opción 1: Automática (Recomendado)

```bash
# Instalar v2 con migración automática
npm install -g oden-forge

# Si necesitas forzar migración manual:
oden-forge migrate
```

### Opción 2: Manual

```bash
# 1. Backup de datos importantes
cp -r ~/.claude/prds ~/.claude/prds.backup
cp -r ~/.claude/epics ~/.claude/epics.backup

# 2. Limpiar instalación anterior
rm -rf ~/.claude/commands/pm
rm -rf ~/.claude/commands/ccpm
rm -rf ~/.claude/scripts/pm
rm -rf ~/.ccpm

# 3. Instalar v2
npm install -g oden-forge
```

---

## 🔧 Proceso Detallado de Migración

### 1. Pre-Migración: Backup de Datos

La herramienta preserva automáticamente:
- ✅ PRDs existentes en `~/.claude/prds/`
- ✅ Epics existentes en `~/.claude/epics/`
- ✅ Configuraciones de proyecto
- ✅ Archivos de documentación en `docs/`

### 2. Detección Automática

El migrador detecta y limpia:

| Componente | Ubicación v1 | Acción |
|------------|-------------|---------|
| Comandos PM | `~/.claude/commands/pm/` | **Reemplazar** por `/oden:*` |
| Comandos CCPM | `~/.claude/commands/ccmp/` | **Reemplazar** por nativos |
| Scripts PM | `~/.claude/scripts/pm/` | **Actualizar** |
| CCMP Installation | `~/.ccmp/` | **Archivar y remover** |
| Rules antiguas | `~/.claude/rules/` | **Actualizar selectivamente** |

### 3. Mapeo de Comandos

| Comando v1 | Comando v2 | Cambios |
|------------|------------|---------|
| `/pm:init` | `/oden:init` | ✅ Mismo wizard mejorado |
| `/pm:prd-new` | `/oden:prd` | ✅ Brainstorming inteligente |
| `/pm:epic-decompose` | `/oden:epic` | ✅ Work streams + Teams |
| `/pm:issue-start` | `/oden:work` | ✅ Orquestador inteligente |
| `/pm:sync` | `/oden:sync` | ✅ 100% nativo, sin CCPM |
| `/pm:daily` | `/oden:daily` | ✅ Sin cambios |
| **37 comandos legacy** | **Removidos** | Simplificación |

---

## ⚡ Quick Start Post-Migración

### 1. Verificar Instalación
```bash
oden-forge status
```

### 2. Primer Proyecto v2
```bash
# En tu proyecto
claude-code  # O tu comando de Claude Code

# Dentro de Claude Code:
/oden:init    # Wizard mejorado
/oden:mcp recommend  # Nuevo: gestión de MCPs
```

### 3. Workflow Mejorado
```bash
# Flujo típico v2:
/oden:prd feature-name     # PRD con brainstorming
/oden:epic feature-name    # Epic con work streams
/oden:tasks feature-name   # Descomposición automática
/oden:work feature-name    # Teams para desarrollo paralelo
/oden:sync feature-name    # Sync nativo con GitHub
```

---

## 🔍 Verificación de Migración

### Comando de Status
```bash
oden-forge status
```

**Output esperado:**
```
📋 Oden Forge Status
══════════════════════════════════════════════════
✅ Installed: 19 commands
   Location: /Users/tu-usuario/.claude/commands/oden

💡 Quick Start:
   1. cd your-project
   2. claude-code
   3. /oden:init
```

### Comandos Disponibles Post-Migración
```bash
/oden:init          # Wizard de inicialización
/oden:architect     # Decisiones técnicas
/oden:prd           # PRDs con brainstorming
/oden:epic          # Epic con work streams
/oden:tasks         # Descomposición de tasks
/oden:work          # Orquestador con Teams
/oden:sync          # Sync nativo con GitHub
/oden:mcp           # Gestión de MCPs
/oden:help          # Ayuda integrada
```

---

## ❓ Troubleshooting

### ❌ "Command not found: oden-forge"
```bash
# Reinstalar globalmente
npm uninstall -g oden-forge
npm install -g oden-forge
```

### ❌ "Legacy installations detected"
```bash
# Migración manual
oden-forge migrate
```

### ❌ "Commands not working in Claude Code"
```bash
# Verificar instalación
oden-forge status

# Reinstalar si es necesario
oden-forge install --force
```

### ❌ "Lost my old PRDs/Epics"
```bash
# Buscar backups automáticos
ls ~/.claude/*.backup*
ls ~/.claude/prds.backup/
ls ~/.claude/epics.backup/
```

---

## 🆘 Soporte

### GitHub Issues
- **Bug reports**: https://github.com/javikin/oden-forge/issues
- **Feature requests**: https://github.com/javikin/oden-forge/discussions

### Documentación
- **Guía completa**: https://javikin.github.io/oden-forge
- **Help integrado**: `/oden:help`

### Rollback (Si es necesario)
```bash
# Solo en caso de emergencia - volver a v1
npm uninstall -g oden-forge

# Restaurar backup
mv ~/.claude/prds.backup ~/.claude/prds
mv ~/.claude/epics.backup ~/.claude/epics

# Reinstalar v1 manualmente desde backup
```

---

## 🎯 Próximos Pasos

1. ✅ **Completar migración** usando esta guía
2. 🆕 **Probar nuevas features** (Teams, MCPs, brainstorming)
3. 📚 **Explorar documentación** en GitHub Pages
4. 💡 **Dar feedback** para futuras mejoras

**¡Bienvenido a Oden Forge 2.0!** 🎉