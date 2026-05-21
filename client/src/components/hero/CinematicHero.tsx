import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmokeAnimation } from './SmokeAnimation';
import { HeroEnvironment } from './HeroEnvironment';
import { TreeGrowth } from './TreeGrowth';
import { EcoTransition } from './EcoTransition';
import { ModiInteractiveCard } from '../aim/ModiInteractiveCard';
import { InfiniteImageSlider } from '../home/InfiniteImageSlider';
import { RspcbLogo } from '../RspcbLogo';

interface Props {
  onTransform?: () => void;
}

export const CinematicHero: React.FC<Props> = ({ onTransform }) => {
  const [isTransformed, setIsTransformed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  // Responsive upward shift applied to the parallax (factory + trees) and central content
  // when entering the eco-optimized state, so they sit cleanly above the bottom slider.
  const [shifts, setShifts] = useState({ parallax: 0, content: 0 });

  const handleTransform = () => {
    if (!isTransformed) {
      setIsTransformed(true);
      onTransform?.();
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

      {/* Mobile-only Modi photo — anchored to the grass band relative to the full hero so it stands
          on the ground and stays clear of the top navbar. Hidden on md+ where the inline row layout
          inside Central Content takes over. */}
      <AnimatePresence>
        {isTransformed && (
          <motion.div
            key="modi-mobile"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="md:hidden absolute left-1/2 -translate-x-1/2 bottom-[22vh] w-[150px] sm:w-[190px] z-50 pointer-events-auto"
          >
            <ModiInteractiveCard />
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
              <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-5 mb-3 sm:mb-6 w-full px-2 sm:px-0">
                <RspcbLogo className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 flex-shrink-0 shadow-md" />
                <h1 className="text-lg sm:text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight sm:whitespace-nowrap">
                  Rajasthan State<span className="text-orange-500"> Pollution Control Board, Udaipur</span>
                </h1>
              </div>
              <p className="whitespace-nowrap text-center text-sm sm:text-lg md:text-2xl font-bold tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-5 bg-gradient-to-r from-emerald-300 via-amber-200 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.45)]">
                YOU CAN HELP SAVE THE WORLD
              </p>
              <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto mb-4 sm:mb-10 drop-shadow-md px-2 leading-relaxed">
                Our activities are leaving a heavy carbon footprint. Click  the button below to initiate Positive optimization.
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
                <h1 className="text-2xl sm:text-4xl md:text-3xl lg:text-5xl font-black text-emerald-800 drop-shadow-lg leading-snug whitespace-nowrap" style={{ fontFamily: 'sans-serif' }}>
                  "SAVE FUEL <br /> &nbsp;&nbsp;SAVE INDIA"
                </h1>
              </motion.div>

              {/* Spacer to keep slogan left and Modi card right */}
              <div className="hidden md:block md:flex-1" />

              {/* Right: Modi photo (md+ only — on mobile the photo is rendered separately below,
                  anchored to the grass band relative to the outer hero, not this text wrapper). */}
              <motion.div
                className="hidden md:flex md:w-[240px] lg:w-[340px] flex-shrink-0 md:justify-end"
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
