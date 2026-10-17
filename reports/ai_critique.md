# BÁO CÁO PHÊ BÌNH & ĐÁNH GIÁ NĂNG LỰC AI (AI CRITIQUE REPORT)

> **Môn học**: Kiểm thử phần mềm (Software Testing)  
> **Sinh viên thực hiện**: 23120346  
> **Đề tài**: HW02 – Domain Testing & Boundary Value Analysis on EShop  
> **Dung lượng**: ~280 từ (Đạt chuẩn 200–300 từ theo quy định đề bài)

---

### Đoạn văn Phê bình & Rút ra Bài học (200–300 words)

Trong quá trình đồng hành cùng trợ lý AI (Antigravity LLM) thực hiện bài tập HW02, tôi nhận thấy AI thể hiện sức mạnh vượt trội ở khả năng tổng hợp lý thuyết, sinh ma trận phân hoạch tương đương ($EP_V, EP_I$) và xác định các điểm biên (On-point, Off-point, In-bound) rất nhanh chóng và bài bản. Tuy nhiên, AI bộc lộ những sai lệch và thiếu sót mang tính bản chất:

1. **AI sai lệch và thiếu ở đâu?** AI có thiên lệch mặc định rằng hệ thống luôn tuân thủ đặc tả (Compliance Bias). AI thiết kế test case theo "kịch bản lý tưởng" mà bỏ sót các lỗi thực tế nghiêm trọng như: thiếu hoàn toàn ô *Xác nhận mật khẩu* trên UI, lỗi bẫy bắt buộc *Double-click* mới thêm được sản phẩm vào giỏ hàng (`ProductDetail.jsx:22`), lỗi *Mass UI Overwrite* đổi tên hàng loạt sản phẩm khi sửa (`App.jsx:110`), và sự cố trình duyệt tự động điền nhầm tài khoản vào ô OTP do thiếu `autocomplete="off"`.
2. **Tại sao AI không phát hiện ra?** AI chỉ phân tích tĩnh trên văn bản đặc tả, hoàn toàn thiếu cảm nhận tương tác thực tế (Tactile Interaction) và không thể tự mình "cầm chuột nhấp" hay trải nghiệm ứng dụng như một người dùng thật. Ngoài ra, AI dạng headless không thể lường trước các cơ chế tự động điền của trình duyệt và những bẫy logic do lập trình viên cố tình cài cắm.
3. **Bài học rút ra khi phối hợp cùng AI:** AI là một công cụ hỗ trợ tuyệt vời để xây dựng khung kiểm thử (Boilerplate) và rà soát các trường hợp biên toán học; nhưng **Human-in-the-loop (Con người can thiệp)** là yếu tố sống còn không thể thay thế. Người kiểm thử phải luôn giữ tư duy phản biện (Critical Thinking), trực tiếp trải nghiệm phần mềm trên môi trường thực tế, và liên tục cung cấp ngữ cảnh mã nguồn sâu hơn để bù đắp các khoảng trống của AI.
