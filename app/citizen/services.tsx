import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RemitaPaymentModal } from '@/components/RemitaPaymentModal';
import { ChatBotFAB } from '@/components/ChatBotFAB';

const PRIMARY = '#13bf43';
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';

const POPULAR = [
  { id: '1', label: 'Certificate of Occupancy', icon: 'document-outline' as const },
  { id: '2', label: 'Land Allocation', icon: 'map-outline' as const },
];

const OTHER = [
  { id: '3', label: 'Right of Occupancy', icon: 'key-outline' as const },
  { id: '4', label: 'Title Transfer', icon: 'swap-horizontal-outline' as const },
  { id: '5', label: 'Mortgage Registration', icon: 'home-outline' as const },
  { id: '6', label: 'Land Ownership Verification', icon: 'checkmark-outline' as const },
  { id: '7', label: 'Survey Plan Submission', icon: 'grid-outline' as const },
  { id: '8', label: 'Land Ownership Transfer', icon: 'git-merge-outline' as const },
  { id: '9', label: 'Verify Survey Plans', icon: 'eye-outline' as const },
  { id: '10', label: 'Book an Appointment', icon: 'calendar-outline' as const },
  { id: '11', label: 'Make Payments', icon: 'card-outline' as const },
  { id: '12', label: 'Download Receipts', icon: 'download-outline' as const },
];

export default function CitizenServices() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);

  const filteredOther = OTHER.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleServicePress = (id: string) => {
    if (id === '11') { setPaymentOpen(true); return; }
    router.push({ pathname: '/citizen/service-detail', params: { serviceId: id } } as never);
  };

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.homePill}>
          <Text style={styles.headerTitle}>Services</Text>
        </View>
        <Pressable style={styles.bellBtn} accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: CARD }]}>
          <Ionicons name="search-outline" size={18} color={MUTED} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a service"
            placeholderTextColor={MUTED}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Popular Services */}
        {query === '' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <View style={styles.popularGrid}>
              {POPULAR.map((svc) => (
                <Pressable
                  key={svc.id}
                  onPress={() => handleServicePress(svc.id)}
                  style={({ pressed }) => [styles.popularCard, { opacity: pressed ? 0.85 : 1 }]}
                >
                  <View style={styles.popularIcon}>
                    <Ionicons name={svc.icon} size={28} color={PRIMARY} />
                  </View>
                  <Text style={styles.popularLabel}>{svc.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Other Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Services</Text>
          <View style={styles.listCard}>
            {filteredOther.map((svc, i) => (
              <Pressable
                key={svc.id}
                onPress={() => handleServicePress(svc.id)}
                style={({ pressed }) => [
                  styles.listRow,
                  i < filteredOther.length - 1 && styles.listRowBorder,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <View style={styles.listIconWrap}>
                  <Ionicons name={svc.icon} size={20} color={PRIMARY} />
                </View>
                <Text style={styles.listLabel}>{svc.label}</Text>
                <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
              </Pressable>
            ))}
            {filteredOther.length === 0 && (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No services match "{query}"</Text>
              </View>
            )}
          </View>
        </View>

        {/* Help banner */}
        <View style={styles.helpBanner}>
          <View style={styles.helpIconWrap}>
            <Ionicons name="help-circle" size={28} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Need help choosing a service?</Text>
            <Text style={styles.helpBody}>
              Not sure which service you need? Our support team can guide you through the application process.
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <RemitaPaymentModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        service="General Payment"
        amount={45000}
      />
      <ChatBotFAB />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 10, backgroundColor: CARD,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  homePill: { backgroundColor: PRIMARY, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 7 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT },
  section: { marginBottom: 22 },
  sectionTitle: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT, marginBottom: 12 },
  popularGrid: { flexDirection: 'row', gap: 14 },
  popularCard: {
    flex: 1, backgroundColor: CARD, borderRadius: 14, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  popularIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#f0fdf4',
    alignItems: 'center', justifyContent: 'center',
  },
  popularLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, lineHeight: 20 },
  listCard: {
    backgroundColor: CARD, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  listRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 15,
  },
  listRowBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  listIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdf4',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  listLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT },
  emptyRow: { padding: 20, alignItems: 'center' },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED },
  helpBanner: {
    flexDirection: 'row', gap: 14, backgroundColor: CARD, borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  helpIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0fdf4',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  helpTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginBottom: 4 },
  helpBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, lineHeight: 19 },
});
