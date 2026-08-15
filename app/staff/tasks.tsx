import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#13bf43';
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';

const TASKS = [
  { id: '1', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', badge: 'Due Today',  badgeBg: '#fee2e2', badgeColor: '#991b1b' },
  { id: '2', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', badge: null, badgeBg: '', badgeColor: '' },
  { id: '3', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', badge: null, badgeBg: '', badgeColor: '' },
  { id: '4', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', badge: null, badgeBg: '', badgeColor: '' },
];

export default function StaffTasks() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const filtered = TASKS.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.applicant.toLowerCase().includes(query.toLowerCase()) ||
    t.appId.includes(query)
  );

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <Pressable style={styles.bellBtn}><Ionicons name="notifications-outline" size={24} color={TEXT} /></Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchBar, { flex: 1 }]}>
          <Ionicons name="search-outline" size={17} color={MUTED} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by applicant, application ID..."
            placeholderTextColor={MUTED}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Pressable style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={TEXT} />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filtered.map((task) => (
          <Pressable key={task.id} style={({ pressed }) => [styles.taskCard, { opacity: pressed ? 0.88 : 1 }]}>
            <View style={styles.taskRow}>
              <View style={styles.taskLeft}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>{task.applicant}</Text>
                <Text style={styles.taskMeta}>{task.appId}</Text>
                <Text style={styles.taskMeta}>{task.priority}</Text>
              </View>
              {task.badge && (
                <View style={[styles.badge, { backgroundColor: task.badgeBg }]}>
                  <Text style={[styles.badgeLabel, { color: task.badgeColor }]}>{task.badge}</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        {/* Help banner */}
        <View style={styles.helpBanner}>
          <View style={styles.helpIconWrap}>
            <Ionicons name="help-circle" size={28} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Need help choosing a service?</Text>
            <Text style={styles.helpBody}>Not sure which service you need? Our support team can guide you.</Text>
          </View>
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
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
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 20, color: TEXT },
  bellBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: CARD },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT },
  filterBtn: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  taskCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  taskRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  taskLeft: { flex: 1, marginRight: 10 },
  taskTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, marginBottom: 4 },
  taskMeta: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 2 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, flexShrink: 0 },
  badgeLabel: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  helpBanner: {
    flexDirection: 'row', gap: 14, backgroundColor: CARD, borderRadius: 14, padding: 16, marginTop: 6,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  helpIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  helpTitle: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginBottom: 4 },
  helpBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, lineHeight: 19 },
});
