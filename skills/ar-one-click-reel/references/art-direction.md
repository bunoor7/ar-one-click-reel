# Art direction: paper, typography, composition, color, camera

## Global paper art direction

Every visual object must be physically represented as handcrafted paper artwork.

Allowed materials: thick cardstock, kraft paper, construction paper, layered colored paper, handmade textured paper, folded paper, corrugated paper, sculpted paper, paper strips, paper fibers, paper-cut typography, paper-crafted miniature environmental elements.

Every object must contain convincing physical paper construction:

- Dozens of individually cut layers
- Visible cardstock thickness and exposed cut edges
- Subtle fiber texture
- Tiny handcrafted irregularities
- Realistic paper folds and hand-cut shapes
- Layer separation with deep physical shadow gaps
- Realistic paper-to-paper contact
- Subtle glue joints
- Delicate paper surface imperfections

The paper aesthetic must never look like a flat digital vector illustration. Avoid smooth, synthetic, plastic-looking surfaces, glossy 3D rendering, generic cartoon aesthetics, and the appearance of printed stickers.

The paper sculpture must feel like a real physical miniature artwork photographed with a professional cinema camera. All surfaces, environments, backgrounds, characters, typography, and objects belong to the same handcrafted paper universe.

Non-paper materials are interpreted through paper craftsmanship:

| Element | Paper interpretation |
|---|---|
| Water | Layered translucent-looking blue paper shapes |
| Fire | Curved orange, yellow, and red paper flames |
| Clouds | Soft-edged stacked white and gray cardstock |
| Smoke | Thin curled paper ribbons |
| Metal | Matte metallic-colored paper, never actual metal |
| Glass | Thin pale paper with cut-out highlights |
| Fabric | Folded and creased paper mimicking cloth |
| Hair | Individually cut paper strips or sculpted cardstock shapes |
| Skin | Carefully layered matte paper in suitable natural tones |
| Sand | Fine textured kraft paper and layered terrain |

## Building people (the cartoon trap)

Image generators drift toward a cartoon or soft 3D look the moment a face or a hand appears, even when the rest of the scene is convincing paper. People need their own rule, repeated in every prompt that contains them (the text is in `assets/styles.json` as `people_rule`):

- Faces and hands are built from a few flat cardstock shapes with hard scissor-cut edges and visible layer steps.
- Features are simple cut-outs. No smooth shading, no rounded 3D volume, no glossy eyes, no cartoon grin, no clay, no toy or animated-film look.
- Skin and clothing are matte paper in flat tones from the chosen color theme.
- When a face keeps coming out cartoonish, simplify rather than describe more: show the figure in profile, from behind, as a silhouette, or show only the hands and the object.
- All people in the project must look like the same hand: same method, same level of detail, same materials. Attach the approved test frame as a style reference to keep it so.

## Paper-world immersion

The entire world shown in the image must be constructed from paper. Do not show:

- A real wooden desk, a real studio, or a photographic background
- A visible physical display board, an external frame, or a canvas
- A screen displaying the artwork
- A human hand assembling the artwork
- Real-world tools
- A real support structure outside the fictional world

The camera looks directly into the paper-created world. The scene is self-contained, and all visible objects belong inside the miniature paper environment. Use dimensional depth without exposing the external set.

The world may contain paper-built mountains, streets, deserts, oceans, castles, cities, stadiums, spaceships, historical architecture, palaces, mosques, laboratories, forests, sporting arenas, political chambers, homes, and fantasy landscapes.

## Arabic typography art direction

Arabic writing is part of the physical paper artwork. It must not look like digital text pasted onto the finished image. Every visible Arabic title must appear physically constructed from precisely cut paper letters in layered cardstock.

The letters must have:

- Correct Arabic shapes, connections, reading direction, and spelling
- Appropriate diacritics when required
- Real physical thickness and exposed paper edges
- Small dimensional shadows
- Consistent alignment
- Handcrafted material texture

The text must be legible at mobile viewing size. Choose a style suited to the subject:

| Genre | Typography |
|---|---|
| History | Classical Arabic-inspired typography |
| Islamic history | Respectful, restrained Arabic calligraphic design |
| Sports | Strong, bold, dynamic Arabic display typography |
| Politics | Formal editorial Arabic typography |
| Science | Clean modern Arabic lettering |
| Children's stories | Friendly rounded Arabic lettering |
| Mystery | Dramatic restrained Arabic lettering |
| Economics | Confident modern editorial Arabic typography |

Matching open-licence fonts are listed in `arabic-fonts.md`.

- Prefer short titles: 2 to 6 Arabic words. Use longer text only when necessary. Avoid large blocks of writing.
- Never add arbitrary decorative Arabic writing.
- The text must not cover the main subject. Place titles in intentionally reserved negative space.
- Maintain clear contrast between lettering and background: at least 4.5 to 1, measured against the area directly behind the title. Light cream lettering on a beige scene fails. Each color theme in `assets/palettes.json` carries a title color chosen for its background, and `scripts/arabic_title.py` measures the contrast and refuses a weak one.
- Titles are paper, not a flat overlay: bold weight, real thickness, an edge color distinct from the face, and a shadow that falls the same way as the scene's other shadows.

If exact Arabic typography cannot be generated reliably, provide a clean text-free alternative scene and a separate Arabic typography overlay specification for post-production, then render the title with `scripts/arabic_title.py`.

Never silently accept malformed Arabic text as final output. A prompt instruction alone does not guarantee flawless Arabic rendering; final text must be visually inspected.

## Visual composition

Each scene must have:

1. One primary visual subject.
2. No more than three supporting objects.
3. A clearly defined background.
4. Strong visual hierarchy.
5. Intentional negative space.
6. A coherent color palette.
7. A readable Arabic title when required.
8. Physical layered depth.
9. A purposeful emotional atmosphere.
10. A composition that supports the narration.

Avoid crowded layouts. Use sophisticated editorial framing. The main subject must be immediately identifiable, and supporting elements should explain or enrich the idea. Use creative symbolism when it makes abstract information easier to understand.

Avoid repetitive scene compositions. Do not make every image a centered object against an identical empty background. Vary the composition intelligently while maintaining a consistent visual identity:

- Central monument
- Layered landscape
- Paper diorama city
- Character portrait
- Split-world comparison
- Symbolic object
- Historical scene
- Miniature architectural setting
- Vertical journey
- Layered circular composition
- Spatial metaphor
- Storybook cinematic tableau

## Color and lighting

Colors must match the subject and emotional purpose. Do not force the same palette onto every subject.

| Subject | Palette |
|---|---|
| Historical | Warm parchment, walnut brown, muted gold, faded terracotta |
| Islamic historical | Sandstone, deep green, cream, restrained gold |
| Sports | Energetic team-inspired colors with strong contrast |
| Political | Deep navy, burgundy, charcoal, muted gold |
| Science | Midnight blue, cyan, pale white, controlled luminous accents |
| Space | Deep indigo, black, violet, silver-gray paper |
| Nature | Earth greens, warm browns, botanical colors |
| Economics | Emerald green, charcoal, off-white, restrained warm gold |
| Mystery | Deep shadows, desaturated blues, muted crimson |
| Fantasy | Carefully controlled imaginative palettes |

Lighting must emphasize paper depth:

- Soft directional key light
- Natural-looking shadow falloff
- Deep separation shadows
- Gentle highlights along cut edges
- Subtle ambient bounce
- Controlled contrast
- Cinematic miniature photography

Avoid flat illumination, harsh artificial CGI glow, and lighting that makes the paper lose its physical texture.

## Camera and image format

- Default production format: vertical 9:16.
- Primary image resolution target: 2160 × 3840 pixels when supported.
- Image-generation quality: highest available.
- Prompt quality target: premium cinematic 8K detail. The term 8K describes the desired detail quality and does not guarantee the tool's actual output resolution.

Default camera aesthetic: professional full-frame digital cinema camera, high-quality macro or standard prime lens, controlled shallow depth of field, sharp paper textures, natural physical perspective, premium miniature photography.

- Keep clear focus on the primary subject.
- Avoid excessive background blur that destroys important visual details.
- Preserve adequate sharpness for Arabic lettering.
- Keep important subjects and on-screen text inside conservative platform-safe margins: roughly the central 80% of the width, clear of the top 12% and the bottom 20% of the frame where platform interfaces sit.
- Do not place essential typography at extreme frame edges.
- Do not use camera settings that conflict with image readability.

## Creative originality rule

Do not repeat the same visual approach in every project. For every subject, search for the most effective visual metaphor. Ask internally:

- What is the most surprising way to represent this idea using paper?
- Can an abstract concept become a physical paper object?
- Can the image communicate more than the narration alone?
- Can history be represented through layered time?
- Can an economic concept become an intuitive physical interaction?
- Can a political turning point be expressed as a visual contrast?
- Can a sports achievement become a miniature cinematic monument?
- Can a fictional story use the paper medium as part of its meaning?
- Can an ordinary fact become visually extraordinary?

The paper format must enhance storytelling, not merely decorate it. Creativity must not compromise factual accuracy.
