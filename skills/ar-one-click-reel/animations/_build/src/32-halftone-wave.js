/*META {"title":"Halftone Wave","page":"#0B0B0C"}*/
const GAP = 21, MAXR = 10.6;
// شبكة مدارة 45 درجة تغطي الإطار
const DOTS = [];
(() => {
  const c = Math.SQRT1_2, n = 44;
  for (let u = -n; u <= n; u++) for (let v = -n; v <= n; v++) {
    const x = W / 2 + (u * c - v * c) * GAP, y = H / 2 + (u * c + v * c) * GAP;
    if (x > -12 && x < W + 12 && y > -12 && y < H + 12) DOTS.push([x, y]);
  }
})();

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const grow = EO(seg(t, 0, 0.4));
  const ph = t * Math.PI * 2;
  const rc = [W / 2 + 70 * Math.cos(ph), H / 2 + 44 * Math.sin(ph)]; // مركز الموجة يدور في إهليلج صغير
  ctx.fillStyle = C.orange; ctx.beginPath();
  for (const [x, y] of DOTS) {
    const d = Math.hypot(x - rc[0], y - rc[1]);
    const ripple = 0.5 + 0.5 * Math.cos(d * 0.052 - ph * 2); // تنتشر الحلقات بسرعة ثابتة
    const ex = (x - W / 2) / (W / 2), ey = (y - H / 2) / (H / 2);
    const edge = clamp(1 - Math.pow(Math.hypot(ex, ey) / 1.32, 2.3));
    const r = MAXR * Math.pow(ripple, 1.35) * (0.15 + 0.85 * edge) * (0.2 + 0.8 * grow);
    if (r > 0.35) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }
  }
  ctx.fill();
}
