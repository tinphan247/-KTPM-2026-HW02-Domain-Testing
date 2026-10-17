---
name: domain-testing-agent
description: >-
  Expert AI Testing Agent applying Domain Testing, Equivalence Partitioning (EP),
  Boundary Value Analysis (BVA), Bug Reporting, and AI Gap Analysis according to the
  FIT-HCMUS Software Testing syllabus (Dr. Lam Quang Vu / Dr. Tran Duy Hoang / MSc. Tran Thi Bich Hanh).
---

# Domain Testing & Boundary Value Analysis Agent Skill

## 1. Giới thiệu & Mục tiêu (Overview & Objective)

Skill này hướng dẫn quy trình kiểm thử hộp đen chuẩn mực cho hệ thống **EShop SUT**, tuân thủ 100% kiến thức học phần Kiểm thử Phần mềm tại Khoa CNTT - Trường ĐH Khoa học Tự nhiên ĐHQG-HCM:
- **Phân hoạch tương đương (Equivalence Partitioning - EP)**
- **Phân tích giá trị biên (Boundary Value Analysis - BVA)**
- **Kiểm thử miền (Domain Testing / Decision Table Testing)**
- **Lập Báo cáo Lỗi (Bug Report)** & **Báo cáo Tổng kết Kiểm thử (Test Summary Report)**


---

## 2. Quy trình Thực hiện Chuẩn 7 Bước (Standard 7-Step Procedure)

Khi người dùng yêu cầu áp dụng Domain Testing hoặc BVA cho bất kỳ tính năng nào (FR-xx), Agent **BẮT BUỘC** thực hiện tuần tự theo 7 bước sau:

### Bước 1: Phân tích Đặc tả & Xác định Biến (Identify Inputs & Outputs)
1. Đọc kỹ đặc tả trong [eshop-sut/README.md](../../../eshop-sut/README.md) và [eshop-sut/api_specification.md](../../../eshop-sut/api_specification.md) cho tính năng được chọn.
2. Liệt kê toàn bộ các biến đầu vào ($A, B, C, \dots$) gồm: Tên biến, Kiểu dữ liệu, Ý nghĩa, Ràng buộc nghiệp vụ (Constraints).
3. Liệt kê các kết quả đầu ra kỳ vọng (Expected Outputs): Kết quả thành công (Success state) và các thông báo lỗi khi dữ liệu không hợp lệ (Error messages).

### Bước 2: Phân hoạch Lớp Tương đương (Equivalence Partitioning)
1. Phân chia miền giá trị của từng biến thành các tập con rời rạc (sub-domains / equivalence classes):
   - **Valid Equivalence Classes (Lớp hợp lệ):** Giá trị thỏa mãn ràng buộc nghiệp vụ.
   - **Invalid Equivalence Classes (Lớp không hợp lệ):** Giá trị vi phạm ràng buộc (vượt khoảng, sai kiểu, rỗng, ký tự cấm,...).
2. Đánh mã định danh chuẩn: `EC1`, `EC2`, `EC3`,...
3. Tuân thủ 4 quy tắc phân hoạch của bộ môn:
   - *Range:* $LB \le X \le UB \implies$ 1 lớp Valid, 2 lớp Invalid ($X < LB$, $X > UB$).
   - *Set of values:* Các giá trị rời rạc được xử lý riêng $\implies$ Mỗi giá trị là 1 lớp Valid, ngoài tập là 1 lớp Invalid.
   - *Must be:* Điều kiện bắt buộc $\implies$ 1 lớp Valid, 1 lớp Invalid.
   - *Split:* Nếu có sự khác biệt về nhánh xử lý bên trong một lớp $\implies$ Tách thành các lớp con nhỏ hơn.

### Bước 3: Phân tích Giá trị Biên (Boundary Value Analysis - BVA)
1. Đối với các biến có thứ tự (ordered variables: số, độ dài chuỗi, ngày tháng, tiền tệ):
2. Xác định các giá trị biên:
   - **Lower Boundary (LB):** $LB - 1$ (Invalid/Off-point), $LB$ (Valid/On-point), $LB + 1$ (Valid/In-point).
   - **Upper Boundary (UB):** $UB - 1$ (Valid/In-point), $UB$ (Valid/On-point), $UB + 1$ (Invalid/Off-point).
   - **Nominal Value (Nom):** Giá trị danh định điển hình ở giữa khoảng.
   - **Extreme limits:** Giá trị nhỏ nhất/lớn nhất mà giao diện/database cho phép nhập.
3. Đánh mã định danh điểm biên: `BV1`, `BV2`,...

### Bước 4: Kiểm thử Miền Đa biến & Bảng Quyết định (Domain & Decision Table Testing)
*Áp dụng khi tính năng có nhiều điều kiện ràng buộc phụ thuộc nhau (ví dụ: Coupon FR-09, Đăng ký FR-01, CRUD FR-15).*
1. Xác định các nguyên nhân (Causes / Conditions: $C_1, C_2, \dots$) và kết quả (Effects: $E_1, E_2, \dots$).
2. Thiết lập bảng quyết định (Decision Table): Liệt kê các tổ hợp $2^n$ quy tắc ($T/F$).
3. Rút gọn bảng quyết định (Reduce Table) bằng cách loại bỏ các trường hợp bất khả thi (Impossible cases) hoặc gộp các điều kiện không phụ thuộc (`-`).

### Bước 5: Lựa chọn & Thiết kế Ca Kiểm thử (Test Case Selection)
Áp dụng nghiêm ngặt nguyên lý chọn test case của bài giảng:
- **Đối với Valid Equivalence Classes:** Tạo test case bao phủ **càng nhiều lớp hợp lệ càng tốt** trong một ca kiểm thử để tối ưu hóa số lượng test case.
- **Đối với Invalid Equivalence Classes:** Mỗi test case **CHỈ ĐƯỢC BAO PHỦ DUY NHẤT 1 LỚP KHÔNG HỢP LỆ** (Single Fault Assumption). Tuyệt đối không kết hợp 2 giá trị invalid trong cùng 1 test case để tránh hiện tượng che giấu lỗi (*Fault Masking*).
- Xuất bảng Test Case theo mẫu [test_case_template.md](./templates/test_case_template.md).

### Bước 6: Thực thi Kiểm thử trên SUT (Execution on Live SUT)
1. Kiểm tra trạng thái các service:
   - Backend API: `http://localhost:3000`
   - Frontend Web: `http://localhost:5173`
   - Frontend Admin: `http://localhost:5174`
2. Thực thi từng test case bằng browser / cURL / REST Client.
3. So sánh giữa **Kết quả mong đợi (Expected Result)** và **Kết quả thực tế (Actual Result)**.
4. Ghi nhận trạng thái: `PASS` hoặc `FAIL`.

### Bước 7: Báo cáo Lỗi & Tạo GitHub Issue (Bug Reporting)
1. Với mỗi ca test bị `FAIL`, lập hồ sơ lỗi đầy đủ 10 trường theo mẫu [bug_report_template.md](./templates/bug_report_template.md):
   - `Bug ID`
   - `Function Name`
   - `Problem Summary` (Test Objective + Actual vs Expected)
   - `How to reproduce` (Environment, Steps, Expected, Actual)
   - `Reported By`, `Date`, `Assign To`, `Status`
   - `Priority` (Critical, High, Medium, Low)
   - `Severity` (Fatal: 10, Serious: 5, Medium: 3, Cosmetic: 1)
   - `Screenshots / Evidence`
2. Đẩy bug lên GitHub Issues của nhóm và lưu ảnh chụp minh chứng.



---

## 3. Các Tài liệu Tham khảo & Templates Kèm theo
- **Lý thuyết chi tiết:** [theory_guide.md](./references/theory_guide.md)
- **Mẫu Test Case:** [test_case_template.md](./templates/test_case_template.md)
- **Mẫu Bug Report:** [bug_report_template.md](./templates/bug_report_template.md)
- **Mẫu Test Summary Report:** [test_summary_template.md](./templates/test_summary_template.md)
