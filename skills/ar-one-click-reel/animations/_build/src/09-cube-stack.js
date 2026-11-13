/*META {"title":"Cube Stack","page":"#F6F4F1","libs":["solid"]}*/
const S = 64, SP = 70;
const ORANGE_IDX = new Set([2, 10, 15, 23]), INK_IDX = new Set([5, 12, 21]);
const CUBES = [];
for (let iz = 0; iz < 3; iz++) for (let iy = 0; iy < 3; iy++) for (let ix = 0; ix < 3; ix++) {
  const n = CUBES.length;
  CUBES.push({ g: [ix - 1, iy - 1, iz - 1], kind: ORANGE_IDX.has(n) ? 'o' : INK_IDX.has(n) ? 'k' : 'w' });
}
const PAL = {
  w: { dark: '#B9B6B0', light: '#FFFFFF', line: C.ink },
  o: { dark: mixHex(C.orange, '#000000', 0.38), light: mixHex(C.orange, '#FFFFFF', 0.28), line: C.ink },
  k: { dark: '#050506', light: '#4A4A50', line: '#26262A' },
};

function draw(ctx, t) {
  fillBG(ctx, C.bone);
  dots(ctx, C.ink, 24, 1.2, 0.16);
  const k = lerp(2.5, 1, GL(seg(t, 0.04, 0.72)));
  const a = deg(28) + t * deg(120), b = deg(24);
  const xf = (p) => rotX(rotY(p, a), b);
  const P = (q) => proj(q, W / 2, H / 2 - 18, 1100, 1.22);
  // ظل أرضي يضيق كلما اقتربت المكعبات
  floorShadow(ctx, W / 2, H / 2 + 214, lerp(300, 185, GL(seg(t, 0.04, 0.72))), lerp(60, 36, GL(seg(t, 0.04, 0.72))), lerp(0.14, 0.3, GL(seg(t, 0.04, 0.72))), '#000000');
  const boxes = CUBES.map((c) => Object.assign({ c: [c.g[0] * SP * k, c.g[1] * SP * k, c.g[2] * SP * k], h: [S / 2, S / 2, S / 2] }, PAL[c.kind]));
  drawBoxes(ctx, boxes, xf, P, 1.2);
}
