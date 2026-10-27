# InterpretingFC.github.io

## No-account visitor counter — 2026-10-27

Open **https://interpretingfc.com/traffic.html** to read the count. No login is
needed and opening or refreshing stats does not add visitors. Bookmark the
page. Use **Exclude this browser** on each of your devices to keep your own
future visits out. The page dates its last successful count check.

The existing `site.js` loads `visitor-counter.js` on the five public pages.
It counts each browser once using first-party local storage, then only reads
the total on repeat visits. The public footer remains hidden below 100 and
shows EN/ES labels at 100. The traffic page always shows the available total.
For a manual installation, drop `visitor-counter.js`, `traffic.html` and
`traffic.js` next to the site files, and use the included updated `site.js`.
No npm install, build command, PHP, SDK, API key or new account is required.

Only the numeric total is stored by the no-signup CountAPI service at
`countapi.mileshilliard.com` (not `counterapi.com`). The first-party JavaScript
is ours. Browser requests omit credentials and referrers and send no inquiry
data or visitor identifiers. The provider receives normal connection metadata.
The storage key and count are public; this is not an authenticated analytics
system and someone who knows the key can alter its value.

### Accuracy and availability

- The total estimates browser profiles, not verified people. Clearing browser
  data, another device/browser, network ambiguity, or deliberate manipulation
  may overcount. Blocked requests/storage, long outages and bots may undercount.
- A 10-minute cooldown follows an attempted write. After a timeout, a later
  retry may duplicate a write that the server accepted without acknowledging.
- Web Locks serialize supported same-origin tabs. Without Web Locks, races
  between tabs are still possible. `www` and bare-domain browser storage are
  separate; use the canonical bare domain.
- An outage shows an explicit unavailable/stale status in stats. A last-known
  value is dated and never presented as a live read. A failed public counter
  stays hidden so it cannot interfere with the site.
- This provider has no guaranteed uptime. There is no honest way to eliminate
  all outside storage on GitHub Pages. No account or setup is required of Frank.
- Counts start October 27, 2026. Old CounterAPI totals have not been recovered
  and are not fabricated or added. Tests use a different key from production.
- Stats are public but unlinked and marked `noindex,nofollow`; this is not
  password protection.

### Verification

The reproducible tests are retained in `counter-tests.zip`; extract it into
the repository root, then run `node --test tests/visitor-counter.test.cjs tests/traffic-page.test.cjs`
and syntax-check the three JS files. Acceptance criteria and invariants are in `COUNTER_ACCEPTANCE.md`.
The dated verification receipt documents actual outcomes and remaining limits.
