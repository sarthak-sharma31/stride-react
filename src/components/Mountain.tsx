const CLOUD = 'M0 22 C0 12 9 6 17 9 C20 1 33 -2 40 6 C47 2 58 7 57 16 C63 17 66 22 64 26 L2 26 C0 26 0 24 0 22 Z';
const STEPS = [
  [146, 252, -20],
  [131, 236, 10],
  [143, 218, 25],
  [158, 204, 10],
];

/** The app's Welcome-screen scene (same drawing as src/components/Illustration.tsx in the app). */
export function Mountain({ className = 'scene' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 300" role="img" aria-label="A trail of footprints leading up a mountain">
      <circle cx={150} cy={158} r={118} fill="#FFE3EA" />
      <circle cx={222} cy={84} r={34} fill="#E5173F" />
      <g transform="translate(176 48)">
        <path d={CLOUD} fill="#fff" stroke="#111" strokeWidth={3} strokeLinejoin="round" />
      </g>
      <g transform="translate(38 92) scale(0.9)">
        <path d={CLOUD} fill="#fff" stroke="#111" strokeWidth={3.3} strokeLinejoin="round" />
      </g>
      <path d="M64 266 L150 112 L236 266 Z" fill="#fff" stroke="#111" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M127 148 L150 112 L173 148 L162 141 L150 153 L139 141 Z" fill="#F9A8BF" stroke="#111" strokeWidth={3} strokeLinejoin="round" />
      <path d="M212 266 L244 214 L278 266" fill="#fff" stroke="#111" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M152 264 C152 250 128 246 130 230 C132 214 160 212 160 196" fill="none" stroke="#111" strokeWidth={2.5} strokeDasharray="1 7" strokeLinecap="round" />
      {STEPS.map(([x, y, r], i) => {
        const fill = i % 2 ? '#F9A8BF' : '#E5173F';
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <ellipse rx={4.5} ry={7} fill={fill} stroke="#111" strokeWidth={2} />
            <circle cy={-11} r={2.2} fill={fill} stroke="#111" strokeWidth={1.5} />
          </g>
        );
      })}
      <path d="M34 267 L282 267" stroke="#111" strokeWidth={7} strokeLinecap="round" />
      <circle cx={52} cy={172} r={9} fill="#F9A8BF" stroke="#111" strokeWidth={2.5} />
      <circle cx={262} cy={150} r={8} fill="#F9A8BF" stroke="#111" strokeWidth={2.5} />
    </svg>
  );
}
