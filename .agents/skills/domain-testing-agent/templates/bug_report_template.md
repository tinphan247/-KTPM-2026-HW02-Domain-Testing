# Bug Report Template (Chuẩn FIT-HCMUS)

Mỗi lỗi phát hiện được cần được ghi chép theo cấu trúc 10 thành phần chuẩn như sau:

---

### [BUG-ID]: [Tóm tắt ngắn gọn lỗi - Problem Summary]

- **Function Name:** [Tên chức năng, ví dụ: FR-01 Account Registration]
- **Reported By:** [Họ và tên / MSSV]
- **Date:** [YYYY-MM-DD]
- **Assign To:** Developer Team
- **Status:** `New`
- **Priority:** `Critical` | `High` | `Medium` | `Low`
- **Severity:** `Fatal (Weight: 10)` | `Serious (Weight: 5)` | `Medium (Weight: 3)` | `Cosmetic (Weight: 1)`

#### 1. Mô tả chi tiết (Description / Problem Summary)
- **Mục tiêu kiểm thử:** [Mô tả ca test đang chạy]
- **Hành vi thực tế (Actual Behavior):** [Hệ thống đang hoạt động sai như thế nào]
- **Hành vi kỳ vọng (Expected Behavior):** [Theo đặc tả SRS, hệ thống phải phản hồi như thế nào]

#### 2. Môi trường kiểm thử (Environment)
- **Hệ điều hành:** Windows 11
- **Trình duyệt / Thiết bị:** Google Chrome Version 120+ / Web Browser
- **URL / Component:** `http://localhost:5173/register`
- **Tài khoản thử nghiệm:** Guest / Test user

#### 3. Các bước tái hiện lỗi (Steps to Reproduce)
1. Truy cập vào trang web `http://localhost:5173/register`.
2. Nhập các thông tin hợp lệ ngoại trừ trường mật khẩu.
3. Nhập mật khẩu: `Abc@123` (7 ký tự - vi phạm biên dưới $LB-1$).
4. Nhấn nút "Đăng ký".

#### 4. Bằng chứng kiểm thử (Evidence / Screenshots)
- *Đính kèm ảnh chụp màn hình thực tế (Chụp rõ input, thông báo trên UI hoặc Network tab):*
`![Screenshot lỗi](path/to/screenshot.png)`
- *Link GitHub Issue đã tạo:* [Link Issue #...](https://github.com/...)
