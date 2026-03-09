#!/bin/bash

# Integrate Nebula Framework into Xcode Project
# This script adds all Nebula files to the SuperApp.xcodeproj

echo "🚀 Integrating Nebula Mini-App Framework into SuperApp..."

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NEBULA_DIR="$PROJECT_DIR/SuperApp/Nebula"

# Check if Nebula directory exists
if [ ! -d "$NEBULA_DIR" ]; then
    echo "❌ Error: Nebula directory not found at $NEBULA_DIR"
    exit 1
fi

echo "📁 Found Nebula directory at: $NEBULA_DIR"

# List Nebula files
echo ""
echo "📝 Nebula Framework Files:"
find "$NEBULA_DIR" -type f \( -name "*.swift" -o -name "*.m" -o -name "*.mm" -o -name "*.h" \) | while read file; do
    echo "   - $(basename "$file")"
done

echo ""
echo "⚠️  Manual Steps Required:"
echo ""
echo "1. Open SuperApp.xcodeproj in Xcode"
echo "2. Right-click on 'SuperApp' folder in Project Navigator"
echo "3. Select 'Add Files to SuperApp...'  "
echo "4. Navigate to: SuperApp/Nebula/"
echo "5. Select the Nebula folder"
echo "6. Make sure 'Create groups' is selected"
echo "7. Make sure 'SuperApp' target is checked"
echo "8. Click 'Add'"
echo ""
echo "9. Verify SuperApp-Bridging-Header.h includes:"
echo "   #import \"NebulaJSIGateway.h\""
echo ""
echo "10. Build Settings > Swift Compiler - General:"
echo "    Objective-C Bridging Header = SuperApp/SuperApp-Bridging-Header.h"
echo ""

# Verify bridging header
BRIDGING_HEADER="$PROJECT_DIR/SuperApp/SuperApp-Bridging-Header.h"
if [ -f "$BRIDGING_HEADER" ]; then
    if grep -q "NebulaJSIGateway" "$BRIDGING_HEADER"; then
        echo "✅ Bridging header already includes NebulaJSIGateway.h"
    else
        echo "⚠️  Adding NebulaJSIGateway.h to bridging header..."
        echo "" >> "$BRIDGING_HEADER"
        echo "// Nebula JSI Gateway" >> "$BRIDGING_HEADER"
        echo "#import \"NebulaJSIGateway.h\"" >> "$BRIDGING_HEADER"
        echo "✅ Updated bridging header"
    fi
fi

echo ""
echo "🎉 Nebula Framework files are ready!"
echo ""
echo "📖 Usage Example (in React Native JavaScript):"
echo ""
echo "// Open a mini-app"
echo "import { NativeModules } from 'react-native';"
echo ""
echo "NativeModules.NebulaNativeModule.openMiniApp("
echo "  'my-mini-app', // appId"
echo "  { title: 'My Mini App', userId: '123' } // initialProps"
echo ").then(result => {"
echo "  console.log('Mini-app opened:', result);"
echo "}).catch(error => {"
echo "  console.error('Failed to open mini-app:', error);"
echo "});"
echo ""
