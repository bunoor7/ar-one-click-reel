# Continuous camera (optional one-shot film)

Adapted from the "Fable 5.2 Motion" prompt by Abdullah Alfaris (IG @i_abdullah_11 · TikTok @i_abodx1). Keep this credit if the technique or template is published.

An optional way to assemble the paper film as ONE continuous camera move with no hard cuts and no crossfades. Offer it at the intake as a format option; use it only when the creator chooses it. The paper-world rules in `art-direction.md` and `animation-and-sound.md` still win: every scene keeps its paper assembly and living-paper hold.

This needs the Claude plugin with Node, Playwright and ffmpeg. Skip it when the system is used as a pasted prompt.

## Principle

- The voiceover is the master clock. Once it exists, scene timing comes from its measured lines (an SRT), never re-estimated.
- Each scene is pinned to its narration line; the key Arabic title lands on its exact spoken word.
- Every scene change is a camera move through the paper world:
  - push into a paper detail (a window, an eye, a cut-out hole) that opens onto the next scene;
  - fly through a paper layer while the next set builds behind it;
  - whip-pan across the paper table with motion blur;
  - pull back until the scene becomes one card on a table of cards, then dive into the next card.
- Never a cut or a crossfade between scenes.

## Planning (Stage 5 storyboard)

For each scene, add a column "entry move / exit move" and name the paper element the camera passes through. The exit of one scene and the entry of the next must share that element. Show the table for approval before any image is generated, because the scene images must be composed with that element in place.

## Build (Stage 10)

- One HTML page. Each scene image or clip is a layer; the camera is computed from time inside seek(t) (no timers, no CSS transitions). CSS 3D or three.js for the camera, Canvas 2D for grain and vignette.
- Render frame by frame with Playwright, then ffmpeg to H.264. Serve the folder over a local HTTP server.
- Sound: paper whooshes on moves, paper slaps on title landings (`paper-sound-sourcer` cues), voice at the loudness in `animation-and-sound.md`.

## Rules

- Arabic titles move as whole words or lines, never letter by letter.
- Photos and generated paper images keep their real colours inside the move.
- Test first on a ten-second excerpt; the render is heavy. Show stills at key moments before the full render, then change one thing per round.
