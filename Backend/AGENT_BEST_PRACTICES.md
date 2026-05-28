# AGENT BEST PRACTICES — VEXARO
> Guía de buenas prácticas para el agente IA que desarrolla este proyecto.
> Este archivo es **ley**. Ante cualquier duda, consulta estas reglas primero.

---

## 1. GESTOR DE PAQUETES — PROHIBICIÓN DE npm

### ⛔ npm está PROHIBIDO en este proyecto

npm sufrió un hackeo de supply-chain que comprometió la integridad de la cadena de dependencias. Por seguridad, **este proyecto usa exclusivamente `pnpm`**.

```bash
# ❌ NUNCA usar
npm install
npm i
npm run
npx

# ✅ SIEMPRE usar
pnpm install
pnpm add
pnpm run
pnpm dlx        # equivalente a npx
pnpm exec       # ejecutar binarios locales
```

### Configuración obligatoria del proyecto

`package.json` debe incluir:
```json
{
  "packageManager": "pnpm@9.x.x",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

Archivo `.npmrc` en la raíz:
```ini
engine-strict=true
shamefully-hoist=false
strict-peer-dependencies=false
```

Archivo `.node-version` o `.nvmrc`:
```
20
```

### Bloqueo adicional

Agrega un script pre-install que bloquee npm accidentalmente:
```json
{
  "scripts": {
    "preinstall": "npx only-allow pnpm"
  }
}
```

### Vercel + pnpm

En el dashboard de Vercel, configura la variable de entorno:
```
ENABLE_EXPERIMENTAL_COREPACK=1
```

O asegúrate de que el `packageManager` field en `package.json` sea detectado automáticamente.

---

## 2. ESTRUCTURA DE DIRECTORIOS

```
vexaro/
├── src/
│   ├── app/                    # Next.js App Router (páginas y layouts)
│   │   ├── (auth)/             # Rutas protegidas
│   │   ├── (public)/           # Rutas públicas (login, registro)
│   │   └── api/                # Route Handlers de Next.js
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitivos — NO modificar directamente
│   │   └── shared/             # Componentes reutilizables del proyecto
│   ├── modules/                # Un directorio por módulo funcional
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── habits/
│   │   ├── finance/
│   │   ├── goals/
│   │   ├── reports/
│   │   ├── notifications/
│   │   ├── settings/
│   │   └── sync/
│   ├── lib/
│   │   ├── supabase/           # Clientes Supabase (server, client, middleware)
│   │   ├── db/                 # Queries tipadas (nunca SQL en componentes)
│   │   └── utils/              # Funciones utilitarias puras
│   ├── hooks/                  # React hooks personalizados
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types e interfaces globales
│   └── styles/                 # Globals CSS
├── supabase/
│   ├── migrations/             # Migraciones SQL versionadas
│   ├── functions/              # Edge Functions
│   └── seed.sql                # Datos iniciales (categorías por defecto)
├── public/
├── tests/
├── .env.example                # ⚠ Solo placeholders — NUNCA valores reales
├── .gitignore
├── package.json
├── pnpm-lock.yaml              # Siempre commitear este archivo
└── AGENT_BEST_PRACTICES.md    # Este archivo
```

### Reglas de estructura

- Cada módulo en `src/modules/<nombre>/` debe contener:
  - `index.ts` — barrel export del módulo
  - `components/` — componentes específicos del módulo
  - `hooks/` — hooks específicos del módulo
  - `services/` — lógica de negocio y llamadas a Supabase
  - `types.ts` — tipos del módulo
- **Nunca** importar desde los internos de otro módulo. Usa solo los exports del `index.ts`.
- Los componentes en `src/components/ui/` son generados por shadcn/ui. **No los edites directamente**; extiéndelos en `src/components/shared/`.

---

## 3. GESTIÓN DE SECRETOS Y VARIABLES DE ENTORNO

### ⛔ Reglas absolutas

- **NUNCA** commits `.env` con valores reales al repositorio.
- **NUNCA** usar `process.env` en código del lado del cliente para secrets.
- **NUNCA** exponer la `service_role` key de Supabase en el frontend.
- **NUNCA** hardcodear API keys, tokens, o contraseñas en el código.

### Estructura de variables de entorno

`.env.example` (commitear esto):
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Secretos solo en servidor (NO NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Google OAuth (almacenar también en Supabase Vault)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# WhatsApp / Twilio
WHATSAPP_API_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
```

`.env.local` (en `.gitignore`, nunca commitear):
```bash
# Rellenar con valores reales en local
```

### Supabase Vault para secretos en Edge Functions

```sql
-- En migrations o via dashboard de Supabase
SELECT vault.create_secret('whatsapp_api_token', 'valor_real');
SELECT vault.create_secret('google_client_secret', 'valor_real');
```

Acceso desde Edge Functions:
```typescript
const { data } = await supabase.rpc('vault.decrypted_secret', {
  secret_name: 'whatsapp_api_token'
});
```

---

## 4. TYPESCRIPT — REGLAS DE TIPADO

```typescript
// ❌ PROHIBIDO
const data: any = await fetchSomething();
// @ts-ignore
// @ts-expect-error (solo en tests, con comentario explicativo)

// ✅ REQUERIDO
// Tipar todo explícitamente o inferir desde zod schemas
import { z } from 'zod';

const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  status: z.enum(['backlog', 'in_progress', 'review', 'done']),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  due_date: z.string().datetime().nullable(),
  user_id: z.string().uuid(),
});

type Task = z.infer<typeof TaskSchema>;
```

### Configuración tsconfig.json mínima

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 5. SUPABASE — BUENAS PRÁCTICAS

### Cliente Supabase

Nunca crear el cliente Supabase ad-hoc. Usar helpers centralizados:

```typescript
// src/lib/supabase/client.ts — para uso en Client Components
import { createBrowserClient } from '@supabase/ssr';
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// src/lib/supabase/server.ts — para Server Components y Route Handlers
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export function createSupabaseServerClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookies().getAll(), ... } }
  );
}
```

### Row Level Security (RLS)

```sql
-- ✅ SIEMPRE habilitar RLS en cada tabla nueva
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ✅ Política estándar de usuario
CREATE POLICY "Users can only access their own tasks"
  ON tasks FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ✅ Política de solo lectura para admins
CREATE POLICY "Admins can read all tasks"
  ON tasks FOR SELECT
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

### Queries tipadas

```typescript
// ✅ Tipar las respuestas de Supabase usando tipos generados
import type { Database } from '@/types/supabase'; // generado por supabase gen types

type Task = Database['public']['Tables']['tasks']['Row'];

const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId)
  .returns<Task[]>();
```

Regenerar tipos después de cada migración:
```bash
pnpm dlx supabase gen types typescript --project-id <id> > src/types/supabase.ts
```

### Realtime — suscripciones

```typescript
// ✅ SIEMPRE desuscribirse al desmontar el componente
useEffect(() => {
  const channel = supabase
    .channel('tasks-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, handler)
    .subscribe();

  return () => { supabase.removeChannel(channel); }; // cleanup obligatorio
}, []);
```

---

## 6. GESTIÓN DE ESTADO — ZUSTAND

```typescript
// ✅ Un store por módulo, no un store global gigante
// src/modules/tasks/stores/tasks.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TasksState {
  pendingSync: Task[];
  addPending: (task: Task) => void;
  clearPending: () => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      pendingSync: [],
      addPending: (task) => set((s) => ({ pendingSync: [...s.pendingSync, task] })),
      clearPending: () => set({ pendingSync: [] }),
    }),
    { name: 'vexaro-tasks-sync' }
  )
);
```

- Zustand es para **estado de UI** y **cola de sincronización offline**.
- **No** usar Zustand para datos del servidor — para eso está TanStack Query.

---

## 7. SINCRONIZACIÓN OFFLINE (IndexedDB + Dexie.js)

```typescript
// src/lib/db/offline.db.ts
import Dexie, { type Table } from 'dexie';

class VexaroOfflineDB extends Dexie {
  tasks!: Table<Task>;
  transactions!: Table<FinancialTransaction>;
  pendingOps!: Table<PendingOperation>;

  constructor() {
    super('vexaro-offline');
    this.version(1).stores({
      tasks: '++id, user_id, status, due_date, updated_at',
      transactions: '++id, user_id, date, category_id',
      pendingOps: '++id, table, operation, payload, created_at',
    });
  }
}

export const offlineDB = new VexaroOfflineDB();
```

- Cada operación offline debe registrarse en `pendingOps` con tipo (INSERT/UPDATE/DELETE) y payload.
- Al reconectar, reproducir la cola en orden `created_at ASC`.
- Conflictos: **latest-write-wins** usando el campo `updated_at`.

---

## 8. COMPONENTES — REGLAS DE CÓDIGO

```typescript
// ✅ Siempre usar componentes funcionales con tipos explícitos
interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  // ...
}

// ❌ Nunca usar default exports en módulos internos (dificulta refactoring)
export default function TaskCard() {} // EVITAR

// ✅ Usar default export solo en page.tsx y layout.tsx (requerido por Next.js)
```

### Server vs Client Components

```typescript
// Añadir 'use client' SOLO cuando sea necesario:
// - Usa hooks (useState, useEffect, useCallback...)
// - Requiere event listeners (onClick, onChange...)
// - Usa contexto del browser (window, localStorage...)
// Si no cumple ninguna condición → Server Component por defecto.
```

---

## 9. COMMITS Y CONTROL DE VERSIONES

### Convención de commits (Conventional Commits)

```
feat(tasks): add Pomodoro timer to task cards
fix(auth): handle expired session tokens correctly
chore(deps): update dependencies
docs(srs): update architecture section
refactor(finance): extract transaction service layer
test(habits): add unit tests for streak calculation
```

### Reglas de ramas

```
main          → producción (protegida, solo via PR)
develop       → rama de integración
feat/<nombre> → nuevas funcionalidades
fix/<nombre>  → correcciones de bugs
chore/<nombre>→ mantenimiento, deps
```

### Pre-commit hooks (Husky + lint-staged)

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

---

## 10. TESTING

```bash
# Ejecutar tests
pnpm test           # unit tests (Vitest)
pnpm test:e2e       # end-to-end (Playwright)
pnpm test:coverage  # cobertura
```

### Prioridades de testing

1. **Servicios y lógica de negocio** — cobertura alta (>80%).
2. **Cálculos críticos** — streak de hábitos, progreso de metas, cash flow.
3. **Flujos de autenticación** — login, logout, sesión expirada.
4. **Sincronización offline** — queue, replay, resolución de conflictos.
5. **Componentes UI** — solo snapshot o smoke tests; no testear shadcn/ui.

---

## 11. PERFORMANCE

- Usar `React.lazy` + `Suspense` para módulos no críticos (reports, settings).
- Usar `dynamic` de Next.js para componentes pesados (FullCalendar, Recharts).
- Limitar suscripciones Realtime a las vistas activas solamente.
- Habilitar `staleTime` adecuado en TanStack Query para evitar refetches innecesarios.
- Indexar columnas usadas en filtros frecuentes (ver sección 11 del SRS).

```sql
-- Migraciones de índices recomendados
CREATE INDEX idx_tasks_user_due ON tasks(user_id, due_date);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habit_id, completed_at);
CREATE INDEX idx_goals_user_due ON goals(user_id, due_date);
```

---

## 12. CHECKLIST PRE-DEPLOY

Antes de cada deploy a producción, verificar:

- [ ] `pnpm run build` sin errores ni warnings de TypeScript.
- [ ] `pnpm run lint` sin errores ESLint.
- [ ] Tests pasando (`pnpm test`).
- [ ] Migraciones de base de datos aplicadas y testeadas en staging.
- [ ] Variables de entorno configuradas en Vercel (no usar `.env` en producción).
- [ ] RLS habilitado y verificado en todas las tablas nuevas.
- [ ] Secrets almacenados en Supabase Vault, no en variables de entorno del servidor.
- [ ] `pnpm-lock.yaml` commiteado y actualizado.
- [ ] No hay `console.log` de debug en código de producción.
- [ ] No hay `any` types nuevos en TypeScript.

---

## 13. LO QUE EL AGENTE NUNCA DEBE HACER

| Acción | Razón |
|---|---|
| Usar `npm`, `yarn`, o `bun` | Política de seguridad del proyecto. Solo `pnpm`. |
| Commitear `.env` con valores reales | Exposición de secretos. |
| Poner `service_role` key en el cliente | Compromete toda la seguridad de la BD. |
| Hardcodear IDs de usuario o UUIDs | Fragilidad y riesgo de seguridad. |
| Usar `any` en TypeScript | Anula las garantías del sistema de tipos. |
| Crear SQL sin habilitar RLS | Datos expuestos entre usuarios. |
| Importar internos de otro módulo | Rompe el encapsulamiento modular. |
| Crear suscripciones Realtime sin cleanup | Memory leaks y consumo de cuota. |
| Instalar paquetes sin revisar su mantenimiento | Riesgo de supply-chain attack. |
| Saltarse este archivo en decisiones técnicas | Inconsistencia y deuda técnica. |

---

> **Versión:** 1.0 | **Proyecto:** Vexaro | **Actualizado:** 2026
> Cualquier excepción a estas reglas debe ser aprobada explícitamente por el dueño del proyecto y documentada aquí.
