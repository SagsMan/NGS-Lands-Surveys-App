import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#13bf43';
const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';

// Services (application) detail view — shown when staff taps a service task
const APP = {
  appInfo: { application: 'Certificate of Occupancy', id: 'MLS-2026-0038488', priority: 'High', dueDate: '14 Aug 2026' },
  applicant: { name: 'David Stone', phone: '+234 801 578 9011', email: 'davidstone@gmail.com' },
  details: {
    address: 'Victoria Island', plot: '234', district: 'Downtown',
    lga: 'Badagry', survey: '1234-5678-9012', landSize: '345 sq.ft',
  },
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
  value: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, textAlign: 'right', flex: 1, marginLeft: 12 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.wrap}>
      <Text style={s.title}>{title}</Text>
      <View style={s.card}>{children}</View>
    </View>
  );
}
const s = StyleSheet.create({
  wrap: { marginBottom: 16 },
  title: { fontFamily: 'Inter_500Medium', fontSize: 16, color: TEXT, marginBottom: 8 },
  card: { backgroundColor: CARD, borderRadius: 12, paddingHorizontal: 16, overflow: 'hidden' },
});

export default function StaffInspections() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.headerTitle}>Services</Text>
        <Pressable style={styles.bellBtn}><Ionicons name="notifications-outline" size={24} color={TEXT} /></Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Application Info */}
        <Section title="Application Information">
          <InfoRow label="Application" value={APP.appInfo.application} />
          <InfoRow label="Application ID" value={APP.appInfo.id} />
          <InfoRow label="Priority" value={APP.appInfo.priority} />
          <InfoRow label="Due Date" value={APP.appInfo.dueDate} />
        </Section>

        {/* Applicant Details */}
        <Section title="Applicant Details">
          <InfoRow label="Full name" value={APP.applicant.name} />
          <InfoRow label="Phone Number" value={APP.applicant.phone} />
          <InfoRow label="Email" value={APP.applicant.email} />
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

        {/* Property Information */}
        <Section title="Property Information">
          <InfoRow label="Property Address" value={APP.details.address} />
          <InfoRow label="Plot Number" value={APP.details.plot} />
          <InfoRow label="District" value={APP.details.district} />
          <InfoRow label="Local Government Area" value={APP.details.lga} />
          <InfoRow label="Survey Number" value={APP.details.survey} />
          <InfoRow label="Land Size" value={APP.details.landSize} />
          <Pressable style={styles.mapBtn}>
            <Ionicons name="map-outline" size={16} color={PRIMARY} />
            <Text style={[styles.mapBtnLabel, { color: PRIMARY }]}>View on Map</Text>
          </Pressable>
        </Section>

        {/* Submitted Documents */}
        <Section title="Submitted Documents">
          {APP.docs.map((doc) => (
            <View key={doc} style={styles.docRow}>
              <Text style={styles.docLabel}>{doc}</Text>
              <View style={styles.docFileRow}>
                <Pressable style={styles.docFile}>
                  <Ionicons name="document-outline" size={20} color={MUTED} />
                  <Text style={styles.docName}>Survey Plan.pdf</Text>
                </Pressable>
                <Pressable>
                  <Ionicons name="arrow-down-circle-outline" size={22} color={PRIMARY} />
                </Pressable>
              </View>
            </View>
          ))}
        </Section>

        {/* Start Inspection */}
        <Pressable style={[styles.primaryBtn, { backgroundColor: PRIMARY }]}>
          <Text style={styles.primaryBtnLabel}>Start Inspection</Text>
        </Pressable>

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
  content: { paddingHorizontal: 16, paddingTop: 16 },
  ctaRow: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  ctaBtn: {
    flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderRadius: 10, paddingVertical: 10,
  },
  ctaBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  mapBtn: { flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  mapBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 14 },
  docRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  docLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginBottom: 8 },
  docFileRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  docFile: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  docName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  primaryBtn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryBtnLabel: { color: '#fff', fontFamily: 'Inter_500Medium', fontSize: 16 },
});
