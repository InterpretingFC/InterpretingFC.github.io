# Visitor counter verification — October 27, 2026

Created / last modified: 2026-10-27, America/Los_Angeles.
Verified at: 2026-10-27 10:26:24 UTC (03:26:24 PDT), before publication.
Scope: first-party JS behavior plus isolated real provider persistence/CORS.
Acceptance contract: `COUNTER_ACCEPTANCE.md`.
Governing law: FRANK-DEV-OBJECTIVE-TESTING-001, Library
`libfile_f73ff7b0e6a481918d7cab62db712b32`.

## Results

- PASS: `node --test tests/visitor-counter.test.cjs` — 17 tests passed,
  0 failed, 0 skipped. Deterministic fixtures cover repeat visits, fresh
  browsers, concurrent calls/tabs, exclusions, preview/crawler behavior,
  blocked storage, read-only stats, malformed responses, HTTP failure,
  timeout/abort/cooldown, cached outages, privacy options and the 100 threshold.
- PASS: `node --check visitor-counter.js`, `node --check traffic.js`,
  `node --check site.js`, and `git diff --check`.
- PASS: `node tests/provider-live.cjs` with isolated key
  `interpretingfc-validation-20261027-73edcff72c95fdbd`.
  Observed sequence: 0 → 1 → 1 → 2 → 2 → 2; exactly two writes.
  Request statuses: GET 404; HIT 200; GET 200; HIT 200; GET 200; GET 200.
  Every response allowed CORS origin `https://interpretingfc.com`.
  The production key was not written by this test.
- INSPECTED: production-key read returned HTTP 404 with
  `{"error":"Key not found"}`, meaning no new counter total exists yet.
- INSPECTED: the first 268 lines of `site.js` are byte-identical to the baseline;
  their SHA-256 is
  `ee6bcd4da4804f46dc9d2355d05cd2962040873305e2b159c943d9c84a040b48`.
  This preserves form and language code. The five content pages, shared CSS,
  images and domain configuration are unmodified.
- FAILED dependency check preserved: the old counterapi.com read-only
  request timed out after 15 seconds with no response. Its historic total
  remains unknown and is not migrated as zero.

The provider is an external, no-account numeric store. This is not a fully
self-hosted backend or proof of future availability. Its counter values are
publicly writable; distinct browsers are estimates rather than verified
people. Tests prove only the bounded invariants above. They do not establish
adversarial accuracy, cross-device deduplication or universal outage recovery.

## Publication

Main-branch update and GitHub Pages/live-browser verification are recorded
after deployment. The prepublication checks do not themselves prove deployment.
The connected GitHub write returned HTTP 403 (`Resource not accessible by
integration`); unauthenticated Git push was also unavailable. Browser upload
uses the existing signed-in GitHub account. Test sources are retained in
`counter-tests.zip` with their original `tests/` paths.

## Tested identities

Runtime: Node.js v24.22.1, Linux executor; built-in test runner and curl for
real HTTP integration. No new dependencies were installed.

SHA-256:

| File | Hash |
| --- | --- |
| visitor-counter.js | a5ed4465ffbba80ca4ad11deba7565bc225ec983b0d88977b27ef3aae2081bdb |
| traffic.js | 295aef3ad310cd3b31f60aeeccbf370daa594cfe88282e1c802c3e063757662b |
| site.js | c1e034581b5e32fc052a7eb1008dac75ab39fb41178f2f17a079596c7cc3f253 |
| traffic.html | af846aef19bfd65f88a7f505b60efeccbe063302799b5243f2b63c1c5fd2c6b2 |
| tests/visitor-counter.test.cjs | 5f02072257d5131c002432baeac8a850db5b4d8cc56c0c96d802d3479528ccdd |
| tests/provider-live.cjs | 4302e5b644fab226ac73f62f3597ff71a1f87f760d12e7d5caf9a76b2ff69b9d |
