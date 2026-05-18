import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RspcbLogo } from '../components/RspcbLogo';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-400/20 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-400/20 rounded-full blur-3xl opacity-60"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <Link to="/">
            <RspcbLogo className="w-14 h-14 p-0.5 border border-green-100 shadow-lg shadow-green-500/20" />
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-slate-500 mb-8 text-sm">
          {isLogin ? 'Login to the Factory & Environmental Portal' : 'Register your factory for sustainability tracking'}
        </p>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Factory Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white" placeholder="Rajasthan Steels Ltd." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Number</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white" placeholder="RSPCB-12345" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white" placeholder="admin@factory.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2 group">
            {isLogin ? 'Secure Login' : 'Register Factory'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-green-600 font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
