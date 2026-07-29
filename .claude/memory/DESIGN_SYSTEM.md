# Design System — "Atelier" (v1)

> The single source of truth for the app's visual language. Every new/reworked screen MUST
> follow this. Update this file when the system evolves — never fork styles ad-hoc.

## 1. Brand personality

A **professional studio for career documents**: calm, precise, quietly confident.
Think editorial print shop, not SaaS gradient circus. The interface recedes; the
user's career content is the hero.

- ✅ generous whitespace, crisp 1px hairlines, warm paper neutrals, one saturated brand hue + one warm accent used sparingly
- ❌ floating particles, animated blobs, rainbow gradients, glassmorphism, emoji-in-UI, gradient text everywhere

## 2. Color tokens (Tailwind v4 `@theme` in `app/globals.css`)

Neutrals — warm "paper & ink" (Tailwind `stone` scale):
- Surfaces: page `stone-50` (#FAFAF9), raised cards `white`, sunken `stone-100`
- Ink: primary text `stone-900` (#1C1917), secondary `stone-600`, muted `stone-500`
- Hairlines: `stone-200` borders everywhere (1px), `stone-300` on hover

Brand — **"Evergreen"** (custom teal-leaning emerald, `--color-brand-*` 50–950):
- 500 `#0E9384` · 600 `#0B7A6E` (primary actions, active nav, focus rings) · 700 `#0A655C`
- Tints 50 `#F0FBF9` / 100 `#D7F4EF` for selected/hover washes

Accent — **"Amber"** (`--color-accent-*`): 500 `#F59E0B`, 600 `#D97706` — reserved for
AI/enhance moments (sparkles), highlights, "new" badges. Never for large surfaces.

Semantic: success `emerald-600`, danger `red-600` (+ `red-50` wash), warning `amber-600`, info `sky-600`.

Dark ink surface (sidebar/footer option): `#141210` with stone-400 text — use sparingly; default chrome is LIGHT.

## 3. Typography

- **Display/headings:** `Space Grotesk` (var `--font-display`) — geometric, distinctive; weights 500/600/700. Tracking tight (-0.01em to -0.02em) on ≥24px.
- **UI/body:** `Inter` (var `--font-inter`) 400/500/600; 14px base in app chrome, 16px in marketing/forms.
- Resume TEMPLATE fonts unchanged (Inter, Source Sans 3, Roboto, Libre Baskerville) — they are the user's document typography, not app chrome.
- Scale: 12 (caption) · 14 (body) · 16 (body-lg) · 18 (h4) · 22 (h3) · 28 (h2) · 36 (h1) · 52+ (hero, marketing only).

## 4. Shape, depth, spacing

- Radius: controls 8px (`rounded-lg`), cards/modals 12px (`rounded-xl`), pills full.
- Borders first, shadows second: default card = `bg-white border border-stone-200`; shadow only on floating layers (modals `shadow-xl`, popovers `shadow-lg`, sticky bars `shadow-sm`).
- Spacing: 8pt grid; page gutter `px-6 lg:px-8`; section rhythm 48–96px marketing, 24–32px app; card padding 20–24px.
- Max widths: app content `max-w-6xl`, forms `max-w-2xl`, marketing `max-w-7xl`.

## 5. Motion

- 150ms (hover) / 200–250ms (enter) ease-out; exits faster than entries.
- Allowed: opacity/translate-y(4–8px) fades on mount, subtle scale on modals (0.98→1), skeleton shimmer.
- Forbidden: infinite decorative loops (blobs/particles/pulse), hover scale >1.02, rotate-on-hover.
- Respect `prefers-reduced-motion` (utility `motion-reduce:transition-none` or global media rule).

## 6. Core components (`components/ui/` — REUSE, never re-style ad hoc)

- `Button` — variants: `primary` (brand-600 bg, white text), `secondary` (white bg, stone-200 border, stone-700 text), `ghost`, `danger`, `accent` (AI actions); sizes sm/md/lg; `loading` prop with spinner; icon slots.
- `Input`, `Textarea`, `Select`, `DateField` — 1px stone-300 border, focus: brand-600 ring 2px + border; error state red + message; always with `Label` (+ optional hint/required mark). `Field` wrapper handles label+error wiring & ids.
- `Card` — white, stone-200 border, rounded-xl; optional header/footer rows.
- `Modal` — portal, backdrop `stone-950/40`, centered panel rounded-xl shadow-xl, focus-trap, Esc + backdrop close, sizes sm/md/lg; standard header (title + X) and footer (actions right-aligned).
- `Toast` — global provider (`useToast`): success/error/info; bottom-right stack; auto-dismiss 5s; replaces ALL silent console.error UX.
- `ConfirmDialog` — danger confirmation built on Modal (destructive actions must use it).
- `EmptyState` — icon in soft brand-tinted circle, title, description, primary CTA.
- `Badge` — soft tints (brand/accent/stone/semantic).
- `Skeleton` — stone-200 shimmer blocks; every async list/page has a skeleton, never text "Loading...".
- `PageHeader` — h1 + description + actions row; used by every dashboard page.
- `Stepper` — onboarding progress (numbered, check on complete, brand fill).

## 7. Layout patterns

- **Dashboard chrome:** light sidebar 260px (white, stone-200 right hairline): logo mark, nav items (rounded-lg, active = brand-50 wash + brand-700 text + 3px brand left indicator), user card + sign-out at bottom. Mobile: collapses to top bar + slide-over drawer.
- **Marketing (landing/auth):** clean white/stone-50 bands, 1px hairline dividers, sticky translucent header (backdrop-blur, hairline on scroll).
- **Forms:** single column, labels above, 20px vertical rhythm; destructive/secondary actions left, primary right.
- **Tables/lists:** header row stone-500 uppercase 12px; row hover stone-50; actions right-aligned, icon buttons with tooltips + aria-labels.

## 8. Accessibility non-negotiables

- Visible focus: `focus-visible:ring-2 ring-brand-600 ring-offset-2` on every interactive element.
- Contrast ≥4.5:1 body text; icon-only buttons get `aria-label`; modals trap focus and restore it on close; forms label every control; errors are text, not just color.

## 9. Voice

- Product name: **Resume Builder** (unchanged), tagline "Craft resumes that get read."
- Microcopy: sentence case, direct, no exclamation inflation; errors say what happened + what to do next.
