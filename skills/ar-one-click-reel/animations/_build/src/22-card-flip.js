/*META {"title":"Card Flip","page":"#FFE6DA","libs":["tex"]}*/
const CW = 316, CH = 432, CR = 34;
function front(g, w, h) {
  RR(g, 0, 0, w, h, CR); g.fillStyle = C.white; g.fill();
  RR(g, 30, 32, 112, 30, 15); g.fillStyle = C.bone; g.fill();
  circle(g, 48, 47, 5, C.orange);
  T(g, 'TIP · 04', 62, 52, { font: F.mono(12, 500), fill: C.ink, ls: 1.4 });
  [[0.92, 92], [0.8, 124], [0.86, 156], [0.55, 188]].forEach(([k, y]) => { RR(g, 30, y, (w - 60) * k, 14, 7); g.fillStyle = C.ink; g.fill(); });
  RR(g, 30, 232, w - 60, 108, 18); g.fillStyle = C.bone; g.fill();
  g.fillStyle = C.orange; g.fillRect(30, 250, 4, 72);
  RR(g, 50, 254, (w - 100) * 0.9, 11, 5.5); g.fillStyle = C.grey; g.fill();
  RR(g, 50, 280, (w - 100) * 0.7, 11, 5.5); g.fillStyle = mixHex(C.grey, C.bone, 0.4); g.fill();
  RR(g, 50, 306, (w - 100) * 0.45, 11, 5.5); g.fillStyle = mixHex(C.grey, C.bone, 0.4); g.fill();
  circle(g, 44, h - 46, 9, C.orange);
  RR(g, 66, h - 52, 90, 12, 6); g.fillStyle = C.mid; g.fill();
}
function back(g, w, h) {
  RR(g, 0, 0, w, h, CR); g.fillStyle = C.orange; g.fill();
  circle(g, w / 2, h / 2 - 20, 54, C.white);
  g.fillStyle = C.orange; g.beginPath(); g.moveTo(w / 2 - 14, h / 2 - 44); g.lineTo(w / 2 + 28, h / 2 - 20); g.lineTo(w / 2 - 14, h / 2 + 4); g.closePath(); g.fill();
  RR(g, 36, h - 72, w - 72, 8, 4); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fill();
  RR(g, 36, h - 72, (w - 72) * 0.38, 8, 4); g.fillStyle = C.white; g.fill();
  T(g, 'WATCH · 0:08', 36, h - 40, { font: F.mono(12, 500), fill: C.white, ls: 1.6 });
}

function draw(ctx, t) {
  fillBG(ctx, C.peach);
  const th = GL(seg(t, 0.08, 0.86)) * Math.PI;
  const cs = Math.cos(th);
  // ظل أرضي يضيق مع دوران البطاقة
  floorShadow(ctx, W / 2, H / 2 + 238, lerp(26, 170, Math.abs(cs)), 22, 0.22);
  const img = cs >= 0 ? texture('front', CW, CH, front) : texture('back', CW, CH, back);
  const xf = (p) => rotY(p, th);
  const P = (q) => proj(q, W / 2, H / 2 - 4, 1000);
  const map = (u, v) => { const uu = cs >= 0 ? u : 1 - u; const q = P(xf([(uu - 0.5) * CW, (v - 0.5) * CH, 0])); return [q.x, q.y]; };
  drawTex(ctx, img, map, 10, 14);
  // حافة رفيعة عندما تكون البطاقة جانبية
  const edge = 1 - Math.abs(cs);
  if (edge > 0.9) {
    ctx.strokeStyle = rgba(C.ink, (edge - 0.9) * 8); ctx.lineWidth = 2;
    const a = P(xf([0, -CH / 2 + 10, 0])), b = P(xf([0, CH / 2 - 10, 0]));
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
}
