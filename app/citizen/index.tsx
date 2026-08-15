import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RemitaPaymentModal } from '@/components/RemitaPaymentModal';

const ministrySeal = require('@/assets/images/brand/ministry-seal.png');
const landscape    = require('@/assets/images/brand/landscape.jpg');

const PRIMARY = '#13bf43';
const HELP_GREEN = '#1BB53D';   // Figma: #1BB53D
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';

type StatusKey = 'Pending' | 'Confirmed' | 'Completed' | 'Under Review' | 'Draft' | 'Awaiting Payment' | 'Approved' | 'Rejected';
const STATUS_COLORS: Record<StatusKey, { bg: string; text: string }> = {
  'Pending':         { bg: '#f3f4f6', text: '#374151' },
  'Confirmed':       { bg: '#dcfce7', text: '#166534' },
  'Completed':       { bg: '#e0e7ff', text: '#3730a3' },
  'Under Review':    { bg: '#fef3c7', text: '#92400e' },
  'Draft':           { bg: '#f3f4f6', text: '#6b7280' },
  'Awaiting Payment':{ bg: '#dbeafe', text: '#1e40af' },
  'Approved':        { bg: '#dcfce7', text: '#166534' },
  'Rejected':        { bg: '#fee2e2', text: '#991b1b' },
};

function StatusChip({ status }: { status: StatusKey }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS['Pending'];
  return (
    <View style={[chipStyles.chip, { backgroundColor: c.bg }]}>
      <Text style={[chipStyles.label, { color: c.text }]}>{status}</Text>
    </View>
  );
}
const chipStyles = StyleSheet.create({
  chip: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11 },
});

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

export default function CitizenHome() {
  const insets = useSafeAreaInsets();
  const [paymentOpen, setPaymentOpen] = useState(false);

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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <SectionHeader title="Quick Actions" linkText="More" />
          <View style={styles.quickActionsRow}>
            {[
              { label: 'Apply for a service', icon: 'add-circle-outline' as const },
              { label: 'Make Payments', icon: 'card-outline' as const },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() =>
                  item.label === 'Make Payments'
                    ? setPaymentOpen(true)
                    : router.push('/citizen/services' as never)
                }
                style={({ pressed }) => [styles.quickCard, { opacity: pressed ? 0.85 : 1 }]}
              >
                <View style={styles.quickIcon}>
                  <Ionicons name={item.icon} size={28} color={MUTED} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* My Applications */}
        <View style={styles.section}>
          <SectionHeader title="My Applications" linkText="More" />
          {[
            { title: 'Certificate of Occupancy Application', date: '12 Aug 2026', status: 'Under Review' as StatusKey, icon: 'time-outline' as const, iconColor: '#f59e0b' },
            { title: 'Land Allocation Requests', date: '12 Aug 2026', status: 'Rejected' as StatusKey, icon: 'alert-outline' as const, iconColor: '#ef4444' },
          ].map((app, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [styles.appCard, { opacity: pressed ? 0.9 : 1 }]}
              onPress={() => router.push('/citizen/applications' as never)}
            >
              <View style={styles.appCardRow}>
                <View style={styles.appCardLeft}>
                  <Text style={styles.appTitle}>{app.title}</Text>
                  <Text style={styles.appDate}>Submitted on {app.date}</Text>
                </View>
                <Ionicons name={app.icon} size={22} color={app.iconColor} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Drafts */}
        <View style={styles.section}>
          <SectionHeader title="Drafts" linkText="More" />
          <View style={styles.draftCard}>
            <View style={styles.draftTop}>
              <View>
                <Text style={styles.draftTitle}>Land Allocation Application</Text>
                <Text style={styles.draftDate}>Last Saved: Today 10:45AM</Text>
              </View>
              <Pressable style={styles.continueBtn}>
                <Text style={styles.continueBtnLabel}>Continue</Text>
              </Pressable>
            </View>
            <View style={styles.progressRow}>
              {[1, 2, 3, 4, 5].map((seg) => (
                <View
                  key={seg}
                  style={[styles.progressSeg, { backgroundColor: seg <= 3 ? PRIMARY : '#e5e7eb' }]}
                />
              ))}
            </View>
            <Text style={styles.progressPct}>65%</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <SectionHeader title="Recent Activity" linkText="View History" />
          <View style={styles.tableCard}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Service</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Date</Text>
              <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
            </View>
            {[
              { service: 'C of O Application', date: '13 Aug', status: 'Pending' as StatusKey },
              { service: 'Payment', date: '04 Aug', status: 'Confirmed' as StatusKey },
              { service: 'Survey Verification', date: '25 Jul', status: 'Completed' as StatusKey },
            ].map((row, i) => (
              <View key={i} style={[styles.tableRow, i < 2 && styles.tableBorder]}>
                <Text style={[styles.tableCell, styles.tableBodyText, { flex: 2 }]} numberOfLines={1}>{row.service}</Text>
                <Text style={[styles.tableCell, styles.tableBodyText]}>{row.date}</Text>
                <StatusChip status={row.status} />
              </View>
            ))}
          </View>
        </View>

        {/* Ministry Announcement */}
        <View style={styles.section}>
          <Text style={sh.title}>Ministry Announcement</Text>
          <Text style={[styles.announceSub, { marginBottom: 12 }]}>
            Stay informed with the latest updates from the ministry of Lands & Survey
          </Text>
          <View style={styles.announceCard}>
            <View style={styles.announceImgWrap}>
              <Image source={ministrySeal} style={styles.announceImg} resizeMode="contain" />
            </View>
            <Text style={styles.announceTitle}>Scheduled System Maintenance</Text>
            <Text style={styles.announceBody}>
              Our online service services will be temporarily unavailable on Saturday 16 August, from 10:00 PM to 2:00 AM
            </Text>
            <Text style={styles.announceTime}>2 hours ago</Text>
            <Pressable><Text style={[styles.announceLink, { color: PRIMARY }]}>Learn More</Text></Pressable>
            <View style={styles.dotRow}>
              {[0, 1, 2].map((d) => (
                <View
                  key={d}
                  style={{
                    width: 4,
                    height: d === 1 ? 16 : 8,
                    borderRadius: 2,
                    backgroundColor: d === 1 ? PRIMARY : '#d1d5db',
                    opacity: d === 1 ? 1 : 0.5,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Help & Support — landscape bg + #1BB53D green overlay per Figma */}
        <ImageBackground
          source={landscape}
          resizeMode="cover"
          style={styles.helpCard}
          imageStyle={{ borderRadius: 12 }}
        >
          {/* Green overlay */}
          <View style={styles.helpOverlay} />

          {/* Header block */}
          <View style={styles.helpHeader}>
            <Text style={styles.helpTitle}>Help and Support</Text>
            <Text style={styles.helpSub}>
              Need help with your application or a ministry service?
            </Text>
          </View>

          {/* Divider after header */}
          <View style={styles.helpDivider} />

          {/* Rows: FAQs, Contact Support, Submit a Complaint */}
          {[
            { title: 'FAQs',                sub: 'Find answers to common questions' },
            { title: 'Contact Support',      sub: 'Reach our support team for assistance' },
            { title: 'Submit a Complaint',   sub: 'Report an issue or share feedback' },
          ].map((item, i, arr) => (
            <React.Fragment key={item.title}>
              <Pressable
                style={({ pressed }) => [styles.helpRow, { opacity: pressed ? 0.7 : 1 }]}
              >
                <View style={styles.helpRowLeft}>
                  <Text style={styles.helpRowTitle}>{item.title}</Text>
                  <Text style={styles.helpRowSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
              </Pressable>
              {i < arr.length - 1 && <View style={styles.helpDivider} />}
            </React.Fragment>
          ))}
        </ImageBackground>

        <View style={{ height: 24 }} />
      </ScrollView>

      <RemitaPaymentModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        service="General Payment"
        amount={45000}
      />
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
  content: { paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 24 },
  quickActionsRow: { flexDirection: 'row', gap: 14 },
  quickCard: {
    flex: 1, backgroundColor: CARD, borderRadius: 14, padding: 16,
    alignItems: 'flex-start', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  quickIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, lineHeight: 20 },
  appCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  appCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appCardLeft: { flex: 1, marginRight: 12 },
  appTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
  appDate: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 4 },
  draftCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  draftTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  draftTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
  draftDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 3 },
  continueBtn: { backgroundColor: PRIMARY, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  continueBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 13 },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: 6 },
  progressSeg: { flex: 1, height: 5, borderRadius: 3 },
  progressPct: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },
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
  announceSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, lineHeight: 20 },
  announceCard: {
    backgroundColor: CARD, borderRadius: 14, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  announceImgWrap: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  announceImg: { width: 68, height: 68 },
  announceTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, textAlign: 'center', marginBottom: 8 },
  announceBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  announceTime: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginBottom: 8 },
  announceLink: { fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 14 },
  dotRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dot: { height: 4, borderRadius: 2 },
  // Help & Support card — Figma Frame 35
  helpCard: {
    borderRadius: 12,
    padding: 16,
    gap: 0,
    marginBottom: 8,
    overflow: 'hidden',
  },
  helpOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: HELP_GREEN,
    opacity: 0.88,
  },
  helpHeader: {
    gap: 2,
    marginBottom: 0,
  },
  helpTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
  helpSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 2,
  },
  helpDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: 0,
  },
  helpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 39,
    gap: 10,
  },
  helpRowLeft: {
    flex: 1,
  },
  helpRowTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
  },
  helpRowSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    opacity: 0.7,
  },
});
