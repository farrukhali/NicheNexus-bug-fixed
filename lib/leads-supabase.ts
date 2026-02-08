import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.LEADS_SUPABASE_URL || ''
const supabaseKey = process.env.LEADS_SUPABASE_SERVICE_ROLE_KEY || ''

export const leadsSupabase = createClient(supabaseUrl, supabaseKey)

if (!supabaseUrl || !supabaseKey) {
    console.warn('WARNING: Lead database credentials missing in .env')
}
