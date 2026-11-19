// Рисованные схемы тренажёра: подписи перетаскивают к цифрам, после верного ответа схема «оживает».
// Рисовал Claude (схематично, как в учебнике), учитель биологии не проверял. id должны совпадать с app/trainer.py (DRAWN_IDS).
(function () {
const T = (d, w, cls = "") => `<path class="to" d="${d}" stroke-width="${w}"/><path class="ti ${cls}" d="${d}" stroke-width="${w - 5}"/>`;
const L = (n, px, py, lx, ly) => `<g class="lab"><line x1="${px}" y1="${py}" x2="${lx}" y2="${ly}"/><circle class="pt" cx="${px}" cy="${py}" r="2.6"/>` +
  `<circle class="nc" cx="${lx}" cy="${ly}" r="11"/><text x="${lx}" y="${ly}">${n}</text></g>`;
// точка, бегущая по пути (SMIL: запускается кнопкой «Проверить», data-d — задержка в секундах)
const flow = (cls, path, dur, n) => Array.from({length: n}, (_, i) =>
  `<circle class="flow ${cls}" r="4.5"><animateMotion begin="indefinite" data-d="${(dur / n * i).toFixed(2)}" dur="${dur}s" repeatCount="indefinite" path="${path}"/></circle>`).join("");
const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`;

// ---------- сердце ----------
const heart = svg(430, 440, `
<g class="pa">${T("M38,118 L405,118 M193,118 L193,258", 22, "ven")}</g>
<g>${T("M222,262 L222,75 C222,22 367,22 367,75 L367,135", 26, "art")}</g>
<g>${T("M107,22 L107,165", 24, "ven")}${T("M90,238 L90,435", 24, "ven")}</g>
<g>${T("M338,168 L405,168 M338,205 L405,205", 18, "art")}</g>
<g class="atria">
  <path class="ch ven" d="M180,160 C170,138 110,133 85,160 C68,180 68,225 80,248 L180,248 Z"/>
  <path class="ch art" d="M235,160 C245,138 305,133 330,158 C348,178 350,225 340,248 L235,248 Z"/>
</g>
<g class="vent">
  <path class="ch ven" d="M108,258 L204,258 L204,392 C160,382 115,335 108,258 Z"/>
  <path class="ch art lv" d="M216,258 L345,258 C350,330 300,395 222,418 L216,418 Z"/>
</g>
<path class="flap fl" style="transform-origin:120px 253px" d="M120,253 L133,282"/>
<path class="flap fr" style="transform-origin:168px 253px" d="M168,253 L155,282"/>
<path class="flap fl" style="transform-origin:265px 253px" d="M265,253 L278,282"/>
<path class="flap fr" style="transform-origin:318px 253px" d="M318,253 L305,282"/>
${flow("ven", "M107,22 L107,185 L140,235 L145,300 L170,330 L193,250 L193,118 L40,118", 4, 4)}
${flow("ven", "M90,435 L90,230 L135,240 L150,310 L180,320 L193,250 L193,118 L402,118", 4.4, 4)}
${flow("art", "M405,168 L320,190 L285,240 L285,320 L240,330 L222,255 L222,75 C222,22 367,22 367,75 L367,135", 4, 4)}
${flow("art", "M405,205 L320,212 L292,250 L292,350 L240,340 L222,255 L222,75 C222,22 367,22 367,75 L367,135", 4.4, 4)}
${L(1, 107, 45, 30, 40)}${L(5, 60, 118, 30, 90)}${L(3, 115, 200, 30, 190)}${L(10, 127, 268, 30, 262)}
${L(4, 150, 330, 30, 330)}${L(2, 90, 410, 30, 410)}${L(9, 348, 50, 400, 40)}${L(6, 392, 168, 412, 145)}
${L(7, 300, 215, 412, 232)}${L(11, 300, 268, 412, 275)}${L(8, 290, 340, 412, 340)}`);

// ---------- глаз ----------
const eyeRays = [148, 165, 182].map(y => `<polyline class="ray r1" points="62,135 190,${y} 346,181"/>`).join("") +
  [150, 166, 180].map(y => `<polyline class="ray r2" points="62,195 190,${y} 346,151"/>`).join("");
const eye = svg(440, 330, `
<path d="M160.8,99 A115,115 0 1,1 160.8,231" fill="none" stroke="#e6e6e6" stroke-width="10"/>
<path d="M156.7,96.2 A120,120 0 1,1 156.7,233.8" fill="none" stroke="#222" stroke-width="2"/>
<path d="M164.8,101.6 A110,110 0 1,1 164.8,228.4" fill="none" stroke="#222" stroke-width="1.2"/>
<path d="M156.7,96.2 A85,85 0 0,0 156.7,233.8" fill="#f3f8fb" stroke="#222" stroke-width="3"/>
<path d="M174.6,97.5 A105,105 0 1,1 174.6,232.5" fill="none" stroke="#a3a3a3" stroke-width="9"/>
<path d="M188.8,91.4 A99,99 0 1,1 188.8,238.6" fill="none" stroke="#333" stroke-width="4"/>
<ellipse cx="352" cy="165" rx="3.5" ry="7" fill="#d9b630" stroke="#333"/>
${T("M347,200 L436,200", 26)}
<g class="iris"><path class="it" d="M163,104 L165,147" stroke="#555" stroke-width="7"/><path class="ib" d="M163,226 L165,183" stroke="#555" stroke-width="7"/></g>
<ellipse cx="178" cy="106" rx="7" ry="10" fill="#777"/><ellipse cx="178" cy="224" rx="7" ry="10" fill="#777"/>
<path d="M181,115 L189,127 M181,215 L189,203" stroke="#666" stroke-width="1.5"/>
<ellipse cx="190" cy="165" rx="13" ry="40" fill="#e9f3fb" stroke="#222" stroke-width="2.5"/>
<g class="obj"><path d="M55,195 L55,140 M47,150 L55,135 L63,150" stroke="#e07b00" stroke-width="5" fill="none"/></g>
${eyeRays}
<path class="img" d="M346,151 L346,177 M341,170 L346,182 L351,170" stroke="#e07b00" stroke-width="3" fill="none"/>
${flow("sig", "M352,200 L436,200", 1.2, 3)}
${L(1, 127, 135, 40, 95)}${L(2, 164, 115, 110, 30)}${L(3, 165, 165, 40, 240)}${L(4, 192, 140, 215, 20)}
${L(5, 178, 224, 150, 305)}${L(6, 270, 200, 260, 305)}${L(7, 318.6, 89.2, 330, 20)}${L(8, 341, 104.8, 395, 45)}
${L(9, 363, 125.7, 412, 95)}${L(10, 352, 165, 412, 150)}${L(11, 349, 200, 330, 305)}${L(12, 420, 200, 412, 250)}`);

// ---------- ухо ----------
function spiral(cx, cy, r0, r1, turns, start) {
  const pts = [], n = 80;
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = start + t * turns * 2 * Math.PI, r = r1 + (r0 - r1) * t;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
}
const coch = spiral(305, 200, 5, 32, 2.2, Math.PI * 1.1);
const ellT = (cx, cy, rx, ry, rot) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="#222" stroke-width="9"/>` +
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="#eee" stroke-width="4"/>`;
const wave = i => `<path class="wave" style="animation-delay:${i * 0.5}s" d="M30,140 Q40,165 30,190" fill="none" stroke="#2f6f5e" stroke-width="3"/>`;
const ear = svg(440, 330, `
<path d="M85,148 C85,90 60,40 35,60 C10,80 15,160 30,210 C42,250 55,290 80,285 C100,280 95,250 88,230 L85,182 Z" fill="#f1ece6" stroke="#222" stroke-width="3"/>
<path d="M60,90 C45,110 45,170 60,200" fill="none" stroke="#555" stroke-width="2"/>
<path d="M85,148 L172,140 L172,190 L85,182 Z" fill="#fafafa" stroke="none"/>
<path d="M85,148 L172,140 M85,182 L172,190" stroke="#222" stroke-width="3"/>
${T("M215,212 L320,318", 14)}
<rect x="178" y="98" width="72" height="117" rx="18" fill="#fbfbfb" stroke="#999" stroke-dasharray="5 4"/>
<ellipse class="drum" cx="174" cy="165" rx="4" ry="27" fill="#ccc" stroke="#222" stroke-width="2.5"/>
<g class="mal" style="transform-origin:193px 110px"><path d="M176,168 L190,118" stroke="#222" stroke-width="5"/><circle cx="193" cy="110" r="9" fill="#d8d8d8" stroke="#222" stroke-width="2"/></g>
<g class="inc" style="transform-origin:212px 108px"><circle cx="212" cy="108" r="10" fill="#d8d8d8" stroke="#222" stroke-width="2"/><path d="M215,116 L220,150" stroke="#222" stroke-width="5"/></g>
<g class="sta"><path d="M220,147 L240,139 M220,153 L240,161" stroke="#222" stroke-width="3" fill="none"/><path d="M242,135 L242,165" stroke="#222" stroke-width="5"/></g>
${ellT(268, 98, 18, 28, 0)}${ellT(300, 118, 28, 13, 0)}${ellT(288, 82, 11, 26, 40)}
<circle cx="262" cy="150" r="15" fill="#eee" stroke="#222" stroke-width="2.5"/>
${T("M270,162 L282,178", 10)}
<path d="${coch}" fill="none" stroke="#222" stroke-width="10"/><path class="coch" d="${coch}" fill="none" stroke="#eee" stroke-width="5"/>
${T("M320,182 L436,152", 16)}
${[0, 1, 2].map(wave).join("")}
${flow("sig", "M322,181 L436,152", 1.2, 3)}
<text class="brain" x="425" y="135" text-anchor="end" font-size="14">в мозг →</text>
${L(1, 40, 80, 22, 28)}${L(2, 125, 165, 110, 300)}${L(3, 174, 188, 160, 300)}${L(4, 193, 110, 180, 30)}${L(5, 214, 108, 225, 30)}
${L(6, 234, 156, 210, 300)}${L(7, 286, 70, 320, 25)}${L(8, 312, 205, 380, 245)}${L(9, 400, 162, 412, 110)}${L(10, 290, 290, 380, 305)}`);

// ---------- микроскоп ----------
let cells = "";
for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
  const x = 345 + c * 32 - (r % 2) * 14, y = 38 + r * 30;
  cells += `<rect x="${x}" y="${y}" width="32" height="30" fill="#f6eaf2" stroke="#a0577f" stroke-width="2"/><circle cx="${x + 12}" cy="${y + 14}" r="4" fill="#a0577f"/>`;
}
const micro = svg(470, 450, `
<path d="M70,410 L270,410 Q285,410 285,425 L285,435 L55,435 L55,425 Q55,410 70,410 Z" fill="#ddd" stroke="#222" stroke-width="2.5"/>
<path d="M245,410 L245,260 C245,200 235,160 195,132" fill="none" stroke="#222" stroke-width="26" stroke-linecap="round"/>
<path d="M245,410 L245,260 C245,200 235,160 195,132" fill="none" stroke="#cfcfcf" stroke-width="20" stroke-linecap="round"/>
<rect x="160" y="118" width="45" height="24" fill="#cfcfcf" stroke="#222" stroke-width="2"/>
<rect x="128" y="70" width="34" height="125" fill="#eee" stroke="#222" stroke-width="2.5"/>
<rect x="133" y="36" width="24" height="36" fill="#e3e3e3" stroke="#222" stroke-width="2.5"/>
<rect x="128" y="30" width="34" height="8" fill="#bbb" stroke="#222" stroke-width="2"/>
<path d="M118,195 L172,195 L182,212 L108,212 Z" fill="#c8c8c8" stroke="#222" stroke-width="2.5"/>
<rect x="160" y="210" width="13" height="27" transform="rotate(-30 167 212)" fill="#ddd" stroke="#222" stroke-width="2"/>
<rect x="136" y="212" width="18" height="38" fill="#ddd" stroke="#222" stroke-width="2.5"/>
<path d="M232,352 L170,352" stroke="#222" stroke-width="4"/>
<ellipse cx="145" cy="352" rx="27" ry="8" transform="rotate(-18 145 352)" fill="#e8f2f8" stroke="#222" stroke-width="2.5"/>
<rect x="60" y="268" width="175" height="12" fill="#c8c8c8" stroke="#222" stroke-width="2.5"/>
<rect x="110" y="262" width="70" height="6" fill="#cfe7fb" stroke="#222" stroke-width="1.5"/>
<path d="M85,266 L112,262 M205,266 L178,262" stroke="#222" stroke-width="2.5"/>
<circle cx="262" cy="230" r="17" fill="#ddd" stroke="#222" stroke-width="2.5"/><path d="M252,230 L272,230 M262,220 L262,240" stroke="#888" stroke-width="1.5"/>
<circle cx="262" cy="272" r="10" fill="#ddd" stroke="#222" stroke-width="2"/>
<text class="sun" x="20" y="330" font-size="26">☀️</text>
<polyline class="beam" points="45,322 145,352 145,28 145,18"/>
<text class="eyeic" x="133" y="18" font-size="18">👁</text>
<g class="zoom"><clipPath id="mc-clip"><circle cx="405" cy="92" r="60"/></clipPath><circle cx="405" cy="92" r="62" fill="#fff" stroke="#2f6f5e" stroke-width="4"/>
<g clip-path="url(#mc-clip)">${cells}</g><text x="405" y="172" text-anchor="middle" font-size="12" fill="#2f6f5e">клетки кожицы лука</text></g>
${L(1, 145, 50, 60, 40)}${L(2, 145, 130, 60, 120)}${L(3, 120, 203, 60, 200)}${L(4, 145, 238, 60, 245)}${L(5, 75, 274, 30, 300)}
${L(7, 128, 356, 40, 365)}${L(6, 262, 230, 345, 215)}${L(8, 245, 330, 345, 325)}${L(9, 230, 425, 345, 420)}`);

// ---------- деление клетки (митоз) ----------
function chrom(x, y, a) {
  return `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-2,-9 Q-5,0 -2,9 M2,-9 Q5,0 2,9" stroke="#b3312a" stroke-width="3" fill="none"/></g>`;
}
const vee = (x, y, dir) => `<path d="M${x},${y} L${x - 8 * dir},${y - 7} M${x},${y} L${x - 8 * dir},${y + 7}" stroke="#b3312a" stroke-width="3" fill="none"/>`;
const cell = (cx, r = 42) => `<circle cx="${cx}" cy="70" r="${r}" fill="#f7f1e6" stroke="#222" stroke-width="2.5"/>`;
const chromatin = (cx, cy) => `<path d="M${cx - 9},${cy - 3} q4,-6 8,0 t8,0 M${cx - 7},${cy + 5} q4,-5 8,0 t7,0" stroke="#b3312a" stroke-width="1.5" fill="none"/>`;
const fibers = (cx, ys) => ys.map(y => `<path d="M${cx - 34},70 L${cx},${y} L${cx + 34},70" stroke="#999" stroke-width="1" fill="none"/>`).join("");
const pinch = (cx, cy, a, b, c, d, e) =>
  `M${cx},${cy - a} C${cx + b},${cy - c} ${cx + d},${cy - e} ${cx + d},${cy} C${cx + d},${cy + e} ${cx + b},${cy + c} ${cx},${cy + a} ` +
  `C${cx - b},${cy + c} ${cx - d},${cy + e} ${cx - d},${cy} C${cx - d},${cy - e} ${cx - b},${cy - c} ${cx},${cy - a} Z`;
const panels = [
  // 1 — метафаза
  cell(50) + fibers(50, [49, 63, 77, 91]) + [49, 63, 77, 91].map(y => chrom(50, y, 0)).join("") + `<circle cx="16" cy="70" r="2.5"/><circle cx="84" cy="70" r="2.5"/>`,
  // 2 — интерфаза
  cell(150) + `<circle cx="150" cy="70" r="18" fill="#eadcc2" stroke="#222" stroke-width="2"/>` + chromatin(150, 70) + `<circle cx="156" cy="64" r="4" fill="#666"/>`,
  // 3 — телофаза
  `<path d="${pinch(250, 70, 20, 22, 44, 48, 34)}" fill="#f7f1e6" stroke="#222" stroke-width="2.5"/>` +
  [228, 272].map(x => `<circle cx="${x}" cy="70" r="13" fill="#eadcc2" stroke="#222" stroke-width="2"/>` + chromatin(x + 1, 69)).join(""),
  // 4 — профаза
  cell(350) + `<circle cx="350" cy="70" r="24" fill="none" stroke="#555" stroke-width="1.5" stroke-dasharray="4 4"/>` +
  chrom(338, 58, 30) + chrom(362, 62, -40) + chrom(342, 84, 70) + chrom(361, 82, 10) + `<circle cx="350" cy="30" r="2.5"/><circle cx="350" cy="110" r="2.5"/>`,
  // 5 — анафаза
  `<ellipse cx="450" cy="70" rx="46" ry="38" fill="#f7f1e6" stroke="#222" stroke-width="2.5"/>` +
  [52, 64, 76, 88].map(y => vee(424, y, 1) + vee(476, y, -1)).join("") +
  `<path d="M410,70 L424,58 M410,70 L424,82 M490,70 L476,58 M490,70 L476,82" stroke="#999" stroke-width="1"/><circle cx="410" cy="70" r="2.5"/><circle cx="490" cy="70" r="2.5"/>`,
];
const mitosisPic = svg(500, 160, panels.join("") + [1, 2, 3, 4, 5].map(n => `<circle class="nc" cx="${n * 100 - 50}" cy="140" r="11"/><text class="ntx" x="${n * 100 - 50}" y="140">${n}</text>`).join(""));

// анимация: одна клетка проходит все фазы, 12 секунд по кругу
const D = 12, cx = 150, cy = 100;
const A = (attr, keys, values, extra = "") =>
  `<animate attributeName="${attr}" begin="indefinite" dur="${D}s" repeatCount="indefinite" keyTimes="${keys}" values="${values}" ${extra}/>`;
const round = pinch(cx, cy, 64, 36, 64, 66, 36), longc = pinch(cx, cy, 56, 42, 58, 80, 34), split = pinch(cx, cy, 16, 36, 66, 94, 40);
const starts = [[138, 88], [163, 92], [141, 114], [160, 112]], eqY = [70, 92, 114, 136], poleY = [84, 96, 108, 120];
let chroms = "";
starts.forEach(([sx, sy], i) => {
  for (const side of [-1, 1]) {
    const px = cx + side * 46;
    chroms += `<g opacity="0"><path d="M${2 * side},-9 Q${5 * side},0 ${2 * side},9" stroke="#b3312a" stroke-width="3.5" fill="none"/>` +
      `<animateTransform attributeName="transform" type="translate" begin="indefinite" dur="${D}s" repeatCount="indefinite" ` +
      `keyTimes="0;0.3;0.44;0.52;0.68;1" values="${sx},${sy};${sx},${sy};${cx},${eqY[i]};${cx},${eqY[i]};${px},${poleY[i]};${px},${poleY[i]}"/>` +
      A("opacity", "0;0.13;0.2;0.74;0.86;1", "0;0;1;1;0.35;0.35") + `</g>`;
  }
});
const spindle = eqY.map(y => `<path d="M${cx - 62},${cy} L${cx},${y} L${cx + 62},${cy}" stroke="#999" stroke-width="1.2" fill="none" opacity="0">` +
  A("opacity", "0;0.27;0.34;0.6;0.66;1", "0;0;1;1;0;0") + `</path>`).join("");
const phases = [["Интерфаза: клетка растёт, ДНК удваивается", 0, 0.14], ["Профаза: хромосомы спирализуются, оболочка ядра исчезает", 0.14, 0.3],
  ["Метафаза: хромосомы выстраиваются по экватору", 0.3, 0.52], ["Анафаза: хроматиды расходятся к полюсам", 0.52, 0.68],
  ["Телофаза: образуются два ядра, клетка делится", 0.68, 0.88], ["Две дочерние клетки с одинаковыми хромосомами", 0.88, 1]];
const captions = phases.map(([t, a, b]) => `<text class="cap" x="150" y="212" text-anchor="middle" opacity="0">${t}` +
  A("opacity", a === 0 ? `0;${b}` : b === 1 ? `0;${a}` : `0;${a};${b}`, a === 0 ? "1;0" : b === 1 ? "0;1" : "0;1;0", 'calcMode="discrete"') + `</text>`).join("");
const mitosisAnim = svg(300, 225, `
<path fill="#f7f1e6" stroke="#222" stroke-width="2.5" d="${round}">${A("d", "0;0.52;0.66;0.84;1", [round, round, longc, split, split].join(";"))}</path>
<circle cx="${cx}" cy="${cy}" r="30" fill="#eadcc2" stroke="#222" stroke-width="2">${A("opacity", "0;0.14;0.3;1", "1;1;0;0")}</circle>
<g>${chromatin(cx, cy)}<circle cx="${cx + 7}" cy="${cy - 7}" r="5" fill="#666"/>${A("opacity", "0;0.1;0.2;1", "1;1;0;0")}</g>
<g opacity="0"><circle cx="${cx - 62}" cy="${cy}" r="3"/><circle cx="${cx + 62}" cy="${cy}" r="3"/>${A("opacity", "0;0.15;0.22;0.66;0.72;1", "0;0;1;1;0;0")}</g>
${spindle}
${[-46, 46].map(dx => `<circle cx="${cx + dx}" cy="${cy}" r="20" fill="#eadcc2" fill-opacity="0.6" stroke="#222" stroke-width="2" opacity="0">` +
  A("opacity", "0;0.76;0.86;1", "0;0;1;1") + `</circle>`).join("")}
${chroms}
${captions}`);

// ---------- цветок (2026-11-18) ----------
const flower = svg(420, 390, `
<path d="M210,388 L210,252" stroke="#4e8b2e" stroke-width="8" fill="none"/>
<path d="M190,252 Q150,256 132,228 Q168,232 195,246 Z" fill="#7cb342" stroke="#33691e" stroke-width="1.5"/>
<path d="M230,252 Q270,256 288,228 Q252,232 225,246 Z" fill="#7cb342" stroke="#33691e" stroke-width="1.5"/>
<path d="M196,247 C150,232 116,172 146,128 C172,148 194,200 206,242 Z" fill="#f8bbd0" stroke="#ad1457" stroke-width="1.5"/>
<path d="M224,247 C270,232 304,172 274,128 C248,148 226,200 214,242 Z" fill="#f8bbd0" stroke="#ad1457" stroke-width="1.5"/>
<ellipse cx="210" cy="252" rx="28" ry="9" fill="#9ccc65" stroke="#33691e" stroke-width="1.5"/>
<path d="M198,244 L180,165 M222,244 L240,165" stroke="#c0a000" stroke-width="2.5" fill="none"/>
<ellipse cx="180" cy="156" rx="6" ry="11" fill="#fbc02d" stroke="#8a6a00" stroke-width="1.5"/>
<ellipse cx="240" cy="156" rx="6" ry="11" fill="#fbc02d" stroke="#8a6a00" stroke-width="1.5"/>
<ellipse cx="210" cy="226" rx="16" ry="20" fill="#c5e1a5" stroke="#33691e" stroke-width="2"/>
<circle cx="205" cy="222" r="3.5" fill="#fff" stroke="#33691e"/><circle cx="215" cy="230" r="3.5" fill="#fff" stroke="#33691e"/>
<path d="M207,207 L207,142 L213,142 L213,207 Z" fill="#c5e1a5" stroke="#33691e" stroke-width="1.5"/>
<ellipse cx="210" cy="137" rx="13" ry="6" fill="#9ccc65" stroke="#33691e" stroke-width="1.5"/>
${flow("sig", "M180,146 Q150,95 205,133", 2.6, 3)}${flow("sig", "M240,146 Q270,95 215,133", 2.6, 3)}
${flow("sig", "M210,140 L210,205 L206,220", 2.6, 2)}
${L(2, 180, 150, 40, 90)}${L(1, 150, 165, 40, 145)}${L(3, 189, 205, 40, 200)}${L(7, 148, 236, 40, 255)}
${L(4, 216, 136, 380, 110)}${L(5, 213, 172, 380, 160)}${L(6, 224, 226, 380, 215)}${L(8, 236, 252, 380, 265)}${L(9, 210, 330, 380, 330)}`);

// ---------- нейрон (2026-11-18) ----------
const neuron = svg(450, 240, `
<path d="M62,102 L32,72 L16,78 M32,72 L30,48 M58,138 L26,162 L10,156 M26,162 L24,188 M86,86 L80,52 L64,38 M80,52 L96,30"
  stroke="#7b1fa2" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M128,120 L382,120 M382,120 L412,96 M382,120 L418,120 M382,120 L412,146" stroke="#7b1fa2" stroke-width="4" fill="none"/>
${[160, 205, 250, 295, 340].map(x => `<rect x="${x}" y="111" width="34" height="18" rx="8" fill="#fff3c4" stroke="#c9a400" stroke-width="1.5"/>`).join("")}
<circle cx="412" cy="96" r="5" fill="#ce93d8" stroke="#4a148c"/><circle cx="418" cy="120" r="5" fill="#ce93d8" stroke="#4a148c"/>
<circle cx="412" cy="146" r="5" fill="#ce93d8" stroke="#4a148c"/>
<path d="M58,104 C66,80 108,78 124,104 C134,122 126,150 98,156 C70,160 50,138 58,104 Z" fill="#f3e5f5" stroke="#4a148c" stroke-width="2"/>
<circle cx="92" cy="120" r="12" fill="#ab47bc" stroke="#4a148c"/>
${flow("sig", "M30,48 L32,72 L62,102 L128,120 L382,120 L412,96", 2.4, 3)}${flow("sig", "M24,188 L26,162 L58,138 L128,120 L382,120 L412,146", 2.4, 3)}
${L(1, 108, 146, 120, 210)}${L(2, 96, 116, 150, 45)}${L(3, 24, 184, 30, 220)}${L(4, 244, 120, 250, 190)}
${L(5, 177, 112, 180, 60)}${L(6, 415, 98, 425, 55)}`);

// ---------- пищеварительная система (2026-11-18) ----------
const gut = "M200,246 C128,258 128,282 200,286 C272,290 272,310 200,316 C128,322 128,342 200,346 C272,350 200,382 116,382";
const digestion = svg(370, 465, `
<path d="M112,384 L100,272 C100,256 110,251 126,253 L276,258 C292,258 294,268 294,282 L294,384 C294,400 272,405 252,405 L206,410 L202,446"
  stroke="#ce93d8" stroke-width="18" fill="none" stroke-linejoin="round"/>
<path d="${gut}" stroke="#f06292" stroke-width="9" fill="none"/>
<path d="M160,240 C192,230 240,232 264,226 C268,236 242,248 160,250 Z" fill="#ffcc80" stroke="#bf6c00" stroke-width="1.5"/>
<path d="M172,150 C175,180 195,197 225,194 C252,192 264,172 256,150 C246,125 210,128 190,140 Z" fill="#f48fb1" stroke="#ad1457" stroke-width="2"/>
<path d="M226,193 C232,214 214,232 200,246" stroke="#f06292" stroke-width="9" fill="none"/>
<path d="M70,150 C90,125 168,130 178,160 C170,190 120,202 76,192 C60,182 60,162 70,150 Z" fill="#a1887f" stroke="#4e342e" stroke-width="2"/>
<ellipse cx="140" cy="198" rx="10" ry="7" fill="#9ccc65" stroke="#33691e" stroke-width="1.5"/>
<path d="M180,56 L180,150" stroke="#f48fb1" stroke-width="12" fill="none"/>
<ellipse cx="180" cy="40" rx="32" ry="17" fill="#f8bbd0" stroke="#ad1457" stroke-width="2"/>
${flow("sig", `M180,40 L180,150 L215,175 L226,193 C232,214 214,232 200,246 ${gut.slice(9)} L112,384 L100,272 L276,258 L294,282 L294,384 L252,405 L206,410 L202,446`, 8, 3)}
${L(1, 196, 40, 330, 30)}${L(2, 180, 100, 330, 95)}${L(3, 245, 165, 335, 160)}${L(4, 92, 162, 25, 145)}${L(5, 140, 202, 25, 210)}
${L(6, 252, 236, 340, 236)}${L(7, 262, 300, 340, 300)}${L(8, 100, 320, 25, 320)}${L(9, 203, 432, 330, 432)}`);

window.DRAWN = [
  {id: "heart", title: "Сердце человека", grade: 9, parts: [[1, "верхняя полая вена"], [2, "нижняя полая вена"], [3, "правое предсердие"],
    [4, "правый желудочек"], [5, "лёгочная артерия"], [6, "лёгочные вены"], [7, "левое предсердие"], [8, "левый желудочек"], [9, "аорта"],
    [10, "трёхстворчатый клапан"], [11, "двустворчатый клапан"]], svg: heart,
   note: "Сердце нарисовано как у человека, который стоит к тебе лицом: его правая половина — слева на рисунке.",
   done: "Сначала сжимаются предсердия и проталкивают кровь в желудочки — створчатые клапаны открыты. Потом сжимаются желудочки: " +
     "клапаны захлопываются, и кровь уходит в аорту и лёгочную артерию. Синим — венозная кровь (правая половина сердца, " +
     "оттуда в лёгкие), красным — артериальная (из лёгких в левую половину и по аорте ко всему телу)."},
  {id: "eye", title: "Строение глаза", grade: 9, parts: [[1, "роговица"], [2, "радужка"], [3, "зрачок"], [4, "хрусталик"],
    [5, "ресничная мышца"], [6, "стекловидное тело"], [7, "сетчатка"], [8, "сосудистая оболочка"], [9, "склера"], [10, "жёлтое пятно"],
    [11, "слепое пятно"], [12, "зрительный нерв"]], svg: eye,
   note: "Глаз в разрезе, свет входит слева.",
   done: "Свет проходит через роговицу, зрачок и хрусталик. Хрусталик преломляет лучи и собирает их на сетчатке — там получается " +
     "уменьшенное перевёрнутое изображение, чётче всего в жёлтом пятне. На ярком свету зрачок сужается. Сигнал идёт по " +
     "зрительному нерву в мозг, и мозг «переворачивает» картинку."},
  {id: "ear", title: "Строение уха", grade: 9, parts: [[1, "ушная раковина"], [2, "наружный слуховой проход"], [3, "барабанная перепонка"],
    [4, "молоточек"], [5, "наковальня"], [6, "стремечко"], [7, "полукружные каналы"], [8, "улитка"], [9, "слуховой нерв"],
    [10, "слуховая труба"]], svg: ear,
   note: "Пунктиром обведена полость среднего уха.",
   done: "Ушная раковина улавливает звук, по слуховому проходу он доходит до барабанной перепонки, и та колеблется. Молоточек, " +
     "наковальня и стремечко передают и усиливают колебания до улитки. В жидкости улитки бежит волна, слуховые рецепторы " +
     "превращают её в сигнал, и он по слуховому нерву идёт в мозг. Полукружные каналы — орган равновесия, а слуховая труба " +
     "выравнивает давление по обе стороны перепонки."},
  {id: "microscope", title: "Световой микроскоп", grade: 5, parts: [[1, "окуляр"], [2, "тубус"], [3, "револьвер"], [4, "объектив"],
    [5, "предметный столик"], [6, "винт"], [7, "зеркало"], [8, "штатив"], [9, "основание"]], svg: micro,
   done: "Зеркало направляет свет через отверстие в столике и прозрачный препарат. Объектив и окуляр увеличивают изображение: " +
     "общее увеличение равно увеличению окуляра, умноженному на увеличение объектива (10 × 40 = 400 раз). Винтом поднимают и " +
     "опускают тубус, чтобы изображение стало чётким."},
  {id: "mitosis", title: "Деление клетки (митоз)", grade: 10, parts: [[1, "метафаза"], [2, "интерфаза"], [3, "телофаза"], [4, "профаза"],
    [5, "анафаза"]], svg: mitosisPic, anim: mitosisAnim,
   note: "Под каждой клеткой цифра. Какая это фаза?",
   done: "Посмотри, как одна клетка проходит все фазы: в интерфазе ДНК удваивается, в профазе хромосомы становятся видны, в метафазе " +
     "выстраиваются по экватору, в анафазе хроматиды расходятся к полюсам, в телофазе образуются две клетки. У каждой дочерней " +
     "клетки такой же набор хромосом, как у материнской."},
  {id: "flower", title: "Строение цветка", grade: 6, parts: [[1, "лепесток"], [2, "пыльник"], [3, "тычиночная нить"], [4, "рыльце"],
    [5, "столбик"], [6, "завязь"], [7, "чашелистик"], [8, "цветоложе"], [9, "цветоножка"]], svg: flower,
   note: "Цветок в разрезе: в середине пестик, по бокам тычинки.",
   done: "Пыльца из пыльников попадает на рыльце пестика — это опыление. Пыльцевая трубка прорастает через столбик к завязи, " +
     "и в семязачатке происходит оплодотворение. Из завязи развивается плод, из семязачатков — семена."},
  {id: "neuron", title: "Строение нейрона", grade: 9, parts: [[1, "тело нейрона"], [2, "ядро"], [3, "дендриты"], [4, "аксон"],
    [5, "миелиновая оболочка"], [6, "нервные окончания"]], svg: neuron,
   done: "Нервный импульс приходит по коротким отросткам — дендритам — к телу нейрона и бежит по длинному отростку — аксону — " +
     "к нервным окончаниям, а оттуда через синапс к другой клетке. Миелиновая оболочка изолирует аксон, и импульс идёт быстрее."},
  {id: "digestion", title: "Пищеварительная система", grade: 9, parts: [[1, "ротовая полость"], [2, "пищевод"], [3, "желудок"],
    [4, "печень"], [5, "желчный пузырь"], [6, "поджелудочная железа"], [7, "тонкая кишка"], [8, "толстая кишка"], [9, "прямая кишка"]],
   svg: digestion, note: "Человек стоит к тебе лицом: печень (справа у человека) — слева на рисунке.",
   done: "Во рту пища измельчается и смачивается слюной, по пищеводу попадает в желудок, где её переваривает желудочный сок. " +
     "В тонкой кишке пищу расщепляют сок поджелудочной железы, желчь и кишечный сок, а питательные вещества всасываются в кровь. " +
     "В толстой кишке всасывается вода, остатки выводятся через прямую кишку."},
];
})();
