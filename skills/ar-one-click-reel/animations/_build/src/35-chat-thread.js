/*META {"title":"Chat Thread","page":"#F6F4F1"}*/
// السؤال والجواب: غيّرهما هنا
const ASK = 'Animate the hero section', REPLY = 'Here it is, in motion.', CAPTION = 'HERO-REVEAL.MP4 · 0:08';

function spark(ctx, x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k * Math.PI / 4, rr = k % 2 ? r * 0.28 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  // فقاعة المستخدم السوداء تصعد من الأعلى اليمين
  ctx.font = F.sans(24, 500);
  const uw = ctx.measureText(ASK).width + 64, uh = 66, up = EO(seg(t, 0.0, 0.14));
  ctx.save(); ctx.globalAlpha = up;
  RR(ctx, W - 56 - uw, 54 + (1 - up) * 30, uw, uh, 33); ctx.fillStyle = C.ink; ctx.fill();
  T(ctx, ASK, W - 56 - uw + 32, 54 + (1 - up) * 30 + 42, { font: F.sans(24, 500), fill: C.white });
  ctx.restore();
  // صورة المساعد السوداء تهبط على اليسار
  const av = LD(seg(t, 0.12, 0.28));
  const ax = 86, ay = 188;
  if (av > 0) { circle(ctx, ax, ay, 30 * av, C.ink); spark(ctx, ax, ay, 14 * av, C.white); }
  // الفقاعة الصغيرة بثلاث نقاط تقفز موجيًا ثم تكبر إلى بطاقة الرد عند 0.4
  const g = GL(seg(t, 0.4, 0.58));
  const bx = 134, by0 = 158, bw0 = 128, bh0 = 64, bx1 = 134, by1 = 142, bw1 = 660, bh1 = 362;
  const x = lerp(bx, bx1, g), y = lerp(by0, by1, g), w = lerp(bw0, bw1, g), h = lerp(bh0, bh1, g), r = lerp(32, 34, g);
  const bub = EO(seg(t, 0.2, 0.32));
  if (bub > 0) {
    ctx.save(); ctx.globalAlpha = bub;
    SH(ctx, 'rgba(11,11,12,0.14)', 26, 0, 10); RR(ctx, x, y, w, h, r); ctx.fillStyle = C.white; ctx.fill(); noSH(ctx);
    if (t < 0.5) {
      const fade = 1 - seg(t, 0.4, 0.48);
      for (let k = 0; k < 3; k++) circle(ctx, bx + 36 + k * 28, by0 + bh0 / 2 - Math.max(0, Math.sin(t * 40 - k * 1.1)) * 8, 7 * fade, C.grey);
    }
    ctx.restore();
  }
  const c = EO(seg(t, 0.52, 0.68));
  if (c > 0) {
    ctx.save(); ctx.globalAlpha = c;
    T(ctx, REPLY, bx1 + 36, by1 + 66, { font: F.sans(32, 700), fill: C.ink });
    const vx = bx1 + 36, vy = by1 + 94, vw = bw1 - 72, vh = 176;
    RR(ctx, vx, vy, vw, vh, 22); const gr = ctx.createLinearGradient(vx, vy, vx + vw, vy + vh); gr.addColorStop(0, C.peach); gr.addColorStop(1, mixHex(C.peach, C.orange, 0.3)); ctx.fillStyle = gr; ctx.fill();
    circle(ctx, vx + vw / 2, vy + vh / 2, 36, C.orange);
    ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(vx + vw / 2 - 10, vy + vh / 2 - 17); ctx.lineTo(vx + vw / 2 + 18, vy + vh / 2); ctx.lineTo(vx + vw / 2 - 10, vy + vh / 2 + 17); ctx.closePath(); ctx.fill();
    RR(ctx, vx, vy + vh + 24, vw, 8, 4); ctx.fillStyle = rgba(C.ink, 0.1); ctx.fill();
    RR(ctx, vx, vy + vh + 24, vw * 0.4 * seg(t, 0.6, 1), 8, 4); ctx.fillStyle = C.orange; ctx.fill();
    CAPS(ctx, CAPTION, vx, vy + vh + 64, { fill: C.grey, size: 13, ls: 2.4 });
    ctx.restore();
  }
}
