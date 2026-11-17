# The confirmation card (card 10)

The last card before any work starts. It is a summary, not a question about each choice again.

## What it shows, in one screen

1. Every choice, one line each: subject, format, duration, production path, dialect, tone, style, color theme, fonts (main and secondary), voice (own recording, or the generated voice type).
2. Three lines that Claude works out, never guesses:
   - **Scenes.** The expected number of scenes from the duration and the format's pace (see `formats.md`), and the number of images that will be generated.
   - **Tools.** Which tools each stage will use, and whether each is ready according to the setup check at the start (see `preflight.md`). A missing optional tool is named with what the project does without it.
   - **Cost.** A plain warning that generating images and voice may use credits in the creator's own accounts, before the creator agrees. No figure is invented. Quote a price only when the tool itself shows one.

## The two options

- «ابدأ العمل»
- «أعدّل اختيارًا»

If the creator edits, ask which card, show only that card again, then return to this summary. Nothing already chosen is asked twice.

## Rules

- Nothing is generated and no search or download starts before «ابدأ العمل».
- Names in the summary are the creator's own choices, written as they chose them.
- The summary never hides a conflict. If a choice clashes with another (for example a tone that needs confirmation with this subject, see `tones.md`), it is raised here before the creator starts.
