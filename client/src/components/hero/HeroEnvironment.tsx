import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isTransformed: boolean;
  onSmokeClick: () => void;
}

export const HeroEnvironment: React.FC<Props> = ({ isTransformed, onSmokeClick }) => {
  return (
    <div className="absolute bottom-0 w-full h-[40vh] z-20 flex items-end justify-center pointer-events-auto">
      {/* Factory Base */}
      <motion.div 
        className="relative w-full max-w-6xl h-48 cursor-pointer group flex items-end"
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
        </svg>

        {/* Windows Overlay */}
        <div className="absolute bottom-16 left-[10%] flex gap-6">
           {[1,2,3].map(i => (
             <motion.div 
               key={`w1-${i}`} 
               className="w-6 h-10 rounded-t-full"
               animate={{ backgroundColor: isTransformed ? '#1e293b' : '#facc15', boxShadow: isTransformed ? 'none' : '0 0 15px rgba(250, 204, 21, 0.4)' }}
               transition={{ duration: 1.5, delay: i * 0.1 }}
             />
           ))}
        </div>

        <div className="absolute bottom-20 left-[45%] flex gap-8">
           {[1,2,3].map(i => (
             <motion.div 
               key={`w2-${i}`} 
               className="w-8 h-8"
               animate={{ backgroundColor: isTransformed ? '#1e293b' : '#facc15', boxShadow: isTransformed ? 'none' : '0 0 15px rgba(250, 204, 21, 0.4)' }}
               transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
             />
           ))}
        </div>

        <div className="absolute bottom-16 right-[15%] flex gap-5">
           {[1,2,3].map(i => (
             <motion.div 
               key={`w3-${i}`} 
               className="w-8 h-12 rounded-t-full"
               animate={{ backgroundColor: isTransformed ? '#1e293b' : '#facc15', boxShadow: isTransformed ? 'none' : '0 0 15px rgba(250, 204, 21, 0.4)' }}
               transition={{ duration: 1.5, delay: 1 + i * 0.1 }}
             />
           ))}
        </div>
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
