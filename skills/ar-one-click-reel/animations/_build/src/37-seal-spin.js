/*META {"title":"Seal Spin","page":"#F6F4F1"}*/
// الكلمات على الحلقة والشعار: غيّرهما هنا
const RING_TEXT = 'MADE IN CLAUDE · 50 ANIMATIONS · ';
const RING_CHARS = RING_TEXT.length * Math.round(96 / RING_TEXT.length); // مضاعف لطول النص حتى لا يلتصق طرفاه
const R_OUT = 208, R_TEXT = 160, R_ORANGE = 114;

// شعار مؤقت (شرارة بيضاء): استبدله بشعارك
function logo(ctx, r) {
  ctx.beginPath();
  for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 4, rr = k % 2 ? r * 0.26 : r; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.fillStyle = C.white; ctx.fill();
}

function draw(ctx, t) {
  graphPaper(ctx, C.bone, C.ink);
  const sc = lerp(0.5, 1, LD(seg(t, 0, 0.36)));
  const spin = (1 - EO(seg(t, 0, 0.58))) * deg(760);
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc);
  ctx.globalAlpha = clamp(sc * 2 - 0.8);
  // القرص الأبيض بحافة متعرجة (40 نتوءًا) وظل ناعم
  ctx.save(); ctx.rotate(spin);
  SH(ctx, 'rgba(0,0,0,0.28)', 30, 0, 14);
  ctx.fillStyle = C.white; ctx.beginPath(); ctx.arc(0, 0, R_OUT - 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  for (let k = 0; k < 40; k++) { const a = (k / 40) * Math.PI * 2; ctx.moveTo(Math.cos(a) * (R_OUT - 8) + 11, Math.sin(a) * (R_OUT - 8)); ctx.arc(Math.cos(a) * (R_OUT - 8), Math.sin(a) * (R_OUT - 8), 11, 0, Math.PI * 2); }
  ctx.fill(); noSH(ctx);
  ctx.strokeStyle = rgba(C.ink, 0.1); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, R_OUT - 30, 0, Math.PI * 2); ctx.stroke();
  // القرص البرتقالي وحلقته البيضاء الرفيعة
  circle(ctx, 0, 0, R_ORANGE, C.orange);
  ctx.strokeStyle = rgba(C.white, 0.85); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(0, 0, R_ORANGE - 13, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  // حلقة النص تستمر بالدوران ببطء بعد أن يهدأ القرص
  ctx.save(); ctx.rotate(spin + t * deg(55));
  let s = ''; while (s.length < RING_CHARS) s += RING_TEXT; s = s.slice(0, RING_CHARS);
  ctx.font = F.mono(14.5, 500); ctx.fillStyle = rgba(C.ink, 0.88); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let k = 0; k < RING_CHARS; k++) {
    ctx.save(); ctx.rotate((k / RING_CHARS) * Math.PI * 2); ctx.translate(0, -R_TEXT); ctx.fillText(s[k], 0, 0); ctx.restore();
  }
  ctx.restore();
  // الشعار يهبط في المنتصف
  const l = LD(seg(t, 0.62, 0.82));
  if (l > 0) { ctx.save(); ctx.scale(l, l); ctx.rotate((1 - l) * -0.8); logo(ctx, 46); ctx.restore(); }
  ctx.restore();
}
