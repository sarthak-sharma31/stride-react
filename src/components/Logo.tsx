const SOLE = 'M0 -34 C13 -34 17 -21 16 -9 C15 1 10 7 10 13 C10 22 13 31 0 34 C-13 31 -10 22 -10 13 C-10 7 -15 1 -16 -9 C-17 -21 -13 -34 0 -34 Z';

function Foot({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={SOLE} fill="#fff" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
      <path d="M-9 -2 L9 -2" stroke="#111" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** The app's brand mark: a red disc with two footprints (same geometry as the app icon). */
export function Logo() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <circle cx={107} cy={107} r={80} fill="#111" />
      <circle cx={100} cy={100} r={80} fill="#E5173F" stroke="#111" strokeWidth={6} />
      <Foot x={76} y={112} r={-16} />
      <Foot x={126} y={86} r={14} />
    </svg>
  );
}
