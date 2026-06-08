import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
} from 'react-native-reanimated';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible, title, message, confirmLabel = 'Confirm', onConfirm, onCancel,
}: Props) {
  const scale   = useSharedValue(0.88);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value   = withSpring(1,   { damping: 18, stiffness: 280 });
      opacity.value = withTiming(1,   { duration: 180 });
    } else {
      scale.value   = withSpring(0.88, { damping: 18, stiffness: 280 });
      opacity.value = withTiming(0,   { duration: 150 });
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Pressable>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttons}>
              <Pressable style={[styles.btn, styles.btnCancel]} onPress={onCancel}>
                <Text style={styles.btnCancelLabel}>CANCEL</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnConfirm]} onPress={onConfirm}>
                <Text style={styles.btnConfirmLabel}>{confirmLabel}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.borderGold,
    padding: SPACING.xl,
    gap: SPACING.md,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  message: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  buttons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btn: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnConfirm: {
    backgroundColor: COLORS.danger,
  },
  btnCancelLabel: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  btnConfirmLabel: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: '#fff',
    letterSpacing: 1,
  },
});
