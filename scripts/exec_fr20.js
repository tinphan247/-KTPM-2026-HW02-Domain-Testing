// FR-20 execution script — order-lifecycle API run + sqlite verification.
// Run: node scripts/exec_fr20.js   (backend localhost:3000)
// Writes scripts/exec_fr20_results.json. Users mobA (main), mobB (victim),
// mobC (single order), mobD (15 orders). Admin transitions via
// PUT /api/admin/orders/:id/status (no role check needed). Test orders are
// left with documented states; cleanup removes mob* test orders at the end.
const sqlite3 = require('C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/node_modules/sqlite3');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:3000';
const DBF = 'C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/database.sqlite';
const db = new sqlite3.Database(DBF);
const OUT = [];
const stamp = 'mob' + Date.now().toString(36);
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
  const mkUser = async (tag) => {
    const email = `${stamp}${tag}@t.com`;
    await api('POST', '/api/register', { name: 'Mob', email, password: 'Cx123456!' });
    const l = await api('POST', '/api/login', { email, password: 'Cx123456!' });
    const row = await dbGet('SELECT id FROM users WHERE email=?', [email]);
    return { email, token: l.json.token, id: row.id };
  };
  const A = await mkUser('a'), B = await mkUser('b'), C = await mkUser('c'), D = await mkUser('d');
  const checkout = (token, total) => api('POST', '/api/checkout', { total_amount: total, shipping_address: 'HN' }, token);
  const cancel = (token, id) => api('PUT', `/api/orders/${id}/cancel`, {}, token);
  const setStatus = (id, status) => api('PUT', `/api/admin/orders/${id}/status`, { status }, A.token);
  const st = (id) => dbGet('SELECT status FROM orders WHERE id=?', [id]).then((r) => r && r.status);
  const usage = (cid, uid) => dbGet('SELECT COUNT(*) c FROM coupon_usage WHERE coupon_id=? AND user_id=?', [cid, uid]).then((r) => r.c);
  const newOrder = async (u, total = 100000) => (await checkout(u.token, total)).json.orderId;

  // DOM-01 pending -> cancel
  let id = await newOrder(A);
  let r = await cancel(A.token, id);
  step('D01-pending', { status: r.status, now: await st(id) });

  // DOM-02 confirmed -> cancel
  id = await newOrder(A);
  await setStatus(id, 'confirmed');
  r = await cancel(A.token, id);
  step('D02-confirmed', { status: r.status, now: await st(id) });

  // DOM-04 shipping -> cancel (user)
  id = await newOrder(A);
  await setStatus(id, 'confirmed'); await setStatus(id, 'shipping');
  r = await cancel(A.token, id);
  step('D04-shipping', { status: r.status, err: r.json && r.json.error, now: await st(id) });

  // DOM-05 delivered / DOM-06 canceled re-cancel
  id = await newOrder(A);
  await setStatus(id, 'confirmed'); await setStatus(id, 'shipping'); await setStatus(id, 'delivered');
  r = await cancel(A.token, id);
  step('D05-delivered', { status: r.status, now: await st(id) });
  id = await newOrder(A);
  await cancel(A.token, id);
  r = await cancel(A.token, id);
  step('D06-recancel', { status: r.status, err: r.json && r.json.error, now: await st(id) });

  // DOM-07 cross-user (B's pending, A attempts)
  const bid = await newOrder(B);
  r = await cancel(A.token, bid);
  step('D07-crossuser', { status: r.status, err: r.json && r.json.error, victimNow: await st(bid) });

  // DOM-08 guest
  r = await api('GET', '/api/orders/my-orders', null, undefined);
  const g2 = await api('PUT', `/api/orders/${bid}/cancel`, {}, undefined);
  step('D08-guest', { history: r.status, cancel: g2.status });

  // DOM-03 ownership scoping (A sees only own)
  const mine = await api('GET', '/api/orders/my-orders', null, A.token);
  const leaked = (mine.json || []).some((o) => o.user_id !== A.id);
  step('D03-scoping', { count: (mine.json || []).length, leaked });

  // DOM-15 coupon refund: VIP100 order + usage, then cancel
  const vipApply = await api('POST', '/api/apply-coupon', { code: 'VIP100', total_amount: 4000000, user_id: A.id }, A.token);
  const vid = vipApply.json.coupon_id;
  const u0 = await usage(vid, A.id);
  const coid = (await checkout(A.token, 3900000)).json.orderId;
  await api('POST', '/api/coupon-usage', { coupon_id: vid }, A.token);
  const u1 = await usage(vid, A.id);
  r = await cancel(A.token, coid);
  await sleep(500);
  step('D15-refund', { usedBefore: u1, cancel: r.status, usedAfter: await usage(vid, A.id), orderNow: await st(coid), usedStart: u0 });

  // DOM-17 / BVA-04 double-tap (parallel)
  id = await newOrder(A);
  const [p1, p2] = await Promise.all([cancel(A.token, id), cancel(A.token, id)]);
  await sleep(500);
  step('D17-doubletap', { first: p1.status, second: p2.status, now: await st(id) });

  // BVA-01 immediate re-cancel (<=1s)
  id = await newOrder(A);
  await cancel(A.token, id);
  r = await cancel(A.token, id);
  step('V01-immediate-recancel', { status: r.status, now: await st(id) });

  // BVA-05 delayed re-cancel (5s)
  id = await newOrder(A);
  await cancel(A.token, id);
  await sleep(5000);
  r = await cancel(A.token, id);
  step('V05-delayed-recancel', { status: r.status });

  // BVA-03 race cancel || ship
  id = await newOrder(A);
  await setStatus(id, 'confirmed');
  const [rc, rs] = await Promise.all([cancel(A.token, id), setStatus(id, 'shipping')]);
  await sleep(500);
  step('V03-race', { cancelStatus: rc.status, shipOk: rs.status, final: await st(id) });

  // BVA-06 adjacent ids (B's order id +/-1) + BVA-07 garbage ids
  const probes = [bid + 1, bid - 1, 0, -1, 999999, 'abc'];
  for (const pid of probes) {
    const rr = await cancel(A.token, pid);
    step(pid === bid + 1 ? 'V06-adjacent' : `V07-id-${pid}`, { status: rr.status });
  }
  step('V06b-victim-intact', { victimNow: await st(bid) });

  // BVA-08 one-order history (C) / BVA-09 many (D x15)
  const cid = await newOrder(C);
  const hc = await api('GET', '/api/orders/my-orders', null, C.token);
  step('V08-one-order', { count: (hc.json || []).length, sample: (hc.json || [])[0] });
  for (let i = 0; i < 15; i++) await checkout(D.token, 50000 + i);
  const hd = await api('GET', '/api/orders/my-orders', null, D.token);
  const ids = (hd.json || []).map((o) => o.id);
  step('V09-many', { count: ids.length, ordered: ids.every((v, i) => i === 0 || v < ids[i - 1]), dupes: ids.length !== new Set(ids).size });

  // BVA-10 bad token
  r = await cancel('expired.invalid.token', cid);
  step('V10-badtoken', { status: r.status, now: await st(cid) });

  // BVA-02 fresh-shipping recency
  id = await newOrder(A);
  await setStatus(id, 'confirmed'); await setStatus(id, 'shipping');
  r = await cancel(A.token, id);
  step('V02-fresh-shipping', { status: r.status, now: await st(id) });

  // cleanup mob test orders (keep DB tidy; users stay documented)
  for (const u of [A, B, C, D]) await dbRun('DELETE FROM orders WHERE user_id=?', [u.id]);
  await sleep(300);
  step('F9-cleanup', { ordersLeft: (await dbGet(`SELECT COUNT(*) c FROM orders WHERE user_id IN (${A.id},${B.id},${C.id},${D.id})`)).c });

  fs.writeFileSync(path.join(__dirname, 'exec_fr20_results.json'), JSON.stringify(OUT, null, 2));
  console.log('WROTE exec_fr20_results.json with', OUT.length, 'steps');
  db.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
