import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const ministrySeal = require('@/assets/images/brand/ministry-seal.png');

const PRIMARY = '#13bf43';
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';
const DEEP_GREEN = '#0b3d26';

function SectionHeader({ title, linkText }: { title: string; linkText: string }) {
  return (
    <View style={sh.row}>
      <Text style={sh.title}>{title}</Text>
      <Pressable><Text style={sh.link}>{linkText}</Text></Pressable>
    </View>
  );
}
const sh = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT },
  link: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
});

export default function StaffHome() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Home</Text>
        <Pressable style={styles.bellBtn} accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={24} color={TEXT} />
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.greetRow}>
          <Text style={styles.greetText}>Good Morning, <Text style={styles.greetName}>Alsha</Text></Text>
          <Pressable style={styles.checkInBtn}>
            <Text style={styles.checkInLabel}>Check-in</Text>
          </Pressable>
        </View>

        {/* Work Summary */}
        <View style={styles.section}>
          <SectionHeader title="Work Summary" linkText="View Tasks" />
          <View style={styles.statsGrid}>
            {[
              { label: 'Assigned Tasks', value: '12' },
              { label: 'In Progress',    value: '4'  },
              { label: 'Due Today',      value: '3'  },
              { label: 'Completed',      value: '18' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={sh.title}>Quick Actions</Text>
          <View style={[styles.statsGrid, { marginTop: 12 }]}>
            {[
              { label: 'Start Inspection', icon: 'search-outline' as const },
              { label: 'Capture GPS',      icon: 'location-outline' as const },
              { label: 'Scan QR Code',     icon: 'qr-code-outline' as const },
              { label: 'View Assigned Tasks', icon: 'list-outline' as const },
            ].map((action) => (
              <Pressable
                key={action.label}
                style={({ pressed }) => [styles.quickCard, { opacity: pressed ? 0.85 : 1 }]}
                onPress={() => router.push('/(staff)/tasks')}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={action.icon} size={26} color={MUTED} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pending Approvals */}
        <View style={styles.section}>
          <SectionHeader title="Pending Approvals" linkText="View More" />
          <Pressable
            onPress={() => router.push('/(staff)/applications')}
            style={({ pressed }) => [styles.approvalCard, { opacity: pressed ? 0.88 : 1 }]}
          >
            <View style={styles.approvalLeft}>
              <Text style={styles.approvalTitle}>Certificate of Occupancy</Text>
              <Text style={styles.approvalMeta}>Waiting · 2 Days</Text>
              <Text style={styles.approvalApplicant}>Applicant: David Stone</Text>
            </View>
            <Pressable style={styles.reviewBtn}>
              <Text style={styles.reviewBtnLabel}>Review</Text>
            </Pressable>
          </Pressable>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <SectionHeader title="Recent Activity" linkText="View All" />
          <View style={styles.tableCard}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Activity</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Time</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
            </View>
            {[
              { activity: 'Inspection submitted', time: 'Today',     status: 'Completed', color: '#166534', bg: '#dcfce7' },
              { activity: 'C of O Approved',      time: 'Yesterday', status: 'Approved',  color: '#166534', bg: '#dcfce7' },
              { activity: 'Document Verified',    time: '25 Jul',    status: 'Completed', color: '#166534', bg: '#dcfce7' },
            ].map((row, i) => (
              <View key={i} style={[styles.tableRow, i > 0 && styles.tableBorder]}>
                <Text style={[styles.tableCell, styles.tableBodyText, { flex: 2 }]} numberOfLines={1}>{row.activity}</Text>
                <Text style={[styles.tableCell, styles.tableBodyText]}>{row.time}</Text>
                <View style={[styles.statusChip, { backgroundColor: row.bg }]}>
                  <Text style={[styles.statusLabel, { color: row.color }]}>{row.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Department Announcement */}
        <View style={styles.section}>
          <Text style={sh.title}>Department Announcement</Text>
          <Text style={styles.announceSub}>Stay informed with the latest updates from the ministry of Lands & Survey</Text>
          <View style={styles.announceCard}>
            <View style={styles.announceImgWrap}>
              <Image source={ministrySeal} style={styles.announceImg} resizeMode="contain" />
            </View>
            <Text style={styles.announceTitle}>Staff Meeting</Text>
            <Text style={styles.announceBody}>Monthly departmental meeting on Friday 9:00 AM at Modesta Conference Hall</Text>
            <Text style={styles.announceTime}>2 hours ago</Text>
            <Pressable><Text style={[styles.announceLink, { color: PRIMARY }]}>Read More</Text></Pressable>
            <View style={styles.dotRow}>
              {[0, 1, 2].map((d) => (
                <View key={d} style={[styles.dot, { backgroundColor: d === 1 ? PRIMARY : '#d1d5db' }]} />
              ))}
            </View>
          </View>
        </View>

        {/* Performance Snapshot */}
        <View style={styles.section}>
          <SectionHeader title="Performance Snapshot" linkText="View Performance" />
          <View style={styles.perfCard}>
            {[
              { label: 'Tasks Completed',   value: '28' },
              { label: 'Active Tasks',      value: '7'  },
              { label: 'Completion Rate',   value: '94%' },
              { label: 'Average Review Time', value: '21 Days' },
            ].map((row, i, arr) => (
              <View key={row.label} style={[styles.perfRow, i < arr.length - 1 && styles.perfBorder]}>
                <Text style={styles.perfLabel}>{row.label}</Text>
                <Text style={styles.perfValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
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
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  greetText: { fontFamily: 'Inter_400Regular', fontSize: 17, color: TEXT },
  greetName: { fontFamily: 'Inter_600SemiBold', color: TEXT },
  checkInBtn: {
    borderWidth: 1.5, borderColor: PRIMARY, borderRadius: 20,
    paddingHorizontal: 18, paddingVertical: 8,
  },
  checkInLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: PRIMARY },
  section: { marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%', backgroundColor: CARD, borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 28, color: TEXT, marginBottom: 4 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  quickCard: {
    width: '47%', backgroundColor: CARD, borderRadius: 12, padding: 14, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  quickIcon: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT, lineHeight: 18 },
  approvalCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  approvalLeft: { flex: 1, marginRight: 12 },
  approvalTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
  approvalMeta: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 3 },
  approvalApplicant: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 2 },
  reviewBtn: { backgroundColor: PRIMARY, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 9 },
  reviewBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 14 },
  tableCard: {
    backgroundColor: CARD, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  tableHeader: { backgroundColor: '#f9fafb' },
  tableBorder: { borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  tableCell: { flex: 1 },
  tableHeaderText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: MUTED },
  tableBodyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT },
  statusChip: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  statusLabel: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  announceSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, lineHeight: 20, marginTop: 4, marginBottom: 12 },
  announceCard: {
    backgroundColor: CARD, borderRadius: 14, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  announceImgWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  announceImg: { width: 68, height: 68 },
  announceTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, textAlign: 'center', marginBottom: 6 },
  announceBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 20, marginBottom: 6 },
  announceTime: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginBottom: 8 },
  announceLink: { fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 14 },
  dotRow: { flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  perfCard: {
    backgroundColor: CARD, borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  perfBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  perfLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED },
  perfValue: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
});
