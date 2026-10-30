import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

/** Sets the tab title (and description) for a page. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}

/** Scrolls to #section links (and to the top on page changes), which a client-side router doesn't do itself. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // After the next paint, once the mobile menu has closed and the page has settled.
    const id = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    return () => cancelAnimationFrame(id);
    // `key` so tapping the same link again scrolls back to that section.
  }, [pathname, hash, key]);
  return null;
}

const SECTIONS: [string, string][] = [
  ['how', 'How it works'],
  ['app', 'The app'],
  ['rewards', 'Rewards'],
  ['invite', 'Invite friends'],
  ['faq', 'FAQ'],
];

export function Layout({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <ScrollManager />
      <header className="top">
        <div className="wrap">
          <Link className="brand" to="/">
            <Logo />
            StrideRewards
          </Link>
          {admin ? (
            <span className="admin-tag">Admin</span>
          ) : (
            <>
              <nav className="links">
                {SECTIONS.map(([id, label]) => (
                  <Link key={id} to={`/#${id}`}>
                    {label}
                  </Link>
                ))}
              </nav>
              <Link className="btn small dark" to="/#download">
                Download
              </Link>
              <button className="menu-btn" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen((o) => !o)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden="true">
                  <path d={menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
                </svg>
              </button>
            </>
          )}
        </div>
        {!admin && menuOpen ? (
          <nav id="site-menu" className="menu">
            {SECTIONS.map(([id, label]) => (
              <Link key={id} to={`/#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
      {children}
      {admin ? null : (
        <footer>
          <div className="wrap">
            <Link className="brand" to="/">
              <Logo />
              StrideRewards
            </Link>
            <nav>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="/rewards-policy">Rewards Policy</Link>
            </nav>
            <p className="fine">
              Points are a loyalty reward, not money. Gift cards are subject to the Rewards Policy and manual review. Google Play, Amazon Pay, Flipkart and AJIO are trademarks of their owners, who are not
              affiliated with and do not sponsor StrideRewards.
            </p>
          </div>
        </footer>
      )}
    </>
  );
}
