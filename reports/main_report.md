# BÁO CÁO KIỂM THỬ: MAIN TEST REPORT (HW02)
## Môn học: Kiểm thử phần mềm (Software Testing)
> **Sinh viên thực hiện**: 23120346  
> **Hệ thống kiểm thử (SUT)**: EShop E-Commerce System  
> **Repository nhóm**: https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing  

---

# PHẦN 1: POOL A — FR-03: QUÊN MẬT KHẨU & ĐẶT LẠI MẬT KHẨU (2 BƯỚC)

## 1.1. Khảo sát Đặc tả Yêu cầu Nghiệp vụ (System Specification)
Theo tài liệu đặc tả của hệ thống (`eshop-sut/README.md`), chức năng **FR-03** gồm 2 giai đoạn:
* **Bước 1 — Yêu cầu cấp mã OTP:**
  * Người dùng nhập địa chỉ `Email` đã đăng ký.
  * Hệ thống kiểm tra định dạng email và sự tồn tại trong CSDL.
  * Hệ thống sinh mã OTP **6 chữ số ngẫu nhiên** và gửi/hiển thị cho người dùng.
  * Giao diện phải có chỉ báo bước (Step Indicator "Bước 1 / 2") và nút "Quay lại đăng nhập".
* **Bước 2 — Xác thực OTP & Đổi mật khẩu mới:**
  * Người dùng nhập: `Mã OTP`, `Mật khẩu mới`, và `Xác nhận mật khẩu mới`.
  * **Ràng buộc Mật khẩu mới**: Tối thiểu 8 ký tự, bắt buộc phải có ít nhất: 1 chữ hoa (`A-Z`), 1 chữ thường (`a-z`), 1 chữ số (`0-9`), và 1 ký tự đặc biệt (`@, $, !, %, *, ?, &`).
  * **Ràng buộc Xác nhận mật khẩu**: Phải trùng khớp hoàn toàn với `Mật khẩu mới`.
  * **Ràng buộc OTP**: Phải đúng 6 chữ số và hợp lệ với phiên yêu cầu của email đó.

---

## 1.2. Áp dụng Kỹ thuật Domain Testing (Kiểm thử Miền giá trị)

### Step 1: Identify Input & Output Variables (Xác định Biến Đầu vào & Đầu ra)
1. **Inputs**:
   * $Input_1$ (`email`): Kiểu chuỗi (String), định dạng RFC 5322 (`user@domain.com`), trạng thái tài khoản tồn tại trong DB.
   * $Input_2$ (`otp`): Kiểu chuỗi ký tự số (Numeric String), độ dài chính xác 6 ký tự số.
   * $Input_3$ (`new_password`): Kiểu chuỗi (String), độ dài $\ge 8$, chứa 4 nhóm ký tự (hoa, thường, số, ký tự đặc biệt).
   * $Input_4$ (`confirm_password`): Kiểu chuỗi (String), ràng buộc đẳng thức: `confirm_password == new_password`.
2. **Outputs**:
   * *Output thành công*: Bước 1 sinh mã OTP và hiển thị Bước 2; Bước 2 thông báo đổi mật khẩu thành công và chuyển hướng về trang Đăng nhập.
   * *Output lỗi*: Thông báo lỗi khi trường để trống, email sai định dạng, email không tồn tại, OTP sai độ dài/sai mã, mật khẩu không đủ mạnh, xác nhận mật khẩu không khớp.

### Step 2: Identify Equivalence Classes (Xác định các Lớp Tương Đương)
Dựa trên các quy tắc phân hoạch tương đương (Equivalence Partitioning Guidelines):

| STT | Biến / Điều kiện kiểm tra | Valid Equivalence Classes ($EP_V$) | Invalid Equivalence Classes ($EP_I$) |
| :---: | :--- | :--- | :--- |
| **1** | **`email`: Cú pháp (Syntax)** | **EC1**: Đúng định dạng `user@domain.com` | **EC2**: Chuỗi rỗng `""`<br>**EC3**: Sai định dạng (thiếu `@` hoặc tên miền) |
| **2** | **`email`: Tồn tại trong CSDL** | **EC4**: Email đã đăng ký trong hệ thống | **EC5**: Email hợp lệ nhưng chưa từng đăng ký |
| **3** | **`otp`: Kiểu ký tự** | **EC6**: Toàn bộ là ký tự số (`0-9`) | **EC7**: Chứa ký tự chữ cái hoặc ký tự đặc biệt |
| **4** | **`otp`: Độ dài ký tự** | **EC8**: Độ dài đúng 6 ký tự số | **EC9**: Độ dài < 6 ký tự số<br>**EC10**: Độ dài > 6 ký tự số |
| **5** | **`otp`: Tính chính xác** | **EC11**: Trùng khớp với mã OTP hệ thống sinh ra | **EC12**: Sai mã OTP |
| **6** | **`new_password`: Độ dài** | **EC13**: Độ dài $\ge 8$ ký tự | **EC14**: Độ dài < 8 ký tự |
| **7** | **`new_password`: Chữ hoa** | **EC15**: Chứa ít nhất 1 chữ hoa (`A-Z`) | **EC16**: Không chứa chữ hoa nào |
| **8** | **`new_password`: Chữ thường** | **EC17**: Chứa ít nhất 1 chữ thường (`a-z`) | **EC18**: Không chứa chữ thường nào |
| **9** | **`new_password`: Chữ số** | **EC19**: Chứa ít nhất 1 chữ số (`0-9`) | **EC20**: Không chứa chữ số nào |
| **10** | **`new_password`: Ký tự đặc biệt** | **EC21**: Chứa ký tự đặc biệt (`@, $, !, %, *, ?, &`) | **EC22**: Không chứa ký tự đặc biệt nào |
| **11** | **`confirm_password`: Độ khớp** | **EC23**: Trùng khớp 100% với `new_password` | **EC24**: Khác với `new_password` |

### Step 3: Selecting Test Cases (Thiết kế Bộ Test Cases Miền Giá Trị)
Áp dụng nguyên tắc bao phủ: Một ca kiểm thử hợp lệ phủ tối đa các lớp $EP_V$; mỗi ca kiểm thử không hợp lệ chỉ phủ duy nhất một lớp $EP_I$.

| Test Case ID | Partitions Covered | Dữ liệu kiểm thử (`email`, `otp`, `new_password`, `confirm_password`) | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :--- |
| **TC_FR03_DT_01** | EC1, EC4, EC6, EC8, EC11, EC13, EC15, EC17, EC19, EC21, EC23 (All Valid) | `email`: `test@eshop.com`<br>`otp`: `482910` (đúng mã cấp)<br>`new_pwd`: `Eshop@2026`<br>`confirm_pwd`: `Eshop@2026` | Thành công: Đổi mật khẩu thành công, cập nhật CSDL, chuyển về Đăng nhập |
| **TC_FR03_DT_02** | EC2 (`email` rỗng) | `email`: `""` | Báo lỗi trường bắt buộc |
| **TC_FR03_DT_03** | EC3 (`email` sai cú pháp) | `email`: `testeshop.com` | Báo lỗi định dạng email không hợp lệ |
| **TC_FR03_DT_04** | EC5 (`email` chưa đăng ký) | `email`: `notfound@eshop.com` | Báo lỗi người dùng không tồn tại trong hệ thống |
| **TC_FR03_DT_05** | EC7 (`otp` chứa chữ cái) | `otp`: `12AB56` | Báo lỗi mã OTP không hợp lệ |
| **TC_FR03_DT_06** | EC9 (`otp` độ dài < 6) | `otp`: `12345` (5 chữ số) | Báo lỗi mã OTP phải đủ 6 chữ số |
| **TC_FR03_DT_07** | EC10 (`otp` độ dài > 6) | `otp`: `1234567` (7 chữ số) | Báo lỗi mã OTP không hợp lệ |
| **TC_FR03_DT_08** | EC12 (`otp` sai mã) | `otp`: `000000` (sai mã hệ thống cấp) | Báo lỗi mã OTP không chính xác |
| **TC_FR03_DT_09** | EC14 (`new_pwd` độ dài < 8) | `new_pwd`: `Esh@12` (6 ký tự)<br>`confirm_pwd`: `Esh@12` | Báo lỗi mật khẩu tối thiểu 8 ký tự |
| **TC_FR03_DT_10** | EC16 (`new_pwd` thiếu hoa) | `new_pwd`: `eshop@2026`<br>`confirm_pwd`: `eshop@2026` | Báo lỗi mật khẩu phải có ít nhất 1 chữ hoa |
| **TC_FR03_DT_11** | EC18 (`new_pwd` thiếu thường)| `new_pwd`: `ESHOP@2026`<br>`confirm_pwd`: `ESHOP@2026` | Báo lỗi mật khẩu phải có ít nhất 1 chữ thường |
| **TC_FR03_DT_12** | EC20 (`new_pwd` thiếu số) | `new_pwd`: `Eshop@xyz`<br>`confirm_pwd`: `Eshop@xyz` | Báo lỗi mật khẩu phải có ít nhất 1 chữ số |
| **TC_FR03_DT_13** | EC22 (`new_pwd` thiếu ký tự lạ)| `new_pwd`: `Eshop12345`<br>`confirm_pwd`: `Eshop12345` | Báo lỗi mật khẩu phải có ký tự đặc biệt |
| **TC_FR03_DT_14** | EC24 (`confirm_pwd` không khớp)| `new_pwd`: `Eshop@2026`<br>`confirm_pwd`: `KhacMatKhau1!` | Báo lỗi xác nhận mật khẩu không trùng khớp |

---

## 1.3. Áp dụng Kỹ thuật Boundary Value Analysis (BVA - Phân tích Giá trị Biên)

### Step 4: Boundary Value Analysis
Theo lý thuyết kiểm thử biên (Slide 36), lỗi phần mềm thường tập trung cao nhất tại các điểm ranh giới của các biến có thứ tự.
Trong FR-03, ta xét 2 biến có thứ tự:
1. **Độ dài mã OTP ($Length = 6$)**:
   * Điểm biên hợp lệ (On-point): $Length = 6$.
   * Điểm biên không hợp lệ dưới (Off-point, $LB - 1$): $Length = 5$.
   * Điểm biên không hợp lệ trên (Off-point, $UB + 1$): $Length = 7$.
2. **Độ dài Mật khẩu mới ($Min = 8$)**:
   * Áp dụng phương pháp 3-value BVA:
     * $LB - 1 = 7$ ký tự $\rightarrow$ Off-point (Invalid, bị từ chối).
     * $LB = 8$ ký tự $\rightarrow$ On-point (Valid, được chấp nhận).
     * $LB + 1 = 9$ ký tự $\rightarrow$ In-bound (Valid, được chấp nhận).

### Bảng BVA Test Cases:

| #TC | Partition Tested | Dữ liệu kiểm thử cụ thể | Điểm biên phân tích | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :---: | :--- |
| **TC_FR03_BVA_01** | OTP Length < 6 | `otp`: `12345` (5 chữ số) | $LB - 1$ (Off-point) | Báo lỗi: OTP không hợp lệ (thiếu số) |
| **TC_FR03_BVA_02** | OTP Length = 6 | `otp`: `123456` (đúng 6 số mã cấp) | $LB$ (On-point) | Thành công: Chấp nhận OTP hợp lệ |
| **TC_FR03_BVA_03** | OTP Length > 6 | `otp`: `1234567` (7 chữ số) | $UB + 1$ (Off-point) | Báo lỗi: OTP không hợp lệ (thừa số) |
| **TC_FR03_BVA_04** | Password Length < 8 | `new_password`: `Adm@123` (7 ký tự) | $LB - 1$ (Off-point) | Báo lỗi: Mật khẩu tối thiểu 8 ký tự |
| **TC_FR03_BVA_05** | Password Length = 8 | `new_password`: `Admi@123` (8 ký tự) | $LB$ (On-point) | Thành công: Chấp nhận mật khẩu hợp lệ |
| **TC_FR03_BVA_06** | Password Length = 9 | `new_password`: `Admin@123` (9 ký tự) | $LB + 1$ (In-bound) | Thành công: Chấp nhận mật khẩu hợp lệ |
| **TC_FR03_BVA_07** | Password rỗng | `new_password`: `""` (0 ký tự) | Extreme lower bound | Báo lỗi: Vui lòng nhập mật khẩu mới |
