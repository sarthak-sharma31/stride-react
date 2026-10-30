import data from './data/site-data.json';

/** Facts copied from the app and server source by scripts/sync-data.mts. */
export const SITE = data;
export const APK_PATH = '/download/StrideRewards.apk';

export type CatalogItem = (typeof data.catalog)[number];
export type Release = { version: string; build: number; sizeMb: number; sha256: string; path: string; publishedAt: string };

export const rupees = (minor: number) => `₹${(minor / 100).toLocaleString('en-IN')}`;
export const points = (p: number) => p.toLocaleString('en-IN');
/** The site's host without the scheme, e.g. "striderewards.sornok.online". */
export const siteHost = () => (typeof window !== 'undefined' ? window.location.host : new URL(data.websiteUrl).host);
