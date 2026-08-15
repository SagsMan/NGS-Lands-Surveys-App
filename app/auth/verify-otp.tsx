import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const landscape = require('@/assets/images/brand/landscape.jpg');

const OTP_LENGTH = 6;
const RESEND_SECONDS = 3 * 60 + 23; // 03:23

export default function VerifyOtpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  // Responsive square box: fill available width minus padding (48) and 5 gaps (8px each)
  const PADDING = 48;
  const GAP = 8;
  const boxSize = Math.min(Math.floor((screenWidth - PADDING - GAP * (OTP_LENGTH - 1)) / OTP_LENGTH), 52);
  const boxFontSize = Math.round(boxSize * 0.38);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;

  const handleDigit = useCallback((index: number, val: string) => {
    const char = val.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [digits]);

  const handleKeyPress = useCallback((index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [digits]);

  const resend = () => {
    if (!canResend) return;
    Haptics.selectionAsync();
    setDigits(Array(OTP_LENGTH).fill(''));
    setSecondsLeft(RESEND_SECONDS);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  const filled = digits.every((d) => d !== '');

  const verify = () => {
    if (!filled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: submit OTP to backend
    router.push('/auth/sign-in');
  };

  return (
    <ImageBackground
      source={landscape}
      resizeMode="cover"
      style={[styles.screen, { backgroundColor: colors.background }]}
      imageStyle={styles.bgImage}
      testID="verify-otp-screen"
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
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.backArrow, { color: colors.foreground }]}>‹</Text>
        </Pressable>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Verify Email</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Check your email for a six digit one-time pin
        </Text>

        {/* OTP boxes */}
        <View style={[styles.otpRow, { gap: GAP }]}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputRefs.current[i] = r; }}
              testID={`otp-box-${i}`}
              style={[
                styles.otpBox,
                {
                  width: boxSize,
                  height: boxSize,
                  fontSize: boxFontSize,
                  backgroundColor: colors.card,
                  borderColor: digit ? colors.primary : colors.border,
                  color: colors.text,
                },
              ]}
              value={digit}
              onChangeText={(v) => handleDigit(i, v)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={`OTP digit ${i + 1}`}
              returnKeyType="done"
            />
          ))}
        </View>

        {/* Resend row */}
        <View style={styles.resendRow}>
          <Pressable
            onPress={resend}
            disabled={!canResend}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : canResend ? 1 : 0.45 })}
          >
            <Text style={[styles.resendText, { color: colors.primary }]}>Resend Pin</Text>
          </Pressable>
          {!canResend && (
            <Text style={[styles.timerText, { color: colors.mutedForeground }]}>{formattedTime}</Text>
          )}
        </View>

        {/* Bottom button */}
        <View style={styles.footer}>
          <Pressable
            testID="verify-button"
            accessibilityRole="button"
            accessibilityLabel="Verify"
            onPress={verify}
            disabled={!filled}
            style={({ pressed }) => [
              styles.primaryBtn,
              {
                backgroundColor: filled ? colors.primary : colors.muted,
                shadowColor: colors.buttonShadow,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Text style={styles.primaryBtnLabel}>Verify</Text>
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
  backArrow: { fontSize: 40, lineHeight: 36, fontWeight: '300' as const },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.7,
    marginTop: 12,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 320,
  },
  otpRow: {
    flexDirection: 'row',
    marginTop: 32,
    alignItems: 'center',
  },
  otpBox: {
    borderRadius: 10,
    borderWidth: 1.5,
    textAlign: 'center',
    fontFamily: 'Inter_500Medium',
    // width, height, fontSize set dynamically from boxSize / boxFontSize
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  timerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 18,
  },
  footer: { marginTop: 'auto' as const },
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
});
