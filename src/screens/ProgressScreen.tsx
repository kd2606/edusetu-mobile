import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

// Logic exactly like web
function getLevelFromXP(xp: number) {
  let level = 1;
  let requiredXP = 1000; // XP needed for Level 2
  let remainingXP = xp;

  while (remainingXP >= requiredXP) {
    remainingXP -= requiredXP;
    level++;
    requiredXP = Math.floor(requiredXP * 1.5);
  }

  return { level, currentXPInLevel: remainingXP, requiredXPForNextLevel: requiredXP };
}

export function ProgressScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 0, streak: 0, nodes: 0 });
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStats({
          xp: user.user_metadata?.xp || 0,
          streak: user.user_metadata?.current_streak || 0,
          nodes: user.user_metadata?.nodes_completed || 0,
        });
      }
      setLoading(false);
      showToast('Uff, itna deep jaa chuke ho? Pura stamina yahin nikal doge kya aaj?');
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const { level, currentXPInLevel, requiredXPForNextLevel } = getLevelFromXP(stats.xp);
  const progressPercent = Math.min(100, Math.max(0, (currentXPInLevel / requiredXPForNextLevel) * 100));

  return (
    <View style={s.container}>
      <Text style={s.heading}>Progress</Text>
      <Text style={s.sub}>Track your learning journey and level up.</Text>

      <View style={s.levelCard}>
        <View style={s.levelHeader}>
          <Text style={s.levelText}>Level {level}</Text>
          <Text style={s.xpText}>{currentXPInLevel} / {requiredXPForNextLevel} XP</Text>
        </View>
        <View style={s.progressBarBg}>
          <View style={[s.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={s.remainingText}>
          {requiredXPForNextLevel - currentXPInLevel} XP to Level {level + 1}
        </Text>
      </View>

      <View style={s.statsGrid}>
        <View style={s.statBox}>
          <Text style={s.statEmoji}>🔥</Text>
          <Text style={s.statValue}>{stats.streak} Days</Text>
          <Text style={s.statLabel}>Current Streak</Text>
        </View>
        <View style={s.statBox}>
          <Text style={s.statEmoji}>🎯</Text>
          <Text style={s.statValue}>{stats.nodes}</Text>
          <Text style={s.statLabel}>Nodes Finished</Text>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 56 },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sub: { color: '#a1a1aa', marginTop: 4, fontSize: 14, marginBottom: 32 },
  levelCard: { backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, padding: 20 },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  levelText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  xpText: { fontSize: 14, fontWeight: '600', color: '#a1a1aa' },
  progressBarBg: { height: 12, backgroundColor: '#27272a', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#2563eb', borderRadius: 6 },
  remainingText: { marginTop: 12, fontSize: 13, color: '#a1a1aa', textAlign: 'right' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  statBox: { width: '48%', backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, padding: 16, alignItems: 'center' },
  statEmoji: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#a1a1aa', fontWeight: '500' },
});
