# Video generator tips: consistency, one-shot clips, refusals

Written in our own words from field notes on AI video generators (Higgsfield, Kling, Veo, Runway and similar), including ideas studied in the "Vox Animations" prompt pack. No text from it is copied. Read at Stages 6, 7 and 9, next to `prompt-templates.md`, whenever scenes are generated as video clips rather than built in code.

## 1. One look across many clips
- **Make one look image first.** Before any scene, generate a single still that holds the palette, the paper texture, the light and the grain of the whole film, with no people, objects with faces, or letters in it. Attach it as the reference image to **every** clip. It is what makes separate ten-second clips read as one film. It sits beside the style block of `prompt-templates.md` §1, not instead of it.
- **Open every clip prompt with the same style words** (the style block), and **close it with the same negative block**, copied unchanged. Changing either between clips is the fastest way to lose the look.
- **Recurring objects get their own picture.** An object that returns across scenes (a document, a rocket, a coin, a leader's cut-out, a crate) is generated once, centred on a plain paper ground with the look image attached, then attached again to every clip that shows it, and named in the prompt as "the X from the reference image". Without this, the object changes shape from clip to clip. This complements the character sheet of `prompt-templates.md` §3, which does the same for people.

## 2. Clips that join into one shot
- **Each clip is one continuous camera move** that begins and ends inside motion blur (a dive, a whip, a fall, a flare). Hard cuts between such clips read as a single unbroken shot. This is the generated-video cousin of `continuous-camera.md`, which does it in code.
- **One strong moment about every three seconds** inside the clip: a slam, a stamp, a page ripped away, a shockwave, a snap. It keeps a ten-second clip from feeling slow.
- **Name the sound inside the prompt:** three to five concrete events of what is on screen ("a stamp punch, two page rips, paper wind"), and "no speech". A good engine renders them, and they sit under the narration. They are a guide only: the final sound still follows `animation-and-sound.md`, with real recordings.
- **One thing the film is remembered by:** plan one reveal shot and spend the most care on it.

## 3. A second paper look: the newsprint diorama
For politics, money, power and investigations, as an option at the style card next to the house paper look:
- a miniature world built from aged brown newsprint and cardboard, torn edges, canyon walls of old pages;
- people as grey archival cut-outs with a black bar over the eyes (it reads as editorial and also avoids likeness problems);
- a single strong accent colour on one paper prop, everything else in sepia;
- warm tungsten light, deep shadows, a macro tilt-shift look, film grain;
- one short stamped label on a prop per scene at most (a year, a number, one word), and the prompt says plainly that no other text may appear. With Arabic, the label is added in the edit by `scripts/arabic_title.py`, never generated.

The creator's approved palette replaces the accent colour if they prefer.

## 4. What generators refuse, and what to do
- **Named politicians in a video prompt** often fail at render even after the job is accepted. Describe them instead ("an elderly leader in a dark suit with a long red tie"). The name stays in the narration.
- **Close-up faces of well-known people** are refused more often than mid shots or full bodies. A black bar over the eyes helps further.
- **Some disaster imagery** (a mushroom cloud, graphic injury) trips filters. Keep the idea and change the picture: an hourglass, a shadow over a map, a burnt page.
- **Some platforms offer to turn a stylised prompt into "realistic" or "3D render".** Decline: it destroys the paper look.
- **A clip that comes out photoreal or off-style:** tighten the style and negative lines and regenerate that clip only. Two identical failures mean the prompt needs rewriting, not another seed.
- Never generate a prophet or a companion in any form (the rule in `content-and-integrity.md` stands above all of this).

## 5. Music, if the creator asks for it
A brief that suits investigative paper films when handed to a music generator: a slow pulse like a heartbeat (around 45 to 50 BPM), a deep drone with a low cello, very little high end, swells every few seconds, a strong open, one climax at about 80% of the running time, then a quick fall to silence. Music is still optional and never under quoted scripture.
