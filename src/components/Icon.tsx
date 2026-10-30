import type { ReactNode } from 'react';

/** Line icons on a 24px grid, drawn with currentColor (used instead of emoji). */
const PATHS: Record<string, ReactNode> = {
  water: (<><path d="M12 3c3.5 4.2 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.5-6.8 6-11z" /><path d="M9 15a3 3 0 0 0 3 3" /></>),
  squat: (<><circle cx="12" cy="4.5" r="2" /><path d="M12 7v5l-4 3v5" /><path d="M12 12l4 3v5" /><path d="M6 10h12" /></>),
  smile: (<><circle cx="12" cy="12" r="9" /><path d="M8 14c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4" /><path d="M9 9.5h.01M15 9.5h.01" strokeWidth={3} /></>),
  breath: (<><path d="M3 8h10a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h7" /></>),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  gift: (<><rect x="3.5" y="8" width="17" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12" /><path d="M12 8c-1.5-3-5-3.5-5-1.2C7 8 9 8 12 8zm0 0c1.5-3 5-3.5 5-1.2C17 8 15 8 12 8z" /></>),
  shoe: (<><path d="M3 16.5V11l4-1 2 2.5 4 1 5 1.5a3 3 0 0 1 3 2.5H3z" /><path d="M3 19.5h18" /></>),
  flag: (<><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>),
  pin: (<><path d="M12 21s-6-5.4-6-10.5a6 6 0 0 1 12 0C18 15.6 12 21 12 21z" /><path d="M4 4l16 16" /></>),
  battery: (<><rect x="2.5" y="7" width="17" height="10" rx="2" /><path d="M22 10.5v3" /><path d="M6 10v4M9.5 10v4" /></>),
  people: (<><circle cx="9" cy="8" r="3.2" /><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14c2.4.2 4 1.6 4.5 4" /></>),
  shield: (<><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z" /><path d="M8.5 12l2.5 2.5 4.5-4.5" /></>),
  flame: <path d="M12 21c-3.9 0-6.5-2.6-6.5-6 0-3.6 3-5.5 3.5-9 2.4 1.4 3.6 3.4 3.9 5.3.8-.6 1.4-1.7 1.6-3 2.2 1.8 4 4.4 4 6.7 0 3.4-2.6 6-6.5 6z" />,
  bolt: <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z" />,
  lock: (<><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>),
  mail: (<><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6.5L20.5 7" /></>),
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = 'ico' }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

export function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22a11.4 11.4 0 0 0-9.84 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </svg>
  );
}
