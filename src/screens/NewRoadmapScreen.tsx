import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '@react-navigation/native';

export function NewRoadmapScreen() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [time, setTime] = useState('2');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigation = useNavigation<any>();

  async function handleGenerate() {
    if (!topic) return Alert.alert('Error', 'Please enter a topic');
    setLoading(true);
    showToast('Ruko zara, sabar karo... itni jaldi nikal jayega kya roadmap?');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // In a real production app, this would point to your deployed Next.js API
      // For local development on device, replace with your PC's IP address
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.29.98:3000';
      
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          topic,
          level,
          timeDedicated: time,
          userId: session?.user?.id
        })
      });

      if (!res.ok) throw new Error('Failed to generate roadmap');
      
      const data = await res.json();
      
      showToast('Lo nikal gaya! Tumhara roadmap. Ab isko dhyan se use karna.');
      
      // Navigate to the roadmaps tab so user can see their new roadmap
      navigation.navigate('Roadmaps');
      setTopic('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
      showToast('Oof, kuch gadbad ho gayi. Try again?');
    } finally {
      setLoading(false);
    }
  }

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const times = ['1', '2', '4', '8'];

  return (
    <ScrollView style={s.container}>
      <Text style={s.heading}>Create New</Text>
      <Text style={s.sub}>Let AI build the perfect learning path for you.</Text>

      <View style={s.form}>
        <Text style={s.label}>What do you want to learn?</Text>
        <TextInput
          style={s.input}
          value={topic}
          onChangeText={setTopic}
          placeholder="e.g. React Native, Machine Learning..."
          placeholderTextColor="#71717a"
        />

        <Text style={[s.label, { marginTop: 24 }]}>Your Current Level</Text>
        <View style={s.row}>
          {levels.map(l => (
            <TouchableOpacity 
              key={l} 
              style={[s.chip, level === l && s.chipActive]}
              onPress={() => setLevel(l)}
            >
              <Text style={[s.chipText, level === l && s.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.label, { marginTop: 24 }]}>Time Dedicated (Hours/Week)</Text>
        <View style={s.row}>
          {times.map(t => (
            <TouchableOpacity 
              key={t} 
              style={[s.chip, time === t && s.chipActive]}
              onPress={() => setTime(t)}
            >
              <Text style={[s.chipText, time === t && s.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[s.btn, loading && { opacity: 0.6 }]} 
          onPress={handleGenerate} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>Generate Roadmap ✨</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 56 },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sub: { color: '#a1a1aa', marginTop: 4, fontSize: 14, marginBottom: 32 },
  form: { backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, padding: 20, marginBottom: 40 },
  label: { color: '#fff', marginBottom: 12, fontWeight: '600', fontSize: 15 },
  input: {
    height: 48, backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#27272a',
    borderRadius: 12, paddingHorizontal: 16, color: '#ffffff', fontSize: 15,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#27272a',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
  },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#a1a1aa', fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  btn: {
    height: 52, backgroundColor: '#fff', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 32,
  },
  btnText: { color: '#0a0a0a', fontWeight: '800', fontSize: 16 },
});
