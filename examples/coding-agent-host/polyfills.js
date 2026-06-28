import structuredClone from '@ungap/structured-clone';
import {
  TransformStream,
  ReadableStream,
  WritableStream,
} from 'web-streams-polyfill';
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';
import {
  TextDecoderStream,
  TextEncoderStream,
} from '@stardazed/streams-text-encoding';

const setupPolyfills = async () => {
  if (!('structuredClone' in global)) {
    polyfillGlobal('structuredClone', () => structuredClone);
  }

  if (!('TransformStream' in global)) {
    polyfillGlobal('TransformStream', () => TransformStream);
  }

  if (!('ReadableStream' in global)) {
    polyfillGlobal('ReadableStream', () => ReadableStream);
  }

  if (!('WritableStream' in global)) {
    polyfillGlobal('WritableStream', () => WritableStream);
  }

  polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
  polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
};

setupPolyfills();
