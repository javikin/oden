# Instalación de Oden Forge

## Instalación Rápida (Recomendada)

```bash
# 1. Clonar el repositorio (reemplaza "mi-proyecto" con el nombre de tu proyecto)
git clone https://github.com/javikin/oden.git mi-proyecto
cd mi-proyecto

# 2. Ejecutar el instalador
./install.sh
```

El instalador configura todo automáticamente:
- ✅ Comandos `/oden:*` (52 comandos unificados)
- ✅ Scripts de soporte
- ✅ Hooks
- ✅ Rules de Claude
- ✅ Carpetas prds/ y epics/
- ✅ GitHub CLI (opcional)
- ✅ Agentes de desarrollo (opcional)

---

## Instalación Manual

Si prefieres instalar manualmente:

```bash
# Crear directorios
mkdir -p ~/.claude/commands/oden
mkdir -p ~/.claude/scripts/oden
mkdir -p ~/.claude/hooks
mkdir -p ~/.claude/rules
mkdir -p ~/.claude/prds
mkdir -p ~/.claude/epics

# Copiar comandos (52 comandos unificados)
cp -r .claude/commands/oden/* ~/.claude/commands/oden/

# Copiar scripts
cp -r .claude/scripts/oden/* ~/.claude/scripts/oden/
chmod +x ~/.claude/scripts/oden/*.sh

# Copiar hooks
cp -r .claude/hooks/* ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh

# Copiar rules
cp -r .claude/rules/* ~/.claude/rules/

# Crear archivos .gitkeep
touch ~/.claude/prds/.gitkeep
touch ~/.claude/epics/.gitkeep
```

---

## Configuración de GitHub CLI

Para usar sync con GitHub, necesitas GitHub CLI.

### Instalar GitHub CLI

**macOS:**
```bash
brew install gh
```

**Ubuntu/Debian:**
```bash
sudo apt install gh
```

**Windows:**
```bash
winget install GitHub.cli
```

### Autenticar (una sola vez)

```bash
# Login interactivo
gh auth login

# Seguir las instrucciones:
# 1. GitHub.com
# 2. HTTPS
# 3. Yes (autenticar Git)
# 4. Login with browser
```

### Verificar

```bash
gh auth status
# ✓ Logged in to github.com as tu-usuario
```

---

## Instalar Agentes

Después de instalar, dentro de Claude Code:

```bash
/oden:init-agents
```

Categorías:
| Categoría | Agentes |
|-----------|---------|
| `core` | fullstack, code-reviewer, debugger, test-engineer... |
| `frontend` | frontend-developer, ui-ux-designer, javascript-pro... |
| `backend` | backend-architect, database-architect, python-pro... |
| `mobile` | mobile-developer, ios-developer |
| `devops` | devops-engineer, deployment-engineer... |
| `data` | data-engineer, data-analyst, data-scientist |

---

## Instalar MCPs

Dentro de Claude Code:

```bash
/oden:init-mcp
```

MCPs disponibles:
| MCP | Uso |
|-----|-----|
| `context7` | Documentación de librerías |
| `figma` | Diseños |
| `playwright` | Testing E2E |
| `ios-simulator` | Testing iOS |
| `supabase` | Base de datos |
| `vercel` | Deploy |

---

## Verificar Instalación

```bash
# Ver comandos instalados
ls ~/.claude/commands/oden/

# En Claude Code
/oden:help
```

---

## Estructura Instalada

```
~/.claude/
├── commands/
│   └── oden/           # 52 comandos unificados
├── scripts/
│   └── oden/           # 14 scripts
├── hooks/              # Hooks de git
├── rules/              # 10 rules
├── prds/               # PRDs locales
├── epics/              # Epics locales
└── agents/             # Agentes (opcional)
```

---

## Primer Proyecto

```bash
# Crear proyecto
mkdir mi-proyecto && cd mi-proyecto
git init

# En Claude Code
/oden:init
```

---

## Actualizar

```bash
cd oden-forge
git pull
./install.sh
```

---

## Desinstalar

```bash
rm -rf ~/.claude/commands/oden
rm -rf ~/.claude/scripts/oden
rm -rf ~/.claude/hooks
rm -rf ~/.claude/prds
rm -rf ~/.claude/epics
# Cuidado con rules y agents si tienes otros
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Comando no encontrado | Verificar: `ls ~/.claude/commands/oden/` |
| gh: command not found | Instalar: `brew install gh` |
| Not logged in to GitHub | Ejecutar: `gh auth login` |
| Comandos no aparecen | Reiniciar Claude Code |

---

## Soporte

- Issues: https://github.com/tu-usuario/oden-forge/issues
- Help: `/oden:help`
