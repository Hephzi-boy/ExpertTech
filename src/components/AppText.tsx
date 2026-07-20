import React from 'react';
import {
  StyleSheet,
  Text as ReactNativeText,
  type TextProps,
  type TextStyle,
} from 'react-native';

import { resolveOpenRundeFontFamily } from '../theme';

export function Text({ style, ...props }: TextProps) {
  const flattenedStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const fontFamily =
    flattenedStyle?.fontFamily ?? resolveOpenRundeFontFamily(flattenedStyle?.fontWeight);

  return <ReactNativeText {...props} style={[{ fontFamily }, style]} />;
}
