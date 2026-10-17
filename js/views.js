/* ============================================================
   YARNEY TONES — PAGES
   Each view has render(params) → html and mount(root, params) → cleanup
   ============================================================ */
(function () {
  const CFG = window.YT_CONFIG;
  const S = window.YTStore;
  const FX = window.YTFX;
  const Art = window.YTArt;
  const P = window.YT_PRODUCTS;
  const CATS = window.YT_CATEGORIES;
  const YARNS = window.YT_YARNS;
  const money = S.money;

  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (n, cls = "") => `<svg class="${cls}" width="1.15em" height="1.15em" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const btnLabel = (t) => `<span class="btn-label"><span data-text="${esc(t)}">${esc(t)}</span></span>`;
  const heart = `<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.5 0 5.4 3.5 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" stroke-linejoin="round"/></svg>`;
  const catName = (id) => (CATS.find((c) => c.id === id) || {}).name || "";

  function media(p, cw = 0, opts = {}) {
    const c = p.colorways[cw] || p.colorways[0];
    const photo = c.photo || (p.photos && p.photos[0]);
    if (photo) return `<img class="photo" src="${esc(photo)}" alt="${esc(p.name)}" loading="lazy">`;
    return Art.render(p.art, c, { label: p.name, ...opts });
  }
  const stockText = (p) => (p.stock === "ready" ? (p.qty && p.qty <= 3 ? `Only ${p.qty} left` : "Ready to ship") : `Made to order · ${p.days || "5–7"} days`);
  function badge(p) {
    if (!p.badge) return "";
    const cls = /best|fave/i.test(p.badge) ? "hot" : /made/i.test(p.badge) ? "made" : /only|left/i.test(p.badge) ? "low" : "";
    return `<span class="badge ${cls}">${esc(p.badge)}</span>`;
  }

  function card(p) {
    return `<article class="card" data-id="${p.id}" data-cat="${p.category}" data-stock="${p.stock}">
      <a href="#/product/${p.id}" class="card-media wiggle-host" style="--bg:${p.bg}" data-tilt data-cursor="Peek ✿" aria-label="${esc(p.name)}">
        <span class="dots-bg"></span>
        <div class="art-wrap">${media(p)}</div>
        ${badge(p)}
        <button class="wish-btn ${S.isWished(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Save ${esc(p.name)} to wishlist" aria-pressed="${S.isWished(p.id)}">${heart}</button>
        <button class="quick-add" data-quick="${p.id}" aria-label="Add ${esc(p.name)} to bag">${icon("plus")}<span class="ql">Add to bag</span></button>
      </a>
      <div class="card-body">
        <div class="card-meta"><span class="avail ${p.stock === "made" ? "made" : ""}">${stockText(p)}</span><span>${catName(p.category)}</span></div>
        <h3><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
        <div class="card-row">
          <span class="price">${money(p.price)}${p.compareAt ? `<s>${money(p.compareAt)}</s>` : ""}</span>
          <div class="swatches">${p.colorways.map((c, i) => `<button class="swatch-dot ${i === 0 ? "on" : ""}" style="--sw:${c.c1 === "#FFFFFF" ? c.c3 : c.c1}" data-sw="${i}" aria-label="${esc(c.name)}" title="${esc(c.name)}"></button>`).join("")}</div>
        </div>
      </div>
    </article>`;
  }

  function sectionHead(title, sub, right = "") {
    return `<div class="section-head"><div><h2 class="section-title" data-split>${title}</h2>${sub ? `<p class="section-sub mt-16" data-reveal>${sub}</p>` : ""}</div>${right}</div>`;
  }

  function faqList(items) {
    return items.map((f) => `<div class="faq-item"><button class="faq-q" aria-expanded="false">${esc(f.q)}<span class="pm"></span></button><div class="faq-a"><div><p>${f.a}</p></div></div></div>`).join("");
  }

  function bindAccordion(root) {
    root.querySelectorAll(".faq-q").forEach((q) =>
      q.addEventListener("click", () => {
        const item = q.parentElement;
        const open = !item.classList.contains("open");
        item.parentElement.querySelectorAll(".faq-item.open").forEach((o) => {
          if (o !== item) {
            o.classList.remove("open");
            o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          }
        });
        item.classList.toggle("open", open);
        q.setAttribute("aria-expanded", open);
        setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 600);
      })
    );
  }

  function emptyState(title, text, cta = "") {
    return `<div class="empty" data-reveal="scale"><div style="width:150px;margin:0 auto 16px">${Art.render("yarn", { c1: "#F4C2C2", c2: "#E8837B", c3: "#fff" })}</div><h3>${title}</h3><p>${text}</p>${cta ? `<div class="mt-24">${cta}</div>` : ""}</div>`;
  }

  /* ==========================================================
     HOME
     ========================================================== */
  const home = {
    title: "Home",
    render() {
      const bunny = P.find((p) => p.art === "bunny") || P[0];
      const featured = P.slice(0, 8);
      const marq = (items) => `<div class="marquee-track"><div class="marquee-item">${items.map((t) => `<span>${t}</span><svg class="flower-ico"><use href="#i-flower"/></svg>`).join("")}</div></div>`;
      const avatarArts = [["bunny", "#FBE3DE", bunny.colorways[0]], ["bear", "#F7E7D3", { c1: "#C99872", c2: "#F3DCC2", c3: "#E8837B" }], ["octopus", "#E1EEF5", { c1: "#A9CFE0", c2: "#fff", c3: "#F4A6B7" }], ["strawberry", "#FCE3E1", { c1: "#E5534B", c2: "#7FA67A", c3: "#FFF3C4" }]];

      return `<div class="view home">
      <svg class="home-thread" id="home-thread" aria-hidden="true"><path id="ht-path"/><g id="ht-ball"></g></svg>

      <section class="hero" id="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="pill intro" style="--i:0">${icon("hook")} Handmade in small batches</span>
            <h1 class="mt-24" data-split data-manual style="--d:.35">Little loops of <span class="joy" data-unit><em>joy</em><svg viewBox="0 0 200 20" preserveAspectRatio="none"><path pathLength="1" d="M3 13 C 30 3, 52 19, 82 10 S 130 2, 160 12 S 188 15, 197 6"/></svg></span>, hooked by hand.</h1>
            <p class="lede intro" style="--i:4">Squishy amigurumi pals, forever flowers, totes and tiny treasures. Grab something ready to ship, or dream up a piece that's made just for you.</p>
            <div class="hero-ctas intro" style="--i:5">
              <a href="#/shop" class="btn btn-lg" data-magnetic>${btnLabel("Shop ready pieces")}${icon("arrow", "arrow")}</a>
              <a href="#/custom" class="btn btn-ghost btn-lg" data-magnetic>${btnLabel("Design your own")}</a>
            </div>
            <div class="hero-trust intro" style="--i:6">
              <div class="avatars">${avatarArts.map(([a, bg, c]) => `<span style="background:${bg}">${Art.render(a, c, { fuzz: false })}</span>`).join("")}</div>
              <div><span class="stars">★★★★★</span> <b>${CFG.rating.score}</b> · loved by ${CFG.rating.count} happy humans</div>
            </div>
          </div>
          <div class="hero-stage" id="hero-stage">
            <div class="hero-blob intro-pop" style="--i:0"></div>
            <div class="hero-blob two intro-pop" style="--i:1"></div>
            <div class="float hero-main" data-depth="0.5"><div class="intro-pop" style="--i:2"><button class="bob wiggle-host" id="hero-bunny" data-cursor="Boop!" aria-label="Change Bun-Bun's outfit" style="display:block;width:100%">${Art.render("bunny", bunny.colorways[0], { label: "Bun-Bun the crochet bunny" })}</button></div></div>
            <div class="float f-yarn" data-depth="1.6"><div class="intro-pop" style="--i:3"><div class="bob">${Art.render("yarn", { c1: "#C9B6E4", c2: "#7A4F7E", c3: "#fff" }, { fuzz: false })}</div></div></div>
            <div class="float f-tulip" data-depth="1.2"><div class="intro-pop" style="--i:4"><div class="bob wiggle-host">${Art.render("tulips", { c1: "#F2A7B8", c2: "#EADBC4", c3: "#E8837B" })}</div></div></div>
            <div class="float f-straw" data-depth="1.9"><div class="intro-pop" style="--i:5"><div class="bob wiggle-host">${Art.render("strawberry", { c1: "#E5534B", c2: "#7FA67A", c3: "#FFF3C4" })}</div></div></div>
            <div class="float f-mush" data-depth="1.4"><div class="intro-pop" style="--i:6"><div class="bob wiggle-host">${Art.render("mushroom", { c1: "#D9534F", c2: "#FBF3E6", c3: "#fff" })}</div></div></div>
            <div class="badge-spin intro-pop" style="--i:7">
              <svg class="ring" viewBox="0 0 120 120"><defs><path id="circ" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs><text><textPath href="#circ">made with love • one stitch at a time • </textPath></text></svg>
              <svg class="heart" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.5 0 5.4 3.5 4.1 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>
            </div>
            <div class="hand-note intro" style="--i:8">psst… click her<br>for a new outfit!<svg viewBox="0 0 70 50"><path pathLength="1" d="M4 6 C 20 40, 44 44, 62 30 M62 30 l-10 -2 M62 30 l-3 10"/></svg></div>
          </div>
        </div>
        <div class="scroll-cue"><i></i>scroll</div>
      </section>

      <div class="marquee" data-marquee="-1">${marq(["Handmade with love", "Ready to ship", "Made just for you", "Soft cotton yarn", "Gift-wrapped with care", "Shipped across India"])}</div>
      <div class="marquee alt" data-marquee="1">${marq(["Hook", "Loop", "Repeat", "Hook", "Loop", "Repeat"])}</div>

      <section class="section" id="cats">
        <div class="container">
          ${sectionHead("Shop by <em>mood</em>", "", `<a href="#/shop" class="link-u" data-reveal>See everything ${icon("arrow", "arrow")}</a>`.replace('<svg class="arrow"', '<svg width="18" height="18" class="arrow"'))}
          <div class="cat-row" data-stagger="up">
            ${CATS.map((c) => `<a href="#/shop?cat=${c.id}" class="cat-card wiggle-host" style="--bg:${c.bg}"><span class="arrow-dot">${icon("arrow")}</span>${Art.render(c.art, c.colors, { label: c.name })}<h3>${c.name}</h3><p>${c.blurb}</p></a>`).join("")}
          </div>
        </div>
      </section>

      <section class="section" id="featured" style="padding-top:0">
        <div class="container">
          ${sectionHead("Fresh off <em>the hook</em>", "Our newest little makes. Ready-to-ship pieces leave the studio in 1–2 days.", `<div class="tabs" id="feat-tabs" data-reveal><button class="chip is-active" data-f="all">All</button><button class="chip" data-f="ready">Ready to ship</button><button class="chip" data-f="made">Made for you</button></div>`)}
          <div class="grid" id="feat-grid" data-stagger="up">${featured.map(card).join("")}</div>
          <div style="text-align:center;margin-top:48px" data-reveal><a href="#/shop" class="btn btn-lg" data-magnetic>${btnLabel(`Browse all ${P.length} pieces`)}${icon("arrow", "arrow")}</a></div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="container">
          <div class="two-ways">
            <a href="#/shop?stock=ready" class="way ready wiggle-host" data-reveal="left">
              <div><span class="num">01 — grab it</span><h3>Ready to ship</h3><p>Already hooked, stuffed and smiling. Packed with a handwritten note and on its way in 1–2 days.</p>
              <ul class="way-list"><li>Dispatched in 48 hours</li><li>Gift wrap available</li><li>Tracked shipping, pan-India</li></ul></div>
              <span class="btn btn-light" style="align-self:flex-start">${btnLabel("Shop in-stock")}${icon("arrow", "arrow")}</span>
              <div class="way-art">${Art.render("cactus", { c1: "#6E8F6B", c2: "#FBF3E6", c3: "#F4A6B7" })}</div>
            </a>
            <a href="#/custom" class="way custom wiggle-host" data-reveal="right">
              <div><span class="num">02 — dream it</span><h3>Made just for you</h3><p>Your colours, your size, your name stitched on. Pet lookalikes, wedding bouquets, that bag you saw in a dream.</p>
              <ul class="way-list"><li>Pick from ${YARNS.length}+ yarn colours</li><li>Progress pics on WhatsApp</li><li>Usually ready in 5–10 days</li></ul></div>
              <span class="btn btn-light" style="align-self:flex-start">${btnLabel("Open the Studio")}${icon("arrow", "arrow")}</span>
              <div class="way-art">${Art.render("bear", { c1: "#7A4F7E", c2: "#E6DDF3", c3: "#F6D27A" })}</div>
            </a>
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="container">
          <div class="teaser" data-reveal="scale">
            <div>
              <span class="eyebrow" style="color:var(--rose)">try it, it's fun →</span>
              <h2 class="section-title mt-16" data-split>Pick the colours. <em>We'll do the hooking.</em></h2>
              <p class="section-sub">Tap a slot, then a yarn ball. This is exactly how custom orders work, just with more chai and progress photos.</p>
              <div class="teaser-controls">
                <div class="tabs" id="t-types">${["bear", "bunny", "beanie", "tulips"].map((t, i) => `<button class="chip ${i === 0 ? "is-active" : ""}" data-t="${t}" style="background:transparent;color:var(--cream);border-color:rgba(255,255,255,.25)">${{ bear: "Bear", bunny: "Bunny", beanie: "Beanie", tulips: "Tulips" }[t]}</button>`).join("")}</div>
                <div class="slot-row" id="t-slots"></div>
                <div class="yarn-shelf" id="t-shelf"></div>
                <div><a href="#/custom" class="btn btn-rose btn-lg mt-16" id="t-go" data-magnetic>${btnLabel("Make this for real")}${icon("arrow", "arrow")}</a></div>
              </div>
            </div>
            <div class="teaser-preview"><div class="ring-bg"></div><div id="t-art" class="wiggle-host"></div></div>
          </div>
        </div>
      </section>

      <section class="process" id="process">
        <div class="process-pin">
          <div class="process-track" id="process-track">
            <svg class="process-thread" id="process-thread" preserveAspectRatio="none"><path/></svg>
            <div class="process-intro">
              <span class="eyebrow">how the magic happens</span>
              <h2 class="section-title mt-16" data-split>From a ball of yarn <em>to your hands</em></h2>
              <p class="section-sub mt-16" data-reveal>Every piece takes hours of patient hooking. Here's the journey your piece goes on.</p>
            </div>
            ${[
              ["You dream it", "Pick a piece from the shop or tell us your idea. We'll chat on WhatsApp to get every detail just right.", "chit-chat", "bunny", { c1: "#F6EBDD", c2: "#F2B5AE", c3: "#E8837B" }],
              ["We pick the yarn", "Soft, skin-friendly cotton in the exact shades you chose, matched in daylight (yes, we're that fussy).", "the fun part", "yarn", { c1: "#F6D27A", c2: "#EDA93F", c3: "#fff" }],
              ["Hook, loop, repeat", "Round after round, stitch after stitch. A bunny takes ~8 hours. A tote? Don't ask. We send progress pics!", "~2,400 stitches", "tote", { c1: "#FBF3E6", c2: "#9DB59A", c3: "#F4A6B7" }],
              ["Wrapped & on its way", "Tucked in tissue with a handwritten note and shipped tracked to your door, anywhere in India.", "happy mail day", "tulips", { c1: "#C9B6E4", c2: "#EADBC4", c3: "#7A4F7E" }],
            ]
              .map(([h, p, tag, art, c], i) => `<div class="step wiggle-host"><span class="num">0${i + 1}</span><div><h3>${h}</h3><p class="mt-16">${p}</p></div><div style="display:flex;justify-content:space-between;align-items:end"><span class="tag">${tag}</span><div class="step-art">${Art.render(art, c)}</div></div></div>`)
              .join("")}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="stats" data-stagger="up">
            ${CFG.stats.map((s, i) => `<div class="stat" style="--c:${["#E8837B", "#F6D27A", "#9DB59A", "#C9B6E4"][i % 4]}"><div class="v"><span data-count="${s.value}">0</span>${s.suffix}</div><div class="l">${s.label}</div></div>`).join("")}
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:0" id="reviews">
        <div class="container reviews-wrap">
          <div>
            <span class="eyebrow">kind words</span>
            <h2 class="section-title mt-16" data-split>Kind words from <em>kind humans</em></h2>
            <p class="section-sub mt-16" data-reveal>Drag the cards (or use the arrows). Every review is from someone who now has a crochet friend for life.</p>
            <div class="stack-nav" data-reveal>
              <button class="round-btn" id="rv-prev" aria-label="Previous review">${icon("left")}</button>
              <button class="round-btn" id="rv-next" aria-label="Next review">${icon("arrow")}</button>
              <span class="drag-hint">← drag me →</span>
            </div>
          </div>
          <div class="stack" id="rv-stack" data-reveal="scale">
            ${window.YT_TESTIMONIALS.map((t) => `<figure class="polaroid" style="margin:0"><span class="tape"></span><div class="pol-img" style="background:${t.bg}">${Art.render(t.art, t.colors, { fuzz: false })}</div><blockquote>“${esc(t.text)}”</blockquote><figcaption class="who"><b>${esc(t.name)}</b><span>${esc(t.place)} · ${esc(t.item)}</span></figcaption></figure>`).join("")}
          </div>
        </div>
      </section>

      <section class="section" id="story" style="padding-top:0">
        <div class="container story">
          <div class="story-photo" data-reveal="left">
            <div class="frame back"></div>
            <div class="frame"><div class="inner wiggle-host">${Art.render("yarn", { c1: "#E8837B", c2: "#F4C2C2", c3: "#D2645C" })}</div><div class="caption">where it all began ✿</div></div>
          </div>
          <div class="story-text">
            <span class="eyebrow">our story</span>
            <h2 class="section-title mt-16" data-split>One hook, a lot of yarn, <em>and a little dream</em></h2>
            <p data-reveal>${CFG.ownerName ? `Hi, I'm ${esc(CFG.ownerName)}!` : "Hi there!"} Yarney Tones started with one wobbly amigurumi and a whole lot of YouTube tutorials.</p>
            <p data-reveal>What began as a hobby to unwind after long days turned into a tiny studio full of yarn (seriously, it's everywhere). Every piece is still made by hand, one stitch at a time, the slow way. No machines, no mass production, just patience and a lot of love.</p>
            <p data-reveal>Whether it's a ready-to-ship bunny or a custom bouquet for your wedding, it's made with the same care we'd put into a gift for our own best friend.</p>
            <div class="values" data-stagger="up"><span class="pill">${icon("hook")} 100% handmade</span><span class="pill">${icon("leaf")} Skin-friendly yarns</span><span class="pill">${icon("gift")} Plastic-free packaging</span></div>
            <div class="signature" data-reveal>with love, ${CFG.ownerName ? esc(CFG.ownerName) : "Yarney Tones"} ♡</div>
          </div>
        </div>
      </section>

      <section class="section" id="faq" style="padding-top:0">
        <div class="container faq-wrap">
          <div>
            <span class="eyebrow">questions?</span>
            <h2 class="section-title mt-16" data-split>Good <em>questions</em></h2>
            <p class="section-sub mt-16" data-reveal>Can't find what you're looking for? We're one WhatsApp message away.</p>
            <a href="#" data-wa class="btn btn-ghost mt-24" data-reveal data-magnetic>${icon("wa")}${btnLabel("Ask us anything")}</a>
          </div>
          <div data-stagger="up">${faqList(window.YT_FAQ)}</div>
        </div>
      </section>

      <section class="section" style="padding-top:0">
        <div class="container">
          ${sectionHead(`Follow the <em>yarn trail</em>`, "Behind-the-scenes, new drops and way too many yarn photos.", `<a href="#" data-ig class="link-u" data-reveal target="_blank" rel="noopener">@${esc(CFG.instagram)} ${icon("arrow", "arrow")}</a>`.replace('<svg class="arrow"', '<svg width="18" height="18" class="arrow"'))}
          <div class="insta-grid" data-stagger="scale">
            ${P.slice(0, 6).map((p, i) => `<a href="#" data-ig target="_blank" rel="noopener" class="insta-tile" style="--bg:${p.bg}" aria-label="Instagram">${Art.render(p.art, p.colorways[(i + 1) % p.colorways.length], { fuzz: false })}${icon("insta", "ig")}</a>`).join("")}
          </div>
        </div>
      </section>
    </div>`;
    },

    mount(root) {
      const cleanups = [];
      const bunny = P.find((p) => p.art === "bunny") || P[0];

      // hero: boop the bunny to cycle outfits
      let bi = 0;
      const hb = root.querySelector("#hero-bunny");
      hb.addEventListener("click", (e) => {
        bi = (bi + 1) % bunny.colorways.length;
        const svg = hb.querySelector("svg");
        Art.recolor(svg, bunny.colorways[bi]);
        svg.classList.remove("is-wiggling");
        void svg.offsetWidth;
        svg.classList.add("is-wiggling");
        FX.burst(e.clientX, e.clientY, [bunny.colorways[bi].c2, bunny.colorways[bi].c3, "#F6D27A"], 14);
        window.YT.toast(`Bun-Bun is now in <b>${bunny.colorways[bi].name}</b>`, { art: "bunny", colors: bunny.colorways[bi], bg: bunny.bg });
      });

      // hero headline waits for the preloader
      window.YT.ready.then(() => setTimeout(() => root.querySelector(".hero h1").classList.add("in"), 50));
      setTimeout(() => root.querySelector(".hero h1")?.classList.add("done"), 4000);

      // hero mouse parallax + scroll drift
      const stage = root.querySelector("#hero-stage");
      const floats = [...stage.querySelectorAll("[data-depth]")];
      let mx = 0,
        my = 0,
        cx = 0,
        cy = 0;
      const onMove = (e) => {
        mx = e.clientX / innerWidth - 0.5;
        my = e.clientY / innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      const tick = () => {
        cx = FX.lerp(cx, mx, 0.06);
        cy = FX.lerp(cy, my, 0.06);
        const sy = Math.min(window.scrollY, innerHeight);
        floats.forEach((f) => {
          const d = parseFloat(f.dataset.depth);
          f.style.transform = `translate3d(${cx * d * -40}px, ${cy * d * -40 - sy * d * 0.12}px, 0)`;
        });
      };
      if (!FX.reduced) FX.tickers.add(tick);
      cleanups.push(() => {
        FX.tickers.delete(tick);
        window.removeEventListener("pointermove", onMove);
      });

      // marquees
      root.querySelectorAll("[data-marquee]").forEach((m) => FX.marquee(m, { direction: parseInt(m.dataset.marquee), speed: 0.7 }));

      // featured tabs (FLIP)
      const fg = root.querySelector("#feat-grid");
      root.querySelectorAll("#feat-tabs .chip").forEach((b) =>
        b.addEventListener("click", () => {
          root.querySelectorAll("#feat-tabs .chip").forEach((x) => x.classList.toggle("is-active", x === b));
          FX.flip(fg, () => fg.querySelectorAll(".card").forEach((c) => c.classList.toggle("flip-hide", b.dataset.f !== "all" && c.dataset.stock !== b.dataset.f)));
          window.ScrollTrigger && ScrollTrigger.refresh();
        })
      );

      // studio teaser
      const tState = { type: "bear", colors: ["#C99872", "#F3DCC2", "#E8837B"], slot: 0 };
      const tArt = root.querySelector("#t-art");
      const slotsEl = root.querySelector("#t-slots");
      const drawSlots = () =>
        (slotsEl.innerHTML = ["Main", "Accent", "Detail"].map((n, i) => `<button class="slot ${tState.slot === i ? "on" : ""}" data-slot="${i}"><i style="--sw:${tState.colors[i]}"></i>${n}</button>`).join(""));
      const drawArt = () => {
        tArt.innerHTML = Art.render(tState.type, { c1: tState.colors[0], c2: tState.colors[1], c3: tState.colors[2] });
        tArt.firstElementChild.classList.add("is-wiggling");
      };
      root.querySelector("#t-shelf").innerHTML = YARNS.slice(0, 14)
        .map((y) => `<button class="yarn-sw" data-hex="${y.hex}" aria-label="${y.name}">${Art.yarnBall(y.hex, 38)}<span class="tip">${y.name}</span></button>`)
        .join("");
      drawSlots();
      drawArt();
      slotsEl.addEventListener("click", (e) => {
        const b = e.target.closest("[data-slot]");
        if (!b) return;
        tState.slot = +b.dataset.slot;
        drawSlots();
      });
      root.querySelector("#t-shelf").addEventListener("click", (e) => {
        const b = e.target.closest(".yarn-sw");
        if (!b) return;
        tState.colors[tState.slot] = b.dataset.hex;
        const svg = tArt.querySelector("svg");
        Art.recolor(svg, { c1: tState.colors[0], c2: tState.colors[1], c3: tState.colors[2] });
        svg.classList.remove("is-wiggling");
        void svg.offsetWidth;
        svg.classList.add("is-wiggling");
        tState.slot = (tState.slot + 1) % 3;
        drawSlots();
        const r = b.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height / 2, [b.dataset.hex], 8);
      });
      root.querySelectorAll("#t-types .chip").forEach((b) =>
        b.addEventListener("click", () => {
          root.querySelectorAll("#t-types .chip").forEach((x) => {
            x.classList.toggle("is-active", x === b);
            x.style.background = x === b ? "var(--rose)" : "transparent";
            x.style.borderColor = x === b ? "var(--rose)" : "rgba(255,255,255,.25)";
          });
          tState.type = b.dataset.t;
          drawArt();
        })
      );
      root.querySelector('#t-types .chip.is-active').style.background = "var(--rose)";
      root.querySelector('#t-types .chip.is-active').style.borderColor = "var(--rose)";
      root.querySelector("#t-go").addEventListener("click", () => {
        const typeMap = { bear: "amigurumi", bunny: "amigurumi", beanie: "wearable", tulips: "flowers" };
        const hexToIdx = (h) => {
          const i = YARNS.findIndex((y) => y.hex.toLowerCase() === h.toLowerCase());
          return i < 0 ? 0 : i;
        };
        try {
          const prev = JSON.parse(sessionStorage.getItem("yt_studio") || "{}");
          sessionStorage.setItem("yt_studio", JSON.stringify({ ...prev, step: 1, type: typeMap[tState.type], colors: tState.colors.map(hexToIdx) }));
        } catch (e) {}
      });

      // counters
      root.querySelectorAll("[data-count]").forEach((el) => {
        el.closest(".stat").addEventListener("reveal", () => FX.countUp(el, +el.dataset.count), { once: true });
      });

      // reviews stack
      const st = FX.stack(root.querySelector("#rv-stack"));
      root.querySelector("#rv-next").addEventListener("click", st.next);
      root.querySelector("#rv-prev").addEventListener("click", st.prev);

      bindAccordion(root);

      // GSAP: pinned horizontal process + scroll-drawn yarn thread
      if (window.gsap && window.ScrollTrigger && !FX.reduced) {
        const ctx = gsap.context(() => {
          const mm = gsap.matchMedia();
          mm.add("(min-width: 901px)", () => {
            const track = root.querySelector("#process-track");
            const thread = root.querySelector("#process-thread");
            const tp = thread.querySelector("path");
            const w = track.scrollWidth;
            thread.setAttribute("width", w);
            thread.setAttribute("viewBox", `0 0 ${w} 120`);
            let d = "M0 60";
            for (let x = 0; x < w; x += 240) d += ` Q${x + 60} ${x % 480 ? 10 : 110} ${x + 120} 60 T${x + 240} 60`;
            tp.setAttribute("d", d);
            const dist = () => track.scrollWidth - innerWidth;
            gsap.to(track, {
              x: () => -dist(),
              ease: "none",
              scrollTrigger: { trigger: root.querySelector("#process"), pin: root.querySelector(".process-pin"), scrub: 0.8, end: () => "+=" + dist(), invalidateOnRefresh: true },
            });
            track.querySelectorAll(".step").forEach((s, i) =>
              gsap.from(s, { y: 80, rotate: i % 2 ? -6 : 6, opacity: 0.3, scrollTrigger: { trigger: root.querySelector("#process"), start: () => `top+=${(i * dist()) / 5} top`, end: "+=300", scrub: 1 } })
            );

            // long yarn thread that weaves down the whole homepage, unwinding a shrinking yarn ball
            const home = root.querySelector(".home") || root;
            const svg = root.querySelector("#home-thread");
            const path = root.querySelector("#ht-path");
            const ball = root.querySelector("#ht-ball");
            const H = home.scrollHeight;
            const W = home.clientWidth;
            svg.setAttribute("height", H);
            svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
            let pd = `M${W * 0.62} ${innerHeight * 0.85}`;
            let y = innerHeight * 0.85;
            let left = true;
            while (y < H - 400) {
              const ny = y + 700;
              const x = left ? W * 0.04 : W * 0.96;
              pd += ` C${x} ${y + 120}, ${x} ${ny - 260}, ${W * 0.5} ${ny}`;
              y = ny;
              left = !left;
            }
            path.setAttribute("d", pd);
            const len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            ball.innerHTML = `<g class="tb">${Art.yarnBall("#E8837B", 40).replace("<svg", '<svg x="-20" y="-20"')}</g>`;
            const tb = ball.firstElementChild;
            const pos = (p) => {
              const pt = path.getPointAtLength(len * p);
              const s = 1.1 - p * 0.75;
              tb.setAttribute("transform", `translate(${pt.x} ${pt.y}) scale(${s}) rotate(${p * 3600})`);
            };
            pos(0);
            ScrollTrigger.create({
              trigger: home,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              onUpdate: (self) => {
                path.style.strokeDashoffset = len * (1 - self.progress);
                pos(self.progress);
              },
            });
          });
        }, root);
        cleanups.push(() => ctx.revert());
        setTimeout(() => ScrollTrigger.refresh(), 300);
      }

      return () => cleanups.forEach((f) => f());
    },
  };

  /* ==========================================================
     SHOP
     ========================================================== */
  const shop = {
    title: "The Shop",
    render(params) {
      const counts = Object.fromEntries(CATS.map((c) => [c.id, P.filter((p) => p.category === c.id).length]));
      return `<div class="view">
        <div class="container">
          <div class="page-head">
            <div class="crumbs" data-reveal><a href="#/">Home</a> / <span>Shop</span></div>
            <h1 data-split>The <em>Shop</em></h1>
            <p data-reveal>Everything here is hooked by hand. <b>Ready to ship</b> pieces leave in 1–2 days; <b>made to order</b> ones are crocheted fresh, just for you.</p>
            <div class="deco wiggle-host" aria-hidden="true">${Art.render("yarn", { c1: "#F6D27A", c2: "#EDA93F", c3: "#fff" })}</div>
          </div>
          <div class="toolbar" id="toolbar">
            <div class="tabs" id="cat-chips">
              <button class="chip" data-cat="all">All <span class="n">${P.length}</span></button>
              ${CATS.map((c) => `<button class="chip" data-cat="${c.id}">${c.name} <span class="n">${counts[c.id]}</span></button>`).join("")}
            </div>
            <div class="toolbar-right">
              <div class="seg" id="stock-seg"><span class="seg-pill"></span><button data-stock="all">All</button><button data-stock="ready">Ready</button><button data-stock="made">Made to order</button></div>
              <div class="select"><select id="sort" aria-label="Sort"><option value="featured">Featured</option><option value="low">Price: low → high</option><option value="high">Price: high → low</option><option value="az">A → Z</option></select></div>
            </div>
          </div>
          <div class="result-count" id="result-count" style="margin-bottom:16px"></div>
          <div class="grid" id="shop-grid">${P.map(card).join("")}<div class="empty flip-hide" id="shop-empty" style="opacity:1;transform:none"></div></div>
        </div>
      </div>`;
    },
    mount(root, params) {
      const st = { cat: params.cat || "all", stock: params.stock || "all", sort: "featured", q: params.q || "" };
      const grid = root.querySelector("#shop-grid");
      const empty = root.querySelector("#shop-empty");
      const seg = root.querySelector("#stock-seg");
      const apply = (animate = true) => {
        root.querySelectorAll("#cat-chips .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.cat === st.cat));
        seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.stock === st.stock));
        FX.segPill(seg);
        const mutate = () => {
          const cards = [...grid.querySelectorAll(".card")];
          const q = st.q.toLowerCase();
          let shown = 0;
          cards.forEach((c) => {
            const p = S.product(c.dataset.id);
            const ok = (st.cat === "all" || p.category === st.cat) && (st.stock === "all" || p.stock === st.stock) && (!q || (p.name + " " + p.short + " " + catName(p.category)).toLowerCase().includes(q));
            c.classList.toggle("flip-hide", !ok);
            if (ok) shown++;
          });
          const order = cards.slice().sort((a, b) => {
            const pa = S.product(a.dataset.id),
              pb = S.product(b.dataset.id);
            if (st.sort === "low") return pa.price - pb.price;
            if (st.sort === "high") return pb.price - pa.price;
            if (st.sort === "az") return pa.name.localeCompare(pb.name);
            return P.indexOf(pa) - P.indexOf(pb);
          });
          order.forEach((c) => grid.insertBefore(c, empty));
          empty.classList.toggle("flip-hide", shown > 0);
          if (!shown) empty.innerHTML = emptyState("Nothing here… yet", st.q ? `No pieces match “${esc(st.q)}”. But we can probably make it!` : "No pieces match those filters. Try another combo, or ask for a custom piece!", `<a href="#/custom" class="btn">${btnLabel("Request a custom piece")}</a>`).replace('data-reveal="scale"', "");
          root.querySelector("#result-count").innerHTML = `Showing <b>${shown}</b> of ${P.length} handmade pieces${st.q ? ` for “${esc(st.q)}” <button class="link-u" id="clear-q" style="margin-left:6px">clear</button>` : ""}`;
          root.querySelector("#clear-q")?.addEventListener("click", () => {
            st.q = "";
            apply();
          });
        };
        animate ? FX.flip(grid, mutate) : mutate();
        const qs = new URLSearchParams();
        if (st.cat !== "all") qs.set("cat", st.cat);
        if (st.stock !== "all") qs.set("stock", st.stock);
        if (st.q) qs.set("q", st.q);
        const h = "#/shop" + (qs.toString() ? "?" + qs : "");
        if (location.hash !== h) history.replaceState(null, "", h);
        window.ScrollTrigger && ScrollTrigger.refresh();
      };
      root.querySelector("#cat-chips").addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        st.cat = b.dataset.cat;
        apply();
      });
      seg.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        st.stock = b.dataset.stock;
        apply();
      });
      root.querySelector("#sort").addEventListener("change", (e) => {
        st.sort = e.target.value;
        apply();
      });
      apply(false);
      const onR = () => FX.segPill(seg);
      window.addEventListener("resize", onR);
      document.fonts && document.fonts.ready.then(onR);
      return () => window.removeEventListener("resize", onR);
    },
  };

  /* ==========================================================
     PRODUCT
     ========================================================== */
  const product = {
    title: (params) => (S.product(params.id) || {}).name || "Product",
    render(params) {
      const p = S.product(params.id);
      if (!p) return notfound.render();
      const related = [...P.filter((x) => x.category === p.category && x.id !== p.id), ...P.filter((x) => x.category !== p.category)].slice(0, 4);
      const save = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
      const thumbs = p.photos && p.photos.length > 1 ? p.photos.map((ph, i) => `<button class="pd-thumb ${i === 0 ? "on" : ""}" data-photo="${esc(ph)}" style="--bg:${p.bg}"><img src="${esc(ph)}" alt=""></button>`).join("") : p.colorways.map((c, i) => `<button class="pd-thumb ${i === 0 ? "on" : ""}" data-cw="${i}" style="--bg:${p.bg}" aria-label="${esc(c.name)}">${media(p, i, { fuzz: false })}</button>`).join("");
      return `<div class="view">
        <div class="container" style="padding-top:clamp(24px,4vw,50px)">
          <div class="crumbs" data-reveal><a href="#/">Home</a> / <a href="#/shop">Shop</a> / <a href="#/shop?cat=${p.category}">${catName(p.category)}</a> / <span>${esc(p.name)}</span></div>
          <div class="pd">
            <div class="pd-gallery" data-reveal="scale">
              <div class="pd-stage wiggle-host" id="pd-stage" style="--bg:${p.bg}" data-cursor="Zoom">
                <span class="dots-bg"></span>
                <div class="art-wrap" id="pd-art">${media(p, 0)}</div>
                ${badge(p)}
                <button class="wish-btn ${S.isWished(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Save to wishlist" aria-pressed="${S.isWished(p.id)}">${heart}</button>
              </div>
              <div class="pd-thumbs" id="pd-thumbs">${thumbs}</div>
            </div>
            <div class="pd-info">
              <span class="pill" data-reveal>${catName(p.category)}</span>
              <h1 data-split>${esc(p.name)}</h1>
              <div class="pd-rating" data-reveal><span class="stars">${"★".repeat(Math.round(p.rating || 5))}</span> ${p.rating || 5} · ${p.reviews || 0} happy owners</div>
              <div class="pd-price" data-reveal><span class="now" id="pd-price">${money(p.price)}</span>${p.compareAt ? `<s>${money(p.compareAt)}</s><span class="save">Save ${save}%</span>` : ""}</div>
              <p class="pd-short" data-reveal>${esc(p.short)}</p>
              <div class="pd-stock ${p.stock}" data-reveal>
                <span class="ico">${icon(p.stock === "ready" ? "truck" : "hook")}</span>
                <div>${p.stock === "ready" ? `<b>Ready to ship${p.qty && p.qty <= 3 ? ` · only ${p.qty} left!` : ""}</b><span>Packed & dispatched within 1–2 days.</span>` : `<b>Made to order · ${p.days || "5–7"} days</b><span>We start hooking yours the moment you order. Progress pics included!</span>`}</div>
              </div>

              <div data-reveal>
                <div class="opt-label">Colourway <span id="cw-name">${esc(p.colorways[0].name)}</span></div>
                <div class="colorways" id="colorways">${p.colorways.map((c, i) => `<button class="cw ${i === 0 ? "on" : ""}" data-cw="${i}" aria-pressed="${i === 0}"><span class="tri"><i style="background:${c.c1}"></i><i style="background:${c.c2}"></i><i style="background:${c.c3}"></i></span>${esc(c.name)}</button>`).join("")}</div>
              </div>

              <div data-reveal>
                <div class="opt-label">Make it extra special</div>
                <div class="extras">
                  ${p.nameTag ? `<label class="check"><input type="checkbox" id="opt-name"><span class="box">${icon("check")}</span><span class="lbl">Add a name tag<small>We'll stitch a name or initials on a little tag</small></span><span class="add">+${money(CFG.nameTagPrice)}</span></label>
                  <div class="nametag-input" id="name-wrap"><div><input class="input" id="opt-name-text" maxlength="24" placeholder="e.g. Aanya ♡"></div></div>` : ""}
                  <label class="check"><input type="checkbox" id="opt-gift"><span class="box">${icon("check")}</span><span class="lbl">Gift wrap it<small>Tissue, ribbon and a handwritten note</small></span><span class="add">+${money(CFG.giftWrapPrice)}</span></label>
                </div>
              </div>

              <div class="buy-row" data-reveal>
                <div class="qty lg"><button data-q="-1" aria-label="Decrease">−</button><span id="pd-qty">1</span><button data-q="1" aria-label="Increase">+</button></div>
                <button class="btn btn-lg" id="pd-add" data-magnetic="0.2">${icon("bag")}${btnLabel("Add to bag")}</button>
              </div>
              <button class="btn btn-rose btn-lg btn-block mt-16" id="pd-buy" data-reveal>${btnLabel("Buy it now")}${icon("arrow", "arrow")}</button>
              <div class="buy-bar" id="buy-bar" aria-hidden="true"><div class="bb-info"><b>${esc(p.name)}</b><span id="bb-price">${money(p.price)}</span></div><button class="btn" id="bb-add">${icon("bag")}${btnLabel("Add to bag")}</button></div>

              <div class="perks" data-stagger="up">
                <div class="perk">${icon("hook")}100% handmade</div>
                <div class="perk">${icon("truck")}Free shipping over ${money(CFG.freeShippingOver)}</div>
                <div class="perk">${icon("gift")}Gift-ready packing</div>
              </div>

              <div class="acc" data-reveal>
                <div class="faq-item open"><button class="faq-q" aria-expanded="true">About this piece<span class="pm"></span></button><div class="faq-a"><div><p>${esc(p.description)}</p></div></div></div>
                <div class="faq-item"><button class="faq-q" aria-expanded="false">Details & materials<span class="pm"></span></button><div class="faq-a"><div><ul>${(p.details || []).map((d) => `<li>${esc(d)}</li>`).join("")}</ul></div></div></div>
                <div class="faq-item"><button class="faq-q" aria-expanded="false">Care guide<span class="pm"></span></button><div class="faq-a"><div><p>Hand wash in cool water with mild soap, gently squeeze out water (no wringing!) and dry flat in the shade. Keep away from tiny teeth if it has small add-ons.</p></div></div></div>
                <div class="faq-item"><button class="faq-q" aria-expanded="false">Shipping & returns<span class="pm"></span></button><div class="faq-a"><div><p>Tracked shipping across India, free above ${money(CFG.freeShippingOver)} (otherwise ${money(CFG.shippingFee)}). Handmade items can't be returned, but if something arrives damaged, message us within 48 hours and we'll make it right.</p></div></div></div>
              </div>
            </div>
          </div>

          <section class="section">
            ${sectionHead("You might <em>also love</em>", "")}
            <div class="grid" data-stagger="up">${related.map(card).join("")}</div>
          </section>
        </div>
      </div>`;
    },
    mount(root, params) {
      const p = S.product(params.id);
      if (!p) return;
      const st = { cw: 0, qty: 1 };
      const stage = root.querySelector("#pd-stage");
      const artWrap = root.querySelector("#pd-art");
      const nameCb = root.querySelector("#opt-name");
      const nameTxt = root.querySelector("#opt-name-text");
      const giftCb = root.querySelector("#opt-gift");
      const priceEl = root.querySelector("#pd-price");
      priceEl.dataset.v = p.price;

      const updatePrice = () => {
        const unit = p.price + (nameCb && nameCb.checked ? CFG.nameTagPrice : 0) + (giftCb.checked ? CFG.giftWrapPrice : 0);
        FX.tweenNumber(priceEl, unit * st.qty, money, 500);
      };
      const setCw = (i) => {
        st.cw = i;
        const c = p.colorways[i];
        root.querySelectorAll("#colorways .cw").forEach((b, j) => {
          b.classList.toggle("on", j === i);
          b.setAttribute("aria-pressed", j === i);
        });
        root.querySelectorAll("#pd-thumbs [data-cw]").forEach((b, j) => b.classList.toggle("on", j === i));
        root.querySelector("#cw-name").textContent = c.name;
        const svg = artWrap.querySelector("svg.art");
        if (svg && !c.photo) {
          Art.recolor(svg, c);
          svg.classList.remove("is-wiggling");
          void svg.offsetWidth;
          svg.classList.add("is-wiggling");
        } else artWrap.innerHTML = media(p, i);
      };
      root.querySelector("#colorways").addEventListener("click", (e) => {
        const b = e.target.closest("[data-cw]");
        if (b) setCw(+b.dataset.cw);
      });
      root.querySelector("#pd-thumbs").addEventListener("click", (e) => {
        const b = e.target.closest("[data-cw],[data-photo]");
        if (!b) return;
        if (b.dataset.cw) setCw(+b.dataset.cw);
        else {
          root.querySelectorAll("#pd-thumbs .pd-thumb").forEach((t) => t.classList.toggle("on", t === b));
          artWrap.innerHTML = `<img class="photo" src="${b.dataset.photo}" alt="${esc(p.name)}">`;
        }
      });

      // hover zoom
      if (FX.fine) {
        stage.addEventListener("pointermove", (e) => {
          const r = stage.getBoundingClientRect();
          stage.style.setProperty("--ox", ((e.clientX - r.left) / r.width) * 100 + "%");
          stage.style.setProperty("--oy", ((e.clientY - r.top) / r.height) * 100 + "%");
        });
        stage.addEventListener("click", (e) => {
          if (e.target.closest(".wish-btn")) return;
          stage.classList.toggle("zoom");
        });
        stage.addEventListener("pointerleave", () => stage.classList.remove("zoom"));
      }

      if (nameCb)
        nameCb.addEventListener("change", () => {
          root.querySelector("#name-wrap").classList.toggle("on", nameCb.checked);
          if (nameCb.checked) setTimeout(() => nameTxt.focus(), 200);
          updatePrice();
        });
      giftCb.addEventListener("change", updatePrice);
      root.querySelector(".buy-row .qty").addEventListener("click", (e) => {
        const b = e.target.closest("[data-q]");
        if (!b) return;
        st.qty = FX.clamp(st.qty + +b.dataset.q, 1, 20);
        root.querySelector("#pd-qty").textContent = st.qty;
        updatePrice();
      });

      const add = (btn) => {
        if (nameCb && nameCb.checked && !nameTxt.value.trim()) {
          nameTxt.classList.add("shake");
          nameTxt.focus();
          setTimeout(() => nameTxt.classList.remove("shake"), 500);
          window.YT.toast("Pop in the name you'd like stitched ✍️");
          return false;
        }
        S.add({ id: p.id, cw: st.cw, qty: st.qty, nameTag: nameCb && nameCb.checked ? nameTxt.value : "", giftWrap: giftCb.checked });
        FX.flyToCart(btn, p.colorways[st.cw].c1 === "#FFFFFF" ? p.colorways[st.cw].c3 : p.colorways[st.cw].c1);
        return true;
      };
      root.querySelector("#pd-add").addEventListener("click", (e) => {
        if (add(e.currentTarget)) window.YT.toast(`<b>${esc(p.name)}</b> is in your bag! <a href="#" data-open-cart>View bag</a>`, { art: p.art, colors: p.colorways[st.cw], bg: p.bg });
      });
      root.querySelector("#pd-buy").addEventListener("click", (e) => {
        if (add(e.currentTarget)) setTimeout(() => (location.hash = "#/checkout"), 700);
      });
      bindAccordion(root);

      // sticky buy bar on phones: appears once the real buy button scrolls away
      const bar = root.querySelector("#buy-bar");
      const buyRow = root.querySelector(".buy-row");
      document.body.classList.add("has-buybar");
      const barIO = new IntersectionObserver(([e]) => {
        const show = !e.isIntersecting && e.boundingClientRect.top < 0;
        bar.classList.toggle("show", show);
        bar.setAttribute("aria-hidden", !show);
      }, { threshold: 0 });
      barIO.observe(buyRow);
      root.querySelector("#bb-add").addEventListener("click", (e) => {
        if (nameCb && nameCb.checked && !nameTxt.value.trim()) {
          FX.scrollTo(nameTxt, { offset: -160 });
          setTimeout(() => nameTxt.focus(), 600);
          window.YT.toast("Pop in the name you'd like stitched ✍️");
          return;
        }
        if (add(e.currentTarget)) window.YT.toast(`<b>${esc(p.name)}</b> is in your bag! <a href="#" data-open-cart>View bag</a>`, { art: p.art, colors: p.colorways[st.cw], bg: p.bg });
      });
      const bbPrice = root.querySelector("#bb-price");
      const syncBar = () => setTimeout(() => (bbPrice.textContent = priceEl.textContent), 520);
      [nameCb, giftCb].forEach((el) => el && el.addEventListener("change", syncBar));
      root.querySelector(".buy-row .qty").addEventListener("click", syncBar);
      return () => {
        barIO.disconnect();
        document.body.classList.remove("has-buybar");
      };
    },
  };

  /* ==========================================================
     CUSTOM STUDIO
     ========================================================== */
  const SIZES = [
    { id: "mini", name: "Mini", desc: "Pocket-sized", mult: 0.7, ball: 26, cm: "~10 cm" },
    { id: "regular", name: "Regular", desc: "Our classic", mult: 1, ball: 36, cm: "~20 cm" },
    { id: "large", name: "Large", desc: "Big hugs", mult: 1.6, ball: 48, cm: "~35 cm" },
  ];
  const VIBES = [
    { name: "Pastel dream", c: ["Blush", "Lavender", "Baby Blue"] },
    { name: "Earthy", c: ["Caramel", "Oat Milk", "Forest"] },
    { name: "Bold & bright", c: ["Cherry", "Butter", "Denim"] },
    { name: "Garden", c: ["Sage", "Marshmallow", "Rosewater"] },
    { name: "Moody", c: ["Plum", "Charcoal", "Marigold"] },
  ];
  const yIdx = (name) => Math.max(0, YARNS.findIndex((y) => y.name === name));

  const custom = {
    title: "Custom Studio",
    render() {
      return `<div class="view studio-light">
        <div class="container">
          <div class="page-head">
            <div class="crumbs" data-reveal><a href="#/">Home</a> / <span>Custom Studio</span></div>
            <h1 data-split>Custom <em>Studio</em></h1>
            <p data-reveal>Four tiny steps and your dream piece is on our hook. No payment now. We'll confirm the price & timeline with you on WhatsApp first.</p>
            <div class="deco wiggle-host" aria-hidden="true">${Art.render("bear", { c1: "#C9B6E4", c2: "#FBF3E6", c3: "#E8837B" })}</div>
          </div>
          <div class="studio">
            <div id="studio-left" data-reveal></div>
            <aside class="studio-preview" data-reveal="scale">
              <div class="stage" id="sp-stage"><span class="dots-bg"></span><div id="sp-art" class="wiggle-host" style="width:100%;display:grid;place-items:center"></div>
                <button class="shuffle" id="sp-shuffle">${icon("dice")} Shuffle colours</button>
                <span class="size-tag" id="sp-size"></span></div>
              <div class="side">
                <div class="palette-chosen" id="sp-pal"></div>
                <div class="estimate">
                  <div><div class="lbl">Estimated price</div><div class="val" id="sp-price"></div></div>
                  <div class="time"><div class="lbl">Ready in</div><div class="val" id="sp-time"></div></div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>`;
    },
    mount(root) {
      const TYPES = window.YT_CUSTOM_TYPES;
      let saved = {};
      try {
        saved = JSON.parse(sessionStorage.getItem("yt_studio") || "{}");
      } catch (e) {}
      const st = Object.assign({ step: 0, type: "amigurumi", colors: [yIdx("Caramel"), yIdx("Oat Milk"), yIdx("Rosewater")], slot: 0, size: "regular", personal: "", notes: "", ref: "", date: "", name: "", phone: "", email: "", city: "", sent: false }, saved);
      st.sent = false;
      const persist = () => {
        try {
          sessionStorage.setItem("yt_studio", JSON.stringify(st));
        } catch (e) {}
      };
      const left = root.querySelector("#studio-left");
      const type = () => TYPES.find((t) => t.id === st.type) || TYPES[0];
      const size = () => SIZES.find((s) => s.id === st.size) || SIZES[1];
      const cols = () => ({ c1: YARNS[st.colors[0]].hex, c2: YARNS[st.colors[1]].hex, c3: YARNS[st.colors[2]].hex });
      const bgFor = () => (CATS.find((c) => c.id === { amigurumi: "amigurumi", flowers: "flowers", wearable: "wearables", bag: "bags", home: "home" }[st.type]) || { bg: "#F7D4CC" }).bg;
      const range = () => {
        const t = type(),
          m = size().mult;
        const r = (n) => Math.round((n * m) / 50) * 50 - 1;
        return [r(t.min), r(t.max)];
      };

      // preview
      const spArt = root.querySelector("#sp-art");
      let curArtType = null;
      const drawPreview = (wiggle) => {
        const t = type();
        const stage = root.querySelector("#sp-stage");
        stage.style.background = bgFor();
        if (curArtType !== t.art) {
          const old = spArt.querySelector(".art");
          const put = () => {
            spArt.innerHTML = Art.render(t.art, cols());
            spArt.firstElementChild.classList.add("swap-in");
          };
          if (old && !FX.reduced) {
            old.classList.add("swap-out");
            setTimeout(put, 280);
          } else put();
          curArtType = t.art;
        } else {
          const svg = spArt.querySelector("svg.art");
          Art.recolor(svg, cols());
          if (wiggle && svg) {
            svg.classList.remove("swap-in", "is-wiggling");
            void svg.offsetWidth;
            svg.classList.add("is-wiggling");
          }
        }
        const s = size();
        const artEl = () => spArt.querySelector(".art");
        setTimeout(() => artEl() && (artEl().style.width = { mini: "54%", regular: "74%", large: "90%" }[s.id]), 300);
        root.querySelector("#sp-size").textContent = `${s.name} · ${s.cm}`;
        root.querySelector("#sp-pal").innerHTML = st.colors.map((i) => `<span style="--sw:${YARNS[i].hex}" title="${YARNS[i].name}"></span>`).join("");
        const [a, b] = range();
        const pe = root.querySelector("#sp-price");
        pe.innerHTML = `<span id="sp-a"></span> – <span id="sp-b"></span>`;
        const ea = pe.querySelector("#sp-a"),
          eb = pe.querySelector("#sp-b");
        ea.dataset.v = pe.dataset.a || a;
        eb.dataset.v = pe.dataset.b || b;
        FX.tweenNumber(ea, a, money, 500);
        FX.tweenNumber(eb, b, money, 500);
        pe.dataset.a = a;
        pe.dataset.b = b;
        root.querySelector("#sp-time").textContent = type().days;
        persist();
      };

      root.querySelector("#sp-shuffle").addEventListener("click", (e) => {
        const pick = () => Math.floor(Math.random() * YARNS.length);
        let a = pick(),
          b = pick(),
          c = pick();
        while (b === a) b = pick();
        while (c === a || c === b) c = pick();
        st.colors = [a, b, c];
        drawPreview(true);
        if (st.step === 1) renderStep();
        const r = e.currentTarget.getBoundingClientRect();
        FX.burst(r.left + r.width / 2, r.top + r.height / 2, st.colors.map((i) => YARNS[i].hex), 14);
      });

      const stepsBar = () => {
        const names = ["The piece", "Colours", "Details", "You"];
        return `<div class="steps-bar">${names.map((n, i) => `${i ? `<span class="line ${i <= st.step ? "done" : ""}"></span>` : ""}<button class="sb ${i === st.step ? "on" : ""} ${i < st.step ? "done" : ""}" data-go="${i}" ${i > st.step ? "disabled" : ""}><i>${i < st.step ? "✓" : i + 1}</i><span>${n}</span></button>`).join("")}</div>`;
      };
      let lastStep = st.step;
      const field = (id, label, attrs = "", hint = "") => `<div class="field ${attrs.includes("full") ? "full" : ""}"><label for="${id}">${label}${hint ? ` <small>${hint}</small>` : ""}</label>${attrs.includes("textarea") ? `<textarea id="${id}" data-k="${id.slice(3)}" placeholder="${attrs.match(/ph="([^"]*)"/)?.[1] || ""}">${esc(st[id.slice(3)])}</textarea>` : `<input id="${id}" data-k="${id.slice(3)}" value="${esc(st[id.slice(3)])}" ${attrs.replace(/full|textarea/g, "")}>`}<span class="err"></span></div>`;

      function renderStep() {
        const back = st.step < lastStep ? "back" : "";
        lastStep = st.step;
        let body = "";
        if (st.step === 0) {
          body = `<h2>What are we <em>making?</em></h2><p>Pick the closest match. You can describe the details later.</p>
          <div class="type-grid">${TYPES.map((t) => `<button class="type-card wiggle-host ${st.type === t.id ? "on" : ""}" data-type="${t.id}"><span class="tick">${icon("check")}</span>${Art.render(t.art, cols(), { fuzz: false })}<b>${t.name}</b><small>${t.desc}</small></button>`).join("")}</div>`;
        } else if (st.step === 1) {
          body = `<h2>Pick your <em>yarn</em></h2><p>Choose a slot, then tap a yarn ball. Watch your piece change on the right!</p>
          <div class="opt-label" style="margin-top:22px">Colour slots</div>
          <div class="slot-row light mt-16" id="s-slots">${["Main", "Accent", "Detail"].map((n, i) => `<button class="slot ${st.slot === i ? "on" : ""}" data-slot="${i}"><i style="--sw:${YARNS[st.colors[i]].hex}"></i>${n}: ${YARNS[st.colors[i]].name}</button>`).join("")}</div>
          <div class="opt-label" style="margin-top:22px">The yarn shelf <span>${YARNS.length} colours</span></div>
          <div class="yarn-shelf mt-16" id="s-shelf">${YARNS.map((y, i) => `<button class="yarn-sw ${st.colors[st.slot] === i ? "on" : ""}" data-y="${i}" aria-label="${y.name}">${Art.yarnBall(y.hex, 38)}<span class="tip">${y.name}</span></button>`).join("")}</div>
          <div class="opt-label" style="margin-top:22px">Or steal a vibe</div>
          <div class="tabs mt-16">${VIBES.map((v, i) => `<button class="chip" data-vibe="${i}"><span style="display:inline-flex">${v.c.map((n) => `<i style="width:12px;height:12px;border-radius:50%;background:${YARNS[yIdx(n)].hex};margin-right:-3px;box-shadow:0 0 0 1.5px var(--paper)"></i>`).join("")}</span>&nbsp; ${v.name}</button>`).join("")}</div>`;
        } else if (st.step === 2) {
          body = `<h2>The <em>details</em></h2><p>Size, personal touches and anything else we should know.</p>
          <div class="opt-label" style="margin-top:22px">Size</div>
          <div class="size-opts">${SIZES.map((s) => `<button class="size-opt ${st.size === s.id ? "on" : ""}" data-size="${s.id}"><div class="ball" style="width:${s.ball}px;height:${s.ball}px;background:${YARNS[st.colors[0]].hex}"></div><b>${s.name}</b><small>${s.desc} · ${s.cm}</small></button>`).join("")}</div>
          <div class="form-grid mt-24">
            ${field("st-personal", "Name or initials to stitch on", 'full maxlength="30" placeholder="e.g. Kabir, or K ♡"', "optional")}
            ${field("st-notes", "Tell us everything", 'full textarea ph="e.g. A bear that looks like my golden retriever Bruno, with a red bandana and a tiny tag that says ‘good boy’"')}
            ${field("st-ref", "Reference link", 'full placeholder="Pinterest / Instagram link"', "optional")}
          </div>`;
        } else if (st.step === 3) {
          const minDate = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10);
          body = `<h2>Almost <em>there!</em></h2><p>Where should we send your quote? We reply on WhatsApp, usually within a few hours.</p>
          <div class="form-grid mt-24">
            ${field("st-name", "Your name", 'autocomplete="name" placeholder="Your lovely name"')}
            ${field("st-phone", "WhatsApp number", 'type="tel" inputmode="tel" autocomplete="tel" placeholder="10-digit mobile"')}
            ${field("st-email", "Email", 'type="email" autocomplete="email" placeholder="you@example.com"', "optional")}
            ${field("st-city", "City", 'autocomplete="address-level2" placeholder="Where it\'s headed"')}
            ${field("st-date", "Need it by?", `full type="date" min="${minDate}"`, "optional, for gifts & occasions")}
          </div>`;
        }
        const nav = `<div class="st-actions">${st.step > 0 ? `<button class="btn btn-ghost" data-back>${icon("left")}${btnLabel("Back")}</button>` : "<span></span>"}${st.step < 3 ? `<button class="btn" data-next data-magnetic="0.2">${btnLabel("Next step")}${icon("arrow", "arrow")}</button>` : `<button class="btn btn-rose btn-lg" data-send data-magnetic="0.2">${icon("wa")}${btnLabel("Send my request")}</button>`}</div>`;
        left.innerHTML = stepsBar() + `<div class="st-panel ${back}">${body}${nav}</div>`;
        FX.magnetic(left);
      }

      function successView(link) {
        left.innerHTML = `<div class="studio-success st-panel"><div style="width:180px;margin:0 auto">${Art.render(type().art, cols())}</div>
          <h2 class="mt-16">Request <em>sent!</em></h2>
          <p>WhatsApp should have opened with your request all filled in. Just hit send! We'll reply with a quote, timeline and probably a few excited emojis.</p>
          <div class="done-actions">
            <a class="btn btn-rose" href="${link}" target="_blank" rel="noopener">${icon("wa")}${btnLabel("Open WhatsApp again")}</a>
            <a class="btn btn-ghost" href="mailto:${CFG.email}?subject=${encodeURIComponent("Custom order request")}&body=${encodeURIComponent(buildMsg())}">${icon("mail")}${btnLabel("Email it instead")}</a>
          </div>
          <button class="link-u mt-24" data-restart>Start another custom piece</button></div>`;
      }

      function buildMsg() {
        const t = type(),
          s = size(),
          [a, b] = range();
        return [
          `Hi ${CFG.brand}! 🧶 I'd love a custom piece.`,
          ``,
          `• What: ${t.name}`,
          `• Colours: ${st.colors.map((i) => YARNS[i].name).join(", ")}`,
          `• Size: ${s.name} (${s.cm})`,
          st.personal ? `• Stitch on: "${st.personal}"` : "",
          st.notes ? `• Details: ${st.notes}` : "",
          st.ref ? `• Reference: ${st.ref}` : "",
          st.date ? `• Needed by: ${new Date(st.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "",
          `• Estimate shown: ${money(a)} – ${money(b)}`,
          ``,
          `Name: ${st.name}`,
          `Phone: ${st.phone}`,
          st.email ? `Email: ${st.email}` : "",
          `City: ${st.city}`,
        ]
          .filter((l) => l !== "")
          .join("\n")
          .replace("\n• What", "\n\n• What");
      }

      function validate() {
        let ok = true;
        const need = (k, test, msg) => {
          const el = left.querySelector("#st-" + k);
          const f = el.closest(".field");
          const good = test(st[k].trim());
          f.classList.toggle("invalid", !good);
          f.querySelector(".err").textContent = good ? "" : msg;
          if (!good) {
            if (ok) el.focus();
            ok = false;
            f.classList.remove("shake");
            void f.offsetWidth;
            f.classList.add("shake");
          }
        };
        need("name", (v) => v.length > 1, "We'd love to know what to call you");
        need("phone", (v) => v.replace(/\D/g, "").length >= 10, "Please add a valid WhatsApp number");
        need("city", (v) => v.length > 1, "Which city is it going to?");
        if (st.email.trim()) need("email", (v) => /^\S+@\S+\.\S+$/.test(v), "That email looks a bit off");
        return ok;
      }

      left.addEventListener("input", (e) => {
        const k = e.target.dataset.k;
        if (k) {
          st[k] = e.target.value;
          e.target.closest(".field")?.classList.remove("invalid");
          persist();
        }
      });
      left.addEventListener("click", (e) => {
        const t = e.target.closest("button");
        if (!t) return;
        if (t.dataset.type) {
          st.type = t.dataset.type;
          left.querySelectorAll(".type-card").forEach((c) => c.classList.toggle("on", c === t));
          drawPreview();
        } else if (t.dataset.slot) {
          st.slot = +t.dataset.slot;
          left.querySelectorAll("#s-slots .slot").forEach((s, i) => s.classList.toggle("on", i === st.slot));
          left.querySelectorAll("#s-shelf .yarn-sw").forEach((s, i) => s.classList.toggle("on", i === st.colors[st.slot]));
        } else if (t.dataset.y) {
          st.colors[st.slot] = +t.dataset.y;
          const r = t.getBoundingClientRect();
          FX.burst(r.left + r.width / 2, r.top + r.height / 2, [YARNS[+t.dataset.y].hex], 8);
          st.slot = (st.slot + 1) % 3;
          drawPreview(true);
          renderStep();
        } else if (t.dataset.vibe) {
          st.colors = VIBES[+t.dataset.vibe].c.map(yIdx);
          drawPreview(true);
          renderStep();
        } else if (t.dataset.size) {
          st.size = t.dataset.size;
          left.querySelectorAll(".size-opt").forEach((s) => s.classList.toggle("on", s === t));
          drawPreview(true);
        } else if (t.dataset.go) {
          st.step = +t.dataset.go;
          renderStep();
        } else if ("next" in t.dataset) {
          st.step = Math.min(3, st.step + 1);
          renderStep();
          FX.scrollTo(root.querySelector(".studio"), { offset: -90 });
        } else if ("back" in t.dataset) {
          st.step = Math.max(0, st.step - 1);
          renderStep();
        } else if ("send" in t.dataset) {
          if (!validate()) return;
          const link = window.YT.waLink(buildMsg());
          window.open(link, "_blank", "noopener");
          FX.confetti();
          st.sent = true;
          persist();
          successView(link);
          FX.scrollTo(root.querySelector(".studio"), { offset: -90 });
        } else if ("restart" in t.dataset) {
          Object.assign(st, { step: 0, personal: "", notes: "", ref: "", date: "" });
          renderStep();
        }
        persist();
      });

      renderStep();
      drawPreview();
    },
  };

  /* ==========================================================
     CHECKOUT
     ========================================================== */
  const STATES = ["Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

  function lineItem(it, compact) {
    const p = S.product(it.id);
    const c = p.colorways[it.cw] || p.colorways[0];
    const opts = [c.name, it.nameTag ? `Name tag: “${esc(it.nameTag)}”` : "", it.giftWrap ? "Gift wrapped" : ""].filter(Boolean).join(" · ");
    if (compact)
      return `<div class="line-item"><div class="thumb" style="--bg:${p.bg}">${media(p, it.cw, { fuzz: false })}<span class="q">${it.qty}</span></div><div><h4>${esc(p.name)}</h4><div class="opts">${opts}</div></div><div class="price">${money(S.unitPrice(it) * it.qty)}</div></div>`;
    return `<div class="line-item" data-key="${esc(it.key)}"><a href="#/product/${p.id}" class="thumb" style="--bg:${p.bg}">${media(p, it.cw, { fuzz: false })}</a><div><h4>${esc(p.name)}</h4><div class="opts">${opts}</div><div class="qty"><button data-dq="-1" aria-label="Decrease">−</button><span>${it.qty}</span><button data-dq="1" aria-label="Increase">+</button></div></div><div class="right"><span class="price">${money(S.unitPrice(it) * it.qty)}</span><button class="remove" data-remove>Remove</button></div></div>`;
  }

  const checkout = {
    title: "Checkout",
    render() {
      if (!S.cart.length)
        return `<div class="view"><div class="container" style="padding-block:80px">${emptyState("Your bag is empty", "Nothing to check out yet. Let's find you something squishy.", `<a href="#/shop" class="btn btn-lg">${btnLabel("Go shopping")}${icon("arrow", "arrow")}</a>`)}</div></div>`;
      const f = (id, label, attrs = "", hint = "", cls = "") => `<div class="field ${cls}"><label for="${id}">${label}${hint ? ` <small>${hint}</small>` : ""}</label><input id="${id}" name="${id}" ${attrs}><span class="err"></span></div>`;
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem("yt_addr") || "{}");
      } catch (e) {}
      const v = (k) => `value="${esc(saved[k] || "")}"`;
      return `<div class="view">
        <div class="container">
          <div class="page-head" style="padding-bottom:30px">
            <div class="crumbs" data-reveal><a href="#/">Home</a> / <a href="#" data-open-cart>Bag</a> / <span>Checkout</span></div>
            <h1 data-split>Almost <em>yours</em></h1>
          </div>
          <form class="co" id="co-form" novalidate>
            <div data-stagger="up">
              <div class="co-card">
                <h3><span class="n">1</span> Contact</h3>
                <div class="form-grid">
                  ${f("name", "Full name", `autocomplete="name" ${v("name")}`)}
                  ${f("phone", "WhatsApp number", `type="tel" inputmode="tel" autocomplete="tel" placeholder="10-digit mobile" ${v("phone")}`)}
                  ${f("email", "Email", `type="email" autocomplete="email" ${v("email")}`, "optional, for a receipt", "full")}
                </div>
              </div>
              <div class="co-card">
                <h3><span class="n">2</span> Delivery address</h3>
                <div class="form-grid">
                  ${f("addr", "Address", `autocomplete="street-address" placeholder="House no., street, area, landmark" ${v("addr")}`, "", "full")}
                  ${f("city", "City", `autocomplete="address-level2" ${v("city")}`)}
                  ${f("pin", "PIN code", `inputmode="numeric" maxlength="6" autocomplete="postal-code" ${v("pin")}`)}
                  <div class="field full"><label for="state">State</label><select id="state" name="state" autocomplete="address-level1"><option value="">Choose your state</option>${STATES.map((s) => `<option ${saved.state === s ? "selected" : ""}>${s}</option>`).join("")}</select><span class="err"></span></div>
                  <div class="field full"><label for="note">Note for us <small>optional: gift message, delivery date…</small></label><textarea id="note" name="note" placeholder="Write a gift message and we'll handwrite it on a card ♡"></textarea></div>
                </div>
              </div>
              <div class="co-card">
                <h3><span class="n">3</span> Payment</h3>
                <div class="pay-opts">
                  <label class="pay-opt"><input type="radio" name="pay" value="UPI" checked><span class="radio"></span><div><b>UPI</b><small>GPay, PhonePe, Paytm. We'll confirm your order on WhatsApp, then you pay to <b>${esc(CFG.upiId)}</b>.</small></div><span class="tagline">Most popular</span></label>
                  <label class="pay-opt"><input type="radio" name="pay" value="Bank transfer"><span class="radio"></span><div><b>Bank transfer</b><small>We'll share account details on WhatsApp.</small></div></label>
                  ${CFG.cashOnDelivery ? `<label class="pay-opt"><input type="radio" name="pay" value="Cash on delivery"><span class="radio"></span><div><b>Cash on delivery</b><small>Pay when it arrives.</small></div></label>` : ""}
                </div>
                <p class="co-note">${icon("check")} No payment is taken on this site. Your order is sent to us on WhatsApp, we confirm stock & delivery date, and then you pay. Simple and safe.</p>
              </div>
            </div>
            <aside class="co-summary" data-reveal="right">
              <div class="co-card">
                <h3>Order summary</h3>
                <div id="co-items" data-lenis-prevent style="max-height:340px;overflow:auto;margin-top:-10px">${S.cart.map((it) => lineItem(it, true)).join("")}</div>
                <div style="margin-top:18px" id="co-totals"></div>
                <button class="btn btn-rose btn-lg btn-block" type="submit" id="co-submit" data-magnetic="0.15">${icon("wa")}${btnLabel("Place order on WhatsApp")}</button>
                <p class="co-note">${icon("leaf")} Every piece ships in plastic-free packaging with a handwritten thank-you note.</p>
              </div>
            </aside>
          </form>
        </div>
      </div>`;
    },
    mount(root) {
      const form = root.querySelector("#co-form");
      if (!form) return;
      const totals = () => {
        const sub = S.subtotal(),
          ship = S.shipping(sub);
        root.querySelector("#co-totals").innerHTML = `<div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div><div class="sum-row"><span>Shipping</span><span>${ship ? money(ship) : "Free ✿"}</span></div><div class="sum-row total"><span>Total</span><span>${money(sub + ship)}</span></div>`;
      };
      totals();
      const val = (n) => (form.elements[n] ? form.elements[n].value.trim() : "");
      form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("invalid"));
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let first = null;
        const need = (n, ok, msg) => {
          const f = form.elements[n].closest(".field");
          f.classList.toggle("invalid", !ok);
          f.querySelector(".err").textContent = ok ? "" : msg;
          if (!ok) {
            first = first || form.elements[n];
            f.classList.remove("shake");
            void f.offsetWidth;
            f.classList.add("shake");
          }
        };
        need("name", val("name").length > 1, "Please add your name");
        need("phone", val("phone").replace(/\D/g, "").length >= 10, "Please add a valid 10-digit number");
        if (val("email")) need("email", /^\S+@\S+\.\S+$/.test(val("email")), "That email looks a bit off");
        need("addr", val("addr").length > 6, "We need a full address to deliver");
        need("city", val("city").length > 1, "Which city?");
        need("pin", /^\d{6}$/.test(val("pin")), "PIN codes are 6 digits");
        need("state", !!val("state"), "Choose your state");
        if (first) {
          first.focus();
          FX.scrollTo(first, { offset: -140 });
          return;
        }
        const info = { name: val("name"), phone: val("phone"), email: val("email"), addr: val("addr"), city: val("city"), pin: val("pin"), state: val("state") };
        try {
          localStorage.setItem("yt_addr", JSON.stringify(info));
        } catch (e) {}
        const sub = S.subtotal(),
          ship = S.shipping(sub);
        const order = {
          id: S.newOrderId(),
          date: Date.now(),
          items: S.cart.map((it) => ({ ...it, name: S.product(it.id).name, colorway: S.product(it.id).colorways[it.cw].name, price: S.unitPrice(it) })),
          sub,
          ship,
          total: sub + ship,
          pay: form.elements.pay.value,
          note: val("note"),
          ...info,
        };
        const msg = [
          `Hi ${CFG.brand}! 🧶 I'd like to place an order.`,
          `Order: *${order.id}*`,
          ``,
          ...order.items.map((i) => `• ${i.name} (${i.colorway}) × ${i.qty} = ${money(i.price * i.qty)}${i.nameTag ? `\n   + Name tag: "${i.nameTag}"` : ""}${i.giftWrap ? `\n   + Gift wrap` : ""}`),
          ``,
          `Subtotal: ${money(sub)}`,
          `Shipping: ${ship ? money(ship) : "Free"}`,
          `*Total: ${money(order.total)}*`,
          `Payment: ${order.pay}`,
          ``,
          `Name: ${info.name}`,
          `Phone: ${info.phone}`,
          info.email ? `Email: ${info.email}` : null,
          `Address: ${info.addr}, ${info.city}, ${info.state} - ${info.pin}`,
          order.note ? `Note: ${order.note}` : null,
        ]
          .filter((l) => l !== null)
          .join("\n");
        order.msg = msg;
        S.saveOrder(order);
        window.open(window.YT.waLink(msg), "_blank", "noopener");
        S.clear();
        location.hash = "#/order/" + order.id;
      });
    },
  };

  /* ==========================================================
     ORDER CONFIRMATION
     ========================================================== */
  const order = {
    title: "Order placed",
    render(params) {
      const o = S.getOrder(params.id);
      if (!o) return notfound.render();
      const upi = `upi://pay?pa=${encodeURIComponent(CFG.upiId)}&pn=${encodeURIComponent(CFG.brand)}&am=${o.total}&cu=INR&tn=${encodeURIComponent(o.id)}`;
      return `<div class="view"><div class="container">
        <div class="done-wrap">
          <div class="done-art wiggle-host" data-reveal="scale">${Art.render("bunny", { c1: "#F6EBDD", c2: "#F2B5AE", c3: "#E8837B" })}</div>
          <h1 data-split>Yay, <em>thank you!</em></h1>
          <p data-reveal>Your order was sent to us on WhatsApp. Just hit <b>send</b> in the chat if you haven't yet! We'll confirm everything and share payment details shortly.</p>
          <div class="order-id" data-reveal>Order ${esc(o.id)} · ${money(o.total)}</div>
          <div class="done-actions" data-reveal>
            <a class="btn btn-rose btn-lg" href="${window.YT.waLink(o.msg)}" target="_blank" rel="noopener">${icon("wa")}${btnLabel("Open WhatsApp again")}</a>
            <a class="btn btn-ghost btn-lg" href="mailto:${CFG.email}?subject=${encodeURIComponent("Order " + o.id)}&body=${encodeURIComponent(o.msg)}">${icon("mail")}${btnLabel("Email instead")}</a>
          </div>
          ${o.pay === "UPI" ? `<div class="upi-box" data-reveal><div><b>Paying by UPI?</b><br><span style="color:var(--ink-2);font-size:.92rem">Once we confirm, pay <b>${money(o.total)}</b> to <code>${esc(CFG.upiId)}</code> with note <code>${esc(o.id)}</code></span></div><a class="btn" href="${upi}">${btnLabel("Open UPI app")}</a></div>` : ""}
          <div class="next-steps" data-stagger="up">
            <div><b>1. We confirm</b><p>We'll reply on WhatsApp to confirm stock, shipping and your total.</p></div>
            <div><b>2. You pay</b><p>Pay via ${esc(o.pay)}. We'll share a payment receipt right after.</p></div>
            <div><b>3. Happy mail!</b><p>Your piece is packed with love and shipped with tracking.</p></div>
          </div>
          <div class="mt-24" data-reveal><a href="#/shop" class="link-u">Keep browsing ${icon("arrow")}</a></div>
        </div>
      </div></div>`.replace('<a href="#/shop" class="link-u">Keep browsing <svg class=""', '<a href="#/shop" class="link-u">Keep browsing <svg width="18" height="18" class=""');
    },
    mount(root, params) {
      if (S.getOrder(params.id)) window.YT.ready.then(() => setTimeout(() => FX.confetti(), 500));
    },
  };

  /* ==========================================================
     WISHLIST
     ========================================================== */
  const wishlist = {
    title: "Wishlist",
    render() {
      const items = S.wish.map(S.product).filter(Boolean);
      return `<div class="view"><div class="container">
        <div class="page-head">
          <div class="crumbs" data-reveal><a href="#/">Home</a> / <span>Wishlist</span></div>
          <h1 data-split>Your <em>wishlist</em></h1>
          <p data-reveal>${items.length ? `${items.length} piece${items.length > 1 ? "s" : ""} you've got your eye on. They're saved on this device.` : "Tap the little heart on anything you love and it'll wait for you here."}</p>
        </div>
        <div class="grid" id="wish-grid" data-stagger="up">${items.length ? items.map(card).join("") : emptyState("No hearts yet", "Go on, find something that makes you go “awww”.", `<a href="#/shop" class="btn btn-lg">${btnLabel("Find favourites")}${icon("arrow", "arrow")}</a>`)}</div>
      </div></div>`;
    },
  };

  const notfound = {
    title: "Not found",
    render() {
      return `<div class="view"><div class="container" style="padding-block:100px">${emptyState("Oops, we dropped a stitch", "That page unravelled. Let's get you back on track.", `<a href="#/" class="btn btn-lg">${btnLabel("Back home")}</a>`)}</div></div>`;
    },
  };

  window.YTViews = { home, shop, product, custom, checkout, order, wishlist, notfound, card, lineItem, media, esc, icon, btnLabel };
})();
