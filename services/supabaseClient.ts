import { createClient } from '@supabase/supabase-js';

// User-provided credentials
const supabaseUrl = 'https://kcnsubwxwynckntemfqx.supabase.co';
// This is an anon key, it's safe to be on the client-side.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbnN1Ynd4d3luY2tudGVtZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5OTQyNDUsImV4cCI6MjA2OTU3MDI0NX0.RBiOLn9cJkf_JOyLs54NHRmllfPTZM1UAFBanZkBYk8';

export const supabase = createClient(supabaseUrl, supabaseKey);
