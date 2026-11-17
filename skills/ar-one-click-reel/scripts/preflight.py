#!/usr/bin/env python3
"""Check, and where it is safe fix, what the plugin needs on this machine.

Usage:
  preflight.py                    check only, print a short report
  preflight.py --json             the same, as JSON
  preflight.py --fix              also install missing Python packages (user level)
  preflight.py --fix-system       also run the install command for ffmpeg / Node,
                                  only after the machine's owner agreed
  preflight.py --with-animations  also check (and with --fix, install) Playwright
                                  for the code-animation layers
  preflight.py --sandbox          this is a disposable cloud workspace: allow
                                  --break-system-packages and root installs

Exit code 0 when every required item is present, 1 otherwise.

What it never does: use sudo on its own, change the system Python, or install
anything outside the Python packages above unless --fix-system is given.
The connected tools (image, voice, video, search) are not checked here:
the model checks those itself, see SKILL.md Stage 0.
"""
import argparse
import json
import os
import platform
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
BUILD = os.path.join(SKILL, "animations", "_build")


def have_module(name):
    try:
        __import__(name)
        return True
    except Exception:
        return False


def raqm_ok():
    try:
        from PIL import features
        return bool(features.check("raqm"))
    except Exception:
        return False


def os_family():
    s = platform.system()
    if s == "Darwin":
        return "mac"
    if s == "Windows":
        return "windows"
    return "linux"


def system_command(pkgs):
    """The install command for system programs, for this OS. pkgs: 'ffmpeg', 'node'."""
    fam = os_family()
    if fam == "mac":
        return ["brew", "install"] + pkgs
    if fam == "windows":
        ids = {"ffmpeg": "Gyan.FFmpeg", "node": "OpenJS.NodeJS.LTS"}
        return ["winget", "install", "-e", "--id"] + [ids[p] for p in pkgs[:1]], \
            [["winget", "install", "-e", "--id", ids[p]] for p in pkgs]
    if shutil.which("apt-get"):
        names = {"ffmpeg": "ffmpeg", "node": "nodejs npm"}
        return ["sudo", "apt-get", "install", "-y"] + " ".join(names[p] for p in pkgs).split()
    if shutil.which("dnf"):
        return ["sudo", "dnf", "install", "-y"] + [{"ffmpeg": "ffmpeg", "node": "nodejs"}[p] for p in pkgs]
    if shutil.which("pacman"):
        return ["sudo", "pacman", "-S", "--noconfirm"] + [{"ffmpeg": "ffmpeg", "node": "nodejs npm"}[p] for p in pkgs]
    return None


def system_commands(pkgs):
    """List of argv lists to run, one per command (winget installs one id at a time)."""
    cmd = system_command(pkgs)
    if cmd is None:
        return []
    if isinstance(cmd, tuple):
        return cmd[1]
    return [cmd]


def run_check():
    items = []

    def add(id_, label, level, ok, detail, fix=None):
        items.append({"id": id_, "label": label, "level": level, "ok": bool(ok),
                      "detail": detail, "fix": fix})

    v = sys.version_info
    add("python", "Python 3.8 or newer", "required", v >= (3, 8),
        "%d.%d.%d" % v[:3], None if v >= (3, 8) else {"kind": "manual", "text": "Install Python 3.8+ from python.org"})

    pil = have_module("PIL")
    add("pillow", "Pillow (image library)", "required", pil,
        "installed" if pil else "missing",
        None if pil else {"kind": "pip", "pkgs": ["Pillow"]})

    raqm = pil and raqm_ok()
    shaper = have_module("arabic_reshaper") and have_module("bidi")
    add("arabic-shaping", "Arabic letter shaping (Raqm, or arabic-reshaper + python-bidi)",
        "required", raqm or shaper,
        "Raqm" if raqm else ("reshaper+bidi" if shaper else "missing: Arabic titles would come out broken"),
        None if (raqm or shaper) else {"kind": "pip", "pkgs": ["arabic-reshaper", "python-bidi"]})

    for tool in ("ffmpeg", "ffprobe"):
        path = shutil.which(tool)
        add(tool, tool, "required", path, path or "missing",
            None if path else {"kind": "system", "pkgs": ["ffmpeg"]})

    fonts_dir = os.path.join(SKILL, "assets", "fonts")
    n_fonts = len([f for f in os.listdir(fonts_dir) if f.lower().endswith((".ttf", ".otf"))]) \
        if os.path.isdir(fonts_dir) else 0
    add("fonts", "Bundled Arabic fonts", "required", n_fonts >= 1,
        "%d font files" % n_fonts,
        None if n_fonts else {"kind": "manual", "text": "Reinstall the plugin: assets/fonts is empty"})

    node = shutil.which("node")
    add("node", "Node.js (code-animation layers only)", "optional", node,
        node or "missing: the code animations cannot be exported",
        None if node else {"kind": "system", "pkgs": ["node"]})

    pw = False
    if node and os.path.isdir(BUILD):
        try:
            r = subprocess.run([node, "-e", "require.resolve('playwright')"], cwd=BUILD,
                               capture_output=True, timeout=30)
            pw = r.returncode == 0
        except Exception:
            pw = False
    add("playwright", "Playwright (code-animation layers only)", "optional", pw,
        "installed" if pw else "missing: the code animations cannot be exported",
        None if pw else {"kind": "npm"})
    return items


def pip_install(pkgs, sandbox):
    cmd = [sys.executable, "-m", "pip", "install", "--quiet"]
    if sandbox:
        cmd.append("--break-system-packages")
    else:
        cmd.append("--user")
    cmd += pkgs
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 and not sandbox and "externally-managed" in (r.stderr or ""):
        return False, ("This Python is managed by the system. Create a virtual environment "
                       "(python3 -m venv .venv, then activate it) and run this again.")
    return r.returncode == 0, (r.stderr or "").strip()[-400:]


def run_argv(argv, sandbox):
    if argv and argv[0] == "sudo":
        is_root = hasattr(os, "geteuid") and os.geteuid() == 0
        if is_root:
            argv = argv[1:]
        elif not sandbox:
            return False, "needs administrator rights: run it yourself: " + " ".join(argv)
    try:
        r = subprocess.run(argv, capture_output=True, text=True)
    except FileNotFoundError:
        return False, "%s is not available on this machine" % argv[0]
    return r.returncode == 0, (r.stderr or "").strip()[-400:]


def fix(items, args):
    log = []
    pip_pkgs = []
    for it in items:
        if not it["ok"] and it["fix"] and it["fix"]["kind"] == "pip":
            pip_pkgs += it["fix"]["pkgs"]
    if pip_pkgs:
        ok, msg = pip_install(sorted(set(pip_pkgs)), args.sandbox)
        log.append({"step": "pip " + " ".join(sorted(set(pip_pkgs))), "ok": ok, "note": msg})

    if args.fix_system:
        sys_pkgs = []
        for it in items:
            if not it["ok"] and it["fix"] and it["fix"]["kind"] == "system":
                if it["level"] == "required" or args.with_animations:
                    sys_pkgs += it["fix"]["pkgs"]
        sys_pkgs = sorted(set(sys_pkgs))
        if sys_pkgs:
            cmds = system_commands(sys_pkgs)
            if not cmds:
                log.append({"step": "system " + " ".join(sys_pkgs), "ok": False,
                            "note": "no known package manager on this machine"})
            for argv in cmds:
                ok, msg = run_argv(argv, args.sandbox)
                log.append({"step": " ".join(argv), "ok": ok, "note": msg})

    if args.with_animations and shutil.which("npm") and os.path.isdir(BUILD):
        for it in items:
            if it["id"] == "playwright" and not it["ok"]:
                for argv in (["npm", "install", "--no-save", "playwright"],
                             ["npx", "playwright", "install", "chromium"]):
                    try:
                        r = subprocess.run(argv, cwd=BUILD, capture_output=True, text=True)
                        log.append({"step": " ".join(argv), "ok": r.returncode == 0,
                                    "note": (r.stderr or "").strip()[-300:]})
                    except FileNotFoundError:
                        log.append({"step": " ".join(argv), "ok": False, "note": "not available"})
    return log


def system_hint(items, with_animations=False):
    pkgs = []
    for it in items:
        if not it["ok"] and it["fix"] and it["fix"]["kind"] == "system":
            if it["level"] == "required" or with_animations:
                pkgs += it["fix"]["pkgs"]
    pkgs = sorted(set(pkgs))
    if not pkgs:
        return None
    cmds = system_commands(pkgs)
    return [" ".join(c) for c in cmds] or ["no known package manager: install %s by hand" % ", ".join(pkgs)]


def main():
    ap = argparse.ArgumentParser(description="Check what the plugin needs on this machine.")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--fix", action="store_true")
    ap.add_argument("--fix-system", action="store_true")
    ap.add_argument("--with-animations", action="store_true")
    ap.add_argument("--sandbox", action="store_true")
    args = ap.parse_args()

    items = run_check()
    log = []
    if args.fix or args.fix_system:
        log = fix(items, args)
        items = run_check()

    required_missing = [i for i in items if i["level"] == "required" and not i["ok"]]
    optional_missing = [i for i in items if i["level"] == "optional" and not i["ok"]]
    hint = system_hint(items, args.with_animations)
    result = {"ready": not required_missing,
              "os": os_family(),
              "items": items,
              "fix_log": log,
              "system_commands_to_run": hint}

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        for i in items:
            mark = "OK     " if i["ok"] else ("MISSING" if i["level"] == "required" else "optional")
            print("[%s] %s  (%s)" % (mark, i["label"], i["detail"]))
        for l in log:
            print("  fix %s: %s %s" % ("done" if l["ok"] else "FAILED", l["step"], l["note"]))
        if required_missing:
            print("\nNot ready. Missing: " + ", ".join(i["id"] for i in required_missing))
            if hint:
                print("Run on this machine (needs the owner's agreement):")
                for h in hint:
                    print("  " + h)
        else:
            print("\nReady." + (" Optional items missing: " + ", ".join(i["id"] for i in optional_missing)
                                 if optional_missing else ""))
    sys.exit(0 if not required_missing else 1)


if __name__ == "__main__":
    main()
