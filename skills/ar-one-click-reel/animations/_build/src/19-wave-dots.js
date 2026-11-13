/*META {"title":"Wave Dots","page":"#0B0B0C"}*/
const NXD = 46, NZD = 26, FOC = 330, HZ = 196, CAMH = 2.3, Z0 = 2.3, DZ = 0.8, SPX = 0.27;

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const amp = EO(seg(t, 0, 0.5)) * 1.0;
  const ph = t * Math.PI * 2;
  const pts = [];
  for (let j = 0; j < NZD; j++) for (let i = 0; i < NXD; i++) {
    const x = (i - (NXD - 1) / 2) * SPX, z = Z0 + j * DZ;
    // موجتان متحركتان تتدحرجان كالماء
    const h = amp * (0.62 * Math.sin(x * 2.1 + z * 1.15 - ph * 2) + 0.38 * Math.sin(x * 0.9 - z * 0.7 + ph * 1));
    const s = FOC / z;
    pts.push({ x: W / 2 + x * s, y: HZ + (CAMH - h * 0.55) * s, h, s, z });
  }
  // نرسم الصفوف البعيدة أولًا
  for (let k = pts.length - 1; k >= 0; k--) {
    const p = pts[k];
    const fade = Math.pow(clamp(1 - (p.z - Z0) / (NZD * DZ)), 1.25);
    const crest = clamp((p.h - 0.5) / 0.4);
    const r = (0.03 + 0.017 * (p.h + 1)) * p.s + 0.3;
    ctx.globalAlpha = 0.12 + 0.88 * fade;
    circle(ctx, p.x, p.y, r, crest > 0.2 ? mixHex(C.bone, C.orange, crest) : C.bone);
  }
  ctx.globalAlpha = 1;
}
