import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

type AnyComponent = React.ComponentType<any>;
type TaroComponentMap = Record<string, AnyComponent>;

const warningSet = new Set<string>();

function warnOnce(message: string): void {
  if (warningSet.has(message)) {
    return;
  }
  warningSet.add(message);
  console.warn(message);
}

function loadTaroComponents(): TaroComponentMap {
  try {
    return require('@nebula/components') as TaroComponentMap;
  } catch {
    warnOnce(
      '[NebulaComponents] @nebula/components is not installed. Falling back to RN/placeholder components.',
    );
    return {};
  }
}

function createUnavailableComponent(name: string): AnyComponent {
  const UnavailableComponent: AnyComponent = () => {
    warnOnce(
      `[NebulaComponents] Component "${name}" is unavailable. Install @nebula/components and its dependencies.`,
    );
    return null;
  };
  return UnavailableComponent;
}

const taro = loadTaroComponents();

function pickComponent(name: string, fallback?: AnyComponent): AnyComponent {
  return taro[name] ?? fallback ?? createUnavailableComponent(name);
}

const FallbackTextarea: AnyComponent = ({
  value,
  defaultValue,
  style,
  ...rest
}) => (
  <TextInput
    multiline
    value={value}
    defaultValue={defaultValue}
    style={style}
    {...rest}
  />
);

const FallbackBlock: AnyComponent = ({ children }) => <>{children}</>;
const FallbackCoverView: AnyComponent = View;
const FallbackCoverImage: AnyComponent = pickComponent(
  'Image',
  createUnavailableComponent('Image'),
);

// RN primitives — exported directly without wrapping
export { View, Text, ScrollView };

// Taro-enhanced / mini-app components
export const Block = pickComponent('Block', FallbackBlock);
export const Button = pickComponent('Button');
export const Camera = pickComponent('Camera');
export const Checkbox = pickComponent('Checkbox');
export const CheckboxGroup = pickComponent('CheckboxGroup');
export const CoverImage = pickComponent('CoverImage', FallbackCoverImage);
export const CoverView = pickComponent('CoverView', FallbackCoverView);
export const Form = pickComponent('Form');
export const Icon = pickComponent('Icon');
export const Image = pickComponent('Image');
export const Input = pickComponent('Input');
export const Label = pickComponent('Label');
export const Map = pickComponent('Map');
export const Navigator = pickComponent('Navigator');
export const PageContainer = pickComponent('PageContainer');
export const Picker = pickComponent('Picker');
export const PickerView = pickComponent('PickerView');
export const Progress = pickComponent('Progress');
export const Radio = pickComponent('Radio');
export const RadioGroup = pickComponent('RadioGroup');
export const RichText = pickComponent('RichText');
export const Slider = pickComponent('Slider');
export const Swiper = pickComponent('Swiper');
export const SwiperItem = pickComponent('SwiperItem');
export const Switch = pickComponent('Switch');
export const Video = pickComponent('Video');
export const WebView = pickComponent('WebView');

export const NebulaComponents = {
  Block,
  Button,
  Camera,
  Checkbox,
  CheckboxGroup,
  CoverImage,
  CoverView,
  Form,
  Icon,
  Image,
  Input,
  Label,
  Map,
  Navigator,
  PageContainer,
  Picker,
  PickerView,
  Progress,
  Radio,
  RadioGroup,
  RichText,
  Slider,
  Swiper,
  SwiperItem,
  Switch,
  Video,
  WebView,
};

export default NebulaComponents;
