/** House style: no em dashes and no emoji in the site's source or generated data. */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');
const banned = /—|[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const bad = [];
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(tsx?|css|json|html)$/.test(f.name)) {
      fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        const m = line.match(banned);
        if (m) bad.push(`${path.relative(root, p)}:${i + 1} contains "${m[0]}"`);
      });
    }
  }
};
walk(root);
if (bad.length) {
  console.error(bad.join('\n'));
  process.exit(1);
}
console.log('Copy check passed: no em dashes or emoji.');
