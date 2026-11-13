/*META {"title":"Tile Grid","page":"#FFFFFF"}*/
// أسماء البلاطات: غيّرها هنا
const CARDS = { '1,0': ['01.', 'Type', 'type'], '3,0': ['02.', 'UI', 'ui'], '1,2': ['03.', 'Data', 'data'], '3,2': ['04.', 'Art', 'art'] };
const CENTER_BIG = '50.', CENTER_SMALL = 'styles';
const TS = 150, TG = 14, TR = 36;
const X0 = (W - (5 * TS + 4 * TG)) / 2, Y0 = (H - (3 * TS + 2 * TG)) / 2;

function lineIcon(ctx, kind, cx, cy) {
  ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
  if (kind === 'type') { ctx.moveTo(cx - 20, cy + 18); ctx.lineTo(cx, cy - 20); ctx.lineTo(cx + 20, cy + 18); ctx.moveTo(cx - 11, cy + 4); ctx.lineTo(cx + 11, cy + 4); }
  else if (kind === 'ui') { RR(ctx, cx - 22, cy - 18, 44, 36, 8); ctx.moveTo(cx - 22, cy - 6); ctx.lineTo(cx + 22, cy - 6); }
  else if (kind === 'data') { ctx.moveTo(cx - 18, cy + 18); ctx.lineTo(cx - 18, cy + 2); ctx.moveTo(cx, cy + 18); ctx.lineTo(cx, cy - 18); ctx.moveTo(cx + 18, cy + 18); ctx.lineTo(cx + 18, cy - 6); }
  else { ctx.arc(cx - 6, cy + 4, 16, 0, 7); ctx.moveTo(cx + 24, cy - 14); ctx.lineTo(cx + 8, cy - 22); ctx.lineTo(cx + 12, cy - 4); ctx.closePath(); }
  ctx.stroke();
}

function draw(ctx, t) {
  fillBG(ctx, C.white);
  dots(ctx, C.ink, 24, 1.1, 0.1);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) {
    const d = Math.hypot(i - 2, j - 1), p = LD(seg(t, d * 0.07, d * 0.07 + 0.26));
    if (p <= 0) continue;
    const x = X0 + i * (TS + TG), y = Y0 + j * (TS + TG), key = i + ',' + j;
    ctx.save(); ctx.translate(x + TS / 2, y + TS / 2); const s = lerp(0.72, 1, p); ctx.scale(s, s); ctx.globalAlpha = clamp(p * 1.6);
    if (i === 2 && j === 1) {
      SH(ctx, rgba(C.orange, 0.4), 26, 0, 12); RR(ctx, -TS / 2, -TS / 2, TS, TS, TR); ctx.fillStyle = C.orange; ctx.fill(); noSH(ctx);
      T(ctx, CENTER_BIG, 0, 20, { font: F.serif(82), fill: C.white, align: 'center' });
      T(ctx, CENTER_SMALL, 0, 52, { font: F.sans(17, 500), fill: 'rgba(255,255,255,0.9)', align: 'center' });
      const sw = seg(t, 0.78, 0.96); // لمعة ضوء تعبر مرة واحدة
      if (sw > 0 && sw < 1) {
        ctx.save(); RR(ctx, -TS / 2, -TS / 2, TS, TS, TR); ctx.clip(); ctx.rotate(0.5);
        const gx = lerp(-TS, TS, sw), g = ctx.createLinearGradient(gx - 36, 0, gx + 36, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.4)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(-TS, -TS, TS * 2, TS * 2); ctx.restore();
      }
    } else if (CARDS[key]) {
      const [num, name, kind] = CARDS[key];
      SH(ctx, 'rgba(11,11,12,0.14)', 22, 0, 10); RR(ctx, -TS / 2, -TS / 2, TS, TS, TR); ctx.fillStyle = C.white; ctx.fill(); noSH(ctx);
      RR(ctx, -TS / 2 + 0.5, -TS / 2 + 0.5, TS - 1, TS - 1, TR); ctx.strokeStyle = rgba(C.ink, 0.08); ctx.lineWidth = 1; ctx.stroke();
      T(ctx, num, -TS / 2 + 20, -TS / 2 + 38, { font: F.serif(30), fill: C.orange });
      lineIcon(ctx, kind, 0, -4);
      T(ctx, name, -TS / 2 + 22, TS / 2 - 20, { font: F.sans(22, 700), fill: C.ink });
    } else {
      RR(ctx, -TS / 2 + 1, -TS / 2 + 1, TS - 2, TS - 2, TR); ctx.setLineDash([8, 8]); ctx.strokeStyle = rgba(C.ink, 0.22); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }
}
