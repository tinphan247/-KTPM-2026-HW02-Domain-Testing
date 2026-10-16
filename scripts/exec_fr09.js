// FR-09 execution script — API-level run + sqlite inspection.
// Run: node scripts/exec_fr09.js   (backend localhost:3000)
// Writes scripts/exec_fr09_results.json (used to render FR09_API_EVIDENCE.png).
// Fixtures (created via admin endpoint, DELETED at end): TIMEB1 (exp now+45s),
// FIX200 (fixed 200000, min 0), INACT1 (deactivated via DB). Seeds restored afterwards.
const sqlite3 = require('C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/node_modules/sqlite3');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:3000';
const DBF = 'C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/database.sqlite';
const db = new sqlite3.Database(DBF);
const OUT = [];
const stamp = 'cpn' + Date.now().toString(36);
const sleep = (ms) => new Promise((x) => setTimeout(x, ms));

function dbGet(sql, p = []) {
  return new Promise((res, rej) => db.get(sql, p, (e, r) => (e ? rej(e) : res(r))));
}
function dbRun(sql, p = []) {
  return new Promise((res, rej) => db.run(sql, p, function (e) { e ? rej(e) : res(this); }));
}
async function api(method, p, body, token) {
  const t0 = Date.now();
  const r = await fetch(API + p, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const ms = Date.now() - t0;
  let json = null;
  try { json = await r.json(); } catch { json = null; }
  return { status: r.status, json, ms };
}
function step(id, data) { OUT.push({ step: id, ...data }); console.log(id, JSON.stringify(data)); }

(async () => {
  // --- auth ---
  const adm = await api('POST', '/api/login', { email: 'test@eshop.com', password: 'Test1234!' });
  const TOK = adm.json.token;
  const mkUser = async (tag) => {
    const email = `${stamp}${tag}@t.com`;
    await api('POST', '/api/register', { name: 'Cpn', email, password: 'Cx123456!' });
    const l = await api('POST', '/api/login', { email, password: 'Cx123456!' });
    const row = await dbGet('SELECT id FROM users WHERE email=?', [email]);
    return { email, token: l.json.token, id: row.id };
  };
  const U = await mkUser('u');   // general probes (no checkout -> quota untouched)
  const Q = await mkUser('q');   // quota lifecycle (VIP100 x3, SAVE10 reuse)
  const R = await mkUser('r');   // race test
  const usage = (cid, uid) => dbGet('SELECT COUNT(*) c FROM coupon_usage WHERE coupon_id=? AND user_id=?', [cid, uid]).then((r) => r.c);
  const apply = (code, total, uid, token) => api('POST', '/api/apply-coupon', { code, total_amount: total, user_id: uid }, token);
  const checkout = (token, total) => api('POST', '/api/checkout', { total_amount: total, shipping_address: 'HN' }, token);
  const recordUsage = (token, cid) => api('POST', '/api/coupon-usage', { coupon_id: cid }, token);

  // --- fixtures ---
  const T = Date.now() + 45000;
  const f1 = await api('POST', '/api/admin/coupons', { code: 'TIMEB1', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: new Date(T).toISOString(), max_uses_per_user: 5 }, TOK);
  const f2 = await api('POST', '/api/admin/coupons', { code: 'FIX200', type: 'fixed', discount_value: 200000, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 9 }, TOK);
  const f3 = await api('POST', '/api/admin/coupons', { code: 'INACT1', type: 'percent', discount_value: 10, min_order_amount: 0, expired_at: '2099-12-31', max_uses_per_user: 9 }, TOK);
  await sleep(400);
  await dbRun('UPDATE coupons SET is_active=0 WHERE code=?', ['INACT1']);
  step('F0-fixtures', { timeb1: f1.json, fix200: f2.json, inact1: f3.json });

  // --- happy-path math (GAP-02) ---
  let r = await apply('SAVE10', 4000000, U.id, U.token);
  step('H1-save10-4M', { status: r.status, discount: r.json && r.json.discount_amount, final: r.json && r.json.final_amount });
  r = await apply('BIGBUY', 4000000, U.id, U.token);
  step('H2-bigbuy-4M', { status: r.status, discount: r.json && r.json.discount_amount, final: r.json && r.json.final_amount });
  r = await apply('VIP100', 4000000, U.id, U.token);
  step('H3-vip100-4M', { status: r.status, discount: r.json && r.json.discount_amount, final: r.json && r.json.final_amount });
  r = await apply('SAVE10', 4555555, U.id, U.token);
  step('H4-rounding', { status: r.status, discount: r.json && r.json.discount_amount, final: r.json && r.json.final_amount });

  // --- single violations C1/C2/C3/C4 ---
  r = await apply('FAKE99', 4000000, U.id, U.token);
  step('V1-fake', { status: r.status, err: r.json && r.json.error });
  r = await apply('INACT1', 4000000, U.id, U.token);
  step('V2-inactive', { status: r.status, err: r.json && r.json.error });
  r = await apply('EXPIRED', 4000000, U.id, U.token);
  step('V3-expired', { status: r.status, err: r.json && r.json.error });
  r = await apply('SAVE10', 50000, U.id, U.token);
  step('V4-submin', { status: r.status, err: r.json && r.json.error });
  r = await apply('SAVE10', 4000000, null, undefined);
  step('V5-guest-nouser', { status: r.status, body: r.json });
  r = await apply('', 4000000, U.id, U.token);
  step('V6-empty', { status: r.status, err: r.json && r.json.error });
  // guest + чужой user_id (GAP-03)
  r = await apply('SAVE10', 4000000, Q.id, undefined);
  step('V7-guest-foreign-id', { status: r.status, ok: !!(r.json && r.json.success) });

  // --- case/space via API (SP8) ---
  r = await apply('save10', 4000000, U.id, U.token);
  step('S1-lower', { status: r.status });
  r = await apply('  SAVE10  ', 4000000, U.id, U.token);
  step('S2-spaced', { status: r.status });

  // --- stacking / repeat via API (DOM-15/16, GAP-11) ---
  const s1 = await apply('SAVE10', 4000000, U.id, U.token);
  const s2 = await apply('BIGBUY', 4000000, U.id, U.token);
  step('K1-stack', { first: s1.status, second: s2.status });
  const p1 = await apply('SAVE10', 4000000, U.id, U.token);
  const p2 = await apply('SAVE10', 4000000, U.id, U.token);
  step('K2-repeat', { first: p1.status, second: p2.status });

  // --- BVA money edges (u=1d) ---
  for (const [tag, code, total] of [
    ['M0-empty', 'SAVE10', 0], ['M1-s10min-', 'SAVE10', 299999], ['M2-s10min', 'SAVE10', 300000], ['M3-s10min+', 'SAVE10', 300001],
    ['M4-bbmin-', 'BIGBUY', 499999], ['M5-bbmin', 'BIGBUY', 500000], ['M6-bbmin+', 'BIGBUY', 500001],
    ['M7-vmin-', 'VIP100', 299999], ['M8-vmin', 'VIP100', 300000], ['M9-vmin+', 'VIP100', 300001]]) {
    const rr = await apply(code, total, U.id, U.token);
    step(tag, { status: rr.status, discount: rr.json && rr.json.discount_amount, final: rr.json && rr.json.final_amount, err: rr.json && rr.json.error });
  }

  // --- quota lifecycle VIP100 (BVA-11..13, DOM-10/11) on Q ---
  const vipId = (await apply('VIP100', 4000000, Q.id, Q.token)).json.coupon_id;
  let co = await checkout(Q.token, 3900000); await recordUsage(Q.token, vipId);
  step('Q1-first', { checkout: co.status, used: await usage(vipId, Q.id) });
  co = await checkout(Q.token, 3900000); await recordUsage(Q.token, vipId);
  step('Q2-second', { checkout: co.status, used: await usage(vipId, Q.id) });
  r = await apply('VIP100', 4000000, Q.id, Q.token);
  step('Q3-third', { status: r.status, err: r.json && r.json.error, used: await usage(vipId, Q.id) });

  // --- SAVE10 reuse (DOM-09) + usage-skip bypass (GAP-07) + double-record (GAP-08) ---
  const saveId = (await apply('SAVE10', 4000000, Q.id, Q.token)).json.coupon_id;
  await checkout(Q.token, 3600000); // NOTE: no usage recorded (bypass)
  r = await apply('SAVE10', 4000000, Q.id, Q.token);
  step('Q4-reuse-norecord', { status: r.status, used: await usage(saveId, Q.id) });
  await recordUsage(Q.token, saveId); await recordUsage(Q.token, saveId);
  step('Q5-double-record', { used: await usage(saveId, Q.id) });
  r = await apply('SAVE10', 4000000, Q.id, Q.token);
  step('Q6-reuse-after-record', { status: r.status });

  // --- omitted / foreign user_id (GAP-04/05) ---
  r = await apply('SAVE10', 4000000, undefined, Q.token);
  step('Q7-noid-exhausted', { status: r.status, ok: !!(r.json && r.json.success) });
  r = await apply('SAVE10', 4000000, U.id, Q.token);
  step('Q8-foreign-id', { status: r.status, ok: !!(r.json && r.json.success) });

  // --- BVA-14: apply-only must not consume ---
  const u0 = await usage(vipId, U.id);
  await apply('VIP100', 4000000, U.id, U.token); await apply('VIP100', 4000000, U.id, U.token); await apply('VIP100', 4000000, U.id, U.token);
  step('N1-apply-only', { before: u0, after: await usage(vipId, U.id) });

  // --- checkout trust (GAP-06): 1d order ---
  co = await checkout(U.token, 1);
  const my = await api('GET', '/api/orders/my-orders', null, U.token);
  step('T1-tampered-checkout', { checkout: co.status, orderId: co.json && co.json.orderId, stored: my.json && my.json.find((o) => o.id === (co.json && co.json.orderId)) });

  // --- floor (BVA-18..20) FIX200 ---
  for (const [tag, total] of [['Z1-below', 199999], ['Z2-equal', 200000], ['Z3-above', 200001]]) {
    const rr = await apply('FIX200', total, U.id, U.token);
    step(tag, { status: rr.status, discount: rr.json && rr.json.discount_amount, final: rr.json && rr.json.final_amount });
  }

  // --- race GAP-10: VIP100 at used=1 -> parallel applies ---
  const W = await mkUser('w');
  const vid = (await apply('VIP100', 4000000, W.id, W.token)).json.coupon_id;
  await checkout(W.token, 3900000); await recordUsage(W.token, vid); // used=1
  const [ra, rb] = await Promise.all([
    apply('VIP100', 4000000, W.id, W.token),
    apply('VIP100', 4000000, W.id, W.token),
  ]);
  step('R1-race', { a: ra.status, b: rb.status, used: await usage(vid, W.id) });

  // --- time edges BVA-15..17 (T-1 / T / T+1) ---
  await sleep(Math.max(0, T - 1000 - Date.now()));
  r = await apply('TIMEB1', 100000, U.id, U.token);
  step('E1-Tminus1', { status: r.status, skewMs: Date.now() - (T - 1000) });
  await sleep(Math.max(0, T - Date.now()));
  r = await apply('TIMEB1', 100000, U.id, U.token);
  step('E2-Texact', { status: r.status, skewMs: Date.now() - T });
  await sleep(1200);
  r = await apply('TIMEB1', 100000, U.id, U.token);
  step('E3-Tplus1', { status: r.status, skewMs: Date.now() - T });

  // --- cleanup fixtures, verify seeds ---
  for (const c of ['TIMEB1', 'FIX200', 'INACT1']) {
    const row = await dbGet('SELECT id FROM coupons WHERE code=?', [c]);
    if (row) await api('DELETE', '/api/admin/coupons/' + row.id, null, TOK);
  }
  await sleep(400);
  const seeds = await dbGet('SELECT COUNT(*) c FROM coupons WHERE code IN (?,?,?,?)', ['SAVE10', 'BIGBUY', 'VIP100', 'EXPIRED']);
  step('F9-restore', { seeds: seeds.c });

  fs.writeFileSync(path.join(__dirname, 'exec_fr09_results.json'), JSON.stringify(OUT, null, 2));
  console.log('WROTE exec_fr09_results.json with', OUT.length, 'steps');
  db.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
