import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3enR4anRjZmR2c3JrZ3Jld3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc2MTEwNiwiZXhwIjoyMDc3MzM3MTA2fQ.yc0XnPmjvPCxoN8dIOPxZGbk7-5LqK-AkI2jve9Dmyk!,
  process.env.https://ewztxjtcfdvsrkgrewyg.supabase.co!
);
