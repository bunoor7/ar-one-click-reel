/*META {"title":"Paper Collage","page":"#F6F4F1"}*/
// الكلمات الثلاث: غيّرها هنا
const STRIPS = [
  { word: 'Made', bg: C.ink, fg: C.bone, x: W / 2 - 38, y: 168, rot: -3.2, from: -1, at: 0 },
  { word: 'by', bg: C.white, fg: C.ink, x: W / 2 + 46, y: 298, rot: 2.6, from: 1, at: 0.17 },
  { word: 'hand.', bg: C.orange, fg: C.white, x: W / 2 - 14, y: 428, rot: -2, from: -1, at: 0.33 },
];
const SW = 540, SHT = 128;
function torn(w, h, seed, jag, step = 14) {
  const r = rng(seed), pts = [];
  const edge = (x0, y0, x1, y1, nx, ny) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / step)); for (let i = 0; i < n; i++) { const k = i / n, o = (r() - 0.5) * 2 * jag; pts.push([x0 + (x1 - x0) * k + nx * o, y0 + (y1 - y0) * k + ny * o]); } };
  edge(-w / 2, -h / 2, w / 2, -h / 2, 0, 1); edge(w / 2, -h / 2, w / 2, h / 2, 1, 0); edge(w / 2, h / 2, -w / 2, h / 2, 0, 1); edge(-w / 2, h / 2, -w / 2, -h / 2, 1, 0);
  return pts;
}
const POLY = STRIPS.map((_, i) => ({ main: torn(SW, SHT, 11 + i, 5), under: torn(SW + 10, SHT + 12, 41 + i, 8) }));
const path = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };

function draw(ctx, t) {
  graphPaper(ctx, C.bone, C.ink);
  STRIPS.forEach((s, i) => {
    const p = LD(seg(t, s.at, s.at + 0.3));
    if (p <= 0) return;
    const x = lerp(s.from * 900, 0, p) + s.x, rot = s.rot + (1 - p) * 4 * (-s.from);
    ctx.save(); ctx.translate(x, s.y); ctx.rotate(deg(rot));
    // حافة ممزقة أفتح تبرز من الخلف
    path(ctx, POLY[i].under); ctx.fillStyle = mixHex(s.bg, '#FFFFFF', s.bg === C.white ? -0.0 : 0.55); if (s.bg === C.white) ctx.fillStyle = '#E9E6E0'; ctx.fill();
    SH(ctx, 'rgba(11,11,12,0.3)', 18, 3, 9); path(ctx, POLY[i].main); ctx.fillStyle = s.bg; ctx.fill(); noSH(ctx);
    T(ctx, s.word, -SW / 2 + 40, 36, { font: F.sans(104, 700), fill: s.fg });
    ctx.restore();
  });
  // شريط لاصق شفاف يهبط على الشريط الأول عند 0.46
  const tp = LD(seg(t, 0.46, 0.62));
  if (tp > 0) {
    const sc = lerp(1.3, 1, tp);
    ctx.save(); ctx.translate(W / 2 - 38 - SW / 2 + 36, 168 - SHT / 2 + 6); ctx.rotate(deg(-24)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(tp * 1.4) * 0.85;
    ctx.fillStyle = 'rgba(255,226,140,0.72)'; ctx.fillRect(-52, -17, 104, 34);
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(-52, -17, 104, 9);
    ctx.fillStyle = 'rgba(255,226,140,0.72)'; ctx.beginPath(); for (let k = 0; k <= 5; k++) { ctx.lineTo(-52 - 3 + (k % 2) * 6, -17 + k * 6.8); } for (let k = 5; k >= 0; k--) { ctx.lineTo(52 + 3 - (k % 2) * 6, -17 + k * 6.8); } ctx.fill();
    ctx.restore();
  }
  // نجمة قلم برتقالية وخط منحنٍ تحت الكلمة الأخيرة
  const ul = []; for (let k = 0; k <= 40; k++) { const u = k / 40; ul.push([W / 2 - 14 - 230 + u * 470, 428 + 84 + Math.sin(u * Math.PI) * -14 + (u - 0.5) * 6]); }
  const up = pathUpTo(ul, GL(seg(t, 0.6, 0.78)));
  ctx.strokeStyle = C.orange; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; strokePoly(ctx, up.pts);
  const sp = seg(t, 0.74, 0.96);
  for (let k = 0; k < 10; k++) {
    const q = clamp(sp * 10 - k * 0.7), a = (k / 10) * Math.PI * 2 - 0.3, r0 = 10, r1 = k % 2 ? 26 : 42;
    if (q > 0) { ctx.strokeStyle = C.orange; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(812 + Math.cos(a) * r0, 104 + Math.sin(a) * r0); ctx.lineTo(812 + Math.cos(a) * lerp(r0, r1, q), 104 + Math.sin(a) * lerp(r0, r1, q)); ctx.stroke(); }
  }
}
