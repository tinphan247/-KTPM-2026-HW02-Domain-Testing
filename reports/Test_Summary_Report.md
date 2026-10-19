# Báo cáo Tổng kết Kiểm thử (Test Summary Report)

**Dự án:** EShop — Phiên bản Kiểm thử Phần mềm  
**Học phần:** Kiểm thử Phần mềm — FIT-HCMUS  
**Phương pháp:** Domain Testing, Equivalence Partitioning (EP), Boundary Value Analysis (BVA)  
**Ngày lập:** 2026-10-19  

---

## 1. Tổng quan Hoạt động Kiểm thử (Test Activity Summary)

Hệ thống SUT đã được kiểm thử toàn diện trên 4 tính năng đại diện thuộc 4 pool theo đúng yêu cầu đề bài:
1. **Feature A (Pool A):** `FR-01` — Đăng ký tài khoản (Frontend Web & Backend API).
2. **Feature B (Pool B):** `FR-09` — Áp dụng mã giảm giá & Luồng thanh toán Checkout (`FR-08`).
3. **Feature C (Pool C):** `FR-14` — Quản lý danh mục (Web Admin Category CRUD & Authorization).
4. **Feature D (Pool D):** `FR-02` — Đăng nhập & Khóa tài khoản trên Mobile App (React Native / Expo).

---

## 2. Thống kê Kết quả Thực thi Test Case (Test Execution Statistics)

*Định dạng bảng theo Slide 18 - Test Report (ThS. Trần Thị Bích Hạnh):*

| STT | Chức năng (Items) | Tổng TC thiết kế (Total) | Đã chạy (Tested) | Đạt (Passed) | Thất bại (Failed) | Bị chặn (Blocked) | Bỏ qua (Skipped) | Chưa chạy (Not Yet Tested) | Tỷ lệ bao phủ (Coverage %) | Tỷ lệ Pass (%) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | Feature A: FR-01 (Web Register) | 12 | 12 | 4 | 8 | 0 | 0 | 0 | 100% | 33.3% |
| 2 | Feature B: FR-09 (Coupons & Checkout) | 12 | 12 | 8 | 4 | 0 | 0 | 0 | 100% | 66.7% |
| 3 | Feature C: FR-14 (Category Admin) | 12 | 12 | 4 | 8 | 0 | 0 | 0 | 100% | 33.3% |
| 4 | Feature D: FR-02 (Mobile Login) | 10 | 10 | 2 | 8 | 0 | 0 | 0 | 100% | 20.0% |
| **Tổng** | **Toàn bộ 4 Tính năng** | **46** | **46** | **18** | **28** | **0** | **0** | **0** | **100%** | **39.1%** |

> **Nhận xét tỷ lệ Pass/Fail:** Tỷ lệ Failed cao (**60.9%** — 28/46 ca) phản ánh đúng đặc thù của hệ thống SUT được cố ý cài cắm nhiều lỗi biên (Boundary defects), lỗi điều kiện vị từ (Predicate flaws) và lỗi bảo mật/phân quyền để phục vụ bài tập kiểm thử.

---

## 3. Thống kê Lỗi theo Mức độ Nghiêm trọng (Statistics by Defect Severity)

*Định dạng bảng & trọng số theo Slide 12, 19, 20 - Test Report:*

| Mức độ nghiêm trọng (Severity) | Trọng số (Weight) | Số lượng lỗi (Count) | Tỷ lệ số lượng (%) | Tổng điểm trọng số (Defect Weight) | Tỷ lệ trọng số (%) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Fatal** (System crash, mất an toàn, rò rỉ dữ liệu) | 10 | 7 | 35.0% | 70 | 63.1% |
| **Serious** (Ảnh hưởng tính năng chính) | 5 | 5 | 25.0% | 25 | 22.5% |
| **Medium** (Sai lệch nhỏ so với yêu cầu) | 3 | 4 | 20.0% | 12 | 10.8% |
| **Cosmetic** (Lỗi giao diện, màu sắc, dialog) | 1 | 4 | 20.0% | 4 | 3.6% |
| **Tổng cộng** | | **20** | **100.0%** | **111** | **100.0%** |

---

## 4. Thống kê Lỗi theo Loại Lỗi (Statistics by Defect Type)

*Định dạng phân loại theo Slide 19 - Test Report:*

| Loại lỗi (Defect Type) | Fatal | Serious | Medium | Cosmetic | Tổng số lỗi | Tỷ lệ (%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Coding logic / Boundary error** | 2 (`BUG-FR09-02`, `BUG-FR02-01`) | 3 (`BUG-FR01-01`, `BUG-FR09-01`, `BUG-FR02-02`) | 1 (`BUG-FR14-01`) | 0 | 6 | 30.0% |
| **Security & Access Control** | 3 (`BUG-FR01-08`, `BUG-FR14-02`, `BUG-FR08-01`) | 1 (`BUG-FR09-03`) | 0 | 0 | 4 | 20.0% |
| **Business & Data integrity** | 2 (`BUG-FR01-05`, `BUG-FR08-02`) | 0 | 1 (`BUG-FR14-03`) | 0 | 3 | 15.0% |
| **Form Spec & Input Validation** | 0 | 1 (`BUG-FR01-02`) | 2 (`BUG-FR01-03`, `BUG-FR01-04`) | 0 | 3 | 15.0% |
| **GUI & User Experience** | 0 | 0 | 0 | 4 (`BUG-FR01-06`, `BUG-FR01-07`, `BUG-FR08-03`, `BUG-FR02-03`) | 4 | 20.0% |
| **Tổng cộng** | **7** | **5** | **4** | **4** | **20** | **100%** |

---

## 5. Kết luận & Đánh giá (Conclusion & Recommendations)
1. **Chất lượng SUT:** Hệ thống tồn tại nhiều lỗ hổng nghiêm trọng ở cả 3 tầng (Frontend Web, Mobile App và Backend API). Đặc biệt là việc thiếu validation đồng bộ ở Backend dẫn tới việc có thể bypass hoàn toàn các kiểm tra phía client.
2. **Hiệu quả của Kỹ thuật Domain & Boundary Testing:** Kỹ thuật BVA và Domain Testing đã chứng minh sức mạnh vượt trội khi phát hiện ra các lỗi mà kiểm thử thông thường dễ bỏ qua:
   - **FR-01 (Đăng ký Web):** Lỗi Regex đảo ngược bắt buộc khoảng trắng và cấm ký tự đặc biệt; mật khẩu lưu trực tiếp dạng plaintext trong CSDL SQLite.
   - **FR-09 & FR-08 (Giảm giá & Checkout):** Lỗi toán tử so sánh `>` thay vì `>=` tại ngưỡng đơn hàng tối thiểu 300.000 ₫; lỗi công thức toán học làm số tiền giảm giá bị âm; lỗ hổng cho phép khách hàng tự gõ sửa ô tổng tiền trên giao diện Checkout; chấp nhận thanh toán đơn hàng 0 ₫.
   - **FR-14 (Danh mục Admin):** Cho phép tạo danh mục có tên rỗng/khoảng trắng ($LB-1$); lỗ hổng Broken Access Control (BOLA/OWASP A01) cho phép User thường gọi API Admin để tạo/xóa danh mục; nút xóa thiếu modal xác nhận nguy hiểm và gây mồ côi dữ liệu CSDL.
   - **FR-02 (Mobile Login & Lockout):** Lỗi bộ đếm thất bại nhảy cóc `+2` mỗi lần khiến người dùng bị khóa sai chỉ sau 2 lần thử; lỗi cài đặt thời gian khóa tài khoản kéo dài tới 180s (3 phút) thay vì 30s theo đặc tả; vi phạm các quy chuẩn giao diện di động FR-21/FR-22.
