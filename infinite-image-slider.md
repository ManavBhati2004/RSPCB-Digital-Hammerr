# Prompt: Infinite Loop Image Slider for Home Page

Build a smooth, infinite, auto-scrolling horizontal image slider (marquee-style carousel) for the Home page of my **Rajasthan Carbon Mitra** React + Vite + Tailwind CSS project. The slider should fit a clean, minimal, nature-inspired green theme suitable for a government environmental awareness website.

---

## Functional requirements

- Component name: `InfiniteImageSlider.jsx`, placed in `client/src/components/home/`.
- Accepts an `images` prop (array of objects: `{ src, alt, caption }`).
- Images scroll **horizontally from right to left in a continuous infinite loop** — no visible jump, no end of list, no arrows, no dots.
- Movement is **CSS-driven** (using `@keyframes` + `transform: translateX(...)`), not JS-driven, so it stays smooth on low-end devices.
- Duplicate the image list twice inside the track (`[...images, ...images]`) so the animation can reset seamlessly at `-50%` translateX.
- Animation speed: ~40 seconds for one full loop (configurable via prop `speed`, default `40`).
- **Pause on hover** for the entire track.
- **Respect `prefers-reduced-motion`**: if the user has reduced motion enabled, freeze the slider in place.
- Lazy-load images (`loading="lazy"`) and use `object-cover` so images never distort.
- Fully responsive: image cards should be ~280px wide on desktop, ~200px on tablet, ~160px on mobile, with consistent gap spacing.

---

## Visual / styling requirements

- Each slide is a **rounded card** (border-radius ~20px) with a soft shadow and subtle muted-green border (`rgba(6, 64, 43, 0.12)`).
- Add a **soft gradient fade** on the left and right edges of the slider container (from the page background color to transparent, ~80px wide) so images appear to glide in and out smoothly instead of clipping hard.
- Optional caption overlay at the bottom of each card with a translucent dark-green background and white text — only show on hover (desktop) or always (mobile).
- Use the project palette:
  - Deep green `#06402B`
  - Soft sage `#C3CC9B`
  - Sand `#E4DFB5`
  - Off-white card `#FFFDF1`
- Section heading above the slider, e.g. **"A Greener Rajasthan in Action"** with a short subtitle.

---

## Technical structure

```jsx
<section className="relative overflow-hidden py-16 bg-[#E4DFB5]/40">
  <SectionHeading title="..." subtitle="..." />
  <div className="relative group">
    {/* left + right gradient fade overlays */}
    <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
      {[...images, ...images].map((img, i) => (
        <SlideCard key={i} {...img} />
      ))}
    </div>
  </div>
</section>
```

---

## Tailwind config addition

Add to `tailwind.config.js`:

```js
extend: {
  animation: {
    marquee: 'marquee 40s linear infinite',
  },
  keyframes: {
    marquee: {
      '0%':   { transform: 'translateX(0)' },
      '100%': { transform: 'translateX(-50%)' },
    },
  },
},
```

---

## Accessibility

- Wrap the section in a `<section aria-label="Image gallery of Rajasthan environmental initiatives">`.
- Each `<img>` must have meaningful `alt` text.
- Add a visually hidden note: "Auto-scrolling image gallery. Hover to pause."

---

## Deliverables

1. `InfiniteImageSlider.jsx` component.
2. Required Tailwind config changes.
3. Integration into `Home.jsx` between the hero section and the website-guide section.
4. 6–8 sample placeholder image entries (forest, solar panels, trees, Rajasthan landscape, electric vehicle, cyclist, plantation drive, clean city) using royalty-free Unsplash URLs.

---

Keep the code clean, minimal, and free of unrelated features. Do not add login, dots, arrows, or external carousel libraries — pure Tailwind + CSS animation only.
