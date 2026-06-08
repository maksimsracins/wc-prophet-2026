import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { TEAMS } from '../data/teams';

interface Props {
  teamId: string;
  size?: 'sm' | 'md';
  highlighted?: boolean;
  style?: ViewStyle;
}

export default function FlagChip({ teamId, size = 'sm', highlighted = false, style }: Props) {
  const team = TEAMS[teamId];
  if (!team) return null;

  const isSmall = size === 'sm';

  return (
    <View style={[
      styles.chip,
      highlighted ? styles.highlighted : styles.normal,
      isSmall ? styles.small : styles.medium,
      style,
    ]}>
      <Text style={isSmall ? styles.flagSm : styles.flagMd}>{team.flag}</Text>
      <Text style={[styles.name, isSmall ? styles.nameSm : styles.nameMd, highlighted && styles.nameHighlighted]}>
        {team.shortName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  normal: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  highlighted: {
    backgroundColor: COLORS.goldDim,
    borderColor: COLORS.borderGold,
  },
  small: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  medium: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: 6,
  },
  flagSm: { fontSize: 14 },
  flagMd: { fontSize: 18 },
  name: {
    fontFamily: FONTS.bodySemiBold,
    color: COLORS.textPrimary,
  },
  nameSm: { fontSize: 11 },
  nameMd: { fontSize: 13 },
  nameHighlighted: { color: COLORS.gold },
});
