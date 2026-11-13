/*META {"title":"Notifications","page":"#F6F4F1"}*/
// الرسائل الثلاث: غيّرها هنا (الأقدم أولًا)
const NOTES = [
  { title: 'New prompt saved', sub: 'blueprint-draw.md', time: '1H', icon: 'spark', at: 0.03 },
  { title: 'Zee left a comment', sub: 'Slow the hero reveal', time: '2M', icon: 'dot', at: 0.3 },
  { title: 'Render complete', sub: '50 clips exported', time: 'NOW', icon: 'tick', at: 0.57 },
];
const CW = 620, CH = 120, X = (W - CW) / 2, TOP = 112, STEP = 140;

function icon(ctx, kind, x, y, tk) {
  ctx.save(); ctx.translate(x, y);
  RR(ctx, -36, -36, 72, 72, 22); ctx.fillStyle = kind === 'tick' ? C.orange : C.ink; ctx.fill();
  ctx.strokeStyle = C.white; ctx.fillStyle = C.white; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (kind === 'spark') { ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k * Math.PI / 4, r = k % 2 ? 6 : 18; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
  else if (kind === 'dot') { circle(ctx, 0, 0, 10, C.white); }
  else { const up = pathUpTo([[-14, 1], [-4, 12], [16, -12]], tk); strokePoly(ctx, up.pts); }
  ctx.restore();
}

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  NOTES.forEach((n, i) => {
    const p = EO(seg(t, n.at, n.at + 0.2));
    if (p <= 0) return;
    let shift = 0;
    for (let j = i + 1; j < NOTES.length; j++) shift += EO(seg(t, NOTES[j].at, NOTES[j].at + 0.2)) * STEP;
    const y = TOP + shift - (1 - p) * 44;
    ctx.save(); ctx.globalAlpha = p; ctx.translate(W / 2, y + CH / 2); const s = lerp(0.96, 1, p); ctx.scale(s, s); ctx.translate(-W / 2, -(y + CH / 2));
    SH(ctx, 'rgba(11,11,12,0.16)', 34, 0, 14); RR(ctx, X, y, CW, CH, 32); ctx.fillStyle = C.white; ctx.fill(); noSH(ctx);
    icon(ctx, n.icon, X + 62, y + CH / 2, EO(seg(t, n.at + 0.1, n.at + 0.3)));
    T(ctx, n.title, X + 116, y + 52, { font: F.sans(27, 700), fill: C.ink });
    T(ctx, n.sub, X + 116, y + 86, { font: F.sans(20, 400), fill: C.grey });
    T(ctx, n.time, X + CW - 38, y + 52, { font: F.mono(14, 500), fill: C.grey, align: 'right', ls: 1.4 });
    if (n.icon === 'tick') { const d = LD(seg(t, n.at + 0.16, n.at + 0.3)); circle(ctx, X + CW - 46, y + 86, 8 * d, C.orange); }
    ctx.restore();
  });
}
