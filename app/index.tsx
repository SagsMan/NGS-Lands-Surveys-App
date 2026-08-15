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
const ministryLogo = require('@/assets/images/brand/ministry-logo.png');
const ministrySeal = require('@/assets/images/brand/ministry-seal.png');
const getStartedArtwork = require('@/assets/images/brand/get-started.png');
const signInArtwork = require('@/assets/images/brand/sign-in.png');

type OnboardingStep = 'splash' | 'welcome' | 'accountType';
type AccountType = 'citizen' | 'staff';

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<OnboardingStep>('splash');
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStep('welcome'), 12000);
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
    setStep('accountType');
  };

  const tapBack = () => {
    Haptics.selectionAsync();
    setStep('welcome');
  };

  const chooseAccountType = (type: AccountType) => {
    Haptics.selectionAsync();
    setAccountType(type);
  };

  const submitAuthorization = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // The credential screen will be added once its design is provided.
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
            source={ministryLogo}
            resizeMode="contain"
            style={styles.splashLogo}
            accessibilityLabel="Ministry of Lands and Survey, Niger State"
          />
        </View>
        <View pointerEvents="none" style={[styles.homeIndicator, { bottom: Math.max(insets.bottom - 2, 8), backgroundColor: colors.foreground }]} />
      </ImageBackground>
    );
  }

  if (step === 'accountType') {
    return (
      <ImageBackground
        source={landscape}
        resizeMode="cover"
        style={[styles.screen, { backgroundColor: colors.background }]}
        testID="account-type-screen"
      >
        <LinearGradient
          colors={[colors.imageWashStrong, colors.imageWash, colors.imageWashStrong]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.authContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <Pressable
            testID="account-type-back-button"
            accessibilityRole="button"
            accessibilityLabel="Back to welcome"
            onPress={tapBack}
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
          >
            <Text style={[styles.backArrow, { color: colors.foreground }]}>‹</Text>
          </Pressable>

          <Text style={[styles.authTitle, { color: colors.text }]}>Choose Account Type</Text>

          <View style={styles.accountOptions}>
            <Pressable
              testID="citizen-account-card"
              accessibilityRole="radio"
              accessibilityState={{ selected: accountType === 'citizen' }}
              accessibilityLabel="Citizen account"
              onPress={() => chooseAccountType('citizen')}
              style={({ pressed }) => [
                styles.accountCard,
                {
                  backgroundColor: colors.card,
                  shadowColor: colors.foreground,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <View style={[styles.radio, { borderColor: colors.foreground }]}>
                {accountType === 'citizen' && <View style={[styles.radioDot, { backgroundColor: colors.foreground }]} />}
              </View>
              <View style={styles.accountCopy}>
                <Text style={[styles.accountName, { color: colors.text }]}>Citizen</Text>
                <Text style={[styles.accountDescription, { color: colors.mutedForeground }]}>
                  Apply for land services, make payments, and{'\n'}track your applications.
                </Text>
              </View>
            </Pressable>

            <Pressable
              testID="staff-account-card"
              accessibilityRole="radio"
              accessibilityState={{ selected: accountType === 'staff' }}
              accessibilityLabel="Staff account"
              onPress={() => chooseAccountType('staff')}
              style={({ pressed }) => [
                styles.accountCard,
                {
                  backgroundColor: colors.card,
                  shadowColor: colors.foreground,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <View style={[styles.radio, { borderColor: colors.foreground }]}>
                {accountType === 'staff' && <View style={[styles.radioDot, { backgroundColor: colors.foreground }]} />}
              </View>
              <View style={styles.accountCopy}>
                <Text style={[styles.accountName, { color: colors.text }]}>Staff</Text>
                <Text style={[styles.accountDescription, { color: colors.mutedForeground }]}>
                  Access ministry workflows, inspections tasks{'\n'}and approvals with an invitation
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            testID="account-type-sign-in-button"
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={submitAuthorization}
            style={({ pressed }) => [
              styles.authSignInButton,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.buttonShadow,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={styles.authSignInLabel}>Sign In</Text>
          </Pressable>
        </View>
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
            <Image
              source={getStartedArtwork}
              resizeMode="contain"
              style={styles.primaryButtonArtwork}
              accessibilityLabel="Get Started"
            />
          </Pressable>
          <Pressable
            testID="sign-in-button"
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={tapSignIn}
            style={({ pressed }) => [styles.signInButton, { opacity: pressed ? 0.55 : 1 }]}
          >
            <Image
              source={signInArtwork}
              resizeMode="contain"
              style={styles.signInArtwork}
              accessibilityLabel="Sign in"
            />
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
    width: '106.75%',
    minHeight: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  primaryButtonArtwork: {
    width: '100%',
    height: '100%',
  },
  signInButton: {
    minHeight: 48,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInArtwork: {
    width: 41,
    height: 14,
  },
  authContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 36,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -5,
  },
  backArrow: {
    fontFamily: 'Inter_400Regular',
    fontSize: 40,
    lineHeight: 36,
    fontWeight: '300',
  },
  authTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.7,
    marginTop: 12,
  },
  accountOptions: {
    gap: 16,
    marginTop: 32,
  },
  accountCard: {
    minHeight: 124,
    width: '100%',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 18,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  accountCopy: {
    flex: 1,
    marginLeft: 15,
  },
  accountName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 19,
    lineHeight: 24,
  },
  accountDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 17,
    lineHeight: 24,
    marginTop: 4,
  },
  authSignInButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 48,
  },
  authSignInLabel: {
    color: '#ffffff',
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
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
