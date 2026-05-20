import './LeafAnimation.css';

type LeafSpec = {
  className: string;
  delay: number;
  duration: number;
  size: number;
  tint: string;
};

const Leaf = ({ size = 28, tint = '#16a34a' }: { size?: number; tint?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`lg-${tint.replace('#', '')}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
        <stop offset="100%" stopColor={tint} stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <path
      d="M32 4 C14 14 6 28 8 46 C8 52 12 58 18 60 C36 60 54 46 60 22 C60 14 56 8 50 6 C44 4 38 4 32 4 Z"
      fill={`url(#lg-${tint.replace('#', '')})`}
      stroke={tint}
      strokeOpacity="0.45"
      strokeWidth="1"
    />
    <path
      d="M14 54 C24 42 38 28 56 14"
      stroke={tint}
      strokeOpacity="0.55"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Edge / corner anchored leaves — never crosses the middle of the page.
const cornerLeaves: LeafSpec[] = [
  { className: 'leaf leaf--tl-1', delay: 0, duration: 9, size: 30, tint: '#16a34a' },
  { className: 'leaf leaf--tl-2', delay: 2.4, duration: 11, size: 22, tint: '#22c55e' },
  { className: 'leaf leaf--tr-1', delay: 1.2, duration: 10, size: 28, tint: '#15803d' },
  { className: 'leaf leaf--tr-2', delay: 3.6, duration: 12, size: 20, tint: '#4ade80' },
  { className: 'leaf leaf--bl-1', delay: 0.8, duration: 13, size: 26, tint: '#16a34a' },
  { className: 'leaf leaf--bl-2', delay: 2.0, duration: 10, size: 18, tint: '#65a30d' },
  { className: 'leaf leaf--br-1', delay: 1.6, duration: 12, size: 30, tint: '#15803d' },
  { className: 'leaf leaf--br-2', delay: 3.0, duration: 9, size: 22, tint: '#22c55e' },
];

// Falling leaves from the top corners — long, slow loops.
const fallingLeaves: LeafSpec[] = [
  { className: 'leaf leaf--fall-l-1', delay: 0, duration: 18, size: 22, tint: '#16a34a' },
  { className: 'leaf leaf--fall-l-2', delay: 6, duration: 22, size: 18, tint: '#22c55e' },
  { className: 'leaf leaf--fall-r-1', delay: 3, duration: 20, size: 24, tint: '#15803d' },
  { className: 'leaf leaf--fall-r-2', delay: 9, duration: 24, size: 16, tint: '#4ade80' },
];

export const LeafAnimation = () => (
  <div className="leaf-animation" aria-hidden="true">
    {cornerLeaves.map((l, i) => (
      <span
        key={`c-${i}`}
        className={l.className}
        style={{ animationDelay: `${l.delay}s`, animationDuration: `${l.duration}s` }}
      >
        <Leaf size={l.size} tint={l.tint} />
      </span>
    ))}
    {fallingLeaves.map((l, i) => (
      <span
        key={`f-${i}`}
        className={l.className}
        style={{ animationDelay: `${l.delay}s`, animationDuration: `${l.duration}s` }}
      >
        <Leaf size={l.size} tint={l.tint} />
      </span>
    ))}
  </div>
);

export default LeafAnimation;
