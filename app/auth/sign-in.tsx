import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
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

const landscape   = require('@/assets/images/brand/landscape.jpg');
const ministrySeal = require('@/assets/images/brand/ministry-seal.png');

const PRIMARY = '#13bf43';

export default function SignInScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { accountType } = useLocalSearchParams<{ accountType: 'citizen' | 'staff' }>();
  const isStaff = accountType === 'staff';

  const [identifier,     setIdentifier]     = useState('');
  const [password,       setPassword]       = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [biometricType,  setBiometricType]  = useState<'fingerprint' | 'face'>('fingerprint');
  const [hasHardware,    setHasHardware]    = useState(false);

  // Pulsing ring animation
  const pulse = useRef(new Animated.Value(1)).current;

  const passwordRef = useRef<TextInput>(null);
  const canSubmit   = identifier.trim() !== '' && password !== '';

  // ── Pulse loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  // ── Detect hardware + auto-prompt ─────────────────────────────────────
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled   = await LocalAuthentication.isEnrolledAsync();
      if (compatible && enrolled) {
        setHasHardware(true);
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setBiometricType(
          types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
            ? 'face' : 'fingerprint',
        );
        // Auto-prompt 700 ms after screen mounts
        setTimeout(triggerBiometric, 700);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateHome = () =>
    isStaff ? router.replace('/staff/' as never) : router.replace('/citizen/' as never);

  const submit = () => {
    if (!canSubmit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigateHome();
  };

  const triggerBiometric = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!hasHardware) {
      // Hardware detected only at mount — re-check in case called manually
      const ok = await LocalAuthentication.hasHardwareAsync();
      if (!ok) {
        Alert.alert('Not available', 'Biometric login is not set up on this device.');
        return;
      }
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage  : isStaff ? 'Staff biometric login' : 'Citizen biometric login',
      fallbackLabel  : 'Use Password',
      cancelLabel    : 'Cancel',
      disableDeviceFallback: false,
    });
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigateHome();
    } else if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
      Alert.alert('Authentication failed', 'Please use your password to sign in.');
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 120 },
        ]}
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
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
          {/* Identifier */}
          <View style={styles.fieldWrapper}>
            <Text style={[styles.label, { color: colors.text }]}>
              {isStaff ? 'Staff ID' : 'Email Address'}
            </Text>
            <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={identifier}
                onChangeText={setIdentifier}
                placeholder={isStaff ? 'Email or Staff ID' : 'Enter your email'}
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                accessibilityLabel={isStaff ? 'Staff ID' : 'Email Address'}
              />
            </View>
          </View>

          {/* Password */}
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
                onPress={() => setPasswordHidden(h => !h)}
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

      {/* ── Fixed footer ── */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {/* Sign In button */}
        <Pressable
          testID="sign-in-submit"
          accessibilityRole="button"
          onPress={submit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.primaryBtn,
            { backgroundColor: canSubmit ? PRIMARY : colors.muted, opacity: pressed ? 0.82 : 1 },
          ]}
        >
          <Text style={styles.primaryBtnLabel}>Sign In</Text>
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or tap to use biometric</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* ── NIMC-style fingerprint button ── */}
        <Pressable
          onPress={triggerBiometric}
          accessibilityRole="button"
          accessibilityLabel={biometricType === 'face' ? 'Sign in with Face ID' : 'Sign in with Fingerprint'}
          style={({ pressed }) => [styles.biometricWrap, { opacity: pressed ? 0.8 : 1 }]}
        >
          {/* Outer pulse ring */}
          <Animated.View style={[styles.biometricRingOuter, { transform: [{ scale: pulse }] }]} />
          {/* Middle ring */}
          <View style={styles.biometricRingMid} />
          {/* Inner green circle */}
          <View style={styles.biometricInner}>
            <Ionicons
              name={biometricType === 'face' ? 'scan' : 'finger-print'}
              size={36}
              color="#fff"
            />
          </View>
        </Pressable>

        <Text style={[styles.biometricHint, { color: colors.mutedForeground }]}>
          {biometricType === 'face' ? 'Face ID' : 'Touch ID · Fingerprint Login'}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen:        { flex: 1 },
  bgImage:       { opacity: 0.32 },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 24 },

  backButton: { width: 36, height: 44, alignItems: 'flex-start', justifyContent: 'center', marginLeft: -6 },
  backArrow:  { fontSize: 40, lineHeight: 38, fontWeight: '300' as const },

  sealContainer: { alignItems: 'center', marginTop: 16, marginBottom: 12 },
  sealCircle:    {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  sealImage: { width: 136, height: 136 },

  title:        { fontFamily: 'Inter_400Regular', fontSize: 28, lineHeight: 36, letterSpacing: -0.6, marginBottom: 24 },
  fields:       { gap: 20 },
  fieldWrapper: { gap: 6 },
  label:        { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 18 },
  inputRow:     {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, minHeight: 50,
  },
  input:      { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, paddingVertical: 14 },
  eyeBtn:     { paddingLeft: 10, paddingVertical: 8 },
  forgotRow:  { alignSelf: 'flex-end', marginTop: 6 },
  forgotText: { fontFamily: 'Inter_400Regular', fontSize: 13 },

  // footer
  footer:          { paddingHorizontal: 24, paddingTop: 12 },
  primaryBtn:      { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  primaryBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 17 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, marginBottom: 4 },
  dividerLine:{ flex: 1, height: 1 },
  dividerText:{ fontFamily: 'Inter_400Regular', fontSize: 11 },

  // NIMC-style fingerprint
  biometricWrap: {
    alignSelf: 'center', marginTop: 8,
    width: 90, height: 90,
    alignItems: 'center', justifyContent: 'center',
  },
  biometricRingOuter: {
    position: 'absolute',
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: PRIMARY + '28',   // 16 % opacity green
  },
  biometricRingMid: {
    position: 'absolute',
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: PRIMARY + '50',   // 31 % opacity green
  },
  biometricInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: PRIMARY, shadowOpacity: 0.55, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  biometricHint: {
    fontFamily: 'Inter_400Regular', fontSize: 12,
    textAlign: 'center', marginTop: 10, marginBottom: 2,
  },
});
