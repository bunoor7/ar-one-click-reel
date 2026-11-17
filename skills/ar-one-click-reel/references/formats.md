# Format cards (القوالب)

Read the card of the chosen format right after the brief is confirmed, before Stage 3, and again at Stages 4 and 5. The card sets the hook, the structure, the pace and the ending. It does not override the creator's tone, dialect or approved wording.

Every card has the same five lines.

- **الهوك**: the kind of opening that fits the format.
- **البناء**: the narrative structure, taken from the list in `storytelling.md`.
- **الإيقاع**: the typical scene length and the number of scenes per minute.
- **السرد والخاتمة**: how the narrator speaks and how the film ends.
- **يتجنب**: the usual mistakes of this format.

The scene counts are a starting range, set from the creator's own choice of 13 scenes a minute for the explainer reference and scaled for the other formats. `scripts/timing.py` decides the real durations from the approved script.

Two rules apply to every format. A scene never runs under 3 seconds, because its Arabic title needs about 2 seconds to read. The extra speed comes from movement inside the scene (a push in, parallax, an element entering) every 2 to 3 seconds, not from extra cuts.

---

## Durations and scene counts

Scene counts are the format's pace multiplied by the length, rounded. The recommended length is the one the duration card puts first for that format. A film never goes below 5 scenes: a hook, three beats and an ending.

| Format | 30 s | 60 s | 120 s | 180 s | Recommended |
|---|---|---|---|---|---|
| 1. وثائقي تفسيري | 7 | 13 | 26 | 39 | 60 to 90 s |
| 2. قصة تاريخية سينمائية | 5 | 10 | 19 | 29 | 90 to 180 s |
| 3. بورتريه سيرة | 5 | 10 | 21 | 32 | 90 to 180 s |
| 4. وثائقي رياضي | 8 | 15 | 30 | 45 | 30 to 90 s |
| 5. وثائقي سياسي | 5 | 10 | 21 | 32 | 90 to 180 s |
| 6. سرد تاريخ إسلامي | 5 | 10 | 19 | 29 | 120 to 180 s |
| 7. فيلم قصير خيالي | 5 | 9 | 18 | 27 | 60 to 120 s |
| 8. قصة لغز أو معلومة مفاجئة | 6 | 12 | 25 | 38 | 30 to 60 s |
| 9. تفسيري تعليمي | 5 | 10 | 21 | 32 | 60 to 120 s |
| 10. تجريبي | free | free | free | free | free |

The duration card shows the scene count next to each length for the chosen format. For a length not in the table, multiply the format's pace by the minutes.

---

## 1. وثائقي تفسيري

- **الهوك**: a question the viewer thinks he knows the answer to, or a number that contradicts a common belief.
- **البناء**: question and answer, or cause and effect.
- **الإيقاع**: 4 to 5 seconds a scene, 12 to 14 scenes a minute (13 is the reference).
- **السرد والخاتمة**: clear, steady, explains without lecturing. Ends with the answer stated in one sentence and one idea to keep.
- **يتجنب**: a list of facts with no link between them, and more than one new concept in a scene.

## 2. قصة تاريخية سينمائية

- **الهوك**: the decisive moment first (the night before, the gate, the signal), then go back to how it began.
- **البناء**: chronological with a turning point, or rise and fall.
- **الإيقاع**: 5 to 7 seconds a scene, 9 to 10 scenes a minute, slower at the turning point.
- **السرد والخاتمة**: narrative voice, past tense, sensory detail. Ends on the consequence that outlived the event.
- **يتجنب**: invented dialogue attributed to real people, and dates stacked in one scene.

## 3. بورتريه سيرة

- **الهوك**: one act or one object that defines the person, shown before his name.
- **البناء**: personal biography with one defining choice at the center.
- **الإيقاع**: 5 to 6 seconds a scene, 10 to 11 scenes a minute.
- **السرد والخاتمة**: close, respectful, specific. Ends on what the person left behind, not on praise.
- **يتجنب**: a birth to death list, and adjectives in place of events.

## 4. وثائقي رياضي

- **الهوك**: the final minute of the match or the race, frozen, then rewind.
- **البناء**: journey narrative or countdown.
- **الإيقاع**: 3.5 to 4 seconds a scene, about 15 scenes a minute, a short scene at every peak.
- **السرد والخاتمة**: energetic, short sentences, verified scores and times only. Ends on what the result changed.
- **يتجنب**: unverified statistics, and dramatizing a result that was ordinary.

## 5. وثائقي سياسي

- **الهوك**: a contradiction between what was announced and what happened, with the date.
- **البناء**: cause and effect, or before and after.
- **الإيقاع**: 5 to 6 seconds a scene, 10 to 11 scenes a minute.
- **السرد والخاتمة**: restrained and sourced. Claims are attributed to who made them. Ends with the open question or the verified outcome, never a verdict the sources do not carry.
- **يتجنب**: opinion presented as fact, and adjectives that take a side.

## 6. سرد تاريخ إسلامي

- **الهوك**: the place and the moment, then the question that the story answers.
- **البناء**: chronological, with the sources named inside the narration.
- **الإيقاع**: 6 to 7 seconds a scene, 9 to 10 scenes a minute.
- **السرد والخاتمة**: dignified language. Ends on the lasting effect. Follow the special handling rules in `content-and-integrity.md` for sacred figures and sacred scenes.
- **يتجنب**: weak narrations stated as certain, and any depiction the integrity rules forbid.

## 7. فيلم قصير خيالي

- **الهوك**: a character in the middle of a problem, with no explanation yet.
- **البناء**: emotional short story, or surprise ending.
- **الإيقاع**: 5 to 8 seconds a scene, 8 to 10 scenes a minute, with silence allowed.
- **السرد والخاتمة**: image first, narration second. Dialogue may be invented. Ends on an image that closes the feeling, not a moral.
- **يتجنب**: explaining what the picture already shows, and a lesson added at the end.

## 8. قصة لغز أو معلومة مفاجئة

- **الهوك**: the strange fact stated plainly in the first sentence.
- **البناء**: mystery and revelation.
- **الإيقاع**: 4 to 5 seconds a scene, 12 to 13 scenes a minute, the reveal gets a longer scene.
- **السرد والخاتمة**: calm, a little lower, clues in order. Ends with the explanation and one open detail.
- **يتجنب**: promising a reveal the facts cannot deliver, and exaggerating the fact to sound stranger.

## 9. تفسيري تعليمي

- **الهوك**: a problem the learner meets in daily life.
- **البناء**: problem and solution, or step by step.
- **الإيقاع**: 5 to 6 seconds a scene, 10 to 11 scenes a minute, one idea per scene.
- **السرد والخاتمة**: simple words, one example for every rule. Ends with a short recap of the steps.
- **يتجنب**: terms with no definition, and more than one rule on screen.

## 10. تجريبي

- **الهوك**: an image with no explanation, held a second longer than comfortable.
- **البناء**: visual metaphor narrative, circular, or nonlinear.
- **الإيقاع**: free. Agree it with the creator in the storyboard before building.
- **السرد والخاتمة**: sparse. Ends where the creator decides.
- **يتجنب**: obscurity with no thread to follow, and effects that serve no beat.
