#!/usr/bin/env bash
# Download the open-licence (SIL OFL) Arabic fonts used by this skill
# from the Google Fonts repository.
# Usage: bash get_fonts.sh [target_dir]      (default: ./fonts)
set -u
DEST="${1:-fonts}"
BASE="https://raw.githubusercontent.com/google/fonts/main/ofl"
mkdir -p "$DEST"

# "<path in repo>|<local file name>"
FONTS=(
  "amiri/Amiri-Bold.ttf|Amiri-Bold.ttf"
  "arefruqaa/ArefRuqaa-Bold.ttf|ArefRuqaa-Bold.ttf"
  "notonaskharabic/NotoNaskhArabic%5Bwght%5D.ttf|NotoNaskhArabic.ttf"
  "reemkufi/ReemKufi%5Bwght%5D.ttf|ReemKufi.ttf"
  "lalezar/Lalezar-Regular.ttf|Lalezar-Regular.ttf"
  "changa/Changa%5Bwght%5D.ttf|Changa.ttf"
  "notokufiarabic/NotoKufiArabic%5Bwght%5D.ttf|NotoKufiArabic.ttf"
  "ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf|IBMPlexSansArabic-Bold.ttf"
  "cairo/Cairo%5Bslnt,wght%5D.ttf|Cairo.ttf"
  "readexpro/ReadexPro%5BHEXP,wght%5D.ttf|ReadexPro.ttf"
  "alexandria/Alexandria%5Bwght%5D.ttf|Alexandria.ttf"
  "elmessiri/ElMessiri%5Bwght%5D.ttf|ElMessiri.ttf"
  "baloobhaijaan2/BalooBhaijaan2%5Bwght%5D.ttf|BalooBhaijaan2.ttf"
  "marhey/Marhey%5Bwght%5D.ttf|Marhey.ttf"
  "rakkas/Rakkas-Regular.ttf|Rakkas-Regular.ttf"
  "markazitext/MarkaziText%5Bwght%5D.ttf|MarkaziText.ttf"
  "lemonada/Lemonada%5Bwght%5D.ttf|Lemonada.ttf"
  "tajawal/Tajawal-Bold.ttf|Tajawal-Bold.ttf"
)

ok=0; failed=0
for entry in "${FONTS[@]}"; do
  src="${entry%%|*}"; name="${entry##*|}"
  if [ -s "$DEST/$name" ]; then ok=$((ok+1)); continue; fi
  if curl -fsSL --retry 2 -o "$DEST/$name" "$BASE/$src"; then
    ok=$((ok+1))
  else
    rm -f "$DEST/$name"; failed=$((failed+1)); echo "FAILED: $name" >&2
  fi
done
echo "Fonts ready in $DEST: $ok ok, $failed failed"
[ "$failed" -eq 0 ]
