/*META {"title":"Marquee Bands","page":"#FFFFFF"}*/
// السطران: غيّرهما هنا
const LINE_A = 'Claude animations', LINE_B = 'Make it move';
const FS = 72, BH = 156, GAPW = 96;

function band(ctx, cx, cy, rot, bg, fg, dotCol, text, dir, enter, t) {
  ctx.save();
  ctx.translate(cx + enter, cy); ctx.rotate(deg(rot));
  SH(ctx, 'rgba(11,11,12,0.28)', 30, 0, 14); ctx.fillStyle = bg; ctx.fillRect(-1500, -BH / 2, 3000, BH); noSH(ctx);
  ctx.beginPath(); ctx.rect(-1500, -BH / 2, 3000, BH); ctx.clip();
  ctx.font = F.sans(FS, 700);
  const unit = ctx.measureText(text).width + GAPW, off = dir * t * unit * 1.2;
  const start = -1500 + ((((off % unit) + unit) % unit)) - unit;
  for (let x = start; x < 1500; x += unit) {
    ctx.fillStyle = fg; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x, FS * 0.34);
    circle(ctx, x + unit - GAPW / 2, 0, 11, dotCol);
  }
  ctx.restore();
}

function draw(ctx, t) {
  fillBG(ctx, C.white);
  const e1 = -(1 - EO(seg(t, 0, 0.3))) * 1700, e2 = (1 - EO(seg(t, 0.1, 0.4))) * 1700;
  band(ctx, W / 2, 250, -7, C.ink, C.bone, C.orange, LINE_A, -1, e1, t);
  band(ctx, W / 2, 352, 5, C.orange, C.white, C.ink, LINE_B, 1, e2, t);
}
