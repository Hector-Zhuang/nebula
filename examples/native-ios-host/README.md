# Native iOS Nebula Host

A UIKit-only iOS host that installs and opens a Nebula miniapp without a React Native host UI.

## Requirements

- Xcode 16 or newer
- CocoaPods
- iOS 15.1 or newer

## Run

```sh
cd ios
pod install
open NativeNebulaHost.xcworkspace
```

Select a signing team and a simulator or device in Xcode, then run the `NativeNebulaHost` scheme.

Enter a miniapp ID and its bundle URL in the app. Tap **Install and Open** to download the bundle, then present it through `NebulaHost.shared.openApp`.

For a development bundle served by Metro, use an address reachable from the simulator or device, for example `http://localhost:8082/index.bundle?platform=ios&dev=true&minify=false` on a simulator.
