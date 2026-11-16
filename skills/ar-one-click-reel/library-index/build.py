"""Builds library-index.md and index.json for AR One Click Reel from the data below.
Edit here, then run from the plugin root:  python -I skills/ar-one-click-reel/library-index/build.py
"""
import json, pathlib

HERE = pathlib.Path(__file__).resolve().parent
REF = "skills/ar-one-click-reel/references/"

CATALOG = [
 ("scene-motion", "Motion inside a paper scene", "How do the paper pieces of this scene move?", [
  ("Universal animation prompt", "Back-to-front paper assembly (first 70%), then a living-paper hold (last 30%), locked camera", "Every generated scene clip", REF + "prompt-templates.md §6, §7"),
  ("Living-paper-only prompt", "Tiny ambient motion on a finished image", "Extending a hold, start-frame-only tools", REF + "prompt-templates.md §8"),
  ("Animation philosophy", "Stop-motion on twos, real cardstock thickness, contact shadows, no CGI morphing", "Before writing any animation prompt", REF + "animation-and-sound.md"),
  ("Generated-clip consistency", "One look image for every clip, recurring props with their own picture, clips that join into one shot", "Scenes generated as video", REF + "video-generator-tips.md"),
 ]),
 ("camera", "Camera", "Does the camera move, and how?", [
  ("Locked camera (default)", "Clips keep the camera still; motion lives in the paper", "Default for every scene", REF + "prompt-templates.md §6"),
  ("Continuous camera (optional)", "The whole film as one camera move through the paper world, each scene pinned to its line", "When chosen at the intake", REF + "continuous-camera.md"),
  ("Camera look", "Cinema camera, macro or prime lens, shallow depth of field", "Image prompts", REF + "art-direction.md (Camera and image format)"),
 ]),
 ("code-layers", "Code-built layers in the edit", "Does a fact need a layer the paper cannot carry?", [
  ("47 code animations", "Count-up, donut ring, line draw, 3D bars, globe arcs, flow line, paper collage, marker draw, halftone wave, dot wipe…", "Two or three per film at most, for numbers, routes, steps, emphasis", REF + "code-animations.md and animations/INDEX.md"),
 ]),
 ("transitions", "Transitions between acts", "How do we move from one act to the next?", [
  ("Printed transitions", "32-halftone-wave, 36-dot-wipe", "Between acts", REF + "code-animations.md"),
  ("Motion-blur joins", "Clips that start and end in motion blur read as one shot", "Generated clips", REF + "video-generator-tips.md"),
  ("Continuous camera", "No cuts at all", "One-shot films", REF + "continuous-camera.md"),
 ]),
 ("titles-fonts", "Arabic titles and fonts", "How does Arabic text appear?", [
  ("Arabic titles", "Shaped correctly, contrast-checked, added as a still layer in the edit, never animated letter by letter", "Every title", "skills/ar-one-click-reel/scripts/arabic_title.py and " + REF + "art-direction.md (Arabic typography)"),
  ("Bundled fonts", "Numbered fonts and their genres", "Font card and Stage 8", REF + "arabic-fonts.md"),
 ]),
 ("look", "Look of the film", "Which paper look and palette?", [
  ("Styles and palettes", "Numbered style and palette boards", "Intake", "skills/ar-one-click-reel/assets/styles.json, palettes.json"),
  ("Newsprint diorama", "Sepia newsprint world, eye bars, one accent prop", "Politics, money, power", REF + "video-generator-tips.md §3"),
  ("Breaking the safe pick", "Name the default, then move away from it", "Any open creative choice", REF + "antialgorithm.md"),
 ]),
 ("sound", "Sound", "What does it sound like?", [
  ("Sound design", "Tactile paper sounds, narration sync", "Stages 9 and 10", REF + "animation-and-sound.md (Sound design)"),
  ("Sound sourcing", "Licensed paper effects and music with credits", "When effects are needed", "agents/paper-sound-sourcer.md"),
 ]),
]

# meaning family, Arabic cue words, paper motion idea, options
VOCAB = [
 ("Length, extension", "طويل، يمتد، بعيد، سنين، مسافة", "A paper strip or accordion fold extends across the frame with the word", [
   ("Assembly beat", "an accordion paper strip unfolds piece by piece, or a paper ribbon unrolls"), ("Code layer", "13-line-draw or 15-marker-draw under the still title")]),
 ("Shortness, shrinking", "قصير، صغير، يتقلص، قليل", "A piece folds in on itself", [("Assembly beat", "the paper folds closed into a small square")]),
 ("Weight, importance", "ثقيل، أهم، خطير، ضخم", "The main piece drops last and settles with a heavy stepped bounce and a deep contact shadow", [("Assembly beat", "drop and settle on twos")]),
 ("Fall, collapse", "سقط، انهار، خسارة، تراجع", "A paper piece tips and falls, layers slump", [("Assembly beat", "a cut-out topples off its stand"), ("Code layer", "28-3d-bars collapsing, data from Stage 3")]),
 ("Rise, growth", "ارتفع، صعد، نما، زاد", "A pop-up lifts on its paper tab, a paper plant unfolds upward", [("Assembly beat", "pop-up lift"), ("Code layer", "40-count-up")]),
 ("Joining, unity", "اجتمع، اتحد، معًا، يكمّل", "Torn pieces slide together into one shape", [("Assembly beat", "torn halves meet and the seam closes"), ("Code layer", "06-paper-collage")]),
 ("Splitting, division", "انقسم، تفرّق، خلاف، تفكك", "A sheet tears in two and the halves drift apart", [("Assembly beat", "a visible paper tear")]),
 ("Shock, surprise", "صدمة، فجأة، ضربة", "A stamp slams onto paper, or a sheet crumples", [("Assembly beat", "stamp punch with paper dust"), ("Generated clip", "strong beat about every 3 s (video-generator-tips §2)")]),
 ("Speed", "سريع، فورًا، بلحظة", "Pieces snap in fast, fewer poses", [("Assembly beat", "quick snaps on ones for that moment only")]),
 ("Slowness, waiting", "ببطء، انتظر، صبر، هدوء", "A long living-paper hold, tiny motion only", [("Living-paper prompt", "prompt-templates §8")]),
 ("Reveal, secret", "كشف، الحقيقة، سر، مخفي", "A paper flap lifts or a fold opens to show what is under it", [("Assembly beat", "flap lift")]),
 ("Before and after", "قبل، بعد، كان، صار", "A page turns from one state to the other", [("Assembly beat", "page turn"), ("Code layer", "20-before-after")]),
 ("Many, spread", "كثير، الكل، العالم، انتشر", "Cut-outs multiply in rows", [("Assembly beat", "rows of identical cut-outs fill in"), ("Code layer", "03-globe-arcs")]),
 ("Path, steps", "طريق، مسار، خطوة، ثم", "A paper string or a dotted route draws across a paper map", [("Code layer", "42-flow-line"), ("Assembly beat", "stepping-stone pieces placed one by one")]),
 ("Depth, layers", "داخل، طبقات، نظام، تحت", "Layers separate in depth with parallax", [("Continuous camera", "a slow push between layers (continuous-camera.md)")]),
 ("Time, history", "قديم، تاريخ، زمان", "Aged or burnt paper edges, newsprint", [("Look", "newsprint diorama (video-generator-tips §3)")]),
 ("End, stop", "انتهى، خلاص، آخر", "The scene folds shut like a book", [("Assembly beat", "fold closed"), ("Transition", "36-dot-wipe")]),
 ("Numbers", "رقم، مليون، نسبة، %", "The number is a code layer over the paper, data from Stage 3", [("Code layer", "40-count-up, 23-donut-ring, 28-3d-bars")]),
]

RULES = [
 "Arabic text never moves: titles are still layers added in the edit (arabic_title.py). Never letter-by-letter. Animations 01, 07, 10 and 33 move single letters and are not used on Arabic.",
 "Paper stays paper: no morphing, melting or CGI-smooth motion; stop-motion on twos; real thickness and contact shadows.",
 "The camera is locked by default; it moves only in the continuous-camera option.",
 "Code layers: two or three per film at most, one per shot; colours and fonts from the film.",
 "Quoted verses and hadith never move; no music under them; nothing playful on serious or religious topics.",
 "Never show a prophet or companion in any form (content-and-integrity.md).",
 "Vary: never the same motion family on two consecutive scenes; keep one hero motion for the strongest moment.",
]

def md():
    o = ["# Library index (AR One Click Reel)", "", "Generated by `library-index/build.py`. Do not edit by hand.", "",
         "Use: find the question, open the file in the last column. For motion tied to a word, use the meaning table below.", ""]
    for k, l, q, es in CATALOG:
        o += ["## " + l, "*" + q + "*", "", "| Source | What it gives | When | Where |", "| --- | --- | --- | --- |"]
        o += ["| %s | %s | %s | `%s` |" % e for e in es] + [""]
    o += ["## Word meaning → paper motion", ""]
    for f, c, i, opts in VOCAB:
        o += ["### " + f, "**Cue words:** " + c, "", "**Idea:** " + i, ""] + ["%d. %s: %s" % (n, s, h) for n, (s, h) in enumerate(opts, 1)] + [""]
    o += ["## Rules", ""] + ["- " + r for r in RULES] + [""]
    return "\n".join(o)

(HERE / "library-index.md").write_text(md(), encoding="utf-8")
(HERE / "index.json").write_text(json.dumps({
 "catalog": [{"key": k, "label": l, "question": q, "entries": [{"name": a, "gives": b, "when": c, "where": d} for a, b, c, d in es]} for k, l, q, es in CATALOG],
 "motion_vocabulary": [{"family": f, "cues": c, "idea": i, "options": [{"source": s, "how": h} for s, h in o]} for f, c, i, o in VOCAB],
 "rules": RULES}, ensure_ascii=False, indent=1), encoding="utf-8")
print("catalog", sum(len(e) for *_, e in CATALOG), "entries; vocabulary", len(VOCAB), "families")
