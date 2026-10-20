import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatTime } from '@/data/mock';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

export default function Chat() {
  const insets = useSafeAreaInsets();
  const { chat, sendMessage, orders, services } = useApp();
  const [text, setText] = useState('');
  const [sharing, setSharing] = useState(false);
  const list = useRef<FlatList>(null);
  const typing = chat[chat.length - 1]?.from === 'me';

  useEffect(() => {
    setTimeout(() => list.current?.scrollToEnd({ animated: true }), 50);
  }, [chat.length]);

  const send = (body: string) => {
    if (!body.trim()) return;
    sendMessage(body.trim());
    setText('');
  };

  const refs = [
    ...services.slice(0, 3).map((s) => ({ id: s.id, label: `${s.type} · ${s.status}` })),
    ...orders.slice(0, 3).map((o) => ({ id: o.id, label: `Order · ${o.status}` })),
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bgSoft }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.agent}>
          <MaterialCommunityIcons name="headset" size={24} color={colors.white} />
          <View style={styles.online} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.agentName}>Aquaphil Support</Text>
          <Text style={styles.agentStatus}>{typing ? 'typing…' : 'Online · replies in ~2 min'}</Text>
        </View>
      </View>

      <FlatList
        ref={list}
        data={chat}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const mine = item.from === 'me';
          return (
            <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
              <Text style={[styles.msg, mine && { color: colors.white }]}>{item.body}</Text>
              <View style={styles.meta}>
                <Text style={[styles.time, mine && { color: 'rgba(255,255,255,0.8)' }]}>{formatTime(item.at)}</Text>
                {mine && <Ionicons name="checkmark-done" size={14} color="#BDE9FF" />}
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          typing ? (
            <View style={[styles.bubble, styles.theirs, { marginTop: 10, paddingVertical: 12 }]}>
              <Text style={{ color: colors.textMuted, letterSpacing: 3 }}>• • •</Text>
            </View>
          ) : undefined
        }
      />

      {sharing && (
        <View style={styles.sharePanel}>
          <Text style={styles.shareTitle}>Share an order or service</Text>
          {refs.map((r) => (
            <Pressable
              key={r.id}
              style={styles.shareRow}
              onPress={() => {
                send(`Regarding ${r.id} (${r.label})`);
                setSharing(false);
              }}
            >
              <MaterialCommunityIcons name="pound" size={18} color={colors.primary} />
              <Text style={{ fontWeight: '700', color: colors.text }}>{r.id}</Text>
              <Text style={{ color: colors.textMuted, flex: 1 }} numberOfLines={1}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={[styles.composer, { paddingBottom: 10 }]}>
        <Pressable onPress={() => setSharing((v) => !v)} style={styles.iconBtn} accessibilityLabel="Share order or service number">
          <MaterialCommunityIcons name="paperclip" size={22} color={sharing ? colors.primary : colors.textMuted} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
          onSubmitEditing={() => send(text)}
        />
        <Pressable onPress={() => send(text)} style={[styles.send, !text.trim() && { opacity: 0.5 }]} accessibilityLabel="Send">
          <Ionicons name="send" size={18} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  agent: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  online: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  agentName: { fontSize: 16, fontWeight: '800', color: colors.text },
  agentStatus: { fontSize: 12, color: colors.green, fontWeight: '600' },
  bubble: { maxWidth: '80%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.white, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
  msg: { fontSize: 15, color: colors.text, lineHeight: 21 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 },
  time: { fontSize: 11, color: colors.textMuted },
  sharePanel: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, padding: 12, gap: 4 },
  shareTitle: { fontWeight: '800', color: colors.text, marginBottom: 4 },
  shareRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  iconBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.bgSoft,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: colors.text,
  },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
