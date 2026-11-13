/*META {"title":"Orbit Rings","page":"#0B0B0C"}*/
const STARS = (() => { const r = rng(31); return Array.from({ length: 90 }, () => ({ x: r() * W, y: r() * H, s: r() * 1.4 + 0.4, p: r() * 6.28, b: r() * 0.5 + 0.2 })); })();
const RINGS = [
  { r: 118, tx: 68, tz: 18, sp: 1.0, ph: 0.4, col: 'bone' },
  { r: 178, tx: 62, tz: -52, sp: 0.7, ph: 2.4, col: 'orange' },
  { r: 240, tx: 74, tz: 96, sp: 0.5, ph: 4.2, col: 'bone' },
];

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  for (const s of STARS) { ctx.fillStyle = rgba(C.bone, s.b * (0.6 + 0.4 * Math.sin(t * 6 + s.p))); ctx.fillRect(s.x, s.y, s.s, s.s); }
  const ex = EO(seg(t, 0.04, 0.55)), sphere = LD(seg(t, 0, 0.3));
  const sys = t * deg(70);
  const cx = W / 2, cy = H / 2;
  const P = (q) => proj(q, cx, cy, 1200);
  const place = (ring, ang) => {
    let p = [Math.cos(ang) * ring.r * ex, 0, Math.sin(ang) * ring.r * ex];
    p = rotZ(rotX(p, deg(ring.tx)), deg(ring.tz));
    return rotY(p, sys);
  };
  const half = (back) => {
    RINGS.forEach((ring) => {
      ctx.lineCap = 'round';
      for (let i = 0; i < 90; i++) {
        const A = place(ring, (i / 90) * Math.PI * 2), B = place(ring, ((i + 1) / 90) * Math.PI * 2);
        if (((A[2] + B[2]) / 2 > 0) !== back) continue;
        const pa = P(A), pb = P(B);
        ctx.strokeStyle = rgba(C.bone, back ? 0.17 : 0.85); ctx.lineWidth = back ? 1 : 1.5;
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
      }
    });
    RINGS.forEach((ring, i) => {
      const q = place(ring, t * Math.PI * 2 * ring.sp + ring.ph);
      if ((q[2] > 0) !== back) return;
      const p = P(q), orange = ring.col === 'orange';
      ctx.globalAlpha = back ? 0.55 : 1;
      if (orange) glow(ctx, p.x, p.y, 28, C.orange, 0.7);
      circle(ctx, p.x, p.y, (orange ? 7 : 5.5) * p.s, orange ? C.orange : C.bone);
      ctx.globalAlpha = 1;
    });
  };
  half(true);
  // الكرة المتوهجة تهبط في المنتصف
  const R = 46 * sphere;
  glow(ctx, cx, cy, R * 3.6, C.orange, 0.5);
  const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
  g.addColorStop(0, mixHex(C.orange, '#FFFFFF', 0.55)); g.addColorStop(0.55, C.orange); g.addColorStop(1, mixHex(C.orange, '#000000', 0.35));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, Math.max(0, R), 0, Math.PI * 2); ctx.fill();
  half(false);
}
