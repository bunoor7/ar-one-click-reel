/*META {"title":"Phone Scroll","page":"#FFE6DA","libs":["tex","phone"]}*/
const SCROLL = 320;
let DYN = null;

function draw(ctx, t) {
  fillBG(ctx, C.peach);
  const p = GL(seg(t, 0.05, 0.87)), sc = 0.88, cx = W / 2 - 18, cy = H / 2 - 4, D = 1700;
  // نسيج متحرك: يعاد رسمه كل فريم بموضع التمرير، ثم تُقصّ الصفحة بزوايا الشاشة المدوّرة
  if (!DYN) { DYN = document.createElement('canvas'); DYN.width = PSW * 2; DYN.height = PSH * 2; }
  const g = DYN.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, DYN.width, DYN.height); g.scale(2, 2);
  g.save(); RR(g, 0, 0, PSW, PSH, PSR); g.clip();
  appScreen(g, PSW, PSH, SCROLL * p, true);
  // علامة اللمس نصف الشفافة تصعد مع التمرير
  const my = lerp(PSH * 0.66, PSH * 0.66 - 150, p), mx = PSW * 0.7;
  circle(g, mx, my, 24, 'rgba(11,11,12,0.16)'); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2; g.beginPath(); g.arc(mx, my, 24, 0, 7); g.stroke(); circle(g, mx, my, 9, 'rgba(255,255,255,0.8)');
  g.restore();
  floorShadow(ctx, cx, H / 2 + 258, 140, 17, 0.26);
  drawPhone(ctx, { cx, cy, D, scale: sc, tex: DYN });
  // شريط تمرير رفيع بجانب الجوال
  const tx = cx + (PH.W / 2) * sc + 34, th = 210, ty = cy - th / 2;
  RR(ctx, tx - 2, ty, 4, th, 2); ctx.fillStyle = rgba(C.ink, 0.12); ctx.fill();
  RR(ctx, tx - 2, ty + (th - 62) * p, 4, 62, 2); ctx.fillStyle = C.orange; ctx.fill();
}
