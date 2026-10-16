// Bulk-create the 38 HW02 GitHub issues (FR02/FR09/FR16/FR20) + push evidence PNGs.
// Usage:
//   $env:GITHUB_TOKEN = '<fine-grained PAT: Issues=write, Contents=write on the repo>'
//   node scripts/create_issues.js
// What it does:
//   1. Clones the group repo, pushes screenshots/ to branch hw02-23120372-evidence.
//   2. Ensures labels (Critical/High/Medium/Low, FR-02/FR-09/FR-16/FR-20).
//   3. Creates 38 issues with repro bodies + embedded evidence images.
//   4. Writes scripts/created_issues.json (number -> url), used to fill report TODOs.
// NEVER hardcode the token. Revoke it afterwards.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.HW02_REPO || 'tinphan247/-KTPM-2026-HW02-Domain-Testing';
const BRANCH = 'hw02-23120372-evidence';
if (!TOKEN) { console.error('FATAL: set $env:GITHUB_TOKEN first'); process.exit(1); }

const H = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' };
async function gh(method, p, body) {
  const r = await fetch(`https://api.github.com${p}`, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${method} ${p} -> ${r.status}: ${JSON.stringify(j).slice(0, 300)}`);
  return j;
}
const RAW = (f) => `https://raw.githubusercontent.com/${REPO}/${BRANCH}/screenshots/${f}`;
const IMG = {
  api02: 'FR02_API_EVIDENCE.png', ui02: 'FR02_UI_LOGIN_PAGE.png',
  api09: 'FR09_API_EVIDENCE.png', ui09: 'FR09_UI_CHECKOUT.png',
  api16: 'FR16_API_EVIDENCE.png', ui16: 'FR16_UI_ADMIN.png',
  api20: 'FR20_API_EVIDENCE.png',
};

// [id, title, severity, feature, imageKey, body]
const ISSUES = [
["FR02-BUG-01","[FR-02] Fail counter +2, lockout on 2nd fail (spec +1/3rd)","Critical","FR-02","api02","Fresh account, login_attempts=0.\n1. POST /api/login wrong pwd -> 401, attempts=2 (A1).\n2. POST wrong pwd again -> 401, attempts=4, locked_until set (A2).\n3. POST correct pwd -> 403.\nExpected: +1 per fail (spec), lock on 3rd consecutive fail.\nActual: +2 per fail; locked on 2nd. Root: server.js:54 (`login_attempts + 2`)."],
["FR02-BUG-02","[FR-02] Lockout lasts ~180s instead of 30s","High","FR-02","api02","Lock account -> read locked_until-now = 179377 ms; correct-pwd probes at 15/29/30/31s all 403 (G1-G4).\nExpected: 30s lockout (demo env).\nActual: ~180s. Root: server.js:57 (`Date.now()+180000`)."],
["FR02-BUG-03","[FR-02] Empty password counted as failed attempt (+2)","High","FR-02","api02","Fresh account (attempts 2) -> POST empty password -> 401, attempts 2->4 (C3).\nExpected (student-confirmed): validation error, counter unchanged.\nActual: counted toward lockout. Root: server.js:46-54 (no validation)."],
["FR02-BUG-04","[FR-02] Stale counter: first wrong after expiry instantly re-locks","High","FR-02","api02","Lock -> simulate expiry (locked_until->past) -> POST wrong pwd -> 401, attempts 4->6, locked_until re-armed (B1).\nExpected: fresh-window fail #1 (counter=1).\nActual: instant relock; counter never resets except on success. Root: server.js:54-62."],
["FR02-BUG-05","[FR-02][SEC] Plaintext password in login + /users/me responses; plaintext storage","Critical","FR-02","api02","Successful login -> response JSON contains \"password\":\"Cx123456!\" (A5); GET /api/users/me also returns password (A6); DB stores raw passwords.\nExpected: never return/store plaintext (SEC-01).\nActual: leaked in 2 endpoints + stored plaintext. Root: server.js:52, database.js:92-93."],
["FR02-BUG-06","[FR-02] No email normalization (uppercase/spaced rejected)","Medium","FR-02","api02","TEST@ESHOP.COM + correct pwd -> 401 (D1); \"  test@eshop.com  \" -> 401 (D2).\nExpected (student standard): case-insensitive + auto-trim accept.\nActual: exact match only (server.js:35). Spec-silent -> spec gap + defect."],
["FR02-BUG-07","[FR-02] Login form uses type=text for email AND password","High","FR-02","ui02","Open /login -> inspect inputs.\nExpected: email type=email (FR-02), password type=password (FR-22).\nActual: both type=text (Login.jsx:30,40) - password visible on screen."],
["FR02-BUG-08","[FR-02] Login page i18n/structure/feedback violations + swallowed 403","Medium","FR-02","ui02","Heading \"Đăng Ký\" in <h2>, labels Username/button Sign In (EN), error div below form, submit tabIndex=1, 403 lockout swallowed into generic message (Login.jsx:24,53-66).\nExpected: Vietnamese <h1>, error above submit (FR-22), natural tab order, visible lockout state."],
["FR02-BUG-09","[FR-02][SEC] JWT never expires + hardcoded secret in source","Medium","FR-02","api02","Code inspection: jwt.sign({id,role}, SECRET_KEY), SECRET_KEY hardcode (server.js:9,51). Decoded login JWT has no exp claim.\nExpected: expiring tokens, secret out of source."],
["FR02-BUG-10","[FR-02] Lost update: concurrent fails collapse 0->2","Medium","FR-02","api02","Fresh account -> two parallel wrong-password POSTs -> attempts=2 instead of 4 (F1).\nExpected: each fail counted.\nActual: read-modify-write race + fire-and-forget db.run (server.js:54-62)."],
["FR09-BUG-01","[FR-09] Percent formula total*(1-value): negative discount, 10x final","Critical","FR-09","api09","POST /api/apply-coupon {SAVE10, 4000000} -> 200 discount=-36000000 final=40000000 (H1).\nExpected: -400000 -> 3600000 (total*value/100).\nActual: catastrophic math. Root: server.js:398-421."],
["FR09-BUG-02","[FR-09] C3 strict > rejects subtotal == min (spec >=)","High","FR-09","api09","SAVE10@300000 -> 400; BIGBUY@500000 -> 400; VIP100@300000 -> 400 (M2/M5/M8); min-1 correctly 400; min+1 correctly 200.\nExpected: equality accepted.\nActual: rejected. Root: server.js:379."],
["FR09-BUG-03","[FR-09] apply-coupon has no auth; user_id is client-supplied","High","FR-09","api09","Guest (no token/user_id) apply SAVE10 -> 200 quote (V5); guest + stranger user_id -> 200 (V7); exhausted user + fresh id -> 200 (Q8).\nExpected (C4): login required, quota of authenticated caller.\nActual: C4 unenforced. Root: server.js:363-391."],
["FR09-BUG-04","[FR-09] Usage check skipped when user_id omitted","High","FR-09","api09","SAVE10-exhausted user applies WITHOUT user_id -> 200 (Q7).\nExpected: C5 evaluated unconditionally.\nActual: if(user_id) bypasses quota branch (server.js:386)."],
["FR09-BUG-05","[FR-09] Checkout trusts any client total_amount (1-dong order stored)","Critical","FR-09","api09","Auth'd POST /api/checkout {total_amount:1} -> 200 order #4; my-orders shows total_amount=1 (T1).\nExpected: backend recomputes; never accepts client total (FR-08).\nActual: arbitrary price stored; coupon_id ignored. Root: server.js:297-309."],
["FR09-BUG-06","[FR-09] Quota = voluntary post-checkout client call (reuse + double-count)","High","FR-09","api09","Checkout SAVE10 skipping /api/coupon-usage -> reuse 200, used=0 (Q4); one order + 2 usage calls -> used=2 (Q5).\nExpected: server-side atomic quota.\nActual: honor-system, no order linkage. Root: server.js:443-454."],
["FR09-BUG-07","[FR-09] No zero floor: fixed > subtotal gives negative final","High","FR-09","api09","FIX200 (fixed 200000, min 0) @199999 -> 200 final=-1 (Z1); @200000 -> 0; @200001 -> 1.\nExpected: floor at 0, never negative.\nActual: negatives possible. Root: server.js:406."],
["FR09-BUG-08","[FR-09] No server-side single-code rule (stacking via API)","Medium","FR-09","api09","SAVE10 then BIGBUY -> 200+200 (K1); SAVE10 twice -> 200+200 (K2).\nExpected (student standard): max 1 code/order.\nActual: unlimited applies."],
["FR09-BUG-09","[FR-09] Checkout total is user-editable input (FR-08 UI)","High","FR-09","ui09","Open /checkout -> total is a free number input (editableTotal); server accepts any value (see BUG-05).\nExpected: auto-computed, non-editable. Root: Checkout.jsx:14,91-103."],
["FR09-BUG-10","[FR-09] Last-quota race: parallel applies both pass","Medium","FR-09","api09","VIP100 at used=1 (max 2) -> two parallel applies -> 200+200 (R1).\nExpected: atomic check-and-reserve.\nActual: check-then-act race. Root: server.js:386-395."],
["FR16-BUG-01","[FR-16] No atomicity: any bad row causes half-commit","Critical","FR-16","api16","POST /api/admin/import-products [2 valid + 1 empty-name] -> 200 {inserted:2, errors:[...]}, recount C+2 (D17). err@1/2/4/5 in N=5 -> 4 imported each (B06-B09).\nExpected: 0 imported (all-or-nothing).\nActual: valid prefixes persist. Root: per-row INSERTs, no transaction (server.js:206-241)."],
["FR16-BUG-02","[FR-16] Validation = name-only (bad prices/FK/blank names stored)","Critical","FR-16","api16","Rows price 0/-5000/\"abc\"/missing(=NULL), category 9999, name \"  \" -> all 200 inserted, 0 errors (D07/D11b/D12-D15, B10/B11). DB: \"abc\" as TEXT, NULL price, whitespace name.\nExpected: price>0 numeric, existing FK, non-blank names.\nActual: only !row.name checked. Root: server.js:214-224."],
["FR16-BUG-03","[FR-16] No role check: customer JWT can bulk-import (FR-12)","High","FR-16","api16","Valid payload + test@eshop.com (user) JWT -> 200 imported (D04). Guest -> 401 holds.\nExpected: 403 admin-only.\nActual: any login imports. Root: authenticateToken only (server.js:199)."],
["FR16-BUG-04","[FR-16] Naive split(',') parser, no RFC4180 (garbage rows)","High","FR-16","api16","UI-equivalent parse of '\"Áo, thun\",100000,...' -> {name:'\"Áo',price:'thun\"',...} -> POST -> 200 garbage row stored (D09/D10).\nExpected: single-field RFC4180 parse.\nActual: misaligned inserts. Root: App.jsx:367-377."],
["FR16-BUG-05","[FR-16] No file-type gate: any file parsed as CSV","Medium","FR-16","api16","<input type=file> has no accept/validation; FileReader parses any bytes (App.jsx:356-384); backend never sees a file.\nExpected: .csv-only gate."],
["FR16-BUG-06","[FR-16] Silent || defaults mask bad data (price->0, category->1)","Medium","FR-16","api16","Missing price -> NULL/0, bad category parseInt->null->1, missing texts -> \"\" (App.jsx:390-403, server.js:221-223); all accepted silently (D07/D15).\nExpected: cited errors."],
["FR16-BUG-07","[FR-16] Mid-file blank lines become error rows (+ partial commit)","Medium","FR-16","api16","UI-equivalent parse with blank line -> all-\"\" row -> missing-name error + valid rows still imported (B14).\nExpected (student standard): blank lines skipped."],
["FR16-BUG-08","[FR-16] products:[null] -> 500 TypeError HTML (must be 400)","Medium","FR-16","api16","POST {products:[null]} -> 500 TypeError HTML page (G08).\nExpected: 400 JSON.\nActual: unhandled throw (server.js:213-214)."],
["FR16-BUG-09","[FR-16] Duplicate product names allowed (observational vs FR-15)","Low","FR-16","api16","Second 'iPhone 15 Pro Max' row -> 200 new row (D16). No UNIQUE constraint. Recorded (spec silent)."],
["FR16-BUG-10","[FR-16] 256-1000-char names accepted (FR-15 max-255 inconsistency)","Low","FR-16","api16","256- and 1000-char names -> 200 inserted (B19a/b); 1/255-char -> 200 hold.\nExpected: reject beyond 255 (FR-15 consistency). No length cap in schema."],
["FR20-BUG-01","[FR-20] User cancel from shipping allowed (+ race TOCTOU)","Critical","FR-20","api20","Own shipping order -> user PUT cancel -> 200 canceled (D04); fresh-shipping likewise (V02). Parallel cancel||admin-ship -> 200+200 final shipping (V03, last-writer-wins).\nExpected: reject from shipping (FR-10); race must not override.\nActual: allowed; code comment admits gate should be pending/confirmed-only (server.js:328-331)."],
["FR20-BUG-02","[FR-20] Cancel does not refund coupon usage","High","FR-20","api20","VIP100 order (used 0->1) -> user cancel -> 200 -> used still 1 (D15).\nExpected (student standard): refund used-1.\nActual: single UPDATE, no compensation (server.js:333-340). No stock system exists."],
["FR20-BUG-03","[FR-20] Mobile cancel has no confirmation dialog","Medium","FR-20","api20","Code: onPress={() => cancelOrder(o.id)} fires PUT immediately; only post-hoc Alerts (App.js:312-329,961-968).\nExpected: confirm dialog before destructive cancel (FR-24)."],
["FR20-BUG-04","[FR-20] Mobile statuses have no color coding (FR-11)","Medium","FR-20","api20","Status rendered as plain <Text>; Vietnamese labels exist, zero color rules (App.js:960,1240-1248).\nExpected: distinguished colors per status."],
["FR20-BUG-05","[FR-20] Empty history text-only, no illustration (FR-24)","Low","FR-20","api20","orders.length===0 renders bare text (App.js:947-949).\nExpected: illustration/icon + message."],
["FR20-BUG-06","[FR-20] No loading indicator on mobile cancel","Low","FR-20","api20","cancelOrder has no loading state (contrast checkoutLoading). Silent tap -> delayed Alert (App.js:312-329).\nExpected: loading feedback (FR-24)."],
["FR20-BUG-07","[FR-20] History cards omit items; logout labeled 'Thoát' (FR-23)","Low","FR-20","api20","Order card: id/date/total/status + cancel button, no product lines; logout button reads 'Thoát' (App.js:940-968).\nExpected: item lines; 'Đăng xuất' label."],
["FR20-BUG-08","[FR-20] Mobile API base hardcoded to LAN IP","Low","FR-20","api20","const API_URL = 'http://192.168.10.13:3000/api' (App.js:16); unreachable off that LAN.\nExpected: configurable base."],
];

(async () => {
  const me = await gh('GET', `/repos/${REPO}`);
  console.log('repo:', me.full_name, me.private ? '(private)' : '(public)');
  // 1. push screenshots to evidence branch (skip with SKIP_PUSH=1; bodies keep
  // the future raw URLs, which go live once the branch is pushed)
  if (process.env.SKIP_PUSH !== '1') {
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'hw02-ev-'));
  execFileSync('git', ['clone', '--quiet', '--depth', '1', `https://github.com/${REPO}.git`, tmp], { stdio: 'inherit' });
  execFileSync('git', ['-C', tmp, 'checkout', '-B', BRANCH], { stdio: 'inherit' });
  const shotSrc = path.join(__dirname, '..', 'screenshots');
  const shotDst = path.join(tmp, 'screenshots');
  fs.mkdirSync(shotDst, { recursive: true });
  const files = [...new Set(Object.values(IMG))];
  for (const f of files) fs.copyFileSync(path.join(shotSrc, f), path.join(shotDst, f));
  execFileSync('git', ['-C', tmp, 'add', 'screenshots'], { stdio: 'inherit' });
  execFileSync('git', ['-C', tmp, '-c', 'user.name=23120372', '-c', 'user.email=23120372@student.hcmus.edu.vn', 'commit', '-m', 'hw02: evidence screenshots for 38 issue reports', '--quiet'], { stdio: 'inherit' });
  const remote = `https://x-access-token:${TOKEN}@github.com/${REPO}.git`;
  execFileSync('git', ['-C', tmp, 'push', '--quiet', remote, `${BRANCH}:${BRANCH}`], { stdio: 'inherit' });
  console.log('screenshots pushed to', BRANCH);
  } else {
    console.log('SKIP_PUSH=1: screenshots NOT pushed; issue bodies reference future raw URLs on', BRANCH);
  }
  // 2. labels
  const colors = { Critical: 'b60205', High: 'd93f0b', Medium: 'fbca04', Low: '0e8a16' };
  for (const [name, color] of Object.entries(colors)) {
    try { await gh('POST', `/repos/${REPO}/labels`, { name, color }); } catch (e) { if (!String(e).includes('already_exists')) throw e; }
  }
  for (const f of ['FR-02', 'FR-09', 'FR-16', 'FR-20']) {
    try { await gh('POST', `/repos/${REPO}/labels`, { name: f, color: '1d76db' }); } catch (e) { if (!String(e).includes('already_exists')) throw e; }
  }
  // 3. issues
  const out = {};
  for (const [id, title, sev, feat, img, body] of ISSUES) {
    const full = `${body}\n\n**Severity:** ${sev}\n**Evidence:** ![](${RAW(IMG[img])})\n**Reported by:** 23120372 (HW02 Domain Testing, 16/10/2026)\n**Related TCs:** see Bug_Reports.md ${id}`;
    const iss = await gh('POST', `/repos/${REPO}/issues`, { title: `[${id}] ${title}`, body: full, labels: [sev, feat] });
    out[id] = iss.html_url;
    console.log(id, '->', iss.html_url);
    await new Promise((x) => setTimeout(x, 800));
  }
  fs.writeFileSync(path.join(__dirname, 'created_issues.json'), JSON.stringify(out, null, 2));
  console.log('WROTE created_issues.json with', Object.keys(out).length, 'issues');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
