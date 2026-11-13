/*META {"title":"Particle Sphere","page":"#0B0B0C"}*/
const NX = 44, NY = 25, N = NX * NY, RS = 205;
const GOLD = Math.PI * (3 - Math.sqrt(5));
const DOTS = (() => {
  const out = [];
  for (let n = 0; n < N; n++) {
    const i = n % NX, j = Math.floor(n / NX);
    const y = 1 - 2 * (n + 0.5) / N, r = Math.sqrt(1 - y * y), ph = n * GOLD;
    out.push({ gx: (i + 0.5) * W / NX - W / 2, gy: (j + 0.5) * H / NY - H / 2, s: [r * Math.cos(ph), y, r * Math.sin(ph)], o: n % 9 === 4, d: n / N });
  }
  return out;
})();

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const a = t * deg(210), items = [];
  for (const d of DOTS) {
    const u = GL(seg(t, 0.06 + d.d * 0.12, 0.56 + d.d * 0.12));
    let sp = rotX(rotY(d.s, a), deg(-16));
    sp = [sp[0] * RS, sp[1] * RS, sp[2] * RS];
    const p = [lerp(d.gx, sp[0], u), lerp(d.gy, sp[1], u), lerp(0, sp[2], u)];
    const near = lerp(0.62, clamp(1 - (sp[2] + RS) / (2 * RS)), u);
    items.push({ p, near, o: d.o });
  }
  items.sort((x, y) => y.p[2] - x.p[2]);
  const sizeBase = lerp(2.6, 3.6, GL(seg(t, 0.06, 0.68)));
  for (const it of items) {
    const q = proj(it.p, W / 2, H / 2, 1500);
    ctx.globalAlpha = 0.18 + 0.82 * it.near;
    circle(ctx, q.x, q.y, sizeBase * q.s * lerp(0.45, 1.25, it.near), it.o ? C.orange : C.bone);
  }
  ctx.globalAlpha = 1;
}
