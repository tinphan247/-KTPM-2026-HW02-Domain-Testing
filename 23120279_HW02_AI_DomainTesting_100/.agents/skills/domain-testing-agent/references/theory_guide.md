# Tài liệu Lý thuyết Cốt lõi: Domain Testing & Boundary Value Analysis
*Theo bài giảng môn Kiểm thử Phần mềm — ThS. Trần Thị Bích Hạnh (Khoa CNTT - ĐH Khoa học Tự nhiên ĐHQG-HCM)*

---

## 1. Bản chất & Mục tiêu (Goal)
- **Vấn đề cốt lõi:** Số lượng ca kiểm thử có thể là vô hạn hoặc rất lớn (combinatorial explosion) trong khi thời gian kiểm thử có hạn.
- **Giải pháp:** Áp dụng phương pháp phân hoạch miền (Domain Testing / Equivalence Partitioning) và Phân tích giá trị biên (Boundary Value Analysis) để giảm số lượng ca kiểm thử cần thực hiện nhưng vẫn đảm bảo độ bao phủ cao (stratified sampling).
- **Nguyên lý:** Phân hoạch miền giá trị thành các miền con (sub-domains / equivalence classes). Hai test case thuộc cùng một lớp tương đương nếu kết quả mong đợi của chúng như nhau. Việc chạy nhiều test case trong cùng 1 lớp tương đương là dư thừa (redundant testing).

---

## 2. Quy trình 4 bước tiếp cận chuẩn (General Approach)

### Bước 1: Xác định biến đầu vào & đầu ra (Identify Input & Output Variables)
- Dựa trên đặc tả yêu cầu (System Specification / SRS).
- Liệt kê rõ:
  - Input variables ($A, B, \dots$) cùng kiểu dữ liệu, miền giá trị vật lý và nghiệp vụ.
  - Output expected (Kết quả xử lý thành công, Thông báo lỗi cụ thể khi invalid).

### Bước 2: Xác định các lớp tương đương (Identify Equivalence Classes)
- **Lớp tương đương hợp lệ (Valid Equivalence Classes):** Đại diện cho các giá trị đầu vào hợp lệ của hệ thống.
- **Lớp tương đương không hợp lệ (Invalid Equivalence Classes):** Đại diện cho các giá trị sai/ngoại lệ để kiểm tra khả năng xử lý lỗi.
- **Nguyên tắc phân hoạch (Guidelines):**
  1. **Khoảng giá trị (Range):** Nếu điều kiện là một khoảng $[min, max]$ $\to$ Xác định 1 lớp hợp lệ ($min \le X \le max$) và 2 lớp không hợp lệ ($X < min$, $X > max$).
  2. **Tập giá trị rời rạc (Set of values):** Nếu hệ thống xử lý từng giá trị khác nhau $\to$ Mỗi giá trị hợp lệ là 1 lớp hợp lệ; các giá trị ngoài tập là 1 lớp không hợp lệ.
  3. **Điều kiện bắt buộc ("Must be"):** Ví dụ "phải là chữ hoa", "phải là số nguyên" $\to$ 1 lớp hợp lệ và 1 lớp không hợp lệ.
  4. **Phân rã (Splitting):** Nếu có lý do tin rằng các phần tử trong 1 lớp tương đương được xử lý khác nhau $\to$ Chia nhỏ lớp tương đương đó thành 2 hoặc nhiều lớp con.

### Bước 3: Lựa chọn ca kiểm thử (Selecting Test Cases)
- Chọn ít nhất 1 test case từ mỗi lớp tương đương.
- **Đối với Valid Equivalence Classes:** Thiết kế test case sao cho **bao phủ càng nhiều lớp hợp lệ càng tốt** trong một test case (nhằm giảm thiểu số test case hợp lệ).
- **Đối với Invalid Equivalence Classes:** Mỗi test case **chỉ được bao phủ DUY NHẤT một lớp không hợp lệ** (nhằm tránh hiện tượng che giấu lỗi - fault masking: nếu đưa 2 giá trị sai vào cùng 1 lúc, lỗi của trường thứ 2 có thể bị bỏ qua bởi lỗi của trường thứ 1).

### Bước 4: Phân tích giá trị biên (Boundary Value Analysis - BVA)
- Chương trình có xác suất lỗi cao nhất tại các điểm biên (off-by-one errors, gõ nhầm dấu so sánh $\le$ thành $<$, sai lệch số liệu).
- **Xác định các điểm biên:**
  - Biên dưới (Lower Boundary - LB): $LB - 1$, $LB$, $LB + 1$.
  - Biên trên (Upper Boundary - UB): $UB - 1$, $UB$, $UB + 1$.
  - Điểm danh định (Nominal value / Valid representative): nằm giữa $LB$ và $UB$.
  - Giá trị nhỏ nhất / lớn nhất cho phép trên UI (nếu có giới hạn kỹ thuật).

---

## 3. Tiêu chuẩn Báo cáo Lỗi (Bug Report Essentials)
Một Bug Report chuẩn mực phải có đầy đủ 10 thành phần:
1. **Bug ID:** Mã định danh duy nhất (khác với Test Case ID, ví dụ: `BUG-FR01-01`).
2. **Function Name:** Tên chức năng / module phát hiện lỗi.
3. **Problem Summary:** Tóm tắt ngắn gọn: Mục tiêu kiểm thử + Kết quả thực tế (Actual result vs Expected result).
4. **How to reproduce it:**
   - **Environment:** Trình duyệt, OS, phiên bản, URL hoặc thiết bị di động.
   - **Steps to Reproduce:** Các bước bấm/nhập chi tiết từ đầu.
   - **Expected Result:** Kết quả hệ thống phải thực hiện theo SRS.
   - **Actual Result:** Kết quả thực tế sai lệch.
   - **Screenshots / Evidence:** Ảnh chụp màn hình rõ ràng, chỉ rõ lỗi.
5. **Reported By:** Họ tên / MSSV người kiểm thử.
6. **Date:** Ngày ghi nhận.
7. **Assign to:** Người chịu trách nhiệm sửa (Developer).
8. **Status:** `New` $\to$ `In-progress` $\to$ `Fixed` $\to$ `Closed` (hoặc `Reopened`, `Rejected`, `Deferred`, `Duplicate`).
9. **Priority (Mức độ khẩn cấp sửa lỗi):**
   - `Critical`: Phải sửa ngay lập tức trong 24h (hệ thống sập, mất mát dữ liệu).
   - `High`: Sửa trong 2–4 ngày (ảnh hưởng tính năng chính).
   - `Medium`: Sửa trong 5–8 ngày (sai lệch nhỏ so với SRS).
   - `Low`: Sửa sau cùng (ảnh hưởng thẩm mỹ, không cản trở luồng).
10. **Severity (Mức độ nghiêm trọng & Trọng số):**
    - `Fatal` (Trọng số 10): System crash, rò rỉ bảo mật nghiêm trọng, mất dữ liệu.
    - `Serious` (Trọng số 5): Ảnh hưởng tính năng chính (ví dụ: thao tác không cần login).
    - `Medium` (Trọng số 3): Sai lệch nhỏ so với SRS, hiển thị sai responsive.
    - `Cosmetic` (Trọng số 1): Lỗi hiển thị, sai chính tả, tab order không đúng, thiếu phím tắt.
