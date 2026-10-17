/* ============================================================
   YARNY TONES — APP (router, header, bag, search, toasts)
   ============================================================ */
(function () {
  const CFG = window.YT_CONFIG;
  const S = window.YTStore;
  const FX = window.YTFX;
  const Art = window.YTArt;
  const V = window.YTViews;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  let readyResolve;
  const YT = (window.YT = {
    ready: new Promise((r) => (readyResolve = r)),
    waLink: (text) => `https://wa.me/${CFG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`,
    toast,
    openCart,
  });

  /* ---------- static bits ---------- */
  const wordmark = (t) => [...t].map((ch, i) => (ch === " " ? `<i class="sp"></i>` : `<i style="--i:${i}">${ch}</i>`)).join("");
  $("#logo").innerHTML = `${Art.yarnBall("#E8837B", 34)}<span class="logo-word">${wordmark(CFG.brand)}</span>`;
  $("#logo-foot").innerHTML = `${Art.yarnBall("#E8837B", 34)}<span class="logo-word">${wordmark(CFG.brand)}</span>`;
  $("#footer-big").innerHTML = [...CFG.brand].map((ch, i) => (ch === " " ? `<span class="sp"></span>` : `<span style="--i:${i}">${ch}</span>`)).join("");
  $("#footer-big").setAttribute("data-observe", "");
  $("#year").textContent = new Date().getFullYear();
  $$("[data-city]").forEach((e) => (e.textContent = CFG.city));
  $$("[data-ig-handle]").forEach((e) => (e.textContent = "@" + CFG.instagram));
  $("#mm-foot").innerHTML = `<a href="#" data-wa class="btn btn-rose">${V.icon("wa")}WhatsApp</a><a href="#" data-ig class="btn btn-ghost" target="_blank" rel="noopener">${V.icon("insta")}Instagram</a>`;

  // links that point to WhatsApp / Insta / email are filled in from config
  function wireExternal(root = document) {
    $$("[data-wa]", root).forEach((a) => {
      a.href = YT.waLink(`Hi ${CFG.brand}! 🧶 `);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-ig]", root).forEach((a) => (a.href = `https://instagram.com/${CFG.instagram}`));
    $$("[data-mail]", root).forEach((a) => (a.href = `mailto:${CFG.email}`));
  }

  /* ---------- toasts ---------- */
  function toast(html, opts = {}) {
    const box = $("#toasts");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="t-ico" style="--bg:${opts.bg || "var(--rose)"}">${opts.art ? Art.render(opts.art, opts.colors || {}, { fuzz: false }) : "✿"}</span><span>${html}</span>`;
    box.append(t);
    while (box.children.length > 3) box.firstElementChild.remove();
    setTimeout(() => {
      t.classList.add("out");
      setTimeout(() => t.remove(), 400);
    }, opts.ms || 3200);
  }

  /* ---------- badges ---------- */
  function updateBadges(pop) {
    const c = S.count(),
      w = S.wish.length;
    const cb = $("#cart-count"),
      wb = $("#wish-count");
    cb.textContent = c;
    wb.textContent = w;
    cb.classList.toggle("has", c > 0);
    wb.classList.toggle("has", w > 0);
    if (pop === "cart" || pop === "wish") {
      const el = pop === "cart" ? cb : wb;
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
    }
  }

  /* ---------- bag drawer ---------- */
  const overlay = $("#overlay");
  const cart = $("#cart");
  let lastFocus = null;
  function openCart() {
    closeSearch();
    renderCart();
    lastFocus = document.activeElement;
    cart.classList.add("on");
    overlay.classList.add("on");
    cart.setAttribute("aria-hidden", "false");
    FX.lockScroll(true);
    setTimeout(() => $(".close-btn", cart).focus(), 300);
  }
  function closeCart() {
    if (!cart.classList.contains("on")) return;
    cart.classList.remove("on");
    overlay.classList.remove("on");
    cart.setAttribute("aria-hidden", "true");
    FX.lockScroll(false);
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  function renderCart() {
    const n = S.count();
    $("#cart-items-label").textContent = n ? `${n} item${n > 1 ? "s" : ""}` : "";
    const sub = S.subtotal();
    const left = CFG.freeShippingOver - sub;
    $("#cart-meter").innerHTML = n
      ? `<div class="ship-meter">${left > 0 ? `You're <b>${S.money(left)}</b> away from free shipping 🚚` : `Woohoo! You've unlocked <b>free shipping</b> ✿`}<div class="ship-bar"><i style="--p:${Math.min(100, (sub / CFG.freeShippingOver) * 100)}%"></i></div></div>`
      : "";
    $("#cart-body").innerHTML = n
      ? S.cart.map((it) => V.lineItem(it)).join("")
      : `<div class="cart-empty">${Art.yarnBall("#E8837B", 90)}<h4>Your bag is feeling a bit unravelled</h4><p>Let's fill it with something squishy.</p><a href="#/shop" class="btn" data-close-cart>${V.btnLabel("Start shopping")}</a></div>`;
    $("#cart-foot").innerHTML = n
      ? `<div class="sum-row"><span>Subtotal</span><span>${S.money(sub)}</span></div><div class="sum-row"><span>Shipping</span><span>${S.shipping(sub) ? S.money(S.shipping(sub)) : "Free"}</span></div><div class="sum-row total"><span>Total</span><span>${S.money(S.total())}</span></div><a href="#/checkout" class="btn btn-rose btn-lg btn-block" data-close-cart>${V.btnLabel("Checkout")}${V.icon("arrow", "arrow")}</a><small>Orders are confirmed with you on WhatsApp before payment.</small>`
      : "";
    $("#cart-foot").style.display = n ? "" : "none";
  }
  $("#cart-open").addEventListener("click", openCart);
  overlay.addEventListener("click", () => {
    closeCart();
    closeSearch();
  });
  cart.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]") || e.target.closest("[data-close-cart]")) return closeCart();
    const li = e.target.closest(".line-item");
    if (!li) return;
    const key = li.dataset.key;
    const it = S.cart.find((i) => i.key === key);
    if (e.target.closest("[data-remove]")) {
      li.classList.add("removing");
      setTimeout(() => S.remove(key), 350);
    } else if (e.target.closest("[data-dq]") && it) {
      S.setQty(key, it.qty + +e.target.closest("[data-dq]").dataset.dq);
    }
  });

  /* ---------- search ---------- */
  const search = $("#search");
  const sInput = $("#search-input");
  let sFocus = -1;
  function openSearch() {
    closeCart();
    search.classList.add("on");
    overlay.classList.add("on");
    search.setAttribute("aria-hidden", "false");
    FX.lockScroll(true);
    renderSearch();
    setTimeout(() => sInput.focus(), 250);
  }
  function closeSearch() {
    if (!search.classList.contains("on")) return;
    search.classList.remove("on");
    overlay.classList.remove("on");
    search.setAttribute("aria-hidden", "true");
    FX.lockScroll(false);
  }
  function renderSearch() {
    const q = sInput.value.trim().toLowerCase();
    const res = window.YT_PRODUCTS.filter((p) => !q || (p.name + " " + p.short + " " + p.category + " " + p.art + " " + p.colorways.map((c) => c.name).join(" ")).toLowerCase().includes(q));
    sFocus = -1;
    $("#search-results").innerHTML = res.length
      ? res
          .slice(0, 9)
          .map((p, i) => `<a class="sr-item" href="#/product/${p.id}" style="--i:${i}"><span class="thumb" style="--bg:${p.bg}">${V.media(p, 0, { fuzz: false })}</span><span><b>${V.esc(p.name)}</b><span>${S.money(p.price)} · ${p.stock === "ready" ? "Ready to ship" : "Made to order"}</span></span></a>`)
          .join("")
      : `<div style="padding:20px 0;color:var(--ink-2)">No matches for “${V.esc(q)}”, but we can probably <a href="#/custom" class="link-u">make it for you</a>!</div>`;
    $("#search-hint").innerHTML = `Try: ${["bunny", "tulips", "keychain", "tote", "lilac"].map((w) => `<button data-q="${w}">${w}</button>`).join("")} <span style="margin-left:auto"><kbd>/</kbd> to open · <kbd>esc</kbd> to close</span>`;
  }
  $("#search-open").addEventListener("click", openSearch);
  sInput.addEventListener("input", renderSearch);
  sInput.addEventListener("keydown", (e) => {
    const items = $$(".sr-item");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      sFocus = (sFocus + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle("focus", i === sFocus));
    } else if (e.key === "Enter") {
      const target = items[Math.max(0, sFocus)];
      if (target) location.hash = target.getAttribute("href");
      else if (sInput.value.trim()) location.hash = "#/shop?q=" + encodeURIComponent(sInput.value.trim());
      closeSearch();
    }
  });
  search.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]") || e.target.closest(".sr-item") || e.target.closest("a")) closeSearch();
    const qb = e.target.closest("[data-q]");
    if (qb) {
      sInput.value = qb.dataset.q;
      renderSearch();
      sInput.focus();
    }
  });

  /* ---------- mobile menu ---------- */
  const burger = $("#burger");
  function toggleMenu(on) {
    const open = on ?? !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    $("#mobile-menu").setAttribute("aria-hidden", !open);
    FX.lockScroll(open);
  }
  burger.addEventListener("click", () => toggleMenu());
  $("#mobile-menu").addEventListener("click", (e) => e.target.closest("a") && toggleMenu(false));

  /* ---------- global clicks (cards, wishlist, etc.) ---------- */
  document.addEventListener("click", (e) => {
    const wish = e.target.closest("[data-wish]");
    if (wish) {
      e.preventDefault();
      e.stopPropagation();
      const id = wish.dataset.wish;
      const on = S.toggleWish(id);
      $$(`[data-wish="${id}"]`).forEach((b) => {
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", on);
      });
      if (on) {
        const r = wish.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height / 2, ["#E8837B", "#F4C2C2", "#F6D27A"], 14);
        const p = S.product(id);
        toast(`Saved <b>${V.esc(p.name)}</b> to your wishlist <a href="#/wishlist">View</a>`, { art: p.art, colors: p.colorways[0], bg: p.bg });
      }
      return;
    }
    const quick = e.target.closest("[data-quick]");
    if (quick) {
      e.preventDefault();
      e.stopPropagation();
      const p = S.product(quick.dataset.quick);
      const cardEl = quick.closest(".card");
      const cw = cardEl ? +(cardEl.dataset.cw || 0) : 0;
      S.add({ id: p.id, cw });
      const c = p.colorways[cw];
      FX.flyToCart(quick, c.c1 === "#FFFFFF" ? c.c3 : c.c1);
      toast(`<b>${V.esc(p.name)}</b> (${V.esc(c.name)}) added! <a href="#" data-open-cart>View bag</a>`, { art: p.art, colors: c, bg: p.bg });
      return;
    }
    const sw = e.target.closest(".swatch-dot");
    if (sw) {
      e.preventDefault();
      previewSwatch(sw, true);
      return;
    }
    if (e.target.closest("[data-open-cart]")) {
      e.preventDefault();
      openCart();
      return;
    }
    // in-page section links like #/?s=faq when already on home
    const a = e.target.closest('a[href^="#/?s="]');
    if (a && current.name === "home") {
      e.preventDefault();
      const target = document.getElementById(new URLSearchParams(a.getAttribute("href").split("?")[1]).get("s"));
      if (target) FX.scrollTo(target, { offset: -40 });
      history.replaceState(null, "", "#/");
    }
  });
  // hovering a colour dot previews that colourway on the card
  function previewSwatch(sw, commit) {
    const cardEl = sw.closest(".card");
    const p = S.product(cardEl.dataset.id);
    const i = +sw.dataset.sw;
    const svg = cardEl.querySelector(".card-media svg.art");
    Art.recolor(svg, p.colorways[i]);
    if (commit) {
      cardEl.dataset.cw = i;
      $$(".swatch-dot", cardEl).forEach((d, j) => d.classList.toggle("on", j === i));
    }
  }
  document.addEventListener("pointerover", (e) => {
    const sw = e.target.closest && e.target.closest(".swatch-dot");
    if (sw) previewSwatch(sw, false);
  });
  document.addEventListener("pointerout", (e) => {
    const sw = e.target.closest && e.target.closest(".swatch-dot");
    if (sw && !sw.contains(e.relatedTarget)) {
      const cardEl = sw.closest(".card");
      const p = S.product(cardEl.dataset.id);
      Art.recolor(cardEl.querySelector(".card-media svg.art"), p.colorways[+(cardEl.dataset.cw || 0)]);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCart();
      closeSearch();
      if (document.body.classList.contains("menu-open")) toggleMenu(false);
    }
    if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
  });

  S.on((type) => {
    updateBadges(type === "add" ? "cart" : type === "wish" ? "wish" : null);
    if (cart.classList.contains("on")) renderCart();
    if (type === "wish" && current.name === "wishlist") {
      // keep the wishlist page in sync
      const grid = $("#wish-grid");
      if (grid) {
        $$(".card", grid).forEach((c) => {
          if (!S.isWished(c.dataset.id)) {
            c.style.transition = "opacity .4s, transform .5s";
            c.style.opacity = 0;
            c.style.transform = "scale(.8)";
            setTimeout(() => FX.flip(grid, () => c.remove()), 400);
          }
        });
      }
    }
  });

  /* ---------- header behaviour ---------- */
  const header = $("#header");
  const prog = $("#progress-yarn");
  let lastY = 0;
  FX.tickers.add(() => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 30);
    if (!document.body.classList.contains("menu-open")) header.classList.toggle("is-hidden", y > 400 && y > lastY + 2 && !cart.classList.contains("on"));
    if (y < lastY - 2) header.classList.remove("is-hidden");
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  });

  /* ---------- router ---------- */
  const app = $("#app");
  let current = { name: null, cleanup: null };
  function parse() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const params = Object.fromEntries(new URLSearchParams(qs || ""));
    const seg = path.split("/").filter(Boolean);
    if (!seg.length) return { name: "home", params };
    if (seg[0] === "shop") return { name: "shop", params };
    if (seg[0] === "product") return { name: "product", params: { ...params, id: seg[1] } };
    if (seg[0] === "custom") return { name: "custom", params };
    if (seg[0] === "checkout") return { name: "checkout", params };
    if (seg[0] === "order") return { name: "order", params: { ...params, id: seg[1] } };
    if (seg[0] === "wishlist") return { name: "wishlist", params };
    return { name: "notfound", params };
  }

  function mount(route) {
    if (current.cleanup) current.cleanup();
    if (window.ScrollTrigger) ScrollTrigger.getAll().forEach((t) => t.kill());
    const view = V[route.name] || V.notfound;
    app.innerHTML = view.render(route.params);
    current = { name: route.name, cleanup: null };
    const title = typeof view.title === "function" ? view.title(route.params) : view.title;
    document.title = route.name === "home" ? `${CFG.brand} · Handmade Crochet, Hooked with Love` : `${title} · ${CFG.brand}`;
    $$(".nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === route.name));
    FX.scrollTo(0, { immediate: true, offset: 0 });
    window.scrollTo(0, 0);
    const c = view.mount ? view.mount(app, route.params) : null;
    current.cleanup = typeof c === "function" ? c : null;
    wireExternal(app);
    FX.reveal(app);
    FX.magnetic(app);
    FX.tilt(app);
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), 100);
    // jump to section (e.g. #/?s=faq)
    if (route.params.s) {
      const t = document.getElementById(route.params.s);
      if (t) setTimeout(() => FX.scrollTo(t, { offset: -40, immediate: true }), 120);
    }
  }

  const curtain = $("#curtain");
  $("#curtain-ball").innerHTML = Art.yarnBall("#E8837B", 56);
  let navigating = false;
  let pending = null;
  async function onRoute() {
    const route = parse();
    // same home page + section → just scroll
    if (route.name === "home" && current.name === "home" && route.params.s) {
      const t = document.getElementById(route.params.s);
      if (t) FX.scrollTo(t, { offset: -40 });
      return;
    }
    closeCart();
    closeSearch();
    if (document.body.classList.contains("menu-open")) toggleMenu(false);
    if (!current.name || FX.reduced) return mount(route);
    if (navigating) {
      pending = route;
      return;
    }
    navigating = true;
    const view = V[route.name] || V.notfound;
    $("#curtain-text").textContent = typeof view.title === "function" ? view.title(route.params) : view.title;
    curtain.classList.remove("out");
    curtain.classList.add("in");
    await wait(600);
    mount(pending || route);
    pending = null;
    await wait(80);
    curtain.classList.add("out");
    await wait(620);
    curtain.classList.remove("in", "out");
    navigating = false;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  window.addEventListener("hashchange", onRoute);

  /* ---------- preloader ---------- */
  async function preload() {
    const pl = $("#preloader");
    let seen = false;
    try {
      seen = sessionStorage.getItem("yt_seen");
      sessionStorage.setItem("yt_seen", 1);
    } catch (e) {}
    if (!CFG.preloader || seen || FX.reduced) {
      pl.remove();
      return;
    }
    $("#pl-ball").innerHTML = Art.yarnBall("#FBF4EA", 80).replace('fill="var(--yc)"', 'fill="#FBF4EA"');
    $("#pl-word").innerHTML = [...CFG.brand].map((ch, i) => `<span style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
    const path = $(".pl-thread path");
    const ball = $("#pl-ball");
    const count = $("#pl-count");
    const stageW = $(".pl-stage").offsetWidth;
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const start = performance.now();
    const dur = 1500;
    await new Promise((res) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - t, 3);
        path.style.strokeDashoffset = 1 - e;
        ball.style.transform = `translateX(${e * (stageW - 80)}px) scale(${1 - e * 0.45})`;
        count.textContent = Math.round(e * 100);
        if (t < 1) requestAnimationFrame(step);
        else res();
      };
      requestAnimationFrame(step);
    });
    await fonts;
    pl.classList.add("done");
    await wait(450);
    setTimeout(() => pl.remove(), 900);
  }

  /* ---------- boot ---------- */
  FX.initSmoothScroll();
  FX.startLoop();
  FX.initCursor();
  wireExternal(document);
  updateBadges();
  mount(parse());
  FX.reveal(document.querySelector("#footer"));
  FX.magnetic(document.querySelector("#footer"));
  preload().then(() => {
    document.body.classList.add("is-ready");
    readyResolve();
  });
})();
