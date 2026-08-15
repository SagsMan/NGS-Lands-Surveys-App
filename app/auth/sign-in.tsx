import React, { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
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

  const passwordRef = useRef<TextInput>(null);
  const canSubmit = identifier.trim() !== '' && password !== '';

  const submit = () => {
    if (!canSubmit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isStaff) {
      router.replace('/staff/' as never);
    } else {
      router.replace('/citizen/' as never);
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
                <Text style={[styles.eyeIcon, { color: colors.mutedForeground }]}>
                  {passwordHidden ? '○' : '●'}
                </Text>
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
});
