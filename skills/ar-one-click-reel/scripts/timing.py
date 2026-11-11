#!/usr/bin/env python3
"""Estimate per-scene timing for an Arabic voiceover script.

Input: a UTF-8 text file with one narration beat per non-empty line.
Leading scene numbers ("1.", "١-", "3)") are ignored. Lines starting
with '#' are comments.

Output: word count, estimated narration time, scene duration, the
assembly / living-paper split, and the start time of every scene.
These are planning estimates; replace them with measured durations
once the real voiceover exists.
"""
import argparse
import json
import re
import sys

NUM_PREFIX = re.compile(r"^\s*[\(\[]?[0-9٠-٩]+\s*[\.\-\)\]:،]+\s*")
# Arabic diacritics and tatweel do not make a token a word on their own
STRIP = re.compile(r"[ً-ْٰـ]")
WORD = re.compile(r"[\w؀-ۿ]+", re.UNICODE)


def count_words(line: str) -> int:
    return len(WORD.findall(STRIP.sub("", line)))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script", help="script text file, one beat per line")
    ap.add_argument("--wps", type=float, default=2.2,
                    help="spoken words per second (default 2.2; natural range 2.0-2.5)")
    ap.add_argument("--pause", type=float, default=0.5,
                    help="breathing room added to each scene, seconds (default 0.5)")
    ap.add_argument("--min-scene", type=float, default=3.0,
                    help="minimum scene duration, seconds (default 3.0)")
    ap.add_argument("--assembly", type=float, default=0.7,
                    help="share of each scene used for paper assembly (default 0.7)")
    ap.add_argument("--target", type=float, default=None,
                    help="target total duration in seconds, for comparison")
    ap.add_argument("--json", action="store_true", help="print JSON instead of a table")
    a = ap.parse_args()

    if a.wps <= 0:
        ap.error("--wps must be positive")
    if not 0 < a.assembly < 1:
        ap.error("--assembly must be between 0 and 1")

    with open(a.script, encoding="utf-8-sig") as f:
        beats = [NUM_PREFIX.sub("", ln).strip() for ln in f
                 if ln.strip() and not ln.lstrip().startswith("#")]
    beats = [b for b in beats if count_words(b) > 0]
    if not beats:
        print("No narration lines found.", file=sys.stderr)
        return 1

    scenes, t = [], 0.0
    for i, text in enumerate(beats, 1):
        words = count_words(text)
        narration = words / a.wps
        duration = max(a.min_scene, narration + a.pause)
        scenes.append({
            "scene": i, "words": words,
            "narration_s": round(narration, 1),
            "duration_s": round(duration, 1),
            "assembly_s": round(duration * a.assembly, 1),
            "hold_s": round(duration * (1 - a.assembly), 1),
            "start_s": round(t, 1),
            "text": text,
        })
        t += duration

    total_words = sum(s["words"] for s in scenes)
    summary = {"scenes": len(scenes), "words": total_words,
               "total_s": round(t, 1), "wps": a.wps}
    if a.target:
        summary["target_s"] = a.target
        summary["difference_s"] = round(t - a.target, 1)
        # words to add (+) or cut (-) to land on the target at this pace
        budget = (a.target - a.pause * len(scenes)) * a.wps
        summary["word_budget"] = int(budget)
        summary["words_over_budget"] = total_words - int(budget)

    if a.json:
        json.dump({"summary": summary, "scenes": scenes}, sys.stdout,
                  ensure_ascii=False, indent=2)
        print()
        return 0

    print(f"{'#':>3} {'words':>5} {'narr':>6} {'scene':>6} {'build':>6} {'hold':>5} {'start':>6}")
    for s in scenes:
        print(f"{s['scene']:>3} {s['words']:>5} {s['narration_s']:>6} {s['duration_s']:>6} "
              f"{s['assembly_s']:>6} {s['hold_s']:>5} {s['start_s']:>6}")
    m, sec = divmod(t, 60)
    print(f"\nScenes: {len(scenes)}   Words: {total_words}   "
          f"Total: {t:.1f}s ({int(m)}:{sec:04.1f}) at {a.wps} words/s")
    if a.target:
        d = summary["difference_s"]
        state = "over" if d > 0 else "under"
        print(f"Target: {a.target:.0f}s   {abs(d):.1f}s {state}   "
              f"Word budget at this pace: {summary['word_budget']} "
              f"(script is {abs(summary['words_over_budget'])} words "
              f"{'over' if summary['words_over_budget'] > 0 else 'under'})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
