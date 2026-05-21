import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const img1 = new URL('../../assets/thankyou/image.png', import.meta.url).href;
const img2 = new URL('../../assets/thankyou/image copy.png', import.meta.url).href;
const img3 = new URL('../../assets/thankyou/image copy 2.png', import.meta.url).href;
const img4 = new URL('../../assets/thankyou/image copy 3.png', import.meta.url).href;
const img5 = new URL('../../assets/thankyou/image copy 4.png', import.meta.url).href;

const frames = [img1, img2, img3, img4, img5];

export default function FarewellSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal--visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="eco-farewell reveal" aria-label="Farewell">
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur text-slate-700 font-bold rounded-full shadow-md hover:shadow-lg hover:text-green-600 hover:-translate-y-0.5 transition-all text-sm sm:text-base border border-white/50"
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>
      <div className="eco-farewell__stage" aria-hidden="true">
        {frames.map((src, i) => (
          <img
            key={i}
            className="eco-farewell__image"
            data-frame={i + 1}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ))}
      </div>
      <div className="eco-farewell__overlay" aria-hidden="true" />
      <div className="eco-farewell__vignette" aria-hidden="true" />
      <div className="eco-farewell__motes" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="eco-farewell__mote" />
        ))}
      </div>
      <div className="eco-farewell__content">
        <div className="eco-farewell__glass">
          <p className="eco-farewell__eyebrow">A shared promise · सहभागिता</p>
          <h2 className="eco-farewell__title">
            Together we can <span className="eco-farewell__title-accent">make a change</span>
          </h2>
          <span className="eco-farewell__divider" aria-hidden="true" />
          <p className="eco-farewell__subtitle">
            Every mindful choice today plants the seed of a cleaner, greener tomorrow.
          </p>
        </div>
        <p className="eco-farewell__signature">
          <span className="eco-farewell__signature-dot" aria-hidden="true" />
          Rajasthan State Pollution Control Board · Udaipur · Rajasthan
        </p>
      </div>
    </section>
  );
}
