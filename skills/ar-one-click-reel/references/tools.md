# Production toolbox

This system is tool-agnostic. It names what each step needs, then lists options. Model names and versions change quickly: check what is actually connected in the session and which models it offers before promising anything, and never state that a tool is unavailable without looking.

Rules for every paid generation:

- Say what will be generated, with which tool, and roughly how many items, before spending credits.
- Test one or two items before generating a full set.
- Never repeat a failed call blindly. Find the cause first.
- Inspect every result before presenting it as usable.

## 1. Research (Stage 3)

Web search and page reading, when available. Prefer primary sources, then reputable reference works and academic or institutional sites. If no research tool is connected, say so in the concept sheet and mark the facts that still need checking.

## 2. Images (Stages 6 and 7)

What the step needs: vertical 9:16 output at high resolution, strong material realism (paper texture, depth, shadows), image-reference input for character consistency, and, ideally, legible Arabic text.

| Option | Notes |
|---|---|
| GPT Image family (OpenAI) | Among the most reliable for exact short Arabic titles and for following long structured prompts. Accepts reference images. |
| Nano Banana / Gemini image family (Google) | Strong character consistency from reference images and good image editing. Arabic text is often correct for short titles; verify. |
| Seedream family (ByteDance) | High resolution, good material detail, accepts multiple references. |
| Flux family (Black Forest Labs) | Strong texture and photographic realism. Arabic text is unreliable: use the text-free variant. |
| Midjourney | Excellent craft aesthetics. Does not render Arabic reliably: always use the text-free variant. |

Where to run them: an aggregator connector if one is attached to the session (for example Higgsfield, ElevenLabs creative tools, or Artlist, each of which exposes several image models through a `generate_image`-style tool), or the user's own account on the model's site.

Free web tools: if the creator has no credits, the free allowances of web generators can be used through the browser helper. Read `free-tools.md` first; it covers the rules, the log, and how to plan around limits. Quotas change, so read them from the site and never from memory.

Choosing the model: do not assume one. Ask the tool you are using which model suits the request (for example the Higgsfield model recommender, or the model list of the connector), prefer one that accepts reference images, and say which model you used. The Stage 6 test frame decides whether the model is acceptable: if its faces and hands come out cartoonish after the fixes in `stages.md`, change the model. Check the price of a generation with the tool's cost preview before a batch, and say what the batch will cost.

Practical guidance:

- Arabic titles: keep them to 2 to 4 words when they are generated inside the image. Longer titles fail much more often. Whatever the model, inspect the result at Stage 8.
- Character consistency: attach the approved reference sheet to every scene that contains the character. Describe the identity in the prompt as well.
- Fixing one flaw in an otherwise good image: use image editing (inpainting or instruction-based editing) rather than regenerating the whole scene.
- Upscale only the approved final images.

## 3. Fonts, boards and Arabic titles (brief and Stage 8)

The creator chooses fonts, colors and style from numbered boards, and the numbers are used everywhere after that.

```bash
# rebuild the boards (fonts, palettes, styles), or just one
python3 scripts/make_boards.py
python3 scripts/make_boards.py fonts --sample "جنون التوليب"
```

When the generator cannot render a title correctly, or when the title must survive animation untouched, render it with the bundled script. It uses real OpenType shaping (HarfBuzz through Pillow's Raqm layout), so letters are always joined and ordered correctly.

```bash
# Burn a paper-cut title into a text-free scene image: bundled font 5, color theme 3
python3 scripts/arabic_title.py --image scene03_clean.png --out scene03.png \
  --text "جنون التوليب" --font 5 --theme 3 --position top

# Or export the title alone on a transparent background, for the video editor.
# --check-against samples the real scene so the contrast is measured.
python3 scripts/arabic_title.py --transparent --check-against scene03.png \
  --out title03.png --text "جنون التوليب" --font 5 --theme 3
```

- `--font` takes a number from the font board, or a path to any `.ttf`/`.otf` Arabic font.
- `--theme` supplies a title color and an edge color chosen for that theme. With the default `--color auto`, the script measures the background behind the title and picks the most readable color. If you set `--color` yourself and the contrast is below 4.5, it refuses and says why (`--force` overrides).
- `--light` should be the direction the scene's key light comes from, so the title's shadow falls the same way as the others.
- Run `python3 scripts/arabic_title.py --help` for all options.

Requirement: Pillow built with Raqm support (`python3 -c "from PIL import features; print(features.check('raqm'))"`). Without it the script falls back to `arabic-reshaper` and `python-bidi` if installed, and otherwise refuses to run rather than output broken Arabic.

Always look at the rendered title before using it.

## 4. Voiceover (Stage 10)

What the step needs: natural Arabic delivery in the chosen register or dialect, control over pacing, and consistent pronunciation of names.

| Option | Notes |
|---|---|
| ElevenLabs | Wide choice of Arabic voices, including Gulf voices, and voice cloning of the user's own voice with their consent. Use the newest multilingual or expressive model on offer. |
| A human recording | Still the best result for dialect. The script from Stage 4 is the recording sheet. |
| Other TTS (OpenAI, Google, Azure) | Usable for Modern Standard Arabic. Dialects are weaker. |

The voice is chosen in the brief (see `intake.md`, the voice card). The creator's own voice, «عبدالمنعم إبراهيم», is always the first option; it exists only in the author's ElevenLabs account unless published, so look it up before offering it and say plainly when it is not available.

Practical guidance:

- Generate a sample of the first line with the chosen voice and get approval before generating the whole narration. Never generate with a voice the creator did not choose.
- Dialect narration: the text drives the dialect. Keep the approved dialect spelling exactly as written and choose a voice whose native accent matches.
- Add selective vowel marks (tashkeel) only on words the engine mispronounces, proper names first. Do not vowel the whole script.
- Write numbers and dates out in words, as they should be spoken.
- Generate scene by scene or with clear pauses between beats, so each line can be timed and moved independently.
- Listen to, or transcribe, the result and compare it with the approved script before using it. A TTS engine can skip or change words.

## 5. Animation (Stage 9)

What the step needs: image-to-video with a locked camera, obedience to "no morphing", and ideally start and end frame control so the finished image can be the final frame.

| Option | Notes |
|---|---|
| Kling family | Supports start and end frames on several versions. Good at controlled object motion. |
| Veo family (Google) | High fidelity, can generate matching ambient sound. Turn speech off in the prompt. |
| Seedance family (ByteDance) | Good prompt adherence and stable camera. |
| Runway, Luma, Hailuo, Wan | Viable alternatives. Test one scene first. |

Assembly-animation approaches, in order of preference:

1. End-frame control: give the finished scene as the end frame (and an empty paper background as the start frame, produced by image editing), with the universal animation prompt.
2. Reverse trick: animate the finished image with a "the scene gently disassembles layer by layer, front to back" prompt, then reverse the clip in the edit. `scripts/assemble.py` supports `"reverse": true` per scene.
3. Start-frame only: use the living-paper-only prompt on the finished image, and create the assembly in the editor by revealing layers with simple slides and cuts.
4. No video model at all: a fully hand-built version in a code or editor timeline. Cut the scene into layers with image editing and background removal, then slide them in on stepped keyframes (12 fps holds give the stop-motion feel).

Arabic text and video models: lettering often warps. Prefer animating the text-free image and placing the title as a separate layer in the edit, appearing with a short stepped slide or a hard cut.

## 6. Sound effects and music (Stage 10)

| Need | Options |
|---|---|
| Paper foley | ElevenLabs sound effects (text to sound, prompts in `prompt-templates.md`); Freesound (check each licence: CC0 is free to use, CC BY needs credit); Pixabay and Mixkit sound libraries; a subscription library such as Artlist |
| Music | A licensed library such as Artlist; generated music from a tool whose licence covers the user's use; or none |
| Recording it yourself | Real paper recorded close to a phone microphone in a quiet room works very well for this style |

- Keep a credits list of every sound and track with its source and licence. Put it in the delivery notes.
- Do not use commercial music the user has no licence for.
- Do not add music to religious scenes unless the user asks for it.

## 7. Timing (Stages 4, 5 and 10)

```bash
python3 scripts/timing.py script.txt                  # table, 2.2 words per second
python3 scripts/timing.py script.txt --wps 2.0 --pause 0.4 --target 60
python3 scripts/timing.py script.txt --json > timing.json
```

The input is the script with one beat per line. Leading scene numbers are ignored. The output gives word count, estimated narration time, scene duration, the assembly and hold split, and the start time of each scene, plus a comparison with the target duration.

These are planning estimates. After the voiceover is recorded, replace them with measured durations:

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 narration_03.mp3
```

## 8. Assembly (Stage 10)

`scripts/assemble.py` builds the video with ffmpeg from a JSON manifest:

```json
{
  "width": 1080, "height": 1920, "fps": 30,
  "output": "final.mp4",
  "narration": "narration.mp3",
  "music": "music.mp3", "music_volume": 0.12,
  "scenes": [
    {"clip": "scene01.mp4", "duration": 6.5, "title": "title01.png", "title_start": 4.0},
    {"clip": "scene02.png", "duration": 8.0, "sfx": "paper_slide.wav", "sfx_volume": 0.5},
    {"clip": "scene03.mp4", "duration": 7.2, "reverse": true}
  ]
}
```

- A clip shorter than its `duration` is extended by holding its last frame. A longer clip is trimmed at the end, or from the start with `"trim": "start"` so the hold is kept.
- A still image is accepted as a clip and held for the duration.
- `title` is a transparent PNG from `arabic_title.py --transparent`, overlaid from `title_start` to the end of the scene.
- `narration` may be one file for the whole video, or each scene may carry its own `"narration"` file, placed at the scene's start.
- Scenes are joined with hard cuts, which suit the stop-motion look. For paper-wipe transitions, finish in an editor.

```bash
python3 scripts/assemble.py manifest.json
```

For finishing by hand, any editor works: DaVinci Resolve, CapCut, Premiere. Hand the user the clips, the transparent title PNGs, the narration files, the sounds, and the Stage 10 editing plan.

## 9. When a tool is missing

State plainly which step cannot be executed in this session, deliver everything needed for the user to run it elsewhere (prompts, exact Arabic text, timing, manifest), and mark the corresponding quality-control items NOT YET VERIFIED. Never describe an image, clip, or audio file that has not been produced.
