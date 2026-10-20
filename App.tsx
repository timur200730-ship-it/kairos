import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Cormorant_500Medium } from '@expo-google-fonts/cormorant';
import { Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';

// ───────── Токены ─────────
const base = {
  bg: '#0B0D10',
  text: '#F4F5F7',
  textMuted: 'rgba(244,245,247,0.55)',
} as const;

const theme = {
  accent: '#7C9CFF',
  accentGlow: 'rgba(124,156,255,0.45)',
} as const;

const font = {
  display: 'Cormorant_500Medium',
  ui: 'Inter_500Medium',
  uiSemi: 'Inter_600SemiBold',
} as const;

const space = { 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;
const radius = { pill: 999 } as const;

// ───────── Root ─────────
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Cormorant_500Medium,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return <View style={styles.boot} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <WelcomeScreen />
    </SafeAreaProvider>
  );
}

// ───────── Welcome ─────────
function WelcomeScreen() {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(24)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const subY = useRef(new Animated.Value(16)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const ctaY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.timing(subOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(subY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(360),
      Animated.parallel([
        Animated.timing(ctaOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(ctaY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.frame}>
        <Halo />
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.content}>
            <Animated.View
              style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}
            >
              <Text style={styles.title}>
                Ритуал,{'\n'}а не гонка
              </Text>
            </Animated.View>

            <Animated.View
              style={{
                opacity: subOpacity,
                transform: [{ translateY: subY }],
                marginTop: space[5],
              }}
            >
              <Text style={styles.subtitle}>
                Тихая сила ежедневных повторений.{'\n'}
                Одна привычка. Один день. Один шаг.
              </Text>
            </Animated.View>

            <View style={{ flex: 1 }} />

            <Animated.View
              style={{ opacity: ctaOpacity, transform: [{ translateY: ctaY }] }}
            >
              <PrimaryButton label="Начать" onPress={() => console.log('Начать')} />
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

// ───────── Ореол (градиентный) ─────────
function Halo() {
  return (
    <View pointerEvents="none" style={styles.halo} accessibilityElementsHidden>
      <LinearGradient
        colors={[
          'rgba(124,156,255,0.34)',
          'rgba(124,156,255,0.10)',
          'rgba(124,156,255,0)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(167,139,250,0.22)', 'rgba(167,139,250,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.5 }}
        style={[StyleSheet.absoluteFill, { top: '20%', left: '10%' }]}
      />
    </View>
  );
}

// ───────── Кнопка ─────────
function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ───────── Стили ─────────
const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: base.bg },
  root: { flex: 1, backgroundColor: base.bg },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  halo: { ...StyleSheet.absoluteFillObject },
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: space[6],
    paddingTop: space[7],
    paddingBottom: space[5],
  },
  title: {
    fontFamily: font.display,
    fontSize: 64,
    lineHeight: 68,
    color: base.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: font.ui,
    fontSize: 16,
    lineHeight: 24,
    color: base.textMuted,
  },
  cta: {
    height: 58,
    borderRadius: radius.pill,
    backgroundColor: theme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
      web: {
        boxShadow: '0 10px 30px rgba(124,156,255,0.45)',
      } as object,
    }),
  },
  ctaText: {
    fontFamily: font.uiSemi,
    fontSize: 16,
    color: '#0B0D10',
    letterSpacing: 0.2,
  },
});