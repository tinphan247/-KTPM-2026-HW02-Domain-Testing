/**
 * Auto-create GitHub Issues for FR-07, FR-15, and FR-04 Mobile
 * Target Repo: tinphan247/-KTPM-2026-HW02-Domain-Testing
 * Branch: hw02-23120346
 * Author: 23120346
 */

const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'tinphan247';
const REPO_NAME = '-KTPM-2026-HW02-Domain-Testing';
const BRANCH = 'hw02-23120346';
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/screenshots`;

const TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;

const BUGS = [
  // ==================== FR-07 GIỎ HÀNG ====================
  {
    id: 'BUG-FR07-02',
    title: '[BUG-FR07-02] Thêm cùng một sản phẩm vào giỏ bị nhân bản dòng mới thay vì cộng dồn số lượng',
    severity: 'High',
    labels: ['bug', 'FR-07', 'severity:high', 'frontend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu ở FR-07 (Giỏ hàng):
> *"Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới."*

Tuy nhiên trong mã nguồn \`frontend-web/src/context/CartContext.jsx\` dòng 9:
\`\`\`javascript
const addToCart = (product, quantity) => {
  setCart([...cart, { ...product, quantity }]);
};
\`\`\`
Hàm \`addToCart\` luôn tạo một phần tử mới và thêm vào mảng \`cart\`, hoàn toàn không kiểm tra xem sản phẩm (\`product.id\`) đã tồn tại trong giỏ hay chưa để cộng dồn số lượng.

### Các bước tái hiện (Steps to Reproduce)
1. Truy cập \`http://localhost:5173/\`
2. Chọn sản phẩm **iPhone 15 Pro Max**, nhấn **Thêm vào giỏ hàng** (số lượng 1)
3. Tiếp tục nhấn **Thêm vào giỏ hàng** lần thứ 2 với cùng sản phẩm đó
4. Truy cập vào trang Giỏ hàng (\`http://localhost:5173/cart\`)

### Kết quả thực tế (Actual Result)
Giỏ hàng hiển thị **2 dòng riêng biệt** cho cùng sản phẩm iPhone 15 Pro Max (mỗi dòng số lượng 1).

### Kết quả mong đợi (Expected Result)
Hệ thống không được tạo dòng mới mà phải gộp vào dòng có sẵn và tăng số lượng lên thành **2**.

### Bằng chứng thực tế (Evidence)
**1. Ảnh chụp giao diện thực tế (UI):**
![UI Evidence](${RAW_BASE}/FR07_BUG02_DUPLICATE_PRODUCT_ROWS.png)

**2. Ảnh trích xuất mã nguồn lỗi (Code):**
![Code Evidence](${RAW_BASE}/FR07_BUG02_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR07-03',
    title: '[BUG-FR07-03] Nút "Xóa" sản phẩm trong giỏ hàng thực hiện xóa tức thì, thiếu Confirmation Dialog theo đặc tả',
    severity: 'Medium',
    labels: ['bug', 'FR-07', 'severity:medium', 'frontend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu ở FR-07:
> *"Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện."*

Tuy nhiên tại \`frontend-web/src/pages/Cart.jsx\` dòng 51:
\`\`\`jsx
<button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700">
  Xóa
</button>
\`\`\`
Nút xóa gọi trực tiếp hàm \`removeFromCart(index)\` mà không hiển thị hộp thoại xác nhận (\`window.confirm\` hoặc modal dialog) để người dùng xác nhận thao tác.

### Các bước tái hiện (Steps to Reproduce)
1. Thêm sản phẩm vào giỏ hàng tại \`http://localhost:5173/cart\`
2. Bấm vào nút màu đỏ **"Xóa"** tại một dòng sản phẩm bất kỳ

### Kết quả thực tế (Actual Result)
Dòng sản phẩm bị xóa ngay lập tức khỏi bảng giỏ hàng mà không có bất kỳ thông báo hỏi lại nào.

### Kết quả mong đợi (Expected Result)
Phải bật lên hộp thoại xác nhận: *"Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"*. Người dùng bấm Xác nhận thì mới thực hiện xóa.

### Bằng chứng thực tế (Evidence)
**1. Ảnh chụp giao diện thao tác Xóa:**
![UI Evidence](${RAW_BASE}/FR07_BUG03_NO_DELETE_CONFIRMATION.png)

**2. Ảnh mã nguồn thiếu dialog xác nhận:**
![Code Evidence](${RAW_BASE}/FR07_BUG03_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  // ==================== FR-15 QUẢN LÝ SẢN PHẨM ====================
  {
    id: 'BUG-FR15-01',
    title: '[BUG-FR15-01] Broken Access Control: API POST/PUT/DELETE /api/products không yêu cầu xác thực Admin (CWE-306)',
    severity: 'Critical',
    labels: ['bug', 'FR-15', 'severity:critical', 'backend', 'security'],
    body: `### Mô tả lỗi (Bug Description)
Theo tiêu chuẩn bảo mật và kiểm soát truy cập (FR-12 & SEC-02):
> *"Tất cả các API Admin và các API có tính ảnh hưởng dữ liệu (POST/PUT/DELETE /api/products) đều phải yêu cầu Token JWT hợp lệ và role = 'admin'."*

Tuy nhiên trong \`backend/server.js\` dòng 167-196:
Các endpoint \`POST /api/products\`, \`PUT /api/products/:id\`, \`DELETE /api/products/:id\` **hoàn toàn không có middleware \`authenticateToken\` và không kiểm tra quyền admin**. Bất kỳ người dùng ẩn danh nào không cần đăng nhập cũng có thể tạo, chỉnh sửa hoặc xóa sạch dữ liệu sản phẩm trong CSDL!

### Các bước tái hiện (Steps to Reproduce)
Gửi request xóa hoặc thêm sản phẩm không kèm bất kỳ token nào:
\`\`\`bash
curl -X POST http://localhost:3000/api/products \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Hacker Product","price":99000,"category_id":1}'
\`\`\`

### Kết quả thực tế (Actual Result)
Backend trả về HTTP \`200 OK\` và thông báo \`{"message":"Product created","id":10}\`.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR15_BUG01_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR15-02',
    title: '[BUG-FR15-02] Backend chấp nhận thêm sản phẩm với giá âm (-50,000 ₫), vi phạm ràng buộc số dương',
    severity: 'High',
    labels: ['bug', 'FR-15', 'severity:high', 'backend'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-15 yêu cầu:
> *"Giá: bắt buộc, phải là số dương (> 0)."*

Tuy nhiên Backend API \`POST /api/products\` không kiểm tra giá trị của trường \`price\`. Khi gửi dữ liệu với giá âm (ví dụ \`price = -50000\`), máy chủ vẫn tiếp nhận và lưu vào CSDL SQLite.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR15_BUG02_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR15-05',
    title: '[BUG-FR15-05] Giao diện Admin: Sửa 1 sản phẩm làm toàn bộ sản phẩm trên UI bị đổi tên theo',
    severity: 'High',
    labels: ['bug', 'FR-15', 'severity:high', 'frontend-admin'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả yêu cầu:
> *"Khi Sửa một sản phẩm, chỉ sản phẩm đó bị thay đổi — các sản phẩm khác giữ nguyên."*

Tuy nhiên trong \`frontend-admin/src/App.jsx\` dòng 110:
\`\`\`javascript
const fakeMassUpdatedProducts = products.map((p) => ({
  ...p,
  name: productForm.name,
}));
setProducts(fakeMassUpdatedProducts);
\`\`\`
Mã nguồn duyệt qua toàn bộ mảng \`products\` và gán \`name: productForm.name\` cho tất cả sản phẩm, khiến toàn bộ danh sách sản phẩm trên giao diện Admin bị đổi tên theo sản phẩm vừa sửa.

### Bằng chứng (Evidence)
![Code Evidence](${RAW_BASE}/FR15_BUG05_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },

  // ==================== FR-04 MOBILE PROFILE ====================
  {
    id: 'BUG-FR04-01',
    title: '[BUG-FR04-01] Regex Số điện thoại cấm số 0 ở đầu, từ chối toàn bộ số điện thoại hợp lệ theo đặc tả',
    severity: 'High',
    labels: ['bug', 'FR-04', 'severity:high', 'mobile'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-04:
> *"Số điện thoại hợp lệ: bắt đầu bằng số 0, từ 10–11 chữ số."*

Tuy nhiên trong \`frontend-mobile/App.js\` dòng 287:
\`\`\`javascript
if (!/^[1-9][0-9]{8,9}$/.test(phone)) {
  Alert.alert("Lỗi", "Số điện thoại không hợp lệ. Vui lòng nhập đúng 9-10 chữ số.");
  return;
}
\`\`\`
Biểu thức chính quy \`^[1-9]\` bắt buộc ký tự đầu tiên phải là từ 1 đến 9, **hoàn toàn cấm số 0**! Do đó mọi số điện thoại hợp lệ theo định dạng Việt Nam bắt đầu bằng số 0 (ví dụ \`0901234567\`) đều bị ứng dụng báo lỗi từ chối.

### Bằng chứng (Evidence)
![Code Evidence](${RAW_BASE}/FR04_BUG01_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR04-02',
    title: '[BUG-FR04-02] Lỗ hổng leo quyền nghiêm trọng (Privilege Escalation): Người dùng tự thăng cấp Admin qua PUT /api/users/me (CWE-269)',
    severity: 'Critical',
    labels: ['bug', 'FR-04', 'severity:critical', 'backend', 'security'],
    body: `### Mô tả lỗi (Bug Description)
Đặc tả FR-04 quy định:
> *"Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính role."*

Tuy nhiên trong \`backend/server.js\` dòng 124-127:
\`\`\`javascript
if (role) {
  query += ", role = ?";
  params.push(role);
}
\`\`\`
API \`PUT /api/users/me\` cho phép nhận thuộc tính \`role\` từ client body và cập nhật thẳng vào CSDL SQLite. Bất kỳ tài khoản người dùng thông thường nào cũng có thể gửi \`{"role":"admin"}\` để tự biến mình thành Quản trị viên hệ thống.

### Bằng chứng (Evidence)
![API Evidence](${RAW_BASE}/FR04_BUG02_API_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  },
  {
    id: 'BUG-FR04-03',
    title: '[BUG-FR04-03] Lệch pha đặt tên trường camelCase vs snake_case khiến địa chỉ giao hàng bị null khi cập nhật',
    severity: 'High',
    labels: ['bug', 'FR-04', 'severity:high', 'mobile', 'backend'],
    body: `### Mô tả lỗi (Bug Description)
Trong \`frontend-mobile/App.js\` dòng 302, Mobile gửi request cập nhật hồ sơ với tên trường camelCase:
\`\`\`javascript
body: JSON.stringify({ name, phone, shippingAddress })
\`\`\`
Tuy nhiên trong \`backend/server.js\` dòng 119, Backend lại bóc tách theo định dạng snake_case:
\`\`\`javascript
const { name, shipping_address, phone, role } = req.body;
\`\`\`
Vì tên trường không khớp, \`req.body.shipping_address\` nhận giá trị \`undefined\`, dẫn đến cột \`shipping_address\` trong CSDL SQLite luôn bị ghi đè thành \`null\` mỗi khi người dùng bấm Cập nhật hồ sơ trên điện thoại.

### Bằng chứng (Evidence)
![Code Evidence](${RAW_BASE}/FR04_BUG03_CODE_EVIDENCE.png)

*Báo cáo bởi SV: 23120346 (HW02)*`
  }
];

async function createIssues() {
  if (!TOKEN) {
    console.error('❌ Lỗi: Bạn chưa cung cấp GitHub Token!');
    console.log('Cách chạy: node scripts/create_remaining_github_issues.js <GH_TOKEN>');
    process.exit(1);
  }

  console.log(`=== BẮT ĐẦU TỰ ĐỘNG TẠO 8 ISSUES (FR-07, FR-15, FR-04) LÊN GITHUB: ${REPO_OWNER}/${REPO_NAME} ===\n`);
  const createdIssues = [];

  for (const bug of BUGS) {
    console.log(`[Đang tạo] ${bug.id}: ${bug.title.slice(0, 50)}...`);
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'Antigravity-Agent-23120346',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: bug.title,
          body: bug.body,
          labels: bug.labels
        })
      });

      const data = await response.json();
      if (response.status === 201) {
        console.log(` -> ✅ Thành công: Issue #${data.number} (${data.html_url})`);
        createdIssues.push({ id: bug.id, number: data.number, url: data.html_url });
      } else {
        console.error(` -> ❌ Thất bại (HTTP ${response.status}):`, data.message);
      }
    } catch (err) {
      console.error(` -> ❌ Lỗi mạng:`, err.message);
    }
  }

  console.log(`\n=== TỔNG KẾT: ĐÃ TẠO ${createdIssues.length}/${BUGS.length} ISSUES ===`);
  const outPath = path.resolve(__dirname, 'created_remaining_issues_log.json');
  fs.writeFileSync(outPath, JSON.stringify(createdIssues, null, 2), 'utf8');
  console.log(`Đã lưu danh sách Issue URLs vào: ${outPath}`);
}

createIssues();
