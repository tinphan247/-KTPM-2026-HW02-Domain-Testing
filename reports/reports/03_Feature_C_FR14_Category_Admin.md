# Báo cáo Kiểm thử: Feature C (Pool C) — FR-14: Quản lý Danh mục (Category CRUD)

**Học phần:** Kiểm thử Phần mềm (FIT-HCMUS)  
**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis on EShop  
**Tính năng kiểm thử:** `FR-14: Category CRUD (Web Admin & Backend API)`  
**Kỹ thuật áp dụng:** Phân hoạch tương đương (EP), Phân tích giá trị biên (BVA), Kiểm thử phân quyền truy cập (Access Control Domain)  

---

## 1. Phân tích Đặc tả Yêu cầu & Xác định Biến (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả (SRS Ground Truth)
Theo tài liệu đặc tả hệ thống `EShop` (FR-12, FR-14, SEC-03):
1. **Quy tắc Nghiệp vụ Danh mục (FR-14):**
   - Admin có thể Thêm / Xem / Xóa danh mục.
   - **Tên danh mục là bắt buộc, không được để trống** ($length \ge 1$).
2. **Quy tắc Kiểm soát Truy cập (FR-12, SEC-03):**
   - Phân hệ Admin và các API có tính ảnh hưởng dữ liệu (`POST/PUT/DELETE /api/categories`) chỉ dành cho tài khoản có `role = 'admin'`.
   - Phải kiểm tra trường `role = 'admin'` bên trong Token JWT, không chỉ kiểm tra sự tồn tại của Token.

### 1.2 Danh sách Biến Đầu vào (Inputs) & Đầu ra (Outputs)

| Tên biến | Kiểu dữ liệu | Ý nghĩa | Ràng buộc nghiệp vụ (Constraints) |
| :--- | :--- | :--- | :--- |
| `name` | String | Tên của danh mục | Bắt buộc, không để trống, $length \ge 1$, không chứa script độc hại |
| `id` (khi xóa/sửa) | Integer | ID của danh mục | Số nguyên dương, phải tồn tại trong CSDL |
| `auth_token` | JWT Token | Token xác thực người dùng | Bắt buộc phải có và phải có `role = 'admin'` |

**Kết quả đầu ra kỳ vọng (Outputs):**
- **Output 1 (Thành công):** Danh mục được tạo/cập nhật/xóa trong CSDL, giao diện cập nhật danh sách.
- **Output 2 (Lỗi dữ liệu):** Từ chối khi `name` rỗng hoặc chỉ có khoảng trắng.
- **Output 3 (Lỗi phân quyền):** Trả về HTTP 403 Forbidden nếu người dùng không phải Admin.

---

## 2. Phân hoạch Lớp Tương đương (Equivalence Partitioning - EP)

| Biến kiểm tra | Mã lớp | Mô tả lớp tương đương (Equivalence Class) | Phân loại |
| :--- | :---: | :--- | :---: |
| **Tên danh mục (`name`)** | **EC01** | Chuỗi ký tự hợp lệ ($length \ge 1$, ví dụ: "Đồ điện tử") | Valid |
| | **EC02** | Chuỗi rỗng ($length = 0$) | Invalid |
| | **EC03** | Chuỗi chỉ chứa toàn khoảng trắng (`"   "`) | Invalid |
| | **EC04** | Chuỗi chứa mã độc HTML / XSS (`<script>alert(1)</script>`) | Invalid |
| | **EC05** | Tên danh mục có độ dài cực lớn ($length > 255$) | Invalid |
| **Quyền truy cập (`role`)** | **EC06** | Tài khoản có `role = 'admin'` với Token hợp lệ | Valid |
| | **EC07** | Tài khoản có `role = 'user'` (Người dùng thường) | Invalid |
| | **EC08** | Không có Token / Token không hợp lệ | Invalid |
| **ID Danh mục khi Xóa (`id`)** | **EC09** | ID tồn tại trong CSDL và chưa có sản phẩm liên kết | Valid |
| | **EC10** | ID tồn tại nhưng đang có sản phẩm liên kết (Ràng buộc toàn vẹn) | Invalid |
| | **EC11** | ID không tồn tại trong CSDL | Invalid |

---

## 3. Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

Biên độ dài tên danh mục: $LB = 1$ ký tự, $UB = 255$ ký tự (chuẩn độ dài cột chuỗi).
- $LB - 1 = 0$: Chuỗi rỗng `""` (Điểm OFF - Invalid: Hệ thống PHẢI từ chối).
- $LB = 1$: Chuỗi 1 ký tự `"A"` (Điểm ON - Valid: Độ dài tối thiểu hợp lệ).
- $LB + 1 = 2$: Chuỗi 2 ký tự `"Ao"` (Điểm IN - Valid).
- $Nominal = 20$: Tên danh mục thông thường `"Thời trang nam nữ"` (Valid).
- $UB = 255$: Chuỗi 255 ký tự (Valid).
- $UB + 1 = 256$: Chuỗi 256 ký tự (Invalid nếu có giới hạn độ dài cột).

| STT | Điểm biên | Giá trị kiểm thử (`name`) | Dự kiến (Expected Output) |
| :---: | :---: | :---: | :--- |
| **BV01** | $LB - 1$ | `""` (0 ký tự) | Invalid (Báo lỗi: Tên danh mục không được để trống) |
| **BV02** | $LB$ | `"A"` (1 ký tự) | Valid (Tạo danh mục thành công) |
| **BV03** | $LB + 1$ | `"Ao"` (2 ký tự) | Valid (Tạo danh mục thành công) |
| **BV04** | $Nom$ | `"Gia dụng & Đời sống"` | Valid (Tạo danh mục thành công) |

---

## 4. Kiểm thử Miền Phân quyền & Tính toàn vẹn (Authorization Domain)

Thiết lập ma trận kiểm thử quyền thao tác trên danh mục:

| Yêu cầu kiểm tra | Token Role | Dữ liệu Name | Kết quả kỳ vọng | Kết quả thực tế trên SUT |
| :--- | :---: | :---: | :--- | :--- |
| Admin tạo danh mục hợp lệ | `admin` | `"Gia dụng"` | 200 OK, tạo thành công | 200 OK, tạo thành công |
| Admin tạo danh mục rỗng ($LB-1$) | `admin` | `""` | 400 Bad Request (Từ chối) | **200 OK, tạo thành công danh mục rỗng!** |
| User thường tạo danh mục | `user` | `"Hack Category"` | 403 Forbidden (Chặn user) | **200 OK, user tạo danh mục thành công!** |
| Khách vãng lai gọi API | None | `"Guest Cat"` | 401 Unauthorized | 401 Unauthorized |

---

## 5. Thiết kế Bộ Ca Kiểm thử & Kết quả Thực thi trên SUT

| #TC | Tên / Mục tiêu kiểm thử | Lớp tương đương / Điểm biên | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng (Expected) | Kết quả thực tế (Actual trên SUT) | Trạng thái (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-CAT-01** | Tạo danh mục với tên hợp lệ tại biên $LB = 1$ | EC01, BV02, EC06 | Name: `"A"`<br>Role: `admin` | Tạo thành công danh mục "A" | Tạo thành công danh mục "A" | **PASS** |
| **TC-CAT-02** | Tạo danh mục với tên rỗng $LB-1 = 0$ | EC02, BV01, EC06 | Name: `""`<br>Role: `admin` | Báo lỗi: Tên danh mục bắt buộc, không được để trống | Hệ thống chấp nhận tạo mới danh mục tên rỗng (`id=4`)! | **FAIL** |
| **TC-CAT-03** | Tạo danh mục chỉ chứa khoảng trắng | EC03, EC06 | Name: `"   "`<br>Role: `admin` | Báo lỗi tên danh mục không hợp lệ | Tạo thành công danh mục khoảng trắng | **FAIL** |
| **TC-CAT-04** | Kiểm tra phân quyền: User thường tạo danh mục | EC07, SEC-03 | Token: `role = 'user'`<br>Name: `"Hack Cat"` | Bị chặn với mã lỗi 403 Forbidden | Backend chỉ verify token hợp lệ, cho phép User tạo danh mục! | **FAIL** |
| **TC-CAT-05** | Kiểm tra phân quyền: User thường xóa danh mục | EC07, SEC-03 | Token: `role = 'user'`<br>Target: `DELETE /api/categories/1` | Bị chặn với mã lỗi 403 Forbidden | Cho phép User thường xóa danh mục hệ thống! | **FAIL** |
| **TC-CAT-06** | Xóa danh mục khi không có dialog xác nhận | FR-24 | Bấm nút "Xóa" trên UI Web Admin | Phải hiển thị modal/dialog xác nhận trước khi xóa | Xóa ngay lập tức khi vừa click, không có xác nhận! | **FAIL** |
| **TC-CAT-07** | Ràng buộc toàn vẹn: Xóa danh mục đang chứa sản phẩm | EC10 | Xóa danh mục có ID đang gắn với các sản phẩm | Báo lỗi hoặc chặn xóa danh mục đang có sản phẩm | Xóa thành công, biến các sản phẩm thành mồ côi (orphan data)! | **FAIL** |

---

## 6. Phân tích Thiếu sót của AI (AI Gap Analysis)

### 6.1 Những điểm AI bỏ sót khi sinh kiểm thử Quản lý Danh mục:
1. **Bỏ sót lỗ hổng leo quyền (Privilege Escalation - SEC-03):** AI thường mặc định kiểm tra API Admin bằng tài khoản Admin, do đó không bao giờ phát hiện ra middleware `authenticateToken` bị thiếu bước kiểm tra `req.user.role === 'admin'`.
2. **Bỏ sót lỗi biên chuỗi rỗng ($length = 0$) do thiếu ràng buộc CSDL:** Cả giao diện (thiếu thuộc tính `required`) và Backend (thiếu lệnh `if (!name) return 400`) đều không kiểm tra chuỗi rỗng, kết hợp CSDL SQLite không có `NOT NULL`, dẫn tới việc tạo ra dữ liệu rác.
3. **Bỏ sót kiểm tra toàn vẹn quan hệ (Foreign Key Integrity):** AI thường test từng bảng riêng rẽ mà bỏ qua mối quan hệ 1-N giữa Category và Product.

---

## 7. Minh chứng Kiểm thử (Defect Evidence & Screenshots)

Toàn bộ minh chứng được lưu trữ tại thư mục `screenshots/F14/` gồm 2 nhóm ảnh chuẩn hóa (VS Code IDE Code Card & Thực tế UI/CSDL):

| Mã Bug | Tên Lỗi Phát Hiện | Minh Chứng Mã Lỗi (VS Code IDE) | Minh Chứng Thực Tế (UI / CSDL) |
| :---: | :--- | :--- | :--- |
| **`BUG-FR14-01`**<br>(`BUG-08`) | Tạo danh mục tên rỗng ($LB-1$) & khoảng trắng | `screenshots/F14/BUG-FR14-01_Code.png` | `screenshots/F14/BUG-FR14-01_UI.png` |
| **`BUG-FR14-02`**<br>(`BUG-09`) | Lỗ hổng leo quyền BOLA (User tạo/xóa category) | `screenshots/F14/BUG-FR14-02_Code.png` | `screenshots/F14/BUG-FR14-02_UI.png` |
| **`BUG-FR14-03`**<br>(`BUG-10`) | Thiếu dialog xác nhận xóa & Mồ côi dữ liệu CSDL | `screenshots/F14/BUG-FR14-03_Code.png` | `screenshots/F14/BUG-FR14-03_UI.png`<br>`screenshots/F14/BUG-FR14-03_DB.png` |

> **Ghi chú về quy ước đặt tên:** Toàn bộ tệp hình ảnh được chuẩn hóa đồng nhất theo mã phân hệ tương tự F01 và F09:
> - `BUG-FR14-01_*.png` (tương ứng `BUG-08` trong Báo cáo Tổng hợp).
> - `BUG-FR14-02_*.png` (tương ứng `BUG-09` trong Báo cáo Tổng hợp).
> - `BUG-FR14-03_*.png` (tương ứng `BUG-10` trong Báo cáo Tổng hợp).
> - Các ảnh chụp thô quá trình test (`TC04` $\to$ `TC12`) được lưu giữ tại thư mục `screenshots/F14/raw_test_cases/`.

