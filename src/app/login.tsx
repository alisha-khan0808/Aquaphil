import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
 
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo, PrimaryButton, Sunburst, Waves } from '@/components/ui';
import { useScreen } from '@/hooks/useScreen';
import { useApp } from '@/store/AppContext';
import { colors, radius } from '@/theme';

// Demo OTP until the SMS provider (MSG91/Gupshup) is integrated.
const DEMO_OTP = '1234';

type Step = 'phone' | 'otp' | 'profile';

export default function Login() {
  const { width, height } = useScreen();
  const heroH = Math.min(300, Math.round(height * 0.4));
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timer, setTimer] = useState(30);
  const otpRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [step, timer]);

  const validPhone = /^[6-9]\d{9}$/.test(phone);
  const validEmail = email === '' || /^\S+@\S+\.\S+$/.test(email);

  const verify = () => {
    if (otp === DEMO_OTP) {
      setOtpError('');
      setStep('profile');
    } else setOtpError('Incorrect OTP. Please try again.');
  };

  const finish = () => {
    login({ name: name.trim(), phone: '+91' + phone, email: email.trim() });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={[colors.heroTop, colors.heroBottom]} style={[styles.hero, { height: heroH, paddingTop: insets.top + (heroH < 280 ? 24 : 36) }]}>
          <Sunburst width={width} height={heroH} />
          <Logo size={34} light />
          <Text style={styles.heroText}>India's trusted RO purifier sales & service</Text>
          <Waves width={width} height={70} />
        </LinearGradient>

        <View style={styles.body}>
          {step === 'phone' && (
            <>
              <Text style={styles.title}>Login or Sign up</Text>
              <Text style={styles.sub}>We'll send a one-time password to verify your number.</Text>
              <View style={styles.inputRow}>
                <Text style={styles.prefix}>🇮🇳 +91</Text>
                <TextInput
                  value={phone}
                  onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile number"
                  keyboardType="phone-pad"
                  style={styles.input}
                  maxLength={10}
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <PrimaryButton
                title="Get OTP"
                icon="chevron-forward"
                disabled={!validPhone}
                onPress={() => {
                  setTimer(30);
                  setStep('otp');
                  setTimeout(() => otpRef.current?.focus(), 300);
                }}
                style={{ marginTop: 20 }}
              />
              <Text style={styles.legal}>By continuing you agree to Aquaphil's Terms of Use and Privacy Policy.</Text>
            </>
          )}

          {step === 'otp' && (
            <>
              <Pressable onPress={() => setStep('phone')} style={styles.back} hitSlop={10}>
                <Ionicons name="arrow-back" size={18} color={colors.primary} />
                <Text style={styles.backText}>Change number</Text>
              </Pressable>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.sub}>Sent to +91 {phone}</Text>
              <Pressable onPress={() => otpRef.current?.focus()} style={styles.otpRow}>
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} style={[styles.otpBox, otp.length === i && styles.otpBoxActive]}>
                    <Text style={styles.otpDigit}>{otp[i] ?? ''}</Text>
                  </View>
                ))}
              </Pressable>
              <TextInput
                ref={otpRef}
                value={otp}
                onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 4))}
                keyboardType="number-pad"
                maxLength={4}
                style={styles.hiddenInput}
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
              />
              {!!otpError && <Text style={styles.error}>{otpError}</Text>}
              <Text style={styles.hint}>Demo build: use OTP {DEMO_OTP}</Text>
              <PrimaryButton title="Verify" disabled={otp.length < 4} onPress={verify} style={{ marginTop: 16 }} />
              <Pressable disabled={timer > 0} onPress={() => setTimer(30)} style={{ marginTop: 16, alignSelf: 'center' }}>
                <Text style={{ color: timer > 0 ? colors.textMuted : colors.primary, fontWeight: '600' }}>
                  {timer > 0 ? `Resend OTP in 0:${timer.toString().padStart(2, '0')}` : 'Resend OTP'}
                </Text>
              </Pressable>
            </>
          )}

          {step === 'profile' && (
            <>
              <Text style={styles.title}>Almost there!</Text>
              <Text style={styles.sub}>Tell us a little about yourself.</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                style={[styles.inputRow, styles.input, { paddingHorizontal: 16 }]}
                placeholderTextColor={colors.textMuted}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email (optional)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.inputRow, styles.input, { paddingHorizontal: 16, marginTop: 12 }]}
                placeholderTextColor={colors.textMuted}
              />
              {!validEmail && <Text style={styles.error}>Enter a valid email address.</Text>}
              <PrimaryButton
                title="Continue"
                icon="chevron-forward"
                disabled={name.trim().length < 2 || !validEmail}
                onPress={finish}
                style={{ marginTop: 20 }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 300, alignItems: 'center', overflow: 'hidden' },
  heroText: { color: colors.white, marginTop: 12, fontSize: 15, fontWeight: '600', opacity: 0.95 },
  body: { padding: 24, flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: 6, marginBottom: 20 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    height: 56,
  },
  prefix: { paddingHorizontal: 14, fontSize: 16, fontWeight: '600', color: colors.text, borderRightWidth: 1, borderRightColor: colors.border },
  input: { flex: 1, fontSize: 17, color: colors.text, paddingHorizontal: 14, height: 56 },
  legal: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 18 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  backText: { color: colors.primary, fontWeight: '700' },
  otpRow: { flexDirection: 'row', gap: 14, justifyContent: 'center' },
  otpBox: {
    width: 58,
    height: 62,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  otpDigit: { fontSize: 24, fontWeight: '800', color: colors.text },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  error: { color: colors.red, marginTop: 10, fontWeight: '600', textAlign: 'center' },
  hint: { color: colors.textMuted, marginTop: 12, textAlign: 'center', fontSize: 12 },
});
