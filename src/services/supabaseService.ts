import { supabase } from '../lib/supabase';

export interface DbDistrict {
  id: string;
  name: string;
  official_code?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbUniversity {
  id: string;
  name: string;
  aishe_code?: string;
  organization_id?: string;
  district_id?: string;
  created_at?: string;
  updated_at?: string;
  district?: DbDistrict;
}

export interface DbCollege {
  id: string;
  university_id: string;
  name: string;
  college_type: string;
  aishe_code?: string;
  address?: string;
  city?: string;
  district_id?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
  university?: DbUniversity;
}

export interface DbIndustryPartner {
  id: string;
  organization_id?: string;
  partner_type?: string;
  cin?: string;
  company_name?: string;
  roc_code?: string;
  company_category?: string;
  company_subcategory?: string;
  company_class?: string;
  authorized_capital?: number;
  paid_up_capital?: number;
  registration_date?: string;
  registered_address?: string;
  listing_status?: string;
  company_status?: string;
  state?: string;
  indian_or_foreign?: string;
  nic_code?: string;
  industrial_classification?: string;
  created_at?: string;
  updated_at?: string;
}

class SupabaseService {
  /**
   * Fetch all universities with their district details
   */
  async getUniversities(): Promise<{ data: DbUniversity[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select(`
          id,
          name,
          aishe_code,
          organization_id,
          district_id,
          created_at,
          updated_at,
          districts (
            id,
            name
          )
        `)
        .order('name', { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map((u: any) => ({
        ...u,
        district: u.districts || undefined,
      }));

      return { data: formatted, error: null };
    } catch (err: any) {
      console.error('Error fetching universities from Supabase:', err);
      return { data: null, error: err.message || 'Failed to fetch universities' };
    }
  }

  /**
   * Fetch colleges, optionally filtered by university_id
   */
  async getColleges(universityId?: string): Promise<{ data: DbCollege[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('colleges')
        .select(`
          id,
          university_id,
          name,
          college_type,
          aishe_code,
          address,
          city,
          district_id,
          phone,
          email,
          website,
          latitude,
          longitude,
          created_at,
          updated_at,
          universities (
            id,
            name
          )
        `)
        .order('name', { ascending: true });

      if (universityId) {
        query = query.eq('university_id', universityId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formatted = (data || []).map((c: any) => ({
        ...c,
        university: c.universities || undefined,
      }));

      return { data: formatted, error: null };
    } catch (err: any) {
      console.error('Error fetching colleges from Supabase:', err);
      return { data: null, error: err.message || 'Failed to fetch colleges' };
    }
  }

  /**
   * Fetch industry partners with pagination and search
   */
  async getIndustryPartners(options?: {
    limit?: number;
    offset?: number;
    search?: string;
    state?: string;
  }): Promise<{ data: DbIndustryPartner[] | null; count: number | null; error: string | null }> {
    try {
      const limit = options?.limit ?? 50;
      const offset = options?.offset ?? 0;

      let query = supabase
        .from('industry_partners')
        .select('*', { count: 'exact' })
        .order('company_name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (options?.search) {
        query = query.ilike('company_name', `%${options.search}%`);
      }

      if (options?.state) {
        query = query.eq('state', options.state);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      return { data, count, error: null };
    } catch (err: any) {
      console.error('Error fetching industry partners from Supabase:', err);
      return { data: null, count: null, error: err.message || 'Failed to fetch industry partners' };
    }
  }

  /**
   * Fetch all districts
   */
  async getDistricts(): Promise<{ data: DbDistrict[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      console.error('Error fetching districts from Supabase:', err);
      return { data: null, error: err.message || 'Failed to fetch districts' };
    }
  }
}

export const supabaseService = new SupabaseService();
