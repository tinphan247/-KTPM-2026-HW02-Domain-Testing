# HW02 – Domain Testing & Boundary Value Analysis on EShop

> **Môn học**: Kiểm thử phần mềm (Software Testing)  
> **Sinh viên thực hiện**: 23120346  
> **Repository GitHub**: [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing)  
> **Nhánh làm việc cá nhân**: `hw02-23120346`  
> **Hệ thống kiểm thử (SUT)**: EShop E-Commerce System (Web Store, Admin Portal, Backend REST API, React Native Mobile App)

---

## 🎯 Bảng Tự Đánh Giá Điểm (Self-Assessment Table)

| Thành Phần Đánh Giá | Mô Tả Thực Hiện | Điểm Tối Đa | Tự Chấm |
| :--- | :--- | :---: | :---: |
| **Feature A (Pool A: FR-03)** | Quên & Đặt lại mật khẩu (Domain Testing + BVA + 8 Bugs + 8 GitHub Issues) | 25 | **25 / 25** |
| **Feature B (Pool B: FR-07)** | Giỏ hàng (Domain Testing + BVA + Phát hiện bẫy Double-Click + 2 Issues) | 25 | **25 / 25** |
| **Feature C (Pool C: FR-15)** | Quản lý Sản phẩm Admin (Domain Testing + BVA + Script mở rộng + 8 Issues) | 25 | **25 / 25** |
| **Feature D (Pool D: FR-04)** | Mobile Hồ sơ cá nhân (Nâng cấp Expo SDK 57 + Test iPhone thật + 3 Issues) | 15 | **15 / 15** |
| **Agent Skills & AI Analysis** | 3 Agent Skills + AI Critique (280 từ) + AI Audit Log + AI Gap Analysis | 10 | **10 / 10** |
| **TỔNG CỘNG** | **Đầy đủ 100% yêu cầu đề bài, minh chứng UI/API sắc nét trên GitHub** | **100** | **100 / 100** |

---

## 📊 Báo Cáo Tổng Kết Kiểm Thử (Test Summary Report)

* **Tổng số ca kiểm thử thiết kế (Designed Test Cases)**: **47 Test Cases**
  * FR-03: 14 Domain Test Cases + 7 BVA Test Cases = 21 TCs
  * FR-07: 5 Domain Test Cases + 4 BVA Test Cases = 9 TCs
  * FR-15: 5 Domain Test Cases + 7 BVA Test Cases = 12 TCs
  * FR-04 Mobile: 7 Domain Test Cases + 5 BVA Test Cases = 12 TCs
* **Tỷ lệ thực thi (Execution Rate)**: **47 / 47 (100%)**
* **Tổng số Bug tìm được và xác thực (Discovered Bugs)**: **21 Bugs**
* **Tổng số GitHub Issues đã tạo (Live Issues)**: **21 Issues** (từ `#39` đến `#59`) kèm ảnh chụp UI thực tế và code/API evidence.

---

## 📁 Cấu Trúc Hồ Sơ Báo Cáo & Tài Liệu Nộp Bài

```
-KTPM-2026-HW02-Domain-Testing/
├── .agents/skills/                    # Bộ Agent Skills theo chuẩn ISTQB
│   ├── domain-bva-tester/SKILL.md     # Kỹ năng phân tích biến, EP, BVA
│   ├── ai-audit-logger/SKILL.md       # Kỹ năng ghi nhật ký tương tác AI
│   └── bug-reporter/SKILL.md          # Kỹ năng định dạng báo cáo lỗi
├── reports/                           # Toàn bộ tài liệu báo cáo chính thức
│   ├── main_report.md                 # Báo cáo Domain Testing & BVA cho 4 Features
│   ├── bug_report.md                  # Danh mục 21 Bugs kèm hình ảnh & link Issue
│   ├── ai_gap_analysis.md             # Phân tích khoảng trống giữa AI và Con Người
│   ├── ai_critique.md                 # Đoạn văn phê bình năng lực AI (200-300 từ)
│   └── ai_audit_report.md             # Nhật ký 5 tương tác AI theo chuẩn phụ lục
├── screenshots/                       # Kho lưu trữ 32 hình ảnh bằng chứng UI, API, DB
├── scripts/                           # Bộ scripts tự động hóa kiểm thử & đồng bộ GitHub
│   ├── exec_fr03_tests.js             # Chạy kiểm thử tự động FR-03
│   ├── exec_fr07_cart_tests.js        # Chạy kiểm thử tự động FR-07
│   ├── exec_fr15_extended_tests.js    # Chạy kiểm thử biên mở rộng FR-15
│   ├── exec_fr04_mobile_profile_tests.js # Chạy kiểm thử tự động FR-04
│   └── update_all_github_issues_images.js # Tự động cập nhật hình ảnh lên GitHub
└── README.md                          # Tài liệu tổng quan dự án
```

---

## 🔗 Liên Kết Nhanh Đến Các Báo Cáo Chi Tiết

1. 📘 **[Báo Cáo Chính: Domain Testing & BVA](reports/main_report.md)**: Trình bày bài bản 4 bước chuẩn mực từ nhận diện biến, bảng phân hoạch tương đương ($EP_V, EP_I$), bảng ma trận ca kiểm thử đến phân tích biên 3-value ($LB-1, LB, UB, UB+1$).
2. 🐞 **[Báo Cáo Danh Mục Lỗi (Bug Report)](reports/bug_report.md)**: Chi tiết 21 lỗi được định dạng theo chuẩn IEEE/ISTQB (Preconditions, Steps to reproduce, Expected, Actual, Evidence) kèm link trỏ trực tiếp đến từng GitHub Issue.
3. 🧠 **[Phân Tích Khoảng Trống Của AI (AI Gap Analysis)](reports/ai_gap_analysis.md)**: So sánh đối chiếu tại sao AI bỏ sót bẫy *Double-click* ở giỏ hàng, lỗi *Regex cấm số 0 ở đầu* trên Mobile, và sự cố *Autofill Misdirection*.
4. ✍️ **[Phê Bình Năng Lực AI (AI Critique Report)](reports/ai_critique.md)**: Đoạn văn 280 từ trả lời nghiêm túc 3 câu hỏi cốt lõi về bản chất của AI trong kiểm thử phần mềm.
5. 📜 **[Nhật Ký Tương Tác AI (AI Audit Report)](reports/ai_audit_report.md)**: Phụ lục minh bạch ghi lại toàn bộ 5 phiên làm việc giữa sinh viên và trợ lý AI Antigravity.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường EShop SUT

### 1. Khởi động Backend API (Port 3000):
```powershell
cd eshop-sut/backend
npm install
node server.js
```

### 2. Khởi động Giao diện Web Khách hàng (Port 5173):
```powershell
cd eshop-sut/frontend-web
npm install
npm run dev
```

### 3. Khởi động Giao diện Web Admin (Port 5174):
```powershell
cd eshop-sut/frontend-admin
npm install
npm run dev
```

### 4. Khởi động Ứng dụng Mobile React Native (Expo SDK 57):
```powershell
cd eshop-sut/frontend-mobile
npm install
npx expo start --tunnel
```
Quét mã QR bằng ứng dụng **Expo Go** trên iOS/Android để trải nghiệm trực tiếp tính năng Hồ sơ cá nhân.

---

## 🎥 Video Hướng Dẫn & Demo Agent Skill
* **Link YouTube (Unlisted)**: [https://youtu.be/xnSp0y-6iDs](https://youtu.be/xnSp0y-6iDs)
* **Nội dung video**: Giới thiệu Agent Skill `domain-bva-tester`, minh họa quy trình sinh test case, phát hiện lỗi và đối chiếu với thực tế SUT.
