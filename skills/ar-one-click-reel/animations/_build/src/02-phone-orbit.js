/*META {"title":"Phone Orbit","page":"#FFE6DA","libs":["tex","phone"]}*/
const RING_R = 318;
const ring = (a) => rotZ(rotX([Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R], deg(23)), deg(-12));

function draw(ctx, t) {
  fillBG(ctx, C.peach);
  const turn = GL(seg(t, 0.04, 0.82));
  const yaw = deg(56) * (1 - turn), bob = Math.sin(t * Math.PI * 4) * 5;
  const cx = W / 2, cy = H / 2 - 8, D = 1500, sc = 0.86;
  const P = (q) => proj(q, cx, cy, D, sc);
  // ظل أرضي ناعم يتسع مع دوران الجوال
  floorShadow(ctx, cx, H / 2 + 238, lerp(52, 150, turn), lerp(10, 20, turn), 0.28);
  // الحلقة البرتقالية خلف الجوال خافتة ثم أمامه ساطعة
  const ringHalf = (back) => {
    ctx.lineCap = 'round';
    for (let i = 0; i < 120; i++) {
      const A = ring((i / 120) * Math.PI * 2), B = ring(((i + 1) / 120) * Math.PI * 2);
      if (((A[2] + B[2]) / 2 > 0) !== back) continue;
      const pa = P(A), pb = P(B);
      ctx.strokeStyle = rgba(C.orange, back ? 0.28 : 0.95); ctx.lineWidth = back ? 1.2 : 2;
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
  };
  const da = t * Math.PI * 2 * 1 + 1.1, dq = ring(da), dp = P(dq);
  ringHalf(true);
  if (dq[2] > 0) { glow(ctx, dp.x, dp.y, 30, C.orange, 0.7); circle(ctx, dp.x, dp.y, 5.5, C.orange); circle(ctx, dp.x, dp.y, 2.2, C.white); }
  drawPhone(ctx, { cx, cy, D, scale: sc, y: bob, yaw, pitch: deg(-5) * turn, roll: deg(-3) * turn, tex: screenTex('app', (g, w, h) => appScreen(g, w, h, 0, false)) });
  ringHalf(false);
  if (dq[2] <= 0) { glow(ctx, dp.x, dp.y, 30, C.orange, 0.7); circle(ctx, dp.x, dp.y, 5.5, C.orange); circle(ctx, dp.x, dp.y, 2.2, C.white); }
}
