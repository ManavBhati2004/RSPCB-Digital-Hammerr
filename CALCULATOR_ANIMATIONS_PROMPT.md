# Calculator Header Animations — Reusable Prompt

Drop this file into a new project and feed the whole thing to your AI coding assistant. It contains:

1. A ready-to-paste **instruction prompt** describing what to build.
2. The exact **SVG + JSX markup** for each animated header.
3. The **CSS keyframes** that drive every animation.
4. Notes on the color palette and reduced-motion handling.

The animations were originally built for a Rajasthan carbon calculator (vehicle / fuel + electricity / kWh) using React + Tailwind, but the SVG + plain CSS will work in any React or HTML project. No animation library required — pure CSS keyframes on SVG elements.

---

## 1. The prompt (paste this into your next project)

> Build three small decorative animated header strips for a "carbon calculator" UI. Each header sits on top of an input card and is purely decorative (`aria-hidden="true"`). All animations are pure CSS keyframes on inline SVG elements — no Framer Motion, no Lottie, no GIFs.
>
> **Header A — Driving Car / Bike** (for the vehicle/fuel calculator)
> - A flat-style scene: soft sky gradient, a sun glow in the top-right, two layers of distant rolling hills, and a dark road at the bottom with a dashed centerline that scrolls leftward to fake motion.
> - A small car (or motorbike when `vehicleType === 'twoWheeler'`) drives across the strip left → right on a continuous loop (~9s). The whole vehicle gently bobs up and down (~0.6s), the wheels spin (~0.4s), and two grey exhaust puffs trail behind it and fade.
>
> **Header B — Electricity Tower** (for the electricity/kWh calculator)
> - A flat-style scene: warm dawn gradient, a sun glow in the top-right, distant terrain, and three thin power-line cables sagging across the width.
> - A center-aligned electricity transmission tower built from SVG strokes (cross-bracing, struts, cross-arms, insulators). The tower has a subtle vertical "hum" every ~1.8s, three yellow sparks at the insulators that pulse with staggered delays, and two yellow lightning bolts that flash briefly every few seconds.
>
> **Header C — Growing Tree** (for the result/success card)
> - Soft sky gradient, sun glow top-left, distant hills, and 4 tiny leaves drifting up and down at two different speeds.
> - A center-aligned stylized tree (trunk + 4 overlapping leafy circles + 3 small amber berries that twinkle). The whole tree gently floats up and down.
> - Optional "SAVED" pill in the top-right when a result has just been persisted, with a pulsing dot.
>
> **Theme & rules**
> - Palette (use these exactly): primary deep green `#06402B`, dark forest `#071C14`, sage `#C3CC9B`, sand `#E4DFB5`, cream `#FFFDF1`, success green `#2F7D32`, warning amber `#D9A441`, bright yellow `#FFD66B`, muted text `#5E6B60`.
> - Each header is ~96–112px tall, full-width, rounded top corners, `overflow-hidden`. It extends to the edges of its parent card via negative margins.
> - All animations must respect `@media (prefers-reduced-motion: reduce)` and stop.
> - The headers are decorative — no text inside them; the card heading sits below.

---

## 2. Component markup

### Header A — `DrivingCarHeader.jsx`

```jsx
export default function DrivingCarHeader({ vehicleType = 'fourWheeler' }) {
  const isBike = vehicleType === 'twoWheeler';

  return (
    <div
      aria-hidden="true"
      className="relative h-20 sm:h-24 -mx-5 sm:-mx-6 lg:-mx-8 -mt-5 sm:-mt-6 lg:-mt-8 mb-5 rounded-t-3xl overflow-hidden bg-gradient-to-b from-sand/80 via-sand/40 to-cream"
    >
      {/* Sun */}
      <div className="absolute top-3 right-6 w-7 h-7 rounded-full bg-warningAmber/80 blur-[1px] shadow-[0_0_18px_rgba(217,164,65,0.6)]" />

      {/* Distant hills */}
      <svg className="absolute bottom-7 left-0 w-full h-10 text-sage/70" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,40 Q60,10 120,30 T240,28 T400,32 L400,60 L0,60 Z" />
      </svg>
      <svg className="absolute bottom-7 left-0 w-full h-10 text-successGreen/60" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,46 Q80,20 160,38 T320,40 T400,42 L400,60 L0,60 Z" />
      </svg>

      {/* Road with scrolling dashes */}
      <div className="absolute bottom-0 left-0 right-0 h-7 bg-primary-dark/85">
        <svg className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1" viewBox="0 0 400 4" preserveAspectRatio="none">
          <line x1="0" y1="2" x2="400" y2="2" stroke="#FFFDF1" strokeWidth="2" strokeLinecap="round" className="road-dash" />
        </svg>
      </div>

      {/* Vehicle */}
      <div className={`car-driver absolute bottom-3 left-0 ${isBike ? 'w-16' : 'w-20'}`}>
        {isBike ? (
          <svg viewBox="0 0 80 40" className="w-full h-auto drop-shadow-md">
            <circle cx="6" cy="24" r="2.5" fill="#5E6B60" opacity="0.55" className="car-exhaust" />
            <circle cx="3" cy="20" r="2"   fill="#5E6B60" opacity="0.45" className="car-exhaust" style={{ animationDelay: '0.3s' }} />
            <circle cx="18" cy="30" r="6" fill="#071C14" />
            <circle cx="18" cy="30" r="2.5" fill="#C3CC9B" className="car-wheel" />
            <circle cx="58" cy="30" r="6" fill="#071C14" />
            <circle cx="58" cy="30" r="2.5" fill="#C3CC9B" className="car-wheel" />
            <path d="M22,28 L34,18 L48,18 L54,26 Z" fill="#06402B" stroke="#071C14" strokeWidth="1" />
            <path d="M30,18 L46,18 L46,15 L32,15 Z" fill="#071C14" />
            <line x1="54" y1="26" x2="62" y2="14" stroke="#06402B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="14" x2="66" y2="14" stroke="#071C14" strokeWidth="2" strokeLinecap="round" />
            <circle cx="65" cy="16" r="2" fill="#FFD66B" />
            <circle cx="40" cy="10" r="3.5" fill="#10251A" />
            <path d="M37,13 L34,22 L46,22 L43,13 Z" fill="#2F7D32" stroke="#071C14" strokeWidth="0.8" />
            <line x1="44" y1="16" x2="58" y2="15" stroke="#2F7D32" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 80 36" className="w-full h-auto drop-shadow-md">
            <circle cx="6" cy="20" r="3"   fill="#5E6B60" opacity="0.6" className="car-exhaust" />
            <circle cx="3" cy="16" r="2.5" fill="#5E6B60" opacity="0.5" className="car-exhaust" style={{ animationDelay: '0.3s' }} />
            <path d="M8,24 L14,14 L40,12 L48,18 L72,20 L72,28 L8,28 Z" fill="#06402B" stroke="#071C14" strokeWidth="1" />
            <path d="M17,15 L26,15 L26,21 L17,21 Z" fill="#C3CC9B" opacity="0.85" />
            <path d="M28,15 L40,14 L46,19 L28,21 Z" fill="#C3CC9B" opacity="0.85" />
            <circle cx="70" cy="24" r="2" fill="#FFD66B" />
            <circle cx="22" cy="29" r="4.5" fill="#071C14" />
            <circle cx="22" cy="29" r="2"   fill="#C3CC9B" className="car-wheel" />
            <circle cx="58" cy="29" r="4.5" fill="#071C14" />
            <circle cx="58" cy="29" r="2"   fill="#C3CC9B" className="car-wheel" />
          </svg>
        )}
      </div>
    </div>
  );
}
```

### Header B — `PowerTowerHeader.jsx`

```jsx
export default function PowerTowerHeader() {
  return (
    <div
      aria-hidden="true"
      className="relative h-24 sm:h-28 -mx-5 sm:-mx-6 lg:-mx-8 -mt-5 sm:-mt-6 lg:-mt-8 mb-5 rounded-t-3xl overflow-hidden bg-gradient-to-b from-warningAmber/15 via-sand/40 to-cream"
    >
      <div className="absolute top-3 right-8 w-8 h-8 rounded-full bg-warningAmber/70 blur-[1px] shadow-[0_0_22px_rgba(217,164,65,0.7)]" />

      <svg className="absolute bottom-3 left-0 w-full h-10 text-sage/60" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,42 Q100,18 200,36 T400,38 L400,60 L0,60 Z" />
      </svg>

      {/* Power lines */}
      <svg className="absolute top-6 left-0 w-full h-12" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,18 Q200,30 400,18" stroke="#071C14" strokeWidth="0.9" fill="none" />
        <path d="M0,26 Q200,40 400,26" stroke="#071C14" strokeWidth="0.9" fill="none" />
        <path d="M0,34 Q200,48 400,34" stroke="#071C14" strokeWidth="0.9" fill="none" />
      </svg>

      {/* Tower */}
      <svg viewBox="0 0 80 120" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto tower-hum">
        <path d="M10,118 L40,30 L70,118" stroke="#06402B" strokeWidth="2.2" fill="none" />
        <path d="M22,118 L40,40 L58,118" stroke="#06402B" strokeWidth="2"   fill="none" />
        <path d="M16,100 L36,80 M44,80 L64,100" stroke="#06402B" strokeWidth="1.5" />
        <path d="M22,80  L36,64 M44,64 L58,80"  stroke="#06402B" strokeWidth="1.5" />
        <path d="M26,64  L36,52 M44,52 L54,64"  stroke="#06402B" strokeWidth="1.5" />
        <line x1="14" y1="92" x2="66" y2="92" stroke="#06402B" strokeWidth="1.5" />
        <line x1="20" y1="72" x2="60" y2="72" stroke="#06402B" strokeWidth="1.5" />
        <line x1="26" y1="56" x2="54" y2="56" stroke="#06402B" strokeWidth="1.5" />
        <line x1="14" y1="42" x2="66" y2="42" stroke="#06402B" strokeWidth="2.4" />
        <line x1="22" y1="30" x2="58" y2="30" stroke="#06402B" strokeWidth="2.2" />
        <circle cx="16" cy="46" r="1.8" fill="#071C14" />
        <circle cx="40" cy="46" r="1.8" fill="#071C14" />
        <circle cx="64" cy="46" r="1.8" fill="#071C14" />
        <circle cx="24" cy="34" r="1.6" fill="#071C14" />
        <circle cx="56" cy="34" r="1.6" fill="#071C14" />
        {/* Sparks */}
        <circle cx="16" cy="46" r="2.4" fill="#FFD66B" className="tower-spark-1" />
        <circle cx="64" cy="46" r="2.4" fill="#FFD66B" className="tower-spark-2" />
        <circle cx="40" cy="46" r="2.2" fill="#FFD66B" className="tower-spark-3" />
        <line x1="40" y1="30" x2="40" y2="14" stroke="#06402B" strokeWidth="2" />
        <circle cx="40" cy="12" r="2" fill="#D9A441" className="tower-spark-3" />
        {/* Lightning flashes */}
        <path d="M28,46 L22,52 L26,52 L20,60 L30,50 L26,50 Z" fill="#FFD66B" stroke="#D9A441" strokeWidth="0.6" className="tower-bolt-1" />
        <path d="M58,46 L52,52 L56,52 L50,60 L60,50 L56,50 Z" fill="#FFD66B" stroke="#D9A441" strokeWidth="0.6" className="tower-bolt-2" />
      </svg>
    </div>
  );
}
```

### Header C — `GrowingTreeHeader.jsx`

```jsx
export default function GrowingTreeHeader({ variant = 'result' }) {
  const isSaved = variant === 'saved';

  return (
    <div
      aria-hidden="true"
      className="relative h-24 sm:h-28 -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 mb-5 rounded-t-3xl overflow-hidden bg-gradient-to-b from-sage/40 via-sand/30 to-cream"
    >
      <div className="absolute top-3 left-6 w-8 h-8 rounded-full bg-warningAmber/70 blur-[1px] shadow-[0_0_20px_rgba(217,164,65,0.55)]" />

      <svg className="absolute bottom-3 left-0 w-full h-10 text-sage/60" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,40 Q90,16 180,32 T400,30 L400,60 L0,60 Z" />
      </svg>

      {/* Drifting leaves */}
      <svg className="absolute top-4 left-0 w-full h-10 text-successGreen/70" viewBox="0 0 400 40" preserveAspectRatio="none">
        <g className="animate-float-slow">
          <ellipse cx="60"  cy="14" rx="3"   ry="6" transform="rotate(25 60 14)"   fill="currentColor" opacity="0.7"  />
          <ellipse cx="320" cy="22" rx="3"   ry="6" transform="rotate(-15 320 22)" fill="currentColor" opacity="0.55" />
        </g>
        <g className="animate-float-fast">
          <ellipse cx="200" cy="10" rx="2.5" ry="5" transform="rotate(40 200 10)"  fill="currentColor" opacity="0.6"  />
          <ellipse cx="140" cy="26" rx="2.5" ry="5" transform="rotate(-30 140 26)" fill="currentColor" opacity="0.5"  />
        </g>
      </svg>

      {/* Tree */}
      <svg viewBox="0 0 80 120" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto animate-float-slow">
        <path d="M38,118 L38,72 Q40,60 42,72 L42,118 Z" fill="#06402B" />
        <circle cx="40" cy="64" r="22" fill="#2F7D32" />
        <circle cx="28" cy="70" r="14" fill="#06402B" opacity="0.85" />
        <circle cx="52" cy="70" r="14" fill="#06402B" opacity="0.85" />
        <circle cx="40" cy="50" r="16" fill="#A7B77A" />
        <circle cx="32" cy="62" r="2" fill="#D9A441" className="tower-spark-1" />
        <circle cx="48" cy="58" r="2" fill="#D9A441" className="tower-spark-2" />
        <circle cx="40" cy="74" r="2" fill="#D9A441" className="tower-spark-3" />
      </svg>

      {isSaved && (
        <div className="absolute top-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-successGreen/90 text-cream text-[10px] font-bold tracking-wide px-2.5 py-1 shadow-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-cream animate-pulse-ring" /> SAVED
        </div>
      )}
    </div>
  );
}
```

---

## 3. The CSS (paste into `index.css` / global stylesheet)

```css
/* ===== Keyframes ===== */

/* Car driving across the header */
@keyframes carDrive {
  0%   { transform: translateX(-15%); }
  100% { transform: translateX(115%); }
}
@keyframes carBob {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}
@keyframes wheelSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes exhaust {
  0%   { opacity: 0.7; transform: translate(0, 0) scale(0.4); }
  100% { opacity: 0;   transform: translate(-22px, -10px) scale(1.4); }
}
@keyframes roadDash {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -40; }
}

/* Electricity tower */
@keyframes spark {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 1; filter: drop-shadow(0 0 6px #FFD66B); }
}
@keyframes bolt {
  0%, 100% { opacity: 0; }
  10%, 20% { opacity: 1; }
  30%      { opacity: 0; }
}
@keyframes hum {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-1px); }
}

/* Floating / pulse used by tree + leaves + SAVED dot */
@keyframes floatY {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
}
@keyframes pulseRing {
  0%   { box-shadow: 0 0 0 0   rgba(47, 125, 50, 0.5); }
  70%  { box-shadow: 0 0 0 18px rgba(47, 125, 50, 0);   }
  100% { box-shadow: 0 0 0 0   rgba(47, 125, 50, 0);   }
}

/* ===== Animation utility classes ===== */
.car-driver  { animation: carDrive 9s linear infinite, carBob 0.6s ease-in-out infinite; }
.car-wheel   { animation: wheelSpin 0.4s linear infinite; transform-origin: center; transform-box: fill-box; }
.car-exhaust { animation: exhaust 0.9s ease-out infinite; }
.road-dash   { stroke-dasharray: 14 8; animation: roadDash 1.2s linear infinite; }

.tower-spark-1 { animation: spark 1.4s ease-in-out infinite; }
.tower-spark-2 { animation: spark 1.4s ease-in-out 0.3s infinite; }
.tower-spark-3 { animation: spark 1.4s ease-in-out 0.7s infinite; }
.tower-bolt-1  { animation: bolt 3.2s ease-in-out infinite; }
.tower-bolt-2  { animation: bolt 3.2s ease-in-out 1.6s infinite; }
.tower-hum     { animation: hum 1.8s ease-in-out infinite; transform-origin: center bottom; transform-box: fill-box; }

.animate-float-slow { animation: floatY 7s ease-in-out infinite; }
.animate-float-fast { animation: floatY 4s ease-in-out infinite; }
.animate-pulse-ring { animation: pulseRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

/* Accessibility: kill animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .car-driver, .car-wheel, .car-exhaust, .road-dash,
  .tower-spark-1, .tower-spark-2, .tower-spark-3,
  .tower-bolt-1, .tower-bolt-2, .tower-hum,
  .animate-float-slow, .animate-float-fast, .animate-pulse-ring {
    animation: none !important;
  }
}
```

---

## 4. Tailwind color tokens (only needed if reusing `bg-sand`, `text-sage` etc.)

If the new project uses Tailwind, extend the theme so the classnames in the JSX above resolve:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:        '#06402B',
        'primary-dark': '#071C14',
        'primary-deep': '#06402B',
        sage:           '#C3CC9B',
        sageBorder:     '#A7B77A',
        sand:           '#E4DFB5',
        cream:          '#FFFDF1',
        successGreen:   '#2F7D32',
        warningAmber:   '#D9A441',
        textDark:       '#10251A',
        textMuted:      '#5E6B60',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(6, 64, 43, 0.10)',
        card: '0 6px 20px rgba(6, 64, 43, 0.08)',
      },
    },
  },
};
```

If not using Tailwind, replace the utility classes with inline styles or your own CSS — the animations live entirely in the `.car-*`, `.tower-*`, `.animate-float-*`, `.animate-pulse-ring`, and `.road-dash` classes, and those are framework-agnostic.

---

## 5. How to wire it up

```jsx
// In your vehicle calculator card
<div className="card p-5 sm:p-6 lg:p-8">
  <DrivingCarHeader vehicleType={form.vehicleType} />
  {/* ...form fields... */}
</div>

// In your electricity calculator card
<div className="card p-5 sm:p-6 lg:p-8">
  <PowerTowerHeader />
  {/* ...form fields... */}
</div>

// In your result card
<div className="card p-5 sm:p-7">
  <GrowingTreeHeader variant={saved ? 'saved' : 'result'} />
  {/* ...result content... */}
</div>
```

That's the whole thing — three components, one CSS block, zero dependencies beyond React + Tailwind.
