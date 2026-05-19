import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Zap,
  Car,
  Leaf,
  ArrowLeft,
  Medal,
  TrendingUp,
  Factory as FactoryIcon,
  User,
  Sparkles,
  Award,
  BarChart3,
} from 'lucide-react';
import { RspcbLogo } from '../components/RspcbLogo';

axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';
const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

type MetricKey = 'electricity' | 'fuel';
type GroupKey = 'factories' | 'individuals';

type LeaderboardEntry = {
  rank: number;
  name: string;
  co2Saved: number;
  energySaved?: number;
  distance?: number;
  entries: number;
};

type LeaderboardResponse = {
  electricity: { factories: LeaderboardEntry[]; individuals: LeaderboardEntry[] };
  fuel: { factories: LeaderboardEntry[]; individuals: LeaderboardEntry[] };
};

const EMPTY: LeaderboardResponse = {
  electricity: { factories: [], individuals: [] },
  fuel: { factories: [], individuals: [] },
};

const formatNumber = (n: number, digits = 2) => {
  if (!Number.isFinite(n)) return '0';
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
};

const rankAccent = (rank: number) => {
  if (rank === 1)
    return {
      ring: 'ring-2 ring-yellow-300/60',
      badge: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/40',
      glow: 'from-yellow-200/60 via-amber-100/40 to-transparent',
      border: 'border-amber-200/70',
      label: 'Champion',
      labelClass: 'bg-amber-50 text-amber-700 border-amber-200',
    };
  if (rank === 2)
    return {
      ring: 'ring-2 ring-slate-300/60',
      badge: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800 shadow-md shadow-slate-400/40',
      glow: 'from-slate-200/60 via-slate-100/30 to-transparent',
      border: 'border-slate-200/80',
      label: 'Runner-Up',
      labelClass: 'bg-slate-50 text-slate-700 border-slate-200',
    };
  if (rank === 3)
    return {
      ring: 'ring-2 ring-orange-300/60',
      badge: 'bg-gradient-to-br from-orange-300 via-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/40',
      glow: 'from-orange-200/60 via-amber-100/30 to-transparent',
      border: 'border-orange-200/70',
      label: 'Third Place',
      labelClass: 'bg-orange-50 text-orange-700 border-orange-200',
    };
  return {
    ring: '',
    badge: 'bg-slate-100 text-slate-700',
    glow: 'from-transparent to-transparent',
    border: 'border-slate-200',
    label: '',
    labelClass: '',
  };
};

const podiumOrder = [1, 0, 2]; // visual order: 2nd, 1st, 3rd

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardResponse>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<MetricKey>('electricity');
  const [group, setGroup] = useState<GroupKey>('factories');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const fetchData = async () => {
      try {
        const res = await axios.get<LeaderboardResponse>(`${API}/api/data/leaderboard`);
        if (!alive) return;
        setData(res.data || EMPTY);
        setError(null);
      } catch {
        if (!alive) return;
        setError('Could not reach the server. Showing the latest cached rankings.');
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  const list = useMemo(() => data[metric][group] || [], [data, metric, group]);
  const podium = useMemo(() => list.slice(0, 3), [list]);
  const rest = useMemo(() => list.slice(3), [list]);

  const totals = useMemo(() => {
    const totalCo2 = list.reduce((s, e) => s + (e.co2Saved || 0), 0);
    const totalSecondary = list.reduce(
      (s, e) => s + (metric === 'electricity' ? e.energySaved || 0 : e.distance || 0),
      0,
    );
    const totalEntries = list.reduce((s, e) => s + (e.entries || 0), 0);
    return { totalCo2, totalSecondary, totalEntries, participants: list.length };
  }, [list, metric]);

  const metricLabel = metric === 'electricity' ? 'Electricity Saved' : 'Fuel Saved';
  const co2Unit = metric === 'electricity' ? 'Tons CO₂' : 'Kg CO₂';
  const secondaryLabel = metric === 'electricity' ? 'kWh saved' : 'km logged';

  const getSecondary = (e: LeaderboardEntry) =>
    metric === 'electricity' ? e.energySaved ?? 0 : e.distance ?? 0;

  return (
    <div
      className="min-h-screen text-slate-900 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #d1fae5 0%, #ecfdf5 35%, #f0fdf4 70%, #ecfdf5 100%)',
      }}
    >
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at top, rgba(16,185,129,0.25), transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(52,211,153,0.45)' }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 -right-48 w-[36rem] h-[36rem] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(74,222,128,0.40)' }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[28rem] h-[28rem] rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(45,212,191,0.45)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 w-full px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <RspcbLogo className="w-10 h-10 sm:w-11 sm:h-11 p-0.5 border border-green-100 shadow-lg shadow-green-500/20 shrink-0" />
          <div className="min-w-0 text-slate-900">
            <h1 className="font-bold text-base sm:text-lg leading-tight">RSPCB</h1>
            <p className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold opacity-70">
              State Pollution Control Board
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="px-3 sm:px-5 py-2 sm:py-2.5 bg-slate-900 text-white border border-slate-700 rounded-full text-xs sm:text-sm font-bold hover:bg-emerald-600 hover:border-emerald-600 transition-all shadow-xl flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pb-16 sm:pb-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-6 sm:mt-10 mb-8 sm:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-5"
          >
            <Sparkles className="w-3 h-3" />
            Live Rankings · Updates every 5s
          </motion.div>

          <motion.div
            initial={{ scale: 0.4, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 120 }}
            className="relative inline-flex items-center justify-center mb-5"
          >
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-2xl scale-150" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 shadow-xl shadow-emerald-500/40 flex items-center justify-center rotate-3">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white -rotate-3" />
            </div>
          </motion.div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05]">
            Sustainability{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
                Leaderboard
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full origin-left"
              />
            </span>
          </h2>
          <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-2 leading-relaxed">
            Celebrating the factories and individuals saving the most fuel and electricity.
            Rankings refresh automatically from verified RSPCB entries.
          </p>
        </motion.div>

        {/* Filter Card — segmented controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-emerald-900/[0.04] p-3 sm:p-4 mb-8 sm:mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
            <SegmentedControl
              value={metric}
              onChange={(v) => setMetric(v as MetricKey)}
              options={[
                { value: 'electricity', label: 'Electricity', icon: <Zap className="w-4 h-4" /> },
                { value: 'fuel', label: 'Fuel', icon: <Car className="w-4 h-4" /> },
              ]}
              layoutId="metric-pill"
            />
            <div className="hidden sm:block w-px h-8 bg-slate-200" />
            <SegmentedControl
              value={group}
              onChange={(v) => setGroup(v as GroupKey)}
              options={[
                { value: 'factories', label: 'Factories', icon: <FactoryIcon className="w-4 h-4" /> },
                { value: 'individuals', label: 'Individuals', icon: <User className="w-4 h-4" /> },
              ]}
              layoutId="group-pill"
            />
          </div>
        </motion.div>

        {/* Stats summary */}
        {!loading && list.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <StatCard
              icon={<Leaf className="w-4 h-4" />}
              label={`Total ${co2Unit}`}
              value={formatNumber(totals.totalCo2)}
              tone="emerald"
            />
            <StatCard
              icon={metric === 'electricity' ? <Zap className="w-4 h-4" /> : <Car className="w-4 h-4" />}
              label={`Total ${secondaryLabel}`}
              value={formatNumber(totals.totalSecondary, 0)}
              tone={metric === 'electricity' ? 'amber' : 'blue'}
            />
            <StatCard
              icon={<Award className="w-4 h-4" />}
              label="Participants"
              value={String(totals.participants)}
              tone="violet"
            />
            <StatCard
              icon={<BarChart3 className="w-4 h-4" />}
              label="Verified Entries"
              value={String(totals.totalEntries)}
              tone="teal"
            />
          </motion.div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm text-center">
            {error}
          </div>
        )}

        {/* Animated content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${metric}-${group}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {loading ? (
              <SkeletonList />
            ) : list.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {/* Podium */}
                {podium.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 items-end">
                    {podiumOrder.map((idx) => {
                      const entry = podium[idx];
                      if (!entry) return <div key={idx} className="hidden md:block" />;
                      return (
                        <PodiumCard
                          key={`${entry.rank}-${entry.name}`}
                          entry={entry}
                          metric={metric}
                          co2Unit={co2Unit}
                          secondary={getSecondary(entry)}
                          secondaryLabel={secondaryLabel}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Rest of the list */}
                {rest.length > 0 && (
                  <div className="bg-white/60 backdrop-blur-md border border-slate-200/80 rounded-3xl p-3 sm:p-4 shadow-lg shadow-emerald-900/[0.04]">
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/70">
                      <span className="w-10 sm:w-11">Rank</span>
                      <span className="flex-1">Name</span>
                      <span className="hidden sm:inline w-32 text-right">Activity</span>
                      <span className="w-20 sm:w-28 text-right">CO₂ Saved</span>
                    </div>
                    <div className="space-y-1.5 sm:space-y-2 pt-2">
                      {rest.map((entry, i) => (
                        <RankCard
                          key={`${entry.rank}-${entry.name}`}
                          entry={entry}
                          index={i}
                          metric={metric}
                          co2Unit={co2Unit}
                          secondary={getSecondary(entry)}
                          secondaryLabel={secondaryLabel}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 sm:mt-10 text-center text-[11px] sm:text-xs text-slate-500 flex flex-wrap items-center justify-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{metricLabel} rankings update every 5 seconds.</span>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function SegmentedControl({
  value,
  onChange,
  options,
  layoutId,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; icon: ReactNode }[];
  layoutId: string;
}) {
  return (
    <div className="relative inline-flex bg-slate-100/80 rounded-full p-1 border border-slate-200/60 w-full sm:w-auto">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 sm:flex-none z-10 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors duration-200 ${
              active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {active && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/40"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'emerald' | 'amber' | 'blue' | 'violet' | 'teal';
}) {
  const tones: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' },
  };
  const t = tones[tone];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="relative bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 sm:p-4 shadow-sm overflow-hidden group"
    >
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full ${t.bg} opacity-60 blur-xl group-hover:opacity-100 transition-opacity`} />
      <div className="relative flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${t.bg} ${t.text} border ${t.border} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-slate-500 truncate">
            {label}
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PodiumCard({
  entry,
  metric,
  co2Unit,
  secondary,
  secondaryLabel,
}: {
  entry: LeaderboardEntry;
  metric: MetricKey;
  co2Unit: string;
  secondary: number;
  secondaryLabel: string;
}) {
  const accent = rankAccent(entry.rank);
  const isFirst = entry.rank === 1;
  const orderClass = isFirst ? 'md:order-2' : entry.rank === 2 ? 'md:order-1' : 'md:order-3';
  const heightClass = isFirst ? 'md:pt-10 md:pb-9' : 'md:pt-7 md:pb-7';
  const scaleClass = isFirst ? 'md:scale-[1.04]' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: entry.rank * 0.1, type: 'spring', stiffness: 120 }}
      whileHover={{ y: -6 }}
      className={`relative rounded-3xl border ${accent.border} ${accent.ring} bg-white/85 backdrop-blur-xl p-5 sm:p-6 ${heightClass} ${orderClass} ${scaleClass} shadow-xl shadow-emerald-900/[0.06] overflow-hidden`}
    >
      {/* gradient glow inside card */}
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${accent.glow} pointer-events-none`} />

      {isFirst && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ boxShadow: '0 0 60px 6px rgba(234, 179, 8, 0.22)' }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {isFirst && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: [0, -4, 0], opacity: 1 }}
          transition={{
            y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 0.5 },
          }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/50 ring-4 ring-white"
        >
          <Crown className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <div className="relative flex flex-col items-center text-center">
        {accent.label && (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${accent.labelClass} mb-3`}
          >
            #{entry.rank} · {accent.label}
          </span>
        )}

        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-extrabold mb-4 ${accent.badge}`}
        >
          {entry.rank === 1 ? (
            <Crown className="w-7 h-7" />
          ) : (
            <Medal className="w-6 h-6" />
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 min-h-[2.75rem] px-1">
          {entry.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-emerald-600 to-green-700 bg-clip-text text-transparent leading-none">
            {formatNumber(entry.co2Saved)}
          </span>
        </div>
        <div className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold">
          {co2Unit}
        </div>

        <div className="mt-5 w-full pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            {metric === 'electricity' ? (
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Car className="w-3.5 h-3.5 text-blue-500" />
            )}
            <strong className="text-slate-800">{formatNumber(secondary, 0)}</strong>
            <span className="text-slate-500">{secondaryLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <span className="font-bold text-slate-700">{entry.entries}</span>
            {entry.entries === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function RankCard({
  entry,
  index,
  metric,
  co2Unit,
  secondary,
  secondaryLabel,
}: {
  entry: LeaderboardEntry;
  index: number;
  metric: MetricKey;
  co2Unit: string;
  secondary: number;
  secondaryLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ x: 4 }}
      className="group bg-white/70 hover:bg-white border border-slate-200/70 hover:border-emerald-200 rounded-2xl px-3 sm:px-4 py-3 transition-all flex items-center gap-3 sm:gap-4"
    >
      <div className="w-10 sm:w-11 flex items-center justify-center shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-sm font-extrabold bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
          {entry.rank}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">{entry.name}</h4>
        <div className="flex sm:hidden items-center gap-2 mt-0.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            {metric === 'electricity' ? (
              <Zap className="w-3 h-3 text-amber-500" />
            ) : (
              <Car className="w-3 h-3 text-blue-500" />
            )}
            <strong className="text-slate-700">{formatNumber(secondary, 0)}</strong> {secondaryLabel}
          </span>
          <span className="text-slate-400">·</span>
          <span>
            {entry.entries} {entry.entries === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex w-32 items-center justify-end gap-1.5 text-xs text-slate-600">
        {metric === 'electricity' ? (
          <Zap className="w-3.5 h-3.5 text-amber-500" />
        ) : (
          <Car className="w-3.5 h-3.5 text-blue-500" />
        )}
        <strong className="text-slate-800">{formatNumber(secondary, 0)}</strong>
        <span className="text-slate-500">{secondaryLabel.split(' ')[0]}</span>
      </div>

      <div className="text-right w-20 sm:w-28 shrink-0">
        <div className="text-base sm:text-lg font-extrabold bg-gradient-to-br from-emerald-600 to-green-700 bg-clip-text text-transparent leading-tight">
          {formatNumber(entry.co2Saved)}
        </div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400 font-bold">
          {co2Unit}
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10 items-end">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-3xl bg-gradient-to-b from-slate-100 to-slate-50 ${
              i === 1 ? 'h-64' : 'h-56'
            } animate-pulse border border-slate-200/60`}
          />
        ))}
      </div>
      <div className="bg-white/60 border border-slate-200/70 rounded-3xl p-4 space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-100 h-14 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-3xl p-8 sm:p-14 text-center shadow-xl shadow-emerald-900/[0.05]"
    >
      <motion.div
        animate={{ rotate: [0, 8, -8, 0], y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600 mb-5 shadow-inner"
      >
        <Leaf className="w-8 h-8 sm:w-10 sm:h-10" />
      </motion.div>
      <h3 className="text-lg sm:text-2xl font-bold text-slate-900">No entries yet</h3>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
        Be the first to log your fuel or electricity savings and climb the leaderboard.
      </p>
      <Link
        to="/calculator"
        className="inline-flex items-center gap-1.5 mt-6 px-6 py-3 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white text-sm font-bold hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-500/30"
      >
        Launch Contribution
      </Link>
    </motion.div>
  );
}
