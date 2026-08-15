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

  const proceedSignIn = () => {
    if (!accountType) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/auth/sign-in', params: { accountType } });
  };

  const proceedCreateAccount = () => {
    if (accountType !== 'citizen') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/auth/create-citizen');
  };

  const canProceed = accountType !== null;
  const canCreate = accountType === 'citizen';

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

      <View style={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}>
        {/* Back */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.backArrow, { color: colors.foreground }]}>‹</Text>
        </Pressable>

        <Text style={[styles.title, { color: colors.text }]}>Choose Account Type</Text>

        <View style={styles.cards}>
          {/* Citizen */}
          <Pressable
            testID="citizen-card"
            accessibilityRole="radio"
            accessibilityState={{ selected: accountType === 'citizen' }}
            onPress={() => choose('citizen')}
            style={({ pressed }) => [
              styles.card,
              accountType === 'citizen' && { borderColor: colors.primary, borderWidth: 1.5 },
              { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={[styles.radio, {
              borderColor: accountType === 'citizen' ? colors.primary : '#c0cac2',
            }]}>
              {accountType === 'citizen' && (
                <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <View style={styles.cardCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Citizen</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
                Apply for land services, make payments, and track your applications.
              </Text>
            </View>
          </Pressable>

          {/* Staff */}
          <Pressable
            testID="staff-card"
            accessibilityRole="radio"
            accessibilityState={{ selected: accountType === 'staff' }}
            onPress={() => choose('staff')}
            style={({ pressed }) => [
              styles.card,
              accountType === 'staff' && { borderColor: colors.primary, borderWidth: 1.5 },
              { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <View style={[styles.radio, {
              borderColor: accountType === 'staff' ? colors.primary : '#c0cac2',
            }]}>
              {accountType === 'staff' && (
                <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <View style={styles.cardCopy}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Staff</Text>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
                Access ministry workflows, inspections tasks and approvals with an invitation
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.actions}>
          {/* Primary: Sign In */}
          <Pressable
            testID="sign-in-button"
            accessibilityRole="button"
            onPress={proceedSignIn}
            disabled={!canProceed}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: canProceed ? colors.primary : colors.muted, opacity: pressed ? 0.82 : 1 },
            ]}
          >
            <Text style={styles.primaryBtnLabel}>Sign In</Text>
          </Pressable>

          {/* Secondary: Create Account (citizen only) */}
          <Pressable
            testID="create-account-button"
            accessibilityRole="button"
            onPress={proceedCreateAccount}
            disabled={!canCreate}
            style={({ pressed }) => [styles.secondaryBtn, { opacity: pressed ? 0.5 : canCreate ? 1 : 0.35 }]}
          >
            <Text style={[styles.secondaryBtnLabel, { color: colors.foreground }]}>
              {accountType === 'staff' ? 'Staff registration requires invitation' : 'Create Account'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  bgImage: { opacity: 0.32 },
  content: { flex: 1, paddingHorizontal: 24 },
  backButton: { width: 36, height: 44, alignItems: 'flex-start', justifyContent: 'center', marginLeft: -6 },
  backArrow: { fontSize: 40, lineHeight: 38, fontWeight: '300' as const },
  title: { fontFamily: 'Inter_400Regular', fontSize: 28, lineHeight: 36, letterSpacing: -0.6, marginTop: 10 },
  cards: { gap: 14, marginTop: 32 },
  card: {
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  cardCopy: { flex: 1, marginLeft: 14 },
  cardTitle: { fontFamily: 'Inter_500Medium', fontSize: 17, lineHeight: 22 },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 4 },
  actions: { marginTop: 'auto' as const, gap: 10 },
  primaryBtn: {
    height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center',
    shadowColor: 'rgba(8,64,28,0.22)', shadowOpacity: 1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  primaryBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 17 },
  secondaryBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, textDecorationLine: 'underline' as const },
});
