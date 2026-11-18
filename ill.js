/* ---------- hand-drawn style illustrations (inline SVG, themed by CSS classes) ---------- */
const LOGO = `<svg class="logo" width="38" height="38" viewBox="0 0 38 38" aria-hidden="true"><rect x="1" y="1" width="36" height="36" rx="9"></rect><path class="g" d="M1 13H37M1 25H37M19 1V37M29 1V37"></path><path class="m" d="M10 2V36"></path><path class="c" d="M15 20l5 5 9-12"></path></svg>`;

const ILL_HERO = `<svg class="hero-ill" viewBox="0 0 560 480" role="img" aria-label="Katak daftarda yechilgan uyga vazifa, kitoblar, qalam va telefonda vazifalar ro'yxati">
  <defs>
    <pattern id="kat-h" width="16" height="16" patternUnits="userSpaceOnUse"><path class="i-grid" d="M16 0H0V16"></path></pattern>
  </defs>
  <path class="i-blob" d="M302 34C428 26 534 112 532 240C530 372 430 452 300 452C168 452 58 378 68 248C78 118 176 42 302 34Z"></path>
  <circle class="i-blob2" cx="112" cy="96" r="48"></circle>
  <g transform="translate(250 22)">
    <path class="i-cap" d="M0 15L38 0L76 15L38 30Z"></path>
    <path class="i-cap" d="M18 22V34C18 40 58 40 58 34V22L38 30Z"></path>
    <path class="i-stroke-r" d="M70 18V36"></path><circle cx="70" cy="39" r="3.5" class="i-pdf"></circle>
  </g>
  <g transform="translate(46 64) rotate(-10)">
    <rect class="i-doc" width="76" height="96" rx="9"></rect>
    <path class="i-fold" d="M54 0L76 22H60C56.7 22 54 19.3 54 16Z"></path>
    <rect class="i-line" x="12" y="30" width="42" height="5" rx="2.5"></rect>
    <rect class="i-line" x="12" y="42" width="52" height="5" rx="2.5"></rect>
    <rect class="i-pdf" x="12" y="62" width="44" height="20" rx="5"></rect>
    <text class="i-pdft" x="34" y="76.5" font-size="12" text-anchor="middle">PDF</text>
  </g>
  <g transform="rotate(-6 240 240)">
    <rect class="i-paper" x="112" y="78" width="262" height="322" rx="14"></rect>
    <rect x="112" y="78" width="262" height="322" rx="14" fill="url(#kat-h)"></rect>
    <line class="i-margin" x1="152" y1="78" x2="152" y2="400"></line>
    <text class="i-red" x="168" y="122" font-size="25">Uyga vazifa</text>
    <text class="i-ink" x="168" y="168" font-size="26">3x + 7 = 22</text>
    <text class="i-ink" x="168" y="206" font-size="26">3x = 15</text>
    <text class="i-ink" x="168" y="244" font-size="26">x = 5</text>
    <path class="i-stroke-g" d="M244 236l7 7 14-17"></path>
    <circle class="i-stamp" cx="300" cy="328" r="32"></circle>
    <text class="i-red" x="300" y="345" font-size="44" text-anchor="middle">5</text>
  </g>
  <g transform="translate(36 372)">
    <rect class="i-b1" x="0" y="52" width="204" height="36" rx="6"></rect>
    <rect class="i-band" x="16" y="52" width="9" height="36"></rect>
    <rect class="i-b4" x="18" y="18" width="178" height="34" rx="6"></rect>
    <rect class="i-band" x="34" y="18" width="9" height="34"></rect>
    <rect class="i-b3" x="6" y="-14" width="162" height="32" rx="6"></rect>
    <rect class="i-band" x="20" y="-14" width="9" height="32"></rect>
  </g>
  <g transform="translate(70 352) rotate(-24)">
    <rect class="i-eraser" x="0" y="0" width="14" height="18" rx="3"></rect>
    <rect class="i-ferrule" x="14" y="0" width="10" height="18"></rect>
    <rect class="i-pencil" x="24" y="0" width="150" height="18"></rect>
    <path class="i-wood" d="M174 0L198 9L174 18Z"></path>
    <path class="i-lead" d="M190 6L198 9L190 12Z"></path>
  </g>
  <g transform="translate(352 140) rotate(5)">
    <rect class="i-phone" width="170" height="300" rx="28"></rect>
    <rect class="i-screen" x="9" y="10" width="152" height="280" rx="20"></rect>
    <rect class="i-phone" x="62" y="18" width="46" height="8" rx="4"></rect>
    <text class="i-ui" x="24" y="54" font-size="15">Vazifalar</text>
    <text class="i-ui2" x="24" y="71" font-size="11">7-A sinf · bugun</text>
    <g transform="translate(20 84)">
      <rect class="i-card" width="130" height="74" rx="12"></rect>
      <rect class="i-tag1" x="10" y="10" width="76" height="18" rx="9"></rect>
      <text class="i-tagt1" x="48" y="23" font-size="10" text-anchor="middle">Matematika</text>
      <text class="i-ui" x="10" y="46" font-size="11">Test · 10 savol</text>
      <rect class="i-bar" x="10" y="56" width="110" height="6" rx="3"></rect>
      <rect class="i-barf" x="10" y="56" width="74" height="6" rx="3"></rect>
    </g>
    <g transform="translate(20 168)">
      <rect class="i-card" width="130" height="62" rx="12"></rect>
      <rect class="i-tag2" x="10" y="10" width="52" height="18" rx="9"></rect>
      <text class="i-tagt1" x="36" y="23" font-size="10" text-anchor="middle">Fizika</text>
      <text class="i-ui" x="10" y="47" font-size="11">Rasm yuklash</text>
      <rect class="i-stroke" x="98" y="34" width="22" height="16" rx="4"></rect>
      <circle class="i-stroke" cx="109" cy="42" r="4"></circle>
    </g>
    <g transform="translate(20 242)">
      <rect class="i-btn" width="130" height="34" rx="12"></rect>
      <text class="i-btnt" x="65" y="22" font-size="12" text-anchor="middle">Topshirish</text>
    </g>
  </g>
  <g transform="translate(384 82)">
    <rect class="i-chip" width="138" height="38" rx="19"></rect>
    <circle class="i-ok" cx="20" cy="19" r="10"></circle>
    <path class="i-okm" d="M15 19l3.5 3.5L25 15"></path>
    <text class="i-ui" x="38" y="24" font-size="13">Topshirildi</text>
  </g>
</svg>`;

const ILL_AUTH = `<svg viewBox="0 0 360 340" role="img" aria-label="Telefonda kirish oynasi va kalit">
  <circle class="i-blob2" cx="180" cy="176" r="140"></circle>
  <text class="i-red" x="22" y="44" font-size="22" transform="rotate(-6 22 44)">login o'qituvchidan</text>
  <g transform="translate(112 58)">
    <rect class="i-phone" width="150" height="262" rx="26"></rect>
    <rect class="i-screen" x="8" y="9" width="134" height="244" rx="19"></rect>
    <text class="i-ui" x="22" y="50" font-size="16">Kirish</text>
    <text class="i-ui2" x="22" y="78" font-size="10">Login</text>
    <rect class="i-card" x="22" y="84" width="106" height="26" rx="8"></rect>
    <text class="i-ui2" x="30" y="101" font-size="11">aziza.karimova</text>
    <text class="i-ui2" x="22" y="130" font-size="10">Parol</text>
    <rect class="i-card" x="22" y="136" width="106" height="26" rx="8"></rect>
    <text class="i-ui" x="30" y="154" font-size="13" letter-spacing="2">••••••</text>
    <rect class="i-btn" x="22" y="180" width="106" height="30" rx="10"></rect>
    <text class="i-btnt" x="75" y="199.5" font-size="12" text-anchor="middle">Kirish</text>
  </g>
  <g transform="translate(64 262) rotate(-28)">
    <circle class="i-b4" cx="0" cy="0" r="22"></circle>
    <circle class="i-blob" cx="0" cy="0" r="8"></circle>
    <rect class="i-b4" x="16" y="-6" width="76" height="12" rx="4"></rect>
    <rect class="i-b4" x="70" y="4" width="8" height="14" rx="2"></rect>
    <rect class="i-b4" x="82" y="4" width="8" height="9" rx="2"></rect>
  </g>
</svg>`;

const ILL_TEACHER = `<svg viewBox="0 0 72 72" aria-hidden="true">
  <rect x="6" y="8" width="60" height="40" rx="6" class="i-b4"></rect>
  <rect x="10" y="12" width="52" height="32" rx="3" fill="#24553f"></rect>
  <text x="36" y="34" font-size="15" text-anchor="middle" fill="#ffffff" style="font-family: var(--hand); font-weight: 700">2+3=5</text>
  <path d="M20 48L14 66M52 48L58 66" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"></path>
  <path class="i-stroke-r" d="M50 40L64 56"></path>
</svg>`;

const ILL_STUDENT = `<svg viewBox="0 0 72 72" aria-hidden="true">
  <rect x="8" y="14" width="40" height="50" rx="5" class="i-paper"></rect>
  <path class="i-margin" d="M16 14V64"></path>
  <path class="i-stroke" d="M22 28H40M22 37H38M22 46H34"></path>
  <rect x="34" y="6" width="30" height="54" rx="7" class="i-phone"></rect>
  <rect x="37" y="11" width="24" height="44" rx="4" class="i-screen"></rect>
  <circle cx="49" cy="33" r="7" class="i-stroke"></circle>
  <circle cx="49" cy="33" r="2.5" class="i-b1"></circle>
</svg>`;

const ILL_FEAT = {
  send: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="10" width="34" height="44" rx="6" class="i-doc"></rect><rect x="12" y="38" width="22" height="10" rx="3" class="i-pdf"></rect><text x="23" y="45.6" font-size="7" text-anchor="middle" class="i-pdft">PDF</text><path class="i-stroke" d="M13 20H31M13 28H27"></path><path class="i-b1" d="M34 30L60 18L50 48L44 38Z"></path><path d="M44 38L60 18" stroke="var(--sheet)" stroke-width="2"></path></svg>`,
  photo: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="18" width="40" height="38" rx="5" class="i-paper"></rect><path class="i-margin" d="M12 18V56"></path><path class="i-stroke" d="M18 30H36M18 39H32M18 48H28"></path><rect x="28" y="6" width="32" height="24" rx="6" class="i-phone"></rect><circle cx="44" cy="18" r="7" class="i-screen"></circle><circle cx="44" cy="18" r="3.5" class="i-b1"></circle><rect x="32" y="9" width="6" height="3" rx="1.5" class="i-b4"></rect></svg>`,
  test: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="8" width="44" height="50" rx="7" class="i-paper"></rect><rect x="24" y="4" width="16" height="9" rx="3" class="i-b1"></rect><circle cx="21" cy="25" r="5" class="i-ok"></circle><path class="i-okm" d="M18.5 25l2 2 3.5-4"></path><path class="i-stroke" d="M30 25H46"></path><circle cx="21" cy="38" r="5" class="i-ok"></circle><path class="i-okm" d="M18.5 38l2 2 3.5-4"></path><path class="i-stroke" d="M30 38H44"></path><circle cx="21" cy="50" r="5" fill="none" stroke="var(--line)" stroke-width="2"></circle><path class="i-stroke" d="M30 50H42" opacity="0.4"></path></svg>`,
  report: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="8" width="46" height="46" rx="7" class="i-paper"></rect><rect x="14" y="34" width="7" height="12" rx="2" class="i-b3"></rect><rect x="25" y="24" width="7" height="22" rx="2" class="i-b1"></rect><rect x="36" y="16" width="7" height="30" rx="2" class="i-b4"></rect><circle cx="50" cy="48" r="11" class="i-b2"></circle><path d="M50 42V53M45.5 48.5L50 53L54.5 48.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
  ai: `<svg viewBox="0 0 64 64" aria-hidden="true"><path class="i-b1" d="M8 12H50A6 6 0 0 1 56 18V38A6 6 0 0 1 50 44H26L14 54V44H8A6 6 0 0 1 2 38V18A6 6 0 0 1 8 12Z"></path><text x="15" y="33" font-size="13" fill="var(--on-siyoh)" style="font-family: var(--hand); font-weight: 700">1</text><path d="M22 29H28" stroke="var(--on-siyoh)" stroke-width="2" stroke-linecap="round"></path><text x="31" y="33" font-size="13" fill="var(--on-siyoh)" style="font-family: var(--hand); font-weight: 700">2</text><path d="M38 29H44" stroke="var(--on-siyoh)" stroke-width="2" stroke-linecap="round"></path><circle cx="50" cy="12" r="8" class="i-b4"></circle><path d="M50 7V17M45 12H55" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"></path></svg>`
};

const ILL_EMPTY = `<svg viewBox="0 0 72 72" aria-hidden="true"><rect x="12" y="10" width="44" height="54" rx="7" class="i-paper"></rect><path class="i-margin" d="M22 10V64"></path><path d="M28 26H48M28 36H44" stroke="var(--line)" stroke-width="3" stroke-linecap="round"></path><circle cx="50" cy="52" r="12" class="i-b4"></circle><text x="50" y="58" font-size="17" text-anchor="middle" fill="var(--ink)" style="font-family: var(--hand); font-weight: 700">?</text></svg>`;

const IC = {
  check: `<svg viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="10" class="i-ok"></circle><path class="i-okm" d="M6.5 11.2l3 3L15.5 8"></path></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L10 14"></path><path d="M21 3l-7 18-4-7-7-4z"></path></svg>`,
  inbox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13h5l2 3h4l2-3h5"></path><path d="M5 5h14l2 8v6H3v-6z"></path></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"></circle><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"></path><path d="M16 4.5a3.5 3.5 0 0 1 0 7"></path><path d="M18 14.8c2 .8 3.2 2.6 3.6 5.2"></path></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c1-4 4-6 8-6s7 2 8 6"></path></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"></path><path d="M4 17a3 3 0 0 1 3-3h11"></path></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"></path></svg>`,
  ai: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"></path><path d="M9 10h.01M12 10h.01M15 10h.01"></path></svg>`,
  upload: `<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="2" y="2" width="36" height="36" rx="10" class="i-soft"></rect><path class="i-stroke" d="M20 27V13M14 18.5L20 12.5L26 18.5M12 28H28"></path></svg>`,
  camera: `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="2" y="2" width="32" height="32" rx="9" class="i-soft"></rect><path class="i-stroke" d="M9 13h4l2-3h6l2 3h4v13H9z"></path><circle class="i-stroke" cx="18" cy="19" r="4"></circle></svg>`,
  list: `<svg viewBox="0 0 36 36" aria-hidden="true"><rect x="2" y="2" width="32" height="32" rx="9" class="i-soft"></rect><path class="i-stroke-g" d="M9 12l2 2 3.5-3.5M9 21l2 2 3.5-3.5"></path><path class="i-stroke" d="M18 12.5H27M18 21.5H27M18 28H25"></path></svg>`,
  pdf: `<svg viewBox="0 0 40 48" aria-hidden="true"><rect x="1" y="1" width="38" height="46" rx="6" class="i-doc"></rect><rect x="6" y="28" width="28" height="13" rx="3" class="i-pdf"></rect><text x="20" y="37.5" font-size="8.5" text-anchor="middle" class="i-pdft">PDF</text><path class="i-stroke" d="M9 11H29M9 18H24"></path></svg>`,
  cam: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"></path><circle cx="12" cy="13" r="3.5"></circle></svg>`,
  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"></path></svg>`,
  back: `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4L6 10l6 6"></path></svg>`
};
