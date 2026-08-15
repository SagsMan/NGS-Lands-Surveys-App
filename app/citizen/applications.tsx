import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#13bf43';
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';

type FilterKey = 'All' | 'Drafts' | 'Under Review' | 'Rejected' | 'Approved' | 'Awaiting Payment';
const FILTERS: FilterKey[] = ['All', 'Drafts', 'Under Review', 'Rejected', 'Approved', 'Awaiting Payment'];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'Under Review':    { bg: '#fef3c7', text: '#92400e' },
  'Draft':           { bg: '#f3f4f6', text: '#6b7280' },
  'Awaiting Payment':{ bg: '#dbeafe', text: '#1e40af' },
  'Approved':        { bg: '#dcfce7', text: '#166534' },
  'Rejected':        { bg: '#fee2e2', text: '#991b1b' },
};

const APPS = [
  { id: 'MDN-38403-293', title: 'Certificate of Occupancy', date: '12 Aug 2026', status: 'Under Review' },
  { id: 'MDN-38403-293', title: 'Certificate of Occupancy', date: '12 Aug 2026', status: 'Draft' },
  { id: 'MDN-38403-292', title: 'Certificate of Occupancy', date: '12 Aug 2026', status: 'Awaiting Payment' },
  { id: 'MDN-38403-293', title: 'Certificate of Occupancy', date: '12 Aug 2026', status: 'Approved' },
  { id: 'MDN-38403-293', title: 'Certificate of Occupancy', date: '12 Aug 2026', status: 'Rejected' },
];

function AppCard({ app, onPress }: { app: typeof APPS[0]; onPress: () => void }) {
  const s = STATUS_STYLE[app.status] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.appCard, { opacity: pressed ? 0.88 : 1 }]}
    >
      <View style={styles.appCardRow}>
        <Text style={styles.appTitle}>{app.title}</Text>
        <View style={[styles.statusChip, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusLabel, { color: s.text }]}>{app.status}</Text>
        </View>
      </View>
      <Text style={styles.appMeta}>Application ID  {app.id}</Text>
      <Text style={styles.appMeta}>Submitted        {app.date}</Text>
    </Pressable>
  );
}

export default function CitizenApplications() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<typeof APPS[0] | null>(null);

  const filtered = APPS.filter((a) => {
    const matchFilter = activeFilter === 'All' || a.status === activeFilter;
    const matchQuery = a.id.includes(query) || a.title.toLowerCase().includes(query.toLowerCase());
    return matchFilter && matchQuery;
  });

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Pressable style={styles.bellBtn} accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={24} color={TEXT} />
        </Pressable>
      </View>

      {selected ? (
        /* ── Application Detail ── */
        <ScrollView style={styles.scroll} contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => setSelected(null)} style={styles.detailBack}>
            <Ionicons name="chevron-back" size={20} color={TEXT} />
            <Text style={styles.detailBackLabel}>Application Details</Text>
          </Pressable>

          <DetailSection title="Details" badge={selected.status} badgeStyle={STATUS_STYLE[selected.status]}>
            {[
              ['Full name', 'David Stone'],
              ['Date Submitted', '12 Aug 2026 00:35'],
              ['Property Address', 'Victoria Island'],
              ['Plot Number', '234'],
              ['District', 'Downtown'],
              ['Local Government Area', 'Badagry'],
              ['Survey Number', '1234-5678-9012'],
              ['Land Size', '345 sq.ft'],
            ].map(([k, v]) => <DetailRow key={k} label={k} value={v} />)}
          </DetailSection>

          <DetailSection title="Documents">
            {['National ID', 'Passport Photograph', 'Survey Plan', 'Proof of Ownership'].map((doc) => (
              <View key={doc} style={styles.docRow}>
                <Text style={styles.docLabel}>{doc}</Text>
                <View style={styles.docFile}>
                  <Ionicons name="document-outline" size={22} color={MUTED} />
                  <Text style={styles.docFileName}>Survey Plan.pdf</Text>
                </View>
              </View>
            ))}
          </DetailSection>

          <DetailSection title="Payment Information">
            {[
              ['Amount Paid', '₦500'],
              ['Transaction ID', '1234-5678-9012'],
              ['Payment Date', '12 Aug 2026, 00:34'],
            ].map(([k, v]) => <DetailRow key={k} label={k} value={v} />)}
            <Pressable style={styles.receiptBtn}>
              <Text style={[styles.receiptBtnLabel, { color: PRIMARY }]}>See Receipt</Text>
            </Pressable>
          </DetailSection>

          <Pressable style={styles.viewProgressBtn}>
            <Text style={styles.viewProgressLabel}>View Progress</Text>
          </Pressable>
          <View style={{ height: 24 }} />
        </ScrollView>
      ) : (
        /* ── Applications List ── */
        <>
          <View style={styles.searchRow}>
            <View style={[styles.searchBar, { flex: 1 }]}>
              <Ionicons name="search-outline" size={17} color={MUTED} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by Application ID"
                placeholderTextColor={MUTED}
                value={query}
                onChangeText={setQuery}
              />
            </View>
            <Pressable onPress={() => setFilterOpen(true)} style={styles.filterBtn}>
              <Ionicons name="options-outline" size={20} color={TEXT} />
            </Pressable>
          </View>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {filtered.map((app, i) => (
              <AppCard key={i} app={app} onPress={() => setSelected(app)} />
            ))}
            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={40} color="#d1d5db" />
                <Text style={styles.emptyText}>No applications found</Text>
              </View>
            )}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Filter Bottom Sheet */}
          <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)} />
            <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Filters</Text>
              <View style={styles.filterChips}>
                {FILTERS.map((f) => (
                  <Pressable
                    key={f}
                    onPress={() => { setActiveFilter(f); setFilterOpen(false); }}
                    style={[styles.filterChip, activeFilter === f && { backgroundColor: PRIMARY }]}
                  >
                    <Text style={[styles.filterChipLabel, activeFilter === f && { color: '#fff' }]}>{f}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

function DetailSection({ title, badge, badgeStyle, children }: {
  title: string; badge?: string; badgeStyle?: { bg: string; text: string }; children: React.ReactNode;
}) {
  return (
    <View style={ds.section}>
      <View style={ds.header}>
        <Text style={ds.title}>{title}</Text>
        {badge && badgeStyle && (
          <View style={[ds.badge, { backgroundColor: badgeStyle.bg }]}>
            <Text style={[ds.badgeText, { color: badgeStyle.text }]}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={ds.card}>{children}</View>
    </View>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={ds.row}>
      <Text style={ds.label}>{label}</Text>
      <Text style={ds.value}>{value}</Text>
    </View>
  );
}
const ds = StyleSheet.create({
  section: { marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  card: { backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 16, overflow: 'hidden' },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED },
  value: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, textAlign: 'right', flex: 1, marginLeft: 12 },
});

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 10, backgroundColor: CARD,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 20, color: TEXT },
  bellBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: CARD },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT },
  filterBtn: {
    width: 42, height: 42, borderRadius: 10, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12 },
  appCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  appCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  appTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, flex: 1, marginRight: 10 },
  statusChip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0 },
  statusLabel: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  appMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 3 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: MUTED },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  bottomSheet: {
    backgroundColor: CARD, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, minHeight: 200,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontFamily: 'Inter_500Medium', fontSize: 17, color: TEXT, marginBottom: 16 },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterChip: {
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9,
    borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: CARD,
  },
  filterChipLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT },
  detailContent: { paddingHorizontal: 20, paddingTop: 16 },
  detailBack: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  detailBackLabel: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT },
  docRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  docLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginBottom: 8 },
  docFile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docFileName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  receiptBtn: {
    borderWidth: 1, borderColor: PRIMARY, borderRadius: 20,
    paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-end', marginTop: 8,
  },
  receiptBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  viewProgressBtn: {
    height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: PRIMARY,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  viewProgressLabel: { color: PRIMARY, fontFamily: 'Inter_500Medium', fontSize: 16 },
});
