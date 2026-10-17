# HW02 – Domain Testing on EShop: Tiến Độ & Kế Hoạch Thực Hiện

> **Sinh viên**: 23120346  
> **Repository nhóm**: https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing (Branch: `hw02-23120346`)  
> **Điểm tự đánh giá dự kiến**: 100/100  

---

## 🎯 Bảng Theo Dõi Tiến Độ Tổng Quan

| Phase | Nhiệm Vụ Trọng Tâm | Điểm | Trạng Thái |
| :--- | :--- | :---: | :---: |
| **Phase 0** | Khởi tạo cấu trúc Workspace, Git, chọn 4 tính năng | - | 🟢 Hoàn thành |
| **Phase 1** | Xây dựng Agent Skill (`domain-bva-tester`) & Quay Video Demo | **10** | 🟡 Đang làm |
| **Phase 2** | Thiết kế Test Feature A (FR-03) & Feature B (FR-07) (Domain + BVA) | **50** | ⚪ Chưa làm |
| **Phase 3** | Thiết kế Test Feature C (FR-15) & Feature D (FR-04 Mobile) | **40** | ⚪ Chưa làm |
| **Phase 4** | Chạy Test thực tế trên EShop & Log Bug lên GitHub Issues | - | ⚪ Chưa làm |
| **Phase 5** | Phân tích AI Gap, viết AI Critique (200-300 từ) & Audit Report | - | ⚪ Chưa làm |
| **Phase 6** | Hoàn thiện README, xuất Git commit log, PDF và Đóng gói file ZIP | - | ⚪ Chưa làm |

---

## 📋 Chi Tiết Từng Giai Đoạn (Checklist)

### Phase 0: Setup & Khởi Tạo
- [x] Xác định 4 tính năng với nhóm (không trùng lặp):
  - [x] **Feature A (Pool A)**: `FR-03: Quên mật khẩu & Đặt lại mật khẩu (2 bước)`
  - [x] **Feature B (Pool B)**: `FR-07: Giỏ hàng (Shopping Cart)`
  - [x] **Feature C (Pool C)**: `FR-15: Quản lý Sản phẩm (Product CRUD)`
  - [x] **Feature D (Pool D)**: `FR-04 Mobile: Quản lý Hồ sơ cá nhân trên Mobile`
- [x] Nhận diện Repository chung và checkout branch riêng: `hw02-23120346`.
- [x] Tạo khung thư mục cấu trúc cho bài làm cá nhân.
- [ ] Khởi tạo Git cá nhân (`git init`) trong thư mục làm bài hiện tại.
- [ ] Dựng khung thư mục:
  - `reports/` (chứa các file báo cáo markdown & pdf)
  - `test_cases/` (chứa bảng ma trận test case các feature)
  - `evidence/` (chứa ảnh chụp màn hình bug & GitHub issues)
  - `.agents/skills/` (chứa Agent Skill phục vụ môn học)

---

### Phase 1: Xây Dựng Agent Skill & Demo Video (10 điểm)
- [ ] Xây dựng Agent Skill tại thư mục `.agents/skills/domain-bva-tester/SKILL.md`:
  - [ ] Phân tích các biến đầu vào và miền giá trị (Input Variables & Domains).
  - [ ] Phân hoạch tương đương (Equivalence Partitioning).
  - [ ] Phân tích giá trị biên (Boundary Value Analysis: On-point, Off-point, In-bound, Out-of-bound).
  - [ ] Sinh bảng Test Cases theo chuẩn chuyên nghiệp.
- [ ] Thử nghiệm Agent Skill trên 1 tính năng mẫu.
- [ ] Quay video màn hình (3–5 phút) hướng dẫn cách sử dụng skill từ đầu đến cuối (End-to-End).
- [ ] Đăng video lên YouTube (chế độ Không công khai / Unlisted) và lấy link: `[Chèn Link Tại Đây]`.
- [ ] Thực hiện Git commit: `feat(skill): initialize domain-bva-tester skill and documentation`.

---

### Phase 2: Phân Tích & Thiết Kế Test Feature A & B (50 điểm)
- [x] **Feature A (Pool A: FR-03 - 25 điểm)**:
  - [x] Bước 1: Dùng Agent Skill phân tích biến, ràng buộc, miền giá trị.
  - [x] Bước 2: Viết báo cáo áp dụng **Domain Testing** step-by-step.
  - [x] Bước 3: Viết báo cáo áp dụng **Boundary Value Analysis** step-by-step (bảng biên 3-value).
  - [x] Bước 4: Human Review – Tự rà soát, kiểm thử thực tế và bắt 5 bug thực tế.
  - [x] Thực hiện Git commit: `feat(pool-a): complete domain testing, bva, and bug reports for FR-03`.
- [ ] **Feature B (Pool B: FR-07 - 25 điểm)**:
  - [ ] Bước 1: Dùng Agent Skill phân tích logic giỏ hàng / checkout / coupon.
  - [ ] Bước 2: Báo cáo kỹ thuật **Domain Testing** (điều kiện phối hợp, quy tắc tính tiền).
  - [ ] Bước 3: Báo cáo kỹ thuật **Boundary Value Analysis** (biên tiền, biên số lượng, biên %).
  - [ ] Bước 4: Human Review & chuẩn hóa ma trận test cases.
  - [ ] Thực hiện Git commit: `test(pool-b): complete domain testing and bva for feature B`.

---

### Phase 3: Phân Tích & Thiết Kế Test Feature C & D (40 điểm)
- [ ] **Feature C (Pool C: Web Admin - 25 điểm)**:
  - [ ] Bước 1: Phân tích quyền hạn, form nhập liệu CRUD, ràng buộc trùng lặp / format file.
  - [ ] Bước 2: Báo cáo kỹ thuật **Domain Testing** step-by-step.
  - [ ] Bước 3: Báo cáo kỹ thuật **Boundary Value Analysis** step-by-step.
  - [ ] Bước 4: Human Review & bổ sung test case.
  - [ ] Thực hiện Git commit: `test(pool-c): complete domain testing and bva for feature C`.
- [ ] **Feature D (Pool D: Mobile App - 15 điểm)**:
  - [ ] Bước 1: Xác định tính năng tương ứng trên Mobile App.
  - [ ] Bước 2: Áp dụng **Domain Testing** & **BVA** với các đặc thù Mobile (bàn phím số/chữ, xoay màn hình, mất mạng...).
  - [ ] Bước 3: Human Review & hoàn thiện bảng test cases.
  - [ ] Thực hiện Git commit: `test(pool-d): complete domain testing and bva for feature D (mobile)`.

---

### Phase 4: Chạy Test Thực Tế & Log Bug Lên GitHub Issues
- [ ] Chạy các bộ test cases trên SUT EShop thực tế (Web & Mobile).
- [ ] Với mỗi bug tìm được:
  - [ ] Chụp ảnh màn hình làm bằng chứng (lưu vào thư mục `evidence/`).
  - [ ] Mở Issue trên GitHub Repository của nhóm (theo template chuẩn: Precondition, Steps to reproduce, Expected, Actual, Screenshot).
- [ ] Tổng hợp file `reports/bug_report.md` (chứa bảng tổng hợp bug, link GitHub issue, ảnh bằng chứng).
- [ ] Thực hiện Git commit: `docs(bugs): add discovered bug reports with evidence`.

---

### Phase 5: Phân Tích Thiếu Sót Của AI & Báo Cáo AI
- [ ] **AI Gap Analysis (`reports/ai_gap_analysis.md`)**:
  - [ ] Liệt kê các test cases / bug mà AI ban đầu bỏ sót.
  - [ ] Phân tích lý do: Prompt chưa tối ưu? Giới hạn ngữ cảnh của LLM? Nghiệp vụ tiếng Việt phức tạp?
- [ ] **AI Critique (`reports/ai_critique.md`)**:
  - [ ] Viết đoạn văn nghiêm túc từ **200–300 từ** trả lời 3 câu hỏi của đề bài:
    1. AI sai, lệch hoặc thiếu ở đâu?
    2. Tại sao AI không phát hiện ra?
    3. Bài học rút ra khi phối hợp với AI là gì?
- [ ] **AI Audit Report (`reports/ai_audit_report.md`)**:
  - [ ] Bảng log: Tên tool AI, Thời gian, Prompt của bạn, Output tóm tắt của AI.
- [ ] Thực hiện Git commit: `docs(ai): complete ai gap analysis, critique and audit report`.

---

### Phase 6: Hoàn Thiện Tài Liệu & Đóng Gói Nộp Bài
- [ ] Viết file `README.md` chính:
  - [ ] Bảng tự chấm điểm (Self-Assessment Table):
    - Feature A: 25 / 25
    - Feature B: 25 / 25
    - Feature C: 25 / 25
    - Feature D (Mobile): 15 / 15
    - Agent Skills: 10 / 10
    - **Tổng: 100 / 100**
  - [ ] Báo cáo tổng kết (Test Summary Report): Tổng số ca kiểm thử thiết kế, executed, passed, failed, số bug tìm được.
  - [ ] Link YouTube video demo Agent Skill.
- [ ] Xuất file `git_commit_log.txt`:
  ```powershell
  git log --pretty=format:"%h - %an, %ad : %s" --date=short > git_commit_log.txt
  ```
- [ ] Xuất Markdown sang PDF:
  - [ ] `main_report.pdf`
  - [ ] `ai_report.pdf`
- [ ] Đóng gói file `.zip` theo đúng tên:
  - Cú pháp: `<StudentID>_HW02_AI_DomainTesting_100.zip`
- [ ] Kiểm tra lại checklist không thiếu bất kỳ tài liệu bắt buộc nào trước khi nộp lên Moodle.
