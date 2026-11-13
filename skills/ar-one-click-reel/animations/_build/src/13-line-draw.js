/*META {"title":"Line Draw","page":"#0B0B0C"}*/
// التسمية والرقم: غيّرهما هنا
const LABEL = 'REACH · 90 DAYS', FINAL = 128.4, UNIT = 'k', PILL = '+38%';
const VALS = [0.1, 0.19, 0.16, 0.31, 0.4, 0.37, 0.58, 0.75, 0.94];
const X0 = 70, X1 = 776, YB = 520, YH = 232;
const PTS = VALS.map((v, i) => [X0 + (i / (VALS.length - 1)) * (X1 - X0), YB - v * YH]);
const CURVE = catmull(PTS, 28);

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  // خمسة خطوط أفقية خافتة
  for (let i = 0; i < 5; i++) { const y = YB - (i / 4) * (YH + 24); ctx.strokeStyle = rgba(C.bone, 0.08); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0 - 20, y + 0.5); ctx.lineTo(W - 50, y + 0.5); ctx.stroke(); }
  const p = GL(seg(t, 0.06, 0.74));
  const { pts, head } = pathUpTo(CURVE, p);

  // تدرّج برتقالي ناعم تحت الخط
  if (pts.length > 1) {
    const g = ctx.createLinearGradient(0, YB - YH - 20, 0, YB);
    g.addColorStop(0, rgba(C.orange, 0.42)); g.addColorStop(1, rgba(C.orange, 0));
    ctx.beginPath(); ctx.moveTo(pts[0][0], YB);
    pts.forEach((q) => ctx.lineTo(q[0], q[1]));
    ctx.lineTo(head[0], YB); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = C.orange;
    strokePoly(ctx, pts);
  }
  if (p > 0 && p < 1) headDot(ctx, head[0], head[1], C.white, 6.5);
  else if (p >= 1) { glow(ctx, head[0], head[1], 30, C.orange, 0.55); circle(ctx, head[0], head[1], 6.5, C.white); }

  CAPS(ctx, LABEL, 64, 84, { fill: C.bone, alpha: 0.6, size: 13 });
  NUM(ctx, (FINAL * p).toFixed(1) + UNIT, 60, 190, { font: F.sans(104, 700), fill: C.bone });
  CAPS(ctx, 'DAY 1', X0 - 6, YB + 36, { alpha: 0.7 });
  CAPS(ctx, 'DAY 90', X1 + 10, YB + 36, { align: 'right', alpha: 0.7 });

  // الشارة البيضاء تهبط بجانب آخر نقطة
  const k = LD(seg(t, 0.74, 0.9));
  if (k > 0) {
    const last = PTS[PTS.length - 1], w = 98, h = 42, x = last[0] + 52, y = last[1] - 6 - (1 - k) * 18;
    ctx.save(); ctx.globalAlpha = clamp(k * 1.5); ctx.translate(x, y); ctx.scale(k, k);
    RR(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = C.white; ctx.fill();
    T(ctx, PILL, 0, 7.5, { font: F.sans(22, 700), fill: C.ink, align: 'center' });
    ctx.restore();
  }
}
