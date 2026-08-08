import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

type RoadmapData = { id: string; title: string; domain: string; created_at: string };

export function RoadmapsScreen() {
  const navigation = useNavigation<any>();
  const [roadmaps, setRoadmaps] = useState<RoadmapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoadmaps() {
      const { data } = await supabase
        .from('roadmaps')
        .select('id, title, domain, created_at')
        .order('created_at', { ascending: false });
      if (data) setRoadmaps(data);
      setLoading(false);
    }
    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.heading}>My Roadmaps</Text>
      <Text style={s.sub}>View all your saved learning paths.</Text>

      {roadmaps.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>No roadmaps generated yet. Go to the web app to create one!</Text>
        </View>
      ) : (
        roadmaps.map((rm) => (
          <TouchableOpacity
            key={rm.id}
            style={s.card}
            onPress={() => navigation.navigate('RoadmapDetails', { id: rm.id, title: rm.title })}
          >
            <View style={s.icon}>
              <Text style={{ fontSize: 18 }}>🗺️</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle} numberOfLines={1}>{rm.title}</Text>
              <View style={s.cardMeta}>
                <Text style={s.cardDomain}>{rm.domain}</Text>
                <Text style={s.cardDate}>{new Date(rm.created_at).toLocaleDateString()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingTop: 56 },
  center: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sub: { color: '#a1a1aa', marginTop: 4, marginBottom: 20, fontSize: 14 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#27272a', borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 16 },
  emptyText: { color: '#a1a1aa', textAlign: 'center', fontSize: 14 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181b',
    borderWidth: 1, borderColor: '#27272a', borderRadius: 16, padding: 16, marginBottom: 12,
  },
  icon: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(37,99,235,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardDomain: { color: '#a1a1aa', fontSize: 12, textTransform: 'capitalize' },
  cardDate: { color: '#71717a', fontSize: 11 },
});
