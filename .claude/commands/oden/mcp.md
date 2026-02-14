---
allowed-tools: Bash, Read, Write, Edit, LS, Glob
description: Gestionar MCPs - instalar, verificar estado, actualizar y recomendar MCPs para el proyecto
---

# Oden Forge - MCP Management

Gestiona Model Context Protocol (MCP) servers para potenciar el desarrollo con herramientas externas.

## Usage

```
/oden:mcp [subcommand] [args]
```

## Subcomandos

| Subcomando | Descripción |
|------------|-------------|
| `status` | Mostrar MCPs configurados y su estado |
| `recommend` | Recomendar MCPs basado en el stack del proyecto |
| `install [mcp]` | Instalar un MCP específico o interactivo |
| `update` | Actualizar MCPs instalados a última versión |
| (vacío) | Equivale a `status` |

---

## `/oden:mcp status`

Muestra el estado actual de MCPs configurados.

### Proceso

1. Leer configuración global de `~/.claude.json` (campo `mcpServers`)
2. Leer configuración de proyecto `.mcp.json` en la raíz del proyecto
3. Leer settings de `~/.claude/settings.json` (campo `mcpServers`)
4. Combinar y mostrar estado

### Detección de MCPs

```bash
# Config global
cat ~/.claude.json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    servers = data.get('mcpServers', {})
    for name, config in servers.items():
        stype = config.get('type', 'command')
        print(f'  global | {name:<24} | {stype}')
except: pass
"

# Config proyecto
cat .mcp.json 2>/dev/null | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    servers = data.get('mcpServers', {})
    for name, config in servers.items():
        stype = config.get('type', 'command')
        print(f'  project | {name:<24} | {stype}')
except: pass
"
```

### Output

```
MCP STATUS
==========

Scope     | MCP                      | Type
----------|--------------------------|--------
global    | context7                 | http
global    | pencil                   | http
project   | supabase                 | command
project   | playwright               | command

Total: 4 MCPs configurados (2 global, 2 proyecto)

Tip: Usa /oden:mcp recommend para ver MCPs sugeridos para tu stack.
```

---

## `/oden:mcp recommend`

Detecta el stack del proyecto y recomienda MCPs relevantes.

### Detección de Stack

Analizar archivos en la raíz del proyecto para detectar tecnologías:

```bash
# Detectar stack del proyecto
STACK=""

# Next.js / React
[ -f "next.config.js" ] || [ -f "next.config.mjs" ] || [ -f "next.config.ts" ] && STACK="$STACK,nextjs"

# React (sin Next)
[ -f "package.json" ] && grep -q '"react"' package.json 2>/dev/null && STACK="$STACK,react"

# React Native / Expo
[ -f "app.json" ] && grep -q '"expo"' app.json 2>/dev/null && STACK="$STACK,expo"
[ -f "package.json" ] && grep -q '"react-native"' package.json 2>/dev/null && STACK="$STACK,react-native"

# Flutter
[ -f "pubspec.yaml" ] && STACK="$STACK,flutter"

# Swift / iOS
[ -d "*.xcodeproj" ] || [ -f "Package.swift" ] && STACK="$STACK,swift"

# Supabase
[ -d "supabase" ] || ([ -f "package.json" ] && grep -q '"@supabase"' package.json 2>/dev/null) && STACK="$STACK,supabase"

# Stripe
[ -f "package.json" ] && grep -q '"stripe"' package.json 2>/dev/null && STACK="$STACK,stripe"

# Python
[ -f "requirements.txt" ] || [ -f "pyproject.toml" ] || [ -f "Pipfile" ] && STACK="$STACK,python"

# Node.js
[ -f "package.json" ] && STACK="$STACK,nodejs"

# Tailwind
[ -f "tailwind.config.js" ] || [ -f "tailwind.config.ts" ] && STACK="$STACK,tailwind"

# Playwright (already using)
[ -f "playwright.config.ts" ] || [ -f "playwright.config.js" ] && STACK="$STACK,playwright"

echo "Detected: $STACK"
```

### MCP Catalog

#### Tier 1 - Universal (recomendado para todos los proyectos)

| MCP | Descripcion | Config Type |
|-----|-------------|-------------|
| `context7` | Documentacion actualizada de librerias | http |
| `pencil` | Editor de diseno para web/mobile | http |

#### Tier 2 - Stack-Specific (segun tecnologias detectadas)

| MCP | Se recomienda cuando | Config Type |
|-----|----------------------|-------------|
| `supabase` | Detecta `supabase/` dir o `@supabase` en deps | command (npx) |
| `playwright` | Proyecto web sin playwright ya configurado | command (npx) |
| `chrome-devtools` | Proyecto web (debug de UI) | command (npx) |
| `figma` | Proyecto con UI (web o mobile) | http |
| `vercel` | Detecta next.config o vercel.json | http |
| `notion` | Cualquier proyecto (productividad) | http |

#### Tier 3 - Specialized (por necesidad especifica)

| MCP | Se recomienda cuando | Config Type |
|-----|----------------------|-------------|
| `stripe` | Detecta `stripe` en deps | command (npx) |
| `ios-simulator` | Detecta React Native, Expo, o Swift en macOS | command (npx) |
| `expo` | Detecta Expo en deps | command (npx) |
| `sentry` | Detecta `@sentry` en deps | command (npx) |
| `github` | Cualquier proyecto con git remote | http |

### Recommendation Logic

```
POR CADA MCP en el catalogo:
  SI ya esta instalado:
    marcar como "instalado"
  SI su condicion de stack aplica:
    marcar como "recomendado"
  SI NO:
    marcar como "disponible"
```

### Output

```
MCP RECOMMENDATIONS
====================

Stack detectado: nextjs, react, supabase, tailwind, nodejs

Tier 1 - Universal:
  [installed]   context7        - Documentacion de librerias
  [recommend]   pencil          - Editor de diseno

Tier 2 - Para tu stack:
  [installed]   supabase        - Gestion de BD Supabase
  [recommend]   chrome-devtools - Debug de UI en Chrome
  [recommend]   vercel          - Deploy y gestion Vercel
  [recommend]   playwright      - Testing E2E

Tier 3 - Especializados:
  [available]   stripe          - Pagos con Stripe
  [available]   notion          - Documentacion en Notion
  [available]   sentry          - Monitoreo de errores

Instalar: /oden:mcp install <nombre>
Instalar todos recomendados: /oden:mcp install --recommended
```

---

## `/oden:mcp install [mcp]`

Instala un MCP especifico o permite seleccion interactiva.

### Argumentos

- `<nombre>` - Nombre del MCP a instalar (ej: `context7`, `supabase`)
- `--recommended` - Instalar todos los MCPs marcados como "recomendado"
- (vacío) - Mostrar lista interactiva para seleccionar

### Configuraciones de Instalacion

Cada MCP tiene una configuracion predefinida. Al instalar:

1. Preguntar nivel de instalacion:
   - **Global** (`~/.claude.json`) - Disponible en todos los proyectos
   - **Proyecto** (`.mcp.json`) - Solo este proyecto

2. Agregar configuracion JSON al archivo correspondiente

3. Indicar si requiere credenciales y como obtenerlas

### MCP Configs (Referencia de Instalacion)

#### context7
```json
{
  "context7": {
    "type": "http",
    "url": "https://mcp.context7.com/mcp"
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Ninguna (uso gratuito)

#### pencil
```json
{
  "pencil": {
    "type": "http",
    "url": "https://mcp.pencil.li/"
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Cuenta Pencil (OAuth en primer uso)

#### supabase
```json
{
  "supabase": {
    "command": "npx",
    "args": [
      "-y",
      "@supabase/mcp-server-supabase@latest",
      "--read-only",
      "--project-ref=<PROJECT_REF>"
    ],
    "env": {
      "SUPABASE_ACCESS_TOKEN": "<ACCESS_TOKEN>"
    }
  }
}
```
- **Scope recomendado:** Proyecto
- **Credenciales:** Access Token + Project Ref
- **Obtener:** https://supabase.com/dashboard/account/tokens

#### playwright
```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-playwright@latest"]
  }
}
```
- **Scope recomendado:** Proyecto
- **Credenciales:** Ninguna

#### chrome-devtools
```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": ["-y", "chrome-devtools-mcp@latest"]
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Ninguna (Chrome debe estar instalado)

#### figma
```json
{
  "figma": {
    "type": "http",
    "url": "https://mcp.figma.com/mcp"
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Cuenta Figma (OAuth en primer uso)

#### vercel
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com/"
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Cuenta Vercel (OAuth en primer uso)

#### notion
```json
{
  "notion": {
    "type": "http",
    "url": "https://mcp.notion.com/mcp"
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Cuenta Notion (OAuth en primer uso)

#### stripe
```json
{
  "stripe": {
    "command": "npx",
    "args": ["-y", "@stripe/mcp@latest"],
    "env": {
      "STRIPE_SECRET_KEY": "<SECRET_KEY>"
    }
  }
}
```
- **Scope recomendado:** Proyecto
- **Credenciales:** Stripe Secret Key
- **Obtener:** https://dashboard.stripe.com/apikeys

#### ios-simulator
```json
{
  "ios-simulator": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-ios-simulator@latest"]
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Ninguna (requiere Xcode + macOS)

#### expo
```json
{
  "expo": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-expo@latest"]
  }
}
```
- **Scope recomendado:** Proyecto
- **Credenciales:** Ninguna

#### sentry
```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@sentry/mcp-server@latest"],
    "env": {
      "SENTRY_AUTH_TOKEN": "<AUTH_TOKEN>"
    }
  }
}
```
- **Scope recomendado:** Proyecto
- **Credenciales:** Sentry Auth Token
- **Obtener:** https://sentry.io/settings/auth-tokens/

#### github
```json
{
  "github": {
    "type": "http",
    "url": "https://mcp.github.com/mcp"
  }
}
```
- **Scope recomendado:** Global
- **Credenciales:** Cuenta GitHub (OAuth en primer uso)

### Proceso de Instalacion

1. **Validar MCP nombre** - Verificar que existe en el catalogo
2. **Verificar si ya instalado** - Leer configs existentes
3. **Preguntar scope** - Global o proyecto (usar recomendado como default)
4. **Solicitar credenciales** - Si el MCP las requiere, indicar donde obtenerlas y pedir al usuario
5. **Escribir configuracion** - Agregar al archivo JSON correspondiente
6. **Verificar** - Confirmar que se escribio correctamente

### Escritura de Config

Para archivos JSON existentes, hacer merge del mcpServers:

```python
# Pseudocodigo
config = read_json(config_file) or {}
mcp_servers = config.get("mcpServers", {})
mcp_servers[mcp_name] = mcp_config
config["mcpServers"] = mcp_servers
write_json(config_file, config)
```

Para `.mcp.json` de proyecto (si no existe, crear):

```json
{
  "mcpServers": {
    "<nombre>": { ... }
  }
}
```

Para `~/.claude.json` global (merge con existente):

Leer el archivo, parsear JSON, agregar al campo `mcpServers`, escribir de vuelta.

### Output

```
MCP INSTALL: context7
======================

Scope: Global (~/.claude.json)
Credenciales: Ninguna requerida

Configuracion agregada:
  "context7": {
    "type": "http",
    "url": "https://mcp.context7.com/mcp"
  }

Reinicia Claude Code para activar el MCP.

Verificar despues de reiniciar: /mcp
```

### Output con credenciales requeridas

```
MCP INSTALL: supabase
======================

Este MCP requiere credenciales:

1. SUPABASE_ACCESS_TOKEN
   Obtener en: https://supabase.com/dashboard/account/tokens

2. PROJECT_REF
   Encontrar en: Dashboard > Settings > General > Reference ID

Proporciona los valores para continuar, o usa /oden:mcp install supabase
de nuevo cuando los tengas.
```

---

## `/oden:mcp update`

Actualiza MCPs de tipo command (npx) a su ultima version.

### Proceso

1. Leer MCPs configurados (global + proyecto)
2. Identificar los de tipo `command` que usan `npx`
3. Verificar que sus paquetes usen `@latest`
4. Si alguno tiene version fija, actualizar a `@latest`

### Output

```
MCP UPDATE
==========

Verificando MCPs de tipo command...

  supabase    - @supabase/mcp-server-supabase@latest  (ya actualizado)
  playwright  - @anthropic/mcp-server-playwright@0.3.0 -> @latest (actualizado)

1 MCP actualizado. Reinicia Claude Code para aplicar.
```

Para MCPs de tipo HTTP no se requiere actualizacion (son servicios remotos).

---

## Deteccion Automatica de Stack

La deteccion se basa en archivos presentes en el proyecto:

| Indicador | Stack Detectado |
|-----------|-----------------|
| `next.config.*` | Next.js |
| `package.json` con `"react"` | React |
| `app.json` con `"expo"` | Expo |
| `package.json` con `"react-native"` | React Native |
| `pubspec.yaml` | Flutter |
| `*.xcodeproj` o `Package.swift` | Swift/iOS |
| `supabase/` dir | Supabase |
| `package.json` con `"stripe"` | Stripe |
| `requirements.txt` o `pyproject.toml` | Python |
| `tailwind.config.*` | Tailwind CSS |
| `vercel.json` | Vercel |
| `package.json` con `"@sentry"` | Sentry |
| `.sentryclirc` | Sentry |
| `playwright.config.*` | Playwright |

---

## Reinicio de Claude Code

Despues de instalar o actualizar MCPs:

```
IMPORTANTE: Reinicia Claude Code para que los MCPs se carguen.

Opciones:
1. Salir con /exit y volver a entrar
2. Usar Cmd+Shift+P > "Reload Window" (si usas VS Code)

Despues de reiniciar, verifica con: /mcp
```

---

## Error Handling

### MCP no encontrado
```
No se encontro MCP: "{nombre}"

MCPs disponibles:
  context7, pencil, supabase, playwright, chrome-devtools,
  figma, vercel, notion, stripe, ios-simulator, expo, sentry, github

Uso: /oden:mcp install <nombre>
```

### Config file no es JSON valido
```
El archivo {file} no contiene JSON valido.
Creando backup en {file}.backup y generando nuevo archivo.
```

### MCP ya instalado
```
MCP "{nombre}" ya esta configurado en {scope}.

Config actual:
  {config_json}

Para reinstalar: elimina la entrada y ejecuta /oden:mcp install {nombre}
```

---

## Notas

- Los MCPs HTTP se conectan a servicios remotos y requieren OAuth en primer uso
- Los MCPs NPX ejecutan procesos locales y pueden necesitar API keys como variables de entorno
- La configuracion global (`~/.claude.json`) aplica a todos los proyectos
- La configuracion de proyecto (`.mcp.json`) solo aplica al proyecto actual
- Siempre verificar con `/mcp` despues de reiniciar para confirmar que los MCPs estan activos
