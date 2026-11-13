/*META {"title":"Helix","page":"#F6F4F1"}*/
const PAIRS = 38, RAD = 74, LEN = 700;

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  dots(ctx, C.ink, 24, 1.2, 0.15);
  const len = lerp(54, LEN, EO(seg(t, 0, 0.55)));
  const spin = t * deg(240);
  const xf = (p) => rotX(rotZ(p, deg(-27)), deg(16));
  const items = [];
  for (let i = 0; i < PAIRS; i++) {
    const s = (i / (PAIRS - 1) - 0.5) * len, ph = i * 0.5 + spin;
    const A = xf([s, RAD * Math.cos(ph), RAD * Math.sin(ph)]);
    const B = xf([s, RAD * Math.cos(ph + Math.PI), RAD * Math.sin(ph + Math.PI)]);
    items.push({ k: 'rung', A, B, z: (A[2] + B[2]) / 2 });
    items.push({ k: 'ball', p: A, col: C.ink, z: A[2] });
    items.push({ k: 'ball', p: B, col: C.orange, z: B[2] });
  }
  items.sort((x, y) => y.z - x.z);
  const P = (q) => proj(q, W / 2, H / 2, 900);
  for (const it of items) {
    if (it.k === 'rung') {
      const pa = P(it.A), pb = P(it.B);
      ctx.strokeStyle = rgba(C.grey, lerp(0.7, 0.2, clamp((it.z / RAD + 1) / 2))); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    } else {
      const p = P(it.p), nz = clamp((it.z / RAD + 1.2) / 2.4); // 0 قريب .. 1 بعيد
      const near = 1 - nz;
      ctx.globalAlpha = lerp(0.3, 1, near);
      circle(ctx, p.x, p.y, 11.5 * p.s * lerp(0.6, 1.15, near), mixHex(it.col, C.bone, nz * 0.55));
      ctx.globalAlpha = lerp(0.1, 0.55, near);
      circle(ctx, p.x - 3 * p.s, p.y - 3.5 * p.s, 3.2 * p.s, '#FFFFFF');
      ctx.globalAlpha = 1;
    }
  }
}
