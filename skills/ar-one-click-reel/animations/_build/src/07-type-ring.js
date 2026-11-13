/*META {"title":"Type Ring","page":"#F6F4F1"}*/
// السطر: غيّره هنا (لاتيني فقط: الحرف العربي المتصل ينكسر عند تضييقه على الحلقة)
const LINE = 'CLAUDE ANIMATIONS • NOW IN 3D •', ACCENT = 'NOW IN 3D';
const FS = 124, RADIUS = 296, TILT = deg(14), D = 1250;

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  dots(ctx, C.ink, 24, 1.2, 0.16);
  const sc = lerp(0.88, 1, EO(seg(t, 0, 0.45))), rot = t * deg(210);
  const cx = W / 2, cy = H / 2 + 52;
  const tilt = (p) => rotX(p, TILT), P = (q) => proj(q, cx, cy, D, sc);
  ctx.font = F.sans(FS, 700);
  const chars = [...LINE], ws = chars.map((ch) => ctx.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0);
  const xs = (Math.PI * 2 * RADIUS) / total; // يضيق السطر ليملأ المحيط بالضبط
  const a0 = LINE.indexOf(ACCENT), a1 = a0 + ACCENT.length;

  // الخط الإهليلجي الرفيع للحلقة
  ctx.strokeStyle = rgba(C.ink, 0.3); ctx.lineWidth = 1.2; ctx.beginPath();
  for (let k = 0; k <= 120; k++) { const a = (k / 120) * Math.PI * 2, q = P(tilt([Math.sin(a) * RADIUS, 0, -Math.cos(a) * RADIUS])); k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
  ctx.stroke();

  let cum = 0; const items = [];
  chars.forEach((ch, k) => {
    const phi = ((cum + ws[k] / 2) / total) * Math.PI * 2 + rot; cum += ws[k];
    const base = [Math.sin(phi) * RADIUS, 0, -Math.cos(phi) * RADIUS];
    const T3 = [Math.cos(phi), 0, Math.sin(phi)];
    const c3 = tilt(base);
    const nrm = tilt([Math.sin(phi), 0, -Math.cos(phi)]);
    items.push({ ch, phi, base, T3, z: c3[2], front: nrm[2] - tilt([0, 0, 0])[2] < 0, accent: k >= a0 && k < a1 });
  });
  items.sort((a, b) => b.z - a.z); // البعيد أولًا
  for (const it of items) {
    const p0 = P(tilt(it.base));
    const px = P(tilt([it.base[0] + it.T3[0] * xs, it.base[1], it.base[2] + it.T3[2] * xs]));
    const py = P(tilt([it.base[0], it.base[1] + 1, it.base[2]])); // +y المحلي يشير إلى الأسفل كما في الكانفس
    ctx.save();
    ctx.transform(px.x - p0.x, px.y - p0.y, py.x - p0.x, py.y - p0.y, p0.x, p0.y);
    ctx.font = F.sans(FS, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.globalAlpha = it.front ? 1 : 0.16;
    ctx.fillStyle = it.accent ? C.orange : C.ink;
    ctx.fillText(it.ch, 0, 0);
    ctx.restore();
  }
}
