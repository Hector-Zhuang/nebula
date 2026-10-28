import { FC } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface BadgeProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  /** Render as a small dot without content. */
  dot?: boolean;
  /** Badge content. Numeric values above maxCount render as `${maxCount}+`. */
  text?: string | number;
  /** Upper bound before numeric text collapses to `${maxCount}+`. */
  maxCount?: number;
}

export const Badge: FC<BadgeProps> = props => {
  const { style, textStyle, dot, text, maxCount = 99 } = props;

  if (dot) {
    return <View style={[styles.dot, style]} />;
  }

  if (text === undefined || text === null || text === '') {
    return null;
  }

  const content =
    typeof text === 'number' && text > maxCount ? `${maxCount}+` : text;

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4949',
  },
  wrapper: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: '#FF4949',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 11,
    lineHeight: 14,
  },
});
