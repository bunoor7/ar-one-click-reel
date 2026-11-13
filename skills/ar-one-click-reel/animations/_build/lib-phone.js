// ===== جوال واقعي ثلاثي الأبعاد: شريحة بحافة معدنية مصقولة، إطار أسود رفيع، وأزرار جانبية =====
// الشاشة تُرسم أولًا على canvas خارج الشاشة ثم تُسقط على وجه الجوال بمنظور (شبكة مثلثات صغيرة)
const PH = { W: 250, H: 520, D: 26, R: 46, BZ: 9 };
const PSW = PH.W - 2 * PH.BZ, PSH = PH.H - 2 * PH.BZ, PSR = PH.R - PH.BZ;
const PH_LIGHT = (() => { const l = [-0.5, -0.55, -0.67], m = Math.hypot(...l); return l.map((x) => x / m); })();
const PH_OUT = (() => {
  const pts = [], ns = [], w = PH.W / 2, h = PH.H / 2, r = PH.R;
  [[w - r, -h + r, -90], [w - r, h - r, 0], [-w + r, h - r, 90], [-w + r, -h + r, 180]].forEach(([cx, cy, a0]) => {
    for (let k = 0; k <= 12; k++) { const a = deg(a0 + (k / 12) * 90); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); ns.push([Math.cos(a), Math.sin(a)]); }
  });
  return { pts, ns };
})();
const PH_BTN = [[-1, -196, -168], [-1, -132, -74], [-1, -56, 2], [1, -128, -40]]; // الجانب، من y، إلى y

function phoneRot(v, o) { return rotZ(rotX(rotY(v, o.yaw || 0), o.pitch || 0), o.roll || 0); }
function phoneXf(p, o) { const q = phoneRot(p, o); return [q[0] + (o.x || 0), q[1] + (o.y || 0), q[2] + (o.z || 0)]; }

// نسيج الشاشة بزوايا مدوّرة (الخارج شفاف)
function screenTex(key, painter) {
  return texture(key, PSW, PSH, (g, w, h) => { g.save(); RR(g, 0, 0, w, h, PSR); g.clip(); painter(g, w, h); g.restore(); });
}
function statusBar(g, w, dark) {
  const fg = dark ? C.bone : C.ink;
  T(g, '9:41', 28, 34, { font: F.sans(15, 700), fill: fg });
  RR(g, w / 2 - 42, 13, 84, 26, 13); g.fillStyle = '#000'; g.fill();
  for (let i = 0; i < 4; i++) { g.fillStyle = fg; g.fillRect(w - 76 + i * 5, 34 - (i + 1) * 3, 3, (i + 1) * 3); }
  RR(g, w - 50, 22, 22, 11, 3.5); g.strokeStyle = fg; g.lineWidth = 1.2; g.stroke(); g.fillStyle = fg; g.fillRect(w - 48, 24, 15, 7);
}

function drawPhone(ctx, o) {
  const sc = o.scale || 1, D = o.D || 1500;
  const P = (q) => proj(q, o.cx, o.cy, D, sc);
  const N = PH_OUT.pts.length, dz = PH.D / 2;
  const T3 = (x, y, z) => P(phoneXf([x, y, z], o));
  ctx.save(); ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  const metal = (I) => mixHex('#33353b', '#eceef2', clamp(I));
  const drawButtons = (side) => PH_BTN.forEach(([s, y0, y1]) => {
    if (s !== side) return;
    const x = s * (PH.W / 2), x2 = x + s * 4.5;
    const q = [T3(x2, y0, -6), T3(x2, y1, -6), T3(x2, y1, 6), T3(x2, y0, 6)];
    const nr = phoneRot([s, 0, 0], o), I = 0.25 + 0.75 * Math.max(0, nr[0] * PH_LIGHT[0] + nr[1] * PH_LIGHT[1] + nr[2] * PH_LIGHT[2]);
    const f = [T3(x, y0, -6), T3(x2, y0, -6), T3(x2, y1, -6), T3(x, y1, -6)];
    ctx.beginPath(); f.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.fillStyle = metal(I * 0.8); ctx.fill();
    ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.fillStyle = metal(I + 0.1); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 0.8; ctx.stroke();
  });
  // الأزرار على الجانب البعيد أولًا
  [-1, 1].forEach((s) => { if (phoneRot([s, 0, 0], o)[2] >= 0) drawButtons(s); });
  // الجدار الجانبي المعدني: ظل حسب اتجاه الوجه وتدرّج عبر السماكة
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const n = [PH_OUT.ns[i][0] + PH_OUT.ns[j][0], PH_OUT.ns[i][1] + PH_OUT.ns[j][1], 0], m = Math.hypot(n[0], n[1]) || 1;
    const nr = phoneRot([n[0] / m, n[1] / m, 0], o);
    if (nr[2] >= 0) continue;
    const a = PH_OUT.pts[i], b = PH_OUT.pts[j];
    const fa = T3(a[0], a[1], -dz), fb = T3(b[0], b[1], -dz), bb = T3(b[0], b[1], dz), ba = T3(a[0], a[1], dz);
    const I = 0.12 + 0.88 * Math.pow(Math.max(0, nr[0] * PH_LIGHT[0] + nr[1] * PH_LIGHT[1] + nr[2] * PH_LIGHT[2]), 0.8);
    const g = ctx.createLinearGradient((fa.x + fb.x) / 2, (fa.y + fb.y) / 2, (ba.x + bb.x) / 2, (ba.y + bb.y) / 2);
    g.addColorStop(0, mixHex(metal(I), '#FFFFFF', 0.28)); g.addColorStop(0.45, metal(I)); g.addColorStop(1, mixHex(metal(I), '#000000', 0.38));
    ctx.beginPath(); ctx.moveTo(fa.x, fa.y); ctx.lineTo(fb.x, fb.y); ctx.lineTo(bb.x, bb.y); ctx.lineTo(ba.x, ba.y); ctx.closePath();
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.stroke();
  }
  [-1, 1].forEach((s) => { if (phoneRot([s, 0, 0], o)[2] < 0) drawButtons(s); });
  // الوجه الأمامي: إطار أسود رفيع ثم الشاشة
  ctx.beginPath(); PH_OUT.pts.forEach(([x, y], i) => { const q = T3(x, y, -dz); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.closePath();
  ctx.fillStyle = '#050506'; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.stroke();
  if (o.tex) {
    const map = (u, v) => { const q = T3((u - 0.5) * PSW, (v - 0.5) * PSH, -dz - 0.3); return [q.x, q.y]; };
    drawTex(ctx, o.tex, map, 7, 13);
    // انعكاس زجاجي خفيف
    const c0 = map(0, 0), c1 = map(1, 1);
    ctx.save(); ctx.beginPath();
    for (let k = 0; k < 4; k++) for (let s = 0; s <= 6; s++) {
      const a = deg(-90 + k * 90 + (s / 6) * 90), cxm = [PSW / 2 - PSR, PSW / 2 - PSR, -PSW / 2 + PSR, -PSW / 2 + PSR][k], cym = [-PSH / 2 + PSR, PSH / 2 - PSR, PSH / 2 - PSR, -PSH / 2 + PSR][k];
      const q = T3(cxm + PSR * Math.cos(a), cym + PSR * Math.sin(a), -dz - 0.3); (k || s) ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
    }
    ctx.closePath(); ctx.clip();
    const gl = ctx.createLinearGradient(c0[0], c0[1], c1[0], c1[1]);
    gl.addColorStop(0, 'rgba(255,255,255,0.16)'); gl.addColorStop(0.35, 'rgba(255,255,255,0.0)'); gl.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  ctx.restore();
}

// ===== شاشات التطبيقات المشتركة =====
function tabBar(g, w, h, dark) {
  RR(g, 16, h - 76, w - 32, 58, 29); g.fillStyle = dark ? '#1b1b1f' : C.ink; g.fill();
  for (let i = 0; i < 4; i++) circle(g, 16 + (w - 32) * (0.2 + i * 0.2), h - 47, i === 0 ? 6 : 4.5, i === 0 ? C.orange : rgba(C.bone, 0.6));
}
function appScreen(g, w, h, scroll, full) {
  g.fillStyle = C.white; g.fillRect(0, 0, w, h);
  g.save(); g.translate(0, -scroll);
  T(g, 'Ideas that', 22, 94, { font: F.sans(32, 700), fill: C.ink });
  T(g, 'compound.', 22, 140, { font: F.serif(48), fill: C.orange });
  RR(g, 22, 162, w - 44, 124, 22); const gr = g.createLinearGradient(0, 162, w, 286); gr.addColorStop(0, mixHex(C.orange, '#FFFFFF', 0.25)); gr.addColorStop(1, C.orange); g.fillStyle = gr; g.fill();
  circle(g, w / 2, 224, 26, C.white); g.fillStyle = C.orange; g.beginPath(); g.moveTo(w / 2 - 7, 211); g.lineTo(w / 2 + 14, 224); g.lineTo(w / 2 - 7, 237); g.closePath(); g.fill();
  const tw = (w - 56) / 2;
  RR(g, 22, 302, tw, 78, 18); g.fillStyle = C.bone; g.fill(); CAPS(g, 'REACH', 36, 328, { size: 10, ls: 1.6 }); T(g, '128k', 36, 364, { font: F.sans(26, 700), fill: C.ink });
  RR(g, 34 + tw, 302, tw, 78, 18); g.fillStyle = C.ink; g.fill(); CAPS(g, 'GROWTH', 48 + tw, 328, { size: 10, ls: 1.6, fill: rgba(C.bone, 0.7) }); T(g, '+38%', 48 + tw, 364, { font: F.sans(26, 700), fill: C.orange });
  if (full) {
    T(g, 'Latest', 22, 424, { font: F.sans(22, 700), fill: C.ink });
    ['#2B2B30', C.orange, C.grey, C.peach].forEach((col, i) => {
      const y = 444 + i * 64; circle(g, 40, y + 22, 20, col);
      RR(g, 72, y + 8, 110 - i * 14, 11, 5.5); g.fillStyle = C.ink; g.fill(); RR(g, 72, y + 28, 78, 9, 4.5); g.fillStyle = C.mid; g.fill();
    });
    RR(g, 22, 708, w - 44, 130, 26); g.fillStyle = C.ink; g.fill(); T(g, 'Next up', 42, 756, { font: F.sans(22, 700), fill: C.bone }); RR(g, 42, 776, 120, 9, 4.5); g.fillStyle = rgba(C.bone, 0.4); g.fill();
    circle(g, w - 56, 773, 24, C.orange);
  }
  g.restore();
  // خلفية شريط الحالة وتلاشي أسفل الصفحة حتى لا يظهر المحتوى المتمرر خلفهما
  g.fillStyle = C.white; g.fillRect(0, 0, w, 52);
  const fade = g.createLinearGradient(0, h - 108, 0, h - 70); fade.addColorStop(0, 'rgba(255,255,255,0)'); fade.addColorStop(1, 'rgba(255,255,255,1)');
  g.fillStyle = fade; g.fillRect(0, h - 108, w, 108);
  statusBar(g, w, false);
  tabBar(g, w, h, false);
}
