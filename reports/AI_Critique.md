# AI Critique (Phản biện & Đánh giá Năng lực AI)

**Số từ:** 272 từ  
**Tiêu chuẩn quy định:** 200 – 300 từ (Mục 10, Đề cương HW02 – FIT-HCMUS)  
**Phạm vi đánh giá:** 4 tính năng SUT thực tế (`FR-01`, `FR-09`, `FR-14`, `FR-02 Mobile`)

---

Trong quá trình kiểm thử hệ thống EShop, AI đã bộc lộ những sai sót mang tính hệ thống trên cả 4 tính năng. Tại chức năng Đăng ký (FR-01), do thiên vị xác nhận (confirmation bias), AI tin tưởng tuyệt đối vào tài liệu đặc tả nên bỏ lọt lỗi Regex đảo ngược `(?=.*\s)` bắt buộc khoảng trắng và CSDL lưu mật khẩu dạng plaintext. Ở chức năng Giảm giá (FR-09), AI bỏ qua điểm biên $LB = 300,000$ ₫, làm lọt lỗi toán tử `>` từ chối đơn hàng hợp lệ và không nhận diện được ô input cho sửa tổng tiền trên UI. Đối với Quản lý danh mục (FR-14), AI chỉ tập trung luồng CRUD thông thường mà bỏ qua lỗ hổng kiểm soát truy cập (BOLA) cho phép User thường gọi API Admin xóa danh mục. Trên Mobile App (FR-02), AI thiếu cảm nhận trạng thái thực tế, bỏ lọt lỗi bộ đếm sai nhảy vọt `+2` khiến tài khoản bị khóa oan sau 2 lần thử, cùng thời gian khóa bị kéo dài 180 giây thay vì 30 giây.

Nguyên nhân chính là AI mang bản chất phi trạng thái (stateless), tư duy theo kịch bản lý tưởng và không thể tự quan sát giao diện hay CSDL nếu thiếu con người dẫn dắt.

Bài học cốt lõi rút ra: **AI chỉ là công cụ hỗ trợ tăng tốc, con người bắt buộc phải là trung tâm kiểm soát (Human-in-the-loop).** Kiểm thử viên cần giữ tư duy hoài nghi và nắm chắc kỹ thuật kiểm thử miền để thẩm định, phản biện kết quả từ AI.
