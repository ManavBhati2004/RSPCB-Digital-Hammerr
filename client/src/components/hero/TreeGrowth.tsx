import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isTransformed: boolean;
}

export const TreeGrowth: React.FC<Props> = ({ isTransformed }) => {
  const trees = [
    { left: '5%', delay: 0.2, scale: 0.8 },
    { left: '15%', delay: 0.6, scale: 1.1 },
    { left: '25%', delay: 0.3, scale: 0.9 },
    { left: '35%', delay: 0.8, scale: 1.2 },
    { left: '65%', delay: 0.4, scale: 0.8 },
    { left: '75%', delay: 0.7, scale: 1.3 },
    { left: '85%', delay: 0.2, scale: 0.9 },
    { left: '95%', delay: 0.5, scale: 1.0 },
  ];

  return (
    <div className="absolute bottom-10 w-full h-64 z-[25] pointer-events-none flex justify-center">
      <div className="relative w-full h-full">
        {trees.map((tree, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 flex flex-col items-center origin-bottom"
            style={{ left: tree.left }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isTransformed ? tree.scale : 0, 
              opacity: isTransformed ? 1 : 0 
            }}
            transition={{ 
              duration: 2, 
              delay: isTransformed ? 1 + tree.delay : 0,
              type: "spring",
              stiffness: 40,
              damping: 12
            }}
          >
            {/* Tree Top */}
            <div className="relative w-24 h-24 bg-green-500 rounded-full shadow-[inset_-10px_-10px_0_rgba(0,0,0,0.1)] -mb-6 z-10">
              <div className="absolute top-2 -left-4 w-16 h-16 bg-green-400 rounded-full z-10" />
              <div className="absolute top-2 -right-4 w-16 h-16 bg-emerald-500 rounded-full z-10" />
            </div>
            {/* Trunk */}
            <div className="w-6 h-20 bg-amber-800 rounded-sm" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
