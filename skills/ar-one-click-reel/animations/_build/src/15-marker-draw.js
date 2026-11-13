/*META {"title":"Marker Draw","page":"#F6F4F1"}*/
// العنوان: غيّره هنا
const L1 = 'Make it', L2 = 'obvious.';
const B1 = 262, B2 = 442, S1 = 122, S2 = 190;

function marker(ctx, pts, col, p, w = 6.5) {
  if (p <= 0) return;
  const { pts: up } = pathUpTo(pts, p);
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; strokePoly(ctx, up);
}
const bz = (a, b, c, d, s) => Math.pow(1 - s, 3) * a + 3 * Math.pow(1 - s, 2) * s * b + 3 * (1 - s) * s * s * c + s * s * s * d;

function draw(ctx, t) {
  graphPaper(ctx, C.bone, C.ink);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.font = F.sans(S1, 700); const w1 = ctx.measureText(L1).width;
  ctx.font = F.serif(S2); const w2 = ctx.measureText(L2).width;
  const x1 = W / 2 - w1 / 2, x2 = W / 2 - w2 / 2;
  // الكلمتان تصعدان من خلف قناع
  const r1 = EO(seg(t, 0, 0.26)), r2 = EO(seg(t, 0.08, 0.36));
  ctx.save(); ctx.beginPath(); ctx.rect(0, B1 - S1 * 0.9, W, S1 * 0.95); ctx.clip(); ctx.font = F.sans(S1, 700); ctx.fillStyle = C.ink; ctx.fillText(L1, x1, B1 + (1 - r1) * S1 * 1.1); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(0, B2 - S2 * 0.85, W, S2 * 0.98); ctx.clip(); ctx.font = F.serif(S2); ctx.fillStyle = C.orange; ctx.fillText(L2, x2, B2 + (1 - r2) * S2 * 1.1); ctx.restore();

  // الخطوط تُرسم على الحروف
  // 1) إهليلج حبر متمايل يلف «obvious.»
  const ecx = W / 2, ecy = B2 - 62, erx = w2 / 2 + 38, ery = 118, el = [];
  for (let k = 0; k <= 120; k++) { const a = -2.3 + (k / 120) * Math.PI * 2.16, wob = 1 + 0.025 * Math.sin(3 * a + 1) + 0.018 * Math.sin(7 * a); el.push([ecx + Math.cos(a) * erx * wob, ecy + Math.sin(a) * ery * wob]); }
  marker(ctx, el, C.ink, GL(seg(t, 0.38, 0.62)));
  // 2) خط متموج برتقالي تحت «Make it»
  const wv = []; for (let k = 0; k <= 80; k++) { const u = k / 80; wv.push([x1 - 6 + u * (w1 + 12), B1 + 30 + Math.sin(u * Math.PI * 7) * 7]); }
  marker(ctx, wv, C.orange, GL(seg(t, 0.52, 0.72)));
  // 3) سهم حبر ينحني من أعلى اليمين نحو الكلمات
  const ar = []; for (let k = 0; k <= 50; k++) { const u = k / 50; ar.push([bz(838, 888, 770, x1 + w1 + 24, u), bz(46, 130, 170, B1 - S1 * 0.72, u)]); }
  const ap = GL(seg(t, 0.64, 0.84)); marker(ctx, ar, C.ink, ap);
  if (ap >= 0.98) { const e = ar[ar.length - 1], pr = ar[ar.length - 4], an = Math.atan2(e[1] - pr[1], e[0] - pr[0]); ctx.strokeStyle = C.ink; ctx.lineWidth = 6.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(e[0] - Math.cos(an - 0.5) * 26, e[1] - Math.sin(an - 0.5) * 26); ctx.lineTo(e[0], e[1]); ctx.lineTo(e[0] - Math.cos(an + 0.5) * 26, e[1] - Math.sin(an + 0.5) * 26); ctx.stroke(); }
  // 4) نجمة صغيرة برتقالية في الزاوية السفلية اليمنى
  const sp = seg(t, 0.8, 0.97);
  for (let k = 0; k < 10; k++) {
    const q = clamp(sp * 10 - k * 0.7), a = (k / 10) * Math.PI * 2, r0 = 8, r1_ = k % 2 ? 22 : 34;
    if (q > 0) { ctx.strokeStyle = C.orange; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(838 + Math.cos(a) * r0, 524 + Math.sin(a) * r0); ctx.lineTo(838 + Math.cos(a) * lerp(r0, r1_, q), 524 + Math.sin(a) * lerp(r0, r1_, q)); ctx.stroke(); }
  }
}
