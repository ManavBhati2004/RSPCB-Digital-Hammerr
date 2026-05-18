import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import modiImage from '../../assets/modi.jpg';

export const ModiInteractiveCard: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  const bgX = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);
  const bgY = useTransform(mouseYSpring, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full max-w-[500px] mx-auto aspect-[3/4] z-20 flex items-center justify-center" style={{ perspective: "1200px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full relative cursor-pointer"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {/* Glow behind the circle */}
        <motion.div 
          className="absolute top-[10%] left-[10%] w-[80%] h-[80%] bg-green-500/40 rounded-full blur-3xl pointer-events-none"
          style={{ x: bgX, y: bgY, transform: "translateZ(-80px)" }}
        />
        
        {/* Green Circle Background */}
        <motion.div 
          className="absolute top-[15%] left-[5%] w-[90%] h-[70%] bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.4)] border border-white/20 overflow-hidden"
          style={{ x: bgX, y: bgY, transform: "translateZ(-40px)" }}
        >
           {/* Abstract inner overlay to make it look premium */}
           <div className="absolute w-[150%] h-[150%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30" />
        </motion.div>

        {/* The Main Image Wrapper - Visually Dominant, large */}
        <motion.div
          className="absolute bottom-0 w-full h-[140%] flex items-end justify-center pointer-events-none"
          style={{ transform: "translateZ(60px)" }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Using exact user requested format with object-bottom for proper standing alignment */}
          <img 
            src={modiImage} 
            alt="Narendra Modi"
            className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        {/* Floating Accent Particles over image for 3D depth */}
        <motion.div 
          className="absolute top-[20%] right-[10%] w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"
          style={{ transform: "translateZ(100px)" }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[40%] left-[0%] w-3 h-3 bg-green-200 rounded-full shadow-[0_0_15px_rgba(187,247,208,1)]"
          style={{ transform: "translateZ(80px)" }}
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-[50%] right-[-5%] w-5 h-5 bg-emerald-200 rounded-full shadow-[0_0_20px_rgba(167,243,208,1)]"
          style={{ transform: "translateZ(120px)" }}
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};
