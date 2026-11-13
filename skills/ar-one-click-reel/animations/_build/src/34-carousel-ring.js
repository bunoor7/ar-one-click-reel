/*META {"title":"Carousel Ring","page":"#0B0B0C","libs":["tex"]}*/
const NC = 9, CW = 150, CH = 210, RING = 310;
const THUMBS = [C.orange, mixHex(C.orange, C.ink, 0.55), '#3E3E44', mixHex(C.orange, '#FFFFFF', 0.5), '#6B6860', mixHex(C.orange, C.ink, 0.25), '#2B2B30', mixHex(C.ink, C.bone, 0.62), mixHex(C.orange, '#FFFFFF', 0.25)];
const TITLES = [0.7, 0.55, 0.8, 0.62, 0.74, 0.5, 0.66, 0.78, 0.58];
function face(i) {
  return (g, w, h) => {
    RR(g, 0, 0, w, h, 16); g.fillStyle = C.white; g.fill();
    RR(g, 10, 10, w - 20, 108, 10); g.fillStyle = THUMBS[i]; g.fill();
    if (i === 0) { circle(g, w / 2, 64, 24, C.white); g.fillStyle = C.orange; g.beginPath(); g.moveTo(w / 2 - 7, 52); g.lineTo(w / 2 + 14, 64); g.lineTo(w / 2 - 7, 76); g.closePath(); g.fill(); }
    RR(g, 12, 132, (w - 24) * TITLES[i], 12, 6); g.fillStyle = C.ink; g.fill();
    RR(g, 12, 154, (w - 24) * 0.9, 8, 4); g.fillStyle = C.mid; g.fill();
    RR(g, 12, 170, (w - 24) * 0.55, 8, 4); g.fillStyle = C.mid; g.fill();
    circle(g, w - 20, h - 18, 6, C.orange);
  };
}
function backFace(g, w, h) {
  RR(g, 0.75, 0.75, w - 1.5, h - 1.5, 16); g.fillStyle = C.dark; g.fill();
  g.strokeStyle = rgba(C.bone, 0.4); g.lineWidth = 1.5; g.stroke();
  RR(g, w / 2 - 16, h / 2 - 16, 32, 32, 8); g.strokeStyle = rgba(C.bone, 0.25); g.stroke();
}

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  glow(ctx, W / 2, H / 2 + 20, 330, C.orange, 0.12);
  const prog = GL(seg(t, 0.1, 0.86));
  const theta = prog * (Math.PI * 2 / NC);
  const items = [];
  for (let k = 0; k < NC; k++) {
    const phi = (k * Math.PI * 2) / NC - theta; // البطاقة 1 تصل إلى الأمام
    const center = rotX([Math.sin(phi) * RING, 0, -Math.cos(phi) * RING], deg(15));
    items.push({ k, phi, z: center[2] });
  }
  items.sort((a, b) => b.z - a.z);
  const P = (q) => proj(q, W / 2, H / 2 + 8, 1500);
  for (const it of items) {
    const xf = (p) => { const q = rotY(p, -it.phi); return rotX([q[0] + Math.sin(it.phi) * RING, q[1], q[2] - Math.cos(it.phi) * RING], deg(15)); };
    const nrm = rotX(rotY([0, 0, -1], -it.phi), deg(15));
    const facing = nrm[2] < 0; // الوجه الأمامي يواجه المشاهد
    const img = facing ? texture('f' + it.k, CW, CH, face(it.k)) : texture('b', CW, CH, backFace);
    const map = (u, v) => { const uu = facing ? u : 1 - u; const q = P(xf([(uu - 0.5) * CW, (v - 0.5) * CH, 0])); return [q.x, q.y]; };
    drawTex(ctx, img, map, 6, 9);
    // تغميق تدريجي مع البعد
    const dark = clamp((it.z + RING) / (2 * RING)) * 0.62;
    const a = P(xf([-CW / 2, -CH / 2, 0])), b = P(xf([CW / 2, -CH / 2, 0])), c = P(xf([CW / 2, CH / 2, 0])), d = P(xf([-CW / 2, CH / 2, 0]));
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.closePath();
    ctx.fillStyle = rgba(C.ink, dark); ctx.fill();
  }
  // تسعة نقاط في الأسفل، النشطة برتقالية
  const active = prog < 0.5 ? 0 : 1;
  for (let i = 0; i < NC; i++) circle(ctx, W / 2 + (i - (NC - 1) / 2) * 20, H - 40, i === active ? 5 : 3.5, i === active ? C.orange : rgba(C.bone, 0.3));
}
