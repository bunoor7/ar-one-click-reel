# Video generator tips

_Written in our own words._

Read this at Stages 6, 7 and 9, next to `prompt-templates.md`, whenever scenes are generated as video clips instead of still images.

Related files:
- `prompt-templates.md`: the style block (§1), the negative block (§2) and the character sheet (§3).
- `continuous-camera.md`: when the one-shot film is built in code instead.
- `animation-and-sound.md`: the final sound, made with real recordings.
- `content-and-integrity.md`: no prophet or companion is ever shown.
- `scripts/arabic_title.py`: Arabic titles, added in the edit.

## 1. Keep every clip in the same world

- **Make a "look" still first.** One image that fixes the palette, paper texture, light and grain. It contains no people, no faces and no letters. Attach it to every clip.
- **Same words at both ends.** Every prompt opens with the same style words and closes with the same negative block. Do not edit them between clips.
- **Recurring objects get their own still.** Generate each object that appears more than once on a plain paper ground, with the look still attached. Attach that object still to every clip that shows it, and call it "the X from the reference image" in the prompt.
- People are already covered by the character sheet.

## 2. Make separate clips feel like one shot

- Give each clip one continuous camera move that starts and ends in motion blur. Hard cuts between clips then look seamless.
- Put a strong beat roughly every 3 s: a slam, a stamp, a rip or a shockwave.
- Write 3 to 5 concrete diegetic sound events into the prompt, plus "no speech". This only guides the motion. The final sound is still built from real recordings.
- Plan one memorable reveal shot for the film.

## 3. Alternative look for politics, money, power and investigations

| Element | Direction |
|---|---|
| World | A miniature world of aged brown newsprint and cardboard with torn edges |
| People | Grey archival cut-outs with a black bar over the eyes. It feels editorial and avoids likeness problems |
| Colour | One strong accent colour on a single prop. Everything else sepia. His palette can replace the accent |
| Light and lens | Warm tungsten light, deep shadows, macro tilt-shift, film grain |
| Text | At most one short stamped label per scene, and state that there is no other text |
| Arabic | Arabic labels are added in the edit, never generated |

## 4. When the generator refuses or drifts

- **Named politicians** in video prompts often fail at render. Describe the person instead and keep the name in the narration.
- **Famous faces in close-up** are refused more often than mid or full shots. The eye bar helps.
- **Disaster imagery** such as a mushroom cloud trips the filters. Keep the idea and change the picture: an hourglass, a shadow over a map, a burnt page.
- **Platform offers to switch** to a realistic or 3D look: decline them.
- **One clip off-style:** tighten the style and negative lines, then regenerate that clip only.
- **The same failure twice:** rewrite the prompt. Do not just try another seed.

## 5. Optional music brief

Only if music is wanted, and never under quoted scripture.

- A slow pulse like a heartbeat, about 45 to 50 BPM.
- A deep drone with low cello, and little high end.
- Swells every few seconds.
- A strong opening, one climax about 80% of the way in, then a quick fall to silence.
