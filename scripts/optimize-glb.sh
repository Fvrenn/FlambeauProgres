#!/usr/bin/env bash
set -euo pipefail

# Compresse un GLB exporté depuis Blender sans altérer la hiérarchie ni les noms
# de nodes (chemise-parts.ts et chemiseModel.tsx s'appuient dessus).
# Usage : ./scripts/optimize-glb.sh <source.glb> [destination.glb] [ratio]
# ratio : fraction de vertices à conserver ; "none" (défaut) désactive la décimation.
#
# Draco et non Meshopt : Meshopt réencode les NORMAL en octaédrique 8 bits, ce qui
# produit du banding sur les surfaces planes (poches). Le décodeur Draco est servi
# depuis public/draco/ — voir le second argument de useGLTF dans chemiseModel.tsx.

SRC="${1:?Usage: optimize-glb.sh <source.glb> [dest.glb] [ratio]}"
DEST="${2:-$SRC}"
RATIO="${3:-none}"

GT="npx --no-install gltf-transform"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

$GT dedup "$SRC"       "$TMP/1.glb"
$GT weld  "$TMP/1.glb" "$TMP/2.glb"

if [ "$RATIO" = "none" ] || [ "$RATIO" = "1" ]; then
  cp "$TMP/2.glb" "$TMP/3.glb"
else
  $GT simplify "$TMP/2.glb" "$TMP/3.glb" --ratio "$RATIO" --error 0.0005 --lock-border true
fi

$GT webp  "$TMP/3.glb" "$TMP/4.glb"
$GT draco "$TMP/4.glb" "$TMP/5.glb" \
  --quantize-normal 16 --quantize-position 16 --quantize-texcoord 14

mv "$TMP/5.glb" "$DEST"
echo "→ $DEST : $(du -h "$DEST" | cut -f1)"
