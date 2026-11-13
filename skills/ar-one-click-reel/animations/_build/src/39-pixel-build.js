/*META {"title":"Pixel Build","page":"#FFFFFF"}*/
// الرقم أو الكلمة: غيّرهما هنا
const TEXT = '50', CELL = 15, SQ = 12.2, FSIZE = 400;
let GRID = null;

// نرسم النص بخط عريض على canvas مخفي ونقرأ بكسلاته لنعرف الخانات التابعة للأرقام
function buildGrid() {
  if (GRID) return GRID;
  const cv = document.createElement('canvas'); cv.width = 700; cv.height = 460;
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#000'; g.font = F.sans(FSIZE, 700); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  const tw = g.measureText(TEXT).width;
  const bx = Math.round((cv.width - tw) / 2), by = 380;
  g.fillText(TEXT, bx, by);
  const data = g.getImageData(0, 0, cv.width, cv.height).data;
  const cells = [];
  let minC = 1e9, maxC = -1e9, minR = 1e9, maxR = -1e9;
  for (let r = 0; r < Math.floor(cv.height / CELL); r++) for (let c = 0; c < Math.floor(cv.width / CELL); c++) {
    const px = Math.round(c * CELL + CELL / 2), py = Math.round(r * CELL + CELL / 2);
    if (data[(py * cv.width + px) * 4 + 3] > 140) { cells.push([c, r]); minC = Math.min(minC, c); maxC = Math.max(maxC, c); minR = Math.min(minR, r); maxR = Math.max(maxR, r); }
  }
  // كتلة صغيرة من المربعات البرتقالية تصنع نقطة النهاية بعد الأرقام
  const stop = [];
  const sc = maxC + 3, sr = maxR - 2;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) stop.push([sc + i, sr + j]);
  const maxAll = sc + 2;
  const rnd = rng(50);
  const all = cells.map(([c, r]) => ({ c, r, o: false })).concat(stop.map(([c, r]) => ({ c, r, o: true })));
  const w = (maxAll - minC + 1) * CELL, h = (maxR - minR + 1) * CELL;
  all.forEach((q) => {
    q.x = W / 2 - w / 2 + (q.c - minC) * CELL + CELL / 2;
    q.y = H / 2 - h / 2 + (q.r - minR) * CELL + CELL / 2;
    const ang = rnd() * Math.PI * 2, dist = 120 + rnd() * 260;
    q.dx = Math.cos(ang) * dist; q.dy = Math.sin(ang) * dist; q.rot = (rnd() - 0.5) * 6.3;
    q.delay = 0.03 + ((q.x - (W / 2 - w / 2)) / w) * 0.4 + rnd() * 0.07;
  });
  const res = { all };
  if (FONTS_READY) GRID = res;
  return res;
}

function draw(ctx, t) {
  fillBG(ctx, C.white);
  const { all } = buildGrid();
  for (const q of all) {
    const p = GL(seg(t, q.delay, q.delay + 0.3));
    if (p <= 0) continue;
    ctx.save();
    ctx.translate(q.x + q.dx * (1 - p), q.y + q.dy * (1 - p));
    ctx.rotate(q.rot * (1 - p));
    ctx.globalAlpha = p;
    const s = lerp(0.4, 1, p);
    ctx.scale(s, s);
    RR(ctx, -SQ / 2, -SQ / 2, SQ, SQ, 3.2); ctx.fillStyle = q.o ? C.orange : C.ink; ctx.fill();
    ctx.restore();
  }
}
