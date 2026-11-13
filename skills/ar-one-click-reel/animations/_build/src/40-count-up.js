/*META {"title":"Count Up","page":"#FFFFFF"}*/
// الرقم والتسمية: غيّرهما هنا (استعمل رقمًا حقيقيًا من facts.md)
const TARGET = 500, LABEL = 'CLIENTS SERVED', TAIL = 'and counting';
const FS = 300, BASE = 372;

function draw(ctx, t) {
  fillBG(ctx, C.white);
  const n = Math.round(TARGET * EO(seg(t, 0.04, 0.74)));
  const digits = String(TARGET).length;
  ctx.font = F.sans(FS, 700);
  const slot = ctx.measureText('0').width, totalW = digits * slot;
  const x0 = W / 2 - totalW / 2 - 24;
  // الخانات ثابتة العرض والأصفار الزائدة لا تُرسم
  const s = String(n);
  const shown = s.padStart(digits, ' ');
  ctx.fillStyle = C.ink; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
  [...shown].forEach((ch, i) => { if (ch !== ' ') ctx.fillText(ch, x0 + i * slot + slot / 2, BASE); });

  // علامة + برتقالية تهبط أعلى يمين الرقم
  const k = LD(seg(t, 0.74, 0.9));
  if (k > 0) {
    ctx.save(); ctx.translate(x0 + totalW + 40, BASE - FS * 0.52); ctx.scale(k, k); ctx.globalAlpha = clamp(k * 1.5);
    T(ctx, '+', 0, 0, { font: F.sans(150, 700), fill: C.orange, align: 'center', base: 'middle' });
    ctx.restore();
  }
  CAPS(ctx, LABEL, W / 2, BASE + 52, { align: 'center', fill: C.ink, alpha: 0.7, size: 15, ls: 4 });
  const f = EO(seg(t, 0.8, 1));
  T(ctx, TAIL, W / 2, BASE + 112 + (1 - f) * 22, { font: F.serif(46), fill: C.orange, align: 'center', alpha: f });
}
