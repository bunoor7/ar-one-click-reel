# Using free tiers of web tools

Many image and video generators on the web give a free allowance: a few generations a day, or starter credits. The creator can use these to produce the video at little or no cost. This file is how to plan around them and what the limits are. The browser helper (`paper-browser-operator`) does the clicking; the main model does the planning.

Free allowances change often and differ by country and account. **Never state a quota from memory.** Read what the site itself shows, and record it.

## Rules

- **The creator signs in, not the helper.** The helper never creates an account, never types a password, never solves a captcha. If a site needs sign-in, the creator does it in their own browser, then the helper continues.
- **One account per person per service.** Never create several accounts, rotate accounts, use another person's account, or use any trick to get past a limit. That breaks the services' terms, gets accounts banned, and the creator loses the allowance for good.
- **When the limit is reached, stop.** Report the limit message and the reset time the page shows. Move that work to another site, wait for the reset, or hand the prompts to the creator.
- **Free results have conditions.** Check the page for: watermark, lower resolution, a queue or slow speed, and whether commercial use is allowed. Many free tiers forbid commercial use or require credit. If the video will be published or monetised, the creator decides, with those conditions in front of them. When in doubt, regenerate the final scenes on a tier whose terms allow the use.
- **Automating a website can be against its terms.** The creator decides. Tell them once before the first browser run. Prefer a connector or official interface when one exists.

## The free-tier log

The helper keeps one file for the project, `free-tier-log.md`, with one line per site:

```
SITE | MODEL SHOWN | WHAT WAS MADE | LIMIT SEEN | RESETS | ASPECT 9:16? | RESOLUTION | WATERMARK | COMMERCIAL USE (as shown) 
```

Fill each column from the page. Write `not shown` when the page does not say. The main model reads this file before planning the next batch and never guesses.

## Planning around free allowances

1. **Ask where to generate** (the card at the start of Stage 7), and which sites the creator already uses or is willing to sign in to.
2. **Do the important frames first**, on the best tool the creator has: the style test frame, then the hero scenes. Spend free allowance where the quality matters.
3. **Spread the rest across sites** by what each one's page says is left. Keep a note of which scene was made where, since each tool has its own look. Mixing tools harms the unity of the style, so lean on the approved test frame as a reference, and regenerate any scene that clearly breaks the look.
4. **Make clips short.** Free video generation is the scarcest. Prefer a single strong image per scene with the assembly and living-paper motion built in the edit (see the options in `tools.md`), and spend video allowance only on the scenes that need motion.
5. **Use the text-free variant** on tools that cannot spell Arabic. Add the titles with `scripts/arabic_title.py`.
6. **Order of fallback:** connector credits the creator already has, then free web tiers through the browser, then the creator running the prompts by hand from `prompts.md`.

## Watch for

- A free model that cannot take reference images cannot keep a character consistent. Prefer one that can for any scene with a recurring character, or keep that character to the tool that holds the approved reference.
- Some free tools choose the aspect ratio for you. If 9:16 is not offered, generate at the nearest ratio with generous margins and crop in the edit, and say so in the log.
- Never pass a site anything private from the project beyond the prompt text.
