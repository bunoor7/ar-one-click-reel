/*META {"title":"Layer Explode","page":"#0B0B0C"}*/
const C30 = Math.cos(Math.PI / 6), S30 = Math.sin(Math.PI / 6);
const PW = 262, PD = 172, CX = 292, CY0 = 346;
// الطبقات من الأسفل: غيّر الأسماء هنا
const LAYERS = [['01.', 'Background'], ['02.', 'Layout'], ['03.', 'Type'], ['04.', 'Motion']];
const iso = (x, y, z) => [CX + (x - y) * C30, CY0 + (x + y) * S30 - z];

function plate(ctx, z, fill, stroke, lw = 1.4) {
  const q = [iso(0, 0, z), iso(PW, 0, z), iso(PW, PD, z), iso(0, PD, z)];
  ctx.beginPath(); q.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
}
function flat(ctx, z, fn) { // مستوى الطبقة: x نحو اليمين والأسفل، y نحو اليسار والأسفل
  const o = iso(0, 0, z);
  ctx.save(); ctx.transform(C30, S30, -C30, S30, o[0], o[1]); fn(); ctx.restore();
}

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const gap = lerp(6, 98, GL(seg(t, 0.08, 0.7)));
  // خطوط متقطعة تصل زوايا الطبقات
  if (gap > 14) [[0, 0], [PW, 0], [PW, PD], [0, PD]].forEach(([x, y]) => { const a = iso(x, y, 0), b = iso(x, y, gap * 3); ctx.setLineDash([4, 5]); ctx.strokeStyle = rgba(C.bone, 0.3 * clamp((gap - 14) / 30)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]); });
  // 0) اللوح الداكن المنقط
  plate(ctx, 0, '#131316', rgba(C.bone, 0.3));
  flat(ctx, 0, () => { ctx.fillStyle = rgba(C.bone, 0.32); for (let y = 16; y < PD; y += 22) for (let x = 16; x < PW; x += 22) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); } });
  // 1) طبقة التخطيط بثلاث كتل فاتحة
  const z1 = gap; plate(ctx, z1, rgba(C.bone, 0.05), rgba(C.bone, 0.55));
  flat(ctx, z1, () => { ctx.fillStyle = rgba(C.bone, 0.88); RR(ctx, 16, 16, 132, 34, 7); ctx.fill(); RR(ctx, 16, 64, 82, 92, 8); ctx.fill(); RR(ctx, 112, 64, 134, 92, 8); ctx.fill(); });
  // 2) طبقة النص
  const z2 = gap * 2; plate(ctx, z2, null, rgba(C.bone, 0.35));
  flat(ctx, z2, () => { T(ctx, 'Ideas that', 20, 66, { font: F.sans(38, 700), fill: C.bone }); T(ctx, 'compound.', 20, 122, { font: F.serif(56), fill: C.orange }); });
  // 3) طبقة الحركة: إطار برتقالي وزر ومؤشر ومسار منحنٍ
  const z3 = gap * 3; plate(ctx, z3, null, C.orange, 2);
  flat(ctx, z3, () => {
    RR(ctx, 22, 122, 104, 32, 16); ctx.fillStyle = C.orange; ctx.fill();
    ctx.setLineDash([5, 6]); ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, 44); ctx.bezierCurveTo(90, 8, 150, 120, 78, 132); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.translate(176, 88); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 26); ctx.lineTo(7, 20); ctx.lineTo(12, 31); ctx.lineTo(17, 28.5); ctx.lineTo(12, 18.5); ctx.lineTo(20, 18.5); ctx.closePath(); ctx.fillStyle = C.white; ctx.fill(); ctx.restore();
  });
  // خطوط توصيل إلى التسميات على اليمين
  LAYERS.forEach(([num, name], i) => {
    const z = gap * i, a = iso(PW, 0, z), p = EO(seg(t, 0.56 + i * 0.06, 0.8 + i * 0.06));
    if (p <= 0) return;
    const lx = 596, ly = a[1];
    ctx.strokeStyle = rgba(C.bone, 0.55); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a[0] + 4, a[1]); ctx.lineTo(lerp(a[0] + 4, lx - 12, p), a[1]); ctx.stroke();
    circle(ctx, a[0] + 4, a[1], 3 * p, C.orange);
    T(ctx, num, lx, ly + 7, { font: F.serif(24), fill: C.orange, alpha: clamp((p - 0.5) * 2) });
    T(ctx, name, lx + 38, ly + 7, { font: F.sans(21, 500), fill: C.bone, alpha: clamp((p - 0.5) * 2) });
  });
}
