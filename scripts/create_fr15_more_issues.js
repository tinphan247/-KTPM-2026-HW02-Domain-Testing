/**
 * Auto-create GitHub Issues for additional FR-15 bugs:
 * - Empty name
 * - String price
 * - Fake category ID
 * - HTTP 200 on non-existent product
 * - Zero price (0d)
 * 
 * Author: 23120346
 */

const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'tinphan247';
const REPO_NAME = '-KTPM-2026-HW02-Domain-Testing';
const BRANCH = 'hw02-23120346';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/screenshots`;

const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

const BUGS = [
  {
    id: 'BUG-FR15-03',
    title: '[BUG-FR15-03] Backend API chấp nhận Tên sản phẩm rỗng (""), thiếu validation phía máy chủ (CWE-20)',
    severity: 'Medium',
    labels: ['bug', 'FR-15', 'severity:medium', 'backend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-15 yêu cầu:
> *"Tên sản phẩm: bắt buộc, tối đa 255 ký tự."*

Tuy nhiên trong \`backend/server.js\` dòng 167-177, Backend hoàn toàn không có câu lệnh kiểm tra tính hợp lệ của trường \`name\` (\`if (!name || !name.trim()) return res.status(400)...\`). Khi client hoặc kẻ tấn công gửi request với \`name: ""\`, sản phẩm không có tên vẫn được chèn thẳng vào CSDL SQLite.

### Các bước tái hiện (Steps to Reproduce)
Gửi POST request tới \`http://localhost:3000/api/products\`:
\`\`\`json
{
  "name": "",
  "price": 200000,
  "category_id": 1
}
\`\`\`

### Kết quả thực tế (Actual Result)
Backend trả về HTTP \`200 OK\` và thông báo \`{"message":"Product created","id":17}\`.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR15_BUG03_EMPTY_NAME_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR15-07',
    title: '[BUG-FR15-07] Backend API chấp nhận Giá tiền là chuỗi chữ ("mot trieu"), không kiểm tra kiểu số',
    severity: 'High',
    labels: ['bug', 'FR-15', 'severity:high', 'backend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-15 yêu cầu:
> *"Giá: bắt buộc, phải là số dương (> 0)."*

Tuy nhiên Backend API không kiểm tra kiểu dữ liệu của trường \`price\`. Khi gửi chuỗi ký tự chữ (\`"price": "mot trieu"\`), máy chủ vẫn tiếp nhận và lưu chuỗi vào cột \`price\` trong bảng \`products\`. Khi dữ liệu này được hiển thị lên giỏ hàng hoặc chi tiết sản phẩm, các hàm tính toán số học bị trả về giá trị \`NaN\` hoặc lỗi phân cách hàng nghìn.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR15_BUG07_STRING_PRICE_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR15-08',
    title: '[BUG-FR15-08] Backend chấp nhận Danh mục không tồn tại (category_id = 99999), thiếu Foreign Key Constraint',
    severity: 'Medium',
    labels: ['bug', 'FR-15', 'severity:medium', 'backend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-15 yêu cầu:
> *"Danh mục: bắt buộc, phải chọn từ danh sách có sẵn."*

Tuy nhiên CSDL SQLite trong SUT không kích hoạt ràng buộc khóa ngoại (\`PRAGMA foreign_keys = ON\`), Backend cũng không kiểm tra sự tồn tại của \`category_id\` trong bảng \`categories\`. Gửi \`category_id: 99999\` vẫn được chấp nhận thành công, tạo ra các sản phẩm mồ côi không thuộc danh mục hợp lệ nào.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR15_BUG08_FAKE_CATEGORY_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR15-10',
    title: '[BUG-FR15-10] API trả về HTTP 200 OK với object rỗng {} khi ID sản phẩm không tồn tại (Thay vì HTTP 404)',
    severity: 'Medium',
    labels: ['bug', 'FR-15', 'severity:medium', 'backend', 'api'],
    body: `### Mô tả lỗi (Bug Description)
Trong \`backend/server.js\` dòng 161:
\`\`\`javascript
if (!row) return res.status(200).json({});
\`\`\`
Khi người dùng truy vấn một sản phẩm không tồn tại hoặc đã bị xóa (\`GET /api/products/99999\`), Backend lại trả về HTTP \`200 OK\` kèm object rỗng \`{}\` thay vì mã lỗi chuẩn RESTful \`404 Not Found\`.
Điều này khiến giao diện Frontend (\`ProductDetail.jsx\`) nhận mã 200 nên tưởng sản phẩm tồn tại và cố truy xuất thuộc tính \`product.name\`, dẫn đến lỗi hiển thị trắng trang.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR15_BUG10_STATUS_200_NOT_FOUND_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR15-02B',
    title: '[BUG-FR15-02B] Backend và Giao diện Admin chấp nhận lưu sản phẩm với Giá bằng 0 ₫ (Vi phạm đặc tả giá > 0)',
    severity: 'Medium',
    labels: ['bug', 'FR-15', 'severity:medium', 'frontend-admin', 'backend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-15 yêu cầu:
> *"Giá: bắt buộc, phải là số dương (> 0)."*

Theo lý thuyết BVA (Boundary Value Analysis), điểm biên ranh giới $LB - 1 = 0$ là giá trị không hợp lệ (Off-point) bắt buộc phải bị từ chối.
Tuy nhiên khi người dùng nhập \`Giá = 0\` trên giao diện Admin và lưu sản phẩm:
- Cả Giao diện Admin và Backend đều không chặn giá trị 0.
- Sản phẩm được lưu thành công vào CSDL và hiển thị trong danh sách với giá \`0 ₫\`.

### Bằng chứng thực tế (Evidence)
![UI Evidence](${RAW_BASE}/FR15_BUG02B_ZERO_PRICE_ACCEPTED.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  }
];

async function createIssues() {
  if (!TOKEN) {
    console.error('❌ Lỗi: Bạn chưa cung cấp GitHub Token!');
    process.exit(1);
  }

  console.log(`=== BẮT ĐẦU TỰ ĐỘNG TẠO 5 ISSUES FR-15 MỞ RỘNG LÊN GITHUB: ${REPO_OWNER}/${REPO_NAME} ===\n`);
  const createdIssues = [];

  for (const bug of BUGS) {
    console.log(`[Đang tạo] ${bug.id}: ${bug.title.slice(0, 50)}...`);
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Antigravity-Agent-23120346',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: bug.title,
          body: bug.body,
          labels: bug.labels
        })
      });

      const data = await response.json();
      if (response.status === 201) {
        console.log(` -> ✅ Thành công: Issue #${data.number} (${data.html_url})`);
        createdIssues.push({ id: bug.id, number: data.number, url: data.html_url });
      } else {
        console.error(` -> ❌ Thất bại (HTTP ${response.status}):`, data.message);
      }
    } catch (err) {
      console.error(` -> ❌ Lỗi mạng:`, err.message);
    }
  }

  console.log(`\n=== TỔNG KẾT: ĐÃ TẠO ${createdIssues.length}/${BUGS.length} ISSUES ===`);
  const outPath = path.resolve(__dirname, 'created_fr15_more_issues_log.json');
  fs.writeFileSync(outPath, JSON.stringify(createdIssues, null, 2), 'utf8');
}

createIssues();
