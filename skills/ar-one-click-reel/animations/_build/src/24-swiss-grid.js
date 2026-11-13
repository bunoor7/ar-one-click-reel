/*META {"title":"Swiss Grid","page":"#F6F4F1"}*/
// الرقم والأسطر والتسميات: غيّرها هنا
const BIG = '50', LINES = ['Fifty animations.', 'One file.', 'Made in Claude.'];
const TOP = ['BU NASSER', 'MOTION SYSTEM', 'VOL. 01 · 2026'], BOTTOM = ['GRID 6 × 4', 'TYPE 470 PT', 'FIG. 24'];
const M = 56, YT = 82, YB = 528;

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  // قاعدتان ثقيلتان تُرسمان عرضيًا، وسبعة خطوط رفيعة تنمو نحو الأسفل
  const rule = EO(seg(t, 0, 0.2));
  ctx.fillStyle = C.ink; ctx.fillRect(M, YT - 3, (W - 2 * M) * rule, 6); ctx.fillRect(M, YB - 3, (W - 2 * M) * rule, 6);
  for (let i = 0; i < 7; i++) {
    const x = M + (i * (W - 2 * M)) / 6, g = EO(seg(t, 0.06 + i * 0.02, 0.32 + i * 0.02));
    ctx.fillStyle = rgba(C.ink, 0.18); ctx.fillRect(x - 0.5, YT, 1, (YB - YT) * g);
  }
  // الأرقام الضخمة تصعد من خلف قناع
  const fs = 470, base = YB - 22;
  ctx.save(); ctx.beginPath(); ctx.rect(0, YT + 6, W, YB - YT - 12); ctx.clip();
  ctx.font = F.sans(fs, 700); ctx.fillStyle = C.ink; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  let px = M - 10; const ls = -0.06 * fs;
  [...BIG].forEach((ch, k) => { const p = EO(seg(t, 0.12 + k * 0.05, 0.5 + k * 0.05)); ctx.fillText(ch, px, base + (1 - p) * fs * 0.95); px += ctx.measureText(ch).width + ls; });
  ctx.restore();
  // الدائرة البرتقالية تهبط أعلى اليمين
  const c = LD(seg(t, 0.3, 0.5)); circle(ctx, W - M - 66, YT + 84, 48 * c, C.orange);
  // ثلاثة أسطر تظهر واحدًا بعد الآخر ثم شريط أسود
  LINES.forEach((s, i) => { const a = EO(seg(t, 0.5 + i * 0.07, 0.62 + i * 0.07)); T(ctx, s, 600, 316 + i * 46 + (1 - a) * 16, { font: F.sans(30, 500), fill: C.ink, alpha: a }); });
  const bar = EO(seg(t, 0.74, 0.88)); ctx.fillStyle = C.ink; ctx.fillRect(600, 458, 232 * bar, 9);
  // التسميات الصغيرة
  const la = EO(seg(t, 0.62, 0.8));
  [[TOP, YT - 22], [BOTTOM, YB + 36]].forEach(([arr, y]) => {
    CAPS(ctx, arr[0], M, y, { fill: C.ink, alpha: 0.7 * la, size: 12, ls: 2.4 });
    CAPS(ctx, arr[1], W / 2, y, { fill: C.ink, alpha: 0.7 * la, size: 12, ls: 2.4, align: 'center' });
    CAPS(ctx, arr[2], W - M, y, { fill: C.ink, alpha: 0.7 * la, size: 12, ls: 2.4, align: 'right' });
  });
}
