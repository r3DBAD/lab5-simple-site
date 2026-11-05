// Весь сайт простой: данные лежат в коде, вход и корзина хранятся в localStorage.
var ITEMS = [
  { id: "espresso", name: "Эспрессо", price: 120, cat: "coffee" },
  { id: "cappuccino", name: "Капучино", price: 180, cat: "coffee" },
  { id: "latte", name: "Латте", price: 200, cat: "coffee" },
  { id: "black", name: "Чёрный чай", price: 90, cat: "tea" },
  { id: "green", name: "Зелёный чай", price: 100, cat: "tea" },
  { id: "cheesecake", name: "Чизкейк", price: 250, cat: "dessert" },
  { id: "brownie", name: "Брауни", price: 190, cat: "dessert" },
  { id: "croissant", name: "Круассан", price: 150, cat: "dessert" }
];
function el(id) { return document.getElementById(id); }
function currentUser() { return localStorage.getItem("user"); }
var page = location.pathname.split("/").pop() || "index.html";

// вошедшему в меню показываем «Кабинет» вместо «Вход»
if (currentUser()) { el("nav-login").textContent = "Кабинет"; el("nav-login").href = "account.html"; }
if (page === "account.html" && !currentUser()) location.replace("login.html");
if (page === "login.html" && currentUser()) location.replace("account.html");

if (el("login")) {
  el("show").onchange = function () { el("pass").type = this.checked ? "text" : "password"; };
  el("login").onsubmit = function (e) {
    e.preventDefault();
    var u = el("user").value.trim(), p = el("pass").value;
    if (!u || !p) { el("err").textContent = "Введите логин и пароль"; return; }
    if (u !== "student" || p !== "qwerty123") { el("err").textContent = "Неверный логин или пароль"; return; }
    localStorage.setItem("user", u);
    location.href = "account.html";
  };
}
if (el("logout")) {
  el("hello").textContent = "Здравствуйте, " + currentUser() + "!";
  el("logout").onclick = function () { localStorage.removeItem("user"); location.href = "login.html"; };
}
if (el("contact")) {
  el("contact").onsubmit = function (e) {
    e.preventDefault();
    var msg = el("c-msg");
    if (!el("c-name").value.trim() || !el("c-text").value.trim()) { msg.className = "bad"; msg.textContent = "Заполните имя и сообщение"; return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el("c-mail").value)) { msg.className = "bad"; msg.textContent = "Неверный e-mail"; return; }
    msg.className = "ok"; msg.textContent = "Спасибо! Сообщение отправлено"; this.reset();
  };
}
if (el("items")) {
  var cat = "all", cart = JSON.parse(localStorage.getItem("cart") || "{}");
  function drawItems() {
    var q = el("search").value.trim().toLowerCase(), list = ITEMS.filter(function (i) {
      return (cat === "all" || i.cat === cat) && i.name.toLowerCase().indexOf(q) >= 0;
    });
    if (el("sort").value === "asc") list.sort(function (a, b) { return a.price - b.price; });
    if (el("sort").value === "desc") list.sort(function (a, b) { return b.price - a.price; });
    el("none").hidden = list.length > 0;
    el("items").innerHTML = list.map(function (i) {
      return '<li class="item" id="item-' + i.id + '"><span class="name">' + i.name + '</span><span class="price">' + i.price +
        ' ₽</span><button class="add" data-id="' + i.id + '">В корзину</button></li>';
    }).join("");
  }
  function drawCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    var count = 0, total = 0, rows = "";
    ITEMS.forEach(function (i) {
      var n = cart[i.id] || 0;
      if (!n) return;
      count += n; total += n * i.price;
      rows += '<li class="row" id="row-' + i.id + '"><span>' + i.name + ' × <b class="qty">' + n + '</b></span><button class="del" data-id="' + i.id + '">Убрать</button></li>';
    });
    el("cart-list").innerHTML = rows; el("cart-count").textContent = count; el("cart-total").textContent = total;
    el("cart-empty").hidden = count > 0;
  }
  document.querySelector(".tools").onclick = function (e) {
    if (!e.target.classList.contains("flt")) return;
    cat = e.target.dataset.cat;
    document.querySelectorAll(".flt").forEach(function (b) { b.classList.toggle("on", b === e.target); });
    drawItems();
  };
  el("search").oninput = drawItems; el("sort").onchange = drawItems;
  el("items").onclick = function (e) { if (e.target.dataset.id) { cart[e.target.dataset.id] = (cart[e.target.dataset.id] || 0) + 1; drawCart(); } };
  el("cart-list").onclick = function (e) { if (e.target.dataset.id) { delete cart[e.target.dataset.id]; drawCart(); } };
  el("cart-clear").onclick = function () { cart = {}; drawCart(); };
  drawItems(); drawCart();
}
