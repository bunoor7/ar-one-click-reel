# Animation, timing, and sound

## Animation philosophy

Animate each paper scene as if it were assembled by an invisible stop-motion artist. The animation must preserve the physical identity of the paper objects.

- Use handcrafted stop-motion behavior: deliberate, tactile, slightly imperfect movement.
- Avoid smooth liquid CGI morphing.
- Avoid impossible transformations of solid paper objects and unexplained material changes.
- Preserve realistic paper thickness and contact shadows during motion.
- The scene should feel physically assembled rather than digitally generated.

Default animation sequence:

**Phase A: Assembly.** The scene constructs itself from background to foreground. Paper layers slide, lift, unfold, or settle into their final positions. Each layer casts physically consistent shadows. No human hands are visible.

**Phase B: Living paper.** After the assembly completes, the scene becomes a gently living paper poster. Allow only subtle motion appropriate to the scene:

- Tiny paper cloud movement
- Delicate paper flag fluttering
- Minimal paper character breathing
- Slow blinking
- Gentle paper flame movement
- Subtle shifting light
- Slight movement of paper leaves
- Soft ambient paper motion

No major object movement during the final hold. Preserve the Arabic text in its exact final state. Do not animate text through letter morphing. Do not distort or separate Arabic letters.

Practical note: video models distort Arabic lettering more often than image models do. When a scene's title must be exact, animate the text-free version of the scene and add the title in the edit as a separate layer rendered by `scripts/arabic_title.py --transparent`.

## Animation timing and narration synchronization

Never assume every visual beat must last exactly ten seconds. The user-selected video duration controls the complete project.

Estimate Arabic narration timing from natural spoken delivery. Use approximately 2.0 to 2.5 spoken Arabic words per second as an initial planning range (`scripts/timing.py` does this calculation). Adjust for:

- Dialect
- Dramatic pauses
- Proper names
- Complex historical terminology
- Emotional delivery
- Visual transitions
- Silent moments

Do not force unnatural fast speech to satisfy an arbitrary word target. Once the real voiceover exists, replace the estimates with the measured duration of each line.

For every scene, calculate:

- Narration duration
- Visual duration
- Paper assembly duration
- Living-paper hold duration
- Transition duration, if required

Default proportions for a ten-second scene: the first seven seconds are layer-by-layer paper assembly, and the final three seconds are subtle living-paper animation. For shorter or longer scenes, scale the assembly and hold durations proportionally.

- Maintain at least a brief stable period in which the finished scene and Arabic text are clearly visible.
- Avoid scenes where the text appears only at the final instant.
- The spoken narration must correspond to the correct visual beat.
- If the video model supports only a fixed clip duration, provide a practical editing plan using trimming, extended holds, speed changes, or separate clips.
- Do not falsely claim that one animation prompt guarantees precise synchronization across all narration lengths.

## Sound design

Sound must reinforce the tactile paper world. Use subtle paper ASMR elements when appropriate:

- Paper sliding
- Paper folding
- Cardstock tapping
- Soft paper friction
- Layer settling
- Gentle paper movement
- Tiny handcrafted mechanical sounds

Avoid excessive or distracting sound effects. Sound effects must not overpower Arabic narration.

Music, when requested, must complement the genre:

| Genre | Music |
|---|---|
| History | Subtle atmospheric cinematic score |
| Sports | Controlled rising energy |
| Mystery | Restrained suspense |
| Short stories | Emotionally appropriate ambient score |
| Science | Modern minimal atmosphere |
| Islamic historical content | Respectful sound design consistent with the requested production style and audience |

Do not automatically add music to religious scenes.

For animation prompts, specify sound effects separately from final voiceover mixing. The video-generation model must not invent spoken dialogue or random narration. The final Arabic narration is added through the dedicated voiceover workflow (see `tools.md`).

Suggested mix levels as a starting point: narration around -16 LUFS integrated for social platforms, sound effects 10 to 14 dB below the narration, music 18 to 22 dB below it while the narrator speaks.
