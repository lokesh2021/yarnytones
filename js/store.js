/* ============================================================
   YARNEY TONES — CART, WISHLIST & ORDERS (saved in the browser)
   ============================================================ */
(function () {
  const CFG = window.YT_CONFIG;
  const byId = Object.fromEntries(window.YT_PRODUCTS.map((p) => [p.id, p]));

  const load = (k, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? fallback;
    } catch (e) {
      return fallback;
    }
  };
  const save = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  };

  const fmt = new Intl.NumberFormat(CFG.locale || "en-IN", { style: "currency", currency: CFG.currency || "INR", maximumFractionDigits: 0 });
  const money = (n) => fmt.format(Math.round(n));

  const listeners = new Set();
  const state = {
    // only keep items whose product still exists in the catalogue
    cart: load("yt_cart", []).filter((i) => byId[i.id]),
    wish: load("yt_wish", []).filter((id) => byId[id]),
  };

  function emit(type, detail) {
    save("yt_cart", state.cart);
    save("yt_wish", state.wish);
    listeners.forEach((fn) => fn(type, detail));
  }

  function unitPrice(item) {
    const p = byId[item.id];
    if (!p) return 0;
    return p.price + (item.nameTag ? CFG.nameTagPrice : 0) + (item.giftWrap ? CFG.giftWrapPrice : 0);
  }

  const Store = {
    byId,
    money,
    get cart() {
      return state.cart;
    },
    get wish() {
      return state.wish;
    },
    on(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    product: (id) => byId[id],
    unitPrice,

    add({ id, cw = 0, nameTag = "", giftWrap = false, qty = 1 }) {
      nameTag = (nameTag || "").trim().slice(0, 24);
      const key = [id, cw, nameTag, giftWrap ? 1 : 0].join("|");
      const existing = state.cart.find((i) => i.key === key);
      if (existing) existing.qty = Math.min(existing.qty + qty, 20);
      else state.cart.push({ key, id, cw, nameTag, giftWrap, qty });
      emit("add", { id, cw, qty });
    },
    setQty(key, qty) {
      const it = state.cart.find((i) => i.key === key);
      if (!it) return;
      if (qty <= 0) return Store.remove(key);
      it.qty = Math.min(qty, 20);
      emit("qty", { key });
    },
    remove(key) {
      state.cart = state.cart.filter((i) => i.key !== key);
      emit("remove", { key });
    },
    clear() {
      state.cart = [];
      emit("clear");
    },
    count() {
      return state.cart.reduce((n, i) => n + i.qty, 0);
    },
    subtotal() {
      return state.cart.reduce((n, i) => n + unitPrice(i) * i.qty, 0);
    },
    shipping(sub = Store.subtotal()) {
      if (!sub) return 0;
      return sub >= CFG.freeShippingOver ? 0 : CFG.shippingFee;
    },
    total() {
      const s = Store.subtotal();
      return s + Store.shipping(s);
    },

    isWished: (id) => state.wish.includes(id),
    toggleWish(id) {
      const on = !state.wish.includes(id);
      state.wish = on ? [...state.wish, id] : state.wish.filter((x) => x !== id);
      emit("wish", { id, on });
      return on;
    },

    saveOrder(order) {
      const orders = load("yt_orders", []);
      orders.unshift(order);
      save("yt_orders", orders.slice(0, 20));
    },
    getOrder(id) {
      return load("yt_orders", []).find((o) => o.id === id);
    },
    newOrderId(prefix = "YT") {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let s = "";
      for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
      return `${prefix}-${s}`;
    },
  };

  window.YTStore = Store;
})();
