/*META {"title":"Flow Line","page":"#FFFFFF"}*/
// الخطوات الثلاث: غيّرها هنا
const STEPS = [['01.', 'Brief'], ['02.', 'Design'], ['03.', 'Ship']];
const CW = 236, CH = 132;
const POS = [[84, 86], [338, 232], [592, 378]];
const FILLER = [[338, 86], [592, 86], [592, 232], [84, 232], [84, 378], [338, 378]];
const L1 = [[POS[0][0] + CW, POS[0][1] + CH / 2], [POS[1][0] + CW / 2, POS[0][1] + CH / 2], [POS[1][0] + CW / 2, POS[1][1]]];
const L2 = [[POS[1][0] + CW, POS[1][1] + CH / 2], [POS[2][0] + CW / 2, POS[1][1] + CH / 2], [POS[2][0] + CW / 2, POS[2][1]]];

// خط بزوايا مدوّرة
function rounded(pts, r = 26, per = 10) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const d1 = Math.hypot(b[0] - a[0], b[1] - a[1]), d2 = Math.hypot(c[0] - b[0], c[1] - b[1]), rr = Math.min(r, d1 / 2, d2 / 2);
    const p1 = [b[0] + (a[0] - b[0]) / d1 * rr, b[1] + (a[1] - b[1]) / d1 * rr], p2 = [b[0] + (c[0] - b[0]) / d2 * rr, b[1] + (c[1] - b[1]) / d2 * rr];
    out.push(p1);
    for (let k = 1; k < per; k++) { const u = k / per; out.push([(1 - u) * (1 - u) * p1[0] + 2 * (1 - u) * u * b[0] + u * u * p2[0], (1 - u) * (1 - u) * p1[1] + 2 * (1 - u) * u * b[1] + u * u * p2[1]]); }
    out.push(p2);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const R1 = rounded(L1), R2 = rounded(L2);

function draw(ctx, t) {
  fillBG(ctx, C.white);
  FILLER.forEach(([x, y], i) => { const a = EO(seg(t, 0.0 + i * 0.01, 0.2)); ctx.globalAlpha = a; RR(ctx, x, y, CW, CH, 28); ctx.setLineDash([8, 8]); ctx.strokeStyle = rgba(C.ink, 0.16); ctx.lineWidth = 1.8; ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; });
  const p1 = GL(seg(t, 0.3, 0.52)), p2 = GL(seg(t, 0.58, 0.8));
  const state = [p1 > 0 ? 'done' : 'active', p2 > 0 ? 'done' : p1 > 0 ? 'active' : 'idle', p2 >= 1 ? 'solid' : p2 > 0 ? 'active' : 'idle'];
  STEPS.forEach(([num, name], i) => {
    const land = LD(seg(t, 0.02 + i * 0.08, 0.2 + i * 0.08));
    if (land <= 0) return;
    const [x, y] = POS[i], st = state[i];
    ctx.save(); ctx.translate(x + CW / 2, y + CH / 2); ctx.scale(lerp(0.9, 1, land), lerp(0.9, 1, land)); ctx.globalAlpha = clamp(land * 1.5); ctx.translate(-(x + CW / 2), -(y + CH / 2) + (1 - land) * -24);
    SH(ctx, 'rgba(11,11,12,0.14)', 28, 0, 12); RR(ctx, x, y, CW, CH, 28); ctx.fillStyle = st === 'solid' ? C.orange : C.white; ctx.fill(); noSH(ctx);
    if (st === 'active') { RR(ctx, x, y, CW, CH, 28); ctx.strokeStyle = C.orange; ctx.lineWidth = 3; ctx.stroke(); }
    else if (st !== 'solid') { RR(ctx, x + 0.5, y + 0.5, CW - 1, CH - 1, 28); ctx.strokeStyle = rgba(C.ink, 0.08); ctx.lineWidth = 1; ctx.stroke(); }
    const fg = st === 'solid' ? C.white : C.ink;
    T(ctx, num, x + 26, y + 46, { font: F.serif(36), fill: st === 'solid' ? C.white : C.orange });
    T(ctx, name, x + 26, y + 88, { font: F.sans(30, 700), fill: fg });
    const label = st === 'done' ? 'DONE' : st === 'idle' ? 'PENDING' : st === 'solid' ? 'DONE' : 'ACTIVE';
    CAPS(ctx, label, x + 26, y + 114, { fill: st === 'solid' ? C.white : st === 'active' ? C.orange : C.grey, size: 12, ls: 2.6 });
    if (st === 'done' || st === 'solid') {
      ctx.strokeStyle = st === 'solid' ? C.white : C.orange; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      strokePoly(ctx, [[x + CW - 52, y + 32], [x + CW - 44, y + 40], [x + CW - 30, y + 24]]);
    }
    ctx.restore();
  });
  // خط الحبر يربط البطاقات ويقوده نقطة برتقالية متوهجة
  [[R1, p1], [R2, p2]].forEach(([poly, p]) => {
    if (p <= 0) return;
    const { pts, head } = pathUpTo(poly, p);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 3.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; strokePoly(ctx, pts);
    if (p < 1) { glow(ctx, head[0], head[1], 30, C.orange, 0.6); circle(ctx, head[0], head[1], 7, C.orange); circle(ctx, head[0], head[1], 2.8, C.white); }
  });
}
