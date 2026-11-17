#!/usr/bin/env python3
"""Build a color theme from an image the creator uploads.

Usage: python3 palette_from_image.py IMAGE [--name "اسم الثيم"] [--json]

Picks five roles (background, primary, secondary, accent, deep) from the image's
dominant colors, then a title color whose contrast with the background is at least 4.5.
Output matches one entry of assets/palettes.json, so the result can be shown as a
swatch and used like any built-in theme. The creator confirms before it is adopted.
"""
import argparse, colorsys, json, sys
from PIL import Image


def lum(rgb):
    def f(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def hexc(c):
    return "#%02X%02X%02X" % tuple(c)


def sat(c):
    return colorsys.rgb_to_hsv(*(x / 255 for x in c))[1]


def dist(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5


def dominant(path, n=10):
    im = Image.open(path).convert("RGB")
    im.thumbnail((240, 240))
    q = im.quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    out = []
    for cnt, idx in counts:
        out.append((tuple(pal[idx * 3: idx * 3 + 3]), cnt))
    return out


def build(path, name):
    cols = dominant(path)
    total = sum(c for _, c in cols)
    colors = [c for c, _ in cols]
    # background: the most common light color, else the lightest
    light = [c for c, _ in cols if lum(c) > 0.45] or [max(colors, key=lum)]
    bg = light[0]
    deep = min(colors, key=lum)
    rest = [c for c in colors if c not in (bg, deep)]
    # accent: most saturated, distinct from the others
    accent = max(rest, key=lambda c: sat(c) * (0.5 + lum(c))) if rest else deep
    rest = [c for c in rest if dist(c, accent) > 40] or rest
    # primary: the most common remaining mid-tone far from the background
    mids = [c for c in rest if dist(c, bg) > 60] or rest
    primary = mids[0] if mids else deep
    others = [c for c in mids if dist(c, primary) > 40] or mids
    secondary = others[0] if others else primary
    title = deep if contrast(deep, bg) >= 4.5 else ((0, 0, 0) if lum(bg) > 0.5 else (255, 255, 255))
    return {
        "ar": name, "en": "From image", "mood": "مستخرج من صورة الشخص",
        "colors": [hexc(bg), hexc(primary), hexc(secondary), hexc(accent), hexc(deep)],
        "title": hexc(title), "title_edge": hexc(accent),
        "title_contrast": round(contrast(title, bg), 1),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image")
    ap.add_argument("--name", default="ألواني من الصورة")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    t = build(a.image, a.name)
    if a.json:
        print(json.dumps(t, ensure_ascii=False, indent=2))
    else:
        roles = ["الخلفية", "الأساسي", "الثانوي", "التمييز", "الداكن"]
        for r, c in zip(roles, t["colors"]):
            print(f"{r}  {c}")
        print(f"العنوان  {t['title']}  (تباين {t['title_contrast']})")


if __name__ == "__main__":
    sys.exit(main())
