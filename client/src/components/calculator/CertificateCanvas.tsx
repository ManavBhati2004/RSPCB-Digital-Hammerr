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

// ---------- Scenery SVGs ----------

const Leaf = ({
  cx,
  cy,
  rx = 12,
  ry = 5,
  rotate = 0,
  color = '#4A7C4A',
  opacity = 0.85,
}: {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  rotate?: number;
  color?: string;
  opacity?: number;
}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
    <path
      d={`M-${rx} 0 q ${rx} -${ry * 1.6} ${rx * 2} 0 q -${rx} ${ry * 1.6} -${rx * 2} 0 z`}
      fill={color}
      opacity={opacity}
    />
    <path
      d={`M-${rx} 0 L ${rx} 0`}
      stroke="#1F4D2C"
      strokeWidth="0.5"
      opacity={opacity * 0.6}
    />
  </g>
);

const LeafyBranch = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="240"
    height="150"
    viewBox="0 0 240 150"
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
  >
    {/* main stem - curves from upper-left corner down */}
    <path
      d="M 5 5 C 50 25, 110 55, 160 90 S 220 135, 235 145"
      fill="none"
      stroke="#3D5E2C"
      strokeWidth="1.6"
      opacity="0.85"
    />
    {/* secondary stem */}
    <path
      d="M 50 25 q 20 25 40 30"
      fill="none"
      stroke="#3D5E2C"
      strokeWidth="1.2"
      opacity="0.7"
    />

    {/* leaves */}
    <Leaf cx={20} cy={10} rx={18} ry={8} rotate={20} color="#A8C68A" />
    <Leaf cx={40} cy={28} rx={20} ry={9} rotate={-15} color="#4A7C4A" />
    <Leaf cx={55} cy={50} rx={16} ry={7} rotate={45} color="#2D5A2D" />
    <Leaf cx={80} cy={38} rx={22} ry={9} rotate={10} color="#5C8B4C" />
    <Leaf cx={95} cy={62} rx={17} ry={8} rotate={-30} color="#A8C68A" />
    <Leaf cx={120} cy={55} rx={20} ry={9} rotate={20} color="#4A7C4A" />
    <Leaf cx={130} cy={82} rx={16} ry={7} rotate={60} color="#2D5A2D" />
    <Leaf cx={150} cy={75} rx={20} ry={9} rotate={-10} color="#5C8B4C" />
    <Leaf cx={170} cy={100} rx={17} ry={8} rotate={30} color="#A8C68A" />
    <Leaf cx={185} cy={92} rx={20} ry={9} rotate={-25} color="#4A7C4A" />
    <Leaf cx={200} cy={120} rx={16} ry={7} rotate={70} color="#2D5A2D" />
    <Leaf cx={215} cy={115} rx={20} ry={9} rotate={5} color="#5C8B4C" />
  </svg>
);

const Birds = () => (
  <svg width="110" height="36" viewBox="0 0 110 36">
    <g fill="none" stroke="#1F4D2C" strokeWidth="1.6" strokeLinecap="round">
      <path d="M5 18 q 6 -6 12 0 q 6 -6 12 0" opacity="0.85" />
      <path d="M40 8 q 5 -5 10 0 q 5 -5 10 0" opacity="0.9" />
      <path d="M65 22 q 5 -5 10 0 q 5 -5 10 0" opacity="0.8" />
      <path d="M90 6 q 4 -4 8 0 q 4 -4 8 0" opacity="0.75" />
    </g>
  </svg>
);

const BottomLeftScene = () => (
  <svg width="380" height="160" viewBox="0 0 380 160">
    {/* distant hill */}
    <path
      d="M 0 90 Q 70 60 150 75 Q 240 92 380 80 L 380 160 L 0 160 Z"
      fill="#B5D098"
      opacity="0.6"
    />
    {/* mid hill */}
    <path
      d="M 0 115 Q 90 90 180 105 Q 280 122 380 110 L 380 160 L 0 160 Z"
      fill="#7BA85A"
      opacity="0.75"
    />
    {/* near hill / grass */}
    <path
      d="M 0 135 Q 100 120 200 130 Q 300 140 380 132 L 380 160 L 0 160 Z"
      fill="#4A7C4A"
      opacity="0.85"
    />

    {/* wind turbine 1 */}
    <g transform="translate(60 70)">
      <rect x="-1.2" y="0" width="2.4" height="65" fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.4" />
      <circle cx="0" cy="0" r="2.4" fill="#5C6B4C" />
      <g fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.4">
        <path d="M 0 -1.6 L 22 -5 L 24 0 L 0 1.6 Z" transform="rotate(20)" />
        <path d="M 0 -1.6 L 22 -5 L 24 0 L 0 1.6 Z" transform="rotate(140)" />
        <path d="M 0 -1.6 L 22 -5 L 24 0 L 0 1.6 Z" transform="rotate(260)" />
      </g>
    </g>

    {/* wind turbine 2 */}
    <g transform="translate(115 88)">
      <rect x="-1" y="0" width="2" height="48" fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.4" />
      <circle cx="0" cy="0" r="1.8" fill="#5C6B4C" />
      <g fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.4">
        <path d="M 0 -1.2 L 17 -3.5 L 18 0 L 0 1.2 Z" transform="rotate(60)" />
        <path d="M 0 -1.2 L 17 -3.5 L 18 0 L 0 1.2 Z" transform="rotate(180)" />
        <path d="M 0 -1.2 L 17 -3.5 L 18 0 L 0 1.2 Z" transform="rotate(300)" />
      </g>
    </g>

    {/* tree 1 */}
    <g transform="translate(195 140)">
      <rect x="-2.5" y="-22" width="5" height="24" fill="#6B4423" />
      <circle cx="0" cy="-40" r="20" fill="#3D7A3D" opacity="0.85" />
      <circle cx="-13" cy="-32" r="14" fill="#5C8B4C" opacity="0.85" />
      <circle cx="13" cy="-32" r="15" fill="#4A7C4A" opacity="0.85" />
      <circle cx="0" cy="-52" r="15" fill="#5C8B4C" opacity="0.85" />
    </g>

    {/* tree 2 */}
    <g transform="translate(255 142)">
      <rect x="-2.5" y="-30" width="5" height="32" fill="#6B4423" />
      <circle cx="0" cy="-50" r="16" fill="#3D7A3D" opacity="0.85" />
      <circle cx="-10" cy="-42" r="11" fill="#5C8B4C" opacity="0.85" />
      <circle cx="10" cy="-42" r="13" fill="#4A7C4A" opacity="0.85" />
      <circle cx="0" cy="-60" r="11" fill="#5C8B4C" opacity="0.85" />
    </g>

    {/* tree 3 small */}
    <g transform="translate(310 144)">
      <rect x="-2" y="-16" width="4" height="17" fill="#6B4423" />
      <circle cx="0" cy="-28" r="12" fill="#3D7A3D" opacity="0.85" />
      <circle cx="-8" cy="-22" r="8" fill="#5C8B4C" opacity="0.85" />
      <circle cx="8" cy="-22" r="9" fill="#4A7C4A" opacity="0.85" />
    </g>
  </svg>
);

const BottomRightScene = () => (
  <svg width="380" height="160" viewBox="0 0 380 160">
    {/* soft haze */}
    <ellipse cx="240" cy="50" rx="140" ry="22" fill="#D9E5C2" opacity="0.4" />

    {/* tall building back */}
    <g>
      <rect x="240" y="20" width="34" height="135" fill="#5C8B6C" opacity="0.78" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`b1a-${i}`} x="246" y={28 + i * 14} width="5" height="5" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`b1b-${i}`} x="257" y={28 + i * 14} width="5" height="5" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`b1c-${i}`} x="266" y={28 + i * 14} width="5" height="5" />
        ))}
      </g>
    </g>

    {/* building 2 medium */}
    <g>
      <rect x="200" y="60" width="40" height="95" fill="#4A7C5C" opacity="0.85" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <rect
              key={`b2-${row}-${col}`}
              x={207 + col * 11}
              y={70 + row * 14}
              width="5"
              height="5"
            />
          ))
        )}
      </g>
    </g>

    {/* building 3 tallest */}
    <g>
      <rect x="280" y="10" width="28" height="145" fill="#3D6B4A" opacity="0.9" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={`b3a-${i}`} x="286" y={18 + i * 14} width="4" height="5" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={`b3b-${i}`} x="296" y={18 + i * 14} width="4" height="5" />
        ))}
      </g>
    </g>

    {/* building 4 right */}
    <g>
      <rect x="315" y="40" width="36" height="115" fill="#5C8B6C" opacity="0.72" />
      <g fill="#FBF7EE" opacity="0.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={`b4a-${i}`} x="322" y={50 + i * 14} width="5" height="5" />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={`b4b-${i}`} x="334" y={50 + i * 14} width="5" height="5" />
        ))}
      </g>
    </g>

    {/* building 5 left small */}
    <g>
      <rect x="165" y="95" width="34" height="60" fill="#6B9A7C" opacity="0.8" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 3 }).map((_, row) =>
          Array.from({ length: 2 }).map((_, col) => (
            <rect
              key={`b5-${row}-${col}`}
              x={171 + col * 12}
              y={104 + row * 12}
              width="5"
              height="5"
            />
          ))
        )}
      </g>
    </g>

    {/* solar panel 1 */}
    <g transform="translate(40 130)">
      <path d="M 0 0 L 48 -22 L 78 -18 L 30 5 Z" fill="#2C3E50" stroke="#1A2530" strokeWidth="0.8" />
      <g stroke="#3F5A6F" strokeWidth="0.5">
        <path d="M 10 -5 L 56 -20" />
        <path d="M 20 -10 L 66 -19" />
        <path d="M 30 -15 L 74 -18" />
        <path d="M 16 0 L 46 -20" />
        <path d="M 32 0 L 62 -20" />
      </g>
      <rect x="30" y="2" width="2.5" height="14" fill="#2C2C2C" />
      <rect x="64" y="-2" width="2.5" height="14" fill="#2C2C2C" />
    </g>

    {/* solar panel 2 smaller */}
    <g transform="translate(100 138)">
      <path d="M 0 0 L 36 -18 L 56 -14 L 20 4 Z" fill="#34495E" stroke="#1A2530" strokeWidth="0.6" />
      <g stroke="#3F5A6F" strokeWidth="0.4">
        <path d="M 8 -4 L 42 -16" />
        <path d="M 14 -8 L 48 -15" />
        <path d="M 11 0 L 32 -16" />
        <path d="M 24 0 L 45 -16" />
      </g>
      <rect x="20" y="2" width="2" height="10" fill="#2C2C2C" />
      <rect x="45" y="-2" width="2" height="10" fill="#2C2C2C" />
    </g>

    {/* greenery */}
    <g fill="#3D6B4A" opacity="0.85">
      <circle cx="10" cy="150" r="10" />
      <circle cx="24" cy="146" r="13" />
      <circle cx="40" cy="150" r="10" />
      <circle cx="155" cy="148" r="11" />
      <circle cx="174" cy="150" r="9" />
      <circle cx="218" cy="148" r="11" />
      <circle cx="370" cy="148" r="10" />
    </g>
    {/* ground line */}
    <rect x="0" y="152" width="380" height="8" fill="#4A7C4A" opacity="0.7" />
  </svg>
);

// ---------- Decorative bits ----------

const LeafDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, width: '60%', margin: '0 auto' }}>
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
  <svg width="56" height="22" viewBox="0 0 56 22" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
    <g fill={FOREST}>
      <path d="M8 11 q 10 -8 22 -2 q -10 6 -22 2 z" />
      <path d="M32 11 q 8 -2 16 0 q -6 4 -16 0 z" opacity="0.7" />
    </g>
  </svg>
);

const Co2Badge = () => (
  <div
    style={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      border: `2px solid ${FOREST}`,
      background: `radial-gradient(circle at 30% 30%, #EAF2DB, #C8D9B0)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: 15,
      color: FOREST,
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: 'absolute', top: 0, left: 0 }}>
      <path d="M9 35 q 9 -16 23 -16 q 3 10 -5 20 q -11 5 -18 -4 z" fill={FOREST} opacity="0.2" />
    </svg>
    <span style={{ position: 'relative', zIndex: 1 }}>
      CO<sub style={{ fontSize: 9 }}>2</sub>
    </span>
  </div>
);

const CalendarBadge = () => (
  <div
    style={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      border: `2px solid ${FOREST}`,
      background: `radial-gradient(circle at 30% 30%, #EAF2DB, #C8D9B0)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <svg width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="6" width="24" height="22" rx="2" fill="none" stroke={FOREST} strokeWidth="2" />
      <line x1="4" y1="12" x2="28" y2="12" stroke={FOREST} strokeWidth="2" />
      <line x1="10" y1="3" x2="10" y2="9" stroke={FOREST} strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="3" x2="22" y2="9" stroke={FOREST} strokeWidth="2" strokeLinecap="round" />
      <rect x="9" y="16" width="3" height="3" fill={FOREST} />
      <rect x="14" y="16" width="3" height="3" fill={FOREST} />
      <rect x="19" y="16" width="3" height="3" fill={FOREST} />
      <rect x="9" y="21" width="3" height="3" fill={FOREST} />
      <rect x="14" y="21" width="3" height="3" fill={FOREST} />
    </svg>
  </div>
);

// ---------- Main certificate ----------

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

      {/* Paper texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 20% 10%, rgba(201,162,39,0.06), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(31,77,44,0.05), transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Scenery — corner-only positioning */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: 34, left: 34 }}>
          <LeafyBranch />
        </div>
        <div style={{ position: 'absolute', top: 34, right: 34 }}>
          <LeafyBranch flip />
        </div>
        <div style={{ position: 'absolute', top: 70, right: 70 }}>
          <Birds />
        </div>
        <div style={{ position: 'absolute', bottom: 34, left: 34 }}>
          <BottomLeftScene />
        </div>
        <div style={{ position: 'absolute', bottom: 34, right: 34 }}>
          <BottomRightScene />
        </div>
      </div>

      {/* Outer gold border */}
      <div
        style={{
          position: 'absolute',
          inset: 24,
          border: `3px solid ${GOLD}`,
          borderRadius: 4,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 34,
          border: `1px solid ${FOREST}`,
          borderRadius: 2,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Content — single flex column, padding reserves space for scenery */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          padding: '56px 80px 160px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <SideLeaves />
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 900,
              fontSize: 32,
              letterSpacing: 5,
              color: FOREST,
              margin: 0,
              whiteSpace: 'nowrap',
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
            fontSize: 17,
            color: OLIVE,
            margin: '8px 0 12px',
            fontWeight: 500,
          }}
        >
          Organised by Rajasthan State Pollution Control Board (RSPCB)
        </p>

        <LeafDivider />

        {/* Main title — single line */}
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 900,
            fontSize: 44,
            letterSpacing: 3,
            color: FOREST,
            margin: '18px 0 4px',
            whiteSpace: 'nowrap',
          }}
        >
          CERTIFICATE OF PARTICIPATION
        </h2>
        <div style={{ width: '45%', height: 1, background: GOLD, margin: '0 auto 14px' }} />

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 18,
            color: OLIVE,
            margin: '0 0 8px',
          }}
        >
          This is to certify that
        </p>

        {/* Recipient name */}
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: 52,
            color: FOREST,
            margin: '2px 0 6px',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}
        >
          {name || 'Participant'}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '0 0 12px' }}>
          <div style={{ width: 80, height: 1, background: FOREST, opacity: 0.5 }} />
          <svg width="20" height="12" viewBox="0 0 20 12">
            <path d="M10 2 q -5 2 -7 5 q 4 0 7 -2 z" fill={FOREST} />
            <path d="M10 2 q 5 2 7 5 q -4 0 -7 -2 z" fill={FOREST} />
          </svg>
          <div style={{ width: 80, height: 1, background: FOREST, opacity: 0.5 }} />
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 17,
            color: OLIVE,
            margin: '0 auto',
            maxWidth: 600,
            lineHeight: 1.45,
          }}
        >
          has self certified that he/she has contributed towards environment awareness,
          sustainability, and carbon emission reduction initiative.
        </p>

        <div style={{ margin: '12px 0 8px' }}>
          <LeafDivider />
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 15,
            color: OLIVE,
            margin: '0 auto',
            maxWidth: 560,
            lineHeight: 1.4,
          }}
        >
          Your contribution towards building a greener and cleaner Rajasthan is sincerely appreciated.
        </p>

        {/* Spacer pushes footer block to bottom of content */}
        <div style={{ flex: 1 }} />

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 30px 12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Co2Badge />
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 12,
                  letterSpacing: 2.5,
                  color: OLIVE,
                  fontWeight: 700,
                }}
              >
                CO₂ SAVED
              </div>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 20,
                  color: FOREST,
                  fontWeight: 700,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                {co2} <span style={{ fontSize: 14, fontWeight: 500 }}>{unit}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 12,
                  letterSpacing: 2.5,
                  color: OLIVE,
                  fontWeight: 700,
                }}
              >
                DATE
              </div>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 20,
                  color: FOREST,
                  fontWeight: 700,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                }}
              >
                {date}
              </div>
            </div>
            <CalendarBadge />
          </div>
        </div>

        {/* Disclaimer pill */}
        <div
          style={{
            padding: '6px 22px',
            border: `1px solid ${FOREST}`,
            borderRadius: 999,
            display: 'inline-block',
            alignSelf: 'center',
            background: 'rgba(255,255,255,0.85)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 12,
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
