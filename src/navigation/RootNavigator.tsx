import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS } from '../constants/theme';
import { useTournamentStore } from '../store/tournamentStore';
import SplashScreen from '../screens/SplashScreen';
import TournamentScreen from '../screens/TournamentScreen';
import StageCompleteScreen from '../screens/StageCompleteScreen';
import FinalScreen from '../screens/FinalScreen';
import BracketScreen from '../screens/BracketScreen';
import StatsScreen from '../screens/StatsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, emoji, focused }: { label: string; emoji: string; focused: boolean }) {
  return (
    <View style={[tabStyles.icon]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelFocused]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  icon: { alignItems: 'center', gap: 2, paddingTop: 6 },
  emoji: { fontSize: 20 },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.3,
  },
  labelFocused: { color: COLORS.gold },
});

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 64,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Pick"
        component={TournamentScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="PICK" emoji="⚽" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Bracket"
        component={BracketScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="BRACKET" emoji="🏆" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="TEAMS" emoji="🌍" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

// MainApp keeps the TabNavigator permanently mounted.
// StageComplete and Final are rendered as absolute overlays so the
// tab navigator never unmounts/loses state during phase transitions.
function MainApp() {
  const phase = useTournamentStore(s => s.phase);
  return (
    <View style={styles.fill}>
      <MainTabs />
      {phase === 'stage_complete' && (
        <View style={StyleSheet.absoluteFill}>
          <StageCompleteScreen />
        </View>
      )}
      {phase === 'champion' && (
        <View style={StyleSheet.absoluteFill}>
          <FinalScreen />
        </View>
      )}
    </View>
  );
}

export default function RootNavigator() {
  const phase = useTournamentStore(s => s.phase);

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.gold,
          background: COLORS.bg,
          card: COLORS.surface,
          text: COLORS.textPrimary,
          border: COLORS.border,
          notification: COLORS.gold,
        },
        fonts: {
          regular: { fontFamily: FONTS.body, fontWeight: '400' },
          medium: { fontFamily: FONTS.bodyMedium, fontWeight: '500' },
          bold: { fontFamily: FONTS.bodyBold, fontWeight: '700' },
          heavy: { fontFamily: FONTS.bodyBold, fontWeight: '700' },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: COLORS.bg },
        }}
      >
        {phase === 'splash' ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainApp} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: COLORS.bg },
});
