/*META {"title":"Typewriter","page":"#0B0B0C"}*/
// النص: غيّره هنا
const PROMPT = 'make the hero reveal slower', FILE = 'hero.mp4';
const BW = 620, BH = 230, FS = 31;

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const bx = W / 2 - BW / 2, by = H / 2 - BH / 2 + 8;
  const appear = EO(seg(t, 0, 0.07));
  ctx.save(); ctx.globalAlpha = appear; ctx.translate(W / 2, H / 2); ctx.scale(lerp(0.96, 1, appear), lerp(0.96, 1, appear)); ctx.translate(-W / 2, -H / 2);
  // توهج برتقالي ناعم تحت الصندوق
  glow(ctx, W / 2, by + BH + 6, 330, C.orange, 0.34);
  SH(ctx, 'rgba(0,0,0,0.55)', 40, 0, 18); RR(ctx, bx, by, BW, BH, 34); ctx.fillStyle = C.dark; ctx.fill(); noSH(ctx);
  RR(ctx, bx + 0.5, by + 0.5, BW - 1, BH - 1, 34); ctx.strokeStyle = rgba(C.bone, 0.12); ctx.lineWidth = 1; ctx.stroke();
  CAPS(ctx, 'PROMPT', bx + 6, by - 26, { fill: C.bone, alpha: 0.6, size: 13, ls: 3 });

  // الكتابة حرفًا حرفًا من 0.05 إلى 0.71
  const n = Math.floor(PROMPT.length * seg(t, 0.05, 0.71) + 1e-6);
  const txt = PROMPT.slice(0, n);
  ctx.font = F.mono(FS, 400);
  const tx = bx + 40, ty = by + 86;
  T(ctx, txt, tx, ty, { font: F.mono(FS, 400), fill: C.bone });
  const caretX = tx + ctx.measureText(txt).width + 3;
  const typing = t < 0.71;
  const on = typing || t < 0.05 || Math.floor((t - 0.71) * 11) % 2 === 0;
  if (on) {
    glow(ctx, caretX + 1.5, ty - 11, 26, C.orange, 0.5);
    ctx.fillStyle = C.orange; ctx.fillRect(caretX, ty - 30, 3.4, 38);
  }
  // الشريحة في الأسفل
  RR(ctx, bx + 32, by + BH - 70, 128, 38, 19); ctx.fillStyle = rgba(C.bone, 0.1); ctx.fill();
  circle(ctx, bx + 54, by + BH - 51, 5, C.orange);
  T(ctx, FILE, bx + 68, by + BH - 46, { font: F.mono(14, 500), fill: C.bone });
  // زر الإرسال: يُضغط عند 0.78 وتنتشر حلقة برتقالية
  const bcx = bx + BW - 62, bcy = by + BH - 51;
  const pr = seg(t, 0.78, 0.9), press = 1 - 0.14 * Math.sin(Math.PI * pr);
  const rp = seg(t, 0.8, 1);
  if (rp > 0 && rp < 1) { ctx.strokeStyle = rgba(C.orange, (1 - rp) * 0.8); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bcx, bcy, 28 + rp * 62, 0, Math.PI * 2); ctx.stroke(); }
  ctx.save(); ctx.translate(bcx, bcy); ctx.scale(press, press);
  circle(ctx, 0, 0, 28, C.orange);
  ctx.strokeStyle = C.white; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, -10); ctx.moveTo(-9, -1); ctx.lineTo(0, -10); ctx.lineTo(9, -1); ctx.stroke();
  ctx.restore();
  ctx.restore();
}
