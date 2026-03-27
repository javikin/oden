---
allowed-tools: Bash, Read, Write, LS, Glob, Grep, Task, TodoWrite, WebSearch, WebFetch
description: Crear/completar technical-decisions.md con arquitectura completa
updated: 2026-03-27T07:08:49Z
---

# Oden Forge - Technical Architect

Actúa como **Technical Architect** para crear/completar el documento `docs/reference/technical-decisions.md`.

## Usage

```
/oden:architect [módulo]       # Crear technical decisions completo
/oden:architect spec [módulo]  # Crear especificación detallada
/oden:architect checklist      # Verificar pre-código
```

## Prerrequisitos

1. Proyecto inicializado con `/oden:init`
2. Archivo `docs/reference/technical-decisions.md` existe (template)

## Responsabilidades

Como Technical Architect, debes:

1. **Completar technical-decisions.md** (2000-4000 líneas)
2. **Diseñar schema de base de datos** completo
3. **Definir interfaces TypeScript** para todos los modelos
4. **Documentar patrones de arquitectura**
5. **Especificar estructura de código** y organización interna
6. **Definir límites y restricciones** de calidad
7. **Identificar dependencias y riesgos**

## Proceso

### Paso 1: Análisis de Contexto

Lee el template existente de technical-decisions.md para entender:
- Stack tecnológico seleccionado
- Features requeridas
- Scope (MVP vs Turbo)

### Paso 2: Diseño de Arquitectura

Basado en el stack, diseña:

1. **Arquitectura de Alto Nivel**
   - Diagrama de componentes
   - Flujo de datos
   - Capas de la aplicación

2. **Estructura de Carpetas**
   ```
   src/
   ├── components/     # UI Components
   ├── hooks/          # Custom hooks
   ├── lib/            # Utilities
   ├── services/       # API calls
   ├── store/          # State management
   ├── types/          # TypeScript types
   └── utils/          # Helper functions
   ```

### Paso 3: Especificaciones de Código y Estructura

**🆕 CRÍTICO:** Define HOW el código debe estar organizado internamente para prevenir god files y inconsistencias.

#### 3.1 Límites de Archivos y Módulos

```markdown
## Code Structure Guidelines

### File Size Limits (ENFORCE STRICTLY)
- **Components**: MAX 200 líneas (150 típico)
- **Hooks**: MAX 100 líneas (50-75 típico)
- **Services**: MAX 300 líneas (200 típico)
- **Utils**: MAX 150 líneas (100 típico)
- **Types**: MAX 200 líneas (split por dominio)
- **Stores/State**: MAX 250 líneas (split por feature)

### Module Organization (HIGH COHESION)
```
src/
├── modules/           # Feature-based modules
│   ├── auth/
│   │   ├── components/    # Max 5 files
│   │   ├── hooks/         # Max 3 files
│   │   ├── services/      # Max 2 files
│   │   ├── types.ts       # Single types file
│   │   └── index.ts       # Public API only
│   ├── orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── ...
│   └── shared/        # Cross-module utilities
│       ├── components/
│       ├── hooks/
│       └── utils/
```

### Layer Dependencies (ENFORCE DIRECTION)
```
UI Layer (components/)
  ↓ can import
Business Layer (hooks/, services/)
  ↓ can import  
Data Layer (types/, utils/)

❌ FORBIDDEN: Data layer importing Business/UI
❌ FORBIDDEN: Circular dependencies
✅ ALLOWED: Same layer imports
```

#### 3.2 Internal File Structure Standards

**Component Structure (MANDATORY)**
```typescript
// TEMPLATE: Component file structure
import React from 'react';
// 1. External imports first
// 2. Internal imports second  
// 3. Types last

// Types (if small, <20 lines)
interface Props {
  // Max 8 props, use config object if more
}

// Main component (Max 150 lines)
export function ComponentName({ ...props }: Props) {
  // 1. Hooks first (max 5)
  // 2. Derived state (max 3 computations)
  // 3. Event handlers (max 5)
  // 4. Effects last (max 3)
  
  // Early returns for loading/error states
  if (loading) return <Loading />;
  if (error) return <Error />;
  
  return (
    // JSX (max 50 lines)
  );
}

// Helper components (if needed, max 2)
function HelperComponent() {
  // Max 25 lines
}

// Exports last
export type { Props };
```

**Service Structure (MANDATORY)**
```typescript
// TEMPLATE: Service file structure
import { ApiClient } from '../shared';
// External imports
// Internal imports  
// Types

// Types for this service only
interface ServiceConfig {
  // Service-specific config
}

interface ServiceResponse<T> {
  // Standardized response format
}

// Main service class (Max 200 lines)
class FeatureService {
  private config: ServiceConfig;
  
  constructor(config: ServiceConfig) {
    this.config = config;
  }
  
  // Public methods (max 8)
  async getAll(): Promise<ServiceResponse<Item[]>> {
    // Max 25 lines per method
  }
  
  // Private methods last
  private helper(): void {
    // Max 15 lines per helper
  }
}

// Factory function
export function createFeatureService(config: ServiceConfig): FeatureService {
  return new FeatureService(config);
}

// Export types
export type { ServiceConfig, ServiceResponse };
```

#### 3.3 Code Quality Enforcement

**Complexity Limits**
- **Cyclomatic complexity**: Max 10 per function
- **Nesting depth**: Max 4 levels
- **Function parameters**: Max 5 (use config object)
- **Class methods**: Max 12 public methods
- **Import statements**: Max 15 per file

**Naming Conventions**
```typescript
// Files: kebab-case
user-profile.component.ts
order-management.service.ts

// Components: PascalCase
UserProfile, OrderManagement

// Functions/variables: camelCase
getUserProfile, orderData

// Constants: SCREAMING_SNAKE_CASE
MAX_RETRY_ATTEMPTS, API_ENDPOINTS

// Types/Interfaces: PascalCase
interface UserProfile {}
type OrderStatus = 'pending' | 'completed';
```

**Error Handling Patterns**
```typescript
// Service layer: Throw typed errors
class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
  }
}

// Hook layer: Return error states
function useFeature() {
  const [state, setState] = useState<{
    data: Data | null;
    error: ServiceError | null;
    loading: boolean;
  }>({
    data: null,
    error: null,
    loading: false
  });
  
  // Error boundary at component level
}
```

#### 3.4 Testing Requirements per Layer

**Component Testing (MANDATORY)**
```typescript
// Every component MUST have:
describe('ComponentName', () => {
  // 1. Render test
  it('renders without crashing', () => {});
  
  // 2. Props test
  it('handles all prop variations', () => {});
  
  // 3. Interaction test  
  it('handles user interactions', () => {});
  
  // 4. Error state test
  it('handles error states', () => {});
});
```

**Service Testing (MANDATORY)**
```typescript
// Every service MUST have:
describe('FeatureService', () => {
  // 1. Happy path tests
  it('returns data successfully', () => {});
  
  // 2. Error handling tests
  it('handles API errors gracefully', () => {});
  
  // 3. Edge case tests
  it('handles empty responses', () => {});
  
  // 4. Integration tests
  it('works with real API', () => {});
});
```
```

### Paso 4: Schema de Base de Datos

Para cada entidad del sistema:

```markdown
## Tabla: {nombre}

### Propósito
{descripción}

### Columnas
| Columna | Tipo | Nullable | Default | Descripción |
|---------|------|----------|---------|-------------|
| id | UUID | No | gen_random_uuid() | PK |
| ... | ... | ... | ... | ... |
| created_at | TIMESTAMPTZ | No | now() | |
| updated_at | TIMESTAMPTZ | No | now() | |

### Índices
- PRIMARY KEY (id)
- INDEX idx_{tabla}_{columna} ON {tabla}({columna})

### Foreign Keys
- FK: {columna} → {otra_tabla}.id

### Triggers
- updated_at: Auto-update on modification
```

### Paso 5: Interfaces TypeScript

```typescript
// Types para cada entidad
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Types para API responses
interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}
```

### Paso 6: Patrones de Arquitectura

Documenta patrones para:

1. **State Management**
   - Cuándo usar global vs local state
   - Estructura del store
   - Selectors y actions

2. **Data Fetching**
   - Estrategia de caching
   - Optimistic updates
   - Error handling

3. **Error Handling**
   - Error boundaries
   - Toast notifications
   - Logging strategy

4. **Performance**
   - Lazy loading
   - Code splitting
   - Memoization

### Paso 7: Seguridad

Documenta:
- Autenticación flow
- Autorización (RBAC)
- Input sanitization
- CORS policy
- Rate limiting

### Paso 8: APIs

Define endpoints principales:

```markdown
## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login | No |
| POST | /api/auth/logout | Logout | Yes |
| POST | /api/auth/refresh | Refresh token | Yes |

### Resources
| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /api/{resource} | List all | Yes | All |
| GET | /api/{resource}/:id | Get one | Yes | All |
| POST | /api/{resource} | Create | Yes | Admin |
| PUT | /api/{resource}/:id | Update | Yes | Admin |
| DELETE | /api/{resource}/:id | Delete | Yes | Admin |
```

### Paso 9: Quality Gates Integration

**🆕 Para integración con quality gates:**

```markdown
## Measurable Requirements

### Code Structure Metrics (ENFORCE)
- File count per module: MAX 15 files
- Lines per file: See limits above
- Cyclomatic complexity: MAX 10
- Import depth: MAX 3 levels
- Duplicate code: MAX 3% similarity

### Architecture Compliance (VALIDATE)
- Layer dependency direction: STRICT
- Circular dependencies: ZERO tolerance
- Public API surface: Document all exports
- Type coverage: MIN 95%

### Testing Coverage (MEASURE)
- Unit tests: MIN 85% coverage
- Integration tests: All API endpoints
- Component tests: All user interactions
- E2E tests: Critical user flows

### Performance Benchmarks (TRACK)
- Bundle size: MAX defined per route
- Initial load: MAX 2s
- API response: MAX 500ms p95
- Memory usage: Monitor growth
```

## Output

Al completar, el archivo `docs/reference/technical-decisions.md` debe tener:

- [ ] 2000+ líneas de contenido
- [ ] **🆕 Code structure guidelines** (300-500 líneas)
- [ ] **🆕 Internal organization patterns** (200-300 líneas)
- [ ] **🆕 Quality enforcement rules** (150-200 líneas)
- [ ] Schema de BD completo para todas las entidades
- [ ] Interfaces TypeScript para todos los modelos
- [ ] Diagrama de arquitectura (ASCII o mermaid)
- [ ] Patrones documentados
- [ ] APIs definidas
- [ ] Consideraciones de seguridad
- [ ] Performance targets
- [ ] **🆕 Testing requirements per layer**

---

## SPEC MODE: /oden:architect spec [módulo]

Crear especificaciones técnicas detalladas (800-1200 líneas) para módulos específicos.

### Features:
- **Máquinas de estado** para entidades complejas
- **Casos de uso** detallados con ejemplos
- **Validaciones** y reglas de negocio
- **Edge cases** y manejo de errores
- **APIs** y contratos de datos
- **Testing scenarios**
- **🆕 Internal code organization** para el módulo
- **🆕 File structure and limits** específicos
- **🆕 Quality requirements** del módulo

### Usage:
```bash
/oden:architect spec auth        # Módulo de autenticación
/oden:architect spec orders      # Sistema de pedidos
/oden:architect spec payments    # Procesamiento de pagos
```

### 🆕 Enhanced Spec Output:
```markdown
## Module: {nombre}

### Code Structure
- Files organization: {specific to module}
- Size limits: {adjusted for complexity}
- Dependencies: {what can this import}
- Public API: {exported interfaces}

### Internal Architecture  
- Layer organization
- State management pattern
- Error handling strategy
- Testing approach

### Quality Gates
- Specific metrics for this module
- Complexity thresholds
- Coverage requirements
- Performance targets
```

---

## CHECKLIST MODE: /oden:architect checklist

Verificación automática antes de empezar a codificar.

### Verifica:
- ✅ technical-decisions.md completo (>2000 líneas)
- ✅ **🆕 Code structure guidelines** definidas
- ✅ **🆕 Quality enforcement rules** establecidas
- ✅ Schema de BD definido
- ✅ Interfaces TypeScript creadas
- ✅ Specs de módulos principales (>800 líneas c/u)
- ✅ Patrones de arquitectura documentados
- ✅ **🆕 Testing requirements** especificados
- ✅ Total documentación >8000 líneas

### 🆕 Enhanced Validation:
```
🎯 CHECKLIST PRE-CÓDIGO
═══════════════════════════

✅ technical-decisions.md: 2,847 líneas
✅ Code structure: 487 líneas
✅ Quality rules: 156 líneas  
✅ auth-spec.md: 1,203 líneas
✅ orders-spec.md: 987 líneas
❌ payments-spec.md: FALTA
⚠️  Schema BD: 89% completo

TOTAL: 8,234 / 8,000 líneas mínimas

🚨 BLOQUEADORES:
- Completar payments-spec.md
- Finalizar schema de BD
- Definir testing strategy

📊 QUALITY READINESS:
✅ File size limits defined
✅ Layer dependencies mapped  
❌ Complexity thresholds missing
⚠️  Testing requirements 73% complete

SIGUIENTE: /oden:architect spec payments
```

---

## Siguientes Pasos

Después de completar arquitectura y specs:

```
1. /oden:prd [feature]     → PRDs con brainstorming
2. /oden:epic [feature]    → Epic + tasks + work streams
3. /oden:work [epic]       → Desarrollo con Teams
```

---

## 🆕 Integration with Living Quality Gates

Este comando ahora produce arquitectura que puede ser validada automáticamente por:

- **Code structure compliance checkers**
- **Dependency direction validators**  
- **File size and complexity monitors**
- **Testing coverage requirements**
- **Performance benchmark definitions**

La salida es **measurable** y **enforceable** durante el desarrollo.
