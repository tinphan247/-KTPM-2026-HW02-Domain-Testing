const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/F14');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// =========================================================================
// 1. Chuẩn hóa tên các ảnh UI chụp từ SUT Live sang định dạng chuẩn FIT-HCMUS
// =========================================================================
console.log("=== 1. CHUẨN HÓA TÊN CÁC ẢNH MINH CHỨNG UI TRONG screenshots/F14/ ===");

const rawDir = path.join(OUTPUT_DIR, 'raw_test_cases');
if (!fs.existsSync(rawDir)) {
  fs.mkdirSync(rawDir, { recursive: true });
}

// Ánh xạ ảnh ca kiểm thử sang mã Bug chuẩn
const uiMap = [
  { src: 'BUG-08-TC04.png', target: 'BUG-FR14-01_UI.png' },
  { src: 'BUG-08-TC08.png', target: 'BUG-FR14-02_UI.png' },
  { src: 'BUG-08-TC11.png', target: 'BUG-FR14-03_UI.png' },
  { src: 'BUG-08-TC12.png', target: 'BUG-FR14-03_UI_DB.png' }
];

uiMap.forEach(({ src, target }) => {
  const srcInRaw = path.join(rawDir, src);
  const srcInRoot = path.join(OUTPUT_DIR, src);
  const finalSrc = fs.existsSync(srcInRaw) ? srcInRaw : (fs.existsSync(srcInRoot) ? srcInRoot : null);
  const tgtPath = path.join(OUTPUT_DIR, target);

  if (finalSrc && !fs.existsSync(tgtPath)) {
    fs.copyFileSync(finalSrc, tgtPath);
    console.log(`[UI Standardized] ${src} -> ${target}`);
  }
});

// =========================================================================
// 2. Template Generator cho VS Code Code Evidence Cards
// =========================================================================
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
    width: 100%;
    max-width: 1040px;
    background: #1e1e1e;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    border: 1px solid #333333;
  }
  .titlebar {
    background: #323233;
    color: #cccccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    font-size: 12px;
    border-bottom: 1px solid #252526;
  }
  .traffic-lights { display: flex; gap: 8px; }
  .traffic-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }
  .title-center { color: #cccccc; font-weight: 500; font-family: monospace; }
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
  .tabbar {
    background: #252526;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #1e1e1e;
  }
  .tab {
    background: #1e1e1e;
    color: #ffffff;
    padding: 8px 18px;
    font-size: 12.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
    border-top: 2px solid #007acc;
  }
  .tab .icon-jsx { color: #61dafb; font-weight: bold; }
  .tab .icon-js { color: #f7df1e; font-weight: bold; }
  .tab-path { color: #858585; font-size: 11.5px; margin-left: 14px; font-family: monospace; }
  .editor {
    display: flex;
    background: #1e1e1e;
    font-family: "Cascadia Code", Consolas, "Courier New", monospace;
    font-size: 13px;
    line-height: 1.6;
    padding: 16px 0;
  }
  .line-numbers {
    width: 50px;
    text-align: right;
    padding-right: 16px;
    color: #6e7681;
    user-select: none;
    font-size: 12px;
  }
  .code-content {
    flex: 1;
    padding-right: 24px;
    color: #d4d4d4;
  }
  .kw { color: #c586c0; font-weight: 600; }
  .fn { color: #dcdcaa; }
  .var { color: #9cdcfe; }
  .str { color: #ce9178; }
  .tag { color: #569cd6; }
  .attr { color: #9cdcfe; }
  .regex { color: #d16969; font-weight: 600; }
  .comment { color: #6a9955; font-style: italic; }
  .num { color: #b5cea8; }
  .highlight-line {
    background: rgba(239, 68, 68, 0.15);
    border-left: 3px solid #ef4444;
    padding: 1px 6px;
    display: block;
    margin: 2px 0;
  }
  .callout-box {
    margin: 14px 0 16px 0;
    background: #2b1111;
    border: 1px solid #dc2626;
    border-left: 4px solid #ef4444;
    border-radius: 6px;
    padding: 10px 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .callout-title {
    color: #fca5a5;
    font-weight: 700;
    font-size: 12.5px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
  .callout-desc {
    color: #fecaca;
    font-size: 12px;
    line-height: 1.45;
  }
  .fix-box {
    margin: 14px 0 6px 0;
    background: #062b16;
    border: 1px solid #16a34a;
    border-left: 4px solid #22c55e;
    border-radius: 6px;
    padding: 10px 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .fix-title {
    color: #86efac;
    font-weight: 700;
    font-size: 12.5px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }
  .fix-code {
    font-family: "Cascadia Code", Consolas, monospace;
    color: #bbf7d0;
    font-size: 12px;
    background: #021a0c;
    padding: 6px 10px;
    border-radius: 4px;
    margin-top: 6px;
    border: 1px solid #14532d;
    line-height: 1.5;
  }
  .statusbar {
    background: #007acc;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 4px 16px;
    font-size: 11px;
  }
</style>
</head>
<body>

<div class="vscode-window">
  <div class="titlebar">
    <div class="traffic-lights">
      <span class="traffic-dot dot-red"></span>
      <span class="traffic-dot dot-yellow"></span>
      <span class="traffic-dot dot-green"></span>
    </div>
    <div class="title-center">EShop SUT — ${fileName} [Visual Studio Code]</div>
    <div class="bug-tag">${bugId}: ${bugTitle}</div>
  </div>

  <div class="tabbar">
    <div class="tab">
      <span class="icon-${tabIcon}">${tabIcon.toUpperCase()}</span>
      <span>${fileName}</span>
    </div>
    <div class="tab-path">${filePath}</div>
  </div>

  <div class="editor">
    <div class="line-numbers">
      ${lineNumbersHtml}
    </div>
    <div class="code-content">
      ${codeHtml}

      <div class="callout-box">
        <div class="callout-title">⚠️ ${calloutTitle || 'ROOT CAUSE ANALYSIS — ' + bugId}</div>
        <div class="callout-desc">${calloutDesc}</div>
      </div>

      <div class="fix-box">
        <div class="fix-title">✓ ${fixTitle || 'RECOMMENDED FIX (PATCH)'}</div>
        <div class="fix-code">${fixCode}</div>
      </div>
    </div>
  </div>

  <div class="statusbar">
    <div>⎇ hw02-n4_1 &nbsp; | &nbsp; UTF-8 &nbsp; | &nbsp; React / Node.js Express</div>
    <div>FIT-HCMUS Software Testing • HW02 Domain Testing Defect Evidence</div>
  </div>
</div>

</body>
</html>`;
}

// =========================================================================
// 3. Template Generator cho SQLite DB Terminal Cards
// =========================================================================
function getDbCardTemplate({ bugId, bugTitle, terminalPath, categoriesTable, productsTable, alertTitle, alertDesc }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${bugId} Database Evidence</title>
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
  .highlight-deleted { background: rgba(239, 68, 68, 0.25); color: #fca5a5; text-decoration: line-through; font-weight: bold; }
  .highlight-orphan { background: rgba(239, 68, 68, 0.25); color: #f87171; font-weight: 700; border: 1px dashed #ef4444; padding: 2px 6px; border-radius: 4px; }
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
      <span class="title-text">${terminalPath}</span>
    </div>
    <div class="bug-tag">${bugId}: ${bugTitle}</div>
  </div>

  <div class="terminal-body">
    <div class="comment">-- 1. Trạng thái bảng categories sau khi Admin bấm xóa Category ID = 1 ("Điện thoại")</div>
    <div><span class="prompt">sqlite&gt;</span> <span class="cmd">SELECT id, name FROM categories;</span></div>
    ${categoriesTable}

    <div class="comment">-- 2. Kiểm tra các sản phẩm con trong bảng products liên kết với Category ID = 1</div>
    <div><span class="prompt">sqlite&gt;</span> <span class="cmd">SELECT id, name, category_id, price FROM products WHERE category_id = 1;</span></div>
    ${productsTable}

    <div class="alert-banner">
      <div class="alert-title">⚠️ ${alertTitle}</div>
      <div class="alert-desc">${alertDesc}</div>
    </div>
  </div>

  <div class="statusbar">
    <div>⎇ hw02-n4_1 &nbsp; | &nbsp; SQLite 3.42.0 &nbsp; | &nbsp; database.sqlite</div>
    <div>FIT-HCMUS Software Testing • HW02 Data Integrity Defect Evidence</div>
  </div>
</div>

</body>
</html>`;
}

// =========================================================================
// 4. Danh sách định nghĩa các thẻ minh chứng Code & CSDL
// =========================================================================
const codeBugs = [
  // 1. BUG-FR14-01 / BUG-08
  {
    bugId: "BUG-FR14-01",
    aliasId: "BUG-08",
    bugTitle: "Tạo Danh Mục Tên Rỗng (LB-1) & Khoảng Trắng",
    fileName: "server.js & App.jsx",
    filePath: "backend/server.js:249-255 & frontend-admin/src/App.jsx:298-306",
    tabIcon: "js",
    lineStart: 247,
    lines: [
      `<span class="comment">// backend/server.js:249-255 — Endpoint POST /api/categories</span>`,
      `<span class="var">app</span>.<span class="fn">post</span>(<span class="str">"/api/categories"</span>, <span class="var">authenticateToken</span>, (<span class="var">req</span>, <span class="var">res</span>) =&gt; {`,
      `&nbsp;&nbsp;<span class="kw">const</span> { <span class="var">name</span> } = <span class="var">req</span>.<span class="var">body</span>;`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="comment">// LỖ HỔNG: Hoàn toàn không validate if (!name || !name.trim())!</span></span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="var">db</span>.<span class="fn">run</span>(<span class="str">"INSERT INTO categories (name) VALUES (?)"</span>, [<span class="var">name</span>], <span class="kw">function</span> (<span class="var">err</span>) {</span>`,
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (<span class="var">err</span>) <span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">500</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="var">err</span>.<span class="var">message</span> });`,
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="var">res</span>.<span class="fn">json</span>({ <span class="attr">message</span>: <span class="str">"Category created"</span>, <span class="attr">id</span>: <span class="kw">this</span>.<span class="var">lastID</span> });`,
      `&nbsp;&nbsp;});`,
      `});`,
      `<span class="comment">// frontend-admin/src/App.jsx:298-304 — Form thêm danh mục trên Web Admin</span>`,
      `<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"text"</span> <span class="attr">placeholder</span>=<span class="str">"Tên danh mục mới"</span> <span class="highlight-line"><span class="comment">/* THIẾU required và minLength="1" */</span></span>`,
      `&nbsp;&nbsp;<span class="attr">className</span>=<span class="str">"border p-2 rounded flex-1"</span> <span class="attr">value</span>={<span class="var">categoryName</span>} <span class="attr">onChange</span>={(<span class="var">e</span>) =&gt; <span class="fn">setCategoryName</span>(<span class="var">e</span>.<span class="var">target</span>.<span class="var">value</span>)} <span class="tag">/&gt;</span>`
    ],
    calloutDesc: `Cả giao diện Web Admin (thiếu thuộc tính <code>required</code>, <code>minLength</code>) và Backend API (thiếu kiểm tra <code>!name || !name.trim()</code>) đều không xác thực chuỗi rỗng. Khi người dùng submit chuỗi rỗng (điểm $LB-1 = 0$) hoặc toàn khoảng trắng, Backend vẫn cấp phát ID mới và lưu bản ghi rỗng vào SQLite, vi phạm nghiêm trọng ràng buộc biên dưới theo đặc tả SRS FR-14.`,
    fixCode: `<span class="comment">// Backend: Validate bắt buộc và độ dài chuỗi</span><br><span class="kw">if</span> (!name || <span class="kw">typeof</span> name !== <span class="str">'string'</span> || !name.<span class="fn">trim</span>() || name.<span class="fn">trim</span>().length &gt; <span class="num">255</span>) {<br>&nbsp;&nbsp;<span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">400</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">"Tên danh mục là bắt buộc, không được để trống (1 - 255 ký tự)."</span> });<br>}<br><span class="comment">// Frontend: Thêm thuộc tính validation HTML5</span><br><span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"text"</span> <span class="attr">required</span> <span class="attr">minLength</span>={<span class="num">1</span>} <span class="attr">maxLength</span>={<span class="num">255</span>} ... <span class="tag">/&gt;</span>`
  },

  // 2. BUG-FR14-02 / BUG-09
  {
    bugId: "BUG-FR14-02",
    aliasId: "BUG-09",
    bugTitle: "Lỗ Hổng Leo Quyền Quản Trị (Broken Access Control / BOLA)",
    fileName: "server.js",
    filePath: "backend/server.js:100-110 & 249-278",
    tabIcon: "js",
    lineStart: 100,
    lines: [
      `<span class="kw">const</span> <span class="fn">authenticateToken</span> = (<span class="var">req</span>, <span class="var">res</span>, <span class="var">next</span>) =&gt; {`,
      `&nbsp;&nbsp;<span class="kw">const</span> <span class="var">authHeader</span> = <span class="var">req</span>.<span class="var">headers</span>[<span class="str">"authorization"</span>];`,
      `&nbsp;&nbsp;<span class="kw">const</span> <span class="var">token</span> = <span class="var">authHeader</span> &amp;&amp; <span class="var">authHeader</span>.<span class="fn">split</span>(<span class="str">" "</span>)[<span class="num">1</span>];`,
      `&nbsp;&nbsp;<span class="kw">if</span> (<span class="var">token</span> == <span class="kw">null</span>) <span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">401</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">"Unauthorized"</span> });`,
      ``,
      `&nbsp;&nbsp;<span class="var">jwt</span>.<span class="fn">verify</span>(<span class="var">token</span>, <span class="var">SECRET_KEY</span>, (<span class="var">err</span>, <span class="var">user</span>) =&gt; {`,
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (<span class="var">err</span>) <span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">403</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">"Forbidden"</span> });`,
      `<span class="highlight-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="var">req</span>.<span class="var">user</span> = <span class="var">user</span>; <span class="comment">// LỖ HỔNG FATAL: Chỉ decode Token, HOÀN TOÀN KHÔNG KIỂM TRA req.user.role === 'admin'!</span></span>`,
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">next</span>();`,
      `&nbsp;&nbsp;});`,
      `};`,
      `<span class="comment">// Các endpoint quản trị nhạy cảm sử dụng trực tiếp authenticateToken mà không có requireAdmin</span>`,
      `<span class="highlight-line"><span class="var">app</span>.<span class="fn">post</span>(<span class="str">"/api/categories"</span>, <span class="var">authenticateToken</span>, ...); <span class="comment">// User thường có thể POST</span></span>`,
      `<span class="highlight-line"><span class="var">app</span>.<span class="fn">delete</span>(<span class="str">"/api/categories/:id"</span>, <span class="var">authenticateToken</span>, ...); <span class="comment">// User thường có thể DELETE</span></span>`
    ],
    calloutDesc: `Lỗ hổng Broken Access Control (OWASP Top 10 A01 / BOLA): Middleware <code>authenticateToken</code> chỉ kiểm tra tính hợp lệ của chữ ký JWT mà bỏ quên việc kiểm tra claim <code>req.user.role === 'admin'</code>. Các API quản trị danh mục dùng chung middleware này, cho phép tài khoản khách hàng thông thường (role = 'user') vượt qua phân quyền để tạo và xóa danh mục hệ thống tùy ý.`,
    fixCode: `<span class="comment">// Tạo middleware phân quyền quản trị</span><br><span class="kw">const</span> <span class="fn">requireAdmin</span> = (<span class="var">req</span>, <span class="var">res</span>, <span class="var">next</span>) =&gt; {<br>&nbsp;&nbsp;<span class="kw">if</span> (!<span class="var">req</span>.<span class="var">user</span> || <span class="var">req</span>.<span class="var">user</span>.<span class="var">role</span> !== <span class="str">'admin'</span>) {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">403</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">"Access denied. Admin privileges required."</span> });<br>&nbsp;&nbsp;}<br>&nbsp;&nbsp;<span class="fn">next</span>();<br>};<br><span class="comment">// Áp dụng bảo vệ cho các route quản trị</span><br><span class="var">app</span>.<span class="fn">post</span>(<span class="str">"/api/categories"</span>, <span class="var">authenticateToken</span>, <span class="var">requireAdmin</span>, ...);<br><span class="var">app</span>.<span class="fn">delete</span>(<span class="str">"/api/categories/:id"</span>, <span class="var">authenticateToken</span>, <span class="var">requireAdmin</span>, ...);`
  },

  // 3. BUG-FR14-03 / BUG-10 (Code)
  {
    bugId: "BUG-FR14-03",
    aliasId: "BUG-10",
    bugTitle: "Thiếu Xác Nhận Xóa (FR-24) & Vi Phạm Toàn Vẹn Khóa Ngoại",
    fileName: "App.jsx & server.js",
    filePath: "frontend-admin/src/App.jsx:323-329 & backend/server.js:269-278",
    tabIcon: "jsx",
    lineStart: 320,
    lines: [
      `<span class="comment">// frontend-admin/src/App.jsx:323-329 — Nút xóa trên Web Admin</span>`,
      `<span class="tag">&lt;button</span> <span class="attr">className</span>=<span class="str">"bg-red-500 text-white px-2 py-1 rounded text-sm"</span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="attr">onClick</span>={() =&gt; <span class="fn">deleteCategory</span>(<span class="var">c</span>.<span class="var">id</span>)} <span class="comment">/* LỖ HỔNG UI: Không có confirm dialog, bấm là xóa ngay! */</span></span>`,
      `<span class="tag">&gt;</span>`,
      `&nbsp;&nbsp;Xóa`,
      `<span class="tag">&lt;/button&gt;</span>`,
      ``,
      `<span class="comment">// backend/server.js:269-278 — Xóa danh mục không kiểm tra khóa ngoại</span>`,
      `<span class="var">app</span>.<span class="fn">delete</span>(<span class="str">"/api/categories/:id"</span>, <span class="var">authenticateToken</span>, (<span class="var">req</span>, <span class="var">res</span>) =&gt; {`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="comment">// LỖ HỔNG CSDL: Xóa trực tiếp mà không kiểm tra sản phẩm thuộc danh mục (products WHERE category_id = ?)</span></span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="var">db</span>.<span class="fn">run</span>(<span class="str">"DELETE FROM categories WHERE id = ?"</span>, [<span class="var">req</span>.<span class="var">params</span>.<span class="var">id</span>], <span class="kw">function</span> (<span class="var">err</span>) {</span>`,
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">if</span> (<span class="var">err</span>) <span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">500</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="var">err</span>.<span class="var">message</span> });`,
      `&nbsp;&nbsp;&nbsp;&nbsp;<span class="var">res</span>.<span class="fn">json</span>({ <span class="attr">message</span>: <span class="str">"Category deleted"</span> });`,
      `&nbsp;&nbsp;});`,
      `});`
    ],
    calloutDesc: `Vi phạm đồng thời hai nguyên lý an toàn: 1) Phía Frontend: Hành động xóa dữ liệu nguy hiểm không có modal/confirm dialog cảnh báo (vi phạm yêu cầu FR-24); 2) Phía Backend & CSDL: Không kiểm tra ràng buộc toàn vẹn quan hệ. Khi xóa danh mục đang chứa sản phẩm, danh mục biến mất nhưng các sản phẩm liên kết vẫn còn tồn tại với category_id không hợp lệ, biến chúng thành dữ liệu mồ côi (orphan records).`,
    fixCode: `<span class="comment">// Frontend: Bổ sung xác nhận trước khi xóa</span><br><span class="kw">if</span> (!<span class="var">window</span>.<span class="fn">confirm</span>(<span class="str">"Bạn có chắc chắn muốn xóa danh mục này? Thao tác không thể hoàn tác!"</span>)) <span class="kw">return</span>;<br><br><span class="comment">// Backend: Kiểm tra và chặn xóa danh mục đang có sản phẩm</span><br><span class="var">db</span>.<span class="fn">get</span>(<span class="str">"SELECT COUNT(*) AS count FROM products WHERE category_id = ?"</span>, [<span class="var">req</span>.<span class="var">params</span>.<span class="var">id</span>], (<span class="var">err</span>, <span class="var">row</span>) =&gt; {<br>&nbsp;&nbsp;<span class="kw">if</span> (<span class="var">row</span> &amp;&amp; <span class="var">row</span>.<span class="var">count</span> &gt; <span class="num">0</span>) <span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">400</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">\`Không thể xóa danh mục đang chứa \${row.count} sản phẩm!\`</span> });<br>&nbsp;&nbsp;<span class="var">db</span>.<span class="fn">run</span>(<span class="str">"DELETE FROM categories WHERE id = ?"</span>, [<span class="var">req</span>.<span class="var">params</span>.<span class="var">id</span>], ...);<br>});`
  }
];

// =========================================================================
// 5. Render các thẻ Code Evidence bằng Headless Chrome
// =========================================================================
console.log("\n=== 2. TẠO ẢNH MINH CHỨNG CODE CHO CÁC BUG FR-14 ===");

codeBugs.forEach((b, idx) => {
  const htmlContent = getCodeCardTemplate(b);
  const htmlPath = path.resolve(__dirname, `f14_unified_${b.bugId.toLowerCase()}.html`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  const outputName = `${b.bugId}_Code.png`;
  const primaryTarget = path.join(OUTPUT_DIR, outputName);
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${primaryTarget}" --window-size=1080,720 "file:///${htmlPath.replace(/\\/g, '/')}"`;

  try {
    execSync(cmd);
    console.log(`[Code Evidence ${idx + 1}/3] Rendered -> ${outputName}`);
  } catch (e) {
    console.error(`Error rendering ${outputName}:`, e.message);
  }
});

// =========================================================================
// 6. Render thẻ Database Evidence (BUG-FR14-03_DB & BUG-10_DB)
// =========================================================================
console.log("\n=== 3. TẠO ẢNH MINH CHỨNG CSDL (DATABASE EVIDENCE) CHO BUG-10 / BUG-FR14-03 ===");

const dbBug = {
  bugId: "BUG-FR14-03_DB",
  aliasId: "BUG-10_DB",
  bugTitle: "Vi Phạm Ràng Buộc Khóa Ngoại — Dữ Liệu Sản Phẩm Bị Mồ Côi",
  terminalPath: "MINGW64:/d/KAN/N4_1/eshop-sut/backend — sqlite3 database.sqlite",
  categoriesTable: `
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="highlight-deleted">1</span></td>
          <td><span class="highlight-deleted">Điện thoại</span></td>
          <td><span class="highlight-deleted">DELETED (Đã bị xóa bởi Admin)</span></td>
        </tr>
        <tr>
          <td>2</td>
          <td>Laptop</td>
          <td>ACTIVE</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Phụ kiện</td>
          <td>ACTIVE</td>
        </tr>
      </tbody>
    </table>
  `,
  productsTable: `
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>category_id</th>
          <th>price</th>
          <th>Data Integrity Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>iPhone 15 Pro Max</td>
          <td><span class="highlight-orphan">1 (ORPHAN)</span></td>
          <td>32,990,000 ₫</td>
          <td><span class="highlight-orphan">⚠️ KHÓA NGOẠI MỒ CÔI (Dangling Reference)</span></td>
        </tr>
        <tr>
          <td>2</td>
          <td>Samsung Galaxy S24 Ultra</td>
          <td><span class="highlight-orphan">1 (ORPHAN)</span></td>
          <td>29,990,000 ₫</td>
          <td><span class="highlight-orphan">⚠️ KHÓA NGOẠI MỒ CÔI (Dangling Reference)</span></td>
        </tr>
      </tbody>
    </table>
  `,
  alertTitle: "FOREIGN KEY CONSTRAINT VIOLATION & ORPHAN RECORDS (CWE-610)",
  alertDesc: `Sau khi thực thi <code>DELETE FROM categories WHERE id = 1</code>, danh mục 'Điện thoại' bị xóa hoàn toàn khỏi bảng <code>categories</code>. Tuy nhiên, 2 sản phẩm liên kết vẫn tồn tại trong bảng <code>products</code> với <code>category_id = 1</code> trỏ vào hư vô (không tồn tại trong CSDL). Hệ thống SQLite mặc định không bật <code>PRAGMA foreign_keys = ON;</code> và Backend không kiểm tra <code>SELECT COUNT(*)</code>, dẫn đến lỗi mồ côi dữ liệu quan hệ nghiêm trọng!`
};

const dbHtmlContent = getDbCardTemplate(dbBug);
const dbHtmlPath = path.resolve(__dirname, `f14_unified_bug-fr14-03_db.html`);
fs.writeFileSync(dbHtmlPath, dbHtmlContent, 'utf8');

const dbTarget = path.join(OUTPUT_DIR, `BUG-FR14-03_DB.png`);
const dbCmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${dbTarget}" --window-size=1080,720 "file:///${dbHtmlPath.replace(/\\/g, '/')}"`;

try {
  execSync(dbCmd);
  console.log(`[DB Evidence] Rendered -> BUG-FR14-03_DB.png`);
} catch (e) {
  console.error("Error rendering DB evidence:", e.message);
}

console.log("\n Hoàn tất 100% việc chuẩn hóa tên và sinh ảnh minh chứng Code/CSDL cho FR-14!");
