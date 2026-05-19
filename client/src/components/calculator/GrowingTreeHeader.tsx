type Props = { variant?: 'result' | 'saved' };

export default function GrowingTreeHeader({ variant = 'result' }: Props) {
  const isSaved = variant === 'saved';

  return (
    <div
      aria-hidden="true"
      className="relative h-24 sm:h-28 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-5 rounded-t-xl overflow-hidden bg-gradient-to-b from-sage/40 via-sand/30 to-cream"
    >
      <div className="absolute top-3 left-6 w-8 h-8 rounded-full bg-warning-amber/70 blur-[1px] shadow-[0_0_20px_rgba(217,164,65,0.55)]" />

      <svg className="absolute bottom-3 left-0 w-full h-10 text-sage/60" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,40 Q90,16 180,32 T400,30 L400,60 L0,60 Z" />
      </svg>

      <svg className="absolute top-4 left-0 w-full h-10 text-success-green/70" viewBox="0 0 400 40" preserveAspectRatio="none">
        <g className="animate-float-slow">
          <ellipse cx="60" cy="14" rx="3" ry="6" transform="rotate(25 60 14)" fill="currentColor" opacity="0.7" />
          <ellipse cx="320" cy="22" rx="3" ry="6" transform="rotate(-15 320 22)" fill="currentColor" opacity="0.55" />
        </g>
        <g className="animate-float-fast">
          <ellipse cx="200" cy="10" rx="2.5" ry="5" transform="rotate(40 200 10)" fill="currentColor" opacity="0.6" />
          <ellipse cx="140" cy="26" rx="2.5" ry="5" transform="rotate(-30 140 26)" fill="currentColor" opacity="0.5" />
        </g>
      </svg>

      <svg viewBox="0 0 80 120" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto animate-float-slow">
        <path d="M38,118 L38,72 Q40,60 42,72 L42,118 Z" fill="#06402B" />
        <circle cx="40" cy="64" r="22" fill="#2F7D32" />
        <circle cx="28" cy="70" r="14" fill="#06402B" opacity="0.85" />
        <circle cx="52" cy="70" r="14" fill="#06402B" opacity="0.85" />
        <circle cx="40" cy="50" r="16" fill="#A7B77A" />
        <circle cx="32" cy="62" r="2" fill="#D9A441" className="tower-spark-1" />
        <circle cx="48" cy="58" r="2" fill="#D9A441" className="tower-spark-2" />
        <circle cx="40" cy="74" r="2" fill="#D9A441" className="tower-spark-3" />
      </svg>

      {isSaved && (
        <div className="absolute top-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-success-green/90 text-cream text-[10px] font-bold tracking-wide px-2.5 py-1 shadow-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-cream animate-pulse-ring" /> SAVED
        </div>
      )}
    </div>
  );
}
