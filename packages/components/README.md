# @nebula-rn/components

Taro-inspired UI components for [Nebula](https://github.com/Hector-Zhuang/nebula),
an enterprise-grade SuperApp framework for React Native. The components mirror
the Taro/WeChat mini-app component surface so mini-app code feels familiar,
while being implemented with modern React Native primitives (Reanimated,
gesture-handler, vision-camera, and more).

## Installation

```bash
npm install @nebula-rn/components
```

Peer dependencies: `react >= 18` and `react-native >= 0.83`. Some components
additionally rely on `react-native-reanimated`, `react-native-gesture-handler`,
`react-native-reanimated-carousel`, `react-native-video`,
`react-native-vision-camera`, and `react-native-nitro-modules` — they are
installed automatically as dependencies of this package.

## Components

| Component | Description |
|---|---|
| `Badge` | Red-dot / count badge with `dot` mode and `maxCount` overflow |
| `Camera` | Camera view built on vision-camera for scanning and capture |
| `Map` | Map view for embedding native maps in mini-app pages |
| `Progress` | Linear/circular progress with determinate and indeterminate modes |
| `RichText` | Render a subset of HTML nodes as native views |
| `Slider` | Slide-to-select value picker with min/max/step support |
| `Swiper` | Swipeable carousel with pagination, built on reanimated-carousel |
| `Video` | Video player with common playback controls |
| `WebView` | Embedded web content view |

## Usage

```tsx
import { Badge, Progress, Slider } from '@nebula-rn/components';

export function Example() {
  return (
    <>
      <Badge text="new" maxCount={99} />
      <Progress percent={60} showInfo />
      <Progress indeterminate />
      <Slider min={0} max={100} step={5} showValue />
    </>
  );
}
```

Each component exports its props type (for example `BadgeProps`,
`ProgressProps`, `SliderProps`) alongside the component itself.

## Documentation

Getting started and guides:
https://github.com/Hector-Zhuang/nebula/tree/main/packages/nebula-docs/content/docs

## License

Apache-2.0
