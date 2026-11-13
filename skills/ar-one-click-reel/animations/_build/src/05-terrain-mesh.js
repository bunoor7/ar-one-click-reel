/*META {"title":"Terrain Mesh","page":"#0B0B0C"}*/
const COLS = 46, ROWS = 24, FOC = 430, CAMH = 3.3, HZ = 258, DZ = 1.12, Z0 = 2.4, XM = 15;
const STARS = (() => { const r = rng(7); return Array.from({ length: 40 }, () => ({ x: r() * W, y: 10 + r() * (HZ - 90), s: r() * 1.3 + 0.5, p: r() * 6.28 })); })();
function hgt(x, z) {
  const k = Math.min(1, Math.abs(x) / XM);
  const valley = Math.pow(k, 1.7) * 4.4;
  const w = Math.sin(z * 0.55 + x * 0.8) * 0.5 + Math.sin(z * 0.27 - x * 0.45 + 1.3) * 0.35 + Math.sin(z * 0.13 + x * 1.6) * 0.2;
  return valley + w * (0.12 + k * 1.6);
}

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  for (const s of STARS) { ctx.fillStyle = rgba(C.bone, 0.25 + 0.5 * Math.abs(Math.sin(t * 5 + s.p))); ctx.fillRect(s.x, s.y, s.s, s.s); }

  // الشمس على الأفق: تكبر من 80% إلى 100%
  const grow = lerp(0.8, 1, EO(seg(t, 0, 0.3)));
  const sr = 98 * grow, sy = HZ - 6;
  glow(ctx, W / 2, sy, sr * 2.7, C.orange, 0.5);
  circle(ctx, W / 2, sy, sr, C.orange);
  ctx.fillStyle = C.ink;
  for (let i = 0; i < 5; i++) { const y = sy + sr * (0.1 + i * 0.17); ctx.fillRect(W / 2 - sr, y, sr * 2, (1 + i) * 2.2 * grow); }

  // الشبكة تتحرك نحو الكاميرا بسرعة ثابتة
  const off = t * 10 * DZ, n = Math.floor(off / DZ), frac = off - n * DZ;
  const rows = [];
  for (let k = 0; k <= ROWS; k++) {
    const zs = Z0 + k * DZ - frac, zw = (k + n) * DZ, s = FOC / zs, pts = [];
    for (let j = 0; j <= COLS; j++) {
      const x = -XM + j * (2 * XM / COLS);
      pts.push([W / 2 + x * s, HZ + (CAMH - hgt(x, zw)) * s]);
    }
    rows.push({ zs, pts });
  }
  ctx.lineJoin = 'round';
  for (let k = ROWS; k >= 1; k--) {
    const far = rows[k].pts, near = rows[k - 1].pts, zs = rows[k - 1].zs;
    const a = Math.pow(clamp(1 - (zs - Z0) / (ROWS * DZ)), 1.15) * 0.92 + 0.04;
    ctx.beginPath();
    far.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = near.length - 1; i >= 0; i--) ctx.lineTo(near[i][0], near[i][1]);
    ctx.closePath(); ctx.fillStyle = C.ink; ctx.fill();
    ctx.strokeStyle = rgba(C.bone, a); ctx.lineWidth = lerp(0.6, 1.6, a);
    ctx.beginPath();
    near.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let j = 0; j <= COLS; j++) { ctx.moveTo(far[j][0], far[j][1]); ctx.lineTo(near[j][0], near[j][1]); }
    ctx.stroke();
  }
}
