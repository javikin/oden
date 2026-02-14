# Metodología Oden

## Filosofía: Documentation-First Development

La metodología Oden se basa en documentar y diseñar COMPLETAMENTE antes de escribir código.

### Principios Core

1. **Documentation-First**: Todo se documenta antes de codificar
2. **Design Sprint Adaptado**: Diseño rápido → Validación → Iteración
3. **Entrega Incremental**: Valor tangible cada semana

## Fases del Proyecto

### FASE 1: Pre-Desarrollo

**Duración:** 1-2 semanas

1. **Technical Architect** (`/oden:architect`)
   - technical-decisions.md (2000-4000 líneas)
   - Schema de BD completo
   - Interfaces TypeScript

2. **Domain Expert** (`/oden:analyze`)
   - Análisis de 3-5 competidores
   - User personas y stories
   - Priorización de features

3. **Spec Writer** (`/oden:spec`)
   - Specs de 800-1200 líneas por módulo
   - Máquinas de estado
   - Validaciones y edge cases

4. **Implementation Planner** (`/oden:plan`)
   - Plan semana por semana
   - Estimaciones con buffers
   - Milestones y criterios

### FASE 2: Implementación

**Duración:** 8-18 semanas según scope

- Seguir specs al pie de la letra
- Daily logging (`/oden:daily`)
- Validación contra specs

### FASE 3: Post-Desarrollo

- Mover docs a completed/
- Crear guías de usuario
- Archivar docs obsoletos

## Métricas de Éxito

### Durante Desarrollo
- 100% módulos definidos antes de codificar
- 0 dependencias circulares
- Documentación > 8,000 líneas antes de código
- Progreso diario documentado

### Post-Lanzamiento
- Performance: < 100ms latencia crítica
- Uptime: 99.9%
- NPS: > 50

## Reglas de Oro

### ✅ SIEMPRE
1. Documenta TODO antes de codificar
2. Analiza 3+ competidores
3. Crea specs de 800+ líneas por módulo
4. Registra progreso diario
5. Define máquinas de estado para entidades complejas
6. Especifica edge cases y manejo de errores

### ❌ NUNCA
1. No empieces sin specs completas
2. No documentes cambios triviales
3. No dupliques información
4. No dejes temp/ con más de 5 archivos

## Decisión: MVP vs Modo Turbo

### MVP (8-10 semanas)
- 30-40% de features
- Rápido al mercado
- Mayor deuda técnica
- Para: Startups, validación de ideas

### Modo Turbo (14-20 semanas)
- 100% features profesionales
- Enterprise-ready desde día 1
- Menor deuda técnica
- Para: Productos establecidos, B2B

## Checklist Pre-Código

Antes de escribir la primera línea:

- [ ] technical-decisions.md > 2000 líneas
- [ ] Schema de BD completo
- [ ] Análisis de 3+ competidores
- [ ] Specs de módulos > 800 líneas c/u
- [ ] Plan semana por semana
- [ ] Estructura docs/ creada
- [ ] Decisión MVP/Turbo documentada
- [ ] Stack tecnológico justificado
- [ ] Máquinas de estado definidas
- [ ] Edge cases documentados

**Solo cuando TODO esté ✅, empezar a codificar.**
