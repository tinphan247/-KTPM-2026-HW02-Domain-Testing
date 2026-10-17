/**
 * Audit and update all GitHub Issues to ensure every issue has properly embedded
 * Markdown screenshots with full raw.githubusercontent.com URLs on branch hw02-23120346.
 * 
 * Author: 23120346
 */

const REPO_OWNER = 'tinphan247';
const REPO_NAME = '-KTPM-2026-HW02-Domain-Testing';
const BRANCH = 'hw02-23120346';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/screenshots`;

const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

// Definitions of correct issue bodies with full embedded images
const UPDATED_ISSUES = {
  39: {
    title: '[BUG-FR03-01] Thiếu hoàn toàn trường "Xác nhận mật khẩu mới" trên giao diện Bước 2',
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

### Bằng chứng thực tế (Evidence)
**1. Ảnh chụp giao diện thiếu ô Confirm Password:**
![UI Evidence](${RAW_BASE}/FR03_BUG01_MISSING_CONFIRM_PASSWORD.png)

**2. Ảnh chụp mã nguồn React khoanh vùng thiếu trường nhập:**
![Code Evidence](${RAW_BASE}/FR03_BUG01_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  40: {
    title: '[BUG-FR03-02] Hệ thống chỉ sinh và chấp nhận mã OTP 4 chữ số thay vì 6 chữ số theo đặc tả',
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu:
> *"Hệ thống sinh mã OTP 6 chữ số ngẫu nhiên..."* (Đồng thời tiêu chuẩn bảo mật SEC-07: *"OTP đặt lại mật khẩu phải đủ entropy, tối thiểu 6 chữ số"*).

Thực tế Backend (\`server.js\` dòng 72) và giao diện nhãn (\`ForgotPassword.jsx\` dòng 69) chỉ sinh và yêu cầu mã OTP gồm **4 chữ số**.

### Các bước tái hiện (Steps to Reproduce)
1. Truy cập \`http://localhost:5173/forgot-password\`
2. Nhập \`test@eshop.com\`, bấm **Lấy mã OTP**
3. Đọc mã OTP được thông báo trên màn hình

### Kết quả thực tế (Actual Result)
- Backend dùng công thức: \`Math.floor(1000 + Math.random() * 9000).toString()\` sinh số từ 1000–9999 (4 chữ số).
- Giao diện yêu cầu: \`Mã OTP (4 số)\`.

### Kết quả mong đợi (Expected Result)
Mã OTP phải là chuỗi ngẫu nhiên gồm đúng 6 chữ số (100000–999999).

### Bằng chứng thực tế (Evidence)
**1. Ảnh chụp giao diện hiển thị nhãn OTP 4 số:**
![UI Evidence](${RAW_BASE}/FR03_BUG02_OTP_4DIGITS_INSTEAD_OF_6.png)

**2. Ảnh chụp API Response và Code Backend sinh 4 số:**
![API Evidence](${RAW_BASE}/FR03_BUG02_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  41: {
    title: '[BUG-FR03-03] Regex kiểm tra mật khẩu bị lỗi logic nghiêm trọng: Bắt buộc dấu cách, từ chối ký tự đặc biệt',
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu:
> *"Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@, $, !, %, *, ?, &)."*

Tại \`ForgotPassword.jsx\` dòng 26:
\`\`\`javascript
const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\s)[A-Za-z\\d\\s]{8,}$/;
\`\`\`
Biểu thức chính quy này sử dụng \`(?=.*\\s)\` (bắt buộc phải có **khoảng trắng**) và tập ký tự chỉ gồm chữ cái, chữ số và khoảng trắng \`[A-Za-z\\d\\s]\`. Biểu thức này:
1. **Từ chối toàn bộ mật khẩu có ký tự đặc biệt hợp lệ** như \`Eshop@2026\`, \`Admin#123\`.
2. **Chấp nhận mật khẩu chứa khoảng trắng nguy hiểm** như \`Eshop 2026\`.

### Bằng chứng thực tế (Evidence)
**1. Ảnh giao diện từ chối mật khẩu chuẩn Eshop@2026:**
![UI Rejected Evidence](${RAW_BASE}/FR03_BUG03_REGEX_REJECTS_VALID_PASSWORD.png)

**2. Ảnh giao diện chấp nhận mật khẩu có dấu cách Eshop 2026:**
![UI Accepted Space Evidence](${RAW_BASE}/FR03_BUG03_REGEX_ACCEPTS_SPACE_PASSWORD.png)

**3. Ảnh chụp phân tích mã nguồn Regex:**
![Code Evidence](${RAW_BASE}/FR03_BUG03_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  42: {
    title: '[BUG-FR03-04] Trường nhập Email dùng thẻ type="text" thay vì type="email", vi phạm tiêu chuẩn GUI',
    body: `### Mô tả lỗi (Bug Description)
Theo tiêu chuẩn biểu mẫu (FR-22):
> *"Trường Email phải sử dụng thẻ input type=\\"email\\" để kích hoạt kiểm tra cú pháp email HTML5 tích hợp sẵn của trình duyệt."*

Tại \`ForgotPassword.jsx\` dòng 50, ô nhập email được khai báo là:
\`\`\`jsx
<input type="text" ... placeholder="Nhập email của bạn" />
\`\`\`
Khi nhập chuỗi không hợp lệ (ví dụ: \`abcxyz\`), trình duyệt không kích hoạt validation và cho phép gửi request lỗi lên máy chủ.

### Bằng chứng thực tế (Evidence)
**1. Ảnh chụp giao diện nhập email sai định dạng:**
![UI Evidence](${RAW_BASE}/FR03_BUG04_EMAIL_TYPE_TEXT.png)

**2. Ảnh chụp mã nguồn HTML khoanh vùng type="text":**
![Code Evidence](${RAW_BASE}/FR03_BUG04_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  43: {
    title: '[BUG-FR03-05] Giao diện quy trình 2 bước không có chỉ báo bước (Step Indicator "Bước 1 / 2")',
    body: `### Mô tả lỗi (Bug Description)
Theo quy chuẩn thiết kế biểu mẫu đa bước (FR-22):
> *"Các quy trình từ 2 bước trở lên phải có chỉ báo bước (Step Indicator) rõ ràng như 'Bước 1 / 2' và 'Bước 2 / 2' để người dùng nhận biết tiến trình."*

Giao diện \`ForgotPassword.jsx\` chỉ hiển thị tiêu đề chung chung, hoàn toàn thiếu thanh tiến trình hoặc nhãn chỉ báo bước.

### Bằng chứng thực tế (Evidence)
**Ảnh chụp giao diện thiếu Step Indicator:**
![UI Evidence](${RAW_BASE}/FR03_BUG05_MISSING_STEP_INDICATOR.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  44: {
    title: '[BUG-FR03-06] Backend API thiếu hoàn toàn kiểm tra độ phức tạp mật khẩu, chấp nhận mật khẩu yếu "123" (CWE-602)',
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu:
> *"Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt."*

Tại Backend \`server.js\` endpoint \`POST /api/reset-password\`:
Máy chủ nhận \`newPassword\` và thực hiện \`UPDATE users SET password = ?\` trực tiếp mà không có bất kỳ dòng lệnh kiểm tra độ dài hay độ phức tạp nào. Phó thác kiểm tra hoàn toàn cho client (Client-side enforcement flaw - CWE-602).

### Bằng chứng thực tế (Evidence)
**Ảnh chụp API Response cập nhật thành công mật khẩu "123":**
![API Evidence](${RAW_BASE}/FR03_BUG06_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  45: {
    title: '[BUG-FR03-07] Mật khẩu sau khi reset bị lưu dạng văn bản thô (Plaintext) vào CSDL SQLite (Vi phạm SEC-01)',
    body: `### Mô tả lỗi (Bug Description)
Tiêu chuẩn an toàn dữ liệu SEC-01:
> *"Mật khẩu KHÔNG được lưu dưới dạng plaintext trong bất kỳ trường hợp nào. Bắt buộc phải băm bằng thuật toán an toàn (bcrypt, argon2)."*

Trong \`server.js\` dòng 90:
\`\`\`javascript
db.run("UPDATE users SET password = ?, reset_token = NULL WHERE email = ? ...", [newPassword, email, resetToken]);
\`\`\`
Mật khẩu mới được lưu nguyên văn dạng Plaintext vào CSDL SQLite. Bất kỳ ai có quyền truy cập file CSDL đều đọc được mật khẩu của người dùng.

### Bằng chứng thực tế (Evidence)
**Ảnh chụp truy vấn CSDL SQLite chứa mật khẩu dạng Plaintext:**
![DB Evidence](${RAW_BASE}/FR03_BUG07_DB_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  46: {
    title: '[BUG-FR03-08] [AI BỎ SÓT - HUMAN FOUND] Thiếu autocomplete="off" khiến trình duyệt điền tự động sai mục đích',
    body: `### Mô tả lỗi (Bug Description)
**Lỗi do sinh viên phát hiện qua trải nghiệm thực tế (AI bỏ sót):**
Do form Bước 2 trong \`ForgotPassword.jsx\` đặt một thẻ input text liền kề trước một thẻ input password mà **không có thuộc tính \`autoComplete="off"\` hoặc \`autoComplete="one-time-code"\`**:
- Trình duyệt (Chrome, Edge, Safari) kích hoạt Password Manager và lầm tưởng đây là một Form Đăng Nhập thông thường.
- Trình duyệt tự động điền địa chỉ email của người dùng vào ô **"Mã OTP"**, và tự động điền mật khẩu cũ lưu sẵn vào ô **"Mật khẩu mới"**.
- Người dùng bấm submit sẽ bị báo lỗi "Mã OTP không đúng", gây khó chịu và gián đoạn trải nghiệm người dùng.

### Bằng chứng thực tế (Evidence)
**Ảnh chụp màn hình trình duyệt Autofill email cá nhân vào ô OTP:**
![Autofill Evidence](${RAW_BASE}/FR03_BUG08_BROWSER_AUTOFILL_MISDIRECTION.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  52: {
    title: '[BUG-FR04-01] Regex Số điện thoại cấm số 0 ở đầu, từ chối toàn bộ số điện thoại hợp lệ theo đặc tả',
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-04:
> *"Số điện thoại hợp lệ: bắt đầu bằng số 0, từ 10–11 chữ số."*

Tuy nhiên trong \`frontend-mobile/App.js\` dòng 287:
\`\`\`javascript
if (!/^[1-9][0-9]{8,9}$/.test(phone)) {
  Alert.alert("Lỗi", "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số.");
  return;
}
\`\`\`
Biểu thức chính quy \`^[1-9]\` bắt buộc ký tự đầu tiên phải là từ 1 đến 9, **hoàn toàn cấm số 0**! Do đó mọi số điện thoại hợp lệ theo định dạng Việt Nam bắt đầu bằng số 0 (ví dụ \`0357131476\` hay \`0901234567\`) đều bị ứng dụng báo lỗi từ chối.

### Các bước tái hiện (Steps to Reproduce)
1. Mở ứng dụng EShop Mobile trên điện thoại iPhone/Android
2. Đăng nhập tài khoản và vào tab **Hồ sơ (Profile)**
3. Nhập số điện thoại hợp lệ: \`0357131476\`
4. Nhấn nút **Cập nhật**

### Kết quả thực tế (Actual Result)
Ứng dụng hiển thị thông báo lỗi (Alert):
> *"Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số."*

### Kết quả mong đợi (Expected Result)
Hệ thống phải chấp nhận số điện thoại bắt đầu bằng số 0 và có độ dài từ 10-11 chữ số theo đúng đặc tả.

### Bằng chứng thực tế (Evidence trên điện thoại)
**1. Nhập số điện thoại hợp lệ 0357131476:**
![Valid Phone Input](${RAW_BASE}/FR04_BUG01_VALID_PHONE_INPUT.png)

**2. Ứng dụng bật popup Alert từ chối:**
![Alert Rejected](${RAW_BASE}/FR04_BUG01_INVALID_PHONE_REJECTED.png)

**3. Mã nguồn Regex cấm số 0:**
![Code Evidence](${RAW_BASE}/FR04_BUG01_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  }
};

async function updateIssues() {
  console.log(`=== BẮT ĐẦU CẬP NHẬT ĐẦY ĐỦ ẢNH CHO TẤT CẢ GITHUB ISSUES ===\n`);
  let successCount = 0;

  for (const [number, data] of Object.entries(UPDATED_ISSUES)) {
    console.log(`[Đang cập nhật Issue #${number}] ${data.title.slice(0, 50)}...`);
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${number}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Antigravity-Agent-23120346',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: data.title,
          body: data.body
        })
      });

      const resData = await response.json();
      if (response.status === 200) {
        console.log(` -> ✅ Đã cập nhật thành công Issue #${number}`);
        successCount++;
      } else {
        console.error(` -> ❌ Thất bại (HTTP ${response.status}):`, resData.message);
      }
    } catch (err) {
      console.error(` -> ❌ Lỗi mạng:`, err.message);
    }
  }

  console.log(`\n=== TỔNG KẾT: ĐÃ CẬP NHẬT THÀNH CÔNG ${successCount}/${Object.keys(UPDATED_ISSUES).length} ISSUES ===`);
}

updateIssues();
