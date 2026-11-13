/*META {"title":"Split Flap","page":"#0B0B0C"}*/
// الكلمة (ست أحرف): غيّرها هنا
const TARGET = 'CLAUDE', STATUS = 'ON TIME · NOW RENDERING', LEFT = 'DEPARTURES', RIGHT = 'GATE 50';
const TW = 124, TH = 180, GAP = 14, N = 6, FD = 0.045;
const LET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const X0 = (W - (N * TW + (N - 1) * GAP)) / 2, Y0 = 190;
const SEQ = Array.from({ length: N }, (_, i) => {
  const r = rng(100 + i), n = 4 + i, s = [LET[Math.floor(r() * 26)]];
  for (let m = 0; m < n - 1; m++) { let c; do { c = LET[Math.floor(r() * 26)]; } while (c === s[s.length - 1]); s.push(c); }
  s.push(TARGET[i]);
  return s; // الطول n+1: الحرف الأول ثم نتيجة كل قلبة
});
const END = (i) => 0.2 + i * 0.1;

function half(ctx, x, y, ch, top) {
  ctx.save();
  ctx.beginPath(); ctx.rect(x, top ? y : y + TH / 2, TW, TH / 2); ctx.clip();
  RR(ctx, x, y, TW, TH, 16);
  const g = ctx.createLinearGradient(0, y, 0, y + TH);
  g.addColorStop(0, '#222226'); g.addColorStop(0.5, '#19191C'); g.addColorStop(0.5, '#151517'); g.addColorStop(1, '#101012');
  ctx.fillStyle = g; ctx.fill();
  T(ctx, ch, x + TW / 2, y + TH / 2 + 50, { font: F.sans(138, 700), fill: C.bone, align: 'center' });
  ctx.restore();
}
function tile(ctx, i, t) {
  const x = X0 + i * (TW + GAP), y = Y0, seq = SEQ[i], n = seq.length - 1, end = END(i), mid = y + TH / 2;
  const start = end - n * FD;
  let a = seq[0], b = seq[0], f = -1;
  if (t >= end) { a = b = seq[n]; }
  else if (t >= start) {
    const m = Math.min(n - 1, Math.floor((t - start) / FD));
    a = seq[m]; b = seq[m + 1]; f = ((t - start) - m * FD) / FD;
  }
  if (f < 0) { half(ctx, x, y, a, true); half(ctx, x, y, a, false); }
  else {
    half(ctx, x, y, b, true); half(ctx, x, y, a, false);
    ctx.save(); ctx.translate(0, mid);
    if (f < 0.5) { const s = Math.cos(f * Math.PI); ctx.scale(1, s); ctx.translate(0, -mid); half(ctx, x, y, a, true); ctx.fillStyle = rgba('#000000', f * 0.9); ctx.fillRect(x, y, TW, TH / 2); }
    else { const s = -Math.cos(f * Math.PI); ctx.scale(1, s); ctx.translate(0, -mid); half(ctx, x, y, b, false); ctx.fillStyle = rgba('#000000', (1 - f) * 0.9); ctx.fillRect(x, mid, TW, TH / 2); }
    ctx.restore();
  }
  // الفاصل الأفقي الرفيع وحافة الإطار
  ctx.fillStyle = C.ink; ctx.fillRect(x, mid - 1.2, TW, 2.4);
  ctx.fillStyle = '#26262A'; ctx.beginPath(); ctx.arc(x + 9, mid, 3, 0, 7); ctx.arc(x + TW - 9, mid, 3, 0, 7); ctx.fill();
  RR(ctx, x + 0.5, y + 0.5, TW - 1, TH - 1, 16); ctx.strokeStyle = rgba(C.bone, 0.1); ctx.lineWidth = 1; ctx.stroke();
}

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  const la = EO(seg(t, 0, 0.12));
  CAPS(ctx, LEFT, X0, Y0 - 26, { fill: C.bone, alpha: 0.7 * la, size: 14, ls: 3.4 });
  CAPS(ctx, RIGHT, X0 + N * TW + (N - 1) * GAP, Y0 - 26, { fill: C.bone, alpha: 0.7 * la, size: 14, ls: 3.4, align: 'right' });
  for (let i = 0; i < N; i++) tile(ctx, i, t);
  const d = LD(seg(t, 0.78, 0.92));
  if (d > 0) {
    circle(ctx, X0 + 14, Y0 + TH + 58, 10 * d, C.orange);
    glow(ctx, X0 + 14, Y0 + TH + 58, 30, C.orange, 0.4 * clamp(d));
    CAPS(ctx, STATUS, X0 + 40, Y0 + TH + 63, { fill: C.bone, alpha: 0.85 * clamp(d), size: 15, ls: 3 });
  }
}
