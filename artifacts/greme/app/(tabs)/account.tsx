import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { GremeLogo } from '@/components/GremeLogo';
import { EmptyState } from '@/components/EmptyState';
import { useColors } from '@/hooks/useColors';
import { supabase } from '@/lib/supabase';

export default function AccountScreen() {
  const colors = useColors();
  const router = useRouter();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => setSessionEmail(data.session?.user.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSessionEmail(nextSession?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submitAuth() {
    if (!supabase) {
      Alert.alert('Supabase is not configured', 'Add your project URL and publishable key to the app environment.');
      return;
    }
    if (!email.trim() || password.length < 6) {
      Alert.alert('Check your details', 'Enter a valid email and a password with at least 6 characters.');
      return;
    }
    setBusy(true);
    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (result.error) Alert.alert('We couldn’t sign you in', result.error.message);
    else if (mode === 'register' && !result.data.session) Alert.alert('Check your inbox', 'Confirm your email to finish creating your account.');
  }

  async function resetPassword() {
    if (!supabase || !email.trim()) {
      Alert.alert('Enter your email first', 'We’ll send a secure reset link to your inbox.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    Alert.alert(error ? 'Unable to send reset link' : 'Reset link sent', error?.message ?? 'Check your inbox for the next step.');
  }

  if (sessionEmail) {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 18 }} style={{ backgroundColor: colors.background, flex: 1 }}>
        <GremeLogo />
        <View style={{ backgroundColor: colors.darkForest, borderRadius: 22, marginTop: 28, padding: 22 }}>
          <Text style={{ color: colors.tan, fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>your account</Text>
          <Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 22, marginTop: 10 }}>{sessionEmail}</Text>
          <Text style={{ color: colors.tan, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20, marginTop: 8 }}>Your saved pieces, orders, and details will live here.</Text>
        </View>
        <Pressable onPress={() => router.push('/orders')} style={{ alignItems: 'center', backgroundColor: colors.white, borderRadius: 17, flexDirection: 'row', marginTop: 18, padding: 17 }}>
          <Feather name="package" size={18} color={colors.forest} />
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14, marginLeft: 12 }}>Order history</Text>
          <Feather name="chevron-right" size={17} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
        </Pressable>
        <Pressable onPress={() => void supabase?.auth.signOut()} style={{ alignItems: 'center', borderColor: colors.line, borderRadius: 17, borderWidth: 1, marginTop: 12, padding: 15 }}>
          <Text style={{ color: colors.forest, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Log out</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 18 }} style={{ backgroundColor: colors.background, flex: 1 }}>
      <GremeLogo />
      <View style={{ marginTop: 42 }}>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 30 }}>{mode === 'login' ? 'Welcome back' : 'Join grème'}</Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 8 }}>
          {mode === 'login' ? 'Your beautifully considered edit is waiting.' : 'Create an account to save pieces and follow every order.'}
        </Text>
        <TextInput autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="Email address" placeholderTextColor={colors.mutedForeground} style={{ backgroundColor: colors.white, borderColor: colors.line, borderRadius: 15, borderWidth: 1, color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 26, paddingHorizontal: 15, paddingVertical: 14 }} value={email} />
        <TextInput autoCapitalize="none" onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.mutedForeground} secureTextEntry style={{ backgroundColor: colors.white, borderColor: colors.line, borderRadius: 15, borderWidth: 1, color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 10, paddingHorizontal: 15, paddingVertical: 14 }} value={password} />
        <Pressable disabled={busy} onPress={() => void submitAuth()} style={({ pressed }) => ({ alignItems: 'center', backgroundColor: colors.forest, borderRadius: 17, marginTop: 16, opacity: busy ? 0.55 : pressed ? 0.8 : 1, paddingVertical: 15 })}>
          <Text style={{ color: colors.white, fontFamily: 'Inter_700Bold', fontSize: 14 }}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</Text>
        </Pressable>
        {mode === 'login' ? (
          <Pressable onPress={() => void resetPassword()} style={{ alignSelf: 'center', marginTop: 16, padding: 5 }}>
            <Text style={{ color: colors.forest, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>Forgot password?</Text>
          </Pressable>
        ) : null}
        <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ alignSelf: 'center', marginTop: 16, padding: 5 }}>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13 }}>
            {mode === 'login' ? 'New to grème? ' : 'Already have an account? '}
            <Text style={{ color: colors.forest, fontFamily: 'Inter_700Bold' }}>{mode === 'login' ? 'Create one' : 'Log in'}</Text>
          </Text>
        </Pressable>
      </View>
      {!supabase ? <EmptyState title="Connect your Supabase project" message="Authentication becomes available as soon as the configured project URL and publishable key are present." /> : null}
    </ScrollView>
  );
}