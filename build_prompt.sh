#!/usr/bin/env bash
# Build MASTER-PROMPT.md: the whole system as one prompt, for assistants
# that do not load skills (paste it as the first message or system prompt).
set -euo pipefail
cd "$(dirname "$0")"
S=skills/ar-one-click-reel
OUT=MASTER-PROMPT.md
{
  # SKILL.md without its YAML front matter
  awk 'BEGIN{n=0} /^---$/ && n<2 {n++; next} n>=2' "$S/SKILL.md"
  for f in intake content-and-integrity storytelling art-direction characters \
           animation-and-sound stages prompt-templates tools arabic-fonts delegation; do
    printf '\n\n---\n\n'
    cat "$S/references/$f.md"
  done
} > "$OUT"
echo "built $OUT ($(wc -w < "$OUT") words)"
