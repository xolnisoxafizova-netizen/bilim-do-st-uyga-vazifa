/* ================= Bilim do'sti: homework platform ================= */
"use strict";

/* ---------- helpers ---------- */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fmt = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").split(/\n{2,}/).map((p) => "<p>" + p.replace(/\n/g, "<br>") + "</p>").join("");
const rid = (n = 8) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a, (b) => b.toString(16).padStart(2, "0")).join(""); };
const pad = (n) => String(n).padStart(2, "0");
const OY = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const OYQ = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
const when = (ms) => { const d = new Date(Number(ms) || 0); return `${d.getDate()}-${OYQ[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dayOnly = (ms) => { const d = new Date(Number(ms) || 0); return `${d.getDate()}-${OYQ[d.getMonth()]}`; };
const dayLabel = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); return m ? `${Number(m[3])}-${OY[Number(m[2]) - 1]}` : ""; };
const one = (x) => (Math.round(x * 10) / 10).toString().replace(".", ",");
function getPath(o, p) { return p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
function setPath(o, p, v) { const k = p.split("."); let a = o; for (let i = 0; i < k.length - 1; i++) { if (a[k[i]] == null) a[k[i]] = {}; a = a[k[i]]; } a[k[k.length - 1]] = v; }

const VILOYATLAR = ["Qoraqalpog'iston Respublikasi", "Andijon viloyati", "Buxoro viloyati", "Farg'ona viloyati", "Jizzax viloyati", "Xorazm viloyati", "Namangan viloyati", "Navoiy viloyati", "Qashqadaryo viloyati", "Samarqand viloyati", "Sirdaryo viloyati", "Surxondaryo viloyati", "Toshkent viloyati", "Toshkent shahri"];
const FANLAR = ["Matematika", "Algebra", "Geometriya", "Fizika", "Kimyo", "Biologiya", "Ona tili", "Adabiyot", "Ingliz tili", "Rus tili", "Tarix", "Geografiya", "Informatika"];
const FAN_HUE = { Matematika: 1, Algebra: 1, Geometriya: 1, Fizika: 2, Informatika: 2, Kimyo: 3, Biologiya: 3, "Ona tili": 4, Adabiyot: 4, "Ingliz tili": 5, "Rus tili": 5, Tarix: 6, Geografiya: 6 };
const fanCls = (f) => "fan fan-" + (FAN_HUE[f] || 1);
const LETTERS = ["A", "B", "C", "D"];

const normKey = (s) => String(s || "").toLowerCase().replace(/[ʻʼ'`’‘]/g, "").replace(/[^a-z0-9Ѐ-ӿ]+/g, "");
function normSinf(raw) {
  const m = String(raw || "").trim().toUpperCase().replace(/\s+/g, "").match(/^(\d{1,2})[-–—]?([A-ZА-ЯЁ]{0,2})$/);
  if (!m) return null;
  const n = Number(m[1]);
  if (n < 1 || n > 11) return null;
  return m[2] ? n + "-" + m[2] : String(n);
}
function parseSinflar(text) {
  const out = [];
  String(text || "").split(/[,;\n]+|\s+(?=\d)/).forEach((p) => { const s = normSinf(p); if (s && !out.includes(s)) out.push(s); });
  return out;
}
const sinfNum = (s) => Number(String(s || "").split("-")[0]) || 0;
const schoolKeyOf = (t) => [t.viloyat, t.tuman, t.maktab].map(normKey).join("|");
const fullName = (p) => `${p.familiya || ""} ${p.ism || ""}`.trim();
const initials = (p) => (((p.ism || "?")[0] || "") + ((p.familiya || "")[0] || "")).toUpperCase();
const byName = (a, b) => fullName(a).localeCompare(fullName(b), "uz");

const validLogin = (l) => /^[a-z0-9][a-z0-9._-]{2,31}$/.test(l);
const CYR = { "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sh", "ъ": "", "ы": "i", "ь": "", "э": "e", "ю": "yu", "я": "ya", "ў": "o", "қ": "q", "ғ": "g", "ҳ": "h" };
const slug = (s) => String(s || "").toLowerCase().replace(/[ʻʼ'`’‘]/g, "").replace(/[Ѐ-ӿ]/g, (c) => CYR[c] ?? "").replace(/[^a-z0-9]+/g, "");
function baseLogin(ism, fam) { let b = [slug(ism), slug(fam)].filter(Boolean).join("."); if (b.length < 3) b = "oquvchi"; return b.slice(0, 26); }
function genPass() { const al = "abcdefghjkmnpqrstuvwxyz23456789"; const a = new Uint8Array(7); crypto.getRandomValues(a); return Array.from(a, (b) => al[b % al.length]).join(""); }
async function hashPass(pass, salt) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + ":" + pass));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/* files */
const isPdfFile = (f) => !!f && (f.type === "application/pdf" || /\.pdf$/i.test(f.name || ""));
const isImgFile = (f) => !!f && (/^image\//.test(f.type || "") || /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name || ""));
const fileUrl = (f) => (!f ? "" : f.id ? "/_blob/" + f.id : (f.data || ""));
const isImgRef = (f) => !!f && /^image\//.test(f.turi || "");
async function toJpeg(file, max, q) {
  const bmp = await createImageBitmap(file);
  const sc = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(bmp.width * sc));
  c.height = Math.max(1, Math.round(bmp.height * sc));
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob"))), "image/jpeg", q));
}
const blobToDataUrl = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });

function assetMsg(e) {
  const c = e && e.code;
  if (c === "too_large") return "Fayl juda katta (20 MB dan oshmasin).";
  if (c === "unsupported_type") return "Bu fayl turini yuklab bo'lmaydi. Rasm (JPG, PNG) yoki PDF tanlang.";
  if (c === "quota_or_state") return "Fayllar uchun joy tugadi. Eski vazifalarni o'chiring.";
  if (c === "rate_limited") return "Juda tez yuklanmoqda. Bir oz kutib, qayta urinib ko'ring.";
  return "Faylni yuklab bo'lmadi. Qayta urinib ko'ring.";
}
async function uploadFile(file) {
  const pdf = isPdfFile(file), img = isImgFile(file);
  if (!pdf && !img) throw new Error("Faqat rasm yoki PDF fayl yuklang.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Fayl 20 MB dan katta. Kichikroq fayl tanlang.");
  const nomi = (file.name || (pdf ? "fayl.pdf" : "rasm.jpg")).slice(0, 120);
  if (R.local) {
    if (pdf) {
      if (file.size > 10 * 1024 * 1024) throw new Error("Demo rejimida PDF 10 MB dan oshmasin.");
      return { data: await blobToDataUrl(file), nomi, turi: "application/pdf" };
    }
    let small;
    try { small = await toJpeg(file, 1600, 0.8); } catch (_) { throw new Error("Bu rasmni ochib bo'lmadi. JPG yoki PNG rasm tanlang."); }
    return { data: await blobToDataUrl(small), nomi, turi: "image/jpeg" };
  }
  let blob = file, type = pdf ? "application/pdf" : file.type;
  if (img && !/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { blob = await toJpeg(file, 2200, 0.88); type = "image/jpeg"; }
  if (R.assets) {
    try {
      const r = await R.assets.upload(blob, { type });
      return { id: r.id, nomi, turi: type };
    } catch (e) {
      if (pdf) throw new Error(assetMsg(e));
    }
  } else if (pdf) {
    throw new Error("Bu ko'rinishda PDF yuklab bo'lmaydi. Rasm yuklang yoki sahifa egasidan fayl yuklash ruxsatini so'rang.");
  }
  // Fallback for images: a small copy kept inside the record itself.
  for (const [max, q] of [[1280, 0.72], [1000, 0.62], [800, 0.55]]) {
    const small = await toJpeg(blob, max, q);
    if (small.size <= 170000) return { data: await blobToDataUrl(small), nomi, turi: "image/jpeg" };
  }
  throw new Error("Rasm juda katta. Kichikroq yoki aniqroq kesilgan rasm tanlang.");
}

function dbMsg(e) {
  const c = e && e.code;
  if (!c && e && e.message) return e.message;
  if (c === "invalid_argument") return "Saqlab bo'lmadi: sizda bu sahifaga yozish huquqi yo'q. Sahifa egasi sizga Contributor huquqini bersin.";
  if (c === "quota_exceeded") return "Ma'lumotlar bazasi to'ldi. Eski ma'lumotlarni o'chiring.";
  if (c === "resource_exhausted") return "So'rovlar juda ko'p. Bir oz kutib, qayta urinib ko'ring.";
  if (c === "unavailable") return "Aloqa uzildi. Qayta urinib ko'ring.";
  if (c === "revoked" || c === "not_granted") return "Ma'lumotlar bazasiga kirish yopildi. Sahifani yangilang.";
  return "Saqlab bo'lmadi. Qayta urinib ko'ring.";
}
const noDbMsg = () => (R.db === undefined ? "Platforma ulanmoqda. Bir necha soniyadan keyin qayta urinib ko'ring." : "Platforma faqat claude.ai ichida ochilganda ishlaydi: ma'lumotlar o'sha yerda saqlanadi.");

/* ---------- state ---------- */
const freshQ = () => ({ savol: "", v: ["", "", "", ""], togri: 0 });
const freshTask = (sinf, fan) => ({ sinf: sinf || "", fan: fan || "", turi: "savol", sarlavha: "", izoh: "", muddat: "", savollar: [freshQ()] });
function freshForms() {
  return {
    login: { login: "", parol: "" },
    reg: { ism: "", familiya: "", viloyat: "", tuman: "", maktab: "", sinflar: "", fanlar: [], login: "", parol: "", parol2: "" },
    task: freshTask(),
    one: { ism: "", familiya: "", sinf: "", login: "", parol: "" },
    bulk: { sinf: "", text: "", tartib: "fi" },
    prof: null,
    pass: { eski: "", yangi: "" },
    rep: { sinf: "", fan: "all" },
    inbox: { sinf: "all", fan: "all", holat: "yangi", task: "all" }
  };
}
const AI_HELLO = "Salom! Men **Bilim do'sti**man.\nMasalani yozing yoki rasmini yuboring. Javobni darrov aytmayman: har qadamda bitta savol beraman, siz esa o'zingiz yechasiz.";
const freshAi = () => ({ log: [{ id: "hello", who: "bot", tag: "salom!", text: AI_HELLO }], p: null, input: "", fan: "" });
const freshState = () => ({ route: "bosh", session: null, forms: freshForms(), err: {}, stuFan: "all", openTask: null, reAns: null, testAns: {}, openSub: null, grade: {}, sinfTab: "", ai: freshAi(), confirm: null });

let S = freshState();
const R = {
  db: undefined, assets: undefined, downloads: undefined, sample: undefined, samplePromise: Promise.resolve(null),
  aiImages: false, aiOff: false, me: null, tasks: [], students: [], subs: [], loaded: {}, unsubs: [],
  slow: false, dbErr: false, restoring: false, working: "", files: { task: null, ans: null, ai: null }, urls: {},
  creds: null, aiBusy: false, aiCtl: null, aiStream: "", aiRetry: null, aiImg: new Map(), toastT: 0,
  local: false, localVolatile: false, demoSeeded: false, fileReg: new Map()
};

/* ---------- standalone mode: outside claude.ai the data lives in this browser ---------- */
async function makeLocalDb() {
  const store = new Map(), subs = [];
  let idb = null;
  try {
    idb = await new Promise((res, rej) => {
      const r = indexedDB.open("bilimdosti", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("docs");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    await new Promise((res) => {
      const req = idb.transaction("docs").objectStore("docs").openCursor();
      req.onsuccess = () => { const c = req.result; if (c) { store.set(String(c.key), c.value); c.continue(); } else res(); };
      req.onerror = () => res();
    });
  } catch (_) { idb = null; R.localVolatile = true; }
  const persist = (path, data) => {
    if (!idb) return;
    try { const os = idb.transaction("docs", "readwrite").objectStore("docs"); if (data === undefined) os.delete(path); else os.put(data, path); } catch (_) {}
  };
  const clone = (d) => JSON.parse(JSON.stringify(d));
  const last = (p) => p.slice(p.lastIndexOf("/") + 1);
  const parent = (p) => p.slice(0, p.lastIndexOf("/"));
  const ok = (d, fs) => fs.every(([f, op, v]) => (op === "==" ? d[f] === v : op === "in" ? Array.isArray(v) && v.includes(d[f]) : true));
  const snap = (colPath, fs) => {
    const docs = [];
    store.forEach((d, p) => { if (parent(p) === colPath && ok(d, fs)) docs.push({ id: last(p), exists: true, data: () => clone(d), metadata: { fromCache: false, hasPendingWrites: false } }); });
    return { docs, size: docs.length, empty: !docs.length, metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => [] };
  };
  let queued = false;
  const notify = () => { if (queued) return; queued = true; setTimeout(() => { queued = false; subs.slice().forEach((x) => x.next(snap(x.col, x.fs))); }, 0); };
  const docRef = (path) => ({
    id: last(path), path,
    get: async () => { const d = store.get(path); return { id: last(path), exists: !!d, data: () => (d ? clone(d) : undefined), metadata: {} }; },
    set: async (data) => { const d = clone(data); store.set(path, d); persist(path, d); notify(); },
    update: async (data) => { const cur = store.get(path); if (!cur) throw { code: "invalid_argument", message: "missing" }; const d = Object.assign(clone(cur), clone(data)); store.set(path, d); persist(path, d); notify(); },
    delete: async () => { store.delete(path); persist(path, undefined); notify(); }
  });
  const query = (colPath, fs) => ({
    where: (f, op, v) => query(colPath, fs.concat([[f, op, v]])),
    orderBy: () => query(colPath, fs),
    limit: () => query(colPath, fs),
    get: async () => snap(colPath, fs),
    onSnapshot: (next) => { const x = { col: colPath, fs, next }; subs.push(x); setTimeout(() => next(snap(colPath, fs)), 0); return () => { const i = subs.indexOf(x); if (i >= 0) subs.splice(i, 1); }; }
  });
  return {
    doc: docRef,
    collection: (colPath) => Object.assign(query(colPath, []), { path: colPath, doc: (id) => docRef(colPath + "/" + (id || "l" + rid(8))) }),
    clearAll: async () => { store.clear(); if (idb) { try { idb.transaction("docs", "readwrite").objectStore("docs").clear(); } catch (_) {} } notify(); }
  };
}
const localDownloads = {
  save: async ({ filename, data }) => {
    const blob = data instanceof Blob ? data : new Blob([data], { type: /\.csv$/i.test(filename) ? "text/csv;charset=utf-8" : "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return { status: "saved" };
  }
};
async function openDataFile(f) {
  try {
    const blob = await (await fetch(f.data)).blob();
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) { const a = document.createElement("a"); a.href = url; a.download = f.nomi || "fayl.pdf"; document.body.appendChild(a); a.click(); a.remove(); }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (_) { toast("Faylni ochib bo'lmadi."); }
}
async function seedDemo() {
  if (!R.db || !R.local) return;
  R.working = "seed"; render();
  try {
    if (await getDoc("logins/oqituvchi")) { R.demoSeeded = true; return; }
    const t = { login: "oqituvchi", ism: "Dilnoza", familiya: "Karimova", viloyat: "Toshkent shahri", tuman: "Chilonzor tumani", maktab: "21-maktab", sinflar: ["7-A", "7-B"], fanlar: ["Matematika", "Fizika", "Ona tili"], yaratilgan: Date.now(), demo: true };
    t.schoolKey = schoolKeyOf(t);
    t.classKeys = t.sinflar.map((x) => t.schoolKey + "|" + x);
    t.salt = rid(12);
    t.hash = await hashPass("demo123", t.salt);
    const tid = "demo-oqituvchi";
    await R.db.doc("teachers/" + tid).set(t);
    await R.db.doc("logins/oqituvchi").set({ role: "teacher", ref: tid });
    for (const [ism, familiya, login] of [["Aziza", "Karimova", "aziza"], ["Jasur", "Toshmatov", "jasur"], ["Madina", "Rahimova", "madina"]]) {
      const salt = rid(12), hash = await hashPass("demo123", salt), id = "demo-" + login;
      await R.db.doc("students/" + id).set({ teacherId: tid, login, salt, hash, ism, familiya, sinf: "7-A", schoolKey: t.schoolKey, classKey: t.schoolKey + "|7-A", maktab: t.maktab, tuman: t.tuman, viloyat: t.viloyat, yaratilgan: Date.now(), demo: true });
      await R.db.doc("logins/" + login).set({ role: "student", ref: id });
    }
    const due = new Date(Date.now() + 2 * 864e5);
    const iso = `${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(due.getDate())}`;
    const base = { teacherId: tid, teacherIsm: "Karimova Dilnoza", schoolKey: t.schoolKey, classKey: t.schoolKey + "|7-A", sinf: "7-A", fayl: null, muddat: iso };
    await R.db.doc("tasks/demo-vazifa-1").set(Object.assign({}, base, { fan: "Matematika", turi: "savol", sarlavha: "Tenglamalar: 1–3-misollar", izoh: "Daftaringizda yeching va rasmga olib yuklang:\n1) 3x + 7 = 22\n2) 5x − 4 = 21\n3) 2(x + 3) = 18", savollar: [], yaratilgan: Date.now() - 3600e3 }));
    await R.db.doc("tasks/demo-vazifa-2").set(Object.assign({}, base, { fan: "Fizika", turi: "test", sarlavha: "Tezlik mavzusi bo'yicha test", izoh: "3 ta savol. Har birida bitta to'g'ri javob bor.", savollar: [
      { savol: "Tezlik qaysi birlikda o'lchanadi?", v: ["kg", "m/s", "N", "J"], togri: 1 },
      { savol: "Avtomobil 2 soatda 120 km yurdi. Uning tezligi qancha?", v: ["60 km/soat", "240 km/soat", "120 km/soat", "30 km/soat"], togri: 0 },
      { savol: "Tezlik formulasi qaysi?", v: ["v = s · t", "v = s / t", "v = t / s", "v = m · a"], togri: 1 }
    ], yaratilgan: Date.now() - 1800e3 }));
    R.demoSeeded = true;
    S.forms.login.login = "oqituvchi";
    toast("Demo hisoblar yaratildi. Parol hammasida: demo123");
  } catch (err) { toast(dbMsg(err)); }
  finally { R.working = ""; render(); }
}
async function clearAllLocal() {
  S.confirm = null;
  if (!R.db || !R.db.clearAll) return;
  endSession();
  await R.db.clearAll();
  R.demoSeeded = false;
  toast("Bu brauzerdagi barcha ma'lumotlar o'chirildi.");
  go("kirish");
}

/* ---------- capabilities and session ---------- */
function initCaps() {
  const c = window.claude;
  if (!c || typeof c.use !== "function") {
    R.local = true; R.assets = null; R.downloads = localDownloads; R.sample = null;
    render();
    makeLocalDb().then(async (db) => {
      R.db = db;
      try { R.demoSeeded = !!(await getDoc("logins/oqituvchi")); } catch (_) {}
      render();
      restoreSession();
    }).catch(() => { R.db = null; render(); });
    return;
  }
  c.use("db").then((db) => { R.db = db || null; render(); restoreSession(); }).catch(() => { R.db = null; render(); });
  c.use("assets").then((a) => { R.assets = a || null; }).catch(() => { R.assets = null; });
  c.use("downloads").then((d) => { R.downloads = d || null; }).catch(() => { R.downloads = null; });
  R.samplePromise = c.use("sample").then((s) => {
    R.sample = s || null;
    if (s) s.limits().then((l) => { R.aiImages = !!(l && l.images); render(); }).catch(() => {});
    else render();
    return R.sample;
  }).catch(() => { R.sample = null; return null; });
}
const LS = "bilimdosti.session";
function lsGet() { try { return JSON.parse(localStorage.getItem(LS) || "null"); } catch (_) { return null; } }
function lsSet(v) { try { if (v) localStorage.setItem(LS, JSON.stringify(v)); else localStorage.removeItem(LS); } catch (_) {} }
const col = (n) => R.db.collection(n);
async function getDoc(path) { const s = await R.db.doc(path).get(); return s && s.exists ? Object.assign({ id: s.id }, s.data()) : null; }

async function restoreSession() {
  const s = S.session || lsGet();
  if (!s || !R.db || R.me) return;
  R.restoring = true; render();
  try {
    const doc = await getDoc((s.role === "teacher" ? "teachers/" : "students/") + s.id);
    if (doc) beginSession(s.role, doc, null); else endSession();
  } catch (_) { /* keep the login screen */ }
  finally { R.restoring = false; render(); }
}
function beginSession(role, doc, route) {
  stopSubs();
  S.session = { role, id: doc.id };
  lsSet(S.session);
  R.me = doc;
  if (role === "teacher") {
    const f = S.forms, s0 = doc.sinflar[0] || "", f0 = doc.fanlar[0] || "";
    if (!doc.sinflar.includes(f.task.sinf)) f.task.sinf = s0;
    if (!doc.fanlar.includes(f.task.fan)) f.task.fan = f0;
    if (!doc.sinflar.includes(f.one.sinf)) f.one.sinf = s0;
    if (!doc.sinflar.includes(f.bulk.sinf)) f.bulk.sinf = s0;
    if (!doc.sinflar.includes(f.rep.sinf)) f.rep.sinf = s0;
    if (!doc.sinflar.includes(S.sinfTab)) S.sinfTab = s0;
    subscribeTeacher(doc);
  } else subscribeStudent(doc);
  if (route) go(route); else render();
}
function endSession() {
  stopSubs();
  R.me = null; R.tasks = []; R.students = []; R.subs = []; R.creds = null;
  lsSet(null);
  ["task", "ans", "ai"].forEach((k) => setFile(k, null));
  const route = S.route;
  S = freshState();
  S.route = route;
}
function logout() { endSession(); go("bosh"); toast("Tizimdan chiqdingiz."); }

function stopSubs() { R.unsubs.forEach((u) => { try { u(); } catch (_) {} }); R.unsubs = []; R.loaded = {}; R.slow = false; R.dbErr = false; }
function listen(q, key) {
  R.loaded[key] = false;
  let t = setTimeout(() => { t = 0; if (!R.loaded[key]) { R.slow = true; render(); } }, 10000);
  let un = null;
  try {
    un = q.onSnapshot((snap) => {
      if (t) { clearTimeout(t); t = 0; }
      R[key] = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      R.loaded[key] = true; R.slow = false;
      render();
    }, () => { if (t) { clearTimeout(t); t = 0; } R.loaded[key] = true; R.dbErr = true; render(); });
  } catch (_) { R.loaded[key] = true; R.dbErr = true; }
  R.unsubs.push(() => { if (t) clearTimeout(t); if (un) un(); });
}
function subscribeTeacher(t) {
  listen(col("tasks").where("teacherId", "==", t.id), "tasks");
  listen(col("submissions").where("teacherId", "==", t.id), "subs");
  const keys = (t.classKeys || []).slice(0, 30);
  if (keys.length) listen(col("students").where("classKey", "in", keys), "students");
  else { R.students = []; R.loaded.students = true; }
}
function subscribeStudent(st) {
  listen(col("tasks").where("classKey", "==", st.classKey), "tasks");
  listen(col("submissions").where("studentId", "==", st.id), "subs");
}

/* ---------- auth actions ---------- */
async function doRegister() {
  const f = S.forms.reg;
  const e = (m) => { S.err.reg = m; render(); };
  if (!R.db) return e(noDbMsg());
  const ism = f.ism.trim(), familiya = f.familiya.trim(), tuman = f.tuman.trim(), maktab = f.maktab.trim();
  if (!ism || !familiya) return e("Ism va familiyani kiriting.");
  if (!f.viloyat) return e("Viloyatni tanlang.");
  if (!tuman || !maktab) return e("Tuman (yoki shahar) va maktabni kiriting.");
  const sinflar = parseSinflar(f.sinflar);
  if (!sinflar.length) return e("Kamida bitta sinf kiriting, masalan: 7-A, 7-B.");
  if (!f.fanlar.length) return e("Kamida bitta fanni tanlang.");
  const login = f.login.trim().toLowerCase();
  if (!validLogin(login)) return e("Login 3–32 belgidan iborat bo'lsin: lotin harflari, raqam, nuqta yoki chiziqcha.");
  if (f.parol.length < 6) return e("Parol kamida 6 belgidan iborat bo'lsin.");
  if (f.parol !== f.parol2) return e("Parollar bir xil emas.");
  S.err.reg = ""; R.working = "reg"; render();
  try {
    if (await getDoc("logins/" + login)) throw new Error("Bu login band. Boshqasini tanlang.");
    const t = { login, ism, familiya, viloyat: f.viloyat, tuman, maktab, sinflar, fanlar: f.fanlar.slice(), yaratilgan: Date.now() };
    t.schoolKey = schoolKeyOf(t);
    t.classKeys = sinflar.map((s) => t.schoolKey + "|" + s);
    t.salt = rid(12);
    t.hash = await hashPass(f.parol, t.salt);
    const id = col("teachers").doc().id;
    await R.db.doc("teachers/" + id).set(t);
    await R.db.doc("logins/" + login).set({ role: "teacher", ref: id });
    S.forms.reg = freshForms().reg;
    beginSession("teacher", Object.assign({ id }, t), "oqituvchi-sinflar");
    toast("Xush kelibsiz! Endi sinfingizga o'quvchilarni qo'shing.");
  } catch (err) { S.err.reg = dbMsg(err); }
  finally { R.working = ""; render(); }
}
async function doLogin() {
  const f = S.forms.login;
  const e = (m) => { S.err.login = m; render(); };
  if (!R.db) return e(noDbMsg());
  const login = f.login.trim().toLowerCase();
  if (!login || !f.parol) return e("Login va parolni kiriting.");
  const bad = "Login yoki parol noto'g'ri. Qayta tekshiring.";
  if (!validLogin(login)) return e(bad);
  S.err.login = ""; R.working = "login"; render();
  try {
    const l = await getDoc("logins/" + login);
    if (!l || (l.role !== "teacher" && l.role !== "student")) throw new Error(bad);
    const doc = await getDoc((l.role === "teacher" ? "teachers/" : "students/") + l.ref);
    if (!doc || (await hashPass(f.parol, doc.salt)) !== doc.hash) throw new Error(bad);
    S.forms.login = { login: "", parol: "" };
    beginSession(l.role, doc, l.role === "teacher" ? "oqituvchi-vazifa" : "oquvchi-vazifalar");
    toast(`Xush kelibsiz, ${doc.ism}!`);
  } catch (err) { S.err.login = dbMsg(err); }
  finally { R.working = ""; render(); }
}

/* ---------- teacher: students ---------- */
async function createStudents(list) {
  const t = R.me, taken = new Set(), out = [];
  try {
    for (const s of list) {
      let login = (s.login || "").trim().toLowerCase();
      if (login) {
        if (!validLogin(login)) throw new Error(`"${login}" login noto'g'ri: lotin harflari, raqam, nuqta yoki chiziqcha bo'lsin.`);
        if (taken.has(login) || (await getDoc("logins/" + login))) throw new Error(`"${login}" login band. Boshqasini yozing yoki bo'sh qoldiring.`);
      } else {
        const base = baseLogin(s.ism, s.familiya);
        login = base;
        let n = 1;
        while (taken.has(login) || (await getDoc("logins/" + login))) { n++; login = base + n; }
      }
      taken.add(login);
      const parol = (s.parol || "").trim() || genPass();
      const salt = rid(12);
      const hash = await hashPass(parol, salt);
      const id = col("students").doc().id;
      await R.db.doc("students/" + id).set({
        teacherId: t.id, login, salt, hash, ism: s.ism, familiya: s.familiya, sinf: s.sinf,
        schoolKey: t.schoolKey, classKey: t.schoolKey + "|" + s.sinf,
        maktab: t.maktab, tuman: t.tuman, viloyat: t.viloyat, yaratilgan: Date.now()
      });
      await R.db.doc("logins/" + login).set({ role: "student", ref: id });
      out.push({ ism: s.ism, familiya: s.familiya, sinf: s.sinf, login, parol });
    }
  } catch (err) { err.partial = out; throw err; }
  return out;
}
async function addOne() {
  const f = S.forms.one;
  const e = (m) => { S.err.one = m; render(); };
  const ism = f.ism.trim(), familiya = f.familiya.trim();
  if (!ism || !familiya) return e("Ism va familiyani kiriting.");
  if (!R.me.sinflar.includes(f.sinf)) return e("Sinfni tanlang.");
  if (f.parol.trim() && f.parol.trim().length < 6) return e("Parol kamida 6 belgi bo'lsin yoki bo'sh qoldiring: avtomatik yaratiladi.");
  S.err.one = ""; R.working = "one"; render();
  try {
    R.creds = await createStudents([{ ism, familiya, sinf: f.sinf, login: f.login, parol: f.parol }]);
    S.forms.one = Object.assign(freshForms().one, { sinf: f.sinf });
    S.sinfTab = f.sinf;
    toast(`${familiya} ${ism} qo'shildi.`);
  } catch (err) { if (err.partial && err.partial.length) R.creds = err.partial; S.err.one = dbMsg(err); }
  finally { R.working = ""; render(); }
}
async function addBulk() {
  const f = S.forms.bulk;
  const e = (m) => { S.err.bulk = m; render(); };
  if (!R.me.sinflar.includes(f.sinf)) return e("Sinfni tanlang.");
  const rows = f.text.split(/\n+/)
    .map((l) => l.trim().replace(/^\d+\s*[.)-]?\s*/, ""))
    .filter(Boolean)
    .map((l) => l.split(/\s+/))
    .filter((w) => w.length >= 2)
    .map((w) => (f.tartib === "fi" ? { familiya: w[0], ism: w.slice(1).join(" ") } : { ism: w[0], familiya: w.slice(1).join(" ") }));
  if (!rows.length) return e("Har qatorga bitta o'quvchini yozing: familiya va ism.");
  if (rows.length > 60) return e("Bir martada 60 tagacha o'quvchi qo'shing.");
  const sinf = f.sinf, text = f.text;
  S.err.bulk = ""; R.working = "bulk"; render();
  try {
    R.creds = await createStudents(rows.map((r) => Object.assign(r, { sinf })));
    if (S.forms.bulk.text === text) S.forms.bulk.text = "";
    S.sinfTab = sinf;
    toast(`${R.creds.length} nafar o'quvchi qo'shildi.`);
  } catch (err) { if (err.partial && err.partial.length) R.creds = err.partial; S.err.bulk = dbMsg(err); }
  finally { R.working = ""; render(); }
}
async function resetPass(id) {
  const st = R.students.find((s) => s.id === id);
  if (!st) return;
  R.working = "reset-" + id; render();
  try {
    const parol = genPass(), salt = rid(12), hash = await hashPass(parol, salt);
    await R.db.doc("students/" + id).update({ salt, hash });
    R.creds = [{ ism: st.ism, familiya: st.familiya, sinf: st.sinf, login: st.login, parol }];
    toast("Yangi parol yaratildi.");
  } catch (err) { toast(dbMsg(err)); }
  finally { R.working = ""; render(); }
}
async function delStudent(id) {
  const st = R.students.find((s) => s.id === id);
  S.confirm = null;
  if (!st) return render();
  try {
    await R.db.doc("students/" + id).delete();
    await R.db.doc("logins/" + st.login).delete();
    toast(`${fullName(st)} ro'yxatdan o'chirildi.`);
  } catch (err) { toast(dbMsg(err)); }
  render();
}

/* ---------- teacher: homework ---------- */
async function sendTask() {
  const f = S.forms.task, me = R.me;
  const e = (m) => { S.err.task = m; render(); };
  if (!me.sinflar.includes(f.sinf)) return e("Sinfni tanlang.");
  if (!me.fanlar.includes(f.fan)) return e("Fanni tanlang.");
  const sarlavha = f.sarlavha.trim();
  if (!sarlavha) return e("Vazifa nomini yozing, masalan: §12, 3-mashq.");
  const savollar = [];
  if (f.turi === "savol") {
    if (!R.files.task && !f.izoh.trim()) return e("Vazifa rasmini yoki PDF faylini yuklang (yoki izohga vazifa matnini yozing).");
  } else {
    for (let i = 0; i < f.savollar.length; i++) {
      const q = f.savollar[i], savol = q.savol.trim(), v = q.v.map((x) => x.trim());
      if (!savol) return e(`${i + 1}-savol matnini yozing.`);
      if (v.filter(Boolean).length < 2) return e(`${i + 1}-savolga kamida 2 ta javob varianti yozing.`);
      if (!v[q.togri]) return e(`${i + 1}-savolda to'g'ri javob bo'sh variantga belgilangan.`);
      const opts = [];
      let tog = 0;
      v.forEach((x, j) => { if (x) { if (j === q.togri) tog = opts.length; opts.push(x); } });
      savollar.push({ savol, v: opts, togri: tog });
    }
  }
  // Read every value now: the form stays editable while the file uploads.
  const v = { sinf: f.sinf, fan: f.fan, turi: f.turi, izoh: f.izoh.trim(), muddat: f.muddat || "" };
  const before = JSON.stringify(f), file = R.files.task;
  S.err.task = ""; R.working = "task"; render();
  try {
    const fayl = file ? await uploadFile(file) : null;
    await col("tasks").doc().set({
      teacherId: me.id, teacherIsm: `${me.familiya} ${me.ism}`, schoolKey: me.schoolKey, classKey: me.schoolKey + "|" + v.sinf,
      sinf: v.sinf, fan: v.fan, turi: v.turi, sarlavha, izoh: v.izoh, muddat: v.muddat, fayl, savollar, yaratilgan: Date.now()
    });
    const n = R.students.filter((s) => s.sinf === v.sinf).length;
    if (JSON.stringify(S.forms.task) === before) S.forms.task = freshTask(v.sinf, v.fan);
    if (R.files.task === file) setFile("task", null);
    toast(n ? `Vazifa ${v.sinf} sinfining ${n} nafar o'quvchisiga yuborildi.` : `Vazifa ${v.sinf} sinfiga yuborildi. Bu sinfga hali o'quvchi qo'shilmagan.`);
  } catch (err) { S.err.task = dbMsg(err); }
  finally { R.working = ""; render(); }
}
async function delTask(id) {
  const t = R.tasks.find((x) => x.id === id);
  S.confirm = null;
  try {
    await R.db.doc("tasks/" + id).delete();
    if (t && t.fayl && t.fayl.id && R.assets) { try { await R.assets.delete(t.fayl.id); } catch (_) {} }
    toast("Vazifa o'chirildi.");
  } catch (err) { toast(dbMsg(err)); }
  render();
}
async function saveGrade(id) {
  const g = S.grade[id] || {};
  if (!g.baho) { S.err.grade = "Bahoni tanlang (2–5)."; render(); return; }
  S.err.grade = ""; R.working = "grade"; render();
  try {
    await R.db.doc("submissions/" + id).update({ baho: g.baho, izohO: (g.izoh || "").trim().slice(0, 500), baholangan: Date.now() });
    toast("Baho saqlandi. O'quvchi uni o'z profilida ko'radi.");
  } catch (err) { S.err.grade = dbMsg(err); }
  finally { R.working = ""; render(); }
}

/* ---------- teacher: profile ---------- */
async function saveProfile() {
  const f = S.forms.prof, me = R.me;
  const e = (m) => { S.err.prof = m; render(); };
  const ism = f.ism.trim(), familiya = f.familiya.trim(), tuman = f.tuman.trim(), maktab = f.maktab.trim();
  if (!ism || !familiya || !f.viloyat || !tuman || !maktab) return e("Barcha maydonlarni to'ldiring.");
  const sinflar = parseSinflar(f.sinflar);
  if (!sinflar.length) return e("Kamida bitta sinf kiriting.");
  if (!f.fanlar.length) return e("Kamida bitta fanni tanlang.");
  S.err.prof = ""; R.working = "prof"; render();
  try {
    const patch = { ism, familiya, viloyat: f.viloyat, tuman, maktab, sinflar, fanlar: f.fanlar.slice() };
    patch.schoolKey = schoolKeyOf(patch);
    patch.classKeys = sinflar.map((s) => patch.schoolKey + "|" + s);
    await R.db.doc("teachers/" + me.id).update(patch);
    if (patch.schoolKey !== me.schoolKey) {
      for (const st of R.students.filter((s) => s.teacherId === me.id)) {
        await R.db.doc("students/" + st.id).update({ schoolKey: patch.schoolKey, classKey: patch.schoolKey + "|" + st.sinf, maktab, tuman, viloyat: f.viloyat });
      }
      for (const t of R.tasks) await R.db.doc("tasks/" + t.id).update({ schoolKey: patch.schoolKey, classKey: patch.schoolKey + "|" + t.sinf, teacherIsm: `${familiya} ${ism}` });
    }
    const updated = Object.assign({}, me, patch);
    S.forms.prof = null;
    beginSession("teacher", updated, null);
    toast("Profil saqlandi.");
  } catch (err) { S.err.prof = dbMsg(err); }
  finally { R.working = ""; render(); }
}
async function changePass() {
  const f = S.forms.pass, me = R.me;
  const e = (m) => { S.err.pass = m; render(); };
  if (!f.eski || !f.yangi) return e("Eski va yangi parolni kiriting.");
  if (f.yangi.length < 6) return e("Yangi parol kamida 6 belgi bo'lsin.");
  R.working = "pass"; render();
  try {
    const cur = await getDoc("teachers/" + me.id);
    if (!cur || (await hashPass(f.eski, cur.salt)) !== cur.hash) throw new Error("Eski parol noto'g'ri.");
    const salt = rid(12), hash = await hashPass(f.yangi, salt);
    await R.db.doc("teachers/" + me.id).update({ salt, hash });
    R.me = Object.assign({}, R.me, { salt, hash });
    S.forms.pass = { eski: "", yangi: "" };
    S.err.pass = "";
    toast("Parol o'zgartirildi.");
  } catch (err) { S.err.pass = dbMsg(err); }
  finally { R.working = ""; render(); }
}

/* ---------- student: answers ---------- */
const subKey = (taskId, stId) => taskId + "__" + stId;
const mySub = (taskId) => R.subs.find((s) => s.taskId === taskId);
const isLate = (task, ms) => !!task.muddat && ms > new Date(task.muddat + "T23:59:59").getTime();
async function saveSubmission(task, extra) {
  const me = R.me, prev = mySub(task.id);
  if (prev && prev.baho) throw new Error("Bu vazifa baholangan. Qayta topshirib bo'lmaydi.");
  const now = Date.now();
  await R.db.doc("submissions/" + subKey(task.id, me.id)).set(Object.assign({
    taskId: task.id, studentId: me.id, teacherId: task.teacherId, classKey: me.classKey, sinf: me.sinf,
    fan: task.fan, sarlavha: task.sarlavha, turi: task.turi, ism: me.ism, familiya: me.familiya,
    topshirilgan: now, kechikdi: isLate(task, now), baho: null, izohO: "", fayl: null, javoblar: null, ball: null, jami: null
  }, extra));
}
async function submitPhoto(taskId) {
  const task = R.tasks.find((t) => t.id === taskId);
  if (!task) return;
  if (!R.files.ans) { S.err.ans = "Javobingizning rasmini yoki PDF faylini tanlang."; render(); return; }
  const file = R.files.ans;
  S.err.ans = ""; R.working = "ans"; render();
  try {
    const fayl = await uploadFile(file);
    await saveSubmission(task, { fayl });
    if (R.files.ans === file) setFile("ans", null);
    S.reAns = null;
    toast("Javob o'qituvchiga yuborildi.");
  } catch (err) { S.err.ans = dbMsg(err); }
  finally { R.working = ""; render(); }
}
async function submitTest(taskId) {
  const task = R.tasks.find((t) => t.id === taskId);
  if (!task) return;
  const ans = S.testAns[taskId] || [], n = task.savollar.length;
  for (let i = 0; i < n; i++) if (typeof ans[i] !== "number") { S.err.test = `${i + 1}-savolga javob bering.`; render(); return; }
  S.err.test = ""; R.working = "test"; render();
  try {
    const ball = task.savollar.reduce((a, q, i) => a + (ans[i] === q.togri ? 1 : 0), 0);
    await saveSubmission(task, { javoblar: ans.slice(0, n), ball, jami: n });
    toast(`Test topshirildi: ${ball} / ${n}.`);
  } catch (err) { S.err.test = dbMsg(err); }
  finally { R.working = ""; render(); }
}

/* ---------- reports and downloads ---------- */
function reportModel(sinf, fan) {
  const tasks = R.tasks.filter((t) => t.sinf === sinf && (fan === "all" || t.fan === fan)).sort((a, b) => (a.yaratilgan || 0) - (b.yaratilgan || 0));
  const studs = R.students.filter((s) => s.sinf === sinf).sort(byName);
  const map = new Map(R.subs.map((s) => [s.taskId + "__" + s.studentId, s]));
  const rows = studs.map((st) => {
    const cells = tasks.map((t) => map.get(t.id + "__" + st.id) || null);
    const bahos = cells.filter((s) => s && s.baho).map((s) => Number(s.baho));
    const tests = cells.filter((s) => s && s.jami).map((s) => s.ball / s.jami);
    return {
      st, cells, done: cells.filter(Boolean).length,
      avg: bahos.length ? bahos.reduce((a, b) => a + b, 0) / bahos.length : null,
      testPct: tests.length ? Math.round((tests.reduce((a, b) => a + b, 0) / tests.length) * 100) : null
    };
  });
  return { tasks, rows };
}
const cellText = (s) => (!s ? "—" : s.baho ? String(s.baho) : s.jami ? `${s.ball}/${s.jami}` : "✓");
const csvCell = (v) => { const s = String(v == null ? "" : v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const toCsv = (rows) => "﻿" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n");
const safeName = (s) => s.replace(/[ʻʼ'`’‘]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_");
function reportCsv(m) {
  const head = ["№", "Familiya", "Ism", "Sinf", ...m.tasks.map((t) => `${t.fan}: ${t.sarlavha} (${dayOnly(t.yaratilgan)})`), "Topshirgan", "O'rtacha baho", "Test natijasi, %"];
  const body = m.rows.map((r, i) => [i + 1, r.st.familiya, r.st.ism, r.st.sinf, ...r.cells.map(cellText), `${r.done}/${m.tasks.length}`, r.avg == null ? "" : one(r.avg), r.testPct == null ? "" : r.testPct]);
  return toCsv([head, ...body]);
}
const credsCsv = (list) => toCsv([["№", "Familiya", "Ism", "Sinf", "Login", "Parol"], ...list.map((c, i) => [i + 1, c.familiya, c.ism, c.sinf, c.login, c.parol])]);
const credsText = (list) => list.map((c) => `${c.familiya} ${c.ism} (${c.sinf}): login ${c.login}, parol ${c.parol}`).join("\n");
async function offerDownload(filename, data) {
  if (!R.downloads) {
    try { await navigator.clipboard.writeText(data.replace(/^﻿/, "")); toast("Yuklab olish bu yerda ishlamaydi. Jadval nusxalandi: Excel'ga joylashtiring."); }
    catch (_) { toast("Faylni yuklab bo'lmadi."); }
    return;
  }
  try { const r = await R.downloads.save({ filename, data }); if (r && r.status === "saved") toast("Fayl saqlandi."); }
  catch (e) { if (!e || e.code !== "declined") toast("Faylni saqlab bo'lmadi. Keyinroq urinib ko'ring."); }
}
async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); } catch (_) { toast("Nusxa olib bo'lmadi. Matnni qo'lda belgilang."); }
}

/* ---------- AI helper (student) ---------- */
function aiRules(sinf, fan) {
  return [
    `Sen "Bilim do'sti"san: O'zbekistondagi ${sinf}-sinf o'quvchisiga ${fan} fanidan yordam beradigan mehribon va sabrli ustoz.`,
    "Qoidalar:",
    "- Faqat o'zbek tilida, lotin yozuvida, sodda va qisqa gapir: 2-5 jumla.",
    "- Hech qachon yakuniy javobni yoki to'liq yechimni aytma. O'quvchi javobni o'zi topishi kerak. Test variantlaridan qaysi biri to'g'ri ekanini ham aytma.",
    "- Yechimni 2-5 ta qadamga bo'l. Har safar faqat bitta qadamni tushuntir va shu qadam bo'yicha bitta aniq savol ber.",
    "- O'quvchi javobi to'g'ri bo'lsa, qisqa maqta, keyingi qadamni tushuntir va yangi savol ber.",
    "- Javob noto'g'ri bo'lsa, xatoni yumshoq ko'rsat, soddaroq misol yoki ishora bilan maslahat ber va yana so'ra. Javobni baribir aytma.",
    "- O'quvchi javobni aytib berishni so'rasa ham aytma: kichikroq ishora ber.",
    "- O'quvchi oxirgi qadamni to'g'ri bajarsa, masala yechildi: tabrikla va nimani o'rganganini bir jumlada ayt.",
    "- Formulalarni oddiy matnda yoz: x², √, ×, ÷, 3/4. LaTeX ishlatma. Muhim so'zni **qalin** qilishing mumkin.",
    "- Xabar maktab darsiga aloqasi bo'lmasa yoki noo'rin bo'lsa, muloyimlik bilan rad et.",
    "",
    "Har safar FAQAT bitta JSON obyekt qaytar, kalitlar shu tartibda:",
    `{"holat": "savol" | "togri" | "xato" | "yechildi" | "rad", "qadam": joriy qadam raqami, "jami_qadam": jami qadamlar soni, "matn": "o'quvchiga xabar"}`,
    "holat ma'nosi: savol = yangi qadamni tushuntirib savol berding yoki o'quvchining savoliga javob berding; togri = javob to'g'ri va keyingi qadam savolini berding; xato = javob noto'g'ri, maslahat berib qayta so'rading; yechildi = masala to'liq yechildi; rad = xabar maktab masalasi emas yoki rasmni o'qib bo'lmadi."
  ].join("\n");
}
function aiFirst(sinf, fan, text, hasImg) {
  return aiRules(sinf, fan) + "\n\nBu YANGI masala. Avval masalani o'qi" +
    (hasImg ? " (masala rasmda: rasmni diqqat bilan o'qi; o'qib bo'lmasa, holat \"rad\" bo'lsin va aniqroq rasm so'ra)" : "") +
    ". Vazifada bir nechta masala bo'lsa, o'quvchidan qaysi biridan boshlashni so'ra. JSON'ga matn'dan oldin yana ikki kalit qo'sh: \"masala\" = masalaning to'liq matni, \"mavzu\" = 2-4 so'zli mavzu nomi. Birinchi javobingda holat \"savol\", qadam 1 bo'lsin.\n\nO'quvchi xabari:\n" + (text || "(Matn yo'q, masala rasmda.)");
}
const aiContext = (p) => aiRules(p.sinf, p.fan) + "\n\nMasala: " + p.masala + "\nMavzu: " + (p.mavzu || "aniqlanmagan") + "\n\nSen bu masalani o'quvchi bilan qadamma-qadam yechyapsan. Suhbat quyida davom etadi. Har bir javobing yuqoridagi JSON shaklida bo'lsin.";
const clampInt = (v, lo, hi, d) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
function readReply(v) {
  if (!v || typeof v !== "object") throw { code: "invalid_json" };
  const holat = ["savol", "togri", "xato", "yechildi", "rad"].includes(v.holat) ? v.holat : "savol";
  const matn = typeof v.matn === "string" ? v.matn.trim() : "";
  if (!matn) throw { code: "invalid_json" };
  const qadam = clampInt(v.qadam, 1, 12, 1);
  return { holat, matn, qadam, jami: Math.max(clampInt(v.jami_qadam, 1, 12, Math.max(qadam, 3)), qadam), masala: typeof v.masala === "string" ? v.masala.trim().slice(0, 1200) : "", mavzu: typeof v.mavzu === "string" ? v.mavzu.trim().slice(0, 60) : "" };
}
const replyJson = (r) => JSON.stringify({ holat: r.holat, qadam: r.qadam, jami_qadam: r.jami, matn: r.matn });
function botMsg(r) {
  let tag = r.qadam + "-qadam", sub = "";
  if (r.holat === "togri") { tag = "to'g'ri ✓"; sub = r.qadam + "-qadam"; }
  else if (r.holat === "xato") { tag = "maslahat"; sub = r.qadam + "-qadam"; }
  else if (r.holat === "yechildi") tag = "yechildi!";
  else if (r.holat === "rad") tag = "hmm";
  return { id: rid(), who: "bot", tag, sub, text: r.matn };
}
function partialMatn(raw) {
  const i = raw.indexOf('"matn"'); if (i < 0) return "";
  const colon = raw.indexOf(":", i + 6); if (colon < 0) return "";
  const q = raw.indexOf('"', colon + 1); if (q < 0) return "";
  let out = "", k = q + 1;
  while (k < raw.length) {
    const ch = raw[k];
    if (ch === "\\") {
      const n = raw[k + 1];
      if (n === undefined) break;
      if (n === "n") out += "\n";
      else if (n === "u") { const hex = raw.substr(k + 2, 4); if (hex.length < 4) break; out += String.fromCharCode(parseInt(hex, 16)); k += 6; continue; }
      else if (n !== "t") out += n;
      k += 2; continue;
    }
    if (ch === '"') break;
    out += ch; k++;
  }
  return out;
}
const AI_HARD = new Set(["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed", "no_sample"]);
function aiCopy(code) {
  if (AI_HARD.has(code)) return code === "no_sample" ? "AI yordamchi faqat claude.ai ichida ishlaydi." : "AI'dan foydalanishga ruxsat berilmadi. Sahifani qayta ochib, so'ralganda ruxsat bering.";
  if (code === "rate_limited") return "So'rovlar juda ko'p bo'ldi. Bir oz kutib, qayta urinib ko'ring.";
  if (code === "image_rejected") return "Bu rasmni ochib bo'lmadi. JPG yoki PNG rasm tanlang.";
  if (code === "refused") return "Bu xabarga javob bera olmayman. Maktab masalasini yuboring.";
  if (code === "prompt_too_large") return "Suhbat juda uzun bo'lib ketdi. Yangi masala boshlang.";
  if (code === "cancelled") return "To'xtatildi.";
  return "Javob olishda xatolik bo'ldi. Qayta urinib ko'ring.";
}
async function aiAsk(input, images) {
  const sample = R.sample !== undefined ? R.sample : await R.samplePromise;
  if (!sample) throw { code: "no_sample" };
  const ctl = new AbortController();
  R.aiCtl = ctl; R.aiBusy = true; R.aiStream = ""; render();
  try {
    const o = { signal: ctl.signal, cache: false };
    if (images && images.length) o.images = images;
    o.onText = ({ text }) => {
      const t = partialMatn(text);
      if (!t || t === R.aiStream) return;
      R.aiStream = t;
      const el = document.getElementById("ai-stream");
      if (el) { el.innerHTML = fmt(t); scrollAi(); }
    };
    return await sample.json(input, o);
  } finally { R.aiBusy = false; R.aiCtl = null; R.aiStream = ""; }
}
async function aiSend(textArg, imgArg) {
  if (R.aiBusy || !R.me) return;
  const A = S.ai, fromArg = typeof textArg === "string";
  const text = (fromArg ? textArg : A.input).trim();
  let img = fromArg ? imgArg || null : R.files.ai;
  if (!text && !img) return;
  if (!fromArg) { A.input = ""; if (img) setFile("ai", null); }
  if (img && !/^image\/(jpeg|png|webp|gif)$/.test(img.type || "")) { try { img = await toJpeg(img, 2000, 0.88); } catch (_) { toast(aiCopy("image_rejected")); return; } }
  R.aiRetry = null;
  A.log.forEach((m) => { if (m.who === "sys") m.retry = false; });
  const msg = { id: rid(), who: "me", text, img: !!img };
  if (img) R.aiImg.set(msg.id, URL.createObjectURL(img));
  A.log.push(msg);
  const p0 = A.p;
  if (!p0 || p0.yechildi || p0.rad || !p0.turns.length) {
    A.p = { masala: text, mavzu: "", qadam: 0, jami: 0, turns: [], yechildi: false, rad: false, sinf: sinfNum(R.me.sinf) || 7, fan: A.fan || "Matematika" };
  } else {
    A.p.turns.push({ role: "user", content: text || "(O'quvchi o'z yechimining rasmini yubordi. Rasmni o'qib, tekshir.)" });
    if (A.p.turns.length > 24) A.p.turns = A.p.turns.slice(0, 2).concat(A.p.turns.slice(-20));
  }
  const P = A.p;
  const run = async () => {
    try {
      if (!P.turns.length) {
        const v = await aiAsk(aiFirst(P.sinf, P.fan, text, !!img), img ? [img] : null);
        if (S.ai !== A || A.p !== P) return;
        const r = readReply(v);
        if (r.holat === "rad") { P.rad = true; A.log.push(botMsg(r)); return; }
        P.masala = r.masala || text || "Rasmdagi masala"; P.mavzu = r.mavzu; P.qadam = r.qadam; P.jami = r.jami;
        P.turns = [{ role: "user", content: aiContext(P) }, { role: "assistant", content: replyJson(r) }];
        A.log.push(botMsg(r));
      } else {
        const v = await aiAsk(P.turns, img ? [img] : null);
        if (S.ai !== A || A.p !== P) return;
        const r = readReply(v);
        P.qadam = r.qadam; P.jami = Math.max(P.jami, r.jami);
        P.turns.push({ role: "assistant", content: replyJson(r) });
        A.log.push(botMsg(r));
        if (r.holat === "yechildi") P.yechildi = true;
      }
    } catch (e) {
      if (S.ai !== A) return;
      const code = (e && e.code) || "upstream_error";
      if (AI_HARD.has(code)) R.aiOff = true;
      const canRetry = !AI_HARD.has(code) && code !== "refused" && code !== "prompt_too_large";
      A.log.push({ id: rid(), who: "sys", text: aiCopy(code), retry: canRetry });
      R.aiRetry = canRetry ? async () => { R.aiRetry = null; A.log.forEach((m) => { if (m.who === "sys") m.retry = false; }); await run(); } : null;
    } finally { render(); }
  };
  await run();
}
async function aiFromTask(task) {
  S.ai = freshAi();
  S.ai.fan = task.fan;
  go("oquvchi-yordamchi");
  let blob = null;
  if (task.fayl && isImgRef(task.fayl) && R.aiImages) {
    try { const res = await fetch(fileUrl(task.fayl)); if (res.ok) blob = await res.blob(); } catch (_) { blob = null; }
  }
  const text = `Uyga vazifa (${task.fan}): ${task.sarlavha}.` + (task.izoh ? " " + task.izoh : "") +
    (task.turi === "test" ? " Bu test vazifasi: mavzuni tushunishga yordam bering, qaysi variant to'g'ri ekanini aytmang." : "") +
    (blob ? " Vazifa rasmi ilova qilingan." : "");
  await aiSend(text, blob);
}
function scrollAi() { const c = document.getElementById("ai-chat"); if (c) c.scrollTop = c.scrollHeight; }

/* ---------- small UI helpers ---------- */
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(R.toastT);
  R.toastT = setTimeout(() => { t.hidden = true; }, 4200);
}
function setFile(kind, f) {
  if (R.urls[kind]) { try { URL.revokeObjectURL(R.urls[kind]); } catch (_) {} }
  R.files[kind] = f || null;
  R.urls[kind] = f && isImgFile(f) && /^image\/(jpeg|png|webp|gif)$/.test(f.type || "") ? URL.createObjectURL(f) : null;
}
function pickFile(kind, f) {
  if (kind === "ai" ? !isImgFile(f) : !isImgFile(f) && !isPdfFile(f)) { toast(kind === "ai" ? "Faqat rasm tanlang." : "Faqat rasm yoki PDF fayl tanlang."); return; }
  if (f.size > 20 * 1024 * 1024) { toast("Fayl 20 MB dan katta."); return; }
  setFile(kind, f);
  render();
}
function go(r) {
  if (location.hash === "#" + r) { S.route = r; render(); }
  else location.hash = r;
}

/* ---------- views: building blocks ---------- */
function field(label, id, path, o = {}) {
  const v = getPath(S, path);
  const val = v == null ? "" : v;
  const common = `id="${id}" data-bind="${path}"${o.placeholder ? ` placeholder="${esc(o.placeholder)}"` : ""}${o.autocomplete ? ` autocomplete="${o.autocomplete}"` : ""}${o.max ? ` maxlength="${o.max}"` : ""}`;
  const input = o.textarea
    ? `<textarea ${common} rows="${o.rows || 3}">${esc(val)}</textarea>`
    : `<input ${common} type="${o.type || "text"}" value="${esc(val)}">`;
  return `<div class="field${o.cls ? " " + o.cls : ""}"><label for="${id}">${label}</label>${input}${o.hint ? `<small>${o.hint}</small>` : ""}</div>`;
}
function selectField(label, id, path, options, o = {}) {
  const v = String(getPath(S, path) ?? "");
  return `<div class="field${o.cls ? " " + o.cls : ""}"><label for="${id}">${label}</label><select id="${id}" data-bind="${path}"${o.rerender ? ' data-rerender="1"' : ""}>${options.map(([val, lab]) => `<option value="${esc(val)}"${String(val) === v ? " selected" : ""}>${esc(lab)}</option>`).join("")}</select></div>`;
}
const errBox = (k) => (S.err[k] ? `<p class="form-err" role="alert">${esc(S.err[k])}</p>` : "");
const loadingBox = () => `<div class="empty"><p class="dots">Yuklanmoqda<span></span><span></span><span></span></p></div>`;
const emptyBox = (title, text, action) => `<div class="empty">${ILL_EMPTY}<b>${title}</b><p>${text}</p>${action || ""}</div>`;
const li = (t) => `<li>${IC.check}<span>${t}</span></li>`;
const feat = (svg, h, p) => `<article class="feat">${svg}<h3>${h}</h3><p>${p}</p></article>`;
const step = (h, p) => `<div class="step"><h3>${h}</h3><p>${p}</p></div>`;
function dbNotice() {
  if (R.local) return `<p class="notice"><b>Demo rejimi.</b> Ma'lumotlar faqat shu qurilmadagi brauzerda saqlanadi${R.localVolatile ? " va sahifa yopilsa o'chadi" : ""}: boshqa telefon yoki kompyuterda ko'rinmaydi.</p>`;
  if (R.db === null) return `<p class="notice">Platforma faqat claude.ai ichida ochilganda ishlaydi: ma'lumotlar o'sha yerda saqlanadi.</p>`;
  return "";
}
function statusNote() {
  if (R.dbErr) return `<p class="form-err">Ma'lumotlarning bir qismini o'qib bo'lmadi. Sahifani yangilab ko'ring.</p>`;
  if (R.slow) return `<p class="loading-note">Ma'lumotlar sekin yuklanmoqda. Internet aloqasini tekshiring: kelishi bilan bu yer o'zi yangilanadi.</p>`;
  return "";
}
function dropBox(kind, title, hint, accept) {
  const file = R.files[kind], url = R.urls[kind];
  const inner = file
    ? `${url ? `<img class="thumb" src="${esc(url)}" alt="">` : IC.pdf}<span style="min-width:0"><b style="overflow-wrap:anywhere">${esc(file.name || "fayl")}</b><span>${(file.size / 1024 / 1024).toFixed(1).replace(".", ",")} MB · almashtirish uchun bosing</span></span>`
    : `${IC.upload}<span><b>${title}</b><span>${hint}</span></span>`;
  return `<div class="row" style="align-items:stretch"><label class="drop" for="file-${kind}" data-drop="${kind}" style="flex:1 1 240px">${inner}</label>${file ? `<button type="button" class="btn ghost small" data-act="clear-file" data-v="${kind}" id="clear-${kind}">Olib tashlash</button>` : ""}</div><input class="sr" type="file" id="file-${kind}" data-file="${kind}" accept="${accept}">`;
}
function fileView(f) {
  if (!f) return `<p class="muted">Fayl biriktirilmagan.</p>`;
  const url = fileUrl(f);
  if (isImgRef(f)) return `<div class="viewer"><img src="${esc(url)}" alt="${esc(f.nomi || "Rasm")}"></div>`;
  if (!f.id && f.data) {
    const key = "f" + R.fileReg.size;
    R.fileReg.set(key, f);
    return `<div class="viewer"><button type="button" class="pdf-link" data-act="open-file" data-v="${key}" id="open-${key}">${IC.pdf}<span><b>${esc(f.nomi || "PDF fayl")}</b><span class="muted small">PDF faylni ochish</span></span></button></div>`;
  }
  return `<div class="viewer"><a class="pdf-link" href="${esc(url)}" target="_blank" rel="noopener">${IC.pdf}<span><b>${esc(f.nomi || "PDF fayl")}</b><span class="muted small">PDF faylni ochish</span></span></a></div>`;
}
function navHtml(items, r) {
  return items.map(([h, label, icon, badge]) => `<a class="nav-a" href="#${h}" id="nav-${h}"${h === r ? ' aria-current="page"' : ""}>${icon}<span>${label}</span>${badge ? `<span class="badge-n">${badge}</span>` : ""}</a>`).join("");
}
const typeBadge = (t) => `<span class="badge">${t.turi === "test" ? `Test · ${(t.savollar || []).length} savol` : "Savol-javob"}</span>`;

/* ---------- views: public ---------- */
function vHeader() {
  const brand = `<a class="brand" href="#bosh" aria-label="Bilim do'sti, bosh sahifa">${LOGO}<span><span class="wordmark">Bilim do'sti</span><span class="tagline">uyga vazifa daftari</span></span></a>`;
  let right;
  if (S.session && R.me) {
    const dash = S.session.role === "teacher" ? "oqituvchi-vazifa" : "oquvchi-vazifalar";
    right = `<a class="btn ghost small" href="#${dash}" id="top-dash">Profilim</a><button class="btn ghost small" type="button" data-act="logout" id="top-logout">Chiqish</button>`;
  } else right = `<a class="btn small" href="#kirish" id="top-login">Kirish</a>`;
  return `<div class="top-inner">${brand}<nav class="top-actions" aria-label="Asosiy">${right}</nav></div>`;
}
const vFoot = () => `<footer class="foot"><span>Bilim do'sti · Raqamli avlod qizlari tanlovi uchun prototip · Ta'lim yo'nalishi</span><span>Sinov rejimi: haqiqiy parollaringizni ishlatmang.</span></footer>`;

function vLanding() {
  const logged = S.session && R.me;
  const dash = logged ? (S.session.role === "teacher" ? "oqituvchi-vazifa" : "oquvchi-vazifalar") : "";
  const cta = logged
    ? `<a class="btn big" href="#${dash}" id="hero-dash">Profilimga o'tish</a>`
    : `<a class="btn big" href="#kirish" id="hero-login">Kirish</a><a class="btn big ghost" href="#royxat" id="hero-reg">O'qituvchi sifatida ro'yxatdan o'tish</a>`;
  return `<div class="land">
    <section class="hero">
      <div>
        <span class="eyebrow">Maktab uchun uyga vazifa platformasi</span>
        <h1>Uyga vazifa endi <span class="ul">bitta daftarda</span></h1>
        <p class="sub">O'qituvchi vazifani rasm, PDF yoki test qilib yuboradi. O'quvchi telefonidan topshiradi. Baholar va hisobot o'zi yig'iladi.</p>
        <div class="hero-cta">${cta}</div>
        <p class="hero-note">o'quvchilar login va parolni o'qituvchisidan oladi</p>
      </div>
      ${ILL_HERO}
    </section>
    <section class="section" id="profillar">
      <div class="section-h"><h2>Ikki profil, bitta daftar</h2><p>Har kim o'z ishini ko'radi: o'qituvchi sinflarini boshqaradi, o'quvchi esa faqat o'ziga kelgan vazifalarni.</p></div>
      <div class="roles">
        <article class="role"><div class="role-top">${ILL_TEACHER}<div><span class="hand">o'qituvchi</span><h3>O'qituvchi profili</h3></div></div>
          <ul>${li("Viloyat, tuman, maktab va biriktirilgan sinflaringizni kiritasiz")}${li("O'quvchilar ro'yxatini kiritib, ularga login va parol yaratasiz")}${li("Fan va sinfni tanlab, vazifani rasm, PDF yoki test qilib yuborasiz")}${li("Javoblar ism-familiya bilan keladi: baholaysiz va hisobotni yuklab olasiz")}</ul></article>
        <article class="role"><div class="role-top">${ILL_STUDENT}<div><span class="hand">o'quvchi</span><h3>O'quvchi profili</h3></div></div>
          <ul>${li("O'qituvchi bergan login va parol bilan kirasiz")}${li("Qaysi fandan vazifa kelganini bir qarashda ko'rasiz")}${li("Javobni rasmga olib yuklaysiz yoki testni shu yerda ishlaysiz")}${li("Baho va o'qituvchi izohini ko'rasiz, qiynalsangiz AI yordamchi bor")}</ul></article>
      </div>
    </section>
    <section class="section">
      <div class="section-h"><h2>Nimalar qila oladi</h2></div>
      <div class="feats">
        ${feat(ILL_FEAT.send, "Vazifa yuborish", "Rasm yoki PDF bitta bosishda butun sinfga boradi.")}
        ${feat(ILL_FEAT.photo, "Rasm bilan topshirish", "O'quvchi daftarini telefonda rasmga oladi va yuklaydi.")}
        ${feat(ILL_FEAT.test, "Test o'zi tekshiriladi", "Test topshirilishi bilan ball hisoblanadi.")}
        ${feat(ILL_FEAT.report, "Hisobot", "Sinf va fan bo'yicha natijalar Excel uchun yuklab olinadi.")}
        ${feat(ILL_FEAT.ai, "AI yordamchi", "Javobni aytmaydi, qadamma-qadam o'zi yechishga o'rgatadi." + (R.local ? " Hozircha claude.ai versiyasida ishlaydi." : ""))}
      </div>
    </section>
    <section class="section">
      <div class="section-h"><h2>Qanday ishlaydi</h2></div>
      <div class="steps">
        ${step("O'qituvchi ro'yxatdan o'tadi", "Maktab, sinflar va fanlarini kiritadi.")}
        ${step("O'quvchilarni qo'shadi", "Ro'yxatni joylaydi, loginlar o'zi yaratiladi.")}
        ${step("Vazifa yuboradi", "Fan, sinf va turini tanlab, faylni yuklaydi.")}
        ${step("Natijani ko'radi", "Javoblarni baholaydi, hisobotni yuklab oladi.")}
      </div>
      <div class="cta-band"><div><h2>Sinfingizni ulang</h2><p>Kerakli narsa: maktab nomi, sinflar va o'quvchilar ro'yxati.</p></div>
        <div class="row">${logged ? `<a class="btn big" href="#${dash}">Profilimga o'tish</a>` : `<a class="btn big" href="#royxat" id="cta-reg">Ro'yxatdan o'tish</a><a class="btn big ghost" href="#kirish" id="cta-login">Kirish</a>`}</div></div>
    </section>
  </div>${vFoot()}`;
}
function vLogin(note) {
  const w = R.working === "login";
  return `<section class="auth"><div class="auth-card">
    <div class="auth-ill">${ILL_AUTH}</div>
    <form class="auth-form" data-form="login" novalidate>
      <h1>Kirish</h1>
      <p class="muted">${esc(note || "O'qituvchi va o'quvchilar shu yerdan kiradi. O'quvchilar login va parolni o'z o'qituvchisidan oladi.")}</p>
      ${dbNotice()}
      ${field("Login", "login-login", "forms.login.login", { autocomplete: "username", placeholder: "masalan, aziza.karimova" })}
      ${field("Parol", "login-parol", "forms.login.parol", { type: "password", autocomplete: "current-password" })}
      ${errBox("login")}
      <button class="btn big wide" type="submit" id="login-submit"${w ? " disabled" : ""}>${w ? "Tekshirilmoqda..." : "Kirish"}</button>
      <p class="muted small">O'qituvchimisiz va hali akkauntingiz yo'qmi? <a href="#royxat">Ro'yxatdan o'ting</a></p>
      ${demoBox()}
    </form>
  </div></section>${vFoot()}`;
}
function demoBox() {
  if (!R.local || !R.db) return "";
  const conf = S.confirm && S.confirm.kind === "clear";
  const clear = conf
    ? `<span class="small">Bu brauzerdagi hamma ma'lumot o'chsinmi?</span> <button type="button" class="btn danger small" data-act="clear-yes" id="clear-yes">Ha, o'chirish</button> <button type="button" class="btn ghost small" data-act="confirm-no" id="clear-no">Yo'q</button>`
    : `<button type="button" class="linkish" data-act="clear-ask" id="clear-ask">Barcha ma'lumotlarni o'chirish</button>`;
  if (!R.demoSeeded) {
    const w = R.working === "seed";
    return `<div class="demo-box"><b>Tez sinab ko'rish</b><p class="small">Bir bosishda namuna o'qituvchi, 3 ta o'quvchi va 2 ta vazifa yaratiladi.</p><div class="row"><button type="button" class="btn ghost small" data-act="seed-demo" id="seed-demo"${w ? " disabled" : ""}>${w ? "Yaratilmoqda..." : "Demo hisoblarni yaratish"}</button></div><div class="row">${clear}</div></div>`;
  }
  return `<div class="demo-box"><b>Demo hisoblar</b>
    <table><tbody><tr><td>O'qituvchi</td><td><code>oqituvchi</code></td><td><code>demo123</code></td></tr><tr><td>O'quvchi</td><td><code>aziza</code></td><td><code>demo123</code></td></tr><tr><td class="muted">yana</td><td colspan="2"><code>jasur</code>, <code>madina</code> (parol o'sha)</td></tr></tbody></table>
    <div class="row">${clear}</div></div>`;
}
function fanChips(scope, chosen) {
  return `<div class="chips" role="group" aria-labelledby="${scope}-fan-l">${FANLAR.map((x, i) => `<button type="button" class="chip" id="${scope}-fan-${i}" data-act="toggle-fan" data-scope="${scope}" data-v="${esc(x)}" aria-pressed="${chosen.includes(x)}">${esc(x)}</button>`).join("")}</div>`;
}
function schoolFields(scope) {
  const p = `forms.${scope}.`;
  return `<div class="grid3">${selectField("Viloyat", scope + "-vil", p + "viloyat", [["", "Tanlang"], ...VILOYATLAR.map((v) => [v, v])])}${field("Tuman yoki shahar", scope + "-tuman", p + "tuman", { placeholder: "masalan, Chilonzor tumani" })}${field("Maktab", scope + "-maktab", p + "maktab", { placeholder: "masalan, 21-maktab" })}</div>
    ${field("Biriktirilgan sinflar", scope + "-sinf", p + "sinflar", { placeholder: "7-A, 7-B, 8-A", hint: "Vergul bilan ajrating." })}
    <div class="field"><span class="lbl" id="${scope}-fan-l">Fanlaringiz</span>${fanChips(scope, getPath(S, p + "fanlar") || [])}</div>`;
}
function vRegister() {
  const w = R.working === "reg";
  return `<section class="auth wide"><form class="reg-card" data-form="reg" novalidate>
    <div><span class="eyebrow">O'qituvchi uchun</span><h1 style="margin-top:12px">Ro'yxatdan o'tish</h1><p class="muted" style="margin-top:6px">O'quvchilarni keyin profilingizdan qo'shasiz va ularga login beriladi.</p></div>
    ${dbNotice()}
    <fieldset class="fieldset"><legend>Shaxsiy ma'lumot</legend><div class="grid2">${field("Ism", "reg-ism", "forms.reg.ism", { autocomplete: "given-name" })}${field("Familiya", "reg-fam", "forms.reg.familiya", { autocomplete: "family-name" })}</div></fieldset>
    <fieldset class="fieldset"><legend>Maktab va sinflar</legend>${schoolFields("reg")}</fieldset>
    <fieldset class="fieldset"><legend>Kirish ma'lumotlari</legend><div class="grid3">${field("Login", "reg-login", "forms.reg.login", { autocomplete: "username", placeholder: "masalan, d.karimova" })}${field("Parol", "reg-p1", "forms.reg.parol", { type: "password", autocomplete: "new-password", hint: "Kamida 6 belgi." })}${field("Parolni takrorlang", "reg-p2", "forms.reg.parol2", { type: "password", autocomplete: "new-password" })}</div></fieldset>
    ${errBox("reg")}
    <div class="row between"><p class="muted small">Akkauntingiz bormi? <a href="#kirish">Kirish</a></p><button class="btn big" type="submit" id="reg-submit"${w ? " disabled" : ""}>${w ? "Saqlanmoqda..." : "Ro'yxatdan o'tish"}</button></div>
  </form></section>${vFoot()}`;
}
function vNeedLogin(role) {
  if (S.session && (R.db === undefined || R.restoring)) return `<div class="center-state"><p class="dots">Profil yuklanmoqda<span></span><span></span><span></span></p></div>`;
  return vLogin(role === "teacher" ? "Bu bo'lim o'qituvchilar uchun. Davom etish uchun kiring." : "Bu bo'lim o'quvchilar uchun. O'qituvchingiz bergan login bilan kiring.");
}

/* ---------- views: teacher ---------- */
function vTeacher(r) {
  const me = R.me;
  const fresh = R.subs.filter((s) => !s.baho).length;
  const nav = [["oqituvchi-vazifa", "Uyga vazifa", IC.send], ["oqituvchi-javoblar", "Kelgan javoblar", IC.inbox, fresh], ["oqituvchi-sinflar", "Sinflar va o'quvchilar", IC.users], ["oqituvchi-hisobot", "Hisobotlar", IC.chart], ["oqituvchi-profil", "Profil", IC.user]];
  const sec = { "oqituvchi-vazifa": tVazifa, "oqituvchi-javoblar": tJavoblar, "oqituvchi-sinflar": tSinflar, "oqituvchi-hisobot": tHisobot, "oqituvchi-profil": tProfil }[r]();
  return `<div class="dash"><aside class="dash-side">
      <div class="who"><span class="avatar">${esc(initials(me))}</span><div><b>${esc(me.ism)} ${esc(me.familiya)}</b><small>${esc(me.maktab)} · ${esc(me.tuman)}</small><small>${esc(me.sinflar.join(", "))}</small></div></div>
      <nav class="dash-nav" aria-label="O'qituvchi bo'limlari">${navHtml(nav, r)}</nav>
    </aside><section class="dash-main">${statusNote()}${sec}</section></div>`;
}
function qHtml(q, i, total) {
  return `<div class="q"><div class="q-head"><b>${i + 1}-savol</b>${total > 1 ? `<button type="button" class="linkish" data-act="del-q" data-v="${i}" id="del-q-${i}">O'chirish</button>` : ""}</div>
    <div class="field"><label for="q-${i}">Savol matni</label><textarea id="q-${i}" rows="2" data-bind="forms.task.savollar.${i}.savol">${esc(q.savol)}</textarea></div>
    ${q.v.map((v, j) => `<div class="opt"><span class="letter">${LETTERS[j]}</span><input class="inp" id="q-${i}-v-${j}" data-bind="forms.task.savollar.${i}.v.${j}" value="${esc(v)}" placeholder="${LETTERS[j]} variant" aria-label="${i + 1}-savol, ${LETTERS[j]} variant"><label class="ok" for="q-${i}-ok-${j}"><input type="radio" name="ok-${i}" id="q-${i}-ok-${j}" data-radio="forms.task.savollar.${i}.togri" value="${j}"${q.togri === j ? " checked" : ""}>to'g'ri</label></div>`).join("")}
  </div>`;
}
function tasksList() {
  if (!R.loaded.tasks) return loadingBox();
  const tasks = R.tasks.slice().sort((a, b) => (b.yaratilgan || 0) - (a.yaratilgan || 0));
  if (!tasks.length) return emptyBox("Hali vazifa yuborilmagan", "Shaklni to'ldirib, birinchi vazifani yuboring.");
  return `<div class="tcards">${tasks.map((t) => {
    const total = R.students.filter((s) => s.sinf === t.sinf).length;
    const done = R.subs.filter((s) => s.taskId === t.id).length;
    const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
    const conf = S.confirm && S.confirm.kind === "task" && S.confirm.id === t.id;
    return `<article class="tcard">
      <div class="tcard-top"><span class="${fanCls(t.fan)}">${esc(t.fan)}</span><span class="badge">${esc(t.sinf)}</span>${typeBadge(t)}</div>
      <h3>${esc(t.sarlavha)}</h3>
      <p class="meta">Yuborildi: ${when(t.yaratilgan)}${t.muddat ? ` · Muddati: ${dayLabel(t.muddat)}` : ""}</p>
      <div class="meter"><span style="width:${pct}%"></span></div>
      <p class="small">Topshirdi: <b>${done}</b> / ${total}</p>
      <div class="row">${conf
        ? `<span class="small">Vazifa o'chirilsinmi?</span><button type="button" class="btn danger small" data-act="del-task-yes" data-v="${esc(t.id)}" id="del-task-yes">Ha, o'chirish</button><button type="button" class="btn ghost small" data-act="confirm-no" id="del-task-no">Yo'q</button>`
        : `<button type="button" class="btn ghost small" data-act="task-subs" data-v="${esc(t.id)}" id="task-subs-${esc(t.id)}">Javoblarni ko'rish</button><button type="button" class="linkish" data-act="del-task" data-v="${esc(t.id)}" id="del-task-${esc(t.id)}">O'chirish</button>`}</div>
    </article>`;
  }).join("")}</div>`;
}
function tVazifa() {
  const me = R.me, f = S.forms.task, w = R.working === "task";
  const n = R.students.filter((s) => s.sinf === f.sinf).length;
  const builder = f.turi === "test"
    ? `<div class="qb">${f.savollar.map((q, i) => qHtml(q, i, f.savollar.length)).join("")}<button type="button" class="btn ghost" data-act="add-q" id="add-q">+ Savol qo'shish</button></div>`
    : "";
  return `<header class="sec-h"><div><h1>Uyga vazifa yuborish</h1><p>Vazifa tanlangan sinfdagi barcha o'quvchilarga boradi.</p></div></header>
  <div class="two">
    <form class="card form" data-form="task" novalidate>
      <div class="grid2">${selectField("Sinf", "task-sinf", "forms.task.sinf", me.sinflar.map((s) => [s, s + " sinf"]), { rerender: true })}${selectField("Fan", "task-fan", "forms.task.fan", me.fanlar.map((x) => [x, x]))}</div>
      <div class="field"><span class="lbl">Vazifa turi</span><div class="types">
        <button type="button" class="type" id="type-savol" data-act="task-type" data-v="savol" aria-pressed="${f.turi === "savol"}">${IC.camera}<span><b>Savol-javob</b><span>O'quvchi javobini rasm yoki PDF qilib yuklaydi</span></span></button>
        <button type="button" class="type" id="type-test" data-act="task-type" data-v="test" aria-pressed="${f.turi === "test"}">${IC.list}<span><b>Test</b><span>O'quvchi shu yerda ishlaydi, ball o'zi hisoblanadi</span></span></button>
      </div></div>
      ${field("Vazifa nomi", "task-title", "forms.task.sarlavha", { placeholder: "masalan, §12, 3-5-mashqlar", max: 120 })}
      ${field("Izoh", "task-izoh", "forms.task.izoh", { textarea: true, rows: 3, placeholder: "Qisqa ko'rsatma yoki vazifa matni" })}
      <div class="grid2">${field("Topshirish muddati", "task-due", "forms.task.muddat", { type: "date" })}<div class="field"><span class="lbl">Kimga boradi</span><p class="muted" style="padding-top:10px">${esc(f.sinf)} sinf: <b>${n}</b> nafar o'quvchi</p></div></div>
      <div class="field"><span class="lbl">${f.turi === "test" ? "Fayl (ixtiyoriy)" : "Vazifa fayli"}</span>${dropBox("task", "Rasm yoki PDF tanlang", "JPG, PNG yoki PDF, 20 MB gacha", "image/*,application/pdf")}</div>
      ${builder}
      ${errBox("task")}
      <button class="btn big" type="submit" id="task-submit"${w ? " disabled" : ""}>${w ? "Yuborilmoqda..." : "Vazifani yuborish"}</button>
    </form>
    <div class="stack"><h2 class="card-h2">Yuborilgan vazifalar</h2>${tasksList()}</div>
  </div>`;
}
function statusPill(s) {
  const late = s.kechikdi ? ` <span class="pill late">kech</span>` : "";
  if (s.baho) return `<span class="pill ok">Baho: ${esc(s.baho)}</span>${late}`;
  if (s.jami) return `<span class="pill new">Test: ${esc(s.ball)}/${esc(s.jami)}</span>${late}`;
  return `<span class="pill new">Yangi</span>${late}`;
}
function subDetail(s) {
  const task = R.tasks.find((t) => t.id === s.taskId);
  if (!S.grade[s.id]) S.grade[s.id] = { baho: s.baho || 0, izoh: s.izohO || "" };
  const g = S.grade[s.id];
  let ans;
  if (s.turi === "test") {
    const pct = s.jami ? Math.round((s.ball / s.jami) * 100) : 0;
    ans = `<div class="result-band"><span class="big">${esc(s.ball)} / ${esc(s.jami)}</span><span>${pct}% to'g'ri</span></div>` +
      (task && task.savollar && Array.isArray(s.javoblar) ? `<ol class="qres">${task.savollar.map((q, i) => {
        const a = s.javoblar[i], ok = a === q.togri;
        return `<li class="${ok ? "y" : "n"}"><b>${i + 1}.</b> ${esc(q.savol)}<br><span class="muted">Javobi: ${esc(q.v[a] ?? "—")}${ok ? "" : ` · To'g'risi: ${esc(q.v[q.togri])}`}</span></li>`;
      }).join("")}</ol>` : "");
  } else ans = fileView(s.fayl);
  const w = R.working === "grade";
  return `<div class="card stack" id="sub-detail">
    <div class="row between" style="align-items:flex-start"><div><h2 class="card-h2" style="margin:0">${esc(fullName(s))}</h2><p class="muted small">${esc(s.sinf)} · ${esc(s.fan)} · ${esc(s.sarlavha)}</p><p class="muted small">Topshirildi: ${when(s.topshirilgan)}${s.kechikdi ? ` · <span class="pill late">muddatidan kech</span>` : ""}</p></div><button type="button" class="linkish" data-act="close-sub" id="close-sub">Yopish</button></div>
    ${ans}
    <div class="field"><span class="lbl">Baho</span><div class="grades" role="group" aria-label="Baho">${[2, 3, 4, 5].map((b) => `<button type="button" class="gbtn" data-act="grade" data-v="${b}" id="g-${b}" aria-pressed="${g.baho === b}">${b}</button>`).join("")}</div></div>
    ${field("O'quvchiga izoh", "g-izoh", `grade.${s.id}.izoh`, { textarea: true, rows: 2, placeholder: "masalan, 3-mashqni qayta ko'rib chiq" })}
    ${errBox("grade")}
    <button type="button" class="btn" data-act="save-grade" data-v="${esc(s.id)}" id="save-grade"${w ? " disabled" : ""}>${w ? "Saqlanmoqda..." : s.baho ? "Bahoni yangilash" : "Bahoni saqlash"}</button>
  </div>`;
}
function tJavoblar() {
  const me = R.me, f = S.forms.inbox;
  let subs = R.subs.slice();
  if (f.sinf !== "all") subs = subs.filter((s) => s.sinf === f.sinf);
  if (f.fan !== "all") subs = subs.filter((s) => s.fan === f.fan);
  if (f.task !== "all") subs = subs.filter((s) => s.taskId === f.task);
  if (f.holat === "yangi") subs = subs.filter((s) => !s.baho);
  else if (f.holat === "baholangan") subs = subs.filter((s) => !!s.baho);
  subs.sort((a, b) => (b.topshirilgan || 0) - (a.topshirilgan || 0));
  const open = S.openSub ? R.subs.find((s) => s.id === S.openSub) : null;
  const taskOpts = [["all", "Barcha vazifalar"], ...R.tasks.slice().sort((a, b) => (b.yaratilgan || 0) - (a.yaratilgan || 0)).map((t) => [t.id, `${t.sinf} · ${t.fan}: ${t.sarlavha}`])];
  const list = !R.loaded.subs ? loadingBox()
    : !subs.length ? emptyBox(f.holat === "yangi" ? "Yangi javob yo'q" : "Javob topilmadi", f.holat === "yangi" ? "O'quvchilar topshirgan javoblar shu yerga ism-familiyasi bilan keladi." : "Filtrlarni o'zgartirib ko'ring.")
    : `<div class="sub-list">${subs.map((s) => `<button type="button" class="sub-row" data-act="open-sub" data-v="${esc(s.id)}" id="sub-${esc(s.id)}" aria-current="${S.openSub === s.id}"><span class="avatar">${esc(initials(s))}</span><span style="min-width:0"><b>${esc(fullName(s))}</b><small>${esc(s.sinf)} · ${esc(s.fan)} · ${esc(s.sarlavha)}</small><small>${when(s.topshirilgan)} · ${s.turi === "test" ? "Test" : "Savol-javob"}</small></span><span>${statusPill(s)}</span></button>`).join("")}</div>`;
  return `<header class="sec-h"><div><h1>Kelgan javoblar</h1><p>O'quvchilar topshirgan vazifalar ism-familiyasi bilan shu yerda.</p></div></header>
    <div class="filters4">${selectField("Sinf", "ib-sinf", "forms.inbox.sinf", [["all", "Barcha sinflar"], ...me.sinflar.map((s) => [s, s])], { rerender: true })}${selectField("Fan", "ib-fan", "forms.inbox.fan", [["all", "Barcha fanlar"], ...me.fanlar.map((x) => [x, x])], { rerender: true })}${selectField("Holat", "ib-holat", "forms.inbox.holat", [["yangi", "Baholanmagan"], ["baholangan", "Baholangan"], ["all", "Barchasi"]], { rerender: true })}${selectField("Vazifa", "ib-task", "forms.inbox.task", taskOpts, { rerender: true })}</div>
    <div class="two"><div>${list}</div><div>${open ? subDetail(open) : `<div class="empty">${ILL_EMPTY}<b>Javobni tanlang</b><p>Chapdagi ro'yxatdan o'quvchini bosing: javobi shu yerda ochiladi va baho qo'yasiz.</p></div>`}</div></div>`;
}
function credsCard() {
  if (!R.creds || !R.creds.length) return "";
  return `<div class="card creds stack" id="creds">
    <div><h2 class="card-h2" style="margin-bottom:4px">Login va parollar</h2><p class="small">Parollar faqat hozir ko'rinadi. Yuklab oling yoki nusxa oling va o'quvchilarga tarqating.</p></div>
    <div class="table-wrap"><table><thead><tr><th>O'quvchi</th><th>Sinf</th><th>Login</th><th>Parol</th></tr></thead><tbody>${R.creds.map((c) => `<tr><td>${esc(c.familiya)} ${esc(c.ism)}</td><td>${esc(c.sinf)}</td><td><code>${esc(c.login)}</code></td><td><code>${esc(c.parol)}</code></td></tr>`).join("")}</tbody></table></div>
    <div class="row"><button type="button" class="btn small" data-act="creds-dl" id="creds-dl">Yuklab olish (CSV)</button><button type="button" class="btn ghost small" data-act="creds-copy" id="creds-copy">Nusxa olish</button><button type="button" class="linkish" data-act="creds-close" id="creds-close">Yopish</button></div>
  </div>`;
}
function tSinflar() {
  const me = R.me;
  const tab = me.sinflar.includes(S.sinfTab) ? S.sinfTab : me.sinflar[0];
  const studs = R.students.filter((s) => s.sinf === tab).sort(byName);
  const cnt = new Map();
  R.subs.forEach((s) => cnt.set(s.studentId, (cnt.get(s.studentId) || 0) + 1));
  const nTasks = R.tasks.filter((t) => t.sinf === tab).length;
  const rows = studs.map((st, i) => {
    const mine = st.teacherId === me.id;
    const conf = S.confirm && S.confirm.kind === "student" && S.confirm.id === st.id;
    const acts = !mine ? `<span class="muted small">boshqa o'qituvchi qo'shgan</span>`
      : conf ? `<span class="small">O'chirilsinmi?</span> <button type="button" class="btn danger small" data-act="del-st-yes" data-v="${esc(st.id)}" id="del-st-yes">Ha</button> <button type="button" class="btn ghost small" data-act="confirm-no" id="del-st-no">Yo'q</button>`
      : `<button type="button" class="linkish" data-act="reset-pass" data-v="${esc(st.id)}" id="reset-${esc(st.id)}"${R.working === "reset-" + st.id ? " disabled" : ""}>Yangi parol</button> · <button type="button" class="linkish" data-act="del-st" data-v="${esc(st.id)}" id="del-st-${esc(st.id)}">O'chirish</button>`;
    return `<tr><td class="num">${i + 1}</td><td class="nowrap"><b>${esc(fullName(st))}</b></td><td><code class="mono">${esc(st.login)}</code></td><td class="num">${cnt.get(st.id) || 0} / ${nTasks}</td><td class="nowrap">${acts}</td></tr>`;
  }).join("");
  const table = !R.loaded.students ? loadingBox()
    : !studs.length ? emptyBox(`${esc(tab)} sinfida hali o'quvchi yo'q`, "O'ng tomondagi shakl orqali qo'shing: bittalab yoki butun ro'yxatni birdaniga.")
    : `<div class="table-wrap"><table><thead><tr><th class="num">№</th><th>O'quvchi</th><th>Login</th><th class="num">Topshirgan</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
  const sinfOpts = me.sinflar.map((s) => [s, s + " sinf"]);
  const w1 = R.working === "one", w2 = R.working === "bulk";
  return `<header class="sec-h"><div><h1>Sinflar va o'quvchilar</h1><p>O'quvchilarni qo'shing: login va parol avtomatik yaratiladi.</p></div></header>
    <div class="chips" role="group" aria-label="Sinf">${me.sinflar.map((s) => `<button type="button" class="chip" data-act="sinf-tab" data-v="${esc(s)}" id="tab-${esc(s)}" aria-pressed="${s === tab}">${esc(s)} <span class="cnt">${R.students.filter((x) => x.sinf === s).length}</span></button>`).join("")}</div>
    <div class="two wide-left">
      <div class="stack">${credsCard()}${table}</div>
      <div class="stack">
        <form class="card form" data-form="one" novalidate><h2 class="card-h2" style="margin:0">Bitta o'quvchi qo'shish</h2>
          <div class="grid2">${field("Ism", "one-ism", "forms.one.ism")}${field("Familiya", "one-fam", "forms.one.familiya")}</div>
          ${selectField("Sinf", "one-sinf", "forms.one.sinf", sinfOpts)}
          <div class="grid2">${field("Login (ixtiyoriy)", "one-login", "forms.one.login", { placeholder: "avtomatik" })}${field("Parol (ixtiyoriy)", "one-parol", "forms.one.parol", { placeholder: "avtomatik" })}</div>
          ${errBox("one")}
          <button class="btn" type="submit" id="one-submit"${w1 ? " disabled" : ""}>${w1 ? "Qo'shilmoqda..." : "Qo'shish"}</button>
        </form>
        <form class="card form" data-form="bulk" novalidate><h2 class="card-h2" style="margin:0">Ro'yxatni birdaniga qo'shish</h2>
          <div class="grid2">${selectField("Sinf", "bulk-sinf", "forms.bulk.sinf", sinfOpts)}${selectField("Qatordagi tartib", "bulk-tartib", "forms.bulk.tartib", [["fi", "Familiya Ism"], ["if", "Ism Familiya"]])}</div>
          ${field("O'quvchilar ro'yxati", "bulk-text", "forms.bulk.text", { textarea: true, rows: 6, placeholder: "Karimova Aziza\nToshmatov Jasur\nRahimova Madina", hint: "Har qatorda bitta o'quvchi. Jurnal ro'yxatidan nusxa olib joylashingiz mumkin." })}
          ${errBox("bulk")}
          <button class="btn" type="submit" id="bulk-submit"${w2 ? " disabled" : ""}>${w2 ? "Qo'shilmoqda..." : "Ro'yxatni qo'shish"}</button>
        </form>
      </div>
    </div>`;
}
function tHisobot() {
  const me = R.me, f = S.forms.rep;
  if (!me.sinflar.includes(f.sinf)) f.sinf = me.sinflar[0] || "";
  const m = reportModel(f.sinf, f.fan);
  const nSt = m.rows.length, nT = m.tasks.length;
  const done = m.rows.reduce((a, r) => a + r.done, 0);
  const bahos = [];
  m.rows.forEach((r) => r.cells.forEach((s) => { if (s && s.baho) bahos.push(Number(s.baho)); }));
  const rate = nSt && nT ? Math.round((done / (nSt * nT)) * 100) : 0;
  const head = `<header class="sec-h"><div><h1>Hisobotlar</h1><p>Sinf va fan bo'yicha natijalar. Excel'da ochiladigan faylni yuklab olishingiz mumkin.</p></div>
    <div class="row">${selectField("Sinf", "rep-sinf", "forms.rep.sinf", me.sinflar.map((s) => [s, s + " sinf"]), { rerender: true })}${selectField("Fan", "rep-fan", "forms.rep.fan", [["all", "Barcha fanlar"], ...me.fanlar.map((x) => [x, x])], { rerender: true })}</div></header>`;
  if (!R.loaded.tasks || !R.loaded.students || !R.loaded.subs) return head + loadingBox();
  const kpis = `<div class="kpis"><div class="kpi"><b>${nSt}</b><span>o'quvchi</span></div><div class="kpi"><b>${nT}</b><span>vazifa</span></div><div class="kpi"><b>${rate}%</b><span>topshirilgan</span></div><div class="kpi"><b>${bahos.length ? one(bahos.reduce((a, b) => a + b, 0) / bahos.length) : "—"}</b><span>o'rtacha baho</span></div></div>`;
  if (!nSt || !nT) return head + kpis + emptyBox(!nSt ? "Bu sinfda o'quvchi yo'q" : "Bu sinf va fan bo'yicha vazifa yo'q", "Hisobot o'quvchilar va vazifalar bo'lganda tuziladi.");
  const table = `<div class="table-wrap rep"><table><thead><tr><th class="num">№</th><th>O'quvchi</th>${m.tasks.map((t) => `<th class="task" title="${esc(t.fan + ": " + t.sarlavha)}">${esc(t.sarlavha)}<br><span class="muted">${esc(t.fan)} · ${dayOnly(t.yaratilgan)}</span></th>`).join("")}<th class="num">Topshirgan</th><th class="num">O'rtacha baho</th><th class="num">Test, %</th></tr></thead><tbody>${m.rows.map((r, i) => `<tr><td class="num">${i + 1}</td><td><b>${esc(fullName(r.st))}</b></td>${r.cells.map((s) => `<td class="cell${!s ? " miss" : s.baho ? " g" + esc(s.baho) : ""}">${esc(cellText(s))}</td>`).join("")}<td class="num">${r.done}/${nT}</td><td class="num"><b>${r.avg == null ? "—" : one(r.avg)}</b></td><td class="num">${r.testPct == null ? "—" : r.testPct}</td></tr>`).join("")}</tbody></table></div>
    <p class="muted small">Belgilar: raqam = qo'yilgan baho, 8/10 = test balli, ✓ = topshirgan, baholanmagan, — = topshirmagan.</p>`;
  return head + kpis + table + `<div class="row"><button type="button" class="btn" data-act="rep-dl" id="rep-dl">Hisobotni yuklab olish (Excel, CSV)</button></div>`;
}
function tProfil() {
  const me = R.me;
  if (!S.forms.prof) S.forms.prof = { ism: me.ism, familiya: me.familiya, viloyat: me.viloyat, tuman: me.tuman, maktab: me.maktab, sinflar: me.sinflar.join(", "), fanlar: me.fanlar.slice() };
  const w = R.working === "prof", wp = R.working === "pass";
  return `<header class="sec-h"><div><h1>Profil</h1><p>Login: <code class="mono">${esc(me.login)}</code></p></div></header>
    <div class="two">
      <form class="card form" data-form="prof" novalidate><h2 class="card-h2" style="margin:0">Ma'lumotlar</h2>
        <div class="grid2">${field("Ism", "prof-ism", "forms.prof.ism")}${field("Familiya", "prof-fam", "forms.prof.familiya")}</div>
        ${schoolFields("prof")}
        ${errBox("prof")}
        <button class="btn" type="submit" id="prof-submit"${w ? " disabled" : ""}>${w ? "Saqlanmoqda..." : "Saqlash"}</button>
      </form>
      <form class="card form" data-form="pass" novalidate><h2 class="card-h2" style="margin:0">Parolni o'zgartirish</h2>
        ${field("Eski parol", "pass-old", "forms.pass.eski", { type: "password", autocomplete: "current-password" })}
        ${field("Yangi parol", "pass-new", "forms.pass.yangi", { type: "password", autocomplete: "new-password", hint: "Kamida 6 belgi." })}
        ${errBox("pass")}
        <button class="btn" type="submit" id="pass-submit"${wp ? " disabled" : ""}>${wp ? "Saqlanmoqda..." : "Parolni o'zgartirish"}</button>
      </form>
    </div>`;
}

/* ---------- views: student ---------- */
function vStudent(r) {
  const me = R.me;
  const fresh = R.tasks.filter((t) => !mySub(t.id)).length;
  const nav = [["oquvchi-vazifalar", "Vazifalar", IC.book, fresh], ["oquvchi-natijalar", "Natijalarim", IC.star], ["oquvchi-yordamchi", "AI yordamchi", IC.ai]];
  const sec = r === "oquvchi-natijalar" ? sNatijalar() : r === "oquvchi-yordamchi" ? sYordamchi() : sVazifalar();
  return `<div class="dash"><aside class="dash-side">
      <div class="who"><span class="avatar">${esc(initials(me))}</span><div><b>${esc(me.ism)} ${esc(me.familiya)}</b><small>${esc(me.sinf)} sinf · ${esc(me.maktab || "")}</small></div></div>
      <nav class="dash-nav" aria-label="O'quvchi bo'limlari">${navHtml(nav, r)}</nav>
    </aside><section class="dash-main">${statusNote()}${sec}</section></div>`;
}
function stuPill(t, s) {
  if (s) {
    if (s.baho) return `<span class="pill ok">Baho: ${esc(s.baho)}</span>`;
    if (s.jami) return `<span class="pill ok">Test: ${esc(s.ball)}/${esc(s.jami)}</span>`;
    return `<span class="pill wait">Tekshirilmoqda</span>`;
  }
  if (t.muddat && Date.now() > new Date(t.muddat + "T23:59:59").getTime()) return `<span class="pill late">Muddati o'tgan</span>`;
  return `<span class="pill new">Yangi</span>`;
}
function sVazifalar() {
  if (S.openTask) { const t = R.tasks.find((x) => x.id === S.openTask); if (t) return taskDetail(t); S.openTask = null; }
  const head = `<header class="sec-h"><div><h1>Vazifalar</h1><p>Qaysi fandan vazifa kelganini shu yerda ko'rasiz.</p></div></header>`;
  if (!R.loaded.tasks) return head + loadingBox();
  const tasks = R.tasks.slice().sort((a, b) => (b.yaratilgan || 0) - (a.yaratilgan || 0));
  if (!tasks.length) return head + emptyBox("Hozircha vazifa yo'q", "O'qituvchingiz vazifa yuborishi bilan u shu yerda paydo bo'ladi.");
  const fans = [...new Set(tasks.map((t) => t.fan))];
  if (S.stuFan !== "all" && !fans.includes(S.stuFan)) S.stuFan = "all";
  const freshIn = (fan) => tasks.filter((t) => (fan === "all" || t.fan === fan) && !mySub(t.id)).length;
  const chips = `<div class="chips" role="group" aria-label="Fan bo'yicha">${[["all", "Barcha fanlar"], ...fans.map((x) => [x, x])].map(([v, l], i) => { const n = freshIn(v); return `<button type="button" class="chip" data-act="stu-fan" data-v="${esc(v)}" id="sf-${i}" aria-pressed="${S.stuFan === v}">${esc(l)}${n ? ` <span class="cnt">${n} yangi</span>` : ""}</button>`; }).join("")}</div>`;
  const list = tasks.filter((t) => S.stuFan === "all" || t.fan === S.stuFan).map((t) => {
    const s = mySub(t.id);
    return `<button type="button" class="tcard click" data-act="open-task" data-v="${esc(t.id)}" id="t-${esc(t.id)}">
      <span class="tcard-top"><span class="${fanCls(t.fan)}">${esc(t.fan)}</span>${typeBadge(t)}<span class="tcard-right">${stuPill(t, s)}</span></span>
      <h3>${esc(t.sarlavha)}</h3>
      <span class="meta">${esc(t.teacherIsm || "")} · ${when(t.yaratilgan)}${t.muddat ? ` · Muddati: ${dayLabel(t.muddat)}` : ""}</span>
    </button>`;
  }).join("");
  return head + chips + `<div class="tcards">${list}</div>`;
}
function photoBlock(t, s) {
  if (s && S.reAns !== t.id) {
    return `<div class="card stack"><h2 class="card-h2" style="margin:0">Siz topshirgan javob</h2><p class="muted small">${when(s.topshirilgan)}${s.kechikdi ? " · muddatidan kech" : ""}</p>${fileView(s.fayl)}
      ${s.baho ? `<div class="row"><span class="muted">Baho:</span><span class="grade">${esc(s.baho)}</span></div>${s.izohO ? `<p class="teacher-note"><b>O'qituvchi izohi:</b> ${esc(s.izohO)}</p>` : ""}`
        : `<p class="muted">O'qituvchi hali baholamadi.</p><div><button type="button" class="btn ghost small" data-act="re-ans" data-v="${esc(t.id)}" id="re-ans">Qayta topshirish</button></div>`}
    </div>`;
  }
  const w = R.working === "ans";
  return `<div class="card stack"><h2 class="card-h2" style="margin:0">Javobingizni yuklang</h2>
    ${dropBox("ans", "Javob rasmini tanlang", "Daftaringizni rasmga oling yoki PDF yuklang", "image/*,application/pdf")}
    ${errBox("ans")}
    <div class="row"><button type="button" class="btn" data-act="submit-ans" data-v="${esc(t.id)}" id="submit-ans"${w ? " disabled" : ""}>${w ? "Yuborilmoqda..." : "Topshirish"}</button>${S.reAns === t.id ? `<button type="button" class="linkish" data-act="re-ans-cancel" id="re-ans-cancel">Bekor qilish</button>` : ""}</div>
  </div>`;
}
function testBlock(t, s) {
  const qs = t.savollar || [];
  if (s) {
    const pct = s.jami ? Math.round((s.ball / s.jami) * 100) : 0;
    return `<div class="result-band"><span class="big">${esc(s.ball)} / ${esc(s.jami)}</span><span>${pct}% to'g'ri. ${pct >= 80 ? "Zo'r natija!" : pct >= 50 ? "Yaxshi, xatolarni ko'rib chiqing." : "Mavzuni yana bir bor takrorlang."}</span></div>
      ${s.baho ? `<div class="row"><span class="muted">O'qituvchi bahosi:</span><span class="grade">${esc(s.baho)}</span></div>` : ""}${s.izohO ? `<p class="teacher-note"><b>O'qituvchi izohi:</b> ${esc(s.izohO)}</p>` : ""}
      ${qs.map((q, i) => `<div class="test-q"><h3><span>${i + 1}.</span>${esc(q.savol)}</h3>${q.v.map((v, j) => {
        const mine = Array.isArray(s.javoblar) && s.javoblar[i] === j, right = q.togri === j;
        return `<button type="button" class="choice${right ? " right" : mine ? " wrong" : ""}" disabled aria-pressed="${mine}"><span class="letter">${LETTERS[j] || j + 1}</span><span>${esc(v)}${right ? " ✓" : ""}</span></button>`;
      }).join("")}</div>`).join("")}`;
  }
  const ans = S.testAns[t.id] || [];
  const answered = qs.filter((_, i) => typeof ans[i] === "number").length;
  const w = R.working === "test";
  return `${qs.map((q, i) => `<div class="test-q"><h3><span>${i + 1}.</span>${esc(q.savol)}</h3>${q.v.map((v, j) => `<button type="button" class="choice" data-act="pick" data-t="${esc(t.id)}" data-q="${i}" data-o="${j}" id="pick-${i}-${j}" aria-pressed="${ans[i] === j}"><span class="letter">${LETTERS[j] || j + 1}</span><span>${esc(v)}</span></button>`).join("")}</div>`).join("")}
    ${errBox("test")}
    <div class="row between"><span class="muted">Javob berildi: ${answered} / ${qs.length}</span><button type="button" class="btn big" data-act="submit-test" data-v="${esc(t.id)}" id="submit-test"${w ? " disabled" : ""}>${w ? "Yuborilmoqda..." : "Testni topshirish"}</button></div>`;
}
function taskDetail(t) {
  const s = mySub(t.id);
  return `<div><button type="button" class="back" data-act="close-task" id="close-task">${IC.back} Vazifalarga qaytish</button></div>
    <div class="card stack">
      <div class="tcard-top"><span class="${fanCls(t.fan)}">${esc(t.fan)}</span>${typeBadge(t)}${t.muddat ? `<span class="badge">Muddati: ${dayLabel(t.muddat)}</span>` : ""}<span class="tcard-right">${stuPill(t, s)}</span></div>
      <h1 class="task-title">${esc(t.sarlavha)}</h1>
      <p class="muted small">O'qituvchi: ${esc(t.teacherIsm || "")} · ${when(t.yaratilgan)}</p>
      ${t.izoh ? `<div class="task-text">${fmt(t.izoh)}</div>` : ""}
      ${t.fayl ? fileView(t.fayl) : ""}
      ${R.sample !== null && !R.aiOff ? `<div><button type="button" class="btn ghost small" data-act="ask-ai" data-v="${esc(t.id)}" id="ask-ai">${IC.ai}<span>Tushunmadingizmi? AI yordamchidan so'rang</span></button></div>` : ""}
    </div>
    ${t.turi === "test" ? testBlock(t, s) : photoBlock(t, s)}`;
}
function sNatijalar() {
  const head = `<header class="sec-h"><div><h1>Natijalarim</h1><p>Baholar, test ballari va o'qituvchi izohlari.</p></div></header>`;
  if (!R.loaded.subs) return head + loadingBox();
  const subs = R.subs.slice().sort((a, b) => (b.topshirilgan || 0) - (a.topshirilgan || 0));
  if (!subs.length) return head + emptyBox("Hali natija yo'q", "Vazifani topshirganingizdan keyin baho va ballar shu yerda ko'rinadi.");
  const byFan = new Map();
  subs.forEach((s) => { if (s.baho) { const a = byFan.get(s.fan) || []; a.push(Number(s.baho)); byFan.set(s.fan, a); } });
  const kp = [...byFan.entries()].map(([f, a]) => `<div class="kpi"><b>${one(a.reduce((x, y) => x + y, 0) / a.length)}</b><span>${esc(f)}: o'rtacha baho</span></div>`).join("");
  return head + (kp ? `<div class="kpis">${kp}</div>` : "") + `<div class="table-wrap"><table><thead><tr><th>Sana</th><th>Fan</th><th>Vazifa</th><th class="num">Natija</th><th>O'qituvchi izohi</th></tr></thead><tbody>${subs.map((s) => `<tr><td>${when(s.topshirilgan)}</td><td><span class="${fanCls(s.fan)}">${esc(s.fan)}</span></td><td>${esc(s.sarlavha)}</td><td class="num">${s.baho ? `<span class="grade">${esc(s.baho)}</span>` : s.jami ? `${esc(s.ball)}/${esc(s.jami)}` : `<span class="pill wait">Tekshirilmoqda</span>`}</td><td>${esc(s.izohO || "")}</td></tr>`).join("")}</tbody></table></div>`;
}
function aiMsgHtml(m) {
  if (m.who === "me") {
    const url = m.img ? R.aiImg.get(m.id) : null;
    return `<div class="msg me">${url ? `<img src="${esc(url)}" alt="Yuborilgan rasm">` : m.img ? `<span class="muted small">Rasm biriktirilgan</span>` : ""}${m.text ? fmt(m.text) : ""}</div>`;
  }
  if (m.who === "sys") return `<div class="msg sys" role="alert"><p>${esc(m.text)}</p>${m.retry && R.aiRetry ? `<button type="button" class="btn ghost small" data-act="ai-retry" id="ai-retry">Qayta urinish</button>` : ""}</div>`;
  return `<div class="msg bot"><div class="margin"><span class="note">${esc(m.tag || "")}</span>${m.sub ? `<span class="note sub">${esc(m.sub)}</span>` : ""}</div><div class="body">${fmt(m.text)}</div></div>`;
}
function sYordamchi() {
  const A = S.ai;
  const head = `<header class="sec-h"><div><h1>AI yordamchi</h1><p>Javobni aytmaydi: har qadamda savol beradi, siz o'zingiz yechasiz.</p></div>
    <div class="row" style="align-items:flex-end">${selectField("Fan", "ai-fan", "ai.fan", [["", "Fanni tanlang"], ...FANLAR.map((x) => [x, x])])}<button type="button" class="btn ghost" data-act="ai-new" id="ai-new">Yangi masala</button></div></header>`;
  if (R.sample === null || R.aiOff) return head + emptyBox("AI yordamchi bu versiyada ishlamaydi", R.local ? "Unga server va AI kaliti kerak. Hozircha u platformaning claude.ai'dagi versiyasida ishlaydi." : R.sample === null ? "U faqat claude.ai ichida ochilgan sahifada ishlaydi." : "AI'dan foydalanishga ruxsat berilmadi. Sahifani qayta ochib, ruxsat bering.");
  const active = A.p && A.p.turns.length && !A.p.yechildi && !A.p.rad;
  const thinking = R.aiBusy ? `<div class="msg bot"><div class="margin"><span class="note">...</span></div><div class="body"><div id="ai-stream">${R.aiStream ? fmt(R.aiStream) : `<p class="dots">O'ylayapman<span></span><span></span><span></span></p>`}</div><p style="margin-top:12px"><button type="button" class="btn ghost small" data-act="ai-stop" id="ai-stop">To'xtatish</button></p></div></div>` : "";
  return head + `<section class="notebook"><div class="chat" id="ai-chat" aria-live="polite">${A.log.map(aiMsgHtml).join("")}${thinking}</div>
    <form class="composer" data-form="ai">
      ${R.files.ai ? `<div class="row"><span class="file-chip">${R.urls.ai ? `<img src="${esc(R.urls.ai)}" alt="" style="width:28px;height:28px;object-fit:cover;border-radius:6px">` : ""}${esc(R.files.ai.name || "rasm")}</span><button type="button" class="linkish" data-act="clear-file" data-v="ai" id="clear-ai">Olib tashlash</button></div>` : ""}
      <div class="composer-row">
        ${R.aiImages ? `<label class="icon-btn" for="file-ai" title="Rasm biriktirish">${IC.cam}<span class="sr">Rasm biriktirish</span></label><input class="sr" type="file" id="file-ai" data-file="ai" accept="image/*">` : ""}
        <label class="sr" for="ai-input">Xabar</label>
        <textarea id="ai-input" rows="1" data-bind="ai.input" placeholder="${active ? "Javobingizni yozing yoki savol bering" : "Masalani yozing yoki rasmini yuboring"}">${esc(A.input)}</textarea>
        <button class="btn" type="submit" id="ai-send"${R.aiBusy ? " disabled" : ""}>Yuborish</button>
      </div>
    </form></section>`;
}

/* ---------- render ---------- */
const T_ROUTES = ["oqituvchi-vazifa", "oqituvchi-javoblar", "oqituvchi-sinflar", "oqituvchi-hisobot", "oqituvchi-profil"];
const O_ROUTES = ["oquvchi-vazifalar", "oquvchi-natijalar", "oquvchi-yordamchi"];
const ALL_ROUTES = ["bosh", "kirish", "royxat", ...T_ROUTES, ...O_ROUTES];
function view() {
  const r = S.route;
  if (T_ROUTES.includes(r)) return S.session && S.session.role === "teacher" && R.me ? vTeacher(r) : vNeedLogin("teacher");
  if (O_ROUTES.includes(r)) return S.session && S.session.role === "student" && R.me ? vStudent(r) : vNeedLogin("student");
  if (r === "kirish") return S.session && R.me ? vLanding() : vLogin();
  if (r === "royxat") return vRegister();
  return vLanding();
}
function render() {
  const a = document.activeElement;
  const id = a && a !== document.body && a.id ? a.id : null;
  let ss = null, se = null;
  try { if (a && typeof a.selectionStart === "number") { ss = a.selectionStart; se = a.selectionEnd; } } catch (_) {}
  R.fileReg.clear();
  $("#top").innerHTML = vHeader();
  $("#app").innerHTML = view();
  if (id) {
    const el = document.getElementById(id);
    if (el && el !== document.activeElement) {
      try { el.focus({ preventScroll: true }); } catch (_) {}
      if (ss != null && typeof el.setSelectionRange === "function") { try { el.setSelectionRange(ss, se); } catch (_) {} }
    }
  }
  if (S.route === "oquvchi-yordamchi") scrollAi();
}
function onHash() {
  const h = (location.hash || "").slice(1);
  const next = ALL_ROUTES.includes(h) ? h : "bosh";
  if (next !== S.route) { S.openTask = null; S.confirm = null; S.reAns = null; S.err = {}; }
  S.route = next;
  render();
  window.scrollTo(0, 0);
}

/* ---------- events ---------- */
function onClick(e) {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  const v = t.dataset.v;
  switch (t.dataset.act) {
    case "logout": logout(); break;
    case "toggle-fan": {
      const list = getPath(S, `forms.${t.dataset.scope}.fanlar`);
      const i = list.indexOf(v);
      if (i >= 0) list.splice(i, 1); else list.push(v);
      render(); break;
    }
    case "task-type": S.forms.task.turi = v; render(); break;
    case "add-q": S.forms.task.savollar.push(freshQ()); render(); { const n = S.forms.task.savollar.length - 1; const el = document.getElementById("q-" + n); if (el) el.focus(); } break;
    case "del-q": S.forms.task.savollar.splice(Number(v), 1); render(); break;
    case "clear-file": setFile(v, null); render(); break;
    case "task-subs": S.forms.inbox = { sinf: "all", fan: "all", holat: "all", task: v }; S.openSub = null; go("oqituvchi-javoblar"); break;
    case "del-task": S.confirm = { kind: "task", id: v }; render(); break;
    case "del-task-yes": delTask(v); break;
    case "confirm-no": S.confirm = null; render(); break;
    case "open-sub": S.openSub = v; S.err.grade = ""; render(); { const d = document.getElementById("sub-detail"); if (d && window.innerWidth < 1080) d.scrollIntoView({ block: "start" }); } break;
    case "close-sub": S.openSub = null; render(); break;
    case "grade": if (S.openSub && S.grade[S.openSub]) { S.grade[S.openSub].baho = Number(v); render(); } break;
    case "save-grade": saveGrade(v); break;
    case "sinf-tab": S.sinfTab = v; S.forms.one.sinf = v; S.forms.bulk.sinf = v; S.confirm = null; render(); break;
    case "reset-pass": resetPass(v); break;
    case "del-st": S.confirm = { kind: "student", id: v }; render(); break;
    case "del-st-yes": delStudent(v); break;
    case "creds-dl": if (R.creds) offerDownload(safeName(`loginlar_${R.creds[0].sinf}.csv`), credsCsv(R.creds)); break;
    case "creds-copy": if (R.creds) copyText(credsText(R.creds), "Login va parollar nusxalandi."); break;
    case "creds-close": R.creds = null; render(); break;
    case "rep-dl": { const f = S.forms.rep; offerDownload(safeName(`hisobot_${f.sinf}_${f.fan === "all" ? "barcha-fanlar" : f.fan}.csv`), reportCsv(reportModel(f.sinf, f.fan))); break; }
    case "stu-fan": S.stuFan = v; render(); break;
    case "open-task": S.openTask = v; S.err = {}; S.reAns = null; setFile("ans", null); render(); window.scrollTo(0, 0); break;
    case "close-task": S.openTask = null; render(); break;
    case "pick": { const tid = t.dataset.t; const a = S.testAns[tid] || (S.testAns[tid] = []); a[Number(t.dataset.q)] = Number(t.dataset.o); render(); break; }
    case "submit-test": submitTest(v); break;
    case "submit-ans": submitPhoto(v); break;
    case "re-ans": S.reAns = v; render(); break;
    case "re-ans-cancel": S.reAns = null; setFile("ans", null); render(); break;
    case "ask-ai": { const task = R.tasks.find((x) => x.id === v); if (task) aiFromTask(task); break; }
    case "ai-new": if (R.aiCtl) R.aiCtl.abort(); { const fan = S.ai.fan; S.ai = freshAi(); S.ai.fan = fan; } R.aiRetry = null; render(); break;
    case "ai-stop": if (R.aiCtl) R.aiCtl.abort(); break;
    case "ai-retry": if (R.aiRetry && !R.aiBusy) R.aiRetry(); break;
    case "open-file": { const f = R.fileReg.get(v); if (f) openDataFile(f); break; }
    case "seed-demo": seedDemo(); break;
    case "clear-ask": S.confirm = { kind: "clear" }; render(); break;
    case "clear-yes": clearAllLocal(); break;
  }
}
function autosize(el) { el.style.height = "auto"; el.style.height = Math.min(140, el.scrollHeight + 2) + "px"; }
function bindEvents() {
  document.addEventListener("click", onClick);
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.bind && el.tagName !== "SELECT") { setPath(S, el.dataset.bind, el.value); if (el.id === "ai-input") autosize(el); }
  });
  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!el.dataset) return;
    if (el.tagName === "SELECT" && el.dataset.bind) { setPath(S, el.dataset.bind, el.value); if (el.dataset.rerender) render(); }
    else if (el.dataset.radio) setPath(S, el.dataset.radio, Number(el.value));
    else if (el.dataset.file) { const f = el.files && el.files[0]; el.value = ""; if (f) pickFile(el.dataset.file, f); }
  });
  document.addEventListener("submit", (e) => {
    const k = e.target.dataset && e.target.dataset.form;
    if (!k) return;
    e.preventDefault();
    const fn = { login: doLogin, reg: doRegister, task: sendTask, one: addOne, bulk: addBulk, prof: saveProfile, pass: changePass, ai: () => aiSend() }[k];
    if (fn) fn();
  });
  document.addEventListener("keydown", (e) => {
    if (e.target && e.target.id === "ai-input" && e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); aiSend(); }
  });
  document.addEventListener("dragover", (e) => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d) { e.preventDefault(); d.classList.add("over"); } });
  document.addEventListener("dragleave", (e) => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d) d.classList.remove("over"); });
  document.addEventListener("drop", (e) => {
    const d = e.target.closest && e.target.closest("[data-drop]");
    if (!d) return;
    e.preventDefault();
    d.classList.remove("over");
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) pickFile(d.dataset.drop, f);
  });
  window.addEventListener("hashchange", onHash);
}

/* ---------- boot (keeps state across a republish) ---------- */
function snapshot() {
  const c = JSON.parse(JSON.stringify(S));
  c.forms.login.parol = ""; c.forms.reg.parol = ""; c.forms.reg.parol2 = ""; c.forms.pass = { eski: "", yangi: "" };
  return c;
}
function start(data) {
  S = freshState();
  if (data && data.forms) Object.assign(S, data);
  if (!S.session) S.session = lsGet();
  bindEvents();
  onHash();
  initCaps();
}
const HOT = window.claude && window.claude.hot;
if (HOT && typeof HOT.snapshot === "function") HOT.snapshot(() => snapshot());
if (HOT && typeof HOT.ready === "function") HOT.ready(start);
else start((HOT && HOT.data) || {});
