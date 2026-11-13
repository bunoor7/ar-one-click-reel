# Code-built animation layers (optional)

A library of 47 single-file HTML canvas animations lives in `skills/ar-one-click-reel/animations/`. Each is `NN-name/index.html`; the catalogue is `animations/INDEX.md` (Arabic): per animation, the type, the shot it suits, what to pair it with, and whether it works with Arabic text. Editable sources, build, check and MP4 export scripts are in `animations/_build/`.

This works only where files can be opened and run (the Claude plugin with Node, Playwright and ffmpeg). Skip this file when the system is used as a pasted prompt.

## Where they fit

The film is paper-cut stop-motion and the paper-world rules in `art-direction.md` and `animation-and-sound.md` still win. Code animations never replace a scene's image or its stop-motion animation. They are separate graphic layers added in the edit (Stage 10), only for facts that paper art cannot carry cleanly:

- A number or statistic: `40-count-up`, `23-donut-ring`, `13-line-draw`, `28-3d-bars`.
- Routes and spread: `03-globe-arcs`.
- A short sequence of steps: `42-flow-line`, `08-cursor-tour`.
- A title card or an emphasis mark that echoes the paper look: `06-paper-collage`, `15-marker-draw`.
- A paper-grain or printed transition between acts: `32-halftone-wave`, `36-dot-wipe`.

Two or three per film at most. A film with more of them stops looking handmade.

## Rules

- **One animation per shot.** Pick from `INDEX.md` by its code. Open only that folder.
- **Colours and fonts come from the film.** Edit the `THEME` block at the top of the file to the chosen colour theme, and replace the bundled Google fonts with the Arabic font picked at the font card.
- **Arabic text is never animated letter by letter.** Joined letters break. This matches the existing rule not to animate text through letter morphing. `01`, `07`, `10` and `33` move single letters and are Latin-only; every other text animation moves whole words or lines and needs only its strings replaced (and RTL entry direction).
- **Facts come from the research base.** Every number, name and date shown is typed from Stage 3, never from the sample text in the file.
- **Show a still before exporting.** Render the last frame (`?t=1`) and get approval, then change one thing per round.

## How

1. Copy the chosen folder, edit the constants at the top (words, numbers, labels) and the `THEME` block.
2. Export: `node skills/ar-one-click-reel/animations/_build/export.js NN-name/index.html out.mp4 60 2`.
3. The export is opaque and 912 x 600. Use it as a full-frame interlude, or place it in the vertical edit with a mask or blend, and hand it to `assemble.py` as an ordinary clip.
4. Check changes to the sources with `node animations/_build/check.js NN` (snapshots at several moments, page errors, font loading).
