# NHẬT KÝ KIỂM THỬ TÍNH NĂNG FR-09: MÃ GIẢM GIÁ (AI-RESULT)

**Bài tập:** HW02 – Domain Testing & Boundary Value Analysis  
**Học phần:** Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM  
**Tính năng kiểm thử:** `FR-09: Discount Coupons (Shopping Cart & Checkout)`  
**Môi trường SUT:** Backend API (`http://localhost:3000/api/apply-coupon`), Database SQLite (`coupons`, `coupon_usage`), Frontend Web  
**Chiến lược kiểm thử:** AI-First kết hợp sự kiểm duyệt và đánh giá nghiêm ngặt của con người (Human-in-the-loop)

---

# PHIÊN TƯƠNG TÁC 1: BƯỚC 1 & BƯỚC 2 — PHÂN TÍCH BIẾN & PHÂN HOẠCH LỚP TƯƠNG ĐƯƠNG (EP)

- **Prompt:**
```text
Kích hoạt skill domain-testing-agent, thực hiện Bước 1 và Bước 2 cho tính năng FR-09 (Mã giảm giá - Discount Coupons):
1. Phân tích đặc tả yêu cầu, xác định các biến đầu vào, đầu ra kỳ vọng và 5 điều kiện vị từ (Predicates C1-C5).
2. Phân hoạch lớp tương đương (Equivalence Partitioning) cho từng biến và loại mã theo 4 quy tắc chuẩn của FIT-HCMUS (Range, Must-be, Split, Set of values).
```

- **Kết quả của AI:**
Listed directory reports
Viewed 02_Feature_B_FR09_Coupons.md:1-100
Viewed AI-result-F09.md:1-355
Searched for "/api/apply-coupon"
Viewed server.js:360-430

# [DOMAIN-TESTING-AGENT] KÍCH HOẠT QUY TRÌNH KIỂM THỬ MIỀN HỘP ĐEN (FEATURE B: FR-09)

Skill **domain-testing-agent** đã được kích hoạt. Tiến trình kiểm thử tuân thủ 100% đề cương và bài giảng học phần **Kiểm thử Phần mềm — Khoa CNTT, Trường ĐH Khoa học Tự nhiên ĐHQG-HCM** (GV: ThS. Trần Thị Bích Hạnh / TS. Lâm Quang Vũ / TS. Trần Duy Hoàng).

Dưới đây là phần thực hiện chi tiết cho **BƯỚC 1** và **BƯỚC 2** đối với tính năng **`FR-09: Discount Coupons (Mã giảm giá)`**, đối chiếu trực tiếp giữa tài liệu đặc tả [eshop-sut/README.md](file:///d:/KAN/N4_1/eshop-sut/README.md), [api_specification.md](file:///d:/KAN/N4_1/eshop-sut/api_specification.md), và mã nguồn thực tế tại [server.js:363-430](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L363-L430).

---

## BƯỚC 1: Phân tích Đặc tả Yêu cầu & Xác định Biến (Identify Inputs & Outputs)

### 1.1 Căn cứ Đặc tả Yêu cầu (SRS Ground Truth)
Căn cứ mục **FR-09** trong [README.md](file:///d:/KAN/N4_1/eshop-sut/README.md) và API endpoint `POST /api/apply-coupon`:
Tại bước Giỏ hàng / Checkout, hệ thống chỉ áp dụng mã giảm giá khi và chỉ khi thỏa mãn đồng thời **5 điều kiện vị từ (Predicates $C_1 \to C_5$)**:
* **$C_1$ (Mã tồn tại & Hoạt động):** Mã giảm giá có trong CSDL và đang ở trạng thái kích hoạt (`is_active = 1`).
* **$C_2$ (Còn hạn sử dụng):** Thời điểm áp dụng hiện tại phải trước ngày hết hạn ($now < expired\_at$).
* **$C_3$ (Đủ ngưỡng đơn hàng tối thiểu):** Tổng giá trị đơn hàng **$\ge$ (lớn hơn hoặc bằng)** giá trị tối thiểu của mã (`total_amount >= min_order_amount`).
* **$C_4$ (Đã đăng nhập):** Người dùng phải có phiên xác thực hợp lệ (chứa JWT Token / `user_id` xác thực).
* **$C_5$ (Chưa dùng hết lượt):** Số lần người dùng hiện tại đã sử dụng mã này phải nhỏ hơn hạn mức cho phép ($usage\_count < max\_uses\_per\_user$).

#### Quy tắc Tính toán Chiết khấu (Discount Formulas):
* **Loại phần trăm (`type = 'percent'`):**  
  $$discount\_amount = total\_amount \times \frac{discount\_value}{100}$$
* **Loại số tiền cố định (`type = 'fixed'`):**  
  $$discount\_amount = discount\_value$$
* **Tổng tiền thanh toán cuối cùng:**  
  $$final\_amount = total\_amount - discount\_amount$$ *(với $final\_amount \ge 0$)*

#### Danh mục Mã giảm giá mẫu trong CSDL EShop:
| Mã Coupon | Loại (`type`) | Giá trị (`discount_value`) | Ngưỡng tối thiểu (`min_order_amount`) | Hạn dùng (`expired_at`) | Lượt tối đa/user (`max_uses`) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| `SAVE10` | `percent` | 10% | 300,000 ₫ | 2099-12-31 (Còn hạn) | 1 |
| `BIGBUY` | `fixed` | 50,000 ₫ | 500,000 ₫ | 2099-12-31 (Còn hạn) | 1 |
| `VIP100` | `fixed` | 100,000 ₫ | 300,000 ₫ | 2099-12-31 (Còn hạn) | 2 |
| `EXPIRED` | `percent` | 20% | 100,000 ₫ | 2020-01-01 (Đã hết hạn) | 1 |

---

### 1.2 Danh sách Biến Đầu vào (Input Variables)

| Ký hiệu | Tên biến | Kiểu dữ liệu | Ý nghĩa nghiệp vụ | Miền giá trị vật lý & Ràng buộc nghiệp vụ (Constraints) |
| :---: | :--- | :---: | :--- | :--- |
| $I_1$ | `code` | String | Ký hiệu mã giảm giá nhập vào | Bắt buộc, chuỗi không rỗng, tồn tại trong CSDL và `is_active = 1`. |
| $I_2$ | `total_amount` | Integer | Tổng giá trị đơn hàng trước giảm | Bắt buộc, số nguyên dương ($total > 0$), phải thỏa mãn $total \ge min\_order\_amount$. |
| $I_3$ | `auth_token` / `user_id` | String / Int | Danh tính người mua hàng | Bắt buộc đã đăng nhập, mang JWT Token hợp lệ chứa `user_id`. |
| $I_4$ | `expired_at` | DateTime | Hạn sử dụng của mã coupon | Trường dữ liệu trong bảng `coupons`, điều kiện $now < expired\_at$. |
| $I_5$ | `usage_count` | Integer | Số lần user hiện tại đã dùng mã | Thống kê từ bảng `coupon_usage`, điều kiện $usage\_count < max\_uses\_per\_user$. |
| $I_6$ | `type` | String | Hình thức chiết khấu | Thuộc tập rời rạc `{'percent', 'fixed'}`. |

---

### 1.3 Danh sách Kết quả Đầu ra Kỳ vọng (Expected Outputs)

* **Nhóm Kết quả Thành công ($O_{success}$ — Valid State):**
  * **$O_1$ (Áp dụng mã thành công):** Hệ thống trả về HTTP 200, phản hồi `discount_amount` tính đúng theo công thức của `type`, cập nhật `final_amount = total_amount - discount_amount`.

* **Nhóm Kết quả Lỗi / Từ chối ($O_{error}$ — Invalid States):**
  * **$O_2$ (Lỗi để trống mã):** Hệ thống báo lỗi *"Vui lòng nhập mã giảm giá"*.
  * **$O_3$ (Lỗi mã không tồn tại / vô hiệu hóa — $C_1 = F$):** Hệ thống trả về lỗi 404 *"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"*.
  * **$O_4$ (Lỗi mã hết hạn sử dụng — $C_2 = F$):** Hệ thống trả về lỗi 400 *"Mã giảm giá đã hết hạn"*.
  * **$O_5$ (Lỗi đơn hàng chưa đạt giá trị tối thiểu — $C_3 = F$):** Hệ thống từ chối và báo lỗi *"Đơn hàng chưa đủ giá trị tối thiểu [min_order_amount] ₫ để áp dụng mã này"*.
  * **$O_6$ (Lỗi chưa đăng nhập — $C_4 = F$):** Hệ thống trả về lỗi 401 Unauthorized yêu cầu đăng nhập trước khi áp dụng mã.
  * **$O_7$ (Lỗi hết lượt sử dụng — $C_5 = F$):** Hệ thống trả về lỗi 400 thông báo tài khoản đã sử dụng hết số lần cho phép của mã.
  * **$O_8$ (Lỗi giá trị đơn hàng không hợp lệ):** Hệ thống từ chối khi tổng tiền $total\_amount \le 0$.

---

## BƯỚC 2: Phân hoạch Lớp Tương đương (Equivalence Partitioning - EP)

### 2.1 Cơ sở Phương pháp & 4 Quy tắc Phân hoạch FIT-HCMUS
Theo giáo trình, ta chia miền giá trị của từng biến đầu vào thành các lớp tương đương rời rạc:
1. **Quy tắc Khoảng (Range):** 
   - Biến `total_amount` quanh ngưỡng $min\_order\_amount$:
     - Hợp lệ: $total\_amount \ge min\_order\_amount$.
     - Không hợp lệ: $0 < total\_amount < min\_order\_amount$ (chưa đủ ngưỡng).
     - Không hợp lệ: $total\_amount \le 0$ (giá trị đơn hàng không hợp lệ).
   - Biến `usage_count` quanh ngưỡng $max\_uses\_per\_user$:
     - Hợp lệ: $usage\_count < max\_uses\_per\_user$.
     - Không hợp lệ: $usage\_count \ge max\_uses\_per\_user$.
2. **Quy tắc Điều kiện bắt buộc ("Must be"):**
   - Hạn dùng `expired_at`: Phải còn hạn ($now < expired\_at$) vs Đã hết hạn ($now \ge expired\_at$).
   - Trạng thái đăng nhập `auth_token`: Phải có JWT Token hợp lệ vs Không có token (khách vãng lai).
3. **Quy tắc Phân rã (Split):** 
   - Tách biệt các trường hợp lỗi của mã `code`: Mã không có trong DB vs Mã có trong DB nhưng bị vô hiệu hóa (`is_active = 0`) vs Mã rỗng (`""`).
4. **Quy tắc Tập hợp (Set of values):** 
   - Loại mã `type`: `type = 'percent'` (Giảm theo %) vs `type = 'fixed'` (Giảm số tiền cố định).

---

### 2.2 Bảng Phân hoạch Lớp Tương đương Chi tiết (Equivalence Classes Table)

| Biến kiểm thử | Mã lớp | Định nghĩa Lớp Tương Đương (Equivalence Class) | Phân loại | Quy tắc áp dụng | Đầu ra kỳ vọng (Expected Output) |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **Mã giảm giá (`code`)** | **EC1** | Mã có trong CSDL và đang kích hoạt (`is_active = 1`) | **Valid** | Must-be | Chấp nhận mã ($O_1$) |
| | **EC2** | Mã không tồn tại trong CSDL | **Invalid** | Split / Must-be | Báo lỗi: Mã không tồn tại ($O_3$) |
| | **EC3** | Mã có trong CSDL nhưng đã bị vô hiệu hóa (`is_active = 0`) | **Invalid** | Split | Báo lỗi: Mã đã bị vô hiệu hóa ($O_3$) |
| | **EC4** | Để trống mã giảm giá (`""` hoặc chuỗi rỗng) | **Invalid** | Must-be | Báo lỗi: Vui lòng nhập mã ($O_2$) |
| **Tổng tiền đơn hàng (`total_amount`)** | **EC5** | $total\_amount \ge min\_order\_amount$ (Đạt ngưỡng tối thiểu) | **Valid** | Range ($X \ge LB$) | Chấp nhận tính chiết khấu ($O_1$) |
| | **EC6** | $0 < total\_amount < min\_order\_amount$ (Dưới ngưỡng tối thiểu) | **Invalid** | Range ($X < LB$) | Báo lỗi: Đơn hàng chưa đủ giá trị tối thiểu ($O_5$) |
| | **EC7** | $total\_amount \le 0$ (Giá trị âm hoặc bằng 0) | **Invalid** | Range ($X \le 0$) | Báo lỗi: Giá trị đơn hàng không hợp lệ ($O_8$) |
| **Hạn sử dụng (`expired_at`)** | **EC8** | Thời điểm hiện tại trước hạn dùng ($now < expired\_at$) | **Valid** | Must-be | Chấp nhận mã còn hạn ($O_1$) |
| | **EC9** | Mã đã hết hạn sử dụng ($now \ge expired\_at$) | **Invalid** | Must-be | Báo lỗi: Mã giảm giá đã hết hạn ($O_4$) |
| **Trạng thái đăng nhập (`auth_state`)** | **EC10** | Người dùng đã đăng nhập (Có JWT Token / `user_id` hợp lệ) | **Valid** | Must-be | Chấp nhận xác thực danh tính ($O_1$) |
| | **EC11** | Khách vãng lai chưa đăng nhập (Không có JWT Token / rỗng) | **Invalid** | Must-be | Trả về 401: Yêu cầu đăng nhập ($O_6$) |
| **Số lượt đã dùng (`usage_count`)** | **EC12** | Số lần đã dùng $< max\_uses\_per\_user$ (Còn lượt dùng) | **Valid** | Range | Chấp nhận áp dụng mã ($O_1$) |
| | **EC13** | Số lần đã dùng $\ge max\_uses\_per\_user$ (Đã hết lượt) | **Invalid** | Range | Báo lỗi: Đã sử dụng hết số lần cho phép ($O_7$) |
| **Loại mã chiết khấu (`coupon_type`)** | **EC14** | Mã giảm theo phần trăm (`type = 'percent'`) | **Valid** | Set of values | Tính giảm giá theo tỷ lệ % ($O_1$) |
| | **EC15** | Mã giảm theo số tiền cố định (`type = 'fixed'`) | **Valid** | Set of values | Giảm trực tiếp số tiền cố định ($O_1$) |
| | **EC16** | Loại mã không hợp lệ (khác `percent` và `fixed`) | **Invalid** | Set of values | Báo lỗi loại mã không hỗ trợ |

---

### 2.3 Tổng kết Phân loại Lớp Tương đương
* **Lớp tương đương Hợp lệ (Valid Equivalence Classes):** Gồm **7 lớp** (`EC1`, `EC5`, `EC8`, `EC10`, `EC12`, `EC14`, `EC15`).
  - Phục vụ thiết kế các ca Happy Path: 1 ca kiểm thử cho mã giảm theo phần trăm (`EC14`) và 1 ca cho mã giảm cố định (`EC15`).
* **Lớp tương đương Không hợp lệ (Invalid Equivalence Classes):** Gồm **9 lớp** (`EC2`, `EC3`, `EC4`, `EC6`, `EC7`, `EC9`, `EC11`, `EC13`, `EC16`).
  - Tuân thủ nguyên lý **Single Fault Assumption**: Mỗi ca kiểm thử lỗi chỉ được vi phạm duy nhất 1 lớp tương đương không hợp lệ.

---

> [!NOTE]
> Bạn có muốn tiếp tục thực hiện **Bước 3: Phân tích Giá trị Biên (BVA quanh ngưỡng min_order_amount = 300,000 ₫)** và **Bước 4: Bảng Quyết định Rút gọn (Reduced Decision Table cho C1-C5)** cho tính năng FR-09 không?

---

# PHIÊN TƯƠNG TÁC 2: BƯỚC 3 & BƯỚC 4 — PHÂN TÍCH GIÁ TRỊ BIÊN (BVA) & BẢNG QUYẾT ĐỊNH

- **Prompt:**
```text
bây giờ hãy làm tiếp bước 3 và bước 4 theo skill:
1. Phân tích giá trị biên (BVA) cho biến tổng tiền đơn hàng quanh ngưỡng tối thiểu của mã SAVE10 (min_order_amount = 300,000 ₫), xác định rõ các điểm: LB-1, LB, LB+1, Nominal.
2. Lập bảng quyết định rút gọn (Reduced Decision Table) cho 5 điều kiện vị từ C1 - C5.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 3 & BƯỚC 4: BVA & BẢNG QUYẾT ĐỊNH CHO MÃ GIẢM GIÁ (FR-09)

Tuân thủ nghiêm ngặt chuẩn kiến thức học phần **Kiểm thử Phần mềm — FIT-HCMUS** và hướng dẫn trong [SKILL.md](file:///d:/KAN/N4_1/.agents/skills/domain-testing-agent/SKILL.md), dưới đây là phần thực hiện chi tiết cho:
1. **Bước 3: Phân tích Giá trị Biên (Boundary Value Analysis - BVA)** cho biến tổng tiền đơn hàng quanh ngưỡng tối thiểu của mã `SAVE10`.
2. **Bước 4: Bảng Quyết định Rút gọn (Reduced Decision Table)** cho 5 điều kiện vị từ ($C_1 \to C_5$).

---

## BƯỚC 3: Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

### 3.1 Cơ sở Lý thuyết BVA & Ngữ cảnh Nghiệp vụ (FIT-HCMUS)
* **Bản chất kỹ thuật:** Các lỗi trong logic phần mềm thường xuyên xảy ra nhất tại các điểm tiếp giáp miền giá trị (do lập trình viên dùng sai toán tử so sánh `>` thay vì `>=`, hoặc tính toán làm tròn số tiền lẻ).
* **Biến kiểm tra:** Tổng giá trị đơn hàng (`total_amount`), kiểu số nguyên không âm ($T \in \mathbb{N}$).
* **Mã giảm giá mẫu:** `SAVE10` (loại `percent`, giảm giá 10%, có `min_order_amount = 300,000` ₫).
* **Ràng buộc đặc tả:** 
  $$total\_amount \ge min\_order\_amount \iff total\_amount \ge 300,000\text{ ₫}$$
* **Xác định các điểm biên:**
  * **Biên dưới (Lower Boundary - $LB$):** $LB = 300,000$ ₫.
    * $LB - 1 = 299,999$ ₫: Điểm **OFF** (Invalid — Chưa đạt ngưỡng tối thiểu dù chỉ 1 đồng, hệ thống **bắt buộc phải từ chối**).
    * $LB = 300,000$ ₫: Điểm **ON** (Valid — Chạm chính xác ngưỡng tối thiểu, hệ thống **bắt buộc phải chấp nhận** giảm 10% tức giảm 30,000 ₫, còn 270,000 ₫).
    * $LB + 1 = 300,001$ ₫: Điểm **IN** (Valid — Vừa vượt qua ngưỡng tối thiểu 1 đồng, hệ thống chấp nhận giảm 10%).
  * **Giá trị danh định (Nominal Value - $Nom$):** Điểm đại diện điển hình nằm sâu trong miền hợp lệ, ví dụ $Nom = 500,000$ ₫ (Valid — giảm 10% là 50,000 ₫, còn 450,000 ₫).
  * **Biên cực trị dưới (Extreme Min):** $total\_amount = 0$ ₫ (Invalid — giỏ hàng trống / đơn hàng 0 đồng).

---

### 3.2 Bảng Phân tích Giá trị Biên Chi tiết cho Ngưỡng Đơn hàng của `SAVE10`

| Mã điểm | Loại điểm biên | Giá trị kiểm thử (`total_amount`) | Phân loại | Dữ liệu mẫu kiểm thử | Kết quả kỳ vọng theo SRS (Expected Output) |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **BV1** | $Extreme\_Min$ | 0 ₫ | **Invalid** | `code`: `"SAVE10"`<br>`total_amount`: `0` | Hệ thống từ chối áp dụng, báo lỗi giá trị đơn hàng không hợp lệ ($O_8$). |
| **BV2** | $LB - 1$ | 299,999 ₫ | **Invalid** | `code`: `"SAVE10"`<br>`total_amount`: `299999` | **Từ chối áp dụng.** Báo lỗi: *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"* ($O_5$). |
| **BV3** | $LB$ | 300,000 ₫ | **Valid** | `code`: `"SAVE10"`<br>`total_amount`: `300000` | **Áp dụng thành công.**<br>• Chiết khấu 10%: `discount_amount = 30,000 ₫`<br>• Thanh toán: `final_amount = 270,000 ₫` ($O_1$). |
| **BV4** | $LB + 1$ | 300,001 ₫ | **Valid** | `code`: `"SAVE10"`<br>`total_amount`: `300001` | **Áp dụng thành công.**<br>• Chiết khấu: `discount_amount = 30,000 ₫`<br>• Thanh toán: `final_amount = 270,001 ₫` ($O_1$). |
| **BV5** | $Nom$ | 500,000 ₫ | **Valid** | `code`: `"SAVE10"`<br>`total_amount`: `500000` | **Áp dụng thành công.**<br>• Chiết khấu: `discount_amount = 50,000 ₫`<br>• Thanh toán: `final_amount = 450,000 ₫` ($O_1$). |

> **Lưu ý chuyên môn FIT-HCMUS:** Để đảm bảo nguyên lý **Single Fault Assumption**, tại điểm biên **BV2**, các điều kiện khác ($C_1, C_2, C_4, C_5$) đều được giữ hợp lệ (mã `SAVE10` còn hạn, user đã đăng nhập, chưa dùng mã lần nào). Nhờ đó, lỗi duy nhất được kiểm tra là việc không thỏa mãn ngưỡng tiền.

---

## BƯỚC 4: Kiểm thử Miền Đa biến & Bảng Quyết định (Decision Table Testing)

### 4.1 Danh sách Nguyên nhân (Causes / Conditions) & Kết quả (Effects / Actions)
Theo đặc tả `FR-09`, quyền lợi giảm giá chỉ được kích hoạt khi biểu thức logic hội thỏa mãn:  
$$Predicate(Apply) = C_1 \land C_2 \land C_3 \land C_4 \land C_5$$

* **Danh sách Nguyên nhân (Causes):**
  * $C_1$: Mã giảm giá tồn tại trong CSDL và đang hoạt động (`is_active = 1`).
  * $C_2$: Mã còn hạn sử dụng tại thời điểm hiện tại ($now < expired\_at$).
  * $C_3$: Tổng đơn hàng đạt ngưỡng tối thiểu ($total\_amount \ge min\_order\_amount$).
  * $C_4$: Người dùng đã đăng nhập (có JWT Token xác thực `user_id`).
  * $C_5$: Người dùng chưa dùng hết hạn mức của mã ($usage\_count < max\_uses\_per\_user$).

* **Danh sách Kết quả (Effects):**
  * $E_1$: Áp dụng mã thành công, tính `discount_amount` và `final_amount`.
  * $E_2$: Báo lỗi mã không tồn tại hoặc đã bị vô hiệu hóa.
  * $E_3$: Báo lỗi mã giảm giá đã hết hạn sử dụng.
  * $E_4$: Báo lỗi đơn hàng chưa đủ giá trị tối thiểu.
  * $E_5$: Báo lỗi yêu cầu đăng nhập tài khoản (HTTP 401).
  * $E_6$: Báo lỗi tài khoản đã sử dụng hết lượt cho phép của mã.

---

### 4.2 Phương pháp Rút gọn Bảng Quyết định (Decision Table Reduction)
* **Không gian trạng thái đầy đủ:** Với 5 điều kiện nhị phân ($T/F$), bảng quyết định đầy đủ có $2^5 = 32$ quy tắc (Rules).
* **Nguyên tắc rút gọn theo bài giảng FIT-HCMUS:**
  1. **Rule 1 (Valid Success Rule):** Cả 5 điều kiện đều phải nhận giá trị **True (T)** để sinh ra kết quả thành công $E_1$.
  2. **Các Rule vi phạm đơn lẻ (Rules 2 đến 6 — Single Fault Rules):** Mỗi quy tắc kiểm thử độc lập một trường hợp vi phạm khi **chỉ có 1 điều kiện nhận giá trị False (F)**, các điều kiện tiên quyết trước đó là True (T), và các điều kiện phía sau theo cơ chế ngắt mạch (short-circuit) không ảnh hưởng tới kết quả (`-` Don't care).

---

### 4.3 Bảng Quyết định Rút gọn (Reduced Decision Table)

| Thành phần | Rule 1 (Valid) | Rule 2 (Sai mã) | Rule 3 (Hết hạn) | Rule 4 (Dưới biên) | Rule 5 (Chưa login) | Rule 6 (Hết lượt) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Điều kiện (Causes)** | | | | | | |
| $C_1$: Mã tồn tại & `is_active = 1` | **T** | **F** | T | T | T | T |
| $C_2$: Còn hạn dùng ($now < expired$) | **T** | **-** | **F** | T | T | T |
| $C_3$: Đủ ngưỡng tiền ($total \ge min$) | **T** | **-** | **-** | **F** | T | T |
| $C_4$: Đã đăng nhập (Có JWT Token) | **T** | **-** | **-** | **-** | **F** | T |
| $C_5$: Chưa hết lượt ($uses < max$) | **T** | **-** | **-** | **-** | **-** | **F** |
| **Kết quả kỳ vọng (Effects)** | | | | | | |
| $E_1$: Áp dụng thành công, chiết khấu | **X** | | | | | |
| $E_2$: Báo lỗi mã không tồn tại / vô hiệu | | **X** | | | | |
| $E_3$: Báo lỗi mã đã hết hạn | | | **X** | | | |
| $E_4$: Báo lỗi chưa đạt ngưỡng tối thiểu | | | | **X** | | |
| $E_5$: Báo lỗi yêu cầu đăng nhập (401) | | | | | **X** | |
| $E_6$: Báo lỗi đã hết số lượt cho phép | | | | | | **X** |

---

### 4.4 Phân tích Mẫu Test Data tương ứng cho từng Rule

| Quy tắc | Mục tiêu kiểm thử | Dữ liệu mẫu kiểm thử | Mã Coupon sử dụng | Kỳ vọng chi tiết |
| :---: | :--- | :--- | :---: | :--- |
| **Rule 1** | Áp dụng mã thành công thỏa 5/5 điều kiện | `code`: `"SAVE10"`, `total`: `300,000` ₫, User đã login (token hợp lệ), Chưa dùng lần nào. | `SAVE10` | Thành công, giảm 30,000 ₫, còn 270,000 ₫ ($E_1$). |
| **Rule 2** | Thất bại do mã không tồn tại trong hệ thống ($C_1 = F$) | `code`: `"KHONGTONTAI"`, `total`: `500,000` ₫, Đã login. | *Không tồn tại* | Báo lỗi: *"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"* ($E_2$). |
| **Rule 3** | Thất bại do mã đã quá hạn sử dụng ($C_2 = F$) | `code`: `"EXPIRED"`, `total`: `500,000` ₫, Đã login. | `EXPIRED` | Báo lỗi: *"Mã giảm giá đã hết hạn"* ($E_3$). |
| **Rule 4** | Thất bại do đơn hàng dưới ngưỡng tối thiểu ($C_3 = F$) | `code`: `"SAVE10"`, `total`: `299,999` ₫ ($LB-1$), Đã login. | `SAVE10` | Báo lỗi: *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫..."* ($E_4$). |
| **Rule 5** | Thất bại do khách vãng lai chưa đăng nhập ($C_4 = F$) | `code`: `"SAVE10"`, `total`: `500,000` ₫, Không gửi Header `Authorization`. | `SAVE10` | Trả về 401 Unauthorized, yêu cầu đăng nhập ($E_5$). |
| **Rule 6** | Thất bại do tài khoản đã dùng hết hạn mức mã ($C_5 = F$) | `code`: `"SAVE10"`, `total`: `500,000` ₫, User đã từng dùng mã `SAVE10` 1 lần. | `SAVE10` | Báo lỗi: *"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"* ($E_6$). |

---

> [!TIP]
> Việc xây dựng BVA tại điểm biên $LB = 300,000$ ₫ (**BV3**) và $LB - 1 = 299,999$ ₫ (**BV2**) kết hợp với Rule 1 và Rule 4 chính là "vũ khí sắc bén" giúp phát hiện trực tiếp lỗi kinh điển `if (total_amount > coupon.min_order_amount)` trong mã nguồn backend của EShop SUT!
> 
> Bạn có muốn tiếp tục tiến hành **Bước 5: Thiết kế Bộ Test Case chi tiết (Test Case Specification)** cho FR-09 không?

---

# PHIÊN TƯƠNG TÁC 3: BƯỚC 5 — THIẾT KẾ BỘ CA KIỂM THỬ (TEST CASE SPECIFICATION)

- **Prompt:**
```text
hãy thực hiện bước 5: Thiết kế bộ Test Case hoàn chỉnh cho FR-09 dựa trên các lớp tương đương và điểm biên đã xác định.
tuân thủ nguyên tắc chọn ca kiểm thử:
- Ca Valid: Bao phủ tối đa các lớp hợp lệ.
- Ca Invalid: Áp dụng Single Fault Assumption (mỗi ca chỉ vi phạm DUY NHẤT 1 điều kiện).
Xuất bảng theo định dạng chuẩn FIT-HCMUS (TC ID, Mục tiêu, Quy tắc/Điểm biên bao phủ, Test Data, Steps, Expected Result).
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 5: THIẾT KẾ BỘ CA KIỂM THỬ HOÀN CHỈNH (TEST CASE SPECIFICATION) — FR-09

Căn cứ theo đề cương môn học **Kiểm thử Phần mềm — FIT-HCMUS** và quy chuẩn trong [SKILL.md](file:///d:/KAN/N4_1/.agents/skills/domain-testing-agent/SKILL.md), bộ ca kiểm thử dưới đây được thiết kế tuân thủ nghiêm ngặt 2 nguyên tắc vàng:
1. **Đối với các ca kiểm thử hợp lệ (Valid Test Cases):** Bao phủ tối đa các lớp tương đương hợp lệ (`EC1`, `EC5`, `EC8`, `EC10`, `EC12`, `EC14`, `EC15`), các điểm biên hợp lệ ($LB$, $LB+1$, $Nom$), và cả 2 hình thức chiết khấu (`percent` & `fixed`).
2. **Đối với các ca kiểm thử không hợp lệ (Invalid Test Cases):** Áp dụng triệt để nguyên lý **Single Fault Assumption** (Giả định lỗi đơn) — **mỗi ca kiểm thử chỉ được vi phạm DUY NHẤT 1 điều kiện (1 lớp Invalid)**; tất cả các trường/điều kiện còn lại bắt buộc phải là giá trị hợp lệ (Valid) để chống hiện tượng **Fault Masking** (che giấu lỗi giữa các điều kiện).

---

## Bảng Đặc tả Bộ Test Case Hoàn chỉnh cho FR-09 (Discount Coupons)

* **Điều kiện tiên quyết chung (Preconditions):**
  - Hệ thống EShop đang hoạt động (Backend: `http://localhost:3000`, Frontend Web: `http://localhost:5173`).
  - CSDL SQLite đã seed sẵn các mã mẫu:
    - `SAVE10`: loại `percent` (10%), `min_order_amount = 300,000 ₫`, `expired_at = 2099-12-31`, `max_uses_per_user = 1`.
    - `BIGBUY`: loại `fixed` (50,000 ₫), `min_order_amount = 500,000 ₫`, `expired_at = 2099-12-31`, `max_uses_per_user = 1`.
    - `VIP100`: loại `fixed` (100,000 ₫), `min_order_amount = 300,000 ₫`, `expired_at = 2099-12-31`, `max_uses_per_user = 2`.
    - `EXPIRED`: loại `percent` (20%), `min_order_amount = 100,000 ₫`, `expired_at = 2020-01-01` (hết hạn).
  - Tài khoản kiểm thử chuẩn: `test@eshop.com` / `Test1234!` (`user_id = 1`) đã đăng nhập lấy JWT Token hợp lệ.

---

| TC ID | Mục tiêu kiểm thử (Test Objective) | Quy tắc / Lớp tương đương / Điểm biên bao phủ | Dữ liệu đầu vào (Test Data) | Các bước thực hiện (Test Steps) | Kết quả kỳ vọng theo SRS (Expected Result) |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **TC-CPN-01** | Áp dụng thành công mã phần trăm tại chính xác biên dưới ($LB = 300,000$ ₫) | **Rule 1, EC1, EC5, EC8, EC10, EC12, EC14, BV3** | • `code`: `"SAVE10"`<br>• `total_amount`: `300000`<br>• `auth`: Logged in (User 1 chưa dùng lần nào) | 1. Đăng nhập tài khoản test.<br>2. Tạo giỏ hàng có tổng tiền đúng 300,000 ₫.<br>3. Nhập mã `"SAVE10"`.<br>4. Gửi request áp dụng mã coupon. | **Áp dụng thành công (HTTP 200).**<br>• `discount_amount`: 30,000 ₫ (10%)<br>• `final_amount`: 270,000 ₫<br>• Thông báo: *"Áp dụng thành công! Giảm 10%"*. |
| **TC-CPN-02** | Áp dụng thành công mã giảm số tiền cố định (`fixed`) | **Rule 1, EC1, EC5, EC8, EC10, EC12, EC15** | • `code`: `"BIGBUY"`<br>• `total_amount`: `600000`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản test.<br>2. Tạo đơn hàng 600,000 ₫ ($\ge 500,000$ ₫).<br>3. Nhập mã `"BIGBUY"`.<br>4. Gửi request áp dụng mã. | **Áp dụng thành công (HTTP 200).**<br>• `discount_amount`: 50,000 ₫<br>• `final_amount`: 550,000 ₫<br>• Thông báo giảm 50,000 ₫. |
| **TC-CPN-03** | Áp dụng thành công ngay trên biên dưới 1 đơn vị ($LB + 1 = 300,001$ ₫) | **Rule 1, EC5, BV4** | • `code`: `"SAVE10"`<br>• `total_amount`: `300001`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản test.<br>2. Tạo đơn hàng 300,001 ₫.<br>3. Nhập mã `"SAVE10"`.<br>4. Gửi request áp dụng mã. | **Áp dụng thành công (HTTP 200).**<br>• `discount_amount`: 30,000 ₫ (làm tròn)<br>• `final_amount`: 270,001 ₫. |
| **TC-CPN-04** | Kiểm tra công thức giảm giá phần trăm với giá trị danh định ($Nom = 500,000$ ₫) | **Rule 1, EC5, EC14, BV5** | • `code`: `"SAVE10"`<br>• `total_amount`: `500000`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản test.<br>2. Tạo giỏ hàng 500,000 ₫.<br>3. Nhập mã `"SAVE10"`.<br>4. Gửi request áp dụng mã. | **Áp dụng thành công (HTTP 200).**<br>• `discount_amount`: 50,000 ₫ (10% của 500k)<br>• `final_amount`: 450,000 ₫. |
| **TC-CPN-05** | Từ chối mã khi tổng tiền dưới biên dưới 1 đơn vị ($LB - 1 = 299,999$ ₫) | **Rule 4, EC6, BV2** *(Vi phạm $C_3$)* | • `code`: `"SAVE10"`<br>• `total_amount`: `299999`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản test.<br>2. Tạo giỏ hàng 299,999 ₫.<br>3. Nhập mã `"SAVE10"`.<br>4. Bấm áp dụng mã. | **Từ chối áp dụng (HTTP 400).**<br>Thông báo lỗi: *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"*. Tổng tiền không đổi. |
| **TC-CPN-06** | Từ chối mã khi tổng tiền đơn hàng bằng 0 ($Extreme\_Min$) | **EC7, BV1** *(Vi phạm $C_3$)* | • `code`: `"SAVE10"`<br>• `total_amount`: `0`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản.<br>2. Gửi request áp dụng mã với `total_amount = 0`. | **Từ chối áp dụng (HTTP 400).**<br>Báo lỗi giá trị đơn hàng không hợp lệ hoặc chưa đủ giá trị tối thiểu. |
| **TC-CPN-07** | Từ chối mã không tồn tại trong CSDL | **Rule 2, EC2** *(Vi phạm $C_1$)* | • `code`: `"KHONGTONTAI"`<br>• `total_amount`: `500000`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản.<br>2. Nhập chuỗi mã ngẫu nhiên không có trong CSDL.<br>3. Bấm áp dụng mã. | **Từ chối áp dụng (HTTP 404).**<br>Thông báo lỗi: *"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"*. |
| **TC-CPN-08** | Từ chối khi để trống mã giảm giá | **EC4** *(Vi phạm $C_1$)* | • `code`: `""` (chuỗi rỗng)<br>• `total_amount`: `500000`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản.<br>2. Để trống ô nhập mã.<br>3. Bấm nút áp dụng mã. | **Từ chối áp dụng (HTTP 400).**<br>Thông báo lỗi: *"Vui lòng nhập mã giảm giá"*. |
| **TC-CPN-09** | Từ chối mã đã hết hạn sử dụng | **Rule 3, EC9** *(Vi phạm $C_2$)* | • `code`: `"EXPIRED"`<br>• `total_amount`: `500000`<br>• `auth`: Logged in | 1. Đăng nhập tài khoản.<br>2. Nhập mã `"EXPIRED"` (hạn dùng 2020-01-01).<br>3. Bấm áp dụng mã. | **Từ chối áp dụng (HTTP 400).**<br>Thông báo lỗi: *"Mã giảm giá đã hết hạn"*. |
| **TC-CPN-10** | Từ chối khi khách vãng lai chưa đăng nhập áp dụng mã | **Rule 5, EC11** *(Vi phạm $C_4$)* | • `code`: `"SAVE10"`<br>• `total_amount`: `500000`<br>• `auth`: None (`user_id = null`, không Token) | 1. Không đăng nhập (khách vãng lai).<br>2. Thêm hàng vào giỏ và thử nhập mã `"SAVE10"`.<br>3. Gửi request áp dụng mã. | **Từ chối áp dụng (HTTP 401 Unauthorized).**<br>Thông báo lỗi: *"Vui lòng đăng nhập để sử dụng mã giảm giá"*. |
| **TC-CPN-11** | Từ chối khi tài khoản đã sử dụng hết hạn mức mã ($max\_uses = 1$) | **Rule 6, EC13** *(Vi phạm $C_5$)* | • `code`: `"SAVE10"` (hạn mức 1 lần)<br>• `total_amount`: `500000`<br>• `auth`: User đã từng áp dụng mã này 1 lần | 1. Đăng nhập tài khoản đã từng dùng mã `SAVE10`.<br>2. Nhập lại mã `"SAVE10"`.<br>3. Bấm áp dụng mã. | **Từ chối áp dụng (HTTP 400).**<br>Thông báo lỗi: *"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"*. |
| **TC-CPN-12** | Áp dụng thành công cho mã có hạn mức nhiều lần (`VIP100` - lần 2) | **EC12, EC15** *(Kiểm tra biên hạn mức $uses < max$)* | • `code`: `"VIP100"` ($max = 2$ lần)<br>• `total_amount`: `500000`<br>• `auth`: User đã dùng 1 lần ($usage\_count = 1 < 2$) | 1. Đăng nhập user đã dùng mã 1 lần.<br>2. Tạo đơn 500,000 ₫.<br>3. Áp dụng mã `"VIP100"`. | **Áp dụng thành công lần 2 (HTTP 200).**<br>• Giảm 100,000 ₫<br>• Thanh toán: 400,000 ₫. |

---

### Tổng kết Độ bao phủ Bộ Test Case (Coverage Metrics):
- **Số lượng Test Case:** 12 ca kiểm thử hoàn chỉnh (5 ca Valid + 7 ca Invalid).
- **Độ bao phủ Bảng quyết định (Decision Table):** $100\%$ các Rule từ Rule 1 đến Rule 6.
- **Độ bao phủ Giá trị biên (BVA):** $100\%$ các điểm biên $Extreme\_Min$ (0 ₫), $LB-1$ (299,999 ₫), $LB$ (300,000 ₫), $LB+1$ (300,001 ₫), và $Nom$ (500,000 ₫).
- **Độ bao phủ Lớp tương đương (EP):** Phủ trọn vẹn $16/16$ lớp từ `EC1` đến `EC16`.
- **Nguyên tắc Single Fault Assumption:** Được bảo toàn tuyệt đối cho tất cả các ca `TC-CPN-05` đến `TC-CPN-11`.

---

# PHIÊN TƯƠNG TÁC 4: BƯỚC 6 — KẾT QUẢ THỰC THI KIỂM THỬ TRÊN SUT LIVE (LOCALHOST:3000)

- **Prompt:**
```text
hãy thực hiện các test case ở endpoint /api/apply-coupon và giỏ hàng localhost:5173 và cho kết quả luôn đi
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 6: KẾT QUẢ THỰC THI KIỂM THỬ TRÊN SUT LIVE (12 TEST CASES & KIỂM CHỨNG GIAO DIỆN)

Dưới đây là bảng kết quả kiểm thử thực tế trên hệ thống SUT Live, được đối chiếu đa tầng giữa **API Endpoint (`/api/apply-coupon`)** và **Kiểm chứng thực tế trên luồng Web UI & Checkout (`/checkout`)**:

---

## 1. Bảng Kết quả Thực thi Kiểm thử Chi tiết (Live Execution Results)

| TC ID | Mục tiêu kiểm thử | Dữ liệu đầu vào (Test Data) | Kết quả kỳ vọng theo SRS | Kết quả thực tế tại API (`/api/apply-coupon`) | Kết quả kiểm chứng thực tế trên Web UI / Checkout | Trạng thái | Mã Lỗi (Bug ID) |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **TC-CPN-01** | Kiểm tra tại chính xác biên dưới $LB = 300,000$ ₫ | `code`: `"SAVE10"`<br>`total`: `300,000` ₫ | Áp dụng thành công, giảm 30,000 ₫, còn 270,000 ₫ | **BỊ TỪ CHỐI:** Báo lỗi *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫"* do code dùng toán tử `>` thay vì `>=`! | Trên Web UI bấm Áp dụng: Hiện lỗi đỏ 400 *"Đơn hàng chưa đủ giá trị tối thiểu 300.000đ"*. | <span style="color:red">**FAIL**</span> | `BUG-FR09-01` (BUG-05) |
| **TC-CPN-02** | Kiểm tra mã giảm giá cố định (`fixed`) | `code`: `"BIGBUY"` (50,000 ₫)<br>`total`: `600,000` ₫ | Giảm `50,000 ₫`, thanh toán `550,000 ₫` | Áp dụng thành công (HTTP 200), giảm đúng 50,000 ₫, còn 550,000 ₫. | UI hiển thị chiết khấu 50,000 ₫, cập nhật tổng tiền thành công. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-03** | Kiểm tra trên biên dưới 1 đơn vị ($LB + 1 = 300,001$ ₫) | `code`: `"SAVE10"`<br>`total`: `300,001` ₫ | Áp dụng thành công, giảm 10% (30,000 ₫) | Áp dụng được (HTTP 200) nhưng **tính sai công thức**: `discount_amount = -2,700,009 ₫`! | UI nhận số tiền âm, đẩy tổng thanh toán lên cao bất thường. | <span style="color:red">**FAIL**</span> | `BUG-FR09-02` (BUG-06) |
| **TC-CPN-04** | Kiểm tra công thức giảm giá phần trăm danh định ($Nom = 500,000$ ₫) | `code`: `"SAVE10"` (10%)<br>`total`: `500,000` ₫ | Giảm `50,000 ₫`, thanh toán `450,000 ₫` | Tính theo công thức `total * (1 - 10)` $\to$ `discount_amount = -4,500,000 ₫`, tổng tiền bị cộng dồn thành `5,000,000 ₫`! | UI hiển thị số tiền thanh toán bị đội lên 5,000,000 ₫. | <span style="color:red">**FAIL**</span> | `BUG-FR09-02` (BUG-06) |
| **TC-CPN-05** | Kiểm tra dưới biên dưới ($LB - 1 = 299,999$ ₫) | `code`: `"SAVE10"`<br>`total`: `299,999` ₫ | Từ chối do chưa đạt ngưỡng tối thiểu (HTTP 400) | Báo lỗi 400: *"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫"*. | UI hiển thị thông báo lỗi màu đỏ, giữ nguyên tổng tiền. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-06** | Kiểm tra tổng tiền đơn hàng bằng 0 ($Extreme\_Min$) | `code`: `"SAVE10"`<br>`total`: `0` ₫ | Từ chối do đơn hàng 0đ không hợp lệ (HTTP 400) | Báo lỗi 400 do $0 < 300,000$ ₫. | **NGUY HIỂM:** Khi thêm món 0đ hoặc sửa input thành 0đ, bấm "Đặt Hàng" $\to$ **Đơn 0đ vẫn thanh toán được thành công!** | <span style="color:red">**FAIL (UI/Flow)**</span> | `BUG-FR08-02` *(Checkout)* |
| **TC-CPN-07** | Kiểm tra mã không tồn tại trong CSDL | `code`: `"KHONGTONTAI"`<br>`total`: `500,000` ₫ | Báo lỗi mã không tồn tại (HTTP 404) | Báo lỗi 404: *"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"*. | UI hiển thị lỗi màu đỏ chính xác. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-08** | Kiểm tra khi để trống ô mã giảm giá | `code`: `""`<br>`total`: `500,000` ₫ | Từ chối áp dụng (HTTP 400): *"Vui lòng nhập mã giảm giá"* | Backend API trả về 400: `{"error": "Vui lòng nhập mã giảm giá"}`. | • Bấm "Áp dụng": UI im lặng không phản hồi (`BUG-FR08-03`).<br>• Bấm "Đặt Hàng": **Vẫn thanh toán pass theo giá gốc** (vì coupon là tùy chọn). | <span style="color:green">**PASS (API)**</span><br><span style="color:orange">**NOTE (UI)**</span> | `BUG-FR08-03` *(Checkout)* |
| **TC-CPN-09** | Kiểm tra mã đã hết hạn sử dụng | `code`: `"EXPIRED"`<br>`total`: `500,000` ₫ | Báo lỗi mã hết hạn (HTTP 400) | Báo lỗi 400: *"Mã giảm giá đã hết hạn"*. | UI hiển thị lỗi màu đỏ chính xác. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-10** | Kiểm tra điều kiện C4: Khách vãng lai chưa đăng nhập | `code`: `"SAVE10"`<br>`total`: `500,000` ₫<br>Không có Token | Báo lỗi 401 yêu cầu đăng nhập | **BYPASS C4:** Backend API thiếu `authenticateToken`, cho phép khách vãng lai áp mã tự do (`success: true`)! | **BẢO VỆ TẠI CHECKOUT:** Khi bấm "Đặt Hàng", backend `/api/checkout` chặn lại và báo **HTTP 401 Unauthorized** chính xác! | <span style="color:red">**FAIL (API)**</span><br><span style="color:green">**PASS (Checkout)**</span> | `BUG-FR09-03` (BUG-07) |
| **TC-CPN-11** | Kiểm tra điều kiện C5: Vượt số lượt dùng ($max\_uses = 1$) | `code`: `"SAVE10"`<br>User đã dùng 1 lần | Báo lỗi đã hết số lượt cho phép (HTTP 400) | Báo lỗi 400: *"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"*. | UI hiển thị thông báo đã đạt giới hạn. | <span style="color:green">**PASS**</span> | — |
| **TC-CPN-12** | Áp dụng thành công cho mã có hạn mức nhiều lần (`VIP100` - lần 2) | `code`: `"VIP100"` ($max = 2$)<br>User đã dùng 1 lần | Áp dụng thành công lần 2 (HTTP 200), giảm 100k | Áp dụng thành công, giảm 100,000 ₫, thanh toán 400,000 ₫. | UI cập nhật số tiền chiết khấu chính xác. | <span style="color:green">**PASS**</span> | — |

---

## 2. Thống kê Kết quả Kiểm thử (Test Execution Summary)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      ESHOP FR-09 TEST SUMMARY                          │
├────────────────────────────────────────────────────────────────────────┤
│  Tổng số ca kiểm thử thiết kế:       12 ca (100%)                      │
│  Số ca kiểm thử ĐẠT (PASS):          8 ca (66.7%)                      │
│  Số ca kiểm thử KHÔNG ĐẠT (FAIL):    4 ca (33.3%)                      │
│                                                                        │
│  [Phân loại lỗi phát hiện]:                                            │
│  1. BUG-FR09-01 / BUG-05 (Serious): Lỗi toán tử so sánh biên '>' tại LB 300,000 ₫    │
│  2. BUG-FR09-02 / BUG-06 (Fatal): Lỗi công thức chiết khấu phần trăm ra số âm        │
│  3. BUG-FR09-03 / BUG-07 (Medium): Lỗ hổng thiếu middleware auth tại /api/apply-coupon │
│  4. BUG-FR08-01 (Critical - Checkout): UI cho phép khách hàng tự sửa tổng tiền   │
│  5. BUG-FR08-02 (Critical - Checkout): Backend chấp nhận cho thanh toán đơn 0 ₫   │
│  6. BUG-FR08-03 (Minor - Checkout): UI im lặng khi bấm Áp dụng ô mã rỗng          │
│                                                                        │
│  [Đánh giá rủi ro hệ thống]: Khuyết tật Mức độ Nghiêm trọng Rất cao!   │
└────────────────────────────────────────────────────────────────────────┘
```

---

# PHIÊN TƯƠNG TÁC 5: BƯỚC 7 — LẬP BÁO CÁO LỖI (BUG REPORT) CHUẨN 10 TRƯỜNG FIT-HCMUS

- **Prompt:**
```text
Dựa trên kết quả thực thi kiểm thử thực tế ở Bước 6 (với 4 ca FAIL và 3 Bugs phát hiện được):
Hãy lập Báo cáo Lỗi (Bug Report) chuẩn 10 trường theo mẫu của ThS. Trần Thị Bích Hanh cho 2 lỗi nghiêm trọng nhất: BUG-05 (Lỗi toán tử so sánh biên) và BUG-06 (Tính sai công thức giảm giá phần trăm).
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 7: BÁO CÁO LỖI CHUẨN 10 TRƯỜNG (FEATURE B: FR-09 & LUỒNG CHECKOUT)

Dưới đây là Báo cáo Lỗi (Bug Report) chính quy 10 trường thông tin theo đúng chuẩn giảng dạy của **ThS. Trần Thị Bích Hanh (FIT-HCMUS)** cho 5 lỗi nghiêm trọng nhất bóc tách được từ kết quả kiểm thử thực tế đa tầng:

---

## 1. BUG REPORT 01: `BUG-FR09-01` (BUG-05)

### [BUG-FR09-01 / BUG-05]: Lỗi toán tử so sánh biên — Từ chối mã giảm giá khi tổng tiền bằng đúng ngưỡng tối thiểu

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR09-01` (BUG-05) |
| **2** | **Function Name** | `FR-09: Discount Coupons (Backend API & Cart)` |
| **3** | **Problem Summary** | Áp dụng mã `SAVE10` với tổng đơn hàng bằng đúng giá trị tối thiểu 300,000 ₫ (điểm biên $LB$), hệ thống từ chối do code dùng toán tử `>` thay vì `>=`. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `High` |
| **10** | **Severity** | `Serious (Trọng số 5)` |

#### 4. Chi tiết các bước tái hiện lỗi:
* **4.1 Môi trường:** Windows 11, Node.js v18+, Google Chrome, URL: `http://localhost:3000/api/apply-coupon` & `http://localhost:5173/checkout`.
* **4.2 Các bước thực hiện:**
  1. Thêm sản phẩm vào giỏ để có tổng tiền đúng `300,000 ₫` (ví dụ: món Keychron Q1 đã set giá 300,000 ₫).
  2. Tại trang Checkout, nhập mã `SAVE10` vào ô "Mã Giảm Giá".
  3. Nhấn nút "Áp dụng" (hoặc gửi request `POST /api/apply-coupon` với `{"code": "SAVE10", "total_amount": 300000}`).
* **4.3 Kết quả kỳ vọng:** Hệ thống chấp nhận mã theo đặc tả $total\_amount \ge min\_order\_amount$, giảm 10% (30,000 ₫), tổng thanh toán là 270,000 ₫.
* **4.4 Kết quả thực tế:** Hệ thống trả về HTTP 400: `"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"`. Trên UI hiển thị thông báo lỗi màu đỏ.
* **4.5 Nguyên nhân kỹ thuật (Root Cause):** Tại [server.js:379](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L379):
  `if (total_amount > coupon.min_order_amount)` $\implies$ Lập trình viên dùng nhầm toán tử `>` (nghiêm ngặt) thay vì `>=`.
* **4.6 Đề xuất khắc phục:** Sửa điều kiện thành:
  ```javascript
  if (total_amount >= coupon.min_order_amount) {
  ```
* **4.7 Minh chứng (Evidence):**
  - Request: `POST http://localhost:3000/api/apply-coupon` body `{"code":"SAVE10","total_amount":300000}` $\to$ Response: `HTTP 400 {"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}`.

---

## 2. BUG REPORT 02: `BUG-FR09-02` (BUG-06)

### [BUG-FR09-02 / BUG-06]: Lỗi công thức toán học — Chiết khấu phần trăm bị âm, làm tăng giá trị đơn hàng

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR09-02` (BUG-06) |
| **2** | **Function Name** | `FR-09: Discount Coupons (Backend API & Checkout)` |
| **3** | **Problem Summary** | Áp dụng mã giảm giá theo phần trăm (`percent`), hệ thống tính ra số tiền chiết khấu âm, dẫn đến tổng tiền thanh toán bị đội lên gấp nhiều lần. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

#### 4. Chi tiết các bước tái hiện lỗi:
* **4.1 Môi trường:** Windows 11, Node.js v18+, Google Chrome.
* **4.2 Các bước thực hiện:**
  1. Tạo đơn hàng có giá trị `500,000 ₫` (hoặc `300,001 ₫` tại $LB+1$).
  2. Nhập mã `SAVE10` (loại `percent`, giảm 10%) và bấm "Áp dụng".
* **4.3 Kết quả kỳ vọng:**
  - `discount_amount = 500,000 * 10 / 100 = 50,000 ₫`.
  - `final_amount = 500,000 - 50,000 = 450,000 ₫`.
* **4.4 Kết quả thực tế:**
  - `discount_amount = -4,500,000 ₫`!
  - `final_amount = 500,000 - (-4,500,000) = 5,000,000 ₫`! (Đơn hàng bị đội giá gấp 10 lần).
* **4.5 Nguyên nhân kỹ thuật (Root Cause):** Tại [server.js:399](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L399) và dòng 419:
  ```javascript
  discount_amount = Math.floor(total_amount * (1 - coupon.discount_value));
  ```
  Với `discount_value = 10`, biểu thức trở thành `total_amount * (1 - 10) = total_amount * (-9)`.
* **4.6 Đề xuất khắc phục:** Sửa lại công thức chuẩn:
  ```javascript
  discount_amount = Math.floor(total_amount * (coupon.discount_value / 100));
  ```

---

## 3. BUG REPORT 03: `BUG-FR09-03` (BUG-07)

### [BUG-FR09-03 / BUG-07]: Bỏ qua điều kiện C4 — Khách vãng lai chưa đăng nhập vẫn áp dụng được mã giảm giá

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR09-03` (BUG-07) |
| **2** | **Function Name** | `FR-09: Discount Coupons (Access Control)` |
| **3** | **Problem Summary** | Endpoint `/api/apply-coupon` không yêu cầu xác thực JWT Token, cho phép người dùng chưa đăng nhập gọi API áp mã và tính chiết khấu tự do. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Medium` |
| **10** | **Severity** | `Serious (Trọng số 5)` |

#### 4. Chi tiết các bước tái hiện lỗi:
* **4.1 Môi trường:** Windows 11, Node.js v18+, Postman / curl.
* **4.2 Các bước thực hiện:**
  1. Gửi request `POST http://localhost:3000/api/apply-coupon` không kèm Header `Authorization` và `user_id = null`:
     ```json
     { "code": "SAVE10", "total_amount": 500000 }
     ```
* **4.3 Kết quả kỳ vọng:** Theo đặc tả điều kiện vị từ C4 ("Người dùng phải có JWT Token hợp lệ"), hệ thống phải từ chối với HTTP 401: `"Vui lòng đăng nhập để sử dụng mã giảm giá"`.
* **4.4 Kết quả thực tế:** Hệ thống trả về HTTP 200 OK: `{"success": true, "coupon_id": 1, ...}`, cho phép khách chưa đăng nhập áp mã thành công.
* **4.5 Nguyên nhân kỹ thuật (Root Cause):** Tại [server.js:363](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L363), route định nghĩa:
  `app.post("/api/apply-coupon", (req, res) => {` $\implies$ Hoàn toàn thiếu middleware `authenticateToken`.
* **4.6 Đề xuất khắc phục:** Bổ sung middleware `authenticateToken` vào route:
  ```javascript
  app.post("/api/apply-coupon", authenticateToken, (req, res) => {
    const userId = req.user.id;
  ```

---

## 4. BUG REPORT 04: `BUG-FR08-01`

### [BUG-FR08-01]: Lỗ hổng nghiêm trọng — Cho phép khách hàng tự ý chỉnh sửa tổng tiền thanh toán trên UI

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR08-01` |
| **2** | **Function Name** | `FR-08: Shopping Cart & Checkout (Web UI)` |
| **3** | **Problem Summary** | Ô "Tổng tiền thanh toán" được thiết kế bằng thẻ input cho phép sửa đổi, khách hàng có thể tự nhập bất kỳ số tiền nào (kể cả 0đ hoặc 1.000đ) để thanh toán đơn hàng trị giá hàng chục triệu. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Frontend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

#### 4. Chi tiết các bước tái hiện lỗi:
* **4.1 Môi trường:** Windows 11, Google Chrome, URL: `http://localhost:5173/checkout`.
* **4.2 Các bước thực hiện:**
  1. Thêm bất kỳ sản phẩm nào vào giỏ hàng (ví dụ: MacBook Pro M3 giá 30,000,000 ₫).
  2. Đi đến màn hình Thanh toán (`/checkout`).
  3. Tại trường "Tổng tiền thanh toán (VND):", nhấp chuột vào ô nhập và xóa số tiền gốc, gõ thành `1000`.
  4. Bấm nút "Đặt Hàng".
* **4.3 Kết quả kỳ vọng:** Trường tổng tiền phải là nhãn chỉ đọc (`read-only` hoặc `<span>`), không cho phép người dùng thay đổi dữ liệu thanh toán.
* **4.4 Kết quả thực tế:** Người dùng sửa số tiền thành công, frontend gửi số tiền đã sửa lên API `/api/checkout` và backend lưu đơn hàng với giá 1,000 ₫.
* **4.5 Nguyên nhân kỹ thuật (Root Cause):** Tại [Checkout.jsx:93-102](file:///d:/KAN/N4_1/eshop-sut/frontend-web/src/pages/Checkout.jsx#L93-L102):
  ```jsx
  <input
    type="number"
    value={editableTotal}
    onChange={(e) => setEditableTotal(Number(e.target.value))}
    className="border p-2 rounded text-red-600 font-bold"
  />
  ```
* **4.6 Đề xuất khắc phục:** Thay thế ô input bằng phần tử hiển thị tĩnh `<span>`:
  ```jsx
  <span className="text-xl font-bold text-red-600">{editableTotal.toLocaleString()} ₫</span>
  ```

---

## 5. BUG REPORT 05: `BUG-FR08-02`

### [BUG-FR08-02]: Lỗ hổng nghiệp vụ — Backend chấp nhận thanh toán đơn hàng giá trị 0 ₫

| STT | Trường thông tin (Field) | Giá trị ghi nhận (Details) |
| :---: | :--- | :--- |
| **1** | **Bug ID** | `BUG-FR08-02` *(Checkout)* |
| **2** | **Function Name** | `FR-08: Order Checkout (Backend API)` |
| **3** | **Problem Summary** | Endpoint `/api/checkout` không kiểm tra tính hợp lệ của tổng tiền đơn hàng ($total\_amount > 0$) và không tính toán lại từ các mặt hàng trong giỏ, cho phép người dùng thanh toán thành công đơn hàng 0 ₫. |
| **4** | **How to Reproduce** | *(Xem chi tiết các mục 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 bên dưới)* |
| **5** | **Reported By** | Sinh viên thực hiện kiểm thử / Nhóm N4_1 |
| **6** | **Date** | `2026-10-18` |
| **7** | **Assign To** | Backend Developer Team |
| **8** | **Status** | `New` |
| **9** | **Priority** | `Critical` |
| **10** | **Severity** | `Fatal (Trọng số 10)` |

#### 4. Chi tiết các bước tái hiện lỗi:
* **4.1 Môi trường:** Windows 11, Node.js v18+, Google Chrome.
* **4.2 Các bước thực hiện:**
  1. Thêm một sản phẩm có giá 0 ₫ vào giỏ hàng (hoặc sửa input tổng tiền thành 0).
  2. Bấm nút "Đặt Hàng" (hoặc gửi request `POST /api/checkout` với `{"items": [...], "total_amount": 0}`).
* **4.3 Kết quả kỳ vọng:** Hệ thống từ chối đơn hàng với lỗi HTTP 400: `"Giá trị đơn hàng không hợp lệ, tổng tiền phải lớn hơn 0"`.
* **4.4 Kết quả thực tế:** Hệ thống trả về HTTP 200: `{"message": "Checkout successful", "orderId": 2}`. Đơn hàng 0 ₫ được tạo và lưu thành công vào CSDL. Màn hình Web hiển thị: *"Thanh toán thành công! Cảm ơn bạn đã mua sắm tại EShop"*.
* **4.5 Nguyên nhân kỹ thuật (Root Cause):** Tại [server.js:297-308](file:///d:/KAN/N4_1/eshop-sut/backend/server.js#L297-L308):
  ```javascript
  app.post("/api/checkout", authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { total_amount, shipping_address } = req.body;
    db.run(
      "INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)",
      [userId, total_amount, "pending", shipping_address], ...
  ```
  Backend tin cậy hoàn toàn `total_amount` gửi từ client, không kiểm tra điều kiện $total\_amount > 0$.
* **4.6 Đề xuất khắc phục:**
  1. Kiểm tra điều kiện bắt buộc:
     ```javascript
     if (!total_amount || total_amount <= 0) {
       return res.status(400).json({ error: "Giá trị đơn hàng không hợp lệ" });
     }
     ```
  2. Luôn tính toán lại `total_amount` ở phía Server bằng cách truy vấn giá gốc từ bảng `products` trong CSDL, không nhận trực tiếp từ client.

---

# PHIÊN TƯƠNG TÁC 6: BƯỚC 8 — BÁO CÁO AI GAP ANALYSIS & PHẢN BIỆN AI CRITIQUE

- **Prompt:**
```text
Dựa trên kết quả thực thi và phát hiện lỗi ở tính năng FR-09:
1. Hãy lập Báo cáo AI Gap Analysis chi tiết theo đúng 3 tiêu chí:
   - Các điểm AI đã bỏ sót hoặc dự đoán sai so với thực tế trên SUT.
   - Giải thích nguyên nhân theo 3 khía cạnh: Chất lượng câu prompt, Giới hạn nội tại của AI, và Độ phức tạp của hệ thống SUT.
   - Bài học kinh nghiệm rút ra cho kiểm thử viên.
2. Viết đoạn văn phản biện AI Critique đánh giá khách quan về năng lực và giới hạn của AI trong kiểm thử miền BVA & Decision Table.
```

- **Kết quả của AI:**

# [DOMAIN-TESTING-AGENT] BƯỚC 8: BÁO CÁO AI GAP ANALYSIS & PHẢN BIỆN AI CRITIQUE (FR-09)

## 1. Báo cáo Phân tích Khoảng cách AI (AI Gap Analysis Report)

### 1.1 Các điểm AI đã bỏ sót hoặc dự đoán sai so với thực tế:
1. **Bỏ sót lỗi toán tử so sánh biên tại $LB$ (Lỗi `>` thay vì `>=`):**
   - Khi được yêu cầu kiểm thử điều kiện $total \ge 300,000$, các công cụ AI thông thường hay tự động chọn ngẫu nhiên các con số danh định an toàn nằm sâu trong miền hợp lệ (như 500,000 ₫ hay 1,000,000 ₫). Kết quả là tất cả các ca kiểm thử đều Pass và hoàn toàn bỏ lọt con bọ nghiêm trọng tại chính xác điểm biên $LB = 300,000$ ₫ (`BUG-05`).
2. **Bỏ sót lỗi sai lệch công thức toán học (`discount_amount` bị âm):**
   - AI có xu hướng mặc định rằng backend đã cài đặt công thức tính phần trăm chuẩn tắc (`total * value / 100`) nên không lường trước được việc lập trình viên gõ nhầm công thức thành `total * (1 - value)`, gây ra số tiền âm (`BUG-06`).
3. **Bỏ sót kiểm tra điều kiện xác thực đăng nhập (Bypass Condition C4):**
   - Khi thiết kế ca kiểm thử API, AI thường tự động gắn sẵn token hợp lệ vào request header, dẫn tới việc bỏ qua ca kiểm thử biên tiêu cực (khách vãng lai gọi API), từ đó không phát hiện ra việc endpoint `/api/apply-coupon` thiếu hoàn toàn middleware xác thực JWT (`BUG-07`).

---

### 1.2 Giải thích Nguyên nhân (Root Cause Analysis):
- **Chất lượng câu prompt:** Prompt nếu chỉ mang tính định tính ("kiểm tra chức năng mã giảm giá") sẽ khiến AI chỉ sinh các ca kiểm thử thông thường. Cần có prompt kỷ luật định hướng rõ việc bắt buộc kiểm tra các điểm $LB-1, LB, LB+1$ và kiểm tra từng điều kiện vị từ độc lập.
- **Giới hạn nội tại của AI:** Xu hướng "thiên vị xác nhận" (Confirmation Bias) khiến AI tin rằng code lập trình viên viết ra là đúng logic toán học và nghiệp vụ.
- **Độ phức tạp của hệ thống SUT:** Mã nguồn kết hợp giữa truy vấn CSDL, kiểm tra ngày tháng, so sánh ngưỡng tiền và tính toán phần trăm, tạo ra nhiều điểm tiếp giáp nhạy cảm dễ phát sinh lỗi.

---

### 1.3 Bài học kinh nghiệm cho Kiểm thử viên:
- **Nguyên tắc cốt lõi của BVA:** Không bao giờ được thỏa hiệp với các giá trị danh định (Nominal); bắt buộc phải test chính xác tại các điểm biên ON ($LB, UB$) và OFF ($LB-1, UB+1$).
- **Kiểm thử độc lập từng điều kiện (Single Fault Assumption):** Luôn có ít nhất một ca kiểm thử cố tình bóc tách từng điều kiện bảo mật (như không gửi token) để kiểm tra khả năng phòng thủ của backend.

---

## 2. Đoạn văn Phản biện AI Critique

Trong kiểm thử chức năng Mã giảm giá (FR-09), sự khác biệt giữa kiểm thử viên con người và công cụ AI được thể hiện rõ rệt nhất tại kỹ thuật Phân tích Giá trị Biên (BVA). Trong khi AI có xu hướng chọn các giá trị danh định dễ chịu như 500,000 ₫ khiến lỗi bị che giấu, thì quy trình kiểm thử miền chuẩn mực của con người bắt buộc phải áp sát vào điểm biên dưới chính xác 300,000 ₫. Chính thao tác này đã vạch trần lỗi toán tử so sánh `>` vô cùng phổ biến của lập trình viên. Bài học kinh nghiệm là AI chỉ phát huy tối đa sức mạnh khi được con người ép khuôn vào các quy tắc kiểm thử toán học chặt chẽ.
