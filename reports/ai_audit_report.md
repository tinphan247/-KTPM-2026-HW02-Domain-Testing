# Phụ Lục: AI Audit Report (Nhật Ký Tương Tác AI)

> **Môn học**: Kiểm thử phần mềm  
> **Bài tập**: HW02 – Domain Testing on EShop  
> **Khai báo**: *"Tôi sử dụng công cụ AI cho các tác vụ được liệt kê bên dưới, tuân thủ nguyên tắc AI-First with Human Review."*

---

## Danh Sách Các Lượt Tương Tác

### Interaction #01: Phân tích Đề bài, Lập Kế hoạch & Xây dựng Agent Skills
- **Công cụ AI**: Antigravity (Gemini 3.8 Flash)
- **Ngày & Giờ**: 2026-10-16 16:20
- **Mục tiêu**: Phân tích toàn bộ đề bài HW02, làm rõ quy chế làm bài cá nhân/nhóm, lập lộ trình chi tiết từng phase và thiết kế bộ 3 Agent Skills chuẩn hóa (`domain-bva-tester`, `ai-audit-logger`, `bug-reporter`).
- **Prompt của sinh viên**:
  > *"tóm tắt đề và hướng dẫn tôi làm bài"*  
  > *"tạo một plan chi tiết cho tôi nhé để tôi làm theo từng phase 1"*  
  > *"tạo skill cho tôi và hướng dẫn tôi bắt đầu phase 1 luôn nhé"*
- **Kết quả AI phản hồi**:
  - Tóm tắt đề bài và barem điểm (100đ).
  - Tạo tài liệu kế hoạch tổng thể `hw02_master_plan.md` và file theo dõi tiến độ `plan.md`.
  - Khởi tạo file cấu hình `AGENTS.md` và 3 file `SKILL.md` theo chuẩn ISTQB trong `.agents/skills/`.
- **Đánh giá & Điều chỉnh của Sinh viên (Human Review)**:
  - Sinh viên rà soát cấu trúc thư mục, bổ sung các yêu cầu về video YouTube và git commit log.
  - Phê duyệt bắt đầu triển khai Phase 1.

---

### Interaction #02: Thiết kế Domain Testing, BVA, Báo Cáo Bug & Gap Analysis cho FR-03
- **Công cụ AI**: Antigravity (Gemini 3.8 Flash)
- **Ngày & Giờ**: 2026-10-17 20:25
- **Mục tiêu**: Áp dụng chuẩn 4 bước trong bài giảng (Identify Input/Output, Identify Equivalence Classes, Selecting Test Cases, Boundary Value Analysis) cho tính năng FR-03 (Quên mật khẩu). Đồng thời phát hiện các lỗi ngầm trong mã nguồn và phân tích khoảng trống của AI.
- **Prompt của sinh viên**:
  > *"các step trong slide ấy, giờ tôi cần làm gì với re03"*  
  > *"các bước thực hiện cho một feature là gì, và với mỗi feature tôi cần có các tài liệu gì để được 100% điểm"*  
  > *"bạn hãy bổ sung đầy đủ các tài liệu cần thiết cho FR03 cũng như liệt kê chi tiết các công việc mà tôi cần làm"*
- **Kết quả AI phản hồi**:
  - Soạn thảo báo cáo chuẩn chỉnh `reports/main_report.md` chứa đầy đủ Step 1 -> Step 4, bảng phân hoạch tương đương ($EP_V, EP_I$), bảng ma trận 14 Domain Test Cases và 7 BVA Test Cases.
  - Tạo file `reports/bug_report.md` ghi nhận 5 lỗi nghiêm trọng của FR-03 (thiếu confirm password, OTP 4 số vs 6 số, regex bắt buộc khoảng trắng, `type="text"`, thiếu step indicator).
  - Tạo file `reports/ai_gap_analysis.md` phân tích nguyên nhân AI bỏ sót các lỗi logic runtime.
- **Đánh giá & Điều chỉnh của Sinh viên (Human Review)**:
  - Sinh viên kiểm tra đối chiếu trực tiếp trên giao diện trình duyệt `http://localhost:5173/forgot-password` để xác nhận các lỗi trên là chính xác 100% so với thực tế.
  - Sinh viên chuẩn bị chụp ảnh màn hình để lưu vào `evidence/` và đăng lên GitHub Issues.

