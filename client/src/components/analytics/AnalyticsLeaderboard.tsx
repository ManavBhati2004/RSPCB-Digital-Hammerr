import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
const PAGE_SIZE = 5;

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

export const AnalyticsLeaderboard = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchRows = async () => {
      try {
        const res = await axios.get<Row[]>(`${API}/api/data/leaderboard/combined`);
        if (cancelled) return;
        setRows(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (e) {
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

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleRows = useMemo(
    () => rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [rows, safePage]
  );

  const isFirst = safePage === 0;
  const isLast = safePage >= totalPages - 1;
  const showPager = rows.length > PAGE_SIZE;

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/60 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider">Top Contributors</h3>
          <p className="text-[10px] sm:text-xs text-slate-600">Ranked by total CO₂ saved</p>
        </div>
        {showPager && (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] sm:text-xs text-slate-600 font-semibold">
              Page {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={isFirst}
              aria-label="Previous page"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/70 border border-white/60 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={isLast}
              aria-label="Next page"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/70 border border-white/60 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
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
              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-red-600">{error}</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No contributions yet</td>
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
  );
};
