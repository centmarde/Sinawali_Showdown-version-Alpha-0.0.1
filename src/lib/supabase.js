import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
  'https://fahdbotkfakphwjjhgpb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhaGRib3RrZmFrcGh3ampoZ3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NTAxNjgsImV4cCI6MjA0NTUyNjE2OH0.pcho4B4wnW5gSoHpSPV1xyWK2-NqhPBraLiUdFWIOIA'
);