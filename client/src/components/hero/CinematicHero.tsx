import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { SmokeAnimation } from './SmokeAnimation';
import { HeroEnvironment } from './HeroEnvironment';
import { TreeGrowth } from './TreeGrowth';
import { EcoTransition } from './EcoTransition';
import { ModiInteractiveCard } from '../aim/ModiInteractiveCard';
import { InfiniteImageSlider } from '../home/InfiniteImageSlider';

export const CinematicHero: React.FC = () => {
  const [isTransformed, setIsTransformed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Responsive upward shift applied to the parallax (factory + trees) and central content
  // when entering the eco-optimized state, so they sit cleanly above the bottom slider.
  const [shifts, setShifts] = useState({ parallax: 0, content: 0 });

  const handleTransform = () => {
    if (!isTransformed) {
      setIsTransformed(true);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30, // 30px max parallax
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateShifts = () => {
      const w = window.innerWidth;
      if (w >= 768) setShifts({ parallax: 260, content: 100 });        // md+
      else if (w >= 640) setShifts({ parallax: 220, content: 80 });    // sm
      else setShifts({ parallax: 175, content: 60 });                  // mobile
    };
    updateShifts();
    window.addEventListener('resize', updateShifts);
    return () => window.removeEventListener('resize', updateShifts);
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dynamic Sky Gradient */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: isTransformed 
            ? 'linear-gradient(to bottom, #38bdf8, #86efac)' // Bright blue to green
            : 'linear-gradient(to bottom, #1e293b, #7c2d12)' // Dark gray to orange (polluted)
        }}
        transition={{ duration: 3, ease: "easeInOut" }}
      />

      {/* Parallax Container — lifted upward in the eco-optimized state so the factory + trees
          sit fully above the bottom slider instead of being hidden by it. */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          x: mousePos.x,
          y: mousePos.y + (isTransformed ? -shifts.parallax : 0),
        }}
        transition={{ type: "spring", stiffness: 40, damping: 30 }}
      >
        <SmokeAnimation isTransformed={isTransformed} />
        <HeroEnvironment isTransformed={isTransformed} onSmokeClick={handleTransform} />
        <TreeGrowth isTransformed={isTransformed} />
        <EcoTransition isTransformed={isTransformed} />
      </motion.div>

      {/* Infinite image slider — only visible in eco-optimized state, anchored to bottom */}
      <AnimatePresence>
        {isTransformed && (
          <motion.div
            key="eco-slider"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 z-40 pb-10 sm:pb-12 md:pb-14 bg-gradient-to-t from-[#E4DFB5]/80 via-[#E4DFB5]/40 to-transparent"
          >
            <InfiniteImageSlider />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Content — also lifted upward in the eco-optimized state so it stays above the trees */}
      <motion.div
        className="relative z-50 w-full text-center px-4 sm:px-6 pointer-events-none mt-[-6vh] sm:mt-[-12vh] md:mt-[-15vh] max-w-full"
        animate={{ y: isTransformed ? -shifts.content : 0 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          {!isTransformed ? (
            <motion.div
              key="polluted-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pointer-events-auto flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-700 text-red-400 text-[11px] sm:text-sm font-bold mb-3 sm:mb-6 cursor-pointer hover:bg-slate-900/80 transition-colors" onClick={handleTransform}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Critical Emission Levels Detected
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold text-white mb-3 sm:mb-6 drop-shadow-lg leading-tight">
                Rajasthan State <br className="hidden sm:block" /><span className="text-orange-500"> Pollution Control Board</span>
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto mb-4 sm:mb-10 drop-shadow-md px-2 leading-relaxed">
                Our industries are leaving a heavy carbon footprint. Click the factory or the button below to initiate state-wide optimization.
              </p>
              <button
                onClick={handleTransform}
                className="px-5 sm:px-10 py-3 sm:py-5 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm sm:text-xl font-extrabold shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 transition-all"
              >
                Reduce Emission Now
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="clean-text"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="w-full flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 lg:gap-6 pointer-events-auto"
            >
              {/* Left: Slogan (anchored far left on md+) */}
              <motion.div
                className="w-full md:w-[220px] lg:w-[300px] flex-shrink-0 text-center md:text-left"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-emerald-900 text-[11px] sm:text-sm font-extrabold mb-3 sm:mb-5 shadow-xl">
                  <Leaf size={14} /> Eco-Optimized State
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-3xl lg:text-5xl font-black text-emerald-800 drop-shadow-lg leading-snug" style={{ fontFamily: 'sans-serif' }}>
                  "पेट्रोल बचाएं, <br /> देश बचाएं"
                </h1>
              </motion.div>

              {/* Center: Office text */}
              <motion.div
                className="w-full md:flex-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg leading-tight px-2 font-sans" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif' }}>
                  District Collector Regional Office and Rajasthan State Pollution Control Board
                </p>
              </motion.div>

              {/* Right: Modi photo (anchored far right on md+) */}
              <motion.div
                className="w-full md:w-[240px] lg:w-[340px] flex-shrink-0 flex justify-center md:justify-end"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <ModiInteractiveCard />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
