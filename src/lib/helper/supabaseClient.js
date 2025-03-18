import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kohjcrdirmvamsjcefew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvaGpjcmRpcm12YW1zamNlZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjczMzA2MTMsImV4cCI6MjA0MjkwNjYxM30.nuysQR2UPTch2YbRDPYWAgp14Ofi73gL72T9j6JIDM4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
});