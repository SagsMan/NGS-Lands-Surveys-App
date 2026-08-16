import React, { useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AvatarPicker } from '@/components/AvatarPicker';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const BG    = '#f7f7f7';
const CARD  = '#ffffff';
const TEXT  = '#0a0a0a';
const MUTED = '#6b7280';
const PRIMARY = '#13bf43';
const DANGER  = '#ef4444';
const BORDER  = '#f3f4f6';

/* ────────── menu definition ────────── */
const MENU = [
  { id: 'personal',       icon: 'person-outline'               as const, label: 'Personal Information' },
  { id: 'password',       icon: 'lock-closed-outline'          as const, label: 'Change Password' },
  { id: 'notifications',  icon: 'notifications-outline'        as const, label: 'Notifications' },
  { id: 'privacy',        icon: 'shield-outline'               as const, label: 'Privacy & Security' },
  { id: 'help',           icon: 'help-circle-outline'          as const, label: 'Help & Support' },
  { id: 'terms',          icon: 'document-text-outline'        as const, label: 'Terms & Conditions' },
  { id: 'about',          icon: 'information-circle-outline'   as const, label: 'About' },
];

/* ────────── small reusable parts ────────── */
function SectionHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={sh.row}>
      <Pressable onPress={onBack} style={sh.backBtn} hitSlop={10}>
        <Ionicons name="chevron-back" size={22} color={TEXT} />
      </Pressable>
      <Text style={sh.title}>{title}</Text>
    </View>
  );
}
const sh = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  backBtn:{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  title:  { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: TEXT },
});

function FieldRow({ label, value, editable = true, keyboardType = 'default' as any, secureTextEntry = false, right }: {
  label: string; value: string; editable?: boolean; keyboardType?: any; secureTextEntry?: boolean; right?: React.ReactNode;
}) {
  return (
    <View style={fr.wrap}>
      <Text style={fr.label}>{label}</Text>
      <View style={fr.inputWrap}>
        <TextInput
          style={[fr.input, !editable && fr.disabled]}
          defaultValue={value}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={MUTED}
        />
        {right}
      </View>
    </View>
  );
}
const fr = StyleSheet.create({
  wrap:      { marginBottom: 14 },
  label:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: MUTED, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 10, borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14 },
  input:     { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT, paddingVertical: 13 },
  disabled:  { color: MUTED },
});

function ToggleRow({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={tr.row}>
      <View style={{ flex: 1 }}>
        <Text style={tr.label}>{label}</Text>
        {sub ? <Text style={tr.sub}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#e5e7eb', true: PRIMARY + '80' }}
        thumbColor={value ? PRIMARY : '#fff'}
        ios_backgroundColor="#e5e7eb"
      />
    </View>
  );
}
const tr = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  label: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
  sub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 2 },
});

function Card({ children }: { children: React.ReactNode }) {
  return <View style={cd.card}>{children}</View>;
}
const cd = StyleSheet.create({
  card: { backgroundColor: CARD, borderRadius: 14, padding: 16, marginBottom: 16,
          shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
});

function SaveBtn({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable style={sv.btn} onPress={onPress}>
      <Text style={sv.label}>Save Changes</Text>
    </Pressable>
  );
}
const sv = StyleSheet.create({
  btn:   { backgroundColor: PRIMARY, borderRadius: 26, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 4, marginBottom: 20 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
});

/* ────────── section screens ────────── */
function PersonalInfo() {
  return (
    <>
      <Card>
        <FieldRow label="Full Name"    value="Sagiru" />
        <FieldRow label="Email Address" value="sagiru@gmail.com" keyboardType="email-address" />
        <FieldRow label="Phone Number" value="+234 801 234 5678" keyboardType="phone-pad" />
        <FieldRow label="Date of Birth" value="15 March 1990" />
        <FieldRow label="Gender"       value="Male" />
        <FieldRow label="NIN"          value="12345678901" keyboardType="number-pad" />
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Residential Address</Text>
        <FieldRow label="House / Plot Number" value="No. 14" />
        <FieldRow label="Street"       value="Tunga Layout" />
        <FieldRow label="District"     value="Tunga" />
        <FieldRow label="LGA"          value="Chanchaga" />
        <FieldRow label="State"        value="Niger State" editable={false} />
      </Card>
      <SaveBtn />
    </>
  );
}

function ChangePassword() {
  const [show, setShow] = useState({ current: false, newP: false, confirm: false });
  function EyeBtn({ field }: { field: 'current' | 'newP' | 'confirm' }) {
    return (
      <Pressable onPress={() => setShow(s => ({ ...s, [field]: !s[field] }))} hitSlop={8}>
        <Ionicons name={show[field] ? 'eye-outline' : 'eye-off-outline'} size={20} color={MUTED} />
      </Pressable>
    );
  }
  return (
    <>
      <Card>
        <FieldRow label="Current Password"  value="" secureTextEntry={!show.current}  right={<EyeBtn field="current" />} />
        <FieldRow label="New Password"      value="" secureTextEntry={!show.newP}     right={<EyeBtn field="newP" />} />
        <FieldRow label="Confirm Password"  value="" secureTextEntry={!show.confirm}  right={<EyeBtn field="confirm" />} />
      </Card>
      <View style={pg.hintCard}>
        <Ionicons name="information-circle-outline" size={18} color={PRIMARY} />
        <Text style={pg.hintText}>Password must be at least 8 characters and include a number and a special character.</Text>
      </View>
      <SaveBtn />
    </>
  );
}

function Notifications() {
  const [state, setState] = useState({
    paymentUpdates:  true,
    applicationStatus: true,
    inboxMessages:   true,
    announcements:   false,
    emailDigest:     true,
    smsAlerts:       false,
  });
  const toggle = (k: keyof typeof state) => setState(s => ({ ...s, [k]: !s[k] }));
  return (
    <>
      <Card>
        <Text style={pg.sectionTitle}>Push Notifications</Text>
        <ToggleRow label="Payment Updates"      sub="Confirmations and receipts"          value={state.paymentUpdates}      onChange={() => toggle('paymentUpdates')} />
        <ToggleRow label="Application Status"   sub="Approvals, rejections, inspections"  value={state.applicationStatus}   onChange={() => toggle('applicationStatus')} />
        <ToggleRow label="Inbox Messages"       sub="New messages from the Ministry"      value={state.inboxMessages}       onChange={() => toggle('inboxMessages')} />
        <ToggleRow label="Ministry Announcements" sub="News and service updates"          value={state.announcements}       onChange={() => toggle('announcements')} />
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Other Channels</Text>
        <ToggleRow label="Email Digest"   sub="Weekly summary via email"     value={state.emailDigest} onChange={() => toggle('emailDigest')} />
        <ToggleRow label="SMS Alerts"     sub="Critical updates via SMS"     value={state.smsAlerts}   onChange={() => toggle('smsAlerts')} />
      </Card>
      <SaveBtn />
    </>
  );
}

function PrivacySecurity() {
  const [state, setState] = useState({ biometric: true, twoFA: false, loginAlerts: true });
  const toggle = (k: keyof typeof state) => setState(s => ({ ...s, [k]: !s[k] }));
  return (
    <>
      <Card>
        <Text style={pg.sectionTitle}>Authentication</Text>
        <ToggleRow label="Biometric Login"     sub="Use fingerprint or Face ID"   value={state.biometric}    onChange={() => toggle('biometric')} />
        <ToggleRow label="Two-Factor Authentication" sub="OTP on every sign-in"   value={state.twoFA}        onChange={() => toggle('twoFA')} />
        <ToggleRow label="Login Alerts"        sub="Email me on new sign-in"      value={state.loginAlerts}  onChange={() => toggle('loginAlerts')} />
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Active Sessions</Text>
        {[
          { device: 'Android · Samsung Galaxy A54', location: 'Minna, Niger State', time: 'Now — Current session' },
          { device: 'Web · Chrome on Windows',      location: 'Abuja, FCT',          time: '3 Aug 2026, 10:14 AM' },
        ].map((s, i) => (
          <View key={i} style={[pg.sessionRow, i > 0 && { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <Ionicons name={s.device.startsWith('Android') ? 'phone-portrait-outline' : 'desktop-outline'} size={22} color={PRIMARY} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={pg.sessionDevice}>{s.device}</Text>
              <Text style={pg.sessionSub}>{s.location} · {s.time}</Text>
            </View>
            {i === 0
              ? <View style={pg.activeTag}><Text style={pg.activeTagLabel}>Active</Text></View>
              : <Pressable><Text style={{ color: DANGER, fontFamily: 'Inter_500Medium', fontSize: 13 }}>End</Text></Pressable>
            }
          </View>
        ))}
      </Card>
    </>
  );
}

function HelpSupport() {
  const [open, setOpen] = useState<number | null>(null);
  const FAQS = [
    { q: 'How do I submit a land survey application?', a: 'Go to Services, choose the survey type, fill in your property details and upload required documents. You will receive a confirmation and application ID.' },
    { q: 'How long does approval take?', a: 'Standard applications are processed within 15–30 working days depending on the service type and inspection schedule.' },
    { q: 'What documents are required?', a: 'National ID or NIN, Passport Photograph, Survey Plan (if available), and Proof of Ownership (e.g. purchase agreement or allocation letter).' },
    { q: 'How do I pay with Remita?', a: 'In your application detail, tap "Pay with Remita". Choose your preferred channel — Card, Bank Transfer, USSD, or Direct Debit — and follow the steps.' },
    { q: 'I lost my application ID. How do I retrieve it?', a: 'Open the Applications tab and search by your name or plot number. Your ID is displayed on every application card.' },
  ];
  return (
    <>
      <Card>
        <Text style={pg.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((f, i) => (
          <Pressable key={i} onPress={() => setOpen(open === i ? null : i)}
            style={[pg.faqRow, i > 0 && { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <Text style={pg.faqQ}>{f.q}</Text>
            <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={18} color={MUTED} />
            {open === i && <Text style={pg.faqA}>{f.a}</Text>}
          </Pressable>
        ))}
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Contact Us</Text>
        {[
          { icon: 'call-outline' as const,          label: 'Call Support',    sub: '+234 66 220 0100' },
          { icon: 'mail-outline' as const,          label: 'Email Us',        sub: 'support@mls.ng.gov' },
          { icon: 'chatbubble-ellipses-outline' as const, label: 'Live Chat', sub: 'Mon–Fri, 8 AM – 5 PM' },
        ].map((c, i) => (
          <Pressable key={i} style={[pg.contactRow, i > 0 && { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <View style={pg.contactIcon}><Ionicons name={c.icon} size={20} color={PRIMARY} /></View>
            <View style={{ flex: 1 }}>
              <Text style={pg.contactLabel}>{c.label}</Text>
              <Text style={pg.contactSub}>{c.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
          </Pressable>
        ))}
      </Card>
    </>
  );
}

function TermsAndConditions() {
  return (
    <Card>
      {[
        { title: '1. Acceptance of Terms', body: 'By using the NGS Land Surveys mobile application, you agree to these Terms and Conditions. If you do not agree, please discontinue use of the application immediately.' },
        { title: '2. Use of Service', body: 'This application is intended for citizens and authorised staff of Niger State to submit, track, and manage land survey applications. Any misuse, including submission of false information, may result in account suspension and legal action.' },
        { title: '3. Data Accuracy', body: 'You are responsible for ensuring all information you submit is accurate and up to date. The Ministry of Lands & Survey reserves the right to reject applications with incomplete or inaccurate data.' },
        { title: '4. Payments', body: 'All payments are processed through the Remita Payment Gateway operated by SystemSpecs Limited. The Ministry does not store card or bank details. Payment disputes should be directed to your bank or Remita support.' },
        { title: '5. Privacy', body: 'Your personal data is collected and processed in accordance with Nigerian data protection law (NDPR). Data is used solely for processing your land survey applications and will not be shared with third parties without consent.' },
        { title: '6. Intellectual Property', body: 'All content, logos, and materials within this application are the property of Niger State Government or their respective owners. Unauthorised reproduction is prohibited.' },
        { title: '7. Limitation of Liability', body: 'The Ministry shall not be liable for any loss arising from technical downtime, unauthorised access, or delays outside of its control. Best-effort service levels apply.' },
        { title: '8. Amendments', body: 'These terms may be updated from time to time. Continued use of the application after changes constitutes acceptance of the revised terms.' },
        { title: '9. Governing Law', body: 'These Terms are governed by the laws of the Federal Republic of Nigeria and applicable Niger State statutes.' },
        { title: '10. Contact', body: 'For legal enquiries, contact the Ministry of Lands & Survey, Niger State Secretariat, Minna, Niger State. Email: legal@mls.ng.gov.' },
      ].map(({ title, body }) => (
        <View key={title} style={pg.termBlock}>
          <Text style={pg.termTitle}>{title}</Text>
          <Text style={pg.termBody}>{body}</Text>
        </View>
      ))}
    </Card>
  );
}

function About() {
  return (
    <>
      <Card>
        <View style={pg.aboutLogoRow}>
          <View style={[pg.aboutIconCircle, { backgroundColor: PRIMARY + '20' }]}>
            <Ionicons name="map-outline" size={36} color={PRIMARY} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={pg.aboutAppName}>NGS Land Surveys</Text>
            <Text style={pg.aboutAppSub}>Niger State Ministry of Lands & Survey</Text>
          </View>
        </View>
        {[
          ['App Version',     '1.0.0 (Build 100)'],
          ['Platform',        'Expo / React Native'],
          ['Last Updated',    'August 2026'],
          ['Ministry',        'Ministry of Lands & Survey, Niger State'],
          ['Contact',         'info@mls.ng.gov'],
          ['Office Address',  'Niger State Secretariat, Minna, Nigeria'],
        ].map(([k, v]) => (
          <View key={k} style={[pg.aboutRow, { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <Text style={pg.aboutKey}>{k}</Text>
            <Text style={pg.aboutVal}>{v}</Text>
          </View>
        ))}
      </Card>
      <View style={pg.copyright}>
        <Text style={pg.copyrightText}>© 2026 Niger State Government. All rights reserved.</Text>
      </View>
    </>
  );
}

/* ────────── page-level shared styles ────────── */
const pg = StyleSheet.create({
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: TEXT, marginBottom: 12 },
  hintCard:     { flexDirection: 'row', gap: 10, backgroundColor: '#f0fdf4', borderRadius: 10, padding: 14, marginBottom: 16, alignItems: 'flex-start' },
  hintText:     { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: '#166534', lineHeight: 19 },
  sessionRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  sessionDevice:{ fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT },
  sessionSub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 2 },
  activeTag:    { backgroundColor: '#dcfce7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  activeTagLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#166534' },
  faqRow:       { paddingVertical: 14, flexWrap: 'wrap', flexDirection: 'row', alignItems: 'flex-start' },
  faqQ:         { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, paddingRight: 8 },
  faqA:         { width: '100%', fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 8, lineHeight: 20 },
  contactRow:   { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  contactIcon:  { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  contactLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
  contactSub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 2 },
  termBlock:    { marginBottom: 16 },
  termTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: TEXT, marginBottom: 6 },
  termBody:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, lineHeight: 20 },
  aboutLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  aboutIconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  aboutAppName: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: TEXT },
  aboutAppSub:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 4, flexShrink: 1 },
  aboutRow:     { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, flexWrap: 'wrap', gap: 4 },
  aboutKey:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  aboutVal:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT, textAlign: 'right', flexShrink: 1, marginLeft: 12 },
  copyright:    { alignItems: 'center', marginBottom: 20 },
  copyrightText:{ fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },
});

/* ────────── main screen ────────── */
const SECTION_TITLES: Record<string, string> = {
  personal: 'Personal Information',
  password: 'Change Password',
  notifications: 'Notifications',
  privacy: 'Privacy & Security',
  help: 'Help & Support',
  terms: 'Terms & Conditions',
  about: 'About',
};

export default function CitizenProfile() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string | null>(null);

  function renderSection() {
    switch (active) {
      case 'personal':      return <PersonalInfo />;
      case 'password':      return <ChangePassword />;
      case 'notifications': return <Notifications />;
      case 'privacy':       return <PrivacySecurity />;
      case 'help':          return <HelpSupport />;
      case 'terms':         return <TermsAndConditions />;
      case 'about':         return <About />;
      default:              return null;
    }
  }

  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.homePill}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </View>

      {active ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.sectionContent} showsVerticalScrollIndicator={false}>
          <SectionHeader title={SECTION_TITLES[active]} onBack={() => setActive(null)} />
          {renderSection()}
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <AvatarPicker gender="male" size={100} />
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
                key={item.id}
                onPress={() => setActive(item.id)}
                style={({ pressed }) => [
                  styles.menuRow,
                  i < MENU.length - 1 && styles.menuBorder,
                  { backgroundColor: pressed ? '#f9fafb' : CARD },
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1 },
  header:       { paddingHorizontal: 20, paddingBottom: 10, backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  homePill: { backgroundColor: PRIMARY, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 7 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
  scroll:       { flex: 1 },
  content:      { paddingHorizontal: 20, paddingTop: 24 },
  sectionContent: { paddingHorizontal: 20, paddingTop: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 28, gap: 6 },
  name:         { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: TEXT, marginBottom: 4 },
  email:        { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED, marginBottom: 10 },
  citizenBadge: { backgroundColor: PRIMARY + '20', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  citizenBadgeLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: PRIMARY },
  menuCard: {
    backgroundColor: CARD, borderRadius: 14, overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  menuRow:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  menuBorder:   { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel:    { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: CARD, borderRadius: 14, paddingVertical: 15, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  signOutLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: DANGER },
});
