# Bug Reports — HW02 EShop

**Student:** Phan Trung Tin — 23120372
**SUT:** https://github.com/ttbhanh/eshop-sut
**Note:** Each bug below is also filed on the group's GitHub Issues page with screenshots from `screenshots/`.

---

## Bug report template (copy per bug)

```markdown
Title: [FR-XX] <short summary>
Environment: <backend commit / browser / URL localhost:____ / mobile Expo / test account>
Pre-conditions: <data seeded, login state>
Steps to Reproduce:
1. ...
2. ...
Expected Result: <per SRS v2.0>
Actual Result: <what happened + HTTP status if API>
Severity / Priority: <Critical/High/Medium/Low>
Attachments: screenshots/FRXX-*.png
GitHub Issue: <link>
Related TCs: <TC IDs>
```

---

## FR-02 — Login & Lockout (executed 16/10/2026, 37 TCs: 13 passed / 24 failed → 10 bugs)

Runner: `scripts/exec_fr02.js` → transcript `scripts/exec_fr02_results.json` (25 steps).
Screenshots: `screenshots/FR02_UI_LOGIN_PAGE.png` (real page), `screenshots/FR02_API_EVIDENCE.png` (rendered from measured output — method disclosed).
GitHub Issue links: TODO — file on group repo with PNGs attached.

### FR02-BUG-01 — [Critical] Fail counter increments by +2, lockout fires on 2nd fail (spec: +1, lock on 3rd)
- **Environment:** backend localhost:3000 (commit: eshop-sut main 16/10/2026), `scripts/exec_fr02.js` accounts `exec*`
- **Pre-conditions:** fresh account, `login_attempts = 0`
- **Steps:** 1. POST /api/login wrong pwd → 401, DB `attempts = 2` (A1). 2. POST wrong pwd again → 401, `attempts = 4`, `locked_until` set (A2). 3. POST correct pwd → 403 (F2).
- **Expected:** +1 per fail (spec "đúng 1 đơn vị"); lock only on 3rd consecutive fail.
- **Actual:** +2 per fail; locked on 2nd fail. Root: `server.js:54` (`login_attempts + 2`).
- **Severity/Priority:** Critical / P1 (legit users locked after 2 typos; brute-force math broken)
- **Attachments:** `screenshots/FR02_API_EVIDENCE.png` (A1/A2/F2). **Related TCs:** DOM-05/07/08/12, BVA-01/02/04/13, GAP-01.

### FR02-BUG-02 — [High] Lockout lasts ~180s instead of spec 30s
- **Steps:** lock account (2 wrongs) → read `locked_until − now` = **179 377 ms**; correct-pwd probes at 15/29/30/31s all → 403 (G1–G4).
- **Expected:** 30s lockout (demo env).
- **Actual:** ~180s. Root: `server.js:57` (`Date.now() + 180000`).
- **Severity:** High. **Attachments:** `FR02_API_EVIDENCE.png`. **Related TCs:** DOM-08/10, BVA-05…09, GAP-02.

### FR02-BUG-03 — [High] Empty password counted as failed attempt (+2)
- **Steps:** fresh account (attempts 2) → POST empty password → 401, attempts 2→4 (C3).
- **Expected (student-confirmed):** validation error, counter unchanged.
- **Actual:** counted toward lockout. Root: no validation, `server.js:46-54`.
- **Severity:** High. **Related TCs:** DOM-06, GAP-03.

### FR02-BUG-04 — [High] Stale counter: first wrong attempt after expiry instantly re-arms lock
- **Steps:** lock → simulate expiry (DB `locked_until` → past, disclosed) → POST wrong pwd → 401, attempts 4→**6**, `locked_until` re-armed (B1).
- **Expected:** fresh-window fail #1 (counter = 1).
- **Actual:** instant relock; counter never resets except on success. Root: `server.js:54-62`.
- **Severity:** High. **Related TCs:** BVA-09, GAP-04.

### FR02-BUG-05 — [Critical/Security] Plaintext password in login + /users/me responses; plaintext storage (SEC-01)
- **Steps:** successful login → response JSON contains `"password":"Cx123456!"` (A5); `GET /api/users/me` also returns `password` (A6); DB stores raw passwords (seed `Test1234!`, register inserts raw).
- **Expected:** never return/store plaintext passwords.
- **Actual:** leaked in two endpoints + stored plaintext. Root: `server.js:52`, `server.js:20-30`, `database.js:92-93`.
- **Severity:** Critical (Security — credential exposure enables account takeover at scale). **Related TCs:** GAP-05.

### FR02-BUG-06 — [Medium] No email normalization — uppercase / spaced emails rejected
- **Steps:** `TEST@ESHOP.COM` + correct pwd → 401 (D1); `␣test@eshop.com␣` → 401 (D2).
- **Expected (student standard):** case-insensitive + auto-trim accept.
- **Actual:** exact-match only (`WHERE email = ?`, `server.js:35`).
- **Severity:** Medium (usability; spec-silent → spec gap + defect). **Related TCs:** DOM-13/14, GAP-06/07.

### FR02-BUG-07 — [High] Login form uses `type="text"` for email AND password (password visible)
- **Steps:** open `/login` → inspect inputs.
- **Expected:** email `type="email"` (FR-02), password `type="password"` (FR-22).
- **Actual:** both `type="text"` (`Login.jsx:30,40`).
- **Severity:** High (plaintext password on screen — shoulder-surfing; plus no HTML5 email validation). **Attachments:** `FR02_UI_LOGIN_PAGE.png`. **Related TCs:** GAP-08.

### FR02-BUG-08 — [Medium] Login page i18n/structure/feedback violations + lockout state swallowed
- **Steps:** open `/login` (see screenshot); trigger lockout → UI always shows generic `"Đăng nhập thất bại..."`.
- **Expected:** Vietnamese `<h1>` title, error above submit (FR-22), natural tab order (FR-21), visible lockout state.
- **Actual:** heading `"Đăng Ký"` in `<h2>`, labels `Username` / button `Sign In` (EN), error div below form, submit `tabIndex={1}`, 403 detail swallowed (`Login.jsx:24,53-66`).
- **Severity:** Medium (hides FR-02 lockout state from users — functional impact beyond cosmetics). **Attachments:** `FR02_UI_LOGIN_PAGE.png`. **Related TCs:** GAP-09.

### FR02-BUG-09 — [Medium/Security] JWT never expires + hardcoded secret in source
- **Steps:** code inspection; decode login JWT → no `exp` claim.
- **Expected:** expiring tokens, secret out of source.
- **Actual:** `jwt.sign({id, role}, SECRET_KEY)`, `SECRET_KEY = "super_secret_key_that_should_not_be_here"` (`server.js:9,51`).
- **Severity:** Medium (Security). **Related TCs:** — (inspection).

### FR02-BUG-10 — [Medium] Lost update: two concurrent fails collapse 0→2
- **Steps:** fresh account → two parallel wrong-password POSTs → DB `attempts = 2` instead of 4 (F1).
- **Expected:** each fail counted (≥ +1 each under any increment rule).
- **Actual:** read-modify-write race + fire-and-forget `db.run` (`server.js:54-62`).
- **Severity:** Medium (robustness; weakens lockout under double-click/attacker parallelism). **Related TCs:** BVA-13.

## FR-09 — Coupons (executed 16/10/2026, 48 TCs: 28 passed / 20 failed → 10 bugs)

Runner: `scripts/exec_fr09.js` → transcript `scripts/exec_fr09_results.json` (44 steps).
Screenshots: `screenshots/FR09_UI_CHECKOUT.png` (real page: editable total + coupon box), `screenshots/FR09_API_EVIDENCE.png` (rendered from measured output — method disclosed).
Fixtures TIMEB1/FIX200/INACT1 removed afterwards (`F9-restore: seeds=4`). Test accounts `cpn*` + usage rows remain (documented).
GitHub Issue links: TODO — file on group repo with PNGs attached.

### FR09-BUG-01 — [Critical] Percent formula `total×(1−value)` → negative discount, final = 10× total
- **Environment:** backend localhost:3000, `scripts/exec_fr09.js`
- **Pre-conditions:** `SAVE10` (percent 10), fresh user, quoted total 4 000 000 ₫
- **Steps:** POST /api/apply-coupon `{code:SAVE10, total_amount:4000000}` → 200.
- **Expected:** discount 400 000, final 3 600 000 (`total×value/100`).
- **Actual:** `discount_amount = -36 000 000`, `final_amount = 40 000 000` (H1). Root: `server.js:398-421` (`Math.floor(total_amount * (1 - coupon.discount_value))`).
- **Severity/Priority:** Critical / P1 (every percent coupon overcharges ~10×; message even claims "Giảm 10%").
- **Attachments:** `screenshots/FR09_API_EVIDENCE.png` (H1/H4). **Related TCs:** DOM-01/17, GAP-02.

### FR09-BUG-02 — [High] C3 strict `>` rejects subtotal == min (spec `>=`)
- **Steps:** SAVE10 @300 000 → 400 (M2); BIGBUY @500 000 → 400 (M5); VIP100 @300 000 → 400 (M8); min−1 correctly 400; min+1 correctly 200.
- **Expected:** equality accepted (`total >= min_order_amount`).
- **Actual:** equality rejected. Root: `server.js:379` (`total_amount > coupon.min_order_amount`).
- **Severity:** High. **Related TCs:** BVA-03/06/09, GAP-01.

### FR09-BUG-03 — [High] `POST /api/apply-coupon` has no auth; `user_id` is client-supplied
- **Steps:** guest (no token, no user_id) apply SAVE10 → 200 with full discount quote (V5); guest + stranger's `user_id` → 200 (V7); quota-exhausted user + fresh user's id → 200 (Q8).
- **Expected (C4):** login required; quota evaluated for the authenticated caller.
- **Actual:** C4 unenforced; anyone's quota usable by anyone. Root: missing `authenticateToken` + body `user_id` (`server.js:363-391`).
- **Severity:** High (Security). **Related TCs:** DOM-08, GAP-03/05.

### FR09-BUG-04 — [High] Usage check skipped when `user_id` omitted
- **Steps:** SAVE10-exhausted user applies WITHOUT `user_id` → 200 (Q7).
- **Expected:** C5 evaluated unconditionally.
- **Actual:** `if (user_id)` bypasses the whole quota branch (`server.js:386`).
- **Severity:** High. **Related TCs:** GAP-04.

### FR09-BUG-05 — [Critical] Checkout trusts any client `total_amount`, ignores coupon (FR-08)
- **Steps:** auth'd POST /api/checkout `{total_amount: 1, shipping_address}` → 200, order #4; `GET /api/orders/my-orders` shows stored `total_amount = 1` (T1).
- **Expected:** backend recomputes from cart; never accepts client total (FR-08).
- **Actual:** arbitrary price stored; `coupon_id` accepted but ignored. Root: `server.js:297-309`.
- **Severity/Priority:** Critical / P1 (1 ₫ orders; payment integrity broken).
- **Attachments:** `screenshots/FR09_API_EVIDENCE.png` (T1). **Related TCs:** GAP-06.

### FR09-BUG-06 — [High] Quota = voluntary post-checkout client call (unlimited reuse + double count)
- **Steps:** checkout with SAVE10, skip `/api/coupon-usage` → reuse 200, `used = 0` (Q4); one order + two usage calls → `used = 2` (Q5); 3 apply-only (no checkout) → `used = 0` (N1).
- **Expected:** server-side atomic quota (consume at most once per order; reuse blocked).
- **Actual:** no linkage between order and usage; quota purely honor-system. Root: `server.js:443-454` + Checkout.jsx:53-59.
- **Severity:** High. **Related TCs:** BVA-14, GAP-07/08.

### FR09-BUG-07 — [High] No zero floor: fixed discount > subtotal → negative final
- **Steps:** FIX200 (fixed 200 000, min 0) @199 999 → 200, `final = -1` (Z1); @200 000 → 0 (Z2); @200 001 → 1 (Z3).
- **Expected:** floor at 0, never negative.
- **Actual:** negative totals possible. Root: `server.js:406` (no `Math.max(0, …)`).
- **Severity:** High (financial data integrity — negative order totals must never persist). **Related TCs:** BVA-18.

### FR09-BUG-08 — [Medium] No server-side single-code rule (stacking + repeat via API)
- **Steps:** SAVE10 then BIGBUY → 200 + 200 (K1); SAVE10 twice → 200 + 200 (K2).
- **Expected (student standard):** max 1 code/order (overwrite or error; no double discount).
- **Actual:** unlimited applies (UI single-slot only by accident of `couponResult` state).
- **Severity:** Medium. **Related TCs:** DOM-15/16, GAP-11.

### FR09-BUG-09 — [High] Checkout total is a user-editable input (FR-08 UI)
- **Steps:** open `/checkout` → "Tổng tiền thanh toán (VND)" is a free number input.
- **Expected:** auto-computed, non-editable total.
- **Actual:** editable (`Checkout.jsx:14,91-103`); edits only reset coupon state, and server accepts any value (see BUG-05).
- **Severity:** High (direct in-browser price-tampering surface feeding BUG-05). **Attachments:** `screenshots/FR09_UI_CHECKOUT.png`. **Related TCs:** GAP-09.

### FR09-BUG-10 — [Medium] Last-quota race: parallel applies both pass
- **Steps:** VIP100 at `used = 1` (max 2) → two parallel applies → 200 + 200 (R1), no transaction/lock.
- **Expected:** at most one succeeds (atomic check-and-reserve).
- **Actual:** check-then-act race; overspend possible. Root: `server.js:386-395` (no transaction).
- **Severity:** Medium. **Related TCs:** GAP-10.

## FR-16 — CSV Import

> TODO.

| Issue | Title | Severity | Status | Link |
| :--- | :--- | :--- | :--- | :--- |
| — | — | — | — | — |

## FR-20 — Mobile

> TODO.

| Issue | Title | Severity | Status | Link |
| :--- | :--- | :--- | :--- | :--- |
| — | — | — | — | — |
