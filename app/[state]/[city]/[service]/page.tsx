import { getCityData, getRelatedCities } from '@/lib/data-fetching'
import ServiceSpecificPage from '@/components/ServiceSpecificPage'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getSiteConfig } from '@/lib/site-config'
import { getNicheConfig } from '@/lib/niche-configs'
import { getSEOContent } from '@/lib/seo-content'

// Generic Revalidation (ISR)
export const revalidate = 60 // Refresh every minute
export const dynamicParams = true

interface StartServicePageProps {
    params: Promise<{
        state: string
        city: string
        service: string
    }>
}

export async function generateMetadata(props: StartServicePageProps): Promise<Metadata> {
    const params = await props.params
    const { state, city, service } = params
    const siteConfig = await getSiteConfig()

    const formattedCity = city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const formattedState = state.toUpperCase()

    const seo = await getSEOContent({
        city: formattedCity,
        state: formattedState,
        pageType: 'service',
        serviceSlug: service
    })

    return {
        title: seo.metaTitle,
        description: seo.metaDescription,
        alternates: {
            canonical: `https://${siteConfig.domain}/${state.toLowerCase()}/${city.toLowerCase()}/${service}`
        },
        openGraph: {
            title: seo.metaTitle,
            description: seo.metaDescription,
            url: `https://${siteConfig.domain}/${state.toLowerCase()}/${city.toLowerCase()}/${service}`,
            images: siteConfig.seoSettings?.og_image_url ? [siteConfig.seoSettings.og_image_url] : [],
        }
    }
}

export default async function Page(props: StartServicePageProps) {
    const params = await props.params
    const { state, city, service } = params

    const siteConfig = await getSiteConfig()
    const niche = await getNicheConfig(siteConfig.nicheSlug)

    // Validate Service
    const serviceInfo = niche.services.find(s => s.slug === service)
    if (!serviceInfo) {
        return notFound()
    }

    // Fetch City Data
    const cityData = await getCityData(state, city)

    const cityName = cityData?.city || city
    const stateName = cityData?.state_name || state
    const stateCodeProper = cityData?.state_id || state

    // Fetch SEO content for the page
    const seo = await getSEOContent({
        city: cityName,
        state: stateName,
        pageType: 'service',
        serviceSlug: service
    })

    // Fetch related cities
    const relatedCities = await getRelatedCities(stateCodeProper, cityName)

    return <ServiceSpecificPage
        city={cityName}
        state={stateName}
        stateCode={stateCodeProper}
        service={{
            ...serviceInfo,
            description: (city: string, state: string) => `Searching for ${serviceInfo.title.toLowerCase()} near me in ${city}, ${state}? ${serviceInfo.description}`,
            heroImage: serviceInfo.heroImage || (serviceInfo as any).hero_image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80',
            features: (serviceInfo as any).features || [],
            benefits: (serviceInfo as any).benefits || [],
            process: (serviceInfo as any).process || [],
            materials: (serviceInfo as any).materials || [],
            faqs: (serviceInfo as any).faqs || []
        }}
        relatedCities={relatedCities}
        h1Title={seo.h1Title}
        latitude={cityData?.lat}
        longitude={cityData?.lng}
    />
}
