#!/bin/bash
# Replicate BG Remover (Bria RMBG)
# Usage: ./remove-bg.sh <api_key> <input_path> [output_path]

set -euo pipefail

API_KEY="$1"
INPUT_PATH="$2"
OUTPUT_PATH="${3:-${INPUT_PATH%.*}.transparent.png}"

if [ -z "$API_KEY" ] || [ -z "$INPUT_PATH" ]; then
  echo "Usage: ./remove-bg.sh <api_key> <input_path> [output_path]"
  exit 1
fi

# Upload image to a temporary hosting if needed, but Replicate can take URLs.
# Since we have a local file, we need to upload it first or use a temporary public URL.
# For this environment, we'll use a temporary upload to a public bin or just use a proxy.
# Wait, Bria RMBG usually needs a URL. Let's use a simple base64 data URI if supported or a temporary upload.
# Replicate's API supports base64 data URIs for some models.

IMAGE_BASE64=$(base64 -w 0 "$INPUT_PATH")
DATA_URL="data:image/png;base64,$IMAGE_BASE64"

echo "🧹 Removing background from $INPUT_PATH..."

# Bria RMBG model version (lucataco/remove-bg)
VERSION="95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1"

RESPONSE=$(curl -s -X POST "https://api.replicate.com/v1/predictions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"version\": \"$VERSION\",
    \"input\": {
      \"image\": \"$DATA_URL\"
    }
  }")

PREDICTION_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)

if [ -z "$PREDICTION_ID" ]; then
  echo "❌ Error creating prediction: $RESPONSE"
  exit 1
fi

for i in $(seq 1 60); do
  sleep 2
  STATUS_RESPONSE=$(curl -s "https://api.replicate.com/v1/predictions/${PREDICTION_ID}" \
    -H "Authorization: Bearer $API_KEY")
  
  STATUS=$(echo "$STATUS_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)
  
  if [ "$STATUS" = "succeeded" ]; then
    IMAGE_URL=$(echo "$STATUS_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['output'])" 2>/dev/null)
    curl -s -o "$OUTPUT_PATH" "$IMAGE_URL"
    echo "✅ Background removed: $OUTPUT_PATH"
    exit 0
  elif [ "$STATUS" = "failed" ]; then
    echo "❌ Background removal failed"
    exit 1
  fi
  echo "  ... $STATUS (attempt $i/60)"
done

echo "❌ Timeout waiting for background removal"
exit 1
