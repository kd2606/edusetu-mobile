import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export function RoadmapDetailsScreen() {
  const route = useRoute();
  const { id, title } = route.params as { id: string; title: string };
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchDetails() {
      const { data } = await supabase.from('roadmaps').select('nodes').eq('id', id).single();
      if (data?.nodes) setNodes(data.nodes);
      setLoading(false);
      showToast('Akele-akele itni hard cheezein handle kar loge? Sath mein try karein?');
    }
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={s.heading}>{title}</Text>

      {nodes.map((node: any, index: number) => (
        <View key={node.id || index} style={s.row}>
          <View style={s.timeline}>
            <View style={[s.dot, node.data?.completed && s.dotDone]} />
            {index < nodes.length - 1 && <View style={s.line} />}
          </View>
          <View style={s.card}>
            <Text style={s.nodeTitle}>{node.data?.label || 'Step'}</Text>
            <Text style={s.nodeDesc}>{node.data?.description || 'No description available.'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 20 },
  center: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 24 },
  row: { flexDirection: 'row', marginBottom: 0 },
  timeline: { alignItems: 'center', marginRight: 14, width: 24 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#27272a', marginTop: 4 },
  dotDone: { backgroundColor: '#10b981' },
  line: { width: 2, flex: 1, backgroundColor: '#27272a', marginTop: 4 },
  card: {
    flex: 1, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a',
    borderRadius: 12, padding: 14, marginBottom: 12,
  },
  nodeTitle: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 6 },
  nodeDesc: { color: '#a1a1aa', fontSize: 13, lineHeight: 20 },
});
