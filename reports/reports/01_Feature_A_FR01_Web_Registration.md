# Báo cáo Kiểm thử: Feature A (Pool A) — FR-01: Đăng ký tài khoản (Web)

**Học phần:** Kiểm thử Phần mềm (FIT-HCMUS)  
**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis on EShop  
**Tính năng kiểm thử:** `FR-01: Account Registration (Frontend Web & Backend API)`  
**Kỹ thuật áp dụng:** Phân hoạch tương đương (EP), Phân tích giá trị biên (BVA), Kiểm thử miền (Domain Testing)  

---

## 1. Phân tích Đặc tả Yêu cầu & Xác định Biến (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả (SRS Ground Truth)
Theo tài liệu đặc tả hệ thống `EShop` (FR-01, FR-21, FR-22, SEC-01):
1. **Dữ liệu bắt buộc:** Họ Tên (`name`), Email (`email`), Mật khẩu (`password`), Xác nhận mật khẩu (`confirm_password`).
2. **Quy tắc Email:** Phải có định dạng hợp lệ (`user@domain.com`) và là duy nhất trong CSDL. Input field phải có `type="email"`.
3. **Quy tắc Mật khẩu mạnh:**
   - Chiều dài: Tối thiểu 8 ký tự.
   - Thành phần ký tự: Phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt thuộc tập `[@, $, !, %, *, ?, &]`.
4. **Quy tắc Xác nhận mật khẩu:** Phải có trường "Xác nhận mật khẩu", từ chối nếu không trùng khớp.
5. **Yêu cầu Giao diện & Luồng:**
   - Các trường bắt buộc phải có dấu `*` bên cạnh nhãn.
   - Nút hành động Submit phải có màu xanh dương.
   - Đăng ký thành công: Chuyển hướng tới trang Đăng nhập (`/login`).
   - Mật khẩu phải được mã hóa (băm an toàn), không lưu plaintext trong CSDL.

### 1.2 Danh sách Biến Đầu vào (Inputs) & Đầu ra (Outputs)

| Tên biến | Kiểu dữ liệu | Ý nghĩa | Ràng buộc nghiệp vụ (Constraints) |
| :--- | :--- | :--- | :--- |
| `name` | String | Họ và tên người dùng | Bắt buộc, không để trống, $length \ge 1$ |
| `email` | String | Địa chỉ email đăng ký | Bắt buộc, đúng định dạng RFC 5322, chưa tồn tại trong hệ thống |
| `password` | String | Mật khẩu tài khoản | Bắt buộc, độ dài $\ge 8$, có chữ hoa, chữ thường, số, ký tự đặc biệt `[@$!%*?&]` |
| `confirm_password` | String | Xác nhận lại mật khẩu | Bắt buộc, giá trị phải trùng khớp 100% với `password` |

**Kết quả đầu ra kỳ vọng (Outputs):**
- **Output 1 (Thành công - Out_Valid):** Tạo tài khoản thành công, lưu CSDL (mật khẩu đã băm), chuyển hướng về `/login`.
- **Output 2 (Lỗi - Out_Invalid):** Hệ thống từ chối, hiển thị thông báo lỗi cụ thể tương ứng với trường vi phạm.

---

## 2. Phân hoạch Lớp Tương đương (Equivalence Partitioning - EP)

Dựa trên nguyên tắc phân hoạch (Range, Set of values, Must-be, Split), ta thiết lập bảng các lớp tương đương:

| Biến kiểm tra | Mã lớp | Mô tả lớp tương đương (Equivalence Class) | Phân loại (Valid / Invalid) |
| :--- | :---: | :--- | :---: |
| **Họ Tên (`name`)** | **EC01** | Chuỗi ký tự hợp lệ ($length \ge 1$) | Valid |
| | **EC02** | Chuỗi rỗng ($length = 0$) hoặc chỉ chứa khoảng trắng | Invalid |
| **Email (`email`)** | **EC03** | Định dạng hợp lệ (`user@domain.com`), chưa tồn tại trong CSDL | Valid |
| | **EC04** | Email sai cú pháp (thiếu `@`, thiếu domain, chứa dấu cách) | Invalid |
| | **EC05** | Email hợp lệ nhưng đã tồn tại trong CSDL (trùng lặp) | Invalid |
| | **EC06** | Để trống email ($length = 0$) | Invalid |
| **Độ dài Mật khẩu (`len_pw`)** | **EC07** | Độ dài mật khẩu $\ge 8$ ký tự | Valid |
| | **EC08** | Độ dài mật khẩu $< 8$ ký tự | Invalid |
| | **EC09** | Để trống mật khẩu ($length = 0$) | Invalid |
| **Ký tự Mật khẩu (`char_pw`)** | **EC10** | Có đủ: chữ hoa, chữ thường, số, ký tự đặc biệt `[@$!%*?&]` | Valid |
| | **EC11** | Thiếu chữ cái in hoa ($[A-Z]$) | Invalid |
| | **EC12** | Thiếu chữ cái in thường ($[a-z]$) | Invalid |
| | **EC13** | Thiếu chữ số ($[0-9]$) | Invalid |
| | **EC14** | Thiếu ký tự đặc biệt hợp lệ trong tập `[@$!%*?&]` | Invalid |
| | **EC15** | Chứa ký tự khoảng trắng trong mật khẩu | Invalid |
| **Xác nhận mật khẩu (`confirm_pw`)** | **EC16** | Giá trị khớp 100% với `password` | Valid |
| | **EC17** | Giá trị không khớp với `password` | Invalid |
| | **EC18** | Để trống trường xác nhận mật khẩu | Invalid |
| **Outputs** | **EC19** | Đăng ký thành công, điều hướng về `/login` | Valid |
| | **EC20** | Hiển thị thông báo lỗi cụ thể, chặn form submit | Invalid |

---

## 3. Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

### 3.1 Biên độ dài mật khẩu (`password_length`)
Điều kiện biên: $length \ge 8$ (Biên dưới $LB = 8$).
- $LB - 1 = 7$: Điểm OFF (Invalid - vi phạm độ dài tối thiểu).
- $LB = 8$: Điểm ON (Valid - độ dài tối thiểu được chấp nhận).
- $LB + 1 = 9$: Điểm IN (Valid - ngay trên biên dưới).
- $Nominal = 15$: Điểm danh định điển hình (Valid).
- $UB = 50$: Điểm biên trên quy ước cho mật khẩu người dùng thông thường.
- $UB + 1 = 51$: Điểm trên biên trên (nếu có giới hạn).

| STT | Điểm biên | Giá trị độ dài | Dữ liệu mẫu kiểm thử | Dự kiến (Expected Output) |
| :---: | :---: | :---: | :--- | :--- |
| **BV01** | $LB - 1$ | 7 ký tự | `Abc@123` | Invalid (Báo lỗi độ dài tối thiểu 8 ký tự) |
| **BV02** | $LB$ | 8 ký tự | `Abc@1234` | Valid (Hợp lệ) |
| **BV03** | $LB + 1$ | 9 ký tự | `Abc@12345` | Valid (Hợp lệ) |
| **BV04** | $Nom$ | 15 ký tự | `NguyenVanA@2026!` | Valid (Hợp lệ) |

### 3.2 Biên độ dài họ tên (`name_length`)
Điều kiện: Bắt buộc, $length \ge 1$.
- $LB - 1 = 0$: Điểm OFF (Rỗng - Invalid).
- $LB = 1$: Điểm ON (1 ký tự - Valid).
- $LB + 1 = 2$: Điểm IN (2 ký tự - Valid).

| STT | Điểm biên | Giá trị độ dài | Dữ liệu mẫu kiểm thử | Dự kiến (Expected Output) |
| :---: | :---: | :---: | :--- | :--- |
| **BV05** | $LB - 1$ | 0 ký tự | `""` (chuỗi rỗng) | Invalid (Báo lỗi họ tên không được để trống) |
| **BV06** | $LB$ | 1 ký tự | `"A"` | Valid (Hợp lệ) |
| **BV07** | $LB + 1$ | 2 ký tự | `"An"` | Valid (Hợp lệ) |

---

## 4. Kiểm thử Miền Điều kiện Mật khẩu (Decision Table Testing)

Để kiểm tra miền điều kiện kết hợp của 5 ràng buộc mật khẩu ($C_1$: Độ dài $\ge 8$, $C_2$: Hoa, $C_3$: Thường, $C_4$: Số, $C_5$: Ký tự đặc biệt), ta lập Bảng Quyết định rút gọn:

| Nguyên nhân (Causes) | R1 | R2 | R3 | R4 | R5 | R6 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| $C_1$: Độ dài $\ge 8$ ($LB=8$) | **T** | **F** | T | T | T | T |
| $C_2$: Chứa chữ hoa $[A-Z]$ | **T** | T | **F** | T | T | T |
| $C_3$: Chứa chữ thường $[a-z]$ | **T** | T | T | **F** | T | T |
| $C_4$: Chứa chữ số $[0-9]$ | **T** | T | T | T | **F** | T |
| $C_5$: Chứa ký tự đặc biệt `[@$!%*?&]` | **T** | T | T | T | T | **F** |
| **Kết quả (Effect)** | | | | | | |
| $E_1$: Đăng ký thành công | **X** | | | | | |
| $E_2$: Báo lỗi mật khẩu không hợp lệ | | **X** | **X** | **X** | **X** | **X** |

---

## 5. Thiết kế Bộ Ca Kiểm thử (Test Case Specification)

*Áp dụng nguyên tắc vàng chọn Test Case của bài giảng:*
- *Test case hợp lệ: Bao phủ tối đa các lớp tương đương hợp lệ trong 1 ca test.*
- *Test case không hợp lệ: Mỗi ca test **chỉ vi phạm duy nhất 1 điều kiện** (Single Fault Assumption).*

| #TC | Tên / Mục tiêu kiểm thử | Lớp tương đương / Điểm biên | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual trên SUT) | Trạng thái (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-REG-01** | Đăng ký thành công với dữ liệu hợp lệ tối thiểu | EC01, EC03, EC07, EC10, EC16, BV02 | Name: `"An"`<br>Email: `"valid_user1@test.com"`<br>Password: `"Abc@1234"` (8 ký tự)<br>Confirm: `"Abc@1234"` | Tạo tài khoản thành công, lưu DB, chuyển về `/login` | Không có trường Confirm Password. Báo lỗi "Mật khẩu quá yếu"! | **FAIL** |
| **TC-REG-02** | Đăng ký với mật khẩu thiếu 1 ký tự (biên dưới $LB-1$) | EC08, BV01 | Name: `"Nguyen Van A"`<br>Email: `"valid_user2@test.com"`<br>Password: `"Abc@123"` (7 ký tự)<br>Confirm: `"Abc@123"` | Báo lỗi mật khẩu tối thiểu 8 ký tự | Báo lỗi "Mật khẩu quá yếu" | **PASS** |
| **TC-REG-03** | Đăng ký với mật khẩu không có chữ hoa | EC11 | Password: `"abc@1234"` (8 ký tự) | Báo lỗi thiếu chữ hoa | Báo lỗi "Mật khẩu quá yếu" | **PASS** |
| **TC-REG-04** | Đăng ký với mật khẩu không có chữ thường | EC12 | Password: `"ABC@1234"` (8 ký tự) | Báo lỗi thiếu chữ thường | Báo lỗi "Mật khẩu quá yếu" | **PASS** |
| **TC-REG-05** | Đăng ký với mật khẩu không có chữ số | EC13 | Password: `"Abcd@efg"` (8 ký tự) | Báo lỗi thiếu chữ số | Báo lỗi "Mật khẩu quá yếu" | **PASS** |
| **TC-REG-06** | Đăng ký với mật khẩu chuẩn có ký tự đặc biệt `@` | EC10, EC14 | Password: `"Password123!"` (12 ký tự) | Chấp nhận mật khẩu hợp lệ | Báo lỗi từ chối: "Mật khẩu quá yếu"! | **FAIL** |
| **TC-REG-07** | Đăng ký với mật khẩu dùng khoảng trắng thay ký tự đặc biệt | EC15 | Password: `"Password 123"` (có dấu cách) | Báo lỗi không cho phép mật khẩu có khoảng trắng, thiếu ký tự đặc biệt | Hệ thống **CHẤP NHẬN** đăng ký thành công! | **FAIL** |
| **TC-REG-08** | Đăng ký khi xác nhận mật khẩu không khớp | EC17 | Password: `"Abc@1234"`<br>Confirm: `"Abc@1235"` | Báo lỗi mật khẩu xác nhận không khớp | Không có trường Xác nhận mật khẩu trên UI! | **FAIL** |
| **TC-REG-09** | Đăng ký với Email đã tồn tại trong hệ thống | EC05 | Email: `"test@eshop.com"`<br>Password: `"Abc@1234"` | Báo lỗi thân thiện: "Email đã tồn tại" | CSDL không có ràng buộc `UNIQUE`, Backend chấp nhận và trả về 200 OK tạo mới tài khoản trùng email! | **FAIL** |
| **TC-REG-10** | Đăng ký với Email sai định dạng (không có domain) | EC04 | Email: `"user@"` | Báo lỗi email không hợp lệ (HTML5 type email) | Input `type="text"`, không validate HTML5 format | **FAIL** |
| **TC-REG-11** | Kiểm tra kiểm soát giao diện (GUI Check) | FR-21, FR-22 | Mở trang `/register` | Nhãn có dấu `*`, nút Submit màu xanh dương | Không có dấu `*`, nút màu đỏ (`bg-red-500`) | **FAIL** |
| **TC-REG-12** | Kiểm tra bảo mật mật khẩu trong CSDL | SEC-01 | Kiểm tra bản ghi trong bảng `users` | Mật khẩu phải được hash (bcrypt) | Mật khẩu lưu dạng **Plaintext** 100% | **FAIL** |

---

## 6. Phân tích Thiếu sót của AI (AI Gap Analysis)

### 6.1 Những điểm AI sinh tự động ban đầu thường bỏ sót:
1. **Bỏ sót Bug Regex đảo ngược (`\s` thay vì ký tự đặc biệt):** Các công cụ AI tổng quát khi đọc yêu cầu thường sinh test case "Abc@1234" và mặc định nó sẽ Pass. AI không nhận diện được rằng mã nguồn SUT sử dụng Regex lỗi `(?=.*\s)[A-Za-z\d\s]{8,}$` dẫn tới việc từ chối ký tự đặc biệt hợp lệ và chấp nhận dấu cách.
2. **Bỏ sót kiểm tra tính nhất quán giữa UI và API (Backend Bypass):** AI thường chỉ tập trung kiểm tra validation trên UI mà quên rằng nếu gửi trực tiếp qua API `POST /api/register`, Backend hoàn toàn không có bất kỳ dòng validate nào, dẫn tới lưu thẳng mật khẩu yếu vào Database.
3. **Bỏ sót kiểm tra trường Xác nhận mật khẩu:** Do trên giao diện SUT không vẽ trường này, AI nếu chỉ đọc DOM giao diện sẽ quên đối chiếu ngược với đặc tả SRS (vốn yêu cầu bắt buộc phải có trường này).

### 6.2 Nguyên nhân:
- AI có xu hướng "tin tưởng" vào mã nguồn đang chạy thay vì đối chiếu nghiêm ngặt với tài liệu đặc tả nghiệp vụ (Specification Ground Truth).
- Con người (Tester) đóng vai trò then chốt trong việc đối chiếu chéo giữa SRS, Frontend UI và Backend Database.

---

## 7. Minh chứng Kiểm thử (Defect Evidence & Screenshots)

Toàn bộ minh chứng được lưu trữ tại thư mục `screenshots/F01/` gồm 2 nhóm ảnh chuẩn hóa:

| Mã Bug | Tên Lỗi Phát Hiện | Minh Chứng Mã Lỗi (VS Code IDE) | Minh Chứng Thực Tế (UI / CSDL) |
| :---: | :--- | :--- | :--- |
| **`BUG-FR01-01`** | Lỗi Regex đảo ngược mật khẩu | `screenshots/F01/BUG-FR01-01_Code.png` | `screenshots/F01/BUG-FR01-01_UI.png` |
| **`BUG-FR01-02`** | Thiếu trường Xác nhận mật khẩu | `screenshots/F01/BUG-FR01-02_Code.png` | `screenshots/F01/BUG-FR01-02_UI.png` |
| **`BUG-FR01-03`** | Không lọc khoảng trắng ở trường Họ Tên | `screenshots/F01/BUG-FR01-03_Code.png` | `screenshots/F01/BUG-FR01-03_UI.png` |
| **`BUG-FR01-04`** | Input Email dùng `type="text"` | `screenshots/F01/BUG-FR01-04_Code.png` | `screenshots/F01/BUG-FR01-04_UI.png` |
| **`BUG-FR01-05`** | CSDL không ràng buộc UNIQUE cho email | `screenshots/F01/BUG-FR01-05_Code.png` | `screenshots/F01/BUG-FR01-05_UI_DB.png` |
| **`BUG-FR01-06`** | Mật khẩu không giới hạn cận trên ($UB=50$) | `screenshots/F01/BUG-FR01-06_Code.png` | `screenshots/F01/BUG-FR01-06_UI.png` |
| **`BUG-FR01-07`** | Nút bấm màu đỏ & thiếu ký hiệu `*` bắt buộc | `screenshots/F01/BUG-FR01-07_Code.png` | `screenshots/F01/BUG-FR01-07_UI.png` |
| **`BUG-FR01-08`** | Mật khẩu lưu dạng Plaintext trong CSDL | `screenshots/F01/BUG-FR01-08_Code.png` | `screenshots/F01/BUG-FR01-08_DB.png` |

