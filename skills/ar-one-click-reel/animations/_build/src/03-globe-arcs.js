/*META {"title":"Globe Arcs","page":"#0B0B0C"}*/
const R0 = 200, CX = W / 2, CY = H / 2 + 8, D = 2600;
const ll2v = (lat, lon) => { const la = deg(lat), lo = deg(lon); return [Math.cos(la) * Math.sin(lo), -Math.sin(la), -Math.cos(la) * Math.cos(lo)]; };
// المدينة الأولى هي المنزل (برتقالية وأكبر). غيّر المدن هنا
const CITIES = [['Home', 26.2, 50.6], ['London', 51.5, -0.1], ['New York', 40.7, -74], ['Sao Paulo', -23.5, -46.6], ['Lagos', 6.5, 3.4],
  ['Cape Town', -33.9, 18.4], ['Mumbai', 19, 72.8], ['Singapore', 1.35, 103.8], ['Tokyo', 35.7, 139.7], ['Sydney', -33.9, 151.2]];
const CV = CITIES.map((c) => ll2v(c[1], c[2]));

function draw(ctx, t) {
  const sc = lerp(0.88, 1, EO(seg(t, 0, 0.5)));
  const R = R0 * sc;
  const a = deg(-60) + t * deg(110);
  const tilt = deg(22);
  const view = (p, k = R) => { const q = rotX(rotY(p, a), tilt); return [q[0] * k, q[1] * k, q[2] * k]; };
  const P = (q) => proj(q, CX, CY, D);
  const faded = (z) => clamp((z / R + 0.2) / 0.4); // 0 قريب .. 1 بعيد

  fillBG(ctx, C.ink);
  glow(ctx, CX, CY, R * 1.75, C.orange, 0.34 * EO(seg(t, 0, 0.3)));

  // خطوط الطول والعرض كل 20°
  const segsFar = [], segsNear = [];
  const addLine = (pts) => {
    for (let i = 1; i < pts.length; i++) {
      const A = pts[i - 1], B = pts[i], z = (A[2] + B[2]) / 2;
      (z > 0 ? segsFar : segsNear).push([A, B, z]);
    }
  };
  for (let lon = -180; lon < 180; lon += 20) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 3) pts.push(view(ll2v(lat, lon)));
    addLine(pts);
  }
  for (let lat = -80; lat <= 80; lat += 20) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 3) pts.push(view(ll2v(lat, lon)));
    addLine(pts);
  }
  ctx.lineWidth = 1; ctx.lineCap = 'round';
  const drawSegs = (list, a0, a1) => {
    for (const [A, B, z] of list) {
      const pa = P(A), pb = P(B);
      ctx.strokeStyle = rgba(C.bone, lerp(a0, a1, faded(z)));
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
  };

  // مدار القمر الصناعي
  const so = t * Math.PI * 2 + 0.9;
  const orb = (u) => { let p = [Math.cos(u) * 1.52, 0, Math.sin(u) * 1.52]; p = rotX(p, deg(64)); p = rotZ(p, deg(-22)); return [p[0] * R, p[1] * R, p[2] * R]; };
  const drawOrbit = (behind) => {
    ctx.lineWidth = 1;
    for (let i = 0; i < 120; i++) {
      const A = orb(i / 120 * Math.PI * 2), B = orb((i + 1) / 120 * Math.PI * 2);
      const z = (A[2] + B[2]) / 2;
      if ((z > 0) !== behind) continue;
      const pa = P(A), pb = P(B);
      const hidden = behind && Math.hypot((A[0] + B[0]) / 2, (A[1] + B[1]) / 2) < R;
      ctx.strokeStyle = rgba(C.bone, hidden ? 0.05 : behind ? 0.16 : 0.34);
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    const S = orb(so);
    if ((S[2] > 0) === behind) {
      const p = P(S), hid = behind && Math.hypot(S[0], S[1]) < R;
      const al = hid ? 0.25 : 1, s = p.s;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(p.x, p.y); ctx.rotate(0.5 + so);
      ctx.fillStyle = C.orange; ctx.fillRect(-15 * s, -3 * s, 9 * s, 6 * s); ctx.fillRect(6 * s, -3 * s, 9 * s, 6 * s);
      ctx.fillStyle = C.white; RR(ctx, -4.5 * s, -4.5 * s, 9 * s, 9 * s, 2 * s); ctx.fill();
      ctx.restore();
    }
  };

  drawSegs(segsFar, 0.2, 0.06);
  drawOrbit(true);
  drawSegs(segsNear, 0.62, 0.3);
  // نقطة عند كل تقاطع ظاهر
  ctx.fillStyle = rgba(C.bone, 0.75);
  ctx.beginPath();
  for (let lon = -180; lon < 180; lon += 20) for (let lat = -80; lat <= 80; lat += 20) {
    const q = view(ll2v(lat, lon));
    if (q[2] < -0.05 * R) { const p = P(q); ctx.moveTo(p.x + 1.6, p.y); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); }
  }
  ctx.fill();

  // الخطوط من المنزل على أقواس عظمى مرفوعة 30% في المنتصف
  const v0 = CV[0];
  for (let i = 1; i < CITIES.length; i++) {
    const v1 = CV[i];
    const om = Math.acos(clamp(v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2], -1, 1));
    const start = 0.05 + (i - 1) * 0.055;
    const p = GL(seg(t, start, start + 0.32));
    if (p <= 0) continue;
    const N = 64, pts = [];
    for (let k = 0; k <= N * p; k++) {
      const u = k / N, s0 = Math.sin((1 - u) * om) / Math.sin(om), s1 = Math.sin(u * om) / Math.sin(om);
      const lift = 1 + 0.3 * Math.sin(Math.PI * u);
      pts.push(view([(v0[0] * s0 + v1[0] * s1) * lift, (v0[1] * s0 + v1[1] * s1) * lift, (v0[2] * s0 + v1[2] * s1) * lift]));
    }
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let k = 1; k < pts.length; k++) {
      const A = pts[k - 1], B = pts[k], z = (A[2] + B[2]) / 2;
      const hid = z > 0 && Math.hypot(A[0], A[1]) < R;
      const pa = P(A), pb = P(B);
      ctx.strokeStyle = rgba(C.orange, hid ? 0.14 : 0.95);
      ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
    }
    const H0 = pts[pts.length - 1];
    if (p < 1 && !(H0[2] > 0 && Math.hypot(H0[0], H0[1]) < R)) { const ph = P(H0); headDot(ctx, ph.x, ph.y, C.white, 3.6); }
  }

  // نقاط المدن تهبط واحدة بعد أخرى، وحلقة نبض
  CITIES.forEach((c, i) => {
    const q = view(CV[i]);
    if (q[2] > 0.08 * R) return;
    const ap = LD(seg(t, i * 0.035, i * 0.035 + 0.18));
    if (ap <= 0) return;
    const p = P(q), home = i === 0;
    const ph = (t * 2.2 + i * 0.23) % 1;
    ctx.strokeStyle = rgba(C.orange, (1 - ph) * 0.8); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(p.x, p.y, (home ? 7 : 5) + ph * (home ? 20 : 15), 0, Math.PI * 2); ctx.stroke();
    circle(ctx, p.x, p.y, (home ? 6.5 : 3.8) * ap, home ? C.orange : C.white);
    if (home) { ctx.strokeStyle = C.white; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, 6.5 * ap, 0, Math.PI * 2); ctx.stroke(); }
  });

  drawOrbit(false);
}
