type Props = { vehicleType?: 'twoWheeler' | 'fourWheeler' | 'cycle' };

export default function DrivingCarHeader({ vehicleType = 'fourWheeler' }: Props) {
  const isBike = vehicleType === 'twoWheeler';

  return (
    <div
      aria-hidden="true"
      className="relative h-20 sm:h-24 -mx-5 sm:-mx-8 md:-mx-12 -mt-5 sm:-mt-8 md:-mt-12 mb-5 rounded-t-2xl overflow-hidden bg-gradient-to-b from-sand/80 via-sand/40 to-cream"
    >
      <div className="absolute top-3 right-6 w-7 h-7 rounded-full bg-warning-amber/80 blur-[1px] shadow-[0_0_18px_rgba(217,164,65,0.6)]" />

      <svg className="absolute bottom-7 left-0 w-full h-10 text-sage/70" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,40 Q60,10 120,30 T240,28 T400,32 L400,60 L0,60 Z" />
      </svg>
      <svg className="absolute bottom-7 left-0 w-full h-10 text-success-green/60" viewBox="0 0 400 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,46 Q80,20 160,38 T320,40 T400,42 L400,60 L0,60 Z" />
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-7 bg-primary-dark/85">
        <svg className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1" viewBox="0 0 400 4" preserveAspectRatio="none">
          <line x1="0" y1="2" x2="400" y2="2" stroke="#FFFDF1" strokeWidth="2" strokeLinecap="round" className="road-dash" />
        </svg>
      </div>

      <div className={`car-driver absolute bottom-3 left-0 ${isBike ? 'w-16' : 'w-20'}`}>
        {isBike ? (
          <svg viewBox="0 0 80 40" className="w-full h-auto drop-shadow-md">
            <circle cx="6" cy="24" r="2.5" fill="#5E6B60" opacity="0.55" className="car-exhaust" />
            <circle cx="3" cy="20" r="2" fill="#5E6B60" opacity="0.45" className="car-exhaust" style={{ animationDelay: '0.3s' }} />
            <circle cx="18" cy="30" r="6" fill="#071C14" />
            <circle cx="18" cy="30" r="2.5" fill="#C3CC9B" className="car-wheel" />
            <circle cx="58" cy="30" r="6" fill="#071C14" />
            <circle cx="58" cy="30" r="2.5" fill="#C3CC9B" className="car-wheel" />
            <path d="M22,28 L34,18 L48,18 L54,26 Z" fill="#06402B" stroke="#071C14" strokeWidth="1" />
            <path d="M30,18 L46,18 L46,15 L32,15 Z" fill="#071C14" />
            <line x1="54" y1="26" x2="62" y2="14" stroke="#06402B" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="14" x2="66" y2="14" stroke="#071C14" strokeWidth="2" strokeLinecap="round" />
            <circle cx="65" cy="16" r="2" fill="#FFD66B" />
            <circle cx="40" cy="10" r="3.5" fill="#10251A" />
            <path d="M37,13 L34,22 L46,22 L43,13 Z" fill="#2F7D32" stroke="#071C14" strokeWidth="0.8" />
            <line x1="44" y1="16" x2="58" y2="15" stroke="#2F7D32" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 80 36" className="w-full h-auto drop-shadow-md">
            <circle cx="6" cy="20" r="3" fill="#5E6B60" opacity="0.6" className="car-exhaust" />
            <circle cx="3" cy="16" r="2.5" fill="#5E6B60" opacity="0.5" className="car-exhaust" style={{ animationDelay: '0.3s' }} />
            <path d="M8,24 L14,14 L40,12 L48,18 L72,20 L72,28 L8,28 Z" fill="#06402B" stroke="#071C14" strokeWidth="1" />
            <path d="M17,15 L26,15 L26,21 L17,21 Z" fill="#C3CC9B" opacity="0.85" />
            <path d="M28,15 L40,14 L46,19 L28,21 Z" fill="#C3CC9B" opacity="0.85" />
            <circle cx="70" cy="24" r="2" fill="#FFD66B" />
            <circle cx="22" cy="29" r="4.5" fill="#071C14" />
            <circle cx="22" cy="29" r="2" fill="#C3CC9B" className="car-wheel" />
            <circle cx="58" cy="29" r="4.5" fill="#071C14" />
            <circle cx="58" cy="29" r="2" fill="#C3CC9B" className="car-wheel" />
          </svg>
        )}
      </div>
    </div>
  );
}
