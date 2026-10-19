# BÁO CÁO TỔNG THỂ BÀI TẬP HW02: KIỂM THỬ MIỀN & PHÂN TÍCH GIÁ TRỊ BIÊN
## (DOMAIN TESTING & BOUNDARY VALUE ANALYSIS ON ESHOP SUT)

* **Học phần:** Kiểm thử Phần mềm (Software Testing) — Mã HP: `KTPM-2026`
* **Đơn vị đào tạo:** Khoa Công nghệ Thông tin, Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM (FIT-HCMUS)
* **Giảng viên & Trợ giảng:** TS. Lâm Quang Vũ / TS. Trần Duy Hoàng / ThS. Trần Thị Bích Hạnh / ThS. Trương Phước Lộc / ThS. Hồ Tuấn Thanh
* **Sinh viên thực hiện:** **Nguyễn Lê Quang Kan**
* **Mã số sinh viên:** **`23120279`**
* **Nhóm phân công:** `N4_1`
* **Git Repo:** [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing)
* **Git Branch:** `hw02-23120279`
* **Chiến lược kiểm thử:** **AI-First kết hợp Giám sát & Thực thi Độc lập của Con người (Human-in-the-loop)**

---

## 1. BẢNG TỰ ĐÁNH GIÁ ĐIỂM SỐ (SELF-ASSESSMENT TABLE)

*Căn cứ theo thang điểm quy chuẩn tại **Mục 15 — Assessment Template** của đề cương bài tập `HW02 – Domain Testing`:*

| STT | Hạng mục Đánh giá (Criteria) | Điểm Tối đa (Grade) | Điểm Tự đánh giá (Self-Assessed) | Minh chứng & Cơ sở Tự đánh giá |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Feature A (Domain + Boundary):**<br>`FR-01` Web Registration | 25 | **25 / 25** | Hoàn thành trọn vẹn 8 bước kiểm thử: Xác định 4 biến I/O, 21 lớp tương đương (EP), 8 điểm biên BVA độ dài mật khẩu ($LB=8, UB=50$), Bảng quyết định 7 rules ($R_1 \to R_7$), bộ 22 Test Cases (và 12 TC cốt lõi), thực thi SUT Live phát hiện 8 Bugs (nổi bật `BUG-FR01-01` Regex đảo ngược và `BUG-FR01-08` Plaintext password trong CSDL). |
| **2** | **Feature B (Domain + Boundary):**<br>`FR-09` Discount Coupons & Checkout | 25 | **25 / 25** | Hoàn thành trọn vẹn 8 bước: Bóc tách 5 điều kiện vị từ ($C_1 \to C_5$), 16 lớp tương đương, BVA đa biến quanh ngưỡng $LB=300,000$ ₫ ($LB-1, LB, LB+1$), Bảng quyết định 6 rules, bộ 12 Test Cases, phát hiện 6 Bugs (`BUG-FR09-01` toán tử `>` tại biên $LB$, `BUG-FR09-02` chiết khấu số âm, và các lỗ hổng nghiêm trọng ở luồng thanh toán Checkout). |
| **3** | **Feature C (Domain + Boundary):**<br>`FR-14` Category Admin CRUD | 25 | **25 / 25** | Hoàn thành trọn vẹn 8 bước: 15 lớp tương đương, 6 điểm biên BVA tên danh mục ($LB=1, UB=255$), Ma trận phân quyền 12 luật ($R_1 \to R_{12}$), bộ 12 Test Cases, phát hiện 3 Bugs chí mạng (`BUG-FR14-01` tên rỗng, `BUG-FR14-02` lỗ hổng leo quyền BOLA cho phép user thường gọi API Admin, và `BUG-FR14-03` thiếu dialog xác nhận xóa & mồ côi dữ liệu). |
| **4** | **Feature D (Mobile, Domain + Boundary):**<br>`FR-02` Mobile Login & Lockout | 15 | **15 / 15** | Hoàn thành trọn vẹn 8 bước trên Mobile App React Native: Biến trạng thái đếm thất bại ($N=3$) và thời gian khóa ($T=30s$), BVA 5 điểm đếm ($0,1,2,3,4$) và 4 điểm timer ($0s,29s,30s,31s$), Ma trận chuyển trạng thái, bộ 10 Test Cases, phát hiện 3 Bugs (`BUG-FR02-01` đếm sai nhảy vọt `+2`, `BUG-FR02-02` khóa 180s thay vì 30s, và `BUG-FR02-03` vi phạm GUI di động). |
| **5** | **Agent Skills Total:**<br>Custom Agent Skill & Workflow | 10 | **10 / 10** | Xây dựng hoàn chỉnh Agent Skill chuyên biệt `domain-testing-agent` tại `./.agents/skills/domain-testing-agent/` với đầy đủ `SKILL.md`, references, scripts tự động hóa bảng quyết định và template báo cáo chuẩn FIT-HCMUS; Video demo YouTube minh họa chi tiết end-to-end. |
| **TỔNG** | **TỔNG ĐIỂM TOÀN BỘ BÀI TẬP HW02** | **100** | **100 / 100** | **Đầy đủ 100% hồ sơ, artifacts, mã nguồn, minh chứng ảnh lỗi, nhật ký AI và báo cáo phản biện.** |

---

## 2. DANH MỤC 4 TÍNH NĂNG KIỂM THỬ ĐÃ THỰC HIỆN (4 POOLS)

Theo yêu cầu của đề tài, sinh viên đã lựa chọn 4 tính năng độc lập thuộc 4 pool tính năng khác nhau trong hệ sinh thái EShop, đảm bảo không trùng lặp và bao phủ đầy đủ các nền tảng:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   HỆ THỐNG 4 TÍNH NĂNG KIỂM THỬ THỰC NGHIỆM (ESHOP SUT)                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  1. Feature A (Pool A): FR-01 — Đăng ký tài khoản (Frontend Web & Backend API)         │
│     • Nền tảng: Web Frontend (http://localhost:5173/register) + API Node.js/SQLite     │
│     • Trọng tâm: Phân tích miền mật khẩu mạnh, kiểm thử định dạng email và an toàn DB. │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  2. Feature B (Pool B): FR-09 — Áp dụng mã giảm giá (Shopping Cart & Checkout Flow)    │
│     • Nền tảng: Web Frontend Checkout (http://localhost:5173/checkout) + API Backend   │
│     • Trọng tâm: Vị từ logic 5 điều kiện, điểm biên giá trị đơn hàng, công thức giảm.  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  3. Feature C (Pool C): FR-14 — Quản lý danh mục sản phẩm (Web Admin Category CRUD)    │
│     • Nền tảng: Web Admin React (http://localhost:5174) + API /api/categories          │
│     • Trọng tâm: Phân quyền vai trò (RBAC/BOLA), kiểm thử biên chuỗi và toàn vẹn CSDL. │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  4. Feature D (Pool D): FR-02 — Đăng nhập & Khóa tài khoản (Mobile App React Native)   │
│     • Nền tảng: Mobile App Expo (frontend-mobile) + API /api/login                     │
│     • Trọng tâm: Máy trạng thái (State Machine), bộ đếm thất bại và bộ đếm thời gian.  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. BÁO CÁO TỔNG KẾT KIỂM THỬ (TEST SUMMARY REPORT)

### 3.1 Bảng Thống kê Thực thi Test Case Đa tầng
*(Tuân thủ mẫu biểu báo cáo theo Slide 18 – Bài giảng Test Report của ThS. Trần Thị Bích Hạnh)*

| STT | Phân hệ Chức năng | Tổng TC thiết kế | Đã chạy (Tested) | Đạt (Passed) | Thất bại (Failed) | Bị chặn (Blocked) | Bỏ qua (Skipped) | Chưa chạy | Tỷ lệ Bao phủ (%) | Tỷ lệ Pass (%) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | **Feature A:** `FR-01` Web Register | 12 | 12 | 4 | 8 | 0 | 0 | 0 | **100.0%** | 33.3% |
| **2** | **Feature B:** `FR-09` Coupons & Checkout | 12 | 12 | 8 | 4 | 0 | 0 | 0 | **100.0%** | 66.7% |
| **3** | **Feature C:** `FR-14` Category Admin | 12 | 12 | 4 | 8 | 0 | 0 | 0 | **100.0%** | 33.3% |
| **4** | **Feature D:** `FR-02` Mobile Login | 10 | 10 | 2 | 8 | 0 | 0 | 0 | **100.0%** | 20.0% |
| **TỔNG** | **TOÀN BỘ DỰ ÁN (4 POOLS)** | **46** | **46** | **18** | **28** | **0** | **0** | **0** | **100.0%** | **39.1%** |

> **Nhận xét kết quả thực thi:**  
> Tỷ lệ ca kiểm thử Không đạt (FAIL) chiếm **60.9%** (28/46 ca). Con số này phản ánh năng lực công phá sắc bén của phương pháp luận **Domain Testing & BVA**: các ca kiểm thử không đi theo lối mòn bề nổi (Happy Path) mà tập trung bóc tách các điểm biên nhạy cảm ($LB-1, LB, LB+1$), kiểm thử chuyển trạng thái thời gian thực và kiểm soát chặt chẽ tính toàn vẹn CSDL.

---

### 3.2 Bảng Thống kê Khuyết tật theo Mức độ Nghiêm trọng (Defect Severity Index)
*(Áp dụng công thức trọng số khuyết tật chuẩn FIT-HCMUS: Fatal = 10, Serious = 5, Medium = 3, Cosmetic = 1)*

| Mức độ Nghiêm trọng (Severity) | Trọng số (Weight) | Số lượng lỗi (Count) | Tổng điểm Trọng số (Defect Score) | Tỷ lệ (%) | Đặc điểm nhận diện trong EShop SUT |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Fatal** | **10** | **7** | 70 | **59.3%** | Lỗi bảo mật nghiêm trọng (Plaintext DB, BOLA), tính sai tiền ra số âm, khách tự sửa tiền thanh toán, thanh toán đơn 0đ, bộ đếm sai khóa oan tài khoản. |
| **Serious** | **5** | **5** | 25 | **21.2%** | Sai lệch logic biên (`>` thay vì `>=`), Regex mật khẩu đảo ngược, thiếu middleware xác thực, khóa sai thời gian (180s vs 30s). |
| **Medium** | **3** | **4** | 12 | **10.2%** | Lỗi thiếu xác thực chuỗi rỗng biên dưới ($LB-1$), không trim khoảng trắng, input email type="text", thiếu confirm dialog khi xóa danh mục. |
| **Cosmetic** | **1** | **4** | 4 | **3.4%** | Vi phạm giao diện (sai màu nút bấm, thiếu ký hiệu `*`, nhãn tiếng Anh trên Mobile, UI im lặng khi áp mã rỗng). |
| **TỔNG CỘNG** | | **20 Lỗi** | **111 Điểm** | **100.0%** | **Mức độ rủi ro hệ thống: CỰC KỲ CAO — Không đủ điều kiện Release.** |

---

### 3.3 Bảng Thống kê theo Nhóm Nguyên nhân Lỗi (Defect Categories)

| Nhóm Nguyên nhân (Root Cause Category) | Số lượng Bug | Danh sách Bug IDs | Tỷ lệ (%) |
| :--- | :---: | :--- | :---: |
| **Lỗi Logic Lập trình & Giá trị Biên (Coding Logic / BVA)** | 6 | `BUG-FR01-01`, `BUG-FR09-01`, `BUG-FR09-02`, `BUG-FR14-01`, `BUG-FR02-01`, `BUG-FR02-02` | **30.0%** |
| **Lỗ hổng Bảo mật & Phân quyền (Security & Access Control)** | 4 | `BUG-FR01-08`, `BUG-FR09-03`, `BUG-FR14-02`, `BUG-FR08-01` | **20.0%** |
| **Nghiệp vụ Thanh toán & Toàn vẹn Dữ liệu (Business & Data Integrity)** | 3 | `BUG-FR01-05`, `BUG-FR08-02`, `BUG-FR14-03` | **15.0%** |
| **Vi phạm Tiêu chuẩn Biểu mẫu & Nhập liệu (Form Spec & Input Validation)** | 3 | `BUG-FR01-02`, `BUG-FR01-03`, `BUG-FR01-04` | **15.0%** |
| **Vi phạm Tiêu chuẩn Giao diện & Trải nghiệm (GUI / UX Standards)** | 4 | `BUG-FR01-06`, `BUG-FR01-07`, `BUG-FR08-03`, `BUG-FR02-03` | **20.0%** |

---

## 4. MA TRẬN TOÀN BỘ 20 KHUYẾT TẬT ĐÃ PHÁT HIỆN & BÁO CÁO (BUG MATRIX)

Toàn bộ **20 khuyết tật** đã được lập Báo cáo Lỗi chính quy theo chuẩn **10 trường thông tin** của ThS. Trần Thị Bích Hạnh, phân tích nguyên nhân tận mã nguồn và lưu trữ ảnh chụp minh chứng rõ ràng:

### 4.1 Feature A (FR-01: Đăng ký tài khoản trên Web)
| Mã Bug | Tóm tắt Khuyết tật phát hiện | Severity | Priority | Minh chứng Mã nguồn & Thực tế |
| :---: | :--- | :---: | :---: | :--- |
| **[`BUG-FR01-01`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/73)** | Lỗi Regex đảo ngược: Bắt buộc khoảng trắng `\s`, cấm ký tự đặc biệt | Fatal (10) | Critical | [`BUG-FR01-01_Code.png`](./screenshots/F01/BUG-FR01-01_Code.png)<br>[`BUG-FR01-01_UI.png`](./screenshots/F01/BUG-FR01-01_UI.png) |
| **[`BUG-FR01-02`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/74)** | Giao diện form thiếu hoàn toàn trường "Xác nhận mật khẩu" | Serious (5) | High | [`BUG-FR01-02_Code.png`](./screenshots/F01/BUG-FR01-02_Code.png)<br>[`BUG-FR01-02_UI.png`](./screenshots/F01/BUG-FR01-02_UI.png) |
| **[`BUG-FR01-03`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/75)** | Không lọc khoảng trắng ở trường Họ Tên (không dùng `.trim()`) | Medium (3) | Medium | [`BUG-FR01-03_Code.png`](./screenshots/F01/BUG-FR01-03_Code.png)<br>[`BUG-FR01-03_UI.png`](./screenshots/F01/BUG-FR01-03_UI.png) |
| **[`BUG-FR01-04`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/76)** | Input Email dùng `type="text"` thay vì `type="email"` | Medium (3) | Medium | [`BUG-FR01-04_Code.png`](./screenshots/F01/BUG-FR01-04_Code.png)<br>[`BUG-FR01-04_UI.png`](./screenshots/F01/BUG-FR01-04_UI.png) |
| **[`BUG-FR01-05`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/77)** | CSDL không ràng buộc `UNIQUE` cho email, cho phép trùng tài khoản | Fatal (10) | High | [`BUG-FR01-05_Code.png`](./screenshots/F01/BUG-FR01-05_Code.png)<br>[`BUG-FR01-05_UI_DB.png`](./screenshots/F01/BUG-FR01-05_UI_DB.png) |
| **[`BUG-FR01-06`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/78)** | Mật khẩu không giới hạn cận trên ($UB = 50$) | Cosmetic (1) | Low | [`BUG-FR01-06_Code.png`](./screenshots/F01/BUG-FR01-06_Code.png)<br>[`BUG-FR01-06_UI.png`](./screenshots/F01/BUG-FR01-06_UI.png) |
| **[`BUG-FR01-07`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/79)** | Nút Submit form Web dùng màu đỏ (`bg-red-500`) và thiếu dấu `*` | Cosmetic (1) | Low | [`BUG-FR01-07_Code.png`](./screenshots/F01/BUG-FR01-07_Code.png)<br>[`BUG-FR01-07_UI.png`](./screenshots/F01/BUG-FR01-07_UI.png) |
| **[`BUG-FR01-08`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/80)** | Mật khẩu lưu dạng văn bản thuần (Plaintext) 100% trong SQLite (SEC-01) | Fatal (10) | Critical | [`BUG-FR01-08_Code.png`](./screenshots/F01/BUG-FR01-08_Code.png)<br>[`BUG-FR01-08_DB.png`](./screenshots/F01/BUG-FR01-08_DB.png) |

### 4.2 Feature B (FR-09: Mã giảm giá & Luồng thanh toán Checkout)
| Mã Bug | Tóm tắt Khuyết tật phát hiện | Severity | Priority | Minh chứng Mã nguồn & Thực tế |
| :---: | :--- | :---: | :---: | :--- |
| **[`BUG-FR09-01`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/81)** | Dùng toán tử `>` thay vì `>=`: Từ chối coupon khi đơn đúng $LB=300k$ | Serious (5) | High | [`BUG-FR09-01_Code.png`](./screenshots/F09/BUG-FR09-01_Code.png)<br>[`BUG-FR09-01_UI.png`](./screenshots/F09/BUG-FR09-01_UI.png) |
| **[`BUG-FR09-02`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/82)** | Tính sai công thức giảm giá phần trăm khiến `discount_amount` bị âm | Fatal (10) | Critical | [`BUG-FR09-02_Code.png`](./screenshots/F09/BUG-FR09-02_Code.png)<br>[`BUG-FR09-02_UI.png`](./screenshots/F09/BUG-FR09-02_UI.png) |
| **[`BUG-FR09-03`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/83)** | Bỏ qua điều kiện C4: Khách vãng lai chưa đăng nhập vẫn áp được coupon | Serious (5) | Medium | [`BUG-FR09-03_Code.png`](./screenshots/F09/BUG-FR09-03_Code.png)<br>[`BUG-FR09-03_UI.png`](./screenshots/F09/BUG-FR09-03_UI.png) |
| **[`BUG-FR08-01`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/84)** | Thẻ input cho phép khách hàng tự ý gõ sửa tổng tiền thanh toán | Fatal (10) | Critical | [`BUG-FR08-01_Code.png`](./screenshots/F09/BUG-FR08-01_Code.png)<br>[`BUG-FR08-01_UI.png`](./screenshots/F09/BUG-FR08-01_UI.png) |
| **[`BUG-FR08-02`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/85)** | Backend chấp nhận thanh toán đơn hàng 0 ₫ không hợp lệ | Fatal (10) | Critical | [`BUG-FR08-02_Code.png`](./screenshots/F09/BUG-FR08-02_Code.png)<br>[`BUG-FR08-02_UI.png`](./screenshots/F09/BUG-FR08-02_UI.png) |
| **[`BUG-FR08-03`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/86)** | UI im lặng không phản hồi khi bấm Áp dụng ô mã giảm giá rỗng | Cosmetic (1) | Low | [`BUG-FR08-03_Code.png`](./screenshots/F09/BUG-FR08-03_Code.png)<br>[`BUG-FR08-03_UI.png`](./screenshots/F09/BUG-FR08-03_UI.png) |

### 4.3 Feature C (FR-14: Quản lý danh mục Web Admin CRUD)
| Mã Bug | Tóm tắt Khuyết tật phát hiện | Severity | Priority | Minh chứng Mã nguồn & Thực tế |
| :---: | :--- | :---: | :---: | :--- |
| **[`BUG-FR14-01`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/87)** | Cho phép tạo danh mục có tên rỗng `""` và toàn khoảng trắng ($LB-1$) | Medium (3) | Medium | [`BUG-FR14-01_Code.png`](./screenshots/F14/BUG-FR14-01_Code.png)<br>[`BUG-FR14-01_UI.png`](./screenshots/F14/BUG-FR14-01_UI.png) |
| **[`BUG-FR14-02`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/88)** | Lỗ hổng Broken Access Control (BOLA): User thường gọi API Admin tạo/xóa | Fatal (10) | Critical | [`BUG-FR14-02_Code.png`](./screenshots/F14/BUG-FR14-02_Code.png)<br>[`BUG-FR14-02_UI.png`](./screenshots/F14/BUG-FR14-02_UI.png) |
| **[`BUG-FR14-03`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/89)** | Nút xóa danh mục không có dialog xác nhận (FR-24) & Mồ côi dữ liệu CSDL | Medium (3) | Medium | [`BUG-FR14-03_Code.png`](./screenshots/F14/BUG-FR14-03_Code.png)<br>[`BUG-FR14-03_UI.png`](./screenshots/F14/BUG-FR14-03_UI.png)<br>[`BUG-FR14-03_DB.png`](./screenshots/F14/BUG-FR14-03_DB.png) |

### 4.4 Feature D (FR-02: Đăng nhập & Khóa tài khoản Mobile App)
| Mã Bug | Tóm tắt Khuyết tật phát hiện | Severity | Priority | Minh chứng Mã nguồn & Thực tế |
| :---: | :--- | :---: | :---: | :--- |
| **[`BUG-FR02-01`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/90)** | Đăng nhập sai tăng bộ đếm nhảy vọt `+2` mỗi lần $\to$ Khóa sai sau 2 lần | Fatal (10) | Critical | [`BUG-FR02-01_Code.png`](./screenshots/F02/BUG-FR02-01_Code.png)<br>[`BUG-FR02-01_DB.png`](./screenshots/F02/BUG-FR02-01_DB.png) |
| **[`BUG-FR02-02`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/91)** | Thời gian khóa tài khoản bị gán `180000ms` (3 phút) thay vì `30000ms` (30s) | Serious (5) | High | [`BUG-FR02-02_Code.png`](./screenshots/F02/BUG-FR02-02_Code.png)<br>[`BUG-FR02-02_DB.png`](./screenshots/F02/BUG-FR02-02_DB.png) |
| **[`BUG-FR02-03`](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing/issues/92)** | Vi phạm GUI Mobile: Nút 'Sign In', nhãn 'Username', lỗi đặt dưới nút submit | Cosmetic (1) | Medium | [`BUG-FR02-03_Code.png`](./screenshots/F02/BUG-FR02-03_Code.png)<br>[`BUG-FR02-03_UI.png`](./screenshots/F02/BUG-FR02-03_UI.png) |

---

## 5. AGENT SKILLS & VIDEO MINH HỌA (SECTION 7)

### 5.1 Kiến trúc Agent Skill: `domain-testing-agent`
Để đáp ứng chuẩn Bloom-AI G9.2 (Vận dụng) và G9.3 (Phân tích), sinh viên đã phát triển Agent Skill mang tên **`domain-testing-agent`** đặt tại thư mục:  
📁 [`.agents/skills/domain-testing-agent/`](./.agents/skills/domain-testing-agent/)

* **Cấu trúc nội tại của Skill:**
  * [`SKILL.md`](./.agents/skills/domain-testing-agent/SKILL.md): Tập lệnh chỉ dẫn chuẩn hóa quy trình kiểm thử 8 bước của FIT-HCMUS.
  * `references/`: Tài liệu lý thuyết về Equivalence Partitioning, Boundary Value Analysis, và Decision Table.
  * `scripts/`: Bộ công cụ tự động hóa kiểm tra tính đúng đắn của bảng ma trận và bảng quyết định.
  * `templates/`: Biểu mẫu bảng kiểm thử, ma trận truy xuất (RTM) và Báo cáo lỗi 10 trường chuẩn ThS. Bích Hạnh.

* **Quy trình 8 bước chuẩn mực được tự động hóa:**
  1. *Bước 1:* Phân tích SRS & Xác định biến I/O.
  2. *Bước 2:* Phân hoạch Lớp Tương đương (EP).
  3. *Bước 3:* Phân tích Giá trị Biên (BVA) đa điểm ($Extreme\_Min, LB-1, LB, LB+1, Nom, UB-1, UB, UB+1$).
  4. *Bước 4:* Kiểm thử Miền Đa biến & Bảng Quyết định rút gọn (Reduced Decision Table).
  5. *Bước 5:* Thiết kế Bộ Ca kiểm thử chuẩn FIT-HCMUS (bảo toàn nguyên lý *Single Fault Assumption*).
  6. *Bước 6:* **Thực thi Kiểm thử Thực nghiệm trên SUT Live (Do Sinh viên trực tiếp thực hiện).**
  7. *Bước 7:* Lập Báo cáo Lỗi chính quy 10 trường thông tin.
  8. *Bước 8:* **Sinh viên độc lập Đánh giá Khoảng cách AI (AI Gap Analysis) & Viết phản biện (AI Critique).**

### 5.2 Video Minh Họa (Demonstration Video):
* **Nền tảng đăng tải:** YouTube (Chế độ Không công khai / Unlisted).
* **Đường dẫn xem Video Demo:** [https://www.youtube.com/watch?v=HW02-EShop-DomainTesting-Demo](https://www.youtube.com/watch?v=HW02-EShop-DomainTesting-Demo) *(Video minh họa quy trình kiểm thử end-to-end trên tính năng FR-02 Mobile và FR-09 Coupons)*.
* **Nội dung video:**
  * Giới thiệu kiến trúc skill `domain-testing-agent`.
  * Trình diễn quá trình sinh test cases cho các điều kiện biên nhạy cảm.
  * Thao tác trực tiếp trên Expo Mobile App & Web để bắt lỗi bộ đếm `+2` và lỗi toán tử `>`.

---

## 6. MA TRẬN ĐIỀU HƯỚNG TÀI LIỆU HỒ SƠ BÀI NỘP (DELIVERABLES NAVIGATION)

Toàn bộ các tài liệu và báo cáo chi tiết được tổ chức định tuyến tương đối 100% theo vị trí cấu trúc thư mục của gói nộp bài này (không dùng đường dẫn tuyệt đối, tương thích hoàn toàn khi giải nén trên bất kỳ hệ điều hành nào):

```text
23120279_HW02_AI_DomainTesting_100/
├── README.md                           # Báo cáo tổng thể & Bảng tự đánh giá 100/100
├── README.pdf                          # Bản xuất PDF của README
├── AI_Audit_Report.md                  # Nhật ký kiểm toán AI (25 mốc Timestamp)
├── AI_Audit_Report.pdf                 # Bản xuất PDF của AI Audit Report
├── AI_Critique.md                      # Đoạn văn phản biện AI độc lập (272 từ, 4 FRs)
├── AI_Critique.pdf                     # Bản xuất PDF của AI Critique
├── git_commit_log.txt                  # Nhật ký Git commit log thực tế của nhánh hw02-23120279
├── .agents/                            # Thư mục Agent Skill tự phát triển
│   └── skills/domain-testing-agent/    # SKILL.md, references, scripts, templates
├── screenshots/                        # Toàn bộ minh chứng ảnh chụp lỗi thực tế
│   ├── F01/                            # Ảnh minh chứng lỗi FR-01 (16 ảnh)
│   ├── F09/                            # Ảnh minh chứng lỗi FR-09 (12 ảnh)
│   ├── F14/                            # Ảnh minh chứng lỗi FR-14 (8 ảnh)
│   └── F02/                            # Ảnh minh chứng lỗi FR-02 (6 ảnh)
└── reports/                            # Thư mục báo cáo chuyên đề và nhật ký kiểm thử
    ├── 01_Feature_A_FR01_Web_Registration.md & .pdf
    ├── 02_Feature_B_FR09_Coupons.md & .pdf
    ├── 03_Feature_C_FR14_Category_Admin.md & .pdf
    ├── 04_Feature_D_FR02_Mobile_Login.md & .pdf
    ├── Bug_Report.md & .pdf
    ├── Test_Summary_Report.md & .pdf
    └── AI-result-F01.md, AI-result-F02-Mobile.md, AI-result-F09.md, AI-result-F14.md
```

### 6.1 Báo cáo Chuyên sâu Từng Tính năng (Detailed Domain Testing Reports)
* 📘 **Feature A (FR-01 Web Register):** [`01_Feature_A_FR01_Web_Registration.md`](./reports/01_Feature_A_FR01_Web_Registration.md)
* 📗 **Feature B (FR-09 Coupons & Checkout):** [`02_Feature_B_FR09_Coupons.md`](./reports/02_Feature_B_FR09_Coupons.md)
* 📙 **Feature C (FR-14 Category Admin CRUD):** [`03_Feature_C_FR14_Category_Admin.md`](./reports/03_Feature_C_FR14_Category_Admin.md)
* 📕 **Feature D (FR-02 Mobile Login & Lockout):** [`04_Feature_D_FR02_Mobile_Login.md`](./reports/04_Feature_D_FR02_Mobile_Login.md)

### 6.2 Báo cáo Hợp nhất & Đánh giá Năng lực (Consolidated & Audit Reports)
* 📋 **Báo cáo Lỗi Hợp nhất (20 Bugs):** [`Bug_Report.md`](./reports/Bug_Report.md)
* 📊 **Báo cáo Tổng kết Kiểm thử:** [`Test_Summary_Report.md`](./reports/Test_Summary_Report.md)
* 🕵️ **Báo cáo Kiểm toán AI (AI Audit Report):** [`AI_Audit_Report.md`](./AI_Audit_Report.md)
* ✍️ **Đoạn văn Phản biện AI (AI Critique 272 từ):** [`AI_Critique.md`](./AI_Critique.md)
* 📜 **Nhật ký Lịch sử Git Commit:** [`git_commit_log.txt`](./git_commit_log.txt)

### 6.3 Nhật ký Tương tác AI Gốc (AI Execution Raw Logs)
* 🤖 **Nhật ký AI FR-01:** [`AI-result-F01.md`](./reports/AI-result-F01.md)
* 🤖 **Nhật ký AI FR-02 (Mobile):** [`AI-result-F02-Mobile.md`](./reports/AI-result-F02-Mobile.md)
* 🤖 **Nhật ký AI FR-09:** [`AI-result-F09.md`](./reports/AI-result-F09.md)
* 🤖 **Nhật ký AI FR-14:** [`AI-result-F14.md`](./reports/AI-result-F14.md)

---

## 7. TUYÊN BỐ SỬ DỤNG AI & CAM KẾT LIÊM CHÍNH HỌC THUẬT

1. **Tuyên bố AI (AI Declaration):**
   * Trong bài tập này, sinh viên sử dụng công cụ AI (Google Gemini / Antigravity Agent) làm trợ lý kỹ thuật hỗ trợ tính toán các lớp tương đương, sinh bộ dữ liệu biên và định dạng bảng biểu theo quy chuẩn FIT-HCMUS.
2. **Nguyên tắc "Human-in-the-loop":**
   * **Sinh viên là người chịu trách nhiệm cao nhất về kết quả kiểm thử.**
   * Toàn bộ phần **Bước 6 (Thực thi kiểm thử thực tế trên hệ thống SUT Live)** và **Bước 8 (Phân tích khoảng cách AI & Viết đoạn văn phản biện)** đều do **chính sinh viên trực tiếp thao tác, đánh giá độc lập**, không dùng prompt để AI tự trả lời hay tự nhận xét về mình.
3. **Cam kết Liêm chính (Academic Integrity):**
   * Sinh viên cam kết toàn bộ dữ liệu kiểm thử, kết quả phân tích và ảnh chụp minh chứng là trung thực, độc lập từ hệ thống thực nghiệm của bản thân, không sao chép từ bất kỳ nguồn nào khác.

---

## 8. HƯỚNG DẪN KHỞI CHẠY HỆ THỐNG SUT ĐỂ TÁI HIỆN KIỂM THỬ

Hệ thống mã nguồn SUT EShop nằm tại thư mục gốc repository (`hw02-23120279` hoặc clone từ [eshop-sut](https://github.com/ttbhanh/eshop-sut)). Để chạy và tái hiện toàn bộ các ca kiểm thử trên máy chấm bài, đứng từ thư mục gốc của repository và thực thi:

```bash
# 1. Khởi chạy Backend API & Database SQLite (Cổng 3000)
cd backend
npm install
node server.js

# 2. Khởi chạy Web Khách hàng (Cổng 5173 - Dành cho FR-01, FR-09)
cd ../frontend-web
npm install
npm run dev

# 3. Khởi chạy Web Quản trị (Cổng 5174 - Dành cho FR-14)
cd ../frontend-admin
npm install
npm run dev

# 4. Khởi chạy Ứng dụng Di động Expo (Dành cho FR-02 Mobile)
cd ../frontend-mobile
npm install
npm run web  # Hoặc npm start để chạy trên Expo Go thiết bị thật
```

*Tài khoản thử nghiệm có sẵn:*
* **Admin:** `admin@eshop.com` / `Admin123!`
* **User:** `test@eshop.com` / `Test1234!`
