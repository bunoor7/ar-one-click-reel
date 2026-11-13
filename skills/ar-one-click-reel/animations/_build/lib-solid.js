// ===== صناديق ثلاثية الأبعاد بتظليل مسطّح: اللون بين درجتين حسب اتجاه الوجه =====
const BOX_FACES = [
  { n: [0, -1, 0], v: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] }, // أعلى (y للأسفل)
  { n: [0, 0, -1], v: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]] }, // أمام
  { n: [0, 0, 1], v: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] },
  { n: [-1, 0, 0], v: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
  { n: [1, 0, 0], v: [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]] },
  { n: [0, 1, 0], v: [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]] },
];
const LIGHT = (() => { const l = [-0.45, -0.8, -0.5], m = Math.hypot(...l); return l.map((x) => x / m); })();
// xf: تحويل النقطة (دوران)، P: إسقاط. boxes: {c:[x,y,z], h:[hx,hy,hz], dark, light, line}
function drawBoxes(ctx, boxes, xf, P, lineW = 1.1) {
  const list = boxes.map((b) => ({ b, key: xf([b.c[0], 0, b.c[2]])[2] }));
  list.sort((a, c) => c.key - a.key);
  for (const { b } of list) {
    const faces = [];
    for (const f of BOX_FACES) {
      const nr = xf(f.n.slice()); // الدوران فقط (المراكز عند الصفر)
      const o = xf([0, 0, 0]);
      const n = [nr[0] - o[0], nr[1] - o[1], nr[2] - o[2]];
      if (n[2] >= 0) continue; // وجه مدبر
      const pts = f.v.map((v) => xf([b.c[0] + v[0] * b.h[0], b.c[1] + v[1] * b.h[1], b.c[2] + v[2] * b.h[2]]));
      const zc = pts.reduce((s, p) => s + p[2], 0) / 4;
      const I = clamp(0.25 + 0.75 * Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]));
      faces.push({ pts, zc, I });
    }
    faces.sort((a, c) => c.zc - a.zc);
    for (const f of faces) {
      const q = f.pts.map(P);
      ctx.beginPath(); ctx.moveTo(q[0].x, q[0].y); for (let i = 1; i < 4; i++) ctx.lineTo(q[i].x, q[i].y); ctx.closePath();
      ctx.fillStyle = mixHex(b.dark, b.light, f.I); ctx.fill();
      ctx.lineWidth = lineW; ctx.lineJoin = 'round'; ctx.strokeStyle = b.line || C.ink; ctx.stroke();
    }
  }
}
