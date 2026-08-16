/**
 * AvatarPicker
 * – Shows a crisp SVG human avatar (male / female) when no photo is selected
 * – Overlays a camera FAB that opens an action sheet:
 *     • Upload from Gallery
 *     • Take Photo
 *     • Delete Photo
 * – Uses expo-image-picker for both gallery and camera
 */

import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse, Path, Defs, RadialGradient, Stop, ClipPath, Rect } from 'react-native-svg';

const PRIMARY = '#13bf43';
const DANGER  = '#ef4444';

/* ─────────────────────────────────────────
   SVG default avatars
───────────────────────────────────────── */

function MaleAvatar({ size }: { size: number }) {
  const r = size / 2;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="bg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#3b82f6" />
          <Stop offset="100%" stopColor="#1d4ed8" />
        </RadialGradient>
        <ClipPath id="clip">
          <Circle cx="50" cy="50" r="50" />
        </ClipPath>
      </Defs>
      {/* Background */}
      <Circle cx="50" cy="50" r="50" fill="url(#bg)" />

      {/* Shoulder body — wide flat arc at bottom */}
      <Ellipse cx="50" cy="95" rx="38" ry="26" fill="#eff6ff" clipPath="url(#clip)" />

      {/* Neck */}
      <Rect x="43" y="60" width="14" height="14" rx="3" fill="#fde68a" clipPath="url(#clip)" />

      {/* Head */}
      <Circle cx="50" cy="48" r="20" fill="#fde68a" />

      {/* Hair — flat top with slight widow's peak */}
      <Path
        d="M30 44 Q30 24 50 24 Q70 24 70 44 Q65 32 50 32 Q35 32 30 44Z"
        fill="#78350f"
      />

      {/* Eyes */}
      <Circle cx="43" cy="46" r="2.2" fill="#1e3a5f" />
      <Circle cx="57" cy="46" r="2.2" fill="#1e3a5f" />

      {/* Eyebrow strokes */}
      <Path d="M40 42 Q43 40 46 42" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <Path d="M54 42 Q57 40 60 42" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <Path d="M49 48 Q48 53 50 54 Q52 53 51 48" stroke="#d97706" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Mouth */}
      <Path d="M45 58 Q50 62 55 58" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Shirt collar */}
      <Path d="M25 95 L38 72 L50 78 L62 72 L75 95Z" fill="#2563eb" clipPath="url(#clip)" />
    </Svg>
  );
}

function FemaleAvatar({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="fbg" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#ec4899" />
          <Stop offset="100%" stopColor="#be185d" />
        </RadialGradient>
        <ClipPath id="fclip">
          <Circle cx="50" cy="50" r="50" />
        </ClipPath>
      </Defs>
      {/* Background */}
      <Circle cx="50" cy="50" r="50" fill="url(#fbg)" />

      {/* Shoulder / blouse */}
      <Ellipse cx="50" cy="97" rx="42" ry="28" fill="#fce7f3" clipPath="url(#fclip)" />

      {/* Neck */}
      <Rect x="44" y="61" width="12" height="12" rx="4" fill="#fde68a" clipPath="url(#fclip)" />

      {/* Head */}
      <Circle cx="50" cy="48" r="20" fill="#fde68a" />

      {/* Long hair — back layer */}
      <Ellipse cx="50" cy="55" rx="24" ry="30" fill="#92400e" clipPath="url(#fclip)" />

      {/* Face re-draw over hair */}
      <Circle cx="50" cy="48" r="20" fill="#fde68a" />

      {/* Hair top */}
      <Path
        d="M28 44 Q28 22 50 22 Q72 22 72 44 Q68 30 50 30 Q32 30 28 44Z"
        fill="#92400e"
      />

      {/* Side hair strands */}
      <Path d="M30 44 Q26 58 28 70" stroke="#92400e" strokeWidth="7" fill="none" strokeLinecap="round" clipPath="url(#fclip)" />
      <Path d="M70 44 Q74 58 72 70" stroke="#92400e" strokeWidth="7" fill="none" strokeLinecap="round" clipPath="url(#fclip)" />

      {/* Eyes */}
      <Circle cx="43" cy="46" r="2.2" fill="#1e3a5f" />
      <Circle cx="57" cy="46" r="2.2" fill="#1e3a5f" />

      {/* Lashes */}
      <Path d="M40 43 Q43 41 46 43" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Path d="M54 43 Q57 41 60 43" stroke="#1e1b4b" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <Path d="M49 49 Q48 53 50 54 Q52 53 51 49" stroke="#d97706" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* Smile */}
      <Path d="M44 58 Q50 63 56 58" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Blouse neckline */}
      <Path d="M20 100 L40 70 L50 76 L60 70 L80 100Z" fill="#db2777" clipPath="url(#fclip)" />
    </Svg>
  );
}

/* ─────────────────────────────────────────
   Action Sheet
───────────────────────────────────────── */
type SheetOption = { icon: keyof typeof Ionicons.glyphMap; label: string; color?: string; onPress: () => void };

function ActionSheet({
  visible, onClose, options,
}: { visible: boolean; onClose: () => void; options: SheetOption[] }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={as.overlay} onPress={onClose} />
      <View style={as.sheet}>
        <View style={as.handle} />
        <Text style={as.sheetTitle}>Profile Photo</Text>
        {options.map((opt) => (
          <Pressable
            key={opt.label}
            style={({ pressed }) => [as.row, { backgroundColor: pressed ? '#f9fafb' : '#fff' }]}
            onPress={() => { onClose(); setTimeout(opt.onPress, 250); }}
          >
            <View style={[as.iconWrap, { backgroundColor: (opt.color ?? PRIMARY) + '18' }]}>
              <Ionicons name={opt.icon} size={22} color={opt.color ?? PRIMARY} />
            </View>
            <Text style={[as.label, opt.color ? { color: opt.color } : {}]}>{opt.label}</Text>
          </Pressable>
        ))}
        <Pressable style={as.cancel} onPress={onClose}>
          <Text style={as.cancelLabel}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
const as = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet:      { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingBottom: 28 },
  handle:     { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  sheetTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#0a0a0a', textAlign: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  row:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  iconWrap:   { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  label:      { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#0a0a0a' },
  cancel:     { marginTop: 8, marginHorizontal: 20, borderRadius: 14, backgroundColor: '#f3f4f6', paddingVertical: 15, alignItems: 'center' },
  cancelLabel:{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#6b7280' },
});

/* ─────────────────────────────────────────
   Main exported component
───────────────────────────────────────── */
interface AvatarPickerProps {
  gender: 'male' | 'female';
  size?: number;
}

export function AvatarPicker({ gender, size = 100 }: AvatarPickerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function requestAndLaunch(type: 'gallery' | 'camera') {
    if (type === 'gallery') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Please allow access to your photo library in Settings.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } else {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'Please allow camera access in Settings.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    }
  }

  function deletePhoto() {
    Alert.alert('Delete Photo', 'Remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setImageUri(null) },
    ]);
  }

  const sheetOptions: SheetOption[] = [
    { icon: 'image-outline',  label: 'Upload from Gallery', onPress: () => requestAndLaunch('gallery') },
    { icon: 'camera-outline', label: 'Take Photo',           onPress: () => requestAndLaunch('camera') },
    ...(imageUri
      ? [{ icon: 'trash-outline' as const, label: 'Delete Photo', color: DANGER, onPress: deletePhoto }]
      : []),
  ];

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ position: 'relative' }}>
        {/* Avatar display */}
        <View style={[av.circle, { width: size, height: size, borderRadius: size / 2 }]}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              contentFit="cover"
            />
          ) : gender === 'female' ? (
            <FemaleAvatar size={size} />
          ) : (
            <MaleAvatar size={size} />
          )}
        </View>

        {/* Camera button overlay */}
        <Pressable
          onPress={() => setSheetOpen(true)}
          style={av.cameraBtn}
          hitSlop={6}
        >
          <Ionicons name="camera" size={16} color="#fff" />
        </Pressable>
      </View>

      <ActionSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        options={sheetOptions}
      />
    </View>
  );
}

const av = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  cameraBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, elevation: 4,
  },
});
