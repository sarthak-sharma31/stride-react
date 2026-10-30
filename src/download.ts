import { APK_PATH, type Release } from './site';

export type DownloadInfo = { url: string; version?: string; sizeMb?: number };

/**
 * Where the download buttons point: the link in latest.json (written at build time from the site's
 * environment variables, see scripts/write-release.mjs), or else the APK bundled with the site.
 */
async function resolve(): Promise<DownloadInfo> {
  try {
    const res = await fetch('/download/latest.json', { cache: 'no-cache' });
    if (res.ok) {
      const r = (await res.json()) as Release;
      return { url: r.path ?? APK_PATH, version: r.version, sizeMb: r.sizeMb };
    }
  } catch {
    // No release info.
  }
  return { url: APK_PATH };
}

let cached: Promise<DownloadInfo> | null = null;
export const getDownload = () => (cached ??= resolve());
