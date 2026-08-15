import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const landscape = require('@/assets/images/brand/landscape.jpg');

type AccountType = 'citizen' | 'staff';

export default function AccountTypeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  const choose = (type: AccountType) => {
    Haptics.selectionAsync();
    setAccountType(type);
  };

  const goBack = () => {
    Haptics.selectionAsync();
    router.back();
  };

  const proceedSignIn = () => {
    if (!accountType) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/auth/sign-in');
  };

  const proceedCreateAccount = () => {
    if (!accountType) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (accountType === 'citizen') {
      router.push('/auth/create-citizen');
    }
    // Staff route will be added in a future session
  };

  const canProceed = accountType !== null;

  return (
    <ImageBackground
      source={landscape}
      resizeMode="cover"
      style={[styles.screen, { backgroundColor: colors.background }]}
      imageStyle={styles.bgImage}
      testID="account-type-screen"
    >
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.imageWashStrong, colors.imageWash, colors.imageWashStrong]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
        {/* Back */}
        <Pressable
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goBack}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.backArrow, { color: colors.foreground }]}>‹</Text>
        </Pressable>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Choose Account Type</Text>

        {/* Cards */}
        <View style={styles.cards}>
          <Pressable
            testID="citizen-card"
            accessibilityRole="radio"
            accessibilityState={{ selected: accountType === 'citizen' }}
            accessibilityLabel="Citizen"
            onPress={() => choose('citizen')}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.card, shadowColor: colors.foreground, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <View style={[styles.radio, { borderColor: colors.foreground }]}>
              {accountType === 'citizen' && (
                <View style={[styles.radioDot, { backgroundColor: colors.foreground }]} />
              )}
            </View>
            <View style={styles.cardCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Citizen</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
                Apply for land services, make payments, and{'\n'}track your applications.
              </Text>
            </View>
          </Pressable>

          <Pressable
            testID="staff-card"
            accessibilityRole="radio"
            accessibilityState={{ selected: accountType === 'staff' }}
            accessibilityLabel="Staff"
            onPress={() => choose('staff')}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.card, shadowColor: colors.foreground, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <View style={[styles.radio, { borderColor: colors.foreground }]}>
              {accountType === 'staff' && (
                <View style={[styles.radioDot, { backgroundColor: colors.foreground }]} />
              )}
            </View>
            <View style={styles.cardCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Staff</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
                Access ministry workflows, inspections tasks{'\n'}and approvals with an invitation
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            testID="sign-in-button"
            accessibilityRole="button"
            accessibilityLabel="Sign in"
            onPress={proceedSignIn}
            disabled={!canProceed}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: canProceed ? colors.primary : colors.muted,
                shadowColor: colors.buttonShadow,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={styles.primaryBtnLabel}>Sign In</Text>
          </Pressable>

          <Pressable
            testID="create-account-button"
            accessibilityRole="button"
            accessibilityLabel="Create account"
            onPress={proceedCreateAccount}
            disabled={!canProceed}
            style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.5 : canProceed ? 1 : 0.4 }]}
          >
            <Text style={[styles.secondaryBtnLabel, { color: colors.foreground }]}>Create Account</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  bgImage: { opacity: 0.32 },
  content: { flex: 1, paddingHorizontal: 20 },
  backButton: {
    width: 36,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -5,
  },
  backArrow: {
    fontSize: 40,
    lineHeight: 36,
    fontWeight: '300' as const,
  },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.7,
    marginTop: 12,
  },
  cards: { gap: 14, marginTop: 32 },
  card: {
    minHeight: 110,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowOpacity: 0.1,
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
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  cardCopy: { flex: 1, marginLeft: 14 },
  cardTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  cardDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
  },
  actions: { marginTop: 'auto' as const, gap: 12 },
  primaryBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnLabel: {
    color: '#ffffff',
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    lineHeight: 22,
  },
  secondaryBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 20,
    textDecorationLine: 'underline' as const,
  },
});
