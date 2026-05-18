import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import { EcoBackground } from './EcoBackground';
import { FloatingLeaves } from './FloatingLeaves';
import { ModiInteractiveCard } from './ModiInteractiveCard';

export const AimSection: React.FC = () => {
  return (
    <motion.div 
      className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-white z-10"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <EcoBackground />
      <FloatingLeaves />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 py-16 sm:py-20 md:py-0">
        {/* Left Content */}
        <motion.div
          className="flex-1 text-center md:text-left w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-50 text-green-700 text-xs sm:text-sm font-extrabold mb-4 sm:mb-6 border border-green-200 shadow-sm">
            <Leaf size={14} /> NATIONAL INITIATIVE
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 mb-2 leading-tight">
            Our <span className="text-green-600">AIM</span>
          </h2>

          <h3 className="text-2xl sm:text-4xl md:text-6xl font-black text-emerald-800 mb-5 sm:mb-8 drop-shadow-sm" style={{ fontFamily: 'sans-serif' }}>
            "पेट्रोल बचाएं, <br/> देश बचाएं"
          </h3>

          <p className="text-sm sm:text-lg md:text-xl text-slate-600 font-bold max-w-xl mx-auto md:mx-0 mb-6 sm:mb-10 leading-relaxed">
            Aligned with the Honorable Prime Minister's vision for a sustainable future, Rajasthan is leading the charge to optimize fuel consumption and drastically lower the carbon footprint of our industries and logistics.
          </p>

          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full text-sm sm:text-lg font-bold inline-flex items-center gap-2 sm:gap-3 shadow-[0_10px_25px_rgba(34,197,94,0.4)] hover:shadow-[0_15px_35px_rgba(34,197,94,0.6)] hover:-translate-y-1 transition-all">
            Join the Movement <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Right Interactive Card */}
        <motion.div 
          className="flex-1 w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ModiInteractiveCard />
        </motion.div>
      </div>
    </motion.div>
  );
};
