# HW02 – Domain Testing on EShop

**Course:** Software Testing (FIT - VNUHCM University of Science)
**Exercise ID:** HW02-AI
**Student Name:** Phan Trung Tin
**Student ID:** 23120372
**Submission Date:** (to be filled)
**Self-Assessed Grade:** (to be filled, [000-100])
**SUT:** EShop — https://github.com/ttbhanh/eshop-sut
**Bloom-AI Level:** G9.2 (Apply) · G9.3 (Analyse)

---

## Table of Contents

1. [Feature Selection](#1-feature-selection)
2. [Feature A — FR-02: Login & Account Lockout (Pool A)](#2-feature-a--fr-02-login--account-lockout-pool-a)
3. [Feature B — FR-09: Discount Coupons (Pool B)](#3-feature-b--fr-09-discount-coupons-pool-b)
4. [Feature C — FR-16: Product Import from CSV (Pool C)](#4-feature-c--fr-16-product-import-from-csv-pool-c)
5. [Feature D — FR-20: Mobile App (Pool D)](#5-feature-d--fr-20-mobile-app-pool-d)
6. [Test Summary Report](#6-test-summary-report)
7. [Assessment & Self-Assessment Rubric](#7-assessment--self-assessment-rubric)
8. [References](#8-references)

> Detailed AI Audit Report is in `AI_Audit_Report.md` (Appendix A).
> Bug details are in `Bug_Reports.md` + group's GitHub Issues page.
> This report was produced with the reusable skill `skills/domain-bva-tester/SKILL.md`.

---

## 1. Feature Selection

| Slot | Pool | Selected FR | Rationale (many boundaries) |
| :--- | :--- | :--- | :--- |
| A | Pool A — Auth/Category/Product | **FR-02 Login & account lockout** | Count boundaries (2,3,4 fails) + time boundary (29/30/31s) + counter reset |
| B | Pool B — Cart/Checkout | **FR-09 Discount coupons (C1–C5)** | 5 conjunctive conditions, `min_order-1/min_order/min_order+1`, `max_uses`, `expired_at`, percent/fixed |
| C | Pool C — Web Admin | **FR-16 Product import from CSV** | File boundaries (0/1/N rows), `price<=0`, missing column, RFC4180 quoted commas, atomic rollback |
| D | Pool D — Mobile App | **FR-20 Mobile (incl. cancel per FR-10 state machine)** | State boundaries `pending/confirmed/shipping`, form validation on mobile |

Group non-duplication: confirmed with group members (to be listed in final version).

---

## 2. Feature A — FR-02: Login & Account Lockout (Pool A)

### 2.1 Spec summary (black-box, before code inspection)

- Inputs: Email (`type="email"`), Password.
- After each failed login, counter increments by exactly 1.
- >= 3 consecutive fails → lock 30s (demo env). Generic error message, no cause leak.
- Success returns JWT, sent as `Authorization: Bearer <token>`.
- Step indicator / back-to-login rules belong to FR-03, not FR-02.

### 2.2 Domain Testing (skill Step 1 — black-box, spec-only)

> Method: `skills/domain-bva-tester/SKILL.md` Step 1. Source: SRS v2.0 §FR-02 only.
> Backend/frontend login code was NOT inspected (preserved for Gap Analysis).
> Exact boundary values (fail #2/#3/#4, 29s/30s/31s) are deferred to §2.3 BVA.

#### 2.2.1 Domain variables

| # | Variable | Type | Spec constraint (FR-02) |
| :--- | :--- | :--- | :--- |
| V1 | `email_format` | string | Must be valid email; field uses `type="email"` (HTML5) |
| V2 | `email_registered` | boolean (DB state) | Account must exist; failure message must NOT leak cause |
| V3 | `email_case` | string variant | Spec silent on case sensitivity |
| V4 | `email_spaces` | string variant | Spec silent on leading/trailing whitespace |
| V5 | `password_correct` | boolean | Must match stored credential; empty rejected |
| V6 | `failed_attempts` | integer (account state) | +1 per failed login; `>=3` consecutive fails → lock 30s |
| V7 | `lockout_elapsed` | time (account state) | Lock lasts 30s (demo); only meaningful when locked |
| V8 | `account_status` | enum | `active` vs `locked` (no `disabled` state in spec) |

#### 2.2.2 Equivalence partitions

| Variable | ID | Class | Partition description | Representative value |
| :--- | :--- | :--- | :--- | :--- |
| V1 email_format | VP1.1 | Valid | Syntactically valid email | `test@eshop.com` |
| | IP1.1 | Invalid | Missing `@` | `testeshop.com` |
| | IP1.2 | Invalid | Missing domain part | `test@` |
| | IP1.3 | Invalid | Empty string | `` (empty) |
| V2 email_registered | VP2.1 | Valid | Email exists in DB | `test@eshop.com` (seed) |
| | IP2.1 | Invalid | Well-formed but unregistered | `nouser999@eshop.com` |
| V3 email_case | VP3.1 | Valid | Exact registered case | `test@eshop.com` |
| | SP3.1 | Spec-silent | Different case | `TEST@ESHOP.COM` |
| V4 email_spaces | VP4.1 | Valid | No surrounding spaces | `test@eshop.com` |
| | SP4.1 | Spec-silent | Leading/trailing space | `␣test@eshop.com␣` |
| V5 password_correct | VP5.1 | Valid | Correct password | `Test1234!` |
| | IP5.1 | Invalid | Wrong password | `Wrong123!` |
| | IP5.2 | Invalid | Empty password | `` (empty) |
| V6 failed_attempts | VP6.1 | Valid | Fresh account, 0 prior fails | `0` |
| | VP6.2 | Valid | Below threshold (1–2 fails) | `1` |
| | IP6.1 | Invalid(=locked) | At/above threshold | `3` (just locked) |
| V7 lockout_elapsed | IP7.1 | Invalid | Still inside lock window | retry immediately after lock |
| | VP7.1 | Valid | Lock window expired | retry after 60s wait |
| V8 account_status | VP8.1 | Valid | Active | normal account |
| | IP8.1 | Invalid | Temporarily locked (30s) | account right after 3rd fail |

`SP` = spec-silent partition (no expected behavior defined; actual recorded at execution, prime Gap-Analysis material).

#### 2.2.3 Domain test cases

| TC_ID | Partition / combination | Input data | Pre-conditions | Steps | Expected output | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-FR02-DOM-01 | All-VP happy path | `test@eshop.com` / `Test1234!` | Fresh seed account, 0 fails, active | 1. Open login 2. Enter creds 3. Submit | Login success, JWT returned (`Authorization: Bearer <token>`) | 200 + JWT (D3-seed-happy-path) | PASSED |
| TC-FR02-DOM-02 | IP1.1 bad format | `testeshop.com` / `Test1234!` | Active account | Submit login | Rejected (HTML5 `type=email` block or server 400); must not authenticate | 401, not authenticated (C1). Note: UI uses `type=text`, so no HTML5 block — server rejects | PASSED |
| TC-FR02-DOM-03 | IP1.3 + IP5.2 empty | `` / `` | Active account | Submit login | Rejected, required-field handling | 401 at API (C2); UI blocks via `required` | PASSED |
| TC-FR02-DOM-04 | IP2.1 unregistered | `nouser999@eshop.com` / `Any123!x` | Email not in DB | Submit login | Generic error only — indistinguishable from wrong-password message (no existence leak) | 401 identical message (C0) | PASSED |
| TC-FR02-DOM-05 | VP2.1 + IP5.1 first fail | `test@eshop.com` / `Wrong123!` | 0 prior fails | Submit login | Generic error; `failed_attempts` = 1 | 401 but attempts = **2** (A1) → FR02-BUG-01 | FAILED |
| TC-FR02-DOM-06 | IP5.2 empty password | `test@eshop.com` / `` | 0 prior fails | Submit login | Validation error (HTTP 400 / blocked at form); `failed_attempts` NOT incremented — if backend counts it as a fail toward lockout, log as defect (student decision 16/10) | 401, attempts 2→**4** (C3) → FR02-BUG-03 | FAILED |
| TC-FR02-DOM-07 | VP6.2 below threshold | `test@eshop.com` / `Wrong123!` | 1 prior consecutive fail | Submit login | Generic error; counter = 2; account still NOT locked | 2nd fail → **locked**, attempts = 4 (A2) → FR02-BUG-01 | FAILED |
| TC-FR02-DOM-08 | IP6.1 threshold reached | `test@eshop.com` / `Wrong123!` | 2 prior consecutive fails | Submit login (3rd fail) | Account locked for 30s; lockout message | Already locked since 2nd fail; 3rd submit → 403; duration **180s** not 30s → FR02-BUG-01/02 | FAILED |
| TC-FR02-DOM-09 | IP8.1 + IP7.1 locked, correct creds | `test@eshop.com` / `Test1234!` | Account just locked | Submit immediately | Still rejected — lock takes precedence over correct password | 403 locked-message (A3) | PASSED |
| TC-FR02-DOM-10 | VP7.1 lock expired | `test@eshop.com` / `Test1234!` | Locked, then wait 60s | Submit after wait | Login success (lock lifted) | Still 403 at 60s (180s lock); success only after ~180s/simulated expiry (A5, G4) → FR02-BUG-02 | FAILED |
| TC-FR02-DOM-11 | Counter reset on success ★ Gap-analysis focus | `test@eshop.com` / `Test1234!` | 2 prior consecutive fails | Submit correct creds | Success AND consecutive-fail counter resets to 0 ("consecutive" per spec — student-confirmed 16/10) | 200, attempts reset to 0, `locked_until` NULL (A5/H1) | PASSED |
| TC-FR02-DOM-12 | Post-reset threshold ★ Gap-analysis focus | `test@eshop.com` / `Wrong123!` ×2 | Right after DOM-11 success | Fail twice | Generic errors, counter = 2, NOT locked (proves reset) | 2 fails after reset → **locked**, attempts = 4 (H2) → FR02-BUG-01 | FAILED |
| TC-FR02-DOM-13 | SP3.1 case variant | `TEST@ESHOP.COM` / `Test1234!` | Active account | Submit login | Student standard: expect case-insensitive accept; record actual at execution | 401 (D1) → FR02-BUG-06 | FAILED |
| TC-FR02-DOM-14 | SP4.1 surrounding spaces | `␣test@eshop.com␣` / `Test1234!` | Active account | Submit login | Student standard: expect auto-trim accept; record actual at execution | 401 (D2) → FR02-BUG-06 | FAILED |
| TC-FR02-DOM-15 | Message uniformity (O-domain) | wrong-pwd vs unregistered-email | Clean state | Run DOM-04 vs DOM-05, compare responses | Both responses identical in text + HTTP status (no cause leak) | 401/401 identical (C0). Note: 403-locked class differs once locked | PASSED |

Deferred to BVA (§2.3): fail-count edges 2/3/4, lockout timing 29s/30s/31s, counter-increment exactness (+1, no double-count on double-click), email max-length (spec-silent).

### 2.3 Boundary Value Analysis (skill Step 2 — black-box, spec-only)

> Method: `skills/domain-bva-tester/SKILL.md` Step 2. Thresholds from SRS: lock at `failed_attempts >= 3`, lock duration 30s.
> Login code still NOT inspected. Points already covered by DOM TCs are referenced, not duplicated.

#### 2.3.1 Boundaries and step units

| # | Boundary | Threshold | Step unit (u) | Operator under test |
| :--- | :--- | :--- | :--- | :--- |
| B1 | Consecutive-fail count | T = 3 | u = 1 attempt | `>= 3` vs `> 3` vs `>= 2` (off-by-one) |
| B2 | Lockout elapsed time | T = 30s | u = 1s | `< 30` vs `<= 30` (expiry edge) |
| B3 | Input string length | 0 / 8* | u = 1 char | empty vs min+; hidden client pre-check? (*8 borrowed from FR-01 policy — FR-02 states none) |
| B4 | Counter increment size | +1 | u = 1 | exactly +1 per fail (no double-count on double-submit) |
| B5/B6 | Multi-variable | B1×correctness, B2×correctness | — | threshold × credential-correctness interaction |

#### 2.3.2 BVA point analysis

**B1 — fail count (T=3, u=1):**

| Point | Value | Role | Rationale | Covered by |
| :--- | ---: | :--- | :--- | :--- |
| below | 0–1 | interior | No boundary significance | DOM-01/05 |
| max- | 2 | just below threshold | Guards `>= 2` bug (would lock one fail early) | BVA-01 |
| min (threshold) | 3 | transition | Decides `>= 3` vs `> 3` (latter locks only at 4) | BVA-02 |
| max+ | 4 | just above threshold | Lock persists; counter must not extend lock window | BVA-03 |

**B2 — lockout elapsed (T=30s, u=1s):**

| Point | Value | Role | Rationale | Covered by |
| :--- | ---: | :--- | :--- | :--- |
| min | 0s | just locked | Lock effective immediately | DOM-09 |
| min+ | 1s | inside window | No early release | (implied; DOM-09) |
| nom | 15s | mid-window sanity | Monotonic hold, guards timer bugs | BVA-08 |
| max- | 29s | just before expiry | Still locked; guards `< 29`/`<= 29` bug | BVA-05 |
| edge | 30s | expiry instant | Decides `< 30` vs `<= 30` — record actual | BVA-06 |
| max+ | 31s | just after expiry | Lock definitely lifted | BVA-07 |

**B3 — input length (u=1 char):**

| Point | Value | Role | Rationale | Covered by |
| :--- | ---: | :--- | :--- | :--- |
| min | 0 chars | empty | Validation, no counter increment (per DOM-06 decision) | DOM-03/06 |
| min+ | 1 char | shortest non-empty | Format/length rejection path | BVA-10 |
| min- (vs 8) | 7-char password | below FR-01 minimum | Probes hidden client pre-check; FR-02 expects server-processed generic error | BVA-11 |
| max+ | 1000 chars | extreme length | Graceful rejection, no 500/hang/truncation login | BVA-12 |

**B4 — increment exactness:** double-submit of one wrong attempt must yield +1, not +2 (BVA-13).

**Multi-variable:** count=3 × correct password → success, no lock (BVA-04); time=30s × wrong password → fresh-window fail #1, not instant relock (BVA-09).

#### 2.3.3 BVA test cases

| TC_ID | Boundary / point | Input data | Pre-conditions | Steps | Expected output | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-FR02-BVA-01 | B1 max- (2 fails) | `test@eshop.com` / `Wrong123!` | 1 prior consecutive fail | Submit (2nd fail) | Generic error; counter = 2; NOT locked | 2nd fail → **locked**, counter = 4 (A2) → FR02-BUG-01 | FAILED |
| TC-FR02-BVA-02 | B1 threshold (3rd fail) | `test@eshop.com` / `Wrong123!` | 2 prior consecutive fails | Submit (3rd fail) | Locked 30s (proves `>= 3`, not `> 3`) | Locks — but already on 2nd fail and for 180s → FR02-BUG-01/02 | FAILED |
| TC-FR02-BVA-03 | B1 max+ (4th submit, locked) | `test@eshop.com` / `Test1234!` | Just locked | Submit twice more | Still rejected; lock window NOT extended (no sliding-window relock) | 403 + DB unchanged (A4) | PASSED |
| TC-FR02-BVA-04 | B1×correct (3rd try correct) ★ | `test@eshop.com` / `Test1234!` | 2 prior consecutive fails | Submit correct creds | Success, no lock (threshold counts fails only), counter reset | 403 — locked since 2nd fail, correct-at-3rd impossible (F2) → FR02-BUG-01 | FAILED |
| TC-FR02-BVA-05 | B2 max- (29s) | correct creds | Locked 29s ago | Submit at 29s | Still rejected (locked) | 403 at 29.0s (G2) | PASSED |
| TC-FR02-BVA-06 | B2 edge (30s) ★ | correct creds | Locked 30s ago | Submit at 30s | Operator determination: record accept/reject (`< 30` vs `<= 30`) | 403 at 30.0s (G3) — masked by 180s duration; code isolates operator as `<` (server.js:40) → FR02-BUG-02 | FAILED |
| TC-FR02-BVA-07 | B2 max+ (31s) | correct creds | Locked 31s ago | Submit at 31s | Success (lock lifted) | 403 at 31.1s (G4) → FR02-BUG-02 | FAILED |
| TC-FR02-BVA-08 | B2 nom (15s) | correct creds | Locked 15s ago | Submit at 15s | Still rejected (mid-window hold) | 403 at 15.0s (G1) | PASSED |
| TC-FR02-BVA-09 | B2×wrong (fail at 30s) ★ | `test@eshop.com` / `Wrong123!` | Lock just expired (~30s) | Submit wrong creds | Generic error as fresh-window fail #1 (counter = 1), NOT instant relock | 401 but attempts = **6** + relocked (B1) → FR02-BUG-04 | FAILED |
| TC-FR02-BVA-10 | B3 min+ (1 char) | `a` / `b` | Active account | Submit | Rejected (format/length); record counter behavior | 401 in 2ms, graceful (E1) | PASSED |
| TC-FR02-BVA-11 | B3 min- (7-char pwd) | `test@eshop.com` / `Abc123!` (7) | Active account | Submit | Generic wrong-password error (no length rule in FR-02); any client-side block recorded as extra-spec behavior | 401 generic in 3ms (E2); no hidden pre-check at API | PASSED |
| TC-FR02-BVA-12 | B3 max+ (1000 chars) | 1000-char email / 1000-char password | Active account | Submit | Graceful rejection, no 500/timeout/partial login | 401 in 12ms, no 500 (E3) | PASSED |
| TC-FR02-BVA-13 | B4 increment exactness | `test@eshop.com` / `Wrong123!` | 0 prior fails | Double-click submit rapidly for ONE attempt | Counter = 1 (exactly +1, no double-count) | 0→**2** for two concurrent fails: unit is +2 **and** lost update (F1) → FR02-BUG-01/10 | FAILED |

FR-02 total: 15 DOM + 13 BVA + 9 GAP = **37 TCs**. Executed 16/10/2026 via `scripts/exec_fr02.js` (25 API steps, fresh users per scenario, ±1s tolerance on timing probes, ms-precision DB timestamps; lock expiry simulated via DB where noted).

### 2.4 AI Gap Analysis & Human Review

> White-box sources: `eshop-sut/backend/server.js:32-66` (login route), `backend/database.js:50-61,91-94` (users table + seeds), `frontend-web/src/pages/Login.jsx`, `frontend-web/src/context/AuthContext.jsx:26-35`.

#### 2.4.1 How the code actually implements login/lockout

| Spec question | Code answer | File:line |
| :--- | :--- | :--- |
| Counter storage | DB column `users.login_attempts` (+ `locked_until`); persists across restarts | database.js:56-57 |
| Increment per fail | **+2, not +1** (`user.login_attempts + 2`) | server.js:54 |
| Lock threshold | `newAttempts >= 3` — with +2 steps, lock fires on the **2nd** consecutive fail (0→2→4) | server.js:56 |
| Lock duration | `Date.now() + 180000` = **180s (3 min), not 30s** | server.js:57 |
| Expiry operator | `new Date() < new Date(locked_until)` → locked while `now < until`; exactly at `until` = unlocked (`<` semantics) | server.js:40 |
| Reset on success | Yes: `login_attempts = 0, locked_until = NULL` | server.js:47-50 |
| Reset on expiry | **None** — stale counter survives; first wrong attempt after expiry re-arms lock immediately (4+2=6) | server.js:54-62 |
| Submit while locked | Early 403 return, DB untouched (no sliding-window extension) | server.js:40-44 |
| Email normalization | **None** — exact `WHERE email = ?`, no `trim()`/`toLowerCase()` (SQLite BINARY match) | server.js:35 |
| Empty password | Counted as a fail (**+2**) — no validation | server.js:46-54 |
| Unknown vs wrong-pwd | Both 401 `"Invalid email or password"` — uniform, good | server.js:37-38,63 |
| Locked response | Distinct 403 `"Tài khoản đã bị khóa..."` — reveals locked state | server.js:40-44 |
| Login success body | Returns **full `user` row including plaintext `password`**; passwords stored plaintext (seed + register raw insert) | server.js:52, database.js:92-93, server.js:20-30 |
| JWT | No `expiresIn`, hardcoded `SECRET_KEY` in source | server.js:9,51 |
| Login form | Email `type="text"` (spec: `type="email"`); password `type="text"` (spec: `type="password"`, FR-22); heading `"Đăng Ký"` in `<h2>` (FR-21: one `<h1>`); label `Username`, button `Sign In` (FR-21: Vietnamese); error rendered **below** form (FR-22: above submit); submit has `tabIndex={1}` (FR-21 tab order); UI swallows 403 into generic `"Đăng nhập thất bại..."` so users never see lockout state | Login.jsx:24,28-46,53-59,61-66; AuthContext.jsx:27-33 |
| Cross-FR note (for FR-03 phase) | Forgot-password OTP is **4-digit** (`1000+random*9000`) vs FR-03 spec 6-digit | server.js:72 |

#### 2.4.2 What the 28 black-box TCs missed or assumed differently

| # | Miss / clash | Root cause |
| :--- | :--- | :--- |
| M1 | Assumed +1 increment (DOM-05/07, BVA-01/13) — code uses +2 | **Dev bug** contradicting explicit spec ("đúng 1 đơn vị"); LLM assumed spec-faithful implementation |
| M2 | Assumed 30s lock (DOM-08/10, BVA-05…09) — code uses 180s | **Dev bug** (wrong constant `180000`); black-box timing TCs all shift |
| M3 | Assumed lock on 3rd fail (BVA-02) — code locks on 2nd | Derived from M1; **LLM never questioned the increment operator** |
| M4 | Assumed expiry starts a fresh window (BVA-09) — stale counter re-arms lock instantly | **Dev bug** (no reset-on-expiry); LLM assumed symmetric state machine |
| M5 | Never probed response-body shape — plaintext password leak missed | **LLM blind spot**: output-domain analysis stopped at status/message, ignored payload fields |
| M6 | Never cross-checked GUI spec (FR-21/22) on the login form — `type=text`, wrong heading, error placement missed | **LLM blind spot**: treated FR-02 as API-only, skipped form-level requirements stated in the same spec |
| M7 | Empty-password counting (DOM-06) — code counts +2, no validation | **Dev bug** (missing validation); student review decision already flagged the right expectation |
| M8 | Correctly hedged via SP3.1/SP4.1 — code confirms no normalization | **Spec gap** (spec silent); black-box hedging was the right call, now confirmed as usability defect vs normalization standard |

#### 2.4.3 Supplementary white-box test cases

| TC_ID | Discovery | Steps (high level) | Expected (spec/standard) | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TC-FR02-GAP-01 | Early lock (M1+M3) | Fresh account → wrong pwd ×2 | 2nd fail must NOT lock (counter = 2) | 2nd fail → locked, attempts = 4 (A2) → FR02-BUG-01 | FAILED |
| TC-FR02-GAP-02 | Duration (M2) | Lock account → read `locked_until − now` (ms) | ≈ 30 000 ms, not ≈ 180 000 ms | **179 377 ms** ≈ 180s; 403 at 15/29/30/31s → FR02-BUG-02 | FAILED |
| TC-FR02-GAP-03 | Empty-pwd count (M7) | Fresh account → submit empty password via API | Validation error, counter unchanged | 401, attempts 2→4 (C3) → FR02-BUG-03 | FAILED |
| TC-FR02-GAP-04 | Stale-counter relock (M4) | Lock → expire (or simulate) → 1 wrong attempt | Fresh-window fail #1 (counter = 1), no instant relock | 401 but attempts = 6 + relocked (B1) → FR02-BUG-04 | FAILED |
| TC-FR02-GAP-05 | Password leak (M5) | Successful login → inspect response body | No `password` field in response; no plaintext storage (SEC-01) | Response carries plaintext `"Cx123456!"`; `/users/me` too; DB stores plaintext → FR02-BUG-05 | FAILED |
| TC-FR02-GAP-06 | Case sensitivity (M8) | `TEST@ESHOP.COM` + correct pwd | Accept (case-insensitive standard) | 401 (D1) → FR02-BUG-06 | FAILED |
| TC-FR02-GAP-07 | Whitespace (M8) | `␣test@eshop.com␣` + correct pwd | Accept (auto-trim standard) | 401 (D2) → FR02-BUG-06 | FAILED |
| TC-FR02-GAP-08 | Form input types (M6) | Inspect login form fields | Email `type="email"`, password `type="password"` | Both `type="text"` — password visible (Login.jsx:30,40; FR02_UI_LOGIN_PAGE.png) → FR02-BUG-07 | FAILED |
| TC-FR02-GAP-09 | Form feedback/i18n (M6) | Inspect headings, labels, error placement, tab order; trigger lockout in UI | Vietnamese `<h1>` title, error above submit, natural tab order, visible lockout state | Heading `"Đăng Ký"` in `<h2>`, `Username`/`Sign In` (EN), error below form, `tabIndex={1}`, 403 swallowed into generic message (Login.jsx:24,53-66) → FR02-BUG-08 | FAILED |

### 2.5 Execution & Bugs

> Executed 16/10/2026, 37/37 TCs. **13 PASSED, 24 FAILED → 10 bugs** (details: `Bug_Reports.md` §FR-02; screenshots: `screenshots/FR02_UI_LOGIN_PAGE.png`, `screenshots/FR02_API_EVIDENCE.png`; raw transcript: `scripts/exec_fr02_results.json`; runner: `scripts/exec_fr02.js`).
> Test accounts `exec*` left in DB (documented; seed accounts untouched except counter-resetting successful logins).

| Bug ID | Title | Severity | Evidence | Related TCs |
| :--- | :--- | :--- | :--- | :--- |
| FR02-BUG-01 | Fail counter increments by +2 → lockout fires on 2nd fail (spec: +1, lock on 3rd) | Critical | API evidence PNG (A1/A2/F2) + server.js:54 | DOM-05/07/08/12, BVA-01/02/04/13, GAP-01 |
| FR02-BUG-02 | Lockout lasts ~180s instead of 30s | High | API evidence PNG (deltaMs 179377; G1–G4) + server.js:57 | DOM-08/10, BVA-05…09, GAP-02 |
| FR02-BUG-03 | Empty password counted as failed attempt (+2) | High | API evidence PNG (C3) + server.js:46-54 | DOM-06, GAP-03 |
| FR02-BUG-04 | Stale counter: first wrong attempt after expiry instantly re-arms lock (4→6) | High | API evidence PNG (B1) + server.js:54-62 | BVA-09, GAP-04 |
| FR02-BUG-05 | Plaintext password in `POST /api/login` + `GET /api/users/me` responses; plaintext storage (SEC-01) | High (Security) | API evidence PNG (A5/A6) + server.js:52, database.js:92-93 | GAP-05 |
| FR02-BUG-06 | No email normalization — uppercase / spaced emails rejected | Medium | API evidence PNG (D1/D2) + server.js:35 | DOM-13/14, GAP-06/07 |
| FR02-BUG-07 | Login form: email + password inputs are `type="text"` (password visible on screen) | Medium | UI screenshot + Login.jsx:30,40 | GAP-08 |
| FR02-BUG-08 | Login page: wrong `"Đăng Ký"` heading (`<h2>`), EN labels/buttons, error below form, `tabIndex={1}`, 403 lockout swallowed into generic message | Low | UI screenshot + Login.jsx:24,53-66 | GAP-09 |
| FR02-BUG-09 | JWT never expires (`no expiresIn`) + hardcoded `SECRET_KEY` in source | Medium (Security) | server.js:9,51 | — (code inspection) |
| FR02-BUG-10 | Lost update: two concurrent fails collapse 0→2 (read-modify-write + fire-and-forget `db.run`) | Medium | API evidence PNG (F1) + server.js:54-62 | BVA-13 |

GitHub Issues: to be filed on the group repo with the PNGs attached (links added here after filing).

---

## 3. Feature B — FR-09: Discount Coupons (Pool B)

### 3.1 Spec summary

- 5 conditions must ALL hold: C1 code exists & `is_active=1`; C2 `now < expired_at`; C3 `total >= min_order_amount`; C4 valid JWT; C5 `used_count < max_uses_per_user`.
- `percent: discount = total*value/100`; `fixed: discount = value`; `final = total - discount`.
- Sample codes: `SAVE10` (10%, min 300k, 2099-12-31, 1 use), `BIGBUY` (50k fixed, min 500k, 2099, 1), `VIP100` (100k fixed, min 300k, 2099, 2), `EXPIRED` (20%, min 100k, 2020-01-01, 1).

### 3.2 Domain Testing

> TODO: `FR09-DT-*`.

### 3.3 Boundary Value Analysis

> TODO: `total = min_order-1/min_order/min_order+1` per code, `expired_at` day boundaries, `max_uses` 1st/2nd/3rd use, `FR09-BVA-*`.

### 3.4 AI Gap Analysis & Human Review

> TODO.

### 3.5 Execution & Bugs

> TODO.

---

## 4. Feature C — FR-16: Product Import from CSV (Pool C)

### 4.1 Spec summary

- File must end `.csv`; header `name,price,description,imageUrl,category_id`; RFC4180 quoted commas.
- Pre-validation: `name` non-empty; `price` positive number.
- Any row error → full rollback (all-or-nothing); clear success/error count report.

### 4.2 Domain Testing

> TODO: `FR16-DT-*`.

### 4.3 Boundary Value Analysis

> TODO: 0/1/N rows, price `0/0.01/-1/abc`, empty name, bad header, `FR16-BVA-*`.

### 4.4 AI Gap Analysis & Human Review

> TODO.

### 4.5 Execution & Bugs

> TODO.

---

## 5. Feature D — FR-20: Mobile App (Pool D)

### 5.1 Spec summary

- Full flows: view products, register, login, logout, cart, checkout, profile, order history.
- Cancel obeys FR-10 state machine: only `pending`/`confirmed` cancellable; `shipping` user-cancel forbidden (admin only); `delivered`/`canceled` terminal.

### 5.2 Domain Testing

> TODO: `FR20-DT-*`.

### 5.3 Boundary Value Analysis

> TODO: cancel at each state transition, form edges (phone 9/10/11/12 digits, password 7/8 chars), `FR20-BVA-*`.

### 5.4 AI Gap Analysis & Human Review

> TODO.

### 5.5 Execution & Bugs

> TODO.

---

## 6. Test Summary Report

> TODO (final stage): fill after execution.

| Feature | Designed | Executed | Passed | Failed | Not executed | Bugs |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| FR-02 | 37 | 37 | 13 | 24 | 0 | 10 |
| FR-09 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-16 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-20 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **37** | **37** | **13** | **24** | **0** | **10** |

Demo videos: TODO (YouTube Unlisted links for skill end-to-end demo).

---

## 7. Assessment & Self-Assessment Rubric

| No. | Criteria | Max | Self-Assessed | Justification |
| :--- | :--- | ---: | ---: | :--- |
| 1 | Feature A — FR-02 (Domain + Boundary) | 25 | TBD | TBD after execution |
| 2 | Feature B — FR-09 (Domain + Boundary) | 25 | TBD | TBD |
| 3 | Feature C — FR-16 (Domain + Boundary) | 25 | TBD | TBD |
| 4 | Feature D — FR-20 Mobile (Domain + Boundary) | 15 | TBD | TBD |
| 5 | Agent Skills + demo videos | 10 | TBD | `skills/domain-bva-tester/` + YouTube link |
| **Total** | | **100** | **TBD** | |

---

## 8. References

1. ISTQB. *Certified Tester Foundation Level (CTFL) Syllabus v4.0*.
2. Hardman, P. (2025). *A Post-AI Learning Taxonomy*.
3. Fuster Rabella, M. (2025). *OECD Education Working Paper No. 338*.
4. Anthropic (2025). *Building Reliable AI Test Agents*.
5. EShop SUT — https://github.com/ttbhanh/eshop-sut (SRS v2.0, 2026-05-14).
