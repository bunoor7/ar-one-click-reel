#!/usr/bin/env python3
"""Render an exact Arabic title as a paper-cut layer.

The text is shaped with real OpenType shaping (Pillow + Raqm/HarfBuzz),
so letters are always joined and ordered correctly. The title gets a
paper look: a cardstock face with fine grain, an extruded cut edge, and
a soft contact shadow that falls away from the light.

The title color is checked against the background it sits on. With the
default --color auto, the script picks the readable option by itself;
with an explicit color it refuses to write a title that is hard to read.

Examples:
  # burn a title into a text-free scene image, bundled font 5, theme 3
  arabic_title.py --image clean.png --out scene.png \
      --text "جنون التوليب" --font 5 --theme 3 --position top

  # title only, transparent background, checked against the scene it will sit on
  arabic_title.py --transparent --check-against scene.png --out title.png \
      --text "ليلة إسطنبول" --font 9

--font takes a number from assets/fonts.json (see assets/font-board.png)
or a path to any .ttf/.otf Arabic font.
Use "\\n" inside --text (or --text-file) for multiple lines.
"""
import argparse
import json
import os
import random
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, features

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
LIGHT_PAPER, DARK_PAPER = (246, 238, 220), (42, 29, 20)

LIGHTS = {  # direction the light comes FROM -> unit vector the shadow falls TO
    "top-left": (1, 1), "top": (0, 1), "top-right": (-1, 1),
    "left": (1, 0), "right": (-1, 0),
}


def hex_rgb(s):
    s = s.lstrip("#")
    if len(s) == 3:
        s = "".join(c * 2 for c in s)
    if len(s) != 6:
        raise argparse.ArgumentTypeError(f"bad color: {s}")
    try:
        return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))
    except ValueError:
        raise argparse.ArgumentTypeError(f"bad color: {s}")


def color_arg(s):
    return None if s.lower() == "auto" else hex_rgb(s)


def luminance(rgb):
    c = [v / 255 for v in rgb]
    c = [v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def shade(rgb, k):
    """k < 1 darkens, k > 1 lightens toward white."""
    if k <= 1:
        return tuple(int(c * k) for c in rgb)
    return tuple(int(c + (255 - c) * (k - 1)) for c in rgb)


def make_shaper():
    """Return (layout_kwargs, text_transform). Refuse to run without shaping."""
    if features.check("raqm"):
        return {"direction": "rtl", "language": "ar"}, (lambda t: t)
    try:
        import arabic_reshaper
        from bidi.algorithm import get_display
    except ImportError:
        sys.exit("Arabic shaping is unavailable: this Pillow build has no Raqm support and "
                 "arabic-reshaper / python-bidi are not installed.\n"
                 "Fix: pip install arabic-reshaper python-bidi   (or install libraqm).\n"
                 "Refusing to render, because the Arabic would come out broken.")
    return {}, (lambda t: get_display(arabic_reshaper.reshape(t)))


def resolve_font(spec):
    """A number picks a bundled font; anything else is a file path."""
    if spec.isdigit():
        with open(os.path.join(ASSETS, "fonts.json"), encoding="utf-8") as f:
            fonts = {x["id"]: x for x in json.load(f)["fonts"]}
        it = fonts.get(int(spec))
        if not it:
            sys.exit(f"No bundled font number {spec}. Valid numbers: 1-{max(fonts)}.")
        return os.path.join(ASSETS, "fonts", it["file"]), it.get("weight")
    return spec, None


def load_theme(n):
    with open(os.path.join(ASSETS, "palettes.json"), encoding="utf-8") as f:
        pals = {p["id"]: p for p in json.load(f)["palettes"]}
    p = pals.get(n)
    if not p:
        sys.exit(f"No theme number {n}. Valid numbers: 1-{max(pals)}.")
    return p


def load_font(path, size, weight, basic):
    engine = ImageFont.Layout.BASIC if basic else ImageFont.Layout.RAQM
    try:
        font = ImageFont.truetype(path, size, layout_engine=engine)
    except OSError as e:
        sys.exit(f"Cannot use font {path}: {e}. Use a scalable .ttf/.otf Arabic font, "
                 "or a bundled font number (see assets/font-board.png).")
    if weight is not None:
        try:
            axes = font.get_variation_axes()
        except OSError:
            axes = None  # static font: weight does not apply
        if axes:
            values = []
            for ax in axes:
                tag = ax.get("name")
                tag = tag.decode() if isinstance(tag, bytes) else str(tag)
                if tag.lower() in ("weight", "wght"):
                    values.append(max(ax["minimum"], min(ax["maximum"], weight)))
                else:
                    values.append(ax["default"])
            font.set_variation_by_axes(values)
    return font


def measure(lines, font, kw, spacing):
    d = ImageDraw.Draw(Image.new("L", (8, 8)))
    boxes = [d.textbbox((0, 0), ln, font=font, **kw) for ln in lines]
    asc, desc = font.getmetrics()
    line_h = asc + desc
    width = max(b[2] - b[0] for b in boxes)
    height = int(line_h * (1 + (len(lines) - 1) * spacing))
    return boxes, width, height, line_h


def background_color(img, box):
    """Median color of the area the title will cover."""
    x0, y0, x1, y1 = [int(v) for v in box]
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(img.width, x1), min(img.height, y1)
    if x1 <= x0 or y1 <= y0:
        return None
    region = img.convert("RGB").crop((x0, y0, x1, y1)).resize((48, 48), Image.BILINEAR)
    px = list(region.get_flattened_data() if hasattr(region, "get_flattened_data")
              else region.getdata())
    return tuple(sorted(p[i] for p in px)[len(px) // 2] for i in range(3))


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--image", help="scene image to draw the title onto")
    src.add_argument("--transparent", action="store_true",
                     help="output the title alone on a transparent canvas")
    ap.add_argument("--canvas", default="1080x1920", help="canvas size for --transparent (WxH)")
    ap.add_argument("--check-against",
                    help="with --transparent: the scene the title will be placed over, "
                         "used to choose and verify the title color")
    txt = ap.add_mutually_exclusive_group(required=True)
    txt.add_argument("--text", help='Arabic title; use "\\n" for a line break')
    txt.add_argument("--text-file", help="UTF-8 file holding the title")
    ap.add_argument("--font", required=True,
                    help="bundled font number (assets/fonts.json) or path to a .ttf/.otf font")
    ap.add_argument("--weight", type=float, default=None,
                    help="weight for variable fonts, e.g. 700")
    ap.add_argument("--out", required=True, help="output PNG path")
    ap.add_argument("--size", type=int, default=None,
                    help="font size in px (default: fit --max-width)")
    ap.add_argument("--max-width", type=float, default=0.78,
                    help="max title width as a share of image width (default 0.78)")
    ap.add_argument("--max-size", type=float, default=0.11,
                    help="max auto font size as a share of image height (default 0.11)")
    ap.add_argument("--position", choices=["top", "upper", "center", "lower", "bottom"],
                    default="top", help="vertical placement inside the safe area")
    ap.add_argument("--y", type=float, default=None,
                    help="title center as a share of height (overrides --position)")
    ap.add_argument("--x", type=float, default=0.5, help="title center as a share of width")
    ap.add_argument("--align", choices=["center", "right", "left"], default="center")
    ap.add_argument("--line-spacing", type=float, default=1.0,
                    help="line height multiplier (default 1.0)")
    ap.add_argument("--theme", type=int, default=None,
                    help="color theme number (assets/palettes.json): supplies title colors")
    ap.add_argument("--color", type=color_arg, default=None,
                    help="paper face color as hex, or 'auto' (default): the most readable "
                         "choice for the background")
    ap.add_argument("--edge-color", type=hex_rgb, default=None,
                    help="cut-edge color (default: from the theme, or a shade of the face)")
    ap.add_argument("--min-contrast", type=float, default=4.5,
                    help="minimum contrast ratio between title and background (default 4.5)")
    ap.add_argument("--force", action="store_true",
                    help="write the file even if the contrast is below --min-contrast")
    ap.add_argument("--depth", type=float, default=0.08,
                    help="paper thickness as a share of font size (default 0.08; 0 = flat)")
    ap.add_argument("--shadow", type=float, default=0.6, help="shadow opacity 0-1 (0 = none)")
    ap.add_argument("--light", choices=sorted(LIGHTS), default="top-left",
                    help="where the scene's key light comes from")
    ap.add_argument("--grain", type=float, default=0.06, help="paper grain strength 0-0.3")
    ap.add_argument("--seed", type=int, default=7, help="grain seed, for repeatable output")
    a = ap.parse_args()

    text = a.text if a.text is not None else open(a.text_file, encoding="utf-8-sig").read()
    lines = [ln.strip() for ln in text.replace("\\n", "\n").splitlines() if ln.strip()]
    if not lines:
        sys.exit("The title is empty.")

    kw, transform = make_shaper()
    basic = not kw
    lines = [transform(ln) for ln in lines]

    font_path, default_weight = resolve_font(a.font)
    weight = a.weight if a.weight is not None else default_weight
    theme = load_theme(a.theme) if a.theme else None

    if a.image:
        base = Image.open(a.image).convert("RGBA")
        backdrop = base
    else:
        try:
            w, h = (int(v) for v in a.canvas.lower().split("x"))
        except ValueError:
            sys.exit("--canvas must look like 1080x1920")
        base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        backdrop = None
        if a.check_against:
            backdrop = Image.open(a.check_against).convert("RGBA").resize((w, h))
    W, H = base.size

    # --- choose the font size ---
    limit_w = W * a.max_width
    if a.size:
        size = a.size
    else:
        size = int(H * a.max_size)
        while size > 12:
            f = load_font(font_path, size, weight, basic)
            if measure(lines, f, kw, a.line_spacing)[1] <= limit_w:
                break
            size = int(size * 0.94)
    font = load_font(font_path, size, weight, basic)
    boxes, tw, th, line_h = measure(lines, font, kw, a.line_spacing)
    if tw > W * 0.96:
        print(f"warning: title is {tw}px wide on a {W}px image; it may be cut off. "
              "Shorten it, add a line break, or lower --size.", file=sys.stderr)

    depth = max(0, int(round(size * a.depth)))
    sx, sy = LIGHTS[a.light]
    pad = int(size * 0.6) + depth * 3
    lw, lh = tw + pad * 2, th + pad * 2

    # --- placement inside platform-safe margins ---
    centers = {"top": 0.20, "upper": 0.32, "center": 0.50, "lower": 0.66, "bottom": 0.76}
    cy = a.y if a.y is not None else centers[a.position]
    px = int(W * a.x - lw / 2)
    py = int(H * cy - lh / 2)

    # --- choose and verify the color against what is behind the title ---
    bg = background_color(backdrop, (px + pad, py + pad, px + pad + tw, py + pad + th)) \
        if backdrop is not None else None
    face = a.color
    if face is None:
        candidates = []
        if theme:
            candidates += [hex_rgb(theme["title"]), hex_rgb(theme["colors"][0]),
                           hex_rgb(theme["colors"][4])]
        candidates += [LIGHT_PAPER, DARK_PAPER]
        if bg is None:
            face = candidates[0]
        else:
            # keep the theme's own title color when it is readable, else take the best
            face = next((c for c in candidates[:1] if contrast(c, bg) >= a.min_contrast),
                        max(candidates, key=lambda c: contrast(c, bg)))
    ratio = contrast(face, bg) if bg is not None else None
    if ratio is not None and ratio < a.min_contrast:
        msg = (f"Title color #{'%02X%02X%02X' % face} on background "
               f"#{'%02X%02X%02X' % bg} has contrast {ratio:.1f}, below {a.min_contrast}. "
               "It would be hard to read on a phone.")
        if not a.force:
            sys.exit(msg + "\nUse --color auto, pick another color or position, "
                           "or pass --force to write it anyway.")
        print("warning: " + msg, file=sys.stderr)
    if bg is None and not a.transparent:
        print("note: could not sample the background; contrast not checked.", file=sys.stderr)
    if bg is None and a.transparent:
        print("note: no --check-against scene given, so the title contrast was NOT checked.",
              file=sys.stderr)

    if a.edge_color:
        edge = a.edge_color
    elif theme and a.color is None and contrast(hex_rgb(theme["title_edge"]), face) >= 1.6:
        edge = hex_rgb(theme["title_edge"])
    else:
        # a darker side for light paper, a lighter side for dark paper
        edge = shade(face, 0.6) if luminance(face) > 0.18 else shade(face, 1.45)

    # --- face mask on a padded layer ---
    mask = Image.new("L", (lw, lh), 0)
    md = ImageDraw.Draw(mask)
    for i, (ln, b) in enumerate(zip(lines, boxes)):
        w_ln = b[2] - b[0]
        if a.align == "center":
            x = pad + (tw - w_ln) / 2
        elif a.align == "right":
            x = pad + (tw - w_ln)
        else:
            x = pad
        y = pad + i * line_h * a.line_spacing
        md.text((x - b[0], y), ln, font=font, fill=255, **kw)

    # close the hairline seams that anti-aliasing leaves where joined glyphs meet
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))

    if mask.getbbox() is None:
        sys.exit("Nothing was drawn. The font probably has no Arabic glyphs: " + font_path)

    layer = Image.new("RGBA", (lw, lh), (0, 0, 0, 0))

    # soft contact shadow, falling away from the light
    if a.shadow > 0:
        off = depth + max(2, int(size * 0.05))
        sh = ImageChops.offset(mask, int(sx * off), int(sy * off))
        sh = sh.filter(ImageFilter.GaussianBlur(max(1.5, size * 0.035)))
        sh = sh.point(lambda v: int(v * a.shadow))
        layer = Image.alpha_composite(layer, Image.merge("RGBA", (
            Image.new("L", (lw, lh), 0),) * 3 + (sh,)))

    # extruded cut edge
    if depth > 0:
        ext = Image.new("L", (lw, lh), 0)
        for k in range(1, depth + 1):
            ext = ImageChops.lighter(ext, ImageChops.offset(mask, int(round(sx * k)),
                                                            int(round(sy * k))))
        layer = Image.alpha_composite(layer, Image.merge("RGBA", (
            *[Image.new("L", (lw, lh), c) for c in edge], ext)))

    # paper face with fine grain and a faint lit edge
    face_img = Image.new("RGB", (lw, lh), face)
    if a.grain > 0:
        rnd = random.Random(a.seed)
        small = Image.new("L", (max(1, lw // 2), max(1, lh // 2)))
        small.putdata([rnd.randint(0, 255) for _ in range(small.width * small.height)])
        noise = small.resize((lw, lh), Image.BILINEAR).filter(ImageFilter.GaussianBlur(0.6))
        amp = int(255 * min(0.3, a.grain))
        noise = noise.point(lambda v: 128 + int((v - 128) * amp / 128))
        face_img = ImageChops.overlay(face_img, Image.merge("RGB", (noise,) * 3))
    hl_off = max(1, int(size * 0.012))
    hl = ImageChops.subtract(mask, ImageChops.offset(mask, -int(sx * hl_off),
                                                     -int(sy * hl_off)))
    hl = hl.filter(ImageFilter.GaussianBlur(0.8)).point(lambda v: int(v * 0.35))
    face_img = Image.composite(Image.new("RGB", (lw, lh), shade(face, 1.5)), face_img, hl)
    face_img = face_img.convert("RGBA")
    face_img.putalpha(mask)
    layer = Image.alpha_composite(layer, face_img)

    out = base.copy()
    out.alpha_composite(layer, (max(-lw, min(W, px)), max(-lh, min(H, py))))

    if not a.transparent and not a.out.lower().endswith(".png"):
        out = out.convert("RGB")
    out.save(a.out)
    engine = "raqm" if not basic else "reshaper+bidi"
    info = f"contrast {ratio:.1f}" if ratio is not None else "contrast not checked"
    print(f"saved {a.out}  {W}x{H}  font-size {size}px  title {tw}x{th}px  "
          f"color #{'%02X%02X%02X' % face}  {info}  shaping: {engine}")


if __name__ == "__main__":
    main()
