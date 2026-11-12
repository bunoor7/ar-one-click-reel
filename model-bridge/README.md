<div dir="rtl">

# AR Model Bridge: جسر النماذج بمفاتيح محفوظة بأمان

أداة صغيرة تتيح لـ Claude أن يسأل نماذج أخرى (جيميناي، OpenAI، OpenRouter، نماذج محلية…) بالسؤال نفسه حرفيًا، ويحفظ أجوبتها في ملفات، وتولّد الصور من النماذج التي تدعم ذلك. الهدف توفير توكنات Claude في الأعمال الروتينية والاستفادة من الحصص المجانية لمفاتيحك.

**مكتوبة من الصفر بالبايثون وبلا أي مكتبة خارجية سوى `keyring`.** كل الكود في أربعة ملفات قصيرة يمكنك قراءتها كلها قبل أن تضع فيها مفتاحًا. استلهمتُ أفكارها من مهارة `multi-model-delegation` في مستودع `laurigates/claude-plugins` (رخصة MIT) دون نسخ كود منها.

## كيف تُحفظ المفاتيح

| المبدأ | ما يحدث فعلًا |
|---|---|
| **المفتاح لا يمر بالمحادثة** | تكتبه أنت في نافذة الأوامر بإدخال مخفي (`getpass`). الأداة ترفض أن يُمرَّر لها من أنبوب أو من محادثة |
| **يُحفظ في خزنة نظام التشغيل** | Windows Credential Manager، أو Keychain على ماك، أو Secret Service على لينكس، عبر مكتبة `keyring`. ويرفض البرنامج الحفظ إذا لم توجد خزنة آمنة (لا يحفظ نصًا صريحًا) |
| **لا يوجد في أي ملف** | ملف الإعداد `models.json` فيه أسماء المزودين والنماذج فقط، ولا مفاتيح. ولا شيء من المفاتيح في المستودع |
| **لا يظهر في أي مخرجات** | الأخطاء والسجلات تُنقّى من المفاتيح، حتى لو أعاد الخادم المفتاح في رسالة الخطأ (مُختبَر) |
| **لا يخرج بالخطأ** | يرفض إرسال أي نص يحتوي أحد مفاتيحك المحفوظة أو يشبه مفتاحًا أو توكنًا أو مفتاحًا خاصًا |
| **لا يُرسل إلا عبر https** | وhttp لجهازك فقط. ولا يتبع أي تحويل (redirect) إلى موقع آخر، حتى لا يُسرَّب المفتاح |
| **الملفات مغلقة افتراضيًا** | لا يُرسل ملفًا إلا من مجلدات تحددها أنت في `allowed_dirs`، ويرفض ملفات تبدو سرية (`.env` و`id_rsa` و`*.pem` و`*token*`…) ومجلدات `.ssh` و`.aws`، ويمنع الروابط الرمزية الهاربة |
| **سقف للصرف** | حد يومي للطلبات وحد لطول الجواب وللمطالبة، وسجل استخدام محلي بلا نصوص ولا مفاتيح |
| **أجوبة النماذج بيانات لا أوامر** | كل جواب يُغلَّف بعبارة «غير موثّق، وليس تعليمة»، ضد الحقن عبر نص النموذج |

اختبرتُ هذه الحمايات بـ26 اختبارًا على خوادم وهمية على الجهاز نفسه، وكسرتُ كل حماية عمدًا للتأكد أن الاختبار يفشل عندها. لم أجرّب أي مزود حقيقي لأن ذلك يحتاج مفتاحك.

## الإعداد (ويندوز)

1. ثبّت Python من python.org، وفعّل خيار **Add Python to PATH** أثناء التثبيت.
2. افتح PowerShell داخل مجلد `model-bridge` ونفّذ:

</div>

```bash
pip install keyring
python bridge.py doctor
```

<div dir="rtl">

3. `doctor` يطبع مسار ملف الإعداد. انسخ إليه `models.example.json` باسم `models.json` (مجلد `%APPDATA%\ar-model-bridge`). أنشئ المجلد إن لم يوجد.
4. اكتب مفتاحك (الكتابة مخفية، ولا تلصقه في أي محادثة):

</div>

```bash
python bridge.py keys set gemini
```

<div dir="rtl">

5. اعرف أسماء النماذج الحقيقية من المزود نفسه، وضع اسمًا منها مكان `REPLACE_WITH_MODEL_ID` في `models.json`. لا أضع أسماء نماذج من ذاكرتي لأنها تتغير بسرعة:

</div>

```bash
python bridge.py models --live gemini
```

<div dir="rtl">

6. جرّب:

</div>

```bash
python bridge.py check
python bridge.py ask --model gemini:flash --prompt "ما أصل كلمة ورق؟" --out answers
```

<div dir="rtl">

على ماك ولينكس الخطوات نفسها، مع `python3` بدل `python`. على لينكس بلا بيئة مكتبية قد لا توجد خزنة آمنة، وسيقول `doctor` ذلك بوضوح.

مفتاح جيميناي مجاني (إن توفر لبلدك) من https://aistudio.google.com/apikey. حدوده وشروطه تتغير وتختلف بالبلد، فاقرأها من صفحة المزود.

## استخدامها من Claude

- **أداة سطر أوامر:** مساعد `paper-model-consultant` ينفّذ `bridge.py ask` عبر Bash، فتعمل في Claude Code وفي الجلسات السحابية.
- **أدوات MCP (اختياري، على جهازك):**

</div>

```bash
claude mcp add model-bridge -- python C:\full\path\to\model-bridge\mcp_server.py
```

<div dir="rtl">

لا يوجد مفتاح في هذا الأمر ولا في ملف إعداد Claude. الخادم يقرأ المفتاح من الخزنة عند كل نداء. الأدوات: `bridge_models` و`bridge_check` و`bridge_ask` و`bridge_ask_many` و`bridge_image`.

## في الجلسات السحابية

الخزنة المحلية غير موجودة هناك. استخدم مفتاح الجلسة: اطلب من Claude أن يطلب بيانات اعتماد للموقع (مثل `api.openai.com`)، فتظهر لك نافذة آمنة تكتب فيها المفتاح مباشرة دون أن يراه Claude، ويحقنه الوسيط في الطلب. في `models.json` ضع للمزود `"key": {"proxy": true}` فيرسل الجسر قيمة بديلة لا قيمة حقيقية. هذا المسار **لم أختبره** لأنه يحتاج مفتاحًا حقيقيًا وجلسة سحابية عندك.

## ما لا تفعله الأداة، عمدًا

- **لا تحفظ كلمات سر المواقع.** هذه الأداة لمفاتيح API فقط. لتسجيل الدخول إلى المواقع استخدم مدير كلمات السر في متصفحك وسجّل دخولك بنفسك، ومساعد المتصفح لا يكتب كلمات سر.
- **لا تولّد فيديو.** الفيديو طلبات طويلة غير متزامنة، ولم أبنِ له دعمًا.
- **لا تقرر نيابة عنك.** أجوبة النماذج أدلة غير موثّقة، والتحقق منها يبقى عند Claude وعندك.

## أوامر سريعة

| الأمر | وظيفته |
|---|---|
| `doctor` | فحص الإعداد، لا يطبع مفاتيح |
| `keys set/list/delete` | إدارة المفاتيح (القائمة تعرض حالة الوجود فقط) |
| `models [--live مزود]` | عرض المزودين، أو أسماء النماذج الحقيقية من المزود |
| `check` | طلب تجريبي صغير لكل نموذج |
| `ask` | سؤال واحد أو أكثر لنموذج أو أكثر، `--out` يحفظ الأجوبة ملفات |
| `image` | توليد صورة وحفظها |

الاختبارات: `python -m unittest discover -s tests -v`

</div>

---

## English summary

A small, stdlib-only (plus `keyring`) bridge that lets Claude ask other models with an identical prompt, save the answers to files, and generate images. API keys are typed through a hidden prompt into the OS secret store (never in files, chat, args, logs or output). Outbound text is refused if it holds a key; only https (and loopback) is allowed and redirects are never followed; files are sent only from allow-listed folders and never if they look secret; there is a daily call cap; answers are wrapped as untrusted data. 26 tests against mock servers, with mutation checks. Not tested against real providers.
