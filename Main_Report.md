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
| TC-FR02-DOM-01 | All-VP happy path | `test@eshop.com` / `Test1234!` | Fresh seed account, 0 fails, active | 1. Open login 2. Enter creds 3. Submit | Login success, JWT returned (`Authorization: Bearer <token>`) | — | Pending Execution |
| TC-FR02-DOM-02 | IP1.1 bad format | `testeshop.com` / `Test1234!` | Active account | Submit login | Rejected (HTML5 `type=email` block or server 400); must not authenticate | — | Pending Execution |
| TC-FR02-DOM-03 | IP1.3 + IP5.2 empty | `` / `` | Active account | Submit login | Rejected, required-field handling | — | Pending Execution |
| TC-FR02-DOM-04 | IP2.1 unregistered | `nouser999@eshop.com` / `Any123!x` | Email not in DB | Submit login | Generic error only — indistinguishable from wrong-password message (no existence leak) | — | Pending Execution |
| TC-FR02-DOM-05 | VP2.1 + IP5.1 first fail | `test@eshop.com` / `Wrong123!` | 0 prior fails | Submit login | Generic error; `failed_attempts` = 1 | — | Pending Execution |
| TC-FR02-DOM-06 | IP5.2 empty password | `test@eshop.com` / `` | 0 prior fails | Submit login | Validation error (HTTP 400 / blocked at form); `failed_attempts` NOT incremented — if backend counts it as a fail toward lockout, log as defect (student decision 16/10) | — | Pending Execution |
| TC-FR02-DOM-07 | VP6.2 below threshold | `test@eshop.com` / `Wrong123!` | 1 prior consecutive fail | Submit login | Generic error; counter = 2; account still NOT locked | — | Pending Execution |
| TC-FR02-DOM-08 | IP6.1 threshold reached | `test@eshop.com` / `Wrong123!` | 2 prior consecutive fails | Submit login (3rd fail) | Account locked for 30s; lockout message | — | Pending Execution |
| TC-FR02-DOM-09 | IP8.1 + IP7.1 locked, correct creds | `test@eshop.com` / `Test1234!` | Account just locked | Submit immediately | Still rejected — lock takes precedence over correct password | — | Pending Execution |
| TC-FR02-DOM-10 | VP7.1 lock expired | `test@eshop.com` / `Test1234!` | Locked, then wait 60s | Submit after wait | Login success (lock lifted) | — | Pending Execution |
| TC-FR02-DOM-11 | Counter reset on success ★ Gap-analysis focus | `test@eshop.com` / `Test1234!` | 2 prior consecutive fails | Submit correct creds | Success AND consecutive-fail counter resets to 0 ("consecutive" per spec — student-confirmed 16/10) | — | Pending Execution |
| TC-FR02-DOM-12 | Post-reset threshold ★ Gap-analysis focus | `test@eshop.com` / `Wrong123!` ×2 | Right after DOM-11 success | Fail twice | Generic errors, counter = 2, NOT locked (proves reset) | — | Pending Execution |
| TC-FR02-DOM-13 | SP3.1 case variant | `TEST@ESHOP.COM` / `Test1234!` | Active account | Submit login | Student standard: expect case-insensitive accept; record actual at execution | — | Pending Execution |
| TC-FR02-DOM-14 | SP4.1 surrounding spaces | `␣test@eshop.com␣` / `Test1234!` | Active account | Submit login | Student standard: expect auto-trim accept; record actual at execution | — | Pending Execution |
| TC-FR02-DOM-15 | Message uniformity (O-domain) | wrong-pwd vs unregistered-email | Clean state | Run DOM-04 vs DOM-05, compare responses | Both responses identical in text + HTTP status (no cause leak) | — | Pending Execution |

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
| TC-FR02-BVA-01 | B1 max- (2 fails) | `test@eshop.com` / `Wrong123!` | 1 prior consecutive fail | Submit (2nd fail) | Generic error; counter = 2; NOT locked | — | Pending Execution |
| TC-FR02-BVA-02 | B1 threshold (3rd fail) | `test@eshop.com` / `Wrong123!` | 2 prior consecutive fails | Submit (3rd fail) | Locked 30s (proves `>= 3`, not `> 3`) | — | Pending Execution |
| TC-FR02-BVA-03 | B1 max+ (4th submit, locked) | `test@eshop.com` / `Test1234!` | Just locked | Submit twice more | Still rejected; lock window NOT extended (no sliding-window relock) | — | Pending Execution |
| TC-FR02-BVA-04 | B1×correct (3rd try correct) ★ | `test@eshop.com` / `Test1234!` | 2 prior consecutive fails | Submit correct creds | Success, no lock (threshold counts fails only), counter reset | — | Pending Execution |
| TC-FR02-BVA-05 | B2 max- (29s) | correct creds | Locked 29s ago | Submit at 29s | Still rejected (locked) | — | Pending Execution |
| TC-FR02-BVA-06 | B2 edge (30s) ★ | correct creds | Locked 30s ago | Submit at 30s | Operator determination: record accept/reject (`< 30` vs `<= 30`) | — | Pending Execution |
| TC-FR02-BVA-07 | B2 max+ (31s) | correct creds | Locked 31s ago | Submit at 31s | Success (lock lifted) | — | Pending Execution |
| TC-FR02-BVA-08 | B2 nom (15s) | correct creds | Locked 15s ago | Submit at 15s | Still rejected (mid-window hold) | — | Pending Execution |
| TC-FR02-BVA-09 | B2×wrong (fail at 30s) ★ | `test@eshop.com` / `Wrong123!` | Lock just expired (~30s) | Submit wrong creds | Generic error as fresh-window fail #1 (counter = 1), NOT instant relock | — | Pending Execution |
| TC-FR02-BVA-10 | B3 min+ (1 char) | `a` / `b` | Active account | Submit | Rejected (format/length); record counter behavior | — | Pending Execution |
| TC-FR02-BVA-11 | B3 min- (7-char pwd) | `test@eshop.com` / `Abc123!` (7) | Active account | Submit | Generic wrong-password error (no length rule in FR-02); any client-side block recorded as extra-spec behavior | — | Pending Execution |
| TC-FR02-BVA-12 | B3 max+ (1000 chars) | 1000-char email / 1000-char password | Active account | Submit | Graceful rejection, no 500/timeout/partial login | — | Pending Execution |
| TC-FR02-BVA-13 | B4 increment exactness | `test@eshop.com` / `Wrong123!` | 0 prior fails | Double-click submit rapidly for ONE attempt | Counter = 1 (exactly +1, no double-count) | — | Pending Execution |

FR-02 total: 15 DOM + 13 BVA = **28 TCs**. Timing TCs (BVA-05…09) require stopwatch control (±1s tolerance noted at execution).

### 2.4 AI Gap Analysis & Human Review

> TODO: black-box (spec-only) vs white-box (code + runtime) comparison; missed cases; root cause (prompt quality / tool limit / feature complexity); added TCs.

### 2.5 Execution & Bugs

> TODO: Actual Result + Pass/Fail per TC; links to `Bug_Reports.md` + GitHub Issues + `screenshots/FR02-*`.

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
| FR-02 | 28 | 0 | 0 | 0 | 28 | 0 |
| FR-09 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-16 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-20 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **28** | **0** | **0** | **0** | **28** | **0** |

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
