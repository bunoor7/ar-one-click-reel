/*META {"title":"Tunnel Grid","page":"#0B0B0C"}*/
const NF = 18, ZN = 1.15, DZ = 1.0, FOCT = 430, HALF = 1.7;
function bendX(n) { return Math.sin(n * 0.34) * 1.5; }
function bendY(n) { return Math.cos(n * 0.27 + 1) * 0.8; }

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const off = t * 4 * DZ, n0 = Math.floor(off / DZ), fr = off - n0 * DZ; // أربعة إطارات تمر خلال الثانيتين، فتتكرر الحركة بسلاسة
  const frames = [];
  for (let k = 0; k <= NF; k++) {
    const n = n0 + k, z = ZN + k * DZ - fr, th = n * 0.17, ox = bendX(n), oy = bendY(n), s = FOCT / z;
    const c = Math.cos(th), sn = Math.sin(th);
    const corners = [[-HALF, -HALF], [HALF, -HALF], [HALF, HALF], [-HALF, HALF]].map(([x, y]) => [W / 2 + (x * c - y * sn + ox) * s, H / 2 + (x * sn + y * c + oy) * s]);
    const near = clamp(1 - (z - ZN) / (NF * DZ)), fadeIn = clamp((NF * DZ + ZN - z) / 3), fadeOut = clamp((z - ZN) / 0.9);
    frames.push({ n, z, corners, a: Math.pow(near, 1.2) * fadeIn * fadeOut, orange: n % 4 === 0, s });
  }
  const far = frames[NF];
  // ضوء برتقالي صغير متوهج في آخر النفق
  const fc = far.corners.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]);
  glow(ctx, fc[0], fc[1], 90, C.orange, 0.55); circle(ctx, fc[0], fc[1], 5, C.white);
  for (let k = NF; k >= 0; k--) {
    const f = frames[k], prev = frames[k + 1];
    const col = f.orange ? C.orange : C.bone;
    // خطوط رفيعة تصل زوايا الإطارات المتجاورة
    if (prev) { ctx.strokeStyle = rgba(C.bone, 0.2 * f.a); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 4; i++) { ctx.moveTo(f.corners[i][0], f.corners[i][1]); ctx.lineTo(prev.corners[i][0], prev.corners[i][1]); } ctx.stroke(); }
    ctx.strokeStyle = rgba(col, (f.orange ? 0.95 : 0.8) * f.a); ctx.lineWidth = lerp(0.8, 4.2, clamp(f.s / 220)); ctx.lineJoin = 'round';
    ctx.beginPath(); f.corners.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
  }
}
