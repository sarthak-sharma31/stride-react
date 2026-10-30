import { Link } from 'react-router-dom';
import { Layout, usePageMeta } from '../components/Layout';
import { Mountain } from '../components/Mountain';

export function NotFound() {
  usePageMeta('Page not found · StrideRewards');
  return (
    <Layout>
      <main className="invite">
        <div className="wrap" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card">
            <div className="invite-scene">
              <Mountain />
            </div>
            <h2>This trail doesn’t exist</h2>
            <p className="muted" style={{ margin: '12px 0 20px' }}>
              The page you’re looking for isn’t here.
            </p>
            <Link className="btn" to="/">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
