/**
 * Downloads a built APK into public/download and writes latest.json (version, build number,
 * size, SHA-256), which the site's download buttons and the app's update check read.
 *   npm run fetch-apk -- <apk url> <version> <build number>
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const [url, version = '1.0.0', build = '0'] = process.argv.slice(2);
if (!url) {
  console.error('Usage: npm run fetch-apk -- <apk url> <version> <build number>');
  process.exit(1);
}
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const res = await fetch(url);
if (!res.ok) throw new Error(`Download failed: ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());
if (buf.subarray(0, 2).toString() !== 'PK') throw new Error('That file is not an APK');
const dir = path.join(root, 'public', 'download');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'StrideRewards.apk'), buf);
const release = {
  version,
  build: Number(build),
  sizeMb: Math.round(buf.length / 1e6),
  sha256: createHash('sha256').update(buf).digest('hex'),
  path: '/download/StrideRewards.apk',
  publishedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(dir, 'latest.json'), JSON.stringify(release, null, 2) + '\n');
console.log(`APK ${version} (build ${build}), ${release.sizeMb} MB`);
