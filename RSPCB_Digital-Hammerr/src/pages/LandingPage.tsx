import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Zap, Factory as FactoryIcon, Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CinematicHero } from '../components/hero/CinematicHero';
import { AimSection } from '../components/aim/AimSection';
import { RspcbLogo } from '../components/RspcbLogo';

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
  const [isPaused, setIsPaused] = useState(false);
  const [heroTransformed, setHeroTransformed] = useState(false);
  const showNav = activePage !== 0 || heroTransformed;

  const pages = [
    { id: 'hero', name: 'Home' },
    { id: 'aim', name: 'AIM' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'awareness', name: 'Awareness' },
    { id: 'calculator', name: 'Calculator' }
  ];

  // Auto-shift logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActivePage((prev) => (prev + 1) % pages.length);
    }, 12000); // 12 seconds per page
    return () => clearInterval(interval);
  }, [pages.length, isPaused]);

  useEffect(() => {
    if (activePage !== 3) return;
    const interval = setInterval(() => {
      setActiveAwarenessSlide((prev) => (prev + 1) % awarenessSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activePage]);

  const awarenessSlide = awarenessSlides[activeAwarenessSlide];
  const AwarenessIcon = awarenessSlide.icon;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* Dynamic Backgrounds based on active page */}
      <div className="absolute inset-0 transition-colors duration-1000 z-0" style={{
        backgroundColor: 
          activePage === 0 ? '#f8fafc' : 
          activePage === 1 ? '#ffffff' : 
          activePage === 2 ? '#B2D3C2' : 
          activePage === 3 ? '#f8fafc' : '#22c55e'
      }}></div>

      {/* Global Navbar */}
      <motion.nav
        initial={false}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -16 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: showNav ? 0.5 : 0 }}
        style={{ pointerEvents: showNav ? 'auto' : 'none' }}
        className="absolute top-0 w-full z-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <RspcbLogo className="w-10 h-10 sm:w-11 sm:h-11 p-0.5 border border-green-100 shadow-lg shadow-green-500/20 shrink-0" />
          <div className={`min-w-0 ${activePage === 4 ? 'text-white' : 'text-slate-900'}`}>
            <h1 className="font-bold text-base sm:text-lg leading-tight transition-colors duration-500">RSPCB</h1>
            <p className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold opacity-80">State Pollution Control Board</p>
          </div>
        </div>

        {/* Page Nav Indicators (desktop) */}
        <div className="hidden lg:flex gap-2 xl:gap-4 p-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 shadow-xl">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => setActivePage(index)}
              className={`px-4 xl:px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activePage === index
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2 sm:gap-4 items-center shrink-0">
          <Link to="/calculator" className="lg:hidden px-3 py-2 bg-green-500 text-white rounded-full text-xs font-bold shadow-lg">
            Calc
          </Link>
          <Link to="/dashboard" className="px-3 sm:px-6 py-2 sm:py-2.5 bg-slate-900 text-white border border-slate-700 rounded-full text-xs sm:text-sm font-bold hover:bg-green-600 transition-all shadow-xl">
            <span className="hidden sm:inline">Factory </span>Data
          </Link>
        </div>
      </motion.nav>

      {/* Mobile page nav (dots) */}
      <motion.div
        initial={false}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -16 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: showNav ? 0.5 : 0 }}
        style={{ pointerEvents: showNav ? 'auto' : 'none' }}
        className="lg:hidden absolute top-[60px] sm:top-[72px] left-1/2 -translate-x-1/2 z-50 flex gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-700"
      >
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => setActivePage(index)}
            aria-label={page.name}
            className={`h-2 rounded-full transition-all ${activePage === index ? 'w-6 bg-green-400' : 'w-2 bg-slate-500'}`}
          />
        ))}
      </motion.div>

      {/* Main Content Area (Full Screen Slider) */}
      <div className="relative w-full h-full z-10 flex items-center justify-center pt-16">
        <AnimatePresence mode="wait">
          
          {/* PAGE 0: HERO */}
          {activePage === 0 && (
            <CinematicHero onInteract={() => setIsPaused(true)} onTransform={() => setHeroTransformed(true)} />
          )}

          {/* PAGE 1: AIM */}
          {activePage === 1 && (
            <AimSection key="aim" />
          )}

          {/* PAGE 2: ANALYTICS */}
          {activePage === 2 && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full px-4 sm:px-6 max-w-7xl mx-auto text-slate-900 pt-12 sm:pt-0"
            >
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-8 sm:mb-16 text-center">Live State Intelligence</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 pb-6">
                {[
                  { label: 'CO2 Saved (Tons)', value: '1,245,892', icon: Wind, color: 'text-green-600' },
                  { label: 'Registered Factories', value: '8,420', icon: FactoryIcon, color: 'text-blue-600' },
                  { label: 'Energy Optimized (MWh)', value: '450,122', icon: Zap, color: 'text-yellow-600' },
                  { label: 'Vehicles Tracked', value: '1.2M', icon: Car, color: 'text-purple-600' },
                ].map((stat, i) => (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    key={i}
                    className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-4 sm:p-6 md:p-8 shadow-xl hover:bg-white/80 transition-all cursor-default"
                  >
                    <stat.icon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-6 ${stat.color}`} />
                    <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 sm:mb-2 break-words">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-slate-600 uppercase tracking-wider sm:tracking-widest font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PAGE 3: AWARENESS */}
          {activePage === 3 && (
            <motion.div
              key="awareness"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full px-4 sm:px-6 max-w-7xl mx-auto max-h-full overflow-y-auto pt-12 sm:pt-0"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 pb-6">
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
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6">{awarenessSlide.title}</h2>
                      <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium mb-6 sm:mb-8 leading-relaxed">
                        {awarenessSlide.body}
                      </p>
                      <ul className="space-y-3 sm:space-y-4 text-slate-800 font-bold text-sm sm:text-base md:text-lg">
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
                <div className="flex-1 w-full h-[260px] sm:h-[400px] lg:h-[500px] bg-slate-200 rounded-3xl overflow-hidden relative shadow-2xl group">
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
                  <motion.div
                    key={`orbit-${activeAwarenessSlide}`}
                    className="absolute top-5 right-5 w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
                  >
                    <div className="absolute left-1/2 top-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
                  </motion.div>
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

          {/* PAGE 4: CALCULATOR */}
          {activePage === 4 && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute w-full px-4 sm:px-6 max-w-4xl mx-auto text-center text-white"
            >
              <RspcbLogo className="w-20 h-20 sm:w-28 sm:h-28 p-1 mx-auto mb-5 sm:mb-8 shadow-[0_0_40px_rgba(255,255,255,0.45)]" />
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-8 drop-shadow-lg">Calculate Your Impact</h2>
              <p className="text-base sm:text-xl md:text-2xl mb-8 sm:mb-12 text-green-50 font-bold px-2">Use our official government algorithms to calculate exact CO2 savings for your electricity and vehicle usage.</p>
              <Link to="/calculator" className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3.5 sm:py-5 bg-white text-green-600 rounded-full text-base sm:text-xl font-extrabold hover:scale-105 transition-transform shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]">
                Launch Calculator <ArrowRight size={20} />
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Play/Pause Indicator Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {pages.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${activePage === i ? 'w-12 bg-slate-500' : 'w-4 bg-slate-300'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
