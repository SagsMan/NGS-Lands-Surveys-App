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
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#13bf43';
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';
const DANGER = '#ef4444';

const APPS = [
  { id: '1', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', status: 'Under Review' },
  { id: '2', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', status: 'Under Review' },
  { id: '3', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', status: 'Under Review' },
  { id: '4', title: 'Certificate of Occupancy', applicant: 'David Stone', appId: 'MLS-2026-001256', priority: 'High Priority', status: 'Under Review' },
];

type ChecklistItem = { label: string; approved: boolean | null };
const CHECKLIST: ChecklistItem[] = [
  { label: 'Application Identity verified', approved: true },
  { label: 'Documents verified',            approved: null },
  { label: 'Payment confirmed',             approved: null },
  { label: 'Site inspection completed',     approved: null },
  { label: 'Beacon confirmed',              approved: null },
];

const APP_DETAIL = {
  appInfo: { application: 'Certificate of Occupancy', id: 'MLS-2026-0038488', priority: 'High', dueDate: '14 Aug 2026' },
  applicant: { name: 'David Stone', phone: '+234 801 578 9011', email: 'davidstone@gmail.com' },
  property: { address: 'Victoria Island', plot: '234', district: 'Downtown', lga: 'Badagry', survey: '1234-5678-9012', size: '345 sq.ft' },
  docs: ['National ID', 'Passport Photograph', 'Survey Plan', 'Proof of Ownership'],
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={ir.row}>
      <Text style={ir.label}>{label}</Text>
      <Text style={ir.value}>{value}</Text>
    </View>
  );
}
const ir = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED },
  value: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, flex: 1, textAlign: 'right', marginLeft: 12 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sec.wrap}>
      <Text style={sec.title}>{title}</Text>
      <View style={sec.card}>{children}</View>
    </View>
  );
}
const sec = StyleSheet.create({
  wrap: { marginBottom: 16 },
  title: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT, marginBottom: 8 },
  card: { backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 16, overflow: 'hidden' },
});

export default function StaffApplications() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<typeof APPS[0] | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST);
  const [observation, setObservation] = useState('');

  const toggle = (index: number, value: boolean) => {
    const next = [...checklist];
    next[index] = { ...next[index], approved: next[index].approved === value ? null : value };
    setChecklist(next);
  };

  if (selected) {
    return (
      <View style={[styles.screen, { backgroundColor: BG }]}>
        <StatusBar style="dark" />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => setSelected(null)} style={styles.backRow}>
            <Ionicons name="chevron-back" size={22} color={TEXT} />
            <Text style={styles.headerTitle}>My Applications</Text>
          </Pressable>
          <Pressable style={styles.bellBtn}><Ionicons name="notifications-outline" size={24} color={TEXT} /></Pressable>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
          <Section title="Application Information">
            <InfoRow label="Application" value={APP_DETAIL.appInfo.application} />
            <InfoRow label="Application ID" value={APP_DETAIL.appInfo.id} />
            <InfoRow label="Priority" value={APP_DETAIL.appInfo.priority} />
            <InfoRow label="Due Date" value={APP_DETAIL.appInfo.dueDate} />
          </Section>

          <Section title="Applicant Information">
            <InfoRow label="Full name" value={APP_DETAIL.applicant.name} />
            <InfoRow label="Phone Number" value={APP_DETAIL.applicant.phone} />
            <InfoRow label="Email" value={APP_DETAIL.applicant.email} />
            <View style={styles.ctaRow}>
              <Pressable style={[styles.ctaBtn, { borderColor: PRIMARY }]}>
                <Ionicons name="call-outline" size={16} color={PRIMARY} />
                <Text style={[styles.ctaBtnLabel, { color: PRIMARY }]}>Call</Text>
              </Pressable>
              <Pressable style={[styles.ctaBtn, { borderColor: PRIMARY }]}>
                <Ionicons name="mail-outline" size={16} color={PRIMARY} />
                <Text style={[styles.ctaBtnLabel, { color: PRIMARY }]}>Email</Text>
              </Pressable>
            </View>
          </Section>

          <Section title="Property Information">
            <InfoRow label="Property Address" value={APP_DETAIL.property.address} />
            <InfoRow label="Plot Number" value={APP_DETAIL.property.plot} />
            <InfoRow label="District" value={APP_DETAIL.property.district} />
            <InfoRow label="Local Government Area" value={APP_DETAIL.property.lga} />
            <InfoRow label="Survey Number" value={APP_DETAIL.property.survey} />
            <InfoRow label="Land Size" value={APP_DETAIL.property.size} />
            <Pressable style={styles.mapBtn}>
              <Ionicons name="map-outline" size={16} color={PRIMARY} />
              <Text style={[styles.mapBtnLabel, { color: PRIMARY }]}>View on Map</Text>
            </Pressable>
          </Section>

          <Section title="Submitted Documents">
            {APP_DETAIL.docs.map((doc) => (
              <View key={doc} style={styles.docRow}>
                <Text style={styles.docLabel}>{doc}</Text>
                <View style={styles.docFileRow}>
                  <View style={styles.docFile}>
                    <Ionicons name="document-outline" size={20} color={MUTED} />
                    <Text style={styles.docName}>Survey Plan.pdf</Text>
                  </View>
                  <Pressable><Ionicons name="arrow-down-circle-outline" size={22} color={PRIMARY} /></Pressable>
                </View>
              </View>
            ))}
          </Section>

          {/* Verification Checklist */}
          <View style={styles.checklistWrap}>
            <Text style={sec.title}>Verification Checklist</Text>
            <View style={[sec.card, { paddingHorizontal: 0 }]}>
              {checklist.map((item, i) => (
                <View key={item.label} style={[styles.checkRow, i < checklist.length - 1 && styles.checkBorder]}>
                  <Text style={styles.checkLabel}>{item.label}</Text>
                  <View style={styles.checkBtns}>
                    <Pressable onPress={() => toggle(i, false)} style={[styles.checkBtn, item.approved === false && { backgroundColor: DANGER + '20' }]}>
                      <Ionicons name="close" size={16} color={item.approved === false ? DANGER : '#d1d5db'} />
                    </Pressable>
                    <Pressable onPress={() => toggle(i, true)} style={[styles.checkBtn, item.approved === true && { backgroundColor: PRIMARY + '20' }]}>
                      <Ionicons name="checkmark" size={16} color={item.approved === true ? PRIMARY : '#d1d5db'} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Approve Button */}
          <Pressable style={[styles.approveBtn, { backgroundColor: PRIMARY }]}>
            <Text style={styles.approveBtnLabel}>Approve Application</Text>
          </Pressable>

          {/* Observation */}
          <View style={styles.obsWrap}>
            <Text style={sec.title}>Observation</Text>
            <TextInput
              style={[styles.obsInput, { backgroundColor: CARD }]}
              placeholder="Enter your observations and remarks"
              placeholderTextColor={MUTED}
              multiline
              numberOfLines={4}
              value={observation}
              onChangeText={setObservation}
              textAlignVertical="top"
            />
          </View>

          {/* Submit buttons */}
          <Pressable style={[styles.submitBtn, { backgroundColor: PRIMARY }]}>
            <Text style={styles.submitBtnLabel}>Submit</Text>
          </Pressable>

          <View style={styles.attachRow}>
            <Text style={styles.attachTitle}>Attach File</Text>
            <Pressable style={styles.attachBox}>
              <Ionicons name="cloud-upload-outline" size={28} color={MUTED} />
              <Text style={styles.attachLabel}>Upload file</Text>
            </Pressable>
          </View>

          <Pressable style={[styles.inspectBtn, { borderColor: PRIMARY }]}>
            <Text style={[styles.inspectBtnLabel, { color: PRIMARY }]}>Submit Inspection</Text>
          </Pressable>

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    );
  }

  const filtered = APPS.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.applicant.toLowerCase().includes(query.toLowerCase()) ||
    a.appId.includes(query)
  );

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <Pressable style={styles.bellBtn}><Ionicons name="notifications-outline" size={24} color={TEXT} /></Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.map((app) => (
          <Pressable
            key={app.id}
            onPress={() => setSelected(app)}
            style={({ pressed }) => [styles.appCard, { opacity: pressed ? 0.88 : 1 }]}
          >
            <View style={styles.appCardRow}>
              <Text style={styles.appTitle}>{app.title}</Text>
              <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
                <Text style={[styles.badgeLabel, { color: '#92400e' }]}>{app.status}</Text>
              </View>
            </View>
            <Text style={styles.appMeta}>{app.applicant}</Text>
            <Text style={styles.appMeta}>{app.appId}</Text>
            <Text style={styles.appMeta}>{app.priority}</Text>
          </Pressable>
        ))}
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
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 20, color: TEXT },
  bellBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12 },
  appCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  appCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  appTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, flex: 1, marginRight: 10 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0 },
  badgeLabel: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  appMeta: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 2 },
  detailContent: { paddingHorizontal: 16, paddingTop: 16 },
  ctaRow: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  ctaBtn: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, paddingVertical: 10 },
  ctaBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  mapBtn: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  mapBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  docRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  docLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginBottom: 8 },
  docFileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docFile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  checklistWrap: { marginBottom: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  checkBorder: { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  checkLabel: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, marginRight: 12 },
  checkBtns: { flexDirection: 'row', gap: 8 },
  checkBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  approveBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  approveBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 16 },
  obsWrap: { marginBottom: 16 },
  obsInput: { borderRadius: 12, padding: 14, minHeight: 120, fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT },
  submitBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  submitBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 16 },
  attachRow: { marginBottom: 16 },
  attachTitle: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT, marginBottom: 8 },
  attachBox: {
    backgroundColor: CARD, borderRadius: 12, padding: 24, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#e5e7eb', borderStyle: 'dashed',
  },
  attachLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED },
  inspectBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, marginBottom: 8 },
  inspectBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 16 },
});
