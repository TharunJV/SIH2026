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

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Helper to check live database connectivity
 */
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('id, name')
      .limit(1);

    if (error) {
      return {
        connected: false,
        error: error.message,
      };
    }

    return {
      connected: true,
      message: `Successfully connected to Supabase (${data?.length ?? 0} test rows retrieved)`,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err?.message || 'Unknown network error',
    };
  }
};
