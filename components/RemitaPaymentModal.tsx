/**
 * REMITA Payment Modal
 * Simulated REMITA checkout — wire up real API calls when keys are available.
 */
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY   = '#13bf43';
const REMITA_BG = '#004c97';   // Remita blue used only for branding badge
const CARD      = '#ffffff';
const BG        = '#f7f7f7';
const TEXT      = '#0a0a0a';
const MUTED     = '#6b7280';
const BORDER    = '#e5e7eb';

/* ── Types ── */
type Channel = 'card' | 'transfer' | 'ussd' | 'debit';
type Step = 'select' | 'fill' | 'processing' | 'success';

export interface RemitaPaymentProps {
  visible: boolean;
  onClose: () => void;
  /** Application / invoice details */
  applicationId?: string;
  service?: string;
  amount?: number;   // in Naira
}

const CHANNELS: { id: Channel; label: string; sub: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'card',     label: 'Debit / Credit Card',  sub: 'Visa, Mastercard, Verve',         icon: 'card-outline' },
  { id: 'transfer', label: 'Bank Transfer',         sub: 'Pay via Internet Banking / App',  icon: 'swap-horizontal-outline' },
  { id: 'ussd',     label: 'USSD',                  sub: 'Quick pay from your phone dial pad', icon: 'phone-portrait-outline' },
  { id: 'debit',    label: 'Direct Debit',          sub: 'Debit your bank account directly', icon: 'business-outline' },
];

const USSD_CODES: Record<string, string> = {
  'Access Bank':   '*901*Amount*RRR#',
  'GTBank':        '*737*Amount*RRR#',
  'First Bank':    '*894*Amount*RRR#',
  'UBA':           '*919*Amount*RRR#',
  'Zenith Bank':   '*966*Amount*RRR#',
  'Sterling Bank': '*822*Amount*RRR#',
};

function RemitaBadge() {
  return (
    <View style={badge.wrap}>
      <View style={[badge.pill, { backgroundColor: REMITA_BG }]}>
        <Text style={badge.r}>R</Text>
        <Text style={badge.label}>emita</Text>
      </View>
      <Text style={badge.secured}>Secured Payment</Text>
    </View>
  );
}
const badge = StyleSheet.create({
  wrap: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  r: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: -0.5 },
  label: { color: '#fff', fontFamily: 'Inter_400Regular', fontSize: 14 },
  secured: { fontFamily: 'Inter_400Regular', fontSize: 11, color: MUTED },
});

/* ── Main Component ── */
export function RemitaPaymentModal({
  visible,
  onClose,
  applicationId = 'MDN-38403-292',
  service = 'Certificate of Occupancy',
  amount = 45000,
}: RemitaPaymentProps) {
  const insets = useSafeAreaInsets();

  const [step, setStep]       = useState<Step>('select');
  const [channel, setChannel] = useState<Channel | null>(null);

  // Card fields
  const [cardNum,  setCardNum]  = useState('');
  const [expiry,   setExpiry]   = useState('');
  const [cvv,      setCvv]      = useState('');
  const [pin,      setPin]      = useState('');

  // Bank transfer / debit
  const [bankName, setBankName] = useState('Access Bank');

  // Mock generated values
  const RRR = '270079623941';
  const transferAccount = '1234567890';
  const transferBank    = 'Remita Payment Solutions Ltd (Fidelity Bank)';
  const receiptRef      = `RCT-${Date.now().toString().slice(-8)}`;

  const amountFormatted = `₦${amount.toLocaleString('en-NG')}.00`;

  const reset = () => {
    setStep('select');
    setChannel(null);
    setCardNum(''); setExpiry(''); setCvv(''); setPin('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleProceed = () => {
    setStep('processing');
    // Simulate API call delay — replace with real Remita API call
    setTimeout(() => setStep('success'), 2200);
  };

  const formatCardNum = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  /* ── Step: Select channel ── */
  const SelectStep = (
    <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Invoice card */}
      <View style={s.invoiceCard}>
        <RemitaBadge />
        <View style={s.divider} />
        <View style={s.invoiceRow}>
          <Text style={s.invoiceLabel}>Service</Text>
          <Text style={s.invoiceVal}>{service}</Text>
        </View>
        <View style={s.invoiceRow}>
          <Text style={s.invoiceLabel}>Application ID</Text>
          <Text style={s.invoiceVal}>{applicationId}</Text>
        </View>
        <View style={s.invoiceRow}>
          <Text style={s.invoiceLabel}>RRR</Text>
          <Text style={[s.invoiceVal, { color: REMITA_BG, fontFamily: 'Inter_500Medium' }]}>{RRR}</Text>
        </View>
        <View style={[s.invoiceRow, { marginTop: 4 }]}>
          <Text style={s.invoiceLabel}>Amount</Text>
          <Text style={s.amountText}>{amountFormatted}</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Select Payment Channel</Text>

      {CHANNELS.map((ch) => (
        <Pressable
          key={ch.id}
          onPress={() => { setChannel(ch.id); setStep('fill'); }}
          style={({ pressed }) => [s.channelCard, { opacity: pressed ? 0.88 : 1 }]}
        >
          <View style={s.channelIcon}>
            <Ionicons name={ch.icon} size={22} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.channelLabel}>{ch.label}</Text>
            <Text style={s.channelSub}>{ch.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={BORDER} />
        </Pressable>
      ))}
    </ScrollView>
  );

  /* ── Step: Fill details ── */
  const FillStep = (
    <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Mini invoice summary */}
      <View style={s.miniSummary}>
        <RemitaBadge />
        <Text style={s.miniAmount}>{amountFormatted}</Text>
      </View>

      {channel === 'card' && (
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Card Number</Text>
          <TextInput
            style={s.fieldInput}
            value={cardNum}
            onChangeText={(v) => setCardNum(formatCardNum(v))}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={MUTED}
            keyboardType="number-pad"
            maxLength={19}
          />
          <View style={s.fieldRow2}>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>Expiry</Text>
              <TextInput
                style={s.fieldInput}
                value={expiry}
                onChangeText={(v) => setExpiry(formatExpiry(v))}
                placeholder="MM/YY"
                placeholderTextColor={MUTED}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>CVV</Text>
              <TextInput
                style={s.fieldInput}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                placeholderTextColor={MUTED}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
          <Text style={s.fieldLabel}>Card PIN</Text>
          <TextInput
            style={s.fieldInput}
            value={pin}
            onChangeText={setPin}
            placeholder="••••"
            placeholderTextColor={MUTED}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
        </View>
      )}

      {channel === 'transfer' && (
        <View style={s.infoBox}>
          <Text style={s.infoTitle}>Transfer Details</Text>
          <View style={s.infoRow}><Text style={s.infoLabel}>Bank</Text><Text style={s.infoVal}>{transferBank}</Text></View>
          <View style={s.infoRow}><Text style={s.infoLabel}>Account No.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[s.infoVal, { fontFamily: 'Inter_500Medium' }]}>{transferAccount}</Text>
              <Pressable><Ionicons name="copy-outline" size={16} color={PRIMARY} /></Pressable>
            </View>
          </View>
          <View style={s.infoRow}><Text style={s.infoLabel}>Amount</Text><Text style={[s.infoVal, { color: PRIMARY, fontFamily: 'Inter_500Medium' }]}>{amountFormatted}</Text></View>
          <View style={s.infoRow}><Text style={s.infoLabel}>Narration</Text><Text style={s.infoVal}>RRR {RRR}</Text></View>
          <Text style={s.infoNote}>
            After transfer, click "I Have Paid" below to confirm your payment.
          </Text>
        </View>
      )}

      {channel === 'ussd' && (
        <View style={s.infoBox}>
          <Text style={s.infoTitle}>USSD Payment</Text>
          <Text style={[s.infoNote, { marginBottom: 12 }]}>
            Dial the code for your bank, replacing "Amount" with {amountFormatted} and "RRR" with {RRR}.
          </Text>
          {Object.entries(USSD_CODES).map(([bank, code]) => (
            <View key={bank} style={s.ussdRow}>
              <Text style={s.ussdBank}>{bank}</Text>
              <View style={s.ussdCodePill}>
                <Text style={s.ussdCode}>{code}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {channel === 'debit' && (
        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Bank Name</Text>
          <View style={s.pickerRow}>
            {['Access Bank', 'GTBank', 'First Bank', 'UBA', 'Zenith Bank'].map((b) => (
              <Pressable
                key={b}
                onPress={() => setBankName(b)}
                style={[s.bankChip, bankName === b && { backgroundColor: PRIMARY, borderColor: PRIMARY }]}
              >
                <Text style={[s.bankChipLabel, bankName === b && { color: '#fff' }]}>{b}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.fieldLabel}>Account Number</Text>
          <TextInput
            style={s.fieldInput}
            placeholder="Enter 10-digit account number"
            placeholderTextColor={MUTED}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>
      )}

      <Pressable
        onPress={handleProceed}
        style={({ pressed }) => [s.payBtn, { opacity: pressed ? 0.88 : 1 }]}
      >
        <Ionicons name="lock-closed" size={16} color="#fff" />
        <Text style={s.payBtnLabel}>
          {channel === 'transfer' ? 'I Have Paid' : `Pay ${amountFormatted}`}
        </Text>
      </Pressable>

      <Text style={s.secureNote}>
        <Ionicons name="shield-checkmark-outline" size={12} color={MUTED} /> Secured by Remita · 256-bit SSL encryption
      </Text>
    </ScrollView>
  );

  /* ── Step: Processing ── */
  const ProcessingStep = (
    <View style={s.centreStep}>
      <ActivityIndicator size="large" color={PRIMARY} />
      <Text style={s.processingTitle}>Processing Payment…</Text>
      <Text style={s.processingBody}>Please wait, do not close this screen.</Text>
    </View>
  );

  /* ── Step: Success ── */
  const SuccessStep = (
    <View style={s.centreStep}>
      <View style={s.successCircle}>
        <Ionicons name="checkmark" size={40} color="#fff" />
      </View>
      <Text style={s.successTitle}>Payment Successful!</Text>
      <Text style={s.successBody}>Your payment of {amountFormatted} for {service} has been received.</Text>

      <View style={s.receiptCard}>
        {[
          ['Application ID', applicationId],
          ['RRR',            RRR],
          ['Amount Paid',    amountFormatted],
          ['Receipt Ref',    receiptRef],
          ['Date',           new Date().toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
          ['Status',         'Confirmed'],
        ].map(([label, val]) => (
          <View key={label} style={s.receiptRow}>
            <Text style={s.receiptLabel}>{label}</Text>
            <Text style={[s.receiptVal, label === 'Status' && { color: PRIMARY }]}>{val}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={handleClose} style={({ pressed }) => [s.doneBtn, { opacity: pressed ? 0.88 : 1 }]}>
        <Text style={s.doneBtnLabel}>Done</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={step === 'processing' ? undefined : handleClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[s.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0, paddingBottom: insets.bottom }]}>
          {/* Header */}
          {step !== 'processing' && step !== 'success' && (
            <View style={s.header}>
              {step === 'fill' ? (
                <Pressable onPress={() => setStep('select')} style={s.backBtn} hitSlop={8}>
                  <Ionicons name="chevron-back" size={22} color={TEXT} />
                </Pressable>
              ) : (
                <View style={{ width: 36 }} />
              )}
              <Text style={s.headerTitle}>
                {step === 'select' ? 'Make Payment' : CHANNELS.find((c) => c.id === channel)?.label ?? 'Payment'}
              </Text>
              <Pressable onPress={handleClose} style={s.closeBtn} hitSlop={8}>
                <Ionicons name="close" size={20} color={TEXT} />
              </Pressable>
            </View>
          )}

          {step === 'select'     && SelectStep}
          {step === 'fill'       && FillStep}
          {step === 'processing' && ProcessingStep}
          {step === 'success'    && SuccessStep}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ── Styles ── */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Inter_500Medium', fontSize: 17, color: TEXT },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16, gap: 12 },

  /* Invoice */
  invoiceCard: { backgroundColor: CARD, borderRadius: 14, padding: 16, gap: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  invoiceLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, flexShrink: 0 },
  invoiceVal: { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT, textAlign: 'right', flex: 1 },
  amountText: { fontFamily: 'Inter_700Bold', fontSize: 20, color: TEXT },

  sectionTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, marginTop: 4 },

  /* Channels */
  channelCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  channelIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  channelLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginBottom: 2 },
  channelSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },

  /* Mini summary */
  miniSummary: { backgroundColor: CARD, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  miniAmount: { fontFamily: 'Inter_700Bold', fontSize: 18, color: TEXT },

  /* Fields */
  fieldGroup: { backgroundColor: CARD, borderRadius: 14, padding: 16, gap: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  fieldRow2: { flexDirection: 'row', gap: 12 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: TEXT, marginBottom: 4 },
  fieldInput: {
    borderWidth: 1, borderColor: BORDER, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT,
    backgroundColor: '#fafafa',
  },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  bankChip: { borderWidth: 1, borderColor: BORDER, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  bankChipLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT },

  /* Info boxes */
  infoBox: { backgroundColor: CARD, borderRadius: 14, padding: 16, gap: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  infoTitle: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT, marginBottom: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  infoLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  infoVal: { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT, textAlign: 'right', flex: 1, marginLeft: 12 },
  infoNote: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, lineHeight: 18, marginTop: 8 },
  ussdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  ussdBank: { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT },
  ussdCodePill: { backgroundColor: '#f0fdf4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  ussdCode: { fontFamily: 'Inter_500Medium', fontSize: 12, color: PRIMARY },

  /* Pay button */
  payBtn: {
    backgroundColor: PRIMARY, borderRadius: 26, height: 52,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginTop: 8,
  },
  payBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#fff' },
  secureNote: { fontFamily: 'Inter_400Regular', fontSize: 11, color: MUTED, textAlign: 'center', marginTop: 4 },

  /* Processing */
  centreStep: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  processingTitle: { fontFamily: 'Inter_500Medium', fontSize: 18, color: TEXT, marginTop: 16 },
  processingBody: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED, textAlign: 'center' },

  /* Success */
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontFamily: 'Inter_500Medium', fontSize: 22, color: TEXT },
  successBody: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED, textAlign: 'center', lineHeight: 20 },
  receiptCard: { backgroundColor: CARD, borderRadius: 14, padding: 16, width: '100%', marginTop: 12, gap: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  receiptLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  receiptVal: { fontFamily: 'Inter_500Medium', fontSize: 13, color: TEXT },
  doneBtn: { backgroundColor: PRIMARY, borderRadius: 26, height: 52, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 16 },
  doneBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#fff' },
});
