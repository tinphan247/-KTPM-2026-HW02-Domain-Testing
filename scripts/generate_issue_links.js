const fs = require('fs');
const path = require('path');

// Extract BUGS from create_github_issues.js by reading the file
const scriptContent = fs.readFileSync(path.resolve(__dirname, 'create_github_issues.js'), 'utf8');
const bugsMatch = scriptContent.match(/const BUGS = (\[[\s\S]*?\]);\s*async function/);
if (!bugsMatch) {
  console.error("Could not parse BUGS array");
  process.exit(1);
}

const BUGS = eval(bugsMatch[1]);
const REPO = 'tinphan247/-KTPM-2026-HW02-Domain-Testing';

let html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Tạo GitHub Issues 1-Click (FR-03)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #38bdf8; font-size: 24px; margin-bottom: 8px; }
    p.desc { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .card-info { flex: 1; padding-right: 20px; }
    .card-title { font-size: 16px; font-weight: 600; color: #f1f5f9; margin-bottom: 6px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-right: 6px; }
    .badge-critical { background: #ef4444; color: #fff; }
    .badge-high { background: #f97316; color: #fff; }
    .badge-medium { background: #eab308; color: #000; }
    .badge-low { background: #64748b; color: #fff; }
    .btn-create { background: #2563eb; color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; white-space: nowrap; transition: 0.2s; }
    .btn-create:hover { background: #1d4ed8; transform: translateY(-1px); }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 Bộ công cụ Tạo GitHub Issues 1-Click (FR-03)</h1>
    <p class="desc">Bấm vào nút "Tạo Issue" của từng bug để mở trực tiếp trang GitHub Issue với Tiêu đề, Nội dung Markdown và Nhãn đã được điền sẵn 100%.</p>
`;

BUGS.forEach((b, idx) => {
  const badgeClass = b.severity === 'Critical' ? 'badge-critical' : (b.severity === 'High' ? 'badge-high' : (b.severity === 'Medium' ? 'badge-medium' : 'badge-low'));
  const issueUrl = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(b.title)}&body=${encodeURIComponent(b.body)}&labels=${encodeURIComponent(b.labels.join(','))}`;
  
  html += `
    <div class="card">
      <div class="card-info">
        <div class="card-title">${b.title}</div>
        <div>
          <span class="badge ${badgeClass}">${b.severity}</span>
          ${b.labels.map(l => `<span class="badge" style="background:#334155; color:#94a3b8;">${l}</span>`).join(' ')}
        </div>
      </div>
      <div>
        <a class="btn-create" href="${issueUrl}" target="_blank">Tạo Issue trên GitHub →</a>
      </div>
    </div>
  `;
});

html += `
  </div>
</body>
</html>`;

fs.writeFileSync(path.resolve(__dirname, 'github_issues_1click.html'), html, 'utf8');
console.log('Generated github_issues_1click.html successfully!');
