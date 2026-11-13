/*META {"title":"Radar Morph","page":"#0B0B0C"}*/
// التسميات والقيم: غيّرها هنا (ست محاور، ومجموعتان من القيم)
const AXES = ['TYPE', 'UI', 'DATA', 'ART', '3D', 'SOUND'];
const V0 = [0.52, 0.38, 0.7, 0.3, 0.46, 0.4], V1 = [0.9, 0.94, 0.62, 0.84, 0.72, 0.96];
const CX = W / 2, CY = H / 2 + 10, R = 186;
const ang = (i) => -Math.PI / 2 + (i * Math.PI) / 3;

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  // أربع حلقات سداسية تكبر من المركز
  for (let r = 1; r <= 4; r++) {
    const g = EO(seg(t, 0.02 + r * 0.035, 0.3 + r * 0.035)), rr = R * (r / 4) * g;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = ang(i); ctx.lineTo(CX + Math.cos(a) * rr, CY + Math.sin(a) * rr); }
    ctx.closePath(); ctx.strokeStyle = rgba(C.bone, r === 4 ? 0.34 : 0.16); ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; ctx.stroke();
  }
  const axg = EO(seg(t, 0.05, 0.35));
  for (let i = 0; i < 6; i++) {
    const a = ang(i);
    ctx.strokeStyle = rgba(C.bone, 0.14); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX + Math.cos(a) * R * axg, CY + Math.sin(a) * R * axg); ctx.stroke();
    const lx = CX + Math.cos(a) * (R + 30), ly = CY + Math.sin(a) * (R + 30);
    const al = Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right';
    CAPS(ctx, AXES[i], lx, ly + 5, { align: al, fill: C.bone, alpha: 0.75 * axg, size: 13, ls: 2.4 });
  }
  // الشكل البرتقالي ينتقل من مجموعة قيم إلى الثانية بين 0.24 و0.74
  const m = GL(seg(t, 0.24, 0.74)), appear = EO(seg(t, 0.12, 0.38));
  const pts = V0.map((v, i) => { const val = lerp(v, V1[i], m) * appear; return [CX + Math.cos(ang(i)) * R * val, CY + Math.sin(ang(i)) * R * val]; });
  ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath();
  ctx.fillStyle = rgba(C.orange, 0.28); ctx.fill();
  ctx.strokeStyle = C.orange; ctx.lineWidth = 3.5; ctx.lineJoin = 'round'; ctx.stroke();
  pts.forEach((p) => { circle(ctx, p[0], p[1], 7.5 * appear, C.orange); circle(ctx, p[0], p[1], 3 * appear, C.white); });
}
