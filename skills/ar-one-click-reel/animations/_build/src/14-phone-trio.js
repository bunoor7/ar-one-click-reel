/*META {"title":"Phone Trio","page":"#F6F4F1","libs":["tex","phone"]}*/
function feed(g, w, h) {
  g.fillStyle = C.white; g.fillRect(0, 0, w, h);
  T(g, 'Home', 22, 88, { font: F.sans(30, 700), fill: C.ink });
  [C.orange, C.ink, C.grey, C.peach, C.mid].forEach((col, i) => { circle(g, 38 + i * 44, 128, 19, col); if (i === 0) { g.strokeStyle = C.orange; g.lineWidth = 2; g.beginPath(); g.arc(38, 128, 23, 0, 7); g.stroke(); } });
  [[158, C.peach], [330, mixHex(C.orange, C.ink, 0.5)]].forEach(([y, col]) => {
    circle(g, 36, y + 20, 14, C.ink); RR(g, 60, y + 12, 70, 8, 4); g.fillStyle = C.ink; g.fill();
    RR(g, 22, y + 44, w - 44, 106, 18); g.fillStyle = col; g.fill();
    RR(g, 22, y + 160, 120, 8, 4); g.fillStyle = C.mid; g.fill();
  });
  statusBar(g, w, false); tabBar(g, w, h, false);
}
function profile(g, w, h) {
  g.fillStyle = C.white; g.fillRect(0, 0, w, h);
  circle(g, w / 2, 112, 36, C.orange); circle(g, w / 2, 106, 12, C.white); g.fillStyle = C.white; g.beginPath(); g.ellipse(w / 2, 136, 20, 12, 0, Math.PI, 0); g.fill();
  T(g, 'Bu Nasser', w / 2, 178, { font: F.sans(21, 700), fill: C.ink, align: 'center' });
  [['248', 'POSTS'], ['12.4k', 'FOLLOWERS'], ['310', 'FOLLOWING']].forEach(([n, l], i) => { const x = 22 + (w - 44) * (i + 0.5) / 3; T(g, n, x, 214, { font: F.sans(19, 700), fill: C.ink, align: 'center' }); CAPS(g, l, x, 232, { align: 'center', size: 8, ls: 1 }); });
  RR(g, 22, 248, w - 44, 38, 19); g.fillStyle = C.orange; g.fill(); T(g, 'Follow', w / 2, 273, { font: F.sans(16, 700), fill: C.white, align: 'center' });
  const cols = [C.ink, C.peach, C.orange, C.grey, C.ink, C.mid, C.peach, C.orange, C.ink];
  const cs = (w - 44 - 12) / 3;
  cols.forEach((col, i) => { RR(g, 22 + (i % 3) * (cs + 6), 304 + Math.floor(i / 3) * (cs + 6), cs, cs, 8); g.fillStyle = col; g.fill(); });
  statusBar(g, w, false); tabBar(g, w, h, false);
}
function analytics(g, w, h) {
  g.fillStyle = '#101013'; g.fillRect(0, 0, w, h);
  CAPS(g, 'ANALYTICS', 22, 86, { fill: C.bone, size: 11, ls: 2.4 });
  T(g, '128.4k', 22, 138, { font: F.sans(42, 700), fill: C.bone });
  const pts = [[22, 270], [60, 252], [96, 262], [132, 226], [168, 214], [210, 176]];
  const cv = catmull(pts, 14); const gr = g.createLinearGradient(0, 170, 0, 290); gr.addColorStop(0, rgba(C.orange, 0.4)); gr.addColorStop(1, rgba(C.orange, 0));
  g.beginPath(); g.moveTo(22, 290); cv.forEach((p) => g.lineTo(p[0], p[1])); g.lineTo(210, 290); g.closePath(); g.fillStyle = gr; g.fill();
  g.strokeStyle = C.orange; g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); cv.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); circle(g, 210, 176, 5, C.white);
  [0.4, 0.62, 0.5, 0.82, 0.58, 0.95, 0.7].forEach((v, i) => { RR(g, 24 + i * 29, 400 - v * 86, 18, v * 86, 5); g.fillStyle = i === 5 ? C.orange : rgba(C.bone, 0.28); g.fill(); });
  statusBar(g, w, true); tabBar(g, w, h, true);
}

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  dots(ctx, C.ink, 24, 1.1, 0.1);
  const cx = W / 2, cy = H / 2 - 4, D = 1500, sc = 0.78;
  const sway = Math.sin(t * Math.PI * 2) * deg(4.5);
  const defs = [
    { x: 0, z: -50, yaw: 0, tex: 'feed', paint: feed, at: 0.02 },
    { x: -262, z: 90, yaw: deg(30), tex: 'prof', paint: profile, at: 0.14 },
    { x: 262, z: 90, yaw: deg(-30), tex: 'ana', paint: analytics, at: 0.26 },
  ];
  const items = defs.map((d, i) => {
    const p = EO(seg(t, d.at, d.at + 0.36));
    const pos = rotY([d.x, 0, d.z], sway);
    return { d, p, pos, i };
  }).sort((a, b) => b.pos[2] - a.pos[2]);
  for (const it of items) {
    if (it.p <= 0) continue;
    const float = Math.sin(t * Math.PI * 2 * 2 + it.i * 1.7) * 6 * clamp((t - 0.3) * 4);
    const rise = (1 - it.p) * 140;
    const base = proj([it.pos[0], 0, it.pos[2]], cx, cy, D, sc);
    floorShadow(ctx, base.x, cy + 245 * base.s + 8, 118 * base.s, 14 * base.s, 0.26 * it.p);
    drawPhone(ctx, { cx, cy, D, scale: sc, x: it.pos[0], z: it.pos[2], y: rise + float, yaw: it.d.yaw + sway, pitch: deg(-4), alpha: it.p, tex: screenTex(it.d.tex, it.d.paint) });
  }
}
