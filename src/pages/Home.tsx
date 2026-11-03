import type { ReactNode } from 'react';
import { BRANDS, BrandMark } from '../components/BrandMark';
import { DownloadButton } from '../components/Download';
import { Icon, type IconName } from '../components/Icon';
import { Layout, usePageMeta } from '../components/Layout';
import { Mountain } from '../components/Mountain';
import { SITE, points, rupees, siteHost } from '../site';

const TICKER = ['Every 500 steps', 'Random points', 'Sleep rewards', 'Bonus boxes', 'Daily login bonus', 'Healthy habits', 'Real gift cards', 'No GPS tracking', 'Free to use'];

const HABITS: [IconName, string, string, string][] = [
  ['water', 'Drink water', 'Log glasses, then flip the bottle for points', '#2B8CFF'],
  ['squat', 'Squats', '5 sets of 10, counted by motion', '#E5173F'],
  ['smile', 'Laugh', '15 seconds that lift your mood', '#E9A400'],
  ['breath', 'Breathe', '1 minute of calming box breathing', '#1E9E5A'],
  ['heart', 'Affirmation', 'Read today’s line aloud', '#D6457A'],
];

const FAQ = (cap: number, cheapest: { title: string; points: number }): [string, string][] => [
  ['Is it really free?', 'Yes. StrideRewards is free to download and use. Short ads in the app pay for the gift cards.'],
  [
    'How much can I earn?',
    `Walk 10,000 steps, do the daily habits, sleep and come back every day and you can earn up to ${cap} points a day, which is the daily limit. At that pace your first ${cheapest.title} card (${points(cheapest.points)} points) is about ${Math.round(cheapest.points / cap / 7)} weeks away. Points are a bonus for staying active, not a salary.`,
  ],
  ['Does it drain my battery or track my location?', 'No. It reads your phone’s low-power step sensor. There’s no GPS, and we never collect your location or routes.'],
  ['Why isn’t it on the Play Store?', 'We publish it directly on this website for now. The app is signed, and every update comes from this page.'],
  ['How do I get my gift card?', 'Open Wallet, pick a card and enter your email. We check the request by hand and email the code, usually within 3 working days. If a request is declined, your points come back.'],
  ['Can I use it outside India?', 'You can walk and collect points anywhere. Gift cards are India-only for now, and more countries are coming.'],
  [
    'Do I really get points for sleeping?',
    'Yes. Save your bedtime and points build from that time while you sleep. In the morning, tap Wake up and collect them. The app doesn’t measure your sleep, it just counts the hours from your bedtime, so please play fair.',
  ],
  ['How do I update the app?', 'When a new version is out, the app tells you. Tap Download and Android installs it over the old one, or download it again from this page. Your points and progress stay as they are.'],
  ['What about iPhone?', 'StrideRewards is Android-only for now.'],
];

/** [2, 4, 6, 8] → "2, 4, 6 and 8". */
const listJoin = (items: number[]) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}` : items.join(''));

function Hl({ children }: { children: string }) {
  return <span className="hl">{children}</span>;
}

export function Home() {
  usePageMeta('StrideRewards: walk more, earn gift cards');
  const { rules, referral: r, redemption: rd, catalog, sleep: sl, dailyLogin: dl, gifts: gf } = SITE;
  const cheapest = catalog.reduce((a, b) => (b.points < a.points ? b : a));
  const prices = [...new Map(catalog.map((c) => [c.valueMinor, c.points])).entries()].sort((a, b) => a[0] - b[0]);

  return (
    <Layout>
      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <span className="eyebrow">Free step-counter app for Android</span>
            <h1>
              Walk more,
              <br />
              earn <Hl>rewards.</Hl>
            </h1>
            <p className="lead muted">
              StrideRewards counts your steps with your phone’s own sensor and turns every milestone into points. Swap them for Google Play, Amazon Pay, Flipkart and AJIO gift cards.
            </p>
            <div id="download">
              <DownloadButton />
            </div>
            <div className="trust">
              <span>
                <Icon name="pin" />
                No location tracking
              </span>
              <span>
                <Icon name="battery" />
                Light on battery
              </span>
              <span>
                <Icon name="shield" />
                Every gift card checked by hand
              </span>
            </div>
          </div>
          <div className="hero-art">
            <Mountain />
            <div className="bubble b1">
              <b>1,000!</b>
              <small>First milestone</small>
            </div>
            <div className="bubble b2">
              <b>
                Streak <Icon name="flame" className="ico flame" />
              </b>
              <small>7 days</small>
            </div>
            <div className="bubble b3">
              <b>+6 pts</b>
              <small>Bonus box</small>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker-clip" aria-hidden="true">
        <div className="ticker">
          <div>
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <section className="stats-strip">
        <div className="wrap stats">
          <div>
            <b>{rules.milestonesPerDay}</b>
            <span>step milestones a day</span>
          </div>
          <div>
            <b>{rules.habits}</b>
            <span>healthy habits</span>
          </div>
          <div>
            <b>{Object.keys(BRANDS).length}</b>
            <span>gift card brands</span>
          </div>
          <div>
            <b>₹0</b>
            <span>to join, always</span>
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">How it works</span>
            <h2>
              Your walk, <Hl>rewarded</Hl>.
            </h2>
            <p className="muted">No gym, no subscription. Carry your phone and walk like you always do.</p>
          </div>
          <div className="grid3">
            <Step icon="shoe" title="Walk">
              Your phone’s step sensor counts every step, even with the app closed. We never use GPS or track where you go.
            </Step>
            <Step icon="bolt" title="Claim points">
              Every 500 steps up to 5,000, then every 1,000 up to 10,000, you unlock {rules.milestonePoints[0]} to {rules.milestonePoints[1]} random points. Some claims reveal a bonus box worth{' '}
              {rules.bonusPoints[0]} to {rules.bonusPoints[1]} more.
            </Step>
            <Step icon="gift" title="Get gift cards">
              Swap your points for a gift card. We check every request by hand and email the code to you, usually within 3 working days.
            </Step>
          </div>
        </div>
      </section>

      <section id="app" className="tint">
        <div className="wrap showcase">
          <div className="phone-wrap">
            <div className="phone" role="img" aria-label="The StrideRewards app showing 7,420 steps and the day’s rewards">
              <div className="notch" />
              <div className="ring">
                <div>
                  <b>7,420</b>
                  <small>of 10,000 steps</small>
                </div>
              </div>
              <PhoneRow kind="done" icon="check" label="6,000 steps" pts="+6 pts" />
              <PhoneRow kind="bonus" icon="gift" label="Bonus box" pts="+8 pts" />
              <PhoneRow kind="claim" icon="shoe" label="7,000 steps" pts="Claim" />
              <PhoneRow icon="flag" label="8,000 steps" pts={`${rules.milestonePoints[0]} to ${rules.milestonePoints[1]} pts`} />
            </div>
            <div className="bubble p1">
              <b>+5!</b>
              <small>500 steps</small>
            </div>
            <div className="bubble p2">
              <b>{rupees(cheapest.valueMinor)}</b>
              <small>{cheapest.brand}</small>
            </div>
          </div>
          <div>
            <span className="eyebrow">Inside the app</span>
            <h2>
              Every step <Hl>counts</Hl>.
            </h2>
            <ul className="ticks">
              <Tick title="A daily trail of rewards.">Watch your steps fill the ring and claim each milestone as you reach it.</Tick>
              <Tick title="Surprise bonus boxes.">Some claims reveal an extra box of points right after.</Tick>
              <Tick title="Streaks and weekly challenges.">Hit your goal on more days for bigger rewards.</Tick>
              <Tick title="Your wallet, always clear.">Every point you earn or spend is listed, and nothing is pending.</Tick>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Healthy habits</span>
            <h2>
              Small habits. <Hl>Extra points.</Hl>
            </h2>
            <p className="muted">Five quick daily habits that are good for you, each with its own points.</p>
          </div>
          <div className="habits">
            {HABITS.map(([icon, title, text, color]) => (
              <div key={title} className="card habit lift">
                <div className="habit-ico" style={{ color }}>
                  <Icon name={icon} />
                </div>
                <b>{title}</b>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="daily">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Every day</span>
            <h2>
              A reason to come <Hl>back daily</Hl>.
            </h2>
            <p className="muted">Even on days you don’t walk much, there are points waiting.</p>
          </div>
          <div className="grid3">
            <Step icon="moon" title="Sleep rewards">
              Set your bedtime and earn {sl.pointsPerHour} points an hour while you sleep, up to {sl.pointsPerHour * sl.maxHours} a night. Free milestones at bedtime and at {listJoin(sl.milestoneHours.filter((h) => h > 0))} hours add{' '}
              {sl.milestonePoints[0]} to {sl.milestonePoints[1]} points each.
            </Step>
            <Step icon="calendar" title="Daily login bonus">
              Open the app every day for a bigger reward. It starts at {dl.basePoints} points and grows by {dl.stepPoints} each day in a row, up to {dl.maxPoints}. Miss a day and it starts again.
            </Step>
            <Step icon="gift" title="Surprise gifts">
              Up to {gf.maxPerDay} gifts pop up each day as you use the app. Watch a short ad to open one for {gf.minPoints} to {gf.maxPoints} points, or skip it. It’s always your choice.
            </Step>
          </div>
        </div>
      </section>

      <section id="rewards" className="tint">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Rewards</span>
            <h2>
              Real gift cards, <Hl>not coins</Hl>.
            </h2>
            <p className="muted">Four brands people in India actually use. Bigger cards give you more value per point.</p>
          </div>
          <div className="brands">
            {Object.entries(BRANDS).map(([brand, b]) => {
              const cards = catalog.filter((c) => c.brand === brand).sort((x, y) => x.points - y.points);
              if (!cards.length) return null;
              return (
                <div key={brand} className="card brand-card">
                  <BrandMark brand={brand} />
                  <div>
                    <h3>{brand}</h3>
                    <p className="muted small">{b.tagline}</p>
                  </div>
                  <div className="chips">
                    {cards.map((c) => (
                      <span key={c.id} className="chip">
                        {rupees(c.valueMinor)}
                      </span>
                    ))}
                  </div>
                  <p className="from">
                    From <b>{points(cards[0].points)}</b> points
                  </p>
                </div>
              );
            })}
          </div>
          <div className="grid2" style={{ marginTop: 22 }}>
            <div className="card">
              <h3>Points price</h3>
              <table className="price-table">
                <tbody>
                  {prices.map(([v, p]) => (
                    <tr key={v}>
                      <td>{rupees(v)} gift card</td>
                      <td>{points(p)} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <h3>Fair for everyone</h3>
              <p className="muted" style={{ marginTop: 8 }}>
                To keep rewards sustainable and stop cheating:
              </p>
              <ul className="ticks compact">
                <Tick icon="lock">Gift cards unlock once your account is {rd.minAccountAgeDays} days old</Tick>
                <Tick icon="gift">One gift card every {rd.cooldownDays} days</Tick>
                <Tick icon="shield">Points come from real steps only. Shaking machines, emulators and duplicate accounts are blocked.</Tick>
                <Tick icon="mail">Outside India? Keep collecting. Cards for more countries are coming.</Tick>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="invite">
        <div className="wrap grid2 center-y">
          <div>
            <span className="eyebrow">Invite friends</span>
            <h2>
              Walk together, <Hl>earn together</Hl>.
            </h2>
            <p className="muted big">
              Share your invite link from the app. When your friend joins with your code and reaches their daily goal on {r.qualifyingGoalDays} days, you get {r.referrerPoints} points and they get{' '}
              {r.refereePoints}.
            </p>
          </div>
          <div className="card invite-demo">
            <div className="invite-ico">
              <Icon name="people" />
            </div>
            <p className="muted">Your invite link looks like this</p>
            <div className="code linkcode">
              {siteHost()}/r/<span>YOURCODE</span>
            </div>
            <p className="muted small">Find it in the app under Home, then Invite.</p>
          </div>
        </div>
      </section>

      <section className="tint">
        <div className="wrap grid2">
          <div>
            <span className="eyebrow">Installing</span>
            <h2>
              Install in a <Hl>minute</Hl>.
            </h2>
            <p className="muted big">StrideRewards is downloaded from this website instead of the Play Store, so Android asks you to confirm before installing. That’s normal for apps from the web.</p>
          </div>
          <div className="card">
            <InstallSteps />
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap narrow">
          <div className="head">
            <span className="eyebrow">FAQ</span>
            <h2>Questions, answered.</h2>
          </div>
          {FAQ(rules.dailyCap, cheapest).map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <h2>Your next walk could be worth something.</h2>
          <p>Download StrideRewards and claim your first points today.</p>
          <DownloadButton label="Download StrideRewards" />
        </div>
      </section>
    </Layout>
  );
}

function Step({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <div className="card lift">
      <div className="step-n">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      <p className="muted">{children}</p>
    </div>
  );
}

function Tick({ title, icon = 'check', children }: { title?: string; icon?: IconName; children: ReactNode }) {
  return (
    <li>
      <Icon name={icon} />
      <span>
        {title ? <b>{title} </b> : null}
        {children}
      </span>
    </li>
  );
}

function PhoneRow({ kind = '', icon, label, pts }: { kind?: string; icon: IconName; label: string; pts: string }) {
  return (
    <div className={`row ${kind}`}>
      <span className="dot">
        <Icon name={icon} />
      </span>
      {label}
      <span className={`pts${kind ? '' : ' muted'}`}>{pts}</span>
    </div>
  );
}

export function InstallSteps() {
  return (
    <ol className="install">
      <li>
        <span>
          Tap <b>Download for Android</b> and open the file when it finishes.
        </span>
      </li>
      <li>
        <span>
          If asked, allow your browser to <b>install unknown apps</b> (Settings, then this browser, then Allow).
        </span>
      </li>
      <li>
        <span>
          If Google Play Protect asks, tap <b>More details</b>, then <b>Install anyway</b>.
        </span>
      </li>
      <li>
        <span>
          Open StrideRewards, sign in with Google and allow <b>Physical activity</b> so your steps can be counted.
        </span>
      </li>
    </ol>
  );
}
