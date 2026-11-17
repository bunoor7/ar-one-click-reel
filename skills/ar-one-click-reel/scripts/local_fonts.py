"""Fonts the creator keeps on their own machine, never shipped with the plugin.

Drop .ttf / .otf files in ~/ar-one-click-reel-fonts (or the folder named by the
AR_REEL_FONTS environment variable). They get numbers from 101 up, in file-name
order, and appear on the font board after the bundled fonts. The plugin only
reads them where they are. It does not copy them into the plugin or upload them.
"""
import os

START = 101


def folder():
    return os.environ.get("AR_REEL_FONTS") or os.path.join(os.path.expanduser("~"), "ar-one-click-reel-fonts")


def local_fonts():
    d = folder()
    if not os.path.isdir(d):
        return []
    files = sorted(f for f in os.listdir(d) if f.lower().endswith((".ttf", ".otf")))
    out = []
    for i, f in enumerate(files):
        name = os.path.splitext(f)[0]
        out.append({"id": START + i, "path": os.path.join(d, f), "name": name, "ar": name,
                    "style": "خط محلي من جهازك", "best_for": "حسب ذوقك"})
    return out
