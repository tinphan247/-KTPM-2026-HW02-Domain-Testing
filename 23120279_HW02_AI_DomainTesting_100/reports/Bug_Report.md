# Báo cáo Lỗi Tổng hợp (Consolidated Bug Report)

**Dự án:** EShop System Under Test (SUT)  
**Học phần:** Kiểm thử Phần mềm (Software Testing) — FIT-HCMUS  
**Người báo cáo:** Nguyễn Lê Quang Kan (MSSV: 23120279 — Nhóm: N4_1)  
**Tiêu chuẩn báo cáo:** Mẫu 10 trường thông tin chuẩn ThS. Trần Thị Bích Hạnh  
**Môi trường thử nghiệm:**
- **Hệ điều hành:** Windows 11 Pro 64-bit
- **Backend API:** Node.js 18+ / Express / SQLite (`http://localhost:3000`)
- **Frontend Web Khách hàng:** React + Vite + TailwindCSS (`http://localhost:5173`)
- **Frontend Web Quản trị:** React + Vite + TailwindCSS (`http://localhost:5174`)
- **Mobile App Di động:** React Native / Expo (`frontend-mobile`)

---

## 1. Bảng Tổng Hợp 20 Khuyết Tật Toàn Dự Án (Defect Summary Table)

| STT | Mã Bug Toàn dự án | Mã Phân hệ | Chức năng liên quan | Tóm tắt Khuyết tật phát hiện | Severity & Trọng số | Priority | Trạng thái |
| :---: | :---: | :---: | :--- | :--- | :---: | :---: | :---: |
| **I** | **FEATURE A** | **FR-01** | **Đăng ký tài khoản (Frontend Web & Backend API / CSDL)** | | | | |
| 1 | **`BUG-01`** | `BUG-FR01-01` | FR-01 (Web) | Lỗi Regex đảo ngược: Bắt buộc khoảng trắng `\s`, cấm ký tự đặc biệt | Serious (5) | Critical | New |
| 2 | **`BUG-02`** | `BUG-FR01-02` | FR-01 (Web) | Giao diện form thiếu hoàn toàn trường "Xác nhận mật khẩu" | Serious (5) | High | New |
| 3 | **`BUG-03`** | `BUG-FR01-03` | FR-01 (Web) | Không lọc khoảng trắng ở trường Họ Tên (thiếu `.trim()`) | Medium (3) | Medium | New |
| 4 | **`BUG-04`** | `BUG-FR01-04` | FR-01 (Web) | Input Email dùng `type="text"` thay vì `type="email"` | Medium (3) | Medium | New |
| 5 | **`BUG-05`** | `BUG-FR01-05` | FR-01 (DB) | CSDL không ràng buộc `UNIQUE` cho email, cho phép trùng tài khoản | Fatal (10) | High | New |
| 6 | **`BUG-06`** | `BUG-FR01-06` | FR-01 (Web) | Mật khẩu không giới hạn cận trên ($UB = 50$) | Cosmetic (1) | Low | New |
| 7 | **`BUG-07`** | `BUG-FR01-07` | FR-01 (GUI) | Nút Submit form Web dùng màu đỏ (`bg-red-500`) và thiếu dấu `*` | Cosmetic (1) | Low | New |
| 8 | **`BUG-08`** | `BUG-FR01-08` | FR-01 / SEC-01 | Mật khẩu lưu dạng văn bản thuần (Plaintext) 100% trong SQLite | Fatal (10) | Critical | New |
| **II** | **FEATURE B** | **FR-09 & FR-08** | **Mã giảm giá & Luồng thanh toán Checkout** | | | | |
| 9 | **`BUG-09`** | `BUG-FR09-01` | FR-09 (Backend) | Dùng toán tử `>` thay vì `>=`: Từ chối coupon khi đơn đúng $LB=300k$ | Serious (5) | High | New |
| 10 | **`BUG-10`** | `BUG-FR09-02` | FR-09 (Backend) | Tính sai công thức giảm giá phần trăm khiến `discount_amount` bị âm | Fatal (10) | Critical | New |
| 11 | **`BUG-11`** | `BUG-FR09-03` | FR-09 (API) | Bỏ qua điều kiện C4: Khách vãng lai chưa đăng nhập vẫn áp được coupon | Serious (5) | Medium | New |
| 12 | **`BUG-12`** | `BUG-FR08-01` | FR-08 (Web UI) | Thẻ input cho phép khách hàng tự ý gõ sửa tổng tiền thanh toán | Fatal (10) | Critical | New |
| 13 | **`BUG-13`** | `BUG-FR08-02` | FR-08 (Backend) | Backend chấp nhận thanh toán đơn hàng 0 ₫ không hợp lệ | Fatal (10) | Critical | New |
| 14 | **`BUG-14`** | `BUG-FR08-03` | FR-08 / FR-09 | UI im lặng không phản hồi khi bấm Áp dụng ô mã giảm giá rỗng | Cosmetic (1) | Low | New |
| **III** | **FEATURE C** | **FR-14** | **Quản lý danh mục sản phẩm (Web Admin CRUD & RBAC)** | | | | |
| 15 | **`BUG-15`** | `BUG-FR14-01` | FR-14 (Admin/API) | Cho phép tạo danh mục có tên rỗng `""` và toàn khoảng trắng ($LB-1$) | Medium (3) | Medium | New |
| 16 | **`BUG-16`** | `BUG-FR14-02` | FR-14 / SEC-03 | Lỗ hổng Broken Access Control (BOLA): User thường gọi API Admin | Fatal (10) | Critical | New |
| 17 | **`BUG-17`** | `BUG-FR14-03` | FR-14 (Admin UI) | Nút xóa thiếu dialog xác nhận (FR-24) & Mồ côi dữ liệu CSDL | Medium (3) | Medium | New |
| **IV** | **FEATURE D** | **FR-02** | **Đăng nhập & Khóa tài khoản (Mobile App React Native)** | | | | |
| 18 | **`BUG-18`** | `BUG-FR02-01` | FR-02 (Backend) | Đăng nhập sai tăng bộ đếm nhảy vọt `+2` mỗi lần $\to$ Khóa sai sau 2 lần | Fatal (10) | Critical | New |
| 19 | **`BUG-19`** | `BUG-FR02-02` | FR-02 (Backend) | Thời gian khóa tài khoản bị gán `180000ms` (3 phút) thay vì `30s` | Serious (5) | High | New |
| 20 | **`BUG-20`** | `BUG-FR02-03` | FR-02 (Mobile) | Vi phạm GUI Mobile: Nút 'Sign In', nhãn 'Username', lỗi đặt dưới nút | Cosmetic (1) | Medium | New |

---

## 2. Chi Tiết Từng Lỗi Chuẩn 10 Trường (Detailed Defect Reports)

---

### PHẦN I: FEATURE A — FR-01: ĐĂNG KÝ TÀI KHOẢN (WEB & BACKEND)

#### BUG REPORT 01: `BUG-01` (`BUG-FR01-01`)
* **1. Bug ID:** `BUG-01` (`BUG-FR01-01`)
* **GitHub Issue:** [#73 - BUG-FR01-01](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/73)
* **2. Function Name:** `FR-01: Account Registration (Frontend Web)`
* **3. Problem Summary:** Mật khẩu hợp lệ theo đặc tả SRS (`Password123!`) bị từ chối với lỗi "Mật khẩu quá yếu", trong khi mật khẩu chứa dấu cách (`Password 123`) lại được chấp nhận.
* **4. How to Reproduce:**
  1. Truy cập `http://localhost:5173/register`.
  2. Nhập Name: `"Tester"`, Email: `"test_bug1@gmail.com"`.
  3. Nhập Password: `"Password123!"` (12 ký tự, đủ hoa, thường, số, ký tự đặc biệt).
  4. Nhấn nút "Đăng Ký".
  * *Expected Result:* Form chấp nhận, gửi API và chuyển hướng sang `/login`.
  * *Actual Result:* Báo lỗi màu đỏ: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."*
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Serious (Weight: 5)`
* **Root Cause & Fix:** Tại `frontend-web/src/pages/Register.jsx:15`, Regex dùng `(?=.*\s)[A-Za-z\d\s]{8,}$` (bắt buộc khoảng trắng, cấm ký tự đặc biệt). Cần sửa thành: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/`.
* **Minh chứng:** [`BUG-FR01-01_Code.png`](../screenshots/F01/BUG-FR01-01_Code.png) | [`BUG-FR01-01_UI.png`](../screenshots/F01/BUG-FR01-01_UI.png)

---

#### BUG REPORT 02: `BUG-02` (`BUG-FR01-02`)
* **1. Bug ID:** `BUG-02` (`BUG-FR01-02`)
* **GitHub Issue:** [#74 - BUG-FR01-02](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/74)
* **2. Function Name:** `FR-01: Account Registration (Form Spec)`
* **3. Problem Summary:** Màn hình đăng ký hoàn toàn thiếu trường "Xác nhận mật khẩu" (Confirm Password) và logic so khớp theo quy định bắt buộc của FR-01.
* **4. How to Reproduce:**
  1. Mở trang đăng ký `http://localhost:5173/register`.
  2. Quan sát các trường nhập liệu trên form.
  * *Expected Result:* Có 4 trường: Họ Tên, Email, Mật khẩu, Xác nhận mật khẩu.
  * *Actual Result:* Chỉ có 3 trường: Họ Tên, Email, Mật khẩu. Thiếu hoàn toàn trường Xác nhận mật khẩu.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `High`
* **10. Severity:** `Serious (Weight: 5)`
* **Root Cause & Fix:** File `frontend-web/src/pages/Register.jsx` chưa khai báo state `confirmPassword` và thiếu thẻ `<input>` tương ứng.
* **Minh chứng:** [`BUG-FR01-02_Code.png`](../screenshots/F01/BUG-FR01-02_Code.png) | [`BUG-FR01-02_UI.png`](../screenshots/F01/BUG-FR01-02_UI.png)

---

#### BUG REPORT 03: `BUG-03` (`BUG-FR01-03`)
* **1. Bug ID:** `BUG-03` (`BUG-FR01-03`)
* **GitHub Issue:** [#75 - BUG-FR01-03](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/75)
* **2. Function Name:** `FR-01: Form Validation`
* **3. Problem Summary:** Trường Họ Tên không lọc khoảng trắng (không gọi `.trim()`), cho phép nhập chuỗi chỉ chứa toàn dấu cách `"   "` để vượt qua kiểm tra bắt buộc.
* **4. How to Reproduce:**
  1. Mở trang đăng ký.
  2. Nhập Họ Tên: `"   "` (3 dấu cách), Email hợp lệ, Mật khẩu hợp lệ.
  3. Bấm "Đăng Ký".
  * *Expected Result:* Báo lỗi Họ Tên bắt buộc, không được để trống.
  * *Actual Result:* Form chấp nhận và gửi request tạo tài khoản với tên chỉ gồm khoảng trắng.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Medium`
* **10. Severity:** `Medium (Weight: 3)`
* **Root Cause & Fix:** Tại `frontend-web/src/pages/Register.jsx:38-43`, thiếu điều kiện `if (!name.trim())`.
* **Minh chứng:** [`BUG-FR01-03_Code.png`](../screenshots/F01/BUG-FR01-03_Code.png) | [`BUG-FR01-03_UI.png`](../screenshots/F01/BUG-FR01-03_UI.png)

---

#### BUG REPORT 04: `BUG-04` (`BUG-FR01-04`)
* **1. Bug ID:** `BUG-04` (`BUG-FR01-04`)
* **GitHub Issue:** [#76 - BUG-FR01-04](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/76)
* **2. Function Name:** `FR-22: Form Standards`
* **3. Problem Summary:** Trường Email dùng `type="text"` thay vì `type="email"`, vi phạm quy chuẩn FR-22 và làm mất tính năng format validation tự động của trình duyệt HTML5.
* **4. How to Reproduce:**
  1. Kiểm tra mã nguồn input Email trên trang `/register`.
  2. Nhập email sai định dạng: `"user@"` (thiếu tên miền).
  3. Bấm "Đăng Ký".
  * *Expected Result:* Trình duyệt bật popup cảnh báo email không hợp lệ (nhờ `type="email"`).
  * *Actual Result:* Form gửi đi bình thường vì thẻ input khai báo `type="text"`.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Medium`
* **10. Severity:** `Medium (Weight: 3)`
* **Root Cause & Fix:** Tại `frontend-web/src/pages/Register.jsx:48`, sửa `type="text"` thành `type="email"`.
* **Minh chứng:** [`BUG-FR01-04_Code.png`](../screenshots/F01/BUG-FR01-04_Code.png) | [`BUG-FR01-04_UI.png`](../screenshots/F01/BUG-FR01-04_UI.png)

---

#### BUG REPORT 05: `BUG-05` (`BUG-FR01-05`)
* **1. Bug ID:** `BUG-05` (`BUG-FR01-05`)
* **GitHub Issue:** [#77 - BUG-FR01-05](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/77)
* **2. Function Name:** `FR-01: Backend API & Database Integrity`
* **3. Problem Summary:** CSDL SQLite không có ràng buộc `UNIQUE` cho cột `email` và Backend không kiểm tra email đã tồn tại trước khi thêm mới, cho phép đăng ký trùng lặp nhiều tài khoản cùng một email.
* **4. How to Reproduce:**
  1. Gửi request `POST /api/register` với email `"test@eshop.com"` lần 1 $\to$ Nhận HTTP 200 OK (`id=3`).
  2. Gửi tiếp request `POST /api/register` với cùng email `"test@eshop.com"` lần 2.
  * *Expected Result:* Backend từ chối với HTTP 400/409: "Email đã tồn tại trong hệ thống".
  * *Actual Result:* Backend tiếp tục trả về HTTP 200 OK và tạo thêm bản ghi mới (`id=4`) có email trùng hệt.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `High`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** File `backend/database.js:53` khai báo `email TEXT` thiếu `UNIQUE`, và `backend/server.js:20-29` thiếu câu truy vấn `SELECT id FROM users WHERE email = ?` trước khi `INSERT`.
* **Minh chứng:** [`BUG-FR01-05_Code.png`](../screenshots/F01/BUG-FR01-05_Code.png) | [`BUG-FR01-05_UI_DB.png`](../screenshots/F01/BUG-FR01-05_UI_DB.png)

---

#### BUG REPORT 06: `BUG-06` (`BUG-FR01-06`)
* **1. Bug ID:** `BUG-06` (`BUG-FR01-06`)
* **GitHub Issue:** [#78 - BUG-FR01-06](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/78)
* **2. Function Name:** `FR-01: Boundary Constraints`
* **3. Problem Summary:** Ô nhập mật khẩu không giới hạn cận trên ($UB = 50$), cho phép gửi mật khẩu dài hàng nghìn ký tự lên máy chủ.
* **4. How to Reproduce:**
  1. Kiểm tra thuộc tính của ô input Password trên trang `/register`.
  2. Nhập chuỗi 200 ký tự vào ô mật khẩu.
  * *Expected Result:* Ô input giới hạn tối đa 50 ký tự (`maxLength="50"`).
  * *Actual Result:* Cho phép nhập không giới hạn độ dài.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Low`
* **10. Severity:** `Cosmetic (Weight: 1)`
* **Root Cause & Fix:** Thêm thuộc tính `maxLength={50}` vào ô input tại `frontend-web/src/pages/Register.jsx:58`.
* **Minh chứng:** [`BUG-FR01-06_Code.png`](../screenshots/F01/BUG-FR01-06_Code.png) | [`BUG-FR01-06_UI.png`](../screenshots/F01/BUG-FR01-06_UI.png)

---

#### BUG REPORT 07: `BUG-07` (`BUG-FR01-07`)
* **1. Bug ID:** `BUG-07` (`BUG-FR01-07`)
* **GitHub Issue:** [#79 - BUG-FR01-07](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/79)
* **2. Function Name:** `FR-21 / FR-22: GUI Standards`
* **3. Problem Summary:** Nút hành động tích cực Submit dùng màu đỏ nguy hiểm (`bg-red-500`) thay vì màu xanh dương, đồng thời các trường bắt buộc thiếu ký hiệu `*` bên cạnh nhãn.
* **4. How to Reproduce:**
  1. Truy cập trang `/register`.
  2. Quan sát màu sắc của nút "Đăng Ký" và nhãn của các trường Họ Tên, Email, Mật khẩu.
  * *Expected Result:* Nút Submit màu xanh dương (`bg-blue-600`); các nhãn có dấu `*` đỏ bên cạnh.
  * *Actual Result:* Nút Submit màu đỏ rực; các nhãn hoàn toàn không có dấu `*`.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Low`
* **10. Severity:** `Cosmetic (Weight: 1)`
* **Root Cause & Fix:** Sửa class `bg-red-500` thành `bg-blue-600` tại `frontend-web/src/pages/Register.jsx:72` và bổ sung `*` vào các nhãn `<label>`.
* **Minh chứng:** [`BUG-FR01-07_Code.png`](../screenshots/F01/BUG-FR01-07_Code.png) | [`BUG-FR01-07_UI.png`](../screenshots/F01/BUG-FR01-07_UI.png)

---

#### BUG REPORT 08: `BUG-08` (`BUG-FR01-08`)
* **1. Bug ID:** `BUG-08` (`BUG-FR01-08`)
* **GitHub Issue:** [#80 - BUG-FR01-08](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/80)
* **2. Function Name:** `FR-01 / SEC-01: Information Security`
* **3. Problem Summary:** Mật khẩu người dùng được lưu trực tiếp dạng văn bản rõ (Plaintext 100%) vào CSDL SQLite mà không hề được băm (hash) bảo mật.
* **4. How to Reproduce:**
  1. Đăng ký tài khoản mới với mật khẩu `"MySecret123!"`.
  2. Mở CSDL `backend/database.sqlite`, thực thi: `SELECT id, email, password FROM users WHERE email = ...`.
  * *Expected Result:* Cột `password` phải chứa chuỗi băm an toàn (bcrypt/argon2, ví dụ: `$2a$10$...`).
  * *Actual Result:* Cột `password` hiển thị nguyên văn chuỗi `"MySecret123!"`.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** File `backend/server.js:23` ghi trực tiếp: `db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password])`. Cần tích hợp thư viện `bcrypt` để băm mật khẩu trước khi lưu.
* **Minh chứng:** [`BUG-FR01-08_Code.png`](../screenshots/F01/BUG-FR01-08_Code.png) | [`BUG-FR01-08_DB.png`](../screenshots/F01/BUG-FR01-08_DB.png)

---

### PHẦN II: FEATURE B — FR-09: MÃ GIẢM GIÁ & LUỒNG THANH TOÁN (FR-08)

#### BUG REPORT 09: `BUG-09` (`BUG-FR09-01`)
* **1. Bug ID:** `BUG-09` (`BUG-FR09-01`)
* **GitHub Issue:** [#81 - BUG-FR09-01](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/81)
* **2. Function Name:** `FR-09: Discount Coupons (Predicate Logic)`
* **3. Problem Summary:** Cài đặt sai toán tử so sánh biên: Điều kiện $total \ge min\_order\_amount$ bị viết nhầm thành $total > min\_order\_amount$, dẫn tới từ chối áp dụng mã giảm giá khi tổng tiền bằng đúng ngưỡng tối thiểu ($LB = 300,000$ ₫).
* **4. How to Reproduce:**
  1. Chọn mã `SAVE10` (có `min_order_amount = 300,000 ₫`).
  2. Tạo giỏ hàng có tổng tiền đúng `300,000 ₫`.
  3. Nhập mã `SAVE10` và nhấn "Áp dụng".
  * *Expected Result:* Hệ thống chấp nhận mã, giảm 10% (30,000 ₫), còn 270,000 ₫.
  * *Actual Result:* Báo lỗi HTTP 400: *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"*.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `High`
* **10. Severity:** `Serious (Weight: 5)`
* **Root Cause & Fix:** Tại `backend/server.js:379`, sửa `if (total_amount > coupon.min_order_amount)` thành `if (total_amount >= coupon.min_order_amount)`.
* **Minh chứng:** [`BUG-FR09-01_Code.png`](../screenshots/F09/BUG-FR09-01_Code.png) | [`BUG-FR09-01_UI.png`](../screenshots/F09/BUG-FR09-01_UI.png)

---

#### BUG REPORT 10: `BUG-10` (`BUG-FR09-02`)
* **1. Bug ID:** `BUG-10` (`BUG-FR09-02`)
* **GitHub Issue:** [#82 - BUG-FR09-02](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/82)
* **2. Function Name:** `FR-09: Calculation Formula`
* **3. Problem Summary:** Tính sai công thức giảm giá phần trăm: `discount_amount` bị tính ra số âm, làm tổng thanh toán bị đội lên gấp nhiều lần giá trị thực.
* **4. How to Reproduce:**
  1. Áp dụng mã giảm 10% `SAVE10` cho đơn hàng `500,000 ₫`.
  * *Expected Result:* `discount_amount = 50,000 ₫`, `final_amount = 450,000 ₫`.
  * *Actual Result:* `discount_amount = -4,500,000 ₫`, `final_amount = 5,000,000 ₫`!
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** Tại `backend/server.js:399`, code viết: `discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));`. Cần sửa thành: `Math.floor(total_amount * (coupon.discount_value / 100));`.
* **Minh chứng:** [`BUG-FR09-02_Code.png`](../screenshots/F09/BUG-FR09-02_Code.png) | [`BUG-FR09-02_UI.png`](../screenshots/F09/BUG-FR09-02_UI.png)

---

#### BUG REPORT 11: `BUG-11` (`BUG-FR09-03`)
* **1. Bug ID:** `BUG-11` (`BUG-FR09-03`)
* **GitHub Issue:** [#83 - BUG-FR09-03](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/83)
* **2. Function Name:** `FR-09: Access Control`
* **3. Problem Summary:** Endpoint `/api/apply-coupon` thiếu middleware xác thực JWT, cho phép khách vãng lai (chưa đăng nhập) gọi API áp dụng coupon tự do, vi phạm điều kiện C4.
* **4. How to Reproduce:**
  1. Gửi request `POST /api/apply-coupon` với `user_id = null` và không truyền Header `Authorization`.
  * *Expected Result:* Trả về HTTP 401 Unauthorized yêu cầu đăng nhập.
  * *Actual Result:* Trả về HTTP 200 OK và áp dụng mã thành công (`success: true`).
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Medium`
* **10. Severity:** `Serious (Weight: 5)`
* **Root Cause & Fix:** Tại `backend/server.js:363`, bổ sung `authenticateToken` vào route: `app.post("/api/apply-coupon", authenticateToken, ...)`.
* **Minh chứng:** [`BUG-FR09-03_Code.png`](../screenshots/F09/BUG-FR09-03_Code.png) | [`BUG-FR09-03_UI.png`](../screenshots/F09/BUG-FR09-03_UI.png)

---

#### BUG REPORT 12: `BUG-12` (`BUG-FR08-01`)
* **1. Bug ID:** `BUG-12` (`BUG-FR08-01`)
* **GitHub Issue:** [#84 - BUG-FR08-01](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/84)
* **2. Function Name:** `FR-08: Shopping Cart & Checkout (Web UI)`
* **3. Problem Summary:** Ô "Tổng tiền thanh toán" được thiết kế bằng thẻ `<input type="number">`, cho phép người mua tự ý gõ sửa số tiền thanh toán (kể cả 0đ hoặc 1.000đ) để đặt hàng.
* **4. How to Reproduce:**
  1. Thêm món hàng 500.000đ vào giỏ, đi tới `/checkout`.
  2. Tại ô "Tổng tiền thanh toán (VND):", xóa số tiền và nhập `1000`.
  3. Bấm "Đặt Hàng".
  * *Expected Result:* Tổng tiền là nhãn tĩnh (`<span>`), không thể chỉnh sửa.
  * *Actual Result:* Sửa tiền thành công và gửi giá trị bị thao túng lên Backend.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** Tại `frontend-web/src/pages/Checkout.jsx:93-103`, thay thẻ `<input>` bằng `<span className="font-bold text-red-600">{editableTotal.toLocaleString()} ₫</span>`.
* **Minh chứng:** [`BUG-FR08-01_Code.png`](../screenshots/F09/BUG-FR08-01_Code.png) | [`BUG-FR08-01_UI.png`](../screenshots/F09/BUG-FR08-01_UI.png)

---

#### BUG REPORT 13: `BUG-13` (`BUG-FR08-02`)
* **1. Bug ID:** `BUG-13` (`BUG-FR08-02`)
* **GitHub Issue:** [#85 - BUG-FR08-02](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/85)
* **2. Function Name:** `FR-08: Order Checkout (Backend API)`
* **3. Problem Summary:** Endpoint `/api/checkout` không kiểm tra $total\_amount > 0$ và không tính lại tổng tiền từ giỏ hàng, cho phép thanh toán thành công đơn hàng giá trị 0 ₫.
* **4. How to Reproduce:**
  1. Gửi request `POST /api/checkout` với body `{"total_amount": 0, "items": [...]}`.
  * *Expected Result:* Backend từ chối với HTTP 400: "Giá trị đơn hàng không hợp lệ".
  * *Actual Result:* Backend trả về HTTP 200 `"Checkout successful"` và ghi nhận đơn hàng 0đ vào bảng `orders`.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** Tại `backend/server.js:297-308`, bổ sung validation `if (!total_amount || total_amount <= 0) return res.status(400)...` và luôn tính toán lại tổng tiền từ CSDL.
* **Minh chứng:** [`BUG-FR08-02_Code.png`](../screenshots/F09/BUG-FR08-02_Code.png) | [`BUG-FR08-02_UI.png`](../screenshots/F09/BUG-FR08-02_UI.png)

---

#### BUG REPORT 14: `BUG-14` (`BUG-FR08-03`)
* **1. Bug ID:** `BUG-14` (`BUG-FR08-03`)
* **GitHub Issue:** [#86 - BUG-FR08-03](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/86)
* **2. Function Name:** `FR-08 / FR-09: Shopping Cart UI`
* **3. Problem Summary:** Khi ô mã giảm giá rỗng, người dùng bấm nút "Áp dụng" nhưng giao diện hoàn toàn im lặng, không hiển thị thông báo lỗi yêu cầu nhập mã.
* **4. How to Reproduce:**
  1. Vào trang Checkout, để trống ô "Mã Giảm Giá".
  2. Nhấn nút "Áp dụng".
  * *Expected Result:* Hiển thị thông báo cảnh báo màu đỏ: "Vui lòng nhập mã giảm giá".
  * *Actual Result:* Giao diện hoàn toàn không có phản hồi nào.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-18
* **7. Assign To:** Frontend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Low`
* **10. Severity:** `Cosmetic (Weight: 1)`
* **Root Cause & Fix:** Tại `frontend-web/src/pages/Checkout.jsx:23`, lệnh `if (!couponCode.trim()) return;` ngắt hàm sớm mà không gán thông báo lỗi vào state.
* **Minh chứng:** [`BUG-FR08-03_Code.png`](../screenshots/F09/BUG-FR08-03_Code.png) | [`BUG-FR08-03_UI.png`](../screenshots/F09/BUG-FR08-03_UI.png)

---

### PHẦN III: FEATURE C — FR-14: QUẢN LÝ DANH MỤC ADMIN (CRUD & RBAC)

#### BUG REPORT 15: `BUG-15` (`BUG-FR14-01`)
* **1. Bug ID:** `BUG-15` (`BUG-FR14-01`)
* **GitHub Issue:** [#87 - BUG-FR14-01](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/87)
* **2. Function Name:** `FR-14: Category CRUD`
* **3. Problem Summary:** Cho phép tạo danh mục có tên rỗng `""` hoặc toàn khoảng trắng ($LB - 1 = 0$), vi phạm quy định bắt buộc "Tên danh mục không được để trống".
* **4. How to Reproduce:**
  1. Đăng nhập trang Admin (`http://localhost:5174`), chuyển sang tab "Danh mục".
  2. Để trống ô "Tên danh mục mới" và nhấn nút "Thêm mới".
  * *Expected Result:* Form chặn submit (`required`) hoặc API trả về HTTP 400 Bad Request.
  * *Actual Result:* Tạo thành công danh mục tên rỗng trong CSDL SQLite (`id=4`).
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-19
* **7. Assign To:** Fullstack Developer Team
* **8. Status:** `New`
* **9. Priority:** `Medium`
* **10. Severity:** `Medium (Weight: 3)`
* **Root Cause & Fix:** Tại `frontend-admin/src/App.jsx:298` thiếu `required`, và `backend/server.js:251` thiếu validation chuỗi rỗng `if (!name || !name.trim())`.
* **Minh chứng:** [`BUG-FR14-01_Code.png`](../screenshots/F14/BUG-FR14-01_Code.png) | [`BUG-FR14-01_UI.png`](../screenshots/F14/BUG-FR14-01_UI.png)

---

#### BUG REPORT 16: `BUG-16` (`BUG-FR14-02`)
* **1. Bug ID:** `BUG-16` (`BUG-FR14-02`)
* **GitHub Issue:** [#88 - BUG-FR14-02](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/88)
* **2. Function Name:** `FR-14 / FR-12 / SEC-03: Access Control & Authorization`
* **3. Problem Summary:** Lỗ hổng Broken Access Control (BOLA / OWASP A01): Middleware `authenticateToken` chỉ kiểm tra chữ ký Token mà không kiểm tra thuộc tính quyền `role === 'admin'`, cho phép tài khoản người dùng thường (`role = 'user'`) gọi API tạo và xóa danh mục quản trị.
* **4. How to Reproduce:**
  1. Đăng nhập tài khoản User thường (`test@eshop.com`) để lấy JWT Token (`role: "user"`).
  2. Gửi request `POST /api/categories` kèm header `Authorization: Bearer <user_token>` và body `{"name": "Danh mục do User tạo"}`.
  3. Gửi tiếp request `DELETE /api/categories/<id_vừa_tạo>` kèm header `Authorization: Bearer <user_token>`.
  * *Expected Result:* Backend từ chối ngay lập tức với mã lỗi HTTP 403 Forbidden.
  * *Actual Result:* Cả 2 request đều trả về HTTP 200 OK. User thường tạo và xóa danh mục hệ thống thành công!
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-19
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** Middleware tại `backend/server.js:100` thiếu kiểm tra `if (req.user.role !== 'admin') return res.status(403)...`. Cần tạo middleware `requireAdmin` để chặn các request trái quyền.
* **Minh chứng:** [`BUG-FR14-02_Code.png`](../screenshots/F14/BUG-FR14-02_Code.png) | [`BUG-FR14-02_UI.png`](../screenshots/F14/BUG-FR14-02_UI.png)

---

#### BUG REPORT 17: `BUG-17` (`BUG-FR14-03`)
* **1. Bug ID:** `BUG-17` (`BUG-FR14-03`)
* **GitHub Issue:** [#89 - BUG-FR14-03](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/89)
* **2. Function Name:** `FR-14 / FR-24: Category CRUD UI & Data Integrity`
* **3. Problem Summary:** Nút xóa danh mục không có dialog/modal xác nhận nguy hiểm theo chuẩn FR-24; đồng thời xóa danh mục đang chứa sản phẩm không bị chặn, làm mồ côi dữ liệu sản phẩm trong CSDL.
* **4. How to Reproduce:**
  1. Trên danh sách danh mục trang Admin, nhấn nút "Xóa" một danh mục đang có sản phẩm liên kết (ví dụ: ID = 1).
  * *Expected Result:* Hiển thị hộp thoại xác nhận "Bạn có chắc chắn muốn xóa danh mục này?" và chặn xóa nếu danh mục đang chứa sản phẩm liên kết (bảo vệ khóa ngoại).
  * *Actual Result:* Không có hộp thoại nào xuất hiện; danh mục bị xóa tức thì và các sản phẩm con bị mồ côi.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-19
* **7. Assign To:** Fullstack Developer Team
* **8. Status:** `New`
* **9. Priority:** `Medium`
* **10. Severity:** `Medium (Weight: 3)`
* **Root Cause & Fix:** Tại `frontend-admin/src/App.jsx:325` gọi trực tiếp `deleteCategory(c.id)` không qua `window.confirm()`; và `backend/server.js:270` xóa thẳng không kiểm tra bảng `products`.
* **Minh chứng:** [`BUG-FR14-03_Code.png`](../screenshots/F14/BUG-FR14-03_Code.png) | [`BUG-FR14-03_UI.png`](../screenshots/F14/BUG-FR14-03_UI.png) | [`BUG-FR14-03_DB.png`](../screenshots/F14/BUG-FR14-03_DB.png)

---

### PHẦN IV: FEATURE D — FR-02: ĐĂNG NHẬP & KHÓA TÀI KHOẢN (MOBILE APP)

#### BUG REPORT 18: `BUG-18` (`BUG-FR02-01`)
* **1. Bug ID:** `BUG-18` (`BUG-FR02-01`)
* **GitHub Issue:** [#90 - BUG-FR02-01](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/90)
* **2. Function Name:** `FR-02: Login and Account Lockout Policy`
* **3. Problem Summary:** Bộ đếm đăng nhập sai nhảy vọt +2 mỗi lần thay vì +1, khiến tài khoản người dùng bị khóa sai chỉ sau 2 lần nhập sai (thay vì 3 lần theo đặc tả).
* **4. How to Reproduce:**
  1. Kiểm tra tài khoản `test@eshop.com` có `login_attempts = 0`.
  2. Trên Mobile App, nhập sai mật khẩu lần 1 $\to$ Bấm Đăng nhập. Kiểm tra CSDL thấy `login_attempts = 2`.
  3. Nhập sai mật khẩu lần 2 $\to$ Bấm Đăng nhập.
  * *Expected Result:* Lần 1: `attempts = 1`. Lần 2: `attempts = 2`. Chưa bị khóa.
  * *Actual Result:* Lần 2: `attempts = 4` ($\ge 3$), tài khoản bị khóa ngay lập tức chỉ sau 2 lần sai!
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-19
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `Critical`
* **10. Severity:** `Fatal (Weight: 10)`
* **Root Cause & Fix:** File `backend/server.js:54` viết sai công thức tăng bộ đếm: `const newAttempts = user.login_attempts + 2;`. Cần sửa thành `user.login_attempts + 1`.
* **Minh chứng:** [`BUG-FR02-01_Code.png`](../screenshots/F02/BUG-FR02-01_Code.png) | [`BUG-FR02-01_DB.png`](../screenshots/F02/BUG-FR02-01_DB.png)

---

#### BUG REPORT 19: `BUG-19` (`BUG-FR02-02`)
* **1. Bug ID:** `BUG-19` (`BUG-FR02-02`)
* **GitHub Issue:** [#91 - BUG-FR02-02](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/91)
* **2. Function Name:** `FR-02: Account Lockout Duration`
* **3. Problem Summary:** Khi tài khoản bị khóa, backend thiết lập thời gian hết hạn khóa là 180 giây (180,000ms), gấp 6 lần thời gian quy định trong đặc tả môi trường demo (30 giây).
* **4. How to Reproduce:**
  1. Nhập sai mật khẩu liên tiếp để tài khoản bị khóa tại thời điểm $t_0$.
  2. Đợi 35 giây (vượt quá ngưỡng 30 giây theo SRS).
  3. Nhập đúng mật khẩu và bấm đăng nhập.
  * *Expected Result:* Sau 30 giây tài khoản tự động mở khóa, đăng nhập thành công.
  * *Actual Result:* Hệ thống tiếp tục chặn với HTTP 403 Forbidden. Kiểm tra CSDL thấy `locked_until = now + 180000ms` (3 phút sau mới mở).
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-19
* **7. Assign To:** Backend Developer Team
* **8. Status:** `New`
* **9. Priority:** `High`
* **10. Severity:** `Serious (Weight: 5)`
* **Root Cause & Fix:** File `backend/server.js:57` viết: `lockedUntil = new Date(Date.now() + 180000).toISOString();`. Cần sửa thành `Date.now() + 30000` (30 giây).
* **Minh chứng:** [`BUG-FR02-02_Code.png`](../screenshots/F02/BUG-FR02-02_Code.png) | [`BUG-FR02-02_DB.png`](../screenshots/F02/BUG-FR02-02_DB.png)

---

#### BUG REPORT 20: `BUG-20` (`BUG-FR02-03`)
* **1. Bug ID:** `BUG-20` (`BUG-FR02-03`)
* **GitHub Issue:** [#92 - BUG-FR02-03](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/92)
* **2. Function Name:** `FR-02 / FR-20 / FR-21 / FR-22: Mobile Login GUI Standards`
* **3. Problem Summary:** Màn hình đăng nhập Mobile vi phạm các tiêu chuẩn giao diện di động: nhãn dùng từ tiếng Anh "Username" thay vì "Email", thiếu dấu `*` bắt buộc, nút submit dùng tiếng Anh "Sign In", và hộp thông báo lỗi đặt ở cuối trang (dưới cả nút bấm).
* **4. How to Reproduce:**
  1. Mở màn hình Đăng nhập trên Mobile App.
  2. Quan sát nhãn của ô Email và text trên nút Submit.
  3. Nhập sai thông tin và quan sát vị trí xuất hiện của thông báo lỗi.
  * *Expected Result:* Nhãn "Email *", nút "Đăng nhập", thông báo lỗi hiển thị phía trên nút submit.
  * *Actual Result:* Nhãn là "Username" không có `*`, nút bấm là "Sign In", lỗi nằm ở cuối màn hình dưới nút submit.
* **5. Reported By:** Nguyễn Lê Quang Kan (Nhóm N4_1)
* **6. Date:** 2026-10-19
* **7. Assign To:** Mobile Developer Team
* **8. Status:** `New`
* **9. Priority:** `Medium`
* **10. Severity:** `Cosmetic (Weight: 1)`
* **Root Cause & Fix:** File `frontend-mobile/App.js` dòng 763 (`Username`), dòng 783 (`Sign In`), dòng 790 (vị trí `loginError`). Cần Việt hóa và chuyển khối render thông báo lỗi lên trước nút bấm.
* **Minh chứng:** [`BUG-FR02-03_Code.png`](../screenshots/F02/BUG-FR02-03_Code.png) | [`BUG-FR02-03_UI.png`](../screenshots/F02/BUG-FR02-03_UI.png)
