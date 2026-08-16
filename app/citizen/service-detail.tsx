import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RemitaPaymentModal } from '@/components/RemitaPaymentModal';

const PRIMARY  = '#13bf43';
const BG       = '#f7f7f7';
const CARD     = '#ffffff';
const TEXT     = '#0a0a0a';
const MUTED    = '#6b7280';
const BORDER   = '#e5e7eb';

/* ─── Service catalogue ────────────────────────────────────────────── */
type ServiceDef = {
  label: string;
  icon: string;
  description: string;
  fee: number;
  duration: string;
  documents: string[];
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
};

const SERVICES: Record<string, ServiceDef> = {
  '1': {
    label: 'Certificate of Occupancy',
    icon: 'document-outline',
    description:
      'A Certificate of Occupancy (C-of-O) is the primary title document issued by the Niger State Government confirming your legal right to occupy and use a piece of land.',
    fee: 75000,
    duration: '30 – 45 working days',
    documents: [
      'Completed application form',
      'Survey plan (approved)',
      'Tax clearance certificate (3 years)',
      'Passport photographs (4)',
      'National ID or International Passport',
      'Purchase receipt or deed of assignment',
    ],
    fields: [
      { key: 'plotNo',   label: 'Plot Number',        placeholder: 'e.g. Plot 14B' },
      { key: 'address',  label: 'Property Address',   placeholder: 'Full address of the land' },
      { key: 'lga',      label: 'Local Government Area', placeholder: 'e.g. Chanchaga' },
      { key: 'district', label: 'District / Area',    placeholder: 'e.g. Tunga' },
      { key: 'size',     label: 'Land Size (sqm)',    placeholder: 'e.g. 600' },
      { key: 'purpose',  label: 'Proposed Use',       placeholder: 'Residential / Commercial / Agricultural' },
      { key: 'notes',    label: 'Additional Notes',   placeholder: 'Any other relevant information', multiline: true },
    ],
  },
  '2': {
    label: 'Land Allocation',
    icon: 'map-outline',
    description:
      'Apply for allocation of government land for residential, commercial, or agricultural use within Niger State.',
    fee: 50000,
    duration: '20 – 30 working days',
    documents: [
      'Completed allocation form',
      'National ID or Passport',
      'Tax clearance certificate',
      'Passport photographs (4)',
      'Letter of intent stating land use',
    ],
    fields: [
      { key: 'preferredArea', label: 'Preferred Area / District', placeholder: 'e.g. Minna, Bosso' },
      { key: 'lga',           label: 'Local Government Area',     placeholder: 'e.g. Bosso' },
      { key: 'landUse',       label: 'Intended Use',              placeholder: 'Residential / Commercial / Agricultural' },
      { key: 'sizeNeeded',    label: 'Approximate Size Needed (sqm)', placeholder: 'e.g. 500' },
      { key: 'notes',         label: 'Additional Notes',          placeholder: 'Any special requirements', multiline: true },
    ],
  },
  '3': {
    label: 'Right of Occupancy',
    icon: 'key-outline',
    description:
      'A Statutory Right of Occupancy (R-of-O) grants you legal possession of land for a specified period under the Land Use Act.',
    fee: 60000,
    duration: '25 – 40 working days',
    documents: [
      'Completed R-of-O application form',
      'Approved survey plan',
      'Tax clearance certificate',
      'National ID or Passport',
      'Proof of ownership (deed, receipt, etc.)',
    ],
    fields: [
      { key: 'plotNo',   label: 'Plot Number',         placeholder: 'e.g. Plot 5, Block A' },
      { key: 'address',  label: 'Property Address',    placeholder: 'Full property address' },
      { key: 'lga',      label: 'Local Government Area', placeholder: 'e.g. Chanchaga' },
      { key: 'size',     label: 'Land Size (sqm)',     placeholder: 'e.g. 450' },
      { key: 'tenure',   label: 'Requested Tenure (years)', placeholder: 'e.g. 99' },
      { key: 'notes',    label: 'Notes',               placeholder: 'Any other information', multiline: true },
    ],
  },
  '4': {
    label: 'Title Transfer',
    icon: 'swap-horizontal-outline',
    description:
      'Transfer an existing land title from the current holder to a new owner following a sale, gift, or inheritance.',
    fee: 55000,
    duration: '15 – 25 working days',
    documents: [
      'Original title document (C-of-O or R-of-O)',
      'Deed of assignment (signed by both parties)',
      'Survey plan',
      'Tax clearance certificates (buyer and seller)',
      'Passport photographs of both parties',
      'National IDs of both parties',
    ],
    fields: [
      { key: 'titleNo',        label: 'Existing Title Number',     placeholder: 'e.g. NS/COO/12345' },
      { key: 'sellerName',     label: 'Current Owner (Seller)',    placeholder: 'Full legal name' },
      { key: 'buyerName',      label: 'New Owner (Buyer)',         placeholder: 'Full legal name' },
      { key: 'propertyAddr',   label: 'Property Address',         placeholder: 'Full address' },
      { key: 'saleAmount',     label: 'Agreed Sale Amount (₦)',   placeholder: 'e.g. 5000000' },
      { key: 'notes',          label: 'Additional Notes',         placeholder: 'Any other details', multiline: true },
    ],
  },
  '5': {
    label: 'Mortgage Registration',
    icon: 'home-outline',
    description:
      'Register a mortgage or charge on your land title as security for a loan with a bank or financial institution.',
    fee: 40000,
    duration: '10 – 20 working days',
    documents: [
      'Original title document',
      'Mortgage deed / loan agreement',
      'Letter from the lending institution',
      'Tax clearance certificate',
      'Passport photographs (4)',
    ],
    fields: [
      { key: 'titleNo',   label: 'Title Number',         placeholder: 'e.g. NS/COO/12345' },
      { key: 'lender',    label: 'Lending Institution',  placeholder: 'Bank or institution name' },
      { key: 'loanAmt',   label: 'Loan Amount (₦)',      placeholder: 'e.g. 10000000' },
      { key: 'duration',  label: 'Mortgage Duration',    placeholder: 'e.g. 10 years' },
      { key: 'address',   label: 'Property Address',     placeholder: 'Full address' },
      { key: 'notes',     label: 'Additional Notes',     placeholder: 'Any other details', multiline: true },
    ],
  },
  '6': {
    label: 'Land Ownership Verification',
    icon: 'checkmark-circle-outline',
    description:
      'Verify the authenticity and current ownership status of any land title within Niger State before a transaction.',
    fee: 15000,
    duration: '3 – 7 working days',
    documents: [
      'Copy of title document to verify',
      'National ID or Passport',
      'Letter of purpose (for third-party verification)',
    ],
    fields: [
      { key: 'titleNo',   label: 'Title Number to Verify', placeholder: 'e.g. NS/COO/12345' },
      { key: 'ownerName', label: 'Claimed Owner Name',     placeholder: 'Full name as on the title' },
      { key: 'address',   label: 'Property Address',       placeholder: 'Address on the title document' },
      { key: 'purpose',   label: 'Purpose of Verification', placeholder: 'e.g. Before purchase, legal proceedings' },
    ],
  },
  '7': {
    label: 'Survey Plan Submission',
    icon: 'grid-outline',
    description:
      'Submit a new or amended survey plan prepared by a licensed surveyor for ministry review and endorsement.',
    fee: 25000,
    duration: '7 – 14 working days',
    documents: [
      'Original survey plan (licensed surveyor stamp)',
      'Surveyor\'s licence copy',
      'Beacon numbers and coordinates',
      'National ID or Passport',
    ],
    fields: [
      { key: 'surveyorName',   label: 'Licensed Surveyor Name',   placeholder: 'Full name' },
      { key: 'surveyorLicNo',  label: 'Surveyor Licence Number',  placeholder: 'e.g. NIS/12345' },
      { key: 'plotAddress',    label: 'Plot Location / Address',  placeholder: 'Full address' },
      { key: 'lga',            label: 'Local Government Area',    placeholder: 'e.g. Minna' },
      { key: 'beaconNos',      label: 'Beacon Numbers',          placeholder: 'e.g. MB 1234, MB 1235 …' },
      { key: 'notes',          label: 'Notes',                   placeholder: 'Any additional information', multiline: true },
    ],
  },
  '8': {
    label: 'Land Ownership Transfer',
    icon: 'git-merge-outline',
    description:
      'Formally record the transfer of land ownership through inheritance, court order, or family settlement.',
    fee: 45000,
    duration: '20 – 35 working days',
    documents: [
      'Existing title document',
      'Death certificate (for inheritance)',
      'Court order or probate letter',
      'Letter of administration or will',
      'National IDs of all parties',
      'Passport photographs of new owner (4)',
    ],
    fields: [
      { key: 'titleNo',      label: 'Existing Title Number',   placeholder: 'e.g. NS/COO/12345' },
      { key: 'prevOwner',    label: 'Previous Owner',          placeholder: 'Full legal name' },
      { key: 'newOwner',     label: 'New Owner',               placeholder: 'Full legal name' },
      { key: 'basis',        label: 'Basis of Transfer',       placeholder: 'Inheritance / Court order / Family settlement' },
      { key: 'address',      label: 'Property Address',        placeholder: 'Full address' },
      { key: 'notes',        label: 'Additional Notes',        placeholder: 'Any relevant details', multiline: true },
    ],
  },
  '9': {
    label: 'Verify Survey Plans',
    icon: 'eye-outline',
    description:
      'Check the validity and registration status of an existing survey plan in the Ministry\'s records.',
    fee: 10000,
    duration: '2 – 5 working days',
    documents: [
      'Copy of the survey plan to verify',
      'National ID or Passport',
    ],
    fields: [
      { key: 'planRef',     label: 'Survey Plan Reference No.', placeholder: 'As shown on the plan' },
      { key: 'surveyorName',label: 'Surveyor\'s Name',          placeholder: 'Name on the plan' },
      { key: 'plotAddress', label: 'Property Location',         placeholder: 'Address or description of the land' },
      { key: 'purpose',     label: 'Reason for Verification',   placeholder: 'e.g. Property purchase, legal proceedings' },
    ],
  },
  '10': {
    label: 'Book an Appointment',
    icon: 'calendar-outline',
    description:
      'Schedule an in-person appointment with a Ministry officer for consultation, document submission, or inspection.',
    fee: 0,
    duration: 'Same day confirmation',
    documents: [
      'National ID or Passport',
      'Relevant documents for your specific matter',
    ],
    fields: [
      { key: 'purpose',      label: 'Purpose of Appointment',   placeholder: 'e.g. C-of-O consultation, survey review' },
      { key: 'preferredDate',label: 'Preferred Date',           placeholder: 'e.g. 25 Aug 2026' },
      { key: 'preferredTime',label: 'Preferred Time',           placeholder: 'e.g. 10:00 AM' },
      { key: 'officeUnit',   label: 'Office / Unit',            placeholder: 'e.g. Titles Department, Survey Division' },
      { key: 'notes',        label: 'Additional Notes',         placeholder: 'Anything the officer should know in advance', multiline: true },
    ],
  },
  '12': {
    label: 'Download Receipts',
    icon: 'download-outline',
    description:
      'Retrieve and download official payment receipts for any completed transaction on your account.',
    fee: 0,
    duration: 'Instant',
    documents: [],
    fields: [
      { key: 'rrr',         label: 'Remita Retrieval Reference (RRR)', placeholder: 'e.g. 280007863291' },
      { key: 'paymentDate', label: 'Payment Date (approx.)',           placeholder: 'e.g. 10 Aug 2026' },
      { key: 'service',     label: 'Service Paid For',                 placeholder: 'e.g. Certificate of Occupancy' },
    ],
  },
};

/* ─── Field component ──────────────────────────────────────────────── */
function Field({
  label, placeholder, value, onChangeText, multiline = false,
}: { label: string; placeholder: string; value: string; onChangeText: (t: string) => void; multiline?: boolean }) {
  return (
    <View style={f.wrap}>
      <Text style={f.label}>{label}</Text>
      <TextInput
        style={[f.input, multiline && f.multiline]}
        placeholder={placeholder}
        placeholderTextColor={MUTED}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}
const f = StyleSheet.create({
  wrap:      { marginBottom: 16 },
  label:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: TEXT, marginBottom: 6 },
  input:     {
    backgroundColor: CARD, borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT, minHeight: 48,
  },
  multiline: { minHeight: 88, paddingTop: 12 },
});

/* ─── Main screen ──────────────────────────────────────────────────── */
export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const svc = SERVICES[serviceId ?? ''];
  const [form, setForm] = useState<Record<string, string>>({});
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!svc) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: TEXT }}>Service not found.</Text>
      </View>
    );
  }

  const set = (key: string) => (val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    if (svc.fee > 0) {
      setPaymentOpen(true);
    } else {
      Alert.alert('Application Submitted', 'Your request has been received. You will be contacted by the Ministry shortly.', [
        { text: 'OK', onPress: () => { setSubmitted(true); router.back(); } },
      ]);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={TEXT} />
        </Pressable>
        <View style={styles.homePill}>
          <Text style={styles.headerTitle} numberOfLines={1}>{svc.label}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <Ionicons name={svc.icon as never} size={32} color={PRIMARY} />
          </View>
          <Text style={styles.heroDesc}>{svc.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={14} color={MUTED} />
              <Text style={styles.metaText}>{svc.duration}</Text>
            </View>
            {svc.fee > 0 && (
              <View style={[styles.metaChip, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="cash-outline" size={14} color={PRIMARY} />
                <Text style={[styles.metaText, { color: PRIMARY }]}>
                  ₦{svc.fee.toLocaleString()} fee
                </Text>
              </View>
            )}
            {svc.fee === 0 && (
              <View style={[styles.metaChip, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="checkmark-circle-outline" size={14} color={PRIMARY} />
                <Text style={[styles.metaText, { color: PRIMARY }]}>Free</Text>
              </View>
            )}
          </View>
        </View>

        {/* Required documents */}
        {svc.documents.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Documents</Text>
            <View style={styles.card}>
              {svc.documents.map((doc, i) => (
                <View key={i} style={[styles.docRow, i < svc.documents.length - 1 && styles.docBorder]}>
                  <View style={styles.docDot} />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Application form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Details</Text>
          <View style={styles.card}>
            {svc.fields.map(field => (
              <Field
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={form[field.key] ?? ''}
                onChangeText={set(field.key)}
                multiline={field.multiline}
              />
            ))}
          </View>
        </View>

        {/* Notice */}
        <View style={styles.noticeRow}>
          <Ionicons name="information-circle-outline" size={18} color={MUTED} />
          <Text style={styles.noticeText}>
            Ensure all information is accurate before submitting. Incorrect details may delay processing.
          </Text>
        </View>

        {/* Submit */}
        <Pressable
          style={({ pressed }) => [styles.submitBtn, { opacity: pressed ? 0.85 : 1 }]}
          onPress={handleSubmit}
        >
          <Ionicons
            name={svc.fee > 0 ? 'card-outline' : 'send-outline'}
            size={18} color="#fff" style={{ marginRight: 8 }}
          />
          <Text style={styles.submitLabel}>
            {svc.fee > 0 ? `Pay ₦${svc.fee.toLocaleString()} & Submit` : 'Submit Application'}
          </Text>
        </Pressable>
      </ScrollView>

      <RemitaPaymentModal
        visible={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        service={svc.label}
        amount={svc.fee}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10,
    backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  homePill:    { flex: 1, backgroundColor: PRIMARY, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 7, alignItems: 'center', marginHorizontal: 8 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#fff' },

  scroll:  { flex: 1 },
  content: { padding: 20, gap: 0 },

  heroCard: {
    backgroundColor: CARD, borderRadius: 16, padding: 18, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  heroIconWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0fdf4',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  heroDesc: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED, lineHeight: 22, marginBottom: 16 },
  metaRow:  { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#f9fafb', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },

  section:      { marginBottom: 20 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: TEXT, marginBottom: 10 },
  card:         {
    backgroundColor: CARD, borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },

  docRow:   { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, gap: 10 },
  docBorder:{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  docDot:   { width: 7, height: 7, borderRadius: 4, backgroundColor: PRIMARY, marginTop: 6, flexShrink: 0 },
  docText:  { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, lineHeight: 21 },

  noticeRow: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#fffbeb', borderRadius: 12, padding: 14, marginBottom: 20,
  },
  noticeText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: '#92400e', lineHeight: 19 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PRIMARY, borderRadius: 27, height: 54,
    shadowColor: PRIMARY, shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  submitLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
});
