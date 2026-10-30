import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DownloadButton } from '../components/Download';
import { Layout, usePageMeta } from '../components/Layout';
import { Mountain } from '../components/Mountain';

/** /r/CODE: a friend's invite. Shows the code and copies it when the download starts. */
export function Invite() {
  const raw = useParams().code ?? '';
  const code = /^[A-Za-z0-9]{4,12}$/.test(raw) ? raw.toUpperCase() : '';
  const [toast, setToast] = useState('');
  usePageMeta(code ? `Join me on StrideRewards · code ${code}` : 'You’re invited to StrideRewards', 'Your friend invited you to StrideRewards: walk, earn points and swap them for gift cards.');

  const copy = (msg: string) => {
    if (!code || !navigator.clipboard) return;
    navigator.clipboard.writeText(code).then(
      () => setToast(msg),
      () => undefined,
    );
  };

  return (
    <Layout>
      <main className="invite">
        <div className="wrap" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card">
            <div className="invite-scene">
              <Mountain />
            </div>
            <span className="eyebrow">You’re invited</span>
            <h2 style={{ marginTop: 14 }}>Walk with your friend on StrideRewards</h2>
            <p className="muted" style={{ marginTop: 12 }}>
              Earn points for every 500 steps and swap them for gift cards. Join with this invite code and you’ll both get bonus points:
            </p>
            <div className="code">{code || 'No code'}</div>
            {code ? (
              <button className="btn ghost small" type="button" onClick={() => copy('Code copied!')}>
                Copy code
              </button>
            ) : null}
            <div className="toast" role="status">
              {toast}
            </div>
            <div style={{ marginTop: 14 }}>
              <DownloadButton label="Download the app" onClick={() => copy(`Code ${code} copied. Paste it when the app asks.`)} />
            </div>
            <ol className="install">
              <li>
                <span>Download and install the app. If Android asks, allow the install: it isn’t on the Play Store.</span>
              </li>
              <li>
                <span>Sign in and go through the quick setup.</span>
              </li>
              <li>
                <span>
                  On the <b>Profile</b> step, paste the code into <b>Referral code</b>.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </Layout>
  );
}
