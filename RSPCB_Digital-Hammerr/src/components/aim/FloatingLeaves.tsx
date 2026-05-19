import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export const FloatingLeaves: React.FC = () => {
  const leaves = Array.from({ length: 8 });

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {leaves.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-500/30"
          initial={{ 
            y: '110vh', 
            x: `${Math.random() * 100}vw`,
            rotate: 0,
            scale: 0.5 + Math.random() * 1.5
          }}
          animate={{
            y: '-10vh',
            rotate: 360,
            x: `${Math.random() * 100}vw`
          }}
          transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        >
          <Leaf className="fill-green-500/20" />
        </motion.div>
      ))}
    </div>
  );
};
