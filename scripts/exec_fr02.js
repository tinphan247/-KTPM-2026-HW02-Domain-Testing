// FR-02 execution script — API-level black-box run + white-box DB inspection.
// Run: node scripts/exec_fr02.js   (backend must be on localhost:3000)
// Evidence: prints per-step lines + writes scripts/exec_fr02_results.json
// Notes: uses FRESH registered users (execA..execH) to isolate counters;
// expiry is SIMULATED via DB (locked_until -> past), disclosed in report.
const sqlite3 = require('C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/node_modules/sqlite3');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:3000';
const DBF = 'C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/database.sqlite';
const db = new sqlite3.Database(DBF);
const OUT = [];
const stamp = 'exec' + Date.now().toString(36);

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
async function row(email) {
  await new Promise((x) => setTimeout(x, 600)); // settle: server db.run is fire-and-forget
  return dbGet('SELECT id,email,login_attempts,locked_until FROM users WHERE email=?', [email]);
}
function step(id, data) { OUT.push({ step: id, ...data }); console.log(id, JSON.stringify(data)); }

(async () => {
  const A = `${stamp}a@t.com`, B = `${stamp}b@t.com`, C = `${stamp}c@t.com`,
        D = `${stamp}d@t.com`, E = `${stamp}e@t.com`, F = `${stamp}f@t.com`,
        G = `${stamp}g@t.com`, H = `${stamp}h@t.com`;
  const PWC = 'Cx123456!', PWW = 'Wrong123!';

  for (const u of [A, B, C, D, E, F, G, H])
    await api('POST', '/api/register', { name: 'Exec', email: u, password: PWC });

  // --- counting + early lock (GAP-01) ---
  let r = await api('POST', '/api/login', { email: A, password: PWW });
  let s = await row(A);
  step('A1-first-fail', { status: r.status, err: r.json && r.json.error, attempts: s.login_attempts });
  r = await api('POST', '/api/login', { email: A, password: PWW });
  s = await row(A);
  const lockedMs = s.locked_until ? new Date(s.locked_until).getTime() - Date.now() : null;
  step('A2-second-fail', { status: r.status, attempts: s.login_attempts, locked_until: s.locked_until, deltaMs: lockedMs });
  r = await api('POST', '/api/login', { email: A, password: PWC });
  step('A3-correct-while-locked', { status: r.status, err: r.json && r.json.error });
  const before = await row(A);
  r = await api('POST', '/api/login', { email: A, password: PWC });
  const after = await row(A);
  step('A4-fourth-while-locked', { status: r.status, unchanged: JSON.stringify(before) === JSON.stringify(after) });

  // --- simulated expiry -> success/reset/leak (DOM-10/11, GAP-05) ---
  await dbRun("UPDATE users SET locked_until = datetime('now','-5 seconds') WHERE email=?", [A]);
  r = await api('POST', '/api/login', { email: A, password: PWC });
  s = await row(A);
  step('A5-post-expiry-success', {
    status: r.status, hasToken: !!(r.json && r.json.token),
    respHasPassword: !!(r.json && r.json.user && 'password' in r.json.user),
    respPasswordValue: r.json && r.json.user && r.json.user.password,
    attempts: s.login_attempts, locked_until: s.locked_until, jwt: r.json && r.json.token,
  });
  // users/me leak check
  const me = await api('GET', '/api/users/me', null, r.json && r.json.token);
  step('A6-users-me', { status: me.status, hasPassword: !!(me.json && 'password' in me.json) });

  // --- stale-counter relock (GAP-04 / BVA-09) on B ---
  await api('POST', '/api/login', { email: B, password: PWW });
  await api('POST', '/api/login', { email: B, password: PWW });
  await dbRun("UPDATE users SET locked_until = datetime('now','-5 seconds') WHERE email=?", [B]);
  r = await api('POST', '/api/login', { email: B, password: PWW });
  s = await row(B);
  step('B1-wrong-after-expiry', { status: r.status, attempts: s.login_attempts, relocked: new Date(s.locked_until).getTime() > Date.now() });

  // --- DOM-04/15 uniformity + malformed/empty (DOM-02/03) ---
  const unk = await api('POST', '/api/login', { email: 'nouser999@eshop.com', password: 'Any123!x' });
  const wr = await api('POST', '/api/login', { email: C, password: PWW });
  step('C0-uniformity', { unkStatus: unk.status, unkErr: unk.json && unk.json.error, wrongStatus: wr.status, wrongErr: wr.json && wr.json.error });
  const mal = await api('POST', '/api/login', { email: 'testeshop.com', password: PWC });
  step('C1-malformed-email', { status: mal.status });
  const empE = await api('POST', '/api/login', { email: '', password: PWC });
  step('C2-empty-email', { status: empE.status });

  // --- DOM-06/GAP-03 empty password counts? ---
  const cBefore = await row(C);
  r = await api('POST', '/api/login', { email: C, password: '' });
  s = await row(C);
  step('C3-empty-password', { status: r.status, attemptsBefore: cBefore.login_attempts, attemptsAfter: s.login_attempts });

  // --- normalization GAP-06/07 (use test@eshop.com variants) ---
  r = await api('POST', '/api/login', { email: 'TEST@ESHOP.COM', password: 'Test1234!' });
  step('D1-upper-email', { status: r.status });
  r = await api('POST', '/api/login', { email: '  test@eshop.com  ', password: 'Test1234!' });
  step('D2-spaced-email', { status: r.status });
  r = await api('POST', '/api/login', { email: 'test@eshop.com', password: 'Test1234!' });
  step('D3-seed-happy-path', { status: r.status, hasToken: !!(r.json && r.json.token) });

  // --- BVA-10/11/12 lengths on D ---
  for (const [tag, em, pw] of [['E1-1char', 'a', 'b'], ['E2-7char', D, 'Abc12!x'], ['E3-1000char', 'x'.repeat(1000) + '@t.com', 'y'.repeat(1000)]]) {
    r = await api('POST', '/api/login', { email: em, password: pw });
    step(tag, { status: r.status, ms: r.ms });
  }

  // --- BVA-13 double-submit unit on E ---
  const e0 = await row(E);
  await Promise.all([
    api('POST', '/api/login', { email: E, password: PWW }),
    api('POST', '/api/login', { email: E, password: PWW }),
  ]);
  s = await row(E);
  step('F1-double-submit', { before: e0.login_attempts, after: s.login_attempts });

  // --- BVA-04 correct-on-3rd on F (with +2 bug: 2 wrongs already lock) ---
  await api('POST', '/api/login', { email: F, password: PWW });
  await api('POST', '/api/login', { email: F, password: PWW });
  r = await api('POST', '/api/login', { email: F, password: PWC });
  step('F2-correct-third', { status: r.status, err: r.json && r.json.error });

  // --- real-time lock holds: 15s / 29s / 30s / 31s on G ---
  await api('POST', '/api/login', { email: G, password: PWW });
  await api('POST', '/api/login', { email: G, password: PWW });
  const tLock = Date.now();
  const probe = async (tag, waitMs) => {
    await new Promise((x) => setTimeout(x, waitMs));
    const rr = await api('POST', '/api/login', { email: G, password: PWC });
    step(tag, { elapsedMs: Date.now() - tLock, status: rr.status });
  };
  await probe('G1-15s', 15000);
  await probe('G2-29s', 14000);
  await probe('G3-30s', 1000);
  await probe('G4-31s', 1000);

  // --- DOM-11/12 reset semantics on H ---
  await api('POST', '/api/login', { email: H, password: PWW });
  r = await api('POST', '/api/login', { email: H, password: PWC });
  s = await row(H);
  step('H1-success-after-1-fail', { status: r.status, attempts: s.login_attempts });
  await api('POST', '/api/login', { email: H, password: PWW });
  r = await api('POST', '/api/login', { email: H, password: PWW });
  s = await row(H);
  step('H2-two-fails-after-reset', { status: r.status, attempts: s.login_attempts, locked: !!s.locked_until && new Date(s.locked_until) > new Date() });

  fs.writeFileSync(path.join(__dirname, 'exec_fr02_results.json'), JSON.stringify(OUT, null, 2));
  console.log('WROTE exec_fr02_results.json with', OUT.length, 'steps');
  db.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
