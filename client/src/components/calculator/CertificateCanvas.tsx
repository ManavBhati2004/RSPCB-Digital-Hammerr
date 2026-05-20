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
  rx = 14,
  ry = 6,
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
      strokeWidth="0.6"
      opacity={opacity * 0.6}
    />
  </g>
);

const LeafyBranch = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="380"
    height="260"
    viewBox="0 0 380 260"
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
  >
    {/* main stem */}
    <path
      d="M 5 5 C 80 30, 160 70, 230 140 S 340 220, 370 250"
      fill="none"
      stroke="#3D5E2C"
      strokeWidth="2"
      opacity="0.85"
    />
    {/* secondary stem */}
    <path
      d="M 80 30 q 30 40 70 50"
      fill="none"
      stroke="#3D5E2C"
      strokeWidth="1.4"
      opacity="0.7"
    />
    <path
      d="M 200 110 q 40 20 60 60"
      fill="none"
      stroke="#3D5E2C"
      strokeWidth="1.4"
      opacity="0.7"
    />

    {/* leaves — layered greens */}
    <Leaf cx={30} cy={15} rx={26} ry={11} rotate={20} color="#A8C68A" opacity={0.85} />
    <Leaf cx={60} cy={40} rx={28} ry={12} rotate={-15} color="#4A7C4A" />
    <Leaf cx={70} cy={70} rx={22} ry={10} rotate={45} color="#2D5A2D" />
    <Leaf cx={110} cy={50} rx={30} ry={13} rotate={10} color="#5C8B4C" />
    <Leaf cx={130} cy={85} rx={24} ry={11} rotate={-30} color="#A8C68A" opacity={0.9} />
    <Leaf cx={160} cy={70} rx={26} ry={12} rotate={20} color="#4A7C4A" />
    <Leaf cx={170} cy={110} rx={22} ry={10} rotate={60} color="#2D5A2D" />
    <Leaf cx={200} cy={95} rx={28} ry={12} rotate={-10} color="#5C8B4C" />
    <Leaf cx={220} cy={130} rx={24} ry={11} rotate={30} color="#A8C68A" opacity={0.85} />
    <Leaf cx={250} cy={120} rx={26} ry={12} rotate={-25} color="#4A7C4A" />
    <Leaf cx={260} cy={160} rx={22} ry={10} rotate={70} color="#2D5A2D" />
    <Leaf cx={280} cy={150} rx={28} ry={12} rotate={5} color="#5C8B4C" />
    <Leaf cx={300} cy={190} rx={24} ry={11} rotate={-35} color="#A8C68A" opacity={0.9} />
    <Leaf cx={320} cy={180} rx={26} ry={12} rotate={25} color="#4A7C4A" />
    <Leaf cx={335} cy={215} rx={22} ry={10} rotate={75} color="#2D5A2D" />
    <Leaf cx={355} cy={210} rx={26} ry={12} rotate={-15} color="#5C8B4C" />
  </svg>
);

const Birds = () => (
  <svg width="140" height="48" viewBox="0 0 140 48">
    <g fill="none" stroke="#1F4D2C" strokeWidth="2" strokeLinecap="round">
      <path d="M5 22 q 8 -8 16 0 q 8 -8 16 0" opacity="0.85" />
      <path d="M50 12 q 6 -6 12 0 q 6 -6 12 0" opacity="0.9" />
      <path d="M85 28 q 7 -7 14 0 q 7 -7 14 0" opacity="0.8" />
      <path d="M115 8 q 5 -5 10 0 q 5 -5 10 0" opacity="0.75" />
    </g>
  </svg>
);

const BottomLeftScene = () => (
  <svg width="460" height="280" viewBox="0 0 460 280">
    {/* sky-level soft haze */}
    <ellipse cx="120" cy="80" rx="80" ry="20" fill="#D9E5C2" opacity="0.4" />

    {/* distant hill */}
    <path
      d="M 0 200 Q 80 140 180 170 Q 280 200 460 180 L 460 280 L 0 280 Z"
      fill="#B5D098"
      opacity="0.55"
    />
    {/* mid hill */}
    <path
      d="M 0 230 Q 100 180 200 210 Q 320 240 460 215 L 460 280 L 0 280 Z"
      fill="#7BA85A"
      opacity="0.7"
    />
    {/* near hill / grass */}
    <path
      d="M 0 250 Q 120 230 240 245 Q 360 260 460 248 L 460 280 L 0 280 Z"
      fill="#4A7C4A"
      opacity="0.8"
    />

    {/* wind turbine 1 */}
    <g transform="translate(80 150)">
      <rect x="-1.5" y="0" width="3" height="90" fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="3" fill="#5C6B4C" />
      {/* 3 blades */}
      <g fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.5">
        <path d="M 0 -2 L 28 -6 L 30 0 L 0 2 Z" transform="rotate(20)" />
        <path d="M 0 -2 L 28 -6 L 30 0 L 0 2 Z" transform="rotate(140)" />
        <path d="M 0 -2 L 28 -6 L 30 0 L 0 2 Z" transform="rotate(260)" />
      </g>
    </g>

    {/* wind turbine 2 (smaller, further back) */}
    <g transform="translate(150 175)">
      <rect x="-1" y="0" width="2" height="65" fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.5" />
      <circle cx="0" cy="0" r="2.2" fill="#5C6B4C" />
      <g fill="#F5F5F0" stroke="#7A8B6B" strokeWidth="0.5">
        <path d="M 0 -1.5 L 20 -4 L 22 0 L 0 1.5 Z" transform="rotate(60)" />
        <path d="M 0 -1.5 L 20 -4 L 22 0 L 0 1.5 Z" transform="rotate(180)" />
        <path d="M 0 -1.5 L 20 -4 L 22 0 L 0 1.5 Z" transform="rotate(300)" />
      </g>
    </g>

    {/* tree 1 — large fluffy canopy */}
    <g transform="translate(250 240)">
      <rect x="-3" y="-30" width="6" height="32" fill="#6B4423" />
      <circle cx="0" cy="-55" r="28" fill="#3D7A3D" opacity="0.85" />
      <circle cx="-18" cy="-45" r="20" fill="#5C8B4C" opacity="0.85" />
      <circle cx="18" cy="-45" r="22" fill="#4A7C4A" opacity="0.85" />
      <circle cx="0" cy="-72" r="22" fill="#5C8B4C" opacity="0.85" />
      <circle cx="-12" cy="-65" r="18" fill="#3D7A3D" opacity="0.8" />
    </g>

    {/* tree 2 — taller slimmer */}
    <g transform="translate(330 245)">
      <rect x="-3" y="-50" width="6" height="52" fill="#6B4423" />
      <circle cx="0" cy="-80" r="22" fill="#3D7A3D" opacity="0.85" />
      <circle cx="-14" cy="-70" r="16" fill="#5C8B4C" opacity="0.85" />
      <circle cx="14" cy="-70" r="18" fill="#4A7C4A" opacity="0.85" />
      <circle cx="0" cy="-95" r="16" fill="#5C8B4C" opacity="0.85" />
    </g>

    {/* tree 3 — small */}
    <g transform="translate(395 248)">
      <rect x="-2" y="-22" width="4" height="24" fill="#6B4423" />
      <circle cx="0" cy="-38" r="16" fill="#3D7A3D" opacity="0.85" />
      <circle cx="-10" cy="-32" r="11" fill="#5C8B4C" opacity="0.85" />
      <circle cx="10" cy="-32" r="12" fill="#4A7C4A" opacity="0.85" />
    </g>

    {/* foreground grass tufts */}
    <g fill="#3D5E2C" opacity="0.7">
      <path d="M 20 270 q 3 -8 6 0 q 3 -8 6 0 z" />
      <path d="M 200 270 q 3 -8 6 0 q 3 -8 6 0 z" />
      <path d="M 440 268 q 3 -8 6 0 q 3 -8 6 0 z" />
    </g>
  </svg>
);

const BottomRightScene = () => (
  <svg width="460" height="280" viewBox="0 0 460 280">
    {/* soft haze behind city */}
    <ellipse cx="280" cy="100" rx="180" ry="30" fill="#D9E5C2" opacity="0.35" />

    {/* distant tall building */}
    <g>
      <rect x="320" y="60" width="40" height="180" fill="#5C8B6C" opacity="0.75" />
      {/* windows */}
      <g fill="#FBF7EE" opacity="0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={`b1-${i}`} x="326" y={70 + i * 16} width="6" height="6" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={`b1b-${i}`} x="340" y={70 + i * 16} width="6" height="6" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={`b1c-${i}`} x="352" y={70 + i * 16} width="6" height="6" />
        ))}
      </g>
    </g>

    {/* building 2 - medium */}
    <g>
      <rect x="265" y="120" width="50" height="120" fill="#4A7C5C" opacity="0.85" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <rect
              key={`b2-${row}-${col}`}
              x={273 + col * 14}
              y={130 + row * 16}
              width="6"
              height="6"
            />
          ))
        )}
      </g>
    </g>

    {/* building 3 - tallest */}
    <g>
      <rect x="370" y="40" width="32" height="200" fill="#3D6B4A" opacity="0.9" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`b3-${i}`} x="376" y={48 + i * 16} width="5" height="6" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`b3b-${i}`} x="388" y={48 + i * 16} width="5" height="6" />
        ))}
      </g>
    </g>

    {/* building 4 - rear right */}
    <g>
      <rect x="410" y="90" width="40" height="150" fill="#5C8B6C" opacity="0.7" />
      <g fill="#FBF7EE" opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`b4-${i}`} x="416" y={100 + i * 16} width="6" height="6" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`b4b-${i}`} x="430" y={100 + i * 16} width="6" height="6" />
        ))}
      </g>
    </g>

    {/* building 5 - left mid */}
    <g>
      <rect x="220" y="150" width="40" height="90" fill="#6B9A7C" opacity="0.8" />
      <g fill="#FBF7EE" opacity="0.55">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 2 }).map((_, col) => (
            <rect
              key={`b5-${row}-${col}`}
              x={228 + col * 14}
              y={160 + row * 14}
              width="6"
              height="6"
            />
          ))
        )}
      </g>
    </g>

    {/* small low building */}
    <rect x="180" y="180" width="36" height="60" fill="#7BA88C" opacity="0.7" />

    {/* solar panel 1 — large angled */}
    <g transform="translate(60 220)">
      <path d="M 0 0 L 60 -28 L 96 -22 L 36 6 Z" fill="#2C3E50" stroke="#1A2530" strokeWidth="1" />
      {/* grid lines */}
      <g stroke="#3F5A6F" strokeWidth="0.6">
        <path d="M 12 -6 L 70 -25" />
        <path d="M 24 -12 L 80 -23" />
        <path d="M 36 -18 L 90 -22" />
        <path d="M 20 0 L 56 -25" />
        <path d="M 40 0 L 76 -25" />
        <path d="M 60 0 L 96 -25" />
      </g>
      {/* stand */}
      <rect x="38" y="2" width="3" height="20" fill="#2C2C2C" />
      <rect x="80" y="-2" width="3" height="20" fill="#2C2C2C" />
    </g>

    {/* solar panel 2 — slightly smaller, behind */}
    <g transform="translate(140 230)">
      <path d="M 0 0 L 44 -22 L 70 -18 L 26 4 Z" fill="#34495E" stroke="#1A2530" strokeWidth="0.8" />
      <g stroke="#3F5A6F" strokeWidth="0.5">
        <path d="M 10 -5 L 52 -20" />
        <path d="M 18 -10 L 60 -19" />
        <path d="M 14 0 L 40 -20" />
        <path d="M 30 0 L 56 -20" />
      </g>
      <rect x="26" y="2" width="2.5" height="14" fill="#2C2C2C" />
      <rect x="56" y="-2" width="2.5" height="14" fill="#2C2C2C" />
    </g>

    {/* greenery silhouette at base */}
    <g fill="#3D6B4A" opacity="0.85">
      <circle cx="20" cy="265" r="14" />
      <circle cx="38" cy="260" r="17" />
      <circle cx="60" cy="266" r="13" />
      <circle cx="200" cy="262" r="15" />
      <circle cx="225" cy="265" r="12" />
      <circle cx="290" cy="252" r="14" />
      <circle cx="380" cy="255" r="13" />
      <circle cx="430" cy="262" r="15" />
    </g>
    {/* ground line */}
    <rect x="0" y="270" width="460" height="10" fill="#4A7C4A" opacity="0.7" />
  </svg>
);

// ---------- Existing decorative bits (kept) ----------

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
      width: 60,
      height: 60,
      borderRadius: '50%',
      border: `2px solid ${FOREST}`,
      background: `radial-gradient(circle at 30% 30%, #EAF2DB, #C8D9B0)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: 16,
      color: FOREST,
      position: 'relative',
      flexShrink: 0,
    }}
  >
    <svg width="60" height="60" viewBox="0 0 60 60" style={{ position: 'absolute', top: 0, left: 0 }}>
      <path d="M10 38 q 10 -18 25 -18 q 3 11 -6 22 q -12 5 -19 -4 z" fill={FOREST} opacity="0.2" />
    </svg>
    <span style={{ position: 'relative', zIndex: 1 }}>
      CO<sub style={{ fontSize: 10 }}>2</sub>
    </span>
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

      {/* Scenery layer — watercolor illustrations */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Top-left branch */}
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <LeafyBranch />
        </div>
        {/* Top-right branch */}
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <LeafyBranch flip />
        </div>
        {/* Birds top-right */}
        <div style={{ position: 'absolute', top: 80, right: 60 }}>
          <Birds />
        </div>
        {/* Bottom-left scene */}
        <div style={{ position: 'absolute', bottom: 36, left: 36 }}>
          <BottomLeftScene />
        </div>
        {/* Bottom-right scene */}
        <div style={{ position: 'absolute', bottom: 36, right: 36 }}>
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
      {/* Inner green border */}
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

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          padding: '60px 110px 50px',
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
              fontSize: 36,
              letterSpacing: 6,
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
            margin: '10px 0 16px',
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
            fontSize: 50,
            letterSpacing: 4,
            color: FOREST,
            margin: '20px 0 4px',
          }}
        >
          CERTIFICATE OF PARTICIPATION
        </h2>
        <div style={{ width: '50%', height: 1, background: GOLD, margin: '0 auto 18px' }} />

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 20,
            color: OLIVE,
            margin: '0 0 10px',
          }}
        >
          This is to certify that
        </p>

        {/* Recipient name */}
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            fontSize: 60,
            color: FOREST,
            margin: '4px 0 8px',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}
        >
          {name || 'Participant'}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '0 0 14px' }}>
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
            fontSize: 19,
            color: OLIVE,
            margin: '0 auto',
            maxWidth: 720,
            lineHeight: 1.5,
          }}
        >
          has self certified that he/she has contributed towards environment awareness,
          sustainability, and carbon emission reduction initiative.
        </p>

        <div style={{ margin: '14px 0 8px' }}>
          <LeafDivider />
        </div>

        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontSize: 16,
            color: OLIVE,
            margin: '0 auto',
            maxWidth: 680,
            lineHeight: 1.4,
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
            padding: '20px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Co2Badge />
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 13,
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
                  fontSize: 22,
                  color: FOREST,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {co2} <span style={{ fontSize: 15, fontWeight: 500 }}>{unit}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: '#D9E5C2',
                border: `2px solid ${FOREST}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"Playfair Display", serif',
                fontWeight: 700,
                fontSize: 14,
                color: FOREST,
              }}
            >
              CAL
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 13,
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
        </div>

        {/* Disclaimer footer pill */}
        <div
          style={{
            margin: '16px auto 0',
            padding: '6px 22px',
            border: `1px solid ${FOREST}`,
            borderRadius: 999,
            display: 'inline-block',
            alignSelf: 'center',
            background: 'rgba(255,255,255,0.55)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
