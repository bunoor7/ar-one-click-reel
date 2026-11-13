/*META {"title":"Liquid Blob","page":"#F6F4F1"}*/
const BALLS = [
  { r: 78, ax: 210, ay: 90, wx: 1, wy: 1, px: 0.0, py: 1.2 },
  { r: 64, ax: 150, ay: 120, wx: 1, wy: 2, px: 2.1, py: 0.4 },
  { r: 88, ax: 70, ay: 60, wx: 2, wy: 1, px: 4.0, py: 2.6 },
  { r: 60, ax: 250, ay: 80, wx: 1, wy: 1, px: 3.2, py: 5.0 },
  { r: 72, ax: 120, ay: 140, wx: 2, wy: 2, px: 1.1, py: 3.7 },
  { r: 56, ax: 190, ay: 40, wx: 1, wy: 3, px: 5.2, py: 0.9 },
];
let OFF = null, IMG = null;
function ensure() { if (!OFF) { OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; IMG = OFF.getContext('2d').createImageData(W, H); } }
const [OR, OG, OB] = hex2rgb(C.orange);

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  ensure();
  const grow = lerp(0.55, 1, EO(seg(t, 0, 0.5)));
  const ph = t * Math.PI * 2;
  const cs = BALLS.map((b) => ({ x: W / 2 + b.ax * Math.cos(ph * b.wx + b.px), y: H / 2 + b.ay * Math.sin(ph * b.wy + b.py), r2: (b.r * grow) * (b.r * grow) }));
  const d = IMG.data;
  let o = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++, o += 4) {
      let f = 0;
      for (let k = 0; k < 6; k++) { const c = cs[k], dx = x - c.x, dy = y - c.y; f += c.r2 / (dx * dx + dy * dy + 1); }
      // نظهر البرتقالي حيث يتجاوز الحقل 1، مع حافة ناعمة بنسبة 2 إلى 3%
      const a = f <= 0.975 ? 0 : f >= 1.025 ? 1 : (f - 0.975) / 0.05;
      d[o] = OR; d[o + 1] = OG; d[o + 2] = OB; d[o + 3] = a * 255;
    }
  }
  OFF.getContext('2d').putImageData(IMG, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(OFF, 0, 0, W, H);
  CAPS(ctx, 'LIQUID · SIX BODIES, ONE SURFACE', 40, H - 38, { fill: C.ink, alpha: 0.65, size: 13, ls: 3 });
}
