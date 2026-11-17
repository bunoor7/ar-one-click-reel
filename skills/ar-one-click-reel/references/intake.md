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

## Before card 1: the setup check

At the start of every new project, run the setup check in `preflight.md` (`scripts/preflight.py`), before the first card. Required items that are missing block the work until the creator has installed them. Optional items never block. Then start with card 1.

## The sequence

| # | Card | Options |
|---|---|---|
| 1 | الموضوع | Only if not already given. Four example directions chosen to inspire, plus free text. The question: «ما الموضوع الذي تريد تحويله إلى فيديو سينمائي بتقنية الورق المقصوص؟» |
| 2 | الشكل | Four best fits for the subject from the ten format cards in `formats.md` (explainer, historical, biography, sports, political, Islamic, fiction, mystery, educational, experimental). Each option shows its hook and pace in one short line. The rest by free text. The format also decides the pace of the scenes. |
| 2ب | طريقة الإنتاج | See `production-paths.md`: ورقي، مبني من مادة جاهزة، فيديو أصوره أنا، مختلط. Only the paper path has full stage text for now. If the creator picks another path, say plainly that it is not ready yet and offer the paper path. Cards 6 and 7 below are asked only for the paper path (and for the paper scenes of a mixed project). |
| 3 | المدة | 30 ثانية، دقيقة، دقيقتان، ثلاث دقائق. Free text for five minutes or a custom length. Mark the length `formats.md` recommends for the chosen format «(موصى به)», and show the scene count the choice gives (13 scenes per minute is the reference for the explainer, scaled for the other formats; a scene is never under 3 seconds). |
| 4 | اللهجة | خليجي أبيض، عربي فصحى، بحريني، أخرى (free text). Show three sample sentences in each dialect so the creator hears it. The script of Stage 4 is then written in that dialect, and on-screen titles stay in Modern Standard Arabic (see `content-and-integrity.md`). |
| 5 | النبرة | The four best fits from the ten tones in `tones.md`. At most two tones, the first leads. Some pairings need the creator's confirmation before the script is written (listed in `tones.md`). |
| 6 | الأسلوب البصري | Show `assets/style-board.jpg`. Options: the three styles that fit the subject (by number and name), then free text for another number. Styles marked `recommended_for` the chosen format in `assets/styles.json` get the mark «الأنسب لهذا الشكل»; every style stays selectable. The layered diorama has an optional frame variant (`image_framed`), off by default. |
| 7 | الألوان | Show `assets/palette-board.png`. Options: the three themes that fit the subject, then free text for another number, the creator's own colors, or **«ارفع صورة»**: run `scripts/palette_from_image.py` on it, show the five colors and the title color, and adopt them only after the creator agrees. |
| 8 | الخط الأساسي والفرعي | Show `assets/font-board.png`. Offer first the pair in `suggested_pairs` of `assets/fonts.json` for the chosen format, for approval in one word. Otherwise two cards: the primary font number (titles), then the secondary font number (dates, numbers, secondary text). Fonts marked `recommended_for` the format get the mark «الأنسب لهذا الشكل». |
| 9 | الصوت (قبل الأخير) | See "The voice card" below. |
| 10 | التأكيد (الأخير) | See `confirmation-card.md`: a one-screen summary with the scene count, the tools and their readiness, and a credits warning, then two options: «ابدأ العمل» and «أعدّل اختيارًا». |

After «ابدأ العمل», go to Stage 3 (research and story concept). The old rule still holds from there: one stage at a time, and the creator approves each.

### The boards

The boards are PNG files in `assets/`, built by `scripts/make_boards.py` from `assets/fonts.json`, `assets/palettes.json` and `assets/styles.json`.

- Show the board image to the creator, then ask for the number. Never describe a font, a palette or a style by name only; the creator must see it.
- `make_boards.py fonts --sample "عنوان الفيديو"` rebuilds the font board with the real title as the sample text, which is better than the generic sample. Use it when the title is already known; otherwise show the default board.
- If a board file is missing, run `python3 scripts/make_boards.py`.
- For the style board, sample images live in `assets/styles/` as named in `styles.json`. If they are missing, say so, describe the six styles from `styles.json`, and rely on the mandatory test frame in Stage 6 to confirm the choice.

### Fonts

The primary font is used for titles. The secondary font is used for dates, numbers and secondary text. Both come from the bundled set in `assets/fonts/`, plus any fonts the creator keeps in their own folder (`scripts/local_fonts.py`, numbers from 101, never copied into the plugin). The creator may name any number from the board. Record the choices, and pass the numbers to `scripts/arabic_title.py --font N`.

### Colors

The chosen theme is the project's color theme from then on. Every image prompt repeats its hex values (see `prompt-templates.md`), and every title uses its title color. If the creator types their own colors, collect a background, a primary, a secondary and an accent, and pick the title color yourself so that its contrast with the background is at least 4.5.

### The voice card

Ask in two steps.

**Card 9a:** «هل ترفع الصوت بنفسك، أم أتولى أنا توليده؟»

- **«أرفعه بنفسي»:** note it. When the script is approved at Stage 4, hand over the narration as a clean recording sheet: one numbered beat per block, vocalized with diacritics that follow the chosen dialect (rules in `content-and-integrity.md`, section "Diacritics on the recording sheet"), with names flagged for pronunciation, numbers written out, and the pause marks. Later, at Stage 10, the creator's own files replace the generated voice in the assembly.
- **«تولَّ أنت»:** go to card 9b.

**Card 9b: which voice.** Options:

1. صوت رجل
2. صوت امرأة
3. صوت عشوائي من الأصوات العربية المتاحة

Random: choose a fitting Arabic voice that matches the dialect and the tone, and say which one you picked. If the creator picks a man or a woman, ask **card 9c:** «عشوائي أم من اختيارك؟». By choice: list three or four candidates with a short description and a preview link, and let the creator choose.

Only voices the speech tool actually lists in the creator's own session are offered. Never name a specific person's voice, never use a voice that was cloned from someone else, and never claim to have used a voice without a successful generation. Never generate speech with a voice the creator did not choose.

When generating, follow `tools.md`: generate a short sample of the first line with the chosen voice and let the creator approve before generating the whole narration.
