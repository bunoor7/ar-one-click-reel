/*META {"title":"Donut Ring","page":"#0B0B0C"}*/
// الرقم والتسمية: غيّرهما هنا
const TARGET = 86, LABEL = 'RENDERED';
const RAD = 176, TW = 38;

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const cx = W / 2, cy = H / 2 - 4;
  const p = GL(seg(t, 0.04, 0.8)), frac = (TARGET / 100) * p;
  const a0 = -Math.PI / 2, a1 = a0 + frac * Math.PI * 2;

  // علامات التدريج الخارجية: 72 علامة تضيء حين يمر بها القوس
  for (let i = 0; i < 72; i++) {
    const a = a0 + (i / 72) * Math.PI * 2, on = i / 72 <= frac && frac > 0;
    const r0 = RAD + TW / 2 + 16, r1 = r0 + (i % 6 === 0 ? 14 : 9);
    ctx.strokeStyle = on ? C.orange : rgba(C.bone, 0.16); ctx.lineWidth = on ? 2.6 : 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
  }
  // المسار الداكن
  ctx.lineWidth = TW; ctx.strokeStyle = C.dark; ctx.beginPath(); ctx.arc(cx, cy, RAD, 0, Math.PI * 2); ctx.stroke();
  // القوس البرتقالي بنهايات مدوّرة وتوهج ناعم
  if (frac > 0.002) {
    ctx.save(); SH(ctx, rgba(C.orange, 0.7), 26); ctx.lineCap = 'round'; ctx.lineWidth = TW; ctx.strokeStyle = C.orange;
    ctx.beginPath(); ctx.arc(cx, cy, RAD, a0, a1); ctx.stroke(); ctx.restore();
    circle(ctx, cx + Math.cos(a1) * RAD, cy + Math.sin(a1) * RAD, 8, C.white);
  }
  // الرقم في الوسط مع علامة %
  const n = Math.round(TARGET * p);
  ctx.font = F.sans(160, 700);
  const slot = ctx.measureText('0').width, numW = String(TARGET).length * slot, pw = 78;
  const x0 = cx - (numW + pw) / 2 + 8;
  NUM(ctx, String(n), x0 + numW, cy + 36, { font: F.sans(160, 700), fill: C.bone, align: 'right', slot });
  T(ctx, '%', x0 + numW + 8, cy + 36, { font: F.sans(80, 700), fill: C.orange });
  CAPS(ctx, LABEL, cx, cy + 82, { align: 'center', fill: C.bone, alpha: 0.65, size: 14, ls: 3.4 });
}
