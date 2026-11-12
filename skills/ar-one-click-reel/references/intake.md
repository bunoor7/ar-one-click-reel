# Creative brief: the card flow (replaces the old Stages 1 and 2)

Before any research or writing, collect the creator's choices through a sequence of cards. The flow replaces the old habit of listing a question with options A, B, C, D as running text.

## How the flow works

- **One card per question.** Each card is one question with clickable options. When the session offers a question-card tool (in Claude Code: the structured question tool), use it, one question per call, then move to the next card.
- **The last option is always free text.** The creator can type their own answer if no option fits. Card tools usually add this "other" option automatically. If the tool does not, add it yourself.
- **Card limit.** A card shows at most four options plus the free-text option. Never cram more in. When the full list is longer, show the three or four options that best fit the subject, and say "or type another number" for the rest. Long catalogues (styles, colors, fonts) are shown as a numbered board image instead (see below).
- **Do not re-ask** anything the creator already said in the request. Skip that card, and confirm the answer in the final summary.
- **Recommend.** Put the best option for the subject first and mark it "(موصى به)".
- **No clickable cards available** (a plain chat, or this system used as a pasted prompt): ask the same questions one at a time as a short numbered list, wait for each answer, and never combine several questions in one message.
- Everything the creator sees is in Arabic.

## The sequence

| # | Card | Options |
|---|---|---|
| 1 | الموضوع | Only if not already given. Four example directions chosen to inspire, plus free text. The question: «ما الموضوع الذي تريد تحويله إلى فيديو سينمائي بتقنية الورق المقصوص؟» |
| 2 | القالب | Four best fits for the subject from the ten formats in `stages.md` (documentary explainer, cinematic historical story, biographical portrait, sports documentary, political documentary, Islamic historical narrative, fictional short film, mystery or surprising-fact story, educational explainer, experimental). The rest by free text. |
| 3 | المدة | 30 ثانية، دقيقة، دقيقتان، ثلاث دقائق. Free text for five minutes or a custom length. |
| 4 | اللهجة | خليجي أبيض، عربي فصحى، بحريني، أخرى (free text). |
| 5 | النبرة | The four best fits from: وثائقي جاد، درامي، ملهم، غامض، تعليمي، طريف، مفاجئ، عاطفي، أدبي درامي، مناسب للأطفال. |
| 6 | الأسلوب البصري | Show `assets/style-board.png`. Options: the three styles that fit the subject (by number and name), then free text for another number. |
| 7 | الألوان | Show `assets/palette-board.png`. Options: the three themes that fit the subject, then free text for another number or the creator's own colors. |
| 8 | الخط الأساسي والفرعي | Show `assets/font-board.png`. Two cards: the primary font number (titles), then the secondary font number (dates, numbers, secondary text). Three recommended numbers each, then free text. |
| 9 | الصوت (قبل الأخير) | See "The voice card" below. |
| 10 | التأكيد (الأخير) | A summary of every choice, then two options: «ابدأ العمل» and «أعدّل اختيارًا». |

After «ابدأ العمل», go to Stage 3 (research and story concept). The old rule still holds from there: one stage at a time, and the creator approves each.

### The boards

The boards are PNG files in `assets/`, built by `scripts/make_boards.py` from `assets/fonts.json`, `assets/palettes.json` and `assets/styles.json`.

- Show the board image to the creator, then ask for the number. Never describe a font, a palette or a style by name only; the creator must see it.
- `make_boards.py fonts --sample "عنوان الفيديو"` rebuilds the font board with the real title as the sample text, which is better than the generic sample. Use it when the title is already known; otherwise show the default board.
- If a board file is missing, run `python3 scripts/make_boards.py`.
- For the style board, sample images live in `assets/styles/` as named in `styles.json`. If they are missing, say so, describe the six styles from `styles.json`, and rely on the mandatory test frame in Stage 6 to confirm the choice.

### Fonts

The primary font is used for titles. The secondary font is used for dates, numbers and secondary text. Both come from the bundled set in `assets/fonts/`. The creator may name any number from the board. Record the choices, and pass the numbers to `scripts/arabic_title.py --font N`.

### Colors

The chosen theme is the project's color theme from then on. Every image prompt repeats its hex values (see `prompt-templates.md`), and every title uses its title color. If the creator types their own colors, collect a background, a primary, a secondary and an accent, and pick the title color yourself so that its contrast with the background is at least 4.5.

### The voice card

Ask in two steps.

**Card 9a:** «هل ترفع الصوت بنفسك، أم أتولى أنا توليده؟»

- **«أرفعه بنفسي»:** note it. When the script is approved at Stage 4, hand over the narration as a clean recording sheet: one numbered beat per block, with names flagged for pronunciation, numbers written out, and the pause marks. Later, at Stage 10, the creator's own files replace the generated voice in the assembly.
- **«تولَّ أنت»:** go to card 9b.

**Card 9b: whose voice.** The first option is always «عبدالمنعم إبراهيم» (the creator's own cloned Bahraini voice). The rest:

1. عبدالمنعم إبراهيم (الخيار الأول دائمًا)
2. صوت رجل
3. صوت امرأة
4. صوت عشوائي من الأصوات العربية المتاحة

If the creator picks a man or a woman, ask **card 9c:** «عشوائي أم من اختيارك؟». Random: choose a fitting Arabic voice that matches the dialect and the tone, and say which one you picked. By choice: list three or four candidates with a short description and a preview link, and let the creator choose.

The voice with ID `EgfLdm4bhpTMYoRk8KIf` is a private cloned voice in the author's ElevenLabs workspace. It only exists in the author's account unless the author has published it. So:

1. Look it up with the voice list of the speech tool, first by that ID, then by the name «عبدالمنعم إبراهيم».
2. If it is found, offer it as option 1.
3. If it is not found (the usual case for everyone else), keep the card's shape but tell the creator plainly that this voice is not available in their account, and offer the other options. Never present it as available, and never claim to have used it without a successful generation.
4. Never generate speech with a voice the creator did not choose.

When generating, follow `tools.md`: generate a short sample of the first line with the chosen voice and let the creator approve before generating the whole narration.
