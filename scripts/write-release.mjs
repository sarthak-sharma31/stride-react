/**
 * Runs in the site's build: turns the APK_DOWNLOAD_URL and APP_VERSION environment variables into
 * /download/latest.json, which the download buttons and the Android app's update check read.
 * APP_VERSION is the build number shown in the app under Profile, for example 8.
 */
import fs from 'node:fs';
import path from 'node:path';

const url = (process.env.APK_DOWNLOAD_URL ?? '').trim();
const version = (process.env.APP_VERSION ?? '').trim();

if (url || version) {
  // Stop the deploy on a typo: a bad value would otherwise quietly switch updates off.
  if (!/^[1-9]\d*$/.test(version)) throw new Error('APP_VERSION must be a whole number, the build number, for example 8.');
  if (!url.startsWith('https://')) throw new Error('APK_DOWNLOAD_URL must be an https:// link.');
  const dir = path.resolve('public/download');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'latest.json'), JSON.stringify({ build: Number(version), version, path: url, publishedAt: new Date().toISOString() }, null, 2) + '\n');
}
