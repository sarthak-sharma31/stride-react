/**
 * Copies the facts the website shows (gift-card prices, earning limits, referral rules, policy
 * text, public Firebase web config) from the server and app source into src/data/site-data.json,
 * so the site always matches the app. Run `npm run sync` by hand when the app data changes, then commit the JSON.
 */
import fs from 'node:fs';
import path from 'node:path';

// Manual refresh only (not part of the build): needs the app repo checked out next to this folder.
const APP = process.env.APP_DIR ?? path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'Stride-rewards-app');
const { DEFAULT_CATALOG, DEFAULT_PUBLIC_CONFIG, DEFAULT_RULES } = await import(path.join(APP, 'serverless/src/config/defaults.ts'));
const { POLICIES } = await import(path.join(APP, 'src/constants/policies.ts'));

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const eas = JSON.parse(fs.readFileSync(path.join(APP, 'eas.json'), 'utf8')).build.production.env as Record<string, string>;
const tiers = DEFAULT_RULES.schedule.tiers;

const data = {
  websiteUrl: DEFAULT_PUBLIC_CONFIG.websiteUrl,
  apiUrl: eas.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '') + '/api',
  catalog: DEFAULT_CATALOG.filter((c) => c.active).map((c) => ({ id: c._id, brand: c.brand ?? c.title, title: c.title, points: c.points, valueMinor: c.valueMinor })),
  rules: {
    dailyCap: DEFAULT_RULES.perUserDailyPointsCap,
    milestonesPerDay: tiers.reduce((n, t, i) => n + (t.upToSteps - (i ? tiers[i - 1].upToSteps : 0)) / t.everySteps, 0),
    milestonePoints: [DEFAULT_RULES.schedule.minPoints, DEFAULT_RULES.schedule.maxPoints],
    bonusPoints: [DEFAULT_RULES.bonus.minPoints, DEFAULT_RULES.bonus.maxPoints],
    habits: DEFAULT_RULES.habits?.length ?? 0,
  },
  referral: DEFAULT_PUBLIC_CONFIG.referral,
  redemption: DEFAULT_PUBLIC_CONFIG.redemption,
  policies: POLICIES,
  firebase: {
    apiKey: eas.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: eas.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: eas.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    appId: eas.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
};

fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'site-data.json'), JSON.stringify(data, null, 2) + '\n');
console.log(`site-data.json: ${data.catalog.length} gift cards, ${Object.keys(data.policies).length} policies`);
