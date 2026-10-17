# Phân tích Domain Testing: FR-06 - Xem chi tiết sản phẩm

Phân tích Domain Testing cho tính năng **FR-06: Xem chi tiết sản phẩm** tập trung vào việc mô hình hóa các biến đầu vào, xác định các biên (Boundaries: On-point, Off-point, In-point, Out-point) và phân hoạch tương đương (Equivalence Partitioning) để bao phủ đầy đủ các kịch bản hợp lệ và bất thường.

## **1. Phân tích biến đầu vào và quy tắc ràng buộc**

* **Số lượng mua ($Q$ - Quantity):** Ràng buộc hệ thống $Q \ge 1$. Ràng buộc nghiệp vụ thực tế: $Q \le S$ (với $S$ là số lượng tồn kho khả dụng) và $Q \le M$ (với $M$ là giới hạn tối đa cho một lần đặt, ví dụ: 99).
* **Trạng thái tồn kho ($S$ - Stock):** $S \ge 0$.
* **Dữ liệu sản phẩm (Product Profile Data):** Gồm Ảnh lớn (Image URL), Tên (String), Giá ($PR > 0$), Mô tả (Text), Danh mục (Category ID/String).
* **Hành vi tương tác (Action Trigger):** Thao tác click nút "Thêm vào giỏ hàng" (Tần suất, trạng thái mạng, tính khả dụng của nút).

## **2. Bảng phân rã miền dữ liệu (Domain Testing Matrix)**

| **Biến đầu vào** | **Miền giá trị (Domain Class)** | **Loại miền** | **Điểm kiểm thử đại diện (Values / Inputs)** | **Phân loại biên (Domain Testing Type)** | **Kết quả mong đợi (Expected Result)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Số lượng ($Q$)** <br>*(Giả sử tồn kho $S=10$, Giới hạn $M=99$)* | Số nguyên dương nằm trong khoảng tồn kho $[1, S]$ | **Valid** | $Q = 1$ | **On-point** (Biên dưới) | Chấp nhận giá trị; nút Thêm vào giỏ hàng khả dụng. |
| | | **Valid** | $Q = 10$ | **On-point** (Biên trên theo tồn kho) | Chấp nhận giá trị; thêm toàn bộ số lượng còn lại vào giỏ. |
| | | **Valid** | $Q = 5$ | **In-point** | Chấp nhận giá trị; tính toán tổng tiền chính xác. |
| | Giá trị dưới biên tối thiểu ($Q < 1$) | **Invalid** | $Q = 0$ | **Off-point** (Cận biên dưới) | Báo lỗi hoặc tự động format về 1; vô hiệu hóa nút Submit. |
| | | **Invalid** | $Q = -1$ | **Out-point** | Báo lỗi: "Số lượng không hợp lệ"; không gửi request. |
| | Giá trị vượt tồn kho ($Q > S$) | **Invalid** | $Q = 11$ ($S+1$) | **Off-point** (Cận biên trên tồn kho) | Báo lỗi: "Số lượng vượt quá tồn kho hiện có (còn 10 sản phẩm)". |
| | | **Invalid** | $Q = 100$ ($M+1$) | **Out-point** (Vượt max UI) | Chặn nhập hoặc báo lỗi vượt quá giới hạn cho phép. |
| | Sai định dạng kiểu dữ liệu | **Invalid** | Số thập phân: 1.5, 2.0 | Non-integer domain | Chặn ký tự dấu chấm/phẩy hoặc báo lỗi yêu cầu số nguyên. |
| | | **Invalid** | Ký tự chữ/đặc biệt: abc, @#$, khoảng trắng | Non-numeric domain | Chặn không cho nhập hoặc làm sạch chuỗi (sanitize). |
| | | **Invalid** | Để trống (Empty/Null) | Null domain | Báo lỗi required field; vô hiệu hóa nút submit. |
| | Giá trị cực trị (Overflow) | **Invalid** | $Q = 2^{31}-1$ (2147483647), $10^{10}$ | Large boundary domain | Hệ thống xử lý an toàn, không bị tràn số (Integer Overflow). |
| **Trạng thái tồn kho ($S$)** | Còn hàng ($S > 0$) | **Valid** | $S = 1$, $S = 50$ | Valid state | Input số lượng cho phép nhập; nút "Thêm vào giỏ" Enable. |
| | Hết hàng ($S = 0$) | **Valid (State)** | $S = 0$ | On-point boundary | Input số lượng bị Disable/Read-only; nút đổi thành "Hết hàng" (Disabled). |
| **Dữ liệu sản phẩm (Product Data)** | Sản phẩm hợp lệ, đầy đủ data | **Valid** | ID hợp lệ, đầy đủ URL ảnh, tên, giá, mô tả, category | Nominal | Render đầy đủ UI: Ảnh lớn đúng tỷ lệ, giá format tiền tệ, đúng category. |
| | Dữ liệu biên: Giá trị rỗng/mặc định | **Valid** | Mô tả = Rỗng (""), Không có category | Edge case | Hiển thị thông báo "Chưa có mô tả" hoặc để trống thẩm mỹ, không vỡ layout. |
| | Ảnh lớn bị lỗi / hỏng link | **Invalid** | URL ảnh 404, file không đúng format ảnh | Error domain | Hiển thị Placeholder image mặc định, không lỗi console/vỡ khung. |
| | Giá sản phẩm bất thường | **Invalid** | Giá = 0, Giá âm ($< 0$), Giá null | Error domain | Block hiển thị hoặc đánh dấu sản phẩm lỗi; chặn thêm vào giỏ. |
| | Sản phẩm không tồn tại / Inactive | **Invalid** | ID không tồn tại (404), Sản phẩm bị Unpublish/Draft | Invalid domain | Điều hướng về trang 404 hoặc thông báo: "Sản phẩm không còn khả dụng". |

## **3. Kiểm thử tương tác nút và phản hồi UI/UX (Feedback Loop)**

| **Tình huống tương tác** | **Trạng thái đầu vào** | **Hành vi xử lý (Behavior)** | **Phản hồi giao diện mong đợi (Expected Feedback)** |
| :--- | :--- | :--- | :--- |
| **Thêm thành công (Happy Path)** | $Q$ hợp lệ, $S>0$, sản phẩm active | Gửi request `POST /cart/add` thành công (HTTP 200/201) | - Hiển thị **Toast notification**: "Đã thêm sản phẩm vào giỏ hàng" (tự tắt sau 3-5s). <br>- Cập nhật tức thì **Cart Badge Counter** (tăng thêm $Q$). |
| **Click liên tục (Double/Rapid Click)** | Click 2-3 lần liên tiếp trong $< 500ms$ | Áp dụng cơ chế Debounce/Throttle; chỉ trigger 1 request hợp lệ | Tránh tạo duplicate request; badge chỉ cập nhật đúng $Q$ của 1 lượt submit. |
| **Xung đột tồn kho tức thời (Race Condition)** | Lúc xem $S=2, Q=2$, nhưng user khác vừa mua hết ($S_{thực tế}=0$) | Backend trả về lỗi 409 Conflict hoặc 400 Bad Request | - Hiển thị Toast cảnh báo: "Sản phẩm vừa hết hàng, vui lòng thử lại". <br>- Cập nhật ngay trạng thái nút thành "Hết hàng". |
| **Mất kết nối mạng (Network Error)** | Form hợp lệ, click nút khi offline/timeout | Request thất bại (Timeout/No connection) | Hiển thị Toast lỗi: "Không thể kết nối máy chủ. Vui lòng kiểm tra đường truyền". Badge counter giữ nguyên. |