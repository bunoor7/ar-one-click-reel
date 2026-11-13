/*META {"title":"Blueprint Draw","page":"#0B0B0C"}*/
const PX = 281, PY = 62, PW = 230, PH = 476, PR = 40;
function rrPerimeter(w, h, r) { return 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r; }
function rrPoint(x, y, w, h, r, p) {
  const segs = [[w - 2 * r, 0], [Math.PI * r / 2, 1], [h - 2 * r, 2], [Math.PI * r / 2, 3], [w - 2 * r, 4], [Math.PI * r / 2, 5], [h - 2 * r, 6], [Math.PI * r / 2, 7]];
  let s = p * rrPerimeter(w, h, r);
  for (const [len, k] of segs) {
    if (s <= len) {
      const u = len ? s / len : 0;
      if (k === 0) return [x + r + u * (w - 2 * r), y];
      if (k === 2) return [x + w, y + r + u * (h - 2 * r)];
      if (k === 4) return [x + w - r - u * (w - 2 * r), y + h];
      if (k === 6) return [x, y + h - r - u * (h - 2 * r)];
      const a = [-Math.PI / 2, 0, Math.PI / 2, Math.PI][(k - 1) / 2] + u * Math.PI / 2, cx = [x + w - r, x + w - r, x + r, x + r][(k - 1) / 2], cy = [y + r, y + h - r, y + h - r, y + r][(k - 1) / 2];
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    }
    s -= len;
  }
  return [x + r, y];
}
// يرسم مسارًا مغلقًا أو خطًا تدريجيًا بحيلة الشرطة
function drawn(ctx, len, p, col, w, build) {
  if (p <= 0) return;
  ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.setLineDash([len, len + 50]); ctx.lineDashOffset = len * (1 - p);
  build(); ctx.stroke(); ctx.restore();
}
const line = (ctx, x0, y0, x1, y1, p, col, w = 1.6) => { if (p <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, p), lerp(y0, y1, p)); ctx.stroke(); };

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  // شبكة 24 بكسل، وأقوى كل 96
  for (let x = 0; x <= W; x += 24) { ctx.strokeStyle = rgba(C.bone, x % 96 === 0 ? 0.11 : 0.045); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 24) { ctx.strokeStyle = rgba(C.bone, y % 96 === 0 ? 0.11 : 0.045); ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5); ctx.stroke(); }
  const B = C.bone, g = (a, b) => GL(seg(t, a, b));
  // الهيكل ثم حافة الشاشة ثم الكاميرا ثم الصورة الرمزية وشريط العنوان
  const pBody = g(0.02, 0.2);
  drawn(ctx, rrPerimeter(PW, PH, PR), pBody, B, 2, () => RR(ctx, PX, PY, PW, PH, PR));
  drawn(ctx, rrPerimeter(210, 456, 30), g(0.14, 0.28), B, 1.6, () => RR(ctx, PX + 10, PY + 10, 210, 456, 30));
  drawn(ctx, rrPerimeter(66, 18, 9), g(0.24, 0.3), B, 1.6, () => RR(ctx, PX + PW / 2 - 33, PY + 22, 66, 18, 9));
  drawn(ctx, 2 * Math.PI * 17, g(0.28, 0.35), B, 1.6, () => { ctx.beginPath(); ctx.arc(PX + 44, PY + 86, 17, 0, Math.PI * 2); });
  drawn(ctx, rrPerimeter(110, 14, 7), g(0.3, 0.38), B, 1.6, () => RR(ctx, PX + 72, PY + 79, 110, 14, 7));
  // بطاقة البطل بقطرين متقاطعين
  drawn(ctx, rrPerimeter(186, 116, 16), g(0.36, 0.5), B, 1.6, () => RR(ctx, PX + 22, PY + 116, 186, 116, 16));
  line(ctx, PX + 22, PY + 116, PX + 208, PY + 232, g(0.46, 0.54), rgba(B, 0.55), 1.2); line(ctx, PX + 208, PY + 116, PX + 22, PY + 232, g(0.48, 0.56), rgba(B, 0.55), 1.2);
  drawn(ctx, rrPerimeter(88, 72, 12), g(0.52, 0.6), B, 1.6, () => RR(ctx, PX + 22, PY + 248, 88, 72, 12));
  drawn(ctx, rrPerimeter(88, 72, 12), g(0.54, 0.62), B, 1.6, () => RR(ctx, PX + 120, PY + 248, 88, 72, 12));
  line(ctx, PX + 24, PY + 342, PX + 174, PY + 342, g(0.6, 0.66), B, 2.2); line(ctx, PX + 24, PY + 360, PX + 124, PY + 360, g(0.62, 0.68), B, 2.2);
  drawn(ctx, rrPerimeter(186, 48, 24), g(0.64, 0.74), B, 1.6, () => RR(ctx, PX + 22, PY + 404, 186, 48, 24));
  for (let i = 0; i < 4; i++) { const d = LD(seg(t, 0.7 + i * 0.03, 0.82 + i * 0.03)); if (d > 0) circle(ctx, PX + 56 + i * 41.3, PY + 428, 5.5 * d, i === 0 ? C.orange : B); }
  // نقطة متوهجة تركب طرف الخط الأول كأنها قلم
  if (pBody > 0 && pBody < 1) { const hp = rrPoint(PX, PY, PW, PH, PR, pBody); headDot(ctx, hp[0], hp[1], C.white, 4.2); }
  // خطوط الأبعاد البرتقالية 844 PT و390 PT ونصف القطر
  const dm = g(0.74, 0.88), O = C.orange;
  line(ctx, PX - 44, PY, PX - 44, PY + PH, dm, O); if (dm > 0.02) { line(ctx, PX - 52, PY, PX - 36, PY, 1, O); line(ctx, PX - 52, PY + PH * dm, PX - 36, PY + PH * dm, 1, O); }
  line(ctx, PX, PY + PH + 40, PX + PW, PY + PH + 40, dm, O); if (dm > 0.02) { line(ctx, PX, PY + PH + 32, PX, PY + PH + 48, 1, O); line(ctx, PX + PW * dm, PY + PH + 32, PX + PW * dm, PY + PH + 48, 1, O); }
  const la = EO(seg(t, 0.84, 0.94));
  ctx.save(); ctx.translate(PX - 58, PY + PH / 2); ctx.rotate(-Math.PI / 2); CAPS(ctx, '844 PT', 0, 0, { align: 'center', fill: O, alpha: la, size: 13, ls: 2.4 }); ctx.restore();
  CAPS(ctx, '390 PT', PX + PW / 2, PY + PH + 64, { align: 'center', fill: O, alpha: la, size: 13, ls: 2.4 });
  const rr = g(0.84, 0.94);
  if (rr > 0) { line(ctx, PX + 12, PY + 12, PX - 40, PY - 24, rr, O); line(ctx, PX - 40, PY - 24, PX - 130, PY - 24, clamp((rr - 0.5) * 2), O); CAPS(ctx, 'RADIUS 40', PX - 134, PY - 19, { align: 'right', fill: O, alpha: clamp((rr - 0.6) * 2.5), size: 13, ls: 2.4 }); }
  // خطان رماديان يشيران إلى بطاقة البطل وشريط التبويب
  const ll = g(0.88, 0.99), gr = rgba(B, 0.55);
  line(ctx, PX + 208, PY + 174, PX + 318, PY + 174, ll, gr, 1.3); CAPS(ctx, 'HERO CARD 16:10', PX + 328, PY + 179, { fill: B, alpha: 0.7 * clamp((ll - 0.4) * 2), size: 13, ls: 2.4 });
  line(ctx, PX + 208, PY + 428, PX + 318, PY + 428, ll, gr, 1.3); CAPS(ctx, 'TAB BAR 4 ITEMS', PX + 328, PY + 433, { fill: B, alpha: 0.7 * clamp((ll - 0.4) * 2), size: 13, ls: 2.4 });
  // تسميات الزوايا
  const ca = EO(seg(t, 0, 0.14));
  CAPS(ctx, 'BLUEPRINT', 40, H - 34, { fill: B, alpha: 0.7 * ca, size: 13, ls: 3 });
  CAPS(ctx, 'APP SCREEN · REV 03', W - 40, 44, { align: 'right', fill: B, alpha: 0.7 * ca, size: 13, ls: 3 });
  CAPS(ctx, 'SCALE 1:2', W - 40, H - 34, { align: 'right', fill: B, alpha: 0.7 * ca, size: 13, ls: 3 });
}
