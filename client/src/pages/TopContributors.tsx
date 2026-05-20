import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ChevronLeft, ChevronRight, Search, Trophy } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const PAGE_SIZE = 8;

type Row = {
  rank: number;
  username: string;
  category: 'Combined' | 'Vehicle' | 'Electricity';
  totalCO2: number;
};

const categoryPillClass = (category: Row['category']) => {
  if (category === 'Vehicle') return 'bg-blue-100 text-blue-700';
  if (category === 'Electricity') return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
};

const TopContributors = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchRows = async () => {
      try {
        const res = await axios.get<Row[]>(`${API}/api/data/leaderboard/combined`);
        if (cancelled) return;
        setRows(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch {
        if (cancelled) return;
        setError('Could not load leaderboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRows();
    const id = window.setInterval(fetchRows, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) => row.username.toLowerCase().includes(term));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleRows = useMemo(
    () => filteredRows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [filteredRows, safePage]
  );

  const isFirst = safePage === 0;
  const isLast = safePage >= totalPages - 1;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#dceee2] via-[#c5e0d1] to-[#a9d2bc] text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            to="/"
            state={{ initialPage: 1 }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/60 text-slate-700 hover:bg-white transition-colors text-sm font-semibold shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-slate-700">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-green-700" />
            <h1 className="text-lg sm:text-2xl font-extrabold uppercase tracking-wider">Top Contributors</h1>
          </div>
          <span className="w-[72px]" />
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/60 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider">Leaderboard</h3>
              <p className="text-[10px] sm:text-xs text-slate-600">Ranked by total CO₂ saved</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Search by name"
                  aria-label="Search contributors by name"
                  className="w-36 sm:w-48 pl-8 pr-3 py-1.5 rounded-full bg-white/80 border border-white/60 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white shadow-sm"
                />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-600 font-semibold">
                Page {safePage + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isFirst}
                aria-label="Previous page"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/70 border border-white/60 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={isLast}
                aria-label="Next page"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/70 border border-white/60 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-green-50/90 text-green-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 w-14 sm:w-20">Rank</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3">Username</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3">Category</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right">Total CO₂</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">Loading…</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-red-600">{error}</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">No contributions yet</td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">No contributors match "{search}"</td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr key={`${row.rank}-${row.username}`} className="border-t border-white/60 hover:bg-white/40 transition-colors">
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 text-green-800 font-bold text-xs sm:text-sm">
                        {row.rank}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-slate-800">{row.username}</td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${categoryPillClass(row.category)}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-right font-bold text-green-700">
                      {row.totalCO2.toFixed(3)} <span className="text-[10px] sm:text-xs text-slate-500 font-medium">kg</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopContributors;
