/**
 * Automated Test Script for FR-07: Giỏ hàng (Shopping Cart)
 * Target: Backend API (localhost:3000) & Frontend Web (Cart.jsx, CartContext.jsx)
 * Author: 23120346
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function request(endpoint, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function runCartTests() {
  console.log('================================================================');
  console.log('=== BẮT ĐẦU CHẠY SCRIPT AUTOMATED TESTING CHO FR-07: GIỎ HÀNG ===');
  console.log('================================================================\n');

  const results = {
    feature: 'FR-07: Giỏ hàng (Shopping Cart)',
    timestamp: new Date().toISOString(),
    steps: []
  };

  // 1. Static Analysis trên frontend-web: Cart.jsx & CartContext.jsx
  console.log('[Step 1] Phân tích mã nguồn Giao diện (Cart.jsx & CartContext.jsx)...');
  const cartJsxPath = path.resolve(__dirname, '../../eshop-sut/frontend-web/src/pages/Cart.jsx');
  const cartContextPath = path.resolve(__dirname, '../../eshop-sut/frontend-web/src/context/CartContext.jsx');

  const cartJsx = fs.readFileSync(cartJsxPath, 'utf8');
  const cartContext = fs.readFileSync(cartContextPath, 'utf8');

  // Bug 1: Nút +/- chỉnh số lượng
  const hasPlusMinusButtons = /[+−-]|\binc\b|\bdec\b|tăng|giảm/i.test(cartJsx) && cartJsx.includes('button');
  const hasQuantityAdjust = /updateQuantity|changeQuantity/i.test(cartContext);
  console.log(`-> Có nút +/- chỉnh số lượng: ${hasPlusMinusButtons}`);
  console.log(`-> Context có hàm chỉnh số lượng: ${hasQuantityAdjust}`);
  if (!hasPlusMinusButtons || !hasQuantityAdjust) {
    results.steps.push({
      step: 'FR07_CHECK_PLUS_MINUS_BUTTONS',
      bugId: 'BUG-FR07-01',
      title: 'Thiếu nút tăng/giảm (+/-) số lượng trực tiếp trong giỏ hàng',
      severity: 'Medium',
      evidence: 'Cart.jsx:47 chỉ render <td>{item.quantity}</td> dạng văn bản tĩnh, không có nút tương tác hay hàm updateQuantity trong CartContext.'
    });
  }

  // Bug 2: Thêm cùng sản phẩm tạo dòng mới thay vì tăng số lượng
  const handlesDuplicateProduct = /findIndex|find\(|existing/i.test(cartContext);
  console.log(`-> Logic addToCart có kiểm tra trùng sản phẩm để tăng số lượng: ${handlesDuplicateProduct}`);
  if (!handlesDuplicateProduct) {
    results.steps.push({
      step: 'FR07_CHECK_DUPLICATE_PRODUCT_MERGE',
      bugId: 'BUG-FR07-02',
      title: 'Thêm cùng sản phẩm vào giỏ bị nhân bản dòng mới thay vì cộng dồn số lượng',
      severity: 'High',
      evidence: 'CartContext.jsx:9 sử dụng setCart([...cart, { ...product, quantity }]) trực tiếp push vào mảng, vi phạm đặc tả: "Thêm cùng một sản phẩm vào giỏ sẽ tăng số lượng, không tạo dòng mới".'
    });
  }

  // Bug 3: Nút Xóa thiếu Dialog xác nhận
  const hasDeleteConfirm = /confirm\(|Dialog|Modal|Are you sure|Xác nhận xóa/i.test(cartJsx);
  console.log(`-> Nút xóa có dialog xác nhận trước khi xóa: ${hasDeleteConfirm}`);
  if (!hasDeleteConfirm) {
    results.steps.push({
      step: 'FR07_CHECK_DELETE_CONFIRMATION',
      bugId: 'BUG-FR07-03',
      title: 'Nút "Xóa" sản phẩm thực hiện xóa tức thì mà không có hộp thoại xác nhận (Confirmation Dialog)',
      severity: 'Medium',
      evidence: 'Cart.jsx:51 gọi trực tiếp removeFromCart(index) khi click nút Xóa, vi phạm đặc tả: "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện".'
    });
  }

  // Bug 4: Nhãn tổng tiền vi phạm đặc tả ("Tổng tạm tính" thay vì "Tổng cộng")
  const hasTongCongLabel = /Tổng cộng/i.test(cartJsx);
  const hasTongTamTinhLabel = /Tổng tạm tính/i.test(cartJsx);
  console.log(`-> Nhãn hiển thị tổng tiền là "Tổng cộng": ${hasTongCongLabel} (Đang dùng "Tổng tạm tính": ${hasTongTamTinhLabel})`);
  if (hasTongTamTinhLabel && !hasTongCongLabel) {
    results.steps.push({
      step: 'FR07_CHECK_TOTAL_LABEL',
      bugId: 'BUG-FR07-04',
      title: 'Hiển thị sai nhãn tổng tiền ("Tổng tạm tính" thay vì "Tổng cộng")',
      severity: 'Low',
      evidence: 'Cart.jsx:63 hiển thị: "Tổng tạm tính: ...", vi phạm đặc tả: "Tổng tiền hiển thị nhãn chính xác: Tổng cộng (không phải Tổng tạm tính)".'
    });
  }

  // Bug 5: Giỏ hàng trống thiếu hình minh họa
  const hasEmptyIllustration = /<img|<svg|Illustration|empty-cart/i.test(cartJsx.slice(0, cartJsx.indexOf('return (') + 300));
  console.log(`-> Giỏ hàng trống có hình ảnh minh họa: ${hasEmptyIllustration}`);
  if (!hasEmptyIllustration) {
    results.steps.push({
      step: 'FR07_CHECK_EMPTY_CART_ILLUSTRATION',
      bugId: 'BUG-FR07-05',
      title: 'Trạng thái giỏ hàng trống chỉ có văn bản thô, thiếu hình ảnh minh họa theo đặc tả',
      severity: 'Low',
      evidence: 'Cart.jsx:20-27 chỉ render tiêu đề <h2> và link, hoàn toàn thiếu ảnh minh họa theo yêu cầu: "Giỏ hàng trống phải có hình minh họa và thông báo rõ ràng".'
    });
  }

  // 2. Dynamic Testing trên Backend API: /api/cart
  console.log('\n[Step 2] Kiểm thử động Backend API /api/cart (Login & Token)...');
  // Đăng nhập lấy JWT Token
  const loginRes = await request('/api/login', 'POST', {
    email: 'test@eshop.com',
    password: 'Test1234!'
  });

  const token = loginRes.data.token;
  if (!token) {
    console.error('Không thể đăng nhập để lấy token, kiểm tra lại user test@eshop.com!');
  } else {
    console.log('-> Đăng nhập thành công, thu được JWT Token.');

    // Test API: Thêm sản phẩm với số lượng âm (BVA: quantity = -5)
    console.log('\n[Step 3] Test BVA số lượng âm: POST /api/cart với quantity = -5...');
    const negativeQtyRes = await request('/api/cart', 'POST', {
      productId: 1,
      name: 'Áo thun nam basic',
      price: 150000,
      quantity: -5
    }, token);

    console.log(`-> API Response khi gửi số lượng âm: status=${negativeQtyRes.status}, data=${JSON.stringify(negativeQtyRes.data)}`);
    if (negativeQtyRes.status === 200) {
      results.steps.push({
        step: 'FR07_API_NEGATIVE_QUANTITY_ACCEPTED',
        bugId: 'BUG-FR07-06',
        title: 'Backend API /api/cart chấp nhận số lượng âm (-5) mà không kiểm tra hợp lệ (CWE-20)',
        severity: 'High',
        evidence: `POST /api/cart với quantity: -5 trả về HTTP 200 "Added to cart", cho phép làm giảm hoặc âm tổng tiền thanh toán.`
      });
    }

    // Test API: Thêm cùng sản phẩm 2 lần xem Backend có cộng dồn không
    console.log('\n[Step 4] Test Backend lưu giỏ hàng: Thêm cùng productId 2 lần...');
    await request('/api/cart', 'POST', { productId: 2, name: 'Quần jeans slimfit', price: 350000, quantity: 1 }, token);
    await request('/api/cart', 'POST', { productId: 2, name: 'Quần jeans slimfit', price: 350000, quantity: 2 }, token);

    const getCartRes = await request('/api/cart', 'GET', null, token);
    const cartItems = getCartRes.data || [];
    const prod2Items = cartItems.filter(item => item.productId === 2);
    console.log(`-> Số dòng của productId 2 trong giỏ backend: ${prod2Items.length} (Kỳ vọng: 1 dòng với quantity=3)`);
    if (prod2Items.length > 1) {
      results.steps.push({
        step: 'FR07_BACKEND_DUPLICATE_ITEM_ROWS',
        bugId: 'BUG-FR07-07',
        title: 'Backend API /api/cart tạo 2 phần tử tách biệt cho cùng 1 sản phẩm thay vì gộp số lượng',
        severity: 'Medium',
        evidence: `server.js:293 thực hiện userCarts[userId].push(req.body) mà không gộp theo productId, tạo nhiều dòng trùng lặp.`
      });
    }
  }

  // Ghi kết quả ra file JSON
  const outPath = path.resolve(__dirname, 'exec_fr07_results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n-> Đã lưu kết quả transcript kiểm thử FR-07 vào: ${outPath}`);

  return results;
}

runCartTests().then(res => {
  console.log('\n=== HOÀN TẤT KIỂM THỬ TỰ ĐỘNG FR-07 ===');
  console.log(`Tổng số Bug phát hiện được cho FR-07: ${res.steps.filter(s => s.bugId).length} lỗi!`);
}).catch(err => {
  console.error('Lỗi khi chạy script FR-07:', err);
});
