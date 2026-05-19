import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isTransformed: boolean;
}

export const SmokeAnimation: React.FC<Props> = ({ isTransformed }) => {
  const particles = Array.from({ length: 25 });
  
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden flex justify-center items-end">
      <div className="relative w-full max-w-6xl h-[40vh]">
        {particles.map((_, i) => {
          const chimney = i % 3;
          const leftBase = chimney === 0 ? 27 : chimney === 1 ? 52.5 : 76.5;
          const left = leftBase + (Math.random() * 2 - 1);
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-slate-900/80 blur-2xl"
              style={{
                width: 60 + Math.random() * 60,
                height: 60 + Math.random() * 60,
                left: `${left}%`,
                bottom: chimney === 0 ? '60%' : chimney === 1 ? '75%' : '50%',
              }}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{
                opacity: isTransformed ? 0 : [0, 0.8, 0],
                y: isTransformed ? -100 : -500 - Math.random() * 300,
                scale: isTransformed ? 0.5 : 2 + Math.random() * 3,
                x: (Math.random() - 0.5) * 300
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: isTransformed ? 0 : Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
