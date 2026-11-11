# Arabic fonts by genre

All fonts below are published under the SIL Open Font License on Google Fonts, so they can be used freely in commercial videos. `scripts/get_fonts.sh` downloads them into a `fonts/` folder.

Use one typeface per project. A second is acceptable only for a clear role split, for example titles and dates.

| Genre | Recommended | File | Character |
|---|---|---|---|
| History | Amiri Bold | `Amiri-Bold.ttf` | Classical Naskh, bookish, dignified |
| History, literary | Aref Ruqaa Bold | `ArefRuqaa-Bold.ttf` | Ruqaa calligraphy, handwritten heritage feel |
| Islamic history | Noto Naskh Arabic | `NotoNaskhArabic.ttf` | Restrained, clear Naskh |
| Islamic history, titles | Reem Kufi | `ReemKufi.ttf` | Geometric Kufi, architectural |
| Sports | Lalezar | `Lalezar-Regular.ttf` | Heavy, loud display face |
| Sports, modern | Changa | `Changa.ttf` | Bold, compact, energetic |
| Politics | Noto Kufi Arabic | `NotoKufiArabic.ttf` | Formal editorial Kufi |
| Politics, news | IBM Plex Sans Arabic Bold | `IBMPlexSansArabic-Bold.ttf` | Neutral, institutional |
| Science and technology | Cairo | `Cairo.ttf` | Clean modern sans |
| Science, minimal | Readex Pro | `ReadexPro.ttf` | Geometric, wide, technical |
| Economics and business | Alexandria | `Alexandria.ttf` | Confident modern editorial sans |
| Economics, classic | El Messiri | `ElMessiri.ttf` | Modern with calligraphic warmth |
| Children's stories | Baloo Bhaijaan 2 | `BalooBhaijaan2.ttf` | Friendly, rounded |
| Children, playful | Marhey | `Marhey.ttf` | Soft, bouncy |
| Mystery | Rakkas | `Rakkas-Regular.ttf` | Dramatic high-contrast display |
| Mystery, restrained | Markazi Text | `MarkaziText.ttf` | Dark, compact text Naskh |
| Fiction, emotional | Lemonada | `Lemonada.ttf` | Soft cursive, warm |
| General purpose | Tajawal Bold | `Tajawal-Bold.ttf` | Readable everywhere |

Notes:

- Files without a weight in their name are variable fonts. Choose the weight with `--weight` in `scripts/arabic_title.py` (700 is a good default for titles).
- Paper-cut letters need mass. Prefer bold and heavy weights: thin strokes read as fragile and disappear at mobile size.
- Calligraphic faces (Aref Ruqaa, Rakkas) are for short titles only. Use a plain face for dates, numbers, and anything longer than four words.
- For Quranic text, do not typeset it in a display face. Use verified text and a Naskh face, and have the user confirm the wording against a printed Mushaf.
- When naming a typography style inside an image prompt, describe the style ("bold geometric Kufi", "classical Naskh"), not the font name. Image models do not know font names reliably.
