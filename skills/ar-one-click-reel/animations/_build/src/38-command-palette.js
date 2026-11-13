/*META {"title":"Command Palette","page":"#F6F4F1"}*/
// الأوامر الأربعة واختصاراتها: غيّرها هنا
const QUERY = 'anim';
const ACTIONS = [['Animate selection', 'ENTER'], ['Animate on scroll', 'A'], ['Add keyframe', 'K'], ['Export MP4', 'E']];
const PW = 640, PH = 448, PX = (W - PW) / 2, PY = 76, ROWH = 72;

function glyph(ctx, i, cx, cy, col) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (i === 0) { ctx.beginPath(); ctx.moveTo(cx - 8, cy - 9); ctx.lineTo(cx + 9, cy); ctx.lineTo(cx - 8, cy + 9); ctx.closePath(); ctx.fill(); }
  else if (i === 1) { ctx.beginPath(); ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10); ctx.moveTo(cx - 7, cy + 3); ctx.lineTo(cx, cy + 10); ctx.lineTo(cx + 7, cy + 3); ctx.stroke(); }
  else if (i === 2) { ctx.beginPath(); ctx.moveTo(cx, cy - 10); ctx.lineTo(cx + 9, cy); ctx.lineTo(cx, cy + 10); ctx.lineTo(cx - 9, cy); ctx.closePath(); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(cx - 10, cy + 8); ctx.lineTo(cx + 10, cy + 8); ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 3); ctx.moveTo(cx - 6, cy - 3); ctx.lineTo(cx, cy + 3); ctx.lineTo(cx + 6, cy - 3); ctx.stroke(); }
}

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  const d = EO(seg(t, 0, 0.14));
  ctx.save(); ctx.globalAlpha = clamp(d * 1.4);
  ctx.translate(0, (1 - d) * -64);
  SH(ctx, 'rgba(11,11,12,0.28)', 70, 0, 34); RR(ctx, PX, PY, PW, PH, 32); ctx.fillStyle = C.white; ctx.fill(); noSH(ctx);
  // السطر الأعلى: بحث ونص يكتب نفسه ومفتاح ESC
  ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(PX + 50, PY + 38, 11, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(PX + 58, PY + 46); ctx.lineTo(PX + 67, PY + 55); ctx.stroke();
  const n = Math.floor(QUERY.length * seg(t, 0.1, 0.3) + 1e-6), q = QUERY.slice(0, n);
  T(ctx, q, PX + 90, PY + 53, { font: F.mono(28, 400), fill: C.ink });
  ctx.font = F.mono(28, 400);
  const cx = PX + 90 + ctx.measureText(q).width + 3;
  if (t < 0.34 || Math.floor(t * 12) % 2 === 0) { ctx.fillStyle = C.orange; ctx.fillRect(cx, PY + 26, 3, 34); }
  RR(ctx, PX + PW - 98, PY + 22, 62, 32, 9); ctx.strokeStyle = rgba(C.ink, 0.22); ctx.lineWidth = 1.4; ctx.stroke();
  T(ctx, 'ESC', PX + PW - 67, PY + 43, { font: F.mono(13, 500), fill: C.grey, align: 'center', ls: 1 });
  ctx.fillStyle = rgba(C.ink, 0.1); ctx.fillRect(PX, PY + 80, PW, 1.5);
  CAPS(ctx, 'ACTIONS', PX + 36, PY + 116, { fill: C.grey, size: 12, ls: 3 });
  // شريط التظليل البرتقالي: يبدأ على الصف الأول وينزل صفًا عند 0.44 ثم عند 0.7
  const pos = GL(seg(t, 0.44, 0.54)) + GL(seg(t, 0.7, 0.8));
  const bar = 1;
  const ry = (r) => PY + 134 + r * ROWH;
  if (bar) { RR(ctx, PX + 16, ry(pos) + 3, PW - 32, ROWH - 6, 18); ctx.fillStyle = C.orange; ctx.fill(); }
  ACTIONS.forEach(([name, key], i) => {
    const cover = clamp(1 - Math.abs(pos - i)), y = ry(i), fg = mixHex(C.ink, '#FFFFFF', cover);
    RR(ctx, PX + 34, y + 14, 44, 44, 13); ctx.fillStyle = cover > 0.5 ? 'rgba(255,255,255,0.22)' : C.bone; ctx.fill();
    glyph(ctx, i, PX + 56, y + 36, cover > 0.5 ? C.white : C.ink);
    T(ctx, name, PX + 96, y + 45, { font: F.sans(23, 500), fill: fg });
    ctx.font = F.mono(13, 500);
    const kw = Math.max(34, ctx.measureText(key).width + 24);
    RR(ctx, PX + PW - 36 - kw, y + 20, kw, 32, 9); ctx.strokeStyle = cover > 0.5 ? 'rgba(255,255,255,0.6)' : rgba(C.ink, 0.22); ctx.lineWidth = 1.4; ctx.stroke();
    T(ctx, key, PX + PW - 36 - kw / 2, y + 41, { font: F.mono(13, 500), fill: cover > 0.5 ? C.white : C.grey, align: 'center', ls: 1 });
  });
  ctx.restore();
}
