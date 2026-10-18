# Báo cáo Kiểm thử: Feature B (Pool B) — FR-09: Mã Giảm Giá (Discount Coupons)

**Học phần:** Kiểm thử Phần mềm (FIT-HCMUS)  
**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis on EShop  
**Tính năng kiểm thử:** `FR-09: Discount Coupons (Shopping Cart & Checkout)`  
**Kỹ thuật áp dụng:** Kiểm thử miền (Domain Testing / Decision Table Testing), Phân hoạch tương đương (EP), Phân tích giá trị biên (BVA)  

---

## 1. Phân tích Đặc tả Yêu cầu & Xác định Biến (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả (SRS Ground Truth)
Theo tài liệu đặc tả hệ thống `EShop` (FR-09):
Tại bước Checkout, hệ thống áp dụng giảm giá khi và chỉ khi thỏa mãn đồng thời **5 điều kiện vị từ (Predicates)**:
- **C1 (Mã tồn tại & hoạt động):** Mã có trong CSDL và `is_active = 1`.
- **C2 (Còn hạn sử dụng):** Ngày hiện tại phải trước hạn dùng (`now < expired_at`).
- **C3 (Đủ ngưỡng đơn hàng):** Tổng đơn hàng **$\ge$ (lớn hơn hoặc bằng)** `min_order_amount`.
- **C4 (Đã đăng nhập):** Người dùng phải có JWT Token hợp lệ (`user_id` xác thực).
- **C5 (Chưa dùng hết lượt):** Số lần user đã dùng mã này $< `max_uses_per_user`.

**Công thức tính toán:**
- Loại `percent`: `discount_amount = total * discount_value / 100`
- Loại `fixed`: `discount_amount = discount_value`
- `final_amount = total - discount_amount`

### 1.2 Danh sách Biến Đầu vào (Inputs) & Đầu ra (Outputs)

| Tên biến | Kiểu dữ liệu | Ý nghĩa | Ràng buộc nghiệp vụ (Constraints) |
| :--- | :--- | :--- | :--- |
| `code` | String | Ký hiệu mã giảm giá | Tồn tại trong CSDL, `is_active = 1` |
| `total_amount` | Integer | Tổng giá trị đơn hàng trước giảm giá | Phải $\ge min\_order\_amount$ |
| `user_token` / `user_id` | String / Int | Danh tính người mua hàng | Bắt buộc phải đăng nhập (token hợp lệ) |
| `expired_at` | DateTime | Hạn sử dụng của mã | Thời điểm hiện tại `now < expired_at` |
| `usage_count` | Integer | Số lần user đã dùng mã này | $usage\_count < max\_uses\_per\_user$ |

**Kết quả đầu ra kỳ vọng (Outputs):**
- **Output 1 (Áp dụng thành công):** Trả về `discount_amount` đúng công thức, `final_amount = total - discount_amount`.
- **Output 2 (Từ chối / Lỗi):** Thông báo lỗi rõ ràng tương ứng với điều kiện vi phạm.

---

## 2. Phân hoạch Lớp Tương đương (Equivalence Partitioning - EP)

| Biến kiểm tra | Mã lớp | Mô tả lớp tương đương (Equivalence Class) | Phân loại |
| :--- | :---: | :--- | :---: |
| **Mã giảm giá (`code`)** | **EC01** | Mã có trong CSDL và đang hoạt động (`is_active = 1`) | Valid |
| | **EC02** | Mã không tồn tại trong CSDL | Invalid |
| | **EC03** | Mã có trong CSDL nhưng đã bị vô hiệu hóa (`is_active = 0`) | Invalid |
| | **EC04** | Để trống mã giảm giá | Invalid |
| **Tổng tiền (`total_amount`)** | **EC05** | $total\_amount \ge min\_order\_amount$ (Đủ ngưỡng tối thiểu) | Valid |
| | **EC06** | $total\_amount < min\_order\_amount$ (Chưa đủ ngưỡng tối thiểu) | Invalid |
| | **EC07** | $total\_amount \le 0$ (Giá trị không hợp lệ) | Invalid |
| **Hạn sử dụng (`expired_at`)** | **EC08** | Ngày hiện tại trước hạn dùng ($now < expired\_at$) | Valid |
| | **EC09** | Mã đã hết hạn ($now \ge expired\_at$) | Invalid |
| **Đăng nhập (`auth_state`)** | **EC10** | Người dùng đã đăng nhập (Token JWT hợp lệ) | Valid |
| | **EC11** | Người dùng chưa đăng nhập (Khách vãng lai / Không có token) | Invalid |
| **Số lượt dùng (`usage_count`)** | **EC12** | Số lần đã dùng $< max\_uses\_per\_user$ | Valid |
| | **EC13** | Số lần đã dùng $\ge max\_uses\_per\_user$ (Hết lượt dùng) | Invalid |
| **Loại mã (`type`)** | **EC14** | Mã giảm theo phần trăm (`type = 'percent'`) | Valid |
| | **EC15** | Mã giảm theo số tiền cố định (`type = 'fixed'`) | Valid |

---

## 3. Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

Lấy mã mẫu chuẩn **`SAVE10`** trong hệ thống EShop:
- Ngưỡng tối thiểu: `min_order_amount = 300,000 ₫`.
- Ràng buộc: $total\_amount \ge 300,000$ (Biên dưới $LB = 300,000$).

Ta xác định các điểm kiểm thử biên:
- $LB - 1 = 299,999$ ₫: Điểm OFF (Invalid - Chưa đủ ngưỡng tối thiểu, hệ thống phải từ chối).
- $LB = 300,000$ ₫: Điểm ON (Valid - Đạt ngưỡng tối thiểu chính xác, hệ thống PHẢI chấp nhận).
- $LB + 1 = 301,000$ ₫: Điểm IN (Valid - Vượt trên ngưỡng tối thiểu).
- $Nominal = 500,000$ ₫: Điểm danh định điển hình (Valid).

| STT | Điểm biên | Giá trị kiểm thử (`total_amount`) | Dự kiến (Expected Output) |
| :---: | :---: | :---: | :--- |
| **BV01** | $LB - 1$ | 299,999 ₫ | Từ chối: "Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫" |
| **BV02** | $LB$ | 300,000 ₫ | **Chấp nhận giảm 10% (giảm 30,000 ₫, còn 270,000 ₫)** |
| **BV03** | $LB + 1$ | 300,001 ₫ | Chấp nhận giảm 10% |
| **BV04** | $Nom$ | 500,000 ₫ | Chấp nhận giảm 10% (giảm 50,000 ₫, còn 450,000 ₫) |

---

## 4. Kiểm thử Miền Đa biến (Decision Table Testing)

Có 5 điều kiện vị từ: $C_1 \land C_2 \land C_3 \land C_4 \land C_5$. Bảng quyết định rút gọn thể hiện các luật nghiệp vụ:

| Nguyên nhân / Điều kiện (Causes) | Rule 1 | Rule 2 | Rule 3 | Rule 4 | Rule 5 | Rule 6 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| $C_1$: Mã tồn tại & Active | **T** | **F** | T | T | T | T |
| $C_2$: Còn hạn sử dụng ($now < expired$) | **T** | - | **F** | T | T | T |
| $C_3$: Đủ ngưỡng tiền ($total \ge min$) | **T** | - | - | **F** | T | T |
| $C_4$: Đã đăng nhập (Có JWT Token) | **T** | - | - | - | **F** | T |
| $C_5$: Chưa hết lượt ($uses < max$) | **T** | - | - | - | - | **F** |
| **Kết quả kỳ vọng (Effects)** | | | | | | |
| $E_1$: Áp dụng thành công, tính chiết khấu | **X** | | | | | |
| $E_2$: Báo lỗi mã không tồn tại / vô hiệu hóa | | **X** | | | | |
| $E_3$: Báo lỗi mã đã hết hạn | | | **X** | | | |
| $E_4$: Báo lỗi đơn hàng chưa đủ giá trị | | | | **X** | | |
| $E_5$: Báo lỗi yêu cầu đăng nhập | | | | | **X** | |
| $E_6$: Báo lỗi đã dùng hết số lượt cho phép | | | | | | **X** |

---

## 5. Thiết kế Bộ Ca Kiểm thử & Kết quả Thực thi trên SUT

Bảng đối chiếu kết quả thực thi kiểm thử đa tầng giữa **Đơn vị API (`/api/apply-coupon`)** và **Kiểm chứng thực tế trên luồng Web UI & Checkout (`/checkout`)**:

| TC ID | Mục tiêu kiểm thử | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng theo SRS | Kết quả thực tế tại API (`/api/apply-coupon`) | Kết quả kiểm chứng thực tế trên Web UI / Checkout | Trạng thái | Mã Lỗi (Bug ID) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-CPN-01** | Kiểm tra tại chính xác biên dưới $LB = 300,000$ ₫ | `code`: `"SAVE10"`<br>`total`: `300,000` ₫ | Áp dụng thành công, giảm 30,000 ₫, còn 270,000 ₫ | **BỊ TỪ CHỐI:** Báo lỗi *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫"* do code dùng `>` thay vì `>=`. | Bấm Áp dụng trên Web: Hiện lỗi đỏ 400 *"Đơn hàng chưa đủ giá trị tối thiểu 300.000đ"*. | <span style="color:red">**FAIL**</span> | `BUG-FR09-01` (BUG-05) |
| **TC-CPN-02** | Kiểm tra mã giảm giá cố định (`fixed`) | `code`: `"BIGBUY"` (50,000 ₫)<br>`total`: `600,000` ₫ | Giảm `50,000 ₫`, thanh toán `550,000 ₫` | Áp dụng thành công (HTTP 200), giảm đúng 50,000 ₫, còn 550,000 ₫. | UI hiển thị chiết khấu 50,000 ₫, cập nhật tổng tiền thành công. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-03** | Kiểm tra trên biên dưới 1 đơn vị ($LB + 1 = 300,001$ ₫) | `code`: `"SAVE10"`<br>`total`: `300,001` ₫ | Áp dụng thành công, giảm 10% (30,000 ₫) | Áp dụng được (HTTP 200) nhưng **tính sai công thức**: `discount_amount = -2,700,009 ₫`! | UI nhận số tiền âm, đẩy tổng thanh toán lên cao bất thường. | <span style="color:red">**FAIL**</span> | `BUG-FR09-02` (BUG-06) |
| **TC-CPN-04** | Kiểm tra công thức giảm giá phần trăm danh định ($Nom = 500,000$ ₫) | `code`: `"SAVE10"` (10%)<br>`total`: `500,000` ₫ | Giảm `50,000 ₫`, thanh toán `450,000 ₫` | Tính theo công thức `total * (1 - 10)` $\to$ `discount_amount = -4,500,000 ₫`, tổng tiền bị cộng thêm thành `5,000,000 ₫`! | UI hiển thị số tiền thanh toán bị đội lên 5,000,000 ₫. | <span style="color:red">**FAIL**</span> | `BUG-FR09-02` (BUG-06) |
| **TC-CPN-05** | Kiểm tra dưới biên dưới ($LB - 1 = 299,999$ ₫) | `code`: `"SAVE10"`<br>`total`: `299,999` ₫ | Từ chối do chưa đạt ngưỡng tối thiểu (HTTP 400) | Báo lỗi 400: *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫"*. | UI hiển thị thông báo lỗi màu đỏ, giữ nguyên tổng tiền. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-06** | Kiểm tra tổng tiền đơn hàng bằng 0 ($Extreme\_Min$) | `code`: `"SAVE10"`<br>`total`: `0` ₫ | Từ chối do đơn 0đ không hợp lệ (HTTP 400) | Báo lỗi 400 do $0 < 300,000$ ₫. | **NGUY HIỂM:** Khi thêm món 0đ hoặc sửa input thành 0đ, bấm "Đặt Hàng" $\to$ **Đơn 0đ vẫn thanh toán được thành công!** | <span style="color:red">**FAIL (Flow)**</span> | `BUG-FR08-02` *(Checkout)* |
| **TC-CPN-07** | Kiểm tra mã không tồn tại trong CSDL | `code`: `"KHONGTONTAI"`<br>`total`: `500,000` ₫ | Báo lỗi mã không tồn tại (HTTP 404) | Báo lỗi 404: *"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"*. | UI hiển thị lỗi màu đỏ chính xác. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-08** | Kiểm tra khi để trống ô mã giảm giá | `code`: `""`<br>`total`: `500,000` ₫ | Báo lỗi yêu cầu nhập mã (HTTP 400) | Backend API trả về 400: `{"error": "Vui lòng nhập mã giảm giá"}`. | • Bấm "Áp dụng": UI im lặng không phản hồi (`BUG-FR08-03`).<br>• Bấm "Đặt Hàng": **Vẫn thanh toán pass theo giá gốc** (vì coupon là tùy chọn). | <span style="color:green">**PASS (API)**</span><br><span style="color:orange">**NOTE (UI)**</span> | `BUG-FR08-03` *(Checkout)* |
| **TC-CPN-09** | Kiểm tra mã đã hết hạn sử dụng | `code`: `"EXPIRED"`<br>`total`: `500,000` ₫ | Báo lỗi mã hết hạn (HTTP 400) | Báo lỗi 400: *"Mã giảm giá đã hết hạn"*. | UI hiển thị lỗi màu đỏ chính xác. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-10** | Kiểm tra điều kiện C4: Khách vãng lai chưa đăng nhập | `code`: `"SAVE10"`<br>`total`: `500,000` ₫<br>Không có Token | Báo lỗi 401 yêu cầu đăng nhập | **BYPASS C4:** Backend API thiếu `authenticateToken`, cho phép khách vãng lai áp mã tự do (`success: true`)! | **BẢO VỆ TẠI CHECKOUT:** Bấm "Đặt Hàng" $\to$ backend `/api/checkout` chặn lại và báo **HTTP 401 Unauthorized** chính xác! | <span style="color:red">**FAIL (API)**</span><br><span style="color:green">**PASS (Checkout)**</span> | `BUG-FR09-03` (BUG-07) |
| **TC-CPN-11** | Kiểm tra điều kiện C5: Vượt số lượt dùng ($max\_uses = 1$) | `code`: `"SAVE10"`<br>User đã dùng 1 lần | Báo lỗi đã hết số lượt cho phép (HTTP 400) | Báo lỗi 400: *"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"*. | UI hiển thị thông báo đã đạt giới hạn. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-12** | Áp dụng thành công cho mã có hạn mức nhiều lần (`VIP100` - lần 2) | `code`: `"VIP100"` ($max = 2$)<br>User đã dùng 1 lần | Áp dụng thành công lần 2 (HTTP 200), giảm 100k | Áp dụng thành công, giảm 100,000 ₫, thanh toán 400,000 ₫. | UI cập nhật số tiền chiết khấu chính xác. | <span style="color:green">**PASS**</span> | — |

---

### HỘP THỐNG KÊ KẾT QUẢ KIỂM THỬ (TEST SUMMARY)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ESHOP FR-09 TEST SUMMARY                          │
├────────────────────────────────────────────────────────────────────────┤
│  Tổng số ca kiểm thử thiết kế:       12 ca (100%)                      │
│  Số ca kiểm thử ĐẠT (PASS):          8 ca (66.7%)                      │
│  Số ca kiểm thử KHÔNG ĐẠT (FAIL):    4 ca (33.3%)                      │
│                                                                        │
│  [Danh sách Bugs xác thực]:                                            │
│  • BUG-FR09-01 / BUG-05 (Serious): Lỗi toán tử so sánh biên '>' tại LB 300,000 ₫     │
│  • BUG-FR09-02 / BUG-06 (Fatal): Lỗi công thức chiết khấu phần trăm ra số âm         │
│  • BUG-FR09-03 / BUG-07 (Medium): Lỗ hổng thiếu middleware auth tại /api/apply-coupon│
│  • BUG-FR08-01 (Fatal - Checkout): UI cho phép khách hàng tự sửa tổng tiền        │
│  • BUG-FR08-02 (Fatal - Checkout): Backend chấp nhận cho thanh toán đơn 0 ₫       │
│  • BUG-FR08-03 (Minor - Checkout): UI im lặng khi bấm Áp dụng ô mã rỗng           │
│                                                                        │
│  [Đánh giá]: Mức độ khuyết tật rất cao, đặc biệt ở luồng thanh toán.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Phân tích Thiếu sót của AI (AI Gap Analysis)

### 6.1 Những điểm AI bỏ sót khi sinh kiểm thử Coupon:
1. **Bỏ sót lỗi toán tử so sánh biên tại $LB$:** Khi sinh test case cho điều kiện $total \ge 300,000$, các công cụ AI thông thường hay chọn ngẫu nhiên một con số như $500,000$ (điểm danh định). Điều này làm cho test case luôn Pass và **HOÀN TOÀN BỎ SÓT** con bọ nghiêm trọng tại điểm biên chính xác $300,000$ (khi lập trình viên gõ nhầm toán tử `>` thay vì `>=`).
2. **Bỏ sót lỗi công thức toán học (`discount_amount` âm):** AI thường kỳ vọng code backend tính đúng theo công thức chuẩn (`total * 10 / 100`) mà không ngờ lập trình viên viết nhầm biểu thức `total * (1 - discount_value)`.
3. **Bỏ sót kiểm tra điều kiện đăng nhập (C4):** Khi kiểm thử API `/api/apply-coupon`, AI thường lấy sẵn một `user_id` hợp lệ để test, dẫn tới không phát hiện ra việc API cho phép người dùng ẩn danh (unauthenticated) áp dụng mã thoải mái.
4. **Bỏ sót kiểm thử tích hợp giữa các tầng (API vs UI/Checkout):**
   - AI chỉ tập trung vào một API đơn lẻ (`/api/apply-coupon`), mà bỏ quên việc kiểm chứng xem dữ liệu sau khi áp mã được chuyển giao qua API `/api/checkout` như thế nào.
   - Chính nhờ kiểm chứng thực tế từ người dùng (User Verification) trên Web UI đã phát hiện ra lỗ hổng cho phép thanh toán đơn 0đ (`BUG-FR08-02`) và việc giao diện im lặng khi bấm Áp dụng ô mã rỗng (`BUG-FR08-03`).

### 6.2 Bài học kinh nghiệm:
- Giá trị lớn nhất của Phân tích Giá trị Biên (BVA) là **bắt buộc phải test chính xác tại điểm $LB$ và $UB$**, không được phép chỉ dựa vào điểm danh định (Nominal).
- **Kiểm thử đa tầng (Multi-tier Testing):** Luôn kết hợp kiểm thử đơn vị API (API testing) với kiểm thử luồng tích hợp trên giao diện (End-to-End UI testing) để tránh bỏ lọt lỗi bất đồng bộ trạng thái giữa client và server.

---

## 7. Báo Cáo Lỗi Chi Tiết Chuẩn 10 Trường (Defect Reports - FIT-HCMUS Standard)

### 7.1 BUG REPORT 01: `BUG-05`
**Tên lỗi:** Lỗi toán tử so sánh biên — Từ chối mã giảm giá khi tổng đơn hàng bằng đúng ngưỡng tối thiểu

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR09-01` (BUG-05) |
| **2** | **Function Name** | `FR-09: Discount Coupons (Backend API & Cart)` |
| **3** | **Problem Summary** | Áp dụng mã `SAVE10` với tổng đơn hàng bằng đúng giá trị tối thiểu 300,000 ₫ (điểm biên $LB$), hệ thống từ chối do code dùng toán tử `>` thay vì `>=`. |
| **4** | **How to Reproduce** | • **Môi trường:** Node.js v18+, Chrome, URL: `http://localhost:3000/api/apply-coupon`<br>• **Các bước:**<br>1. Thêm sản phẩm vào giỏ có tổng tiền đúng `300,000 ₫`.<br>2. Nhập mã `SAVE10` và bấm "Áp dụng".<br>• **Expected:** Hệ thống chấp nhận mã, giảm 10% (30,000 ₫), còn 270,000 ₫.<br>• **Actual:** Báo lỗi 400 *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫"*. |
| **5** | **Reported By** | Sinh viên kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `High` |
| **10** | **Severity** | `Serious (Trọng số 5)` |

* **Root Cause & Fix:** Tại `backend/server.js:379`, sửa `if (total_amount > coupon.min_order_amount)` thành `if (total_amount >= coupon.min_order_amount)`.

---

### 7.2 BUG REPORT 02: `BUG-06`
**Tên lỗi:** Lỗi công thức toán học — Chiết khấu phần trăm bị âm, làm tăng giá trị đơn hàng

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR09-02` (BUG-06) |
| **2** | **Function Name** | `FR-09: Discount Coupons (Backend API & Checkout)` |
| **3** | **Problem Summary** | Áp dụng mã giảm giá phần trăm (`percent`), hệ thống tính ra số tiền chiết khấu âm, dẫn đến tổng tiền thanh toán bị đội lên gấp nhiều lần giá trị thực. |
| **4** | **How to Reproduce** | • **Môi trường:** Node.js v18+, Chrome.<br>• **Các bước:**<br>1. Tạo đơn hàng giá trị `500,000 ₫`.<br>2. Áp dụng mã `SAVE10` (giảm 10%).<br>• **Expected:** `discount_amount = 50,000 ₫`, `final_amount = 450,000 ₫`.<br>• **Actual:** `discount_amount = -4,500,000 ₫`, `final_amount = 5,000,000 ₫` (tăng gấp 10 lần). |
| **5** | **Reported By** | Sinh viên kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

* **Root Cause & Fix:** Tại `backend/server.js:399`, sửa `discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));` thành `Math.floor(total_amount * (coupon.discount_value / 100));`.

---

### 7.3 BUG REPORT 03: `BUG-07`
**Tên lỗi:** Bỏ qua điều kiện C4 — Khách vãng lai chưa đăng nhập vẫn áp dụng được mã giảm giá

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR09-03` (BUG-07) |
| **2** | **Function Name** | `FR-09: Discount Coupons (Access Control)` |
| **3** | **Problem Summary** | Endpoint `/api/apply-coupon` không có middleware xác thực JWT, cho phép khách vãng lai gọi API áp mã tự do. |
| **4** | **How to Reproduce** | • **Các bước:** Gửi request `POST /api/apply-coupon` với `user_id = null` và không truyền Header Authorization.<br>• **Expected:** Trả về HTTP 401 Unauthorized yêu cầu đăng nhập.<br>• **Actual:** Trả về HTTP 200 OK và áp dụng mã thành công. |
| **5** | **Reported By** | Sinh viên kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Medium` |
| **10** | **Severity** | `Serious (Trọng số 5)` |

* **Root Cause & Fix:** Tại `backend/server.js:363`, bổ sung `authenticateToken` vào định nghĩa route `app.post("/api/apply-coupon", authenticateToken, ...)`.

---

### 7.4 BUG REPORT 04: `BUG-FR08-01`
**Tên lỗi:** Lỗ hổng nghiêm trọng — Cho phép khách hàng tự ý chỉnh sửa tổng tiền thanh toán trên UI

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR08-01` |
| **2** | **Function Name** | `FR-08: Shopping Cart & Checkout (Web UI)` |
| **3** | **Problem Summary** | Ô "Tổng tiền thanh toán" được thiết kế bằng thẻ `<input type="number">`, cho phép người dùng nhập bất kỳ số tiền nào (kể cả 0đ hoặc 1.000đ) để thanh toán. |
| **4** | **How to Reproduce** | • **Các bước:**<br>1. Thêm sản phẩm vào giỏ, đi tới `/checkout`.<br>2. Nhập số tiền tùy ý vào ô "Tổng tiền thanh toán (VND):" (ví dụ: `1000`).<br>3. Bấm "Đặt Hàng".<br>• **Expected:** Trường tổng tiền là nhãn tĩnh (`<span>`), không thể chỉnh sửa.<br>• **Actual:** Sửa tiền thành công và gửi giá trị bị thao túng lên backend. |
| **5** | **Reported By** | Sinh viên kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Frontend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

* **Root Cause & Fix:** Tại `frontend-web/src/pages/Checkout.jsx:93-102`, thay thẻ `<input>` bằng `<span className="font-bold text-red-600">{editableTotal.toLocaleString()} ₫</span>`.

---

### 7.5 BUG REPORT 05: `BUG-FR08-02`
**Tên lỗi:** Lỗ hổng nghiệp vụ — Backend chấp nhận thanh toán đơn hàng giá trị 0 ₫

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR08-02` *(Checkout)* |
| **2** | **Function Name** | `FR-08: Order Checkout (Backend API)` |
| **3** | **Problem Summary** | Endpoint `/api/checkout` không kiểm tra $total\_amount > 0$ và không tính lại tổng tiền từ giỏ hàng, cho phép thanh toán đơn hàng 0 ₫ thành công. |
| **4** | **How to Reproduce** | • **Các bước:**<br>1. Thêm món hàng 0đ (hoặc sửa input tổng tiền thành 0đ).<br>2. Bấm "Đặt Hàng" (gửi `POST /api/checkout` với `total_amount: 0`).<br>• **Expected:** Backend từ chối đơn hàng với HTTP 400: *"Giá trị đơn hàng không hợp lệ"*.<br>• **Actual:** Backend trả về HTTP 200 `"Checkout successful"` và ghi nhận đơn hàng vào CSDL. |
| **5** | **Reported By** | Sinh viên kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

* **Root Cause & Fix:** Tại `backend/server.js:297-308`, bổ sung validation `if (!total_amount || total_amount <= 0) return res.status(400)...` và luôn tính toán lại tổng tiền từ CSDL.

---

## 8. Minh chứng Kiểm thử (Defect Evidence & Screenshots)

Toàn bộ minh chứng cho Feature B (FR-09) và luồng liên đới Checkout (FR-08) được lưu trữ tại thư mục `screenshots/F09/` với 2 nhóm ảnh chuẩn hóa:

| Mã Bug | Tên Lỗi Phát Hiện | Minh Chứng Mã Lỗi (VS Code IDE) | Minh Chứng Thực Tế (UI / Luồng SUT) |
| :---: | :--- | :--- | :--- |
| **`BUG-FR09-01`** | Lỗi toán tử so sánh biên (`total > min`) | `screenshots/F09/BUG-FR09-01_Code.png` | `screenshots/F09/BUG-FR09-01_UI.png` |
| **`BUG-FR09-02`** | Sai công thức % chiết khấu ra số âm | `screenshots/F09/BUG-FR09-02_Code.png` | `screenshots/F09/BUG-FR09-02_UI.png` |
| **`BUG-FR09-03`** | Bỏ qua xác thực auth C4 khách vãng lai | `screenshots/F09/BUG-FR09-03_Code.png` | `screenshots/F09/BUG-FR09-03_UI.png` |
| **`BUG-FR08-01`** | UI cho phép tự sửa tổng tiền thanh toán | `screenshots/F09/BUG-FR08-01_Code.png` | `screenshots/F09/BUG-FR08-01_UI.png` |
| **`BUG-FR08-02`** | Backend duyệt đơn hàng 0 ₫ thành công | `screenshots/F09/BUG-FR08-02_Code.png` | `screenshots/F09/BUG-FR08-02_UI.png` |
| **`BUG-FR08-03`** | UI im lặng khi bấm Áp dụng ô mã rỗng | `screenshots/F09/BUG-FR08-03_Code.png` | `screenshots/F09/BUG-FR08-03_UI.png` |


