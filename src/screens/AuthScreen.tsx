import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { supabase } from '../lib/supabase';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { data: { session }, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: 'edusetu://' }
    });
    if (error) Alert.alert('Error', error.message);
    else if (!session) Alert.alert('Success', 'Please check your inbox for email verification!');
    setLoading(false);
  }

  async function signInWithGoogle() {
    setLoading(true);
    // On web, this redirects seamlessly. On native, it may require setting up linking/app scheme.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: Platform.OS === 'web' ? window.location.origin : 'edusetu://'
      }
    });
    if (error) Alert.alert('Google Sign-In Error', error.message);
    setLoading(false);
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.logo}>🎓</Text>
        <Text style={s.title}>EduSetu</Text>
        <Text style={s.subtitle}>Your AI-powered learning journey begins here.</Text>
      </View>

      <View style={s.form}>
        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input}
          onChangeText={setEmail}
          value={email}
          placeholder="you@example.com"
          placeholderTextColor="#71717a"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[s.label, { marginTop: 16 }]}>Password</Text>
        <TextInput
          style={s.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#71717a"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={isLogin ? signInWithEmail : signUpWithEmail}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.googleBtn, loading && { opacity: 0.6 }]}
          disabled={loading}
          onPress={signInWithGoogle}
        >
          <Text style={{ fontSize: 18, marginRight: 8 }}>G</Text>
          <Text style={s.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.toggle} onPress={() => setIsLogin(!isLogin)}>
          <Text style={s.toggleText}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Text style={s.toggleLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#0a0a0a' },
  header: { alignItems: 'center', marginBottom: 48 },
  logo: { fontSize: 56 },
  title: { fontSize: 30, fontWeight: '800', color: '#ffffff', marginTop: 12, letterSpacing: -0.5 },
  subtitle: { color: '#a1a1aa', marginTop: 8, textAlign: 'center', fontSize: 14 },
  form: {},
  label: { color: '#a1a1aa', marginBottom: 8, fontWeight: '600', fontSize: 13 },
  input: {
    height: 48, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a',
    borderRadius: 12, paddingHorizontal: 16, color: '#ffffff', fontSize: 15,
  },
  btn: {
    height: 48, backgroundColor: '#2563eb', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 32,
  },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  googleBtn: {
    height: 48, backgroundColor: '#ffffff', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 12,
    flexDirection: 'row',
  },
  googleBtnText: { color: '#0a0a0a', fontWeight: '700', fontSize: 15 },
  toggle: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#a1a1aa', fontSize: 13 },
  toggleLink: { color: '#2563eb', fontWeight: '600' },
});
