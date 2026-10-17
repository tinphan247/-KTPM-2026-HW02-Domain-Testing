const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d22b4dfa-ef6a-4623-aa92-749a2fc284ac';
const dstDir = path.resolve(__dirname, '../screenshots');

const map = {
  'fr07_bug01_code_evidence': 'FR07_BUG01_CODE_EVIDENCE.png',
  'fr07_bug02_code_evidence': 'FR07_BUG02_CODE_EVIDENCE.png',
  'fr07_bug03_code_evidence': 'FR07_BUG03_CODE_EVIDENCE.png',
  'fr07_bug06_api_evidence':  'FR07_BUG06_API_EVIDENCE.png',
  'fr15_bug01_api_evidence':  'FR15_BUG01_API_EVIDENCE.png',
  'fr15_bug02_api_evidence':  'FR15_BUG02_API_EVIDENCE.png',
  'fr15_bug05_code_evidence': 'FR15_BUG05_CODE_EVIDENCE.png',
  'fr04_bug01_code_evidence': 'FR04_BUG01_CODE_EVIDENCE.png',
  'fr04_bug02_api_evidence':  'FR04_BUG02_API_EVIDENCE.png',
  'fr04_bug03_code_evidence': 'FR04_BUG03_CODE_EVIDENCE.png'
};

const files = fs.readdirSync(srcDir);

for (const [prefix, targetName] of Object.entries(map)) {
  const matches = files.filter(f => f.startsWith(prefix) && f.endsWith('.png'));
  if (matches.length > 0) {
    // Sort by name or time
    matches.sort();
    const latest = matches[matches.length - 1];
    const srcFile = path.join(srcDir, latest);
    const dstFile = path.join(dstDir, targetName);
    fs.copyFileSync(srcFile, dstFile);
    console.log(`Copied ${latest} -> ${targetName}`);
  } else {
    console.warn(`Not found for ${prefix}`);
  }
}
