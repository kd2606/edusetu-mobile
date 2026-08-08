import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export function SettingsScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile(user.user_metadata);
        setFullName(user.user_metadata?.full_name || '');
        setBio(user.user_metadata?.bio || '');
      }
      const savedApiUrl = await AsyncStorage.getItem('API_URL');
      if (savedApiUrl) setApiUrl(savedApiUrl);
      
      setLoading(false);
    }
    fetchProfile();
    showToast("Apna 'bio' bada kar rahe ho ya sirf dikhava hai?");
  }, []);

  async function handleSave() {
    setSaving(true);
    await AsyncStorage.setItem('API_URL', apiUrl || 'http://192.168.1.100:3000');
    
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, bio: bio }
    });
    setSaving(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      showToast("Lo badal gaya tumhara 'profile'. Size matters, haina?");
    }
  }

  async function handleSignOut() {
    showToast('Beech mein hi chhod ke jaa rahe ho? Pura toh kar lete...');
    setTimeout(async () => {
      await supabase.auth.signOut();
    }, 1500);
  }

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.heading}>Settings</Text>
      <Text style={s.sub}>Manage your profile and preferences.</Text>

      <View style={s.form}>
        <Text style={s.label}>Full Name</Text>
        <TextInput
          style={s.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your Name"
          placeholderTextColor="#71717a"
        />

        <Text style={[s.label, { marginTop: 16 }]}>Bio</Text>
        <TextInput
          style={[s.input, { height: 100, textAlignVertical: 'top' }]}
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about yourself..."
          placeholderTextColor="#71717a"
          multiline
        />

        <Text style={[s.label, { marginTop: 16 }]}>Backend API URL (For AI)</Text>
        <TextInput
          style={s.input}
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder="http://192.168.x.x:3000"
          placeholderTextColor="#71717a"
          autoCapitalize="none"
        />

        <TouchableOpacity style={[s.btn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>

      <View style={s.dangerZone}>
        <TouchableOpacity style={s.logoutBtn} onPress={handleSignOut}>
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 56 },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sub: { color: '#a1a1aa', marginTop: 4, fontSize: 14, marginBottom: 32 },
  form: { backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, padding: 16 },
  label: { color: '#a1a1aa', marginBottom: 8, fontWeight: '600', fontSize: 13 },
  input: {
    height: 48, backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#27272a',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#ffffff', fontSize: 15,
  },
  btn: {
    height: 48, backgroundColor: '#2563eb', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
  },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 16 },
  dangerZone: { marginTop: 'auto', marginBottom: 20 },
  logoutBtn: { backgroundColor: '#27272a', padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 16 },
});
