# Visitor counter acceptance — 2026-10-27

Owner: InterpretingFC implementation in this chat.
Authority: Frank's execute instruction, existing 100-visitor visibility rule,
and FRANK-DEV-OBJECTIVE-TESTING-001 (Library
`libfile_f73ff7b0e6a481918d7cab62db712b32`).
Baseline: `fcdd02f7ac3f6efa418b0758f6394bab23fcf020`.

## Bounded claim and permitted edits

Replace the unavailable counterapi.com integration with our own small browser
counter, using CountAPI's no-account public numeric storage. Keep GitHub Pages,
the site design, language switch and inquiry form. Add an unlisted, read-only
traffic page; no authentication or private-data claim. No new accounts, paid
services, external scripts, tracking cookies or personal identifiers.

The counter estimates distinct browser profiles, not people. Browser storage
clearing, disabled storage, blocked requests, deliberate manipulation, and
ambiguous network failures limit accuracy. Historic counts remain unknown.

## Predeclared acceptance and invariants

- A new browser increments once after successful acknowledgement. Repeat loads
  and page navigation from that stored browser only read. Concurrent calls in
  one instance share one operation; Web Locks serialize supported same-origin
  browser tabs. Without Web Locks, cross-tab races remain possible.
- Preview hosts, automated browser user agents, excluded browsers and the
  traffic page never increment. An excluded browser can still read.
- Browser storage must be writable before an increment. If it is blocked, read
  only; do not silently count every page as a new visitor.
- Invalid responses, HTTP errors and timeouts cannot produce fabricated counts
  or a successful counted marker. A short cooldown avoids immediate retries;
  a timeout after a server write can still duplicate a later retry.
- Reads never increment. A missing key is zero only on the provider's explicit
  `Key not found` response. An unavailable service is never displayed as zero.
- Public footer stays absent below 100; at 100 it appears once in EN/ES.
- Stats refresh does not increment; cached values are visibly dated and marked
  as last known when live reads fail. The no-login stats page is public.
- No form contents, email addresses, browser IDs or full page URLs are sent to
  storage. Requests omit cookies and referrers; the provider still receives
  ordinary connection metadata such as IP addresses.

## Verification and promotion

Use deterministic fixtures with Node's built-in test runner, real isolated
provider keys for hit/read persistence and CORS checks, syntax checks and a
targeted diff. Run `node --test tests/visitor-counter.test.cjs` and
`node --check visitor-counter.js && node --check traffic.js && node --check site.js`.
Record failures before fixing them. Promote only after these checks pass.
Guard the main-branch update against the exact baseline; inspect a changed head
instead of overwriting it. Verify the GitHub Pages deployment and the live
traffic page. Manual administrators can bypass this procedure; it is not a
repository-wide enforced release gate.

Fresh real-browser increment tests use an isolated validation key, not the
production count. The public counter begins at zero; no historic count is
invented. Preserve old source in Git history.
