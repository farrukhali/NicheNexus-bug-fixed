import { supabase } from './supabase'
import { headers } from 'next/headers'

// SEO Settings Interface
export interface SEOSettings {
    ga4_measurement_id?: string
    gtm_container_id?: string
    search_console_verification?: string
    h1_template_home?: string
    h1_template_state?: string
    h1_template_city?: string
    h1_template_service?: string
    meta_title_home?: string
    meta_description_home?: string
    meta_title_state?: string
    meta_description_state?: string
    meta_title_city?: string
    meta_description_city?: string
    meta_title_service?: string
    meta_description_service?: string
    og_image_url?: string
    favicon_url?: string
    sitemap_enabled?: boolean
    sitemap_update_frequency?: string
}

// Expert/Author Settings Interface
export interface ExpertSettings {
    name?: string
    title?: string
    bio?: string
    photo_url?: string
    license_number?: string
    years_experience?: number
    certifications?: string[]
}

// Trust Signals Interface
export interface TrustSignals {
    years_in_business?: number
    average_rating?: number
    total_reviews?: number
    projects_completed?: number
    warranty_details?: string
    certifications?: string[]
    service_guarantee?: string
}

export interface SiteConfig {
    domain: string;
    nicheSlug: string;
    siteName: string;
    contactPhone: string;
    contactEmail: string;
    gscId?: string;
    ga4Id?: string;
    clarityId?: string;
    openRouterKey?: string;
    // Business Address
    businessAddress?: string;
    businessCity?: string;
    businessState?: string;
    businessZip?: string;
    // Social Media
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    // Branding
    footerTagline?: string;
    logoUrl?: string;
    // AI Settings
    aiSettings?: {
        model: string;
        promptTemplate: string;
    };
    // SEO Settings
    seoSettings?: SEOSettings;
    // Expert/Author Settings
    expertSettings?: ExpertSettings;
    // Trust Signals
    trustSignals?: TrustSignals;
}

export const getSiteConfig = async (): Promise<SiteConfig> => {
    // 1. Try resolving by Domain (Host Header)
    let host = ''
    try {
        const headersList = await headers()
        // Prioritize x-forwarded-host (common behind proxies like Coolify/Nginx)
        host = headersList.get('x-forwarded-host') || headersList.get('host') || ''
        // Remove port if present (e.g., localhost:3000 -> localhost)
        if (host.includes(':')) host = host.split(':')[0]
    } catch (e) {
        // Headers might not be available in all contexts (e.g. static gen), ignore
    }

    if (host && host !== 'localhost') {
        const { data, error } = await supabase
            .from('site_configs')
            .select('*')
            .eq('domain', host)
            .single()

        if (data && !error) {
            return mapConfigData(data, host)
        }
    }

    // 2. Fallback: Fetch by Niche Slug (from ENV)
    const nicheSlugFromEnv = (process.env.NEXT_PUBLIC_NICHE_SLUG || 'gutter').toLowerCase()
    try {
        const { data, error } = await supabase
            .from('site_configs')
            .select('*')
            .eq('niche_slug', nicheSlugFromEnv)
            .single()

        if (data && !error) {
            return mapConfigData(data, host)
        }
    } catch (e) {
        // Fallback failed
    }

    // 4. Last Resort: Environment Variables
    return {
        domain: host || process.env.NEXT_PUBLIC_SITE_DOMAIN || "localhost",
        nicheSlug: nicheSlugFromEnv,
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Professional Services",
        contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "(555) 000-0000",
        contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@example.com",
        gscId: process.env.NEXT_PUBLIC_GSC_ID,
        ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
        clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
        openRouterKey: process.env.OPENROUTER_API_KEY,
    };
};

// Helper to map DB response to SiteConfig interface
function mapConfigData(data: any, actualHost?: string): SiteConfig {
    // If we are on a different host than what's in the DB (e.g. test URL or localhost fallback)
    // we prefer the actual host for Canonical/Sitemaps to work correctly.
    const domain = (actualHost && (data.domain === 'localhost' || !data.domain))
        ? actualHost
        : data.domain;

    return {
        domain: domain,
        nicheSlug: data.niche_slug,
        siteName: data.site_name,
        contactPhone: data.contact_phone,
        contactEmail: data.contact_email,
        gscId: data.gsc_id,
        ga4Id: data.ga4_id,
        clarityId: data.clarity_id,
        openRouterKey: data.open_router_key,
        // Business Address
        businessAddress: data.business_address,
        businessCity: data.business_city,
        businessState: data.business_state,
        businessZip: data.business_zip,
        // Social Media
        facebookUrl: data.facebook_url,
        instagramUrl: data.instagram_url,
        twitterUrl: data.twitter_url,
        linkedinUrl: data.linkedin_url,
        // Branding
        footerTagline: data.footer_tagline,
        logoUrl: data.logo_url,
        aiSettings: data.ai_settings || { model: 'openai/gpt-4o-mini', promptTemplate: '' },
        seoSettings: data.seo_settings || {},
        expertSettings: data.expert_settings || {},
        trustSignals: data.trust_signals || {}
    }
}
