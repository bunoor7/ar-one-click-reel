/*META {"title":"Iso City","page":"#FFFFFF"}*/
const U = 76, CZ = Math.cos(Math.PI / 6), SZ = Math.sin(Math.PI / 6);
const OX = W / 2, OY = H / 2 + 62;
const iso = (x, y, z) => [OX + (x - y) * CZ * U, OY + (x + y - 4) * SZ * U - z];
const HEIGHTS = [[60, 96, 52, 120, 70], [100, 74, 138, 64, 110], [58, 150, 230, 92, 66], [118, 60, 104, 142, 84], [72, 112, 66, 90, 128]];
const INK = new Set(['1,3', '3,1', '4,4']);
const TONES = {
  w: ['#FFFFFF', '#E3E1DD', '#C5C2BC'],
  o: [mixHex(C.orange, '#FFFFFF', 0.22), C.orange, mixHex(C.orange, '#000000', 0.32)],
  k: ['#46464C', '#1B1B1E', '#0B0B0C'],
};

function poly(ctx, pts, fill, line) {
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = line; ctx.lineWidth = 1.1; ctx.lineJoin = 'round'; ctx.stroke();
}

function draw(ctx, t) {
  fillBG(ctx, C.white);
  // لوح الأرض الباهت
  const e = 0.62;
  poly(ctx, [iso(-e, -e, 0), iso(4 + e, -e, 0), iso(4 + e, 4 + e, 0), iso(-e, 4 + e, 0)], C.bone, rgba(C.ink, 0.25));
  const plate = iso(-e, -e, 0); void plate;
  ctx.strokeStyle = rgba(C.ink, 0.07); ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const a = iso(i, -e, 0), b = iso(i, 4 + e, 0), c = iso(-e, i, 0), d = iso(4 + e, i, 0);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(c[0], c[1]); ctx.lineTo(d[0], d[1]); ctx.stroke();
  }
  const half = 0.4;
  // من الزاوية الخلفية إلى الأمام: كل قطر يبدأ بعد 0.045
  for (let d = 0; d <= 8; d++) for (let i = 0; i < 5; i++) {
    const j = d - i; if (j < 0 || j > 4) continue;
    const rise = EO(seg(t, 0.03 + d * 0.045, 0.03 + d * 0.045 + 0.5));
    const h = HEIGHTS[i][j] * rise; if (h < 0.5) continue;
    const kind = i === 2 && j === 2 ? 'o' : INK.has(i + ',' + j) ? 'k' : 'w';
    const [top, left, right] = TONES[kind];
    const line = kind === 'k' ? 'rgba(255,255,255,0.14)' : C.ink;
    const x0 = i - half, x1 = i + half, y0 = j - half, y1 = j + half;
    poly(ctx, [iso(x0, y1, 0), iso(x1, y1, 0), iso(x1, y1, h), iso(x0, y1, h)], left, line);   // الواجهة اليسرى
    poly(ctx, [iso(x1, y0, 0), iso(x1, y1, 0), iso(x1, y1, h), iso(x1, y0, h)], right, line);  // الواجهة اليمنى
    poly(ctx, [iso(x0, y0, h), iso(x1, y0, h), iso(x1, y1, h), iso(x0, y1, h)], top, line);    // السطح
  }
}
