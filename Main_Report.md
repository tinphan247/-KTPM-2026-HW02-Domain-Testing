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
| TC-FR02-DOM-06 | IP5.2 empty password | `test@eshop.com` / `` | 0 prior fails | Submit login | Rejected (treated as failed attempt or validation error — record which) | — | Pending Execution |
| TC-FR02-DOM-07 | VP6.2 below threshold | `test@eshop.com` / `Wrong123!` | 1 prior consecutive fail | Submit login | Generic error; counter = 2; account still NOT locked | — | Pending Execution |
| TC-FR02-DOM-08 | IP6.1 threshold reached | `test@eshop.com` / `Wrong123!` | 2 prior consecutive fails | Submit login (3rd fail) | Account locked for 30s; lockout message | — | Pending Execution |
| TC-FR02-DOM-09 | IP8.1 + IP7.1 locked, correct creds | `test@eshop.com` / `Test1234!` | Account just locked | Submit immediately | Still rejected — lock takes precedence over correct password | — | Pending Execution |
| TC-FR02-DOM-10 | VP7.1 lock expired | `test@eshop.com` / `Test1234!` | Locked, then wait 60s | Submit after wait | Login success (lock lifted) | — | Pending Execution |
| TC-FR02-DOM-11 | Counter reset on success | `test@eshop.com` / `Test1234!` | 2 prior consecutive fails | Submit correct creds | Success AND consecutive-fail counter resets ("consecutive" per spec) | — | Pending Execution |
| TC-FR02-DOM-12 | Post-reset threshold | `test@eshop.com` / `Wrong123!` ×2 | Right after DOM-11 success | Fail twice | Generic errors, counter = 2, NOT locked (proves reset) | — | Pending Execution |
| TC-FR02-DOM-13 | SP3.1 case variant | `TEST@ESHOP.COM` / `Test1234!` | Active account | Submit login | Spec-silent — record accept/reject as-is | — | Pending Execution |
| TC-FR02-DOM-14 | SP4.1 surrounding spaces | `␣test@eshop.com␣` / `Test1234!` | Active account | Submit login | Spec-silent — record accept/reject/trim behavior | — | Pending Execution |
| TC-FR02-DOM-15 | Message uniformity (O-domain) | wrong-pwd vs unregistered-email | Clean state | Run DOM-04 vs DOM-05, compare responses | Both responses identical in text + HTTP status (no cause leak) | — | Pending Execution |

Deferred to BVA (§2.3): fail-count edges 2/3/4, lockout timing 29s/30s/31s, counter-increment exactness (+1, no double-count on double-click), email max-length (spec-silent).

### 2.3 Boundary Value Analysis (skill — Step 2+3)

> TODO: boundaries — fail-count {2,3,4}, lockout time {29s,30s,31s}, email/password length edges, BVA TCs `FR02-BVA-01...` with min/min+/nom/max-/max/max+ and step-unit justification.

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
| FR-02 | 15 | 0 | 0 | 0 | 15 | 0 |
| FR-09 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-16 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-20 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **15** | **0** | **0** | **0** | **15** | **0** |

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
