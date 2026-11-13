/*META {"title":"Scramble Decode","page":"#FFFFFF","fonts":"mono"}*/
// الكلمات الثلاث: غيّرها هنا
const WORDS = ['PROMPT', 'RENDER', 'PUBLISH'];
const SYM = '#@%&*+=?/<>{}[]~$^!';
const FS = 112, X0 = 196, BASES = [200, 340, 480];
const hash = (a, b, c) => { let h = (a * 374761393 + b * 668265263 + c * 2147483647) >>> 0; h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return (h ^ (h >>> 16)) >>> 0; };

function draw(ctx, t) {
  fillBG(ctx, C.white);
  ctx.font = F.mono(FS, 500);
  const cw = ctx.measureText('M').width;
  const frame = Math.floor(t * 30); // الرموز تتبدّل نحو 15 مرة في الثانية
  WORDS.forEach((word, i) => {
    const s = 0.04 + i * 0.14, n = word.length, y = BASES[i];
    if (t < s) return;
    T(ctx, '0' + (i + 1) + '.', 64, y - 6, { font: F.serif(56), fill: C.orange, alpha: EO(seg(t, s, s + 0.06)) });
    ctx.font = F.mono(FS, 500); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    for (let k = 0; k < n; k++) {
      const resolveAt = s + 0.1 + (k / n) * 0.42;
      const x = X0 + k * cw + cw / 2;
      if (t >= resolveAt) { ctx.fillStyle = C.ink; ctx.fillText(word[k], x, y); }
      else { ctx.fillStyle = C.orange; ctx.fillText(SYM[hash(i, k, frame) % SYM.length], x, y); }
    }
    const end = s + 0.1 + 0.42 + 0.04;
    const d = LD(seg(t, end, end + 0.08));
    if (d > 0) {
      const dx = X0 + n * cw + 40;
      circle(ctx, dx, y - 40, 12 * d, C.orange);
      CAPS(ctx, 'DONE', dx + 26, y - 34, { fill: C.ink, alpha: 0.7 * clamp(d), size: 15, ls: 3 });
    }
  });
}
