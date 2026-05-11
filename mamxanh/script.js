// ===== UTIL =====
function getUser() {
  return localStorage.getItem("currentUser");
}

function showToast(title, msg, type = "success") {
  const container = document.getElementById('toast-container') || createToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✓' : '✕';

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${msg}</p>
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toast-container';
  div.className = 'toast-container';
  document.body.appendChild(div);
  return div;
}

// ===== PRODUCTS =====
// Fixed IDs and used actual available images
const products = [
  { id: 1, name: "Rau cải ngọt/kg", price: 20000, img: "RAUCAINGOT.jpg", category: "vegetable", desc: "Rau cải ngọt tươi sạch trồng theo tiêu chuẩn VietGAP tại Đăk Đoa, giòn ngọt, giàu vitamin." },
  { id: 2, name: "Hành tím/kg", price: 10000, img: "hanhtim.jpg", category: "Rau gia vị", desc: "Thơm cay nhẹ, giúp món ăn thêm đậm vị hấp dẫn." },
  { id: 3, name: "Cà rốt/kg", price: 15000, img: "CAROT.jpg", category: "root", desc: "Cà rốt tươi ngon, củ to, màu cam đậm, chứa nhiều vitamin A tốt cho mắt." },
  { id: 4, name: "Cải bắp hữu cơ/kg", price: 25000, img: "cải bắp.jpg", category: "vegetable", desc: "Cải bắp cuộn chặt, tươi xanh, trồng hoàn toàn không dùng thuốc trừ sâu." },
  { id: 5, name: "Combo Xanh Khỏe", price: 90000, img: "combo.png", category: "combo", desc: "Combo gồm 1kg cải ngọt, 1kg cải bắp, 1kg cà rốt. Tiết kiệm hơn cho bữa ăn gia đình." },
  { id: 6, name: "Rau muống non/kg", price: 18000, img: "rau muống.jpg", category: "vegetable", desc: "Rau muống đồng tươi non mơn mởn, rất thích hợp xào tỏi." },
  { id: 7, name: "Nghệ vàng/kg", price: 35000, img: "cunghe.jpg", category: "Rau gia vị", desc: "Màu vàng tự nhiên, thơm đặc trưng, tốt cho sức khỏe." },
  { id: 8, name: "Khoai tây vàng/kg", price: 22000, img: "khoaitay.jpg", category: "root", desc: "Khoai tây củ to đều, ít mắt, dẻo bở." },
  { id: 9, name: "Khoai lang/kg", price: 28000, img: "khoailang.jpg", category: "root", desc: "Nguồn dinh dưỡng tự nhiên, vị bùi ngọt dễ ăn." },
  { id: 10, name: "Rau mồng tơi/kg", price: 16000, img: "mongtoi.jpg", category: "vegetable", desc: "Rau mồng tơi nấu canh cua giải nhiệt mùa hè." },
  { id: 11, name: "Ớt chỉ thiên/kg", price: 50000, img: "ot.jpg", category: "Rau gia vị", desc: "Cay nồng tự nhiên, tạo vị đậm đà cho món ăn." },
  { id: 12, name: "Combo canh rau thanh mát", price: 120000, img: "comborau.jpg", category: "combo", desc: "Combo gồm rau xà lách, xúp lơ, cà chua, dưa leo." },
  { id: 13, name: "Ngò rí/kg", price: 35000, img: "ngori.jpg", category: "Rau gia vị", desc: "Rau gia vị thơm tự nhiên, giúp món ăn thêm đậm đà và hấp dẫn." }

];

// ===== FORMAT =====
function formatMoney(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

// ===== RENDER PRODUCTS =====
function renderProducts(list) {
  const div = document.getElementById("products");
  if (!div) return;

  div.innerHTML = "";

  const countEl = document.getElementById("result-count");
  if (countEl) countEl.innerText = `${list.length} sản phẩm`;

  if (list.length === 0) {
    div.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
      <div style="font-size: 40px; margin-bottom: 15px;">🔍</div>
      <h3>Không tìm thấy sản phẩm nào</h3>
      <p>Vui lòng thử từ khóa hoặc danh mục khác</p>
    </div>`;
    return;
  }

  list.forEach(p => {
    div.innerHTML += `
      <div class="product" onclick="openProductModal(${p.id})">
        <div class="product-badge">Tươi mới</div>
        <div class="product-img-wrapper">
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="product-info">
          <div class="product-cat">${getCategoryName(p.category)}</div>
          <h3>${p.name}</h3>
          <div class="price-row">
            <p class="price">${formatMoney(p.price)}</p>
            <button class="btn-add" onclick="event.stopPropagation(); addToCart(${p.id})">+</button>
          </div>
        </div>
      </div>
    `;
  });
}

function getCategoryName(cat) {
  const map = { vegetable: 'Rau xanh', fruit: 'Trái cây', root: 'Củ quả', combo: 'Combo' };
  return map[cat] || cat;
}

// ===== FILTER =====
function filterCategory(cat, element) {
  // Update UI active state
  if (element) {
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
  }

  if (cat === "all") renderProducts(products);
  else renderProducts(products.filter(p => p.category === cat));
}

// ===== SEARCH =====
function removeVietnameseTones(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function setupSearch() {
  const input = document.querySelector(".search");
  if (!input) return;

  input.addEventListener("input", function () {
    const keyword = removeVietnameseTones(input.value);

    // Reset category active state when searching
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.querySelector('.sidebar li:first-child')?.classList.add('active');

    if (!keyword) return renderProducts(products);

    const filtered = products.filter(p =>
      removeVietnameseTones(p.name).includes(keyword)
    );
    renderProducts(filtered);
  });
}

// ===== CART =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id, qty = 1) {
  if (!getUser()) {
    showToast("Từ chối", "Vui lòng đăng nhập để mua hàng!", "error");
    setTimeout(() => window.location.href = "login.html", 1500);
    return;
  }

  let cart = getCart();
  let item = cart.find(i => i.id === id);

  if (item) item.qty += qty;
  else cart.push({ id, qty: qty });

  saveCart(cart);
  updateCartCount();

  // Bounce animation
  const cartIcon = document.getElementById('cart-count');
  if (cartIcon) {
    cartIcon.classList.remove('bounce-in');
    void cartIcon.offsetWidth; // trigger reflow
    cartIcon.classList.add('bounce-in');
  }

  showToast("Thành công", "Đã thêm sản phẩm vào giỏ hàng");
}

function updateCartCount() {
  let cart = getCart();
  let count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

// ===== RENDER CART =====
function renderCart() {
  const cartDiv = document.getElementById("cart");
  if (!cartDiv) return;

  let cart = getCart();
  cartDiv.innerHTML = "";

  const layout = document.querySelector('.cart-layout');
  const empty = document.getElementById('empty-cart');

  if (cart.length === 0) {
    if (layout) layout.style.display = 'none';
    if (empty) empty.style.display = 'block';
    return;
  } else {
    if (layout) layout.style.display = 'flex';
    if (empty) empty.style.display = 'none';
  }

  let total = 0;

  cart.forEach(item => {
    let p = products.find(x => x.id === item.id);
    if (!p) return;

    let money = p.price * item.qty;
    total += money;

    cartDiv.innerHTML += `
      <div class="cart-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="cart-item-info">
          <h3>${p.name}</h3>
          <p class="cart-item-price">${formatMoney(p.price)}</p>
          <div class="qty-selector" style="margin-top: 15px; margin-bottom: 0;">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
            <input class="qty-input" value="${item.qty}" readonly>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-subtotal">${formatMoney(money)}</div>
        <button class="btn-remove" onclick="removeItem(${item.id})">✕</button>
      </div>
    `;
  });

  let ship = total > 0 ? 15000 : 0;
  let discount = total > 100000 ? 15000 : 0;
  let final = total + ship - discount;

  document.getElementById("subtotal").innerText = formatMoney(total);
  document.getElementById("total").innerText = formatMoney(final);
  document.getElementById("shipping").innerText = formatMoney(ship);
  document.getElementById("discount").innerText = formatMoney(discount);
}

function changeQty(id, delta) {
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
  showToast("Đã xóa", "Đã bỏ sản phẩm khỏi giỏ");
}

function clearCart() {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
  }
}

// ===== ADDRESS =====
function getAddresses() {
  const user = getUser();
  return JSON.parse(localStorage.getItem("addr_" + user)) || [];
}

function saveAddresses(arr) {
  const user = getUser();
  localStorage.setItem("addr_" + user, JSON.stringify(arr));
}

function openAddressModal() {
  const modal = document.getElementById("address-modal");
  if (modal) {
    modal.classList.add('show');
    renderAddressListModal();
  }
}

function closeAddressModal() {
  const modal = document.getElementById("address-modal");
  if (modal) modal.classList.remove('show');
}

function renderAddressListModal() {
  const div = document.getElementById("modal-address-list");
  if (!div) return;

  let list = getAddresses();
  let selected = localStorage.getItem("selectedAddress");
  div.innerHTML = "";

  if (list.length === 0) {
    div.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Bạn chưa có địa chỉ nào.</p>';
    return;
  }

  list.forEach((a, i) => {
    div.innerHTML += `
      <label class="address-item-row">
        <input type="radio" name="modal_addr" value="${i}" ${selected == i ? "checked" : ""}>
        <div class="address-info">
          <strong>${a.name} - ${a.phone}</strong>
          <span>${a.address}, ${a.district}, ${a.province}</span>
        </div>
        <button class="btn-delete-addr" onclick="event.preventDefault(); deleteAddress(${i})">✕</button>
      </label>
    `;
  });
}

function selectAddressModal() {
  const selectedRadio = document.querySelector('input[name="modal_addr"]:checked');
  if (selectedRadio) {
    localStorage.setItem("selectedAddress", selectedRadio.value);
    renderSelectedAddress();
    closeAddressModal();
    showToast("Thành công", "Đã chọn địa chỉ giao hàng");
  } else {
    showToast("Lỗi", "Vui lòng chọn 1 địa chỉ", "error");
  }
}

function saveNewAddress() {
  const name = document.getElementById("m-name").value.trim();
  const phone = document.getElementById("m-phone").value.trim();
  const province = document.getElementById("m-province").value.trim();
  const district = document.getElementById("m-district").value.trim();
  const address = document.getElementById("m-address").value.trim();

  if (!name || !phone || !province || !district || !address) {
    showToast("Lỗi", "Vui lòng nhập đầy đủ thông tin!", "error");
    return;
  }

  let list = getAddresses();
  list.push({ name, phone, province, district, address });
  saveAddresses(list);

  // Auto select new address
  localStorage.setItem("selectedAddress", list.length - 1);

  // Clear form
  document.getElementById("m-name").value = "";
  document.getElementById("m-phone").value = "";
  document.getElementById("m-province").value = "";
  document.getElementById("m-district").value = "";
  document.getElementById("m-address").value = "";

  renderAddressListModal();
  renderSelectedAddress();
  showToast("Thành công", "Đã thêm địa chỉ mới");
}

function renderSelectedAddress() {
  const div = document.getElementById("selected-address");
  if (!div) return;

  let list = getAddresses();
  let selected = localStorage.getItem("selectedAddress");

  if (selected !== null && list[selected]) {
    const a = list[selected];
    div.innerHTML = `
      <strong>${a.name}</strong> - ${a.phone}<br>
      ${a.address}, ${a.district}, ${a.province}
    `;
  } else {
    div.innerHTML = "Chưa có địa chỉ nào được chọn. Vui lòng thêm/chọn địa chỉ.";
  }
}

function deleteAddress(i) {
  if (confirm("Xóa địa chỉ này?")) {
    let list = getAddresses();
    list.splice(i, 1);
    saveAddresses(list);

    let selected = localStorage.getItem("selectedAddress");
    if (selected == i) localStorage.removeItem("selectedAddress");
    else if (selected > i) localStorage.setItem("selectedAddress", selected - 1);

    renderAddressListModal();
    renderSelectedAddress();
  }
}

// ===== CHECKOUT =====
function checkout() {
  let user = getUser();
  if (!user) {
    showToast("Từ chối", "Vui lòng đăng nhập trước!", "error");
    setTimeout(() => location.href = "login.html", 1500);
    return;
  }

  let cart = getCart();
  if (cart.length === 0) return;

  let list = getAddresses();
  let selected = localStorage.getItem("selectedAddress");

  if (selected === null || !list[selected]) {
    showToast("Chưa có địa chỉ", "Vui lòng chọn địa chỉ giao hàng!", "error");
    openAddressModal();
    return;
  }

  showToast("Thành công", "Đặt hàng thành công! Mầm Xanh sẽ liên hệ với bạn sớm.");
  localStorage.removeItem("cart");
  setTimeout(() => location.href = "index.html", 2000);
}

// ===== USERS =====
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function register() {
  const phone = document.getElementById("phone").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!phone || !pass) {
    showToast("Lỗi", "Vui lòng nhập đủ thông tin!", "error");
    return;
  }

  let users = getUsers();
  if (users.find(u => u.phone === phone)) {
    showToast("Lỗi", "Số điện thoại đã được đăng ký!", "error");
    return;
  }

  users.push({ phone, pass });
  localStorage.setItem("users", JSON.stringify(users));

  showToast("Thành công", "Đăng ký tài khoản thành công!");
  setTimeout(() => window.location.href = "login.html", 1500);
}

function login() {
  const phone = document.getElementById("phone").value.trim();
  const pass = document.getElementById("password").value.trim();

  let users = getUsers();
  let user = users.find(u => u.phone === phone && u.pass === pass);

  if (user) {
    localStorage.setItem("currentUser", phone);
    showToast("Thành công", "Đăng nhập thành công!");
    setTimeout(() => window.location.href = "index.html", 1000);
  } else {
    showToast("Lỗi", "Sai số điện thoại hoặc mật khẩu!", "error");
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  showToast("Thành công", "Đã đăng xuất khỏi tài khoản");
  setTimeout(() => window.location.href = "index.html", 1000);
}

// ===== USER UI =====
function setupUser() {
  const user = getUser();
  const userMenu = document.getElementById("user-menu");

  if (!userMenu) return;

  if (user) {
    userMenu.innerHTML = `
      <span class="user-name">👤 ${user}</span>
      <div class="dropdown">
        <p>Xin chào, ${user}</p>
        <button onclick="logout()">Đăng xuất</button>
      </div>
    `;
  } else {
    userMenu.innerHTML = '<a href="login.html" style="text-decoration:none; color:inherit;">Đăng nhập</a>';
  }
}

// ===== PRODUCT MODAL =====
function openProductModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  const modal = document.getElementById('product-modal');
  if (!modal) return;

  document.getElementById('m-prod-img').src = p.img;
  document.getElementById('m-prod-name').innerText = p.name;
  document.getElementById('m-prod-price').innerText = formatMoney(p.price);
  document.getElementById('m-prod-desc').innerText = p.desc;

  // Reset qty
  document.getElementById('m-prod-qty').value = 1;

  // Setup add button
  const btn = document.getElementById('m-prod-add');
  btn.onclick = () => {
    const qty = parseInt(document.getElementById('m-prod-qty').value);
    addToCart(p.id, qty);
    closeProductModal();
  };

  modal.classList.add('show');
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.remove('show');
}

function changeModalQty(delta) {
  const input = document.getElementById('m-prod-qty');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
}

// ===== SLIDER =====
let currentSlide = 0;
let slideInterval;

function startSlider() {
  const slides = document.getElementById("slides");
  const dots = document.querySelectorAll(".dot");
  if (!slides) return;

  const numSlides = slides.children.length;

  const goToSlide = (index) => {
    currentSlide = index;
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(idx);
      startInterval();
    });
  });

  const startInterval = () => {
    slideInterval = setInterval(() => {
      let next = (currentSlide + 1) % numSlides;
      goToSlide(next);
    }, 4000);
  };

  startInterval();
}

// ===== EVENT LISTENERS =====
window.onload = function () {
  renderProducts(products);
  renderCart();
  renderSelectedAddress();
  updateCartCount();
  setupSearch();
  setupUser();
  startSlider();
};

// Close modals when clicking outside
window.onclick = function (event) {
  const prodModal = document.getElementById('product-modal');
  if (event.target == prodModal) closeProductModal();

  const addrModal = document.getElementById('address-modal');
  if (event.target == addrModal) closeAddressModal();
}
