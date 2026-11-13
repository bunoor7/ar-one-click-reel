// يصدّر أي أنيميشن إلى MP4: node export.js <ملف.html> <خرج.mp4> [fps=60] [دقة=2]
// يمشي على window.__render(t) فريمًا فريمًا (t من 0 إلى 1 خلال ثانيتين) ثم يجمعها ffmpeg. اضبط HOLD=1 لإضافة ثانية ثبات في النهاية.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');
const [src, out, fpsArg, scaleArg] = process.argv.slice(2);
if (!src || !out) { console.error('الاستعمال: node export.js <ملف.html> <خرج.mp4> [fps=60] [دقة=2]'); process.exit(1); }
const fps = +fpsArg || 60, scale = +scaleArg || 2, hold = process.env.HOLD === '1' ? 1 : 0;
(async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'anim-'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 912, height: 600 }, deviceScaleFactor: scale });
  await p.goto('file://' + path.resolve(src) + '?t=0');
  await p.waitForFunction('window.__ready===true', null, { timeout: 20000 });
  const el = await p.$('#c');
  const n = Math.round(2 * fps);
  for (let i = 0; i <= n; i++) {
    await p.evaluate((t) => window.__render(t), i / n);
    await el.screenshot({ path: path.join(dir, `f${String(i).padStart(5, '0')}.png`) });
  }
  const total = n + 1 + hold * fps;
  for (let i = n + 1; i < total; i++) fs.copyFileSync(path.join(dir, `f${String(n).padStart(5, '0')}.png`), path.join(dir, `f${String(i).padStart(5, '0')}.png`));
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(dir, 'f%05d.png'), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('تم:', out);
})();
