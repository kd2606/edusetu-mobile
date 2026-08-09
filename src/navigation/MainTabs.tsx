import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStack } from './HomeStack';
import { ExploreScreen } from '../screens/ExploreScreen';
import { NewRoadmapScreen } from '../screens/NewRoadmapScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RoadmapsStack } from './RoadmapsStack';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopColor: '#27272a',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#a1a1aa',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any = 'square';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Explore') iconName = focused ? 'compass' : 'compass-outline';
          else if (route.name === 'Create') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Roadmaps') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Settings') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="Create"
        component={NewRoadmapScreen}
        options={{ tabBarLabel: 'Create' }}
      />
      <Tab.Screen
        name="Roadmaps"
        component={RoadmapsStack}
        options={{ tabBarLabel: 'My Paths' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
