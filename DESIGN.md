# App design notes — Villa Puncak Annisa

## Direction

- **Audience**: Indonesian home buyers arriving from Meta/Google/TikTok ads, mostly on mobile. One job: leave name + WhatsApp in the lead form.
- **Mood**: luxury villa / resort — calm, premium, green. Borrowed from the owner's flyer: deep forest green, champagne gold, warm cream, the roof-and-hill logo stroke.
- **Surfaces**: `/` is a *site* surface (storytelling, display serif, photography). `/admin` is an *app* surface (restrained table, same tokens).

## Tokens (src/index.css)

| Token | Value | Use |
| --- | --- | --- |
| `--forest-deep` | oklch(0.22 0.05 152) | hero wash, dark bands, header |
| `--forest` | oklch(0.33 0.07 150) | cards, buttons, spec band |
| `--gold` / `--gold-soft` / `--gold-deep` | oklch(0.78 0.11 85) / (0.89 0.06 88) / (0.52 0.09 75) | CTAs (`bg-gold-sheen`), accents, italic display words (`text-gold-gradient`) |
| `--cream` / `--cream-deep` | oklch(0.97 0.018 90) / (0.93 0.03 88) | page ground, alt sections |
| `--wa` | oklch(0.52 0.13 150) | WhatsApp buttons only |

Type: **Cormorant Garamond Variable** (display, italic gold for the emotional word of each heading, lining numerals) + **Plus Jakarta Sans Variable** (body/UI; Jakarta-designed). Self-hosted via fontsource, Latin files preloaded, metric-matched local fallbacks (`VPA Serif *`, `VPA Sans *`) so the swap does not shift layout.

Shape: radius 22–28px on cards, pill buttons; no border+radius combos on the landing; depth by forest-tinted shadows.

Signature: the gold `MountainMark` stroke (logo, stat rail, form backdrop) and the rotated "Diskon 25jt" seal from the flyer.

## Section order (landing)

Hero (photo, headline, CTA, stat rail) → Promo → Nuansa villa (aerial + render, 4 points) → Fasilitas (4 tilt cards) → Tipe & Denah/Siteplan (type cards + zoomable viewer, legend) → Spesifikasi → KPR (BTN, BNI) → Lokasi → Lead form → FAQ → Footer. Sticky mobile bar (Isi Form / WhatsApp) after the hero, hidden while the form is on screen; floating WhatsApp on ≥ md.

## Performance architecture

- Header + hero are server-rendered at build time into `index.html` (`#vpa-shell`, see `scripts/preload-landing.ts`), so first paint does not wait for JS; React mounts the same hero and removes the shell. Hero intro animations are skipped when the shell was shown.
- The landing route chunks are modulepreloaded; everything below the fold is a separate lazy chunk (`BelowFold`), lightbox / confetti / Lenis load on demand.
- Hero image: portrait crop for mobile (`hero-m-*.webp`), landscape for desktop, both preloaded with `media`.
- Motion: framer-motion `LazyMotion` + `m`, `MotionConfig reducedMotion="user"`; Lenis smooth scroll is skipped under reduced motion.
