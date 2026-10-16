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

### 2.2 Domain Testing (to be executed with skill — Step 1+3)

> TODO (next commit): Domain variables table, Equivalence Partitions (valid/invalid), representative values, Domain TCs `FR02-DT-01...`.

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
| FR-02 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-09 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-16 | 0 | 0 | 0 | 0 | 0 | 0 |
| FR-20 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **0** | **0** | **0** | **0** | **0** | **0** |

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
