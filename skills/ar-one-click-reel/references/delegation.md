# Delegating routine work to cheaper helpers

If your assistant cannot start helper agents, ignore the helper names below and do the same tasks yourself with the same checklists.

The plugin ships five helper agents (in the plugin's `agents/` folder). Each runs on a cheaper model than the main one. The main model plans, decides and approves. The helpers carry out routine, well-defined tasks and report back. You can start several at once.

**The principle: delegate execution, keep judgment.** A helper may run a script, fill a template, operate a website, or check a list. It may not decide what is true, what the creator approved, or whether a result is good enough.

## The helpers

| Helper | Model | Use it for | Never for |
|---|---|---|---|
| `paper-browser-operator` | Sonnet | Running the finished English prompts on the creator's own signed-in websites in Chrome (Gemini, ChatGPT or another generator) and saving the images or videos | Writing or changing prompts, logging in, anything that costs money beyond the brief |
| `paper-reviewer` | Haiku | First-pass checking: Arabic titles against the approved wording, title contrast, images against the style and colors, timing, file lists, narration against the script. It cannot edit | Final approval, facts, anything it cannot open or measure |
| `paper-prompt-writer` | Haiku | Filling the image-prompt templates for every scene of an approved storyboard | Designing scenes, changing Arabic wording |
| `paper-production-runner` | Haiku | Running `timing.py`, `arabic_title.py`, `make_boards.py`, writing the manifest and running `assemble.py`, file and duration checks | Choosing fonts, colors, positions or durations, judging images |
| `paper-sound-sourcer` | Haiku | Finding licensed paper sound effects and music, with a credits file | Mixing, final sound design, anything with an unclear licence |

## What stays with the main model

- Research and every factual conclusion.
- Writing the script, the storyboard and the visual metaphors.
- Character identities and the style test frame.
- The final check of every Arabic title, and the verdict on every image, clip and the final video.
- Anything the creator must approve.
- Deciding which helper runs, with what budget, and whether its result is accepted.

## When delegation saves money, and when it does not

Every helper starts with an empty memory. It pays to read the files and the brief again. So:

- **Delegate** work that is mechanical, repeated over many scenes, produces long output you do not need to read, or can run in parallel with other work.
- **Do not delegate** a task that takes fewer words to do than to explain, a task that needs the conversation's context, or a single quick check.
- Prefer one helper with a batch ("all 12 scenes") over twelve helpers with one scene each.

## How to brief a helper

The brief is the helper's only memory. Make it complete and short:

1. The goal in one sentence.
2. The files to read, by path: storyboard, script, `prompts.md`, the approved test frame.
3. The locked choices: style number, theme number, font numbers, target length.
4. Exact Arabic text, by pointing to the file that holds it. Do not retype it.
5. The output folder and file names.
6. Limits: the maximum number of generations, the sites allowed, the time budget.
7. What to report, and that the report must be short.

## Running several at once

- Start independent tasks together, at most four at a time.
- Give every helper its own output folder or file-name prefix, so two helpers never write the same file.
- **Only one `paper-browser-operator` at a time**, because they share the creator's one Chrome window and sessions. Several sites in a row are fine; the same browser in parallel is not.
- A helper that depends on another's output (for example the reviewer on the images) starts after that one is back.

## What a test showed (calibration)

A Haiku reviewer was given one scene image and two wordings, one correct and one wrong on purpose. It rejected the wrong wording, measured the contrast correctly (8.78 to 1), and marked the one letter it could not make out as `UNSURE` instead of guessing. That is the behavior to rely on. Two lessons:

- A cheap model cannot be trusted to confirm that Arabic letters and dots are right. Treat its `PASS` on lettering as a hint only. A `FAIL` or `UNSURE` is a reliable reason to look; the main model still checks every title itself.
- With no limit it spent a large number of tokens on one image, searching for an OCR tool. Give it a narrow task and a batch, and keep the effort limit in its instructions.

## After a helper reports

- Open at least one result from every batch yourself. Do not accept a batch on the report alone.
- Anything marked `FAIL`, `UNSURE`, `partial` or `failed` is yours to handle. Fix it or redo it.
- Arabic titles and factual text are always checked by the main model, whatever the reviewer said.
- A helper that cannot do the task has not failed the project. Take the task back and do it yourself.

## Money and accounts

- A helper never spends paid credits, buys, upgrades, or signs up. The brief states the tool and a maximum number of generations, and nothing more is allowed.
- A failed paid generation is never repeated blindly. Look at the cause first.
- The browser operator uses only sites the creator is already signed in to. It never types passwords and never solves captchas.
- Generating through a website's chat interface with automation can be against that service's terms. The creator decides whether to use it. Tell the creator once, before the first browser run, and prefer a connector or API when one is available.

## Where each helper fits in the stages

| Stage | Helper | Task |
|---|---|---|
| 5 Storyboard | `paper-reviewer` | Check titles are 2 to 6 words, spelled as approved, and every scene has the required fields |
| 7 Scene prompts | `paper-prompt-writer` | Write all scene prompts from the storyboard. The main model checks the first one before the rest are used |
| 7 Generation | `paper-browser-operator` | Run the prompts in the creator's browser when no connector is used |
| 7 and 8 Review | `paper-reviewer` | First pass on images and titles. The main model makes the verdict |
| 8 Titles | `paper-production-runner` | Typeset every title with the chosen font, theme and background check |
| 9 Animation | `paper-browser-operator` | Run animation prompts on a site the creator uses, if the brief names one |
| 10 Editing | `paper-sound-sourcer` | Find sound effects and music with licences |
| 10 Editing | `paper-production-runner` | Timing, manifest, assembly and file checks |
| 11 Quality control | `paper-reviewer` | Fill the checklist. The main model signs off |
| Any time | `paper-reviewer` | Compare the conversation's outputs with what was approved, to save the main model's budget |
