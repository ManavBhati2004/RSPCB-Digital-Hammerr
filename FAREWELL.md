---
title: Farewell Section — Cinematic Closing Section Portability Guide
tags: [spec, feature, farewell, ui, glassmorphism, animation]
aliases: [Farewell Spec, Closing Section Spec, Thank-You Section]
status: shipped
related: ["[[INDEX]]", "[[CLAUDE]]", "[[LEADERBOARD]]", "[[HISTORY]]"]
---

# FAREWELL.md
## Cinematic Closing Section — Portability Guide

A complete drop-in spec for replicating the "Thank You for Visiting" cinematic farewell in a similar project. Contains the full markup, full CSS, dependencies, asset rules, customization knobs, and a step-by-step porting checklist.

---

### 1. WHAT THIS SECTION IS
A full-bleed closing section at the bottom of the page that:
- Crossfades **4 landmark photographs** in a 28-second infinite loop with Ken Burns zoom
- Sits behind a **subtle dark-green vignette overlay** that keeps imagery clearly visible at center
- Centers a **premium glassmorphism panel** with eyebrow, title, gold-hairline divider, and subtitle
- Drifts **10 floating gold/emerald motes** for atmospheric depth
- Includes a slow **horizontal reflection sweep** across the glass panel every 9 seconds
- Pins a glassmorphic **signature chip** beneath the panel
- Fades in on scroll into view, with optional **slow parallax** drift on the background
- Respects `prefers-reduced-motion` (freezes on first frame, no sweep, no motes, no parallax)
- Scales cleanly from 320px mobile to 4K, with the motes hidden and blur reduced on ≤640px

### 2. SUGGESTED COPY
- **Eyebrow** (local-language tagline, optional): e.g. `Atithi Devo Bhava · अतिथि देवो भव`
- **Title**: `Thank you for visiting`
- **Subtitle**: `Celebrating sustainability, culture, and the timeless beauty of <Place>.`
- **Signature**: `<Organization> · <City> · <Region>` with a small glowing emerald dot

Swap "Udaipur" / "Pollution Control Board · Udaipur · Rajasthan" for your project's place + sponsor.

### 3. TECH BASELINE REQUIRED IN TARGET PROJECT
- Static `index.html` + linked CSS (no framework required)
- **GSAP 3.12+** and **ScrollTrigger 3.12+** loaded globally (CDN is fine) — used by the project's existing scroll-reveal binding
- A `reveal` class that fades in elements via either an `IntersectionObserver` (adds a class like `.reveal--visible`) **or** a ScrollTrigger fade batch
- A `data-scroll-parallax` attribute hook (optional — drives background drift). If your target project doesn't have this binding, drop the attribute and skip §10.B; parallax is the only feature that requires JS, everything else is pure CSS

No additional dependencies (no React, no Three.js, no Lottie). Total cost: one HTML block + one CSS file + 4 images.

### 4. FILES ADDED TO TARGET PROJECT
```
/styles/farewell.css                                 (new — full code in §6)
/assets/farewell/<image-1>.<ext>                     (your landmark photo 1)
/assets/farewell/<image-2>.<ext>                     (your landmark photo 2)
/assets/farewell/<image-3>.<ext>                     (your landmark photo 3)
/assets/farewell/<image-4>.<ext>                     (your landmark photo 4)
```
Edit `index.html` to:
- Add `<link rel="stylesheet" href="styles/farewell.css">` in `<head>`
- Insert the markup from §5 at the bottom of `<main>` (or wherever you want the closing section)

### 5. HTML MARKUP (copy-paste, customize copy + image paths)

```html
<!-- ─── Cinematic farewell section ──────────────────────────────────────
     Background rotation reads landmark photos from /assets/farewell/.
     To swap an image: replace the file at the path below (keep the same
     filename) OR update the src attribute. Optional remote fallback URLs
     in data-fallback load automatically if a local file is missing.

       frame 1 → assets/farewell/IMAGE_1.jpg
       frame 2 → assets/farewell/IMAGE_2.jpg
       frame 3 → assets/farewell/IMAGE_3.jpg
       frame 4 → assets/farewell/IMAGE_4.jpg
─────────────────────────────────────────────────────────────────────── -->
<section class="eco-farewell reveal" aria-label="Farewell">
  <div class="eco-farewell__stage" aria-hidden="true" data-scroll-parallax="0.10">
    <img class="eco-farewell__image" data-frame="1"
         src="assets/farewell/IMAGE_1.jpg"
         data-fallback="https://example.com/fallback-1.jpg"
         onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.dataset.fallback;}"
         alt="" loading="lazy" decoding="async" fetchpriority="low">
    <img class="eco-farewell__image" data-frame="2"
         src="assets/farewell/IMAGE_2.jpg"
         data-fallback="https://example.com/fallback-2.jpg"
         onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.dataset.fallback;}"
         alt="" loading="lazy" decoding="async" fetchpriority="low">
    <img class="eco-farewell__image" data-frame="3"
         src="assets/farewell/IMAGE_3.jpg"
         data-fallback="https://example.com/fallback-3.jpg"
         onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.dataset.fallback;}"
         alt="" loading="lazy" decoding="async" fetchpriority="low">
    <img class="eco-farewell__image" data-frame="4"
         src="assets/farewell/IMAGE_4.jpg"
         data-fallback="https://example.com/fallback-4.jpg"
         onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src=this.dataset.fallback;}"
         alt="" loading="lazy" decoding="async" fetchpriority="low">
  </div>
  <div class="eco-farewell__overlay" aria-hidden="true"></div>
  <div class="eco-farewell__motes" aria-hidden="true">
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
    <span class="eco-farewell__mote"></span>
  </div>
  <div class="eco-farewell__content">
    <div class="eco-farewell__glass">
      <p class="eco-farewell__eyebrow">Your eyebrow tagline</p>
      <h2 class="eco-farewell__title">Thank you for visiting</h2>
      <span class="eco-farewell__divider" aria-hidden="true"></span>
      <p class="eco-farewell__subtitle">Celebrating sustainability, culture, and the timeless beauty of &lt;Place&gt;.</p>
    </div>
    <p class="eco-farewell__signature">
      <span class="eco-farewell__signature-dot" aria-hidden="true"></span>
      Organization · City · Region
    </p>
  </div>
</section>
```

**Notes on the markup:**
- `data-frame="N"` must stay sequential 1–4 (it's how each image gets its `animation-delay`)
- `data-fallback` is optional — remove it and the `onerror` attribute if you don't want a remote fallback
- The `reveal` class triggers the project's fade-in-on-scroll; if your target project doesn't have one, the section still renders, just without the scroll-in effect
- `aria-hidden` on decorative containers + empty `alt=""` on images keeps screen readers focused on the title/subtitle text

### 6. CSS — FULL CONTENT OF `styles/farewell.css`

Drop this file in `styles/farewell.css` (or wherever your CSS lives). It uses **two CSS custom properties** from the parent project — see §7 for what they are and how to substitute concrete values if your target doesn't define them.

```css
/* ══════════════════════════════════════════════════════════
   ECO FAREWELL — Cinematic closing section
   28s crossfade across 4 landmark photos with Ken Burns
   zoom, subtle emerald overlay, refined glassmorphic
   content panel, floating motes, and slow reflection sweep.
══════════════════════════════════════════════════════════ */
.eco-farewell {
  position: relative;
  min-height: 78vh;
  display: grid;
  place-items: center;
  padding: clamp(80px, 12vw, 160px) 24px;
  overflow: hidden;
  isolation: isolate;
  background: var(--g-700, #15803d); /* fallback: Tailwind green-700 */
  color: #ffffff;
  content-visibility: auto;
  contain-intrinsic-size: 0 720px;
}

.eco-farewell__stage {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.eco-farewell__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.0);
  will-change: opacity, transform;
  animation: ecoFarewellFade 28s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
.eco-farewell__image[data-frame="1"] { animation-delay: 0s; }
.eco-farewell__image[data-frame="2"] { animation-delay: 7s; }
.eco-farewell__image[data-frame="3"] { animation-delay: 14s; }
.eco-farewell__image[data-frame="4"] { animation-delay: 21s; }

@keyframes ecoFarewellFade {
  0%   { opacity: 0; transform: scale(1.00); }
  3%   { opacity: 1; transform: scale(1.02); }
  22%  { opacity: 1; transform: scale(1.08); }
  25%  { opacity: 0; transform: scale(1.10); }
  100% { opacity: 0; transform: scale(1.00); }
}

.eco-farewell__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 120% 90% at center,
      rgba(5, 46, 22, 0.0) 0%,
      rgba(5, 46, 22, 0.35) 80%,
      rgba(5, 46, 22, 0.55) 100%),
    linear-gradient(180deg,
      rgba(0, 0, 0, 0.18) 0%,
      rgba(0, 0, 0, 0.0) 35%,
      rgba(5, 46, 22, 0.25) 100%);
  pointer-events: none;
}

.eco-farewell__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 880px;
  display: grid;
  gap: clamp(14px, 2.4vw, 28px);
  justify-items: center;
}

.eco-farewell__eyebrow {
  margin: 0;
  font-size: clamp(0.78rem, 1.5vw, 0.92rem);
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: rgba(253, 224, 165, 0.95);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
}

.eco-farewell__title {
  margin: 0;
  font-family: var(--font-display, "Playfair Display", Georgia, serif);
  font-size: clamp(2.6rem, 9vw, 6rem);
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #fffdf5 0%, #f5e9c0 50%, #d6e9d4 100%);
  -webkit-background-clip: text;
          background-clip: text;
  color: transparent;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

.eco-farewell__divider {
  display: inline-block;
  width: 56px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d6b14f, transparent);
  opacity: 0.7;
}

.eco-farewell__subtitle {
  margin: 0;
  max-width: 620px;
  font-size: clamp(1.02rem, 2vw, 1.32rem);
  font-weight: 400;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.45);
}

.eco-farewell__signature {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.eco-farewell__signature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399; /* emerald-400 */
  box-shadow: 0 0 10px #34d399;
  flex-shrink: 0;
}

/* ── Premium glass panel ──────────────────────────────── */
.eco-farewell__glass {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  max-width: min(720px, 92vw);
  padding: clamp(36px, 5.5vw, 72px) clamp(28px, 5vw, 56px);
  border-radius: clamp(24px, 3vw, 36px);
  display: grid;
  gap: clamp(14px, 2.2vw, 26px);
  justify-items: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(6, 78, 59, 0.18) 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px) saturate(120%);
  -webkit-backdrop-filter: blur(12px) saturate(120%);
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.30),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15);
}

.eco-farewell__glass::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 30%,
    rgba(255, 248, 220, 0.10) 50%,
    transparent 70%
  );
  transform: translateX(-100%);
  animation: glassReflect 9s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

.eco-farewell__glass::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 60px rgba(16, 185, 129, 0.08);
  pointer-events: none;
  z-index: 0;
}

.eco-farewell__glass > * {
  position: relative;
  z-index: 1;
}

/* ── Floating environmental motes ────────────────────── */
.eco-farewell__motes {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.eco-farewell__mote {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  opacity: 0;
  box-shadow: 0 0 8px currentColor, 0 0 14px currentColor;
  animation: moteDrift 22s ease-in-out infinite alternate;
  will-change: transform, opacity;
}

.eco-farewell__mote:nth-child(1)  { left:  8%; top: 22%; color: #fde7a5; animation-duration: 22s; animation-delay: 0s; }
.eco-farewell__mote:nth-child(2)  { left: 18%; top: 68%; color: #34d399; animation-duration: 28s; animation-delay: 2s;  width: 3px; height: 3px; }
.eco-farewell__mote:nth-child(3)  { left: 32%; top: 14%; color: #fcd34d; animation-duration: 26s; animation-delay: 5s; }
.eco-farewell__mote:nth-child(4)  { left: 44%; top: 78%; color: #6ee7b7; animation-duration: 30s; animation-delay: 1s;  width: 5px; height: 5px; }
.eco-farewell__mote:nth-child(5)  { left: 58%; top: 18%; color: #fde7a5; animation-duration: 24s; animation-delay: 4s; }
.eco-farewell__mote:nth-child(6)  { left: 66%; top: 62%; color: #34d399; animation-duration: 28s; animation-delay: 6s;  width: 3px; height: 3px; }
.eco-farewell__mote:nth-child(7)  { left: 76%; top: 28%; color: #fcd34d; animation-duration: 26s; animation-delay: 3s; }
.eco-farewell__mote:nth-child(8)  { left: 86%; top: 72%; color: #6ee7b7; animation-duration: 30s; animation-delay: 7s;  width: 5px; height: 5px; }
.eco-farewell__mote:nth-child(9)  { left: 24%; top: 44%; color: #fde7a5; animation-duration: 22s; animation-delay: 9s; }
.eco-farewell__mote:nth-child(10) { left: 72%; top: 48%; color: #34d399; animation-duration: 26s; animation-delay: 11s; width: 3px; height: 3px; }

@keyframes glassReflect {
  0%   { transform: translateX(-100%); }
  40%  { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

@keyframes moteDrift {
  0%   { transform: translate(0, 0);       opacity: 0.30; }
  50%  { transform: translate(8px, -14px); opacity: 0.55; }
  100% { transform: translate(-6px, -22px); opacity: 0.25; }
}

@media (max-width: 640px) {
  .eco-farewell {
    min-height: 68vh;
    padding: clamp(64px, 16vw, 110px) 20px;
  }
  .eco-farewell__glass {
    padding: clamp(24px, 7vw, 32px) clamp(20px, 6vw, 28px);
    backdrop-filter: blur(10px) saturate(120%);
    -webkit-backdrop-filter: blur(10px) saturate(120%);
  }
  .eco-farewell__motes {
    display: none;
  }
  .eco-farewell__signature {
    letter-spacing: 1.4px;
    padding: 8px 16px;
    font-size: 0.74rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .eco-farewell__image {
    animation: none;
    opacity: 0;
    transform: none;
  }
  .eco-farewell__image[data-frame="1"] {
    opacity: 1;
  }
  .eco-farewell__glass::before {
    animation: none;
    transform: translateX(-100%);
  }
  .eco-farewell__mote {
    animation: none;
    opacity: 0;
  }
}
```

### 7. CSS VARIABLES THE SECTION READS FROM
Only two custom properties are referenced. They already have inline fallbacks in §6, so you only need to define them in the target project if you want to deviate from defaults.

| Variable | Used for | Default fallback | Recommended source |
|---|---|---|---|
| `--g-700` | Base background color (visible during crossfade gap) | `#15803d` | Tailwind green-700 |
| `--font-display` | Title font family | `"Playfair Display", Georgia, serif` | Any high-contrast serif/display font |

If your target project already defines these (or uses different names), either:
1. Add `--g-700` and `--font-display` to your `:root {}` to match, or
2. Search-replace the `var(--g-700, ...)` and `var(--font-display, ...)` calls in `farewell.css` with the names your project uses

### 8. ASSET RULES

**Folder structure:**
```
assets/farewell/
├── IMAGE_1.<ext>
├── IMAGE_2.<ext>
├── IMAGE_3.<ext>
└── IMAGE_4.<ext>
```

**Per-image specs:**
- **Resolution**: ~1600px wide (smaller is fine for mobile-first projects; the layout uses `object-fit: cover`)
- **Format**: JPEG (q ~80) or WebP (q ~75) recommended; PNG works but is heavier
- **File size**: target under 300 KB per image (4 × 300 KB = ~1.2 MB total background)
- **Aspect ratio**: ideally 16:9 or 3:2; the `object-fit: cover` rule will center-crop anything

**Naming**: anything is fine — just match the filename you use in the `src` attribute. The current implementation uses literal filenames (e.g. `CityPalace.jpg.jpeg`) because that's what was uploaded; you can rename to clean kebab-case if you prefer.

**Dev server MIME types** (if you use a custom static dev server): make sure these image extensions return the right `Content-Type`:

```js
// Add to your static server's MIME type map
".jpg":  "image/jpeg",
".jpeg": "image/jpeg",
".png":  "image/png",
".webp": "image/webp",
".avif": "image/avif",
```

### 9. ANIMATION TIMING REFERENCE

| Animation | Duration | Easing | Notes |
|---|---|---|---|
| Image crossfade per frame | 7 s | `cubic-bezier(0.4, 0, 0.2, 1)` | 4 frames × 7 s = 28 s cycle |
| Ken Burns zoom range | scale 1.00 → 1.10 | Same | Subtle, never crops important detail |
| Glass reflection sweep | 9 s (with rest at end) | `ease-in-out` | Strip translates left → right, then pauses |
| Mote drift | 22–30 s each | `ease-in-out alternate` | 10 motes, four staggered durations |
| Scroll fade-in (`.reveal`) | ~700 ms | `power3.out` | Inherited from the project's scroll-reveal binding |
| Parallax background drift | Tied to scroll | `none` | Pure scrub via ScrollTrigger |

To change the cycle length: pick a per-frame duration `T`, then set `animation: ecoFarewellFade (4*T)s ...` and animation-delays at `0, T, 2T, 3T`. Recompute the keyframe `%` stops as `3/(4×T_pct)` etc — or use the rule of thumb: `fade-in` at `3% of cycle`, `peak` at `(T/(4T))*100% - 3%` ≈ `22%`, `fade-out` at peak+3%.

### 10. WIRING INTO YOUR TARGET PROJECT

#### A. Fade-in on scroll (`reveal` class)
If your project already has a generic `reveal` fade-in pattern (IntersectionObserver adding `.reveal--visible`, or GSAP ScrollTrigger fading `[data-scroll]` / `.reveal` elements), keep the `reveal` class on the section and you're done.

If not, add this minimal IntersectionObserver in your main JS:

```js
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.style.opacity = "1";
      e.target.style.transform = "none";
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 700ms ease-out, transform 700ms ease-out";
  observer.observe(el);
});
```

#### B. Parallax on the background stage (`data-scroll-parallax`)
Requires GSAP + ScrollTrigger. If your project doesn't bind this attribute, add:

```js
// Requires <script src=".../gsap.min.js"> and ScrollTrigger to be loaded
gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll("[data-scroll-parallax]").forEach((el) => {
  const amount = parseFloat(el.dataset.scrollParallax || "0.15");
  const range = Math.max(0, Math.min(0.4, amount)) * 100;
  gsap.fromTo(
    el,
    { yPercent: -range * 0.5 },
    {
      yPercent: range * 0.5,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.6,
      },
    },
  );
});
```

If you don't want parallax at all: remove `data-scroll-parallax="0.10"` from `.eco-farewell__stage`. Everything else still works.

### 11. CUSTOMIZATION KNOBS

| Knob | Where | Effect |
|---|---|---|
| **Number of frames** | `.eco-farewell__image[data-frame="N"]` delays in CSS + `<img>` tags in HTML | Add/remove pairs; recompute timing per §9 |
| **Frame duration** | `animation: ecoFarewellFade <total>s` + per-frame delays | Slower = more cinematic, faster = more energy |
| **Overlay strength** | `.eco-farewell__overlay` opacity stops | Higher α = darker imagery; lower α = brighter |
| **Glass blur** | `.eco-farewell__glass` `backdrop-filter: blur(Npx)` | Higher = foggier; lower = clearer |
| **Glass tint** | `.eco-farewell__glass` `background` gradient | Change `rgba(6, 78, 59, …)` for a different chromatic tint |
| **Reflection intensity** | `.eco-farewell__glass::before` background opacity (currently `0.10`) | Brighter for more cinematic shine |
| **Reflection cadence** | `glassReflect` animation duration (currently 9s) | Slow it for subtler effect |
| **Mote count** | Number of `<span class="eco-farewell__mote">` children + matching `nth-child` rules | 0 = none; 8–14 is a good band |
| **Mote palette** | `.eco-farewell__mote:nth-child(...) { color: ... }` | Currently gold + emerald; any 2–3 colors work |
| **Title gradient** | `.eco-farewell__title` `background: linear-gradient(...)` | Match your brand |
| **Eyebrow color** | `.eco-farewell__eyebrow` `color` | Gold by default |
| **Divider color** | `.eco-farewell__divider` `background` middle stop | `#d6b14f` (gold) by default |
| **Section height** | `.eco-farewell` `min-height` (currently `78vh`) | Increase for more drama, decrease for compactness |

### 12. ACCESSIBILITY

- Section is a single `<section aria-label="Farewell">` landmark — screen readers announce it once
- Decorative containers (`.eco-farewell__stage`, `.eco-farewell__overlay`, `.eco-farewell__motes`, divider) carry `aria-hidden="true"`
- Decorative images use empty `alt=""` so screen readers skip them
- Text content (eyebrow, title, subtitle, signature) is plain semantic HTML — fully readable
- `prefers-reduced-motion` reduces the section to a single static image with no sweep, no motes, no parallax (handled in CSS §6)
- Title contrast over the visible imagery is maintained via the subtle `text-shadow` plus the edge vignette overlay — verify ≥ 4.5:1 with your specific photos
- Tab order is unaffected (no focusable elements inside the section by default)

### 13. PERFORMANCE NOTES

- `content-visibility: auto` skips rendering the section until it's near the viewport — ~free perf win for below-the-fold content
- `contain-intrinsic-size: 0 720px` reserves layout space so scrollbars don't jump
- `loading="lazy"` defers image fetches until they're near the viewport
- `fetchpriority="low"` lets the browser deprioritize these images vs above-the-fold content
- `will-change: transform, opacity` on animated images + motes hints GPU acceleration
- Mobile (≤640px) hides motes entirely and reduces glass blur from 12px → 10px to keep scroll perf smooth
- Parallax binding skips low-end devices (mobile + <4 CPU cores) in the source project — you should do the same in your binding

### 14. TROUBLESHOOTING

| Symptom | Cause | Fix |
|---|---|---|
| Images flash bright/dark between frames | Crossfade gap exposing base background | Adjust `.eco-farewell` `background` color, or push the keyframe `fade-out` stop closer to the next frame's `fade-in` |
| Glass panel looks opaque, not glassy | `backdrop-filter` not supported (older browser) | Falls back to the gradient + border, which still looks fine; or add a feature query to swap to a solid translucent fill |
| No fade-in on scroll | `reveal` class not bound | See §10.A |
| No parallax | `data-scroll-parallax` not bound | See §10.B, or remove the attribute if you don't want parallax |
| Background images don't load | Wrong path or missing MIME type | Check the path matches your assets folder; ensure `image/jpeg` etc. is in your static server's content-type map |
| Title text invisible / hard to read | Bright frame washing out gradient | Strengthen `.eco-farewell__overlay` opacity stops or darken the title gradient |
| Motes overpowering | Too bright | Reduce `box-shadow` blur values or lower max opacity in `moteDrift` keyframe |

### 15. STEP-BY-STEP PORT CHECKLIST

1. **Copy** `frontend/styles/farewell.css` from the source project (or paste from §6) into the target project's CSS directory
2. **Link** the stylesheet from `<head>`: `<link rel="stylesheet" href="styles/farewell.css">`
3. **Place** 4 landmark images in `assets/farewell/` per §8
4. **Paste** the markup from §5 at the bottom of `<main>` in your `index.html`
5. **Update** the 4 `src` paths to match your image filenames
6. **Update** copy in eyebrow / title / subtitle / signature for your project's place + sponsor
7. **Confirm** GSAP + ScrollTrigger are loaded if you want parallax (§10.B); otherwise drop the `data-scroll-parallax` attribute
8. **Confirm** the `reveal` class is bound to a fade-in in your project (§10.A); otherwise the section still renders, just instantly visible
9. **(Optional)** Extend your dev server's MIME map for image formats (§8)
10. **Test**: load page, scroll to bottom, verify crossfade rotates through all 4 frames, glass panel is translucent, reflection sweeps, motes drift, parallax drifts on desktop
11. **Test reduced motion**: DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`, hard reload, confirm static first frame with no motion
12. **Test mobile**: 375px viewport, confirm glass panel scales, motes are hidden, content is readable

### 16. REFERENCES IN THIS PROJECT
- Source markup: [frontend/index.html](frontend/index.html#L857-L916)
- Source styles: [frontend/styles/farewell.css](frontend/styles/farewell.css)
- Project parallax binding: [frontend/components/scroll-reveal.js](frontend/components/scroll-reveal.js)
- Project fade-in IntersectionObserver: [frontend/app.js](frontend/app.js)
- Project CSS tokens (green scale, font-display, motion easings): [frontend/styles/global.css](frontend/styles/global.css)
- Sibling specs: [[LEADERBOARD]] · [[HISTORY]] · [[INDEX]]
