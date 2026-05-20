import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Car, ChevronDown, User, Factory as FactoryIcon, ArrowLeft, Award, HelpCircle, Sparkles } from 'lucide-react';
import axios from 'axios';
import DrivingCarHeader from '../components/calculator/DrivingCarHeader';
import PowerTowerHeader from '../components/calculator/PowerTowerHeader';
import GrowingTreeHeader from '../components/calculator/GrowingTreeHeader';
import FarewellSection from '../components/calculator/FarewellSection';
import CertificateCanvas from '../components/calculator/CertificateCanvas';
import { generateCertificatePdf } from '../utils/generateCertificate';

type UseType = 'Personal' | 'Factory';

axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';
const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

const Calculator = () => {
  const [activeTab, setActiveTab] = useState<'electricity' | 'vehicle'>('electricity');

  // Shared identity
  const [useType, setUseType] = useState<UseType>('Factory');
  const [factoryName, setFactoryName] = useState('');
  const [identityOpen, setIdentityOpen] = useState(true);

  // Electricity State
  const [c1, setC1] = useState('');
  const [c2, setC2] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [electricityResult, setElectricityResult] = useState<number | null>(null);

  // Vehicle State
  const [vType, setVType] = useState('2 Wheeler');
  const [fuel, setFuel] = useState('Petrol');
  const [distance, setDistance] = useState('');
  const [vehicleResult, setVehicleResult] = useState<number | null>(null);
  const [isVehicleSubmitting, setIsVehicleSubmitting] = useState(false);

  // Certificate state
  const certRef = useRef<HTMLDivElement>(null);
  const [certData, setCertData] = useState({ name: '', co2: '0.0000', unit: '', date: '' });
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const identityLabel = useType === 'Personal' ? 'Personal Use' : (factoryName.trim() || 'Factory Use');

  const handleGenerateCertificate = async (tab: 'electricity' | 'vehicle') => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    let co2 = 0;
    let unit = '';
    if (tab === 'electricity') { co2 = electricityResult ?? 0; unit = 'Tons'; }
    if (tab === 'vehicle')     { co2 = vehicleResult ?? 0;     unit = 'Kg'; }

    const safeName = factoryName.trim() || 'Participant';
    setCertData({ name: safeName, co2: co2.toFixed(4), unit, date: today });

    setIsGeneratingCert(true);
    // wait two frames so the hidden CertificateCanvas re-renders with new props before capture
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    try {
      if (certRef.current) {
        await generateCertificatePdf({
          element: certRef.current,
          filename: `certificate-${safeName.replace(/\s+/g, '_')}.pdf`,
        });
      }
      setShowThankYou(true);
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (err) {
      console.error('Certificate generation failed:', err);
      alert('Could not generate certificate. Please try again.');
    } finally {
      setIsGeneratingCert(false);
    }
  };

  const calculateElectricity = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(c1) * parseFloat(c2) * 0.0008541;
    setElectricityResult(val);

    try {
      setIsSubmitting(true);
      let documentUrl = '';
      let docName = '';

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await axios.post(`${API}/api/upload`, formData);
        documentUrl = uploadRes.data.url;
        docName = uploadRes.data.name;
      }

      await axios.post(`${API}/api/data/electricity`, {
        consumption: parseFloat(c1),
        nonConsumption: parseFloat(c2),
        co2Saved: val,
        documentUrl,
        docName,
        factoryName: factoryName.trim(),
        useType
      });
      alert('Saved! Your entry will appear on the dashboard.');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data. Make sure backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const dist = parseFloat(distance);
    let val = 0;
    if (vType === '2 Wheeler') {
      val = (dist / 35) * 2.31;
    } else if (vType === '4 Wheeler' && fuel === 'Petrol') {
      val = (dist / 13) * 2.31;
    } else if (vType === '4 Wheeler' && fuel === 'Diesel') {
      val = (dist / 15) * 2.31;
    } else if (vType === 'Cycle' || fuel === 'Electric') {
      val = dist * 0.15;
    }
    setVehicleResult(val);

    try {
      setIsVehicleSubmitting(true);
      await axios.post(`${API}/api/data/vehicle`, {
        category: vType,
        fuelType: fuel,
        distance: dist,
        co2Saved: val,
        factoryName: factoryName.trim(),
        useType
      });
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
    } finally {
      setIsVehicleSubmitting(false);
    }
  };

  return (
    <>
    {!showThankYou && (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Sticky FAQ — pinned to the right edge of the viewport, stays in place on scroll */}
      <motion.aside
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
        style={{ left: 'auto', transform: 'none' }}
        className="hidden xl:block fixed right-6 top-[120px] w-[170px] 2xl:w-[210px] z-50 pointer-events-auto"
      >
        <div className="relative group">
          {/* card */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-emerald-100/80 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.35)] overflow-hidden">
            {/* decorative blobs */}
            <div className="absolute -top-14 -right-10 w-36 h-36 bg-gradient-to-br from-emerald-300/50 to-teal-300/50 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-10 w-28 h-28 bg-gradient-to-tr from-cyan-300/40 to-emerald-300/40 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <HelpCircle size={18} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-slate-400">FAQ</span>
                  <span className="text-[11px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-1">
                    <Sparkles size={10} className="text-emerald-500" /> Did You Know?
                  </span>
                </div>
              </div>

              <h3 className="text-[15px] font-extrabold text-slate-900 mb-2 leading-snug">
                What is <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Zero Hour</span>?
              </h3>

              <p className="text-[12px] text-slate-600 leading-relaxed">
                Zero Hour is a government-led initiative focused on reducing CO<sub>2</sub> emissions and saving energy. During this period, people are encouraged to switch off heavy electricity-consuming appliances like ACs, TVs, and other devices. The goal is to lower overall power consumption by promoting responsible and sustainable energy usage.
              </p>

              <div className="mt-4 pt-3 border-t border-emerald-100/80 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-extrabold tracking-[0.18em] uppercase text-emerald-600">Govt. Awareness Initiative</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-bold rounded-full shadow-md hover:shadow-lg hover:text-green-600 hover:-translate-y-0.5 transition-all mb-6 sm:mb-8 text-sm sm:text-base border border-slate-200">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        {/* Identity / Use Type slide-down bar */}
        <div className="glass-card mb-5 sm:mb-6 overflow-hidden">
          <button
            type="button"
            onClick={() => setIdentityOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left"
            aria-expanded={identityOpen}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${useType === 'Personal' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {useType === 'Personal' ? <User size={18} /> : <FactoryIcon size={18} />}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Calculating For</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 truncate">{identityLabel}</div>
              </div>
            </div>
            <ChevronDown
              size={20}
              className={`text-slate-400 shrink-0 ml-2 transition-transform ${identityOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {identityOpen && (
              <motion.div
                key="identity-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-slate-200"
              >
                <div className="p-4 sm:p-6 space-y-4 bg-white/60">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Use Type</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setUseType('Personal')}
                        className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${useType === 'Personal' ? 'bg-white text-blue-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <User size={16} /> Personal
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseType('Factory')}
                        className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${useType === 'Factory' ? 'bg-white text-green-600 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <FactoryIcon size={16} /> Factory
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      {useType === 'Personal' ? 'Your Name (optional)' : 'Factory Name'}
                    </label>
                    <input
                      type="text"
                      value={factoryName}
                      onChange={e => setFactoryName(e.target.value)}
                      placeholder={useType === 'Personal' ? 'e.g. Manav Bhati' : 'e.g. Rajasthan Steels Ltd.'}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white text-sm sm:text-base"
                    />
                    <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500">
                      {useType === 'Personal'
                        ? 'Logged under your personal account — visible in your dashboard entries.'
                        : 'Entries are grouped by factory name on the dashboard. Leave blank to use the default factory.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-slate-200 bg-white/50">
            <button
              onClick={() => setActiveTab('electricity')}
              className={`flex-1 py-3 sm:py-4 px-2 flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base transition-all ${activeTab === 'electricity' ? 'text-green-600 border-b-2 border-green-500 bg-white' : 'text-slate-500 hover:bg-white/80'}`}
            >
              <Zap size={18} className="shrink-0" />
              <span className="hidden xs:inline sm:inline">Electricity</span>
              <span className="hidden sm:inline"> Savings</span>
            </button>
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`flex-1 py-3 sm:py-4 px-2 flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base transition-all ${activeTab === 'vehicle' ? 'text-green-600 border-b-2 border-green-500 bg-white' : 'text-slate-500 hover:bg-white/80'}`}
            >
              <Car size={18} className="shrink-0" />
              <span>Vehicle</span>
              <span className="hidden sm:inline"> Savings</span>
            </button>
          </div>

          <div className="p-5 sm:p-8 md:p-12">
            <AnimatePresence mode="wait">
              {activeTab === 'electricity' && (
                <motion.div
                  key="electricity"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PowerTowerHeader />
                  <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">Electricity CO2 Contribution</h2>
                  <form onSubmit={calculateElectricity} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Consumption (kWh)</label>
                        <input type="number" required value={c1} onChange={e => setC1(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white" placeholder="e.g. 5000" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Zero Hours</label>
                        <input type="number" required value={c2} onChange={e => setC2(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white" placeholder="e.g. 3" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Photo of Data/Bill</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full max-w-full px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white text-xs sm:text-sm file:mr-3 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="submit" disabled={isSubmitting} className="flex-1 py-3.5 sm:py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all">
                        {isSubmitting ? 'Uploading & Calculating...' : 'Calculate & Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerateCertificate('electricity')}
                        disabled={isGeneratingCert}
                        className="flex-1 py-3.5 sm:py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Award size={18} />
                        {isGeneratingCert ? 'Generating...' : 'Generate Certificate'}
                      </button>
                    </div>
                  </form>
                  {electricityResult !== null && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 sm:mt-8 p-5 sm:p-6 bg-green-50 rounded-xl border border-green-200 text-center overflow-hidden">
                      <GrowingTreeHeader variant="saved" />
                      <h3 className="text-green-800 font-semibold mb-2 text-sm sm:text-base">Total CO2 Saved</h3>
                      <div className="text-3xl sm:text-5xl font-extrabold text-green-600 break-words">{electricityResult.toFixed(4)} <span className="text-base sm:text-xl">Tons</span></div>
                    </motion.div>
                  )}
                </motion.div>
              )}
              {activeTab === 'vehicle' && (
                <motion.div
                  key="vehicle"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DrivingCarHeader vehicleType={vType === '2 Wheeler' ? 'twoWheeler' : vType === 'Cycle' ? 'cycle' : 'fourWheeler'} />
                  <h2 className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6">Vehicle CO2 Contribution</h2>
                  <form onSubmit={calculateVehicle} className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Category</label>
                        <select value={vType} onChange={e => setVType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white">
                          <option>2 Wheeler</option>
                          <option>4 Wheeler</option>
                          <option>Cycle</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Fuel Type</label>
                        <select value={fuel} onChange={e => setFuel(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white">
                          <option>Petrol</option>
                          <option>Diesel</option>
                          <option>Electric</option>
                          <option>None (Cycle)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Distance (KM)</label>
                        <input type="number" required value={distance} onChange={e => setDistance(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-white" placeholder="e.g. 50" />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="submit" disabled={isVehicleSubmitting} className="flex-1 py-3.5 sm:py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all">
                        {isVehicleSubmitting ? 'Saving...' : 'Calculate & Submit'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerateCertificate('vehicle')}
                        disabled={isGeneratingCert}
                        className="flex-1 py-3.5 sm:py-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all inline-flex items-center justify-center gap-2"
                      >
                        <Award size={18} />
                        {isGeneratingCert ? 'Generating...' : 'Generate Certificate'}
                      </button>
                    </div>
                  </form>
                  {vehicleResult !== null && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 sm:mt-8 p-5 sm:p-6 bg-blue-50 rounded-xl border border-blue-200 text-center overflow-hidden">
                      <GrowingTreeHeader variant="saved" />
                      <h3 className="text-blue-800 font-semibold mb-2 text-sm sm:text-base">Total CO2 Saved</h3>
                      <div className="text-3xl sm:text-5xl font-extrabold text-blue-600 break-words">{vehicleResult.toFixed(4)} <span className="text-base sm:text-xl">Kg</span></div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
    )}
    <CertificateCanvas
      ref={certRef}
      name={certData.name}
      co2={certData.co2}
      unit={certData.unit}
      date={certData.date}
    />
    {showThankYou && <FarewellSection />}
    </>
  );
};

export default Calculator;
