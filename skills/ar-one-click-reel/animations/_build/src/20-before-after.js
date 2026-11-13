/*META {"title":"Before After","page":"#F6F4F1"}*/
// نص الصفحة: غيّره هنا
const HEAD1 = 'Ideas that', HEAD2 = 'compound.', COPY = 'Turn rough prompts into motion.', BTN1 = 'Start free', BTN2 = 'Watch';
const CX = 56, CY = 64, CWD = 800, CHT = 450;

function finished(ctx) {
  RR(ctx, CX, CY, CWD, CHT, 30); ctx.fillStyle = C.white; ctx.fill();
  T(ctx, HEAD1, CX + 52, CY + 166, { font: F.sans(58, 700), fill: C.ink });
  T(ctx, HEAD2, CX + 52, CY + 236, { font: F.serif(78), fill: C.orange });
  T(ctx, COPY, CX + 54, CY + 282, { font: F.sans(18, 400), fill: C.grey });
  RR(ctx, CX + 52, CY + 316, 148, 50, 25); ctx.fillStyle = C.orange; ctx.fill();
  T(ctx, BTN1, CX + 126, CY + 348, { font: F.sans(18, 700), fill: C.white, align: 'center' });
  RR(ctx, CX + 214, CY + 316, 118, 50, 25); ctx.fillStyle = C.bone; ctx.fill();
  T(ctx, BTN2, CX + 273, CY + 348, { font: F.sans(18, 700), fill: C.ink, align: 'center' });
  RR(ctx, CX + 468, CY + 52, 280, 188, 24); const g = ctx.createLinearGradient(CX + 468, CY + 52, CX + 748, CY + 240); g.addColorStop(0, mixHex(C.orange, '#FFFFFF', 0.4)); g.addColorStop(1, C.orange); ctx.fillStyle = g; ctx.fill();
  RR(ctx, CX + 468, CY + 258, 134, 136, 22); ctx.fillStyle = C.ink; ctx.fill();
  RR(ctx, CX + 614, CY + 258, 134, 136, 22); ctx.fillStyle = C.peach; ctx.fill();
  circle(ctx, CX + 608, CY + 146, 28, 'rgba(255,255,255,0.9)');
  ctx.fillStyle = C.orange; ctx.beginPath(); ctx.moveTo(CX + 600, CY + 133); ctx.lineTo(CX + 623, CY + 146); ctx.lineTo(CX + 600, CY + 159); ctx.closePath(); ctx.fill();
}
function wire(ctx) {
  const gr = '#E4E2DE', ln = '#BDBAB4';
  RR(ctx, CX, CY, CWD, CHT, 30); ctx.fillStyle = '#F2F0ED'; ctx.fill();
  RR(ctx, CX + 52, CY + 118, 300, 28, 8); ctx.fillStyle = gr; ctx.fill();
  RR(ctx, CX + 52, CY + 172, 360, 36, 8); ctx.fillStyle = gr; ctx.fill();
  RR(ctx, CX + 52, CY + 238, 280, 12, 6); ctx.fillStyle = gr; ctx.fill();
  RR(ctx, CX + 52, CY + 316, 148, 50, 25); ctx.strokeStyle = ln; ctx.lineWidth = 2; ctx.stroke();
  RR(ctx, CX + 214, CY + 316, 118, 50, 25); ctx.stroke();
  RR(ctx, CX + 468, CY + 52, 280, 188, 14); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = ln; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CX + 468, CY + 52); ctx.lineTo(CX + 748, CY + 240); ctx.moveTo(CX + 748, CY + 52); ctx.lineTo(CX + 468, CY + 240); ctx.stroke();
  RR(ctx, CX + 468, CY + 258, 134, 136, 14); ctx.fillStyle = gr; ctx.fill(); ctx.stroke();
  RR(ctx, CX + 614, CY + 258, 134, 136, 14); ctx.fill(); ctx.stroke();
}
function pill(ctx, s, x, y, dark) {
  ctx.font = F.mono(12, 500);
  const w = ctx.measureText(s).width + 36 + s.length * 2;
  RR(ctx, x, y, w, 30, 15); ctx.fillStyle = dark ? C.ink : C.white; ctx.fill();
  T(ctx, s, x + 18, y + 20, { font: F.mono(12, 500), fill: dark ? C.white : C.ink, ls: 2 });
}

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  SH(ctx, 'rgba(11,11,12,0.16)', 40, 0, 18); RR(ctx, CX, CY, CWD, CHT, 30); ctx.fillStyle = C.white; ctx.fill(); noSH(ctx);
  wire(ctx);
  const hx = CX + CWD * lerp(0.08, 0.8, GL(seg(t, 0.06, 0.92)));
  ctx.save(); ctx.beginPath(); ctx.rect(CX, CY, hx - CX, CHT); ctx.clip(); finished(ctx); ctx.restore();
  // المقبض: خط حبر بعرض 3 وزر أبيض دائري وسهمان
  ctx.fillStyle = C.ink; ctx.fillRect(hx - 1.5, CY + 6, 3, CHT - 12);
  SH(ctx, 'rgba(11,11,12,0.3)', 14, 0, 5); circle(ctx, hx, CY + CHT / 2, 24, C.white); noSH(ctx);
  ctx.strokeStyle = C.ink; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(hx - 5, CY + CHT / 2 - 7); ctx.lineTo(hx - 11, CY + CHT / 2); ctx.lineTo(hx - 5, CY + CHT / 2 + 7); ctx.moveTo(hx + 5, CY + CHT / 2 - 7); ctx.lineTo(hx + 11, CY + CHT / 2); ctx.lineTo(hx + 5, CY + CHT / 2 + 7); ctx.stroke();
  pill(ctx, 'AFTER', CX + 22, CY + CHT - 52, true);
  const s = 'BEFORE'; ctx.font = F.mono(12, 500); const bw = ctx.measureText(s).width + 36 + s.length * 2;
  pill(ctx, s, CX + CWD - 22 - bw, CY + CHT - 52, false);
}
