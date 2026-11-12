#!/usr/bin/env python3
"""Build the numbered choice boards shown to the creator before production.

  font-board.png      every bundled font, drawn in its own letterforms, numbered
  palette-board.png   every color theme, numbered
  style-board.png     every paper style, numbered (uses sample images when present)

The boards are generated from assets/fonts.json, assets/palettes.json and
assets/styles.json. Edit those files (or drop new fonts / sample images into
assets/), then run this script again.

Usage: make_boards.py [fonts] [palettes] [styles] [--sample "نص تجريبي"] [--out DIR]
       (no board names = build all three)
"""
import argparse
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont, features

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
UI_FONT = os.path.join(ASSETS, "fonts", "Cairo.ttf")

BG, CARD, INK, MUTED, BADGE = "#F4EFE6", "#FFFFFF", "#1E1B18", "#6F675E", "#B3261E"

if not features.check("raqm"):
    sys.exit("This script needs Pillow with Raqm support to draw Arabic correctly.")
RTL = {"direction": "rtl", "language": "ar"}


def font(path, size, weight=None):
    f = ImageFont.truetype(path, size, layout_engine=ImageFont.Layout.RAQM)
    if weight:
        try:
            axes = f.get_variation_axes()
        except OSError:
            axes = None
        if axes:
            vals = []
            for ax in axes:
                tag = ax.get("name")
                tag = tag.decode() if isinstance(tag, bytes) else str(tag)
                vals.append(max(ax["minimum"], min(ax["maximum"], weight))
                            if tag.lower() in ("weight", "wght") else ax["default"])
            f.set_variation_by_axes(vals)
    return f


def ui(size, weight=600):
    return font(UI_FONT, size, weight)


def badge(d, cx, cy, r, n):
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=BADGE)
    f = ui(int(r * 1.05), 800)
    d.text((cx, cy), str(n), font=f, fill="#FFFFFF", anchor="mm")


def header(img, title, subtitle):
    d = ImageDraw.Draw(img)
    d.text((img.width - 60, 70), title, font=ui(58, 800), fill=INK, anchor="rm", **RTL)
    d.text((img.width - 60, 135), subtitle, font=ui(30, 500), fill=MUTED, anchor="rm", **RTL)
    return 190


def load(name):
    with open(os.path.join(ASSETS, name), encoding="utf-8") as f:
        return json.load(f)


def fit(path, text, max_w, start, weight):
    size = start
    d = ImageDraw.Draw(Image.new("L", (4, 4)))
    while size > 20:
        f = font(path, size, weight)
        b = d.textbbox((0, 0), text, font=f, **RTL)
        if b[2] - b[0] <= max_w:
            return f
        size = int(size * 0.93)
    return font(path, size, weight)


def fonts_board(out, sample):
    data = load("fonts.json")
    sample = sample or data.get("sample", "رحلة الورق")
    items = data["fonts"]
    cols, cw, ch, gap, pad = 2, 860, 190, 22, 50
    rows = -(-len(items) // cols)
    W = pad * 2 + cols * cw + (cols - 1) * gap
    img = Image.new("RGB", (W, 190 + rows * (ch + gap) + pad), BG)
    top = header(img, "اختر الخطوط بالرقم", "رقم للخط الأساسي (العناوين) ورقم للخط الفرعي (التواريخ والأرقام والنصوص الثانوية)")
    d = ImageDraw.Draw(img)
    for i, it in enumerate(items):
        r, c = divmod(i, cols)
        c = cols - 1 - c  # right-to-left reading order
        x, y = pad + c * (cw + gap), top + r * (ch + gap)
        d.rounded_rectangle((x, y, x + cw, y + ch), 22, fill=CARD)
        badge(d, x + cw - 62, y + ch // 2, 40, it["id"])
        path = os.path.join(ASSETS, "fonts", it["file"])
        f = fit(path, sample, cw - 190, 84, it.get("weight"))
        d.text((x + cw - 130, y + 78), sample, font=f, fill=INK, anchor="rm", **RTL)
        d.text((x + cw - 130, y + 152), f'{it["ar"]}  ·  {it["style"]}  ·  {it["best_for"]}',
               font=ui(24, 500), fill=MUTED, anchor="rm", **RTL)
        d.text((x + 26, y + 152), it["name"], font=ui(22, 500), fill=MUTED, anchor="lm")
    path = os.path.join(out, "font-board.png")
    img.save(path)
    return path


def palettes_board(out, sample):
    data = load("palettes.json")
    items = data["palettes"]
    cols, cw, ch, gap, pad = 3, 560, 400, 24, 50
    rows = -(-len(items) // cols)
    W = pad * 2 + cols * cw + (cols - 1) * gap
    img = Image.new("RGB", (W, 190 + rows * (ch + gap) + pad), BG)
    top = header(img, "اختر ثيم الألوان بالرقم", "أو اكتب ألوانك الخاصة. كل ثيم يتضمن لون عنوان واضحًا على خلفيته")
    d = ImageDraw.Draw(img)
    for i, p in enumerate(items):
        r, c = divmod(i, cols)
        c = cols - 1 - c
        x, y = pad + c * (cw + gap), top + r * (ch + gap)
        colors = p["colors"]
        d.rounded_rectangle((x, y, x + cw, y + ch), 24, fill=colors[0])
        # sample title on its own background
        d.text((x + cw - 40, y + 86), p["ar"], font=ui(60, 800), fill=p["title_edge"],
               anchor="rm", **RTL)
        d.text((x + cw - 44, y + 82), p["ar"], font=ui(60, 800), fill=p["title"],
               anchor="rm", **RTL)
        d.text((x + cw - 40, y + 150), p["mood"], font=ui(26, 500), fill=p["title"],
               anchor="rm", **RTL)
        # swatches
        sw = (cw - 80 - 4 * 12) // 5
        for k, col in enumerate(colors):
            sx = x + 40 + k * (sw + 12)
            d.rounded_rectangle((sx, y + 210, sx + sw, y + 320), 14, fill=col,
                                outline=p["title"], width=2)
            d.text((sx + sw // 2, y + 348), col.upper(), font=ui(17, 500), fill=p["title"],
                   anchor="mm")
        badge(d, x + 58, y + 82, 38, p["id"])
    path = os.path.join(out, "palette-board.png")
    img.save(path)
    return path


def wrap(d, text, f, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textbbox((0, 0), t, font=f, **RTL)[2] <= max_w:
            cur = t
        else:
            lines.append(cur)
            cur = w
    return lines + [cur] if cur else lines


def styles_board(out, sample):
    data = load("styles.json")
    items = data["styles"]
    cols, cw, ih, th, gap, pad = 3, 520, 780, 230, 26, 50
    ch = ih + th
    rows = -(-len(items) // cols)
    W = pad * 2 + cols * cw + (cols - 1) * gap
    img = Image.new("RGB", (W, 190 + rows * (ch + gap) + pad), BG)
    top = header(img, "اختر الأسلوب البصري بالرقم", "كل الأساليب ورقية. بعد الاختيار يُولَّد مشهد تجريبي واحد للاعتماد قبل بقية المشاهد")
    d = ImageDraw.Draw(img)
    missing = 0
    for i, s in enumerate(items):
        r, c = divmod(i, cols)
        c = cols - 1 - c
        x, y = pad + c * (cw + gap), top + r * (ch + gap)
        d.rounded_rectangle((x, y, x + cw, y + ch), 24, fill=CARD)
        src = os.path.join(ASSETS, s.get("image", ""))
        if s.get("image") and os.path.exists(src):
            im = Image.open(src).convert("RGB")
            k = max(cw / im.width, ih / im.height)
            im = im.resize((int(im.width * k) + 1, int(im.height * k) + 1), Image.LANCZOS)
            lx, ty = (im.width - cw) // 2, (im.height - ih) // 2
            tile = im.crop((lx, ty, lx + cw, ty + ih))
            mask = Image.new("L", (cw, ih), 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, cw, ih + 40), 24, fill=255)
            img.paste(tile, (x, y), mask)
        else:
            missing += 1
            d.rounded_rectangle((x + 16, y + 16, x + cw - 16, y + ih - 8), 16, fill="#E7E0D3")
            d.text((x + cw // 2, y + ih // 2), "لا توجد صورة نموذجية بعد", font=ui(28, 500),
                   fill=MUTED, anchor="mm", **RTL)
        badge(d, x + cw - 58, y + 58, 40, s["id"])
        d.text((x + cw - 24, y + ih + 44), s["ar"], font=ui(34, 800), fill=INK, anchor="rm", **RTL)
        f = ui(23, 500)
        for li, line in enumerate(wrap(d, s["desc"], f, cw - 48)[:4]):
            d.text((x + cw - 24, y + ih + 96 + li * 36), line, font=f, fill=MUTED,
                   anchor="rm", **RTL)
    path = os.path.join(out, "style-board.png")
    img.save(path)
    if missing:
        print(f"note: {missing} style(s) have no sample image yet "
              "(put them in assets/styles/ as named in styles.json).", file=sys.stderr)
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("boards", nargs="*", choices=["fonts", "palettes", "styles", []],
                    help="which boards to build (default: all)")
    ap.add_argument("--sample", help="sample text for the font board (e.g. the video title)")
    ap.add_argument("--out", default=ASSETS, help="output folder (default: the assets folder)")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    todo = a.boards or ["fonts", "palettes", "styles"]
    build = {"fonts": fonts_board, "palettes": palettes_board, "styles": styles_board}
    for name in todo:
        print("built", os.path.normpath(build[name](a.out, a.sample)))


if __name__ == "__main__":
    main()
