import React, { useRef, useState } from 'react';
import {
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

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
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
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
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
});

export default function CreateCitizenScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const canSubmit = firstName && lastName && email && phone && password && confirmPassword;

  const submit = () => {
    if (!canSubmit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/auth/verify-otp');
  };

  return (
    <ImageBackground
      source={landscape}
      resizeMode="cover"
      style={[styles.screen, { backgroundColor: colors.background }]}
      imageStyle={styles.bgImage}
      testID="create-citizen-screen"
    >
      <StatusBar style="dark" />
      <LinearGradient
        colors={[colors.imageWashStrong, colors.imageWash, colors.imageWashStrong]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => { Haptics.selectionAsync(); router.back(); }}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.backArrow, { color: colors.foreground }]}>‹</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Create Account - Citizen</Text>
      </View>

      {/* Scrollable form */}
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={[styles.form, { paddingBottom: insets.bottom + 100 }]}
        bottomOffset={20}
        showsVerticalScrollIndicator={false}
      >
        <LabeledInput
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          placeholder="First Name"
          inputRef={undefined}
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current?.focus()}
          colors={colors}
        />
        <LabeledInput
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          placeholder="Last Name"
          inputRef={lastNameRef}
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          colors={colors}
        />
        <LabeledInput
          label="Email Address"
          value={email}
          onChange={setEmail}
          placeholder="Email Address"
          keyboardType="email-address"
          inputRef={emailRef}
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          colors={colors}
        />
        <LabeledInput
          label="Phone Number"
          value={phone}
          onChange={setPhone}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          inputRef={phoneRef}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          colors={colors}
        />
        <LabeledInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Create Password"
          secure
          inputRef={passwordRef}
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          colors={colors}
        />
        <LabeledInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm Password"
          secure
          inputRef={confirmRef}
          returnKeyType="done"
          onSubmitEditing={submit}
          colors={colors}
        />
      </KeyboardAwareScrollViewCompat>

      {/* Fixed bottom button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          testID="continue-button"
          accessibilityRole="button"
          accessibilityLabel="Continue"
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
  header: { paddingHorizontal: 20, paddingBottom: 8 },
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
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.5,
    marginTop: 8,
  },
  scroll: { flex: 1 },
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 18,
  },
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
