import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-500 selection:text-white relative">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>

        {/* Universal Branding Watermark */}
        <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[9999] pointer-events-none flex items-center gap-2 sm:gap-3 opacity-90">
          {/* Custom Digital Hammerr Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-12 flex items-center justify-center drop-shadow-xl">
            <img src="/dh-logo.png" alt="Digital Hammerr" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col items-end gap-0.5 sm:gap-1 text-right text-white mix-blend-difference">
            <span className="text-[9px] sm:text-[11px] font-extrabold tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-none drop-shadow-md">Digital Hammerr</span>
            <span className="opacity-80 text-[6px] sm:text-[9px] font-bold tracking-[0.1em] uppercase drop-shadow-sm">Dev. Manav Bhati</span>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
