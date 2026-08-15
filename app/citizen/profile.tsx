import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const ministrySeal = require('@/assets/images/brand/ministry-seal.png');
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';
const PRIMARY = '#13bf43';
const DANGER = '#ef4444';

const MENU = [
  { icon: 'person-outline' as const, label: 'Personal Information' },
  { icon: 'lock-closed-outline' as const, label: 'Change Password' },
  { icon: 'notifications-outline' as const, label: 'Notifications' },
  { icon: 'shield-outline' as const, label: 'Privacy & Security' },
  { icon: 'help-circle-outline' as const, label: 'Help & Support' },
  { icon: 'document-text-outline' as const, label: 'Terms & Conditions' },
  { icon: 'information-circle-outline' as const, label: 'About' },
];

export default function CitizenProfile() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: PRIMARY + '20' }]}>
            <Ionicons name="person" size={48} color={PRIMARY} />
          </View>
          <Text style={styles.name}>Sagiru</Text>
          <Text style={styles.email}>sagiru@gmail.com</Text>
          <View style={styles.citizenBadge}>
            <Text style={styles.citizenBadgeLabel}>Citizen</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [
                styles.menuRow,
                i < MENU.length - 1 && styles.menuBorder,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={20} color={PRIMARY} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
            </Pressable>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={() => router.replace('/auth/account-type')}
          style={({ pressed }) => [styles.signOutBtn, { opacity: pressed ? 0.8 : 1 }]}
        >
          <Ionicons name="log-out-outline" size={20} color={DANGER} />
          <Text style={styles.signOutLabel}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingBottom: 10, backgroundColor: CARD,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 20, color: TEXT },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: TEXT, marginBottom: 4 },
  email: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED, marginBottom: 10 },
  citizenBadge: { backgroundColor: PRIMARY + '20', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  citizenBadgeLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: PRIMARY },
  menuCard: {
    backgroundColor: CARD, borderRadius: 14, overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: CARD, borderRadius: 14, paddingVertical: 15, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  signOutLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: DANGER },
});
