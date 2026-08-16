import React, { useState } from 'react';
import {
  Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AvatarPicker } from '@/components/AvatarPicker';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const BG      = '#f7f7f7';
const CARD    = '#ffffff';
const TEXT    = '#0a0a0a';
const MUTED   = '#6b7280';
const PRIMARY = '#13bf43';
const BLUE    = '#1e40af';
const BLUE_BG = '#dbeafe';
const DANGER  = '#ef4444';
const BORDER  = '#f3f4f6';

/* ────────── menu definition ────────── */
const MENU = [
  { id: 'personal',      icon: 'person-outline'             as const, label: 'Personal Information' },
  { id: 'staffid',       icon: 'id-card-outline'            as const, label: 'Staff ID & Department' },
  { id: 'password',      icon: 'lock-closed-outline'        as const, label: 'Change Password' },
  { id: 'notifications', icon: 'notifications-outline'      as const, label: 'Notifications' },
  { id: 'privacy',       icon: 'shield-outline'             as const, label: 'Privacy & Security' },
  { id: 'help',          icon: 'help-circle-outline'        as const, label: 'Help & Support' },
  { id: 'about',         icon: 'information-circle-outline' as const, label: 'About' },
];

const SECTION_TITLES: Record<string, string> = {
  personal:      'Personal Information',
  staffid:       'Staff ID & Department',
  password:      'Change Password',
  notifications: 'Notifications',
  privacy:       'Privacy & Security',
  help:          'Help & Support',
  about:         'About',
};

/* ────────── shared small components ────────── */
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

function FieldRow({ label, value, editable = true, keyboardType = 'default' as any,
  secureTextEntry = false, right }: {
  label: string; value: string; editable?: boolean; keyboardType?: any;
  secureTextEntry?: boolean; right?: React.ReactNode;
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
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 10,
               borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14 },
  input:     { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT, paddingVertical: 13 },
  disabled:  { color: MUTED },
});

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={ir.row}>
      <Text style={ir.label}>{label}</Text>
      <Text style={ir.value}>{value}</Text>
    </View>
  );
}
const ir = StyleSheet.create({
  row:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
           paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: BORDER },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED },
  value: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, textAlign: 'right', flex: 1, marginLeft: 12 },
});

function ToggleRow({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <View style={tr.row}>
      <View style={{ flex: 1 }}>
        <Text style={tr.label}>{label}</Text>
        {sub ? <Text style={tr.sub}>{sub}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange}
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
        <FieldRow label="Full Name"     value="Zaguru" />
        <FieldRow label="Email Address" value="zaguru@mls.gov.ng" keyboardType="email-address" />
        <FieldRow label="Phone Number"  value="+234 803 456 7890" keyboardType="phone-pad" />
        <FieldRow label="Date of Birth" value="10 June 1985" />
        <FieldRow label="Gender"        value="Male" />
        <FieldRow label="NIN"           value="98765432100" keyboardType="number-pad" editable={false} />
      </Card>
      <Card>
        <FieldRow label="Residential Address" value="No. 3, Bosso Road, Minna" />
        <FieldRow label="LGA"           value="Bosso" />
        <FieldRow label="State"         value="Niger State" editable={false} />
      </Card>
      <SaveBtn />
    </>
  );
}

function StaffIdDepartment() {
  return (
    <>
      <Card>
        <Text style={pg.sectionTitle}>Staff Identity</Text>
        <InfoRow label="Staff ID"       value="MLS-STAFF-00124" />
        <InfoRow label="Full Name"      value="Zaguru" />
        <InfoRow label="Job Title"      value="Senior Land Surveyor" />
        <InfoRow label="Grade Level"    value="GL 12" />
        <InfoRow label="Date Employed"  value="5 January 2015" />
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Department</Text>
        <InfoRow label="Division"       value="Land Survey Division" />
        <InfoRow label="Department"     value="Survey & Mapping" />
        <InfoRow label="Ministry"       value="Ministry of Lands & Survey" />
        <InfoRow label="Office"         value="Survey House, Minna" />
        <InfoRow label="Supervisor"     value="Dir. Aliyu Musa" />
      </Card>
      <View style={pg.readonlyNote}>
        <Ionicons name="lock-closed-outline" size={15} color={MUTED} />
        <Text style={pg.readonlyText}>Staff identity details are managed by HR. Contact the admin office to request corrections.</Text>
      </View>
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
        <FieldRow label="Current Password" value="" secureTextEntry={!show.current} right={<EyeBtn field="current" />} />
        <FieldRow label="New Password"     value="" secureTextEntry={!show.newP}    right={<EyeBtn field="newP" />} />
        <FieldRow label="Confirm Password" value="" secureTextEntry={!show.confirm} right={<EyeBtn field="confirm" />} />
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
    taskAssigned:    true,
    inspectionAlert: true,
    applicationUpdate: true,
    deadlineReminder: true,
    systemAlert:     false,
    emailDigest:     true,
    smsAlerts:       false,
  });
  const toggle = (k: keyof typeof state) => setState(s => ({ ...s, [k]: !s[k] }));
  return (
    <>
      <Card>
        <Text style={pg.sectionTitle}>Work Notifications</Text>
        <ToggleRow label="Task Assigned"          sub="When a new task is assigned to you"           value={state.taskAssigned}       onChange={() => toggle('taskAssigned')} />
        <ToggleRow label="Inspection Scheduled"   sub="Reminders for upcoming field inspections"     value={state.inspectionAlert}    onChange={() => toggle('inspectionAlert')} />
        <ToggleRow label="Application Updates"    sub="Citizen submissions requiring your action"    value={state.applicationUpdate}  onChange={() => toggle('applicationUpdate')} />
        <ToggleRow label="Deadline Reminders"     sub="24 hrs before task or inspection deadline"    value={state.deadlineReminder}   onChange={() => toggle('deadlineReminder')} />
        <ToggleRow label="System Alerts"          sub="Downtime, maintenance, and system updates"    value={state.systemAlert}        onChange={() => toggle('systemAlert')} />
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Other Channels</Text>
        <ToggleRow label="Email Digest"  sub="Daily summary of pending tasks"  value={state.emailDigest} onChange={() => toggle('emailDigest')} />
        <ToggleRow label="SMS Alerts"    sub="Critical reminders via SMS"      value={state.smsAlerts}   onChange={() => toggle('smsAlerts')} />
      </Card>
      <SaveBtn />
    </>
  );
}

function PrivacySecurity() {
  const [state, setState] = useState({ biometric: true, twoFA: true, loginAlerts: true });
  const toggle = (k: keyof typeof state) => setState(s => ({ ...s, [k]: !s[k] }));
  return (
    <>
      <Card>
        <Text style={pg.sectionTitle}>Authentication</Text>
        <ToggleRow label="Biometric Login"           sub="Use fingerprint or Face ID"    value={state.biometric}   onChange={() => toggle('biometric')} />
        <ToggleRow label="Two-Factor Authentication" sub="OTP required on every sign-in" value={state.twoFA}       onChange={() => toggle('twoFA')} />
        <ToggleRow label="Login Alerts"              sub="Email me on new sign-in"       value={state.loginAlerts} onChange={() => toggle('loginAlerts')} />
      </Card>
      <Card>
        <Text style={pg.sectionTitle}>Active Sessions</Text>
        {[
          { device: 'Android · Tecno Camon 20',    location: 'Minna, Niger State', time: 'Now — Current session' },
          { device: 'Web · Firefox on Windows',    location: 'Minna, Niger State', time: '14 Aug 2026, 8:02 AM' },
          { device: 'Web · Chrome on Android',     location: 'Abuja, FCT',          time: '10 Aug 2026, 3:40 PM' },
        ].map((s, i) => (
          <View key={i} style={[pg.sessionRow, i > 0 && { borderTopWidth: 1, borderTopColor: BORDER }]}>
            <Ionicons
              name={s.device.startsWith('Android') ? 'phone-portrait-outline' : 'desktop-outline'}
              size={22} color={PRIMARY} style={{ marginRight: 12 }}
            />
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
    { q: 'How do I complete an inspection on the app?', a: 'Go to Inspections, find your assigned property, tap "View on Map" to navigate, then tap "Start Inspection" to begin and submit your field report.' },
    { q: 'How do I approve or reject an application?', a: 'Open the Applications tab, select the application, verify all documents with the checklist, then tap Approve or Request Inspection as appropriate.' },
    { q: 'What happens after I approve an application?', a: 'The citizen is notified automatically and the application moves to the Approved status. Payment instructions are sent if payment is outstanding.' },
    { q: 'I cannot access a property location on the map. What should I do?', a: 'Ensure you have location permissions enabled for the app. If coordinates are missing, update the property coordinates in the application detail before proceeding to inspection.' },
    { q: 'How do I escalate a flagged application?', a: 'Use the "Flag for Review" option in the application detail. Add a note explaining the issue. Your supervisor will be notified automatically.' },
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
        <Text style={pg.sectionTitle}>Contact & Support</Text>
        {[
          { icon: 'call-outline' as const,                label: 'Call IT Helpdesk',   sub: '+234 66 220 0200' },
          { icon: 'mail-outline' as const,                label: 'Email Admin',         sub: 'admin@mls.ng.gov' },
          { icon: 'chatbubble-ellipses-outline' as const, label: 'Internal Chat',       sub: 'Staff portal messaging' },
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

function About() {
  return (
    <>
      <Card>
        <View style={pg.aboutLogoRow}>
          <View style={[pg.aboutIconCircle, { backgroundColor: BLUE_BG }]}>
            <Ionicons name="briefcase-outline" size={36} color={BLUE} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={pg.aboutAppName}>NGS Land Surveys — Staff</Text>
            <Text style={pg.aboutAppSub}>Ministry of Lands & Survey, Niger State</Text>
          </View>
        </View>
        {[
          ['App Version',     '1.0.0 (Build 100)'],
          ['Platform',        'Expo / React Native'],
          ['Last Updated',    'August 2026'],
          ['Ministry',        'Ministry of Lands & Survey, Niger State'],
          ['IT Support',      'admin@mls.ng.gov'],
          ['Office Address',  'Survey House, Niger State Secretariat, Minna'],
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
  sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: TEXT, marginBottom: 12 },
  hintCard:      { flexDirection: 'row', gap: 10, backgroundColor: '#f0fdf4', borderRadius: 10, padding: 14, marginBottom: 16, alignItems: 'flex-start' },
  hintText:      { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: '#166534', lineHeight: 19 },
  readonlyNote:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 20, paddingHorizontal: 4 },
  readonlyText:  { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, lineHeight: 18 },
  sessionRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  sessionDevice: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT },
  sessionSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 2 },
  activeTag:     { backgroundColor: '#dcfce7', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  activeTagLabel:{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#166534' },
  faqRow:        { paddingVertical: 14, flexWrap: 'wrap', flexDirection: 'row', alignItems: 'flex-start' },
  faqQ:          { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, paddingRight: 8 },
  faqA:          { width: '100%', fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, marginTop: 8, lineHeight: 20 },
  contactRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  contactIcon:   { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  contactLabel:  { fontFamily: 'Inter_500Medium', fontSize: 15, color: TEXT },
  contactSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 2 },
  aboutLogoRow:  { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  aboutIconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  aboutAppName:  { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: TEXT },
  aboutAppSub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED, marginTop: 4, flexShrink: 1 },
  aboutRow:      { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, flexWrap: 'wrap', gap: 4 },
  aboutKey:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  aboutVal:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: TEXT, textAlign: 'right', flexShrink: 1, marginLeft: 12 },
  copyright:     { alignItems: 'center', marginBottom: 20 },
  copyrightText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },
});

/* ────────── main screen ────────── */
export default function StaffProfile() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState<string | null>(null);

  function renderSection() {
    switch (active) {
      case 'personal':      return <PersonalInfo />;
      case 'staffid':       return <StaffIdDepartment />;
      case 'password':      return <ChangePassword />;
      case 'notifications': return <Notifications />;
      case 'privacy':       return <PrivacySecurity />;
      case 'help':          return <HelpSupport />;
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
            <Text style={styles.name}>Zaguru</Text>
            <Text style={styles.email}>zaguru@mls.gov.ng</Text>
            <View style={styles.staffBadge}>
              <Text style={styles.staffBadgeLabel}>Staff · Land Survey Division</Text>
            </View>
            <Text style={styles.staffId}>Staff ID: MLS-STAFF-00124</Text>
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
  screen:         { flex: 1 },
  header:         { paddingHorizontal: 20, paddingBottom: 10, backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  homePill: { backgroundColor: PRIMARY, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 7 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
  scroll:         { flex: 1 },
  content:        { paddingHorizontal: 20, paddingTop: 24 },
  sectionContent: { paddingHorizontal: 20, paddingTop: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 28, gap: 6 },
  name:           { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: TEXT, marginBottom: 4 },
  email:          { fontFamily: 'Inter_400Regular', fontSize: 14, color: MUTED, marginBottom: 10 },
  staffBadge:     { backgroundColor: BLUE_BG, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 6 },
  staffBadgeLabel:{ fontFamily: 'Inter_500Medium', fontSize: 13, color: BLUE },
  staffId:        { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED },
  menuCard: {
    backgroundColor: CARD, borderRadius: 14, overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  menuRow:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15 },
  menuBorder:     { borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuIconWrap:   { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  menuLabel:      { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT },
  signOutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: CARD, borderRadius: 14, paddingVertical: 15, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  signOutLabel:   { fontFamily: 'Inter_500Medium', fontSize: 15, color: DANGER },
});
