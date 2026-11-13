/*META {"title":"Shape Morph","page":"#FF5A1F"}*/
// الأشكال الأربعة: كلٌّ منها نصف قطر لكل زاوية (200 نقطة)، فيمتزج الإطار ولا ينقطع
const NPT = 200, NAMES = ['CIRCLE', 'SQUARE', 'TRIANGLE', 'BLOOM'];
const ang = (j) => (j / NPT) * Math.PI * 2;
function smooth(arr, w) {
  return arr.map((_, j) => { let s = 0; for (let k = -w; k <= w; k++) s += arr[(j + k + NPT) % NPT]; return s / (2 * w + 1); });
}
const FORMS = [
  Array.from({ length: NPT }, () => 150),
  smooth(Array.from({ length: NPT }, (_, j) => { const a = ang(j), n = 6; return 140 / Math.pow(Math.pow(Math.abs(Math.cos(a)), n) + Math.pow(Math.abs(Math.sin(a)), n), 1 / n); }), 2),
  smooth(Array.from({ length: NPT }, (_, j) => { const a = ang(j), seg3 = (Math.PI * 2) / 3; const d = ((a % seg3) + seg3) % seg3 - seg3 / 2; return 78 / Math.cos(d) * 1.0 + 0; }).map((r) => r * 1.0), 6),
  Array.from({ length: NPT }, (_, j) => 118 + 54 * Math.cos(8 * ang(j))),
];

function draw(ctx, t) {
  fillBG(ctx, C.orange);
  // ثلاث انتقالات، كل واحد نحو ربع الزمن مع استراحة قصيرة
  const starts = [0.05, 0.36, 0.67];
  let radii = FORMS[0], active = 0;
  for (let k = 0; k < 3; k++) {
    const m = GL(seg(t, starts[k], starts[k] + 0.24));
    if (m > 0) { radii = FORMS[k].map((r, j) => lerp(r, FORMS[k + 1][j], m)); active = m > 0.5 ? k + 1 : k; }
  }
  const cx = W / 2, cy = H / 2 - 36;
  ctx.beginPath();
  for (let j = 0; j < NPT; j++) { const a = ang(j) - Math.PI / 2; const x = cx + Math.cos(a) * radii[j], y = cy + Math.sin(a) * radii[j]; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
  // أربع نقاط تبيّن الشكل النشط واسمه
  for (let i = 0; i < 4; i++) circle(ctx, W / 2 + (i - 1.5) * 26, H - 108, i === active ? 6 : 4.2, i === active ? C.ink : rgba(C.ink, 0.35));
  CAPS(ctx, NAMES[active], W / 2, H - 66, { align: 'center', fill: C.ink, size: 15, ls: 4.5 });
}
