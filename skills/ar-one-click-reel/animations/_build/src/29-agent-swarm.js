/*META {"title":"Agent Swarm","page":"#0B0B0C"}*/
// تسميات العقد الخمس: غيّرها هنا
const LABELS = ['RESEARCH', 'WRITE', 'RENDER', 'REVIEW', 'SHIP'];
const CX = W / 2, CY = H / 2 + 6, RIN = 128, ROUT = 238, SY = 0.9;
const INNER = LABELS.map((_, k) => { const a = -Math.PI / 2 + (k * Math.PI * 2) / 5; return [CX + Math.cos(a) * RIN, CY + Math.sin(a) * RIN * SY, a]; });
const OUTER = Array.from({ length: 8 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI * 2) / 8 + Math.PI / 8; return [CX + Math.cos(a) * ROUT, CY + Math.sin(a) * ROUT * SY, Math.round(((a + Math.PI / 2) / (Math.PI * 2)) * 5) % 5]; });

function line(ctx, A, B, p, col, w) {
  if (p <= 0) return;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(lerp(A[0], B[0], p), lerp(A[1], B[1], p)); ctx.stroke();
}
function pulse(ctx, A, B, u) {
  const x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u);
  glow(ctx, x, y, 22, C.orange, 0.7); circle(ctx, x, y, 3.6, C.orange); circle(ctx, x, y, 1.6, C.white);
}

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const hub = LD(seg(t, 0, 0.14));
  const inner = INNER.map((n, k) => ({ n, p: EO(seg(t, 0.12 + k * 0.03, 0.32 + k * 0.03)) }));
  const outer = OUTER.map((n, k) => ({ n, p: EO(seg(t, 0.3 + k * 0.025, 0.5 + k * 0.025)) }));
  // الخطوط من المركز إلى الداخلية ثم من الداخلية إلى الخارجية
  inner.forEach(({ n, p }) => line(ctx, [CX, CY], n, p, rgba(C.bone, 0.42), 1.6));
  outer.forEach(({ n, p }) => line(ctx, INNER[n[2]], n, p, rgba(C.bone, 0.3), 1.4));
  // نبضات برتقالية تسير على الخطوط المكتملة
  const flash = new Array(OUTER.length).fill(0);
  inner.forEach(({ n, p }, k) => { if (p >= 1) pulse(ctx, [CX, CY], n, (t * 2.4 + k * 0.21) % 1); });
  outer.forEach(({ n, p }, k) => {
    if (p >= 1) { const u = (t * 2.4 + k * 0.17 + 0.3) % 1; pulse(ctx, INNER[n[2]], n, u); flash[k] = clamp(1 - (1 - u) * 7); }
  });
  // العقد
  outer.forEach(({ n, p }, k) => {
    if (p <= 0) return;
    const r = 8.5 * LD(p), f = flash[k];
    if (f > 0) glow(ctx, n[0], n[1], 26, C.orange, 0.7 * f);
    circle(ctx, n[0], n[1], r, mixHex(C.ink, C.orange, f));
    ctx.strokeStyle = mixHex(C.bone, C.orange, f); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(n[0], n[1], r, 0, 7); ctx.stroke();
  });
  inner.forEach(({ n, p }, k) => {
    if (p <= 0) return;
    circle(ctx, n[0], n[1], 14 * LD(p), C.bone);
    const lx = n[0] + Math.cos(n[2]) * 36, ly = n[1] + Math.sin(n[2]) * 34;
    const al = Math.abs(Math.cos(n[2])) < 0.25 ? 'center' : Math.cos(n[2]) > 0 ? 'left' : 'right';
    CAPS(ctx, LABELS[k], lx, ly + 5, { align: al, fill: C.bone, alpha: 0.85 * clamp(p * 1.5), size: 13, ls: 2.4 });
  });
  if (hub > 0) {
    glow(ctx, CX, CY, 120 * hub, C.orange, 0.55);
    circle(ctx, CX, CY, 36 * hub, C.orange);
    ctx.fillStyle = C.white; ctx.beginPath();
    for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k * Math.PI / 4, rr = (k % 2 ? 4.6 : 17) * hub; ctx.lineTo(CX + Math.cos(a) * rr, CY + Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  }
}
