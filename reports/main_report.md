# BÁO CÁO KIỂM THỬ: MAIN TEST REPORT (HW02)
## Môn học: Kiểm thử phần mềm (Software Testing)
> **Sinh viên thực hiện**: **Trần Vũ Quang**  
> **Mã số sinh viên (MSSV)**: **23120346**  
> **Hệ thống kiểm thử (SUT)**: EShop E-Commerce System  
> **Repository GitHub**: [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing)  
> **Branch**: [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/tree/hw02-23120346](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/tree/hw02-23120346)

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

---

# PHẦN 2: POOL B — FR-07: GIỎ HÀNG (SHOPPING CART)

## 2.1. Khảo sát Đặc tả Yêu cầu Nghiệp vụ (System Specification)
Theo tài liệu đặc tả của hệ thống (`eshop-sut/README.md`):
* **Hiển thị danh sách sản phẩm**: Các cột bắt buộc: **Sản phẩm**, **Đơn giá**, **Số lượng** (có nút +/- để chỉnh), **Thành tiền**, **Thao tác**.
* **Thêm sản phẩm trùng**: Thêm cùng một sản phẩm vào giỏ sẽ **tăng số lượng, không tạo dòng mới**.
* **Xóa sản phẩm**: Nút **Xóa sản phẩm** phải có **dialog xác nhận** trước khi thực hiện.
* **Điều hướng**: Có nút **Tiếp tục mua sắm** để quay về trang chủ.
* **Nhãn tổng tiền**: Tổng tiền hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính").
* **Trạng thái rỗng**: Giỏ hàng trống phải có **hình minh họa** và thông báo rõ ràng.

---

## 2.2. Áp dụng Kỹ thuật Domain Testing (Kiểm thử Miền giá trị)

### Step 1: Identify Input & Output Variables
1. **Inputs**:
   * $Input_1$ (`product_selection`): Chọn sản phẩm thêm vào giỏ (ID, Tên, Đơn giá).
   * $Input_2$ (`quantity`): Số lượng đặt mua, kiểu số nguyên dương $\ge 1$.
   * $Input_3$ (`add_action`): Hành vi thêm sản phẩm: sản phẩm mới vs sản phẩm đã có trong giỏ.
   * $Input_4$ (`delete_action`): Nhấn nút Xóa sản phẩm $\rightarrow$ phản hồi trên Dialog xác nhận (Confirm / Cancel).
2. **Outputs**:
   * *Output hiển thị*: Bảng giỏ hàng với danh sách sản phẩm, Đơn giá, Số lượng, Thành tiền từng món ($Thành\,tiền = Đơn\,giá \times Số\,lượng$), Tổng cộng ($Tổng = \sum Thành\,tiền$).
   * *Output thao tác*: Cập nhật số lượng khi thêm trùng, hiển thị Dialog xác nhận khi xóa, xóa khỏi danh sách khi xác nhận.

### Step 2: Identify Equivalence Classes (Xác định các Lớp Tương Đương)

| STT | Biến / Điều kiện kiểm tra | Valid Equivalence Classes ($EP_V$) | Invalid Equivalence Classes ($EP_I$) |
| :---: | :--- | :--- | :--- |
| **1** | **`cart_status`: Trạng thái giỏ** | **EC1**: Giỏ hàng có $\ge 1$ sản phẩm | **EC2**: Giỏ hàng trống (0 sản phẩm) |
| **2** | **`quantity`: Số lượng thêm** | **EC3**: Số nguyên dương ($N \ge 1$) | **EC4**: Số lượng = 0<br>**EC5**: Số lượng âm ($N < 0$)<br>**EC6**: Không phải số (ký tự chữ, rỗng) |
| **3** | **`add_behavior`: Sản phẩm trùng** | **EC7**: Thêm sản phẩm mới (chưa có trong giỏ)<br>**EC8**: Thêm sản phẩm đã có sẵn trong giỏ (tăng số lượng) | |
| **4** | **`delete_behavior`: Xác nhận xóa** | **EC9**: Bấm Xóa $\rightarrow$ Chọn Đồng ý (Xác nhận xóa)<br>**EC10**: Bấm Xóa $\rightarrow$ Chọn Hủy bỏ (Không xóa) | |
| **5** | **`total_label`: Nhãn tổng tiền** | **EC11**: Hiển thị nhãn chuẩn "Tổng cộng" | **EC12**: Hiển thị nhãn sai "Tổng tạm tính" |

### Step 3: Selecting Test Cases (Thiết kế Bộ Test Cases Miền Giá Trị)

| Test Case ID | Partitions Covered | Dữ liệu & Kịch bản kiểm thử | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :--- |
| **TC_FR07_DT_01** | EC1, EC3, EC7, EC11 | Thêm sản phẩm "Áo thun nam basic", giá 150.000 ₫, sl: 1 | Giỏ hàng hiển thị 1 dòng, Đơn giá 150.000 ₫, SL 1, Thành tiền 150.000 ₫, Tổng cộng: 150.000 ₫ |
| **TC_FR07_DT_02** | EC2 | Truy cập giỏ hàng khi chưa có sản phẩm nào | Hiển thị thông báo rỗng kèm hình ảnh minh họa và link Tiếp tục mua sắm |
| **TC_FR07_DT_03** | EC4 (SL = 0) | Nhập số lượng = 0 tại trang chi tiết rồi thêm vào giỏ | Hệ thống từ chối hoặc báo lỗi số lượng tối thiểu là 1 |
| **TC_FR07_DT_04** | EC5 (SL < 0) | Gửi số lượng âm (-5) vào giỏ hàng | Hệ thống từ chối, không cho phép số lượng âm |
| **TC_FR07_DT_05** | EC8 (Thêm trùng) | Thêm sản phẩm "iPhone 15 Pro Max" lần 1 (sl: 1), sau đó thêm tiếp lần 2 (sl: 1) | **Không tạo dòng mới**; dòng iPhone 15 Pro Max tự động tăng số lượng lên 2 |
| **TC_FR07_DT_06** | EC9 (Xóa có xác nhận) | Bấm "Xóa" một sản phẩm trong giỏ $\rightarrow$ Hộp thoại hỏi xác nhận xuất hiện $\rightarrow$ Chọn OK | Sản phẩm được xóa khỏi giỏ, cập nhật lại Tổng cộng |
| **TC_FR07_DT_07** | EC10 (Hủy xác nhận xóa)| Bấm "Xóa" $\rightarrow$ Chọn Cancel trên Dialog | Sản phẩm được giữ nguyên trong giỏ |

---

## 2.3. Áp dụng Kỹ thuật Boundary Value Analysis (BVA)

### Step 4: Boundary Value Analysis
Phân tích giá trị biên đối với biến **Số lượng (`quantity`)**:
* Ràng buộc nghiệp vụ: $quantity \ge 1$ (Số nguyên dương).
* Biên dưới: $Min = 1$.
* Áp dụng phương pháp 3-value BVA:
  * $LB - 1 = 0$ $\rightarrow$ Off-point (Invalid, bị từ chối).
  * $LB = 1$ $\rightarrow$ On-point (Valid, chấp nhận mức tối thiểu).
  * $LB + 1 = 2$ $\rightarrow$ In-bound (Valid, chấp nhận bình thường).
  * Giá trị cực trị âm: $quantity = -1$ (Extreme off-point, Invalid).

### Bảng BVA Test Cases cho FR-07:

| #TC | Partition Tested | Dữ liệu kiểm thử (`quantity`) | Điểm biên phân tích | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :---: | :--- |
| **TC_FR07_BVA_01** | Quantity = 0 | `quantity`: `0` | $LB - 1$ (Off-point) | Báo lỗi: Số lượng tối thiểu là 1 |
| **TC_FR07_BVA_02** | Quantity = 1 | `quantity`: `1` | $LB$ (On-point) | Thành công: Thêm 1 sản phẩm vào giỏ |
| **TC_FR07_BVA_04** | Quantity < 0 | `quantity`: `-1` | Extreme Off-point | Báo lỗi: Số lượng không hợp lệ |

---

# PHẦN 3: POOL C — FR-15: QUẢN LÝ SẢN PHẨM (PRODUCT CRUD)

## 3.1. Khảo sát Đặc tả Yêu cầu Nghiệp vụ (System Specification)
Theo tài liệu đặc tả của hệ thống (`eshop-sut/README.md`):
* **Quyền hạn truy cập**: Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`. Mọi API `POST/PUT/DELETE /api/products` bắt buộc phải có Token JWT hợp lệ và quyền Admin (FR-12 & SEC-02).
* **Ràng buộc đầu vào Sản phẩm:**
  * **Tên sản phẩm**: bắt buộc, tối đa 255 ký tự.
  * **Giá**: bắt buộc, phải là số **dương** (> 0).
  * **Danh mục**: bắt buộc, phải chọn từ danh sách danh mục có sẵn trong hệ thống.
* **Quy tắc Sửa sản phẩm**: Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên.
* **Tính an toàn**: Tìm kiếm sản phẩm không được dính lỗi XSS và SQL Injection.

---

## 3.2. Áp dụng Kỹ thuật Domain Testing (Kiểm thử Miền giá trị)

### Step 1: Identify Input & Output Variables
1. **Inputs**:
   * $Input_1$ (`name`): Chuỗi văn bản, bắt buộc ($1 \le length \le 255$).
   * $Input_2$ (`price`): Kiểu số nguyên, bắt buộc, số dương ($price > 0$).
   * $Input_3$ (`category_id`): Mã danh mục, bắt buộc, phải tồn tại trong bảng `categories`.
   * $Input_4$ (`user_role`): Quyền người dùng gửi yêu cầu (Admin vs User vs Anonymous).
2. **Outputs**:
   * *Output thành công*: Tạo/Sửa/Xóa sản phẩm thành công, trả về HTTP 200/201 kèm ID sản phẩm, cập nhật CSDL SQLite.
   * *Output lỗi*: Từ chối thao tác, trả về HTTP 400 (Bad Request khi dữ liệu sai ràng buộc), HTTP 401 (Unauthorized khi thiếu Token), HTTP 403 (Forbidden khi không đủ quyền Admin).

### Step 2: Identify Equivalence Classes (Xác định các Lớp Tương Đương)

| STT | Biến / Điều kiện kiểm tra | Valid Equivalence Classes ($EP_V$) | Invalid Equivalence Classes ($EP_I$) |
| :---: | :--- | :--- | :--- |
| **1** | **`name`: Trạng thái rỗng** | **EC1**: Chuỗi có độ dài $\ge 1$ | **EC2**: Chuỗi rỗng `""`<br>**EC3**: Chuỗi toàn khoảng trắng `"   "` |
| **2** | **`name`: Độ dài tối đa** | **EC4**: Độ dài $\le 255$ ký tự | **EC5**: Độ dài $> 255$ ký tự |
| **3** | **`price`: Miền giá trị** | **EC6**: Số dương ($price > 0$) | **EC7**: Bằng 0 ($price = 0$)<br>**EC8**: Số âm ($price < 0$)<br>**EC9**: Không phải số (`"abc"`, `null`) |
| **4** | **`category_id`: Ràng buộc FK** | **EC10**: Danh mục có trong DB (ID 1, 2, 3) | **EC11**: ID không tồn tại (`99999`) |
| **5** | **`auth`: Kiểm soát truy cập** | **EC12**: Token hợp lệ có `role = 'admin'` | **EC13**: Không gửi Token (Anonymous)<br>**EC14**: Token của người dùng thường (`role = 'user'`) |
| **6** | **`update_scope`: Phạm vi sửa** | **EC15**: Chỉ cập nhật 1 sản phẩm chỉ định | **EC16**: Cập nhật lan truyền sang sản phẩm khác |

### Step 3: Selecting Test Cases (Thiết kế Bộ Test Cases Miền Giá Trị)

| Test Case ID | Partitions Covered | Dữ liệu & Kịch bản kiểm thử | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :--- |
| **TC_FR15_DT_01** | EC1, EC4, EC6, EC10, EC12 (All Valid) | Admin tạo sản phẩm: `name: "Chuột không dây Logitech"`, `price: 450000`, `category_id: 3` | Tạo thành công, lưu vào CSDL, HTTP 200 |
| **TC_FR15_DT_02** | EC2 (`name` rỗng) | `name: ""` | Báo lỗi: Tên sản phẩm là bắt buộc |
| **TC_FR15_DT_03** | EC3 (`name` khoảng trắng) | `name: "     "` | Báo lỗi: Tên sản phẩm không hợp lệ |
| **TC_FR15_DT_04** | EC5 (`name` > 255 ký tự) | `name`: Chuỗi dài 300 ký tự | Báo lỗi: Tên sản phẩm tối đa 255 ký tự |
| **TC_FR15_DT_05** | EC7 (`price` = 0) | `price: 0` | Báo lỗi: Giá phải lớn hơn 0 |
| **TC_FR15_DT_06** | EC8 (`price` < 0) | `price: -50000` | Báo lỗi: Giá không thể là số âm |
| **TC_FR15_DT_07** | EC9 (`price` không phải số) | `price: "abc"` | Báo lỗi: Giá phải là kiểu số |
| **TC_FR15_DT_08** | EC11 (`category_id` ảo) | `category_id: 99999` | Báo lỗi: Danh mục không tồn tại |
| **TC_FR15_DT_09** | EC13 (Không có token) | POST/PUT/DELETE không Authorization | Trả về HTTP 401 Unauthorized |
| **TC_FR15_DT_10** | EC14 (User thường gọi) | Token có `role = 'user'` | Trả về HTTP 403 Forbidden |
| **TC_FR15_DT_11** | EC15 (Sửa độc lập) | Sửa sản phẩm ID=1 thành "iPhone 15 VIP" | Chỉ sản phẩm ID=1 đổi tên, các sản phẩm khác giữ nguyên |

---

## 3.3. Áp dụng Kỹ thuật Boundary Value Analysis (BVA)

### Step 4: Boundary Value Analysis
Phân tích giá trị biên đối với 2 biến định lượng:
1. **Giá tiền (`price` - Biên dưới $LB = 1$ ₫)**:
   * Áp dụng 3-value BVA:
     * $LB - 1 = 0$ ₫ $\rightarrow$ Off-point (Invalid, bị từ chối).
     * $LB = 1$ ₫ $\rightarrow$ On-point (Valid, chấp nhận mức giá tối thiểu).
     * $LB + 1 = 2$ ₫ $\rightarrow$ In-bound (Valid, chấp nhận bình thường).
     * Giá trị cực trị âm: $price = -1$ ₫ hoặc $-50.000$ ₫ (Extreme Off-point).
2. **Độ dài Tên sản phẩm (`name` - Biên trên $UB = 255$ ký tự)**:
   * Áp dụng 3-value BVA:
     * $UB - 1 = 254$ ký tự $\rightarrow$ In-bound (Valid, chấp nhận).
     * $UB = 255$ ký tự $\rightarrow$ On-point (Valid, chấp nhận độ dài tối đa).
     * $UB + 1 = 256$ ký tự $\rightarrow$ Off-point (Invalid, bị từ chối do quá dài).

### Bảng BVA Test Cases cho FR-15:

| #TC | Partition Tested | Dữ liệu kiểm thử cụ thể | Điểm biên phân tích | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :---: | :--- |
| **TC_FR15_BVA_01** | Price = 0 | `price: 0` | $LB - 1$ (Off-point) | Báo lỗi: Giá phải lớn hơn 0 |
| **TC_FR15_BVA_02** | Price = 1 | `price: 1` | $LB$ (On-point) | Thành công: Chấp nhận giá tối thiểu 1 ₫ |
| **TC_FR15_BVA_03** | Price = 2 | `price: 2` | $LB + 1$ (In-bound) | Thành công: Chấp nhận giá 2 ₫ |
| **TC_FR15_BVA_04** | Price < 0 | `price: -1` | Extreme Off-point | Báo lỗi: Giá không thể âm |
| **TC_FR15_BVA_05** | Name length = 254 | `name`: Chuỗi dài 254 ký tự | $UB - 1$ (In-bound) | Thành công: Chấp nhận tên 254 ký tự |
| **TC_FR15_BVA_06** | Name length = 255 | `name`: Chuỗi dài 255 ký tự | $UB$ (On-point) | Thành công: Chấp nhận tên 255 ký tự |
| **TC_FR15_BVA_07** | Name length = 256 | `name`: Chuỗi dài 256 ký tự | $UB + 1$ (Off-point) | Báo lỗi: Tên vượt quá 255 ký tự |

---

# PHẦN 4: POOL D (MOBILE) — FR-04 MOBILE: QUẢN LÝ HỒ SƠ CÁ NHÂN (PROFILE MANAGEMENT)

## 4.1. Khảo sát Đặc tả Yêu cầu Nghiệp vụ (System Specification)
Theo tài liệu đặc tả của hệ thống (`eshop-sut/README.md`):
* **Người dùng đã đăng nhập** có thể cập nhật: **Họ Tên**, **Số điện thoại**, **Địa chỉ giao hàng mặc định**.
* **Ràng buộc Số điện thoại hợp lệ**: bắt đầu bằng số `0`, từ **10–11 chữ số**.
* **Bảo vệ Email**: Email không được phép thay đổi qua giao diện.
* **Quyền hạn**: Người dùng chỉ có thể cập nhật hồ sơ của chính mình; **không thể tự thay đổi thuộc tính `role`**.

---

## 4.2. Áp dụng Kỹ thuật Domain Testing (Kiểm thử Miền giá trị)

### Step 1: Identify Input & Output Variables
1. **Inputs**:
   * $Input_1$ (`name`): Chuỗi văn bản họ tên người dùng.
   * $Input_2$ (`phone`): Chuỗi ký tự số điện thoại, bắt buộc bắt đầu bằng `0`, độ dài $10 \le length \le 11$.
   * $Input_3$ (`shipping_address`): Chuỗi địa chỉ giao hàng.
   * $Input_4$ (`role`): Thuộc tính phân quyền (`user` vs `admin`), cấm client tự ý sửa đổi.
2. **Outputs**:
   * *Output thành công*: Cập nhật thông tin thành công vào CSDL SQLite, trả về HTTP 200, hiển thị Alert thông báo thành công trên app Mobile.
   * *Output lỗi*: Thông báo lỗi khi số điện thoại sai định dạng, chặn mọi nỗ lực can thiệp sửa đổi trường `role`.

### Step 2: Identify Equivalence Classes (Xác định các Lớp Tương Đương)

| STT | Biến / Điều kiện kiểm tra | Valid Equivalence Classes ($EP_V$) | Invalid Equivalence Classes ($EP_I$) |
| :---: | :--- | :--- | :--- |
| **1** | **`phone`: Ký tự đầu tiên** | **EC1**: Bắt đầu bằng số `0` | **EC2**: Bắt đầu bằng số khác (`1-9`)<br>**EC3**: Chứa ký tự chữ hoặc đặc biệt |
| **2** | **`phone`: Độ dài chữ số** | **EC4**: Độ dài 10 chữ số<br>**EC5**: Độ dài 11 chữ số | **EC6**: Độ dài < 10 chữ số<br>**EC7**: Độ dài > 11 chữ số |
| **3** | **`role`: Thuộc tính phân quyền**| **EC8**: Giữ nguyên role của phiên đăng nhập | **EC9**: Gửi kèm `role: "admin"` nhằm leo quyền |
| **4** | **`address`: Đồng bộ trường** | **EC10**: Dữ liệu lưu đúng cột `shipping_address` | **EC11**: Lệch tên trường dẫn đến `null` |

### Step 3: Selecting Test Cases (Thiết kế Bộ Test Cases Miền Giá Trị)

| Test Case ID | Partitions Covered | Dữ liệu kiểm thử (`phone`, `name`, `address`) | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :--- |
| **TC_FR04_DT_01** | EC1, EC4, EC8, EC10 (Valid 10 số) | `phone`: `"0901234567"` (10 số, đầu 0), `name`: `"Nguyễn Văn A"`, `address`: `"123 Lê Lợi"` | Cập nhật thành công, lưu vào CSDL, HTTP 200 |
| **TC_FR04_DT_02** | EC1, EC5, EC8 (Valid 11 số) | `phone`: `"01234567890"` (11 số, đầu 0) | Cập nhật thành công, lưu vào CSDL |
| **TC_FR04_DT_03** | EC2 (Đầu khác 0) | `phone`: `"9012345678"` (không có số 0 ở đầu) | Báo lỗi: Số điện thoại phải bắt đầu bằng số 0 |
| **TC_FR04_DT_04** | EC3 (Chứa chữ cái) | `phone`: `"0901234ABC"` | Báo lỗi: Số điện thoại chỉ chứa chữ số |
| **TC_FR04_DT_05** | EC6 (Độ dài < 10) | `phone`: `"09012345"` (8 chữ số) | Báo lỗi: Số điện thoại phải từ 10-11 chữ số |
| **TC_FR04_DT_06** | EC7 (Độ dài > 11) | `phone`: `"090123456789"` (12 chữ số) | Báo lỗi: Số điện thoại không vượt quá 11 số |
| **TC_FR04_DT_07** | EC9 (Cố tình leo quyền) | Body request gửi kèm `{ role: "admin" }` | Hệ thống bỏ qua hoặc từ chối, không đổi role thành admin |

---

## 4.3. Áp dụng Kỹ thuật Boundary Value Analysis (BVA)

### Step 4: Boundary Value Analysis
Phân tích giá trị biên đối với biến **Độ dài số điện thoại (`phone length` trong khoảng [10, 11] chữ số)**:
* Biên dưới: $LB = 10$.
* Biên trên: $UB = 11$.
* Áp dụng 3-value BVA:
  * Điểm biên dưới $LB - 1 = 9$ chữ số $\rightarrow$ Off-point (Invalid, bị từ chối).
  * Điểm biên dưới $LB = 10$ chữ số $\rightarrow$ On-point (Valid, chấp nhận).
  * Điểm biên trên $UB = 11$ chữ số $\rightarrow$ On-point (Valid, chấp nhận).
  * Điểm biên trên $UB + 1 = 12$ chữ số $\rightarrow$ Off-point (Invalid, bị từ chối).

### Bảng BVA Test Cases cho FR-04 Mobile:

| #TC | Partition Tested | Dữ liệu kiểm thử cụ thể | Điểm biên phân tích | Kết quả mong đợi (Expected Output) |
| :---: | :--- | :--- | :---: | :--- |
| **TC_FR04_BVA_01** | Phone length = 9 | `phone`: `"090123456"` (9 số) | $LB - 1$ (Off-point) | Báo lỗi: Số điện thoại tối thiểu 10 chữ số |
| **TC_FR04_BVA_02** | Phone length = 10 | `phone`: `"0901234567"` (10 số) | $LB$ (On-point) | Thành công: Chấp nhận số điện thoại 10 số |
| **TC_FR04_BVA_03** | Phone length = 11 | `phone`: `"01234567890"` (11 số) | $UB$ (On-point) | Thành công: Chấp nhận số điện thoại 11 số |
| **TC_FR04_BVA_04** | Phone length = 12 | `phone`: `"012345678901"` (12 số) | $UB + 1$ (Off-point) | Báo lỗi: Số điện thoại tối đa 11 chữ số |
| **TC_FR04_BVA_05** | Phone rỗng | `phone`: `""` (0 số) | Extreme lower bound | Báo lỗi: Vui lòng nhập số điện thoại |



