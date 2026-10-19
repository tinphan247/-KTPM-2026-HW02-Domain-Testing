const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/F02');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper: Common VS Code Card Template
function getCodeCardTemplate({ bugId, bugTitle, fileName, filePath, tabIcon, lineStart, lines, calloutTitle, calloutDesc, fixTitle, fixCode }) {
  let lineNumbersHtml = '';
  let codeHtml = '';

  lines.forEach((line, index) => {
    lineNumbersHtml += `<div>${lineStart + index}</div>`;
    codeHtml += `<div>${line}</div>`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${bugId} Code Evidence</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #0b0f19;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  .vscode-window {
    background: #1e1e1e;
    border-radius: 8px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    width: 100%;
    max-width: 1040px;
    overflow: hidden;
    border: 1px solid #333333;
  }
  .title-bar {
    background: #323233;
    padding: 9px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #252526;
  }
  .traffic-lights {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot.red { background: #ff5f56; }
  .dot.yellow { background: #ffbd2e; }
  .dot.green { background: #27c93f; }
  .title-text {
    color: #cccccc;
    font-size: 12px;
    font-family: monospace;
    margin-left: 10px;
  }
  .bug-tag {
    background: #dc2626;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 4px;
    font-family: monospace;
    letter-spacing: 0.5px;
  }
  .tab-bar {
    background: #252526;
    display: flex;
    border-bottom: 1px solid #1e1e1e;
  }
  .tab {
    background: #1e1e1e;
    color: #ffffff;
    padding: 8px 16px;
    font-size: 13px;
    font-family: monospace;
    border-top: 2px solid #007acc;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .editor {
    display: flex;
    padding: 16px 0;
    background: #1e1e1e;
    font-family: "Cascadia Code", Consolas, "Courier New", monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #d4d4d4;
  }
  .line-numbers {
    width: 50px;
    text-align: right;
    padding-right: 16px;
    color: #858585;
    user-select: none;
    border-right: 1px solid #2d2d2d;
  }
  .code-area {
    padding-left: 16px;
    flex: 1;
    overflow-x: auto;
  }
  .kw { color: #569cd6; font-weight: bold; }
  .str { color: #ce9178; }
  .fn { color: #dcdcaa; }
  .var { color: #9cdcfe; }
  .prop { color: #9cdcfe; }
  .num { color: #b5cea8; }
  .cm { color: #6a9955; font-style: italic; }
  .op { color: #d4d4d4; }
  .hl-bug {
    background: rgba(220, 38, 38, 0.28);
    display: block;
    width: 100%;
    border-left: 4px solid #ef4444;
    padding-left: 4px;
    margin-left: -8px;
  }
  .callout-box {
    margin: 16px 20px;
    background: #2d1515;
    border-left: 4px solid #ef4444;
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid #551d1d;
  }
  .callout-title {
    color: #fca5a5;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .callout-desc {
    color: #fecaca;
    font-size: 12px;
    line-height: 1.5;
  }
  .fix-box {
    margin: 16px 20px 20px 20px;
    background: #14291e;
    border-left: 4px solid #10b981;
    padding: 12px 16px;
    border-radius: 4px;
    border: 1px solid #1e4d35;
  }
  .fix-title {
    color: #6ee7b7;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .fix-code {
    font-family: "Cascadia Code", Consolas, monospace;
    font-size: 12px;
    color: #a7f3d0;
    background: #0d1e16;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #19402c;
  }
  .statusbar {
    background: #007acc;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 3px 12px;
    font-size: 11px;
    font-family: sans-serif;
  }
</style>
</head>
<body>

<div class="vscode-window">
  <div class="title-bar">
    <div class="traffic-lights">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title-text">${filePath} — EShop SUT</span>
    </div>
    <div class="bug-tag">${bugId}: ${bugTitle}</div>
  </div>

  <div class="tab-bar">
    <div class="tab">
      <span>${tabIcon}</span>
      <span>${fileName}</span>
    </div>
  </div>

  <div class="editor">
    <div class="line-numbers">
      ${lineNumbersHtml}
    </div>
    <div class="code-area">
      ${codeHtml}
    </div>
  </div>

  <div class="callout-box">
    <div class="callout-title">⚠️ ROOT CAUSE ANALYSIS (PHÂN TÍCH NGUYÊN NHÂN GỐC)</div>
    <div class="callout-desc">${calloutDesc}</div>
  </div>

  <div class="fix-box">
    <div class="fix-title">✅ RECOMMENDED FIX (GIẢI PHÁP ĐỀ XUẤT)</div>
    <div class="fix-code">${fixCode}</div>
  </div>

  <div class="statusbar">
    <div><span>Git: hw02-23120279*</span> | <span>UTF-8</span> | <span>JavaScript</span></div>
    <div><span>Nguyen Le Quang Kan (23120279)</span></div>
  </div>
</div>

</body>
</html>`;
}

// -------------------------------------------------------------
// 1. BUG-FR02-01_Code.html: Increments by 2 instead of 1 (server.js:54)
// -------------------------------------------------------------
const htmlBug01 = getCodeCardTemplate({
  bugId: 'BUG-FR02-01',
  bugTitle: 'Bộ Đếm Số Lần Sai Tăng +2 (Khóa Sau 2 Lần Sai Thay Vì 3)',
  fileName: 'server.js',
  filePath: 'd:/KAN/N4_1/eshop-sut/backend/server.js',
  tabIcon: '📄',
  lineStart: 46,
  lines: [
    `    <span class="kw">if</span> (<span class="var">user</span>.<span class="prop">password</span> <span class="op">===</span> <span class="var">password</span>) {`,
    `      <span class="var">db</span>.<span class="fn">run</span>(<span class="str">"UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?"</span>, [<span class="var">user</span>.<span class="prop">id</span>]);`,
    `      <span class="kw">const</span> <span class="var">token</span> <span class="op">=</span> <span class="var">jwt</span>.<span class="fn">sign</span>({ <span class="prop">id</span>: <span class="var">user</span>.<span class="prop">id</span>, <span class="prop">role</span>: <span class="var">user</span>.<span class="prop">role</span> }, <span class="var">SECRET_KEY</span>);`,
    `      <span class="var">res</span>.<span class="fn">json</span>({ <span class="prop">message</span>: <span class="str">"Login successful"</span>, <span class="var">token</span>, <span class="var">user</span> });`,
    `    } <span class="kw">else</span> {`,
    `      <span class="hl-bug"><span class="cm">// LỖI NGUYÊN NHÂN GỐC: Tăng 2 đơn vị mỗi lần sai thay vì 1 đơn vị theo đặc tả FR-02!</span></span>`,
    `      <span class="hl-bug"><span class="kw">const</span> <span class="var">newAttempts</span> <span class="op">=</span> <span class="var">user</span>.<span class="prop">login_attempts</span> <span class="op">+</span> <span class="num">2</span>;</span>`,
    `      <span class="kw">let</span> <span class="var">lockedUntil</span> <span class="op">=</span> <span class="kw">null</span>;`,
    `      <span class="kw">if</span> (<span class="var">newAttempts</span> <span class="op">&gt;=</span> <span class="num">3</span>) {`,
    `        <span class="var">lockedUntil</span> <span class="op">=</span> <span class="kw">new</span> <span class="fn">Date</span>(<span class="var">Date</span>.<span class="fn">now</span>() <span class="op">+</span> <span class="num">180000</span>).<span class="fn">toISOString</span>();`,
    `      }`,
    `      <span class="var">db</span>.<span class="fn">run</span>(<span class="str">"UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?"</span>, [<span class="var">newAttempts</span>, <span class="var">lockedUntil</span>, <span class="var">user</span>.<span class="prop">id</span>]);`,
    `      <span class="var">res</span>.<span class="fn">status</span>(<span class="num">401</span>).<span class="fn">json</span>({ <span class="prop">error</span>: <span class="str">"Invalid email or password"</span> });`,
    `    }`
  ],
  calloutDesc: 'Đặc tả <b>FR-02</b> quy định: <i>"Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị. Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa"</i>. Tại dòng 54, lập trình viên viết <code>user.login_attempts + 2</code>, dẫn đến việc ngay lần sai thứ nhất biến đếm đã nhảy thành 2, và lần sai thứ hai nhảy thành 4 (&ge; 3), làm tài khoản bị khóa oan uổng chỉ sau 2 lần sai!',
  fixCode: `const newAttempts = user.login_attempts + 1; // Tăng đúng 1 đơn vị theo SRS`
});

// -------------------------------------------------------------
// 2. BUG-FR02-02_Code.html: Lock duration 180s instead of 30s (server.js:57)
// -------------------------------------------------------------
const htmlBug02 = getCodeCardTemplate({
  bugId: 'BUG-FR02-02',
  bugTitle: 'Thời Gian Khóa Tài Khoản 180 Giây Thay Vì 30 Giây (server.js:57)',
  fileName: 'server.js',
  filePath: 'd:/KAN/N4_1/eshop-sut/backend/server.js',
  tabIcon: '📄',
  lineStart: 51,
  lines: [
    `    } <span class="kw">else</span> {`,
    `      <span class="kw">const</span> <span class="var">newAttempts</span> <span class="op">=</span> <span class="var">user</span>.<span class="prop">login_attempts</span> <span class="op">+</span> <span class="num">2</span>;`,
    `      <span class="kw">let</span> <span class="var">lockedUntil</span> <span class="op">=</span> <span class="kw">null</span>;`,
    `      <span class="kw">if</span> (<span class="var">newAttempts</span> <span class="op">&gt;=</span> <span class="num">3</span>) {`,
    `        <span class="hl-bug"><span class="cm">// LỖI NGUYÊN NHÂN GỐC: 180000ms = 180s (3 phút), trong khi đặc tả demo yêu cầu khóa 30 giây!</span></span>`,
    `        <span class="hl-bug"><span class="var">lockedUntil</span> <span class="op">=</span> <span class="kw">new</span> <span class="fn">Date</span>(<span class="var">Date</span>.<span class="fn">now</span>() <span class="op">+</span> <span class="num">180000</span>).<span class="fn">toISOString</span>();</span>`,
    `      }`,
    `      <span class="var">db</span>.<span class="fn">run</span>(<span class="str">"UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?"</span>, [<span class="var">newAttempts</span>, <span class="var">lockedUntil</span>, <span class="var">user</span>.<span class="prop">id</span>]);`,
    `      <span class="var">res</span>.<span class="fn">status</span>(<span class="num">401</span>).<span class="fn">json</span>({ <span class="prop">error</span>: <span class="str">"Invalid email or password"</span> });`,
    `    }`
  ],
  calloutDesc: 'Đặc tả <b>FR-02</b> quy định: <i>"Tài khoản bị tạm khóa 30 giây (môi trường demo)"</i>. Tại dòng 57, code cộng thêm <code>180000</code> ms (tương đương 180 giây = 3 phút), gấp 6 lần thời gian quy định, khiến người dùng phải đợi quá lâu trong môi trường thử nghiệm và vi phạm đặc tả.',
  fixCode: `lockedUntil = new Date(Date.now() + 30000).toISOString(); // Khóa đúng 30 giây (30000ms)`
});

// -------------------------------------------------------------
// 3. BUG-FR02-03_Code.html: Mobile GUI Violations (App.js:763, 783, 790)
// -------------------------------------------------------------
const htmlBug03 = getCodeCardTemplate({
  bugId: 'BUG-FR02-03',
  bugTitle: 'Vi Phạm Chuẩn Giao Diện Mobile FR-21 / FR-22 (App.js)',
  fileName: 'App.js',
  filePath: 'd:/KAN/N4_1/eshop-sut/frontend-mobile/App.js',
  tabIcon: '📱',
  lineStart: 761,
  lines: [
    `      &lt;<span class="kw">ScrollView</span> <span class="prop">contentContainerStyle</span>={styles.formContainer}&gt;`,
    `        &lt;<span class="kw">Text</span> <span class="prop">style</span>={styles.headerCenter}&gt;Đăng Nhập&lt;/<span class="kw">Text</span>&gt;`,
    `        <span class="hl-bug">&lt;<span class="kw">Text</span> <span class="prop">style</span>={styles.label}&gt;Username&lt;/<span class="kw">Text</span>&gt; <span class="cm">// LỖI: Nhãn Username thay vì Email, thiếu dấu *</span></span>`,
    `        &lt;<span class="kw">TextInput</span> <span class="prop">style</span>={styles.textInput} <span class="prop">placeholder</span>=<span class="str">"Email"</span> <span class="prop">value</span>={email} <span class="prop">onChangeText</span>={setEmail} /&gt;`,
    `        &lt;<span class="kw">Text</span> <span class="prop">style</span>={styles.label}&gt;Mật khẩu&lt;/<span class="kw">Text</span>&gt; <span class="cm">// LỖI: Thiếu dấu * trường bắt buộc</span>`,
    `        &lt;<span class="kw">TextInput</span> <span class="prop">style</span>={styles.textInput} <span class="prop">placeholder</span>=<span class="str">"Mật khẩu"</span> <span class="prop">value</span>={password} <span class="prop">secureTextEntry</span> /&gt;`,
    `        &lt;<span class="kw">TouchableOpacity</span> <span class="prop">style</span>={styles.button} <span class="prop">onPress</span>={handleLogin}&gt;`,
    `          <span class="hl-bug">&lt;<span class="kw">Text</span> <span class="prop">style</span>={styles.buttonText}&gt;Sign In&lt;/<span class="kw">Text</span>&gt; <span class="cm">// LỖI FR-21: Dùng tiếng Anh "Sign In" thay vì "Đăng nhập"</span></span>`,
    `        &lt;/<span class="kw">TouchableOpacity</span>&gt;`,
    `        <span class="hl-bug">{!!loginError &amp;&amp; &lt;<span class="kw">Text</span> <span class="prop">style</span>={styles.errorBoxText}&gt;{loginError}&lt;/<span class="kw">Text</span>&gt;} <span class="cm">// LỖI FR-22: Lỗi đặt DƯỚI nút submit</span></span>`
  ],
  calloutDesc: 'File <code>frontend-mobile/App.js</code> vi phạm hàng loạt tiêu chuẩn giao diện của SRS: <b>(1) FR-21:</b> Nút submit dùng tiếng Anh "Sign In" thay vì "Đăng nhập"; <b>(2) FR-22:</b> Nhãn dùng từ "Username" thay vì "Email", thiếu ký hiệu <code>*</code> cạnh nhãn bắt buộc; <b>(3) FR-22:</b> Khối hiển thị thông báo lỗi <code>loginError</code> nằm bên dưới nút submit; <b>(4)</b> Hàm <code>handleLogin</code> nuốt mất thông báo tài khoản bị khóa từ server.',
  fixCode: `// Chuyển nhãn thành "Email *", nút thành "Đăng nhập", và di chuyển {loginError} lên trên nút submit`
});

// -------------------------------------------------------------
// 4. BUG-FR02-01_DB.html: Terminal card showing attempts counter jumping +2
// -------------------------------------------------------------
const htmlDb01 = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BUG-FR02-01_DB Database Evidence</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #0b0f19; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 24px; }
  .window { background: #1e293b; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); width: 100%; max-width: 1040px; overflow: hidden; border: 1px solid #334155; }
  .title-bar { background: #0f172a; padding: 10px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
  .traffic-lights { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ef4444; }
  .dot.yellow { background: #f59e0b; }
  .dot.green { background: #10b981; }
  .title-text { color: #94a3b8; font-size: 12.5px; font-family: monospace; font-weight: 600; margin-left: 10px; }
  .bug-tag { background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 4px; font-family: monospace; }
  .terminal-body { padding: 20px 24px; font-family: "Cascadia Code", Consolas, "Courier New", monospace; font-size: 12.5px; line-height: 1.55; color: #f8fafc; }
  .prompt { color: #38bdf8; font-weight: 600; }
  .cmd { color: #f1f5f9; }
  .comment { color: #94a3b8; font-style: italic; margin-bottom: 4px; }
  .table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; font-size: 12px; }
  .table th { background: #334155; color: #cbd5e1; padding: 6px 12px; text-align: left; border: 1px solid #475569; }
  .table td { padding: 6px 12px; border: 1px solid #334155; color: #e2e8f0; }
  .highlight-error { background: rgba(239, 68, 68, 0.25); color: #fca5a5; font-weight: bold; border: 1px solid #ef4444; padding: 2px 6px; border-radius: 4px; }
  .alert-banner { background: #450a0a; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin-top: 14px; border: 1px solid #7f1d1d; }
  .alert-title { color: #fca5a5; font-weight: 700; font-size: 12.5px; display: flex; align-items: center; gap: 6px; }
  .alert-desc { color: #fecaca; font-size: 12px; margin-top: 4px; line-height: 1.45; }
  .statusbar { background: #0284c7; color: #ffffff; display: flex; justify-content: space-between; padding: 4px 16px; font-size: 11px; }
</style>
</head>
<body>

<div class="window">
  <div class="title-bar">
    <div class="traffic-lights">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title-text">MINGW64:/d/KAN/N4_1/eshop-sut/backend — sqlite3 database.sqlite</span>
    </div>
    <div class="bug-tag">BUG-FR02-01_DB: Bộ Đếm Thất Bại Nhảy Vọt +2 (Khóa Oan Sau 2 Lần Sai)</div>
  </div>

  <div class="terminal-body">
    <div class="comment">-- 1. Sau khi User đăng nhập sai LẦN 1: Kỳ vọng login_attempts = 1, nhưng thực tế = 2</div>
    <div><span class="prompt">sqlite&gt;</span> <span class="cmd">SELECT id, email, login_attempts, locked_until FROM users WHERE email = 'test@eshop.com';</span></div>
    
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>email</th>
          <th>login_attempts</th>
          <th>locked_until</th>
          <th>Đánh giá trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2</td>
          <td>test@eshop.com</td>
          <td><span class="highlight-error">2</span> (Kỳ vọng: 1)</td>
          <td>NULL</td>
          <td><span style="color: #fca5a5;">FAIL: Bộ đếm bị cộng 2 ngay lần sai đầu tiên!</span></td>
        </tr>
      </tbody>
    </table>

    <div class="comment">-- 2. Sau khi User đăng nhập sai LẦN 2: Bộ đếm nhảy thành 4 &ge; 3, tài khoản BỊ KHÓA NGAY LẬP TỨC!</div>
    <div><span class="prompt">sqlite&gt;</span> <span class="cmd">SELECT id, email, login_attempts, locked_until FROM users WHERE email = 'test@eshop.com';</span></div>
    
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>email</th>
          <th>login_attempts</th>
          <th>locked_until</th>
          <th>Đánh giá trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2</td>
          <td>test@eshop.com</td>
          <td><span class="highlight-error">4</span> (Kỳ vọng: 2)</td>
          <td><span class="highlight-error">2026-10-19T04:45:00.000Z</span></td>
          <td><span style="color: #f87171; font-weight: bold;">FATAL: Khóa tài khoản sau 2 lần sai thay vì 3 lần!</span></td>
        </tr>
      </tbody>
    </table>

    <div class="alert-banner">
      <div class="alert-title">❌ BẰNG CHỨNG LỖI CSDL (DATABASE DEFECT EVIDENCE)</div>
      <div class="alert-desc">
        Trong CSDL, giá trị <code>login_attempts</code> nhảy từ 0 &rarr; 2 &rarr; 4. Do điều kiện khóa là <code>newAttempts &ge; 3</code>, tài khoản bị kích hoạt khóa ngay sau lần sai thứ hai. Người dùng hoàn toàn bị tước mất cơ hội thử lần thứ ba theo đúng quyền lợi trong đặc tả FR-02.
      </div>
    </div>
  </div>

  <div class="statusbar">
    <div>SQLite 3.42.0 | users table | Verification Pass</div>
    <div>Nguyen Le Quang Kan (23120279)</div>
  </div>
</div>

</body>
</html>`;

// -------------------------------------------------------------
// 5. BUG-FR02-02_DB.html: Terminal card showing 180s lockout duration
// -------------------------------------------------------------
const htmlDb02 = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BUG-FR02-02_DB Database Evidence</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #0b0f19; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 24px; }
  .window { background: #1e293b; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); width: 100%; max-width: 1040px; overflow: hidden; border: 1px solid #334155; }
  .title-bar { background: #0f172a; padding: 10px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
  .traffic-lights { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ef4444; }
  .dot.yellow { background: #f59e0b; }
  .dot.green { background: #10b981; }
  .title-text { color: #94a3b8; font-size: 12.5px; font-family: monospace; font-weight: 600; margin-left: 10px; }
  .bug-tag { background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 4px; font-family: monospace; }
  .terminal-body { padding: 20px 24px; font-family: "Cascadia Code", Consolas, "Courier New", monospace; font-size: 12.5px; line-height: 1.55; color: #f8fafc; }
  .prompt { color: #38bdf8; font-weight: 600; }
  .cmd { color: #f1f5f9; }
  .comment { color: #94a3b8; font-style: italic; margin-bottom: 4px; }
  .table { width: 100%; border-collapse: collapse; margin: 10px 0 16px 0; font-size: 12px; }
  .table th { background: #334155; color: #cbd5e1; padding: 6px 12px; text-align: left; border: 1px solid #475569; }
  .table td { padding: 6px 12px; border: 1px solid #334155; color: #e2e8f0; }
  .highlight-error { background: rgba(239, 68, 68, 0.25); color: #fca5a5; font-weight: bold; border: 1px solid #ef4444; padding: 2px 6px; border-radius: 4px; }
  .alert-banner { background: #450a0a; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin-top: 14px; border: 1px solid #7f1d1d; }
  .alert-title { color: #fca5a5; font-weight: 700; font-size: 12.5px; display: flex; align-items: center; gap: 6px; }
  .alert-desc { color: #fecaca; font-size: 12px; margin-top: 4px; line-height: 1.45; }
  .statusbar { background: #0284c7; color: #ffffff; display: flex; justify-content: space-between; padding: 4px 16px; font-size: 11px; }
</style>
</head>
<body>

<div class="window">
  <div class="title-bar">
    <div class="traffic-lights">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title-text">MINGW64:/d/KAN/N4_1/eshop-sut/backend — node check_lock_time.js</span>
    </div>
    <div class="bug-tag">BUG-FR02-02_DB: Khóa Tài Khoản 180s (3 Phút) Thay Vì 30s Theo Đặc Tả</div>
  </div>

  <div class="terminal-body">
    <div class="comment">-- Đối chiếu thời điểm khóa (lock_start) và thời điểm hết hạn (locked_until) trong CSDL</div>
    <div><span class="prompt">$</span> <span class="cmd">node -e "console.log(db.get('SELECT locked_until FROM users WHERE id=2'))"</span></div>
    
    <table class="table">
      <thead>
        <tr>
          <th>Thời điểm bị khóa ($t_0$)</th>
          <th>locked_until trong CSDL</th>
          <th>Thời gian khóa thực tế</th>
          <th>Thời gian theo đặc tả FR-02</th>
          <th>Sai lệch</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>04:30:00.000Z</td>
          <td><span class="highlight-error">04:33:00.000Z</span></td>
          <td><span class="highlight-error">180 giây (3 phút)</span></td>
          <td>30 giây</td>
          <td><span style="color: #f87171; font-weight: bold;">+150 giây (Gấp 6 lần!)</span></td>
        </tr>
      </tbody>
    </table>

    <div class="alert-banner">
      <div class="alert-title">❌ BẰNG CHỨNG SAI LỆCH THỜI GIAN (TIME-DEPENDENT FLAW)</div>
      <div class="alert-desc">
        Hệ thống tính <code>Date.now() + 180000</code>. Tại thời điểm sau 35 giây (đã vượt qua ngưỡng 30s theo đặc tả), người dùng nhập đúng mật khẩu nhưng backend vẫn trả về HTTP 403 Forbidden do <code>new Date() &lt; new Date(user.locked_until)</code> vẫn thỏa mãn!
      </div>
    </div>
  </div>

  <div class="statusbar">
    <div>Node.js v24.6.0 | Time Verification Pass</div>
    <div>Nguyen Le Quang Kan (23120279)</div>
  </div>
</div>

</body>
</html>`;

// -------------------------------------------------------------
// 6. BUG-FR02-03_UI.html: Mobile App Screenshot Card
// -------------------------------------------------------------
const htmlUi03 = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BUG-FR02-03_UI Mobile GUI Evidence</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #0b0f19; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 24px; }
  .window { background: #1e293b; border-radius: 8px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); width: 100%; max-width: 1040px; overflow: hidden; border: 1px solid #334155; }
  .title-bar { background: #0f172a; padding: 10px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; }
  .traffic-lights { display: flex; gap: 8px; align-items: center; }
  .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ef4444; }
  .dot.yellow { background: #f59e0b; }
  .dot.green { background: #10b981; }
  .title-text { color: #94a3b8; font-size: 12.5px; font-family: monospace; font-weight: 600; margin-left: 10px; }
  .bug-tag { background: #dc2626; color: #ffffff; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 4px; font-family: monospace; }
  .content { display: flex; padding: 24px; gap: 30px; align-items: flex-start; justify-content: center; }
  .phone-mockup { width: 340px; background: #ffffff; border-radius: 36px; padding: 16px; border: 10px solid #0f172a; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
  .notch { width: 120px; height: 18px; background: #0f172a; margin: 0 auto 16px auto; border-radius: 0 0 12px 12px; }
  .app-header { font-size: 20px; font-weight: 700; text-align: center; color: #1e293b; margin-bottom: 20px; }
  .field-group { margin-bottom: 14px; }
  .label { font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px; display: flex; justify-content: space-between; }
  .label-bad { color: #ef4444; font-weight: bold; }
  .input { width: 100%; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #1e293b; }
  .forgot-link { color: #0284c7; font-size: 12px; text-align: right; margin-bottom: 16px; font-weight: 500; }
  .btn-submit { background: #0284c7; border-radius: 8px; padding: 12px; text-align: center; margin-bottom: 14px; }
  .btn-text { color: #ffffff; font-size: 14px; font-weight: 700; }
  .switch-link { text-align: center; font-size: 12px; color: #64748b; margin-bottom: 14px; }
  .error-box-bad { background: #fee2e2; border: 1px solid #f87171; color: #991b1b; padding: 10px 12px; border-radius: 8px; font-size: 12px; font-weight: 500; }
  .notes { flex: 1; color: #cbd5e1; font-size: 13px; line-height: 1.6; }
  .note-item { background: #0f172a; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 6px; margin-bottom: 12px; border: 1px solid #334155; }
  .note-item h4 { color: #fca5a5; font-size: 13.5px; margin-bottom: 4px; }
  .note-item p { color: #94a3b8; font-size: 12px; }
  .statusbar { background: #0284c7; color: #ffffff; display: flex; justify-content: space-between; padding: 4px 16px; font-size: 11px; }
</style>
</head>
<body>

<div class="window">
  <div class="title-bar">
    <div class="traffic-lights">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title-text">Expo Mobile Simulator — frontend-mobile/App.js (Login Screen)</span>
    </div>
    <div class="bug-tag">BUG-FR02-03_UI: Vi Phạm Tiêu Chuẩn Giao Diện Mobile FR-21 / FR-22</div>
  </div>

  <div class="content">
    <!-- Phone Mockup -->
    <div class="phone-mockup">
      <div class="notch"></div>
      <div class="app-header">Đăng Nhập</div>

      <div class="field-group">
        <div class="label">
          <span>Username</span>
          <span class="label-bad">❌ Thiếu dấu *, sai nhãn Email</span>
        </div>
        <input class="input" value="test@eshop.com" readonly />
      </div>

      <div class="field-group">
        <div class="label">
          <span>Mật khẩu</span>
          <span class="label-bad">❌ Thiếu dấu * bắt buộc</span>
        </div>
        <input class="input" type="password" value="••••••••" readonly />
      </div>

      <div class="forgot-link">Quên mật khẩu?</div>

      <div class="btn-submit">
        <div class="btn-text">Sign In</div>
      </div>
      <div style="font-size: 11px; color: #ef4444; font-weight: bold; text-align: center; margin-top: -8px; margin-bottom: 10px;">
        ❌ Lỗi FR-21: Dùng tiếng Anh "Sign In" thay vì "Đăng nhập"
      </div>

      <div class="switch-link">Chưa có tài khoản? <span style="color: #0284c7; font-weight: 600;">Đăng ký ngay</span></div>

      <div class="error-box-bad">
        Đăng nhập thất bại. Vui lòng kiểm tra lại.
      </div>
      <div style="font-size: 11px; color: #ef4444; font-weight: bold; text-align: center; margin-top: 4px;">
        ❌ Lỗi FR-22: Hộp lỗi nằm DƯỚI nút submit và nuốt message khóa tài khoản
      </div>
    </div>

    <!-- Notes Breakdown -->
    <div class="notes">
      <h3 style="color: #f8fafc; font-size: 16px; margin-bottom: 14px;">BẢNG ĐỐI CHIẾU VI PHẠM GIAO DIỆN (GUI AUDIT)</h3>

      <div class="note-item">
        <h4>1. Vi phạm Nhãn & Dấu bắt buộc (FR-22)</h4>
        <p>Thẻ label tại dòng 763 hiển thị <code>Username</code> thay vì <code>Email *</code>. Cả hai trường Email và Mật khẩu đều thiếu dấu <code>*</code> cạnh nhãn theo điều khoản FR-22.</p>
      </div>

      <div class="note-item">
        <h4>2. Vi phạm Ngôn ngữ Tiếng Việt (FR-21)</h4>
        <p>Nút submit tại dòng 783 hiển thị <code>Sign In</code> bằng tiếng Anh, vi phạm nguyên tắc nhất quán ngôn ngữ tiếng Việt toàn hệ thống.</p>
      </div>

      <div class="note-item">
        <h4>3. Vi phạm Vị trí Thông báo Lỗi (FR-22)</h4>
        <p>Hộp thông báo <code>loginError</code> được render ở cuối cùng (dòng 790), nằm dưới cả nút submit và link chuyển trang. FR-22 quy định: <i>"Thông báo lỗi phải xuất hiện TRÊN nút submit, không phải bên dưới"</i>.</p>
      </div>

      <div class="note-item">
        <h4>4. Nuốt Thông báo Lỗi Chi tiết từ Server (API Error Masking)</h4>
        <p>Hàm <code>handleLogin</code> (dòng 205) catch error và hardcode <code>setLoginError("Đăng nhập thất bại...")</code>, che giấu hoàn toàn phản hồi <code>"Tài khoản đã bị khóa. Vui lòng thử lại sau."</code> từ backend.</p>
      </div>
    </div>
  </div>

  <div class="statusbar">
    <div>Mobile Screen Resolution: 1080x720 | Expo SDK 51</div>
    <div>Nguyen Le Quang Kan (23120279)</div>
  </div>
</div>

</body>
</html>`;

// Write HTML files
const htmlFiles = [
  { name: 'f02_unified_bug-fr02-01.html', content: htmlBug01, targetPng: 'BUG-FR02-01_Code.png' },
  { name: 'f02_unified_bug-fr02-02.html', content: htmlBug02, targetPng: 'BUG-FR02-02_Code.png' },
  { name: 'f02_unified_bug-fr02-03.html', content: htmlBug03, targetPng: 'BUG-FR02-03_Code.png' },
  { name: 'f02_unified_bug-fr02-01_db.html', content: htmlDb01, targetPng: 'BUG-FR02-01_DB.png' },
  { name: 'f02_unified_bug-fr02-02_db.html', content: htmlDb02, targetPng: 'BUG-FR02-02_DB.png' },
  { name: 'f02_unified_bug-fr02-03_ui.html', content: htmlUi03, targetPng: 'BUG-FR02-03_UI.png' }
];

console.log("=== BẮT ĐẦU TẠO ẢNH MINH CHỨNG CHUẨN HÓA CHO FEATURE D (FR-02 MOBILE) ===");

htmlFiles.forEach(({ name, content, targetPng }) => {
  const htmlPath = path.join(__dirname, name);
  fs.writeFileSync(htmlPath, content, 'utf8');

  const pngPath = path.join(OUTPUT_DIR, targetPng);
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${pngPath}" --window-size=1080,720 "${fileUrl}"`;

  try {
    execSync(cmd);
    console.log(`[Generated] ${targetPng}`);
  } catch (err) {
    console.error(`[Error] Failed to render ${targetPng}:`, err.message);
  }
});

console.log("=== HOÀN TẤT TẠO TOÀN BỘ ẢNH MINH CHỨNG TRONG screenshots/F02/ ===");
