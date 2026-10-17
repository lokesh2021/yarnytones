/* ============================================================
   YARNEY TONES — MOTION & DELIGHT
   Reveal-on-scroll, split text, magnetic buttons, card tilt,
   the dangling yarn cursor, fly-to-bag, confetti and friends.
   ============================================================ */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- one shared animation loop ---------- */
  const tickers = new Set();
  let lenis = null;
  let velocity = 0;
  let lastY = window.scrollY;

  function frame(t) {
    const y = window.scrollY;
    velocity = lerp(velocity, y - lastY, 0.2);
    lastY = y;
    tickers.forEach((fn) => fn(t));
  }

  function startLoop() {
    if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis && lenis.raf(time * 1000);
        frame(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const loop = (t) => {
        lenis && lenis.raf(t);
        frame(t);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  function initSmoothScroll() {
    if (reduced || !window.Lenis) return null;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1 });
    if (window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    return lenis;
  }

  function scrollTo(target, opts = {}) {
    const offset = opts.offset ?? -80;
    if (lenis) return lenis.scrollTo(target, { offset, immediate: !!opts.immediate, duration: opts.duration || 1.4, force: true });
    const y = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: opts.immediate || reduced ? "auto" : "smooth" });
  }
  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
    if (lenis) on ? lenis.stop() : lenis.start();
  }

  /* ---------- split text into words ---------- */
  function splitText(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = 1;
    let i = 0;
    const wrap = (child) => {
      const w = document.createElement("span");
      w.className = "w";
      const inner = document.createElement("span");
      inner.style.setProperty("--wi", i++);
      w.append(inner);
      if (typeof child === "string") inner.textContent = child;
      else {
        child.replaceWith(w);
        inner.append(child);
      }
      return w;
    };
    const walk = (node) => {
      [...node.childNodes].forEach((ch) => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) frag.append(" ");
            else frag.append(wrap(p));
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== "BR") {
          if (ch.hasAttribute("data-unit")) wrap(ch);
          else walk(ch);
        }
      });
    };
    walk(el);
    el.classList.add("split");
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("in");
        io.unobserve(el);
        if (el.classList.contains("split")) setTimeout(() => el.classList.add("done"), 1600);
        el.dispatchEvent(new CustomEvent("reveal"));
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  function reveal(root = document) {
    root.querySelectorAll("[data-stagger]").forEach((p) => {
      [...p.children].forEach((c, i) => {
        if (!c.hasAttribute("data-reveal")) c.setAttribute("data-reveal", p.dataset.stagger || "");
        c.style.setProperty("--i", i);
      });
    });
    root.querySelectorAll("[data-split]").forEach(splitText);
    root.querySelectorAll("[data-reveal]:not(.in), [data-split]:not(.in):not([data-manual]), [data-observe]:not(.in)").forEach((el) => io.observe(el));
  }

  /* ---------- magnetic buttons ---------- */
  function magnetic(root = document) {
    if (!fine || reduced) return;
    root.querySelectorAll("[data-magnetic]").forEach((el) => {
      if (el._mag) return;
      el._mag = true;
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transition = "transform .25s cubic-bezier(.22,1,.36,1)";
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform .8s cubic-bezier(.34,1.56,.64,1)";
        el.style.transform = "";
      });
    });
  }

  /* ---------- 3D tilt on product media ---------- */
  function tilt(root = document) {
    if (!fine || reduced) return;
    root.querySelectorAll("[data-tilt]").forEach((el) => {
      if (el._tilt) return;
      el._tilt = true;
      const max = parseFloat(el.dataset.tilt) || 7;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-6px)`;
        el.style.setProperty("--gx", px * 100 + "%");
        el.style.setProperty("--gy", py * 100 + "%");
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }

  /* ---------- custom cursor label + dangling yarn ---------- */
  const pointer = { x: -100, y: -100, inside: false, moved: 0 };
  function initCursor() {
    const CFG = window.YT_CONFIG || {};
    if (!fine || reduced) {
      document.getElementById("yarn-trail")?.remove();
      return;
    }
    const cur = document.getElementById("cursor");
    const label = cur.querySelector(".cursor-label");
    let cx = -100,
      cy = -100;

    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
      pointer.moved = performance.now();
      cur.classList.add("visible");
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      pointer.inside = false;
      cur.classList.remove("visible");
    });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) {
        label.textContent = t.dataset.cursor;
        cur.classList.add("has-label");
      } else cur.classList.remove("has-label");
    });
    tickers.add(() => {
      cx = lerp(cx, pointer.x, 0.22);
      cy = lerp(cy, pointer.y, 0.22);
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
    });

    if (CFG.yarnCursor === false) return document.getElementById("yarn-trail")?.remove();
    yarnTrail();
  }

  function yarnTrail() {
    const canvas = document.getElementById("yarn-trail");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = 26,
      SEG = 6.5;
    let pts = [];
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const init = (x, y) => (pts = Array.from({ length: N }, (_, i) => ({ x, y: y + i * SEG, px: x, py: y + i * SEG })));
    init(-100, -100);
    let started = false;
    let alpha = 0;

    tickers.add(() => {
      if (!pointer.inside && alpha <= 0.01) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      if (!started && pointer.inside) {
        init(pointer.x, pointer.y);
        started = true;
      }
      const idle = performance.now() - pointer.moved > 2500;
      alpha = lerp(alpha, pointer.inside && !idle ? 1 : 0, 0.06);
      // verlet integration
      pts[0].x = pointer.x;
      pts[0].y = pointer.y;
      for (let i = 1; i < N; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * 0.94,
          vy = (p.y - p.py) * 0.94;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + 0.32;
      }
      for (let k = 0; k < 4; k++) {
        for (let i = 1; i < N; i++) {
          const a = pts[i - 1],
            b = pts[i];
          const dx = b.x - a.x,
            dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.001;
          const diff = (d - SEG) / d;
          if (i === 1) {
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else {
            a.x += dx * diff * 0.5;
            a.y += dy * diff * 0.5;
            b.x -= dx * diff * 0.5;
            b.y -= dy * diff * 0.5;
          }
        }
        pts[0].x = pointer.x;
        pts[0].y = pointer.y;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = alpha;
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < N - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2,
            my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        ctx.lineTo(pts[N - 1].x, pts[N - 1].y);
      };
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      path();
      ctx.strokeStyle = "#E8837B";
      ctx.lineWidth = 3.2;
      ctx.setLineDash([]);
      ctx.stroke();
      path();
      ctx.strokeStyle = "rgba(255,255,255,.55)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      // frayed tail end
      const t = pts[N - 1];
      ctx.setLineDash([]);
      ctx.fillStyle = "#E8837B";
      ctx.beginPath();
      ctx.arc(t.x, t.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  /* ---------- fly to bag ---------- */
  function flyToCart(fromEl, color = "#E8837B") {
    const target = document.getElementById("cart-open");
    if (!fromEl || !target) return Promise.resolve();
    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const sx = a.left + a.width / 2 - 23,
      sy = a.top + a.height / 2 - 23;
    const ex = b.left + b.width / 2 - 23,
      ey = b.top + b.height / 2 - 23;
    if (reduced) return Promise.resolve(bump(target));
    const el = document.createElement("div");
    el.className = "flyer";
    el.innerHTML = window.YTArt.yarnBall(color, 46);
    document.body.append(el);
    const cx = (sx + ex) / 2 + (ex > sx ? -80 : 80),
      cy = Math.min(sy, ey) - 180;
    const frames = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
      const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
      const s = t < 0.15 ? 0.4 + t * 5 : 1.15 - t * 0.75;
      frames.push({ transform: `translate(${x}px, ${y}px) rotate(${t * 720}deg) scale(${s})`, offset: t });
    }
    const anim = el.animate(frames, { duration: 900, easing: "cubic-bezier(.45,.05,.55,.95)" });
    return anim.finished.then(() => {
      el.remove();
      bump(target);
      burst(b.left + b.width / 2, b.top + b.height / 2, [color, "#F6D27A", "#9DB59A"]);
    });
  }
  function bump(el) {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  /* ---------- particle burst ---------- */
  function burst(x, y, colors = ["#E8837B", "#F6D27A", "#C9B6E4"], n = 12) {
    if (reduced) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "burst-p";
      const size = 5 + Math.random() * 6;
      p.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;background:${colors[i % colors.length]}`;
      document.body.append(p);
      const ang = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 28 + Math.random() * 30;
      p.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px) scale(0)`, opacity: 0.2 },
        ],
        { duration: 650 + Math.random() * 250, easing: "cubic-bezier(.22,1,.36,1)" }
      ).finished.then(() => p.remove());
    }
  }

  /* ---------- confetti (little yarn balls & flowers) ---------- */
  function confetti(opts = {}) {
    if (reduced) return;
    const c = document.createElement("canvas");
    c.id = "confetti";
    document.body.append(c);
    const ctx = c.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    c.width = innerWidth * dpr;
    c.height = innerHeight * dpr;
    c.style.width = innerWidth + "px";
    c.style.height = innerHeight + "px";
    ctx.scale(dpr, dpr);
    const colors = opts.colors || ["#E8837B", "#F6D27A", "#9DB59A", "#C9B6E4", "#A9CFE0", "#F4C2C2"];
    const parts = Array.from({ length: opts.count || 140 }, (_, i) => {
      const fromLeft = i % 2 === 0;
      return {
        x: fromLeft ? -10 : innerWidth + 10,
        y: innerHeight * (0.55 + Math.random() * 0.3),
        vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 10),
        vy: -(10 + Math.random() * 12),
        r: 4 + Math.random() * 6,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[i % colors.length],
        kind: i % 5 === 0 ? "flower" : i % 3 === 0 ? "squiggle" : "ball",
      };
    });
    const start = performance.now();
    const draw = (now) => {
      const t = now - start;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach((p) => {
        p.vy += 0.38;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = clamp(1 - (t - 2200) / 800, 0, 1);
        ctx.fillStyle = p.c;
        ctx.strokeStyle = p.c;
        if (p.kind === "ball") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, 7);
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(-p.r * 0.3, 0, p.r * 0.7, -1, 1);
          ctx.stroke();
        } else if (p.kind === "flower") {
          for (let k = 0; k < 5; k++) {
            ctx.beginPath();
            ctx.arc(Math.cos((k * 2 * Math.PI) / 5) * p.r * 0.7, Math.sin((k * 2 * Math.PI) / 5) * p.r * 0.7, p.r * 0.5, 0, 7);
            ctx.fill();
          }
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 0.35, 0, 7);
          ctx.fill();
        } else {
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-p.r * 1.4, 0);
          ctx.bezierCurveTo(-p.r * 0.5, -p.r, p.r * 0.5, p.r, p.r * 1.4, 0);
          ctx.stroke();
        }
        ctx.restore();
      });
      if (t < 3000) requestAnimationFrame(draw);
      else c.remove();
    };
    requestAnimationFrame(draw);
  }

  /* ---------- numbers ---------- */
  function countUp(el, to, { duration = 1800, format = (n) => Math.round(n).toLocaleString("en-IN"), from = 0 } = {}) {
    if (reduced) return (el.textContent = format(to));
    const start = performance.now();
    const step = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const e = 1 - Math.pow(1 - t, 4);
      el.textContent = format(from + (to - from) * e);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function tweenNumber(el, to, format, duration = 600) {
    const from = parseFloat(el.dataset.v || 0);
    el.dataset.v = to;
    countUp(el, to, { from, format, duration });
  }

  /* ---------- velocity-aware marquee ---------- */
  function marquee(el, { speed = 0.6, direction = -1 } = {}) {
    const track = el.querySelector(".marquee-track");
    const item = track.firstElementChild;
    // duplicate until it overflows comfortably
    const fill = () => {
      while (track.scrollWidth < innerWidth * 2.5) track.append(item.cloneNode(true));
    };
    fill();
    let x = 0;
    let dir = direction;
    const fn = () => {
      if (!el.isConnected) return tickers.delete(fn);
      const w = item.offsetWidth;
      if (velocity > 0.5) dir = direction;
      else if (velocity < -0.5) dir = -direction;
      const v = reduced ? 0 : (speed + Math.min(Math.abs(velocity) * 0.25, 12)) * dir;
      x += v;
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      track.style.transform = `translate3d(${x}px,0,0)`;
    };
    tickers.add(fn);
  }

  /* ---------- segmented control pill ---------- */
  function segPill(seg) {
    const pill = seg.querySelector(".seg-pill");
    const on = seg.querySelector("button.on");
    if (!pill || !on) return;
    pill.style.left = on.offsetLeft + "px";
    pill.style.width = on.offsetWidth + "px";
  }

  /* ---------- FLIP for filtering grids ---------- */
  function flip(container, mutate) {
    const items = [...container.children];
    const first = new Map(items.map((el) => [el, el.getBoundingClientRect()]));
    mutate();
    if (reduced) return;
    [...container.children].forEach((el, i) => {
      const f = first.get(el);
      const l = el.getBoundingClientRect();
      if (el.classList.contains("flip-hide")) return;
      if (!f || f.width === 0) {
        el.animate([{ opacity: 0, transform: "scale(.85) translateY(30px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: i * 25, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "backwards" });
        return;
      }
      const dx = f.left - l.left,
        dy = f.top - l.top;
      if (dx || dy) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" });
    });
  }

  /* ---------- swipeable polaroid stack ---------- */
  function stack(el, { onChange } = {}) {
    let cards = [...el.querySelectorAll(".polaroid")];
    const layout = () => {
      cards.forEach((c, i) => {
        c.style.zIndex = cards.length - i;
        const rot = [-2, 4, -5, 3, -3][i % 5];
        c.style.transform = i === 0 ? "rotate(-1.5deg)" : `translate(${i * 6}px, ${i * 8}px) rotate(${rot}deg) scale(${1 - i * 0.03})`;
        c.style.opacity = i > 3 ? 0 : 1;
        c.setAttribute("aria-hidden", i === 0 ? "false" : "true");
      });
    };
    const next = (dirX = 1) => {
      const top = cards[0];
      top.style.transform = `translate(${dirX * 140}%, -10%) rotate(${dirX * 25}deg)`;
      top.style.opacity = 0;
      setTimeout(() => {
        cards.push(cards.shift());
        top.style.transition = "none";
        layout();
        top.style.opacity = 0;
        requestAnimationFrame(() => {
          top.style.transition = "";
          layout();
        });
        onChange && onChange();
      }, 350);
    };
    const prev = () => {
      cards.unshift(cards.pop());
      const top = cards[0];
      top.style.transition = "none";
      top.style.transform = "translate(-140%, -10%) rotate(-25deg)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          top.style.transition = "";
          layout();
        });
      });
    };
    let sx = 0,
      sy = 0,
      dragging = false,
      dx = 0;
    el.addEventListener("pointerdown", (e) => {
      const top = cards[0];
      if (!top.contains(e.target)) return;
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      dx = 0;
      top.classList.add("dragging");
      top.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - sx;
      const dy = e.clientY - sy;
      cards[0].style.transform = `translate(${dx}px, ${dy * 0.3}px) rotate(${dx * 0.06}deg)`;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      cards[0].classList.remove("dragging");
      if (Math.abs(dx) > 90) next(Math.sign(dx));
      else layout();
    };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    layout();
    return { next: () => next(1), prev };
  }

  window.YTFX = {
    reduced,
    fine,
    tickers,
    get lenis() {
      return lenis;
    },
    get velocity() {
      return velocity;
    },
    startLoop,
    initSmoothScroll,
    scrollTo,
    lockScroll,
    splitText,
    reveal,
    magnetic,
    tilt,
    initCursor,
    flyToCart,
    burst,
    bump,
    confetti,
    countUp,
    tweenNumber,
    marquee,
    segPill,
    flip,
    stack,
    clamp,
    lerp,
  };
})();
