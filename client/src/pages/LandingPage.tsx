import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Zap, Factory as FactoryIcon, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CinematicHero } from '../components/hero/CinematicHero';
import { RspcbLogo } from '../components/RspcbLogo';
import { AnalyticsLeaderboard } from '../components/analytics/AnalyticsLeaderboard';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

type LogEntry = { id: number; name: string; co2: number; createdAt: number };
type Contributor = { name: string; co2: number };

type LeaderboardBucket = { name?: string; co2Saved?: number }[];
type LeaderboardResponse = {
  electricity?: { factories?: LeaderboardBucket; individuals?: LeaderboardBucket };
  fuel?: { factories?: LeaderboardBucket; individuals?: LeaderboardBucket };
};

const flattenLeaderboard = (data: LeaderboardResponse | undefined): Contributor[] => {
  if (!data) return [];
  const result: Contributor[] = [];
  const pushBucket = (bucket: LeaderboardBucket | undefined) => {
    if (!Array.isArray(bucket)) return;
    for (const entry of bucket) {
      if (entry?.name && typeof entry.co2Saved === 'number') {
        result.push({
          name: entry.name,
          co2: Math.max(0, Math.round(entry.co2Saved)),
        });
      }
    }
  };
  pushBucket(data.electricity?.factories);
  pushBucket(data.electricity?.individuals);
  pushBucket(data.fuel?.factories);
  pushBucket(data.fuel?.individuals);
  return result;
};

let liveLogIdCounter = 0;
const makeEntryFromContributor = (c: Contributor): LogEntry => ({
  id: liveLogIdCounter++,
  name: c.name,
  co2: c.co2,
  createdAt: Date.now(),
});

const formatAgo = (createdAt: number, now: number) => {
  const s = Math.max(0, Math.floor((now - createdAt) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
};

const LiveLog = () => {
  const [pool, setPool] = useState<Contributor[]>([]);
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [now, setNow] = useState(Date.now());
  const poolRef = useRef<Contributor[]>([]);

  // Keep the ref in sync so the long-lived rotate interval always sees the latest pool.
  // When the pool first becomes non-empty, seed 4 entries so the panel doesn't sit blank.
  useEffect(() => {
    poolRef.current = pool;
    if (pool.length > 0) {
      setEntries(prev => {
        if (prev.length > 0) return prev;
        const seed: LogEntry[] = [];
        for (let i = 0; i < Math.min(4, pool.length); i++) {
          seed.push(makeEntryFromContributor(pool[Math.floor(Math.random() * pool.length)]));
        }
        return seed;
      });
    }
  }, [pool]);

  // Fetch the leaderboard on mount, refresh every 10 s.
  useEffect(() => {
    let cancelled = false;
    const fetchPool = async () => {
      try {
        const res = await axios.get<LeaderboardResponse>(`${API}/api/data/leaderboard`);
        if (cancelled) return;
        setPool(flattenLeaderboard(res.data));
      } catch (err) {
        console.error('LiveLog leaderboard fetch failed:', err);
      }
    };
    fetchPool();
    const poolInterval = setInterval(fetchPool, 10000);
    return () => {
      cancelled = true;
      clearInterval(poolInterval);
    };
  }, []);

  // Rotate one new entry in every 3.5 s; tick the relative timestamps every second.
  useEffect(() => {
    const rotate = setInterval(() => {
      if (poolRef.current.length === 0) return;
      const c = poolRef.current[Math.floor(Math.random() * poolRef.current.length)];
      setEntries(prev => [makeEntryFromContributor(c), ...prev.slice(0, 3)]);
    }, 3500);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(rotate);
      clearInterval(tick);
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
                    saved {entry.co2.toLocaleString()} kg CO₂
                  </p>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium shrink-0 ml-2">
                  {formatAgo(entry.createdAt, now)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const awarenessSlides = [
  {
    title: 'Industrial & Logistics Awareness',
    body: 'By optimizing factory operations to off-peak hours and transitioning state logistics fleets to electric vehicles, Rajasthan can slash its carbon footprint by over 60%.',
    points: [
      'Shift heavy industrial loads to non-peak hours',
      'Transition short-distance logistics to EV fleets',
      'Implement IoT automated lighting and HVAC',
    ],
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'EV vehicle charging',
    caption: 'The Future of Green Transit',
    icon: Car,
    accent: 'text-blue-600',
    tint: 'bg-blue-100',
  },
  {
    title: 'Off-Peak Power Planning',
    body: 'Factories can lower grid stress and emissions by moving heavy electricity consumption to cleaner, lower-demand operating windows.',
    points: [
      'Schedule high-load equipment outside peak demand',
      'Track monthly electricity patterns from submitted bills',
      'Reward cleaner operating windows with better scores',
    ],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Power infrastructure at sunset',
    caption: 'Smarter Energy Scheduling',
    icon: Zap,
    accent: 'text-yellow-600',
    tint: 'bg-yellow-100',
  },
  {
    title: 'Cleaner Factory Operations',
    body: 'Industrial units can reduce avoidable emissions through efficient machinery, preventive maintenance, and real-time compliance reporting.',
    points: [
      'Maintain boilers, motors, compressors, and HVAC systems',
      'Digitize factory reports for faster review',
      'Benchmark every unit against cleaner operating targets',
    ],
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Modern industrial facility',
    caption: 'Cleaner Production Lines',
    icon: FactoryIcon,
    accent: 'text-green-600',
    tint: 'bg-green-100',
  },
  {
    title: 'Air Quality Action Loop',
    body: 'Awareness becomes stronger when citizens, factories, and transport operators can see the same evidence and act on it together.',
    points: [
      'Connect emission savings with live public dashboards',
      'Promote verified reductions from fuel and electricity use',
      'Turn every report into a measurable climate action',
    ],
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Clean green landscape',
    caption: 'Evidence-Led Climate Action',
    icon: Wind,
    accent: 'text-emerald-600',
    tint: 'bg-emerald-100',
  },
];

const LandingPage = () => {
  const [activePage, setActivePage] = useState(0);
  const [activeAwarenessSlide, setActiveAwarenessSlide] = useState(0);
  const [autoCycle, setAutoCycle] = useState(true);
  const [heroTransformed, setHeroTransformed] = useState(false);
  const showNav = activePage !== 0 || heroTransformed;


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



  const awarenessSlide = awarenessSlides[activeAwarenessSlide];
  const AwarenessIcon = awarenessSlide.icon;

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
          <Link
            to="/calculator"
            className="px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all text-slate-300 hover:text-white hover:bg-white/10"
          >
            Contribution
          </Link>
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
            to="/calculator"
            className="px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap text-slate-300 hover:text-white hover:bg-white/10"
          >
            Contribution
          </Link>
        </div>
      </motion.div>

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
              className="absolute inset-0 w-full h-full text-slate-900 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

              {/* Main content (header + stat cards), reserves right space for the log on lg+ */}
              <div className="absolute inset-0 px-4 sm:px-6 pt-32 sm:pt-36 lg:pt-32 pb-24 sm:pb-20 lg:pr-[440px] flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl mx-auto">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-10 text-center">Live State Intelligence</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 md:gap-8">
                    {[
                      { label: 'CO2 Saved (Tons)', value: '1,245,892', icon: Wind, color: 'text-green-600' },
                      { label: 'Registered Factories', value: '8,420', icon: FactoryIcon, color: 'text-blue-600' },
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

                  <div className="mt-8">
                    <AnalyticsLeaderboard />
                  </div>
                </div>
              </div>

              {/* Live log — stuck to the right edge of the screen (lg+ only) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden lg:flex absolute top-32 bottom-20 right-4 xl:right-6 w-[360px] xl:w-[400px] z-20"
                >
                <LiveLog />
              </motion.div>
            </motion.div>
          )}

          {/* PAGE 2: AWARENESS */}
          {activePage === 2 && (
            <motion.div
              key="awareness"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0 w-full px-4 sm:px-6 max-w-7xl mx-auto max-h-full overflow-y-auto no-scrollbar pt-36 sm:pt-40 lg:pt-32 pb-24 sm:pb-16"
            >
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-12 lg:gap-16 pb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-8">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0">
                      <motion.div
                        key={`ring-${activeAwarenessSlide}`}
                        className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-green-500 border-r-blue-500"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
                      />
                      <motion.div
                        key={`icon-${activeAwarenessSlide}`}
                        initial={{ scale: 0.75, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.85, opacity: 0, rotate: 20 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full ${awarenessSlide.tint} flex items-center justify-center shadow-lg`}
                      >
                        <AwarenessIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${awarenessSlide.accent}`} />
                      </motion.div>
                    </div>
                    <div className="flex gap-2">
                      {awarenessSlides.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveAwarenessSlide(i)}
                          aria-label={`Awareness slide ${i + 1}`}
                          className={`h-2.5 rounded-full transition-all ${activeAwarenessSlide === i ? 'w-8 bg-green-500' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={awarenessSlide.title}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -24 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                    >
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 sm:mb-6 leading-tight">{awarenessSlide.title}</h2>
                      <p className="text-sm sm:text-lg md:text-xl text-slate-600 font-medium mb-4 sm:mb-8 leading-relaxed">
                        {awarenessSlide.body}
                      </p>
                      <ul className="space-y-2.5 sm:space-y-4 text-slate-800 font-bold text-sm sm:text-base md:text-lg">
                        {awarenessSlide.points.map((point, i) => (
                          <li key={point} className="flex items-center gap-3 sm:gap-4">
                            <motion.div
                              className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.08, duration: 0.25 }}
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex-1 w-full h-[220px] sm:h-[360px] md:h-[400px] lg:h-[500px] bg-slate-200 rounded-3xl overflow-hidden relative shadow-2xl group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={awarenessSlide.image}
                      src={awarenessSlide.image}
                      alt={awarenessSlide.imageAlt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      initial={{ opacity: 0, scale: 1.08, rotate: 1 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.96, rotate: -1 }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent flex items-end p-5 sm:p-8">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={awarenessSlide.caption}
                        className="text-white text-xl sm:text-2xl md:text-3xl font-extrabold"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.4 }}
                      >
                        {awarenessSlide.caption}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Play/Pause Indicator Overlay */}
      <div className="flex absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 items-center gap-1.5 sm:gap-2 z-40 pointer-events-none">
        {pages.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${activePage === i ? 'w-12 bg-slate-500' : 'w-4 bg-slate-300'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
