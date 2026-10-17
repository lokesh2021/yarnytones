/* ============================================================
   YARNY TONES — HAND-DRAWN CROCHET ILLUSTRATIONS
   Every piece is an SVG coloured with CSS variables (--c1/--c2/--c3),
   so changing a colourway re-tints the drawing with a smooth fade.
   Available: bunny, bear, octopus, tulips, sunflower, tote, bucket,
              beanie, coasters, cactus, mushroom, strawberry, yarn
   ============================================================ */
(function () {
  const INK = "#2B1E2F";
  const CHEEK = "#F49B9B";

  // Rows of stitches that wrap around a round shape, like real amigurumi rounds
  function rows(cx, cy, rx, ry, n, tilt = 0.2) {
    let d = "";
    for (let i = 1; i < n; i++) {
      const t = -1 + (2 * i) / n;
      const y = cy + t * ry;
      const w = rx * Math.sqrt(1 - t * t) * 0.94;
      d += `M${(cx - w).toFixed(1)} ${y.toFixed(1)}Q${cx} ${(y + w * tilt * 2).toFixed(1)} ${(cx + w).toFixed(1)} ${y.toFixed(1)}`;
    }
    return `<path class="st" d="${d}"/>`;
  }
  // Vertical ribbing lines
  function ribs(x1, x2, y1, y2, gap, bend = 0) {
    let d = "";
    for (let x = x1; x <= x2; x += gap) d += `M${x} ${y1}Q${x + bend} ${(y1 + y2) / 2} ${x} ${y2}`;
    return `<path class="st rib" d="${d}"/>`;
  }
  const eye = (x, y, r = 4.6) =>
    `<g class="eye" style="transform-origin:${x}px ${y}px"><circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.34}" fill="#fff"/></g>`;
  const cheeks = (x1, x2, y, rx = 7, ry = 4.2) =>
    `<ellipse cx="${x1}" cy="${y}" rx="${rx}" ry="${ry}" fill="${CHEEK}" opacity=".65"/><ellipse cx="${x2}" cy="${y}" rx="${rx}" ry="${ry}" fill="${CHEEK}" opacity=".65"/>`;
  const smile = (x, y, w = 5) =>
    `<path d="M${x - w} ${y}q${w / 2} ${w * 0.8} ${w} 0q${w / 2} ${w * 0.8} ${w} 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
  const face = (cx, y, spread = 16, cheekY = 12) =>
    eye(cx - spread, y) + eye(cx + spread, y) + cheeks(cx - spread - 9, cx + spread + 9, y + cheekY) + smile(cx, y + 6);
  const shadow = (y = 188, rx = 56) => `<ellipse class="shadow" cx="100" cy="${y}" rx="${rx}" ry="6.5" fill="${INK}" opacity=".09"/>`;
  const hl = (cx, cy, rx, ry, rot = -25) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".22" transform="rotate(${rot} ${cx} ${cy})"/>`;
  const keyring = () =>
    `<g class="ring"><circle cx="100" cy="22" r="13" fill="none" stroke="#B9B1C2" stroke-width="3.5"/><circle cx="100" cy="22" r="13" fill="none" stroke="#fff" stroke-width="1" opacity=".6" stroke-dasharray="6 30"/><ellipse cx="100" cy="39" rx="3.2" ry="5" fill="none" stroke="#B9B1C2" stroke-width="2.5"/></g>`;

  const A = {};

  A.bunny = () => `
    ${shadow(186, 52)}
    <g class="sway">
      <g class="ear-l" style="transform-origin:82px 74px">
        <ellipse class="c1" cx="80" cy="44" rx="14" ry="36" transform="rotate(-12 80 44)"/>
        <ellipse class="c3" cx="80" cy="46" rx="6.5" ry="25" transform="rotate(-12 80 46)" opacity=".55"/>
      </g>
      <g class="ear-r" style="transform-origin:118px 74px">
        <ellipse class="c1" cx="120" cy="44" rx="14" ry="36" transform="rotate(12 120 44)"/>
        <ellipse class="c3" cx="120" cy="46" rx="6.5" ry="25" transform="rotate(12 120 46)" opacity=".55"/>
      </g>
    </g>
    <ellipse class="c1" cx="76" cy="179" rx="15" ry="8.5"/><ellipse class="c1" cx="124" cy="179" rx="15" ry="8.5"/>
    <path class="c2" d="M60 170 Q58 128 80 120 L120 120 Q142 128 140 170 Q100 184 60 170Z"/>
    ${ribs(66, 136, 132, 172, 9)}
    <ellipse class="c1" cx="62" cy="142" rx="9.5" ry="17" transform="rotate(22 62 142)"/>
    <ellipse class="c1" cx="138" cy="142" rx="9.5" ry="17" transform="rotate(-22 138 142)"/>
    <circle class="c1" cx="100" cy="92" r="45"/>
    ${rows(100, 92, 45, 45, 11)}
    ${hl(80, 70, 14, 8)}
    ${face(100, 96, 17, 11)}
    <path d="M96.5 101.5 Q100 99.5 103.5 101.5 Q100 106 96.5 101.5Z" fill="#E07B7B"/>
    <g class="bow" style="transform-origin:128px 58px">
      <path class="c3" d="M128 58 L112 47 Q109 58 112 69Z"/><path class="c3" d="M128 58 L144 47 Q147 58 144 69Z"/>
      <circle class="c3" cx="128" cy="58" r="5.5"/><circle cx="128" cy="58" r="5.5" fill="#000" opacity=".12"/>
    </g>`;

  A.bear = () => `
    ${shadow(186, 54)}
    <circle class="c1" cx="62" cy="56" r="18"/><circle class="c2" cx="62" cy="56" r="9"/>
    <circle class="c1" cx="138" cy="56" r="18"/><circle class="c2" cx="138" cy="56" r="9"/>
    <ellipse class="c1" cx="74" cy="178" rx="17" ry="10"/><ellipse class="c1" cx="126" cy="178" rx="17" ry="10"/>
    <ellipse class="c2" cx="74" cy="179" rx="9" ry="5.5"/><ellipse class="c2" cx="126" cy="179" rx="9" ry="5.5"/>
    <ellipse class="c1" cx="100" cy="150" rx="45" ry="34"/>
    <ellipse class="c2" cx="100" cy="156" rx="25" ry="20"/>
    ${rows(100, 150, 45, 34, 7)}
    <ellipse class="c1" cx="58" cy="146" rx="11" ry="18" transform="rotate(25 58 146)"/>
    <ellipse class="c1" cx="142" cy="146" rx="11" ry="18" transform="rotate(-25 142 146)"/>
    <circle class="c1" cx="100" cy="90" r="47"/>
    ${rows(100, 90, 47, 47, 12)}
    ${hl(78, 66, 15, 8)}
    <ellipse class="c2" cx="100" cy="106" rx="19" ry="14"/>
    <ellipse cx="100" cy="100" rx="6.5" ry="4.8" fill="${INK}"/>
    ${smile(100, 107, 4.5)}
    ${eye(82, 88)}${eye(118, 88)}${cheeks(70, 130, 102)}
    <g class="scarf">
      <path class="c3" d="M58 124 Q100 144 142 124 L144 137 Q100 158 56 137Z"/>
      <path class="c3" d="M118 138 L130 176 L116 178 L108 142Z"/>
      ${ribs(112, 128, 146, 174, 5, 1)}
      <path d="M58 130 Q100 150 142 130" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.6" stroke-dasharray="3 3"/>
    </g>`;

  A.octopus = () => {
    let arms = "";
    const xs = [56, 72, 88, 112, 128, 144];
    xs.forEach((x, i) => {
      const dir = x < 100 ? -1 : 1;
      arms += `<path class="arm s1" style="--i:${i}" d="M${x} 116 Q${x + dir * 6} 150 ${x + dir * 12} 162 q${dir * 9} 7 ${dir * 13} -4 q2 -7 -4 -8" fill="none" stroke-width="15" stroke-linecap="round"/>`;
    });
    arms += `<path class="s1" d="M94 120 Q92 156 98 172 q4 8 8 0" fill="none" stroke-width="15" stroke-linecap="round"/>`;
    return `
    ${shadow(188, 62)}
    ${arms}
    <path class="c1" d="M42 120 C34 34 166 34 158 120 Q100 136 42 120Z"/>
    ${rows(100, 90, 54, 32, 8, 0.16)}
    ${hl(74, 72, 16, 9)}
    <circle class="c2" cx="70" cy="80" r="4" opacity=".75"/><circle class="c2" cx="132" cy="74" r="5" opacity=".75"/><circle class="c2" cx="118" cy="62" r="3" opacity=".75"/>
    ${face(100, 98, 17, 10)}
    <g class="flower" style="transform-origin:128px 56px">
      ${[0, 72, 144, 216, 288].map((a) => `<circle class="c3" cx="${128 + 8 * Math.cos((a * Math.PI) / 180)}" cy="${56 + 8 * Math.sin((a * Math.PI) / 180)}" r="6"/>`).join("")}
      <circle cx="128" cy="56" r="5" fill="#F6D27A"/>
    </g>`;
  };

  function tulip(x, y, rot, s = 1) {
    return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" class="bloom">
      <path class="c1" d="M-15 0 Q-18 -24 -9 -30 L-4 -16 L0 -32 L4 -16 L9 -30 Q18 -24 15 0 Q0 12 -15 0Z"/>
      <path d="M0 -32 L4 -16 L9 -30 Q18 -24 15 0 Q8 5 2 6Z" fill="#000" opacity=".08"/>
      <path class="st" d="M-12 -6Q0 2 12 -6M-13 -14Q0 -6 13 -14"/>
    </g>`;
  }
  A.tulips = () => `
    ${shadow(190, 40)}
    <g class="stems" fill="none" stroke="#6E9A68" stroke-width="5" stroke-linecap="round">
      <path d="M70 62 Q80 110 98 160"/><path d="M100 46 Q100 110 100 160"/><path d="M132 66 Q120 110 102 160"/>
    </g>
    <path d="M86 128 Q60 112 62 92 Q80 104 94 126Z" fill="#7FA67A"/>
    <path d="M114 124 Q140 108 142 88 Q122 100 108 122Z" fill="#7FA67A"/>
    <g class="sway">${tulip(70, 64, -16)}${tulip(100, 48, 0, 1.08)}${tulip(132, 68, 16)}</g>
    <path class="c2" d="M50 104 L100 190 L150 104 Q125 116 100 108 Q75 116 50 104Z"/>
    <path d="M100 108 L100 190 L150 104 Q125 116 100 108Z" fill="#000" opacity=".06"/>
    <path class="st" d="M62 122 Q100 138 138 122M74 144 Q100 156 126 144"/>
    <g class="ribbon">
      <path class="c3" d="M100 150 L80 140 Q76 152 80 162Z"/><path class="c3" d="M100 150 L120 140 Q124 152 120 162Z"/>
      <path class="c3" d="M98 152 L88 180 L94 178 L100 154Z"/><path class="c3" d="M102 152 L112 180 L106 178 L100 154Z"/>
      <circle class="c3" cx="100" cy="151" r="5"/><circle cx="100" cy="151" r="5" fill="#000" opacity=".14"/>
    </g>`;

  A.sunflower = () => {
    let petals = "";
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * 360;
      petals += `<ellipse class="c1" cx="100" cy="36" rx="9" ry="19" transform="rotate(${a} 100 66)"/>`;
    }
    return `
    ${shadow(190, 40)}
    <path d="M100 96 Q96 120 100 142" fill="none" stroke="#6E9A68" stroke-width="6" stroke-linecap="round"/>
    <path d="M99 124 Q76 122 70 104 Q90 104 99 120Z" fill="#7FA67A"/><path d="M101 116 Q124 112 130 96 Q110 96 101 112Z" fill="#7FA67A"/>
    <g class="spin-slow" style="transform-origin:100px 66px">${petals}</g>
    <circle class="c2" cx="100" cy="66" r="22"/>
    ${rows(100, 66, 22, 22, 6, 0.12)}
    ${eye(92, 63, 3.4)}${eye(108, 63, 3.4)}${cheeks(84, 116, 71, 4.5, 2.8)}${smile(100, 69, 3.5)}
    <path class="c3" d="M66 140 L134 140 L126 186 Q100 192 74 186Z"/>
    <path d="M100 140 L134 140 L126 186 Q113 189 100 190Z" fill="#000" opacity=".07"/>
    <rect class="c3" x="60" y="132" width="80" height="16" rx="5"/>
    <rect x="60" y="132" width="80" height="16" rx="5" fill="#000" opacity=".1"/>
    ${ribs(70, 130, 152, 182, 8)}`;
  };

  function granny(x, y, a, b) {
    return `<g transform="translate(${x} ${y})">
      <rect class="${a}" width="50" height="50" rx="4"/>
      <rect class="${b}" x="8" y="8" width="34" height="34" rx="3"/>
      <rect x="16" y="16" width="18" height="18" rx="3" fill="#FFF8EC"/>
      <circle class="${a}" cx="25" cy="25" r="5"/>
      <rect x="4" y="4" width="42" height="42" rx="3" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="2" stroke-dasharray="5 3"/>
      <rect x="12" y="12" width="26" height="26" rx="2" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2" stroke-dasharray="4 3"/>
    </g>`;
  }
  A.tote = () => `
    ${shadow(192, 66)}
    <g class="handles" fill="none" stroke-linecap="round">
      <path class="s1" d="M66 78 C64 28 136 28 134 78" stroke-width="10"/>
      <path d="M66 78 C64 28 136 28 134 78" stroke="#000" stroke-opacity=".12" stroke-width="2" stroke-dasharray="3 3"/>
    </g>
    <rect class="c1" x="38" y="70" width="124" height="118" rx="12"/>
    <rect x="38" y="70" width="124" height="118" rx="12" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="2"/>
    ${granny(44, 78, "c2", "c3")}${granny(106, 78, "c3", "c2")}
    ${granny(44, 132, "c3", "c2")}${granny(106, 132, "c2", "c3")}
    <path d="M100 74 V186 M42 130 H158" stroke="#000" stroke-opacity=".1" stroke-width="2" stroke-dasharray="3 3"/>`;

  A.bucket = () => `
    ${shadow(178, 70)}
    <path class="c1" d="M28 128 Q100 96 172 128 Q182 150 150 158 Q100 170 50 158 Q18 150 28 128Z"/>
    <path d="M28 128 Q100 96 172 128 Q182 150 150 158 Q100 170 50 158 Q18 150 28 128Z" fill="#000" opacity=".07"/>
    <path class="st" d="M38 136 Q100 112 162 136 M44 148 Q100 128 156 148"/>
    <path class="c1" d="M56 128 Q52 58 100 54 Q148 58 144 128 Q100 140 56 128Z"/>
    ${rows(100, 92, 44, 38, 8, 0.14)}
    ${hl(80, 74, 14, 8)}
    <path class="c3" d="M56 110 Q100 124 144 110 L145 126 Q100 140 55 126Z"/>
    <g class="flower daisy" style="transform-origin:122px 116px">
      ${Array.from({ length: 8 }, (_, i) => `<ellipse class="c2" cx="122" cy="107" rx="3.6" ry="7" transform="rotate(${i * 45} 122 116)"/>`).join("")}
      <circle cx="122" cy="116" r="4.2" fill="#F6D27A"/>
    </g>`;

  A.beanie = () => {
    let fluff = "";
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      fluff += `<circle class="c3" cx="${(100 + 21 * Math.cos(a)).toFixed(1)}" cy="${(40 + 21 * Math.sin(a)).toFixed(1)}" r="6.5"/>`;
    }
    return `
    ${shadow(182, 62)}
    <g class="pom" style="transform-origin:100px 58px">${fluff}<circle class="c3" cx="100" cy="40" r="22"/>
      <path d="M86 32 l6 4 M96 26 l4 6 M108 30 l-3 6 M90 46 l6 -2 M104 44 l6 4 M112 38 l-5 2" stroke="#000" stroke-opacity=".12" stroke-width="2" stroke-linecap="round"/></g>
    <path class="c1" d="M46 140 Q44 62 100 58 Q156 62 154 140Z"/>
    ${ribs(56, 146, 74, 136, 9, 0)}
    ${hl(76, 84, 14, 9)}
    <rect class="c2" x="38" y="126" width="124" height="44" rx="14"/>
    <path class="st rib thick" d="${Array.from({ length: 14 }, (_, i) => `M${48 + i * 8} 132 V164`).join("")}"/>
    <rect x="118" y="136" width="22" height="16" rx="3" fill="#FFF8EC"/><path d="M123 144 l4 3 l7 -6" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
  };

  function daisy(cx, cy, r, petal = "c1", center = "c2", base = "c3") {
    let p = "";
    const n = 10;
    for (let i = 0; i < n; i++) p += `<ellipse class="${petal}" cx="${cx}" cy="${cy - r * 0.52}" rx="${r * 0.17}" ry="${r * 0.36}" transform="rotate(${(i * 360) / n} ${cx} ${cy})"/>`;
    return `<circle class="${base}" cx="${cx}" cy="${cy}" r="${r}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.92}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2" stroke-dasharray="4 3"/>
      <g class="spin-slow" style="transform-origin:${cx}px ${cy}px">${p}</g>
      <circle class="${center}" cx="${cx}" cy="${cy}" r="${r * 0.26}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.6" stroke-dasharray="2 2"/>`;
  }
  A.coasters = () => `
    ${shadow(186, 64)}
    ${daisy(136, 62, 42)}
    ${daisy(160, 140, 28)}
    ${daisy(86, 118, 62)}
    ${hl(64, 88, 14, 7)}`;

  A.cactus = () => `
    ${shadow(190, 46)}
    <path class="c1" d="M76 116 L62 116 Q50 116 50 104 L50 84 Q50 74 60 74 Q70 74 70 84 L70 100 L76 100Z"/>
    <path class="c1" d="M124 104 L138 104 Q150 104 150 92 L150 70 Q150 60 140 60 Q130 60 130 70 L130 88 L124 88Z"/>
    <rect class="c1" x="72" y="46" width="56" height="104" rx="28"/>
    ${ribs(80, 120, 52, 146, 10, 0)}
    ${hl(86, 64, 6, 14, 0)}
    <g stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".85">
      <path d="M78 74 l-5 -3M122 82 l5 -3M78 112 l-5 -2M122 124 l5 -2M54 92 l-5 -1M146 78 l5 -1"/>
    </g>
    ${face(100, 92, 12, 9)}
    <g class="flower" style="transform-origin:100px 44px">
      ${[0, 72, 144, 216, 288].map((a) => `<circle class="c3" cx="${(100 + 7 * Math.cos(((a - 90) * Math.PI) / 180)).toFixed(1)}" cy="${(44 + 7 * Math.sin(((a - 90) * Math.PI) / 180)).toFixed(1)}" r="5.6"/>`).join("")}
      <circle cx="100" cy="44" r="4.4" fill="#F6D27A"/>
    </g>
    <ellipse cx="100" cy="148" rx="38" ry="6" fill="#6B4A3A"/>
    <path class="c2" d="M62 148 L138 148 L130 188 Q100 194 70 188Z"/>
    <path d="M100 148 L138 148 L130 188 Q115 191 100 192Z" fill="#000" opacity=".07"/>
    <rect class="c2" x="56" y="140" width="88" height="16" rx="5"/><rect x="56" y="140" width="88" height="16" rx="5" fill="#000" opacity=".1"/>
    ${ribs(68, 132, 160, 184, 8)}`;

  A.mushroom = () => `
    ${shadow(186, 40)}
    ${keyring()}
    <path class="c2" d="M76 104 Q70 160 82 170 Q100 178 118 170 Q130 160 124 104Z"/>
    ${rows(100, 138, 24, 32, 7, 0.1)}
    ${face(100, 136, 10, 8)}
    <path class="c1" d="M36 112 Q36 46 100 44 Q164 46 164 112 Q100 128 36 112Z"/>
    ${rows(100, 82, 62, 34, 7, 0.14)}
    ${hl(74, 64, 15, 8)}
    <circle class="c3" cx="70" cy="86" r="8"/><circle class="c3" cx="104" cy="64" r="9.5"/><circle class="c3" cx="136" cy="90" r="7"/><circle class="c3" cx="96" cy="98" r="5"/><circle class="c3" cx="126" cy="62" r="4.5"/>`;

  A.strawberry = () => {
    let seeds = "";
    const pts = [[78, 96], [100, 92], [122, 96], [70, 118], [90, 116], [110, 116], [130, 118], [80, 138], [100, 138], [120, 138], [90, 158], [110, 158]];
    pts.forEach(([x, y], i) => (seeds += `<ellipse class="c3" cx="${x}" cy="${y}" rx="2.4" ry="3.6" transform="rotate(${i % 2 ? 14 : -14} ${x} ${y})"/>`));
    return `
    ${shadow(190, 40)}
    ${keyring()}
    <path class="c1" d="M100 182 C58 162 42 122 50 92 Q58 68 100 72 Q142 68 150 92 C158 122 142 162 100 182Z"/>
    ${rows(100, 124, 50, 56, 9, 0.14)}
    ${hl(72, 98, 12, 7)}
    ${seeds}
    ${face(100, 122, 13, 9)}
    <g class="leaves" style="transform-origin:100px 72px">
      <path class="c2" d="M100 76 L80 66 L90 62 L84 52 L98 58 L100 46 L102 58 L116 52 L110 62 L120 66Z"/>
      <path d="M100 48 L100 76" stroke="#000" stroke-opacity=".15" stroke-width="2"/>
    </g>`;
  };

  A.yarn = () => `
    ${shadow(178, 54)}
    <path class="s1 tail" d="M150 150 Q176 158 170 176 Q164 190 186 192" fill="none" stroke-width="5" stroke-linecap="round"/>
    <circle class="c1" cx="100" cy="104" r="62"/>
    <g fill="none" stroke-linecap="round" stroke-width="5">
      <path class="s2" d="M52 70 Q100 110 120 166"/><path class="s2" d="M42 92 Q96 120 106 168"/><path class="s2" d="M68 52 Q118 98 140 156"/>
      <path class="s3" d="M140 58 Q88 92 62 156"/><path class="s3" d="M156 82 Q110 112 86 164"/><path class="s3" d="M122 46 Q76 82 48 132"/>
    </g>
    <circle cx="100" cy="104" r="62" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="3"/>
    ${hl(76, 76, 18, 10)}`;

  const ALIASES = { yarn: "yarn" };

  let uid = 0;
  /**
   * Render an illustration.
   * @param {string} type  key of A
   * @param {{c1,c2,c3}} colors
   * @param {object} opts  { cls, label, fuzz }
   */
  function render(type, colors = {}, opts = {}) {
    const fn = A[type] || A[ALIASES[type]] || A.yarn;
    const c = { c1: "#F6EBDD", c2: "#F2B5AE", c3: "#E8837B", ...colors };
    uid++;
    const label = opts.label ? `<title>${opts.label}</title>` : "";
    return `<svg class="art art-${type} ${opts.cls || ""}" viewBox="0 0 200 200" role="img" aria-label="${opts.label || type}" style="--c1:${c.c1};--c2:${c.c2};--c3:${c.c3}" data-art="${type}">${label}<g class="art-body"${opts.fuzz === false ? "" : ' filter="url(#yt-fuzz)"'}>${fn()}</g></svg>`;
  }

  // Recolour an existing svg without re-rendering (smooth transition)
  function recolor(svg, colors) {
    if (!svg) return;
    ["c1", "c2", "c3"].forEach((k) => colors[k] && svg.style.setProperty("--" + k, colors[k]));
  }

  // A yarn ball, used in the logo, loaders and add-to-cart flights
  function yarnBall(color = "#E8837B", size = 40, cls = "") {
    return `<svg class="yarnball ${cls}" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" style="--yc:${color}">
      <circle cx="20" cy="20" r="17" fill="var(--yc)"/>
      <g fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round">
        <path d="M6 14 Q20 20 25 36"/><path d="M4 22 Q17 26 18 37"/><path d="M11 6 Q24 16 31 33"/>
        <path d="M30 6 Q17 14 10 32"/><path d="M36 16 Q24 22 20 37"/>
      </g>
      <circle cx="20" cy="20" r="17" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>
    </svg>`;
  }

  window.YTArt = { render, recolor, yarnBall, types: Object.keys(A) };
})();
