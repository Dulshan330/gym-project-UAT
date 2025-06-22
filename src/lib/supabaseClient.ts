// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epnyqvziuvshahrfrtiz.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbnlxdnppdXZzaGFocmZydGl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxODc4NDcsImV4cCI6MjA1Nzc2Mzg0N30.wQJAeDsvCMN11YG1CybhrRE9DKLo37OYBxrMAfFKho4';  // Supabase anon public key

export const supabase = createClient(supabaseUrl, supabaseKey);
