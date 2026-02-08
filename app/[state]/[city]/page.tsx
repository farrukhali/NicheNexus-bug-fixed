import { supabase } from '@/lib/supabase'
import ServicePage from '@/components/ServicePage'
// import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Allow ISR
export const revalidate = 60 // Refresh every minute
export const dynamicParams = true

import { getCityData, getRelatedCities } from '@/lib/data-fetching'

interface PageProps {
    params: Promise<{
        state: string
        city: string
    }>
}

import { getSEOContent } from '@/lib/seo-content'
import { getSiteConfig } from '@/lib/site-config'

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const { state, city } = params
    const siteConfig = await getSiteConfig()

    // Fetch data for accurate State Name
    const cityData = await getCityData(state, city)

    // Format City/State for display
    const formattedCity = cityData?.city || city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const stateCode = cityData?.state_id || state.toUpperCase()
    const stateName = cityData?.state_name || stateCode

    const seo = await getSEOContent({
        city: formattedCity,
        state: stateName,
        stateCode,
        pageType: 'city'
    })

    return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        keywords: `${(seo.metaKeywords || []).join(', ')}, ${formattedCity}, ${stateCode}`,
        alternates: {
            canonical: `https://${siteConfig.domain}/${state.toLowerCase()}/${city.toLowerCase()}`
        },
        openGraph: {
            title: seo.metaTitle,
            description: seo.metaDescription,
            url: `https://${siteConfig.domain}/${state}/${city}`,
            images: siteConfig.seoSettings?.og_image_url ? [siteConfig.seoSettings.og_image_url] : [],
        }
    }
}



export default async function Page(props: PageProps) {
    const params = await props.params
    const { state, city } = params

    const cityData = await getCityData(state, city)

    // If data found, use it to populate the component. 
    // If not found, we fall back to URL params for robustness or show 404.
    // We'll map the DB columns to the component props.
    const cityName = cityData?.city || city
    const stateName = cityData?.state_name || state
    const stateCodeProper = cityData?.state_id || state

    // Parse zip codes from space-separated string
    const zipCodes = cityData?.zips ? cityData.zips.split(' ').filter(Boolean) : []

    // Fetch related cities
    const relatedCities = await getRelatedCities(stateCodeProper, cityName)

    return <ServicePage
        city={cityName}
        state={stateName}
        stateCode={stateCodeProper}
        zipCodes={zipCodes}
        relatedCities={relatedCities}
        latitude={cityData?.lat}
        longitude={cityData?.lng}
        customIntro={cityData?.seo_intro}
    />
}
