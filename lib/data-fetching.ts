import { supabase } from '@/lib/supabase'
import { leadsSupabase } from '@/lib/leads-supabase'

export async function getCityData(stateCode: string, citySlug: string) {
    // Convert slug back to potential search term (e.g. 'new-york' -> 'New York')
    const citySearchTerm = citySlug.replace(/-/g, ' ')

    // Try city_ascii first (handles ASCII slugs like 'mariano-colon' → 'Mariano Colon')
    const { data: asciiData, error: asciiError } = await supabase
        .from('usa city name')
        .select('*')
        .ilike('state_id', stateCode)
        .ilike('city_ascii', citySearchTerm)
        .limit(1)
        .single()

    if (asciiData && !asciiError) {
        return asciiData
    }

    // Fallback: try the original city column (for backward compatibility)
    const { data, error } = await supabase
        .from('usa city name')
        .select('*')
        .ilike('state_id', stateCode)
        .ilike('city', citySearchTerm)
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
