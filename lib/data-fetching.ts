import { supabase } from '@/lib/supabase'
import { leadsSupabase } from '@/lib/leads-supabase'

export async function getCityData(stateCode: string, citySlug: string) {
    // Convert slug back to potential search term (e.g. 'new-york' -> 'New York')
    // We use ilike to be safe.
    const citySearchTerm = citySlug.replace(/-/g, ' ')

    const { data, error } = await supabase
        .from('usa city name') // Table name from screenshot
        .select('*')
        .ilike('state_id', stateCode) // Column 'state_id' (e.g. 'PA')
        .ilike('city', citySearchTerm) // Column 'city' (e.g. 'Abbottstown')
        // We limit to 1. Note: There might be duplicate city names in same state (rare but possible with counties), 
        // strictly we might want to just take the first one found.
        .limit(1)
        .single()

    if (error || !data) {
        console.error('Error fetching city:', error)
        return null
    }
    return data
}

export async function getRelatedCities(stateCode: string, currentCity: string) {
    const { data } = await supabase
        .from('usa city name')
        .select('city, state_id')
        .eq('state_id', stateCode)
        .neq('city', currentCity)
        .order('population', { ascending: false })
        .limit(10)

    return data || []
}

export async function getNeighborhoods(city: string, stateCode: string) {
    try {
        const { data, error } = await leadsSupabase
            .from('neighborhoods')
            .select('*')
            .ilike('city', city)
            .ilike('state', stateCode)
            .limit(1)
            .single()

        if (error || !data) return null
        return data
    } catch (e) {
        return null
    }
}
