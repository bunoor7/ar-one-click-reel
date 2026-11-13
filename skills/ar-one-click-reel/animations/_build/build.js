// يبني كل src/NN-slug.js إلى ../NN-slug/index.html مستقل. الاستعمال: node build.js [جزء من الاسم]
const fs = require('fs');
const path = require('path');
const root = __dirname;
const only = process.argv[2];
const harness = fs.readFileSync(path.join(root, 'harness.js'), 'utf8');
const libs = {};
for (const f of fs.readdirSync(root)) if (/^lib-.*\.js$/.test(f)) libs[f.slice(4, -3)] = fs.readFileSync(path.join(root, f), 'utf8');

const THEME = `// الألوان: غيّرها هنا فقط (الباقي يُشتق منها)
const THEME = { ink: '#0B0B0C', bone: '#F6F4F1', white: '#FFFFFF', orange: '#FF5A1F' };`;

let n = 0;
for (const f of fs.readdirSync(path.join(root, 'src')).sort()) {
  if (!f.endsWith('.js') || (only && !f.includes(only))) continue;
  const src = fs.readFileSync(path.join(root, 'src', f), 'utf8');
  const m = src.match(/\/\*META (\{[\s\S]*?\})\*\//);
  if (!m) throw new Error('no META in ' + f);
  const meta = JSON.parse(m[1]);
  const need = (meta.libs || []).map((l) => { if (!libs[l]) throw new Error('missing lib ' + l); return libs[l]; }).join('\n');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${meta.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400..700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Code:wght@400..700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<style>html,body{margin:0;height:100%;overflow:hidden;background:${meta.page || '#0B0B0C'}}body{display:flex;align-items:center;justify-content:center}canvas{display:block}</style>
</head><body><canvas id="c"></canvas>
<script>
(function () {
'use strict';
${THEME}
${harness}
${need}
// ===== ${meta.title} =====
${src.replace(/\/\*META[\s\S]*?\*\/\n?/, '')}
boot(draw);
})();
</script></body></html>
`;
  const slug = f.replace(/\.js$/, '');
  fs.mkdirSync(path.join(root, '..', slug), { recursive: true });
  fs.writeFileSync(path.join(root, '..', slug, 'index.html'), html);
  n++;
}
console.log('built', n);
