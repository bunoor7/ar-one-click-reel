/*META {"title":"Torus Wire","page":"#F6F4F1"}*/
const MAJ = 176, MIN = 72, NT = 30, NP = 10;
const tor = (th, ph) => { const q = MAJ + MIN * Math.cos(ph); return [q * Math.cos(th), MIN * Math.sin(ph), q * Math.sin(th)]; };

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  dots(ctx, C.ink, 24, 1.2, 0.16);
  const sc = lerp(0.86, 1, EO(seg(t, 0, 0.5)));
  const a = 0.5 + t * deg(100), b = deg(62) + t * deg(55);
  const xf = (p) => rotX(rotY(p, a), b);
  const P = (q) => proj(q, W / 2, H / 2, 1300, sc);
  const ZM = MAJ + MIN;
  const shade = (z) => lerp(0.92, 0.07, clamp((z / ZM + 1) / 2));

  const segs = [];
  for (let i = 0; i < NT; i++) {
    const th = (i / NT) * Math.PI * 2;
    let prev = xf(tor(th, 0));
    for (let k = 1; k <= 48; k++) { const cur = xf(tor(th, (k / 48) * Math.PI * 2)); segs.push([prev, cur, (prev[2] + cur[2]) / 2]); prev = cur; }
  }
  for (let j = 0; j < NP; j++) {
    const ph = (j / NP) * Math.PI * 2;
    let prev = xf(tor(0, ph));
    for (let k = 1; k <= 96; k++) { const cur = xf(tor((k / 96) * Math.PI * 2, ph)); segs.push([prev, cur, (prev[2] + cur[2]) / 2]); prev = cur; }
  }
  segs.sort((x, y) => y[2] - x[2]);
  ctx.lineCap = 'round';
  for (const [A, B, z] of segs) {
    const pa = P(A), pb = P(B), al = shade(z);
    ctx.strokeStyle = rgba(C.ink, al); ctx.lineWidth = lerp(0.6, 1.3, al);
    ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
  }

  // حلقة مقطع برتقالية سميكة تدور حول الدونات وتحمل نقطة متوهجة
  const tho = t * Math.PI * 2 + 0.6;
  let prev = xf(tor(tho, 0));
  for (let k = 1; k <= 72; k++) {
    const cur = xf(tor(tho, (k / 72) * Math.PI * 2)), z = (prev[2] + cur[2]) / 2;
    const pa = P(prev), pb = P(cur);
    ctx.strokeStyle = rgba(C.orange, lerp(1, 0.28, clamp((z / ZM + 1) / 2))); ctx.lineWidth = 4.2;
    ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    prev = cur;
  }
  const d = xf(tor(tho, t * Math.PI * 4 + 1)), pd = P(d);
  glow(ctx, pd.x, pd.y, 30, C.orange, 0.65);
  circle(ctx, pd.x, pd.y, 6.5 * pd.s, C.orange);
  circle(ctx, pd.x, pd.y, 2.6 * pd.s, C.white);
}
