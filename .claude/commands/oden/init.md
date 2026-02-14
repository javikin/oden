---
allowed-tools: Bash, Read, Write, LS, Glob, AskUserQuestion, Task, TodoWrite
description: Wizard interactivo para crear proyectos desde cero con metodología Oden
---

# Oden Forge - Project Initialization Wizard

Wizard interactivo que guía al usuario a crear un proyecto profesional siguiendo la metodología Documentation-First Development.

## Usage

```
/oden:init [nombre-proyecto]
/oden:init agents [category]  # Instalar agentes especializados
/oden:init mcp [category]     # Instalar MCPs recomendados
```

## Filosofía Core

> "Documenta y diseña COMPLETAMENTE antes de codificar"

Este wizard NO genera código. Genera la **documentación completa** que permitirá desarrollar con claridad.

---

## PASO 1: Entender el Objetivo

El objetivo es entender QUÉ necesita el usuario para RECOMENDAR el stack correcto.

### 1.1 Nombre y Descripción

Si no se proporcionó como argumento:
- Nombre del proyecto (slug: lowercase, guiones)
- Descripción breve: "¿Qué problema resuelve tu producto?"

### 1.2 Objetivo Principal del Producto

**Pregunta:** "¿Cuál es el objetivo principal de tu producto para los usuarios?"

Opciones:
- **Descubrir contenido**: Blog, noticias, catálogo, landing pages (SEO crítico)
- **Realizar transacciones**: Compras, reservas, pedidos, pagos
- **Productividad/trabajo**: Dashboard, herramientas, gestión de datos
- **Comunicación/social**: Chat, comunidad, red social
- **Tracking/monitoreo**: Seguimiento de ubicación, métricas en tiempo real
- **Servicio para sistemas**: API, microservicio, backend para terceros

### 1.3 Acceso Principal de Usuarios

**Pregunta:** "¿Cómo accederán principalmente tus usuarios?"

Opciones:
- **Navegador escritorio**: Desde computadora principalmente
- **Navegador móvil**: Desde celular pero en browser
- **App instalada**: Necesitan app en su teléfono
- **Web + App**: Ambos canales son importantes
- **Solo API**: No hay interfaz de usuario directa

### 1.4 Funcionalidades Nativas (solo si eligió app o web+app)

**Pregunta:** "¿Necesitas alguna de estas funcionalidades del dispositivo?"

Opciones (múltiple selección):
- **Cámara/fotos frecuente**: Escanear, tomar fotos constantemente
- **GPS en tiempo real**: Tracking de ubicación continuo
- **Notificaciones push críticas**: Alertas que no pueden fallar
- **Modo offline obligatorio**: Funcionar sin internet
- **Sensores del dispositivo**: Acelerómetro, giroscopio, NFC
- **Ninguna especial**: Funcionalidades estándar

### 1.5 Actualizaciones de la App (solo si eligió app)

**Pregunta:** "¿Qué tan frecuente necesitas actualizar la app?"

Opciones:
- **Muy frecuente**: Updates semanales, A/B testing, iteración rápida
- **Normal**: Updates mensuales, proceso estándar de tiendas OK
- **Poco frecuente**: App estable, pocos cambios

---

## PASO 2: Recomendación de Stack

Basado en las respuestas, mostrar recomendación con justificación:

### Matriz de Decisión

```
SI objetivo = "Descubrir contenido" Y acceso = web:
  → Next.js + Supabase
  → Razón: SSR para SEO, hosting en Vercel, DB y auth integrados

SI objetivo = "Transacciones" Y acceso = "App instalada":
  SI necesita_nativas_criticas (cámara frecuente, GPS tiempo real, sensores):
    SI solo_iOS:
      → Swift/SwiftUI + Supabase
      → Razón: Máximo rendimiento y acceso a APIs nativas de iOS
    SI solo_Android:
      → Kotlin + Supabase
      → Razón: Máximo rendimiento y acceso a APIs nativas de Android
    SINO:
      → Flutter + Supabase
      → Razón: Nativo compilado, excelente acceso a hardware, una codebase
  SINO:
    → React Native + Expo + Supabase
    → Razón: Updates OTA sin pasar por tiendas, desarrollo rápido, ecosistema React

SI objetivo = "Transacciones" Y acceso = "Web + App":
  SI updates_frecuentes:
    → Next.js (PWA) + React Native/Expo + Supabase
    → Razón: Web con PWA, app con OTA updates, backend compartido
  SINO:
    → Next.js + React Native + Supabase
    → Razón: Código compartido donde sea posible, experiencias nativas

SI objetivo = "Productividad/trabajo":
  → React + Supabase (o Next.js si necesita SEO)
  → Razón: SPA rápida, sin necesidad de SSR, Supabase para auth y DB

SI objetivo = "Comunicación/social":
  SI acceso incluye app:
    → React Native + Expo + Supabase (Realtime)
    → Razón: Realtime de Supabase, push notifications, OTA updates
  SINO:
    → Next.js + Supabase (Realtime)
    → Razón: WebSockets para chat, SEO para perfiles públicos

SI objetivo = "Tracking/monitoreo":
  → React Native + Expo + Supabase
  → O Flutter si necesita sensores avanzados
  → Razón: Acceso a GPS, background location, push notifications

SI objetivo = "Servicio para sistemas":
  → Node.js (Fastify/Express) + PostgreSQL
  → O Python (FastAPI) + PostgreSQL
  → Razón: API pura, sin frontend, escalable
```

### Formato de Recomendación

```
╔══════════════════════════════════════════════════════════════╗
║                 STACK RECOMENDADO                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Basado en tus necesidades:                                  ║
║  • Objetivo: {objetivo}                                      ║
║  • Acceso: {acceso}                                          ║
║  • Nativas: {funcionalidades}                                ║
║                                                              ║
║  TE RECOMENDAMOS:                                            ║
║                                                              ║
║  Frontend: {framework}                                       ║
║  Backend:  Supabase (PostgreSQL + Auth + Realtime)          ║
║  Hosting:  {plataforma}                                      ║
║                                                              ║
║  ¿POR QUÉ?                                                   ║
║  {justificación específica}                                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

¿Aceptas esta recomendación o prefieres otro stack?
1. Aceptar recomendación
2. Quiero usar otro framework (especificar)
3. Tengo dudas, explícame más
```

---

## PASO 3: Nivel de Experiencia

**Pregunta:** "¿Cuál es tu nivel de experiencia con este stack?"

- **Principiante** (primera vez con estas tecnologías):
  - Explicaciones detalladas de cada decisión
  - Guías de System Design incluidas
  - Recursos de aprendizaje en cada paso

- **Intermedio** (he usado tecnologías similares):
  - Guías contextuales cuando sea relevante
  - Mejores prácticas destacadas

- **Avanzado** (domino este stack):
  - Flujo rápido, solo decisiones clave
  - Sin explicaciones básicas

---

## PASO 4: Scope del Proyecto

### 4.1 MVP vs Modo Turbo

**Pregunta:** "¿Cuál es tu estrategia de lanzamiento?"

**MVP (Minimum Viable Product)**
- Timeline: 6-8 semanas
- Features: 30-40% del producto final
- Objetivo: Validar idea rápidamente
- Ideal para: Startups, validación de mercado

**Modo Completo**
- Timeline: 12-16 semanas
- Features: 100% profesional desde día 1
- Objetivo: Producto enterprise-ready
- Ideal para: Productos B2B, mercados establecidos

### 4.2 Competidores

**Pregunta:** "Nombra 2-3 productos similares o competidores"

Esto nos ayudará en el análisis competitivo posterior.

---

## PASO 5: Features Clave para V1

**Pregunta:** "¿Qué features son CRÍTICAS para tu primera versión?"

Mostrar opciones relevantes según el objetivo:

### Para Transacciones/E-commerce:
- [ ] Catálogo de productos
- [ ] Carrito de compras
- [ ] Checkout y pagos
- [ ] Historial de pedidos
- [ ] Notificaciones de estado

### Para Productividad:
- [ ] Dashboard principal
- [ ] CRUD de entidades
- [ ] Reportes/exportación
- [ ] Roles y permisos
- [ ] Búsqueda y filtros

### Para Social/Comunicación:
- [ ] Perfiles de usuario
- [ ] Feed/timeline
- [ ] Mensajería/chat
- [ ] Notificaciones
- [ ] Seguir/amigos

### Para Tracking:
- [ ] Mapa en tiempo real
- [ ] Historial de ubicaciones
- [ ] Alertas por zona
- [ ] Reportes de actividad

### Comunes a todos:
- [ ] Autenticación (email, social)
- [ ] Perfil de usuario
- [ ] Configuraciones
- [ ] Soporte/ayuda

---

## PASO 6: Integraciones

**Pregunta:** "¿Necesitas integrar con servicios externos?"

- **Pagos**: Stripe, MercadoPago, PayPal
- **Email**: Resend, SendGrid
- **Storage**: Supabase Storage, Cloudinary, S3
- **Maps**: Google Maps, Mapbox
- **AI**: OpenAI, Anthropic, Gemini
- **Analytics**: Mixpanel, Amplitude, PostHog
- **Ninguna por ahora**

---

## PASO 7: Resumen y Confirmación

```
╔══════════════════════════════════════════════════════════════╗
║                    RESUMEN DEL PROYECTO                      ║
╠══════════════════════════════════════════════════════════════╣
║ Proyecto: {nombre}                                           ║
║ Descripción: {descripción}                                   ║
║ Scope: {MVP/Completo} ({X semanas})                         ║
╠══════════════════════════════════════════════════════════════╣
║ STACK                                                        ║
║ ├─ Frontend: {framework}                                     ║
║ ├─ Backend: {backend}                                        ║
║ ├─ Database: {db}                                            ║
║ ├─ Auth: {auth}                                              ║
║ └─ Hosting: {hosting}                                        ║
╠══════════════════════════════════════════════════════════════╣
║ FEATURES V1                                                  ║
║ {lista de features}                                          ║
╠══════════════════════════════════════════════════════════════╣
║ INTEGRACIONES                                                ║
║ {lista de integraciones}                                     ║
╠══════════════════════════════════════════════════════════════╣
║ COMPETIDORES A ANALIZAR                                      ║
║ {lista}                                                      ║
╚══════════════════════════════════════════════════════════════╝

¿Confirmas para crear la estructura del proyecto?
```

---

## PASO 8: Generación de Estructura

Una vez confirmado:

### 8.1 Crear Directorios

```bash
mkdir -p docs/{guides,reference/modules,development/{current,completed},archived,temp}
mkdir -p .claude/{commands,scripts,rules,context}
```

### 8.2 Crear Archivos Iniciales

1. **docs/README.md** - Índice de documentación
2. **docs/reference/technical-decisions.md** - Con decisiones del wizard
3. **docs/reference/competitive-analysis.md** - Template
4. **docs/reference/implementation-plan.md** - Template
5. **CLAUDE.md** - Instrucciones del proyecto

### 8.3 Contenido de technical-decisions.md

Generar con las decisiones tomadas:

```markdown
# Technical Decisions - {Proyecto}

**Estado:** 🟡 En Progreso
**Última actualización:** {fecha}

---

## 1. Visión General

### 1.1 Descripción
{descripción del usuario}

### 1.2 Objetivo Principal
{objetivo seleccionado}

### 1.3 Scope
**Modalidad:** {MVP/Completo}
**Timeline estimado:** {X semanas}

---

## 2. Stack Tecnológico

### 2.1 Frontend
- **Framework:** {selección}
- **Justificación:** {razón de la recomendación}

### 2.2 Backend
- **Plataforma:** {Supabase/otro}
- **Database:** PostgreSQL
- **Auth:** {método}

### 2.3 Hosting
- **Plataforma:** {Vercel/Expo/etc}
- **Justificación:** {razón}

---

## 3. Features V1

{lista de features seleccionadas con checkboxes}

---

## 4. Integraciones

{lista de integraciones}

---

## 5. Competidores a Analizar

{lista de competidores}

---

## 6. Arquitectura

[Pendiente: Completar con /oden:architect]

---

## 7. Schema de Base de Datos

[Pendiente: Completar con /oden:architect]

---

## 8. Próximos Pasos

1. [ ] /oden:architect - Completar arquitectura y schema
2. [ ] /oden:analyze - Análisis competitivo
3. [ ] /oden:spec [módulo] - Especificaciones detalladas
4. [ ] /oden:plan - Plan de implementación
5. [ ] /oden:checklist - Verificar antes de codificar

---

**Creado:** {fecha}
**Generado por:** Oden Forge Wizard
```

---

## PASO 9: Siguiente Acción

```
╔══════════════════════════════════════════════════════════════╗
║              ✅ PROYECTO INICIALIZADO                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Proyecto: {nombre}                                          ║
║  Stack: {resumen del stack}                                  ║
║                                                              ║
║  ARCHIVOS CREADOS:                                           ║
║  • docs/reference/technical-decisions.md                     ║
║  • docs/reference/competitive-analysis.md                    ║
║  • docs/reference/implementation-plan.md                     ║
║  • CLAUDE.md                                                 ║
║                                                              ║
║  PRÓXIMO PASO:                                               ║
║                                                              ║
║  /oden:architect                                             ║
║                                                              ║
║  Esto completará:                                            ║
║  • Arquitectura detallada                                    ║
║  • Schema de base de datos                                   ║
║  • Estructura de carpetas del código                         ║
║  • Patrones de diseño a usar                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Comportamiento según Nivel

### Para Principiantes

Después de la recomendación de stack, explicar:

```
💡 ¿POR QUÉ ESTE STACK?

React Native + Expo:
• React Native te permite crear apps iOS y Android con JavaScript
• Expo simplifica el proceso: no necesitas Xcode ni Android Studio para empezar
• OTA Updates: puedes actualizar tu app sin pasar por las tiendas
• Gran comunidad y documentación

Supabase:
• Es como Firebase pero con PostgreSQL (base de datos relacional)
• Incluye: Base de datos, Autenticación, Storage, Realtime
• Tier gratuito generoso para empezar
• Dashboard visual para ver tus datos

¿Quieres que te explique más sobre alguna tecnología?
```

### Para Intermedios/Avanzados

Solo mostrar la recomendación y justificación breve, sin explicaciones básicas.

---

## Stacks Predefinidos (Referencia Rápida)

| Caso de Uso | Stack | Hosting |
|-------------|-------|---------|
| Web con SEO | Next.js + Supabase | Vercel |
| Web SPA (dashboard) | React + Supabase | Vercel/Netlify |
| Mobile (updates frecuentes) | React Native + Expo + Supabase | Expo EAS |
| Mobile (nativo crítico) | Flutter + Supabase | App Stores |
| Mobile iOS only | Swift + Supabase | App Store |
| Web + Mobile | Next.js + React Native + Supabase | Vercel + Expo |
| API/Backend only | Node.js/Python + PostgreSQL | Railway/Render |

---

## Error Handling

### Si el directorio ya existe:
```
⚠️ Ya existe un proyecto en este directorio.
¿Qué deseas hacer?
1. Continuar con el proyecto existente
2. Usar otro directorio
3. Cancelar
```

### Si el usuario rechaza la recomendación:
Preguntar qué stack prefiere y por qué, luego adaptar el flujo.

---

## AGENTS MODE: /oden:init agents [category]

Instala agentes especializados para desarrollo.

### Categories Disponibles:
- `core` - Agentes esenciales (fullstack-developer, code-reviewer, debugger)
- `frontend` - Frontend/UI (frontend-developer, ui-ux-designer)
- `backend` - Backend/APIs (backend-architect, database-architect)
- `mobile` - Mobile (mobile-developer, ios-developer)
- `devops` - DevOps (devops-engineer, deployment-engineer)
- `data` - Data (data-scientist, data-engineer)
- (vacío) - Mostrar todas las categorías

### Usage:
```bash
/oden:init agents core     # Solo esenciales
/oden:init agents         # Ver todas las opciones
```

---

## MCP MODE: /oden:init mcp [category]

Instala MCPs (Model Context Protocol servers) recomendados.

### Categories Disponibles:
- `essential` - MCPs básicos (memory, context7)
- `design` - Diseño (pencil, figma)
- `backend` - Backend (supabase, postgres)
- `testing` - Testing (chrome-devtools, playwright)
- `mobile` - Mobile (ios-simulator)
- `productivity` - Productivity (notion, linear)
- (vacío) - Mostrar todas las categorías

### Usage:
```bash
/oden:init mcp essential  # MCPs básicos
/oden:init mcp           # Ver todas las opciones
```

### Auto-Detection:
Basado en tu stack, se recomiendan automáticamente:
- **React/Next.js** → chrome-devtools, memory
- **Mobile** → ios-simulator, chrome-devtools
- **Supabase** → supabase MCP
- **Notion** → notion MCP
