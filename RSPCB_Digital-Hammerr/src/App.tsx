import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-500 selection:text-white relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>

        {/* Universal Branding Watermark */}
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[9999] pointer-events-none mix-blend-difference flex items-center gap-2 sm:gap-3 opacity-90">
          {/* Custom Digital Hammerr SVG Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-[1px] sm:w-6 sm:h-6">
              {/* Hammer */}
              <path d="M 40 20 C 25 20 10 25 15 40 C 25 40 28 35 33 35 L 33 80 L 50 80 L 50 45 C 60 45 60 30 60 20 Z" fill="white" />
              {/* Red D-curve */}
              <path d="M 55 80 L 55 65 A 20 20 0 0 0 65 30 L 80 25 A 40 40 0 0 1 55 80 Z" fill="#ef4444" />
            </svg>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-1 text-right text-white">
            <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase leading-none">Digital Hammerr</span>
            <span className="opacity-60 text-[9px] font-bold tracking-[0.1em] uppercase">Dev. Manav Bhati</span>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
