export default function PowerTowerHeader() {
  return (
    <div
      aria-hidden="true"
      className="relative h-24 sm:h-28 -mx-5 sm:-mx-8 md:-mx-12 -mt-5 sm:-mt-8 md:-mt-12 mb-5 rounded-t-2xl overflow-hidden bg-gradient-to-b from-warning-amber/15 via-sand/40 to-cream"
    >
      <div className="absolute top-3 right-8 w-8 h-8 rounded-full bg-warning-amber/70 blur-[1px] shadow-[0_0_22px_rgba(217,164,65,0.7)]" />

      <svg className="absolute bottom-3 left-0 w-full h-10 text-sage/60" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,42 Q100,18 200,36 T400,38 L400,60 L0,60 Z" />
      </svg>

      <svg className="absolute top-6 left-0 w-full h-12" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,18 Q200,30 400,18" stroke="#071C14" strokeWidth="0.9" fill="none" />
        <path d="M0,26 Q200,40 400,26" stroke="#071C14" strokeWidth="0.9" fill="none" />
        <path d="M0,34 Q200,48 400,34" stroke="#071C14" strokeWidth="0.9" fill="none" />
      </svg>

      <svg viewBox="0 0 80 120" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto tower-hum">
        <path d="M10,118 L40,30 L70,118" stroke="#06402B" strokeWidth="2.2" fill="none" />
        <path d="M22,118 L40,40 L58,118" stroke="#06402B" strokeWidth="2" fill="none" />
        <path d="M16,100 L36,80 M44,80 L64,100" stroke="#06402B" strokeWidth="1.5" />
        <path d="M22,80  L36,64 M44,64 L58,80" stroke="#06402B" strokeWidth="1.5" />
        <path d="M26,64  L36,52 M44,52 L54,64" stroke="#06402B" strokeWidth="1.5" />
        <line x1="14" y1="92" x2="66" y2="92" stroke="#06402B" strokeWidth="1.5" />
        <line x1="20" y1="72" x2="60" y2="72" stroke="#06402B" strokeWidth="1.5" />
        <line x1="26" y1="56" x2="54" y2="56" stroke="#06402B" strokeWidth="1.5" />
        <line x1="14" y1="42" x2="66" y2="42" stroke="#06402B" strokeWidth="2.4" />
        <line x1="22" y1="30" x2="58" y2="30" stroke="#06402B" strokeWidth="2.2" />
        <circle cx="16" cy="46" r="1.8" fill="#071C14" />
        <circle cx="40" cy="46" r="1.8" fill="#071C14" />
        <circle cx="64" cy="46" r="1.8" fill="#071C14" />
        <circle cx="24" cy="34" r="1.6" fill="#071C14" />
        <circle cx="56" cy="34" r="1.6" fill="#071C14" />
        <circle cx="16" cy="46" r="2.4" fill="#FFD66B" className="tower-spark-1" />
        <circle cx="64" cy="46" r="2.4" fill="#FFD66B" className="tower-spark-2" />
        <circle cx="40" cy="46" r="2.2" fill="#FFD66B" className="tower-spark-3" />
        <line x1="40" y1="30" x2="40" y2="14" stroke="#06402B" strokeWidth="2" />
        <circle cx="40" cy="12" r="2" fill="#D9A441" className="tower-spark-3" />
        <path d="M28,46 L22,52 L26,52 L20,60 L30,50 L26,50 Z" fill="#FFD66B" stroke="#D9A441" strokeWidth="0.6" className="tower-bolt-1" />
        <path d="M58,46 L52,52 L56,52 L50,60 L60,50 L56,50 Z" fill="#FFD66B" stroke="#D9A441" strokeWidth="0.6" className="tower-bolt-2" />
      </svg>
    </div>
  );
}
