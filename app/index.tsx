import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const landscape = require('@/assets/images/brand/landscape.jpg');
const ministrySeal = require('@/assets/images/brand/ministry-seal.png');

type OnboardingStep = 'splash' | 'welcome';

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<OnboardingStep>('splash');

  useEffect(() => {
    const timer = setTimeout(() => setStep('welcome'), 1550);
    return () => clearTimeout(timer);
  }, []);

  const tapPrimaryAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // This is intentionally kept at the onboarding boundary until the next
    // product screen is designed.
    setStep('welcome');
  };

  const tapSignIn = () => {
    Haptics.selectionAsync();
    // The sign-in flow is outside this two-screen onboarding deliverable.
  };

  if (step === 'splash') {
    return (
      <ImageBackground
        source={landscape}
        resizeMode="cover"
        style={[styles.screen, { backgroundColor: colors.background }]}
        testID="splash-screen"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.imageWashStrong }]} />
        <View style={[styles.splashContent, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <Image
            source={ministrySeal}
            resizeMode="contain"
            style={styles.splashLogo}
            accessibilityLabel="Ministry of Lands and Survey, Niger State"
          />
        </View>
        <View pointerEvents="none" style={[styles.homeIndicator, { bottom: Math.max(insets.bottom - 2, 8), backgroundColor: colors.foreground }]} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={landscape}
      resizeMode="cover"
      style={[styles.screen, { backgroundColor: colors.background }]}
      testID="welcome-screen"
    >
      <LinearGradient
        colors={[colors.imageWashStrong, colors.imageWash, colors.imageWashStrong]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.welcomeContent, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.brandArea}>
          <View style={[styles.logoCircle, { backgroundColor: colors.card, shadowColor: colors.foreground }]}>
            <Image
              source={ministrySeal}
              resizeMode="contain"
              style={styles.logo}
              accessibilityLabel="Ministry of Lands and Survey, Niger State"
            />
          </View>
        </View>

        <View style={styles.copyArea}>
          <Text style={[styles.title, { color: colors.foreground }]}>Land Services, Made Simple</Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            Apply for land services, track applications, make secure payments, and manage your records from anywhere
          </Text>
        </View>

        <View style={styles.actionArea}>
          <Pressable
            testID="get-started-button"
            accessibilityRole="button"
            accessibilityLabel="Get started"
            onPress={tapPrimaryAction}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.buttonShadow,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>Get Started</Text>
          </Pressable>
          <Pressable
            testID="sign-in-button"
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={tapSignIn}
            style={({ pressed }) => [styles.signInButton, { opacity: pressed ? 0.55 : 1 }]}
          >
            <Text style={[styles.signInText, { color: colors.mutedForeground }]}>Sign in</Text>
          </Pressable>
        </View>
      </View>
      <View pointerEvents="none" style={[styles.homeIndicator, { bottom: Math.max(insets.bottom - 2, 8), backgroundColor: colors.foreground }]} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 218,
    height: 218,
  },
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brandArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.15,
    width: '100%',
  },
  logoCircle: {
    width: 264,
    height: 264,
    borderRadius: 132,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logo: {
    width: 224,
    height: 224,
  },
  copyArea: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 8,
    flex: 0.84,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    maxWidth: 365,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  actionArea: {
    width: '100%',
    alignItems: 'center',
    flex: 0.62,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  primaryButton: {
    width: '100%',
    minHeight: 54,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  primaryButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  signInButton: {
    minHeight: 48,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  homeIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    width: 135,
    height: 5,
    borderRadius: 3,
  },
});