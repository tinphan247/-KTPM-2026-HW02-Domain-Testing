const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { marked } = require('marked');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const CSS_STYLE = `
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 10.5pt;
    margin: 0;
    padding: 0;
    background: #ffffff;
  }
  h1 {
    font-size: 20pt;
    color: #0f172a;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 8px;
    margin-top: 0;
    margin-bottom: 16px;
    page-break-after: avoid;
  }
  h2 {
    font-size: 15pt;
    color: #1e3a8a;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 12pt;
    color: #334155;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11pt;
    color: #475569;
    margin-top: 14px;
    margin-bottom: 6px;
  }
  p, ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
  }
  ul, ol {
    padding-left: 24px;
  }
  li {
    margin-bottom: 4px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
    text-align: left;
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
  }
  td {
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }
  code {
    font-family: "Consolas", "Courier New", monospace;
    font-size: 9pt;
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
  pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 12px 14px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 8.5pt;
    line-height: 1.45;
    margin: 12px 0;
    page-break-inside: avoid;
  }
  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }
  blockquote {
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
    padding: 8px 14px;
    margin: 12px 0;
    border-radius: 0 6px 6px 0;
    color: #1e3a8a;
  }
  blockquote p {
    margin: 0;
  }
  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 20px 0;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    margin: 10px 0;
  }
  .page-break {
    page-break-before: always;
  }
`;

function convertMarkdownToHtml(markdownContent, title) {
  const bodyHtml = marked.parse(markdownContent);
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>${CSS_STYLE}</style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

function convertFileToPdf(mdFilePath, outputPdfPath, title) {
  console.log(`\n=== Converting: ${mdFilePath} -> ${outputPdfPath} ===`);
  const mdContent = fs.readFileSync(mdFilePath, 'utf8');
  const htmlContent = convertMarkdownToHtml(mdContent, title);
  
  const tempHtmlPath = path.resolve(__dirname, `temp_${path.basename(outputPdfPath, '.pdf')}.html`);
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
  const targetPdf = path.resolve(outputPdfPath);

  const res = spawnSync(EDGE_PATH, [
    '--headless',
    '--disable-gpu',
    '--run-all-compositor-stages-before-draw',
    `--print-to-pdf=${targetPdf}`,
    fileUrl
  ]);

  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  if (fs.existsSync(targetPdf)) {
    const stats = fs.statSync(targetPdf);
    console.log(`[SUCCESS] Generated: ${outputPdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[ERROR] Failed to generate ${outputPdfPath}. Stderr:`, res.stderr ? res.stderr.toString() : '');
  }
}

function convertCombinedAiReport() {
  console.log(`\n=== Generating Combined AI Report: reports/ai_report.pdf ===`);
  const critique = fs.readFileSync(path.resolve(__dirname, '../reports/ai_critique.md'), 'utf8');
  const gap = fs.readFileSync(path.resolve(__dirname, '../reports/ai_gap_analysis.md'), 'utf8');
  const audit = fs.readFileSync(path.resolve(__dirname, '../reports/ai_audit_report.md'), 'utf8');

  const combinedMd = `# BÁO CÁO TỔNG HỢP VỀ SỬ DỤNG AI & HUMAN-IN-THE-LOOP
> **Môn học**: Kiểm thử phần mềm (Software Testing)  
> **Sinh viên thực hiện**: 23120346  
> **Đề tài**: HW02 – Domain Testing & Boundary Value Analysis on EShop  
> **Tài liệu gồm 3 phần**: (1) AI Critique Report, (2) AI Gap Analysis, (3) AI Audit Report  

---

${critique}

<div class="page-break"></div>

${gap}

<div class="page-break"></div>

${audit}
`;

  const htmlContent = convertMarkdownToHtml(combinedMd, 'Báo cáo Tổng hợp AI - 23120346');
  const tempHtmlPath = path.resolve(__dirname, 'temp_ai_combined.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');
  const targetPdf = path.resolve(__dirname, '../reports/ai_report.pdf');

  const res = spawnSync(EDGE_PATH, [
    '--headless',
    '--disable-gpu',
    '--run-all-compositor-stages-before-draw',
    `--print-to-pdf=${targetPdf}`,
    fileUrl
  ]);

  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  if (fs.existsSync(targetPdf)) {
    const stats = fs.statSync(targetPdf);
    console.log(`[SUCCESS] Generated: reports/ai_report.pdf (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[ERROR] Failed to generate reports/ai_report.pdf. Stderr:`, res.stderr ? res.stderr.toString() : '');
  }
}

async function run() {
  const rootReports = path.resolve(__dirname, '../reports');

  // 1. Main Report
  convertFileToPdf(
    path.join(rootReports, 'main_report.md'),
    path.join(rootReports, 'main_report.pdf'),
    'Main Report - Domain Testing & BVA - 23120346'
  );

  // 2. Bug Report
  convertFileToPdf(
    path.join(rootReports, 'bug_report.md'),
    path.join(rootReports, 'bug_report.pdf'),
    'Bug Report - EShop SUT - 23120346'
  );

  // 3. Combined AI Report
  convertCombinedAiReport();

  // 4. Individual AI Reports
  convertFileToPdf(
    path.join(rootReports, 'ai_critique.md'),
    path.join(rootReports, 'ai_critique.pdf'),
    'AI Critique Report - 23120346'
  );
  convertFileToPdf(
    path.join(rootReports, 'ai_gap_analysis.md'),
    path.join(rootReports, 'ai_gap_analysis.pdf'),
    'AI Gap Analysis Report - 23120346'
  );
  convertFileToPdf(
    path.join(rootReports, 'ai_audit_report.md'),
    path.join(rootReports, 'ai_audit_report.pdf'),
    'AI Audit Report - 23120346'
  );

  console.log('\nAll PDF conversions completed!');
}

run();
