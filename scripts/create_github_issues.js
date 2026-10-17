/**
 * Auto-create GitHub Issues for FR-03 Bug Reports
 * Target Repo: tinphan247/-KTPM-2026-HW02-Domain-Testing
 * Author: 23120346
 * 
 * Usage:
 *   node scripts/create_github_issues.js <YOUR_GITHUB_TOKEN>
 *   or set GITHUB_TOKEN environment variable.
 */

const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'tinphan247';
const REPO_NAME = '-KTPM-2026-HW02-Domain-Testing';
const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

const BUGS = [
  {
    id: 'BUG-FR03-01',
    title: '[BUG-FR03-01] Thiếu hoàn toàn trường "Xác nhận mật khẩu mới" trên giao diện Bước 2',
    severity: 'High',
    labels: ['bug', 'FR-03', 'severity:high', 'frontend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu ở Bước 2 — Đặt lại mật khẩu:
> *"Người dùng nhập OTP, Mật khẩu mới, và Xác nhận mật khẩu mới... Phải có trường Xác nhận mật khẩu — hệ thống từ chối nếu hai trường không khớp."*

Tuy nhiên giao diện Bước 2 hiện tại của component \`ForgotPassword.jsx\` chỉ có ô nhập OTP và ô nhập Mật khẩu mới, **hoàn toàn không có trường Xác nhận mật khẩu**. Mã nguồn cũng không có biến state \`confirmPassword\` và không có logic so khớp.

### Các bước tái hiện (Steps to Reproduce)
1. Truy cập \`http://localhost:5173/forgot-password\`
2. Nhập email \`test@eshop.com\`, bấm **Lấy mã OTP**
3. Quan sát form Bước 2 hiển thị trên màn hình

### Kết quả thực tế (Actual Result)
Giao diện Bước 2 chỉ có:
- \`Mã OTP (4 số)\`
- \`Mật khẩu mới\`
Không có ô nhập Xác nhận mật khẩu.

### Kết quả mong đợi (Expected Result)
Phải có ô nhập **Xác nhận mật khẩu mới** bên dưới ô Mật khẩu mới, đồng thời bắt buộc kiểm tra 2 mật khẩu phải trùng khớp trước khi gửi lên máy chủ.

### Bằng chứng (Evidence)
- Ảnh UI thiếu trường: \`screenshots/FR03_BUG01_MISSING_CONFIRM_PASSWORD.png\`
- Ảnh mã nguồn khoanh vùng vị trí thiếu code: \`screenshots/FR03_BUG01_CODE_EVIDENCE.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-02',
    title: '[BUG-FR03-02] Hệ thống chỉ sinh và chấp nhận mã OTP 4 chữ số thay vì 6 chữ số theo đặc tả',
    severity: 'High',
    labels: ['bug', 'FR-03', 'severity:high', 'backend', 'security'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu:
> *"Hệ thống sinh mã OTP 6 chữ số ngẫu nhiên..."* (Đồng thời tiêu chuẩn bảo mật SEC-07: *"OTP đặt lại mật khẩu phải đủ entropy, tối thiểu 6 chữ số"*).

Thực tế Backend (\`server.js\` dòng 72) và giao diện nhãn (\`ForgotPassword.jsx\` dòng 69) chỉ sinh và yêu cầu mã OTP gồm **4 chữ số**.

### Các bước tái hiện (Steps to Reproduce)
1. Truy cập \`http://localhost:5173/forgot-password\`
2. Nhập \`test@eshop.com\`, bấm **Lấy mã OTP**
3. Quan sát thông báo OTP xanh lá và nhãn trường nhập OTP

### Kết quả thực tế (Actual Result)
- Mã OTP sinh ra dạng \`Math.floor(1000 + Math.random() * 9000)\` có độ dài 4 chữ số (ví dụ: \`1619\`).
- Nhãn trường nhập ghi: \`Mã OTP (4 số)\`.

### Kết quả mong đợi (Expected Result)
Mã OTP phải có đúng 6 chữ số (từ \`100000\` đến \`999999\`) để đảm bảo tính bảo mật entropy theo SEC-07.

### Bằng chứng (Evidence)
- Ảnh UI nhãn 4 số: \`screenshots/FR03_BUG02_OTP_4DIGITS_INSTEAD_OF_6.png\`
- Ảnh API Response: \`screenshots/FR03_BUG02_API_EVIDENCE.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-03',
    title: '[BUG-FR03-03] Regex kiểm tra mật khẩu sai logic: Từ chối ký tự đặc biệt hợp lệ và bắt buộc chứa khoảng trắng',
    severity: 'Critical',
    labels: ['bug', 'FR-03', 'severity:critical', 'frontend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (ví dụ \`@$!%*?&\`).
Tuy nhiên regex trong \`ForgotPassword.jsx\` dòng 26 được viết là:
\`\`\`javascript
const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
\`\`\`
Biểu thức này:
1. Bắt buộc phải có ít nhất một khoảng trắng (\`(?=.*\\s)\`).
2. Danh sách ký tự chỉ cho phép chữ, số và khoảng trắng (\`[A-Za-z\\d\\s]\`), hoàn toàn **cấm mọi ký tự đặc biệt** thông dụng như \`@\`, \`!\`, \`#\`, \`$\`.

### Các bước tái hiện (Steps to Reproduce)
1. Ở Bước 2, nhập OTP hợp lệ.
2. Nhập mật khẩu hợp lệ theo chuẩn đặc tả: \`Eshop@2026\` hoặc \`Admin123!\`.
3. Bấm **Đặt lại mật khẩu**.

### Kết quả thực tế (Actual Result)
Hệ thống báo alert: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."*
Ngược lại, nếu nhập mật khẩu có khoảng trắng \`Eshop 2026\` thì lại được chấp nhận!

### Kết quả mong đợi (Expected Result)
Mật khẩu \`Eshop@2026\` phải được chấp nhận. Regex cần sửa thành:
\`\`\`javascript
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
\`\`\`

### Bằng chứng (Evidence)
- Ảnh từ chối \`Eshop@2026\`: \`screenshots/FR03_BUG03_REGEX_REJECTS_VALID_PASSWORD.png\`
- Ảnh chấp nhận \`Eshop 2026\`: \`screenshots/FR03_BUG03_REGEX_ACCEPTS_SPACE_PASSWORD.png\`
- Ảnh mã nguồn: \`screenshots/FR03_BUG03_CODE_EVIDENCE.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-04',
    title: '[BUG-FR03-04] Trường nhập Email dùng thẻ type="text" thay vì type="email" vi phạm chuẩn HTML5',
    severity: 'Medium',
    labels: ['bug', 'FR-03', 'severity:medium', 'frontend'],
    body: `### Mô tả lỗi (Bug Description)
Trong \`frontend-web/src/pages/ForgotPassword.jsx\` dòng 50:
\`\`\`jsx
<input
  type="text"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border p-2 rounded"
  required
/>
\`\`\`
Trường nhập email dùng thuộc tính \`type="text"\` thay vì \`type="email"\`. Điều này khiến trình duyệt không kích hoạt bàn phím ảo email trên thiết bị di động và không có client-side constraint validation của HTML5.

### Bằng chứng (Evidence)
- Ảnh giao diện: \`screenshots/FR03_BUG04_EMAIL_TYPE_TEXT.png\`
- Ảnh mã nguồn: \`screenshots/FR03_BUG04_CODE_EVIDENCE.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-05',
    title: '[BUG-FR03-05] Giao diện quy trình 2 bước không có chỉ báo bước (Step Indicator "Bước 1 / 2")',
    severity: 'Low',
    labels: ['bug', 'FR-03', 'severity:low', 'frontend', 'ui/ux'],
    body: `### Mô tả lỗi (Bug Description)
Quy trình Quên mật khẩu là wizard 2 bước (Bước 1: Yêu cầu mã qua Email, Bước 2: Nhập OTP và Đặt mật khẩu). Tuy nhiên form không hiển thị chỉ báo bước ("Bước 1 / 2" hoặc Stepper Progress) khiến người dùng không nắm được tiến trình.

### Bằng chứng (Evidence)
- Ảnh giao diện thiếu chỉ báo: \`screenshots/FR03_BUG05_MISSING_STEP_INDICATOR.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-06',
    title: '[BUG-FR03-06] Backend API thiếu kiểm tra độ phức tạp mật khẩu, chấp nhận mật khẩu yếu "123" (CWE-602)',
    severity: 'High',
    labels: ['bug', 'FR-03', 'severity:high', 'backend', 'security'],
    body: `### Mô tả lỗi (Bug Description)
Endpoint Backend \`POST /api/reset-password\` trong \`backend/server.js\` chỉ kiểm tra OTP và cập nhật trực tiếp \`newPassword\` vào CSDL mà không có bất kỳ bước kiểm tra độ dài hoặc độ phức tạp nào.
Kẻ tấn công hoặc người dùng có thể gửi request trực tiếp bằng Postman/curl hoặc script để đặt mật khẩu là \`"123"\` (Client-side enforcement bypass - CWE-602).

### Các bước tái hiện (Steps to Reproduce)
Gửi POST request tới \`http://localhost:3000/api/reset-password\`:
\`\`\`json
{
  "email": "test@eshop.com",
  "resetToken": "<OTP>",
  "newPassword": "123"
}
\`\`\`

### Kết quả thực tế (Actual Result)
Backend trả về mã HTTP \`200 OK\` và thông báo \`{"message":"Password reset successfully"}\`.

### Bằng chứng (Evidence)
- Ảnh API evidence: \`screenshots/FR03_BUG06_API_EVIDENCE.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-07',
    title: '[BUG-FR03-07] Mật khẩu sau khi reset bị lưu dưới dạng văn bản thô (Plaintext) vào SQLite (SEC-01)',
    severity: 'Critical',
    labels: ['bug', 'FR-03', 'severity:critical', 'backend', 'security'],
    body: `### Mô tả lỗi (Bug Description)
Trong \`backend/server.js\` dòng 88:
\`\`\`javascript
db.run("UPDATE users SET password = ? WHERE email = ?", [newPassword, email], ...);
\`\`\`
Mật khẩu mới được lưu trực tiếp vào trường \`password\` trong bảng \`users\` của cơ sở dữ liệu SQLite dưới dạng văn bản thô (Plaintext), không được băm (hashing) bằng bcrypt hay argon2. Điều này vi phạm nghiêm trọng tiêu chuẩn bảo mật dữ liệu người dùng SEC-01.

### Bằng chứng (Evidence)
- Ảnh trích xuất CSDL SQLite: \`screenshots/FR03_BUG07_DB_EVIDENCE.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR03-08',
    title: '[BUG-FR03-08] Thiếu thuộc tính autocomplete="off" khiến trình duyệt tự động điền Email vào ô OTP và Password vào ô Mật khẩu mới',
    severity: 'Medium',
    labels: ['bug', 'FR-03', 'severity:medium', 'frontend', 'human-discovered'],
    body: `### Mô tả lỗi (Bug Description)
**[Bug do sinh viên phát hiện qua kiểm thử trải nghiệm thực tế - AI bỏ sót hoàn toàn]**

Khi người dùng thao tác trên trình duyệt có lưu tài khoản (Chrome / Edge), ngay sau khi nhấn "Lấy mã OTP" và form chuyển sang Bước 2:
Do form thiếu thuộc tính \`autocomplete="off"\`, cơ chế Autofill Heuristics của trình duyệt tự động nhận diện form và tự điền:
1. Địa chỉ email cá nhân đã lưu trên máy vào ô **"Mã OTP (4 số)"**!
2. Mật khẩu đã lưu trên máy vào ô **"Mật khẩu mới"**!

Điều này gây nguy cơ nghiêm trọng: người dùng vô tình bấm đổi mật khẩu mà không biết ô OTP đã bị ghi đè bằng email, dẫn tới thao tác thất bại hoặc nhầm lẫn dữ liệu.

### Các bước tái hiện (Steps to Reproduce)
1. Sử dụng trình duyệt Chrome/Edge có lưu sẵn ít nhất 1 tài khoản
2. Truy cập \`http://localhost:5173/forgot-password\`
3. Nhập email hợp lệ và bấm **Lấy mã OTP**
4. Quan sát các ô nhập ở Bước 2 khi giao diện render

### Kết quả thực tế (Actual Result)
Trình duyệt tự động điền giá trị màu vàng/xanh vào cả 2 ô OTP và Mật khẩu mới.

### Bằng chứng (Evidence)
- Ảnh chụp màn hình: \`screenshots/FR03_BUG08_BROWSER_AUTOFILL_MISDIRECTION.png\`

*Báo cáo bởi SV: 23120346 (HW02)*`
  }
];

async function createIssues() {
  if (!TOKEN) {
    console.error('❌ Lỗi: Bạn chưa cung cấp GitHub Token!');
    console.log('Cách chạy: node scripts/create_github_issues.js <GH_TOKEN>');
    console.log('Hoặc đặt biến môi trường: $env:GITHUB_TOKEN = "<GH_TOKEN>"');
    process.exit(1);
  }

  console.log(`=== BẮT ĐẦU TỰ ĐỘNG TẠO 8 ISSUES LÊN GITHUB: ${REPO_OWNER}/${REPO_NAME} ===\n`);
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
  
  // Lưu log kết quả
  const outPath = path.resolve(__dirname, 'created_issues_log.json');
  fs.writeFileSync(outPath, JSON.stringify(createdIssues, null, 2), 'utf8');
  console.log(`Đã lưu danh sách Issue URLs vào: ${outPath}`);
}

createIssues();
