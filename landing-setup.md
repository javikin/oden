# Oden v3 Landing Page - Setup

## 1. Crear proyecto Next.js

```bash
cd /Users/srjavi/Documents/projects/
npx create-next-app@latest oden-v3-landing --typescript --tailwind --app --use-npm
cd oden-v3-landing
```

## 2. Instalar shadcn/ui

```bash
npx shadcn-ui@latest init
# Seleccionar:
# - Would you like to use TypeScript? › Yes
# - Which style would you like to use? › Default
# - Which color would you like to use as base color? › Slate
# - Would you like to use CSS variables for colors? › Yes

# Instalar componentes base
npx shadcn-ui@latest add button
```

## 3. Usar el componente hero moderno

El componente está listo en `/components/ui/oden-hero.tsx`

## 4. Correr local

```bash
npm run dev
```

Abre http://localhost:3000