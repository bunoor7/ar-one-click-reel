# Prompt templates

All generation prompts are written in English. Visible text inside images stays in Arabic, exactly as approved. Replace every `{placeholder}`. Remove lines that do not apply.

## 1. Style block (reuse in every image prompt)

```
A real handcrafted layered paper diorama, photographed as premium miniature
cinema photography. Every element is built from physical paper: thick
cardstock, kraft paper, textured handmade paper, folded and sculpted paper.
Dozens of individually hand-cut layers with visible cardstock thickness,
exposed cut edges, subtle paper fiber texture, tiny handmade irregularities,
faint glue joints, and deep shadow gaps between layers. The camera looks
directly into a self-contained paper world: the background, ground, sky and
every object are paper. Soft directional key light, natural shadow falloff,
gentle highlights along cut edges, subtle ambient bounce. Full-frame cinema
camera, prime lens, controlled shallow depth of field, sharp paper texture.
Vertical 9:16, highest quality, premium cinematic detail.
```

### 1b. Style line (the style the creator chose)

Paste the `prompt` text of the chosen style from `assets/styles.json` right after the style block, for example for style 2: "Flat editorial cut-paper collage: overlapping flat paper cut-outs with scissor-cut and torn edges...". The style block above describes the default layered diorama; where the chosen style differs (flat collage, origami, shadow theatre, cardboard, quilling), the style line wins and you should delete the contradicting sentences from the block.

### 1c. People block (every scene with a person)

Paste the `people_rule` from `assets/styles.json`:

```
All people are flat-layered cut-paper figures: faces and hands are built from
a few flat cardstock shapes with hard scissor-cut edges and visible layer
steps, simple cut-out features, matte paper only. No smooth shading, no
rounded 3D volume, no glossy eyes, no cartoon grin, no clay, no Pixar or toy
look.
```

### 1d. Palette line (every prompt)

Repeat the chosen theme from `assets/palettes.json`, with the hex values:

```
Color palette, and nothing far outside it: background paper {#bg}, primary
{#primary}, secondary {#secondary}, accent {#accent}, deep shadow tone {#deep}.
```

## 2. Negative block (reuse in every image prompt)

```
Not a flat vector illustration, not a digital cartoon, not an animated film
still, not glossy or soft 3D render, not plastic, not clay, not printed stickers. No real desk, no studio, no
frame, no canvas, no screen, no hands, no tools, no support stands.
No extra text, no captions, no watermarks, no logos, no pseudo-Arabic,
no Latin letters.
```

## 3. Character reference sheet

```
Character reference sheet of {character name / ID}, {age}, {era or setting},
as a premium dimensional paper sculpture.

Identity: {face shape}; {distinctive facial features}; {hair}; {facial hair};
skin built from layered matte paper in {skin-tone palette};
{body proportions}; wearing {clothing}; {accessories};
signature colors {colors}.

Construction: face built from layered cut cardstock planes, hair from
individually cut paper strips, clothing from folded and creased paper.

Sheet layout on a plain neutral paper background: front view, three-quarter
view, side profile, full-body view, plus two small close-ups of key facial
expressions ({expressions}) and one close-up of {accessory / costume detail}.
The same character in every view: identical face, proportions, colors and
paper materials.

[STYLE BLOCK] [STYLE LINE] [PEOPLE BLOCK] [PALETTE LINE]
[NEGATIVE BLOCK] No text labels.
```

Use a horizontal or square format for the sheet if the tool allows it. The sheet is a working reference, not a final frame.

## 4. Scene image (with Arabic title)

```
SCENE {n}: {one-line description of the narrative idea}.

Primary subject: {hero object or character, action, expression}.
Supporting objects (max three): {object 1}; {object 2}; {object 3}.
Environment: {background and setting, built from paper}.
Paper construction: {how the key elements are built: layers, folds, strips}.
Composition: {composition type}; subject placed {where}; clear negative space
reserved at {top / upper third / lower third} for the title; all important
content inside the central safe area of the vertical frame.
Palette: {colors}. Mood: {emotional atmosphere}. Lighting: {key light
direction and quality}.

Character identity: {character ID} must match the attached approved
reference image exactly: same face, head shape, hair, facial hair, body
proportions, skin-tone paper colors, costume and paper sculpture style.

Arabic title: the scene contains exactly one piece of text, the Arabic title
"{النص العربي المعتمد}", placed in the reserved negative space. It is built
from precisely cut layered cardstock letters in a {typography style} Arabic
style, color {color}, with real paper thickness, exposed edges and small
contact shadows. The Arabic reads right to left with correctly shaped,
correctly joined letters, spelled exactly as written. No other text anywhere.

[STYLE BLOCK] [STYLE LINE] [PEOPLE BLOCK if people] [PALETTE LINE]
Attach the approved style test frame as a style reference.
[NEGATIVE BLOCK]
```

## 5. Scene image (text-free variant)

Same as template 4, with the "Arabic title" paragraph replaced by:

```
No text of any kind anywhere in the image. Keep the reserved negative space
at {position} clean and uncluttered, as plain paper background, so a title
can be added later.
```

## 6. Universal animation prompt (ten seconds)

```
Stop-motion paper animation of this exact scene. The camera is completely
locked: no zoom, no pan, no tilt, no rotation, no dolly, no handheld shake,
no reframing.

Seconds 0 to 7, assembly: the paper scene builds itself layer by layer from
back to front. The background sheets slide in first, then the mid-ground
pieces, then the foreground pieces and the main subject last. Each piece
slides, lifts, unfolds or drops into place and settles with a tiny handmade
wobble. Every piece keeps its real cardstock thickness, and contact shadows
appear naturally as layers overlap. Motion is deliberate and slightly
stepped, like practical handmade stop-motion shot on twos. No human hands
or tools are ever visible.

Seconds 7 to 10, living paper: the finished scene holds as a gently living
paper poster, matching the source image exactly. Only tiny ambient motion:
{scene-appropriate motion, e.g. paper clouds drifting slightly, a paper flag
fluttering, a paper flame swaying}. No major movement, no repositioning, no
scaling.

Throughout: no morphing, no melting, no liquid or CGI-smooth motion, no
duplicated objects, no objects appearing from nowhere or vanishing, no new
objects that are not in the source image, no change of materials. All
Arabic lettering stays perfectly stable and identical to the source image:
no flicker, no distortion, no separated, reversed or rearranged letters.

Sound: subtle tactile paper ASMR only, soft paper slides, folds, cardstock
taps and layers settling. No speech, no narration, no music.
```

## 7. Adaptable timing instruction

```
Total clip duration is {D} seconds. Use the first {0.7 × D} seconds for the
back-to-front paper assembly and the final {0.3 × D} seconds for the
living-paper hold. The finished scene and its title must be fully visible
and stable for at least the final {max(1.5, 0.3 × D)} seconds.
```

If the video tool only produces fixed-length clips (commonly 5 or 10 seconds):

- Scene shorter than the clip: trim from the start of the assembly, never from the hold.
- Scene longer than the clip: extend the hold by freezing the last frame, or generate a second living-paper-only clip from the finished image and append it.
- Small differences (up to roughly 15%): a slight speed change is acceptable.

`scripts/assemble.py` trims and extends holds automatically from the manifest durations.

## 8. Living-paper-only animation prompt

For tools that only accept a start frame, or for extending a hold:

```
This finished paper diorama stays exactly as it is. Locked camera, no zoom,
no pan. Only tiny ambient stop-motion movement: {motion}. Nothing is added,
removed, moved or transformed. All lettering stays perfectly stable.
Sound: very soft paper ambience only, no speech, no music.
```

## 9. Sound-effect prompts

Short English prompts for a text-to-sound-effect tool, or search terms for a sound library:

```
soft paper sheet sliding across cardstock, close mic, dry, no reverb
single thick cardstock piece dropping into place, soft tap
paper being folded slowly, crisp crease, close mic
stack of paper layers settling, gentle rustle
tissue paper fluttering lightly in a faint breeze
small paper mechanism turning, tiny handmade ratchet clicks
```
