const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/F01');
const ROOT_SCREENSHOTS = path.resolve(__dirname, '../screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function getTemplate({ bugId, bugTitle, fileName, filePath, tabIcon, lineStart, lines, calloutTitle, calloutDesc, fixTitle, fixCode }) {
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
      <span class="${tabIcon === 'jsx' ? 'icon-jsx' : 'icon-js'}">⚛</span>
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
        <div class="callout-title">⚠️ ROOT CAUSE ANALYSIS — ${bugId}</div>
        <div class="callout-desc">${calloutDesc}</div>
      </div>

      <div class="fix-box">
        <div class="fix-title">✓ RECOMMENDED FIX (PATCH)</div>
        <div class="fix-code">${fixCode}</div>
      </div>
    </div>
  </div>

  <div class="statusbar">
    <div>⎇ hw02-23120279 &nbsp; | &nbsp; UTF-8 &nbsp; | &nbsp; JavaScript React</div>
    <div>FIT-HCMUS Software Testing • HW02 Defect Evidence</div>
  </div>
</div>

</body>
</html>`;
}

const bugs = [
  {
    bugId: "BUG-FR01-01",
    bugTitle: "Regex Đảo Ngược Mật Khẩu",
    fileName: "Register.jsx",
    filePath: "frontend-web/src/pages/Register.jsx",
    tabIcon: "jsx",
    lineStart: 14,
    lines: [
      `<span class="comment">// Dòng 15: Biểu thức chính quy kiểm tra mật khẩu bị lỗi ngược</span>`,
      `<span class="highlight-line"><span class="kw">const</span> <span class="var">flawedStrongPasswordRegex</span> = <span class="regex">/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\s)[A-Za-z\\d\\s]{8,}$/</span>;</span>`,
      `&nbsp;`,
      `<span class="kw">if</span> (!<span class="var">flawedStrongPasswordRegex</span>.<span class="fn">test</span>(<span class="var">password</span>)) {`,
      `&nbsp;&nbsp;<span class="fn">setError</span>(<span class="str">'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.'</span>);`,
      `&nbsp;&nbsp;<span class="kw">return</span>;`,
      `}`
    ],
    calloutDesc: `Lập trình viên viết nhầm <code>(?=.*\\s)</code> bắt buộc phải có khoảng trắng (space) thay vì ký tự đặc biệt. Đồng thời tập ký tự <code>[A-Za-z\\d\\s]{8,}$</code> cấm toàn bộ các ký tự đặc biệt chuẩn <code>[@$!%*?&]</code>. Khiến mật khẩu hợp lệ bị từ chối 100%, còn mật khẩu có dấu cách lại lọt qua!`,
    fixCode: `<span class="kw">const</span> validStrongPasswordRegex = <span class="regex">/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/</span>;`
  },
  {
    bugId: "BUG-FR01-02",
    bugTitle: "Thiếu Trường Confirm Password",
    fileName: "Register.jsx",
    filePath: "frontend-web/src/pages/Register.jsx",
    tabIcon: "jsx",
    lineStart: 6,
    lines: [
      `<span class="kw">const</span> [<span class="var">name</span>, <span class="fn">setName</span>] = <span class="fn">useState</span>(<span class="str">''</span>);`,
      `<span class="kw">const</span> [<span class="var">email</span>, <span class="fn">setEmail</span>] = <span class="fn">useState</span>(<span class="str">''</span>);`,
      `<span class="highlight-line"><span class="kw">const</span> [<span class="var">password</span>, <span class="fn">setPassword</span>] = <span class="fn">useState</span>(<span class="str">''</span>); <span class="comment">// THIẾU confirmPassword state!</span></span>`,
      `<span class="kw">const</span> [<span class="var">error</span>, <span class="fn">setError</span>] = <span class="fn">useState</span>(<span class="str">''</span>);`,
      `&nbsp;`,
      `<span class="comment">// Trong hàm handleSubmit: Hoàn toàn không có logic kiểm tra so khớp</span>`,
      `<span class="highlight-line"><span class="comment">// MISSING: if (password !== confirmPassword) { setError('Mật khẩu không khớp'); return; }</span></span>`,
      `&nbsp;`,
      `<span class="comment">// Trong JSX Form: Chỉ có 3 thẻ input (Họ tên, Email, Mật khẩu), thiếu ô Xác nhận mật khẩu</span>`
    ],
    calloutDesc: `Vi phạm đặc tả FR-01: Giao diện hoàn toàn không có trường <em>"Xác nhận mật khẩu"</em> và logic kiểm tra khớp 2 mật khẩu. Người dùng có nguy cơ bị khóa tài khoản vĩnh viễn nếu vô tình gõ sai mật khẩu lần đầu.`,
    fixCode: `<span class="kw">const</span> [confirmPassword, setConfirmPassword] = <span class="fn">useState</span>(<span class="str">''</span>);<br><span class="kw">if</span> (password !== confirmPassword) { <span class="fn">setError</span>(<span class="str">'Mật khẩu xác nhận không trùng khớp.'</span>); <span class="kw">return</span>; }`
  },
  {
    bugId: "BUG-FR01-03",
    bugTitle: "Không Lọc Khoảng Trắng Họ Tên",
    fileName: "Register.jsx",
    filePath: "frontend-web/src/pages/Register.jsx",
    tabIcon: "jsx",
    lineStart: 37,
    lines: [
      `<span class="kw">const</span> <span class="fn">handleSubmit</span> = <span class="kw">async</span> (<span class="var">e</span>) => {`,
      `&nbsp;&nbsp;<span class="var">e</span>.<span class="fn">preventDefault</span>();`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="comment">// Thiếu hoàn toàn bước validate: if (!name.trim()) setError('Họ tên không được rỗng')</span></span>`,
      `&nbsp;&nbsp;<span class="kw">await</span> <span class="var">axios</span>.<span class="fn">post</span>(<span class="str">'http://localhost:3000/api/register'</span>, { <span class="var">name</span>, <span class="var">email</span>, <span class="var">password</span> });`,
      `};`,
      `&nbsp;`,
      `<span class="comment">// Trong JSX:</span>`,
      `<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"text"</span> <span class="attr">value</span>={<span class="var">name</span>} <span class="attr">onChange</span>={<span class="var">e</span> => <span class="fn">setName</span>(<span class="var">e</span>.<span class="var">target</span>.<span class="var">value</span>)} <span class="attr">required</span> <span class="tag">/&gt;</span>`
    ],
    calloutDesc: `Thẻ input sử dụng thuộc tính HTML5 <code>required</code> nhưng không có hàm <code>.trim()</code> ở JavaScript. Khi người dùng nhập chuỗi chỉ gồm các dấu cách (<code>"     "</code>), HTML5 coi là hợp lệ và gửi thẳng chuỗi rỗng lên backend, vi phạm toàn vẹn dữ liệu người dùng.`,
    fixCode: `<span class="kw">if</span> (!name || !name.<span class="fn">trim</span>()) {<br>&nbsp;&nbsp;<span class="fn">setError</span>(<span class="str">'Họ tên không được để trống hoặc chỉ chứa khoảng trắng.'</span>);<br>&nbsp;&nbsp;<span class="kw">return</span>;<br>}`
  },
  {
    bugId: "BUG-FR01-04",
    bugTitle: "Input Email Dùng type='text'",
    fileName: "Register.jsx",
    filePath: "frontend-web/src/pages/Register.jsx",
    tabIcon: "jsx",
    lineStart: 47,
    lines: [
      `<span class="tag">&lt;div&gt;</span>`,
      `&nbsp;&nbsp;<span class="tag">&lt;label</span> <span class="attr">className</span>=<span class="str">"block text-gray-700 mb-2"</span><span class="tag">&gt;</span>Email<span class="tag">&lt;/label&gt;</span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"text"</span> <span class="attr">value</span>={<span class="var">email</span>} <span class="attr">onChange</span>={<span class="var">e</span> => <span class="fn">setEmail</span>(<span class="var">e</span>.<span class="var">target</span>.<span class="var">value</span>)} <span class="attr">required</span> <span class="tag">/&gt;</span></span>`,
      `<span class="tag">&lt;/div&gt;</span>`
    ],
    calloutDesc: `Vi phạm đặc tả FR-22: Ô nhập Email được khai báo là <code>type="text"</code> thay vì <code>type="email"</code>, đồng thời frontend không có regex kiểm tra định dạng email. Trình duyệt không kích hoạt cơ chế HTML5 validation, cho phép gửi các chuỗi vô nghĩa như <code>"userdomain.com"</code> hoặc <code>"user@"</code>.`,
    fixCode: `<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"email"</span> <span class="attr">value</span>={<span class="var">email</span>} <span class="attr">onChange</span>={<span class="var">e</span> => <span class="fn">setEmail</span>(<span class="var">e</span>.<span class="var">target</span>.<span class="var">value</span>)} <span class="attr">className</span>=<span class="str">"w-full border p-2 rounded"</span> <span class="attr">required</span> <span class="tag">/&gt;</span>`
  },
  {
    bugId: "BUG-FR01-05",
    bugTitle: "CSDL Không Ràng Buộc UNIQUE Email",
    fileName: "database.js & server.js",
    filePath: "backend/database.js:53 & backend/server.js:23",
    tabIcon: "js",
    lineStart: 51,
    lines: [
      `<span class="comment">// backend/database.js: Bảng users thiếu từ khóa UNIQUE cho email</span>`,
      `<span class="highlight-line">db.<span class="fn">run</span>(<span class="str">\`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT)\`</span>);</span>`,
      `&nbsp;`,
      `<span class="comment">// backend/server.js: Endpoint POST /api/register không kiểm tra trùng</span>`,
      `<span class="kw">app</span>.<span class="fn">post</span>(<span class="str">"/api/register"</span>, (<span class="var">req</span>, <span class="var">res</span>) => {`,
      `&nbsp;&nbsp;<span class="kw">const</span> { <span class="var">name</span>, <span class="var">email</span>, <span class="var">password</span> } = <span class="var">req</span>.<span class="var">body</span>;`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="var">db</span>.<span class="fn">run</span>(<span class="str">"INSERT INTO users (name, email, password) VALUES (?, ?, ?)"</span>, [<span class="var">name</span>, <span class="var">email</span>, <span class="var">password</span>], ...);</span>`,
      `});`
    ],
    calloutDesc: `Cột <code>email</code> trong SQLite không có ràng buộc <code>UNIQUE</code>. Backend nhận request và ghi thẳng vào CSDL mà không có câu lệnh <code>SELECT id FROM users WHERE email = ?</code> để kiểm tra trước. Hậu quả: Cho phép đăng ký vô số tài khoản trùng email, phá hỏng tính năng đăng nhập và khôi phục mật khẩu.`,
    fixCode: `<span class="comment">// 1. CSDL:</span> <span class="str">\`email TEXT UNIQUE NOT NULL\`</span><br><span class="comment">// 2. Backend:</span> <span class="kw">const</span> user = <span class="kw">await</span> <span class="fn">findUserByEmail</span>(email); <span class="kw">if</span> (user) <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">400</span>).<span class="fn">json</span>({ error: <span class="str">'Email đã tồn tại'</span> });`
  },
  {
    bugId: "BUG-FR01-06",
    bugTitle: "Thiếu Giới Hạn Biên Trên Độ Dài Mật Khẩu",
    fileName: "Register.jsx",
    filePath: "frontend-web/src/pages/Register.jsx",
    tabIcon: "jsx",
    lineStart: 15,
    lines: [
      `<span class="comment">// Dòng 15: Định lượng độ dài dùng {8,} không có chặn biên trên</span>`,
      `<span class="highlight-line"><span class="kw">const</span> <span class="var">flawedStrongPasswordRegex</span> = <span class="regex">/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\s)[A-Za-z\\d\\s]{8,}$/</span>;</span>`,
      `&nbsp;`,
      `<span class="comment">// Dòng 58: Thẻ input không giới hạn maxLength="50"</span>`,
      `<span class="highlight-line"><span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"password"</span> <span class="attr">value</span>={<span class="var">password</span>} <span class="attr">onChange</span>={<span class="var">e</span> => <span class="fn">setPassword</span>(<span class="var">e</span>.<span class="var">target</span>.<span class="var">value</span>)} <span class="attr">required</span> <span class="tag">/&gt;</span></span>`
    ],
    calloutDesc: `Biểu thức chính quy sử dụng lượng từ mở <code>{8,}</code> mà không có cận trên <code>{8,50}</code>. Thẻ input thiếu thuộc tính <code>maxLength="50"</code>. Hệ thống chấp nhận mật khẩu dài vô tận (51, 100, 1000 ký tự), tiềm ẩn nguy cơ tràn bộ nhớ hash và vỡ giao diện hiển thị.`,
    fixCode: `<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"password"</span> <span class="attr">maxLength</span>={<span class="num">50</span>} ... <span class="tag">/&gt;</span><br><span class="kw">const</span> regex = <span class="regex">/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,50}$/</span>;`
  },
  {
    bugId: "BUG-FR01-07",
    bugTitle: "Sai Màu Nút Bấm & Thiếu Dấu Sao Bắt Buộc",
    fileName: "Register.jsx",
    filePath: "frontend-web/src/pages/Register.jsx",
    tabIcon: "jsx",
    lineStart: 35,
    lines: [
      `<span class="highlight-line"><span class="tag">&lt;label</span> <span class="attr">className</span>=<span class="str">"block text-gray-700 mb-2"</span><span class="tag">&gt;</span>Họ Tên<span class="tag">&lt;/label&gt;</span> <span class="comment">// Thiếu dấu * đỏ</span></span>`,
      `<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"text"</span> ... <span class="tag">/&gt;</span>`,
      `...`,
      `<span class="comment">// Dòng 72: Nút Đăng Ký có màu ĐỎ (bg-red-500) thay vì XANH DƯƠNG</span>`,
      `<span class="highlight-line"><span class="tag">&lt;button</span> <span class="attr">type</span>=<span class="str">"submit"</span> <span class="attr">className</span>=<span class="str">"w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"</span><span class="tag">&gt;</span>Đăng Ký<span class="tag">&lt;/button&gt;</span></span>`
    ],
    calloutDesc: `Vi phạm đặc tả FR-21 và FR-22: Tất cả các nhãn trường bắt buộc đều thiếu ký hiệu <code>*</code> màu đỏ. Nút hành động chính "Đăng Ký" bị cài đặt màu đỏ rực (<code>bg-red-500</code>) thay vì màu xanh dương (<code>bg-blue-600</code>), gây nhầm lẫn nghiêm trọng về mặt trải nghiệm người dùng (UX).`,
    fixCode: `<span class="tag">&lt;label&gt;</span>Họ Tên <span class="tag">&lt;span</span> <span class="attr">className</span>=<span class="str">"text-red-500"</span><span class="tag">&gt;</span>*<span class="tag">&lt;/span&gt;&lt;/label&gt;</span><br><span class="tag">&lt;button</span> <span class="attr">className</span>=<span class="str">"w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"</span><span class="tag">&gt;</span>Đăng Ký<span class="tag">&lt;/button&gt;</span>`
  },
  {
    bugId: "BUG-FR01-08",
    bugTitle: "Lưu Mật Khẩu Dạng Plaintext (SEC-01)",
    fileName: "server.js",
    filePath: "backend/server.js",
    tabIcon: "js",
    lineStart: 20,
    lines: [
      `<span class="kw">app</span>.<span class="fn">post</span>(<span class="str">"/api/register"</span>, (<span class="var">req</span>, <span class="var">res</span>) => {`,
      `&nbsp;&nbsp;<span class="kw">const</span> { <span class="var">name</span>, <span class="var">email</span>, <span class="var">password</span> } = <span class="var">req</span>.<span class="var">body</span>;`,
      `&nbsp;`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="comment">// LỖ HỔNG CHÍ MẠNG: Lưu trực tiếp mật khẩu plaintext vào SQLite không qua bcrypt!</span></span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="var">db</span>.<span class="fn">run</span>(<span class="str">"INSERT INTO users (name, email, password) VALUES (?, ?, ?)"</span>, [<span class="var">name</span>, <span class="var">email</span>, <span class="var">password</span>], ...);</span>`,
      `});`
    ],
    calloutDesc: `Vi phạm nghiêm trọng tiêu chuẩn an toàn bảo mật SEC-01 và chuẩn OWASP A02: Mật khẩu người dùng được ghi thẳng xuống bảng <code>users</code> dạng văn bản thuần (Plaintext 100%). Bất kỳ ai có quyền truy cập vào file <code>database.sqlite</code> hoặc lỗi SQLi đều đọc được toàn bộ mật khẩu của khách hàng.`,
    fixCode: `<span class="kw">const</span> bcrypt = <span class="fn">require</span>(<span class="str">'bcrypt'</span>);<br><span class="kw">const</span> hashedPassword = <span class="kw">await</span> bcrypt.<span class="fn">hash</span>(password, <span class="num">10</span>);<br><span class="var">db</span>.<span class="fn">run</span>(<span class="str">"INSERT INTO users (name, email, password) VALUES (?, ?, ?)"</span>, [name, email, hashedPassword], ...);`
  }
];

// Generate HTML and render PNGs
console.log("Generating 8 Unified VS Code Code Evidence Cards...");

bugs.forEach((b, idx) => {
  const htmlContent = getTemplate(b);
  const htmlPath = path.resolve(__dirname, `fr01_unified_${b.bugId.toLowerCase()}.html`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  // Mapping output name
  let outputName = "";
  if (b.bugId === "BUG-FR01-01") outputName = "BUG_01_Code_Evidence_Regex.png";
  else if (b.bugId === "BUG-FR01-02") outputName = "BUG_02_Code_Evidence_Missing_Confirm.png";
  else if (b.bugId === "BUG-FR01-03") outputName = "BUG_03_Code_Evidence_Name_Trim.png";
  else if (b.bugId === "BUG-FR01-04") outputName = "BUG_04_Code_Evidence_Email_Type_Text.png";
  else if (b.bugId === "BUG-FR01-05") outputName = "BUG_05_Code_Evidence_Duplicate_Email.png";
  else if (b.bugId === "BUG-FR01-06") outputName = "BUG_06_Code_Evidence_Max_Length.png";
  else if (b.bugId === "BUG-FR01-07") outputName = "BUG_07_Code_Evidence_GUI.png";
  else if (b.bugId === "BUG-FR01-08") outputName = "BUG_08_Code_Evidence_Plaintext_DB.png";

  const targetF01 = path.join(OUTPUT_DIR, outputName);
  const targetRoot = path.join(ROOT_SCREENSHOTS, outputName);

  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${targetF01}" --window-size=1080,720 "file:///${htmlPath.replace(/\\\\/g, '/')}"`;
  
  try {
    execSync(cmd);
    fs.copyFileSync(targetF01, targetRoot);
    console.log(`[${idx+1}/8] Rendered ${outputName} -> OK`);
  } catch(e) {
    console.error(`Error rendering ${outputName}:`, e.message);
  }
});

console.log("All 8 Code Evidence Cards generated and unified successfully!");
