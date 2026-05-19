import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isTransformed: boolean;
  onSmokeClick: () => void;
}

export const HeroEnvironment: React.FC<Props> = ({ isTransformed, onSmokeClick }) => {
  return (
    <div className="absolute bottom-0 w-full h-[28vh] sm:h-[36vh] md:h-[40vh] z-20 flex items-end justify-center pointer-events-auto">
      {/* Factory Base */}
      <motion.div
        className="relative w-full max-w-6xl h-32 sm:h-40 md:h-48 cursor-pointer group flex items-end"
        onClick={onSmokeClick}
        animate={{ filter: isTransformed ? 'brightness(1.2) saturate(1.1)' : 'brightness(0.5) saturate(0.8)' }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      >
        {/* Main Building Structure SVG */}
        <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
          {/* Back Chimneys */}
          <rect x="250" y="20" width="40" height="120" fill="#1e293b" />
          <rect x="500" y="10" width="50" height="150" fill="#0f172a" />
          <rect x="750" y="40" width="30" height="100" fill="#1e293b" />
          
          {/* Main Buildings */}
          <path d="M50 200 L50 120 L250 120 L250 100 L400 100 L400 120 L650 120 L650 80 L800 80 L800 120 L950 120 L950 200 Z" fill="#334155" />
          <path d="M0 200 L0 150 L1000 150 L1000 200 Z" fill="#0f172a" />

          {/* Windows Overlay */}
          {[
            // Building 1 windows
            { x: 90, y: 140, w: 20, h: 40, rx: 10, delay: 0 },
            { x: 140, y: 140, w: 20, h: 40, rx: 10, delay: 0.1 },
            { x: 190, y: 140, w: 20, h: 40, rx: 10, delay: 0.2 },
            // Building 3 windows
            { x: 470, y: 140, w: 25, h: 25, rx: 0, delay: 0.5 },
            { x: 520, y: 140, w: 25, h: 25, rx: 0, delay: 0.6 },
            { x: 570, y: 140, w: 25, h: 25, rx: 0, delay: 0.7 },
            // Building 5 windows
            { x: 830, y: 140, w: 20, h: 45, rx: 10, delay: 1.0 },
            { x: 875, y: 140, w: 20, h: 45, rx: 10, delay: 1.1 },
            { x: 920, y: 140, w: 20, h: 45, rx: 10, delay: 1.2 },
          ].map((w, i) => (
            <motion.rect
              key={i}
              x={w.x} y={w.y} width={w.w} height={w.h} rx={w.rx}
              animate={{ 
                fill: isTransformed ? '#1e293b' : '#facc15',
                filter: isTransformed ? 'drop-shadow(0px 0px 0px rgba(250,204,21,0))' : 'drop-shadow(0px 0px 10px rgba(250,204,21,0.6))'
              }}
              transition={{ duration: 1.5, delay: w.delay }}
            />
          ))}
        </svg>
      </motion.div>
      
      {/* Ground Transition */}
      <motion.div 
        className="absolute bottom-0 w-full h-8 z-30 pointer-events-none"
        animate={{ backgroundColor: isTransformed ? '#22c55e' : '#0f172a' }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
    </div>
  );
};
