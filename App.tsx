import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from './src/lib/supabase';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainTabs } from './src/navigation/MainTabs';
import { NavigationContainer } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';
import { ToastProvider } from './src/context/ToastContext';
import { FlirtyToast } from './src/components/FlirtyToast';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Deep linking for Supabase Email Verification / Magic Links
    const handleDeepLink = async (url: string | null) => {
      if (!url) return;
      // Supabase verification returns URL with fragments like #access_token=...&refresh_token=...
      const hash = url.split('#')[1];
      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }
      }
    };

    Linking.getInitialURL().then(handleDeepLink);
    const linkingSubscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      linkingSubscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View style={s.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer>
          {session && session.user ? <MainTabs /> : <AuthScreen />}
        </NavigationContainer>
        <FlirtyToast />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  loader: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
});
