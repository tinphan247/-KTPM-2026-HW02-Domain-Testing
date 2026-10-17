# BÁO CÁO LỖI (DEFECT / BUG REPORT)
## Môn học: Kiểm thử phần mềm (HW02)
> **Sinh viên thực hiện**: 23120346  
> **Repository GitHub nhóm**: https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing  
> **Hệ thống kiểm thử (SUT)**: EShop (Web & Backend)  

---

## TỔNG HỢP DANH SÁCH BUG TÌM ĐƯỢC CHO TÍNH NĂNG FR-03

| Bug ID | Tên Lỗi (Defect Summary) | Mức độ (Severity) | Trạng thái trên GitHub Issues |
| :---: | :--- | :---: | :---: |
| **BUG-FR03-01** | Thiếu hoàn toàn trường "Xác nhận mật khẩu mới" trên giao diện Bước 2 | **High** | [Đang chờ mở Issue] |
| **BUG-FR03-02** | Hệ thống chỉ sinh và chấp nhận mã OTP 4 chữ số thay vì 6 chữ số theo đặc tả | **High** | [Đang chờ mở Issue] |
| **BUG-FR03-03** | Regex kiểm tra mật khẩu sai logic: Từ chối ký tự đặc biệt hợp lệ và bắt buộc chứa khoảng trắng | **Critical** | [Đang chờ mở Issue] |
| **BUG-FR03-04** | Trường nhập Email dùng thẻ `type="text"` thay vì `type="email"` vi phạm chuẩn HTML5 và tiêu chuẩn GUI | **Medium** | [Đang chờ mở Issue] |
| **BUG-FR03-05** | Giao diện quy trình 2 bước không có chỉ báo bước (Step Indicator "Bước 1 / 2") | **Low** | [Đang chờ mở Issue] |
| **BUG-FR03-06** | Backend API thiếu hoàn toàn kiểm tra độ phức tạp mật khẩu, chấp nhận mật khẩu yếu "123" (CWE-602) | **High** | [Đang chờ mở Issue] |
| **BUG-FR03-07** | Mật khẩu sau khi reset bị lưu dưới dạng văn bản thô (Plaintext) vào CSDL SQLite (Vi phạm nghiêm trọng SEC-01) | **Critical** | [Đang chờ mở Issue] |

---

## CHI TIẾT TỪNG BUG BÁO CÁO (DEFECT DETAILS)

### 1. BUG-FR03-01: Thiếu trường "Xác nhận mật khẩu mới" trên giao diện Bước 2
* **Mã Bug**: `BUG-FR03-01`
* **Tính năng**: `FR-03: Quên mật khẩu & Đặt lại mật khẩu`
* **Mức độ nghiêm trọng (Severity)**: **High**
* **Môi trường kiểm thử**: Chrome 129 / Windows 11 / `http://localhost:5173/forgot-password`
* **Người phát hiện**: 23120346
* **Đặc tả yêu cầu (Specification)**:
  > *"Bước 2 — Đặt lại mật khẩu: Người dùng nhập OTP, Mật khẩu mới, và Xác nhận mật khẩu mới... Phải có trường Xác nhận mật khẩu — hệ thống từ chối nếu hai trường không khớp."*
* **Các bước tái hiện (Steps to Reproduce)**:
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Nhập email `test@eshop.com`, nhấn "Lấy mã OTP".
  3. Quan sát giao diện Bước 2 hiện ra.
* **Kết quả thực tế (Actual Result)**:
  Giao diện Bước 2 chỉ có duy nhất 2 trường nhập: "Mã OTP (4 số)" và "Mật khẩu mới". Hoàn toàn không có trường "Xác nhận mật khẩu mới".
* **Kết quả mong đợi (Expected Result)**:
  Phải có trường "Xác nhận mật khẩu mới" để người dùng nhập lại mật khẩu và hệ thống kiểm tra sự trùng khớp.
* **Bằng chứng (Screenshots)**:
  * Ảnh chụp giao diện (thiếu ô Confirm Password): `screenshots/FR03_BUG01_MISSING_CONFIRM_PASSWORD.png`
  * Ảnh chụp mã nguồn React (khoanh vùng thiếu ô input): `screenshots/FR03_BUG01_CODE_EVIDENCE.png`

---

### 2. BUG-FR03-02: Backend và Giao diện chỉ sinh OTP 4 chữ số thay vì 6 chữ số
* **Mã Bug**: `BUG-FR03-02`
* **Tính năng**: `FR-03: Quên mật khẩu & Đặt lại mật khẩu`
* **Mức độ nghiêm trọng (Severity)**: **High**
* **Đặc tả yêu cầu (Specification)**:
  > *"Hệ thống sinh mã OTP 6 chữ số ngẫu nhiên..."* (Đồng thời tiêu chuẩn bảo mật SEC-07: *"OTP đặt lại mật khẩu phải đủ entropy, tối thiểu 6 chữ số"*).
* **Các bước tái hiện (Steps to Reproduce)**:
  1. Truy cập `http://localhost:5173/forgot-password`.
  2. Nhập `test@eshop.com`, nhấn "Lấy mã OTP".
  3. Đọc mã OTP được thông báo trên màn hình và đọc nhãn trường nhập.
* **Kết quả thực tế (Actual Result)**:
  * Backend (`backend/server.js` dòng 72) sử dụng công thức: `Math.floor(1000 + Math.random() * 9000).toString()` chỉ sinh số có 4 chữ số (từ 1000 đến 9999).
  * Giao diện hiển thị nhãn: `"Mã OTP (4 số)"` và mã OTP chỉ có 4 số (ví dụ: `1619`).
* **Kết quả mong đợi (Expected Result)**:
  Hệ thống phải sinh mã OTP ngẫu nhiên gồm đúng 6 chữ số (từ 100000 đến 999999).
* **Bằng chứng (Screenshots)**:
  * Ảnh chụp giao diện: `screenshots/FR03_BUG02_OTP_4DIGITS_INSTEAD_OF_6.png`
  * Ảnh chụp API Response & Code Backend (khoanh vùng lỗi 4 số): `screenshots/FR03_BUG02_API_EVIDENCE.png`

---

### 3. BUG-FR03-03: Regex kiểm tra mật khẩu bị lỗi logic nghiêm trọng (yêu cầu khoảng trắng thay vì ký tự đặc biệt)
* **Mã Bug**: `BUG-FR03-03`
* **Tính năng**: `FR-03: Quên mật khẩu & Đặt lại mật khẩu`
* **Mức độ nghiêm trọng (Severity)**: **Critical**
* **Đặc tả yêu cầu (Specification)**:
  > *"Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@, $, !, %, *, ?, &)."*
* **Các bước tái hiện (Steps to Reproduce)**:
  1. Tại Bước 2 của trang Quên mật khẩu, nhập OTP hợp lệ.
  2. Nhập mật khẩu hợp lệ chuẩn theo đặc tả: `Eshop@2026` (10 ký tự, có hoa, thường, số, ký tự đặc biệt `@`).
  3. Nhấn "Đặt lại mật khẩu".
* **Kết quả thực tế (Actual Result)**:
  Hệ thống bật thông báo lỗi: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."*
  *Nguyên nhân mã nguồn:* Tại `frontend-web/src/pages/ForgotPassword.jsx` dòng 26:
  `const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;`
  Regex này sử dụng `(?=.*\s)` đòi hỏi phải có **khoảng trắng**, và tập ký tự cho phép chỉ gồm chữ và số và khoảng trắng `[A-Za-z\d\s]`, hoàn toàn không cho phép các ký tự đặc biệt `@, $, !, %, *, ?, &`! Nếu nhập mật khẩu có khoảng trắng như `Eshop 2026` thì lại pass.
* **Kết quả mong đợi (Expected Result)**:
  Hệ thống phải chấp nhận mật khẩu có chứa các ký tự đặc biệt `@, $, !, %, *, ?, &` như `Eshop@2026`.
* **Bằng chứng (Screenshots)**:
  * Ảnh chụp giao diện từ chối mật khẩu hợp lệ: `screenshots/FR03_BUG03_REGEX_REJECTS_VALID_PASSWORD.png`
  * Ảnh chụp giao diện chấp nhận mật khẩu có dấu cách: `screenshots/FR03_BUG03_REGEX_ACCEPTS_SPACE_PASSWORD.png`
  * Ảnh chụp mã nguồn Regex & đo lường runtime (khoanh đỏ lỗi): `screenshots/FR03_BUG03_CODE_EVIDENCE.png`

---

### 4. BUG-FR03-04: Trường Email dùng `type="text"` thay vì `type="email"`
* **Mã Bug**: `BUG-FR03-04`
* **Tính năng**: `FR-03: Quên mật khẩu` & `FR-22: Form Requirements`
* **Mức độ nghiêm trọng (Severity)**: **Medium**
* **Đặc tả yêu cầu (Specification)**:
  > *"FR-22: Trường Email phải dùng `type=\"email\"` (có validate HTML5 format)"*.
* **Kết quả thực tế (Actual Result)**:
  Tại `ForgotPassword.jsx` dòng 50, thẻ input khai báo là `type="text"`. Khi người dùng nhập chuỗi không đúng định dạng email (ví dụ: `testeshop.com`), trình duyệt không kích hoạt tính năng kiểm tra định dạng HTML5 có sẵn của trình duyệt.
* **Kết quả mong đợi (Expected Result)**:
  Thẻ input phải là `<input type="email" ... />`.
* **Bằng chứng (Screenshots)**:
  * Ảnh chụp giao diện gửi email sai cú pháp: `screenshots/FR03_BUG04_EMAIL_TYPE_TEXT.png`
  * Ảnh chụp mã nguồn thẻ input (khoanh đỏ): `screenshots/FR03_BUG04_CODE_EVIDENCE.png`

---

### 5. BUG-FR03-05: Thiếu Step Indicator ("Bước 1 / 2")
* **Mã Bug**: `BUG-FR03-05`
* **Tính năng**: `FR-03` & `FR-22`
* **Mức độ nghiêm trọng (Severity)**: **Low**
* **Đặc tả yêu cầu (Specification)**:
  > *"Giao diện phải hiển thị chỉ báo bước (Step Indicator) — ví dụ: 'Bước 1 / 2'. Các form có từ 2 bước trở lên phải có Step Indicator rõ ràng."*
* **Kết quả thực tế (Actual Result)**:
  Giao diện chỉ hiển thị tiêu đề "Quên Mật Khẩu", không có bất kỳ thành phần nào chỉ rõ người dùng đang ở Bước 1 hay Bước 2.
* **Kết quả mong đợi (Expected Result)**:
  Hiển thị thanh chỉ báo bước (Step Indicator) trực quan.
* **Bằng chứng (Screenshot)**:
  * Ảnh chụp giao diện thiếu Step Indicator: `screenshots/FR03_BUG05_MISSING_STEP_INDICATOR.png`

---

### 6. BUG-FR03-06: Backend API thiếu hoàn toàn kiểm tra độ phức tạp mật khẩu (CWE-602)
* **Mã Bug**: `BUG-FR03-06`
* **Tính năng**: `FR-03: Quên mật khẩu & Đặt lại mật khẩu`
* **Mức độ nghiêm trọng (Severity)**: **High**
* **Đặc tả yêu cầu (Specification)**:
  > *"Mật khẩu tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (@, $, !, %, *, ?, &)."*
* **Các bước tái hiện (Steps to Reproduce)**:
  1. Gửi request HTTP `POST /api/reset-password` trực tiếp đến Backend với payload:
     `{"email": "test@eshop.com", "resetToken": "<valid_token>", "newPassword": "123"}`
* **Kết quả thực tế (Actual Result)**:
  Backend trả về HTTP 200: `{"message": "Password reset successfully"}`. Backend hoàn toàn không có bất kỳ logic kiểm tra độ dài hay độ phức tạp của mật khẩu, phó mặc hoàn toàn cho Client-side validation (Lỗ hổng CWE-602).
* **Kết quả mong đợi (Expected Result)**:
  Backend phải validate lại độ mạnh mật khẩu và trả về lỗi HTTP 400 Bad Request nếu mật khẩu không đạt chuẩn.
* **Bằng chứng (Screenshot)**:
  * Ảnh chụp API Response chấp nhận mật khẩu "123" (khoanh đỏ): `screenshots/FR03_BUG06_API_EVIDENCE.png`

---

### 7. BUG-FR03-07: Mật khẩu lưu dạng văn bản thô (Plaintext) vào CSDL SQLite (Vi phạm SEC-01)
* **Mã Bug**: `BUG-FR03-07`
* **Tính năng**: `FR-03: Quên mật khẩu` & `SEC-01: Security Requirements`
* **Mức độ nghiêm trọng (Severity)**: **Critical**
* **Đặc tả yêu cầu (Specification)**:
  > *"SEC-01: Mật khẩu KHÔNG được lưu dưới dạng plaintext."*
* **Các bước tái hiện (Steps to Reproduce)**:
  1. Tiến hành đặt lại mật khẩu thành công qua API hoặc UI.
  2. Dùng script hoặc SQLite client truy vấn bảng `users`:
     `SELECT id, email, password FROM users WHERE email = 'test@eshop.com';`
* **Kết quả thực tế (Actual Result)**:
  Mật khẩu mới được lưu dưới dạng chữ thô nguyên bản (`123` hoặc `Eshop 2026`) mà không hề được băm (hash) bằng bcrypt hay bất kỳ thuật toán băm an toàn nào (`server.js:90`: `UPDATE users SET password = ? ...`).
* **Kết quả mong đợi (Expected Result)**:
  Mật khẩu phải được hash trước khi lưu vào CSDL (ví dụ dùng `bcrypt.hash(newPassword, 10)`).
* **Bằng chứng (Screenshot)**:
  * Ảnh chụp truy vấn SQLite lưu mật khẩu Plaintext (khoanh đỏ): `screenshots/FR03_BUG07_DB_EVIDENCE.png`


