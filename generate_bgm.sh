#!/bin/bash
API_KEY="r8_aSwjYr3vNQBUYWpN5i0s2zoRIHpMW7K2Qwjg3"
VERSION="671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb"
PROMPT="Upbeat Swedish polka-pop, prominent accordion, catchy melody, upbeat tempo, slightly unsettling, anxiety-inducing, cheerful but with underlying warehouse liminal space anxiety, occasional cash register cha-ching percussion, high quality, loopable"
OUTPUT_PATH="public/assets/stage3/audio/bgm-ikea-polka.mp3"

echo "Starting music generation..."

RESPONSE=$(curl -s -X POST "https://api.replicate.com/v1/predictions" \
     -H "Authorization: Token $API_KEY" \
     -H "Content-Type: application/json" \
     -d "{
       \"version\": \"$VERSION\",
       \"input\": {
         \"prompt\": \"$PROMPT\",
         \"duration\": 30,
         \"output_format\": \"mp3\",
         \"model_version\": \"stereo-melody-large\"
       }
     }")

PREDICTION_ID=$(echo $RESPONSE | jq -r '.id')
if [ -z "$PREDICTION_ID" ] || [ "$PREDICTION_ID" == "null" ]; then
  echo "Error: Failed to create prediction. Response: $RESPONSE"
  exit 1
fi
echo "Prediction ID: $PREDICTION_ID"

# Poll for completion
while true; do
  STATUS_RESPONSE=$(curl -s -H "Authorization: Token $API_KEY" "https://api.replicate.com/v1/predictions/$PREDICTION_ID")
  STATUS=$(echo $STATUS_RESPONSE | jq -r '.status')
  echo "Status: $STATUS"
  
  if [ "$STATUS" == "succeeded" ]; then
    URL=$(echo $STATUS_RESPONSE | jq -r '.output')
    echo "Generation succeeded! Downloading from $URL..."
    curl -L "$URL" -o "$OUTPUT_PATH"
    echo "Saved to $OUTPUT_PATH"
    break
  elif [ "$STATUS" == "failed" ]; then
    echo "Generation failed."
    exit 1
  fi
  sleep 5
done
