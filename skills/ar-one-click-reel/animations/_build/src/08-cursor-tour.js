/*META {"title":"Cursor Tour","page":"#FFFFFF"}*/
// الاسم على شارة المؤشر: غيّره هنا
const NAME = 'Bu Nasser';
const TS = 216, TG = 38, TY = 168;
const TX = (i) => (W - (3 * TS + 2 * TG)) / 2 + i * (TS + TG);

function tile(ctx, i, label, num) {
  const x = TX(i);
  SH(ctx, 'rgba(11,11,12,0.14)', 26, 0, 12); RR(ctx, x, TY, TS, TS, 38); ctx.fillStyle = C.white; ctx.fill(); noSH(ctx);
  RR(ctx, x + 0.5, TY + 0.5, TS - 1, TS - 1, 38); ctx.strokeStyle = rgba(C.ink, 0.08); ctx.lineWidth = 1; ctx.stroke();
  T(ctx, num, x + 26, TY + 52, { font: F.serif(34), fill: C.orange });
  T(ctx, label, x + 26, TY + TS - 28, { font: F.sans(28, 700), fill: C.ink });
  ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const cx = x + TS / 2, cy = TY + 98;
  if (i === 0) { ctx.beginPath(); ctx.moveTo(cx - 34, cy + 16); ctx.bezierCurveTo(cx - 14, cy - 46, cx + 14, cy + 52, cx + 34, cy - 14); ctx.stroke(); circle(ctx, cx - 34, cy + 16, 4.5, C.ink); circle(ctx, cx + 34, cy - 14, 4.5, C.orange); }
  else { ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.stroke(); circle(ctx, cx, cy, 4, C.orange); }
}
function arrow(ctx) {
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 27); ctx.lineTo(7, 21); ctx.lineTo(12, 32); ctx.lineTo(17.5, 29.5); ctx.lineTo(12.5, 19); ctx.lineTo(21, 19); ctx.closePath();
  ctx.fillStyle = C.ink; ctx.fill(); ctx.strokeStyle = C.white; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
}

function draw(ctx, t) {
  fillBG(ctx, C.white);
  dots(ctx, C.ink, 24, 1.1, 0.12);
  tile(ctx, 0, 'Glide', '01.'); tile(ctx, 1, 'Press', '02.');
  const x3 = TX(2), tx = x3 + TS / 2, ty = TY + TS / 2;
  const pressed = t > 0.64;
  const k = LD(seg(t, 0.64, 0.8));
  if (!pressed) { // مستطيل مخطط متقطع فارغ
    RR(ctx, x3 + 1, TY + 1, TS - 2, TS - 2, 38); ctx.setLineDash([9, 9]); ctx.strokeStyle = rgba(C.ink, 0.28); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
  } else {
    const rp = seg(t, 0.64, 0.96);
    ctx.strokeStyle = rgba(C.orange, (1 - rp) * 0.7); ctx.lineWidth = 3; RR(ctx, x3 - rp * 60, TY - rp * 60, TS + rp * 120, TS + rp * 120, 38 + rp * 60); ctx.stroke();
    ctx.save(); ctx.translate(tx, ty); ctx.scale(k, k);
    SH(ctx, rgba(C.orange, 0.5), 28, 0, 12); RR(ctx, -TS / 2, -TS / 2, TS, TS, 38); ctx.fillStyle = C.orange; ctx.fill(); noSH(ctx);
    const tk = seg(t, 0.7, 0.86);
    ctx.strokeStyle = C.white; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pts = [[-30, -6], [-8, 18], [34, -26]];
    const poly = catmull([pts[0], pts[1], pts[2]], 1); const up = pathUpTo(poly, tk);
    strokePoly(ctx, up.pts);
    T(ctx, 'Done', 0, 74, { font: F.sans(30, 700), fill: C.white, align: 'center', alpha: clamp(tk * 2) });
    ctx.restore();
  }
  CAPS(ctx, 'CURSOR TOUR · GLIDE, PRESS, DONE', W / 2, TY + TS + 76, { align: 'center', fill: C.ink, alpha: 0.6, size: 14, ls: 3 });

  // المؤشر ينساب من أسفل اليمين عبر مسار منحنٍ إلى البلاطة الثالثة ثم يضغط
  const u = GL(seg(t, 0.06, 0.6));
  const P0 = [W - 190, H - 70], P1 = [W - 270, H + 10], P2 = [tx + 260, ty + 170], P3 = [tx + 6, ty + 12];
  const bz = (a, b, c, d, s) => Math.pow(1 - s, 3) * a + 3 * Math.pow(1 - s, 2) * s * b + 3 * (1 - s) * s * s * c + s * s * s * d;
  const cx = bz(P0[0], P1[0], P2[0], P3[0], u), cy = bz(P0[1], P1[1], P2[1], P3[1], u);
  const press = 1 - 0.14 * Math.sin(Math.PI * seg(t, 0.6, 0.7));
  ctx.save(); ctx.translate(cx, cy); ctx.scale(press, press);
  SH(ctx, 'rgba(11,11,12,0.3)', 10, 2, 5); arrow(ctx); noSH(ctx);
  ctx.font = F.sans(14, 700);
  const pw = ctx.measureText(NAME).width + 26;
  RR(ctx, 16, 30, pw, 28, 14); ctx.fillStyle = C.orange; ctx.fill();
  T(ctx, NAME, 29, 49, { font: F.sans(14, 700), fill: C.white });
  ctx.restore();
}
