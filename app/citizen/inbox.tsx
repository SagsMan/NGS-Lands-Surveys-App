import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChatBotFAB } from '@/components/ChatBotFAB';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BG = '#f7f7f7';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';
const PRIMARY = '#13bf43';

const MESSAGES = [
  { id: '1', from: 'Ministry of Lands & Survey', subject: 'Application Update', body: 'Your Certificate of Occupancy application is under review.', time: '2h ago', unread: true },
  { id: '2', from: 'Payment System', subject: 'Payment Confirmed', body: 'Your payment of ₦500 has been confirmed for Application MDN-38403-293.', time: '1d ago', unread: false },
  { id: '3', from: 'Ministry of Lands & Survey', subject: 'Scheduled Maintenance', body: 'System maintenance is scheduled for Saturday 16 August from 10 PM.', time: '2d ago', unread: false },
];

export default function CitizenInbox() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: BG }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.homePill}>
          <Text style={styles.headerTitle}>Inbox</Text>
        </View>
        <Pressable style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {MESSAGES.map((msg, i) => (
          <Pressable key={msg.id} style={({ pressed }) => [styles.msgCard, { opacity: pressed ? 0.88 : 1 }]}>
            <View style={styles.msgRow}>
              <View style={[styles.avatar, { backgroundColor: PRIMARY + '20' }]}>
                <Ionicons name="mail-outline" size={20} color={PRIMARY} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.msgTopRow}>
                  <Text style={styles.msgFrom} numberOfLines={1}>{msg.from}</Text>
                  <Text style={styles.msgTime}>{msg.time}</Text>
                </View>
                <Text style={[styles.msgSubject, msg.unread && { color: TEXT }]}>{msg.subject}</Text>
                <Text style={styles.msgBody} numberOfLines={2}>{msg.body}</Text>
              </View>
              {msg.unread && <View style={[styles.unreadDot, { backgroundColor: PRIMARY }]} />}
            </View>
          </Pressable>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
      <ChatBotFAB />
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
  homePill: { backgroundColor: PRIMARY, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 7 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  msgCard: {
    backgroundColor: CARD, borderRadius: 12, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  msgRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  msgTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  msgFrom: { fontFamily: 'Inter_500Medium', fontSize: 13, color: TEXT, flex: 1, marginRight: 8 },
  msgTime: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },
  msgSubject: { fontFamily: 'Inter_500Medium', fontSize: 14, color: MUTED, marginBottom: 3 },
  msgBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: MUTED, lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, alignSelf: 'center', marginLeft: 6, flexShrink: 0 },
});
