import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { useNavigation } from '@react-navigation/native';

export function ExploreScreen() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigation = useNavigation<any>();

  useEffect(() => {
    async function fetchPublicRoadmaps() {
      // Assuming all roadmaps might be public, or we fetch a limit
      const { data, error } = await supabase
        .from('roadmaps')
        .select(`
          id,
          title,
          topic,
          created_at,
          profiles ( full_name )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) setRoadmaps(data);
      setLoading(false);
      showToast('Dusro ka dekhne ka itna shauk hai? Apna khud ka bhi bada karo na thoda... (roadmap)');
    }
    fetchPublicRoadmaps();
  }, []);

  if (loading) {
    return (
      <View style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <Text style={s.heading}>Explore</Text>
      <Text style={s.sub}>Discover roadmaps created by the community.</Text>

      <FlatList
        data={roadmaps}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={s.card} 
            onPress={() => navigation.navigate('Roadmaps', { screen: 'Details', params: { id: item.id } })}
          >
            <Text style={s.cardTitle}>{item.title}</Text>
            <Text style={s.cardTopic}>{item.topic}</Text>
            <View style={s.cardFooter}>
              <Text style={s.author}>By {item.profiles?.full_name || 'Anonymous'}</Text>
              <Text style={s.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20, paddingTop: 56 },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  sub: { color: '#a1a1aa', marginTop: 4, fontSize: 14, marginBottom: 24 },
  card: {
    backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a',
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardTopic: { color: '#2563eb', fontSize: 14, fontWeight: '600', marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { color: '#a1a1aa', fontSize: 12 },
  date: { color: '#71717a', fontSize: 12 },
});
