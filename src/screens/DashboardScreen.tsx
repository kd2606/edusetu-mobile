import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '@react-navigation/native';

export function DashboardScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ streak: 0, xp: 0, nodes: 0 });
  const { showToast } = useToast();
  const navigation = useNavigation<any>();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile(user.user_metadata);
        setStats({
          streak: user.user_metadata?.current_streak || 0,
          xp: user.user_metadata?.xp || 0,
          nodes: user.user_metadata?.nodes_completed || 0,
        });
        showToast(`Bada lamba gap le liya ${user.user_metadata?.full_name || ''}... aise ruk-ruk ke karoge toh maza kaise aayega?`);
      }
    }
    fetchProfile();
  }, []);

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <View>
          <Text style={s.heading}>Dashboard</Text>
          <Text style={s.sub}>Welcome back, {profile?.full_name || 'Learner'}</Text>
        </View>
        <TouchableOpacity style={s.progressBtn} onPress={() => navigation.navigate('Progress')}>
          <Text style={s.progressBtnText}>View Progress 🏆</Text>
        </TouchableOpacity>
      </View>

      <View style={s.grid}>
        <View style={s.card}>
          <View style={s.cardTop}>
            <Text style={s.cardLabel}>Streak</Text>
            <Text style={{ fontSize: 16 }}>🔥</Text>
          </View>
          <Text style={s.cardValue}>{stats.streak} Days</Text>
        </View>

        <View style={s.card}>
          <View style={s.cardTop}>
            <Text style={s.cardLabel}>Total XP</Text>
            <Text style={{ fontSize: 16 }}>🏆</Text>
          </View>
          <Text style={s.cardValue}>{stats.xp}</Text>
        </View>
      </View>

      <View style={[s.card, { width: '100%' }]}>
        <View style={s.cardTop}>
          <Text style={s.cardLabel}>Nodes Completed</Text>
          <Text style={{ fontSize: 16 }}>🎯</Text>
        </View>
        <Text style={s.cardValue}>{stats.nodes}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 56 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sub: { color: '#a1a1aa', marginTop: 4, fontSize: 14 },
  progressBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  progressBtnText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  card: {
    width: '48%', backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a',
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardLabel: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  cardValue: { fontSize: 24, fontWeight: '800', color: '#fff' },
});
