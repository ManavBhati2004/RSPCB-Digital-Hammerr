import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Award, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CinematicHero } from '../components/hero/CinematicHero';
import { RspcbLogo } from '../components/RspcbLogo';
import { LeafAnimation } from '../components/awareness/LeafAnimation';

// Pull every awareness illustration from the assets folder, sorted by filename
// so the row layout stays deterministic across builds.
const awarenessImageModules = import.meta.glob('../assets/awareness/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;
const awarenessImages: string[] = Object.keys(awarenessImageModules)
  .sort()
  .map(key => awarenessImageModules[key]);

const AWARENESS_DWELL_MS = 8000;

// Desktop (md+): one image at a time with a circular iris reveal between images.
// Mobile (< md): a vertical marquee that streams all six images through a
// 2-image visible window so something is always moving on small screens.
const AwarenessFlipShowcase = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % awarenessImages.length);
    }, AWARENESS_DWELL_MS);
    return () => window.clearInterval(id);
  }, []);

  const src = awarenessImages[index];
  const doubled = [...awarenessImages, ...awarenessImages];

  return (
    <>
      {/* Desktop: circular iris reveal, one image at a time */}
      <div className="hidden md:flex relative z-10 flex-1 items-center justify-center min-h-0 px-3 sm:px-6">
        <div className="relative aspect-video w-[min(94vw,148dvh)]">
          <AnimatePresence>
            <motion.div
              key={src}
              initial={{ clipPath: 'circle(0% at 50% 50%)' }}
              animate={{ clipPath: 'circle(80% at 50% 50%)' }}
              exit={{ clipPath: 'circle(0% at 50% 50%)' }}
              transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0"
              style={{ WebkitClipPath: 'circle(0% at 50% 50%)' }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                draggable={false}
                className="w-full h-full object-contain rounded-3xl select-none"
                style={{ filter: 'drop-shadow(0 25px 80px rgba(16,185,129,0.45))' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: vertical marquee, ~2 images visible at any moment */}
      <div className="md:hidden relative z-10 flex-1 flex justify-center min-h-0 px-3 overflow-hidden">
        <div className="w-full max-w-md relative overflow-hidden">
          {/* Top & bottom fades so images glide in/out of view, not snap */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-50 to-transparent z-10" />

          <motion.div
            className="flex flex-col gap-3 w-full will-change-transform"
            animate={{ y: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
          >
            {doubled.map((s, i) => (
              <img
                key={i}
                src={s}
                alt=""
                loading="lazy"
                draggable={false}
                className="w-full aspect-video object-contain rounded-2xl select-none"
                style={{ filter: 'drop-shadow(0 15px 40px rgba(16,185,129,0.35))' }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

type RecentEntry = { id: string; name: string; co2: number; source: 'electricity' | 'vehicle'; createdAt: string };

const formatAgo = (createdAt: number, now: number) => {
  const s = Math.max(0, Math.floor((now - createdAt) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
};

// Animate a number from its current displayed value to `target` over `durationMs`.
// Dependency-free; uses requestAnimationFrame with an ease-out cubic.
const useAnimatedNumber = (target: number, durationMs = 1600) => {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(target)) return;
    const from = fromRef.current;
    if (from === target) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      setValue(next);
      fromRef.current = next;
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return value;
};

const useAnalyticsTotals = () => {
  const [co2Tonnes, setCo2Tonnes] = useState(0);
  const [unitCount, setUnitCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const statsRes = await axios.get<{
          totalCO2Saved: number;
          totalVehicleCO2: number;
          registeredUnits: number;
        }>(`${API}/api/data/stats`);
        if (cancelled) return;
        const elec = Number(statsRes.data.totalCO2Saved) || 0;
        const veh = Number(statsRes.data.totalVehicleCO2) || 0;
        setCo2Tonnes(elec + veh / 1000);
        setUnitCount(Number(statsRes.data.registeredUnits) || 0);
      } catch (err) {
        console.error('Analytics totals fetch failed:', err);
      }
    };
    fetchAll();
    const id = setInterval(fetchAll, 5000);
    const onRefresh = () => fetchAll();
    window.addEventListener('rspcb:stats-refresh', onRefresh);
    return () => {
      cancelled = true;
      clearInterval(id);
      window.removeEventListener('rspcb:stats-refresh', onRefresh);
    };
  }, []);

  return { co2Tonnes, unitCount };
};

const LiveLog = () => {
  const [entries, setEntries] = useState<RecentEntry[]>([]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    const fetchRecent = async () => {
      try {
        const res = await axios.get<RecentEntry[]>(`${API}/api/data/recent?limit=30`);
        if (cancelled) return;
        setEntries(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('LiveLog recent fetch failed:', err);
      }
    };
    fetchRecent();
    const poll = setInterval(fetchRecent, 5000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const onRefresh = () => fetchRecent();
    window.addEventListener('rspcb:stats-refresh', onRefresh);
    return () => {
      cancelled = true;
      clearInterval(poll);
      clearInterval(tick);
      window.removeEventListener('rspcb:stats-refresh', onRefresh);
    };
  }, []);

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-4 sm:p-5 shadow-2xl flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200/60 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <h3 className="text-sm sm:text-base font-bold text-slate-900">Live Activity</h3>
        <span className="ml-auto text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">Realtime</span>
      </div>

      <div className="flex-1 overflow-hidden space-y-2.5">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs sm:text-sm font-medium px-4 text-center">
            Waiting for first contributors…
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {entries.map(entry => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/60 hover:bg-white/90 transition-colors"
              >
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm sm:text-base font-bold shrink-0 shadow-md">
                  {entry.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-900 font-bold leading-tight truncate">{entry.name}</p>
                  <p className="text-xs sm:text-sm text-emerald-700 font-extrabold leading-tight mt-0.5">
                    saved {entry.co2.toLocaleString(undefined, { maximumFractionDigits: 20, useGrouping: true })} kg CO₂
                  </p>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium shrink-0 ml-2">
                  {formatAgo(new Date(entry.createdAt).getTime(), now)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const location = useLocation();
  const initialPage = (location.state as { initialPage?: number } | null)?.initialPage ?? 0;
  const [activePage, setActivePage] = useState(initialPage);
  const [autoCycle, setAutoCycle] = useState(initialPage === 0);
  const [heroTransformed, setHeroTransformed] = useState(false);
  const showNav = activePage !== 0 || heroTransformed;
  const { co2Tonnes, unitCount } = useAnalyticsTotals();
  const animatedCo2 = useAnimatedNumber(co2Tonnes);
  const animatedUnits = useAnimatedNumber(unitCount);
  const contributionMobileRef = useRef<HTMLAnchorElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const [contribAnchor, setContribAnchor] = useState<{ centerX: number; bottom: number } | null>(null);
  const [hintWidth, setHintWidth] = useState<number | null>(null);

  useEffect(() => {
    if (activePage !== 2 || !showNav) {
      setContribAnchor(null);
      setHintWidth(null);
      return;
    }
    const measure = () => {
      const el = contributionMobileRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      setContribAnchor({ centerX: rect.left + rect.width / 2, bottom: rect.bottom });
    };
    measure();
    // Re-measure after the nav fade/slide animation settles (~1.4s)
    const t1 = window.setTimeout(measure, 250);
    const t2 = window.setTimeout(measure, 900);
    const t3 = window.setTimeout(measure, 1600);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [activePage, showNav]);

  useLayoutEffect(() => {
    if (!contribAnchor) return;
    if (hintRef.current) setHintWidth(hintRef.current.offsetWidth);
  }, [contribAnchor]);


  const pages = [
    { id: 'hero', name: 'Home' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'awareness', name: 'Awareness' }
  ];

  useEffect(() => {
    if (!autoCycle) return;
    const id = window.setInterval(() => {
      setActivePage(prev => (prev + 1) % pages.length);
    }, 15000);
    return () => window.clearInterval(id);
  }, [autoCycle, pages.length]);

  const selectPage = (index: number) => {
    setAutoCycle(false);
    setActivePage(index);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-900">
      {/* Dynamic Backgrounds based on active page */}
      <div className="absolute inset-0 transition-colors duration-1000 z-0" style={{
        backgroundColor:
          activePage === 0 ? '#f8fafc' :
          activePage === 1 ? '#B2D3C2' :
          '#f8fafc'
      }}></div>

      {/* Global Navbar */}
      <motion.nav
        initial={false}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -16 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: showNav ? 0.5 : 0 }}
        style={{ pointerEvents: showNav ? 'auto' : 'none' }}
        className="absolute top-0 w-full z-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-center items-center"
      >
        <div className="hidden lg:flex items-center gap-3 xl:gap-5 p-2 pl-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2 border-r border-slate-700">
            <RspcbLogo className="w-9 h-9 p-0.5 border border-green-100 shadow-lg shadow-green-500/20 shrink-0" />
            <div className="min-w-0 text-white">
              <h1 className="font-bold text-sm leading-tight">RSPCB</h1>
              <p className="hidden xl:block text-[9px] uppercase tracking-wider font-semibold text-slate-300">State Pollution Control Board</p>
            </div>
          </div>
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => selectPage(index)}
              className={`px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activePage === index
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {page.name}
            </button>
          ))}
          <div className="relative flex items-center">
            <Link
              to="/calculator"
              className="px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all text-slate-300 hover:text-white hover:bg-white/10"
            >
              Contribution
            </Link>
            <AnimatePresence>
              {activePage === 2 && (
                <motion.span
                  key="contrib-hint-desktop"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.35, delay: 0.25 }}
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] xl:text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-md shadow-orange-500/40"
                >
                  <motion.span
                    aria-hidden
                    animate={{ x: [0, -3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    ←
                  </motion.span>
                  Click here now
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Nav (unified, centered) */}
      <motion.div
        initial={false}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -16 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: showNav ? 0.5 : 0 }}
        style={{ pointerEvents: showNav ? 'auto' : 'none' }}
        className="lg:hidden absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-fit max-w-[95vw] z-50 overflow-x-auto no-scrollbar"
      >
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 pl-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-xl">
          <div className="flex items-center gap-1.5 pr-1.5 sm:pr-2 border-r border-slate-700 shrink-0">
            <RspcbLogo className="w-7 h-7 p-0.5 border border-green-100 shadow-md shadow-green-500/20 shrink-0" />
            <span className="hidden xs:inline sm:inline text-white font-bold text-xs">RSPCB</span>
          </div>
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => selectPage(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                activePage === index
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {page.name}
            </button>
          ))}
          <Link
            ref={contributionMobileRef}
            to="/calculator"
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap text-slate-300 hover:text-white hover:bg-white/10"
          >
            Contribution
          </Link>
        </div>
      </motion.div>

      {/* Mobile-only contribution hint — measured against the actual Contribution link, with the arrow re-anchored when the pill has to slide left to fit on narrow screens */}
      <AnimatePresence>
        {activePage === 2 && contribAnchor && (() => {
          const PADDING = 8;
          const vw = typeof window !== 'undefined' ? window.innerWidth : 360;
          const measuredWidth = hintWidth ?? 130;
          const idealLeft = contribAnchor.centerX - measuredWidth / 2;
          const clampedLeft = Math.min(
            Math.max(idealLeft, PADDING),
            vw - measuredWidth - PADDING
          );
          const arrowOffsetPx = Math.max(
            10,
            Math.min(measuredWidth - 10, contribAnchor.centerX - clampedLeft)
          );
          return (
            <motion.div
              ref={hintRef}
              key="contrib-hint-mobile-floating"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: hintWidth ? 1 : 0, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="lg:hidden fixed z-50 pointer-events-none"
              style={{
                top: contribAnchor.bottom + 10,
                left: clampedLeft,
              }}
            >
              <span className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold uppercase tracking-wide whitespace-nowrap shadow-lg shadow-orange-500/40 ring-1 ring-orange-300/50">
                <motion.span
                  aria-hidden
                  className="absolute -top-1.5 text-amber-500 text-base leading-none drop-shadow-[0_-1px_2px_rgba(0,0,0,0.25)]"
                  style={{ left: arrowOffsetPx, transform: 'translateX(-50%)' }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ▲
                </motion.span>
                Click here now
              </span>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Main Content Area (Full Screen Slider) */}
      <div className="relative w-full h-full z-10 flex items-center justify-center pt-14 sm:pt-16">
        <AnimatePresence mode="wait">
          
          {/* PAGE 0: HERO */}
          {activePage === 0 && (
            <CinematicHero onTransform={() => setHeroTransformed(true)} />
          )}

          {/* PAGE 1: ANALYTICS */}
          {activePage === 1 && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full text-slate-900 overflow-y-auto lg:overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

              {/* Main content (header + stat cards). On mobile this flows in normal block layout
                  so the live log can stack below; on lg+ it's absolutely centered with the log
                  pinned to the right edge as before. */}
              <div className="relative min-h-full px-4 sm:px-6 pt-32 sm:pt-36 lg:pt-32 pb-32 sm:pb-28 lg:pb-20 flex flex-col items-center lg:absolute lg:inset-0 lg:pr-[440px] lg:justify-center">
                <div className="w-full max-w-3xl mx-auto">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-10 text-center">Live Intelligence</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 md:gap-8">
                    {[
                      {
                        label: 'CO2 Saved (in tonnes)',
                        value: animatedCo2.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                        icon: Wind,
                        color: 'text-green-600',
                      },
                      {
                        label: 'Registered Units',
                        value: Math.round(animatedUnits).toLocaleString(),
                        icon: Award,
                        color: 'text-blue-600',
                      },
                    ].map((stat, i) => (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        key={i}
                        className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-3 sm:p-6 md:p-8 shadow-xl hover:bg-white/80 transition-all cursor-default"
                      >
                        <stat.icon className={`w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 sm:mb-6 ${stat.color}`} />
                        <div className="text-lg sm:text-2xl md:text-4xl font-extrabold text-slate-900 mb-1 sm:mb-2 break-words leading-tight">{stat.value}</div>
                        <div className="text-[9px] sm:text-xs md:text-sm text-slate-600 uppercase tracking-wider sm:tracking-widest font-bold leading-tight">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Live log — inline below the stat cards on mobile/tablet, absolute right
                      sidebar on lg+. Single instance so the leaderboard endpoint is polled once. */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative w-full max-w-md mx-auto mt-6 h-[60vh] lg:absolute lg:top-32 lg:bottom-20 lg:right-4 xl:right-6 lg:w-[360px] xl:w-[400px] lg:mt-0 lg:h-auto lg:max-w-none lg:mx-0 z-20 flex"
                  >
                    <LiveLog />
                  </motion.div>

                  <div className="mt-8 flex justify-center">
                    <Link
                      to="/top-contributors"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg transition-all"
                    >
                      <Trophy className="w-5 h-5" />
                      Top Contributors
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PAGE 2: AWARENESS */}
          {activePage === 2 && (
            <motion.div
              key="awareness"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full overflow-hidden flex flex-col pt-20 sm:pt-24 pb-2 sm:pb-4"
            >
              {/* Ambient gradient orbs — same palette as Home/Analytics so the page reads as part of the same UI */}
              <div className="pointer-events-none absolute inset-0 z-0">
                <motion.div
                  className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-emerald-300/35 blur-3xl"
                  animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full bg-sky-300/30 blur-3xl"
                  animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute -bottom-32 left-1/4 w-[26rem] h-[26rem] rounded-full bg-lime-300/30 blur-3xl"
                  animate={{ x: [0, 20, 0], y: [0, -25, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* One image at a time — iris reveal every 8s */}
              <AwarenessFlipShowcase />

              {/* Premium edge/corner leaf animation — awareness page only */}
              <LeafAnimation />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Play/Pause Indicator Overlay — hidden on the awareness page so the flip rows can use the full bottom space */}
      {activePage !== 2 && (
        <div className="flex absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 items-center gap-1.5 sm:gap-2 z-40 pointer-events-none">
          {pages.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${activePage === i ? 'w-12 bg-slate-500' : 'w-4 bg-slate-300'}`}></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
