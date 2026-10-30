import amazon from '../assets/brand/amazon.svg?raw';
import flipkart from '../assets/brand/flipkart.svg?raw';
import googleplay from '../assets/brand/googleplay.svg?raw';

/** Brand marks from Simple Icons (CC0); AJIO has no mark there, so it gets a wordmark. */
const pathOf = (svg: string) => /\sd="([^"]+)"/.exec(svg)?.[1] ?? '';

export const BRANDS: Record<string, { color: string; tagline: string; path?: string }> = {
  'Google Play': { color: '#01875F', tagline: 'Apps, games, movies and subscriptions', path: pathOf(googleplay) },
  'Amazon Pay': { color: '#232F3E', tagline: 'Shop anything on Amazon.in', path: pathOf(amazon) },
  Flipkart: { color: '#2874F0', tagline: 'Electronics, fashion and more', path: pathOf(flipkart) },
  AJIO: { color: '#2C4152', tagline: 'Fashion and lifestyle brands' },
};

export function BrandMark({ brand }: { brand: string }) {
  const b = BRANDS[brand];
  return (
    <div className="brand-logo" style={{ background: b?.color ?? '#E5173F' }}>
      {b?.path ? (
        <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
          <path d={b.path} />
        </svg>
      ) : (
        <span className="wordmark">{brand.toUpperCase()}</span>
      )}
    </div>
  );
}
