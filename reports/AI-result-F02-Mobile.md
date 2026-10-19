# NHẬT KÝ KIỂM THỬ TÍNH NĂNG FR-02: ĐĂNG NHẬP & KHÓA TÀI KHOẢN (AI-RESULT)

**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis  
**Học phần:** Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM  
**Tính năng kiểm thử:** `FR-02: Login and Account Lockout (Mobile App React Native & Backend API)`  
**Môi trường SUT:** Mobile App React Native (`frontend-mobile`), Backend API (`http://localhost:3000/api/login`), CSDL SQLite (`database.sqlite`)  
**Chiến lược kiểm thử:** AI-First kết hợp sự kiểm duyệt và đánh giá nghiêm ngặt của con người (Human-in-the-loop)

---

## 📌 BẢNG TỔNG HỢP HỆ THỐNG PROMPT ĐÃ THỰC THI (PROMPT CATALOG)

Dưới đây là hệ thống 6 câu prompt tinh gọn (tương ứng 8 bước kiểm thử miền hộp đen chuẩn FIT-HCMUS) được sử dụng để điều khiển tiến trình kiểm thử:

| Phiên tương tác | Thời gian (Timestamp) | Bước kiểm thử quy chuẩn | Câu Prompt Tinh gọn (Short & Punchy Prompt) |
| :---: | :---: | :--- | :--- |
| **Phiên 1** | `2026-10-19 04:47:23` | Bước 1 & 2: Phân tích I/O & EP | `Thực hiện Bước 1 và Bước 2 kiểm thử hộp đen cho FR-02 (Đăng nhập & Khóa tài khoản trên Mobile App):`<br>`- Xác định biến vào (email, password, login_attempts), biến trạng thái (locked_until), đầu ra kỳ vọng theo đặc tả EShop.`<br>`- Lập bảng Phân hoạch Lớp Tương đương (EP) cho từng biến và trạng thái tài khoản theo chuẩn FIT-HCMUS.` |
| **Phiên 2** | `2026-10-19 04:52:19` | Bước 3 & 4: BVA & Miền Khóa | `Thực hiện tiếp Bước 3 và Bước 4 cho FR-02 Mobile:`<br>`- Phân tích Giá trị Biên (BVA) cho số lần đăng nhập sai (ngưỡng N = 3: các điểm 0, 1, 2, 3, 4 lần).`<br>`- Phân tích BVA thời gian khóa tài khoản (ngưỡng T = 30s: điểm 0s, 29s, 30s, 31s) và lập Bảng chuyển trạng thái tài khoản.` |
| **Phiên 3** | `2026-10-19 04:54:19` | Bước 5: Thiết kế Test Cases | `Thực hiện Bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-02 Mobile bao phủ các lớp EP, điểm BVA và quy tắc giao diện FR-21/FR-22.`<br>`Xuất bảng chuẩn FIT-HCMUS gồm các cột: TC ID, Mục tiêu, EC/BV bao phủ, Test Data, Các bước thực hiện, Kết quả kỳ vọng.` |
| **—** | *(Human-in-the-loop)* | Bước 6: Chạy SUT Live & Ghi nhận | *(Kiểm thử viên tự thực thi trực tiếp trên SUT Live — Human-in-the-loop, không dùng Prompt AI)* |
| **Phiên 5** | `2026-10-19 05:54:50` | Bước 7: Báo cáo Lỗi 10 trường | `Thực hiện Bước 7: Lập Báo cáo Lỗi chuẩn 10 trường (mẫu ThS. Trần Thị Bích Hanh) cho các bug phát hiện ở FR-02 Mobile:`<br>`- BUG-FR02-01: Đăng nhập sai tăng bộ đếm +2 thay vì +1 (server.js:54).`<br>`- BUG-FR02-02: Thời gian khóa tài khoản 180s thay vì 30s (server.js:57).`<br>`- BUG-FR02-03: Vi phạm giao diện Mobile (nút Sign In, nhãn Username, vị trí lỗi sai, nuốt message khóa).` |
| **—** | *(Human-in-the-loop)* | Bước 8: AI Gap Analysis & Phản biện | *(Kiểm thử viên tự phân tích khoảng cách AI, đúc kết 3 nguyên nhân và viết đoạn văn phản biện độc lập — không dùng Prompt AI)* |

> **💡 Single-turn All-in-One Prompt (Prompt tổng hợp chạy 1 lần):**  
> ```text
> Thực hiện trọn vẹn 8 bước kiểm thử miền hộp đen FIT-HCMUS cho FR-02 (Mobile Login & Account Lockout: Mobile App & API /api/login):
> 1. Xác định biến I/O, biến trạng thái & Bảng phân hoạch EP (email, password, login_attempts, locked_until).
> 2. BVA số lần sai (N=3: 0,1,2,3,4) & BVA thời gian khóa (T=30s: 0s,29s,30s,31s) + Ma trận chuyển trạng thái.
> 3. Thiết kế bảng Test Cases chuẩn FIT-HCMUS bao phủ đầy đủ luồng nghiệp vụ và tiêu chuẩn GUI di động.
> 4. Ghi nhận kết quả chạy Live trên SUT (Tester tự chạy thực tế, phát hiện BUG-FR02-01, BUG-FR02-02, BUG-FR02-03).
> 5. Lập Bug Report 10 trường cho các lỗi tìm được.
> 6. Viết AI Gap Analysis (3 tiêu chí) và đoạn phản biện AI Critique (Tester tự phân tích & viết phản biện độc lập).
> ```

---

# PHIÊN TƯƠNG TÁC 1: BƯỚC 1 & BƯỚC 2 — PHÂN TÍCH BIẾN & PHÂN HOẠCH LỚP TƯƠNG ĐƯƠNG TRÊN MOBILE

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-19 04:47:23` (UTC+7)
- **Prompt:**
```text
Thực hiện Bước 1 và Bước 2 kiểm thử hộp đen cho FR-02 (Đăng nhập & Khóa tài khoản trên Mobile App):
- Xác định biến vào (email, password, login_attempts), biến trạng thái (locked_until), đầu ra kỳ vọng theo đặc tả EShop.
- Lập bảng Phân hoạch Lớp Tương đương (EP) cho từng biến và trạng thái tài khoản theo chuẩn FIT-HCMUS.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 1 & BƯỚC 2: PHÂN TÍCH ĐẶC TẢ, XÁC ĐỊNH BIẾN & PHÂN HOẠCH LỚP TƯƠNG ĐƯƠNG (FR-02)

Quy trình kiểm thử tuân thủ 100% đề cương và bài giảng học phần **Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM** (GV: ThS. Trần Thị Bích Hanh / TS. Lâm Quang Vũ / TS. Trần Duy Hoàng).

---

## BƯỚC 1: Phân Tích Đặc Tả & Xác Định Biến trên Mobile (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả Yêu cầu (SRS Ground Truth)
Căn cứ các mục **FR-02**, **FR-21**, **FR-22** và **SEC-02**:
1. **Quy tắc Đăng nhập (`FR-02`):**
   - Người dùng nhập **Email** và **Mật khẩu**.
   - Đăng nhập thành công trả về JWT Token và điều hướng về trang chủ (`goHome()`). Đồng thời reset `login_attempts = 0` và `locked_until = NULL`.
2. **Cơ chế Đếm số lần sai & Khóa tài khoản (Account Lockout Policy):**
   - Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên **đúng 1 đơn vị** ($login\_attempts = login\_attempts + 1$).
   - Nếu đăng nhập sai từ **3 lần trở lên liên tiếp** ($N \ge 3$), tài khoản bị tạm khóa **30 giây** (trong môi trường demo: $locked\_until = now + 30s$).
   - Trong thời gian bị khóa, mọi nỗ lực đăng nhập (kể cả dùng đúng mật khẩu) đều phải bị từ chối với HTTP 403 Forbidden: *"Tài khoản đã bị khóa. Vui lòng thử lại sau."*.
   - Sau khi hết thời gian khóa ($now \ge locked\_until$), người dùng được phép đăng nhập lại bình thường.
3. **Tiêu chuẩn Giao diện Di động (`FR-02`, `FR-21`, `FR-22`):**
   - Nhất quán ngôn ngữ tiếng Việt: Nút bấm phải là **"Đăng nhập"** (không dùng tiếng Anh "Sign In").
   - Nhãn trường Email phải là **"Email"** (không dùng "Username") và có dấu `*` bên cạnh nhãn bắt buộc.
   - Trường Email trên Mobile phải hỗ trợ định dạng bàn phím điện tử `keyboardType="email-address"`.
   - Thông báo lỗi phải xuất hiện **phía trên** nút submit, không được nằm bên dưới.

---

### 1.2 Danh sách Biến Đầu vào & Biến Trạng thái (Inputs & State Variables)

| Ký hiệu | Tên biến | Kiểu dữ liệu | Ý nghĩa nghiệp vụ | Miền giá trị & Ràng buộc vật lý |
| :---: | :--- | :---: | :--- | :--- |
| $I_1$ | `email` | String | Địa chỉ thư điện tử tài khoản | Bắt buộc; đúng cú pháp email (`user@domain.ext`); tồn tại trong CSDL. |
| $I_2$ | `password` | String | Mật khẩu xác thực | Bắt buộc; chuỗi ký tự mật khẩu của người dùng. |
| $S_1$ | `login_attempts` | Integer | Số lần đăng nhập thất bại liên tiếp | Số nguyên không âm ($N \ge 0$). Ban đầu bằng 0, tăng khi sai mật khẩu. |
| $S_2$ | `locked_until` | DATETIME / String | Mốc thời gian kết thúc khóa tài khoản | `NULL` (không khóa) hoặc ISO Timestamp thời điểm tương lai. |
| $T$ | `current_time` | DATETIME | Thời điểm hệ thống nhận request đăng nhập | Thời gian thực ($now$). |

---

### 1.3 Danh sách Kết quả Đầu ra Kỳ vọng (Expected Outputs)

* **$O_1$ (Đăng nhập thành công - HTTP 200 OK):** Trả về JWT Token, thông tin User; đặt lại `login_attempts = 0`, `locked_until = NULL`; điều hướng về Trang chủ.
* **$O_2$ (Sai thông tin đăng nhập - HTTP 401 Unauthorized):** Báo lỗi *"Invalid email or password"*; tăng bộ đếm thất bại lên đúng 1 đơn vị ($N = N + 1$).
* **$O_3$ (Tài khoản bị tạm khóa - HTTP 403 Forbidden):** Báo lỗi *"Tài khoản đã bị khóa. Vui lòng thử lại sau."*; không cho phép xác thực.
* **$O_4$ (Lỗi dữ liệu đầu vào / Validation Error):** Cảnh báo khi để trống trường email hoặc password.

---

## BƯỚC 2: Phân Hoạch Lớp Tương Đương trên Mobile (Equivalence Partitioning - EP)

Áp dụng 4 quy tắc phân hoạch theo chuẩn FIT-HCMUS (Range, Must-be, Set of values, Split/State):

| Biến kiểm tra / Trạng thái | Mã lớp | Mô tả Lớp Tương Đương | Phân loại | Quy tắc áp dụng | Đầu ra kỳ vọng |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **1. Email (`email`)** | **EC01** | Email hợp lệ và đã tồn tại trong CSDL | **Valid** | Must-be | Tiến hành kiểm tra mật khẩu |
| | **EC02** | Email chưa từng được đăng ký trong hệ thống | **Invalid** | Must-be | Báo lỗi 401 Invalid ($O_2$) |
| | **EC03** | Để trống ô Email ($length = 0$) | **Invalid** | Must-be | Chặn submit / Báo lỗi ($O_4$) |
| | **EC04** | Email sai định dạng cú pháp (thiếu `@`, domain) | **Invalid** | Format | Báo lỗi định dạng email ($O_4$) |
| **2. Mật khẩu (`password`)** | **EC05** | Mật khẩu chính xác khớp 100% với CSDL | **Valid** | Must-be | Đăng nhập thành công ($O_1$) |
| | **EC06** | Mật khẩu sai (không khớp với tài khoản) | **Invalid** | Must-be | Báo lỗi 401 & Tăng đếm ($O_2$) |
| | **EC07** | Để trống ô Mật khẩu ($length = 0$) | **Invalid** | Must-be | Chặn submit / Báo lỗi ($O_4$) |
| **3. Số lần đăng nhập sai (`attempts`)** | **EC08** | Chưa từng sai hoặc sai dưới ngưỡng ($N < 3$, ví dụ: 0, 1, 2) | **Valid** | Range ($< N_{lock}$) | Tài khoản mở bình thường |
| | **EC09** | Đạt ngưỡng khóa ($N \ge 3$, ví dụ: 3, 4) | **Invalid** | Range ($\ge N_{lock}$) | Kích hoạt khóa 30 giây ($O_3$) |
| **4. Trạng thái thời gian khóa** | **EC10** | Tài khoản không có mốc khóa (`locked_until == NULL`) | **Valid** | State | Cho phép đăng nhập bình thường |
| | **EC11** | Đang trong thời gian khóa ($now < locked\_until$) | **Invalid** | State | Bị từ chối với HTTP 403 ($O_3$) |
| | **EC12** | Đã hết thời gian khóa ($now \ge locked\_until$) | **Valid** | State | Cho phép đăng nhập lại ($O_1$) |
| **5. Giao diện Mobile (GUI)** | **EC13** | Tuân thủ đầy đủ chuẩn tiếng Việt và vị trí hiển thị lỗi | **Valid** | FR-21, FR-22 | Nút "Đăng nhập", lỗi ở trên |
| | **EC14** | Dùng từ ngữ tiếng Anh hoặc lỗi đặt dưới nút submit | **Invalid** | FR-21, FR-22 | Vi phạm chuẩn giao diện |

---

# PHIÊN TƯƠNG TÁC 2: BƯỚC 3 & BƯỚC 4 — PHÂN TÍCH GIÁ TRI BIÊN (BVA) & MIỀN KHÓA TÀI KHOẢN

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-19 04:52:19` (UTC+7)
- **Prompt:**
```text
Thực hiện tiếp Bước 3 và Bước 4 cho FR-02 Mobile:
- Phân tích Giá trị Biên (BVA) cho số lần đăng nhập sai (ngưỡng N = 3: các điểm 0, 1, 2, 3, 4 lần).
- Phân tích BVA thời gian khóa tài khoản (ngưỡng T = 30s: điểm 0s, 29s, 30s, 31s) và lập Bảng chuyển trạng thái tài khoản.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 3 & BƯỚC 4: BVA & MIỀN CHUYỂN TRẠNG THÁI KHÓA (FR-02)

---

## BƯỚC 3: Phân Tích Giá Trị Biên (Boundary Value Analysis - BVA)

### 3.1 Biên Số Lần Đăng Nhập Sai (Threshold $N = 3$)
Theo đặc tả `FR-02`, ngưỡng khóa tài khoản là khi số lần đăng nhập sai liên tiếp $N \ge 3$:
* $N = 0$: Giá trị danh định ban đầu (Nominal) — Trạng thái bình thường.
* $N = 2$ ($Boundary - 1$): Điểm **OFF** (Chưa bị khóa) — Hệ thống cảnh báo sai mật khẩu nhưng tài khoản vẫn mở.
* $N = 3$ ($Boundary$): Điểm **ON** (Bắt đầu bị khóa) — Hệ thống kích hoạt khóa tài khoản trong 30 giây.
* $N = 4$ ($Boundary + 1$): Điểm **IN** (Vùng đã khóa) — Hệ thống tiếp tục chặn truy cập.

| Mã điểm | Loại điểm | Số lần sai ($N$) | Kết quả kỳ vọng theo SRS |
| :---: | :---: | :---: | :--- |
| **BV-ATT-01** | $Nom$ | 0 | Tài khoản hoàn toàn bình thường, đăng nhập thành công ngay lần đầu. |
| **BV-ATT-02** | $Boundary - 1$ | 2 | Chưa bị khóa; bộ đếm ghi nhận đúng `login_attempts = 2`. |
| **BV-ATT-03** | $Boundary$ | 3 | **Kích hoạt khóa tài khoản.** Gán `locked_until = now + 30s`. Trả về HTTP 403 / 401. |
| **BV-ATT-04** | $Boundary + 1$ | 4 | Tài khoản tiếp tục bị từ chối truy cập do đang trong trạng thái khóa. |

---

### 3.2 Biên Thời Gian Khóa Tài Khoản (Lock Duration $T = 30$ giây)
Xét dòng thời gian sau khi tài khoản bị khóa tại thời điểm $t_0$:
* $t_0 + 0s$: Vừa bị khóa — Đăng nhập bị chặn hoàn toàn.
* $t_0 + 29s$ ($T - 1$): Điểm **IN** vùng khóa — Vẫn còn thời gian khóa, hệ thống **bắt buộc phải từ chối**.
* $t_0 + 30s$ ($T$): Điểm **ON** biên mở khóa — Hết thời gian khóa, hệ thống cho phép thử lại.
* $t_0 + 31s$ ($T + 1$): Điểm **OUT** vùng khóa — Tài khoản mở khóa hoàn toàn, nhập đúng mật khẩu sẽ đăng nhập thành công.

| Mã điểm | Mốc thời gian | Trạng thái khóa | Kết quả kỳ vọng theo SRS |
| :---: | :--- | :---: | :--- |
| **BV-TIME-01** | $t_0 + 10s$ | Đang bị khóa | HTTP 403: *"Tài khoản đã bị khóa. Vui lòng thử lại sau."* |
| **BV-TIME-02** | $t_0 + 29s$ ($T - 1$) | Đang bị khóa | HTTP 403: Tiếp tục bị chặn truy cập. |
| **BV-TIME-03** | $t_0 + 30s$ ($T$) | Vừa hết hạn khóa | Cho phép xử lý request đăng nhập. |
| **BV-TIME-04** | $t_0 + 31s$ ($T + 1$) | Hết hạn khóa | Đăng nhập thành công với mật khẩu đúng; reset `login_attempts = 0`. |

---

## BƯỚC 4: Ma Trận Chuyển Trạng Thái Khóa Tài Khoản (State Transition Matrix)

| Trạng thái hiện tại | Sự kiện kích hoạt (Event) | Trạng thái kế tiếp | Hành động hệ thống (System Action) |
| :--- | :--- | :--- | :--- |
| **1. Bình thường ($N=0$)** | Nhập đúng mật khẩu | **Bình thường ($N=0$)** | Đăng nhập thành công, cấp JWT Token ($O_1$). |
| **2. Bình thường ($N=0$)** | Nhập sai mật khẩu (Lần 1) | **Cảnh báo ($N=1$)** | Tăng `login_attempts = 1`, trả về HTTP 401 ($O_2$). |
| **3. Cảnh báo ($N=1$)** | Nhập sai mật khẩu (Lần 2) | **Cảnh báo ($N=2$)** | Tăng `login_attempts = 2`, trả về HTTP 401 ($O_2$). |
| **4. Cảnh báo ($N=2$)** | Nhập sai mật khẩu (Lần 3) | **Bị khóa ($N=3, T=30s$)** | Tăng `login_attempts = 3`, gán `locked_until = now + 30s`, HTTP 403 ($O_3$). |
| **5. Cảnh báo ($N=1, 2$)** | Nhập đúng mật khẩu | **Bình thường ($N=0$)** | Đăng nhập thành công, reset `login_attempts = 0` ($O_1$). |
| **6. Bị khóa ($T < 30s$)** | Thử đăng nhập (bất kể mật khẩu) | **Bị khóa** | Chặn request ngay lập tức, trả về HTTP 403 ($O_3$). |
| **7. Hết hạn khóa ($T \ge 30s$)** | Nhập đúng mật khẩu | **Bình thường ($N=0$)** | Đăng nhập thành công, xóa `locked_until`, reset đếm về 0 ($O_1$). |

---

# PHIÊN TƯƠNG TÁC 3: BƯỚC 5 — THIẾT KẾ BỘ CA KIỂM THỬ (TEST CASE SPECIFICATION)

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-19 04:54:19` (UTC+7)
- **Prompt:**
```text
Thực hiện Bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-02 Mobile bao phủ các lớp EP, điểm BVA và quy tắc giao diện FR-21/FR-22.
Xuất bảng chuẩn FIT-HCMUS gồm các cột: TC ID, Mục tiêu, EC/BV bao phủ, Test Data, Các bước thực hiện, Kết quả kỳ vọng.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 5: THIẾT KẾ BỘ CA KIỂM THỬ CHI TIẾT (FR-02)

Căn cứ vào kết quả phân tích ở các bước trước, bộ ca kiểm thử cho **FR-02** (Đăng nhập & Khóa tài khoản Mobile) được xây dựng chuẩn mực theo mẫu 6 cột của FIT-HCMUS:

---

## Bảng Đặc Tả Bộ Test Case Chi Tiết cho FR-02

| TC ID | Mục tiêu kiểm thử | EC / BV bao phủ | Test Data (Dữ liệu đầu vào) | Các bước thực hiện (Test Steps) | Kết quả kỳ vọng theo SRS |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **TC-MOB-01** | Đăng nhập thành công ngay lần đầu với thông tin hợp lệ | EC01, EC05, EC08, BV-ATT-01 | • `email`: `"test@eshop.com"`<br>• `password`: `"Test1234!"` | 1. Mở Mobile App, vào màn hình Đăng nhập.<br>2. Nhập email và mật khẩu đúng.<br>3. Bấm nút đăng nhập. | **HTTP 200 OK.** Cấp JWT Token, lưu thông tin user, điều hướng về màn hình Home; `login_attempts = 0`. |
| **TC-MOB-02** | Đăng nhập sai lần 1 — Kiểm tra bộ đếm tăng đúng 1 đơn vị | EC06, EC08 | • `email`: `"test@eshop.com"`<br>• `password`: `"WrongPass1"` | 1. Đăng nhập với mật khẩu sai.<br>2. Bấm nút đăng nhập. | **HTTP 401 Unauthorized.** Báo lỗi không đúng thông tin; bộ đếm trong CSDL tăng **đúng 1 đơn vị** (`login_attempts = 1`), `locked_until = NULL`. |
| **TC-MOB-03** | Đăng nhập sai lần 2 — Tài khoản vẫn chưa bị khóa ($N = 2$) | EC06, EC08, BV-ATT-02 | • `email`: `"test@eshop.com"`<br>• `password`: `"WrongPass2"` | 1. Tiếp tục nhập mật khẩu sai lần thứ 2.<br>2. Bấm đăng nhập. | **HTTP 401 Unauthorized.** Bộ đếm tăng lên đúng 2 (`login_attempts = 2`); tài khoản **chưa bị khóa**, cho phép tiếp tục thử. |
| **TC-MOB-04** | Đăng nhập đúng sau khi đã sai 2 lần — Reset bộ đếm về 0 | EC05, EC08 | • `email`: `"test@eshop.com"`<br>• `password`: `"Test1234!"` | 1. Sau 2 lần sai, nhập lại mật khẩu đúng.<br>2. Bấm đăng nhập. | **HTTP 200 OK.** Đăng nhập thành công; bộ đếm thất bại được **reset về 0** (`login_attempts = 0`). |
| **TC-MOB-05** | Đăng nhập sai lần thứ 3 liên tiếp — Kích hoạt khóa 30 giây | EC06, EC09, BV-ATT-03 | • `email`: `"test@eshop.com"`<br>• `password`: `"WrongPass3"` | 1. Nhập sai mật khẩu liên tiếp lần thứ 3.<br>2. Bấm đăng nhập. | **Kích hoạt khóa tài khoản.** Bộ đếm $N=3$. Thời gian khóa được thiết lập đúng **30 giây** (`locked_until = now + 30s`). Phản hồi cảnh báo tài khoản bị khóa. |
| **TC-MOB-06** | Thử đăng nhập trong khi đang bị khóa ($t_0 + 10s < 30s$) | EC11, BV-TIME-01 | • `email`: `"test@eshop.com"`<br>• `password`: `"Test1234!"` (mật khẩu đúng) | 1. Đợi 10 giây sau khi bị khóa.<br>2. Nhập mật khẩu đúng.<br>3. Bấm đăng nhập. | **HTTP 403 Forbidden.** Hệ thống từ chối ngay lập tức: *"Tài khoản đã bị khóa. Vui lòng thử lại sau."*. Không cho phép đăng nhập dù mật khẩu đúng. |
| **TC-MOB-07** | Đăng nhập thành công ngay sau khi hết thời gian khóa ($t_0 + 31s$) | EC12, BV-TIME-04 | • `email`: `"test@eshop.com"`<br>• `password`: `"Test1234!"` | 1. Đợi đủ 31 giây (vượt qua mốc 30s).<br>2. Nhập mật khẩu đúng.<br>3. Bấm đăng nhập. | **HTTP 200 OK.** Tài khoản tự động mở khóa; đăng nhập thành công; xóa `locked_until` và reset `login_attempts = 0`. |
| **TC-MOB-08** | Kiểm tra nhãn trường nhập liệu Email và ký hiệu `*` (FR-22) | EC13, EC14, FR-22 | Màn hình Đăng nhập Mobile App | 1. Mở màn hình Đăng nhập.<br>2. Quan sát nhãn của ô nhập email. | Nhãn bắt buộc phải là **"Email *"** (không được dùng "Username" và bắt buộc có dấu `*`). |
| **TC-MOB-09** | Kiểm tra nhãn nút bấm hành động chính theo chuẩn tiếng Việt (FR-21) | EC13, EC14, FR-21 | Nút bấm Submit đăng nhập | 1. Quan sát text hiển thị trên nút submit. | Nhãn nút bấm bắt buộc phải là **"Đăng nhập"** (không được dùng tiếng Anh "Sign In"). |
| **TC-MOB-10** | Kiểm tra vị trí hiển thị thông báo lỗi trên Mobile (FR-22) | EC13, EC14, FR-22 | Nhập sai và bấm đăng nhập | 1. Nhập sai mật khẩu để kích hoạt lỗi.<br>2. Quan sát vị trí hiển thị của thông báo lỗi. | Hộp thông báo lỗi bắt buộc phải xuất hiện **phía trên nút Đăng nhập**, không được đặt bên dưới nút. |

---

# BƯỚC 6: KẾT QUẢ THỰC THI KIỂM THỬ TRỰC TIẾP TRÊN SUT LIVE (TESTER EXECUTION)

> 🧑‍💻 **Ghi chú thực thi (Human-in-the-loop):**  
> Toàn bộ 10 ca kiểm thử trong bước này do **Kiểm thử viên (Sinh viên) trực tiếp vận hành và đối soát** trên hệ thống thực tế SUT Live: Mobile App Expo (`frontend-mobile/App.js`) và Backend API (`http://localhost:3000/api/login`), không thông qua câu hỏi/prompt AI, đảm bảo tính khách quan và đúng nguyên tắc kiểm thử hộp đen thực nghiệm.

Quá trình thực thi kiểm thử được tiến hành trực tiếp trên hệ thống SUT Live: Backend API (`http://localhost:3000/api/login`) và Mobile App Codebase (`frontend-mobile/App.js`):

---

## 1. Bảng Kết Quả Thực Thi Kiểm Thử Chi Tiết (Live Execution Results)

| TC ID | Mục tiêu kiểm thử | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng theo SRS | Kết quả thực tế trên SUT Live | Trạng thái | Mã Lỗi (Bug ID) |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-MOB-01** | Đăng nhập thành công lần đầu | Email & Mật khẩu đúng | HTTP 200 OK, cấp JWT Token | HTTP 200 OK, đăng nhập thành công, token được cấp phát. | <span style="color:green">**PASS**</span> | — |
| **TC-MOB-02** | Đăng nhập sai lần 1 — Tăng đếm +1 | Mật khẩu sai lần 1 | HTTP 401, `login_attempts = 1` | **LỖI:** Code backend ([server.js:54](../backend/server.js#L54)) thực hiện `newAttempts = user.login_attempts + 2` $\implies$ `login_attempts` nhảy vọt thành **2** ngay lần sai đầu tiên! | <span style="color:red">**FAIL**</span> | `BUG-FR02-01` |
| **TC-MOB-03** | Đăng nhập sai lần 2 — Chưa bị khóa | Mật khẩu sai lần 2 | HTTP 401, `login_attempts = 2`, chưa khóa | **LỖI:** Do lần 1 đã bị cộng 2, lần 2 cộng tiếp 2 thành **4** ($\ge 3$) $\implies$ **TÀI KHOẢN BỊ KHÓA NGAY LẦN SAI THỨ 2!** | <span style="color:red">**FAIL**</span> | `BUG-FR02-01` |
| **TC-MOB-04** | Đăng nhập đúng sau khi sai — Reset đếm | Mật khẩu đúng | HTTP 200 OK, reset `attempts = 0` | Đăng nhập thành công, CSDL reset `login_attempts = 0`. | <span style="color:green">**PASS**</span> | — |
| **TC-MOB-05** | Thời gian khóa tài khoản đúng 30 giây | Nhập sai liên tiếp để khóa | Khóa trong vòng **30 giây** | **LỖI:** Code backend ([server.js:57](../backend/server.js#L57)) gán `Date.now() + 180000` $\implies$ **TÀI KHOẢN BỊ KHÓA TỚI 180 GIÂY (3 PHÚT)!** | <span style="color:red">**FAIL**</span> | `BUG-FR02-02` |
| **TC-MOB-06** | Thử đăng nhập khi đang bị khóa | Mật khẩu đúng khi đang khóa | HTTP 403: Báo tài khoản bị khóa | Backend trả về HTTP 403, nhưng Mobile App catch error và nuốt mất message, chỉ hiện: *"Đăng nhập thất bại..."*. | <span style="color:red">**FAIL**</span> | `BUG-FR02-03` |
| **TC-MOB-07** | Đăng nhập sau 31 giây (hết hạn khóa) | Đợi 31s và đăng nhập đúng | Mở khóa thành công sau 30s | **LỖI:** Sau 31s tài khoản **vẫn bị khóa cứng** vì backend cài đặt khóa tới 180s (phải đợi hết 3 phút mới mở được)! | <span style="color:red">**FAIL**</span> | `BUG-FR02-02` |
| **TC-MOB-08** | Kiểm tra nhãn trường Email và dấu `*` | Màn hình Đăng nhập Mobile | Nhãn "Email *" | **LỖI:** Nhãn hiển thị là `"Username"` ([App.js:763](../frontend-mobile/App.js#L763)) và hoàn toàn **không có dấu `*`** bắt buộc. | <span style="color:red">**FAIL**</span> | `BUG-FR02-03` |
| **TC-MOB-09** | Kiểm tra nhãn nút bấm Đăng nhập | Nút Submit trên Mobile | Nhãn "Đăng nhập" tiếng Việt | **LỖI:** Nút bấm dùng tiếng Anh `"Sign In"` ([App.js:783](../frontend-mobile/App.js#L783)), vi phạm `FR-21`. | <span style="color:red">**FAIL**</span> | `BUG-FR02-03` |
| **TC-MOB-10** | Kiểm tra vị trí thông báo lỗi | Đăng nhập thất bại để kích hoạt lỗi | Lỗi hiển thị **phía trên** nút submit | **LỖI:** Khối thông báo lỗi `errorBoxText` được đặt **ở cuối cùng, bên dưới nút submit và nút chuyển trang** ([App.js:790](../frontend-mobile/App.js#L790)), vi phạm `FR-22`. | <span style="color:red">**FAIL**</span> | `BUG-FR02-03` |

---

## 2. Thống kê Kết quả Kiểm thử (Test Execution Summary)

```
┌────────────────────────────────────────────────────────┐
│                 ESHOP FR-02 TEST SUMMARY               │
├────────────────────────────────────────────────────────┤
│  Tổng số ca kiểm thử thiết kế:       10 ca (100.0%)    │
│  Số ca kiểm thử ĐẠT (PASS):           2 ca ( 20.0%)    │
│  Số ca kiểm thử KHÔNG ĐẠT (FAIL):     8 ca ( 80.0%)    │
│  Tổng số Bug phát hiện:               3 Bugs           │
│  Tỷ lệ khuyết tật nghiêm trọng:       Cực kỳ cao (Fatal/Serious)
└────────────────────────────────────────────────────────┘
```

---

# PHIÊN TƯƠNG TÁC 5: BƯỚC 7 — LẬP BÁO CÁO LỖI (BUG REPORT) CHUẨN 10 TRƯỜNG FIT-HCMUS

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-19 05:54:50` (UTC+7)
- **Prompt:**
```text
Thực hiện Bước 7: Lập Báo cáo Lỗi chuẩn 10 trường (mẫu ThS. Trần Thị Bích Hanh) cho các bug phát hiện ở FR-02 Mobile:
- BUG-FR02-01: Đăng nhập sai tăng bộ đếm +2 thay vì +1 (server.js:54).
- BUG-FR02-02: Thời gian khóa tài khoản 180s thay vì 30s (server.js:57).
- BUG-FR02-03: Vi phạm giao diện Mobile (nút Sign In, nhãn Username, vị trí lỗi sai, nuốt message khóa).
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 7: BÁO CÁO LỖI CHUẨN 10 TRƯỜNG (FEATURE D: FR-02)

---

## 1. BUG REPORT 01: `BUG-FR02-01` (`BUG-13`)

### [BUG-FR02-01]: Bộ đếm số lần đăng nhập sai tăng vọt +2 mỗi lần, dẫn tới khóa tài khoản sai chỉ sau 2 lần thay vì 3 lần theo đặc tả

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR02-01` (Toàn dự án: `BUG-13`) |
| **2** | **Function Name** | `FR-02: Login and Account Lockout Policy` |
| **3** | **Problem Summary** | Mỗi lần người dùng đăng nhập sai mật khẩu, backend tăng bộ đếm thất bại lên 2 đơn vị thay vì 1 đơn vị, khiến người dùng bị khóa tài khoản ngay sau 2 lần nhập sai. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 (FIT-HCMUS) |
| **6** | **Date** | `2026-10-19` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

#### 4. Chi tiết các bước tái hiện và phân tích lỗi:
* **4.1 Các bước thực hiện:**
  1. Chọn tài khoản test `test@eshop.com`. Kiểm tra trong CSDL thấy `login_attempts = 0`.
  2. Trên Mobile App, nhập email `test@eshop.com` và mật khẩu sai lần 1 (`"WrongPass1"`). Bấm đăng nhập.
  3. Kiểm tra trường `login_attempts` của user trong CSDL SQLite.
  4. Nhập tiếp mật khẩu sai lần 2 (`"WrongPass2"`). Bấm đăng nhập.
* **4.2 Kết quả kỳ vọng:** Lần 1 `login_attempts = 1`. Lần 2 `login_attempts = 2`. Tài khoản chưa bị khóa, người dùng vẫn còn cơ hội đăng nhập lần thứ 3.
* **4.3 Kết quả thực tế:** 
  * Lần 1: `login_attempts` lập tức nhảy thành **2**.
  * Lần 2: `login_attempts` nhảy thành **4** ($\ge 3$), tài khoản **bị khóa ngay lập tức** sau 2 lần sai!
* **4.4 Nguyên nhân kỹ thuật:** File [server.js:54](../backend/server.js#L54) viết sai công thức tăng bộ đếm:
  ```javascript
  const newAttempts = user.login_attempts + 2; // SAI: phải là + 1
  ```
* **4.5 Đề xuất khắc phục:** Sửa thành `const newAttempts = user.login_attempts + 1;`.
* **4.6 Minh chứng kiểm thử:**
  * **Code Evidence (VS Code Card):** [BUG-FR02-01_Code.png](../screenshots/F02/BUG-FR02-01_Code.png)
  * **Thực tế Database (SQLite Table):** [BUG-FR02-01_DB.png](../screenshots/F02/BUG-FR02-01_DB.png)

---

## 2. BUG REPORT 02: `BUG-FR02-02` (`BUG-14`)

### [BUG-FR02-02]: Thời gian khóa tài khoản bị cài đặt sai thành 180 giây (3 phút) thay vì 30 giây theo đặc tả môi trường demo

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR02-02` (Toàn dự án: `BUG-14`) |
| **2** | **Function Name** | `FR-02: Account Lockout Duration` |
| **3** | **Problem Summary** | Khi tài khoản chạm ngưỡng bị khóa, backend thiết lập thời gian hết hạn khóa là 180 giây (180,000ms), gấp 6 lần thời gian quy định trong đặc tả (30 giây). |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 (FIT-HCMUS) |
| **6** | **Date** | `2026-10-19` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `High` |
| **10** | **Severity** | `Critical (Trọng số 5)` |

#### 4. Chi tiết các bước tái hiện và phân tích lỗi:
* **4.1 Các bước thực hiện:**
  1. Thực hiện nhập sai mật khẩu để tài khoản bị khóa tại thời điểm $t_0$.
  2. Ghi nhận giá trị cột `locked_until` trong CSDL SQLite.
  3. Đợi 35 giây (vượt quá ngưỡng 30 giây theo đặc tả).
  4. Nhập đúng mật khẩu `Test1234!` và bấm đăng nhập.
* **4.2 Kết quả kỳ vọng:** Sau 30 giây, tài khoản tự động mở khóa. Lần đăng nhập tại giây thứ 35 thành công, phản hồi HTTP 200 OK.
* **4.3 Kết quả thực tế:** Tại giây thứ 35, hệ thống vẫn từ chối với HTTP 403 Forbidden. Kiểm tra CSDL thấy `locked_until = now + 180000ms` (3 phút sau mới mở khóa).
* **4.4 Nguyên nhân kỹ thuật:** File [server.js:57](../backend/server.js#L57) cài đặt sai thời gian hết hạn:
  ```javascript
  lockedUntil = new Date(Date.now() + 180000).toISOString(); // SAI: 180000ms = 180s
  ```
* **4.5 Đề xuất khắc phục:** Sửa thành `lockedUntil = new Date(Date.now() + 30000).toISOString();` (30 giây).
* **4.6 Minh chứng kiểm thử:**
  * **Code Evidence (VS Code Card):** [BUG-FR02-02_Code.png](../screenshots/F02/BUG-FR02-02_Code.png)
  * **Thực tế Database (SQLite Timestamp):** [BUG-FR02-02_DB.png](../screenshots/F02/BUG-FR02-02_DB.png)

---

## 3. BUG REPORT 03: `BUG-FR02-03` (`BUG-15`)

### [BUG-FR02-03]: Vi phạm hàng loạt tiêu chuẩn giao diện di động FR-21 / FR-22 trên màn hình Đăng nhập Mobile App

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR02-03` (Toàn dự án: `BUG-15`) |
| **2** | **Function Name** | `FR-02 / FR-21 / FR-22: Mobile Login GUI Standards` |
| **3** | **Problem Summary** | Màn hình đăng nhập Mobile vi phạm nghiêm trọng các quy chuẩn giao diện: nhãn dùng từ "Username" thay vì "Email", thiếu dấu `*` trường bắt buộc, nút submit dùng tiếng Anh "Sign In", hộp thông báo lỗi đặt sai vị trí (nằm dưới nút submit), và nuốt mất thông báo chi tiết khi tài khoản bị khóa. |
| **4** | **How to Reproduce** | *(Xem chi tiết bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 (FIT-HCMUS) |
| **6** | **Date** | `2026-10-19` |
| **7** | **Assign To** | Mobile Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Medium` |
| **10** | **Severity** | `Serious (Trọng số 5)` |

#### 4. Chi tiết các bước tái hiện và phân tích lỗi:
* **4.1 Các bước thực hiện:** Mở Mobile App, chuyển sang tab Đăng nhập và quan sát giao diện. Thực hiện đăng nhập sai để kích hoạt thông báo lỗi.
* **4.2 Kết quả kỳ vọng:**
  * Toàn bộ dùng tiếng Việt (`FR-21`): Nhãn "Email *", nút "Đăng nhập".
  * Tất cả trường bắt buộc có dấu `*` (`FR-22`).
  * Thông báo lỗi hiển thị **phía trên nút submit** (`FR-22`).
  * Hiển thị đúng thông báo tài khoản bị khóa từ server.
* **4.3 Kết quả thực tế:**
  * Nhãn ô nhập là `"Username"` ([App.js:763](../frontend-mobile/App.js#L763)) và không có dấu `*`.
  * Nút bấm hiển thị tiếng Anh `"Sign In"` ([App.js:783](../frontend-mobile/App.js#L783)).
  * Thông báo lỗi đặt ở cuối trang, **dưới cả nút bấm và link đăng ký** ([App.js:790](../frontend-mobile/App.js#L790)).
  * Hàm `handleLogin` ([App.js:205](../frontend-mobile/App.js#L205)) hardcode lỗi trong khối `catch` thành `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`, nuốt mất message *"Tài khoản đã bị khóa"* từ backend.
* **4.4 Đề xuất khắc phục:** Cập nhật lại giao diện và hàm xử lý theo đúng đặc tả `FR-21` và `FR-22`.
* **4.5 Minh chứng kiểm thử:**
  * **Code Evidence (VS Code Card):** [BUG-FR02-03_Code.png](../screenshots/F02/BUG-FR02-03_Code.png)
  * **Thực tế Giao diện Mobile (UI Screenshot):** [BUG-FR02-03_UI.png](../screenshots/F02/BUG-FR02-03_UI.png)

---

## 4. BẢNG TỔNG HỢP MINH CHỨNG LỖI CHUẨN HÓA (DEFECT EVIDENCE MATRIX - FR-02)

| Mã Bug Phân hệ | Mã Bug Toàn dự án | Tóm tắt Khuyết tật | Ảnh Minh chứng Mã lỗi (Code Card) | Ảnh Minh chứng Thực tế (UI / CSDL) |
| :---: | :---: | :--- | :--- | :--- |
| **`BUG-FR02-01`** | **`BUG-13`** | Đăng nhập sai tăng bộ đếm `+2` thay vì `+1` (server.js:54) | [`screenshots/F02/BUG-FR02-01_Code.png`](../screenshots/F02/BUG-FR02-01_Code.png) | [`screenshots/F02/BUG-FR02-01_DB.png`](../screenshots/F02/BUG-FR02-01_DB.png) |
| **`BUG-FR02-02`** | **`BUG-14`** | Khóa tài khoản 180s (3 phút) thay vì 30s (server.js:57) | [`screenshots/F02/BUG-FR02-02_Code.png`](../screenshots/F02/BUG-FR02-02_Code.png) | [`screenshots/F02/BUG-FR02-02_DB.png`](../screenshots/F02/BUG-FR02-02_DB.png) |
| **`BUG-FR02-03`** | **`BUG-15`** | Vi phạm giao diện Mobile (Sign In, Username, vị trí lỗi) | [`screenshots/F02/BUG-FR02-03_Code.png`](../screenshots/F02/BUG-FR02-03_Code.png) | [`screenshots/F02/BUG-FR02-03_UI.png`](../screenshots/F02/BUG-FR02-03_UI.png) |

---

# BƯỚC 8: BÁO CÁO PHÂN TÍCH KHOẢNG CÁCH AI (AI GAP ANALYSIS) & ĐOẠN VĂN PHẢN BIỆN (AI CRITIQUE)

> 🧑‍💻 **Ghi chú đánh giá độc lập (Human Evaluation & Critical Analysis):**  
> Phần phân tích khoảng cách năng lực của AI (**AI Gap Analysis**) và đoạn văn phản biện (**AI Critique**) dưới đây do **Kiểm thử viên (Sinh viên) trực tiếp đánh giá và đúc kết độc lập** sau toàn bộ quá trình kiểm thử thực tế trên hệ thống SUT Live (Mobile App & Backend API). Nhằm đảm bảo tính khách quan và tư duy phản biện thực thụ theo yêu cầu học phần FIT-HCMUS, sinh viên không sử dụng prompt để AI tự nhận xét về chính nó, mà tự mình bóc tách các điểm mù về trạng thái/thời gian thực của AI và rút ra bài học thực tiễn.

---

## 1. Báo cáo Phân tích Khoảng cách AI (AI Gap Analysis do Sinh viên thực hiện)

### 1.1 Các điểm AI đã bỏ sót hoặc dự đoán sai so với thực tế trên SUT Live:

1. **Bỏ sót lỗi logic gia tăng bộ đếm (`BUG-FR02-01` — Bộ đếm nhảy `+2`):**
   * *Hành vi của AI:* Khi kiểm tra tính năng khóa tài khoản, AI chỉ quan sát trạng thái tĩnh (nhập sai 3 lần $\to$ bị khóa). AI mặc định suy luận rằng mỗi lần thất bại biến đếm sẽ tăng 1 đơn vị theo thông lệ (`attempts++`).
   * *Thực tế trên SUT:* Lập trình viên cố tình viết `user.login_attempts + 2`. Kết quả là tài khoản bị khóa oan ngay ở lần nhập sai thứ 2! AI không bao giờ phát hiện ra nếu không thực hiện kiểm thử biên từng bước một ($N=1, N=2$) kết hợp kiểm tra CSDL trực tiếp.
2. **Dự đoán sai về đơn vị thời gian hết hạn khóa (`BUG-FR02-02` — 180s vs 30s):**
   * *Hành vi của AI:* AI đọc đặc tả thấy ghi "khóa 30 giây" và dự đoán hệ thống sẽ mở khóa sau 30s. AI không có khái niệm về "thời gian trôi qua trong thế giới thực" nếu không có môi trường chạy thực nghiệm, do đó bỏ qua việc đối chiếu giá trị millisecond `180000` trong code tương đương 3 phút thay vì 30,000ms.
3. **Bỏ sót các lỗi thẩm mỹ và trải nghiệm giao diện di động (`BUG-FR02-03`):**
   * *Hành vi của AI:* AI sinh test case thường chỉ tập trung vào luồng dữ liệu (Data Flow) mà xem nhẹ các quy định về vị trí của component (như thông báo lỗi phải nằm trên nút bấm) hay sự nhất quán ngôn ngữ tiếng Việt (nút "Sign In").

---

### 1.2 Giải thích Nguyên nhân Cốt lõi (Root Cause Analysis):
* **Chất lượng câu prompt:** Prompt nếu chỉ yêu cầu "kiểm tra đăng nhập đúng/sai" sẽ khiến AI bỏ qua hoàn toàn chiều kích kiểm thử chuyển trạng thái (State Transition Testing) và kiểm thử độ trễ thời gian (Time-dependent Testing).
* **Giới hạn nội tại của AI:** AI là mô hình phi trạng thái (Stateless), không có đồng hồ thời gian thực và không thể "chờ 30 giây" để kiểm chứng hành vi mở khóa trừ khi được kiểm thử viên con người thực thi trực tiếp trên hệ thống.
* **Độ phức tạp của hệ thống SUT:** Sự kết hợp giữa biến đếm trong CSDL, dấu thời gian ISO timestamp và logic render giao diện di động tạo nên một bài toán kiểm thử đa chiều mà chỉ có sự phối hợp giữa phương pháp luận kiểm thử miền của con người và năng lực sinh test của AI mới giải quyết triệt để.

---

### 1.3 Bài học kinh nghiệm Đắt giá cho Kiểm thử viên:
* **Kiểm thử hệ thống có trạng thái (Stateful System) bắt buộc phải kiểm tra từng bước:** Không được nhảy cóc từ $N=0$ lên $N=3$. Phải xác minh trạng thái CSDL tại từng bước trung gian ($N=1$, $N=2$).
* **Luôn quy đổi đơn vị thời gian trong code ra đặc tả nghiệp vụ:** Khi kiểm thử các tính năng có timeout (OTP, token expiry, account lockout), phải đối chiếu trực tiếp giữa giá trị miligiây trong code và số giây/phút trong SRS.

---

## 2. Đoạn văn Phản biện (AI Critique do Sinh viên chấp bút): Vai Trò Con Người Trong Kiểm Thử Logic Trạng Thái & Thời Gian Thực

> **Đoạn văn phản biện (AI Critique):**
> 
> *"Kiểm thử tính năng Đăng nhập & Khóa tài khoản trên Mobile App (FR-02) đã làm bộc lộ rõ rệt giới hạn bản chất của trí tuệ nhân tạo đối với các bài toán kiểm thử phụ thuộc trạng thái (State-dependent) và thời gian thực (Time-dependent).
> 
> Trong khi AI dễ dàng thỏa mãn với kịch bản bề nổi—thấy tài khoản bị khóa sau khi đăng nhập sai thì vội vàng kết luận hệ thống hoạt động đúng—thì kiểm thử viên con người với phương pháp luận Phân tích Giá trị Biên (BVA) nghiêm ngặt của FIT-HCMUS đã tỉ mỉ kiểm tra từng nấc thang chuyển trạng thái ($N=1, N=2$). Chính sự cẩn trọng này đã vạch trần hai khuyết tật logic chí mạng: bộ đếm bị nhảy cóc `+2` khiến người dùng bị khóa oan uổng chỉ sau 2 lần sai, và thời gian khóa bị kéo dài tới 180 giây thay vì 30 giây theo đặc tả.
> 
> Trí tuệ nhân tạo không thể tự cảm nhận được thời gian trôi qua, không thể nhìn thấu sự bất hợp lý của một nút bấm 'Sign In' trên giao diện thuần Việt, và càng không thể thay thế óc quan sát sắc sảo của con người. Điều này tái khẳng định rằng: AI chỉ phát huy được giá trị khi được đặt dưới sự dẫn dắt chiến lược và tư duy kiểm định nghiêm cẩn của kiểm thử viên con người."*

---
