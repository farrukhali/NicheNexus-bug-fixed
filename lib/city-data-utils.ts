/**
 * City Data Enrichment Types & Utilities
 * 
 * Provides strongly-typed interfaces for enriched city data
 * and utilities for population-based content tiering.
 */

export interface EnrichedCityData {
    city: string
    city_ascii: string
    state_id: string
    state_name: string
    county_name: string
    county_fips: number
    lat: number
    lng: number
    population: number
    density: number
    timezone: string
    ranking: number
    zips: string
    military: boolean
    incorporated: boolean
}

/**
 * Population-based content tiers
 * 
 * Tier 1 (Flagship): 100K+   → ~300 cities, richest content
 * Tier 2 (Priority): 25K-100K → ~800 cities, full content
 * Tier 3 (Standard): 5K-25K  → ~3,000 cities, data-enriched templates
 * Tier 4 (Long-tail): <5K    → ~27,000 cities, minimal but differentiated
 */
export type PopulationTier = 1 | 2 | 3 | 4

export function getPopulationTier(population: number | null | undefined): PopulationTier {
    if (!population || population <= 0) return 4
    if (population >= 100000) return 1
    if (population >= 25000) return 2
    if (population >= 5000) return 3
    return 4
}

/**
 * Settlement type derived from population density
 */
export type SettlementType = 'urban' | 'suburban' | 'rural'

export function getSettlementType(density: number | null | undefined): SettlementType {
    if (!density || density <= 0) return 'rural'
    if (density >= 3000) return 'urban'
    if (density >= 500) return 'suburban'
    return 'rural'
}

/**
 * Population descriptor for natural language
 */
export function getPopulationDescriptor(population: number | null | undefined): string {
    if (!population || population <= 0) return 'small community'
    if (population >= 1000000) return 'major metropolitan area'
    if (population >= 500000) return 'large city'
    if (population >= 100000) return 'thriving city'
    if (population >= 50000) return 'growing community'
    if (population >= 25000) return 'mid-size community'
    if (population >= 10000) return 'established community'
    if (population >= 5000) return 'close-knit community'
    return 'small town'
}

/**
 * Format population with commas for display
 */
export function formatPopulation(population: number | null | undefined): string {
    if (!population || population <= 0) return ''
    return population.toLocaleString()
}

/**
 * Get density-based messaging for property types
 */
export function getDensityContext(density: number | null | undefined, niche: string): string {
    const type = getSettlementType(density)
    switch (type) {
        case 'urban':
            return `In densely developed neighborhoods, ${niche.toLowerCase()} solutions must account for tight lot lines, shared drainage systems, and local ordinances governing work in close quarters.`
        case 'suburban':
            return `Suburban properties typically feature larger roof spans and more complex drainage patterns, requiring customized ${niche.toLowerCase()} solutions that protect landscaping and foundation integrity.`
        case 'rural':
            return `Properties in rural settings often face unique challenges including longer gutter runs, proximity to tree canopies, and extended downspout routing for proper water management.`
    }
}

/**
 * Get county-specific content
 */
export function getCountyContext(countyName: string | null | undefined, stateCode: string, niche: string): string {
    if (!countyName) return ''
    return `Serving homeowners throughout ${countyName} County, ${stateCode} — our team is familiar with the local building codes, permit processes, and inspection requirements specific to your area.`
}

/**
 * Military installation context
 */
export function getMilitaryContext(isMilitary: boolean | null | undefined, city: string, niche: string): string {
    if (!isMilitary) return ''
    return `We're proud to serve military families stationed at ${city}. Ask about our military discount on all ${niche.toLowerCase()} services.`
}
