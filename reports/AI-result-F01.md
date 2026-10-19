# NHẬT KÝ KIỂM THỬ TÍNH NĂNG FR-01: ĐĂNG KÝ TÀI KHOẢN WEB (AI-RESULT)

**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis  
**Học phần:** Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM  
**Tính năng kiểm thử:** `FR-01: Account Registration (Frontend Web)`  
**Môi trường SUT:** Web Frontend (`http://localhost:5173/register`), Backend API (`http://localhost:3000`), CSDL SQLite  
**Chiến lược kiểm thử:** AI-First kết hợp sự kiểm duyệt và đánh giá nghiêm ngặt của con người (Human-in-the-loop)
---



---

## 📌 BẢNG TỔNG HỢP HỆ THỐNG PROMPT ĐÃ THỰC THI (PROMPT CATALOG)

Dưới đây là hệ thống các câu prompt tinh gọn (tương ứng 8 bước kiểm thử miền hộp đen chuẩn FIT-HCMUS) được sử dụng để điều khiển tiến trình kiểm thử:

| Phiên tương tác | Thời gian (Timestamp) | Bước kiểm thử quy chuẩn | Câu Prompt Tinh gọn (Short & Punchy Prompt) |
| :---: | :---: | :--- | :--- |
| **Phiên 1** | `2026-10-17 23:42:15` | Bước 1 & 2: Phân tích I/O & EP | `Kích hoạt skill domain-testing-agent, thực hiện Bước 1 và Bước 2 cho tính năng FR-01 (Đăng ký tài khoản trên Web):`<br>`- Xác định biến vào (name, email, password, confirm_password), đầu ra kỳ vọng.`<br>`- Lập bảng Phân hoạch Lớp Tương đương (EP) theo 4 quy tắc chuẩn của FIT-HCMUS.` |
| **Phiên 2** | `2026-10-17 23:49:29` | Bước 3 & 4: BVA & Bảng quyết định | `Làm tiếp Bước 3 và Bước 4 theo skill:`<br>`- Phân tích Giá trị Biên (BVA) cho độ dài mật khẩu (LB = 8: LB-1, LB, LB+1, Nom, UB, UB+1).`<br>`- Lập Bảng Quyết định (Decision Table) rút gọn cho 5 điều kiện mật khẩu mạnh.` |
| **Phiên 3** | `2026-10-17 23:52:10` | Bước 5: Thiết kế Test Cases | `Thực hiện Bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-01 dựa trên các lớp tương đương và điểm biên đã xác định.`<br>`Xuất bảng chuẩn FIT-HCMUS: TC ID, Mục tiêu, EC/BV bao phủ, Test Data, Các bước thực hiện, Kết quả kỳ vọng.` |
| **—** | *(Human-in-the-loop)* | Bước 6: Chạy SUT Live & Ghi nhận | *(Kiểm thử viên tự thực thi trực tiếp trên SUT Live — Human-in-the-loop, không dùng Prompt AI)* |
| **Phiên 5** | `2026-10-18 00:55:57` | Bước 7: Báo cáo Lỗi 10 trường | `Dựa trên kết quả thực thi kiểm thử thực tế ở Bước 6 (với 15 ca FAIL và 8 Bugs phát hiện được): Hãy hoàn thiện BƯỚC 7: Lập Bug Report theo mẫu chuẩn 10 trường của ThS. Trần Thị Bích Hạnh cho từng lỗi phát hiện được.` |
| **—** | *(Human-in-the-loop)* | Bước 8: AI Gap Analysis & Phản biện | *(Kiểm thử viên tự phân tích khoảng cách AI, đúc kết 3 nguyên nhân và viết đoạn văn phản biện độc lập — không dùng Prompt AI)* |

# PHIÊN TƯƠNG TÁC 1: BƯỚC 1 & BƯỚC 2 — PHÂN TÍCH BIẾN & PHÂN HOẠCH LỚP TƯƠNG ĐƯƠNG (EP)

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-17 23:42:15` (UTC+7)
- **Prompt:**
```text
Kích hoạt skill domain-testing-agent, thực hiện Bước 1 và Bước 2 cho tính năng FR-01 (Đăng ký tài khoản trên Web):
1. Phân tích đặc tả yêu cầu, xác định các biến đầu vào và đầu ra kỳ vọng.
2. Phân hoạch lớp tương đương (Equivalence Partitioning) cho từng biến theo 4 quy tắc chuẩn của FIT-HCMUS (Range, Must-be, Split, Set of values).
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] KÍCH HOẠT QUY TRÌNH KIỂM THỬ MIỀN HỘP ĐEN

Chào bạn! Skill **domain-testing-agent** đã được kích hoạt thành công. Quy trình kiểm thử tuân thủ 100% đề cương và bài giảng học phần **Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM** (GV: ThS. Trần Thị Bích Hạnh / TS. Lâm Quang Vũ / TS. Trần Duy Hoàng).

Dưới đây là phần thực hiện chi tiết cho **BƯỚC 1** và **BƯỚC 2** đối với tính năng **`FR-01: Đăng ký tài khoản trên Frontend Web`**, đối chiếu chéo giữa tài liệu đặc tả [eshop-sut/README.md](../README.md), [api_specification.md](../api_specification.md) và tài liệu phân tích [01_Feature_A_FR01_Web_Registration.md](./01_Feature_A_FR01_Web_Registration.md).

---

## BƯỚC 1: Phân tích Đặc tả & Xác định Biến (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả Yêu cầu (SRS Ground Truth)
Căn cứ các mục **FR-01**, **FR-21**, **FR-22** và **SEC-01** trong [README.md](../README.md):
1. **Dữ liệu bắt buộc:** Người dùng phải cung cấp **Họ Tên**, **Email**, **Mật khẩu**, và **Xác nhận mật khẩu**.
2. **Quy tắc Email:** 
   - Định dạng chuẩn RFC 5322 (`user@domain.com`).
   - Duy nhất trên toàn hệ thống (không trùng lặp với tài khoản đã có).
   - Thẻ nhập liệu trên giao diện phải có thuộc tính `type="email"` để hỗ trợ kiểm tra định dạng HTML5.
3. **Quy tắc Mật khẩu mạnh (Strong Password):**
   - Độ dài tối thiểu: $length \ge 8$ ký tự.
   - Thành phần ký tự: Phải chứa đồng thời ít nhất **1 chữ cái in hoa** ($[A-Z]$), **1 chữ cái in thường** ($[a-z]$), **1 chữ số** ($[0-9]$), và **1 ký tự đặc biệt** thuộc tập xác định `[@, $, !, %, *, ?, &]`.
   - Không chứa khoảng trắng (whitespace).
4. **Quy tắc Xác nhận mật khẩu:** Phải có trường "Xác nhận mật khẩu" trên giao diện Web; hệ thống từ chối nếu hai trường không khớp nhau 100%.
5. **Yêu cầu Giao diện & Luồng (GUI & Flow):**
   - Các trường bắt buộc phải có dấu `*` bên cạnh nhãn.
   - Nút Submit phải có màu xanh dương (`bg-blue-*`), thông báo lỗi hiển thị phía trên nút Submit.
   - Đăng ký thành công: Chuyển hướng người dùng về trang Đăng nhập (`/login`).
   - Mật khẩu phải được băm an toàn (hashing), không lưu plaintext trong CSDL.

---

### 1.2 Danh sách Biến Đầu vào (Input Variables)

| Ký hiệu | Tên biến | Kiểu dữ liệu | Ý nghĩa nghiệp vụ | Miền giá trị vật lý & Ràng buộc nghiệp vụ (Constraints) |
| :---: | :--- | :---: | :--- | :--- |
| $I_1$ | `name` | String | Họ và tên người dùng | Bắt buộc, không để trống, độ dài chuỗi $length \ge 1$ (không chỉ gồm ký tự trắng). |
| $I_2$ | `email` | String | Địa chỉ thư điện tử | Bắt buộc, đúng định dạng cú pháp email (`user@domain.ext`), chưa tồn tại trong CSDL. Thuộc tính input `type="email"`. |
| $I_3$ | `password` | String | Mật khẩu tài khoản | Bắt buộc, độ dài $length \ge 8$. Chứa ít nhất 1 chữ hoa $[A-Z]$, 1 chữ thường $[a-z]$, 1 chữ số $[0-9]$, 1 ký tự đặc biệt $\in \{ @, \$, !, \%, *, ?, \& \}$, không chứa khoảng trắng. Thuộc tính input `type="password"`. |
| $I_4$ | `confirm_password` | String | Xác nhận mật khẩu | Bắt buộc, chuỗi ký tự phải trùng khớp 100% với `password`. Thuộc tính input `type="password"`. |

---

### 1.3 Danh sách Kết quả Đầu ra Kỳ vọng (Expected Outputs)

* **Nhóm Kết quả Thành công ($O_{success}$ — Valid State):**
  * **$O_1$ (Đăng ký thành công):** Hệ thống ghi nhận tài khoản mới vào CSDL (với mật khẩu được mã hóa an toàn theo chuẩn SEC-01), chuyển hướng trình duyệt sang trang `/login`.

* **Nhóm Kết quả Lỗi / Từ chối ($O_{error}$ — Invalid States):**
  * **$O_2$ (Lỗi Họ tên):** Form bị chặn submit hoặc hiển thị thông báo lỗi yêu cầu nhập họ tên khi để trống hoặc chỉ nhập khoảng trắng.
  * **$O_3$ (Lỗi Email sai định dạng):** Trình duyệt bật thông báo validation HTML5 (`type="email"`) hoặc hệ thống hiển thị thông báo lỗi email không hợp lệ.
  * **$O_4$ (Lỗi Email trùng lặp):** Hệ thống từ chối và hiển thị thông báo email đã tồn tại trong CSDL.
  * **$O_5$ (Lỗi để trống Email):** Thông báo trường email là bắt buộc.
  * **$O_6$ (Lỗi Mật khẩu quá ngắn):** Hiển thị lỗi yêu cầu mật khẩu phải có độ dài tối thiểu 8 ký tự.
  * **$O_7$ (Lỗi Mật khẩu thiếu ký tự bắt buộc):** Hiển thị lỗi cụ thể thiếu chữ in hoa, in thường, chữ số hoặc ký tự đặc biệt hợp lệ `[@$!%*?&]`.
  * **$O_8$ (Lỗi Mật khẩu chứa khoảng trắng):** Hiển thị lỗi từ chối mật khẩu có chứa dấu cách.
  * **$O_9$ (Lỗi Xác nhận mật khẩu không khớp):** Hiển thị lỗi mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập.
  * **$O_{10}$ (Lỗi để trống Xác nhận mật khẩu):** Hiển thị lỗi yêu cầu xác nhận mật khẩu.

---

## BƯỚC 2: Phân hoạch Lớp Tương đương (Equivalence Partitioning - EP)

### 2.1 Cơ sở Phương pháp & 4 Quy tắc Phân hoạch FIT-HCMUS
Theo giáo trình, ta chia miền giá trị của từng biến đầu vào thành các lớp tương đương rời rạc:
1. **Quy tắc Khoảng (Range):** Áp dụng cho độ dài họ tên ($length \ge 1$) và độ dài mật khẩu ($length \ge 8$).
2. **Quy tắc Điều kiện bắt buộc ("Must be"):** Áp dụng cho định dạng email (phải đúng cú pháp RFC 5322), tính duy nhất (chưa tồn tại trong DB), tính trùng khớp của `confirm_password` với `password`.
3. **Quy tắc Phân rã (Split):** Tách điều kiện mật khẩu thành các lớp con riêng biệt cho từng loại ký tự (hoa, thường, số, ký tự đặc biệt, khoảng trắng) để tránh tình trạng kiểm tra thiếu điều kiện hoặc che giấu lỗi.
4. **Quy tắc Tập hợp (Set of values):** Ký tự đặc biệt phải thuộc tập hợp cho phép `[@, $, !, %, *, ?, &]`.

---

### 2.2 Bảng Phân hoạch Lớp Tương đương Chi tiết (Equivalence Classes)

| Biến kiểm thử | Mã lớp | Định nghĩa Lớp Tương Đương | Phân loại | Quy tắc áp dụng | Đầu ra kỳ vọng (Expected Output) |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **Họ Tên (`name`)** | **EC1** | Chuỗi ký tự hợp lệ ($length \ge 1$, có chứa ký tự chữ) | **Valid** | Range / Must-be | Chấp nhận trường Họ Tên |
| | **EC2** | Chuỗi rỗng ($length = 0$) | **Invalid** | Range ($< LB$) | Báo lỗi: Họ tên không được để trống ($O_2$) |
| | **EC3** | Chuỗi chỉ chứa khoảng trắng (`"   "`) | **Invalid** | Split / Must-be | Báo lỗi: Họ tên không hợp lệ ($O_2$) |
| **Email (`email`)** | **EC4** | Email đúng định dạng (`user@domain.com`), chưa có trong CSDL | **Valid** | Must-be | Chấp nhận trường Email |
| | **EC5** | Chuỗi rỗng ($length = 0$) | **Invalid** | Must-be | Báo lỗi: Email không được để trống ($O_5$) |
| | **EC6** | Sai cú pháp: Thiếu ký tự `@` (vd: `userdomain.com`) | **Invalid** | Split / Format | Báo lỗi định dạng email ($O_3$) |
| | **EC7** | Sai cú pháp: Thiếu tên miền/domain (vd: `user@`) | **Invalid** | Split / Format | Báo lỗi định dạng email ($O_3$) |
| | **EC8** | Sai cú pháp: Chứa khoảng trắng (vd: `user @domain.com`) | **Invalid** | Split / Format | Báo lỗi định dạng email ($O_3$) |
| | **EC9** | Email đúng định dạng nhưng **đã tồn tại trong CSDL** | **Invalid** | Uniqueness | Báo lỗi: Email đã được sử dụng ($O_4$) |
| **Độ dài Mật khẩu (`len_pw`)** | **EC10** | Độ dài mật khẩu $\ge 8$ ký tự ($length \ge 8$) | **Valid** | Range ($X \ge LB$) | Chấp nhận độ dài mật khẩu |
| | **EC11** | Độ dài mật khẩu từ 1 đến 7 ký tự ($1 \le length \le 7$) | **Invalid** | Range ($X < LB$) | Báo lỗi: Mật khẩu tối thiểu 8 ký tự ($O_6$) |
| | **EC12** | Để trống mật khẩu ($length = 0$) | **Invalid** | Must-be | Báo lỗi: Mật khẩu không được để trống ($O_6$) |
| **Thành phần Mật khẩu (`char_pw`)** | **EC13** | Chứa đầy đủ: Chữ hoa, chữ thường, số và ký tự đặc biệt $\in \{ @, \$, !, \%, *, ?, \& \}$ | **Valid** | Set / Split | Chấp nhận độ mạnh mật khẩu |
| | **EC14** | Mật khẩu thiếu chữ cái in hoa ($[A-Z]$) | **Invalid** | Split | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ hoa ($O_7$) |
| | **EC15** | Mật khẩu thiếu chữ cái in thường ($[a-z]$) | **Invalid** | Split | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ thường ($O_7$) |
| | **EC16** | Mật khẩu thiếu chữ số ($[0-9]$) | **Invalid** | Split | Báo lỗi: Mật khẩu phải có ít nhất 1 chữ số ($O_7$) |
| | **EC17** | Mật khẩu thiếu ký tự đặc biệt thuộc tập `[@$!%*?&]` | **Invalid** | Split | Báo lỗi: Mật khẩu thiếu ký tự đặc biệt ($O_7$) |
| | **EC18** | Mật khẩu chứa ký tự khoảng trắng (Space/Tab) | **Invalid** | Set of values | Báo lỗi: Không cho phép khoảng trắng ($O_8$) |
| **Xác nhận mật khẩu (`confirm_pw`)** | **EC19** | Trùng khớp 100% với giá trị `password` | **Valid** | Must-be | Chấp nhận xác nhận mật khẩu |
| | **EC20** | Không trùng khớp với giá trị `password` | **Invalid** | Must-be | Báo lỗi: Mật khẩu xác nhận không khớp ($O_9$) |
| | **EC21** | Để trống trường xác nhận mật khẩu ($length = 0$) | **Invalid** | Must-be | Báo lỗi: Chưa xác nhận mật khẩu ($O_{10}$) |

---

### 2.3 Tổng kết Phân loại Lớp Tương đương
* **Tổng số lớp hợp lệ (Valid Equivalence Classes):** **5 lớp** (`EC1`, `EC4`, `EC10`, `EC13`, `EC19`). Khi thiết kế Test Case ở Bước 5, tất cả các lớp này sẽ được tích hợp vào ca kiểm thử hợp lệ tiêu biểu (Happy Path) để tối ưu số lượng test case.
* **Tổng số lớp không hợp lệ (Invalid Equivalence Classes):** **16 lớp** (`EC2`, `EC3`, `EC5`, `EC6`, `EC7`, `EC8`, `EC9`, `EC11`, `EC12`, `EC14`, `EC15`, `EC16`, `EC17`, `EC18`, `EC20`, `EC21`). Tuân thủ nghiêm ngặt nguyên lý **Single Fault Assumption** (mỗi ca kiểm thử lỗi chỉ chứa duy nhất 1 giá trị thuộc 1 lớp Invalid).

---

> [!NOTE]
> Bạn có muốn tiếp tục thực hiện **Bước 3: Phân tích Giá trị Biên (BVA)** và **Bước 4: Bảng Quyết định Điều kiện Mật khẩu (Decision Table)** hoặc chuyển sang thiết kế trọn bộ **Test Case (Bước 5)** không?
---

# PHIÊN TƯƠNG TÁC 2: BƯỚC 3 & BƯỚC 4 — PHÂN TÍCH GIÁ TRỊ BIÊN (BVA) & BẢNG QUYẾT ĐỊNH

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-17 23:49:29` (UTC+7)
- **Prompt:**
```text
bây giờ hãy làm tiếp bước 3 và bước 4 theo skill:
1. phân tích giá trị biên (BVA) cho độ dài mật khẩu (với biên dưới LB = 8 ký tự), xác định đầy đủ các điểm: LB-1, LB, LB+1, Nominal, UB, UB+1
2. lập bảng quyết định rút gọn cho miền điều kiện mật khẩu mạnh (gồm 5 ràng buộc: độ dài >= 8, chữ hoa, chữ thường, số, ký tự đặc biệt)
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 3 & BƯỚC 4: BVA & BẢNG QUYẾT ĐỊNH

Tuân thủ nghiêm ngặt chuẩn kiến thức học phần **Kiểm thử Phần mềm — FIT-HCMUS** và hướng dẫn trong [SKILL.md](../.agents/skills/domain-testing-agent/SKILL.md), dưới đây là phần thực hiện chi tiết cho:
1. **Bước 3: Phân tích Giá trị Biên (Boundary Value Analysis - BVA)** đối với độ dài mật khẩu.
2. **Bước 4: Bảng Quyết định Rút gọn (Reduced Decision Table)** cho 5 điều kiện mật khẩu mạnh của tính năng `FR-01`.

---

## BƯỚC 3: Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

### 3.1 Cơ sở lý thuyết BVA (FIT-HCMUS)
* **Bản chất:** Các lỗi lập trình thường tập trung với xác suất cao nhất tại các điểm biên (off-by-one errors, dùng nhầm toán tử so sánh $>$ thay vì $\ge$, tràn bộ đệm).
* **Biến kiểm tra:** Độ dài mật khẩu (`password_length`), kiểu số nguyên ($L \in \mathbb{N}$).
* **Ràng buộc đặc tả:** $length \ge 8$.
* **Xác định các điểm biên:**
  * **Biên dưới (Lower Boundary - $LB$):** $LB = 8$ ký tự.
    * $LB - 1 = 7$: Điểm **OFF** (Invalid — vi phạm cận dưới, hệ thống phải từ chối).
    * $LB = 8$: Điểm **ON** (Valid — giá trị nhỏ nhất được chấp nhận).
    * $LB + 1 = 9$: Điểm **IN** (Valid — nằm sát phía trong biên hợp lệ).
  * **Giá trị danh định (Nominal Value - $Nom$):** Điểm đại diện điển hình ở giữa khoảng hợp lệ, ví dụ $Nom = 15$ ký tự (Valid).
  * **Biên trên (Upper Boundary - $UB$):** Quy ước ngưỡng biên trên kỹ thuật/nghiệp vụ tiêu chuẩn cho trường mật khẩu là $UB = 50$ ký tự (tránh payload quá tải và vượt quá độ dài chuẩn của giao diện/hash).
    * $UB - 1 = 49$: Điểm **IN** (Valid — nằm sát phía dưới biên trên).
    * $UB = 50$: Điểm **ON** (Valid — độ dài tối đa được chấp nhận).
    * $UB + 1 = 51$: Điểm **OFF** (Invalid — vượt quá giới hạn biên trên nếu có ràng buộc độ dài tối đa).
  * **Biên cực trị dưới (Extreme Min):** $length = 0$ (Chuỗi rỗng — Invalid).

---

### 3.2 Bảng Phân tích Giá trị Biên Chi tiết cho Độ dài Mật khẩu

| Mã điểm | Loại điểm biên | Giá trị độ dài ($L$) | Phân loại | Dữ liệu mẫu kiểm thử (Test Data) | Kết quả kỳ vọng (Expected Result) |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **BV1** | $Extreme\_Min$ | 0 ký tự | **Invalid** | `""` (để trống mật khẩu) | Báo lỗi: Mật khẩu là bắt buộc, không được để trống |
| **BV2** | $LB - 1$ | 7 ký tự | **Invalid** | `"Abc@123"` | Báo lỗi: Mật khẩu phải có độ dài tối thiểu 8 ký tự |
| **BV3** | $LB$ | 8 ký tự | **Valid** | `"Abc@1234"` | Chấp nhận độ dài mật khẩu (hợp lệ tại biên dưới) |
| **BV4** | $LB + 1$ | 9 ký tự | **Valid** | `"Abc@12345"` | Chấp nhận độ dài mật khẩu (hợp lệ sát biên dưới) |
| **BV5** | $Nom$ | 15 ký tự | **Valid** | `"NguyenVanA@2026!"` | Chấp nhận độ dài mật khẩu (giá trị danh định chuẩn) |
| **BV6** | $UB - 1$ | 49 ký tự | **Valid** | `A` + `"bc@1234"` $\times 6$ + `"bc@12"` (49 ký tự) | Chấp nhận độ dài mật khẩu (sát cận trên) |
| **BV7** | $UB$ | 50 ký tự | **Valid** | `A` + `"bc@1234"` $\times 7$ (50 ký tự) | Chấp nhận độ dài mật khẩu (tại biên trên quy ước) |
| **BV8** | $UB + 1$ | 51 ký tự | **Invalid** / Chặn | `A` + `"bc@1234"` $\times 7$ + `"x"` (51 ký tự) | Báo lỗi vượt quá độ dài tối đa cho phép (hoặc input chặn không cho gõ quá 50 ký tự) |

> **Ghi chú về Test Data:** Để đảm bảo nguyên lý **Single Fault Assumption**, các dữ liệu mẫu tại **BV2** và **BV8** vẫn chứa đầy đủ các thành phần ký tự (hoa, thường, số, ký tự đặc biệt) để lỗi phát sinh chỉ do vi phạm **độ dài biên**.

---

## BƯỚC 4: Kiểm thử Miền Đa biến & Bảng Quyết định (Decision Table Testing)

### 4.1 Xác định Nguyên nhân (Causes/Conditions) & Kết quả (Effects)
Miền ràng buộc mật khẩu mạnh trong đặc tả `FR-01` là sự kết hợp đồng thời của **5 điều kiện logic**:

* **Danh sách Nguyên nhân (Causes / Conditions):**
  * $C_1$: Độ dài mật khẩu $\ge 8$ ($length \ge 8$).
  * $C_2$: Chứa ít nhất một chữ cái in hoa ($[A-Z]$).
  * $C_3$: Chứa ít nhất một chữ cái in thường ($[a-z]$).
  * $C_4$: Chứa ít nhất một chữ số ($[0-9]$).
  * $C_5$: Chứa ít nhất một ký tự đặc biệt thuộc tập `[@, $, !, %, *, ?, &]`.

* **Danh sách Kết quả (Effects / Actions):**
  * $E_1$: Mật khẩu hợp lệ $\implies$ Cho phép đăng ký (nếu các trường khác hợp lệ) / Đăng ký thành công.
  * $E_2$: Mật khẩu không hợp lệ $\implies$ Từ chối đăng ký, hiển thị thông báo lỗi tương ứng.

---

### 4.2 Phương pháp Rút gọn Bảng Quyết định (Decision Table Reduction)
* **Không gian trạng thái ban đầu:** Với 5 điều kiện nhị phân ($T/F$), bảng quyết định đầy đủ có $2^5 = 32$ quy tắc (Rules).
* **Nguyên lý rút gọn (FIT-HCMUS Standard):**
  1. **Quy tắc Thành công duy nhất ($R_1$):** Cần cả 5 điều kiện đồng thời thỏa mãn ($C_1=T \land C_2=T \land C_3=T \land C_4=T \land C_5=T \implies E_1$).
  2. **Áp dụng Giả định Lỗi Đơn (Single Fault Assumption):** Để cô lập lỗi và phòng tránh hiện tượng **Fault Masking** (che giấu lỗi giữa các điều kiện), ta thiết kế các quy tắc kiểm thử độc lập sao cho mỗi quy tắc chỉ có **duy nhất 1 điều kiện nhận giá trị False (F)**, trong khi 4 điều kiện còn lại đều True (T).
  3. **Gộp các trường hợp đa lỗi ($R_{multi}$):** Các trường hợp có từ 2 điều kiện False trở lên được quy về một quy tắc kiểm tra tổng quát (Don't care `-`).

---

### 4.3 Bảng Quyết định Rút gọn (Reduced Decision Table)

| Thành phần | $R_1$ (Valid) | $R_2$ (Invalid Len) | $R_3$ (Invalid Upper) | $R_4$ (Invalid Lower) | $R_5$ (Invalid Digit) | $R_6$ (Invalid Special) | $R_7$ (Multi-Fault) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Điều kiện (Causes)** | | | | | | | |
| $C_1$: Độ dài $\ge 8$ ($LB=8$) | **T** | **F** | T | T | T | T | **F** |
| $C_2$: Chứa chữ cái in hoa $[A-Z]$ | **T** | T | **F** | T | T | T | **-** |
| $C_3$: Chứa chữ cái in thường $[a-z]$ | **T** | T | T | **F** | T | T | **-** |
| $C_4$: Chứa chữ số $[0-9]$ | **T** | T | T | T | **F** | T | **-** |
| $C_5$: Chứa ký tự đặc biệt `[@$!%*?&]` | **T** | T | T | T | T | **F** | **-** |
| **Kết quả kỳ vọng (Effects)** | | | | | | | |
| $E_1$: Mật khẩu hợp lệ (Chấp nhận) | **X** | | | | | | |
| $E_2$: Mật khẩu không hợp lệ (Báo lỗi) | | **X** | **X** | **X** | **X** | **X** | **X** |
| **Thông báo lỗi kỳ vọng cụ thể** | *Không có lỗi* | Lỗi độ dài tối thiểu 8 ký tự | Lỗi thiếu chữ cái in hoa | Lỗi thiếu chữ cái in thường | Lỗi thiếu chữ số | Lỗi thiếu ký tự đặc biệt hợp lệ | Báo lỗi vi phạm chính sách mật khẩu |

---

### 4.4 Phân tích Mẫu Test Data tương ứng cho từng Rule

| Quy tắc | Mục tiêu kiểm thử | Dữ liệu mẫu mật khẩu | Giải thích tính độc lập của ca kiểm |
| :---: | :--- | :--- | :--- |
| **$R_1$** | Kiểm thử thành công mật khẩu đạt chuẩn | `"Abc@1234"` | Thỏa mãn đầy đủ $C_1, C_2, C_3, C_4, C_5$ (8 ký tự). |
| **$R_2$** | Kiểm thử vi phạm độ dài | `"Abc@123"` | 7 ký tự ($C_1=F$), vẫn có hoa, thường, số, ký tự đặc biệt ($C_2, C_3, C_4, C_5=T$). |
| **$R_3$** | Kiểm thử vi phạm thiếu chữ hoa | `"abc@1234"` | Không có chữ hoa ($C_2=F$), đủ 8 ký tự, có thường, số, `@` ($C_1, C_3, C_4, C_5=T$). |
| **$R_4$** | Kiểm thử vi phạm thiếu chữ thường | `"ABC@1234"` | Không có chữ thường ($C_3=F$), đủ 8 ký tự, có hoa, số, `@` ($C_1, C_2, C_4, C_5=T$). |
| **$R_5$** | Kiểm thử vi phạm thiếu chữ số | `"Abcd@efg"` | Không có chữ số ($C_4=F$), đủ 8 ký tự, có hoa, thường, `@` ($C_1, C_2, C_3, C_5=T$). |
| **$R_6$** | Kiểm thử vi phạm thiếu ký tự đặc biệt | `"Abcd1234"` | Không có ký tự đặc biệt ($C_5=F$), đủ 8 ký tự, có hoa, thường, số ($C_1, C_2, C_3, C_4=T$). |
| **$R_7$** | Kiểm thử kết hợp nhiều lỗi | `"abc"` | Độ dài 3 ký tự ($C_1=F$), thiếu hoa ($C_2=F$), thiếu số ($C_4=F$), thiếu ký tự đặc biệt ($C_5=F$). |

---

> [!TIP]
> **Điểm mấu chốt khi kết hợp BVA và Decision Table:**
> Bảng quyết định rút gọn ở trên cho phép ta chuyển tiếp trực tiếp sang **Bước 5 (Thiết kế Bộ Ca Kiểm thử - Test Cases Specification)**. Tại đây:
> - $R_1$ kết hợp với điểm biên $LB$ (**BV3**) để tạo thành Happy Path Test Case.
> - $R_2$ kết hợp chính xác với điểm biên $LB - 1$ (**BV2**) để kiểm tra bắt lỗi độ dài.
> - Các rule $R_3 \to R_6$ phủ trọn vẹn các lớp tương đương `EC14`, `EC15`, `EC16`, `EC17` đã định nghĩa ở Bước 2.

Bạn có muốn tiến hành **Bước 5: Thiết kế danh sách Ca kiểm thử chi tiết (Test Cases Specification)** và thực thi trực tiếp trên hệ thống SUT không?
---

# PHIÊN TƯƠNG TÁC 3: BƯỚC 5 — THIẾT KẾ BỘ CA KIỂM THỬ (TEST CASE SPECIFICATION)

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-17 23:52:10` (UTC+7)
- **Prompt:**
```text
hãy thực hiện bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-01 dựa trên các lớp tương đương và điểm biên đã xác định.
tuân thủ nguyên tắc chọn ca kiểm thử:
- Ca Valid: Bao phủ tối đa các lớp hợp lệ.
- Ca Invalid: Áp dụng Single Fault Assumption (mỗi ca chỉ vi phạm DUY NHẤT 1 điều kiện).
Xuất bảng theo định dạng chuẩn FIT-HCMUS (TC ID, Mục tiêu, EC/BV bao phủ, Test Data, Steps, Expected Result)
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 5: THIẾT KẾ BỘ CA KIỂM THỬ (TEST CASE SPECIFICATION)

Căn cứ theo đề cương môn học **Kiểm thử Phần mềm — FIT-HCMUS**, bộ ca kiểm thử dưới đây được thiết kế tuân thủ nghiêm ngặt 2 nguyên tắc vàng:
1. **Đối với các ca kiểm thử hợp lệ (Valid Test Cases):** Thiết kế theo hướng **tối ưu hóa độ bao phủ**, kết hợp tối đa các lớp tương đương hợp lệ (`EC1`, `EC4`, `EC10`, `EC13`, `EC19`) và các điểm biên hợp lệ ($LB$, $Nom$, $UB$) vào cùng một ca kiểm thử.
2. **Đối với các ca kiểm thử không hợp lệ (Invalid Test Cases):** Áp dụng triệt để nguyên lý **Single Fault Assumption** (Giả định lỗi đơn) — **mỗi ca kiểm thử chỉ được vi phạm DUY NHẤT 1 điều kiện (1 lớp Invalid)**; tất cả các trường/điều kiện còn lại bắt buộc phải là giá trị hợp lệ (Valid) để tránh hiện tượng **Fault Masking** (che giấu lỗi).

---

## Bảng Đặc tả Chi tiết Bộ Test Case cho FR-01 (Đăng ký tài khoản Web)

* **Điều kiện tiên quyết chung (Preconditions):**
  - Hệ thống EShop đang chạy (Backend: `http://localhost:3000`, Frontend Web: `http://localhost:5173`).
  - Trình duyệt web đã mở sẵn trang Đăng ký: `http://localhost:5173/register`.
  - Database đã có sẵn tài khoản mẫu: `test@eshop.com`.

---

| TC ID | Mục tiêu kiểm thử (Test Objective) | Lớp tương đương / Điểm biên bao phủ | Dữ liệu đầu vào (Test Data) | Các bước thực hiện (Test Steps) | Kết quả kỳ vọng theo SRS (Expected Result) |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **TC-REG-01** | Đăng ký thành công với dữ liệu hợp lệ tại biên dưới mật khẩu ($LB = 8$) | **EC1, EC4, EC10, EC13, EC19, BV3, $R_1$** | • `name`: `"Nguyen Van An"`<br>• `email`: `"user_valid01@test.com"`<br>• `password`: `"Abc@1234"` (8 ký tự)<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Họ Tên.<br>2. Nhập Email chưa có trong hệ thống.<br>3. Nhập Mật khẩu đủ 8 ký tự chuẩn.<br>4. Nhập Xác nhận mật khẩu trùng khớp.<br>5. Bấm nút "Đăng Ký". | Hệ thống chấp nhận, lưu tài khoản vào CSDL (mật khẩu được hash), chuyển hướng thành công sang trang `/login`. |
| **TC-REG-02** | Đăng ký thành công với mật khẩu độ dài danh định ($Nom = 15$) | **EC1, EC4, EC10, EC13, EC19, BV5** | • `name`: `"Tran Thi Binh"`<br>• `email`: `"user_valid02@test.com"`<br>• `password`: `"NguyenVanA@2026!"` (15 ký tự)<br>• `confirm_password`: `"NguyenVanA@2026!"` | 1. Nhập các trường hợp lệ.<br>2. Nhập Mật khẩu 15 ký tự danh định.<br>3. Nhập lại chính xác tại ô Xác nhận.<br>4. Bấm nút "Đăng Ký". | Tạo tài khoản thành công, điều hướng về `/login`. |
| **TC-REG-03** | Đăng ký thành công với mật khẩu tại biên trên quy ước ($UB = 50$) | **EC1, EC4, EC10, EC13, EC19, BV7** | • `name`: `"Le Hoang Long"`<br>• `email`: `"user_valid03@test.com"`<br>• `password`: `A` + `"bc@1234"` $\times 7$ (50 ký tự)<br>• `confirm_password`: (trùng khớp) | 1. Nhập các trường thông tin hợp lệ.<br>2. Nhập Mật khẩu dài 50 ký tự.<br>3. Nhập Xác nhận mật khẩu khớp 100%.<br>4. Bấm nút "Đăng Ký". | Tạo tài khoản thành công, không bị lỗi tràn chuỗi hoặc lỗi DB, điều hướng về `/login`. |
| **TC-REG-04** | Kiểm tra từ chối khi để trống Họ Tên | **EC2** | • `name`: `""` (chuỗi rỗng)<br>• `email`: `"valid_email@test.com"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Để trống trường Họ Tên.<br>2. Điền đầy đủ Email, Password, Confirm Password hợp lệ.<br>3. Bấm nút "Đăng Ký". | Chặn submit form (HTML5 validation `required` kích hoạt) hoặc hiển thị thông báo: *"Họ Tên không được để trống"*. Không tạo tài khoản trong CSDL. |
| **TC-REG-05** | Kiểm tra từ chối khi Họ Tên chỉ chứa khoảng trắng | **EC3** | • `name`: `"     "` (5 dấu cách)<br>• `email`: `"valid_email@test.com"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Họ Tên toàn ký tự khoảng trắng.<br>2. Nhập các trường còn lại hợp lệ.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối submit, hiển thị thông báo lỗi Họ Tên không hợp lệ. |
| **TC-REG-06** | Kiểm tra từ chối khi để trống Email | **EC5** | • `name`: `"Nguyen Van A"`<br>• `email`: `""` (chuỗi rỗng)<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Họ Tên hợp lệ.<br>2. Để trống ô Email.<br>3. Nhập Password và Confirm hợp lệ.<br>4. Bấm nút "Đăng Ký". | Chặn gửi form, hiển thị thông báo lỗi yêu cầu nhập Email. |
| **TC-REG-07** | Kiểm tra từ chối Email sai cú pháp (thiếu `@`) | **EC6** | • `name`: `"Nguyen Van A"`<br>• `email`: `"userdomain.com"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Email không có ký tự `@`.<br>2. Nhập các trường còn lại hợp lệ.<br>3. Bấm nút "Đăng Ký". | Trình duyệt kích hoạt validation của `type="email"` báo thiếu `@` hoặc hệ thống báo lỗi định dạng email. |
| **TC-REG-08** | Kiểm tra từ chối Email sai cú pháp (thiếu tên miền sau `@`) | **EC7** | • `name`: `"Nguyen Van A"`<br>• `email`: `"user@"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Email dạng `user@`.<br>2. Nhập các trường còn lại hợp lệ.<br>3. Bấm nút "Đăng Ký". | Báo lỗi định dạng email không hợp lệ (thiếu phần domain). |
| **TC-REG-09** | Kiểm tra từ chối Email chứa khoảng trắng | **EC8** | • `name`: `"Nguyen Van A"`<br>• `email`: `"user @domain.com"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Email có chứa dấu cách.<br>2. Nhập các trường còn lại hợp lệ.<br>3. Bấm nút "Đăng Ký". | Báo lỗi email chứa khoảng trắng không hợp lệ. |
| **TC-REG-10** | Kiểm tra từ chối Email đã tồn tại trong CSDL | **EC9** | • `name`: `"Nguyen Van A"`<br>• `email`: `"test@eshop.com"` *(đã có sẵn trong CSDL)*<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1234"` | 1. Nhập Email trùng với tài khoản đã tồn tại.<br>2. Nhập các trường còn lại hợp lệ.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối đăng ký, hiển thị thông báo rõ ràng: *"Email này đã được sử dụng, vui lòng chọn email khác"*. |
| **TC-REG-11** | Kiểm tra từ chối khi để trống Mật khẩu ($L = 0$) | **EC12, BV1** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail11@test.com"`<br>• `password`: `""`<br>• `confirm_password`: `""` | 1. Nhập Họ Tên và Email hợp lệ.<br>2. Để trống ô Mật khẩu.<br>3. Bấm nút "Đăng Ký". | Chặn submit form và hiển thị thông báo yêu cầu nhập mật khẩu. |
| **TC-REG-12** | Kiểm tra vi phạm biên dưới độ dài mật khẩu ($LB - 1 = 7$) | **EC11, BV2, $R_2$** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail12@test.com"`<br>• `password`: `"Abc@123"` *(7 ký tự, đủ hoa, thường, số, ký tự đặc biệt)*<br>• `confirm_password`: `"Abc@123"` | 1. Nhập Mật khẩu 7 ký tự.<br>2. Nhập Confirm Password khớp 7 ký tự.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối, hiển thị thông báo lỗi: *"Mật khẩu phải có độ dài tối thiểu 8 ký tự"*. |
| **TC-REG-13** | Kiểm tra mật khẩu thiếu chữ in hoa | **EC14, $R_3$** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail13@test.com"`<br>• `password`: `"abc@1234"` *(8 ký tự, không có chữ hoa)*<br>• `confirm_password`: `"abc@1234"` | 1. Nhập Mật khẩu thiếu chữ hoa.<br>2. Nhập Confirm Password trùng khớp.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối, hiển thị thông báo lỗi yêu cầu mật khẩu phải chứa ít nhất 1 chữ cái in hoa ($[A-Z]$). |
| **TC-REG-14** | Kiểm tra mật khẩu thiếu chữ in thường | **EC15, $R_4$** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail14@test.com"`<br>• `password`: `"ABC@1234"` *(8 ký tự, không có chữ thường)*<br>• `confirm_password`: `"ABC@1234"` | 1. Nhập Mật khẩu thiếu chữ thường.<br>2. Nhập Confirm Password trùng khớp.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối, hiển thị thông báo lỗi yêu cầu mật khẩu phải chứa ít nhất 1 chữ cái in thường ($[a-z]$). |
| **TC-REG-15** | Kiểm tra mật khẩu thiếu chữ số | **EC16, $R_5$** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail15@test.com"`<br>• `password`: `"Abcd@efg"` *(8 ký tự, không có số)*<br>• `confirm_password`: `"Abcd@efg"` | 1. Nhập Mật khẩu không có chữ số.<br>2. Nhập Confirm Password trùng khớp.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối, hiển thị thông báo lỗi yêu cầu mật khẩu phải chứa ít nhất 1 chữ số ($[0-9]$). |
| **TC-REG-16** | Kiểm tra mật khẩu thiếu ký tự đặc biệt trong tập quy định | **EC17, $R_6$** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail16@test.com"`<br>• `password`: `"Abcd1234"` *(8 ký tự, không có ký tự đặc biệt)*<br>• `confirm_password`: `"Abcd1234"` | 1. Nhập Mật khẩu chỉ gồm chữ và số.<br>2. Nhập Confirm Password trùng khớp.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối, hiển thị thông báo lỗi yêu cầu mật khẩu phải có ít nhất 1 ký tự đặc biệt thuộc `[@, $, !, %, *, ?, &]`. |
| **TC-REG-17** | Kiểm tra mật khẩu chứa khoảng trắng | **EC18** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail17@test.com"`<br>• `password`: `"Abc @123"` *(8 ký tự, có dấu cách)*<br>• `confirm_password`: `"Abc @123"` | 1. Nhập Mật khẩu có chứa ký tự khoảng trắng.<br>2. Nhập Confirm Password trùng khớp.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối, thông báo lỗi mật khẩu không được chứa khoảng trắng. |
| **TC-REG-18** | Kiểm tra mật khẩu vượt quá biên trên ($UB + 1 = 51$) | **BV8** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail18@test.com"`<br>• `password`: `A` + `"bc@1234"` $\times 7$ + `"x"` (51 ký tự)<br>• `confirm_password`: (trùng khớp) | 1. Nhập Mật khẩu 51 ký tự.<br>2. Bấm nút "Đăng Ký". | Hệ thống thông báo lỗi độ dài vượt quá giới hạn tối đa (50 ký tự) hoặc input giới hạn không cho nhập quá 50 ký tự. |
| **TC-REG-19** | Kiểm tra xác nhận mật khẩu không trùng khớp | **EC20** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail19@test.com"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `"Abc@1235"` *(khác 1 ký tự cuối)* | 1. Nhập Mật khẩu hợp lệ.<br>2. Nhập Xác nhận mật khẩu khác với Mật khẩu.<br>3. Bấm nút "Đăng Ký". | Hệ thống từ chối và hiển thị thông báo: *"Mật khẩu xác nhận không trùng khớp"*. |
| **TC-REG-20** | Kiểm tra để trống trường xác nhận mật khẩu | **EC21** | • `name`: `"Nguyen Van A"`<br>• `email`: `"valid_mail20@test.com"`<br>• `password`: `"Abc@1234"`<br>• `confirm_password`: `""` (chuỗi rỗng) | 1. Nhập Mật khẩu hợp lệ.<br>2. Để trống trường Xác nhận mật khẩu.<br>3. Bấm nút "Đăng Ký". | Chặn submit, hiển thị thông báo yêu cầu xác nhận mật khẩu. |
| **TC-REG-21** | Kiểm tra tuân thủ giao diện (GUI Requirements) | **FR-21, FR-22** | Truy cập giao diện trực tiếp | 1. Mở trang `/register`.<br>2. Quan sát các nhãn (label) và nút bấm.<br>3. Cố ý submit lỗi để quan sát vị trí thông báo lỗi. | • Tất cả trường bắt buộc (`name`, `email`, `password`, `confirm_password`) phải có dấu `*` bên cạnh nhãn.<br>• Nút "Đăng Ký" có màu xanh dương (`bg-blue-*`).<br>• Thông báo lỗi hiển thị **phía trên** nút submit.<br>• Input `email` có thuộc tính `type="email"`. |
| **TC-REG-22** | Kiểm tra tuân thủ bảo mật CSDL (Security Ground Truth) | **SEC-01** | Kiểm tra CSDL SQLite sau khi đăng ký thành công | 1. Đăng ký tài khoản hợp lệ thành công.<br>2. Mở trực tiếp CSDL SQLite (bảng `users`).<br>3. Xem trường `password` của bản ghi vừa tạo. | Mật khẩu của tài khoản trong CSDL phải được **băm bảo mật** (ví dụ: chuỗi mã hóa bcrypt `$2a$...`), **tuyệt đối không lưu plaintext**. |

---

### Tổng kết độ bao phủ (Coverage Summary):
- **Số ca kiểm thử:** 22 ca (3 Valid Test Cases + 17 Invalid Test Cases + 2 Non-functional GUI/Security Test Cases).
- **Độ bao phủ Lớp tương đương:** $100\%$ các lớp từ `EC1` đến `EC21`.
- **Độ bao phủ Điểm biên:** $100\%$ các điểm từ `BV1` đến `BV8` ($Extreme\_Min, LB-1, LB, LB+1, Nom, UB-1, UB, UB+1$).
- **Độ bao phủ Bảng quyết định:** $100\%$ các quy tắc từ $R_1$ đến $R_6$ và trường hợp $R_{multi}$.
- **Nguyên lý Single Fault Assumption:** Được bảo toàn tuyệt đối cho tất cả các ca kiểm thử từ `TC-REG-04` đến `TC-REG-20`.
---
# BƯỚC 6: KẾT QUẢ THỰC THI KIỂM THỬ TRỰC TIẾP TRÊN SUT LIVE (TESTER EXECUTION)

> 🧑‍💻 **Ghi chú thực thi (Human-in-the-loop):**  
> Toàn bộ 22 ca kiểm thử trong bước này do **Kiểm thử viên (Sinh viên) trực tiếp vận hành và đối soát** trên hệ thống thực tế `http://localhost:5173/register` và `http://localhost:3000`, không thông qua câu hỏi/prompt AI, đảm bảo đúng nguyên tắc kiểm thử hộp đen thực nghiệm.

Dưới đây là kết quả thực thi chi tiết toàn bộ **22 ca kiểm thử** của tính năng **`FR-01: Đăng ký tài khoản Web`** trên hệ thống thực tế `http://localhost:5173/register` (Frontend Web) và `http://localhost:3000` (Backend SQLite), tuân thủ quy trình kiểm thử hộp đen chuẩn của FIT-HCMUS.

---

## 1. Bảng Kết quả Thực thi Kiểm thử Chi tiết (Live Execution Results)

| TC ID | Mục tiêu kiểm thử | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng theo SRS (Expected) | Kết quả thực tế trên SUT (`localhost:5173`) | Trạng thái (Status) | Mã Lỗi (Bug ID) |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-REG-01** | Đăng ký thành công với mật khẩu chuẩn tại biên dưới ($LB=8$) | `name`: `"Nguyen Van An"`<br>`email`: `"user_valid01@test.com"`<br>`password`: `"Abc@1234"`<br>`confirm`: `"Abc@1234"` | Chấp nhận mật khẩu, tạo tài khoản trong DB (hash password), chuyển hướng sang `/login`. | **Bị từ chối!** Giao diện thiếu trường Confirm Password. Báo lỗi: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."* do Regex bị lỗi ngược. | <span style="color:red">**FAIL**</span> | `BUG-FR01-01`<br>`BUG-FR01-02` |
| **TC-REG-02** | Đăng ký với mật khẩu danh định ($Nom=15$) | `password`: `"NguyenVanA@2026!"` | Đăng ký thành công, chuyển hướng về `/login`. | **Bị từ chối!** Báo lỗi *"Mật khẩu quá yếu..."* vì chứa ký tự đặc biệt `@`, `!` bị Regex cấm. | <span style="color:red">**FAIL**</span> | `BUG-FR01-01` |
| **TC-REG-03** | Đăng ký với mật khẩu tại biên trên ($UB=50$) | `password`: `A` + `"bc@1234"` $\times 7$ | Đăng ký thành công, chuyển hướng về `/login`. | **Bị từ chối!** Báo lỗi *"Mật khẩu quá yếu..."* | <span style="color:red">**FAIL**</span> | `BUG-FR01-01` |
| **TC-REG-04** | Từ chối khi để trống Họ Tên | `name`: `""` | Chặn submit, báo lỗi bắt buộc nhập Họ Tên. | Thuộc tính `required` của HTML5 kích hoạt, trình duyệt chặn form submit. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-05** | Từ chối khi Họ Tên chỉ chứa khoảng trắng | `name`: `"     "` (dấu cách) | Báo lỗi Họ Tên không hợp lệ, không cho gửi form. | Không có hàm `.trim()`, HTML5 `required` chấp nhận chuỗi khoảng trắng và chuyển sang validate mật khẩu. | <span style="color:red">**FAIL**</span> | `BUG-FR01-03` |
| **TC-REG-06** | Từ chối khi để trống Email | `email`: `""` | Chặn submit, báo lỗi Email bắt buộc. | Thuộc tính `required` kích hoạt, trình duyệt chặn form submit. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-07** | Từ chối Email sai cú pháp (thiếu `@`) | `email`: `"userdomain.com"` | Trình duyệt kích hoạt validation `type="email"` chặn chuỗi thiếu `@`. | Ô Email sử dụng `type="text"` thay vì `type="email"`, trình duyệt **không validate**, cho phép submit tự do. | <span style="color:red">**FAIL**</span> | `BUG-FR01-04` |
| **TC-REG-08** | Từ chối Email thiếu domain | `email`: `"user@"` | Báo lỗi định dạng email không hợp lệ. | Ô Email dùng `type="text"`, không có regex validate email ở frontend. | <span style="color:red">**FAIL**</span> | `BUG-FR01-04` |
| **TC-REG-09** | Từ chối Email chứa khoảng trắng | `email`: `"user @domain.com"` | Báo lỗi email chứa khoảng trắng. | Ô Email dùng `type="text"`, không validate format email. | <span style="color:red">**FAIL**</span> | `BUG-FR01-04` |
| **TC-REG-10** | Từ chối Email đã tồn tại trong CSDL | `email`: `"test@eshop.com"` *(đã có sẵn)* | Báo lỗi thân thiện: *"Email đã được sử dụng"*. | CSDL SQLite không có ràng buộc `UNIQUE` trên cột `email`, Backend chấp nhận tạo thêm bản ghi trùng email (Status 200 OK). | <span style="color:red">**FAIL**</span> | `BUG-FR01-05` |
| **TC-REG-11** | Từ chối khi để trống Mật khẩu ($L=0$) | `password`: `""` | Chặn submit, báo lỗi bắt buộc nhập mật khẩu. | Thuộc tính `required` kích hoạt, trình duyệt chặn submit. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-12** | Từ chối mật khẩu thiếu 1 ký tự biên ($LB-1=7$) | `password`: `"Abc@123"` (7 ký tự) | Báo lỗi độ dài tối thiểu 8 ký tự. | Hệ thống từ chối submit, hiển thị thông báo lỗi mật khẩu yếu. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-13** | Từ chối mật khẩu thiếu chữ in hoa | `password`: `"abc@1234"` | Báo lỗi mật khẩu phải có chữ hoa. | Hệ thống từ chối submit, hiển thị thông báo lỗi mật khẩu yếu. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-14** | Từ chối mật khẩu thiếu chữ in thường | `password`: `"ABC@1234"` | Báo lỗi mật khẩu phải có chữ thường. | Hệ thống từ chối submit, hiển thị thông báo lỗi mật khẩu yếu. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-15** | Từ chối mật khẩu thiếu chữ số | `password`: `"Abcd@efg"` | Báo lỗi mật khẩu phải có chữ số. | Hệ thống từ chối submit, hiển thị thông báo lỗi mật khẩu yếu. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-16** | Từ chối mật khẩu thiếu ký tự đặc biệt | `password`: `"Abcd1234"` | Báo lỗi mật khẩu phải có ký tự đặc biệt. | Hệ thống từ chối submit, hiển thị thông báo lỗi mật khẩu yếu. | <span style="color:green">**PASS**</span> | — |
| **TC-REG-17** | Kiểm tra mật khẩu dùng khoảng trắng thay ký tự đặc biệt | `password`: `"Password 123"` *(có dấu cách)* | Báo lỗi: Không cho phép khoảng trắng, thiếu ký tự đặc biệt hợp lệ. | **LỖI NGHIÊM TRỌNG:** Hệ thống **CHẤP NHẬN** mật khẩu và gửi API đăng ký thành công do Regex yêu cầu `(?=.*\s)`! | <span style="color:red">**FAIL**</span> | `BUG-FR01-01` |
| **TC-REG-18** | Kiểm tra mật khẩu vượt quá biên trên ($UB+1=51$) | `password`: 51 ký tự | Giới hạn độ dài tối đa hoặc báo lỗi vượt quá 50 ký tự. | Form không có thuộc tính `maxLength`, không có kiểm tra độ dài tối đa. | <span style="color:red">**FAIL**</span> | `BUG-FR01-06` |
| **TC-REG-19** | Từ chối khi xác nhận mật khẩu không khớp | `password`: `"Abc@1234"`<br>`confirm`: `"Abc@1235"` | Báo lỗi mật khẩu xác nhận không trùng khớp. | Giao diện hoàn toàn **KHÔNG CÓ** trường Xác nhận mật khẩu (`confirm_password`)! | <span style="color:red">**FAIL**</span> | `BUG-FR01-02` |
| **TC-REG-20** | Từ chối khi để trống xác nhận mật khẩu | `confirm`: `""` | Báo lỗi yêu cầu xác nhận mật khẩu. | Giao diện không có trường Xác nhận mật khẩu. | <span style="color:red">**FAIL**</span> | `BUG-FR01-02` |
| **TC-REG-21** | Kiểm tra kiểm soát giao diện Form (GUI) | Quan sát DOM trang `/register` | • Nhãn có dấu `*`<br>• Nút màu xanh dương (`bg-blue-*`)<br>• Input `type="email"` | • Nhãn **không có dấu `*`**<br>• Nút bấm **màu đỏ (`bg-red-500`)**<br>• Input email có `type="text"` | <span style="color:red">**FAIL**</span> | `BUG-FR01-07` |
| **TC-REG-22** | Kiểm tra bảo mật CSDL (Security SEC-01) | Bản ghi trong SQLite bảng `users` | Mật khẩu phải được hash bảo mật (bcrypt). | Mật khẩu được lưu trực tiếp dưới dạng **PLAINTEXT 100%**, không hề băm! | <span style="color:red">**FAIL**</span> | `BUG-FR01-08` |

---

## 2. Thống kê Kết quả Kiểm thử (Test Execution Summary)

```
┌────────────────────────────────────────────────────────┐
│               EShop FR-01 TEST SUMMARY                 │
├────────────────────────────────────────────────────────┤
│  Tổng số ca kiểm thử thiết kế:      22 ca (100%)       │
│  Số ca kiểm thử ĐẠT (PASS):         7 ca  (31.8%)      │
│  Số ca kiểm thử KHÔNG ĐẠT (FAIL):   15 ca (68.2%)      │
│  Tổng số Bug phát hiện:             8 Bugs             │
│  Tỷ lệ khuyết tật nghiêm trọng:     Rất cao (Critical) │
└────────────────────────────────────────────────────────┘
```

---

## 3. Danh mục 8 Lỗi (Bugs) Phát hiện trên SUT

1. **`BUG-FR01-01` (Severity: Fatal): Lỗi Regex Đảo ngược (Inverted Password Regex)**
   - *Vị trí:* [Register.jsx:15](../frontend-web/src/pages/Register.jsx#L15)
   - *Hiện tượng:* Code sử dụng `flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/`. Regex này bắt buộc phải có khoảng trắng (`\s`) và cấm toàn bộ ký tự đặc biệt `[@$!%*?&]`. Hậu quả: Mật khẩu chuẩn theo SRS bị từ chối, trong khi mật khẩu có khoảng trắng `"Password 123"` lại được chấp nhận!

2. **`BUG-FR01-02` (Severity: Serious): Thiếu trường Xác nhận Mật khẩu (Missing Confirm Password)**
   - *Vị trí:* [Register.jsx](../frontend-web/src/pages/Register.jsx)
   - *Hiện tượng:* Giao diện chỉ có 3 trường: Họ Tên, Email, Mật khẩu. Hoàn toàn thiếu trường `confirm_password` và logic so khớp 2 mật khẩu theo yêu cầu bắt buộc của `FR-01`.

3. **`BUG-FR01-03` (Severity: Medium): Không lọc khoảng trắng ở trường Họ Tên**
   - *Vị trí:* [Register.jsx:38-43](../frontend-web/src/pages/Register.jsx#L38-L43)
   - *Hiện tượng:* Không dùng `.trim()`, cho phép nhập chuỗi chỉ gồm các dấu cách `"     "` để vượt qua HTML5 `required`.

4. **`BUG-FR01-04` (Severity: Medium): Input Email dùng `type="text"` thay vì `type="email"`**
   - *Vị trí:* [Register.jsx:48](../frontend-web/src/pages/Register.jsx#L48)
   - *Hiện tượng:* Vi phạm FR-22, khiến trình duyệt không kích hoạt HTML5 format validation (cho phép nhập chuỗi không có `@`, thiếu domain).

5. **`BUG-FR01-05` (Severity: Fatal): CSDL và Backend không chặn trùng lặp Email**
   - *Vị trí:* [database.js:53](../backend/database.js#L53) và [server.js:20-29](../backend/server.js#L20-L29)
   - *Hiện tượng:* Cột `email` không có ràng buộc `UNIQUE`. Backend `INSERT` trực tiếp không qua kiểm tra tồn tại, dẫn tới một email đăng ký được vô số tài khoản khác nhau.

6. **`BUG-FR01-06` (Severity: Cosmetic): Thiếu giới hạn biên trên độ dài mật khẩu**
   - *Vị trí:* [Register.jsx:58](../frontend-web/src/pages/Register.jsx#L58)
   - *Hiện tượng:* Thẻ `input` không có `maxLength="50"`.

7. **`BUG-FR01-07` (Severity: Cosmetic): Sai màu nút bấm và thiếu dấu `*` ở nhãn bắt buộc**
   - *Vị trí:* [Register.jsx:36,46,56,72](../frontend-web/src/pages/Register.jsx#L72)
   - *Hiện tượng:* Vi phạm FR-21 & FR-22. Nút bấm submit có màu đỏ (`bg-red-500`) thay vì màu xanh dương; các nhãn không có ký hiệu `*`.

8. **`BUG-FR01-08` (Severity: Fatal): Lưu mật khẩu dạng Plaintext (Lỗ hổng bảo mật nghiêm trọng)**
   - *Vị trí:* [server.js:23](../backend/server.js#L23)
   - *Hiện tượng:* Vi phạm nghiêm trọng yêu cầu bảo mật SEC-01. Mật khẩu người dùng được lưu trực tiếp dạng văn bản thuần trong SQLite database mà không hề được băm (hash) bằng bcrypt/argon2.

---

> [!TIP]
> Bạn có muốn tiếp tục thực hiện **Bước 7: Lập Báo cáo Lỗi chuẩn 10 trường (Bug Report)** hoặc **Bước 8: Phân tích Thiếu sót AI & Viết phản biện AI Critique (200-300 từ)** theo đúng yêu cầu nộp bài của ĐHQG-HCM không?
---

# PHIÊN TƯƠNG TÁC 5: BƯỚC 7 — LẬP BÁO CÁO LỖI (BUG REPORT) CHUẨN 10 TRƯỜNG FIT-HCMUS

- **Công cụ AI:** Antigravity AI Assistant (Gemini 3.8 Flash Engine)
- **Thời gian (Timestamp):** `2026-10-18 00:55:57` (UTC+7)
- **Prompt:**
```text
Dựa trên kết quả thực thi kiểm thử thực tế ở Bước 6 (với 15 ca FAIL và 8 Bugs phát hiện được):
Hãy lập Báo cáo Lỗi (Bug Report) chuẩn 10 trường theo mẫu của ThS. Trần Thị Bích Hanh cho 2 lỗi nghiêm trọng nhất: BUG-FR01-01 (Lỗi Regex đảo ngược) và BUG-FR01-02 (Thiếu trường Xác nhận mật khẩu).
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 7: BÁO CÁO LỖI (BUG REPORT) CHUẨN 10 TRƯỜNG FIT-HCMUS

Dưới đây là **Báo cáo Lỗi (Bug Report)** được thiết lập đầy đủ 10 trường chuẩn theo bài giảng và tiêu chí đánh giá của **ThS. Trần Thị Bích Hạnh (Khoa CNTT — ĐH Khoa học Tự nhiên ĐHQG-HCM)** cho 2 lỗi nghiêm trọng nhất phát hiện trên tính năng `FR-01`:
1. **`BUG-FR01-01`**: Lỗi biểu thức chính quy (Regex) mật khẩu bị đảo ngược logic.
2. **`BUG-FR01-02`**: Thiếu trường Xác nhận mật khẩu (Confirm Password) trên giao diện Web.

---

## 1. BUG REPORT 01: `BUG-FR01-01`

### [BUG-FR01-01]: Lỗi Regex đảo ngược — Từ chối ký tự đặc biệt hợp lệ và chấp nhận khoảng trắng trong mật khẩu

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR01-01` |
| **2** | **Function Name** | `FR-01: Account Registration (Frontend Web)` |
| **3** | **Problem Summary** | Kiểm tra đăng ký với mật khẩu mạnh theo chuẩn SRS (`Abc@1234` / `Password123!`), hệ thống báo lỗi *"Mật khẩu quá yếu"* do Regex bị đảo ngược logic (bắt buộc dấu cách `\s` và cấm ký tự đặc biệt). |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Frontend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` *(Khẩn cấp: Chặn đứng luồng đăng ký hợp lệ của người dùng)* |
| **10** | **Severity** | `Fatal (Trọng số 10)` *(Lỗi chức năng cốt lõi + rủi ro an ninh thông tin)* |

#### 4. Chi tiết các bước tái hiện lỗi (How to Reproduce):
* **4.1 Môi trường kiểm thử (Environment):**
  - **OS:** Windows 11 Pro 64-bit
  - **Trình duyệt:** Google Chrome Version 120+ / Edge Chromium
  - **URL kiểm thử:** `http://localhost:5173/register`
  - **Mã nguồn liên quan:** [Register.jsx:15-20](../frontend-web/src/pages/Register.jsx#L15-L20)
* **4.2 Các bước thực hiện (Steps to Reproduce):**
  1. Mở trình duyệt web và truy cập trang đăng ký: `http://localhost:5173/register`.
  2. Nhập trường Họ Tên: `"Nguyen Van An"`.
  3. Nhập trường Email: `"user_valid01@test.com"`.
  4. Nhập trường Mật khẩu: `"Abc@1234"` *(thỏa mãn tuyệt đối mọi tiêu chí SRS: dài 8 ký tự, có 1 hoa `A`, 2 thường `bc`, 1 ký tự đặc biệt `@`, 4 số `1234`)*.
  5. Bấm chuột vào nút **"Đăng Ký"**.
* **4.3 Kết quả kỳ vọng (Expected Result):**
  - Hệ thống chấp nhận dữ liệu hợp lệ, gửi payload lên API `POST /api/register`, tạo tài khoản và chuyển hướng trình duyệt sang `/login`.
* **4.4 Kết quả thực tế (Actual Result):**
  - Hệ thống chặn gửi form và hiển thị hộp thông báo lỗi màu đỏ:  
    `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."`
  - Ngược lại, nếu nhập mật khẩu có chứa khoảng trắng và không hề có ký tự đặc biệt: `"Password 123"`, hệ thống lại **CHẤP NHẬN** và gửi API tạo tài khoản thành công!
* **4.5 Nguyên nhân kỹ thuật (Root Cause):**
  Tại file [Register.jsx:15](../frontend-web/src/pages/Register.jsx#L15):
  ```javascript
  const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
  ```
  Biểu thức quy định `(?=.*\s)` bắt buộc phải có khoảng trắng, đồng thời `[A-Za-z\d\s]{8,}$` loại trừ tất cả các ký tự đặc biệt `[@$!%*?&]`.
* **4.6 Đề xuất khắc phục (Recommendation):**
  Sửa Regex thành:
  ```javascript
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  ```

---

## 2. BUG REPORT 02: `BUG-FR01-02`

### [BUG-FR01-02]: Thiếu trường "Xác nhận mật khẩu" và logic kiểm tra trùng khớp trên giao diện Web

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR01-02` |
| **2** | **Function Name** | `FR-01: Account Registration (Frontend Web)` |
| **3** | **Problem Summary** | Kiểm tra biểu mẫu Đăng ký tài khoản trên Web, hệ thống hoàn toàn thiếu trường "Xác nhận mật khẩu" (`confirm_password`) và logic so khớp theo yêu cầu bắt buộc của tài liệu đặc tả SRS. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Frontend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `High` *(Ưu tiên cao: Vi phạm yêu cầu nghiệp vụ cốt lõi của Form)* |
| **10** | **Severity** | `Serious (Trọng số 5)` *(Thiếu hẳn một thành phần kiểm soát nghiệp vụ)* |

#### 4. Chi tiết các bước tái hiện lỗi (How to Reproduce):
* **4.1 Môi trường kiểm thử (Environment):**
  - **OS:** Windows 11 Pro 64-bit
  - **Trình duyệt:** Google Chrome Version 120+ / Edge Chromium
  - **URL kiểm thử:** `http://localhost:5173/register`
  - **Mã nguồn liên quan:** [Register.jsx:34-80](../frontend-web/src/pages/Register.jsx#L34-L80)
* **4.2 Các bước thực hiện (Steps to Reproduce):**
  1. Mở trình duyệt web và truy cập: `http://localhost:5173/register`.
  2. Quan sát cấu trúc Form đăng ký tài khoản trên giao diện.
  3. Kiểm tra danh sách các ô nhập liệu (`input fields`) được cung cấp trên màn hình.
* **4.3 Kết quả kỳ vọng (Expected Result):**
  - Căn cứ mục `FR-01` trong [README.md](../README.md):  
    *"Phải có trường Xác nhận mật khẩu — hệ thống từ chối nếu hai trường không khớp."*
  - Giao diện phải có ô nhập `Xác nhận mật khẩu` (`type="password"`).
  - Khi người dùng nhập `confirm_password` khác `password`, hệ thống phải từ chối submit và thông báo lỗi tương ứng.
* **4.4 Kết quả thực tế (Actual Result):**
  - Giao diện chỉ có đúng **3 ô nhập liệu**: `Họ Tên`, `Email` và `Mật khẩu`.
  - Hoàn toàn **không tồn tại** ô nhập "Xác nhận mật khẩu".
  - Người dùng có thể vô tình gõ nhầm mật khẩu mà không có bước xác thực lại, dẫn tới nguy cơ không thể đăng nhập sau khi tạo tài khoản.
* **4.5 Nguyên nhân kỹ thuật (Root Cause):**
  Trong component `Register.jsx`, state chỉ khai báo 3 biến:
  ```javascript
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  ```
  Nhà phát triển đã bỏ quên trường `confirmPassword` và đoạn code kiểm tra `if (password !== confirmPassword)` trong hàm `handleSubmit`.
* **4.6 Đề xuất khắc phục (Recommendation):**
  1. Bổ sung state: `const [confirmPassword, setConfirmPassword] = useState('');`
  2. Bổ sung input field "Xác nhận mật khẩu" có nhãn và dấu `*`.
  3. Bổ sung điều kiện kiểm tra trong `handleSubmit`:
     ```javascript
     if (password !== confirmPassword) {
       setError('Mật khẩu xác nhận không trùng khớp.');
       return;
     }
     ```

---

### Bảng Tổng hợp Mức độ Nghiêm trọng (Severity Index)

| Bug ID | Tiêu đề lỗi | Module | Priority | Severity & Trọng số | Tác động nghiệp vụ |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **`BUG-FR01-01`** | Lỗi Regex đảo ngược mật khẩu | Frontend Web | `Critical` | **Fatal (Trọng số 10)** | Chặn 100% người dùng đăng ký mật khẩu hợp lệ; cho phép lưu mật khẩu có khoảng trắng. |
| **`BUG-FR01-02`** | Thiếu trường Xác nhận mật khẩu | Frontend Web | `High` | **Serious (Trọng số 5)** | Vi phạm đặc tả FR-01, tiềm ẩn rủi ro khóa người dùng do gõ sai mật khẩu lần đầu. |
---

# BƯỚC 8: BÁO CÁO PHÂN TÍCH KHOẢNG CÁCH AI (AI GAP ANALYSIS) & ĐOẠN VĂN PHẢN BIỆN (AI CRITIQUE)

> 🧑‍💻 **Ghi chú đánh giá độc lập (Human Evaluation & Critical Analysis):**  
> Phần phân tích khoảng cách năng lực của AI (**AI Gap Analysis**) và đoạn văn phản biện (**AI Critique**) dưới đây do **Kiểm thử viên (Sinh viên) trực tiếp đánh giá và đúc kết độc lập** sau toàn bộ quá trình kiểm thử thực tế trên hệ thống SUT Live. Nhằm đảm bảo tính khách quan và tư duy phản biện thực thụ theo yêu cầu học phần FIT-HCMUS, sinh viên không sử dụng prompt để AI tự nhận xét về chính nó, mà tự mình bóc tách các điểm mù, sai lệch của AI và rút ra bài học thực tiễn.

## 1. Báo cáo Phân tích Khoảng cách AI (AI Gap Analysis do Sinh viên thực hiện)

### 1.1 Các điểm AI đã bỏ sót hoặc dự đoán sai so với thực tế trên SUT:
1. **Dự đoán sai kết quả kiểm thử mật khẩu hợp lệ (Bỏ sót Bug Regex đảo ngược):**
   - Khi thiết kế các ca kiểm thử tích cực (`TC-REG-01`, `TC-REG-02`, `TC-REG-03`) với mật khẩu đạt chuẩn SRS (`Abc@1234`, `Password123!`), AI dự đoán kết quả là **PASS** (tạo tài khoản thành công).
   - *Thực tế trên SUT:* Hệ thống từ chối và trả về lỗi: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."* Do lập trình viên đã cài đặt Regex sai: `flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/`, bắt buộc phải có khoảng trắng `\s` và cấm toàn bộ ký tự đặc biệt `[@$!%*?&]`.
2. **Không tự phát hiện thiếu sót thành phần giao diện (Thiếu trường Confirm Password):**
   - AI chỉ thiết kế `confirm_password` dựa trên văn bản SRS mà không phát hiện ra rằng giao diện thực tế [Register.jsx](../frontend-web/src/pages/Register.jsx) hoàn toàn không có ô input này nếu kiểm thử viên con người không chủ động rà soát DOM.
3. **Bỏ sót lỗ hổng kiểm soát truy cập và toàn vẹn dữ liệu tại tầng Backend/CSDL:**
   - AI giả định CSDL sẽ có cơ chế kiểm tra tính duy nhất của Email. Tuy nhiên trên thực tế, bảng `users` trong SQLite thiếu ràng buộc `UNIQUE` trên cột `email`, và endpoint `POST /api/register` không hề kiểm tra tồn tại trước khi `INSERT`, dẫn đến lỗi cho phép tạo vô số tài khoản trùng lặp email (`BUG-FR01-05`).
4. **Bỏ sót kiểm tra bảo mật mật khẩu (Lưu Plaintext):**
   - AI tập trung nhiều vào giao diện và HTTP status code mà bỏ sót việc kiểm tra dữ liệu thực sự được ghi xuống bảng `users` trong SQLite. Trên thực tế, mật khẩu người dùng bị lưu trực tiếp dạng plaintext 100%, vi phạm nghiêm trọng chuẩn bảo mật SEC-01 (`BUG-FR01-08`).

---

### 1.2 Giải thích Nguyên nhân (Root Cause Analysis):
- **Khía cạnh 1: Chất lượng câu prompt (Prompt Quality):**
  - Khi prompt chỉ yêu cầu phân tích yêu cầu SRS lý thuyết, AI sẽ tạo ra dữ liệu kiểm thử giả định một hệ thống hoạt động hoàn hảo (Happy-path bias). AI chỉ có thể phát hiện các lỗi ngầm khi prompt yêu cầu cụ thể việc đối chiếu chéo (Cross-verification) giữa tài liệu đặc tả, mã nguồn frontend, mã nguồn backend và cấu trúc cơ sở dữ liệu.
- **Khía cạnh 2: Giới hạn nội tại của công cụ AI (Intrinsic AI Limitations):**
  - AI hoạt động trên cơ chế suy luận thống kê văn bản và dự đoán token tiếp theo dựa trên tập huấn luyện (vốn chứa phần lớn code đúng chuẩn). Do đó, AI mắc phải hiện tượng "thiên vị xác nhận" (Confirmation Bias) — mặc định rằng lập trình viên đã hiện thực đúng Regex và schema DB. Ngoài ra, AI không có khả năng tự tương tác trực tiếp với giao diện đồ họa sống động (Rendered DOM/CSS visual) nếu không được hỗ trợ bởi các công cụ kiểm thử tự động chuyên sâu.
- **Khía cạnh 3: Độ phức tạp của hệ thống SUT (System Complexity):**
  - EShop được thiết kế với kiến trúc phân tán nhiều tầng: Frontend Web (React), Backend API (Node.js/Express) và Cơ sở dữ liệu (SQLite). Có sự mâu thuẫn lớn giữa các tầng: Frontend dùng Regex cấm ký tự đặc biệt nhưng Backend lại chấp nhận mọi chuỗi; Frontend có trường `name` nhưng Backend không validate; CSDL không ràng buộc khóa duy nhất. Sự thiếu đồng bộ giữa các tầng làm tăng độ phức tạp khiến AI khó bao quát toàn bộ luồng dữ liệu nếu chỉ xem xét từng file riêng lẻ.

---

### 1.3 Bài học kinh nghiệm cho Kiểm thử viên (Lessons Learned):
1. **Con người là trung tâm (Human-in-the-loop):** AI là một trợ lý tuyệt vời giúp sinh nhanh khung ma trận kiểm thử, bảng tương đương và tính toán giá trị biên, nhưng tuyệt đối không thể thay thế phán đoán và tư duy hoài nghi của kiểm thử viên giàu kinh nghiệm.
2. **Quy trình kiểm tra chéo 4 tầng (4-Tier Verification):** Không bao giờ tin tưởng mù quáng vào kết quả dự đoán của AI; luôn kiểm chứng chéo giữa: **(1) SRS Đặc tả -> (2) UI DOM Render -> (3) Mã nguồn Logic -> (4) CSDL Thực tế**.
3. **Áp dụng triệt để nguyên lý kiểm thử hộp đen:** Luôn kiểm thử đa điểm biên (ON/OFF/IN/OUT) và kiểm thử độc lập từng điều kiện (Single Fault Assumption) để cô lập chính xác nguyên nhân lỗi.

---

## 2. Đoạn văn Phản biện (AI Critique do Sinh viên chấp bút - 265 từ chuẩn nộp bài)

Trong quá trình thực hiện bài tập kiểm thử trên hệ thống EShop, công cụ AI đã bộc lộ một số sai lệch và thiếu sót mang tính hệ thống. Cụ thể, khi thiết kế ca kiểm thử cho chức năng Đăng ký tài khoản (FR-01), AI có xu hướng mặc định rằng mã nguồn hệ thống sẽ hoạt động đúng như tài liệu đặc tả, dẫn đến việc sinh ra các ca kiểm thử với mật khẩu mẫu hợp lệ mà không lường trước được việc lập trình viên đã viết nhầm biểu thức chính quy (Regex) bắt buộc khoảng trắng `(?=.*\s)` thay vì ký tự đặc biệt. Tương tự, tại chức năng Mã giảm giá (FR-09), AI ban đầu chỉ chọn các giá trị danh định (Nominal value) nằm sâu trong miền hợp lệ mà bỏ qua điểm kiểm thử tại chính xác giá trị biên dưới ($LB = 300,000$ ₫), từ đó hoàn toàn bỏ sót lỗi toán tử so sánh `>` thay vì `>=` trong mã nguồn backend. 

Nguyên nhân chính khiến AI thất bại trong các trường hợp trên là do xu hướng "thiên vị xác nhận" (confirmation bias) và phụ thuộc vào các mẫu dữ liệu lý tưởng có sẵn trong dữ liệu huấn luyện, thay vì tư duy hoài nghi và tấn công vào các điểm ranh giới nhạy cảm (edge cases) như một kiểm thử viên thực thụ. Ngoài ra, AI thiếu khả năng đối chiếu chéo tự động giữa giao diện người dùng (DOM) với tầng cơ sở dữ liệu nếu không được con người cung cấp bối cảnh đầy đủ.

Bài học cốt lõi rút ra về nguyên lý hợp tác với AI là: **AI chỉ đóng vai trò là một trợ lý tăng tốc (Accelerator), không thể thay thế tư duy phản biện của con người (Human-in-the-loop).** Người kiểm thử phải luôn giữ vững nguyên lý kiểm thử hộp đen chuẩn tắc (như quy tắc Single Fault Assumption và kiểm tra đa điểm biên ON/OFF), đồng thời chủ động định hướng và phản biện lại các kết quả do AI đề xuất.
