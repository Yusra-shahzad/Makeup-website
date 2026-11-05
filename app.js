// ===== GLAMORA BEAUTY =====
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const FREE_SHIP = 5000, SHIP_FEE = 250;
const COUPONS = { GLOW20: 20, WELCOME10: 10 };
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }
};

// id, name, category, price, rating, badge, featured, image, description, off%
const SHADES = {
  Lips: [["Rose", "#c9677b"], ["Nude", "#c99a8a"], ["Berry", "#8e3552"], ["Coral", "#e0705f"]],
  Face: [["Light", "#f1d3bd"], ["Medium", "#d9a982"], ["Deep", "#a8714f"]],
  Eyes: [["Classic", "#3b2a2a"], ["Rosy", "#b97a86"]]
};
const U = i => `https://images.unsplash.com/${i}?w=600`;
const products = [
  [1, "Velvet Matte Lipstick", "Lips", 1299, 4.9, "BESTSELLER", 1, "photo-1586495777744-4413f21062fa", "A luxurious matte lipstick with rich colour and a velvety finish.", 20],
  [2, "Radiance Foundation", "Face", 2499, 4.8, "POPULAR", 1, "photo-1631730359585-38a4935cbec4", "A lightweight foundation for a smooth, natural-looking finish.", 0],
  [3, "Glow Highlighter", "Face", 1599, 4.9, "NEW", 1, "photo-1611930022073-b7a4ba5fcccd", "Add a luminous glow to your favourite makeup look.", 20],
  [4, "Luxury Eye Palette", "Eyes", 2199, 4.7, "TRENDING", 1, "photo-1512496015851-a90fb38ba796", "Everyday and glam shades for endless eye looks.", 0],
  [5, "Rose Lip Gloss", "Lips", 999, 4.8, "NEW", 0, "photo-1601049541289-9b1b7bbbfe19", "A glossy rose finish that adds shine and a touch of colour.", 0],
  [6, "Soft Blush Palette", "Face", 1499, 4.6, "POPULAR", 0, "photo-1522335789203-aabd1fc54bc9", "Soft blush shades for a fresh-looking touch.", 20],
  [7, "Daily Skin Serum", "Skincare", 1899, 4.9, "BESTSELLER", 0, "photo-1608248543803-ba4f8c70ae0b", "A lightweight serum for your daily routine.", 0],
  [8, "Volume Mascara", "Eyes", 1199, 4.7, "NEW", 0, "photo-1631214540242-9e7d6a5b1f1a", "An easy-to-apply mascara for volume and length.", 0],
  [9, "Hydrating Face Cream", "Skincare", 1799, 4.8, "POPULAR", 0, "photo-1556229010-6c3f2c9ca5f8", "A moisturising cream for a comfortable daily routine.", 20],
  [10, "Makeup Brush Set", "Face", 1999, 4.7, "TRENDING", 0, "photo-1522338140262-f46f5913618a", "A versatile set of brushes for your beauty routine.", 0],
  [11, "Peach Lip Tint", "Lips", 899, 4.6, "NEW", 0, "photo-1583241800698-e8ab01830a7b", "A lightweight peach tint for a soft pop of colour.", 0],
  [12, "Elegant Face Mist", "Skincare", 1399, 4.8, "POPULAR", 0, "photo-1601049541289-9b1b7bbbfe19", "A refreshing mist to add freshness to your routine.", 20]
].map(([id, name, category, base, rating, badge, f, img, description, off]) => ({
  id, name, category, base, off, rating, badge, featured: !!f, description,
  price: Math.round(base * (1 - off / 100)), image: U(img), shades: SHADES[category] || null
}));
const byId = id => products.find(p => p.id === id);

// ===== STATE =====
let cart = store.get("glamoraCart2", []);       // {id, qty, shade}
let wishlist = store.get("glamoraWishlist", []);
let coupon = store.get("glamoraCoupon", null);
let category = "All", searchTerm = "", maxPrice = 3000, qvShade = null;
cart = cart.filter(i => byId(i.id));
wishlist = wishlist.filter(byId);

const rs = n => "Rs. " + n.toLocaleString("en-PK");
const save = () => { store.set("glamoraCart2", cart); store.set("glamoraWishlist", wishlist); store.set("glamoraCoupon", coupon); };
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const FALLBACK = "this.onerror=null;this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23fcebed%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2260%22 text-anchor=%22middle%22%3E%E2%9C%A8%3C/text%3E%3C/svg%3E'";

// ===== PRODUCT CARDS =====
function card(p, i = 0) {
  const fav = wishlist.includes(p.id);
  return `<article class="product-card" style="animation-delay:${i * 40}ms">
    <div class="product-image">
      <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="${FALLBACK}">
      <span class="product-badge">${p.badge}</span>
      ${p.off ? `<span class="off-tag">-${p.off}%</span>` : ""}
      <button class="heart-btn ${fav ? "active" : ""}" data-act="wish" data-id="${p.id}" aria-label="Wishlist">${fav ? "♥" : "♡"}</button>
      <button class="quick-btn" data-act="quick" data-id="${p.id}">QUICK VIEW</button>
    </div>
    <div class="product-info">
      <span class="product-category">${p.category}</span>
      <h3>${p.name}</h3>
      <div class="product-rating">${stars(p.rating)} <span>(${p.rating})</span></div>
      <div class="product-bottom">
        <span class="product-price">${p.off ? `<s>${rs(p.base)}</s>` : ""}${rs(p.price)}</span>
        <button class="add-btn" data-act="add" data-id="${p.id}">+ ADD</button>
      </div>
    </div></article>`;
}

function displayProducts() {
  const list = products.filter(p =>
    (category === "All" || p.category === category) && p.price <= maxPrice &&
    (p.name + " " + p.category).toLowerCase().includes(searchTerm));
  const s = $("#sortSelect").value;
  if (s === "low") list.sort((a, b) => a.price - b.price);
  if (s === "high") list.sort((a, b) => b.price - a.price);
  if (s === "rating") list.sort((a, b) => b.rating - a.rating);
  $("#productGrid").innerHTML = list.map(card).join("");
  $("#emptyMessage").style.display = list.length ? "none" : "block";
  $("#resultCount").textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;
}
const displayBest = () => $("#bestProducts").innerHTML = products.filter(p => p.featured).map(card).join("");
const refreshGrids = () => { displayProducts(); displayBest(); };

// ===== FILTERS / SEARCH =====
function setCategory(c) {
  category = c;
  $$(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === c));
  displayProducts();
}
$$(".filter-btn").forEach(b => b.onclick = () => setCategory(b.dataset.filter));
$$(".category-card").forEach(c => c.onclick = () => { setCategory(c.dataset.category); $("#shop").scrollIntoView(); });
$("#sortSelect").onchange = displayProducts;
$("#priceRange").oninput = e => { maxPrice = +e.target.value; $("#priceLabel").textContent = rs(maxPrice); displayProducts(); };

$("#searchToggle").onclick = () => { $("#searchBox").classList.toggle("show"); $("#searchInput").focus(); };
$("#searchClose").onclick = () => { $("#searchBox").classList.remove("show"); $("#searchInput").value = searchTerm = ""; displayProducts(); };
let st;
$("#searchInput").oninput = e => {
  searchTerm = e.target.value.toLowerCase().trim(); displayProducts();
  clearTimeout(st); st = setTimeout(() => $("#shop").scrollIntoView(), 400);
};

// ===== CART =====
const findLine = (id, shade) => cart.find(i => i.id === id && i.shade === shade);
function addToCart(id, shade = null) {
  const p = byId(id);
  if (p.shades && !shade) shade = p.shades[0][0];
  const l = findLine(id, shade);
  l ? l.qty++ : cart.push({ id, qty: 1, shade });
  updateCart(); toast(`${p.name}${shade ? " (" + shade + ")" : ""} added to your bag!`);
}
function totals() {
  const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  const pct = coupon ? COUPONS[coupon] : 0;
  const disc = Math.round(sub * pct / 100);
  const ship = !cart.length || sub - disc >= FREE_SHIP ? 0 : SHIP_FEE;
  return { sub, disc, ship, total: sub - disc + ship, after: sub - disc };
}
function updateCart() {
  const t = totals();
  $("#cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  $("#sumSub").textContent = rs(t.sub);
  $("#discRow").hidden = !t.disc;
  $("#sumDisc").textContent = "- " + rs(t.disc);
  $("#sumShip").textContent = cart.length ? (t.ship ? rs(t.ship) : "FREE") : "—";
  $("#cartTotal").textContent = rs(t.total);
  const left = FREE_SHIP - t.after;
  $("#shipText").textContent = !cart.length ? `Free delivery on orders above ${rs(FREE_SHIP)}`
    : left > 0 ? `Add ${rs(left)} more for FREE delivery 🚚` : "🎉 You've unlocked FREE delivery!";
  $("#shipFill").style.width = Math.min(100, t.after / FREE_SHIP * 100) + "%";
  $("#couponInput").value = coupon || "";
  $("#cartItems").innerHTML = cart.length ? cart.map(i => {
    const p = byId(i.id);
    return `<div class="cart-item"><img src="${p.image}" alt="${p.name}" onerror="${FALLBACK}">
      <div><h4>${p.name}</h4>${i.shade ? `<small>Shade: ${i.shade}</small>` : ""}<p>${rs(p.price)}</p>
      <div class="quantity-controls"><button data-act="qty" data-id="${i.id}" data-shade="${i.shade ?? ""}" data-d="-1" aria-label="Less">−</button><span>${i.qty}</span><button data-act="qty" data-id="${i.id}" data-shade="${i.shade ?? ""}" data-d="1" aria-label="More">+</button></div></div>
      <button class="remove-btn" data-act="rm" data-id="${i.id}" data-shade="${i.shade ?? ""}">Remove</button></div>`;
  }).join("") : `<div class="empty-cart"><span>🛍</span><h3>Your bag is empty!</h3><p>Discover something beautiful today.</p></div>`;
  save();
}
function applyCoupon() {
  const c = $("#couponInput").value.trim().toUpperCase();
  if (!c) { coupon = null; toast("Coupon removed."); }
  else if (COUPONS[c]) { coupon = c; toast(`Coupon ${c} applied — ${COUPONS[c]}% off! 🎉`); }
  else return toast("Invalid coupon code.");
  updateCart();
}
$("#couponBtn").onclick = applyCoupon;
$("#couponInput").onkeydown = e => e.key === "Enter" && applyCoupon();
$("#copyCode").onclick = () => { navigator.clipboard?.writeText("GLOW20").catch(() => {}); toast("Code GLOW20 copied! Apply it in your bag."); };

// ===== WISHLIST =====
function toggleWish(id) {
  const had = wishlist.includes(id);
  wishlist = had ? wishlist.filter(x => x !== id) : [...wishlist, id];
  toast(had ? "Removed from wishlist." : "Added to your wishlist! ♥");
  updateWish(); refreshGrids();
}
function updateWish() {
  $("#wishCount").textContent = wishlist.length;
  $("#wishlistItems").innerHTML = wishlist.length ? wishlist.map(id => {
    const p = byId(id);
    return `<div class="wish-item"><img src="${p.image}" alt="${p.name}" onerror="${FALLBACK}"><div><h4>${p.name}</h4><p>${rs(p.price)}</p>
      <button class="add-btn" data-act="add" data-id="${p.id}" style="margin-top:8px">ADD TO BAG</button></div>
      <button class="remove-btn" data-act="wish" data-id="${p.id}" aria-label="Remove">✕</button></div>`;
  }).join("") : `<div class="empty-cart"><span>♡</span><h3>Your wishlist is empty!</h3><p>Save your favourite products here.</p></div>`;
  save();
}

// ===== QUICK VIEW =====
function openQuick(id) {
  const p = byId(id); qvShade = p.shades ? p.shades[0][0] : null;
  $("#quickContent").innerHTML = `<div class="quick-content"><img src="${p.image}" alt="${p.name}" onerror="${FALLBACK}">
    <div><span class="product-category">${p.category}</span><h2>${p.name}</h2>
    <div class="product-rating">${stars(p.rating)} (${p.rating})</div><p>${p.description}</p>
    <div class="product-price">${p.off ? `<s>${rs(p.base)}</s> ` : ""}${rs(p.price)}</div>
    ${p.shades ? `<small>Shade: <b id="shadeName">${qvShade}</b></small><div class="shades">${p.shades.map(([n, c], i) =>
      `<button class="shade ${i ? "" : "sel"}" style="background:${c}" data-act="shade" data-name="${n}" aria-label="${n}"></button>`).join("")}</div>` : ""}
    <button class="primary-btn" data-act="add-qv" data-id="${p.id}">ADD TO BAG →</button></div></div>`;
  openOverlay("quickView");
}

// ===== CHECKOUT =====
function openCheckout() {
  if (!cart.length) return toast("Your shopping bag is empty!");
  const t = totals();
  $("#checkoutBody").innerHTML = `<h2 style="font-family:'Playfair Display',serif;margin-top:10px">Checkout</h2>
  <form class="co-form" id="coForm">
    <input name="name" placeholder="Full name" required>
    <input name="phone" type="tel" placeholder="Phone (03XX-XXXXXXX)" pattern="[0-9+\\- ]{10,15}" required>
    <input name="city" placeholder="City" required>
    <textarea name="address" rows="2" placeholder="Full delivery address" required></textarea>
    <select name="pay"><option>Cash on Delivery</option><option>Bank Transfer</option><option>JazzCash / Easypaisa</option></select>
    <div class="co-box">${cart.map(i => `${byId(i.id).name}${i.shade ? " (" + i.shade + ")" : ""} × ${i.qty}`).join("<br>")}<hr style="border:0;border-top:1px solid var(--border);margin:8px 0">
      Subtotal: ${rs(t.sub)}${t.disc ? `<br>Discount: - ${rs(t.disc)}` : ""}<br>Delivery: ${t.ship ? rs(t.ship) : "FREE"}<br><b>Total: ${rs(t.total)}</b></div>
    <button class="primary-btn full-btn" type="submit">Place Order</button>
    <small style="text-align:center;color:var(--muted)">Demo store — no real payment is processed.</small></form>`;
  closeOverlay("cartOverlay"); openOverlay("checkoutModal");
  $("#coForm").onsubmit = e => {
    e.preventDefault();
    const id = "GB" + Date.now().toString().slice(-6), name = new FormData(e.target).get("name").split(" ")[0];
    cart = []; coupon = null; updateCart();
    $("#checkoutBody").innerHTML = `<div class="done"><span>🎉</span><h2>Thank you, ${name.replace(/[<>&]/g, "")}!</h2>
      <p>Your order <b>#${id}</b> has been placed. We'll contact you shortly to confirm delivery.</p>
      <button class="primary-btn" data-close="checkoutModal">Continue Shopping</button></div>`;
    $("#checkoutBody [data-close]").onclick = () => closeOverlay("checkoutModal");
  };
}
$("#checkoutBtn").onclick = openCheckout;

// ===== OVERLAYS =====
const openOverlay = id => { $("#" + id).classList.add("show"); document.body.style.overflow = "hidden"; };
const closeOverlay = id => {
  $("#" + id).classList.remove("show");
  if (!$(".overlay.show,.modal-overlay.show")) document.body.style.overflow = "";
};
$("#cartBtn").onclick = () => openOverlay("cartOverlay");
$("#wishlistBtn").onclick = () => openOverlay("wishlistOverlay");
$$("[data-close]").forEach(b => b.onclick = () => closeOverlay(b.dataset.close));
$$(".overlay,.modal-overlay").forEach(o => o.onclick = e => e.target === o && closeOverlay(o.id));
document.onkeydown = e => e.key === "Escape" && $$(".overlay.show,.modal-overlay.show").forEach(o => closeOverlay(o.id));

// ===== CLICK DELEGATION =====
document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const id = +b.dataset.id, shade = b.dataset.shade || null, a = b.dataset.act;
  if (a === "wish") toggleWish(id);
  else if (a === "quick") openQuick(id);
  else if (a === "add") addToCart(id);
  else if (a === "add-qv") { addToCart(id, qvShade); closeOverlay("quickView"); }
  else if (a === "shade") {
    qvShade = b.dataset.name; $("#shadeName").textContent = qvShade;
    $$(".shade").forEach(s => s.classList.toggle("sel", s === b));
  } else if (a === "qty") {
    const l = findLine(id, shade); if (!l) return;
    l.qty += +b.dataset.d; if (l.qty <= 0) cart = cart.filter(x => x !== l); updateCart();
  } else if (a === "rm") { cart = cart.filter(x => x !== findLine(id, shade)); updateCart(); toast("Product removed from your bag."); }
});

// ===== THEME / MENU / NEWSLETTER =====
const dark = store.get("glamoraTheme", window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") === "dark";
document.body.classList.toggle("dark", dark); $("#themeToggle").textContent = dark ? "☀" : "☾";
$("#themeToggle").onclick = () => {
  const d = document.body.classList.toggle("dark");
  $("#themeToggle").textContent = d ? "☀" : "☾"; store.set("glamoraTheme", d ? "dark" : "light");
};
$("#menuBtn").onclick = () => $("#navLinks").classList.toggle("open");
$$("#navLinks a").forEach(a => a.onclick = () => $("#navLinks").classList.remove("open"));
$("#newsletterForm").onsubmit = e => { e.preventDefault(); toast("Thank you for subscribing! ♡"); e.target.reset(); };

// ===== EXTRAS: reveal, counters, back-to-top, active nav =====
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .12 });
$$(".reveal").forEach(el => io.observe(el));

$$("[data-count]").forEach(el => {
  const n = +el.dataset.count; let c = 0;
  const t = setInterval(() => { el.textContent = ++c + "+"; if (c >= n) clearInterval(t); }, 70);
});

const links = $$("#navLinks a");
addEventListener("scroll", () => {
  $("#toTop").classList.toggle("show", scrollY > 600);
  let cur = "#home";
  ["home", "categories", "bestsellers", "shop", "about"].forEach(id => { if ($("#" + id).getBoundingClientRect().top < 140) cur = "#" + id; });
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === cur));
}, { passive: true });
$("#toTop").onclick = () => scrollTo({ top: 0 });

// ===== TOAST =====
let tt;
function toast(m) {
  const t = $("#toast"); t.textContent = m; t.classList.add("show");
  clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600);
}

// ===== INIT =====
refreshGrids(); updateCart(); updateWish();