// ===== خريطة نسيج على سطح بمنظور: تقسيمه لمثلثات صغيرة، كل مثلث بتحويل أفيني وقصّ =====
function drawTri(ctx, img, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2) {
  const cx = (x0 + x1 + x2) / 3, cy = (y0 + y1 + y2) / 3, e = 0.6; // نوسّع المثلث قليلًا لإخفاء الخطوط بين المثلثات
  const ex = (x, y) => { const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + dx / l * e, y + dy / l * e]; };
  const a = ex(x0, y0), b = ex(x1, y1), c = ex(x2, y2);
  const dx0 = x0, dy0 = y0, dx1 = x1, dy1 = y1, dx2 = x2, dy2 = y2;
  const delta = sx0 * sy1 + sy0 * sx2 + sx1 * sy2 - sy1 * sx2 - sy0 * sx1 - sx0 * sy2;
  if (Math.abs(delta) < 1e-9) return;
  const da = dx0 * sy1 + sy0 * dx2 + dx1 * sy2 - sy1 * dx2 - sy0 * dx1 - dx0 * sy2;
  const db = sx0 * dx1 + dx0 * sx2 + sx1 * dx2 - dx1 * sx2 - dx0 * sx1 - sx0 * dx2;
  const dc = sx0 * sy1 * dx2 + sy0 * dx1 * sx2 + dx0 * sx1 * sy2 - dx0 * sy1 * sx2 - sy0 * sx1 * dx2 - sx0 * dx1 * sy2;
  const dd = dy0 * sy1 + sy0 * dy2 + dy1 * sy2 - sy1 * dy2 - sy0 * dy1 - dy0 * sy2;
  const de = sx0 * dy1 + dy0 * sx2 + sx1 * dy2 - dy1 * sx2 - dy0 * sx1 - sx0 * dy2;
  const df = sx0 * sy1 * dy2 + sy0 * dy1 * sx2 + dy0 * sx1 * sy2 - dy0 * sy1 * sx2 - sy0 * sx1 * dy2 - sx0 * dy1 * sy2;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.closePath(); ctx.clip();
  ctx.transform(da / delta, dd / delta, db / delta, de / delta, dc / delta, df / delta);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
// mapUV(u, v) يعيد نقطة الشاشة لإحداثيات النسيج 0..1
function drawTex(ctx, img, mapUV, nx = 8, ny = 12) {
  const iw = img.width, ih = img.height;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const u0 = i / nx, u1 = (i + 1) / nx, v0 = j / ny, v1 = (j + 1) / ny;
    const p00 = mapUV(u0, v0), p10 = mapUV(u1, v0), p11 = mapUV(u1, v1), p01 = mapUV(u0, v1);
    drawTri(ctx, img, p00[0], p00[1], p10[0], p10[1], p11[0], p11[1], iw * u0, ih * v0, iw * u1, ih * v0, iw * u1, ih * v1);
    drawTri(ctx, img, p00[0], p00[1], p11[0], p11[1], p01[0], p01[1], iw * u0, ih * v0, iw * u1, ih * v1, iw * u0, ih * v1);
  }
}
// مستطيل مسطّح ثلاثي الأبعاد (بطاقة) بنسيج: يعيد الوجه الظاهر ونقاط الإطار
function cardPoly(w, h, r, n = 10) {
  const pts = [], cs = [[w / 2 - r, -h / 2 + r, -90], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 90], [-w / 2 + r, -h / 2 + r, 180]];
  cs.forEach(([cx, cy, a0]) => { for (let k = 0; k <= n; k++) { const a = deg(a0 + (k / n) * 90); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } });
  return pts;
}
