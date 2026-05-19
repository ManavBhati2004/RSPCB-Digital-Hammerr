import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { SmokeAnimation } from './SmokeAnimation';
import { HeroEnvironment } from './HeroEnvironment';
import { TreeGrowth } from './TreeGrowth';
import { EcoTransition } from './EcoTransition';

interface Props {
  onInteract: () => void;
}

export const CinematicHero: React.FC<Props> = ({ onInteract }) => {
  const [isTransformed, setIsTransformed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleTransform = () => {
    if (!isTransformed) {
      setIsTransformed(true);
      onInteract(); // Pause the auto-slider
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

      {/* Parallax Container */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        animate={{ x: mousePos.x, y: mousePos.y }}
        transition={{ type: "spring", stiffness: 40, damping: 30 }}
      >
        <SmokeAnimation isTransformed={isTransformed} />
        <HeroEnvironment isTransformed={isTransformed} onSmokeClick={handleTransform} />
        <TreeGrowth isTransformed={isTransformed} />
        <EcoTransition isTransformed={isTransformed} />
      </motion.div>

      {/* Central Content */}
      <div className="relative z-50 text-center px-4 sm:px-6 pointer-events-none mt-[-10vh] sm:mt-[-15vh]">
        <AnimatePresence mode="wait">
          {!isTransformed ? (
            <motion.div
              key="polluted-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pointer-events-auto flex flex-col items-center"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-lg leading-tight">
                Rajasthan State <br /><span className="text-orange-500">Pollution Control Board</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-xl mx-auto mb-6 sm:mb-10 drop-shadow-md px-2">
                Our industries are leaving a heavy carbon footprint. Click the factory or the button below to initiate state-wide optimization.
              </p>
              <button
                onClick={handleTransform}
                className="px-6 sm:px-10 py-3.5 sm:py-5 bg-red-600 hover:bg-red-500 text-white rounded-full text-base sm:text-xl font-extrabold shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 transition-all"
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
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-emerald-900 text-xs sm:text-sm font-extrabold mb-4 sm:mb-6 shadow-xl">
                <Leaf size={16} /> Eco-Optimized State
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
                Cleaner Actions Create a <br/><span className="text-green-700 drop-shadow-lg">Greener Future.</span>
              </h1>
              <p className="text-sm sm:text-lg md:text-xl text-emerald-900 font-extrabold max-w-3xl mx-auto drop-shadow-md px-2">
                Rajasthan State Pollution Control Board: An official government platform to track, measure, and reduce carbon footprints across industries and vehicles.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
