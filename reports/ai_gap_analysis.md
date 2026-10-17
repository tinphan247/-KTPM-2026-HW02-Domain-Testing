# BÁO CÁO PHÂN TÍCH KHOẢNG TRỐNG CỦA AI (AI GAP ANALYSIS)
## Môn học: Kiểm thử phần mềm (HW02)
> **Sinh viên thực hiện**: 23120346  
> **Mục tiêu**: So sánh kết quả kiểm thử do AI sinh ra so với quá trình rà soát thực tế của con người (Human Review), phân tích nguyên nhân tại sao AI bỏ sót.

---

## 1. Phân Tích Khoảng Trống Cho Tính Năng FR-03 (Quên & Đặt lại mật khẩu)

### 1.1. Những ca kiểm thử và Bug mà công cụ AI ban đầu bỏ sót

Khi yêu cầu AI sinh test case cho tính năng FR-03 chỉ dựa trên bản đặc tả tài liệu (Black-box Specification):
1. **AI bỏ sót lỗi thiếu trường "Xác nhận mật khẩu" (Confirm Password)**:
   * *Thực tế*: AI sinh ra rất nhiều ca kiểm thử hợp lệ kiểm tra xem `confirm_password` có khớp với `new_password` hay không. Tuy nhiên, AI mặc định rằng giao diện đã có sẵn ô nhập này và không nhận diện được rằng nhà phát triển giao diện đã **quên hoàn toàn việc tạo trường input `confirm_password` trên UI**.
2. **AI bỏ sót Bug lệch pha độ dài OTP giữa Backend và Đặc tả (4 số vs 6 số)**:
   * *Thực tế*: AI thiết kế các ca BVA với giả định OTP luôn là 6 chữ số ($N=5, 6, 7$). AI không lường trước được rằng Backend trong thực tế lại sinh mã OTP chỉ gồm 4 chữ số (`Math.random() * 9000`), và nhãn UI lại ghi là "Mã OTP (4 số)".
3. **AI bỏ sót lỗi Logic Regex mật khẩu (yêu cầu khoảng trắng thay vì ký tự đặc biệt)**:
   * *Thực tế*: AI tự động thiết kế ca kiểm thử mật khẩu hợp lệ là `Eshop@2026` và kỳ vọng hệ thống sẽ chấp nhận. Tuy nhiên, khi chạy thực tế trên code thật, hệ thống lại từ chối mật khẩu này vì lập trình viên đã viết sai regex thành `(?=.*\s)` (đòi hỏi khoảng trắng). Con người phải trực tiếp kiểm tra mã nguồn (`ForgotPassword.jsx`) hoặc test thực tế mới phát hiện ra bug logic nghiêm trọng này.
4. **AI bỏ sót việc kiểm tra loại thẻ HTML5 (`type="text"` thay vì `type="email"`)**:
   * *Thực tế*: AI chỉ tập trung vào việc gửi dữ liệu email sai để xem hệ thống có báo lỗi nghiệp vụ hay không, bỏ qua việc kiểm tra thuộc tính thẻ HTML5 theo chuẩn GUI Form của đề bài (FR-22).

---

### 1.2. Phân Tích Nguyên Nhân (Root Cause Analysis)

Theo yêu cầu mục 6 của đề bài, các nguyên nhân khiến AI bỏ sót các vấn đề trên bao gồm:

1. **Giới hạn của Prompt và Phạm vi Ngữ cảnh (Context Limitations)**:
   * Prompt ban đầu thường chỉ cung cấp tài liệu đặc tả chức năng (SRS - những gì hệ thống *nên làm*). AI không được cấp toàn bộ mã nguồn của từng file giao diện React và Backend, dẫn đến việc AI thiết kế test case theo "kịch bản lý tưởng" (Ideal World) thay vì phản ánh "thực tế triển khai" (As-built SUT).
2. **Thiên lệch giả định hệ thống tuân thủ (Compliance Bias)**:
   * Các mô hình LLM có xu hướng ngầm định rằng các thành phần cơ bản của form (như trường Confirm Password, thẻ `type="email"`) đã được cài đặt đầy đủ theo đặc tả. AI không có trực giác nghi ngờ những lỗi cơ bản mang tính "quên cài đặt" của lập trình viên.
3. **Thiếu khả năng thực thi động (Lack of Dynamic Execution)**:
   * AI dạng văn bản (LLM) chỉ thực hiện phân tích tĩnh trên lý thuyết. AI không thể trực tiếp click chuột vào giao diện, không nhìn thấy thông báo Alert bật lên, và không tương tác trực tiếp với API runtime trừ khi được kết nối vào hệ thống kiểm thử tự động chuyên sâu.

---

### 1.3. Biện Pháp Khắc Phục Của Con Người (Human Review Remediation)
* **Can thiệp thủ công**: Sinh viên trực tiếp khởi chạy SUT, mở mã nguồn `frontend-web/src/pages/ForgotPassword.jsx` và `backend/server.js` để đối chiếu từng dòng lệnh.
* **Bổ sung Test Cases**: Bổ sung các test case kiểm tra thuộc tính HTML5, kiểm tra hành vi thực tế của OTP 4 số, và kiểm tra trường hợp mật khẩu có chứa khoảng trắng.
* **Đăng tải Bug Report**: Ghi nhận 5 lỗi thực tế kèm bằng chứng ảnh chụp lên GitHub Issues.
