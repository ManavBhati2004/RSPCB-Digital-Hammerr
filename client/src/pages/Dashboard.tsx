import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Wind, Zap, Factory as FactoryIcon, Shield, FileText, CheckCircle, Users, LayoutDashboard, Settings, UploadCloud, Bell, Lock, ArrowLeft, Menu, X, Car, User } from 'lucide-react';
import { RspcbLogo } from '../components/RspcbLogo';

const sourceData = [
  { name: 'Electricity', value: 400 },
  { name: 'Logistics', value: 300 },
  { name: 'Manufacturing', value: 300 },
];
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6'];

axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';
const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

type ElectricityRow = {
  _id?: string;
  docName?: string;
  documentUrl?: string;
  createdAt?: string;
  consumption?: number;
  co2Saved?: number;
  useType?: 'Personal' | 'Factory';
  factoryName?: string;
  factory?: { name?: string };
};

type VehicleRow = {
  _id?: string;
  createdAt?: string;
  category?: string;
  fuelType?: string;
  distance?: number;
  co2Saved?: number;
  useType?: 'Personal' | 'Factory';
  factoryName?: string;
  factory?: { name?: string };
};

const Dashboard = () => {
  const [role, setRole] = useState<'factory' | 'admin'>('admin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'settings' | 'manage'>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [stats, setStats] = useState<{
    trendData: { name: string; co2: number; energy: number }[];
    electricity: ElectricityRow[];
    vehicles: VehicleRow[];
    totalCO2Saved: number;
    totalEnergyOffset: number;
    totalVehicleCO2: number;
    factoryCount: number;
  }>({
    trendData: [
      { name: 'Jan', co2: 40, energy: 24 },
      { name: 'Feb', co2: 30, energy: 13 },
      { name: 'Mar', co2: 20, energy: 98 }
    ],
    electricity: [],
    vehicles: [],
    totalCO2Saved: 1200000,
    totalEnergyOffset: 450000,
    totalVehicleCO2: 0,
    factoryCount: 8420
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/api/data/stats`);
        setStats(prev => ({ ...prev, ...res.data, vehicles: res.data.vehicles || [] }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 2000); // near real-time
    return () => clearInterval(interval);
  }, []);

  const ownerLabel = (row: { factoryName?: string; factory?: { name?: string }; useType?: string }) =>
    row.factoryName?.trim() || row.factory?.name || (row.useType === 'Personal' ? 'Personal User' : 'Rajasthan Steels Ltd.');

  const NavButton = ({ id, icon: Icon, label }: { id: typeof activeTab; icon: any; label: string }) => (
    <button
      onClick={() => { setActiveTab(id); setMobileNavOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === id ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  const Sidebar = (
    <>
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <RspcbLogo className="w-9 h-9 p-0.5 border border-white/10 shadow-md shadow-green-950/40 shrink-0" />
        <div>
          <h1 className="font-bold text-sm tracking-wide">RSPCB PORTAL</h1>
          <p className="text-[10px] text-slate-400 uppercase">{role === 'admin' ? 'Super Admin' : 'Factory Portal'}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavButton id="reports" icon={FileText} label="Reports" />
        {role === 'admin' && <NavButton id="manage" icon={Users} label="Manage Factories" />}
        <NavButton id="settings" icon={Settings} label="Settings" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
          <ArrowLeft size={18} /> Back
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-slate-900 text-white flex-col hidden md:flex"
      >
        {Sidebar}
      </motion.aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white flex flex-col z-50 md:hidden"
            >
              <button
                onClick={() => setMobileNavOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-auto md:h-20 bg-white border-b border-slate-200 px-3 sm:px-6 md:px-8 py-3 md:py-0 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden p-2 -ml-2 text-slate-700"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl md:text-2xl font-extrabold text-slate-800 capitalize leading-tight truncate">
                {activeTab === 'dashboard' && (role === 'factory' ? 'Factory Overview' : 'State Intelligence Dashboard')}
                {activeTab === 'reports' && 'Reports & Submissions'}
                {activeTab === 'settings' && 'Platform Settings'}
                {activeTab === 'manage' && 'Manage Factories'}
              </h2>
              <p className="hidden sm:block text-xs sm:text-sm text-slate-500 font-medium">Real-time emissions tracking & analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="bg-slate-100 p-0.5 sm:p-1 rounded-lg flex items-center border border-slate-200 shadow-inner">
              <button
                onClick={() => { setRole('factory'); setActiveTab('dashboard'); }}
                className={`px-2 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-sm font-bold rounded-md transition-all ${role === 'factory' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Factory
              </button>
              <button
                onClick={() => { setRole('admin'); setActiveTab('dashboard'); }}
                className={`px-2 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-sm font-bold rounded-md transition-all ${role === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <Wind size={20} />
                      </div>
                      <h3 className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider mb-1">{role === 'admin' ? 'Total CO2 Saved' : 'Your CO2 Saved'}</h3>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 break-words">{stats.totalCO2Saved >= 1000000 ? (stats.totalCO2Saved/1000000).toFixed(1) + 'M' : stats.totalCO2Saved.toFixed(2)} <span className="text-sm sm:text-lg text-slate-400">Tons</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <Zap size={20} />
                      </div>
                      <h3 className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider mb-1">Electricity Offset</h3>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 break-words">{stats.totalEnergyOffset >= 1000 ? (stats.totalEnergyOffset/1000).toFixed(1) + 'K' : stats.totalEnergyOffset.toFixed(0)} <span className="text-sm sm:text-lg text-slate-400">kWh</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <FactoryIcon size={20} />
                      </div>
                      <h3 className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider mb-1">{role === 'admin' ? 'Active Factories' : 'Sustainability Rank'}</h3>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">{stats.factoryCount}</div>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        {role === 'admin' ? <Shield size={20} /> : <CheckCircle size={20} />}
                      </div>
                      <h3 className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-wider mb-1">{role === 'admin' ? 'Vehicle CO2 (kg)' : 'Status'}</h3>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 break-words">{role === 'admin' ? (stats.totalVehicleCO2 || 0).toFixed(1) : 'Verified'}</div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">Carbon Reduction Trend</h3>
                    <div className="h-[240px] sm:h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} dx={-6} width={36} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontWeight: 'bold' }} />
                          <Area type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
                          <Area type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-6">Emissions Source</h3>
                    <div className="h-[200px] sm:h-[250px] w-full flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                            {sourceData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} itemStyle={{ fontWeight: 'bold', color: '#1e293b' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                      {sourceData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                            <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900">{(item.value / 10)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Entries — both electricity + vehicle */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2"><Zap size={18} className="text-green-500" /> Recent Electricity Entries</h3>
                      <span className="text-xs font-bold text-slate-400">{stats.electricity.length} total</span>
                    </div>
                    <ul className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                      {[...stats.electricity].slice(-12).reverse().map((row, i) => (
                        <li key={row._id || i} className="p-4 sm:p-5 flex items-start sm:items-center gap-3 hover:bg-slate-50">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${row.useType === 'Personal' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {row.useType === 'Personal' ? <User size={16} /> : <FactoryIcon size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-sm truncate">{ownerLabel(row)}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {row.consumption ?? 0} kWh · {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-extrabold text-green-600">{(row.co2Saved || 0).toFixed(3)}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Tons</div>
                          </div>
                        </li>
                      ))}
                      {stats.electricity.length === 0 && (
                        <li className="p-6 text-center text-sm text-slate-500">No entries yet. Submit one from the contribution page.</li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2"><Car size={18} className="text-blue-500" /> Recent Vehicle Entries</h3>
                      <span className="text-xs font-bold text-slate-400">{stats.vehicles.length} total</span>
                    </div>
                    <ul className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                      {[...stats.vehicles].slice(-12).reverse().map((row, i) => (
                        <li key={row._id || i} className="p-4 sm:p-5 flex items-start sm:items-center gap-3 hover:bg-slate-50">
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${row.useType === 'Personal' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                            {row.useType === 'Personal' ? <User size={16} /> : <Car size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-sm truncate">{ownerLabel(row)}</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate">
                              {row.category} · {row.fuelType} · {row.distance ?? 0} km
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-sm font-extrabold text-blue-600">{(row.co2Saved || 0).toFixed(2)}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Kg</div>
                          </div>
                        </li>
                      ))}
                      {stats.vehicles.length === 0 && (
                        <li className="p-6 text-center text-sm text-slate-500">No entries yet. Submit one from the contribution page.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {role === 'factory' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-6 sm:mb-8 text-center border-dashed border-2 hover:border-green-500 transition-colors cursor-pointer group">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 text-slate-400 group-hover:text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                      <UploadCloud size={28} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Upload Sustainability Report</h3>
                    <p className="text-sm sm:text-base text-slate-500 mb-5 sm:mb-6">Drag and drop your PDF or Excel files here, or click to browse.</p>
                    <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all">
                      Select Files
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50/50">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">Document Archive</h3>
                    <div className="flex flex-wrap gap-2">
                      <select className="px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium bg-white outline-none focus:border-green-500 flex-1 sm:flex-none">
                        <option>All Types</option>
                        <option>Electricity Logs</option>
                        <option>Vehicle Reports</option>
                      </select>
                      <select className="px-3 sm:px-4 py-2 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium bg-white outline-none focus:border-green-500 flex-1 sm:flex-none">
                        <option>Last 30 Days</option>
                        <option>Last 6 Months</option>
                        <option>2025</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="bg-white border-b border-slate-100">
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Document</th>
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                          {role === 'admin' && <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Submitter</th>}
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {stats.electricity.map((row, i) => (
                          <tr key={row._id || i} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-4 sm:px-6 font-semibold text-slate-800">
                              <div className="flex items-center gap-3">
                                <FileText size={16} className="text-blue-500 shrink-0" />
                                <span className="truncate">{row.docName || `Submission #${i+1}`}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-500 font-medium">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}</td>
                            {role === 'admin' && <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-600 font-semibold">{ownerLabel(row)}</td>}
                            <td className="py-4 px-4 sm:px-6">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                <CheckCircle size={12} /> Approved
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right">
                              {row.documentUrl ? (
                                <a href={`${API}${row.documentUrl}`} download target="_blank" rel="noreferrer" className="text-blue-600 font-bold text-xs sm:text-sm hover:underline">Download</a>
                              ) : (
                                <span className="text-slate-400 text-xs sm:text-sm">No File</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8 mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><Settings size={20} /></div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">General Profile</h3>
                  </div>
                  <form className="space-y-5 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">{role === 'admin' ? 'Admin Name' : 'Factory Name'}</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-slate-50" defaultValue={role === 'admin' ? 'System Administrator' : 'Rajasthan Steels Ltd.'} />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-green-500 focus:ring-2 outline-none bg-slate-50" defaultValue={role === 'admin' ? 'admin@rspcb.gov.in' : 'contact@rajasthansteels.com'} />
                      </div>
                    </div>
                    {role === 'factory' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Registration ID</label>
                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" defaultValue="RSPCB-REG-2026-981" disabled />
                      </div>
                    )}
                    <button type="button" className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all">Save Changes</button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8 mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><Bell size={20} /></div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3 p-4 border border-slate-100 rounded-xl">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">Email Alerts</h4>
                        <p className="text-xs sm:text-sm text-slate-500">Receive emails for document approvals and policy updates.</p>
                      </div>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner shrink-0">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 p-4 border border-slate-100 rounded-xl">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base">SMS OTP Validation</h4>
                        <p className="text-xs sm:text-sm text-slate-500">Require mobile OTP for sensitive actions (Twilio Integration).</p>
                      </div>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer shadow-inner shrink-0">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-8">
                  <div className="flex items-center gap-3 mb-5 sm:mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><Lock size={20} /></div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-600">Security</h3>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-all">
                    Reset Password
                  </button>
                </div>

              </motion.div>
            )}

            {/* TAB: MANAGE (ADMIN ONLY) */}
            {activeTab === 'manage' && role === 'admin' && (
              <motion.div key="manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-slate-50/50">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">Factory Directory</h3>
                    <input type="text" placeholder="Search by Registration ID..." className="px-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 outline-none focus:border-green-500" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                      <thead>
                        <tr className="bg-white border-b border-slate-100">
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Factory Name</th>
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Reg ID</th>
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                          <th className="py-4 px-4 sm:px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { name: 'Rajasthan Steels Ltd.', id: 'RSPCB-981', loc: 'Jaipur', score: 'Top 5%' },
                          { name: 'Marwar Textiles', id: 'RSPCB-102', loc: 'Jodhpur', score: 'Top 15%' },
                          { name: 'Mewar Synthetics', id: 'RSPCB-445', loc: 'Udaipur', score: 'Top 50%' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-4 sm:px-6 font-bold text-slate-800">{row.name}</td>
                            <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-500 font-mono">{row.id}</td>
                            <td className="py-4 px-4 sm:px-6 text-xs sm:text-sm text-slate-600 font-semibold">{row.loc}</td>
                            <td className="py-4 px-4 sm:px-6">
                              <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">{row.score}</span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-right">
                              <button className="text-blue-600 font-bold text-xs sm:text-sm hover:underline">View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
