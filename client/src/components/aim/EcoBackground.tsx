import React from 'react';

export const EcoBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/10 blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-400/20 blur-[120px]" />
      {/* Wave bottom */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="none">
        <path fill="#22c55e" fillOpacity="0.05" d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,218.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </div>
  );
};
