#!/usr/bin/env bash
set -euo pipefail

# Compresses a Blender-exported GLB while preserving the node hierarchy and node
# names, which chemise-parts.ts and chemiseModel.tsx rely on to toggle visibility.
# Usage: ./scripts/optimize-glb.sh <source.glb> [destination.glb] [ratio]
# ratio: fraction of vertices to keep; "none" (default) disables decimation.
#
# Draco over Meshopt: Meshopt re-encodes NORMAL as 8-bit octahedral, which bands
# on flat surfaces such as the shirt pockets. The Draco decoder is served from
# public/draco/, wired through the second argument of useGLTF in chemiseModel.tsx.

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
