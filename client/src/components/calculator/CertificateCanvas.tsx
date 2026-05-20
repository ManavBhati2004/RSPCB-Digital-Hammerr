import { forwardRef } from 'react';

type Props = {
  name: string;
  co2: string;
  unit: string;
  date: string;
};

const GOLD = '#C9A227';
const FOREST = '#1F4D2C';
const OLIVE = '#4F6B3A';
const CREAM = '#FBF7EE';

const CornerOrnament = ({ rotate }: { rotate: number }) => (
  <svg
    width="110"
    height="110"
    viewBox="0 0 110 110"
    style={{ position: 'absolute', transform: `rotate(${rotate}deg)`, transformOrigin: 'center' }}
  >
    <g fill="none" stroke={GOLD} strokeWidth="1.6">
      <path d="M10 10 C 35 12, 55 30, 60 55" />
      <path d="M10 10 C 12 35, 30 55, 55 60" />
    </g>
    <g fill={FOREST}>
      <path d="M20 18 q 8 -6 16 0 q -8 6 -16 0 z" />
      <path d="M18 20 q -6 8 0 16 q 6 -8 0 -16 z" />
      <ellipse cx="46" cy="46" rx="4" ry="2.2" transform="rotate(-30 46 46)" />
      <ellipse cx="56" cy="38" rx="3.5" ry="2" transform="rotate(20 56 38)" />
      <ellipse cx="38" cy="56" rx="3.5" ry="2" transform="rotate(70 38 56)" />
    </g>
    <circle cx="62" cy="62" r="2" fill={GOLD} />
  </svg>
);

const LeafDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, width: '70%', margin: '0 auto' }}>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD}, ${GOLD})` }} />
    <svg width="44" height="20" viewBox="0 0 44 20">
      <g fill={FOREST}>
        <path d="M22 4 q -7 2 -10 8 q 6 -1 10 -4 z" />
        <path d="M22 4 q 7 2 10 8 q -6 -1 -10 -4 z" />
      </g>
      <circle cx="22" cy="14" r="2" fill={GOLD} />
    </svg>
    <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD}, ${GOLD})` }} />
  </div>
);

const SideLeaves = ({ flip }: { flip?: boolean }) => (
  <svg width="60" height="24" viewBox="0 0 60 24" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
    <g fill={FOREST}>
      <path d="M10 12 q 10 -8 22 -2 q -10 6 -22 2 z" />
      <path d="M34 12 q 8 -2 16 0 q -6 4 -16 0 z" opacity="0.7" />
    </g>
  </svg>
);

const Co2Badge = () => (
  <div
    style={{
      width: 80,
      height: 80,
      borderRadius: '50%',
      border: `2.5px solid ${FOREST}`,
      background: `radial-gradient(circle at 30% 30%, #EAF2DB, #D7E5C0)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: 22,
      color: FOREST,
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: 0, left: 0 }}>
      <path d="M14 50 q 12 -22 32 -22 q 4 14 -8 28 q -14 6 -24 -6 z" fill={FOREST} opacity="0.18" />
    </svg>
    <span style={{ position: 'relative', zIndex: 1 }}>
      CO<sub style={{ fontSize: 14 }}>2</sub>
    </span>
  </div>
);

const CertificateCanvas = forwardRef<HTMLDivElement, Props>(({ name, co2, unit, date }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: -10000,
        top: 0,
        width: 1123,
        height: 794,
        background: CREAM,
        fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
        color: FOREST,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Subtle paper texture using radial gradients */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 20% 10%, rgba(201,162,39,0.06), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(31,77,44,0.05), transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Outer gold border */}
      <div
        style={{
          position: 'absolute',
          inset: 24,
          border: `3px solid ${GOLD}`,
          borderRadius: 4,
        }}
      />
      {/* Inner green border */}
      <div
        style={{
          position: 'absolute',
          inset: 34,
          border: `1px solid ${FOREST}`,
          borderRadius: 2,
        }}
      />

      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: 36, left: 36 }}>
        <CornerOrnament rotate={0} />
      </div>
      <div style={{ position: 'absolute', top: 36, right: 36 }}>
        <CornerOrnament rotate={90} />
      </div>
      <div style={{ position: 'absolute', bottom: 36, right: 36 }}>
        <CornerOrnament rotate={180} />
      </div>
      <div style={{ position: 'absolute', bottom: 36, left: 36 }}>
        <CornerOrnament rotate={270} />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          padding: '70px 100px 60px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
          <SideLeaves />
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 900,
              fontSize: 38,
              letterSpacing: 8,
              color: FOREST,
              margin: 0,
            }}
          >
            ENVIRONMENT DAY CAMPAIGN
          </h1>
          <SideLeaves flip />
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 18,
            color: OLIVE,
            margin: '10px 0 18px',
            fontWeight: 500,
          }}
        >
          Organised by Rajasthan State Pollution Control Board (RSPCB)
        </p>

        <LeafDivider />

        {/* Main title */}
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 900,
            fontSize: 56,
            letterSpacing: 6,
            color: FOREST,
            margin: '24px 0 6px',
          }}
        >
          CERTIFICATE OF PARTICIPATION
        </h2>
        <div style={{ width: '55%', height: 1, background: GOLD, margin: '0 auto 22px' }} />

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 22,
            color: OLIVE,
            margin: '0 0 12px',
          }}
        >
          This is to certify that
        </p>

        {/* Recipient name */}
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: 64,
            color: FOREST,
            margin: '4px 0 8px',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}
        >
          {name || 'Participant'}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '0 0 18px' }}>
          <div style={{ width: 90, height: 1, background: FOREST, opacity: 0.5 }} />
          <svg width="22" height="14" viewBox="0 0 22 14">
            <path d="M11 2 q -6 2 -8 6 q 5 0 8 -3 z" fill={FOREST} />
            <path d="M11 2 q 6 2 8 6 q -5 0 -8 -3 z" fill={FOREST} />
          </svg>
          <div style={{ width: 90, height: 1, background: FOREST, opacity: 0.5 }} />
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 20,
            color: OLIVE,
            margin: '0 auto',
            maxWidth: 760,
            lineHeight: 1.55,
          }}
        >
          has self certified that he/she has contributed towards environment awareness,
          sustainability, and carbon emission reduction initiative.
        </p>

        <div style={{ margin: '18px 0 10px' }}>
          <LeafDivider />
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 17,
            color: OLIVE,
            margin: '0 auto',
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Your contribution towards building a greener and cleaner Rajasthan is sincerely appreciated.
        </p>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            padding: '20px 20px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Co2Badge />
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 14,
                  letterSpacing: 3,
                  color: OLIVE,
                  fontWeight: 700,
                }}
              >
                CO₂ SAVED
              </div>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 24,
                  color: FOREST,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {co2} <span style={{ fontSize: 16, fontWeight: 500 }}>{unit}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 14,
                letterSpacing: 3,
                color: OLIVE,
                fontWeight: 700,
              }}
            >
              DATE
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 22,
                color: FOREST,
                fontWeight: 700,
                marginTop: 2,
              }}
            >
              {date}
            </div>
          </div>
        </div>

        {/* Disclaimer footer box */}
        <div
          style={{
            margin: '18px auto 0',
            padding: '8px 22px',
            border: `1px solid ${FOREST}`,
            borderRadius: 999,
            display: 'inline-block',
            alignSelf: 'center',
            background: 'rgba(255,255,255,0.4)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <span
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 13,
              color: OLIVE,
              fontStyle: 'italic',
            }}
          >
            This certificate is digitally self-certified for participation acknowledgement purposes.
          </span>
        </div>
      </div>
    </div>
  );
});

CertificateCanvas.displayName = 'CertificateCanvas';

export default CertificateCanvas;
