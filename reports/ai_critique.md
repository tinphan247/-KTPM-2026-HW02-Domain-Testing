# BÁO CÁO PHÊ BÌNH & ĐÁNH GIÁ NĂNG LỰC AI (AI CRITIQUE REPORT)

> **Môn học**: Kiểm thử phần mềm (Software Testing)  
> **Sinh viên thực hiện**: Trần Vũ Quang  
> **MSSV**: 23120346  
> **Repository GitHub**: [https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing](https://github.com/tinphan247/-KTPM-2026-HW02-Domain-Testing)  
> **Branch**: `hw02-23120346`  
> **Dung lượng**: ~255 từ (Đạt chuẩn 200–300 từ theo quy định đề bài)

---

### Đoạn văn Phê bình & Rút ra Bài học (200–300 words)

Đồng hành cùng AI (Antigravity LLM) trong bài tập HW02, tôi nhận thấy AI rất mạnh trong việc tổng hợp lý thuyết, lập ma trận phân hoạch tương đương (EP) và xác định các điểm biên (On, Off, In-bound) một cách nhanh chóng, bài bản. Tuy nhiên, AI bộc lộ những sai lệch và điểm mù nghiêm trọng:

1. **AI sai lệch và thiếu ở đâu?** AI có thiên kiến mặc định hệ thống luôn tuân thủ đặc tả (Compliance Bias). AI sinh test case theo kịch bản lý tưởng và bỏ sót hoàn toàn các lỗi thực tế: thiếu ô Xác nhận mật khẩu trên UI, bẫy bắt buộc Double-click mới thêm được giỏ hàng (`ProductDetail.jsx:22`), lỗi ghi đè tên hàng loạt sản phẩm (`App.jsx:110`), và lỗi trình duyệt tự động điền nhầm email vào ô OTP.
2. **Tại sao AI không phát hiện ra?** AI chỉ phân tích tĩnh trên văn bản đặc tả, hoàn toàn thiếu cảm nhận xúc giác (Tactile Interaction) và không thể thao tác chuột hay trải nghiệm như người dùng thật. AI headless cũng không lường trước được cơ chế Autofill của trình duyệt hay những bẫy logic mà lập trình viên cài cắm trong mã nguồn.
3. **Bài học rút ra:** AI là công cụ sinh khung kiểm thử rất tốt, nhưng **Human-in-the-loop (con người can thiệp)** là yếu tố không thể thay thế. Tester phải luôn giữ tư duy phản biện, trực tiếp kiểm thử trên ứng dụng thực tế và cung cấp ngữ cảnh mã nguồn sâu sắc để khắc phục điểm mù của AI.
