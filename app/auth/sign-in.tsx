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
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const landscape = require('@/assets/images/brand/landscape.jpg');
const ministrySeal = require('@/assets/images/brand/ministry-seal.png');

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  hint?: string;
  onHintPress?: () => void;
  keyboardType?: 'default' | 'email-address';
  returnKeyType?: 'next' | 'done';
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  colors: ReturnType<typeof useColors>;
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  secure = false,
  hint,
  onHintPress,
  keyboardType = 'default',
  returnKeyType = 'next',
  onSubmitEditing,
  inputRef,
  colors,
}: FieldProps) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={fieldStyles.wrapper}>
      <Text style={[fieldStyles.label, { color: colors.text }]}>{label}</Text>
      <View style={[fieldStyles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          ref={inputRef}
          style={[fieldStyles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize="none"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={returnKeyType === 'done'}
          accessibilityLabel={label}
        />
        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={fieldStyles.eyeBtn}
          >
            <Text style={[fieldStyles.eyeIcon, { color: colors.mutedForeground }]}>
              {hidden ? '○' : '●'}
            </Text>
          </Pressable>
        )}
      </View>
      {hint && (
        <Pressable onPress={onHintPress} style={fieldStyles.hintRow}>
          <Text style={[fieldStyles.hint, { color: colors.mutedForeground }]}>{hint}</Text>
        </Pressable>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 18 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 50,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 14,
  },
  eyeBtn: { paddingLeft: 10, paddingVertical: 8 },
  eyeIcon: { fontSize: 18 },
  hintRow: { alignSelf: 'flex-end', marginTop: 4 },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16 },
});

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const passwordRef = useRef<TextInput>(null);

  const canSubmit = identifier.trim() !== '' && password !== '';

  const submit = () => {
    if (!canSubmit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: authenticate against backend
  };

  const forgotPassword = () => {
    Haptics.selectionAsync();
    // TODO: navigate to forgot password screen
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

        {/* Ministry seal hero */}
        <View style={styles.sealContainer}>
          <View style={[styles.sealCircle, { backgroundColor: colors.card, shadowColor: colors.foreground }]}>
            <Image
              source={ministrySeal}
              resizeMode="contain"
              style={styles.sealImage}
              accessibilityLabel="Ministry of Lands and Survey, Niger State"
            />
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={[styles.title, { color: colors.text }]}>Sign in</Text>

          <View style={styles.fields}>
            <LabeledInput
              label="Email Address"
              value={identifier}
              onChange={setIdentifier}
              placeholder="Email or Staff ID"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              colors={colors}
            />
            <LabeledInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              secure
              hint="Forgot Password"
              onHintPress={forgotPassword}
              inputRef={passwordRef}
              returnKeyType="done"
              onSubmitEditing={submit}
              colors={colors}
            />
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>

      {/* Fixed bottom button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          testID="sign-in-button"
          accessibilityRole="button"
          accessibilityLabel="Sign in"
          onPress={submit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.primaryBtn,
            {
              backgroundColor: canSubmit ? colors.primary : colors.muted,
              shadowColor: colors.buttonShadow,
              opacity: pressed ? 0.82 : 1,
            },
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
  scrollContent: { paddingHorizontal: 20 },
  backButton: {
    width: 36,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -5,
  },
  backArrow: { fontSize: 40, lineHeight: 36, fontWeight: '300' as const },
  sealContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  sealCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  sealImage: { width: 136, height: 136 },
  form: { marginTop: 12 },
  title: {
    fontFamily: 'Inter_400Regular',
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.7,
    marginBottom: 24,
  },
  fields: { gap: 18 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
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
