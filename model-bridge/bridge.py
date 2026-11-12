#!/usr/bin/env python3
"""AR Model Bridge: ask other AI models from the command line, keys kept in the
operating system's secret store.

  python bridge.py doctor                      check the setup (never prints keys)
  python bridge.py keys set openai             type a key (hidden); stored in the OS keychain
  python bridge.py keys list | delete NAME
  python bridge.py models [--live PROVIDER]
  python bridge.py check [--model p:m ...]     one tiny test call per model
  python bridge.py ask --model p:m [--model p2:m2] --prompt-file brief.txt \\
        [--file notes.txt] [--out answers/]
  python bridge.py image --model p:m --prompt-file p.txt --out scene.png --aspect 9:16
"""
import argparse
import getpass
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bridge_core as core  # noqa: E402
import bridge_secrets as sec  # noqa: E402


def _prompt_text(a):
    if a.prompt_file:
        with open(a.prompt_file, encoding="utf-8-sig") as f:
            return f.read()
    if a.prompt:
        return a.prompt
    raise core.BridgeError("Give --prompt or --prompt-file.")


def cmd_doctor(a):
    ok_all = True
    print(f"Python {sys.version.split()[0]}")
    name, ok, note = sec.backend_info()
    print(f"Secret store: {name} -> {'OK' if ok else 'PROBLEM'} ({note})")
    ok_all &= ok
    print(f"Config: {core.config_path()} -> {'found' if os.path.exists(core.config_path()) else 'MISSING'}")
    if not os.path.exists(core.config_path()):
        return 1
    cfg = core.load_config()
    for row in core.list_configured(cfg):
        print(f"  provider {row['provider']} ({row['type']}): key {row['key']}")
    print(f"Allowed folders for files: {cfg['allowed_dirs'] or 'none (files are off)'}")
    print(f"Calls today: {core.calls_today()} of {cfg['limits']['max_calls_per_day']}")
    return 0 if ok_all else 1


def cmd_keys(a):
    if a.action == "set":
        if not sys.stdin.isatty():
            raise core.BridgeError("Run this in a terminal you are typing in. Never pipe a key in, "
                                   "and never paste a key into a chat.")
        v = getpass.getpass(f"Key for '{a.name}' (typing is hidden): ").strip()
        if len(v) < 8:
            raise core.BridgeError("That is too short to be a key. Nothing was stored.")
        sec.set_secret(a.name, v)
        print(f"Stored '{a.name}' in the secure store. It is not shown anywhere.")
    elif a.action == "delete":
        print("Deleted." if sec.delete_secret(a.name) else "Nothing to delete.")
    else:
        cfg = core.load_config()
        for row in core.list_configured(cfg):
            print(f"{row['provider']}: {row['key']}")


def cmd_models(a):
    cfg = core.load_config()
    if a.live:
        for m in core.models_live(cfg, a.live):
            print(m)
    else:
        print(json.dumps(core.list_configured(cfg), ensure_ascii=False, indent=2))


def cmd_check(a):
    cfg = core.load_config()
    refs = a.model or [f"{r['provider']}:{k}" for r in core.list_configured(cfg)
                       for k in r["models"] if r["key"] != "missing"
                       and r["models"][k] != "(placeholder)"]
    if not refs:
        raise core.BridgeError("No model is ready: add keys and real model ids first.")
    res = core.ask_many(cfg, refs, "Reply with OK", max_tokens=16)
    bad = 0
    for ref, r in res.items():
        if r["error"]:
            bad += 1
            print(f"FAIL {ref}: {r['error']}")
        else:
            x = r["result"]
            print(f"OK   {ref} ({x['provider']}, {x['ms']} ms)" + ("  [empty answer]" if x["empty"] else ""))
    return 1 if bad else 0


def cmd_ask(a):
    cfg = core.load_config()
    prompt = _prompt_text(a)
    files = core.read_files(a.file, cfg)
    full = prompt + ("\n\n" + files if files else "")
    full += "\n\nDo not ask for searches or more files. State uncertainty inline."
    res = core.ask_many(cfg, a.model, full, a.system, a.max_tokens)
    failed = 0
    for ref, r in res.items():
        if r["error"]:
            failed += 1
            print(f"FAILED {ref}: {r['error']}")
            continue
        x = r["result"]
        if a.out:
            os.makedirs(a.out, exist_ok=True)
            fn = re.sub(r"[^A-Za-z0-9._-]+", "-", f"{x['provider']}-{x['model']}") + "-answer.md"
            path = os.path.join(a.out, fn)
            with open(path, "w", encoding="utf-8") as f:
                f.write(f"UNVERIFIED: {x['provider']} / {x['model']}. A model's answer, not a source.\n\n{x['text']}\n")
            print(f"OK {ref} -> {path} ({len(x['text'])} chars, {x['ms']} ms)")
        else:
            print(core.wrap_untrusted(f"{x['provider']} / {x['model']}\n{x['text']}"))
    return 1 if failed == len(res) else 0


def cmd_image(a):
    cfg = core.load_config()
    r = core.image(cfg, a.model, _prompt_text(a), a.out, a.aspect, a.size)
    print(f"Saved {r['path']} ({r['bytes']} bytes, {r['provider']} / {r['model']})")


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("doctor").set_defaults(fn=cmd_doctor)
    k = sub.add_parser("keys")
    k.add_argument("action", choices=["set", "list", "delete"])
    k.add_argument("name", nargs="?")
    k.set_defaults(fn=cmd_keys)
    m = sub.add_parser("models")
    m.add_argument("--live", metavar="PROVIDER")
    m.set_defaults(fn=cmd_models)
    c = sub.add_parser("check")
    c.add_argument("--model", action="append")
    c.set_defaults(fn=cmd_check)
    q = sub.add_parser("ask")
    q.add_argument("--model", action="append", required=True)
    q.add_argument("--prompt")
    q.add_argument("--prompt-file")
    q.add_argument("--system")
    q.add_argument("--file", action="append", default=[])
    q.add_argument("--max-tokens", type=int)
    q.add_argument("--out")
    q.set_defaults(fn=cmd_ask)
    i = sub.add_parser("image")
    i.add_argument("--model", required=True)
    i.add_argument("--prompt")
    i.add_argument("--prompt-file")
    i.add_argument("--out", required=True)
    i.add_argument("--aspect")
    i.add_argument("--size")
    i.set_defaults(fn=cmd_image)
    a = ap.parse_args(argv)
    if a.cmd == "keys" and a.action in ("set", "delete") and not a.name:
        ap.error("keys set/delete needs a NAME")
    try:
        return a.fn(a) or 0
    except core.BridgeError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
