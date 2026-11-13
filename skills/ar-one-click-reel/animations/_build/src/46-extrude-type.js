/*META {"title":"Extrude Type","page":"#FF5A1F"}*/
// الرقم أو الكلمة: غيّرهما هنا
const TEXT = '50', LAYERS = 46, SIZE = 400, DEPTH = 92;

function draw(ctx, t) {
  fillBG(ctx, C.orange);
  ctx.font = F.sans(SIZE, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  const base = H / 2 + SIZE * 0.34;
  const d = EO(seg(t, 0, 0.26)) * DEPTH;
  const phi = lerp(deg(25), deg(135), GL(seg(t, 0.18, 0.92))); // اتجاه البثق يدور كأن ضوءًا يعبر الحروف
  const dx = Math.cos(phi), dy = Math.sin(phi);
  const far = mixHex(C.orange, '#000000', 0.74), near = mixHex(C.orange, '#000000', 0.34);
  for (let i = LAYERS - 1; i >= 1; i--) {
    const k = i / (LAYERS - 1);
    ctx.fillStyle = mixHex(near, far, k);
    ctx.fillText(TEXT, W / 2 + dx * d * k, base + dy * d * k);
  }
  ctx.fillStyle = C.bone; ctx.fillText(TEXT, W / 2, base);
  CAPS(ctx, 'EXTRUDE · ' + LAYERS + ' LAYERS', W / 2, H - 38, { align: 'center', fill: C.ink, alpha: 0.7, size: 13, ls: 3 });
}
