#!/bin/bash
# Replicate Image Generator (Flux models)
# Usage: ./generate.sh <api_key> <prompt> [output_path] [model] [width] [height]
#
# model: flux-schnell (default, fast) or flux-pro (higher quality)
# output_path: defaults to /home/poomk/.openclaw/workspace/assets/generated_<timestamp>.png
# width/height: defaults to 1024x1024

set -euo pipefail

API_KEY="$1"
PROMPT="$2"
OUTPUT_PATH="${3:-}"
MODEL="${4:-flux-schnell}"
WIDTH="${5:-1024}"
HEIGHT="${6:-1024}"

if [ -z "$API_KEY" ] || [ -z "$PROMPT" ]; then
  echo "Usage: ./generate.sh <api_key> <prompt> [output_path] [model] [width] [height]"
  exit 1
fi

# Create assets dir
mkdir -p /home/poomk/.openclaw/workspace/assets

# Set default output path
if [ -z "$OUTPUT_PATH" ]; then
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  OUTPUT_PATH="/home/poomk/.openclaw/workspace/assets/generated_${TIMESTAMP}.png"
fi

# Model version hashes
case "$MODEL" in
  flux-pro)
    VERSION="c846a69991daf4c0e5d016514849d14ee5b2e6846ce6b9d6f21369e564cfe51e"
    MODEL_NAME="flux-pro"
    ;;
  flux-schnell|*)
    VERSION="c846a69991daf4c0e5d016514849d14ee5b2e6846ce6b9d6f21369e564cfe51e"
    MODEL_NAME="flux-schnell"
    ;;
esac

echo "🎨 Generating image with $MODEL_NAME..."
echo "📝 Prompt: $PROMPT"
echo "📐 Size: ${WIDTH}x${HEIGHT}"

# Escape prompt for JSON
ESCAPED_PROMPT=$(echo "$PROMPT" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().strip()))")

# Create prediction
RESPONSE=$(curl -s -X POST "https://api.replicate.com/v1/predictions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"version\": \"$VERSION\",
    \"input\": {
      \"prompt\": $ESCAPED_PROMPT,
      \"width\": $WIDTH,
      \"height\": $HEIGHT,
      \"num_outputs\": 1
    }
  }")

# Check for errors
PREDICTION_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('id',''))" 2>/dev/null)

if [ -z "$PREDICTION_ID" ]; then
  echo "❌ Error creating prediction:"
  echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('detail', d))" 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

echo "⏳ Prediction ID: $PREDICTION_ID"

# Poll for completion (max 120 seconds)
for i in $(seq 1 60); do
  sleep 2
  STATUS_RESPONSE=$(curl -s "https://api.replicate.com/v1/predictions/${PREDICTION_ID}" \
    -H "Authorization: Bearer $API_KEY")
  
  STATUS=$(echo "$STATUS_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)
  
  if [ "$STATUS" = "succeeded" ]; then
    IMAGE_URL=$(echo "$STATUS_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['output'][0])" 2>/dev/null)
    echo "✅ Image generated!"
    echo "📥 Downloading to: $OUTPUT_PATH"
    curl -s -o "$OUTPUT_PATH" "$IMAGE_URL"
    
    # Convert webp to png if needed
    MIME_TYPE=$(file -b --mime-type "$OUTPUT_PATH" 2>/dev/null || echo "")
    if echo "$MIME_TYPE" | grep -qi "webp"; then
      if command -v convert &>/dev/null; then
        TEMP="${OUTPUT_PATH%.png}_temp.webp"
        mv "$OUTPUT_PATH" "$TEMP"
        convert "$TEMP" "$OUTPUT_PATH" 2>/dev/null && rm -f "$TEMP"
      elif command -v ffmpeg &>/dev/null; then
        TEMP="${OUTPUT_PATH%.png}_temp.webp"
        mv "$OUTPUT_PATH" "$TEMP"
        ffmpeg -y -i "$TEMP" "$OUTPUT_PATH" 2>/dev/null && rm -f "$TEMP"
      fi
    fi
    
    echo "✅ Saved: $OUTPUT_PATH"
    echo "📐 Size: $(du -h "$OUTPUT_PATH" | cut -f1)"
    exit 0
  elif [ "$STATUS" = "failed" ]; then
    ERROR=$(echo "$STATUS_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','Unknown error'))" 2>/dev/null)
    echo "❌ Generation failed: $ERROR"
    exit 1
  fi
  
  echo "  ... $STATUS (attempt $i/60)"
done

echo "❌ Timeout waiting for generation"
exit 1