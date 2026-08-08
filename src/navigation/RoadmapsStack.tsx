import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RoadmapsScreen } from '../screens/RoadmapsScreen';
import { RoadmapDetailsScreen } from '../screens/RoadmapDetailsScreen';

export type RoadmapsStackParamList = {
  RoadmapsList: undefined;
  RoadmapDetails: { id: string, title: string };
};

const Stack = createNativeStackNavigator<RoadmapsStackParamList>();

export function RoadmapsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a0a0a' } }}>
      <Stack.Screen name="RoadmapsList" component={RoadmapsScreen} />
      <Stack.Screen 
        name="RoadmapDetails" 
        component={RoadmapDetailsScreen}
        options={{ headerShown: true, headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff' }} 
      />
    </Stack.Navigator>
  );
}
