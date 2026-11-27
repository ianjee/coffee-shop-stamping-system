import { useId } from "react";

const MAIN = "rgba(218,184,140,.82)";
const SOFT = "rgba(218,184,140,.45)";
const GOLD = "#D8A559";

// Straw-fringe skirt outline (zig-zag bottom edge)
function skirtPath() {
  let d = "M-110 -2 L48 -2 L48 54";
  for (let fx = 48; fx >= -110; fx -= 12) d += ` L${fx - 6} 47 L${fx - 12} 55`;
  return d + " Z";
}

// Front fender arc around the front wheel
function fenderPath() {
  const a1 = Math.PI * 1.08, a2 = Math.PI * 1.88, r = 26;
  const p = (a: number) => `${(96 + r * Math.cos(a)).toFixed(2)} ${(56 + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(a1)} A${r} ${r} 0 0 1 ${p(a2)} L96 56 Z`;
}

const Wheel = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill="#1E1009" stroke={MAIN} strokeWidth="3.5" />
    <circle r={r * 0.58} fill="none" stroke={SOFT} strokeWidth="1.75" />
    <circle r="4" fill={GOLD} />
  </g>
);

const Bolt = ({ x, y }: { x: number; y: number }) => (
  <path transform={`translate(${x} ${y})`} d="M4 -14 L-4 -1 L3 -1 L-4 14" fill="none" stroke="rgba(224,174,99,.5)" strokeWidth="1.8" />
);

/** Motorcycle coffee cart emblem. Drop-in replacement for CupIcon (same `size` prop). */
export default function CartLogo({ size = 24 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="-150 -145 300 245" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}u`} x1="0" y1="-135" x2="0" y2="-82" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#E0AE63" /><stop offset="1" stopColor="#B87A35" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="-2" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#DDA95E" /><stop offset="1" stopColor="#A86E2B" />
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="86" rx="142" ry="13" fill="rgba(10,5,2,.35)" />
      <path d="M-42 -16 V-96" stroke={MAIN} strokeWidth="4" />
      <path d="M-124 -84 Q-42 -142 40 -84 Q-42 -76 -124 -84 Z" fill={`url(#${id}u)`} stroke={MAIN} strokeWidth="2.5" />
      {[-86, -42, 2].map((rx) => (
        <path key={rx} d={`M-42 -126 Q${rx} -105 ${rx * 1.15} -83`} stroke="rgba(56,33,18,.45)" strokeWidth="1.75" />
      ))}
      <Wheel x={-38} y={62} r={22} />
      <Wheel x={96} y={60} r={24} />
      <rect x="-108" y="-56" width="46" height="44" rx="5" fill="#9C4A26" stroke={MAIN} strokeWidth="2.2" />
      <circle cx="-85" cy="-31" r="10" fill="#2D190F" />
      <circle cx="-85" cy="-31" r="4" fill={GOLD} />
      <rect x="-54" y="-34" width="10" height="22" rx="2" fill="#E8D5B9" />
      <rect x="-40" y="-30" width="9" height="18" rx="2" fill="#C9A77F" />
      <rect x="-26" y="-36" width="12" height="24" rx="2" fill="#5E3B28" />
      <rect x="-114" y="-14" width="168" height="12" rx="4" fill="#B86E2D" stroke={MAIN} strokeWidth="2.2" />
      <path d={skirtPath()} fill={`url(#${id}s)`} />
      {Array.from({ length: 15 }, (_, i) => -102 + i * 10).map((sx) => (
        <path key={sx} d={`M${sx} 2 V48`} stroke="rgba(56,33,18,.35)" strokeWidth="1.5" />
      ))}
      <rect x="46" y="-44" width="16" height="36" rx="6" fill="#4A3124" stroke={MAIN} strokeWidth="2" />
      <path d="M52 -8 L74 -8 Q86 -34 80 -52 L92 -52 Q96 -12 86 34 L54 34 Z" fill="#A44626" stroke={MAIN} strokeWidth="2.4" />
      <path d={fenderPath()} fill="#B6522E" stroke={MAIN} strokeWidth="2.4" />
      <path d="M86 -52 V-80" stroke={MAIN} strokeWidth="2.5" />
      <rect x="83" y="-82" width="7" height="26" rx="3" fill="rgba(234,216,190,.22)" stroke={MAIN} strokeWidth="2.5" />
      <circle cx="97" cy="-45" r="5" fill="#F5D28B" />
      <Bolt x={-136} y={-15} />
      <Bolt x={132} y={-15} />
    </svg>
  );
}
