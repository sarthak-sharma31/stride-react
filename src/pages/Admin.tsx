import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { useEffect, useState, type FormEvent } from 'react';
import { Layout, usePageMeta } from '../components/Layout';
import { SITE, points } from '../site';

/**
 * Admin console. Signs in with Firebase (Google) and calls the server's /admin API, which only
 * answers accounts listed in the server's ADMIN_UIDS, so this page holds no data or secrets itself.
 */
const auth = getAuth(initializeApp(SITE.firebase));

type Redemption = {
  id: string;
  userId: string;
  catalogItemTitle: string;
  points: number;
  deliveryEmail: string;
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  history?: { note?: string }[];
  user: { displayName?: string; email?: string; createdAt?: string; riskScore?: number; riskFlags?: { type: string }[]; wallet?: { lifetimeEarned?: number } } | null;
};
type AdminUser = { id: string; displayName: string; email: string; createdAt: string; status: string; riskScore: number; wallet?: { available?: number; lifetimeEarned?: number } };
type Stats = { pendingRedemptions: number; activeUsers: number; flaggedUsers: number; pointsIssuedToday: number; outstandingPoints: number };

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const res = await fetch(SITE.apiUrl + path, { ...init, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...init.headers } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.ok === false) throw new ApiError(body.error?.message ?? `Request failed (${res.status})`, res.status);
  return (body.data ?? body) as T;
}

const OPEN = ['PENDING', 'APPROVED', 'PROCESSING'];
const LABEL: Record<Redemption['status'], string> = { PENDING: 'Waiting', APPROVED: 'Waiting', PROCESSING: 'Waiting', COMPLETED: 'Sent', REJECTED: 'Declined', CANCELLED: 'Cancelled' };
const daysSince = (d?: string) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / 86400000) : '?');
const when = (d: string) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function Admin() {
  usePageMeta('Admin · StrideRewards');
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [allowed, setAllowed] = useState(false);
  const [signinError, setSigninError] = useState('');

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        setAllowed(false);
        if (!u) return;
        try {
          await api('/admin/stats');
          setAllowed(true);
          setSigninError('');
        } catch (e) {
          setSigninError(e instanceof ApiError && e.status === 403 ? `${u.email} is not an admin account. Sign in with the admin account.` : (e as Error).message);
          await signOut(auth);
        }
      }),
    [],
  );

  const signIn = () =>
    signInWithPopup(auth, new GoogleAuthProvider()).catch((e) =>
      setSigninError(e.code === 'auth/unauthorized-domain' ? 'This website is not yet allowed to sign in. Add it in Firebase under Authentication, Settings, Authorized domains.' : e.message),
    );

  return (
    <Layout admin>
      <main className="wrap admin">
        {user === undefined ? null : !user || !allowed ? (
          <section className="card admin-signin">
            <h2>Admin sign-in</h2>
            <p className="muted">Sign in with the Google account that runs StrideRewards.</p>
            <button className="btn dark" type="button" onClick={signIn} disabled={!!user}>
              {user ? 'Checking…' : 'Continue with Google'}
            </button>
            <p className="err">{signinError}</p>
          </section>
        ) : (
          <Console email={user.email ?? ''} />
        )}
      </main>
    </Layout>
  );
}

function Console({ email }: { email: string }) {
  const [tab, setTab] = useState<'requests' | 'users'>('requests');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const refresh = () => setVersion((v) => v + 1);

  useEffect(() => {
    api<Stats>('/admin/stats').then(setStats, (e) => setError(e.message));
  }, [version]);

  return (
    <>
      <div className="admin-bar">
        <div>
          <h2>Dashboard</h2>
          <p className="muted small">Signed in as {email}</p>
        </div>
        <div className="admin-actions">
          <button className="btn small ghost" type="button" onClick={refresh}>
            Refresh
          </button>
          <button className="btn small ghost" type="button" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
      </div>
      {stats ? (
        <div className="kpis">
          {(
            [
              ['Waiting requests', stats.pendingRedemptions],
              ['Active users', stats.activeUsers],
              ['Flagged users', stats.flaggedUsers],
              ['Points issued today', stats.pointsIssuedToday],
              ['Points outstanding', stats.outstandingPoints],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="card kpi">
              <span>{k}</span>
              <b>{points(v)}</b>
            </div>
          ))}
        </div>
      ) : null}
      <div className="tabs" role="tablist">
        {(
          [
            ['requests', 'Gift card requests'],
            ['users', 'Users'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={`tab${tab === id ? ' on' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <p className="err">{error}</p>
      {tab === 'requests' ? <Requests version={version} onChange={refresh} onError={setError} /> : null}
      {tab === 'users' ? <Users version={version} onChange={refresh} onError={setError} /> : null}
    </>
  );
}

type PanelProps = { version: number; onChange: () => void; onError: (m: string) => void };

function Requests({ version, onChange, onError }: PanelProps) {
  const [status, setStatus] = useState('OPEN');
  const [rows, setRows] = useState<Redemption[] | null>(null);

  useEffect(() => {
    api<Redemption[]>(`/admin/redemptions?status=${status}`).then(
      (r) => setRows([...r].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))),
      (e) => onError(e.message),
    );
  }, [status, version, onError]);

  const transition = async (id: string, to: 'COMPLETED' | 'REJECTED', note?: string) => {
    onError('');
    try {
      await api(`/admin/redemptions/${id}/transition`, { method: 'POST', body: JSON.stringify({ to, note }) });
      onChange();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  return (
    <>
      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="OPEN">Waiting (to send)</option>
          <option value="COMPLETED">Sent</option>
          <option value="REJECTED">Declined</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="ALL">All</option>
        </select>
      </div>
      <div className="list">
        {rows?.length === 0 ? <p className="muted empty">Nothing here.</p> : null}
        {rows?.map((r) => {
          const u = r.user ?? {};
          const earned = u.wallet?.lifetimeEarned ?? 0;
          const suspicious = earned < r.points || (u.riskScore ?? 0) >= 20;
          const note = r.history?.at(-1)?.note;
          return (
            <div key={r.id} className={`card req${suspicious ? ' warn' : ''}`}>
              <div className="req-head">
                <div>
                  <h3>{r.catalogItemTitle}</h3>
                  <p className="muted small">
                    {when(r.createdAt)} · {points(r.points)} pts
                  </p>
                </div>
                <span className={`pill s-${r.status}`}>{LABEL[r.status]}</span>
              </div>
              <dl>
                <dt>Send to</dt>
                <dd>
                  <code>{r.deliveryEmail}</code> <CopyButton text={r.deliveryEmail} />
                </dd>
                <dt>User</dt>
                <dd>
                  {u.displayName ?? 'Unknown'} <span className="muted">({u.email ?? r.userId})</span>
                </dd>
                <dt>Account age</dt>
                <dd>{daysSince(u.createdAt)} days</dd>
                <dt>Lifetime earned</dt>
                <dd>
                  {points(earned)} pts {earned < r.points ? <b className="bad">less than this request</b> : null}
                </dd>
                <dt>Risk score</dt>
                <dd>
                  {u.riskScore ?? 0}
                  {u.riskFlags?.length ? <span className="muted"> ({u.riskFlags.map((f) => f.type).join(', ')})</span> : null}
                </dd>
                {note ? (
                  <>
                    <dt>Note</dt>
                    <dd>{note}</dd>
                  </>
                ) : null}
              </dl>
              {OPEN.includes(r.status) ? (
                <SendCode
                  card={r.catalogItemTitle}
                  email={r.deliveryEmail}
                  onSend={async (body) => {
                    onError('');
                    await api(`/admin/redemptions/${r.id}/send-code`, { method: 'POST', body: JSON.stringify(body) });
                    onChange();
                  }}
                  onMarkSent={() => {
                    if (confirm('Mark as sent without emailing from here? Only do this if you already sent the code yourself.')) transition(r.id, 'COMPLETED', prompt('Optional note for the user (leave empty for none):') || undefined);
                  }}
                  onDecline={() => {
                    const reason = prompt('Why is this request declined? The user gets this by email, and their points are refunded.');
                    if (reason) transition(r.id, 'REJECTED', reason);
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Users({ version, onChange, onError }: PanelProps) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<AdminUser[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      api<AdminUser[]>(`/admin/users${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`).then(setRows, (e) => onError(e.message));
    }, 300);
    return () => clearTimeout(t);
  }, [q, version, onError]);

  const setStatus = async (id: string, status: 'active' | 'suspended') => {
    const reason = prompt(status === 'suspended' ? 'Reason for suspending this user:' : 'Reason for restoring this user:');
    if (!reason) return;
    try {
      await api(`/admin/users/${encodeURIComponent(id)}/status`, { method: 'POST', body: JSON.stringify({ status, reason }) });
      onChange();
    } catch (e) {
      onError((e as Error).message);
    }
  };

  return (
    <>
      <div className="filters">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or user id" aria-label="Search users" />
      </div>
      {rows?.length === 0 ? <p className="muted empty">No users found.</p> : null}
      {rows?.length ? (
        <div className="table-wrap">
          <table className="users">
            <thead>
              <tr>
                <th>User</th>
                <th>Joined</th>
                <th>Balance</th>
                <th>Earned</th>
                <th>Risk</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id}>
                  <td>
                    <b>{u.displayName}</b>
                    <br />
                    <span className="muted small">{u.email}</span>
                  </td>
                  <td>{daysSince(u.createdAt)} days ago</td>
                  <td>{points(u.wallet?.available ?? 0)}</td>
                  <td>{points(u.wallet?.lifetimeEarned ?? 0)}</td>
                  <td>{u.riskScore}</td>
                  <td>
                    <span className={`pill s-${u.status}`}>{u.status}</span>
                  </td>
                  <td>
                    {u.status === 'active' ? (
                      <button className="link" type="button" onClick={() => setStatus(u.id, 'suspended')}>
                        Suspend
                      </button>
                    ) : u.status === 'suspended' ? (
                      <button className="link" type="button" onClick={() => setStatus(u.id, 'active')}>
                        Unsuspend
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

/** Gift-code form: the server emails the code to the user (it is never stored), then marks the request sent. */
function SendCode({ card, email, onSend, onMarkSent, onDecline }: { card: string; email: string; onSend: (b: { code: string; pin?: string; note?: string }) => Promise<void>; onMarkSent: () => void; onDecline: () => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const needsPin = /^(Flipkart|AJIO)/.test(card);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!confirm(`Email this ${card} code to ${email}? This can't be undone.`)) return;
    setBusy(true);
    setErr('');
    try {
      await onSend({ code: code.trim(), pin: pin.trim() || undefined, note: note.trim() || undefined });
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="req-actions">
        <button className="btn small" type="button" onClick={() => setOpen(true)}>
          Send gift code
        </button>
        <button className="btn small ghost" type="button" onClick={onDecline}>
          Decline and refund
        </button>
        <button className="link" type="button" onClick={onMarkSent}>
          I already sent it myself
        </button>
      </div>
    );
  }
  return (
    <form className="settings send-code" onSubmit={submit}>
      <label>
        {needsPin ? 'Card number' : 'Gift code'}
        <input value={code} onChange={(e) => setCode(e.target.value)} required minLength={4} maxLength={64} pattern="[A-Za-z0-9 \-]+" autoComplete="off" spellCheck={false} />
      </label>
      {needsPin ? (
        <label>
          PIN
          <input value={pin} onChange={(e) => setPin(e.target.value)} maxLength={16} pattern="[A-Za-z0-9]*" autoComplete="off" />
        </label>
      ) : null}
      <label>
        Note for the user (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} placeholder="Thanks for walking with us!" />
      </label>
      <p className="muted small">It’s emailed to {email} and not saved anywhere, so keep your own copy until it’s redeemed.</p>
      <div className="req-actions">
        <button className="btn small" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Email the code'}
        </button>
        <button className="btn small ghost" type="button" onClick={() => setOpen(false)} disabled={busy}>
          Cancel
        </button>
      </div>
      <p className="err">{err}</p>
    </form>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="link"
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setDone(true);
      }}
    >
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}
