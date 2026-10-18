const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve(__dirname, '../screenshots/F09');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Rename existing UI screenshots
console.log("Standardizing existing UI screenshots in screenshots/F09/...");
const uiRenameMap = {
  'f09-01.png': 'BUG-FR09-01_UI.png',
  'f09-02.png': 'BUG-FR09-02_UI.png',
  'BUG-07.png': 'BUG-FR09-03_UI.png',
  'BUG-FR08-01.png': 'BUG-FR08-01_UI.png',
  'BUG-FR08-02.png': 'BUG-FR08-02_UI.png',
  'BUG-FR08-03.png': 'BUG-FR08-03_UI.png'
};

for (const [oldName, newName] of Object.entries(uiRenameMap)) {
  const oldPath = path.join(OUTPUT_DIR, oldName);
  const newPath = path.join(OUTPUT_DIR, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${oldName} -> ${newName}`);
  }
}

// 2. HTML Template generator for VS Code style cards
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
      <span class="${tabIcon === 'jsx' ? 'icon-jsx' : 'icon-js'}">${tabIcon === 'jsx' ? '⚛' : 'JS'}</span>
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
    <div>⎇ hw02-23120279 &nbsp; | &nbsp; UTF-8 &nbsp; | &nbsp; ${tabIcon === 'jsx' ? 'JavaScript React' : 'Node.js Express'}</div>
    <div>FIT-HCMUS Software Testing • HW02 Defect Evidence</div>
  </div>
</div>

</body>
</html>`;
}

// 3. Define F09 & F08 defect cards data
const bugs = [
  {
    bugId: "BUG-FR09-01",
    bugTitle: "Toán Tử So Sánh Biên Sai (total > min)",
    fileName: "server.js",
    filePath: "backend/server.js:379",
    tabIcon: "js",
    lineStart: 377,
    lines: [
      `<span class="comment">// Dòng 379: Kiểm tra điều kiện đơn hàng tối thiểu</span>`,
      `<span class="highlight-line"><span class="kw">if</span> (<span class="var">total_amount</span> &gt; <span class="var">coupon</span>.<span class="var">min_order_amount</span>) {</span>`,
      `&nbsp;&nbsp;<span class="kw">const</span> <span class="var">now</span> = <span class="kw">new</span> <span class="fn">Date</span>();`,
      `&nbsp;&nbsp;<span class="kw">const</span> <span class="var">expiry</span> = <span class="kw">new</span> <span class="fn">Date</span>(<span class="var">coupon</span>.<span class="var">expired_at</span>);`,
      `&nbsp;&nbsp;...`,
      `} <span class="kw">else</span> {`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">400</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">\`Đơn hàng chưa đủ giá trị tối thiểu \${coupon.min_order_amount.toLocaleString()} ₫ để áp dụng mã này\`</span> });</span>`,
      `}`
    ],
    calloutDesc: `Lập trình viên sử dụng toán tử so sánh lớn hơn <code>&gt;</code> thay vì lớn hơn hoặc bằng <code>&gt;=</code>. Khi đơn hàng đạt giá trị đúng ngưỡng biên dưới ($LB = 300,000$ ₫), biểu thức trả về false khiến hệ thống từ chối áp dụng mã hợp lệ, vi phạm nghiêm trọng đặc tả BVA nghiệp vụ.`,
    fixCode: `<span class="kw">if</span> (total_amount &gt;= coupon.min_order_amount) {`
  },
  {
    bugId: "BUG-FR09-02",
    bugTitle: "Công Thức % Giảm Giá Bị Âm",
    fileName: "server.js",
    filePath: "backend/server.js:398-406",
    tabIcon: "js",
    lineStart: 397,
    lines: [
      `<span class="kw">let</span> <span class="var">discount_amount</span> = <span class="num">0</span>;`,
      `<span class="kw">if</span> (<span class="var">coupon</span>.<span class="var">type</span> === <span class="str">"percent"</span>) {`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="var">discount_amount</span> = <span class="var">Math</span>.<span class="fn">floor</span>(<span class="var">total_amount</span> * (<span class="num">1</span> - <span class="var">coupon</span>.<span class="var">discount_value</span>));</span>`,
      `} <span class="kw">else</span> {`,
      `&nbsp;&nbsp;<span class="var">discount_amount</span> = <span class="var">coupon</span>.<span class="var">discount_value</span>;`,
      `}`,
      `<span class="highlight-line"><span class="kw">const</span> <span class="var">final_amount</span> = <span class="var">total_amount</span> - <span class="var">discount_amount</span>;</span>`
    ],
    calloutDesc: `Với mã giảm 10% (<code>discount_value = 10</code>), biểu thức <code>(1 - coupon.discount_value)</code> tính ra <code>1 - 10 = -9</code>! Số tiền chiết khấu <code>discount_amount</code> trở thành số âm (ví dụ: -2,700,009 ₫), dẫn đến <code>final_amount = total - (-9 * total) = 10 * total</code>, khiến khách hàng bị đội giá gấp 10 lần!`,
    fixCode: `<span class="var">discount_amount</span> = <span class="var">Math</span>.<span class="fn">floor</span>(<span class="var">total_amount</span> * (<span class="var">coupon</span>.<span class="var">discount_value</span> / <span class="num">100</span>));`
  },
  {
    bugId: "BUG-FR09-03",
    bugTitle: "Bỏ Qua Kiểm Tra Auth C4 Khách Vãng Lai",
    fileName: "server.js",
    filePath: "backend/server.js:363",
    tabIcon: "js",
    lineStart: 362,
    lines: [
      `<span class="comment">// POST apply-coupon: Hoàn toàn thiếu middleware authenticateToken!</span>`,
      `<span class="highlight-line"><span class="var">app</span>.<span class="fn">post</span>(<span class="str">"/api/apply-coupon"</span>, (<span class="var">req</span>, <span class="var">res</span>) =&gt; {</span>`,
      `&nbsp;&nbsp;<span class="kw">const</span> { <span class="var">code</span>, <span class="var">total_amount</span>, <span class="var">user_id</span> } = <span class="var">req</span>.<span class="var">body</span>;`,
      `&nbsp;&nbsp;<span class="kw">if</span> (!<span class="var">code</span>) <span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">400</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">"Vui lòng nhập mã giảm giá"</span> });`,
      `&nbsp;&nbsp;...`,
      `});`
    ],
    calloutDesc: `Vi phạm điều kiện tiên quyết C4 của SRS: Endpoint <code>/api/apply-coupon</code> không yêu cầu JWT Token, cho phép khách vãng lai chưa đăng nhập gọi API áp mã thành công. Dù sau đó nút thanh toán bị chặn nhưng giao diện đã hiển thị sai trạng thái giảm giá của khách chưa đăng nhập.`,
    fixCode: `<span class="var">app</span>.<span class="fn">post</span>(<span class="str">"/api/apply-coupon"</span>, <span class="var">authenticateToken</span>, (<span class="var">req</span>, <span class="var">res</span>) =&gt; {<br>&nbsp;&nbsp;<span class="kw">const</span> <span class="var">userId</span> = <span class="var">req</span>.<span class="var">user</span>.<span class="var">id</span>;`
  },
  {
    bugId: "BUG-FR08-01",
    bugTitle: "Cho Phép Tự Sửa Tổng Tiền Thanh Toán",
    fileName: "Checkout.jsx",
    filePath: "frontend-web/src/pages/Checkout.jsx:93-100",
    tabIcon: "jsx",
    lineStart: 91,
    lines: [
      `<span class="tag">&lt;div</span> <span class="attr">className</span>=<span class="str">"mb-6 flex flex-col gap-2"</span><span class="tag">&gt;</span>`,
      `&nbsp;&nbsp;<span class="tag">&lt;label</span> <span class="attr">className</span>=<span class="str">"font-semibold"</span><span class="tag">&gt;</span>Tổng tiền thanh toán (VND):<span class="tag">&lt;/label&gt;</span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="tag">&lt;input</span> <span class="attr">type</span>=<span class="str">"number"</span> <span class="attr">value</span>={<span class="var">editableTotal</span>} <span class="attr">onChange</span>={(<span class="var">e</span>) =&gt; {</span>`,
      `<span class="highlight-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="fn">setEditableTotal</span>(<span class="fn">Number</span>(<span class="var">e</span>.<span class="var">target</span>.<span class="var">value</span>));</span>`,
      `&nbsp;&nbsp;}} <span class="attr">className</span>=<span class="str">"border p-2 rounded text-red-600 font-bold"</span> <span class="tag">/&gt;</span>`,
      `<span class="tag">&lt;/div&gt;</span>`
    ],
    calloutDesc: `Lỗ hổng logic giao diện nghiêm trọng: Ô hiển thị tổng tiền thanh toán lại là thẻ <code>&lt;input type="number"&gt;</code> hoàn toàn không có thuộc tính <code>readOnly</code> hay <code>disabled</code>. Khách hàng có thể tự do gõ sửa số tiền thành 0đ hoặc 1đ để thanh toán đơn hàng trị giá hàng chục triệu!`,
    fixCode: `<span class="tag">&lt;div</span> <span class="attr">className</span>=<span class="str">"text-xl font-bold text-gray-800 p-2 bg-gray-50 border rounded"</span><span class="tag">&gt;</span><br>&nbsp;&nbsp;{<span class="var">cartTotal</span>.<span class="fn">toLocaleString</span>()} ₫<br><span class="tag">&lt;/div&gt;</span>`
  },
  {
    bugId: "BUG-FR08-02",
    bugTitle: "Backend Duyệt Đơn Hàng 0 ₫ Không Hợp Lệ",
    fileName: "server.js",
    filePath: "backend/server.js:297-308",
    tabIcon: "js",
    lineStart: 297,
    lines: [
      `<span class="var">app</span>.<span class="fn">post</span>(<span class="str">"/api/checkout"</span>, <span class="var">authenticateToken</span>, (<span class="var">req</span>, <span class="var">res</span>) =&gt; {`,
      `&nbsp;&nbsp;<span class="kw">const</span> <span class="var">userId</span> = <span class="var">req</span>.<span class="var">user</span>.<span class="var">id</span>;`,
      `&nbsp;&nbsp;<span class="kw">const</span> { <span class="var">total_amount</span>, <span class="var">shipping_address</span> } = <span class="var">req</span>.<span class="var">body</span>;`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="comment">// LỖ HỔNG: Hoàn toàn không validate if (total_amount &lt;= 0) và không tính lại giá từ giỏ hàng!</span></span>`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="var">db</span>.<span class="fn">run</span>(<span class="str">"INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)"</span>,</span>`,
      `&nbsp;&nbsp;&nbsp;&nbsp;[<span class="var">userId</span>, <span class="var">total_amount</span>, <span class="str">"pending"</span>, <span class="var">shipping_address</span>], ...);`,
      `});`
    ],
    calloutDesc: `Lỗ hổng bảo mật Fatal: Backend tin tưởng 100% tham số <code>total_amount</code> do client gửi lên mà không tính toán lại từ danh sách sản phẩm trong giỏ hàng. Khi khách hàng gửi <code>total_amount: 0</code>, hệ thống vẫn ghi đơn thành công vào CSDL, gây thất thoát tài sản nghiêm trọng.`,
    fixCode: `<span class="kw">if</span> (!total_amount || total_amount &lt;= <span class="num">0</span>) {<br>&nbsp;&nbsp;<span class="kw">return</span> <span class="var">res</span>.<span class="fn">status</span>(<span class="num">400</span>).<span class="fn">json</span>({ <span class="attr">error</span>: <span class="str">"Tổng tiền đơn hàng không hợp lệ."</span> });<br>}`
  },
  {
    bugId: "BUG-FR08-03",
    bugTitle: "UI Im Lặng Khi Bấm Áp Dụng Mã Rỗng",
    fileName: "Checkout.jsx",
    filePath: "frontend-web/src/pages/Checkout.jsx:22-26",
    tabIcon: "jsx",
    lineStart: 21,
    lines: [
      `<span class="kw">const</span> <span class="fn">handleApplyCoupon</span> = <span class="kw">async</span> () =&gt; {`,
      `<span class="highlight-line">&nbsp;&nbsp;<span class="kw">if</span> (!<span class="var">couponCode</span>.<span class="fn">trim</span>()) <span class="kw">return</span>; <span class="comment">// Im lặng kết thúc, không thông báo lỗi!</span></span>`,
      `&nbsp;&nbsp;<span class="fn">setCouponError</span>(<span class="str">''</span>);`,
      `&nbsp;&nbsp;<span class="fn">setCouponResult</span>(<span class="kw">null</span>);`,
      `&nbsp;&nbsp;<span class="fn">setApplyingCoupon</span>(<span class="kw">true</span>);`,
      `&nbsp;&nbsp;...`,
      `};`
    ],
    calloutDesc: `Khi người dùng để trống ô mã giảm giá và bấm "Áp dụng", hàm kiểm tra thấy rỗng và <code>return</code> ngay lập tức mà không gán thông báo lỗi cho <code>couponError</code>. Giao diện hoàn toàn im lặng, gây hiểu lầm cho người dùng rằng nút bấm bị đơ hoặc lỗi hệ thống.`,
    fixCode: `<span class="kw">if</span> (!couponCode.<span class="fn">trim</span>()) {<br>&nbsp;&nbsp;<span class="fn">setCouponError</span>(<span class="str">'Vui lòng nhập mã giảm giá trước khi áp dụng.'</span>);<br>&nbsp;&nbsp;<span class="kw">return</span>;<br>}`
  }
];

// 4. Render 6 unified code cards
console.log("Generating 6 Unified VS Code Code Evidence Cards for F09 & F08...");

bugs.forEach((b, idx) => {
  const htmlContent = getTemplate(b);
  const htmlPath = path.resolve(__dirname, `f09_unified_${b.bugId.toLowerCase()}.html`);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  const outputName = `${b.bugId}_Code.png`;
  const targetPath = path.join(OUTPUT_DIR, outputName);

  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${targetPath}" --window-size=1080,720 "file:///${htmlPath.replace(/\\\\/g, '/')}"`;
  
  try {
    execSync(cmd);
    console.log(`[${idx+1}/6] Rendered ${outputName} -> OK`);
  } catch(e) {
    console.error(`Error rendering ${outputName}:`, e.message);
  }
});

console.log("All F09/F08 Code Evidence Cards generated and unified successfully!");
