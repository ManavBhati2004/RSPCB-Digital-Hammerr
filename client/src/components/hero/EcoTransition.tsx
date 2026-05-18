import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  isTransformed: boolean;
}

export const EcoTransition: React.FC<Props> = ({ isTransformed }) => {


  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">

      <motion.div 
        className="absolute inset-0 bg-green-400/10 mix-blend-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransformed ? 1 : 0 }}
        transition={{ duration: 3 }}
      />
    </div>
  );
};
