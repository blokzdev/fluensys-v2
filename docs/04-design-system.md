# 04 — Design System: "Precision Engineering, Dark Water"

A consultancy that designs impellers should feel like it designed its
website with the same rigor. The aesthetic is **engineering-luxe**: deep
abyssal surfaces, instrument-panel accents, blueprint textures, typography
with calliper precision, and motion that behaves like well-damped machinery
— smooth, deliberate, never bouncy.

Source of truth: the `@theme` block in `src/styles/globals.css`.

## Color

| Token | Value | Role |
| --- | --- | --- |
| `abyss` | `#04070d` | Page background |
| `surface` / `surface-2` / `surface-3` | `#0a111f` / `#101a2c` / `#16223a` | Raised planes, cards, tabs |
| `ink` / `ink-dim` / `ink-faint` | `#e9eef6` / `#a3b2c5` / `#6b7a90` | Text hierarchy |
| `azure` | `#2584c5` | **Brand blue (v1 heritage)** — primary actions |
| `azure-bright` | `#4aa8e8` | Links, active states, eyebrows |
| `azure-deep` | `#15578a` | Glows, washes |
| `green` / `green-bright` | `#72bf44` / `#8fd95e` | **Brand green (v1 heritage)** — values, success, secondary accent |
| `line` / `line-strong` | rgba steel 14% / 28% | Hairlines, borders |

Rules: azure is the workhorse accent; green is reserved for brand-values
moments, success states and the gradient pairing with azure (progress bar,
particle field). Never introduce new hues without adding tokens here first.

## Typography

| Font | Token | Role |
| --- | --- | --- |
| Space Grotesk | `font-display` | Headings, buttons, nav — technical confidence |
| Inter | `font-body` | Body copy — neutral readability |
| JetBrains Mono | `font-mono` | Eyebrows, meta, figure captions, data — instrument labels |

Patterns: `text-eyebrow` (mono, 0.72rem, 0.22em tracking, uppercase, azure)
precedes every section title; display headings use `-0.02em` tracking and
`text-balance`; article prose is `prose-fluensys` (70ch, 1.85 line-height).

## Texture & depth

- `bg-blueprint` — 56px engineering grid, radially masked; on alternating
  sections at 25–60% opacity.
- `card-surface` — gradient surface + hairline + 1rem radius; the universal
  container.
- `glass` — blurred translucency for the header and overlays.
- Radial `azure-deep` washes light major sections from above.

## Motion grammar

| Pattern | Implementation | Use |
| --- | --- | --- |
| Line-rise heading | `SplitHeading` (SplitText `mask: "lines"`, `power4.out`, 0.085 stagger) | Every section/page title |
| Fade-up reveal | `Reveal` (autoAlpha + y:28, `power3.out`, optional 0.09 stagger, `once`) | Cards, lists, paragraphs |
| Hero entrance | staggered `data-hero-fade` after 0.5s | Hero only |
| Scroll parallax | scrubbed ScrollTrigger (hero canvas drift) | Sparingly |
| Smooth scroll | Lenis 1.1s exponential ease, ScrollTrigger-synced | Site-wide (desktop wheel) |
| Hover | translate/scale ≤ 1.05, 300–700ms `--ease-out-expo`; arrows gain `gap` | Cards, links, buttons |
| Marquee | CSS keyframes 42s linear, pause on hover | Client logos |

Hard rules: transforms + opacity only (no layout properties); everything
gated behind `prefers-reduced-motion` (content must remain fully visible
without JS); entrances run `once` — scrolling back never replays; durations
0.3–1.1s, eases from the `power`/expo family.

## The WebGL statement (and its limits)

One scene: the hero "Volute" flow field (`src/components/three/HeroScene.tsx`)
— 6,500 additive particles swept with differential rotation (fast at the
impeller eye, slow at the rim), azure→green by radius, pointer parallax.
All motion is vertex-shader-side; DPR clamped to 1.75; lazy-loaded client
chunk; skipped entirely for reduced-motion/save-data (the CSS gradient +
grid backdrop stands alone). Future 3D belongs in articles as figures
(interactive pump cutaways — roadmap), never as decoration on text pages.

## Layout

- `container-site`: max-w 80rem, fluid `clamp(1.25rem, 4vw, 3rem)` gutters.
- Section rhythm: `py-24 md:py-32`; alternate `abyss` and `surface` with
  hairline borders.
- Header: fixed 72px, transparent → glass after 24px scroll.
- Article: `1fr 280px` sidebar grid (TOC, PDF card, tags) collapsing under
  `lg`; sidebar order-first on mobile (PDF card above body).
- Breakpoints: mobile-first; `sm` 640, `md` 768, `lg` 1024 are the working
  set. Test at 360px — UK industrial readers use old phones.

## Voice in microcopy

Confident, dry, lightly playful in system moments (404: "This page has
cavitated"), never jokey in content. CTAs are verbs: "Explore Services",
"Request Service", "Download PDF", "Get in Touch".
