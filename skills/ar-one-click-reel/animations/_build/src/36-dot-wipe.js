/*META {"title":"Dot Wipe","page":"#0B0B0C"}*/
// الكلمتان: غيّرهما هنا
const WORD1 = 'Rendering', WORD2 = 'Done';
const CW = 540, CH = 270;

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const cx = W / 2 - CW / 2, cy = H / 2 - CH / 2 + 4;
  const dotX = cx + 40, dotY = cy + 40;
  const prog = EO(seg(t, 0, 0.3));
  // البطاقة الداكنة
  SH(ctx, 'rgba(0,0,0,0.5)', 36, 0, 16); RR(ctx, cx, cy, CW, CH, 28); ctx.fillStyle = C.dark; ctx.fill(); noSH(ctx);
  RR(ctx, cx + 0.5, cy + 0.5, CW - 1, CH - 1, 28); ctx.strokeStyle = rgba(C.bone, 0.1); ctx.lineWidth = 1; ctx.stroke();
  T(ctx, WORD1, cx + 40, cy + 138, { font: F.sans(62, 700), fill: C.bone });
  // شريط التقدم من 70% إلى 100% والعداد من 38 / 50 إلى 50 / 50
  const bx = cx + 40, by = cy + 188, bw = CW - 80;
  RR(ctx, bx, by, bw, 10, 5); ctx.fillStyle = rgba(C.bone, 0.12); ctx.fill();
  RR(ctx, bx, by, bw * lerp(0.7, 1, prog), 10, 5); ctx.fillStyle = C.orange; ctx.fill();
  NUM(ctx, Math.round(lerp(38, 50, prog)) + ' / 50', bx, by + 44, { font: F.mono(17, 500), fill: C.bone });
  // النقطة البرتقالية تنبض في الزاوية
  const pulse = 1 + 0.18 * Math.sin(t * Math.PI * 2 * 4);
  const grow = GL(seg(t, 0.3, 0.6));
  const r = 9 * pulse * (grow > 0 ? 1 : 1) + grow * 9 * 110;
  glow(ctx, dotX, dotY, 34 * (1 - grow), C.orange, 0.5);
  circle(ctx, dotX, dotY, r, C.orange);

  // «Done» ترتفع من خلف قناع بعد أن يغطي البرتقالي الإطار
  if (t > 0.58) {
    const lt = seg(t, 0.58, 0.82);
    let size = 270; ctx.font = F.sans(size, 700);
    const dotW = size * 0.2 + 26;
    let w = ctx.measureText(WORD2).width;
    if (w + dotW > W - 90) { size = size * (W - 90) / (w + dotW); ctx.font = F.sans(size, 700); w = ctx.measureText(WORD2).width; }
    const x0 = W / 2 - (w + dotW) / 2, base = H / 2 + size * 0.36;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 0.95, W, size * 0.99); ctx.clip();
    ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(WORD2, x0, base + (1 - EO(lt)) * size * 1.05);
    ctx.restore();
    const k = LD(seg(t, 0.8, 0.94));
    circle(ctx, x0 + w + size * 0.07 + size * 0.1, base - size * 0.1, size * 0.1 * k, C.bone);
  }
}
