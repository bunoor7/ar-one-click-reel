#!/usr/bin/env python3
"""Assemble paper-scene clips, titles, narration, sound effects and music
into one vertical video with ffmpeg.

Usage: assemble.py manifest.json [--dry-run]

Manifest (paths are relative to the manifest file):
{
  "width": 1080, "height": 1920, "fps": 30,
  "output": "final.mp4",
  "narration": "narration.mp3",          optional, whole-video voiceover
  "narration_volume": 1.0,
  "music": "music.mp3",                  optional, looped and faded out
  "music_volume": 0.12,
  "scenes": [
    {
      "clip": "scene01.mp4",             video or still image
      "duration": 6.5,                   seconds on screen
      "trim": "end",                     "end" (default) or "start" when the clip is too long
      "reverse": false,                  play the clip backwards
      "title": "title01.png",            optional transparent PNG overlay
      "title_start": 4.0,                seconds into the scene (default 0)
      "narration": "vo01.mp3",           optional per-scene voiceover
      "sfx": "paper.wav",                optional sound effect at scene start
      "sfx_start": 0.0, "sfx_volume": 0.5
    }
  ]
}
"""
import json
import os
import shutil
import subprocess
import sys

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}


def probe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", path], capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return None


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        sys.exit("ffmpeg and ffprobe are required.")

    mpath = os.path.abspath(args[0])
    root = os.path.dirname(mpath)
    with open(mpath, encoding="utf-8") as f:
        m = json.load(f)

    def rel(p):
        return p if os.path.isabs(p) else os.path.join(root, p)

    W, H, FPS = int(m.get("width", 1080)), int(m.get("height", 1920)), int(m.get("fps", 30))
    scenes = m.get("scenes") or sys.exit("The manifest has no scenes.")
    output = rel(m.get("output", "final.mp4"))

    missing = []
    for s in scenes:
        for key in ("clip", "title", "narration", "sfx"):
            if s.get(key) and not os.path.exists(rel(s[key])):
                missing.append(s[key])
    for key in ("narration", "music"):
        if m.get(key) and not os.path.exists(rel(m[key])):
            missing.append(m[key])
    if missing:
        sys.exit("Missing files:\n  " + "\n  ".join(missing))

    inputs, filters, vlabels, alabels = [], [], [], []

    def add_input(path, pre=()):
        inputs.extend([*pre, "-i", path])
        return (len([x for x in inputs if x == "-i"]) - 1)

    t = 0.0
    for i, s in enumerate(scenes):
        if "clip" not in s or "duration" not in s:
            sys.exit(f"Scene {i + 1} needs both 'clip' and 'duration'.")
        dur = float(s["duration"])
        clip = rel(s["clip"])
        is_image = os.path.splitext(clip)[1].lower() in IMAGE_EXT
        if is_image:
            idx = add_input(clip, ("-loop", "1", "-t", f"{dur:.3f}"))
            chain = f"[{idx}:v]"
        else:
            idx = add_input(clip)
            chain = f"[{idx}:v]"
            src = probe_duration(clip) or dur
            steps = []
            if src > dur and s.get("trim") == "start":
                steps.append(f"trim=start={src - dur:.3f},setpts=PTS-STARTPTS")
            if s.get("reverse"):
                steps.append("reverse")
            if steps:
                filters.append(f"{chain}{','.join(steps)}[r{i}]")
                chain = f"[r{i}]"
        # fit to frame, hold the last frame if short, cut if long
        filters.append(
            f"{chain}scale={W}:{H}:force_original_aspect_ratio=increase,"
            f"crop={W}:{H},fps={FPS},setsar=1,format=yuv420p,"
            f"tpad=stop_mode=clone:stop_duration={dur:.3f},"
            f"trim=duration={dur:.3f},setpts=PTS-STARTPTS[v{i}]")
        label = f"[v{i}]"
        if s.get("title"):
            tidx = add_input(rel(s["title"]), ("-loop", "1", "-t", f"{dur:.3f}"))
            start = float(s.get("title_start", 0))
            filters.append(f"[{tidx}:v]scale={W}:{H},format=rgba[t{i}]")
            filters.append(f"{label}[t{i}]overlay=0:0:enable='gte(t,{start:.3f})'"
                           f":shortest=1[vt{i}]")
            label = f"[vt{i}]"
        vlabels.append(label)

        for key, vol_key, start_key in (("narration", "narration_volume", None),
                                        ("sfx", "sfx_volume", "sfx_start")):
            if s.get(key):
                aidx = add_input(rel(s[key]))
                delay = int((t + float(s.get(start_key, 0) if start_key else 0)) * 1000)
                vol = float(s.get(vol_key, 1.0 if key == "narration" else 0.5))
                tag = f"[a{key[0]}{i}]"
                filters.append(f"[{aidx}:a]aresample=48000,volume={vol},"
                               f"adelay={delay}:all=1{tag}")
                alabels.append(tag)
        t += dur
    total = t

    filters.append(f"{''.join(vlabels)}concat=n={len(vlabels)}:v=1:a=0[vout]")

    if m.get("narration"):
        aidx = add_input(rel(m["narration"]))
        filters.append(f"[{aidx}:a]aresample=48000,"
                       f"volume={float(m.get('narration_volume', 1.0))}[anar]")
        alabels.append("[anar]")
        n = probe_duration(rel(m["narration"]))
        if n and n > total + 0.25:
            print(f"warning: narration is {n:.1f}s but the scenes total {total:.1f}s; "
                  "the end of the narration will be cut.", file=sys.stderr)
    if m.get("music"):
        aidx = add_input(rel(m["music"]), ("-stream_loop", "-1"))
        fade = min(2.0, total / 4)
        filters.append(f"[{aidx}:a]aresample=48000,volume={float(m.get('music_volume', 0.12))},"
                       f"atrim=duration={total:.3f},"
                       f"afade=t=out:st={total - fade:.3f}:d={fade:.3f}[amus]")
        alabels.append("[amus]")

    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *inputs]
    if alabels:
        filters.append(f"{''.join(alabels)}amix=inputs={len(alabels)}:normalize=0:"
                       f"duration=longest,alimiter=limit=0.95,"
                       f"apad,atrim=duration={total:.3f}[aout]")
        maps = ["-map", "[vout]", "-map", "[aout]", "-c:a", "aac", "-b:a", "192k"]
    else:
        maps = ["-map", "[vout]", "-an"]
    cmd += ["-filter_complex", ";".join(filters), *maps,
            "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", "-t", f"{total:.3f}", output]

    print(f"{len(scenes)} scenes, {total:.1f}s, {W}x{H}@{FPS} -> {output}")
    if dry:
        print(" ".join(cmd))
        return
    res = subprocess.run(cmd)
    if res.returncode != 0:
        sys.exit("ffmpeg failed; see the error above.")
    print(f"done: {output} ({probe_duration(output):.1f}s)")


if __name__ == "__main__":
    main()
