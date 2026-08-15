import React, { useState, useRef } from 'react';
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY  = '#13bf43';
const CARD     = '#ffffff';
const TEXT     = '#0a0a0a';
const MUTED    = '#6b7280';
const USER_BG  = PRIMARY;
const BOT_BG   = '#f3f4f6';

const ministryLogo = require('@/assets/images/brand/ministry-logo-clear.png');

type Msg = { id: string; text: string; from: 'bot' | 'user'; time: string };

function now() {
  const d = new Date();
  return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
}

const WELCOME: Msg[] = [
  {
    id: '0',
    from: 'bot',
    time: now(),
    text: 'Hello! 👋 Welcome to the NGS Land Surveys support chat.\n\nI\'m your virtual assistant. How can I help you today?',
  },
];

const QUICK_REPLIES = [
  'How do I apply for a survey?',
  'Check my application status',
  'Payment & fees',
  'Required documents',
  'Contact an officer',
];

const BOT_RESPONSES: Record<string, string> = {
  'how do i apply for a survey?':
    'To apply for a land survey:\n\n1. Go to the Services tab\n2. Select the survey type (e.g. Certificate of Occupancy)\n3. Fill in your property details\n4. Upload required documents\n5. Submit and pay via Remita\n\nYou\'ll get an Application ID via email after submission.',
  'check my application status':
    'You can check your application status in the Applications tab. Tap any application to see its full timeline and current status.\n\nIf you need help with a specific Application ID, please share it.',
  'payment & fees':
    'Our standard fees:\n\n• Certificate of Occupancy — ₦45,000\n• Right of Occupancy — ₦32,000\n• Survey Plan Verification — ₦18,500\n• Land Use Consent — ₦28,000\n\nAll payments are processed securely through Remita.',
  'required documents':
    'You will need:\n\n✅ Valid National ID or NIN\n✅ Passport Photograph (recent)\n✅ Survey Plan (if available)\n✅ Proof of Ownership\n   (purchase agreement or allocation letter)\n\nScanned copies or clear photos are accepted.',
  'contact an officer':
    'You can reach our offices at:\n\n📞 +234 66 220 0100\n✉️ support@mls.ng.gov\n🏢 Survey House, Niger State Secretariat, Minna\n\nOffice hours: Mon–Fri, 8:00 AM – 4:00 PM',
};

function getBotReply(input: string): string {
  const key = input.trim().toLowerCase();
  for (const k of Object.keys(BOT_RESPONSES)) {
    if (key.includes(k) || k.includes(key)) return BOT_RESPONSES[k];
  }
  return "I'm sorry, I didn't quite understand that. You can ask me about:\n\n• How to apply for a survey\n• Application status\n• Payment & fees\n• Required documents\n• Contacting an officer\n\nOr call us at +234 66 220 0100.";
}

/* ─── Chat Modal ─── */
function ChatModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Msg[]>(WELCOME);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now().toString(), from: 'user', text: text.trim(), time: now() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const botMsg: Msg = { id: (Date.now() + 1).toString(), from: 'bot', text: getBotReply(text), time: now() };
      setMessages(m => [...m, botMsg]);
      setTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000 + Math.random() * 600);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  function renderItem({ item }: { item: Msg }) {
    const isUser = item.from === 'user';
    return (
      <View style={[ms.row, isUser ? ms.rowUser : ms.rowBot]}>
        {!isUser && (
          <View style={ms.botAvatar}>
            <Image source={ministryLogo} style={ms.botAvatarImg} resizeMode="contain" />
          </View>
        )}
        <View style={{ maxWidth: '75%' }}>
          <View style={[ms.bubble, isUser ? ms.bubbleUser : ms.bubbleBot]}>
            <Text style={[ms.bubbleText, isUser && { color: '#fff' }]}>{item.text}</Text>
          </View>
          <Text style={[ms.time, isUser && { textAlign: 'right' }]}>{item.time}</Text>
        </View>
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[mo.overlay, { paddingBottom: insets.bottom }]}>
        <KeyboardAvoidingView
          style={mo.sheet}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={mo.header}>
            <View style={mo.headerLeft}>
              <View style={mo.headerAvatar}>
                <Image source={ministryLogo} style={mo.headerAvatarImg} resizeMode="contain" />
              </View>
              <View>
                <Text style={mo.headerTitle}>NGS Support</Text>
                <View style={mo.onlineRow}>
                  <View style={mo.onlineDot} />
                  <Text style={mo.onlineLabel}>Online now</Text>
                </View>
              </View>
            </View>
            <Pressable onPress={onClose} style={mo.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={22} color={TEXT} />
            </Pressable>
          </View>

          {/* Messages */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            contentContainerStyle={mo.listContent}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              typing ? (
                <View style={[ms.row, ms.rowBot]}>
                  <View style={ms.botAvatar}>
                    <Image source={ministryLogo} style={ms.botAvatarImg} resizeMode="contain" />
                  </View>
                  <View style={[ms.bubble, ms.bubbleBot, { paddingVertical: 10, paddingHorizontal: 16 }]}>
                    <Text style={{ color: MUTED, fontFamily: 'Inter_400Regular', fontSize: 20, letterSpacing: 4 }}>···</Text>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <FlatList
              horizontal
              data={QUICK_REPLIES}
              keyExtractor={i => i}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={mo.quickWrap}
              renderItem={({ item }) => (
                <Pressable onPress={() => sendMessage(item)} style={mo.quickChip}>
                  <Text style={mo.quickChipLabel}>{item}</Text>
                </Pressable>
              )}
            />
          )}

          {/* Input */}
          <View style={mo.inputRow}>
            <TextInput
              style={mo.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message…"
              placeholderTextColor={MUTED}
              multiline
              maxLength={400}
              onSubmitEditing={() => sendMessage(input)}
            />
            <Pressable
              onPress={() => sendMessage(input)}
              style={[mo.sendBtn, !input.trim() && { backgroundColor: '#e5e7eb' }]}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={18} color={input.trim() ? '#fff' : MUTED} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

/* ─── FAB button ─── */
export function ChatBotFAB() {
  const [open, setOpen] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  function handlePress() {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start(() => setOpen(true));
  }

  return (
    <>
      <ChatModal visible={open} onClose={() => setOpen(false)} />
      <Animated.View style={[fab.wrap, { transform: [{ scale }] }]}>
        <Pressable onPress={handlePress} style={fab.btn}>
          <Image source={ministryLogo} style={fab.logo} resizeMode="contain" />
        </Pressable>
        <View style={fab.badge}>
          <Text style={fab.badgeText}>Chat Me!</Text>
        </View>
      </Animated.View>
    </>
  );
}

/* ─── styles ─── */
const fab = StyleSheet.create({
  wrap:      { position: 'absolute', bottom: 20, right: 18, alignItems: 'center' },
  btn:       {
    width: 58, height: 58, borderRadius: 29, backgroundColor: '#d6d6d6',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }, elevation: 8,
    borderWidth: 2, borderColor: PRIMARY + '40',
  },
  logo:      { width: 44, height: 44 },
  badge:     { backgroundColor: PRIMARY, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginTop: 4 },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: '#fff' },
});

const mo = StyleSheet.create({
  overlay:   { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet:     { backgroundColor: CARD, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '88%' },
  header:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
               paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerLeft:{ flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center' },
  headerAvatarImg: { width: 36, height: 36 },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: TEXT },
  onlineRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: PRIMARY },
  onlineLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: PRIMARY },
  closeBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  listContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 4 },
  quickWrap:   { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  quickChip:   { borderRadius: 20, borderWidth: 1, borderColor: PRIMARY, paddingHorizontal: 14, paddingVertical: 8 },
  quickChipLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: PRIMARY },
  inputRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingVertical: 12,
               borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  input:     { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10,
               fontFamily: 'Inter_400Regular', fontSize: 15, color: TEXT, maxHeight: 100 },
  sendBtn:   { width: 44, height: 44, borderRadius: 22, backgroundColor: PRIMARY,
               alignItems: 'center', justifyContent: 'center' },
});

const ms = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  rowUser:    { justifyContent: 'flex-end' },
  rowBot:     { justifyContent: 'flex-start', gap: 8 },
  botAvatar:  { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f0fdf4',
                alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  botAvatarImg: { width: 24, height: 24 },
  bubble:     { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleBot:  { backgroundColor: BOT_BG, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: USER_BG, borderBottomRightRadius: 4 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: TEXT, lineHeight: 21 },
  time:       { fontFamily: 'Inter_400Regular', fontSize: 10, color: MUTED, marginTop: 3, marginHorizontal: 4 },
});
