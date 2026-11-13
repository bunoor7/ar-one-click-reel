// يلتقط لقطات عند عدة قيم t ويقيس زمن الفريم ويجمع أخطاء الصفحة. الاستعمال: node check.js [جزء من الاسم] [t1,t2,...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const only = process.argv[2] && process.argv[2] !== 'all' ? process.argv[2] : '';
const TS = (process.argv[3] || '0.12,0.35,0.6,1').split(',').map(Number);
(async () => {
  const b = await chromium.launch();
  const base = path.join(__dirname, '..');
  const files = fs.readdirSync(base).filter((d) => /^\d\d-/.test(d) && d.includes(only) && fs.existsSync(path.join(base, d, 'index.html'))).sort();
  fs.mkdirSync(path.join(__dirname, 'shots'), { recursive: true }); // اللقطات تُحفظ هنا (استبعدها من git)
  const report = [];
  for (const f of files) {
    const p = await b.newPage({ viewport: { width: 912, height: 600 }, deviceScaleFactor: 1 });
    const errs = [];
    p.on('pageerror', (e) => errs.push(e.message));
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
    await p.goto('file://' + path.join(base, f, 'index.html') + '?t=0');
    const ok = await p.waitForFunction('window.__ready===true', null, { timeout: 15000 }).then(() => true, () => false);
    if (!ok) errs.push('NOT READY');
    const el = await p.$('#c');
    for (const t of TS) {
      await p.evaluate((t) => window.__render(t), t);
      await el.screenshot({ path: path.join(__dirname, 'shots', `${f}_${t}.png`) });
    }
    const ms = await p.evaluate(() => { const s = performance.now(); for (let i = 0; i < 12; i++) window.__render(0.2 + i * 0.06); return (performance.now() - s) / 12; });
    const fontsOk = await p.evaluate(() => document.fonts.check('500 20px "Google Sans"') && document.fonts.check('italic 400 20px "Instrument Serif"'));
    report.push({ f, ms: +ms.toFixed(1), fontsOk, errs: errs.slice(0, 3) });
    await p.close();
  }
  await b.close();
  for (const r of report) console.log(r.f.padEnd(28), String(r.ms).padStart(6) + 'ms', r.fontsOk ? 'fonts✓' : 'fonts✗', r.errs.length ? 'ERR ' + JSON.stringify(r.errs) : '');
})();
