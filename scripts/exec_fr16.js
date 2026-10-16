// FR-16 execution script — API run + sqlite recounts + UI-parser replication.
// Run: node scripts/exec_fr16.js   (backend localhost:3000)
// Writes scripts/exec_fr16_results.json. Test rows use name prefix "T16 ";
// cleanup deletes them at the end and verifies product count restoration.
const sqlite3 = require('C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/node_modules/sqlite3');
const fs = require('fs');
const path = require('path');

const API = 'http://localhost:3000';
const DBF = 'C:/HCMUS/hk7/Testing/HW2/eshop-sut/backend/database.sqlite';
const db = new sqlite3.Database(DBF);
const OUT = [];
const sleep = (ms) => new Promise((x) => setTimeout(x, ms));

function dbGet(sql, p = []) {
  return new Promise((res, rej) => db.get(sql, p, (e, r) => (e ? rej(e) : res(r))));
}
function dbAll(sql, p = []) {
  return new Promise((res, rej) => db.all(sql, p, (e, r) => (e ? rej(e) : res(r))));
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
  const text = await r.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = { _raw: text.slice(0, 120) }; }
  return { status: r.status, json, ms };
}
function step(id, data) { OUT.push({ step: id, ...data }); console.log(id, JSON.stringify(data)); }
// Replica of frontend-admin App.jsx parse (trim/split, aliases, || defaults)
function uiParse(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}
function uiMap(rows) {
  return rows.map((row) => ({
    name: row['name'] || row['ten'] || row['Name'] || '',
    price: row['price'] || row['gia'] || row['Price'] || 0,
    description: row['description'] || row['mo_ta'] || row['Description'] || '',
    imageUrl: row['imageUrl'] || row['image'] || row['Image'] || '',
    category_id: parseInt(row['category_id'] || row['danh_muc'] || 1),
  }));
}
const row = (n, price = 100000, cat = 1, extra = {}) =>
  ({ name: `T16 P${n}`, price, description: `mo ta ${n}`, imageUrl: 'http://x/y.png', category_id: cat, ...extra });

(async () => {
  let adm = await api('POST', '/api/login', { email: 'admin@eshop.com', password: 'Admin123!' });
  if (!adm.json || !adm.json.token) adm = await api('POST', '/api/login', { email: 'admin@eshop.com', password: 'admin123' });
  const AT = adm.json.token;
  const cus = await api('POST', '/api/login', { email: 'test@eshop.com', password: 'Test1234!' });
  const CT = cus.json.token;
  const count = () => dbGet('SELECT COUNT(*) c FROM products').then((r) => r.c);
  const imp = (token, products) => api('POST', '/api/admin/import-products', { products }, token);
  const C0 = await count();
  step('C0-baseline', { products: C0, adminOk: !!AT });

  // DOM-01 happy 3 rows
  let c = await count();
  let r = await imp(AT, [row(1), row(2), row(3)]);
  await sleep(600);
  step('D01-happy3', { status: r.status, inserted: r.json.inserted, errors: r.json.errors, delta: (await count()) - c });

  // DOM-04 customer / DOM-05 guest
  r = await imp(CT, [row(4)]);
  step('D04-customer', { status: r.status });
  r = await imp(undefined, [row(5)]);
  step('D05-guest', { status: r.status });

  // DOM-06 wrong header via UI-equivalent parse
  const uh = uiMap(uiParse('title,price,desc,img,cat\nT16 W,100000,d,http://x/y.png,1\nT16 W2,200000,d,http://x/y.png,1'));
  c = await count();
  r = await imp(AT, uh);
  await sleep(600);
  step('D06-badheader', { sent: uh, status: r.status, inserted: r.json.inserted, errors: r.json.errors, delta: (await count()) - c });

  // DOM-07 short row (missing price -> NULL) / DOM-08 extra col (stock dropped)
  c = await count();
  r = await imp(AT, [{ name: 'T16 Short', description: 'd', imageUrl: 'http://x/y.png', category_id: 1 }, row(6)]);
  await sleep(600);
  const nullPrice = await dbGet("SELECT price, typeof(price) t FROM products WHERE name='T16 Short'");
  step('D07-shortrow', { status: r.status, inserted: r.json.inserted, errors: r.json.errors, stored: nullPrice, delta: (await count()) - c });
  c = await count();
  r = await imp(AT, [{ ...row(7), stock: 50 }]);
  await sleep(600);
  step('D08-extracol', { status: r.status, inserted: r.json.inserted, delta: (await count()) - c });

  // DOM-09/10 quoted comma/quote via UI-equivalent parse
  for (const [tag, csv] of [['D09-qcomma', 'name,price,description,imageUrl,category_id\n"Áo, thun",100000,mô tả,http://x/y.png,1'], ['D10-qquote', 'name,price,description,imageUrl,category_id\n"Áo ""đẹp""",100000,mô tả,http://x/y.png,1']]) {
    const parsed = uiMap(uiParse(csv));
    c = await count();
    const rr = await imp(AT, parsed);
    await sleep(600);
    const stored = await dbAll("SELECT name, price, typeof(price) t FROM products WHERE name LIKE 'T16 %' AND (name LIKE '%Áo%' OR price NOT BETWEEN 1 AND 999999999) ORDER BY id DESC LIMIT 2");
    step(tag, { parsed, status: rr.status, inserted: rr.json.inserted, stored, delta: (await count()) - c });
  }

  // DOM-11..15 field validation
  const badCases = [
    ['D11-emptyname', { name: '', price: 100000, description: 'd', imageUrl: 'http://x/y.png', category_id: 1 }],
    ['D11b-spacename', { name: '  ', price: 100000, description: 'd', imageUrl: 'http://x/y.png', category_id: 1 }],
    ['D12-zero', { ...row(8), price: 0 }],
    ['D13-neg', { ...row(9), price: -5000 }],
    ['D14-abc', { ...row(10), price: 'abc' }],
    ['D15-badcat', { ...row(11), category_id: 9999 }],
  ];
  for (const [tag, bad] of badCases) {
    c = await count();
    const rr = await imp(AT, [row(12), bad]);
    await sleep(600);
    step(tag, { status: rr.status, inserted: rr.json.inserted, errors: rr.json.errors, delta: (await count()) - c });
  }
  const abcType = await dbGet("SELECT price, typeof(price) t FROM products WHERE name='T16 P10'");
  step('D14b-abctype', { stored: abcType });

  // DOM-16 duplicate name (vs live seed product)
  c = await count();
  r = await imp(AT, [{ name: 'iPhone 15 Pro Max', price: 100000, description: 'dup', imageUrl: 'http://x/y.png', category_id: 1 }]);
  await sleep(600);
  step('D16-dupe', { status: r.status, inserted: r.json.inserted, delta: (await count()) - c });

  // DOM-17/18/19 atomicity trio
  c = await count();
  r = await imp(AT, [{ name: '', price: 1, description: 'd', imageUrl: 'u', category_id: 1 }, row(13), row(14)]);
  await sleep(600);
  step('D17-firstbad', { inserted: r.json.inserted, errors: r.json.errors, delta: (await count()) - c });
  c = await count();
  r = await imp(AT, [row(15), row(16), { name: '', price: 1, description: 'd', imageUrl: 'u', category_id: 1 }]);
  await sleep(600);
  step('D18-lastbad', { inserted: r.json.inserted, errors: r.json.errors, delta: (await count()) - c });
  c = await count();
  r = await imp(AT, [row(17), row(18), row(19), row(20), row(21)]);
  await sleep(600);
  const spot = await dbGet("SELECT name, price FROM products WHERE name='T16 P17'");
  step('D19-allvalid5', { inserted: r.json.inserted, delta: (await count()) - c, spot });

  // DOM-20 trailing blank / DOM-21 spaced (UI-equivalent)
  step('D20-trailblank', { parsed: uiMap(uiParse('name,price,description,imageUrl,category_id\nT16 T1,100000,d,http://x/y.png,1\nT16 T2,200000,d,http://x/y.png,1\n\n')) });
  step('D21-spaced', { parsed: uiMap(uiParse('name,price,description,imageUrl,category_id\nÁo , 100000 , mô tả , http://x/y.png , 1')) });

  // BVA-01/02 (UI blocks: preview empty -> button disabled, nothing sent)
  step('B01-0byte', { parsed: uiParse(''), note: 'preview empty -> Import button disabled, no request (App.jsx:387,418)' });
  step('B02-headeronly', { parsed: uiParse('name,price,description,imageUrl,category_id'), note: 'preview empty -> nothing sent' });

  // BVA-03/04/05 sizes
  for (const [tag, n] of [['B03-one', 1], ['B04-five', 5], ['B05-hundred', 100]]) {
    const rows = Array.from({ length: n }, (_, i) => row(`S${n}-${i}`));
    c = await count();
    const t0 = Date.now();
    const rr = await imp(AT, rows);
    await sleep(800);
    step(tag, { inserted: rr.json.inserted, errors: (rr.json.errors || []).length, delta: (await count()) - c, ms: Date.now() - t0 });
  }

  // BVA-06..09 err sweep N=5
  const mkBatch = (badIdx, bad) => Array.from({ length: 5 }, (_, i) => (i === badIdx ? bad : row(`E${badIdx}-${i}`)));
  const badRow = { name: '', price: 1, description: 'd', imageUrl: 'u', category_id: 1 };
  for (const [tag, idx] of [['B06-err1', 0], ['B07-err2', 1], ['B08-err4', 3], ['B09-err5', 4]]) {
    c = await count();
    const rr = await imp(AT, mkBatch(idx, badRow));
    await sleep(600);
    step(tag, { inserted: rr.json.inserted, errors: rr.json.errors, delta: (await count()) - c });
  }

  // BVA-10..13 prices
  for (const [tag, price] of [['B10-neg1', -1], ['B11-zero', 0], ['B12-one', 1], ['B13-huge', 999999999]]) {
    c = await count();
    const rr = await imp(AT, [{ name: `T16 B${tag}`, price, description: 'd', imageUrl: 'u', category_id: 1 }]);
    await sleep(600);
    step(tag, { inserted: rr.json.inserted, errors: rr.json.errors, delta: (await count()) - c });
  }

  // BVA-14 blank mid-file via UI parse
  const mid = uiMap(uiParse('name,price,description,imageUrl,category_id\nT16 M1,100000,d,http://x/y.png,1\n\nT16 M2,200000,d,http://x/y.png,1'));
  c = await count();
  r = await imp(AT, mid);
  await sleep(600);
  step('B14-midblank', { parsedNames: mid.map((m) => m.name), inserted: r.json.inserted, errors: r.json.errors, delta: (await count()) - c });

  // BVA-15/16 K-1/K+1 raw
  c = await count();
  r = await imp(AT, [{ name: 'T16 K4a', price: 100000, description: 'd', imageUrl: 'u' }]); // missing category_id -> 1
  await sleep(600);
  step('B15-kminus1', { inserted: r.json.inserted, errors: r.json.errors, delta: (await count()) - c });
  c = await count();
  r = await imp(AT, [{ ...row(22), extra: 'X' }]);
  await sleep(600);
  step('B16-kplus1', { inserted: r.json.inserted, delta: (await count()) - c });

  // BVA-17/18/19 lengths
  for (const [tag, len] of [['B17-one', 1], ['B18-255', 255], ['B19a-256', 256], ['B19b-1000', 1000]]) {
    c = await count();
    const rr = await imp(AT, [{ name: `T16 L${len}-` + 'A'.repeat(Math.max(0, len - 8)), price: 100000, description: 'd', imageUrl: 'u', category_id: 1 }]);
    await sleep(600);
    step(tag, { namelen: len, inserted: rr.json.inserted, delta: (await count()) - c });
  }

  // BVA-20 stock column
  c = await count();
  r = await imp(AT, [{ name: 'T16 ST', price: 100000, description: 'd', imageUrl: 'u', category_id: 1, stock: 50 }]);
  await sleep(600);
  const stCol = await dbAll("PRAGMA table_info(products)");
  step('B20-stockcol', { inserted: r.json.inserted, delta: (await count()) - c, hasStockCol: stCol.some((col) => col.name === 'stock') });

  // GAP-08 null row
  r = await api('POST', '/api/admin/import-products', { products: [null] }, AT);
  step('G08-nullrow', { status: r.status, body: JSON.stringify(r.json).slice(0, 160) });

  // cleanup test rows
  await dbRun("DELETE FROM products WHERE name LIKE 'T16 %' OR name IN ('iPhone 15 Pro Max') AND id > 5");
  await dbRun("DELETE FROM products WHERE name LIKE 'T16%'");
  await dbRun('DELETE FROM products WHERE name LIKE \'"Áo%\'');
  await dbRun("DELETE FROM products WHERE TRIM(name) = ''");
  await sleep(400);
  step('F9-cleanup', { finalCount: await count(), restoredToBaseline: (await count()) === C0 });

  fs.writeFileSync(path.join(__dirname, 'exec_fr16_results.json'), JSON.stringify(OUT, null, 2));
  console.log('WROTE exec_fr16_results.json with', OUT.length, 'steps');
  db.close();
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
