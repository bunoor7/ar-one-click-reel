# Preflight: check what is missing before any work

Run this once, at the start of every new project, before Stage 0. It takes seconds. When everything is present, say one Arabic line («كل المتطلبات جاهزة») and go on to Stage 0. Do not list what is fine.

The plugin is meant for people who have none of the author's own tools. Never assume a tool, a connector, a library or a local folder is there. Check, then say what is missing.

## Step 1: the machine

Run the bundled check from the skill folder.

```bash
python3 -I scripts/preflight.py --fix            # on the creator's own computer
python3 -I scripts/preflight.py --fix --sandbox  # in a disposable cloud workspace
```

- It checks Python 3.8+, Pillow, Arabic letter shaping (Raqm, or arabic-reshaper with python-bidi), ffmpeg and ffprobe, and the bundled fonts. Add `--with-animations` only when the creator wants the code-animation layers: it also checks Node and Playwright.
- `--fix` installs missing Python packages at user level, without asking. This is safe.
- ffmpeg and Node are system programs. Never install them silently. Show the command the script prints for this machine, say in Arabic what it installs, and wait for the owner's yes. After the yes, run `python3 -I scripts/preflight.py --fix-system`. The script never uses sudo on its own: when administrator rights are needed it prints the command for the owner to run.
- A Python managed by the system (a refusal mentioning "externally-managed") needs a virtual environment. Say so and give the two commands. Do not force the install.
- Run it again after fixing. Go on only when it prints Ready.

## Step 2: the connected tools

The script cannot see the session's connectors. Look at what is connected, then group it. A group needs at least one source. The sources for each group are in `tools.md`.

| Group | Needed for | Level |
|---|---|---|
| Image generation | Stages 6 and 7, paper path and paper scenes of the mixed path | Required for those paths |
| Research (web search and page reading) | Stage 3 | Recommended. Without it, mark every fact that still needs checking |
| Voice | Stage 10, unless the creator records the voice himself | Required unless he records it |
| Video generation | Stage 9, when scenes are animated by a generator | Optional. Without it, animate in the edit |
| Sound effects and music | Stage 10 | Optional. Free libraries are listed in `tools.md` |
| Browser | Free web tools (see `free-tools.md`) | Optional |

If a group is missing, look for a connector that fits (the connector registry, when the session has one) and offer it. Never ask for a password, an API key or a token in the chat. When a tool needs one, give the owner the link where he enters it himself.

## Step 3: tell the owner

Only when something is missing, give the owner one short Arabic list, one line for each item, with what it is for and how to add it. Order it by what blocks the work first.

> قبل ما نبدأ ينقصنا الآتي
> 1. ffmpeg (ضروري، لتجميع الفيديو). أمر التثبيت لجهازك مكتوب تحت، وأحتاج موافقتك
> 2. أداة توليد صور (ضرورية للمشاهد الورقية). أقترح توصيل إحدى هذه
> 3. أداة صوت (اختيارية إذا سجّلت الصوت بنفسك)

Then stop and wait for «تم». After it, run the check again and go on.

## Rules

- Items marked optional never block the work. Say once what the creator will not get without them, and go on.
- Required items block the work until they are present. Do not start a stage that needs a missing required item.
- A path that needs no image generator (ready material, own footage) does not ask for one.
- Never say a tool is unavailable without having checked.
