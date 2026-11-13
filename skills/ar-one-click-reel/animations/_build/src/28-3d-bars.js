/*META {"title":"3D Bars","page":"#FFFFFF","libs":["solid"]}*/
const NXB = 5, NZB = 4, PITCH = 74, FOOT = 27;
const HB = [[70, 120, 90, 150, 100], [112, 62, 176, 80, 132], [92, 142, 102, 196, 72], [60, 104, 132, 92, 160]];
const INKB = new Set(['0,1', '2,2', '3,4']);
const TALL = '2,3'; // الأعلى

function draw(ctx, t) {
  fillBG(ctx, C.white);
  const a = deg(-18) + t * deg(30), b = deg(27);
  const xf = (p) => rotX(rotY(p, a), b);
  const P = (q) => proj(q, W / 2, H / 2 + 52, 1500, 1.12);
  const gx = (i) => (i - (NXB - 1) / 2) * PITCH, gz = (j) => (j - (NZB - 1) / 2) * PITCH;

  // لوح الأرض الباهت مع خطوط شبكة خفيفة
  const ex = (NXB * PITCH) / 2 + 22, ez = (NZB * PITCH) / 2 + 22;
  const corners = [[-ex, 0, -ez], [ex, 0, -ez], [ex, 0, ez], [-ex, 0, ez]].map((p) => P(xf(p)));
  ctx.beginPath(); corners.forEach((c, i) => (i ? ctx.lineTo(c.x, c.y) : ctx.moveTo(c.x, c.y))); ctx.closePath();
  ctx.fillStyle = C.bone; ctx.fill(); ctx.strokeStyle = rgba(C.ink, 0.22); ctx.lineWidth = 1; ctx.stroke();
  ctx.strokeStyle = rgba(C.ink, 0.07);
  for (let i = 0; i <= NXB; i++) { const x = (i - NXB / 2) * PITCH, A = P(xf([x, 0, -ez])), B = P(xf([x, 0, ez])); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
  for (let j = 0; j <= NZB; j++) { const z = (j - NZB / 2) * PITCH, A = P(xf([-ex, 0, z])), B = P(xf([ex, 0, z])); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }
  floorShadow(ctx, W / 2, H / 2 + 218, 330, 46, 0.1);

  const boxes = []; let tallTop = null;
  for (let j = 0; j < NZB; j++) for (let i = 0; i < NXB; i++) {
    const rise = EO(seg(t, 0.02 + (i + j) * 0.05, 0.02 + (i + j) * 0.05 + 0.38));
    const h = HB[j][i] * rise; if (h < 0.5) continue;
    const key = j + ',' + i;
    const pal = key === TALL ? { dark: mixHex(C.orange, '#000000', 0.4), light: mixHex(C.orange, '#FFFFFF', 0.25), line: C.ink }
      : INKB.has(key) ? { dark: '#050506', light: '#4A4A50', line: '#26262A' } : { dark: '#B9B6B0', light: '#FFFFFF', line: C.ink };
    boxes.push(Object.assign({ c: [gx(i), -h / 2, gz(j)], h: [FOOT, h / 2, FOOT] }, pal));
    if (key === TALL) tallTop = P(xf([gx(i), -h, gz(j)]));
  }
  drawBoxes(ctx, boxes, xf, P, 1.1);

  // شارة +62% تهبط فوق أعلى عمود عند t 0.66
  const k = LD(seg(t, 0.66, 0.84));
  if (k > 0 && tallTop) {
    const w = 96, h = 40, x = tallTop.x, y = tallTop.y - 48 - (1 - k) * 22;
    ctx.save(); ctx.globalAlpha = clamp(k * 1.6); ctx.translate(x, y); ctx.scale(k, k);
    SH(ctx, 'rgba(0,0,0,0.25)', 14, 0, 6); RR(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = C.ink; ctx.fill(); noSH(ctx);
    T(ctx, '+62%', 0, 7, { font: F.sans(21, 700), fill: C.white, align: 'center' });
    ctx.restore();
  }
}
