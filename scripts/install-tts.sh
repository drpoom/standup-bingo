#!/bin/bash
# =============================================================================
# Install Local TTS (espeak-ng) for Mickey the Shiba Inu AI
# =============================================================================
# Purpose: Install text-to-speech so Mickey can talk to Uncle John
# Language Support: espeak-ng supports Thai, German, English, and 100+ languages
#
# Usage: 
#   ./install-tts.sh
#   (or: bash install-tts.sh)
#
# After installation, test with:
#   espeak-ng "Hello Uncle John!"
#   espeak-ng -th "สวัสดีครับลุงจอห์น"
#   espeak-ng -de "Hallo Uncle John!"
# =============================================================================

echo "🐕 Mickey's TTS Installation Script"
echo "===================================="
echo ""

# Update package list
echo "📦 Updating package list..."
sudo apt update

# Install espeak-ng
echo "🔊 Installing espeak-ng (text-to-speech)..."
sudo apt install espeak-ng -y

# Verify installation
echo ""
echo "✅ Testing installation..."
if command -v espeak-ng &> /dev/null; then
    echo "🎉 espeak-ng installed successfully!"
    echo ""
    echo "🧪 Testing voices:"
    echo "   - English: espeak-ng \"Hello Uncle John!\""
    echo "   - Thai:    espeak-ng -th \"สวัสดีครับลุงจอห์น\""
    echo "   - German:  espeak-ng -de \"Hallo Uncle John!\""
    echo ""
    echo "🐕 Mickey can now talk! Woof woof!"
else
    echo "❌ Installation failed. Please check for errors above."
fi

echo ""
echo "============================================================================="
echo "Next steps for Mickey:"
echo "  1. Test voices with commands above"
echo "  2. Configure OpenClaw to use espeak-ng for audio output"
echo "  3. Enjoy talking to your Shiba Inu AI companion!"
echo "============================================================================="
