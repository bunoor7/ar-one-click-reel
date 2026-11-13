/*META {"title":"Kinetic Type","page":"#FF5A1F"}*/
// الكلمات الثلاث: غيّرها هنا
const WORDS = ['Make', 'it', 'move'];
const SCHEMES = [
  { bg: C.orange, fg: C.ink, label: C.ink },
  { bg: C.ink, fg: C.bone, label: C.bone },
  { bg: C.bone, fg: C.ink, label: C.ink },
];
const SIZE = 318, TRACK = -0.045; // تباعد ضيّق (نسبة من الحجم)

function layout(ctx, word, size) {
  ctx.font = F.sans(size, 700);
  const ls = TRACK * size;
  const ws = [...word].map((ch) => ctx.measureText(ch).width);
  const total = ws.reduce((a, b) => a + b, 0) + ls * (ws.length - 1);
  return { ws, ls, total };
}

function draw(ctx, t) {
  const i = Math.min(2, Math.floor(t * 3));
  const lt = t * 3 - i; // الزمن داخل الكلمة 0..1
  const sc = SCHEMES[i];
  fillBG(ctx, sc.bg);

  // الحجم يتقلّص تلقائيًا إذا ضاقت اللوحة (وخط احتياطي أعرض)
  const dotR = 0.1;
  const reserve = i === 2 ? SIZE * dotR * 2 + 34 : 0;
  let size = SIZE;
  let L = layout(ctx, WORDS[i], size);
  if (L.total + reserve > W - 70) { size = size * (W - 70) / (L.total + reserve); L = layout(ctx, WORDS[i], size); }

  const baseY = H / 2 + size * 0.36;
  const x0 = W / 2 - (L.total + reserve) / 2;
  const settle = lerp(1.08, 1, EO(seg(lt, 0, 0.6)));

  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(settle, settle); ctx.translate(-W / 2, -H / 2);
  // القناع: ما تحت خط الأساس لا يظهر، فتبدو الحروف طالعة من تحته
  ctx.beginPath(); ctx.rect(0, baseY - size * 0.95, W, size * 0.95 + size * 0.04); ctx.clip();
  ctx.font = F.sans(size, 700); ctx.fillStyle = sc.fg; ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  let px = x0;
  [...WORDS[i]].forEach((ch, k) => {
    const p = EO(seg(lt, k * 0.07, k * 0.07 + 0.5));
    ctx.fillText(ch, px, baseY + (1 - p) * size * 1.05);
    px += L.ws[k] + L.ls;
  });
  ctx.restore();

  // النقطة البرتقالية بعد «move»: تكبر وتهبط
  if (i === 2) {
    const k = LD(seg(lt, 0.42, 0.78));
    const r = size * dotR * k;
    const dx = x0 + L.total + size * 0.07 + size * dotR;
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(settle, settle); ctx.translate(-W / 2, -H / 2);
    circle(ctx, dx, baseY - size * dotR * k * 0.0 - size * dotR, r, C.orange);
    ctx.restore();
  }
  CAPS(ctx, 'WORD 0' + (i + 1), 40, H - 36, { fill: sc.label, alpha: 0.75 });
}
