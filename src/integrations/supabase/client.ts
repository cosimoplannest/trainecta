// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nvzgwtgexahpnenjnhgr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52emd3dGdleGFocG5lbmpuaGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjExODEsImV4cCI6MjA2MDE5NzE4MX0.3KXCylyUWswelENJsqZqmhiSGrsiCG1U9oz7ZD26BCs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);