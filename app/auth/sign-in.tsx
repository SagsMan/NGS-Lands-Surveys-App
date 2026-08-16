import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const landscape = require('@/assets/images/brand/landscape.jpg');
const ministrySeal = require('@/assets/images/brand/ministry-seal.png');

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { accountType } = useLocalSearchParams<{ accountType: 'citizen' | 'staff' }>();
  const isStaff = accountType === 'staff';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'none'>('none');

  const passwordRef = useRef<TextInput>(null);
  const canSubmit = identifier.trim() !== '' && password !== '';

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (compatible && enrolled) {
        setBiometricAvailable(true);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('face');
        } else {
          setBiometricType('fingerprint');
        }
      }
    })();
  }, []);

  const navigateHome = () => {
    if (isStaff) {
      router.replace('/staff/' as never);
    } else {
      router.replace('/citizen/' as never);
    }
  };

  const submit = () => {
    if (!canSubmit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigateHome();
  };

  const loginWithBiometric = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: isStaff ? 'Staff biometric login' : 'Citizen biometric login',
      fallbackLabel: 'Use Password',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigateHome();
    } else if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
      Alert.alert('Authentication failed', 'Please use your password instead.');
    }
  };

  return (
    <ImageBackground
      source={landscape}
      resizeMode="cover"
      style={[styles.screen, { backgroundColor: colors.background }]}
      imageStyle={styles.bgImage}
      testID="sign-in-screen"
    >
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.imageWashStrong, colors.imageWash, colors.imageWashStrong]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]}
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.backArrow, { color: colors.foreground }]}>‹</Text>
        </Pressable>

        {/* Ministry seal */}
        <View style={styles.sealContainer}>
          <View style={[styles.sealCircle, { backgroundColor: colors.card }]}>
            <Image source={ministrySeal} resizeMode="contain" style={styles.sealImage} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Sign in</Text>

        <View style={styles.fields}>
          {/* Identifier field */}
          <View style={styles.fieldWrapper}>
            <Text style={[styles.label, { color: colors.text }]}>
              {isStaff ? 'Staff ID' : 'Email Address'}
            </Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder={isStaff ? 'Email or Staff ID' : 'Email or Staff ID'}
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel={isStaff ? 'Staff ID' : 'Email Address'}
              />
            </View>
          </View>

          {/* Password field */}
          <View style={styles.fieldWrapper}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                ref={passwordRef}
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={passwordHidden}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={submit}
                accessibilityLabel="Password"
              />
              <Pressable
                onPress={() => setPasswordHidden((h) => !h)}
                accessibilityLabel={passwordHidden ? 'Show password' : 'Hide password'}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={passwordHidden ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
            <Pressable
              onPress={() => Haptics.selectionAsync()}
              style={styles.forgotRow}
              accessibilityLabel="Forgot password"
            >
              <Text style={[styles.forgotText, { color: colors.mutedForeground }]}>Forgot Password</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          testID="sign-in-submit"
          accessibilityRole="button"
          onPress={submit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: canSubmit ? colors.primary : colors.muted, opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Text style={styles.primaryBtnLabel}>Sign In</Text>
        </Pressable>

        {biometricAvailable && (
          <>
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or continue with</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>
            <Pressable
              onPress={loginWithBiometric}
              accessibilityRole="button"
              accessibilityLabel={biometricType === 'face' ? 'Sign in with Face ID' : 'Sign in with Fingerprint'}
              style={({ pressed }) => [styles.biometricBtn, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons
                name={biometricType === 'face' ? 'scan-outline' : 'finger-print-outline'}
                size={30}
                color={colors.primary}
              />
            </Pressable>
            <Text style={[styles.biometricHint, { color: colors.mutedForeground }]}>
              {biometricType === 'face' ? 'Face ID' : 'Touch ID / Fingerprint'}
            </Text>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  bgImage: { opacity: 0.32 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },
  backButton: { width: 36, height: 44, alignItems: 'flex-start', justifyContent: 'center', marginLeft: -6 },
  backArrow: { fontSize: 40, lineHeight: 38, fontWeight: '300' as const },
  sealContainer: { alignItems: 'center', marginTop: 16, marginBottom: 12 },
  sealCircle: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sealImage: { width: 136, height: 136 },
  title: { fontFamily: 'Inter_400Regular', fontSize: 28, lineHeight: 36, letterSpacing: -0.6, marginBottom: 24 },
  fields: { gap: 20 },
  fieldWrapper: { gap: 6 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 18 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, minHeight: 50,
  },
  input: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, paddingVertical: 14 },
  eyeBtn: { paddingLeft: 10, paddingVertical: 8 },
  eyeIcon: { fontSize: 18 },
  forgotRow: { alignSelf: 'flex-end', marginTop: 6 },
  forgotText: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  footer: { paddingHorizontal: 24, paddingTop: 12 },
  primaryBtn: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 17 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  biometricBtn: {
    alignSelf: 'center', marginTop: 14,
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 1.5, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }, elevation: 3,
  },
  biometricHint: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', marginTop: 8, marginBottom: 4 },
});
