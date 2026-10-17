# Phụ Lục: Nhật Ký Tương Tác AI (AI Audit Report)

> **Môn học**: Kiểm thử phần mềm (Software Testing)  
> **Sinh viên thực hiện**: **Trần Vũ Quang**  
> **Mã số sinh viên (MSSV)**: **23120346**  
> **Repository GitHub**: [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing)  
> **Branch**: [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/tree/hw02-23120346](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/tree/hw02-23120346)  
> **Đề tài**: HW02 – Domain Testing & Boundary Value Analysis on EShop  
> **Cam kết liêm chính học thuật**: *"Tôi sử dụng AI như một công cụ trợ lực (Co-pilot) để hỗ trợ tính toán, định dạng và dựng khung; toàn bộ việc xác thực mã nguồn, kiểm thử trên giao diện thực tế và quyết định bắt bug đều do tôi trực tiếp thực hiện."*

---

## Danh Sách Các Lượt Tương Tác & Phản Biện Của Sinh Viên

### Lượt tương tác #01: Thảo luận phương pháp & Chuẩn hóa cấu trúc bài làm
* **Thời gian**: 2026-10-16 16:20
* **Mục tiêu**: Thống nhất 4 bước Domain Testing theo đúng slide bài giảng của giảng viên, tránh việc AI sinh test case theo cảm tính hoặc sai chuẩn ISTQB.
* **Prompt của sinh viên**:
  > *"Tóm tắt yêu cầu đề bài HW02 giúp tôi. Lưu ý là quy trình Domain Testing phải tuân thủ đúng 4 bước trong slide bài giảng: 1. Identify Variables, 2. Identify Equivalence Classes, 3. Selecting Test Cases, 4. Boundary Value Analysis. Hãy lập kế hoạch chi tiết từng bước cho tôi rà soát."*
* **AI phản hồi**:
  Tóm tắt cấu trúc 4 bước và đề xuất kế hoạch thực hiện cho 4 tính năng đã chọn (FR-03, FR-07, FR-15, FR-04 Mobile).
* **Đánh giá & Điều chỉnh của sinh viên (Human Review)**:
  Tôi kiểm tra lại thấy AI đề xuất dùng kỹ thuật BVA 2 giá trị ($Min, Max$), tôi đã yêu cầu AI phải chuyển sang **kỹ thuật 3-value BVA** ($LB-1, LB, LB+1$ và $UB-1, UB, UB+1$) cho chặt chẽ và đạt điểm tối đa.

---

### Lượt tương tác #02: Lập bảng phân hoạch tương đương và bắt lỗi logic FR-03 (Quên mật khẩu)
* **Thời gian**: 2026-10-17 20:25
* **Mục tiêu**: Hỗ trợ phân tích các biến đầu vào của FR-03 và rà soát bẫy mã nguồn ở Bước 2.
* **Prompt của sinh viên**:
  > *"Phân tích các biến đầu vào của tính năng FR-03 Quên mật khẩu. Tôi vừa đọc mã nguồn file ForgotPassword.jsx và thấy có điều rất lạ ở phần regex mật khẩu và mã OTP. Bạn hãy trích xuất đúng các biến trong code và lập bảng phân hoạch tương đương cho tôi."*
* **AI phản hồi**:
  Trích xuất các biến `email`, `otp`, `newPassword` và lập bảng $EP_V, EP_I$. Ban đầu AI tự ý thêm biến `confirmPassword` vào bảng.
* **Đánh giá & Điều chỉnh của sinh viên (Human Review - Bắt lỗi AI)**:
  Tôi lập tức chặn lại và chỉ ra lỗi suy diễn của AI: *"Trong code ForgotPassword.jsx hoàn toàn KHÔNG CÓ trường Confirm Password, lập trình viên đã quên làm trường này. Bạn không được tự bịa ra biến đó trong bảng phân hoạch thực tế"*. Nhờ sự can thiệp này, bảng test case phản ánh chính xác lỗi thiếu sót thực tế của SUT (`BUG-FR03-01`).

---

### Lượt tương tác #03: Rà soát lỗi Autofill trên trình duyệt thực tế (Human Finding)
* **Thời gian**: 2026-10-17 21:10
* **Mục tiêu**: Đưa quan sát từ trải nghiệm thực tế của con người vào báo cáo kiểm thử.
* **Prompt của sinh viên**:
  > *"Khi tôi mở form Bước 2 trên Chrome bằng tài khoản cá nhân, trình duyệt tự động điền email của tôi vào ô OTP và điền mật khẩu cũ vào ô mật khẩu mới. Đây là lỗi do thiếu thuộc tính autocomplete. AI của bạn có biết lỗi này không? Hãy ghi nhận đây là lỗi do con người phát hiện trong trải nghiệm thực tế."*
* **AI phản hồi**:
  Xác nhận đây là lỗi `Browser Autofill Misdirection` do thuật toán heuristics của trình duyệt nhận nhầm form reset password thành form login thông thường khi thiếu `autocomplete="off"`.
* **Đánh giá & Điều chỉnh của sinh viên (Human Review)**:
  Tôi trực tiếp chụp ảnh màn hình lỗi trên máy tính cá nhân để làm bằng chứng xác thực (`BUG-FR03-08`) và đưa vào phần phân tích khoảng trống AI.

---

### Lượt tương tác #04: Thẩm định tính năng FR-07 Giỏ hàng & Phát hiện bẫy Double-Click
* **Thời gian**: 2026-10-17 22:30
* **Mục tiêu**: Thiết kế bảng test case cho giỏ hàng và kiểm tra hành vi thêm sản phẩm.
* **Prompt của sinh viên**:
  > *"Chuẩn bị các ca kiểm thử cho FR-07 Giỏ hàng. Khi tôi trực tiếp test tay trên web localhost:5173, tôi bấm nút Thêm vào giỏ hàng 1 lần thì không thấy có gì xảy ra, phải bấm đúp (2 lần) thì mới vào giỏ. Bạn hãy soi code ProductDetail.jsx dòng 22 xem có bẫy gì ở đây không."*
* **AI phản hồi**:
  Đọc mã nguồn và tìm ra đoạn code: `if (clickCount === 0) { setClickCount(1); return; }` chứng minh lập trình viên cố tình gài bẫy chặn click lần đầu.
* **Đánh giá & Điều chỉnh của sinh viên (Human Review)**:
  AI đề xuất log thêm một số lỗi vặt về màu sắc nút bấm, nhưng tôi kiên quyết gạt bỏ và chỉ giữ lại 2 lỗi chức năng thực sự có giá trị: Lỗi thêm trùng bị nhân đôi dòng (`BUG-FR07-02`) và Lỗi xóa không hỏi xác nhận (`BUG-FR07-03`). Bẫy double-click được tôi đưa riêng vào phần AI Gap để phân tích sự khác biệt giữa test máy và test tay.

---

### Lượt tương tác #05: Kiểm tra biên mở rộng cho FR-15 Quản lý sản phẩm Admin
* **Thời gian**: 2026-10-17 23:15
* **Mục tiêu**: Viết script tự động quét các giá trị biên khắc nghiệt (Extreme Boundaries) trên API sản phẩm.
* **Prompt của sinh viên**:
  > *"Tính năng quản lý sản phẩm này rất rộng. Tôi nghi ngờ backend chưa validate kỹ dữ liệu đầu vào. Hãy giúp tôi viết một script nodejs để gửi các payload biên: giá = 0, giá âm, giá là chữ, tên rỗng, category_id ảo không tồn tại xem backend phản ứng ra sao."*
* **AI phản hồi**:
  Hỗ trợ viết script `exec_fr15_extended_tests.js` để gửi các payload kiểm thử tự động lên `http://localhost:3000/api/products`.
* **Đánh giá & Điều chỉnh của sinh viên (Human Review)**:
  Tôi trực tiếp chạy script, quan sát mã trả về của backend và dùng trình duyệt Admin (`localhost:5174`) kiểm chứng lại. Kết quả phát hiện backend chấp nhận cả giá âm lẫn giá 0đ. Tôi đã tự tay chụp lại màn hình giao diện lưu giá 0đ thành công để làm minh chứng không thể chối cãi.

---

### Lượt tương tác #06: Nâng cấp Expo SDK 57 và xử lý sự cố mạng phòng trọ (FR-04 Mobile)
* **Thời gian**: 2026-10-17 23:35
* **Mục tiêu**: Nâng cấp môi trường di động và thiết lập đường truyền cho điện thoại thật.
* **Prompt của sinh viên**:
  > *"Ứng dụng mobile đang chạy Expo SDK cũ (54), hãy hướng dẫn tôi nâng lên SDK 57 cho tương thích với app Expo Go trên điện thoại của tôi. Mạng của tôi là mạng phòng trọ nên điện thoại không gọi được về IP 192.168.x.x của laptop, cần giải pháp tunnel công khai."*
* **AI phản hồi**:
  Hỗ trợ chạy `npx expo install expo@^57.0.0 --fix`, dọn dẹp các trường cấu hình cũ trong `app.json` và thiết lập tunnel HTTPS qua Pinggy cho Backend API.
* **Đánh giá & Điều chỉnh của sinh viên (Human Review)**:
  Tôi dùng iPhone quét mã QR, đăng nhập vào app và trực tiếp test form cập nhật hồ sơ cá nhân. Nhờ đó, tôi phát hiện ra regex cấm số 0 ở đầu (`^[1-9]`) khiến số điện thoại `0357131476` của tôi bị văng Alert từ chối. Tôi đã chụp lại màn hình điện thoại gửi vào thư mục `screenshots/`.

---

### Lượt tương tác #07: Kiểm toán hình ảnh hiển thị trên GitHub Issues và hoàn thiện tài liệu
* **Thời gian**: 2026-10-18 00:10
* **Mục tiêu**: Đảm bảo toàn bộ 21 issues trên GitHub hiển thị ảnh Markdown trực tiếp, không bị lỗi text thô hay link 404.
* **Prompt của sinh viên**:
  > *"Kiểm tra lại toàn bộ các issues trên GitHub nhóm. Tôi thấy một số issues của FR-03 đang bị hiển thị dạng text tên file chứ không hiện ảnh trực tiếp. Hãy viết script PATCH lại toàn bộ nội dung issue bằng cú pháp Markdown image tuyệt đối từ raw branch hw02-23120346."*
* **AI phản hồi**:
  Viết và chạy script `update_all_github_issues_images.js` để cập nhật đồng loạt các issue #39 đến #46 và #52.
* **Đánh giá & Điều chỉnh của sinh viên (Human Review)**:
  Tôi trực tiếp mở từng đường link Issue trên trình duyệt để kiểm tra kết quả hiển thị, xác nhận 100% hình ảnh đã hiển thị rõ ràng, chuyên nghiệp trước khi hoàn tất báo cáo.
