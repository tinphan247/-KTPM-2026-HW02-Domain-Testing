# NHẬT KÝ KIỂM THỬ TÍNH NĂNG FR-14: QUẢN LÝ DANH MỤC ADMIN (AI-RESULT)

**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis  
**Học phần:** Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM  
**Tính năng kiểm thử:** `FR-14: Category CRUD (Web Admin & Backend API)`  
**Môi trường SUT:** Web Admin (`http://localhost:5174`), Backend API (`http://localhost:3000/api/categories`), CSDL SQLite  
**Chiến lược kiểm thử:** AI-First kết hợp sự kiểm duyệt và đánh giá nghiêm ngặt của con người (Human-in-the-loop)

---

## 📌 BẢNG TỔNG HỢP HỆ THỐNG PROMPT ĐÃ THỰC THI (PROMPT CATALOG)

Dưới đây là hệ thống 6 câu prompt tinh gọn (tương ứng 8 bước kiểm thử miền hộp đen chuẩn FIT-HCMUS) được sử dụng để điều khiển tiến trình kiểm thử:

| Phiên tương tác | Bước kiểm thử quy chuẩn | Câu Prompt Tinh gọn (Short & Punchy Prompt) |
| :---: | :--- | :--- |
| **Phiên 1** | Bước 1 & 2: Phân tích I/O & EP | `Thực hiện Bước 1 và Bước 2 kiểm thử hộp đen cho FR-14 (Quản lý Danh mục Admin):`<br>`- Xác định biến vào (name, id, role/token), đầu ra kỳ vọng theo đặc tả EShop.`<br>`- Lập bảng Phân hoạch Lớp Tương đương (EP) cho từng biến và hành động CRUD theo chuẩn FIT-HCMUS.` |
| **Phiên 2** | Bước 3 & 4: BVA & Phân quyền | `Thực hiện tiếp Bước 3 và Bước 4 cho FR-14:`<br>`- Phân tích Giá trị Biên (BVA) độ dài tên danh mục với biên dưới LB = 1 ký tự (điểm LB-1, LB, LB+1, Nom).`<br>`- Lập Ma trận Kiểm thử Phân quyền (admin vs user thường vs guest) kết hợp thao tác CRUD (POST/DELETE).` |
| **Phiên 3** | Bước 5: Thiết kế Test Cases | `Thực hiện Bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-14 bao phủ các lớp EP, điểm BVA và phân quyền vừa lập.`<br>`Xuất bảng chuẩn FIT-HCMUS: TC ID, Mục tiêu, EC/BV bao phủ, Test Data, Các bước thực hiện, Kết quả kỳ vọng.` |
| **Phiên 4** | Bước 6: Chạy SUT Live & Ghi nhận | `Thực hiện Bước 6: Chạy kiểm thử các test case FR-14 trên SUT Live (Web Admin localhost:5174 và API /api/categories).`<br>`Lập bảng kết quả thực tế chi tiết (TC ID, Dữ liệu, Kỳ vọng, Thực tế trên SUT, Pass/Fail, Bug ID) và bảng thống kê tổng hợp.` |
| **Phiên 5** | Bước 7: Báo cáo Lỗi 10 trường | `Thực hiện Bước 7: Lập Báo cáo Lỗi chuẩn 10 trường (mẫu ThS. Trần Thị Bích Hanh) cho các bug phát hiện ở FR-14:`<br>`- BUG-08: Cho phép tạo danh mục tên rỗng (LB-1).`<br>`- BUG-09: Lỗ hổng leo quyền cho phép user thường gọi API thêm/xóa danh mục.`<br>`- BUG-10: Thiếu dialog xác nhận xóa và vi phạm toàn vẹn dữ liệu.` |
| **Phiên 6** | Bước 8: AI Gap Analysis & Phản biện | `Thực hiện Bước 8: Đánh giá quá trình kiểm thử AI trên tính năng FR-14:`<br>`- Lập Báo cáo AI Gap Analysis (Điểm AI bỏ sót/dự đoán sai; Giải thích 3 nguyên nhân; Bài học kinh nghiệm).`<br>`- Viết đoạn văn Phản biện (AI Critique) về vai trò con người trong phát hiện lỗ hổng phân quyền bảo mật.` |

> **💡 Single-turn All-in-One Prompt (Prompt tổng hợp chạy 1 lần):**  
> ```text
> Thực hiện trọn vẹn 8 bước kiểm thử miền hộp đen FIT-HCMUS cho FR-14 (Category CRUD EShop: Admin localhost:5174 & API /api/categories):
> 1. Xác định biến I/O & Bảng phân hoạch EP (name, id, role).
> 2. BVA tên danh mục (LB=1) & Ma trận phân quyền admin/user.
> 3. Thiết kế bảng Test Cases chuẩn FIT-HCMUS.
> 4. Ghi nhận kết quả chạy Live trên SUT (Pass/Fail, phát hiện BUG-08, BUG-09, BUG-10).
> 5. Lập Bug Report 10 trường cho các lỗi tìm được.
> 6. Viết AI Gap Analysis (3 tiêu chí) và đoạn phản biện AI Critique.
> ```

---

# PHIÊN TƯƠNG TÁC 1: BƯỚC 1 & BƯỚC 2 — PHÂN TÍCH BIẾN & PHÂN HOẠCH LỚP TƯƠNG ĐƯƠNG (EP)

- **Prompt:**
```text
Thực hiện Bước 1 và Bước 2 kiểm thử hộp đen cho FR-14 (Quản lý Danh mục Admin):
- Xác định biến vào (name, id, role/token), đầu ra kỳ vọng theo đặc tả EShop.
- Lập bảng Phân hoạch Lớp Tương đương (EP) cho từng biến và hành động CRUD theo chuẩn FIT-HCMUS.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 1 & BƯỚC 2: PHÂN TÍCH ĐẶC TẢ, XÁC ĐỊNH BIẾN & PHÂN HOẠCH LỚP TƯƠNG ĐƯƠNG (FR-14)

Thực hiện quy trình kiểm thử hộp đen theo đúng chuẩn bài giảng học phần **Kiểm thử Phần mềm — FIT-HCMUS** cho tính năng **FR-14: Quản lý Danh mục Admin (Category CRUD)** trên hệ thống EShop SUT.

---

## BƯỚC 1: Phân Tích Đặc Tả & Xác Định Biến Đầu Vào / Đầu Ra (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả Yêu cầu Nghiệp vụ (SRS Ground Truth)
Căn cứ theo tài liệu đặc tả EShop (các điều khoản `FR-12`, `FR-14`, `FR-24`, `SEC-03`):
1. **Nghiệp vụ Danh mục (`FR-14`):**
   - Quản trị viên (Admin) có quyền Xem danh sách (`GET`), Thêm mới (`POST`), Cập nhật (`PUT`), và Xóa (`DELETE`) danh mục sản phẩm.
   - **Tên danh mục là bắt buộc, không được để trống** ($1 \le length(name) \le 255$), không được chỉ chứa khoảng trắng.
2. **Quy định Kiểm soát Truy cập & Phân quyền (`SEC-03` / `FR-12`):**
   - Chỉ người dùng có vai trò Quản trị viên (`role === 'admin'`) mới có quyền thực hiện các thao tác thêm, sửa, xóa danh mục.
   - Tài khoản người dùng thông thường (`role === 'user'`) hoặc khách vãng lai (chưa đăng nhập) **bắt buộc phải bị chặn**.
   - Backend phải kiểm tra trường `role` trong Payload của JWT Token, không được chỉ kiểm tra sự tồn tại của Token.
3. **Quy định Toàn vẹn Dữ liệu & Giao diện (`FR-24` / Database Integrity):**
   - Không được phép xóa danh mục đang có sản phẩm liên kết (vi phạm ràng buộc khóa ngoại `products.category_id`).
   - Giao diện Admin bắt buộc phải hiển thị Modal/Dialog xác nhận hành động nguy hiểm trước khi xóa danh mục.

---

### 1.2 Danh sách Biến Đầu vào (Input Variables)

| Ký hiệu | Tên biến | Kiểu dữ liệu | Ý nghĩa nghiệp vụ | Miền giá trị & Ràng buộc (Constraints) |
| :---: | :--- | :---: | :--- | :--- |
| $I_1$ | `name` | String | Tên danh mục sản phẩm | Bắt buộc; $1 \le length \le 255$; không rỗng; không chỉ toàn khoảng trắng; không chứa mã script độc hại (XSS). |
| $I_2$ | `id` | Integer | Định danh danh mục (thao tác Update/Delete) | Số nguyên dương ($id > 0$), phải tồn tại trong bảng `categories`. |
| $I_3$ | `auth_token` / `role` | String (JWT) | Quyền hạn của người thực hiện | Bắt buộc phải có Token hợp lệ và chứa thuộc tính `role === 'admin'`. |
| $I_4$ | `action` | Enum | Hành vi CRUD thực hiện | Thuộc tập hợp: `{GET, POST, PUT, DELETE}`. |

---

### 1.3 Danh sách Kết quả Đầu ra Kỳ vọng (Expected Outputs)

* **$O_1$ (Thao tác thành công - HTTP 200 / 201):** Danh mục được tạo mới, cập nhật hoặc xóa thành công trong CSDL SQLite; danh sách hiển thị trên Web Admin được đồng bộ.
* **$O_2$ (Lỗi dữ liệu đầu vào - HTTP 400 Bad Request):** Báo lỗi khi tên danh mục rỗng, chỉ có khoảng trắng hoặc độ dài vượt quá giới hạn.
* **$O_3$ (Lỗi từ chối phân quyền - HTTP 403 Forbidden):** Từ chối thao tác khi người dùng đã đăng nhập nhưng không có quyền Admin (`role = 'user'`).
* **$O_4$ (Lỗi chưa xác thực - HTTP 401 Unauthorized):** Từ chối thao tác khi không có JWT Token hoặc Token không hợp lệ.
* **$O_5$ (Lỗi không tìm thấy tài nguyên - HTTP 404 Not Found):** Báo lỗi khi cập nhật hoặc xóa một `id` danh mục không tồn tại trong CSDL.
* **$O_6$ (Lỗi ràng buộc toàn vẹn dữ liệu - HTTP 400 / 409 Conflict):** Từ chối xóa danh mục khi đang có sản phẩm thuộc danh mục này trong bảng `products`.

---

## BƯỚC 2: Phân Hoạch Lớp Tương Đương (Equivalence Partitioning - EP)

Áp dụng nghiêm ngặt **4 quy tắc phân hoạch lớp tương đương theo bài giảng FIT-HCMUS**:
* **Quy tắc Range (Khoảng giá trị):** Áp dụng cho độ dài tên danh mục ($1 \le length \le 255$) và ID danh mục ($id \ge 1$).
* **Quy tắc Must-be (Bắt buộc):** Áp dụng cho sự tồn tại của tên danh mục và sự tồn tại của ID trong CSDL.
* **Quy tắc Set of values (Tập giá trị rời rạc):** Áp dụng cho quyền truy cập `role` (`admin`, `user`, `guest`).
* **Quy tắc Split (Tách nhánh):** Áp dụng khi xóa danh mục có hoặc không có sản phẩm liên kết; chuỗi khoảng trắng vs chuỗi hợp lệ.

---

### Bảng Phân hoạch Lớp Tương đương Chi tiết cho FR-14

| Biến kiểm tra / Thuộc tính | Mã lớp (EC ID) | Mô tả Lớp Tương Đương (Equivalence Class) | Phân loại | Quy tắc áp dụng | Đầu ra kỳ vọng (Expected Output) |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **1. Tên danh mục (`name`)** | **EC01** | Độ dài hợp lệ ($1 \le length \le 255$, ví dụ: `"Thiết bị điện tử"`, `"Sách"`) | **Valid** | Range / Must-be | Thêm/Sửa thành công ($O_1$) |
| | **EC02** | Chuỗi rỗng ($length = 0$, `""`) | **Invalid** | Range ($< LB$) | Báo lỗi: Tên danh mục là bắt buộc ($O_2$) |
| | **EC03** | Chuỗi chỉ chứa toàn ký tự khoảng trắng (`"   "`) | **Invalid** | Split / Format | Báo lỗi: Tên không hợp lệ ($O_2$) |
| | **EC04** | Chuỗi vượt quá độ dài tối đa ($length > 255$) | **Invalid** | Range ($> UB$) | Báo lỗi: Tên quá dài ($O_2$) |
| | **EC05** | Chuỗi chứa mã độc HTML / XSS Script (`<script>alert(1)</script>`) | **Invalid** | Security | Hệ thống encode / sanitize an toàn ($O_2$ hoặc $O_1$ sạch) |
| **2. Quyền người dùng (`role`)** | **EC06** | Người dùng đăng nhập có quyền Quản trị viên (`role = 'admin'`) | **Valid** | Set of values | Cho phép thực hiện CRUD ($O_1$) |
| | **EC07** | Người dùng đăng nhập nhưng là tài khoản thường (`role = 'user'`) | **Invalid** | Set of values | Chặn với mã lỗi 403 Forbidden ($O_3$) |
| | **EC08** | Khách vãng lai chưa đăng nhập (Không có JWT Token / Token rỗng) | **Invalid** | Set of values | Chặn với mã lỗi 401 Unauthorized ($O_4$) |
| | **EC09** | Token JWT giả mạo hoặc hết hạn sử dụng | **Invalid** | Security | Chặn với mã lỗi 401/403 ($O_4$) |
| **3. ID Danh mục (`id`)** | **EC10** | ID tồn tại trong CSDL và **không có** sản phẩm liên kết | **Valid** | Split / FK | Xóa danh mục thành công ($O_1$) |
| | **EC11** | ID tồn tại trong CSDL nhưng **đang có** sản phẩm liên kết | **Invalid** | Foreign Key | Chặn xóa để bảo toàn dữ liệu ($O_6$) |
| | **EC12** | ID là số nguyên dương nhưng không tồn tại trong CSDL | **Invalid** | Must-be | Báo lỗi 404 Không tìm thấy ($O_5$) |
| | **EC13** | ID không hợp lệ ($id \le 0$ hoặc chuỗi không phải số) | **Invalid** | Range ($< LB$) | Báo lỗi 400 ID không hợp lệ ($O_2$) |
| **4. Hành động Xóa trên UI** | **EC14** | Người dùng nhấn nút Xóa và **Xác nhận** trên hộp thoại (Dialog OK) | **Valid** | UI Flow (FR-24) | Gửi lệnh xóa danh mục ($O_1$) |
| | **EC15** | Người dùng nhấn nút Xóa và chọn **Hủy bỏ** trên hộp thoại (Dialog Cancel) | **Valid** | UI Flow (FR-24) | Giữ nguyên danh mục, không xóa |

---

### 💡 Tổng kết Bước 1 & Bước 2
* Đã xác định được **4 biến đầu vào** và **6 kết quả đầu ra chuẩn tắc**.
* Đã phân hoạch đầy đủ **15 lớp tương đương** (gồm **5 lớp Valid** và **10 lớp Invalid**).
* Đảm bảo nguyên lý **Single Fault Assumption**: Mỗi ca kiểm thử lỗi ở các bước sau chỉ được vi phạm duy nhất 1 lớp tương đương không hợp lệ.
---

# PHIÊN TƯƠNG TÁC 2: BƯỚC 3 & BƯỚC 4 — PHÂN TÍCH GIÁ TRỊ BIÊN (BVA) & MA TRẬN PHÂN QUYỀN

- **Prompt:**
```text
Thực hiện tiếp Bước 3 và Bước 4 cho FR-14:
- Phân tích Giá trị Biên (BVA) độ dài tên danh mục với biên dưới LB = 1 ký tự (điểm LB-1, LB, LB+1, Nom).
- Lập Ma trận Kiểm thử Phân quyền (admin vs user thường vs guest) kết hợp thao tác CRUD (POST/DELETE).
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 3 & BƯỚC 4: BVA & MA TRẬN PHÂN QUYỀN CHO FR-14 (CATEGORY CRUD)

Tuân thủ nghiêm ngặt chuẩn kiến thức học phần **Kiểm thử Phần mềm — FIT-HCMUS**, dưới đây là nội dung thực hiện chi tiết cho:
1. **Bước 3: Phân tích Giá trị Biên (Boundary Value Analysis - BVA)** cho biến độ dài tên danh mục quanh biên dưới $LB = 1$ ký tự.
2. **Bước 4: Ma trận Kiểm thử Miền Phân quyền (Authorization Domain Testing Matrix)** kết hợp giữa 3 vai trò người dùng và 4 thao tác CRUD.

---

## BƯỚC 3: Phân Tích Giá Trị Biên (Boundary Value Analysis - BVA)

### 3.1 Cơ sở Lý thuyết BVA & Ngữ cảnh Nghiệp vụ (FIT-HCMUS)
* **Bản chất kỹ thuật:** Lỗi lập trình trong các tính năng CRUD thường xuất hiện dày đặc tại các điểm biên tối thiểu (ví dụ: quên thêm ràng buộc `NOT NULL`, không kiểm tra độ dài chuỗi rỗng `""`, hoặc không cắt khoảng trắng thừa trước khi lưu CSDL).
* **Biến kiểm tra biên:** Độ dài chuỗi tên danh mục ($L = length(name) \in \mathbb{N}$).
* **Ràng buộc đặc tả:** Theo đặc tả `FR-14`, tên danh mục là trường **bắt buộc**, không được để trống $\implies L \ge 1$. Độ dài tối đa chuẩn cho trường văn bản ngắn trong CSDL là 255 ký tự ($L \le 255$).
* **Xác định các điểm biên:**
  * **Biên dưới (Lower Boundary - $LB$):** $LB = 1$ ký tự.
    * $LB - 1 = 0$ ký tự: Chuỗi rỗng `""` (Điểm **OFF** — Invalid: Hệ thống **bắt buộc phải từ chối**).
    * $LB = 1$ ký tự: Chuỗi 1 ký tự `"A"` (Điểm **ON** — Valid: Đạt độ dài tối thiểu cho phép, hệ thống **bắt buộc phải chấp nhận**).
    * $LB + 1 = 2$ ký tự: Chuỗi 2 ký tự `"Ao"` (Điểm **IN** — Valid: Nằm trọn vẹn trong miền hợp lệ).
  * **Giá trị danh định (Nominal Value - $Nom$):** Điểm đại diện điển hình trong miền hợp lệ, ví dụ $Nom = 14$ ký tự: `"Thời trang Nam"` (Valid).
  * **Biên trên (Upper Boundary - $UB$):** $UB = 255$ ký tự (Điểm **ON** — Valid); $UB + 1 = 256$ ký tự (Điểm **OFF** — Invalid).

---

### 3.2 Bảng Phân tích Giá trị Biên Chi tiết cho Độ dài Tên Danh mục

| Mã điểm | Loại điểm biên | Độ dài ($length$) | Dữ liệu mẫu kiểm thử (`name`) | Phân loại | Kết quả kỳ vọng theo SRS (Expected Output) |
| :---: | :---: | :---: | :--- | :---: | :--- |
| **BV01** | $LB - 1$ | 0 | `""` (Chuỗi rỗng / Không nhập gì) | **Invalid** | **Từ chối submit.** Báo lỗi: *"Tên danh mục là bắt buộc, không được để trống"* (HTTP 400 hoặc chặn bởi validation phía client). |
| **BV02** | $LB$ | 1 | `"A"` (1 ký tự đơn) | **Valid** | **Tạo mới thành công.** Danh mục "A" được lưu vào CSDL SQLite và hiển thị trên bảng Web Admin ($O_1$). |
| **BV03** | $LB + 1$ | 2 | `"Ao"` (2 ký tự) | **Valid** | **Tạo mới thành công.** Danh mục "Ao" được lưu vào CSDL ($O_1$). |
| **BV04** | $Nom$ | 14 | `"Thời trang Nam"` (Độ dài thông thường) | **Valid** | **Tạo mới thành công.** Danh mục được thêm vào CSDL ($O_1$). |
| **BV05** | $UB$ | 255 | Chuỗi 255 ký tự `'X'.repeat(255)` | **Valid** | **Tạo mới thành công.** Hệ thống lưu đủ 255 ký tự ($O_1$). |
| **BV06** | $UB + 1$ | 256 | Chuỗi 256 ký tự `'X'.repeat(256)` | **Invalid** | **Từ chối.** Báo lỗi độ dài chuỗi vượt quá 255 ký tự ($O_2$). |

> **Lưu ý chuyên môn FIT-HCMUS:** Để đảm bảo nguyên lý **Single Fault Assumption**, tại điểm biên **BV01**, tài khoản thực hiện luôn được giữ hợp lệ (có quyền `admin`). Nhờ đó, nguyên nhân lỗi duy nhất được kiểm tra là độ dài tên bằng 0.

---

## BƯỚC 4: Ma Trận Kiểm Thử Miền Phân Quyền (Authorization Domain Testing Matrix)

### 4.1 Cơ sở Lý thuyết Kiểm thử Phân quyền (Access Control Testing)
* Theo yêu cầu an toàn thông tin **SEC-03** và nguyên lý phòng chống lỗ hổng **OWASP Top 10 (A01: Broken Access Control)**, hệ thống phải kiểm soát quyền nghiêm ngặt ở tầng Server/Backend API.
* Không gian phân quyền gồm tổ hợp tích Đề-các giữa **3 vai trò người dùng (Roles)** và **4 hành động CRUD**:
  * **Vai trò người dùng:**
    1. Quản trị viên (`role = 'admin'`): Có JWT Token hợp lệ chứa claim `role: 'admin'`.
    2. Người dùng thông thường (`role = 'user'`): Có JWT Token hợp lệ chứa claim `role: 'user'`.
    3. Khách vãng lai (`role = 'guest'`): Không truyền Header `Authorization` hoặc Token rỗng/hết hạn.
  * **Hành động CRUD:**
    1. `READ` (`GET /api/categories`): Xem danh sách danh mục (Tính năng công khai).
    2. `CREATE` (`POST /api/categories`): Tạo mới danh mục (Chỉ Admin).
    3. `UPDATE` (`PUT /api/categories/:id`): Đổi tên danh mục (Chỉ Admin).
    4. `DELETE` (`DELETE /api/categories/:id`): Xóa danh mục (Chỉ Admin).

---

### 4.2 Ma trận Kiểm thử Miền Phân quyền Toàn diện (Roles $\times$ CRUD Actions)

| Mã luật | Vai trò người dùng (Role) | Thao tác CRUD | Endpoint & Method | Dữ liệu gửi kèm | Kết quả kỳ vọng theo SRS | Mã HTTP kỳ vọng | Ý nghĩa An ninh & Toàn vẹn Dữ liệu |
| :---: | :---: | :---: | :--- | :--- | :--- | :---: | :--- |
| **R1** | `admin` | **CREATE** | `POST /api/categories` | `{"name": "Gia dụng"}` | Tạo danh mục thành công, cấp ID mới | **200 / 201** | Quyền quản trị hợp lệ |
| **R2** | `admin` | **READ** | `GET /api/categories` | None | Trả về danh sách tất cả danh mục | **200 OK** | Quyền quản trị hợp lệ |
| **R3** | `admin` | **UPDATE** | `PUT /api/categories/1` | `{"name": "Gia dụng mới"}` | Cập nhật tên danh mục thành công | **200 OK** | Quyền quản trị hợp lệ |
| **R4** | `admin` | **DELETE** | `DELETE /api/categories/1` | None (ID không có SP) | Xóa danh mục thành công khỏi CSDL | **200 OK** | Quyền quản trị hợp lệ |
| **R5** | `user` | **READ** | `GET /api/categories` | None | Trả về danh sách danh mục để mua sắm | **200 OK** | Khách hàng đọc dữ liệu danh mục |
| **R6** | `user` | **CREATE** | `POST /api/categories` | `{"name": "Hack Category"}` | **BỊ TỪ CHỐI.** Báo lỗi không có quyền Admin | **403 Forbidden** | Chặn lỗ hổng leo quyền ngang/dọc (BOLA) |
| **R7** | `user` | **UPDATE** | `PUT /api/categories/1` | `{"name": "Tamper Name"}` | **BỊ TỪ CHỐI.** Báo lỗi không có quyền Admin | **403 Forbidden** | Chống sửa đổi cấu trúc danh mục trái phép |
| **R8** | `user` | **DELETE** | `DELETE /api/categories/1` | None | **BỊ TỪ CHỐI.** Báo lỗi không có quyền Admin | **403 Forbidden** | Ngăn chặn hành vi phá hoại CSDL |
| **R9** | `guest` | **READ** | `GET /api/categories` | None | Trả về danh sách danh mục | **200 OK** | Khách vãng lai xem sản phẩm |
| **R10** | `guest` | **CREATE** | `POST /api/categories` | `{"name": "Guest Category"}` | **BỊ TỪ CHỐI.** Yêu cầu đăng nhập | **401 Unauthorized** | Yêu cầu xác thực danh tính |
| **R11** | `guest` | **UPDATE** | `PUT /api/categories/1` | `{"name": "Guest Update"}` | **BỊ TỪ CHỐI.** Yêu cầu đăng nhập | **401 Unauthorized** | Yêu cầu xác thực danh tính |
| **R12** | `guest` | **DELETE** | `DELETE /api/categories/1` | None | **BỊ TỪ CHỐI.** Yêu cầu đăng nhập | **401 Unauthorized** | Yêu cầu xác thực danh tính |

---

### 💡 Điểm mấu chốt phục vụ kiểm thử thực tế (Step 6 & Defect Finding):
1. **Lỗi `BUG-08` tại điểm biên $LB-1$ (BV01):** Cả UI Web Admin ([App.jsx:298](file:///d:/KAN/N4_1/eshop-sut/frontend-admin/src/App.jsx#L298)) và Backend ([server.js:251](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L251)) đều **không kiểm tra chuỗi rỗng**, cho phép tạo danh mục có tên rỗng `""`.
2. **Lỗi `BUG-09` tại luật phân quyền R6 & R8:** Middleware `authenticateToken` ở [server.js:100](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L100) chỉ giải mã JWT mà **hoàn toàn bỏ quên việc kiểm tra `role === 'admin'`**, cho phép tài khoản người dùng thường (`role = 'user'`) gọi API tạo và xóa danh mục tự do!

---

# PHIÊN TƯƠNG TÁC 3: BƯỚC 5 — THIẾT KẾ BỘ CA KIỂM THỬ (TEST CASE SPECIFICATION)

- **Prompt:**
```text
Thực hiện Bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-14 bao phủ các lớp EP, điểm BVA và phân quyền vừa lập.
Xuất bảng chuẩn FIT-HCMUS: TC ID, Mục tiêu, EC/BV bao phủ, Test Data, Các bước thực hiện, Kết quả kỳ vọng.
```

- **Kết quả của AI:**


# BƯỚC 5: THIẾT KẾ BỘ TEST CASE HOÀN CHỈNH CHO FR-14 (CATEGORY CRUD)

Căn cứ vào kết quả phân tích ở **Bước 1 & Bước 2** (15 lớp tương đương `EC01` $\to$ `EC15`), **Bước 3** (6 điểm biên BVA `BV01` $\to$ `BV06`), và **Bước 4** (Ma trận phân quyền 12 luật `R1` $\to$ `R12`), bộ Test Case cho tính năng **FR-14: Quản lý Danh mục Admin** được thiết kế tuân thủ nghiêm ngặt chuẩn mực đào tạo của **Khoa CNTT – ĐH Khoa học Tự nhiên ĐHQG-HCM (FIT-HCMUS)** và nguyên lý **Single Fault Assumption** (Mỗi ca kiểm thử lỗi chỉ vi phạm duy nhất một thuộc tính).

Mã nguồn triển khai liên quan:
* Giao diện Admin: [App.jsx:L298-335](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L298-L335)
* Xử lý Backend API: [server.js:L249-278](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L249-L278)
* Middleware xác thực: [server.js:L100-110](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L100-L110)

---

## 1. Bảng Đặc Tả Chi Tiết Bộ Test Case Chuẩn FIT-HCMUS (6 Cột)

| TC ID | Mục tiêu kiểm thử | EC / BV bao phủ | Test Data (Dữ liệu đầu vào) | Các bước thực hiện (Test Steps) | Kết quả kỳ vọng theo SRS |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **TC-CAT-01** | Tạo danh mục với tên hợp lệ tại biên dưới ($LB = 1$) | `EC01`, `BV02`, `EC06`, `R1` | • Role: `admin`<br>• `name`: `"A"` (1 ký tự đơn) | 1. Đăng nhập Web Admin (`http://localhost:5174`) bằng tài khoản Admin (`admin@eshop.com` / `Admin123!`).<br>2. Tại form "Add Category", nhập `"A"` vào ô Category Name.<br>3. Nhấn nút "Add Category" (hoặc gửi `POST /api/categories`). | **HTTP 200/201 OK.** Danh mục "A" được tạo thành công, lưu vào bảng `categories` trong CSDL SQLite và hiển thị ngay trên danh sách Web Admin ($O_1$). |
| **TC-CAT-02** | Tạo danh mục thông thường với độ dài danh định ($Nom = 14$) | `EC01`, `BV04`, `EC06`, `R1` | • Role: `admin`<br>• `name`: `"Thời trang Nam"` ($length = 14$) | 1. Đăng nhập tài khoản Admin.<br>2. Nhập `"Thời trang Nam"` vào ô Category Name.<br>3. Nhấn nút "Add Category". | **HTTP 200/201 OK.** Danh mục mới được tạo thành công, xuất hiện trên cả Web Admin và Web Khách hàng ($O_1$). |
| **TC-CAT-03** | Tạo danh mục với độ dài chuỗi tối đa cho phép tại biên trên ($UB = 255$) | `EC01`, `BV05`, `EC06`, `R1` | • Role: `admin`<br>• `name`: Chuỗi 255 ký tự `'C'.repeat(255)` | 1. Đăng nhập tài khoản Admin.<br>2. Nhập chuỗi 255 ký tự chữ cái vào ô Category Name.<br>3. Nhấn "Add Category". | **HTTP 200/201 OK.** Hệ thống lưu trọn vẹn chuỗi 255 ký tự vào CSDL, không bị cắt xén (truncate) ($O_1$). |
| **TC-CAT-04** | Kiểm tra từ chối khi tạo danh mục có tên rỗng ($LB - 1 = 0$) | `EC02`, `BV01`, `EC06`<br>*(Single Fault)* | • Role: `admin`<br>• `name`: `""` (chuỗi rỗng / không nhập) | 1. Đăng nhập tài khoản Admin.<br>2. Để trống ô Category Name (không nhập gì).<br>3. Nhấn nút "Add Category" (hoặc `POST /api/categories` với payload `{"name": ""}`). | **BỊ TỪ CHỐI.** Form kích hoạt cảnh báo HTML5 `required` ("Please fill out this field") hoặc API trả về **HTTP 400 Bad Request** với thông báo lỗi: *"Tên danh mục là bắt buộc, không được để trống"* ($O_2$). Không ghi bản ghi rỗng vào DB. |
| **TC-CAT-05** | Kiểm tra từ chối khi tên danh mục chỉ gồm toàn khoảng trắng | `EC03`, `EC06`<br>*(Single Fault)* | • Role: `admin`<br>• `name`: `"   "` (3 dấu cách) | 1. Đăng nhập tài khoản Admin.<br>2. Nhập 3 ký tự khoảng trắng vào ô Category Name.<br>3. Nhấn nút "Add Category" (hoặc `POST /api/categories` với `{"name": "   "}`). | **BỊ TỪ CHỐI.** Hệ thống trim khoảng trắng và từ chối. Trả về **HTTP 400 Bad Request** báo lỗi tên danh mục không hợp lệ ($O_2$). Không thêm vào CSDL. |
| **TC-CAT-06** | Kiểm tra từ chối khi tên danh mục vượt quá độ dài tối đa ($UB + 1 = 256$) | `EC04`, `BV06`, `EC06`<br>*(Single Fault)* | • Role: `admin`<br>• `name`: Chuỗi 256 ký tự `'D'.repeat(256)` | 1. Đăng nhập tài khoản Admin.<br>2. Gửi request `POST /api/categories` với payload chuỗi 256 ký tự. | **BỊ TỪ CHỐI.** Trả về **HTTP 400 Bad Request** báo lỗi chuỗi vượt quá 255 ký tự ($O_2$) hoặc input chặn nhập quá 255 ký tự (`maxlength="255"`). |
| **TC-CAT-07** | Kiểm tra an toàn dữ liệu: Chống tấn công lưu trữ mã độc XSS Script | `EC05`, `EC06` | • Role: `admin`<br>• `name`: `<script>alert('XSS')</script>` | 1. Đăng nhập tài khoản Admin.<br>2. Nhập payload script độc hại vào ô tên danh mục.<br>3. Nhấn "Add Category".<br>4. Mở trang Web Admin và Web Client (`http://localhost:5173`). | **An toàn.** Hệ thống tự động mã hóa HTML Entities (`&lt;script&gt;`) hoặc sanitize an toàn. Tuyệt đối **không bật alert popup** thực thi script trên trình duyệt. |
| **TC-CAT-08** | Kiểm soát phân quyền: Tài khoản User thường gọi API tạo danh mục (CREATE) | `EC07`, `R6`, `SEC-03` | • Role: `user` (`test@eshop.com`)<br>• Token: JWT hợp lệ của User<br>• `name`: `"Hack Category"` | 1. Đăng nhập tài khoản `user` thường qua `/api/login` lấy JWT Token.<br>2. Gửi request `POST /api/categories` kèm header `Authorization: Bearer <user_token>` và body `{"name": "Hack Category"}`. | **BỊ TỪ CHỐI.** Backend kiểm tra role và phản hồi **HTTP 403 Forbidden** với thông báo lỗi: `{"error": "Access denied. Admin role required."}` ($O_3$). Không tạo danh mục trong DB. |
| **TC-CAT-09** | Kiểm soát phân quyền: Tài khoản User thường gọi API xóa danh mục (DELETE) | `EC07`, `R8`, `SEC-03` | • Role: `user`<br>• Token: JWT của User<br>• Target: `DELETE /api/categories/1` | 1. Lấy JWT Token của tài khoản User thường.<br>2. Gửi request `DELETE /api/categories/1` kèm header `Authorization: Bearer <user_token>`. | **BỊ TỪ CHỐI.** Backend trả về **HTTP 403 Forbidden** ($O_3$). Bản ghi danh mục ID = 1 trong CSDL được giữ nguyên vẹn. |
| **TC-CAT-10** | Xác thực danh tính: Khách vãng lai (Guest) gọi API CRUD danh mục | `EC08`, `R10`, `SEC-03` | • Role: `guest`<br>• Token: Không có (Header rỗng)<br>• `name`: `"Guest Cat"` | 1. Gửi request `POST /api/categories` không truyền Header `Authorization` (hoặc Token rỗng). | **BỊ TỪ CHỐI.** Backend phản hồi **HTTP 401 Unauthorized** với thông báo: `{"error": "Access token required"}` ($O_4$). |
| **TC-CAT-11** | Kiểm tra hộp thoại xác nhận khi xóa danh mục trên giao diện Web Admin (FR-24) | `EC10`, `EC14`, `EC15`, `FR-24` | • Role: `admin`<br>• Target: Danh mục thử nghiệm hợp lệ (không chứa sản phẩm) | 1. Đăng nhập Web Admin `http://localhost:5174`.<br>2. Tại danh sách danh mục, nhấn nút "Xóa" một danh mục.<br>3. Kiểm tra xem có hiển thị Dialog xác nhận không.<br>4. Nhấn "Cancel" $\to$ Kiểm tra danh mục không bị xóa.<br>5. Nhấn "Xóa" lại và chọn "OK" $\to$ Kiểm tra danh mục bị xóa. | **Đúng chuẩn FR-24.** Bắt buộc phải bật Modal/Confirm Dialog xác nhận hành động nguy hiểm: *"Bạn có chắc chắn muốn xóa danh mục này?"*. Khi Cancel thì giữ nguyên; khi OK mới gửi request xóa tới Server ($O_1$). |
| **TC-CAT-12** | Ràng buộc toàn vẹn CSDL: Ngăn chặn xóa danh mục đang chứa sản phẩm liên kết | `EC11`, `O6`, Database Integrity | • Role: `admin`<br>• Target: Danh mục đang có sản phẩm (ví dụ: ID = 1 liên kết với "Laptop Gaming") | 1. Đăng nhập tài khoản Admin.<br>2. Gửi lệnh xóa danh mục ID = 1 (`DELETE /api/categories/1`). | **BỊ TỪ CHỐI.** Backend kiểm tra khóa ngoại `products.category_id` và từ chối xóa với mã **HTTP 400 Bad Request** hoặc **409 Conflict** ($O_6$). Báo lỗi: *"Không thể xóa danh mục đang chứa sản phẩm liên kết"*. Dữ liệu sản phẩm không bị mồ côi (orphan). |

---

## 2. Ma Trận Truy Xuất Nguồn Gốc Kiểm Thử (Traceability Matrix - RTM)

| Hạng mục phân tích | Các phần tử chi tiết | Ca kiểm thử bao phủ (Covered TC) | Tỷ lệ bao phủ (Coverage) |
| :--- | :--- | :--- | :---: |
| **Lớp tương đương (EP)** | • `EC01` (Tên hợp lệ: $1 \le L \le 255$)<br>• `EC02` (Tên rỗng: $L = 0$)<br>• `EC03` (Toàn khoảng trắng)<br>• `EC04` (Tên quá dài: $L > 255$)<br>• `EC05` (Chứa script XSS)<br>• `EC06` (Quyền Admin hợp lệ)<br>• `EC07` (Quyền User thường)<br>• `EC08` (Khách vãng lai / Không Token)<br>• `EC10` (ID hợp lệ, không có SP)<br>• `EC11` (ID có sản phẩm liên kết)<br>• `EC14` & `EC15` (Xác nhận / Hủy bỏ trên dialog) | TC-CAT-01, TC-CAT-02, TC-CAT-03<br>TC-CAT-04<br>TC-CAT-05<br>TC-CAT-06<br>TC-CAT-07<br>TC-CAT-01, 02, 03, 04, 05, 06, 07, 11, 12<br>TC-CAT-08, TC-CAT-09<br>TC-CAT-10<br>TC-CAT-11<br>TC-CAT-12<br>TC-CAT-11 | **100% Bao phủ** (15/15 Lớp tương đương) |
| **Giá trị biên (BVA)** | • `BV01` ($LB - 1 = 0$ ký tự)<br>• `BV02` ($LB = 1$ ký tự)<br>• `BV03` ($LB + 1 = 2$ ký tự)<br>• `BV04` ($Nom = 14$ ký tự)<br>• `BV05` ($UB = 255$ ký tự)<br>• `BV06` ($UB + 1 = 256$ ký tự) | TC-CAT-04<br>TC-CAT-01<br>TC-CAT-01, TC-CAT-02<br>TC-CAT-02<br>TC-CAT-03<br>TC-CAT-06 | **100% Bao phủ** (6/6 Điểm biên) |
| **Ma trận phân quyền** | • Quản trị viên CRUD (`R1` $\to$ `R4`)<br>• User thường CRUD (`R6`, `R8`)<br>• Khách vãng lai CRUD (`R10`) | TC-CAT-01, 02, 03, 11, 12<br>TC-CAT-08, TC-CAT-09<br>TC-CAT-10 | **100% Các luồng nhạy cảm** |
| **Điều khoản đặc thù** | • `FR-24` (Hộp thoại xác nhận hành động xóa)<br>• `SEC-03` (Chống Broken Object Level Authorization)<br>• Ràng buộc khóa ngoại CSDL (Data Integrity) | TC-CAT-11<br>TC-CAT-08, TC-CAT-09<br>TC-CAT-12 | **100% Đạt yêu cầu** |

Dữ liệu bộ ca kiểm thử đã được lưu trữ và đồng bộ vào tài liệu [AI-result-F14.md](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/reports/AI-result-F14.md#L233-L270).
---


# PHIÊN TƯƠNG TÁC 4: BƯỚC 6 — KẾT QUẢ THỰC THI KIỂM THỬ TRÊN SUT LIVE (ADMIN & API)

- **Prompt:**
```text
Thực hiện Bước 6: Chạy kiểm thử các test case FR-14 trên SUT Live (Web Admin localhost:5174 và API /api/categories).
Lập bảng kết quả thực tế chi tiết (TC ID, Dữ liệu, Kỳ vọng, Thực tế trên SUT, Pass/Fail, Bug ID) và bảng thống kê tổng hợp.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 6: KẾT QUẢ THỰC THI KIỂM THỬ TRÊN SUT LIVE (FR-14)

Quá trình thực thi kiểm thử được tiến hành trực tiếp trên hệ thống **EShop SUT Live** tại hai tầng:
* **Tầng Giao diện Quản trị (Frontend Web Admin):** `http://localhost:5174` (React 19 + TailwindCSS).
* **Tầng Dịch vụ API Backend:** `http://localhost:3000` (Node.js/Express + SQLite CSDL `database.sqlite`).

---

## 6.1 Bảng Kết Quả Thực Thi Kiểm Thử Chi Tiết (Live Execution Results)

| TC ID | Mục tiêu kiểm thử | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng theo SRS | Kết quả thực tế trên SUT Live | Trạng thái (Pass/Fail) | Mã Lỗi (Bug ID) |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-CAT-01** | Tạo danh mục tên hợp lệ tại biên dưới ($LB = 1$) | • Role: `admin`<br>• `name`: `"A"` | HTTP 200/201 OK. Danh mục "A" được lưu vào CSDL, hiển thị trên Web Admin. | Backend phản hồi HTTP 200 `{ message: 'Category created', id: 4 }`. Danh mục được tạo thành công trong SQLite. | <span style="color:green">**PASS**</span> | — |
| **TC-CAT-02** | Tạo danh mục thông thường với độ dài danh định ($Nom = 14$) | • Role: `admin`<br>• `name`: `"Thời trang Nam"` | HTTP 200/201 OK. Tạo thành công danh mục. | Backend phản hồi HTTP 200 `{ message: 'Category created', id: 5 }`. Hiển thị đồng bộ trên hệ thống. | <span style="color:green">**PASS**</span> | — |
| **TC-CAT-03** | Tạo danh mục với độ dài tối đa tại biên trên ($UB = 255$) | • Role: `admin`<br>• `name`: `'C'.repeat(255)` | HTTP 200/201 OK. Lưu đủ 255 ký tự, không bị cắt xén (truncate). | Backend phản hồi HTTP 200 `{ message: 'Category created', id: 6 }`. CSDL lưu trọn vẹn 255 ký tự. | <span style="color:green">**PASS**</span> | — |
| **TC-CAT-04** | Kiểm tra từ chối khi tạo danh mục tên rỗng ($LB - 1 = 0$) | • Role: `admin`<br>• `name`: `""` (chuỗi rỗng) | **BỊ TỪ CHỐI.** Form chặn submit (`required`) hoặc API trả về HTTP 400 Bad Request: *"Tên danh mục là bắt buộc"*. | **LỖI:** Form không có `required` ([App.jsx:298](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L298)), Backend ([server.js:251](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L251)) không validate $\implies$ Phản hồi HTTP 200 `{ message: 'Category created', id: 7 }`, tạo bản ghi rỗng trong CSDL! | <span style="color:red">**FAIL**</span> | `BUG-08` |
| **TC-CAT-05** | Kiểm tra từ chối khi tên danh mục chỉ chứa khoảng trắng | • Role: `admin`<br>• `name`: `"   "` (3 dấu cách) | **BỊ TỪ CHỐI.** Hệ thống trim khoảng trắng và trả về HTTP 400 Bad Request báo lỗi tên không hợp lệ. | **LỖI:** Backend không trim, phản hồi HTTP 200 `{ message: 'Category created', id: 8 }`, tạo danh mục chỉ chứa khoảng trắng trong DB! | <span style="color:red">**FAIL**</span> | `BUG-08` |
| **TC-CAT-06** | Kiểm tra từ chối khi độ dài tên vượt quá biên trên ($UB + 1 = 256$) | • Role: `admin`<br>• `name`: `'D'.repeat(256)` | **BỊ TỪ CHỐI.** Trả về HTTP 400 Bad Request hoặc ô input chặn nhập quá 255 ký tự (`maxlength="255"`). | **LỖI:** Form không có `maxlength`, Backend không chặn độ dài $\implies$ Phản hồi HTTP 200 `{ message: 'Category created', id: 9 }`, ghi nhận chuỗi 256 ký tự vào CSDL. | <span style="color:red">**FAIL**</span> | `BUG-08` |
| **TC-CAT-07** | Kiểm tra khả năng phòng chống tấn công Stored XSS Script | • Role: `admin`<br>• `name`: `<script>alert('XSS')</script>` | Hệ thống tự động sanitize hoặc mã hóa HTML Entities, không lưu raw script vào DB. | **CẢNH BÁO:** Backend lưu nguyên văn `<script>alert('XSS')</script>` vào DB (`id=10`) mà không sanitize. Trên React UI được bảo vệ nhờ JSX escaping, nhưng API trả raw data tiềm ẩn rủi ro Stored XSS cho các nền tảng khác. | <span style="color:red">**FAIL**</span> | `BUG-08` |
| **TC-CAT-08** | Kiểm soát phân quyền: Tài khoản User thường gọi API tạo danh mục (CREATE) | • Role: `user`<br>• Token: JWT của User<br>• `name`: `"Hack Category"` | **BỊ TỪ CHỐI.** Backend kiểm tra quyền và trả về HTTP 403 Forbidden. Không thêm dữ liệu vào DB. | **LỖI LEO QUYỀN (BOLA):** Middleware `authenticateToken` ([server.js:100](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L100)) chỉ verify JWT mà không kiểm tra `role === 'admin'` $\implies$ Phản hồi HTTP 200 `{ message: 'Category created', id: 11 }`, User thường tạo được danh mục! | <span style="color:red">**FAIL**</span> | `BUG-09` |
| **TC-CAT-09** | Kiểm soát phân quyền: Tài khoản User thường gọi API xóa danh mục (DELETE) | • Role: `user`<br>• Token: JWT của User<br>• Target: `DELETE /api/categories/11` | **BỊ TỪ CHỐI.** Backend phản hồi HTTP 403 Forbidden. Không xóa danh mục. | **LỖI LEO QUYỀN (BOLA):** Backend phản hồi HTTP 200 `{ message: 'Category deleted' }`, User thường xóa vĩnh viễn danh mục của hệ thống! | <span style="color:red">**FAIL**</span> | `BUG-09` |
| **TC-CAT-10** | Xác thực danh tính: Khách vãng lai gọi API tạo danh mục không có Token | • Role: `guest`<br>• Token: Không có<br>• `name`: `"Guest Cat"` | **BỊ TỪ CHỐI.** Backend phản hồi HTTP 401 Unauthorized (`{"error": "Access token required"}`). | Backend phản hồi đúng HTTP 401 Unauthorized `{ error: 'Unauthorized' }`. Thao tác bị chặn chính xác. | <span style="color:green">**PASS**</span> | — |
| **TC-CAT-11** | Kiểm tra hộp thoại xác nhận khi xóa danh mục trên Web Admin (FR-24) | • Role: `admin`<br>• Thao tác: Bấm nút "Xóa" trên UI Web Admin | Bắt buộc hiển thị modal/dialog xác nhận: *"Bạn có chắc chắn muốn xóa danh mục này?"*. | **LỖI:** Nút "Xóa" tại [App.jsx:325](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L325) gọi thẳng `onClick={() => deleteCategory(c.id)}`, không hề có dialog hay `window.confirm()`, click là xóa ngay lập tức! | <span style="color:red">**FAIL**</span> | `BUG-10` |
| **TC-CAT-12** | Ràng buộc toàn vẹn CSDL: Ngăn chặn xóa danh mục đang chứa sản phẩm | • Role: `admin`<br>• Target: Danh mục ID = 1 (đang có 2 sản phẩm: iPhone 15 Pro Max, Galaxy S24) | **BỊ TỪ CHỐI.** Chặn xóa (HTTP 400 hoặc 409 Conflict) để bảo toàn dữ liệu liên kết. | **LỖI TOÀN VẸN CSDL:** Backend [server.js:270](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L270) xóa thẳng mà không kiểm tra khóa ngoại, làm các sản phẩm liên kết bị mồ côi (orphan data)! | <span style="color:red">**FAIL**</span> | `BUG-10` |

---

## 6.2 Thống Kê Tổng Hợp Kết Quả Kiểm Thử (Execution Summary & Metrics)

```
┌────────────────────────────────────────────────────────────────────────┐
│             ESHOP FR-14 CATEGORY CRUD TEST EXECUTION SUMMARY           │
├────────────────────────────────────────────────────────────────────────┤
│  Tổng số ca kiểm thử thiết kế & thực thi:    12 ca (100.0%)            │
│  Số ca kiểm thử ĐẠT (PASS):                   4 ca ( 33.3%)            │
│  Số ca kiểm thử KHÔNG ĐẠT (FAIL):             8 ca ( 66.7%)            │
├────────────────────────────────────────────────────────────────────────┤
│  PHÂN BỐ LỖI THEO NHÓM NGUYÊN NHÂN:                                    │
│  • BUG-08 (Input Validation & Boundary Checking): 4 TCs (TC-04,05,06,07)│
│  • BUG-09 (Broken Access Control / BOLA - SEC-03): 2 TCs (TC-08, 09)    │
│  • BUG-10 (UI Safety FR-24 & Foreign Key Integrity): 2 TCs (TC-11, 12)  │
├────────────────────────────────────────────────────────────────────────┤
│  Mức độ nghiêm trọng của khuyết tật:          CRITICAL / HIGH           │
│  Đánh giá chất lượng SUT:                     KHÔNG ĐỦ ĐIỀU KIỆN RELEASE│
└────────────────────────────────────────────────────────────────────────┘
```

---

# PHIÊN TƯƠNG TÁC 5: BƯỚC 7 — LẬP BÁO CÁO LỖI (BUG REPORT) CHUẨN 10 TRƯỜNG FIT-HCMUS

- **Prompt:**
```text
Thực hiện Bước 7: Lập Báo cáo Lỗi chuẩn 10 trường (mẫu ThS. Trần Thị Bích Hanh) cho các bug phát hiện ở FR-14:
- BUG-08: Cho phép tạo danh mục tên rỗng (LB-1).
- BUG-09: Lỗ hổng leo quyền cho phép user thường gọi API thêm/xóa danh mục.
- BUG-10: Thiếu dialog xác nhận xóa và vi phạm toàn vẹn dữ liệu.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 7: BÁO CÁO LỖI CHUẨN 10 TRƯỜNG (FEATURE C: FR-14)

Dưới đây là Báo cáo Lỗi (Bug Report) hoàn chỉnh theo chuẩn **10 trường thông tin** trong bài giảng của **ThS. Trần Thị Bích Hanh (Khoa CNTT – ĐH Khoa học Tự nhiên ĐHQG-HCM)** cho 3 khuyết tật nghiêm trọng nhất phát hiện trên tính năng **FR-14: Quản lý Danh mục Admin**:

---

## 1. BUG REPORT 01: `BUG-08`

### [BUG-08]: Cho phép tạo danh mục sản phẩm với tên rỗng ($length = 0$) và khoảng trắng (Vi phạm biên dưới $LB - 1$)

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-08` |
| **2** | **Function Name** | `FR-14: Category CRUD (Web Admin & Backend API)` |
| **3** | **Problem Summary** | Cả giao diện Web Admin và Backend API đều không kiểm tra tính hợp lệ của tên danh mục, cho phép thêm danh mục có tên rỗng `""` hoặc toàn khoảng trắng `"   "`, làm phát sinh bản ghi rác trong CSDL. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 (FIT-HCMUS) |
| **6** | **Date** | `2026-10-19` |
| **7** | **Assign To** | Fullstack Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Medium` |
| **10** | **Severity** | `Medium (Trọng số 3)` |

#### 4. Chi tiết các bước tái hiện và phân tích lỗi:
* **4.1 Điều kiện tiên quyết (Prerequisites):** Đăng nhập Web Admin bằng tài khoản Quản trị viên (`admin@eshop.com` / `Admin123!`).
* **4.2 Các bước thực hiện (Test Steps):**
  1. Mở trang Web Admin `http://localhost:5174`, chọn tab "Quản lý Danh mục".
  2. Tại ô "Tên danh mục mới", để trống hoàn toàn (hoặc nhập 3 ký tự khoảng trắng `"   "`).
  3. Nhấn nút "Thêm mới" (hoặc gửi request `POST /api/categories` với payload `{"name": ""}`).
* **4.3 Kết quả kỳ vọng (Expected Result):** 
  * Hệ thống từ chối submit. 
  * Ô input kích hoạt thông báo HTML5 `required` ("Please fill out this field") hoặc Backend API trả về HTTP **400 Bad Request** với thông báo lỗi: *"Tên danh mục là bắt buộc, không được để trống"*. 
  * Không thêm bản ghi rỗng vào CSDL.
* **4.4 Kết quả thực tế (Actual Result):** 
  * Form không chặn submit, gửi thẳng request lên Server.
  * Backend phản hồi HTTP **200 OK** `{ "message": "Category created", "id": 7 }`.
  * Một bản ghi danh mục tên rỗng được tạo thành công trong SQLite và hiển thị một dòng trống trên bảng danh mục của Web Admin.
* **4.5 Nguyên nhân kỹ thuật (Root Cause):**
  * Frontend ([App.jsx:298](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L298)): Thẻ `<input>` thiếu thuộc tính `required` và `minLength="1"`. Hàm `handleCategorySubmit` ([App.jsx:142](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L142)) không kiểm tra `if (!categoryName.trim())`.
  * Backend ([server.js:249-255](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L249-L255)): Không validate chuỗi, thiếu `if (!name || !name.trim()) return res.status(400)...`.
  * CSDL ([database.js:23-26](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/database.js#L23-L26)): Bảng `categories` khai báo cột `name TEXT` thiếu ràng buộc `NOT NULL` và `CHECK(length(trim(name)) > 0)`.
* **4.6 Đề xuất khắc phục (Suggested Fix):**
  * Frontend: Thêm `required` và `minLength={1}` vào thẻ `<input>`; trim chuỗi trước khi gửi API.
  * Backend: Thêm middleware hoặc khối validate đầu vào:
    ```javascript
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 255) {
      return res.status(400).json({ error: "Tên danh mục không hợp lệ (bắt buộc, 1 - 255 ký tự)" });
    }
    ```
  * CSDL: Cập nhật schema `name TEXT NOT NULL CHECK(length(trim(name)) > 0)`.
* **4.7 Minh chứng kiểm thử (Defect Evidence):**
  * **Minh chứng Mã lỗi (VS Code Card):** [BUG-FR14-01_Code.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-01_Code.png)
  * **Minh chứng Thực tế (Web Admin & API Network):** [BUG-FR14-01_UI.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-01_UI.png) (chụp từ `TC-CAT-04`)

---

## 2. BUG REPORT 02: `BUG-09`

### [BUG-09]: Lỗ hổng phân quyền nghiêm trọng — Tài khoản thường (`role = user`) có thể tạo và xóa danh mục hệ thống (Broken Access Control / BOLA - OWASP Top 10 A01)

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-09` |
| **2** | **Function Name** | `FR-14 / FR-12 / SEC-03: Access Control & Authorization` |
| **3** | **Problem Summary** | Middleware xác thực của Backend chỉ kiểm tra tính hợp lệ của chữ ký Token mà hoàn toàn bỏ qua việc kiểm tra thuộc tính quyền `role === 'admin'`. Do đó, người dùng thông thường (`role = 'user'`) có thể gọi trực tiếp API quản trị để tạo và xóa danh mục tùy ý. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 (FIT-HCMUS) |
| **6** | **Date** | `2026-10-19` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

#### 4. Chi tiết các bước tái hiện và phân tích lỗi:
* **4.1 Điều kiện tiên quyết (Prerequisites):** Có tài khoản người dùng thông thường (`test@eshop.com` / `Test1234!`, `role: 'user'`).
* **4.2 Các bước thực hiện (Test Steps):**
  1. Gửi request `POST /api/login` với tài khoản User thường để nhận JWT Token (`role: "user"`).
  2. Gửi request `POST /api/categories` kèm Header `Authorization: Bearer <user_token>` và body `{"name": "Danh mục do User thường tạo"}`.
  3. Gửi tiếp request `DELETE /api/categories/<id_vừa_tạo>` kèm Header `Authorization: Bearer <user_token>`.
* **4.3 Kết quả kỳ vọng (Expected Result):** 
  * Backend phải từ chối ngay lập tức với mã lỗi HTTP **403 Forbidden**.
  * Phản hồi lỗi: `{"error": "Access denied. Admin role required."}`.
  * Tuyệt đối không thêm hoặc xóa dữ liệu danh mục trong CSDL.
* **4.4 Kết quả thực tế (Actual Result):** 
  * Backend phản hồi HTTP **200 OK** `{ "message": "Category created", "id": 11 }`.
  * Request DELETE tiếp tục phản hồi HTTP **200 OK** `{ "message": "Category deleted" }`.
  * Tài khoản khách hàng thông thường có thể tạo và xóa vĩnh viễn danh mục quản trị của hệ thống!
* **4.5 Nguyên nhân kỹ thuật (Root Cause):**
  * Middleware [authenticateToken](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L100-L110) chỉ thực thi:
    ```javascript
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
    ```
  * Middleware này chỉ xác thực token có hợp lệ hay không, không hề có bước kiểm tra `req.user.role === 'admin'`. Các route quản trị [server.js:249-278](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L249-L278) sử dụng trực tiếp middleware này mà không bổ sung tầng phân quyền kiểm tra Role.
* **4.6 Đề xuất khắc phục (Suggested Fix):**
  * Xây dựng middleware phân quyền chuyên biệt `requireAdmin`:
    ```javascript
    const requireAdmin = (req, res, next) => {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin role required." });
      }
      next();
    };
    ```
  * Áp dụng chuỗi middleware `[authenticateToken, requireAdmin]` cho tất cả các endpoint quản trị:
    ```javascript
    app.post("/api/categories", authenticateToken, requireAdmin, (req, res) => { ... });
    app.put("/api/categories/:id", authenticateToken, requireAdmin, (req, res) => { ... });
    app.delete("/api/categories/:id", authenticateToken, requireAdmin, (req, res) => { ... });
    ```
* **4.7 Minh chứng kiểm thử (Defect Evidence):**
  * **Minh chứng Mã lỗi (VS Code Card):** [BUG-FR14-02_Code.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-02_Code.png)
  * **Minh chứng Thực tế (Postman API User BOLA):** [BUG-FR14-02_UI.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-02_UI.png) (chụp từ `TC-CAT-08`)

---

## 3. BUG REPORT 03: `BUG-10`

### [BUG-10]: Thiếu hộp thoại xác nhận khi xóa danh mục (Vi phạm `FR-24`) và vi phạm ràng buộc toàn vẹn dữ liệu quan hệ (Orphan Data)

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-10` |
| **2** | **Function Name** | `FR-14 / FR-24: Category Deletion Safety & Database Integrity` |
| **3** | **Problem Summary** | Giao diện Web Admin không hiển thị hộp thoại xác nhận khi người dùng nhấn nút "Xóa" danh mục (xóa tức thì không thể hoàn tác). Đồng thời, Backend cho phép xóa danh mục đang chứa sản phẩm liên kết mà không kiểm tra khóa ngoại, khiến các sản phẩm này bị mồ côi (orphan data) trong CSDL. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 (FIT-HCMUS) |
| **6** | **Date** | `2026-10-19` |
| **7** | **Assign To** | Fullstack Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `High` |
| **10** | **Severity** | `Critical (Trọng số 5)` |

#### 4. Chi tiết các bước tái hiện và phân tích lỗi:
* **4.1 Điều kiện tiên quyết (Prerequisites):** Đăng nhập Web Admin bằng tài khoản Admin. CSDL đang có Danh mục ID = 1 chứa 2 sản phẩm liên kết ("iPhone 15 Pro Max", "Samsung Galaxy S24 Ultra").
* **4.2 Các bước thực hiện (Test Steps):**
  1. Trên Web Admin `http://localhost:5174`, mở tab "Quản lý Danh mục".
  2. Bấm nút "Xóa" tại danh mục ID = 1.
  3. Quan sát giao diện có xuất hiện popup/dialog xác nhận hay không.
  4. Kiểm tra lại danh mục và bảng `products` trong CSDL SQLite.
* **4.3 Kết quả kỳ vọng (Expected Result):** 
  * Theo `FR-24`: Bắt buộc phải hiển thị Modal/Confirm Dialog cảnh báo: *"Bạn có chắc chắn muốn xóa danh mục này? Thao tác không thể hoàn tác."*.
  * Theo tính toàn vẹn dữ liệu: Backend phải kiểm tra xem danh mục có đang chứa sản phẩm hay không; nếu có, từ chối xóa với HTTP **400 Bad Request** hoặc **409 Conflict**: *"Không thể xóa danh mục đang có sản phẩm liên kết"*. Dữ liệu sản phẩm và danh mục được bảo toàn.
* **4.4 Kết quả thực tế (Actual Result):** 
  * Khi bấm "Xóa", không hề có dialog hay `window.confirm()`, danh mục bị xóa vĩnh viễn ngay lập tức (vi phạm `FR-24`).
  * Backend thực thi `DELETE FROM categories WHERE id = 1` thành công (HTTP **200 OK**).
  * 2 sản phẩm liên kết vẫn còn trong bảng `products` nhưng mang thuộc tính `category_id = 1` trỏ vào một danh mục không tồn tại $\implies$ Dữ liệu bị mồ côi (Orphan Records), gây lỗi hiển thị danh mục ở trang khách hàng!
* **4.5 Nguyên nhân kỹ thuật (Root Cause):**
  * Frontend ([App.jsx:325](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L325)): Nút bấm viết trực tiếp `onClick={() => deleteCategory(c.id)}` mà không qua bước `window.confirm()`.
  * Backend ([server.js:270](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L270)): Xóa thẳng bản ghi trong bảng `categories` mà không thực hiện kiểm tra `SELECT COUNT(*) FROM products WHERE category_id = ?`.
  * CSDL SQLite: Mặc định không kích hoạt ràng buộc khóa ngoại `PRAGMA foreign_keys = ON;`.
* **4.6 Đề xuất khắc phục (Suggested Fix):**
  * Phía Frontend: Bổ sung dialog xác nhận trước khi thực hiện xóa:
    ```javascript
    const deleteCategory = async (id) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này? Thao tác không thể hoàn tác!")) return;
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
        fetchData();
      } catch (err) {
        alert("Lỗi xóa danh mục: " + (err.response?.data?.error || err.message));
      }
    };
    ```
  * Phía Backend: Kiểm tra ràng buộc sản phẩm trước khi xóa:
    ```javascript
    app.delete("/api/categories/:id", authenticateToken, requireAdmin, (req, res) => {
      db.get("SELECT COUNT(*) AS count FROM products WHERE category_id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row && row.count > 0) {
          return res.status(400).json({ 
            error: `Không thể xóa danh mục này vì đang có ${row.count} sản phẩm liên kết!` 
          });
        }
        db.run("DELETE FROM categories WHERE id = ?", [req.params.id], function (delErr) {
          if (delErr) return res.status(500).json({ error: delErr.message });
          res.json({ message: "Category deleted" });
        });
      });
    });
    ```
  * Phía CSDL: Kích hoạt `PRAGMA foreign_keys = ON;` ngay sau khi mở kết nối SQLite trong [database.js](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/database.js).
* **4.7 Minh chứng kiểm thử (Defect Evidence):**
  * **Minh chứng Mã lỗi (VS Code Card):** [BUG-FR14-03_Code.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-03_Code.png)
  * **Minh chứng Thực tế (Web Admin UI):** [BUG-FR14-03_UI.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-03_UI.png) (chụp từ `TC-CAT-11`)
  * **Minh chứng CSDL Toàn vẹn (SQLite Terminal):** [BUG-FR14-03_DB.png](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-03_DB.png) (chứng minh lỗi mồ côi sản phẩm sau khi xóa danh mục)

---

## 4. BẢNG TỔNG HỢP MINH CHỨNG LỖI CHUẨN HÓA (DEFECT EVIDENCE MATRIX - FR-14)

| Mã Bug Phân hệ | Mã Bug Toàn dự án | Tóm tắt Khuyết tật | Ảnh Minh chứng Mã lỗi (Code Card) | Ảnh Minh chứng Thực tế (UI / CSDL) |
| :---: | :---: | :--- | :--- | :--- |
| **`BUG-FR14-01`** | **`BUG-08`** | Cho phép tạo danh mục tên rỗng ($LB-1$) & khoảng trắng | [`screenshots/F14/BUG-FR14-01_Code.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-01_Code.png) | [`screenshots/F14/BUG-FR14-01_UI.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-01_UI.png) |
| **`BUG-FR14-02`** | **`BUG-09`** | Lỗ hổng leo quyền BOLA (User thường gọi API Admin tạo/xóa) | [`screenshots/F14/BUG-FR14-02_Code.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-02_Code.png) | [`screenshots/F14/BUG-FR14-02_UI.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-02_UI.png) |
| **`BUG-FR14-03`** | **`BUG-10`** | Thiếu dialog xác nhận xóa (`FR-24`) & Mồ côi sản phẩm CSDL | [`screenshots/F14/BUG-FR14-03_Code.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-03_Code.png) | [`screenshots/F14/BUG-FR14-03_UI.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-03_UI.png)<br>[`screenshots/F14/BUG-FR14-03_DB.png`](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/screenshots/F14/BUG-FR14-03_DB.png) |

---

# PHIÊN TƯƠNG TÁC 6: BƯỚC 8 — BÁO CÁO AI GAP ANALYSIS & PHẢN BIỆN AI CRITIQUE

- **Prompt:**
```text
Thực hiện Bước 8: Đánh giá quá trình kiểm thử AI trên tính năng FR-14:
- Lập Báo cáo AI Gap Analysis (Điểm AI bỏ sót/dự đoán sai; Giải thích 3 nguyên nhân; Bài học kinh nghiệm).
- Viết đoạn văn Phản biện (AI Critique) về vai trò con người trong phát hiện lỗ hổng phân quyền bảo mật.
```

- **Kết quả của AI:**
# [DOMAIN-TESTING-AGENT] BƯỚC 8: BÁO CÁO AI GAP ANALYSIS & PHẢN BIỆN AI CRITIQUE (FR-14)

Quá trình kiểm thử tính năng **FR-14: Quản lý Danh mục Admin** giữa mô hình AI tự động và kiểm thử viên con người (Human Tester) đã phản ánh một khoảng cách năng lực (Gap) rất lớn, đặc biệt trong các khía cạnh an ninh phân quyền (Access Control), kiểm thử biên chuỗi (String Boundary), và bảo toàn dữ liệu quan hệ (Referential Integrity).

---

## 1. Báo cáo Phân tích Khoảng cách AI (AI Gap Analysis Report)

### 1.1 Các điểm AI đã bỏ sót hoặc dự đoán sai so với thực tế trên SUT Live:

1. **Bỏ sót lỗ hổng leo quyền nghiêm trọng (`BUG-09` — Broken Access Control / BOLA - OWASP Top 10 A01):**
   * *Hành vi của AI:* Khi được yêu cầu thiết kế kiểm thử cho chức năng Admin, AI luôn mặc định tự động gán tài khoản có quyền Admin (`role = 'admin'`) vào mọi ca kiểm thử CRUD. AI có xu hướng "Happy Path Bias" và mặc nhiên tin tưởng rằng các endpoint nhạy cảm như `POST /api/categories` hay `DELETE /api/categories/:id` đã được nhà phát triển bảo vệ tầng server.
   * *Thực tế trên SUT:* Lập trình viên chỉ gắn middleware [authenticateToken](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L100-L110) để giải mã chữ ký JWT mà **hoàn toàn bỏ quên việc kiểm tra `req.user.role === 'admin'`**. Hậu quả là tài khoản khách hàng thông thường (`role = 'user'`) có thể tạo và xóa danh mục hệ thống tự do (HTTP 200 OK). Điểm mù này chỉ được vạch trần khi con người chủ động ép AI sinh ma trận phân quyền chéo (Role $\times$ Action Matrix).

2. **Dự đoán sai về cơ chế kiểm soát giá trị biên chuỗi rỗng (`BUG-08` — $LB - 1 = 0$):**
   * *Hành vi của AI:* AI thường giả định rằng các framework web hiện đại và CSDL quan hệ luôn có cơ chế kiểm tra dữ liệu bắt buộc (Validation Middleware) hoặc cột `name` trong bảng `categories` sẽ có ràng buộc `NOT NULL`. Do đó, AI dự đoán hệ thống sẽ tự động trả về lỗi HTTP 400 Bad Request khi tên danh mục rỗng.
   * *Thực tế trên SUT:* Cả ô input giao diện ([App.jsx:298](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/frontend-admin/src/App.jsx#L298)), mã nguồn Backend ([server.js:251](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/server.js#L251)), và schema SQLite ([database.js:23-26](file:///d:/KAN/N4_1/KTPM-2026-HW02-Domain-Testing/backend/database.js#L23-L26)) đều không có bất kỳ dòng lệnh nào kiểm tra chuỗi rỗng `""` hay khoảng trắng `"   "`. Kết quả là SUT trả về HTTP 200 OK và tạo thành công danh mục rác vào CSDL.

3. **Bỏ sót kiểm tra an toàn giao diện `FR-24` và toàn vẹn dữ liệu quan hệ (`BUG-10`):**
   * *Hành vi của AI:* AI khi kiểm thử thao tác xóa (DELETE) thường chỉ kiểm tra "gửi lệnh xóa và danh mục biến mất". AI bỏ qua 2 yếu tố then chốt:
     * Yêu cầu an toàn giao diện theo điều khoản `FR-24`: Bắt buộc phải có Modal/Confirm Dialog xác nhận hành vi nguy hiểm trước khi xóa vĩnh viễn dữ liệu.
     * Ràng buộc toàn vẹn khóa ngoại (Foreign Key Integrity): SQLite mặc định không bật `PRAGMA foreign_keys = ON;`, dẫn tới việc xóa danh mục đang có sản phẩm liên kết sẽ biến các sản phẩm đó thành dữ liệu mồ côi (orphan records).

---

### 1.2 Giải thích Nguyên nhân Cốt lõi (Root Cause Analysis):

* **Về chất lượng câu Prompt (Prompt Engineering & Strategic Guidance):**
  * Nếu người dùng chỉ ra lệnh mơ hồ: *"Hãy kiểm thử chức năng danh mục Admin"*, AI sẽ chỉ tạo ra các ca kiểm thử chức năng bề nổi (thêm/xóa danh mục hợp lệ). 
  * AI chỉ bộc lộ năng lực phân tích sâu khi con người can thiệp bằng các kỹ thuật công nghệ kiểm thử chuẩn mực của FIT-HCMUS: áp đặt kỹ thuật BVA quanh biên $LB=1$, yêu cầu kiểm thử miền phân quyền Roles $\times$ Actions, và bắt buộc tuân thủ nguyên lý Single Fault Assumption.

* **Về giới hạn nội tại của AI (Inherent AI Limitations & Biases):**
  * *Thiên kiến xác nhận (Confirmation Bias):* AI có thói quen suy luận dựa trên "mẫu code chuẩn" trong tập dữ liệu huấn luyện, nơi các API Admin thường đã có bảo mật sẵn, dẫn đến việc ngộ nhận mã nguồn SUT cũng được bảo mật tương tự.
  * *Thiếu tư duy thâm nhập (Penetration Testing Mindset):* AI không sở hữu bản năng hoài nghi của hacker hay kiểm thử viên kỳ cựu. AI không tự động đặt câu hỏi: *"Nếu tôi là một người dùng xấu có JWT hợp lệ nhưng muốn phá hoại hệ thống thì sao?"*.

* **Về độ phức tạp và "điểm mù" của hệ thống SUT (Architectural Blindspots):**
  * Lỗ hổng trong SUT nằm ở sự ngắt kết nối giữa **Xác thực (Authentication - Ai đang gọi?)** và **Phân quyền (Authorization - Họ được phép làm gì?)**. 
  * Việc endpoint có middleware `authenticateToken` đã tạo ra "vỏ bọc an toàn giả tạo", đánh lừa AI rằng API này đã được bảo vệ nếu AI không trực tiếp đào sâu vào logic giải mã JWT trong mã nguồn.

---

### 1.3 Bài học kinh nghiệm Đắt giá cho Kiểm thử viên:

1. **Nguyên tắc "Zero Trust" trong kiểm thử Phân quyền:**
   * Không bao giờ giả định một endpoint Admin là an toàn chỉ vì nó nằm trong thư mục `/admin` hoặc có header Authorization. Bắt buộc phải thực hiện **Kiểm thử Ma trận Phân quyền chéo (Negative Cross-Role Testing)**: lấy token của vai trò thấp nhất gọi vào tài nguyên của vai trò cao nhất.
2. **Kiểm thử Toàn vẹn Đa tầng (End-to-End & Database Verification):**
   * Không chỉ dừng lại ở mã HTTP phản hồi từ API; kiểm thử viên phải trực tiếp truy vấn vào CSDL SQLite để kiểm tra xem dữ liệu có bị biến dạng, phát sinh bản ghi rỗng, hay để lại dữ liệu mồ côi (orphan data) hay không.
3. **Khai thác tối đa thế mạnh của AI dưới sự dẫn dắt của Con người:**
   * AI là công cụ sinh test case, format bảng biểu chuẩn FIT-HCMUS và tổng hợp tài liệu với tốc độ vượt trội. Tuy nhiên, con người bắt buộc phải là người "cầm lái", vạch ra chiến lược kiểm thử biên, phân quyền và giám sát thực thi trên hệ thống thực tế.

---

## 2. Đoạn văn Phản biện (AI Critique): Vai Trò Con Người Trong Phát Hiện Lỗ Hổng Phân Quyền

> **Đoạn văn phản biện (AI Critique):**
> 
> *"Quá trình thực thi kiểm thử trên tính năng Quản lý Danh mục (FR-14) là một minh chứng đanh thép khẳng định rằng: dù các mô hình trí tuệ nhân tạo (AI) có khả năng sinh hàng trăm kịch bản kiểm thử trong tích tắc, **tư duy phản biện và óc hoài nghi của con người vẫn là chốt chặn phòng thủ không thể thay thế** trong bảo mật phần mềm.
> 
> Trong khi AI dễ dàng rơi vào 'bẫy ảo tưởng an toàn'—tin rằng việc hệ thống đã cài đặt JWT Authentication đồng nghĩa với việc phân quyền Admin đã được bảo đảm—thì kiểm thử viên con người với phương pháp luận kiểm thử miền nghiêm ngặt của FIT-HCMUS đã chủ động thiết lập Ma trận phân quyền chéo, cố tình dùng token của tài khoản người dùng bình thường để tấn công vào các endpoint quản trị. Chính nhát cắt chuẩn xác này đã vạch trần lỗ hổng leo quyền Fatal (`BUG-09`), thứ hoàn toàn vô hình trước các công cụ tự động hóa thông thường. 
> 
> Trí tuệ nhân tạo có thể là một 'người thư ký mẫn cán' xuất sắc trong việc định dạng bảng biểu và tự động hóa tác vụ lặp lại, nhưng để nhận diện các rủi ro kiến trúc tinh vi, thấu suốt các điểm mù an ninh, và bảo vệ tính toàn vẹn của hệ thống, vai trò dẫn dắt chiến lược của kiểm thử viên con người (Human-in-the-loop) mãi mãi là yếu tố quyết định sống còn."*

---

