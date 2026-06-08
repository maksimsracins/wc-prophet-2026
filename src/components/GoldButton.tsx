import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'outline';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GoldButton({ label, onPress, style, variant = 'primary' }: Props) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.base, variant === 'outline' ? styles.outline : styles.primary, style, animStyle]}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={onPress}
    >
      <Text style={[styles.label, variant === 'outline' ? styles.labelOutline : styles.labelPrimary]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  label: {
    fontFamily: FONTS.display,
    fontSize: 18,
    letterSpacing: 1.5,
  },
  labelPrimary: {
    color: '#0A0A0C',
  },
  labelOutline: {
    color: COLORS.gold,
  },
});
