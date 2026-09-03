import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://gtoyomeqnxcnfxaeydaw.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_X9lzVh3FWwVNQv4ixDstqg_Zg5F_CwG';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon/Publishable Key is missing. Check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Helper to check live database & auth connectivity
 */
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  tableTested?: string;
  rowCount?: number;
  message?: string;
  error?: string;
}> => {
  try {
    // Try districts table first
    const { data: dData, error: dError } = await supabase
      .from('districts')
      .select('id, name')
      .limit(5);

    if (!dError && dData) {
      return {
        connected: true,
        tableTested: 'districts',
        rowCount: dData.length,
        message: `Connected to Supabase DB (districts table verified: ${dData.length} records)`,
      };
    }

    // Fallback: try universities table
    const { data: uData, error: uError } = await supabase
      .from('universities')
      .select('id, name')
      .limit(5);

    if (!uError && uData) {
      return {
        connected: true,
        tableTested: 'universities',
        rowCount: uData.length,
        message: `Connected to Supabase DB (universities table verified: ${uData.length} records)`,
      };
    }

    // Fallback: Ping auth service endpoint
    const { data: authSession, error: authError } = await supabase.auth.getSession();
    if (!authError) {
      return {
        connected: true,
        tableTested: 'auth_service',
        rowCount: 0,
        message: 'Connected to Supabase Auth Service',
      };
    }

    return {
      connected: false,
      error: dError?.message || uError?.message || authError?.message || 'Unable to connect to Supabase tables',
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || 'Unknown network error during Supabase ping',
    };
  }
};

