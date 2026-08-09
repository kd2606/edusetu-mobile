import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Hardcoded for production APK builds (anon key is public/safe to expose)
const supabaseUrl = 'https://tphhkpkuwncfqbuoxrjf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaGhrcGt1d25jZnFidW94cmpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODI1MDcsImV4cCI6MjA5NzA1ODUwN30.qVF4gh8SQVcUZHC3CG48oYBl832uUIin58TJ7k-GBNg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
