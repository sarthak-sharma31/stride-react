import { Layout, usePageMeta } from '../components/Layout';
import { SITE } from '../site';

export function Policy({ doc }: { doc: keyof typeof SITE.policies }) {
  const p = SITE.policies[doc];
  usePageMeta(`${p.title} · StrideRewards`, `${p.title} for the StrideRewards app.`);
  return (
    <Layout>
      <main className="wrap doc">
        <h1>{p.title}</h1>
        {p.sections.map((s) => (
          <div key={s.heading}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </div>
        ))}
      </main>
    </Layout>
  );
}
