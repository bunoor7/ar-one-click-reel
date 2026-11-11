<div dir="rtl">

# AR One Click Reel

**نظام إنتاج عربي يحوّل أي موضوع إلى فيديو سينمائي بتقنية الورق المقصوص والستوب موشن.**

تعطيه موضوعًا: حدثًا تاريخيًا، شخصية رياضية، فكرة علمية، قصة خيالية، أو سؤالًا غريبًا. فيقودك خطوة بخطوة من البحث إلى السكربت، فلوحة القصة، فالصور، فالتعليق الصوتي، فالتحريك، فالمونتاج، وكأن الفيديو كله مصنوع من ورق مقصوص باليد ومصوَّر بكاميرا سينمائية.

يعمل بطريقتين:

- **بلقن (Plugin) لـ Claude**: مهارة جاهزة مع سكربتات مساعدة.
- **برومت واحد** في ملف [`MASTER-PROMPT.md`](MASTER-PROMPT.md) يُلصق في أي مساعد ذكاء اصطناعي آخر.

## ماذا يفعل؟

يعمل على إحدى عشرة مرحلة، ولا ينتقل من مرحلة إلى التي بعدها إلا بموافقتك (اكتب «التالي»):

| # | المرحلة | الناتج |
|---|---|---|
| 1 | اختيار الموضوع | الموضوع |
| 2 | القالب والمدة واللغة | نوع الفيديو، مدته، لهجة التعليق، النبرة |
| 3 | البحث وتصور القصة | أساس معلوماتي موثق وورقة تصور |
| 4 | السكربت العربي الكامل | نص تعليق مرقّم مع التوقيت |
| 5 | لوحة القصة | وصف كل مشهد وعنوانه العربي |
| 6 | مراجع الشخصيات | صور مرجعية معتمدة تثبّت شكل كل شخصية |
| 7 | صور المشاهد | برومتات إنجليزية وصور المشاهد |
| 8 | تدقيق النص العربي | فحص كل عنوان داخل الصور وإصلاحه |
| 9 | التحريك | برومت تحريك موحّد ومقاطع متحركة |
| 10 | خطة الإنتاج والمونتاج | مخطط مونتاج، تعليق صوتي، تجميع |
| 11 | ضبط الجودة | مراجعة نهائية بندًا بندًا |

## ما الذي يميّزه؟

- **العربية أولًا**: السكربت والعناوين بالعربية، بالفصحى أو بلهجة تختارها، والبرومتات التقنية بالإنجليزية لأنها تعطي نتائج أدق مع مولدات الصور والفيديو.
- **حروف عربية سليمة دائمًا**: مولدات الصور تخطئ كثيرًا في العربية. لذلك يفحص النظام كل عنوان، وإذا فشل المولد يرسم العنوان بسكربت يستخدم تشكيلًا حقيقيًا للحروف، بمظهر ورقي له سماكة وظل.
- **انضباط في المعلومة**: يفصل بين الثابت والمختلف عليه، ولا يخترع تواريخ أو أقوالًا، وله ضوابط خاصة للموضوعات الإسلامية (لا تصوير للأنبياء، ولا نصوص دينية غير موثقة).
- **شخصيات ثابتة**: صورة مرجعية معتمدة لكل شخصية تُستخدم في كل المشاهد.
- **لا يرتبط بأداة واحدة**: يعمل مع ما هو متاح عندك من مولدات الصور والصوت والفيديو.

## التثبيت

### في Claude Code

</div>

```bash
/plugin marketplace add bunoor7/ar-one-click-reel
```

```bash
/plugin install ar-one-click-reel@ar-one-click-reel
```

<div dir="rtl">

ثم اكتب مثلًا: «سوّ لي فيديو ورق مقصوص عن جنون التوليب»، أو استدعِ المهارة مباشرة:

</div>

```bash
/ar-one-click-reel:ar-one-click-reel
```

<div dir="rtl">

### في Claude (التطبيق أو Cowork)

حمّل المستودع، اضغط مجلد `skills/ar-one-click-reel` في ملف ZIP، ثم ارفعه من إعدادات المهارات (Skills).

### في أي مساعد آخر

انسخ محتوى [`MASTER-PROMPT.md`](MASTER-PROMPT.md) والصقه رسالةً أولى أو تعليمات نظام. السكربتات المساعدة تعمل على جهازك مستقلةً عن المساعد.

## الأدوات المساعدة

النظام لا يفرض أداة بعينها. ملف [`references/tools.md`](skills/ar-one-click-reel/references/tools.md) يشرح الخيارات لكل خطوة:

| الخطوة | أمثلة على الأدوات |
|---|---|
| الصور | نماذج GPT Image و Nano Banana و Seedream و Flux و Midjourney |
| التعليق الصوتي | ElevenLabs، أو تسجيل بشري |
| التحريك | Kling و Veo و Seedance و Runway |
| المؤثرات الصوتية | ElevenLabs SFX و Freesound و Pixabay و Mixkit، أو تسجيل ورق حقيقي |
| الموسيقى | مكتبة مرخّصة مثل Artlist |
| الخطوط | 18 خطًا عربيًا مفتوح الترخيص من Google Fonts |
| التجميع | ffmpeg، أو DaVinci Resolve و CapCut |

إذا كانت موصلات مثل Higgsfield أو ElevenLabs أو Artlist مربوطة بجلستك في Claude، فالمهارة تستخدمها مباشرة لتوليد الصور والصوت والفيديو. وإن لم تكن، فستسلّمك البرومتات لتشغّلها بنفسك.

### السكربتات

تحتاج Python 3 ومكتبة Pillow و ffmpeg.

</div>

```bash
cd skills/ar-one-click-reel/scripts

# 1. تنزيل الخطوط العربية
bash get_fonts.sh fonts

# 2. حساب توقيت المشاهد من السكربت (سطر لكل مشهد)
python3 timing.py script.txt --target 60

# 3. رسم عنوان عربي ورقي على صورة مشهد
python3 arabic_title.py --image scene.png --out scene_titled.png \
  --text "جنون التوليب" --font fonts/Lalezar-Regular.ttf --position top

# أو عنوان بخلفية شفافة لبرنامج المونتاج
python3 arabic_title.py --transparent --out title.png \
  --text "ليلة إسطنبول" --font fonts/Cairo.ttf --weight 800

# 4. تجميع الفيديو النهائي من ملف وصف
python3 assemble.py manifest.json
```

<div dir="rtl">

| السكربت | وظيفته |
|---|---|
| `get_fonts.sh` | ينزّل الخطوط العربية المفتوحة |
| `timing.py` | يحسب عدد الكلمات ومدة كل مشهد وبدايته ويقارنها بالمدة المستهدفة |
| `arabic_title.py` | يرسم عنوانًا عربيًا سليم الحروف بمظهر ورق مقصوص |
| `assemble.py` | يجمع المقاطع والعناوين والتعليق والمؤثرات والموسيقى في فيديو عمودي |

## بنية المستودع

</div>

```
.claude-plugin/            تعريف البلقن والمتجر
skills/ar-one-click-reel/
  SKILL.md                 الهوية، سياسة اللغة، سير العمل، قواعد التفاعل
  references/              تفاصيل كل جانب، تُقرأ عند مرحلتها
  scripts/                 السكربتات المساعدة
MASTER-PROMPT.md           النظام كله في ملف واحد (يُبنى بـ build_prompt.sh)
```

<div dir="rtl">

بعد أي تعديل على ملفات المهارة، أعد بناء الملف الموحد:

</div>

```bash
./build_prompt.sh
```

<div dir="rtl">

## ملاحظات صريحة

- الاسم «One Click» يعبّر عن سهولة البدء، لكن النظام يتوقف عمدًا عند كل مرحلة لتراجع وتعتمد. هذا ما يحفظ دقة المعلومة وجودة الصورة.
- مولدات الصور والفيديو والصوت خدمات مدفوعة في الغالب، ولكل منها شروط استخدام. أسماء النماذج تتغير بسرعة، فراجع ما هو متاح عندك.
- لا يوجد برومت يضمن عربية سليمة داخل الصورة. افحص كل عنوان بعينك.
- المحتوى التاريخي والديني مسؤولية صانعه. النظام يساعدك على التحقق، ولا يغني عن مراجعتك.

## المساهمة

الاقتراحات والتعديلات مرحّب بها عبر Issues و Pull Requests: خطوط إضافية، قوالب برومتات، تجارب مع نماذج جديدة، أو دعم لهجات أخرى.

## الترخيص

MIT. الخطوط التي ينزّلها `get_fonts.sh` مرخّصة برخصة SIL Open Font License من أصحابها.

</div>

---

## English summary

**AR One Click Reel** is an Arabic-first production system that turns any subject into a cinematic paper-cut stop-motion video. It ships as a Claude plugin (one skill with staged workflow, reference files and helper scripts) and as a single paste-anywhere prompt (`MASTER-PROMPT.md`).

It runs eleven approval-gated stages: subject, format, research, Arabic script, storyboard, character references, scene images, Arabic text verification, animation, editing plan, and quality control. It is tool-agnostic for image, voice, video and sound generation, and includes scripts for scene timing, correctly shaped paper-cut Arabic titles (Pillow with Raqm/HarfBuzz), font download, and ffmpeg assembly.
