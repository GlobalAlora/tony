# Tony Piorno — Media Kit

Landing page tipo media kit profesional para Tony Piorno (creador de contenido), con formulario de propuestas estructurado conectado a Supabase y notificaciones por email vía Resend.

**Alcance de esta versión:** sin panel admin, sin login, sin gestión de estados vía UI. Las propuestas se guardan en la tabla `proposals` de Supabase y se gestionan manualmente desde el **Table Editor** del dashboard de Supabase (filtros y orden nativos, sin costo de desarrollo extra). Eso se construye más adelante si el volumen de propuestas lo justifica.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres) — solo para guardar propuestas, sin Supabase Auth
- Resend + react-email — notificación a Tony + auto-respuesta a la marca
- react-hook-form + zod — validación de formulario (cliente y servidor comparten el mismo schema)
- recharts — gráfico de audiencia
- Vitest — tests unitarios / de integración

## 1. Requisitos

- Node 20+
- pnpm (`corepack enable` si no lo tenés instalado)
- Una cuenta de Supabase (gratis) y una de Resend (gratis)

## 2. Instalar dependencias

```bash
pnpm install
```

## 3. Variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores:

```bash
cp .env.example .env.local
```

| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | El dominio real una vez que esté definido. Mientras tanto podés dejar el placeholder. |
| `SUPABASE_URL` | Supabase Dashboard → tu proyecto → Project Settings → API → "Project URL" |
| `SUPABASE_ANON_KEY` | La misma pantalla → "anon public" key. Es segura de usar acá: la tabla `proposals` tiene RLS con una policy de solo-INSERT (ver abajo), así que esta key nunca puede leer, editar ni borrar propuestas existentes. |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Una dirección en un dominio verificado en Resend (ver paso 6). Formato: `"Tony Piorno <notificaciones@tudominio.com>"` |
| `CREATOR_NOTIFICATION_EMAIL` | Opcional, default `piornotony@gmail.com` |

## 4. Crear el proyecto en Supabase y correr la migración

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com).
2. Andá a **SQL Editor** en el dashboard.
3. Pegá y ejecutá el contenido de [`supabase/migrations/20260801120000_create_proposals.sql`](supabase/migrations/20260801120000_create_proposals.sql).

   Esto crea la tabla `proposals` con:
   - Row Level Security activado y una policy que solo permite **INSERT** público (nadie puede leer/editar/borrar desde la app — eso queda para el Table Editor).
   - `status` controlado (`new` / `in_conversation` / `closed` / `rejected`) vía `CHECK` constraint.
   - Índices en `status` y `created_at` para que el Table Editor filtre/ordene rápido.
   - Trigger que actualiza `updated_at` automáticamente al editar una fila.

   Si preferís usar la Supabase CLI en vez del SQL Editor:
   ```bash
   supabase link --project-ref <tu-project-ref>
   supabase db push
   ```

## 5. Gestionar propuestas (sin panel admin)

Las propuestas nuevas quedan en la tabla `proposals`. Para verlas y gestionarlas:

1. Supabase Dashboard → **Table Editor** → tabla `proposals`.
2. Filtrá por `status` (columna con los valores `new`, `in_conversation`, `closed`, `rejected`) usando el filtro nativo de la tabla.
3. Ordená por `created_at` haciendo click en el header de la columna.
4. Para actualizar el estado de una propuesta o agregar una nota interna, hacé doble click en la celda `status` o `internal_notes` y editá directamente — se guarda solo.

No hace falta ninguna URL ni login adicional: es el mismo login con el que entrás al dashboard de Supabase.

## 6. Configurar Resend

1. Creá una cuenta en [resend.com](https://resend.com) y generá una API key.
2. Para que la auto-respuesta le llegue a marcas reales (no solo a vos), tenés que **verificar un dominio propio** en Resend → Domains → Add Domain, y agregar los registros DNS que te pide.
   - Mientras no verifiques un dominio, `RESEND_FROM_EMAIL` puede quedar en `onboarding@resend.dev`, pero ese remitente **solo entrega emails a la casilla dueña de la cuenta de Resend** — sirve para probar el flujo de notificación a Tony, pero la auto-respuesta a la marca no va a llegar hasta que verifiques un dominio real.
3. Una vez verificado el dominio, actualizá `RESEND_FROM_EMAIL` a una dirección de ese dominio (ej. `notificaciones@tonypiorno.com`).

## 7. Correr en local

```bash
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
pnpm test        # tests unitarios (Vitest)
pnpm test:watch  # tests en modo watch
pnpm lint        # ESLint
pnpm build       # build de producción
```

## 8. Deploy a Vercel

1. Subí el repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importá el repo.
3. Cargá las mismas variables de entorno del paso 3 en **Project Settings → Environment Variables**.
4. Deploy. Vercel detecta Next.js automáticamente, no hace falta configuración adicional.
5. Actualizá `NEXT_PUBLIC_SITE_URL` con el dominio final de Vercel (o tu dominio propio si conectás uno) y volvé a deployar.

## Contenido pendiente de cargar

Estos espacios están armados y funcionando, pero con placeholders claramente marcados en el código — buscá `PLACEHOLDER` en `src/lib/constants/creator-data.ts`:

- **Fotos/video real del hero** → reemplazar en `src/components/hero/Hero.tsx` (prop `src` de `MediaPlaceholder`) una vez que exista `/public/images/hero.jpg` o similar.
- **Videos embebidos de TikTok/Instagram** en los pilares de contenido → agregar la URL real en `embedUrl` de cada item en `CONTENT_PILLARS` (`src/lib/constants/creator-data.ts`). El componente ya sabe generar el embed oficial de TikTok/Instagram apenas hay una URL real.
- **Casos de marcas anteriores** → reemplazar los 3 items de ejemplo en `CASE_STUDIES`.
- **Métricas de audiencia (edad/género/ubicación)** → reemplazar `AUDIENCE_AGE_BREAKDOWN`, `AUDIENCE_GENDER_BREAKDOWN`, `AUDIENCE_TOP_LOCATIONS` con el export real de TikTok Analytics / Meta Business Suite, y poner `AUDIENCE_DATA_IS_PLACEHOLDER = false`.
- **Alcance promedio por video** → completar el stat `avg-reach` en `HEADLINE_STATS`.
- **Tarifas** → no se inventaron cifras en el FAQ ni en el schema (a propósito, para no publicar datos falsos). El formulario ya pide presupuesto estimado a la marca; si en algún momento querés publicar rangos orientativos propios, se agregan en `src/lib/constants/faq.ts`.

## Estructura del proyecto

```
src/
├── app/                    # Rutas (App Router), metadata, sitemap, robots, llms.txt, API route
├── components/             # Organizado por sección/feature (hero, stats, proposal-form, ...)
├── hooks/
├── lib/
│   ├── constants/           # Datos del creador, FAQ, opciones de formulario — fuente única de verdad
│   ├── email/                # Templates react-email + envío vía Resend
│   ├── supabase/              # Cliente server-only
│   ├── seo/                   # JSON-LD (Person + FAQPage)
│   └── validations/          # Schema zod compartido cliente/servidor
├── types/
└── test/
supabase/migrations/        # SQL de la tabla proposals
```
# tony
