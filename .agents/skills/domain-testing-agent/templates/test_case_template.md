# Test Case Templates (Chuẩn FIT-HCMUS)

## 1. Bảng Phân hoạch Tương đương (Equivalence Classes Table)

| STT | Input / Output | Equivalence Classes (Lớp tương đương) | Phân loại (Valid / Invalid) |
| :---: | :--- | :--- | :---: |
| EC1 | Biến X | Miền giá trị hợp lệ 1 | Valid |
| EC2 | Biến X | Miền giá trị không hợp lệ 1 | Invalid |
| EC3 | Biến X | Miền giá trị không hợp lệ 2 | Invalid |
| EC4 | Output | Kết quả thành công tương ứng | Valid |
| EC5 | Output | Thông báo lỗi tương ứng | Invalid |

---

## 2. Bảng Phân tích Giá trị Biên (Boundary Value Analysis Table)

| STT | Biến số | Vùng giá trị (Partition) | Điểm biên | Giá trị kiểm thử (Input) | Dự kiến (Expected Output) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| BV1 | Biến X | $LB - 1$ | Dưới biên dưới | $LB - 1$ | Invalid / Báo lỗi |
| BV2 | Biến X | $LB$ | Tại biên dưới | $LB$ | Valid / Thành công |
| BV3 | Biến X | $LB + 1$ | Ngay trên biên dưới | $LB + 1$ | Valid / Thành công |
| BV4 | Biến X | $Nom$ | Giá trị danh định | Nằm giữa LB & UB | Valid / Thành công |
| BV5 | Biến X | $UB - 1$ | Ngay dưới biên trên | $UB - 1$ | Valid / Thành công |
| BV6 | Biến X | $UB$ | Tại biên trên | $UB$ | Valid / Thành công |
| BV7 | Biến X | $UB + 1$ | Vượt quá biên trên | $UB + 1$ | Invalid / Báo lỗi |

---

## 3. Bảng Đặc tả Test Case Hoàn chỉnh (Standard Test Cases Table)

| #TC | Tên / Mục tiêu kiểm thử | Lớp tương đương / Điểm biên bao phủ | Dữ liệu đầu vào (Test Data) | Điều kiện tiên quyết (Preconditions) | Các bước thực hiện (Steps) | Kết quả mong đợi (Expected Result) | Kết quả thực tế (Actual Result) | Trạng thái (Pass/Fail) |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| TC01 | Kiểm tra đăng ký với mật khẩu hợp lệ tối thiểu | EC1, EC5, BV2 | Email: a@b.com, Pass: Abc@1234 | Người dùng đang ở trang /register | 1. Nhập họ tên<br>2. Nhập email<br>3. Nhập pass<br>4. Nhấn Đăng ký | Đăng ký thành công, chuyển hướng về Login | Chuyển hướng đúng về Login | PASS |
| TC02 | Kiểm tra đăng ký với mật khẩu thiếu 1 ký tự | EC2, BV1 | Email: a@b.com, Pass: Abc@123 | Người dùng đang ở trang /register | 1. Nhập pass 7 ký tự<br>2. Nhấn Đăng ký | Hiển thị lỗi "Mật khẩu tối thiểu 8 ký tự" | Không báo lỗi, đăng ký thành công | FAIL |
