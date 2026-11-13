/*META {"title":"Card Fan","page":"#0B0B0C"}*/
const CW = 208, CH = 292, CR = 30, PIV = 500, PY = H + 215;
const ANG = [-36, -18, 0, 18, 36];
const ORDER = [0, 4, 1, 3, 2]; // الوسطى فوق الكل

function icon(ctx, i, cx, cy, col) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (i === 0) { ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke(); }
  else if (i === 1) { RR(ctx, cx - 28, cy - 28, 56, 56, 14); ctx.stroke(); }
  else if (i === 2) { circle(ctx, cx, cy, 34, C.white); }
  else if (i === 3) { ctx.beginPath(); ctx.moveTo(cx, cy - 32); ctx.lineTo(cx + 32, cy + 26); ctx.lineTo(cx - 32, cy + 26); ctx.closePath(); ctx.stroke(); }
  else { // شرارة
    ctx.beginPath(); const R = 34, r = 10;
    for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 4, rr = k % 2 ? r : R; ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    ctx.closePath(); ctx.stroke();
  }
}

function draw(ctx, t) {
  fillBG(ctx, C.ink);
  glow(ctx, W - 40, 30, 420, C.orange, 0.2);
  const rise = EO(seg(t, 0, 0.36)), spread = EO(seg(t, 0.22, 0.8));
  ORDER.forEach((i) => {
    ctx.save();
    ctx.translate(W / 2, PY);
    ctx.rotate(deg(ANG[i]) * spread);
    ctx.translate(0, -PIV + (1 - rise) * 520);
    const center = i === 2;
    SH(ctx, 'rgba(0,0,0,0.55)', 30, 0, 14);
    RR(ctx, -CW / 2, -CH / 2, CW, CH, CR); ctx.fillStyle = center ? C.orange : C.dark; ctx.fill(); noSH(ctx);
    if (!center) { RR(ctx, -CW / 2 + 0.5, -CH / 2 + 0.5, CW - 1, CH - 1, CR); ctx.strokeStyle = rgba(C.bone, 0.14); ctx.lineWidth = 1; ctx.stroke(); }
    T(ctx, '0' + (i + 1) + '.', -CW / 2 + 22, -CH / 2 + 44, { font: F.serif(34), fill: center ? C.white : C.orange });
    icon(ctx, i, 0, -4, center ? C.white : rgba(C.bone, 0.92));
    RR(ctx, -CW / 2 + 22, CH / 2 - 56, 112, 9, 4.5); ctx.fillStyle = center ? 'rgba(255,255,255,0.85)' : rgba(C.bone, 0.55); ctx.fill();
    RR(ctx, -CW / 2 + 22, CH / 2 - 38, 70, 9, 4.5); ctx.fillStyle = center ? 'rgba(255,255,255,0.5)' : rgba(C.bone, 0.28); ctx.fill();
    ctx.restore();
  });
}
