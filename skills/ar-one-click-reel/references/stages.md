# Production stages

Routine steps inside a stage can be handed to the cheaper helper agents; `delegation.md` lists which helper fits which stage and what must stay with the main model.

Follow the stages in exact order. Complete one, stop, and wait. Proceed only on explicit approval or «التالي». If revisions are requested, stay in the current stage.

---

## Stages 1 and 2: Creative brief

Run the card flow in `intake.md`. It collects, one card at a time: subject, format, duration, dialect, tone, visual style, color theme, primary and secondary fonts, and voice, and ends with a confirmation card.

- If the creator already gave the subject or any other choice in the request, do not ask for it again.
- Report, in one or two lines before the first card, which production tools are available in this session (images, voice, video, sound), so the creator knows early what will be generated here and what they will run themselves. See `tools.md`.
- Use reasonable creative defaults for anything the creator leaves open, and show them on the confirmation card.

Stop at the confirmation card and wait for «ابدأ العمل».

---

## Stage 3: Research and story concept

For factual topics, first establish a verified factual foundation. Research the relevant names, dates, events, historical context, key quotations, statistics, chronology, important controversies, and documentary evidence. Use reliable sources when available. Clearly identify major factual uncertainties. Do not invent facts.

For fictional topics, develop the narrative concept instead.

Create an Arabic project concept sheet containing:

1. Proposed video title.
2. Central idea.
3. Audience takeaway.
4. Narrative angle.
5. Opening hook.
6. Story progression.
7. Main turning point.
8. Planned ending.
9. Emotional tone.
10. Suggested visual metaphor.
11. Main recurring characters, if any.
12. Source notes or factual cautions, when applicable.

If the topic involves a disputed historical interpretation, identify the issue before script approval. If research tools are not available, state the verification limitation. For fiction, label the project as fictional.

Stop and wait for approval.

---

## Stage 4: Complete Arabic script

Write the full, production-ready voiceover narration in Arabic, matched to the selected duration, with natural spoken pacing.

The script must be engaging, coherent, accurate where factual, visually expressive, easy to narrate, clear to the general audience, and suitable for the chosen genre.

- Each numbered beat communicates one complete narrative idea and can become one visual scene.
- Use a compelling opening and develop the story with natural momentum.
- Maintain continuity between events. Avoid disconnected factual lists.
- Use appropriate pauses.
- Do not introduce dialogue that is falsely attributed to a real person. For fictional stories, dialogue may be invented. For factual documentaries, distinguish paraphrased explanations from actual quotations.

Provide:

A. The complete numbered Arabic voiceover script.
B. Estimated duration.
C. Approximate narration word count.
D. A brief note identifying any factual uncertainties that affect the script.

Save the script as a text file with one numbered beat per line and run `scripts/timing.py` on it to produce B and C rather than estimating by eye.

If the creator chose to record the voice themselves in the brief, also hand over the approved narration as a recording sheet: one numbered beat per block, pronunciation notes for names, numbers written out as they are spoken, and the pauses marked. Do this after the script is approved.

Do not produce image prompts yet.

At the end, write: «راجع النص، ثم اكتب: التالي»

Stop and wait.

---

## Stage 5: Visual storyboard

After script approval, create a complete scene-by-scene storyboard. For every narration beat, provide:

1. Scene number.
2. Exact Arabic narration.
3. Exact Arabic on-screen title.
4. Estimated scene duration.
5. Main visual subject.
6. Supporting objects.
7. Background environment.
8. Paper construction concept.
9. Main visual symbolism.
10. Color palette.
11. Emotional atmosphere.
12. Character presence, if applicable.
13. Animation concept.
14. Transition idea.

All storyboard explanations are in Arabic.

- The Arabic on-screen title normally contains 2 to 6 words. Do not duplicate the entire narration sentence inside the image. Prefer short editorial titles.
- Use accurate Arabic spelling. Avoid unnecessary on-screen writing.
- If a date, name, or number is essential, include it only when verified.
- Ensure the image meaning matches the narration. Do not force unrelated symbolism into the scene.
- Maintain a coherent visual flow across scenes.
- Use the primary and secondary fonts the creator chose in the brief, and the chosen color theme. Do not propose different ones. Write the theme's hex values into the storyboard header so every later prompt repeats them.

Stop and wait for approval.

---

## Stage 6: Style test frame, character references and visual identity lock

**Step 0: Style test frame (mandatory, even when there are no characters).** Before generating anything else, generate exactly one test frame in the style the creator chose, using the style's prompt from `assets/styles.json`, the chosen color theme, and the people rule. If the project has people, the frame must include a face and a hand, because that is where generators slide into a cartoon look. Ask the image tool which model suits the request (for example the Higgsfield model recommender) instead of assuming one, and say which model was used.

Inspect the frame yourself against this list, then present it:

- Is it paper, or is it a cartoon or a soft 3D render? Check faces and hands first.
- Are the cut edges, layer steps and paper thickness visible?
- Does it use the chosen colors and nothing far outside them?
- Is the style the one the creator picked?

If it fails, fix it in this order, and show the corrected frame: (1) strengthen the people rule and the negative list in the prompt; (2) simplify people, with fewer features, in profile or from behind, or as silhouettes; (3) attach the best earlier frame as a style reference; (4) change the model. Do not generate the other scenes until the creator approves the test frame. The approved frame is then attached as a style reference to every later scene.

Then continue with the character steps below.

Before generating any final scene images, establish and approve a consistent visual identity for every recurring character. This stage is mandatory whenever the project contains recurring human characters, fictional characters, animals, or distinctive recurring objects.

**Step 1: Character identity.** For each recurring character, write a detailed identity specification: unique character ID, name, historical period or fictional setting, approximate age, facial structure, distinctive facial features, hairstyle, facial hair if applicable, skin-tone paper palette, body proportions, clothing and accessories, signature colors, recognizable silhouette, paper sculpture construction, and scene-specific appearance variations.

For real personalities, use reliable visual references when available. Never invent a precise likeness when the person's appearance is historically unknown. Respect all religious depiction restrictions.

**Step 2: Generate character reference images.** Generate an actual visual reference image for every recurring character using the available image-generation tool (see `tools.md`, template in `prompt-templates.md`). Each reference represents the character as a premium handcrafted dimensional paper sculpture. Where practical, produce a reference sheet containing:

1. Front view.
2. Three-quarter view.
3. Side view.
4. Full-body view.
5. Key facial-expression details.
6. Clothing and accessory details.

Maintain identical facial features, proportions, colors, and paper materials across the views. Do not introduce different character interpretations between views.

If image generation is unavailable, explicitly state that the reference images have not been generated, and hand the user the prompts to run themselves. Do not treat text descriptions as a substitute for actual approved reference images.

**Step 3: User approval.** Present the generated reference images. Ask for approval before continuing. Do not generate final scene images until the user approves the character identities. If the user requests changes, revise the affected reference images. Keep approved characters unchanged.

**Step 4: Visual identity lock.** After approval, designate each reference image as the authoritative visual identity for its character. All later scenes must preserve facial identity, head shape, hair and facial hair, body proportions, skin-tone paper colors, signature costume details, paper sculpture style, and distinctive accessories. Only make changes when required by the narrative or explicitly approved. Historically justified changes, including aging and documented costume changes, are permitted.

**Step 5: Reference-based image generation.** Whenever the image-generation tool supports reference images, use the approved character references as actual image inputs for subsequent scene generation. Written descriptions alone are insufficient when reference-image guidance is available. Every scene prompt must explicitly instruct the generator to preserve the identity of the approved reference character. Never introduce an unrelated face or a visually different interpretation of the same character.

**Step 6: Continuity verification.** After generating each scene, compare recurring characters against their approved reference images whenever image inspection is available. Verify face, hairstyle, body proportions, costume accuracy, color consistency, paper construction style, and distinctive physical features. Mark any mismatch as NEEDS REVISION. Do not approve an inconsistent scene without correcting the mismatch or obtaining explicit user approval.

**Step 7: Special cases.** If a character's historical appearance is unknown, prefer symbolic representation, an explicitly non-portrait interpretation, or historically appropriate visual storytelling. For Islamic religious figures whose depiction is inappropriate, do not generate a human character reference. Instead, establish a consistent symbolic visual identity through locations, architecture, historical objects, and environmental motifs.

If the project contains no recurring characters or identifiable recurring objects, mark this stage NOT APPLICABLE. In that case, still generate one style frame (a single key scene) to lock the paper look, palette, and lighting before producing all scenes.

Character identity approval is a mandatory production checkpoint. Never proceed to final scene image generation before all required references have been generated and approved.

Stop and wait for «التالي».

---

## Stage 7: Scene image prompts and generation

For every storyboard scene, write one production-ready image prompt in English using the scene template in `prompt-templates.md`. Each prompt must state:

- Format and quality: vertical 9:16, highest quality, premium cinematic detail.
- The paper-world rules: everything is handcrafted layered paper, self-contained world, no external set.
- Primary subject, up to three supporting objects, background environment.
- Paper construction details, palette, lighting, camera.
- Character identity instructions that point to the approved reference image.
- The exact Arabic title in quotation marks, its placement in reserved negative space, and its typography style. State that no other text may appear.
- The chosen style's prompt text and the color theme's hex values, repeated in every prompt, and the people rule for any scene with people.
- The approved test frame attached as a style reference.
- A negative list: no flat vector look, no cartoon, no plastic or glossy 3D, no real-world set, no hands of a real person, no extra text, no pseudo-Arabic.

For each scene also prepare a text-free variant of the same prompt (the title area left as clean negative space). It is used when the generator fails to render the Arabic correctly, and as the source frame for animation when the title is added in the edit.

Then:

1. Present the prompts for one or two representative scenes first and generate them as a test. Confirm the look with the user before spending credits on the full set.
2. Generate the remaining scenes, attaching the approved character references as image inputs wherever the tool supports them.
3. Inspect every generated image: paper craftsmanship, composition, character continuity (Stage 6, Step 6), factual and period accuracy of costumes and settings.
4. Present the images with a short status per scene. Mark failures NEEDS REVISION and regenerate only those scenes.

If image generation is unavailable in the session, deliver the full prompt set as a file and state clearly that no images have been generated.

Do not verify typography yet. That is Stage 8.

Stop and wait.

---

## Stage 8: Arabic text verification

Before approving the generated images, perform a typography verification stage. For every image, check:

- Does the Arabic text match the approved text exactly?
- Are the Arabic letters correctly connected?
- Is the reading direction correct?
- Are any letters mirrored, missing, or extra?
- Are punctuation marks correct?
- Are dates and numbers accurate?
- Is the title readable on a mobile screen? Measure the contrast between the title and what is behind it; it must be at least 4.5. A title that is only slightly lighter or darker than its background fails, even if the letters are correct.
- Does it overlap an important visual object?
- Is the text constructed from paper rather than pasted as digital typography?

When image inspection is possible, examine the actual generated image. Do not claim verification based only on the prompt. If the image has not been provided, state that visual verification is pending.

If the generator cannot render the text correctly, provide:

A. A revised Arabic typography prompt (one retry is usually enough to know whether the model can do it).
B. The clean image without typography, from the text-free prompt.
C. A separate exact Arabic text overlay specification: wording, typeface, size, position, color.
D. The overlay itself, rendered with `scripts/arabic_title.py` using the chosen font number and theme number, in a paper-cut style matched to the scene's light direction, or instructions for matching it in the user's editor. The script checks the contrast for you; run it with the scene image so that it samples the real background.

Never modify the approved Arabic wording without permission.

Stop and wait.

---

## Stage 9: Animation prompt production

Create one universal animation prompt in English, suitable for applying to the approved paper images. The ready-made version is in `prompt-templates.md`; adapt it to the project rather than rewriting it from nothing. It must include:

**Camera.** Completely locked camera. No zoom, pan, tilt, rotation, dolly movement, handheld movement, or reframing.

**Assembly.** The scene assembles itself layer by layer from back to front. Paper pieces slide in naturally. Individual layers settle into place. Every layer preserves real paper thickness. Shadows form consistently as pieces overlap. The movement looks like practical handmade stop-motion. No visible human hands.

**Living paper.** After construction, the completed scene becomes a gently animated paper poster. Only tiny atmospheric movements are allowed. No major repositioning, scaling, object morphing, object duplication, sudden disappearance, or invented objects.

**Typography.** All Arabic letters remain stable. No flickering, melting, letter separation, incorrect transformations, reversal, or rearrangement.

**Sound.** Subtle tactile paper ASMR. No invented speech. No automatic background narration. No overpowering sound effects.

**Timing.** Provide a universal ten-second version (seconds 0 to 7: layer-by-layer assembly; seconds 7 to 10: living-paper hold), plus one adaptable timing instruction for scenes with a different approved duration. If a tool requires fixed-duration clips, explain the necessary editing adjustment.

Output only the universal prompt and the adaptable timing instruction.

Most image-to-video models take the finished image as the last frame or the first frame. For an assembly animation, the finished scene image should be supplied as the END frame where the tool supports start and end frames; where it supports only a start frame, either generate the clip from the finished image with living-paper motion only and build the assembly in the edit, or generate from the finished image and reverse a "disassembly" clip. State which approach the available tool requires.

If the user asks for the clips to be generated in this session, animate one scene first as a test, inspect it, then continue with the rest.

Stop and wait.

---

## Stage 10: Final production and editing plan

Prepare the complete editing blueprint in Arabic. For each scene, provide:

- Scene number
- Narration
- Scene duration
- Animation duration
- Narration start point
- Arabic title appearance
- Transition type
- Suggested paper sound effect
- Background sound or music note, if applicable
- Visual continuity reminder

Make sure the total duration aligns with the selected video length. Do not hide unexplained timing differences. Identify where pauses or visual holds are needed. Recommend transitions that preserve the handcrafted paper aesthetic. Avoid excessive effects. The plan must make the project practical to assemble in a video editor.

When the user wants the production carried out here and the tools are available:

1. Voiceover. If the creator records it, collect their files and use them. If you generate it, use the voice chosen in the brief (see `intake.md` and `tools.md`): generate a sample of the first line, get approval, then generate the rest. Flag proper names whose pronunciation needs review.
2. Measure the real duration of each narration line and update the scene durations.
3. Gather sound effects and, if requested, music.
4. Write the manifest and run `scripts/assemble.py` to produce a first cut.
5. Watch the result before presenting it.

Stop and wait.

---

## Stage 11: Final quality control

Before declaring the production package complete, perform a structured review.

**A. Story**
- Does the opening attract attention?
- Is the story coherent?
- Does each scene serve the narrative?
- Is the ending meaningful?

**B. Factual quality**
- Are important claims verified?
- Are names and dates accurate?
- Are uncertainties disclosed?
- Are fictional elements properly distinguished?

**C. Visual quality**
- Is the paper construction convincing?
- Does the visual style remain consistent?
- Are scenes sufficiently varied?
- Is each visual beat clear?
- Is the framing suitable for mobile viewing?

**D. Character continuity**
- Do recurring characters look consistent?
- Are costumes historically appropriate?
- Are important distinguishing features preserved?

**E. Arabic typography**
- Is the wording accurate?
- Is the reading direction correct?
- Are the letters correctly connected?
- Is every title readable?
- Are there any invented or malformed characters?

**F. Animation**
- Is the camera locked?
- Does the scene assemble naturally?
- Are paper layers physically convincing?
- Does the text remain stable?
- Are there morphing or duplication artifacts?

**G. Audio**
- Does the narration sound natural?
- Is the pacing appropriate?
- Are sound effects restrained?
- Are pronunciation issues identified?

**H. Final duration**
- Does the total timeline match the selected duration?
- Are any scenes unnecessarily long or short?
- Does the narration align with the correct visual scene?

Mark each item as PASS, NEEDS REVISION, or NOT YET VERIFIED.

Never mark an image or video as PASS if it has not actually been inspected. If an issue is identified, give a precise correction. Do not silently change approved narration, character identities, or factual conclusions.
