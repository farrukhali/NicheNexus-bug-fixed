'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Settings, Globe, Phone, Mail, Plus, Save, Trash2, ShieldCheck, LogOut, Wand2, Loader2, Bot, X } from 'lucide-react'
import { generateNicheWithAI, DEFAULT_PROMPT } from '@/lib/ai-niche-generator'
import { generateAIContent } from '@/lib/ai-content'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { CldUploadWidget } from 'next-cloudinary'


const DEFAULT_SITE_CONFIG = {
    site_name: '',
    domain: '',
    contact_phone: '',
    contact_email: 'support@{{baseurl}}',
    niche_slug: '',
    gsc_id: '',
    ga4_id: '',
    gtm_container_id: '',
    clarity_id: '',
    open_router_key: '',
    // Business Address
    business_address: '',
    business_city: '',
    business_state: '',
    business_zip: '',
    // Social Media
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    linkedin_url: '',
    // Branding
    footer_tagline: '',
    logo_url: '',
    // AI Settings
    ai_settings: {
        model: 'openai/gpt-4o-mini',
        promptTemplate: DEFAULT_PROMPT
    },
    // Homepage Content
    homepage_content: '',
    // SEO Settings
    seo_settings: {
        gtm_container_id: '',
        h1_template_home: 'Find {{service}} Near Me',
        h1_template_state: '{{service}} in {{state}} | Local Experts',
        h1_template_city: '{{service}} in {{city}}, {{state}} | Same-Day Service',
        h1_template_service: '{{service}} Services in {{city}}',
        meta_title_home: '{{brand}} | {{service}} Services',
        meta_description_home: 'Welcome to {{brand}}. We provide top-rated {{service}} services nationwide.',
        meta_title_state: '{{service}} in {{state}} | {{brand}}',
        meta_description_state: 'Find local {{service}} experts in {{state}}. Get free quotes today!',
        meta_title_city: '{{service}} in {{city}}, {{state}} | {{brand}}',
        meta_description_city: 'Top-rated {{service}} in {{city}}, {{state}}. Licensed, insured professionals near you.',
        meta_title_service: '{{service}} in {{city}}, {{state}} | {{brand}}',
        meta_description_service: 'Expert {{service}} services in {{city}}, {{state}}. {{brand}} offers quality assurance.',
        meta_title_template: '{{service}} in {{city}}, {{state}} | {{brand}}',
        meta_description_template: 'Professional {{service}} in {{city}}, {{state}}. Licensed, insured local experts.',
        og_image_url: '',
        favicon_url: '',
        sitemap_enabled: true,
        sitemap_update_frequency: 'daily',
        state_overrides: {}
    },
    // Expert Settings
    expert_settings: {
        name: '',
        title: '',
        bio: '',
        photo_url: '',
        license_number: '',
        years_experience: 15,
        certifications: []
    },
    // Trust Signals
    trust_signals: {
        years_in_business: 15,
        average_rating: 4.8,
        total_reviews: 1247,
        projects_completed: 5000,
        warranty_details: '10-Year Warranty on All Installations',
        certifications: [],
        service_guarantee: '100% Satisfaction Guaranteed'
    }
}

export default function AdminDashboard() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [activeTab, setActiveTab] = useState('site')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    // Site Config State
    const [siteConfig, setSiteConfig] = useState<any>(DEFAULT_SITE_CONFIG)
    const [selectedSeoState, setSelectedSeoState] = useState('AL')
    const [isGeneratingSeo, setIsGeneratingSeo] = useState(false)
    const [seoProgress, setSeoProgress] = useState({ current: 0, total: 0 })

    const US_STATES = [
        { name: 'Alabama', code: 'AL' }, { name: 'Alaska', code: 'AK' }, { name: 'Arizona', code: 'AZ' }, { name: 'Arkansas', code: 'AR' },
        { name: 'California', code: 'CA' }, { name: 'Colorado', code: 'CO' }, { name: 'Connecticut', code: 'CT' }, { name: 'Delaware', code: 'DE' },
        { name: 'Florida', code: 'FL' }, { name: 'Georgia', code: 'GA' }, { name: 'Hawaii', code: 'HI' }, { name: 'Idaho', code: 'ID' },
        { name: 'Illinois', code: 'IL' }, { name: 'Indiana', code: 'IN' }, { name: 'Iowa', code: 'IA' }, { name: 'Kansas', code: 'KS' },
        { name: 'Kentucky', code: 'KY' }, { name: 'Louisiana', code: 'LA' }, { name: 'Maine', code: 'ME' }, { name: 'Maryland', code: 'MD' },
        { name: 'Massachusetts', code: 'MA' }, { name: 'Michigan', code: 'MI' }, { name: 'Minnesota', code: 'MN' }, { name: 'Mississippi', code: 'MS' },
        { name: 'Missouri', code: 'MO' }, { name: 'Montana', code: 'MT' }, { name: 'Nebraska', code: 'NE' }, { name: 'Nevada', code: 'NV' },
        { name: 'New Hampshire', code: 'NH' }, { name: 'New Jersey', code: 'NJ' }, { name: 'New Mexico', code: 'NM' }, { name: 'New York', code: 'NY' },
        { name: 'North Carolina', code: 'NC' }, { name: 'North Dakota', code: 'ND' }, { name: 'Ohio', code: 'OH' }, { name: 'Oklahoma', code: 'OK' },
        { name: 'Oregon', code: 'OR' }, { name: 'Pennsylvania', code: 'PA' }, { name: 'Rhode Island', code: 'RI' }, { name: 'South Carolina', code: 'SC' },
        { name: 'South Dakota', code: 'SD' }, { name: 'Tennessee', code: 'TN' }, { name: 'Texas', code: 'TX' }, { name: 'Utah', code: 'UT' },
        { name: 'Vermont', code: 'VT' }, { name: 'Virginia', code: 'VA' }, { name: 'Washington', code: 'WA' }, { name: 'West Virginia', code: 'WV' },
        { name: 'Wisconsin', code: 'WI' }, { name: 'Wyoming', code: 'WY' }
    ]

    const handleGenerateStateSeo = async () => {
        if (!siteConfig.open_router_key) {
            setMessage({ type: 'error', text: 'Please add an OpenRouter API key first.' })
            return
        }

        setIsGeneratingSeo(true)
        setSeoProgress({ current: 0, total: US_STATES.length })

        try {
            const currentOverrides = { ...(siteConfig.seo_settings?.state_overrides || {}) }
            const nicheName = selectedNiche?.name || 'Local Services'
            const apiKey = siteConfig.open_router_key

            // Process sequentially with a small delay between each to avoid browser/API throttling
            for (let i = 0; i < US_STATES.length; i++) {
                const state = US_STATES[i]
                setSeoProgress({ current: i + 1, total: US_STATES.length })
                console.log(`Generating SEO for ${state.name} (${i + 1}/${US_STATES.length})...`)

                try {
                    // Generate Meta Title
                    const titleResult = await generateAIContent({
                        niche: nicheName,
                        city: '',
                        state: state.name,
                        type: 'seo_template',
                        apiKey: apiKey
                    })

                    // Generate Meta Description
                    const descResult = await generateAIContent({
                        niche: nicheName,
                        city: '',
                        state: state.name,
                        type: 'seo_desc_template',
                        apiKey: apiKey
                    })

                    if (titleResult || descResult) {
                        currentOverrides[state.code] = {
                            ...(currentOverrides[state.code] || {}),
                            ...(titleResult ? { meta_title: titleResult } : {}),
                            ...(descResult ? { meta_description: descResult } : {})
                        }
                    }
                } catch (err) {
                    console.error(`Failed to generate for ${state.name}:`, err)
                }

                // Update UI every 3 states so the user sees progress in the list/inputs
                if (i > 0 && (i === US_STATES.length - 1 || i % 3 === 0)) {
                    setSiteConfig((prev: any) => ({
                        ...prev,
                        seo_settings: {
                            ...prev.seo_settings,
                            state_overrides: { ...currentOverrides }
                        }
                    }))
                }

                // Small delay between every request to prevent rate limits
                await new Promise(r => setTimeout(r, 400))
            }

            setSiteConfig({
                ...siteConfig,
                seo_settings: {
                    ...siteConfig.seo_settings,
                    state_overrides: currentOverrides
                }
            })
            setMessage({ type: 'success', text: `Success! Generated templates for all ${US_STATES.length} states.` })
        } catch (error) {
            setMessage({ type: 'error', text: 'Error during bulk SEO generation.' })
        } finally {
            setIsGeneratingSeo(false)
            setSeoProgress({ current: 0, total: 0 })
        }
    }

    // Niche Config State
    const [niches, setNiches] = useState<any[]>([])
    const [selectedNiche, setSelectedNiche] = useState<any>(null)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab) setActiveTab(tab)

        const nicheSlug = searchParams.get('niche')

        // If niches are loaded but no niche is selected (or mismatch), sync from URL
        if (niches.length > 0) {
            const targetNiche = nicheSlug
                ? niches.find(n => n.slug === nicheSlug)
                : niches[0]

            // Only update if changed to prevent infinite loops/redundant fetches
            if (targetNiche && (!selectedNiche || selectedNiche.slug !== targetNiche.slug)) {
                setSelectedNiche(targetNiche)
                fetchSiteConfigForNiche(targetNiche.slug)
                // If it was a default selection (no param), maybe sync URL? 
                // Optional, but good for consistency.
                if (!nicheSlug) {
                    const current = new URLSearchParams(Array.from(searchParams.entries()))
                    current.set('niche', targetNiche.slug)
                    router.replace(`${pathname}?${current.toString()}`)
                }
            }
        }
    }, [searchParams, niches])

    const updateUrl = (key: string, value: string) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()))
        if (value) current.set(key, value)
        else current.delete(key)
        const search = current.toString()
        const query = search ? `?${search}` : ''
        router.push(`${pathname}${query}`)
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        updateUrl('tab', tab)
    }

    const handleNicheSelect = (niche: any) => {
        updateUrl('niche', niche.slug)
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchData()
        }
    }, [isLoggedIn])

    async function fetchSiteConfigForNiche(nicheSlug: string) {
        setLoading(true)
        const { data } = await supabase
            .from('site_configs')
            .select('*')
            .eq('niche_slug', nicheSlug)
            .single()

        if (data) {
            setSiteConfig({
                ...data,
                ai_settings: data.ai_settings || DEFAULT_SITE_CONFIG.ai_settings,
                seo_settings: { ...DEFAULT_SITE_CONFIG.seo_settings, ...data.seo_settings },
                expert_settings: { ...DEFAULT_SITE_CONFIG.expert_settings, ...data.expert_settings },
                trust_signals: { ...DEFAULT_SITE_CONFIG.trust_signals, ...data.trust_signals },
                homepage_content: data.homepage_content || '',
                niche_slug: nicheSlug
            })
        } else {
            // Reset to defaults but keep the slug
            setSiteConfig({ ...DEFAULT_SITE_CONFIG, niche_slug: nicheSlug })
        }
        setLoading(false)
    }

    async function fetchData() {
        setLoading(true)
        const { data: nichesData } = await supabase.from('niche_configs').select('*')
        if (nichesData && nichesData.length > 0) {
            setNiches(nichesData)
        } else {
            // Fallback if no niches
            const { data: sites } = await supabase.from('site_configs').select('*').limit(1).single()
            if (sites) setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...sites })
        }
        setLoading(false)
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        // Simple client-side auth for demo/template purposes
        // In production, use Supabase Auth
        if (password === 'niche2026!') {
            setIsLoggedIn(true)
        } else {
            alert('Wrong password')
        }
    }

    const handleSaveSite = async () => {
        setLoading(true)
        // Create the save payload
        const savePayload: any = {
            ...siteConfig,
            // STOP FORCING 'localhost' - it causes unique constraint errors!
            // If empty, use a unique pending domain based on the niche slug.
            domain: siteConfig.domain || `pending-${siteConfig.niche_slug || Date.now()}`,
            niche_slug: siteConfig.niche_slug || null
        }

        // If we don't have an ID (e.g. new niche config), we try to find one by niche_slug 
        // to avoid duplicate domain errors if niche_slug already exists.
        // Check for existing record by niche_slug OR domain to prevent duplicates
        if (!savePayload.id) {
            let existing = null

            // 1. Try finding by niche_slug first (strongest link)
            if (savePayload.niche_slug) {
                const { data } = await supabase
                    .from('site_configs')
                    .select('id')
                    .eq('niche_slug', savePayload.niche_slug)
                    .single()
                existing = data
            }

            // 2. If not found, try finding by domain (unique constraint)
            if (!existing && savePayload.domain) {
                const { data } = await supabase
                    .from('site_configs')
                    .select('id, niche_slug') // Select niche_slug to check ownership
                    .eq('domain', savePayload.domain)
                    .single()

                if (data) {
                    // CRITICAL CHECK: If this domain belongs to ANOTHER niche, do NOT overwrite it!
                    if (data.niche_slug && data.niche_slug !== savePayload.niche_slug) {
                        setLoading(false)
                        setMessage({
                            type: 'error',
                            text: `Domain '${savePayload.domain}' is already used by the '${data.niche_slug}' niche. Please use a different domain.`
                        })
                        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
                        return // Stop execution
                    }
                    existing = data
                }
            }

            if (existing) {
                savePayload.id = existing.id
            }
        }

        const { error } = await supabase
            .from('site_configs')
            .upsert(savePayload)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Site settings saved!' })
        }
        setLoading(false)
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleAIGenerate = async () => {
        if (!selectedNiche) return
        setLoading(true)
        setMessage({ type: 'info', text: 'Generating content with AI... This may take 60-90 seconds.' })

        try {
            // Validate API key exists first
            if (!siteConfig.open_router_key) {
                throw new Error('OpenRouter API Key is missing! Go to Site Settings → add your API key in "OpenRouter API Key" field.')
            }

            // Use config from AI Settings tab
            const model = siteConfig.ai_settings?.model || "openai/gpt-4o-mini"
            const customPrompt = siteConfig.ai_settings?.promptTemplate

            console.log("Starting AI Generation:", { niche: selectedNiche.name, model, hasApiKey: !!siteConfig.open_router_key })

            const aiData = await generateNicheWithAI(selectedNiche.name, siteConfig.open_router_key, model, customPrompt)

            if (aiData) {
                // Merge AI data with existing niche data
                const updatedNiche = {
                    ...selectedNiche,
                    primary_service: aiData.primary_service,
                    keywords: aiData.keywords,
                    services: aiData.services,
                    faqs: aiData.faqs,
                    home_faqs: aiData.home_faqs,
                    state_faqs: aiData.state_faqs,
                    city_faqs: aiData.city_faqs
                }

                // Update site config with the new homepage intro
                if (aiData.homepage_intro) {
                    const cleanIntro = aiData.homepage_intro.replace(/```html/g, '').replace(/```/g, '').trim()
                    setSiteConfig((prev: any) => ({ ...prev, homepage_content: cleanIntro }))
                }

                // Save immediately
                const normalizedSlug = updatedNiche.slug.toLowerCase().trim().replace(/\s+/g, '-')
                const finalNiche = { ...updatedNiche, slug: normalizedSlug }

                const { error } = await supabase.from('niche_configs').upsert(finalNiche)

                if (error) throw error

                setSelectedNiche(finalNiche)
                updateUrl('niche', finalNiche.slug)
                // Refresh list
                const { data } = await supabase.from('niche_configs').select('*')
                if (data) setNiches(data)

                const wordCount = aiData.homepage_intro?.split(/\s+/).filter(Boolean).length || 0
                setMessage({ type: 'success', text: `AI Generation Data Applied & Saved! (${wordCount} words generated for homepage)` })
            } else {
                setMessage({ type: 'error', text: 'AI Generation failed. Check API Key.' })
            }
        } catch (e: any) {
            setMessage({ type: 'error', text: 'Generation Error: ' + e.message })
        }
        setLoading(false)
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    const handleSaveNiche = async () => {
        if (!selectedNiche) return
        setLoading(true)

        // Ensure slug is lowercase and dash-formatted
        const normalizedSlug = selectedNiche.slug.toLowerCase().trim().replace(/\s+/g, '-')
        const updatedNiche = {
            ...selectedNiche,
            slug: normalizedSlug,
            keywords: selectedNiche.keywords
        }

        const { error } = await supabase
            .from('niche_configs')
            .upsert(updatedNiche)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Niche configuration saved!' })
            updateUrl('niche', normalizedSlug)
            fetchData()
        }
        setLoading(false)
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleAddService = () => {
        const updatedServices = [...(selectedNiche.services || []), { title: 'New Service', slug: 'new-service', description: '', icon: '🔧' }]
        setSelectedNiche({ ...selectedNiche, services: updatedServices })
    }

    const handleAddNiche = () => {
        const newNiche = {
            name: 'New Niche',
            slug: 'new-niche',
            primary_service: 'Service Name',
            city_hero_image: 'https://i.ibb.co/Z6Wgrtzs/Premium-Gutter-Installation.png',
            keywords: [],
            services: [],
            faqs: []
        }
        setNiches([...niches, newNiche])
        handleNicheSelect(newNiche)
    }

    const handleAddFAQ = () => {
        const updatedFaqs = [...(selectedNiche.faqs || []), { question: 'New Question', answer: '' }]
        setSelectedNiche({ ...selectedNiche, faqs: updatedFaqs })
    }

    const handleGenerateHomepageContent = async () => {
        if (!selectedNiche || !siteConfig.open_router_key) {
            setMessage({ type: 'error', text: 'Select a niche and provide an OpenRouter API key first.' })
            return
        }
        setLoading(true)
        setMessage({ type: 'info', text: 'Generating unique homepage content...' })

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

            const model = siteConfig.ai_settings?.model || "openai/gpt-4o-mini"
            const prompt = `You are a Semantic SEO Strategist and Master Copywriter. 
            Your goal is to generate high-authority, semantic-rich homepage content (400-600 words) for a "${selectedNiche.name}" business.
            
            SEMANTIC STRATEGY:
            - Focus on Topical Authority: Cover not just the service, but the underlying expertise, materials, and long-term value.
            - Intent Matching: Address common homeowner pain points and technical anxieties.
            - LSI Integration: Naturally weave in related semantic terms (e.g., durability, precision, compliance, specialized equipment).
            
            STRUCTURE & HIERARCHY:
            1. MAIN H1: An authoritative, keyword-rich <h1> that includes {{niche}} and {{city}}.
            2. TOPICAL INTRODUCTION: A compelling <p> about the importance of professional ${selectedNiche.name} in {{state}}.
            3. SECONDARY H2: Focus on "Professional Grade Solutions" in {{city}}.
            4. PROBLEM/SOLUTION SECTION: A deep-dive <p> about regional challenges (climate, local regulations) and how {{brand}} solves them.
            5. TECHNICAL H3: Sub-heading for specific technical advantages or methodology.
            6. SEMANTIC KEY FEATURES: A <ul> with 3-5 <li> items explaining core benefits using high-value industry terms.
            7. TRUST & EEAT: A final <h3> and <p> emphasizing licensing, insurance, and localized expertise in {{state}}.
            
            STRICT RULES:
            - Use HTML tags: <h1>, <h2>, <h3>, <p>, <ul>, <li>, <strong>.
            - Use ONLY these placeholders: {{brand}}, {{city}}, {{state}}, {{niche}}, {{service}}.
            - Tone: Authoritative, Sophisticated, and Trust-Driven.
            - Content must be unique, high-value, and naturally optimized for search engines.
            
            Output ONLY the raw HTML.`

            console.log("Attempting AI Fetch with Model:", model);
            console.log("Using API Key (partial):", siteConfig.open_router_key?.slice(0, 10) + "...");

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${siteConfig.open_router_key}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://nichenexus-admin.com",
                    "X-Title": "NicheNexus Admin Dashboard"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log("Fetch response received. Status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("OpenRouter API Error:", {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText
                });
                throw new Error(`AI Service Error (${response.status}): ${errorText.slice(0, 100)}...`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (content) {
                const cleanContent = content.replace(/```html/g, '').replace(/```/g, '').trim()
                const wordCount = cleanContent.split(/\s+/).filter(Boolean).length
                setSiteConfig({ ...siteConfig, homepage_content: cleanContent })
                setMessage({ type: 'success', text: `Homepage content generated! (${wordCount} words)` })
            } else {
                console.error("Empty content from AI response:", data);
                throw new Error('No content returned from AI. The model might be busy or the prompt was rejected.');
            }
        } catch (e: any) {
            console.error("AI Generation Process Failed:", e);
            setMessage({ type: 'error', text: 'Error: ' + e.message })
        }
        setLoading(false)
        setTimeout(() => setMessage({ type: '', text: '' }), 10000)
    }


    const handleDeleteNiche = async () => {
        if (!selectedNiche || !confirm(`Are you sure you want to delete the ${selectedNiche.name} niche?`)) return
        setLoading(true)
        // First, unlink this niche from any site that is using it
        await supabase
            .from('site_configs')
            .update({ niche_slug: null })
            .eq('niche_slug', selectedNiche.slug)

        const { error } = await supabase
            .from('niche_configs')
            .delete()
            .eq('slug', selectedNiche.slug)

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Niche deleted successfully.' })
            fetchData()
        }
        setLoading(false)
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                        <p className="text-slate-500">Enter your password to manage your sites.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">
                            Login to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
                        <LayoutDashboard size={24} /> NicheAdmin
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => handleTabChange('site')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'site' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Settings size={20} /> Site Settings
                    </button>
                    <button
                        onClick={() => handleTabChange('ai')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Bot size={20} /> AI Config
                    </button>
                    <button
                        onClick={() => handleTabChange('niches')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'niches' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Globe size={20} /> Niche Manager
                    </button>
                    <button
                        onClick={() => handleTabChange('seo')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'seo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Settings size={20} /> SEO Settings
                    </button>
                    <button
                        onClick={() => handleTabChange('expert')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'expert' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <ShieldCheck size={20} /> Expert Info
                    </button>
                    <button
                        onClick={() => handleTabChange('trust')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'trust' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                        <Wand2 size={20} /> Trust Signals
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {activeTab === 'site' ? 'Global Site Settings' :
                                activeTab === 'seo' ? 'Niche SEO Settings' :
                                    activeTab === 'expert' ? 'Expert Configuration' :
                                        activeTab === 'trust' ? 'Trust Signals' :
                                            activeTab === 'niches' ? 'Niche Manager' : 'Admin Dashboard'}
                        </h1>
                        <div className="flex flex-col gap-2 mt-1">
                            <p className="text-slate-500">
                                {activeTab === 'niches' ? 'Manage your list of niches.' : 'Configuring site behavior and SEO templates.'}
                            </p>
                            {selectedNiche && activeTab !== 'niches' && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-4 py-1.5 bg-blue-600 text-white text-sm font-black rounded-full shadow-lg shadow-blue-500/30 animate-pulse">
                                        Editing Niche: {selectedNiche.name.toUpperCase()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">({selectedNiche.slug})</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {message.text && (
                        <div className={`px-6 py-3 rounded-xl font-medium animate-bounce ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}
                </header>

                {activeTab === 'site' && (
                    <>
                        <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
                            {niches.map(n => (
                                <button
                                    key={n.slug}
                                    onClick={() => handleNicheSelect(n)}
                                    className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedNiche?.slug === n.slug ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'}`}
                                >
                                    {n.name}
                                </button>
                            ))}
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Globe className="text-blue-500" /> Core Identity
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={siteConfig.site_name}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, site_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Domain</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={siteConfig.domain}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, domain: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Active Niche Slug</label>
                                        <select
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={siteConfig.niche_slug}
                                            onChange={(e) => {
                                                const slug = e.target.value
                                                fetchSiteConfigForNiche(slug)
                                            }}
                                        >
                                            <option value="">Select a Niche</option>
                                            {niches.map(n => <option key={n.slug} value={n.slug}>{n.name}</option>)}
                                        </select>
                                        <p className="mt-1 text-[10px] text-slate-500 italic">Important: Select your niche here and click "Save Site Settings" to activate it on the website.</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <label className="block text-sm font-bold text-slate-900">Homepage Intro Content</label>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${(siteConfig.homepage_content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0) > 250 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {siteConfig.homepage_content?.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length || 0} words
                                                </span>
                                            </div>
                                            <button
                                                onClick={handleGenerateHomepageContent}
                                                disabled={loading}
                                                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all font-bold"
                                            >
                                                <Bot size={14} /> AI Generate Intro
                                            </button>
                                        </div>
                                        <RichTextEditor
                                            value={siteConfig.homepage_content || ''}
                                            onChange={(val) => setSiteConfig({ ...siteConfig, homepage_content: val })}
                                            placeholder="Introduce your business and niche here. 3-5 paragraphs recommended for SEO."
                                        />
                                        <p className="mt-2 text-[10px] text-slate-400">This content appears on the main homepage. Unique, helpful content here is vital for ranking.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Phone className="text-blue-500" /> Contact & Analytics
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={siteConfig.contact_phone}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, contact_phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            value={siteConfig.contact_email}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, contact_email: e.target.value })}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">OpenRouter API Key (for AI Niche Generation)</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                            placeholder="sk-or-v1-..."
                                            value={siteConfig.open_router_key}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, open_router_key: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveSite}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Save size={20} /> {loading ? 'Saving...' : 'Save Site Settings'}
                                </button>
                            </section>
                        </div>

                        {/* Row 2: Business Address & Social Media */}
                        <div className="grid lg:grid-cols-2 gap-8 mt-8">
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    🏢 Business Address (for Schema)
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="123 Main Street"
                                            value={siteConfig.business_address}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, business_address: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="San Diego"
                                            value={siteConfig.business_city}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, business_city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="CA"
                                            value={siteConfig.business_state}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, business_state: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="92101"
                                            value={siteConfig.business_zip}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, business_zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    📱 Social Media Links
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Facebook URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://facebook.com/yourpage"
                                            value={siteConfig.facebook_url}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, facebook_url: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Instagram URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://instagram.com/yourpage"
                                            value={siteConfig.instagram_url}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, instagram_url: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Twitter/X URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://twitter.com/yourpage"
                                            value={siteConfig.twitter_url}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, twitter_url: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://linkedin.com/company/yourpage"
                                            value={siteConfig.linkedin_url}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, linkedin_url: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Row 3: Branding & Save */}
                        <div className="grid lg:grid-cols-1 gap-8 mt-8">
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    🎨 Branding
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="https://example.com/logo.png"
                                                value={siteConfig.logo_url}
                                                onChange={(e) => setSiteConfig({ ...siteConfig, logo_url: e.target.value })}
                                            />
                                            <CldUploadWidget
                                                signatureEndpoint="/api/cloudinary-signature"
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                onSuccess={(result: any) => {
                                                    console.log('Logo Upload Result:', result);
                                                    if (result?.info?.secure_url) {
                                                        setSiteConfig((prev: any) => ({ ...prev, logo_url: result.info.secure_url }))
                                                    }
                                                }}

                                            >
                                                {({ open }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => open()}
                                                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-bold flex items-center gap-2"
                                                    >
                                                        <Plus size={16} /> Upload
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                        {siteConfig.logo_url && (
                                            <div className="mt-2 relative w-32 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={siteConfig.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                                                <button
                                                    onClick={() => setSiteConfig({ ...siteConfig, logo_url: '' })}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-sm"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Footer Tagline</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Your trusted local experts since 2010"
                                            value={siteConfig.footer_tagline}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, footer_tagline: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveSite}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Save size={20} /> {loading ? 'Saving...' : 'Save All Site Settings'}
                                </button>
                            </section>
                        </div>
                    </>
                )}

                {activeTab === 'ai' && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">AI Configuration</h2>
                            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all" onClick={handleSaveSite}>
                                <Save size={20} /> Save AI Settings
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    OpenRouter Model
                                    <span className="ml-2 text-xs text-slate-500 font-normal">(Estimated cost per niche generation)</span>
                                </label>
                                <select
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={siteConfig.ai_settings?.model || 'openai/gpt-4o-mini'}
                                    onChange={(e) => setSiteConfig({
                                        ...siteConfig,
                                        ai_settings: { ...(siteConfig.ai_settings || { model: 'openai/gpt-4o-mini', promptTemplate: DEFAULT_PROMPT }), model: e.target.value }
                                    })}
                                >
                                    <option value="openai/gpt-4o-mini">💸 GPT-4o Mini - ~$0.01-0.02 (Cheapest, Good Quality)</option>
                                    <option value="openai/gpt-4o">💎 GPT-4o - ~$0.15-0.25 (Premium, Top Intelligence)</option>
                                    <option value="anthropic/claude-3-haiku">⚡ Claude 3 Haiku - ~$0.02-0.03 (Fast & Affordable)</option>
                                    <option value="anthropic/claude-3.5-sonnet">⭐ Claude 3.5 Sonnet - ~$0.08-0.12 (RECOMMENDED - Best EEAT & SEO)</option>
                                    <option value="google/gemini-pro-1.5">🚀 Gemini Pro 1.5 - ~$0.05-0.08 (Long Context, Good Value)</option>
                                </select>
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                        <strong>💡 Recommendation:</strong> Use <strong>Claude 3.5 Sonnet</strong> for best EEAT-compliant, entity-rich, and unique content.
                                        Use <strong>GPT-4o Mini</strong> for budget-friendly testing.
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        📊 Costs are estimated based on ~2000-3000 tokens input and ~2000-4000 tokens output per niche generation.
                                        Check your OpenRouter dashboard for exact usage.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">System Prompt Template</label>
                                <textarea
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm h-[400px]"
                                    value={siteConfig.ai_settings?.promptTemplate || DEFAULT_PROMPT}
                                    placeholder={DEFAULT_PROMPT}
                                    onChange={(e) => setSiteConfig({
                                        ...siteConfig,
                                        ai_settings: { ...(siteConfig.ai_settings || { model: 'openai/gpt-4o-mini', promptTemplate: DEFAULT_PROMPT }), promptTemplate: e.target.value }
                                    })}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Customize the instructions sent to the AI. This is the default optimized prompt.
                                    <br />
                                    <strong>Available Placeholders:</strong> {"{{city}}, {{state}}, {{stateCode}}, {{service}}, {{nicheName}}"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'seo' && (
                    <div className="space-y-8">
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {niches.map(n => (
                                <button
                                    key={n.slug}
                                    onClick={() => handleNicheSelect(n)}
                                    className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedNiche?.slug === n.slug ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'}`}
                                >
                                    {n.name}
                                </button>
                            ))}
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Analytics Section */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    Analytics & Tracking
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            GA4 Measurement ID
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="G-XXXXXXXXXX"
                                            value={siteConfig.ga4_id || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                ga4_id: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            GTM Container ID
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="GTM-XXXXXXX"
                                            value={siteConfig.seo_settings?.gtm_container_id || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: {
                                                    ...siteConfig.seo_settings,
                                                    gtm_container_id: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Search Console Verification
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="google-site-verification=..."
                                            value={siteConfig.gsc_id || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                gsc_id: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Microsoft Clarity ID
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="ID from Clarity Dashboard"
                                            value={siteConfig.clarity_id || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                clarity_id: e.target.value
                                            })}
                                        />
                                    </div>
                                </div>
                            </section>

                            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 mb-6">
                                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                    <Bot size={20} /> SEO Templates Guide
                                </h3>
                                <p className="text-sm text-blue-800 mb-4">
                                    Use these placeholders to dynamically generate content across thousands of pages:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['{{city}}', '{{state}}', '{{state_code}}', '{{niche}}', '{{nicheName}}', '{{service}}', '{{brand}}', '{{phone}}'].map(tag => (
                                        <code key={tag} className="bg-white px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-mono text-blue-600 font-bold shadow-sm">
                                            {tag}
                                        </code>
                                    ))}
                                </div>
                            </div>

                            {/* Home Page SEO */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    <Globe className="text-blue-500" /> Home Page SEO
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.meta_title_home || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_title_home: e.target.value }
                                            })}
                                            placeholder="{{brand}} | {{service}} Services"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">H1 Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.h1_template_home || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, h1_template_home: e.target.value }
                                            })}
                                            placeholder="Find {{service}} Near Me"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description Template</label>
                                        <textarea
                                            value={siteConfig.seo_settings?.meta_description_home || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_description_home: e.target.value }
                                            })}
                                            placeholder="Welcome to {{brand}}. We provide top-rated {{service}} services nationwide."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* State Page SEO */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    <Globe className="text-indigo-500" /> State Page SEO
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Global Meta Title (Fallback)</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.meta_title_state || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_title_state: e.target.value }
                                            })}
                                            placeholder="{{service}} in {{state}} | {{brand}}"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">H1 Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.h1_template_state || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, h1_template_state: e.target.value }
                                            })}
                                            placeholder="{{service}} in {{state}} | Local Experts"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description Template</label>
                                        <textarea
                                            value={siteConfig.seo_settings?.meta_description_state || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_description_state: e.target.value }
                                            })}
                                            placeholder="Find local {{service}} experts in {{state}}. Get free quotes today!"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* State-Specific SEO Overrides */}
                            <section className="bg-slate-50 p-8 rounded-3xl border border-slate-200 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                            <Bot className="text-blue-600" /> State-Specific SEO Manager
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Individual state meta titles that take priority over the fallback template above.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={selectedSeoState}
                                            onChange={(e) => setSelectedSeoState(e.target.value)}
                                            className="px-4 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                        >
                                            {US_STATES.map(state => (
                                                <option key={state.code} value={state.code}>{state.name}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleGenerateStateSeo}
                                            disabled={isGeneratingSeo}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-sm disabled:opacity-50 min-w-[160px] justify-center"
                                        >
                                            {isGeneratingSeo ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={18} />
                                                    {seoProgress.total > 0 ? `${seoProgress.current}/${seoProgress.total}` : 'Starting...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Wand2 size={18} />
                                                    AI Generate All
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Editing Template for: <span className="text-blue-600">{US_STATES.find(s => s.code === selectedSeoState)?.name}</span>
                                        </span>
                                        {siteConfig.seo_settings?.state_overrides?.[selectedSeoState] && (
                                            <button
                                                onClick={() => {
                                                    const updated = { ...siteConfig.seo_settings.state_overrides }
                                                    delete updated[selectedSeoState]
                                                    setSiteConfig({
                                                        ...siteConfig,
                                                        seo_settings: { ...siteConfig.seo_settings, state_overrides: updated }
                                                    })
                                                }}
                                                className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Reset to Global
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title Override</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.state_overrides?.[selectedSeoState]?.meta_title || ''}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...(siteConfig.seo_settings?.state_overrides || {}),
                                                    [selectedSeoState]: {
                                                        ...(siteConfig.seo_settings?.state_overrides?.[selectedSeoState] || {}),
                                                        meta_title: e.target.value
                                                    }
                                                }
                                                setSiteConfig({
                                                    ...siteConfig,
                                                    seo_settings: { ...siteConfig.seo_settings, state_overrides: updated }
                                                })
                                            }}
                                            placeholder="Using Global Template..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description Override</label>
                                        <textarea
                                            value={siteConfig.seo_settings?.state_overrides?.[selectedSeoState]?.meta_description || ''}
                                            onChange={(e) => {
                                                const updated = {
                                                    ...(siteConfig.seo_settings?.state_overrides || {}),
                                                    [selectedSeoState]: {
                                                        ...(siteConfig.seo_settings?.state_overrides?.[selectedSeoState] || {}),
                                                        meta_description: e.target.value
                                                    }
                                                }
                                                setSiteConfig({
                                                    ...siteConfig,
                                                    seo_settings: { ...siteConfig.seo_settings, state_overrides: updated }
                                                })
                                            }}
                                            placeholder="Using Global Template..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                                        />
                                        <p className="mt-2 text-xs text-slate-400">
                                            Tip: Use <code className="bg-slate-100 px-1 rounded">{"{{state}}"}</code> and <code className="bg-slate-100 px-1 rounded">{"{{service}}"}</code>
                                        </p>
                                    </div>
                                </div>
                            </section >

                            {/* City Page SEO */}
                            <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6" >
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    <Globe className="text-violet-500" /> City Page SEO
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.meta_title_city || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_title_city: e.target.value }
                                            })}
                                            placeholder="{{service}} in {{city}}, {{state}} | {{brand}}"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">H1 Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.h1_template_city || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, h1_template_city: e.target.value }
                                            })}
                                            placeholder="{{service}} in {{city}}, {{state}}"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description Template</label>
                                        <textarea
                                            value={siteConfig.seo_settings?.meta_description_city || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_description_city: e.target.value }
                                            })}
                                            placeholder="Top-rated {{service}} in {{city}}, {{state}}. Licensed, insured professionals near you."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </section >

                            {/* Service Page SEO */}
                            < section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6" >
                                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                    <Globe className="text-emerald-500" /> Service Page SEO
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.meta_title_service || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_title_service: e.target.value }
                                            })}
                                            placeholder="{{service}} in {{city}}, {{state}} | {{brand}}"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">H1 Title Template</label>
                                        <input
                                            type="text"
                                            value={siteConfig.seo_settings?.h1_template_service || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, h1_template_service: e.target.value }
                                            })}
                                            placeholder="{{service}} Services in {{city}}"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description Template</label>
                                        <textarea
                                            value={siteConfig.seo_settings?.meta_description_service || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: { ...siteConfig.seo_settings, meta_description_service: e.target.value }
                                            })}
                                            placeholder="Expert {{service}} services in {{city}}, {{state}}. {{brand}} offers quality..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </section >
                        </div >

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                            <h3 className="text-xl font-bold">Assets & Sitemap</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        OG Image URL
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://example.com/og-image.png"
                                            value={siteConfig.seo_settings?.og_image_url || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: {
                                                    ...siteConfig.seo_settings,
                                                    og_image_url: e.target.value
                                                }
                                            })}
                                        />
                                        <CldUploadWidget
                                            signatureEndpoint="/api/cloudinary-signature"
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                            onSuccess={(result: any) => {
                                                if (result?.info?.secure_url) {
                                                    setSiteConfig((prev: any) => ({
                                                        ...prev,
                                                        seo_settings: {
                                                            ...prev.seo_settings,
                                                            og_image_url: result.info.secure_url
                                                        }
                                                    }))
                                                }
                                            }}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-bold flex items-center gap-2"
                                                >
                                                    <Plus size={16} /> Upload
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                    {siteConfig.seo_settings?.og_image_url && (
                                        <div className="mt-2 relative w-48 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            <img src={siteConfig.seo_settings.og_image_url} alt="OG Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Favicon URL
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://example.com/favicon.ico"
                                            value={siteConfig.seo_settings?.favicon_url || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                seo_settings: {
                                                    ...siteConfig.seo_settings,
                                                    favicon_url: e.target.value
                                                }
                                            })}
                                        />
                                        <CldUploadWidget
                                            signatureEndpoint="/api/cloudinary-signature"
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                            onSuccess={(result: any) => {
                                                if (result?.info?.secure_url) {
                                                    setSiteConfig((prev: any) => ({
                                                        ...prev,
                                                        seo_settings: {
                                                            ...prev.seo_settings,
                                                            favicon_url: result.info.secure_url
                                                        }
                                                    }))
                                                }
                                            }}
                                        >
                                            {({ open }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-bold flex items-center gap-2"
                                                >
                                                    <Plus size={16} /> Upload
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                    {siteConfig.seo_settings?.favicon_url && (
                                        <div className="mt-2 relative w-8 h-8 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            <img src={siteConfig.seo_settings.favicon_url} alt="Favicon Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveSite}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Save SEO Settings
                            </button>
                        </div>
                    </div >
                )
                }
                {
                    activeTab === 'expert' && (
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold">Expert/Author Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Expert Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="John Smith"
                                            value={siteConfig.expert_settings?.name || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                expert_settings: {
                                                    ...siteConfig.expert_settings,
                                                    name: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Expert Title
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Certified Master Plumber"
                                            value={siteConfig.expert_settings?.title || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                expert_settings: {
                                                    ...siteConfig.expert_settings,
                                                    title: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Expert Bio (2-3 sentences)
                                        </label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="John Smith is a certified master plumber with over 15 years of experience..."
                                            value={siteConfig.expert_settings?.bio || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                expert_settings: {
                                                    ...siteConfig.expert_settings,
                                                    bio: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Photo URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="https://example.com/expert.jpg"
                                                value={siteConfig.expert_settings?.photo_url || ''}
                                                onChange={(e) => setSiteConfig({
                                                    ...siteConfig,
                                                    expert_settings: {
                                                        ...siteConfig.expert_settings,
                                                        photo_url: e.target.value
                                                    }
                                                })}
                                            />
                                            <CldUploadWidget
                                                signatureEndpoint="/api/cloudinary-signature"
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                onSuccess={(result: any) => {
                                                    if (result?.info?.secure_url) {
                                                        setSiteConfig((prev: any) => ({
                                                            ...prev,
                                                            expert_settings: {
                                                                ...prev.expert_settings,
                                                                photo_url: result.info.secure_url
                                                            }
                                                        }))
                                                    }
                                                }}
                                            >
                                                {({ open }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => open()}
                                                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-bold flex items-center gap-2"
                                                    >
                                                        <Plus size={16} /> Upload
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        </div>
                                        {siteConfig.expert_settings?.photo_url && (
                                            <div className="mt-2 relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                <img src={siteConfig.expert_settings.photo_url} alt="Expert Preview" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => setSiteConfig({
                                                        ...siteConfig,
                                                        expert_settings: {
                                                            ...siteConfig.expert_settings,
                                                            photo_url: ''
                                                        }
                                                    })}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-sm"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            License Number
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="PL-12345"
                                            value={siteConfig.expert_settings?.license_number || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                expert_settings: {
                                                    ...siteConfig.expert_settings,
                                                    license_number: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="15"
                                            value={siteConfig.expert_settings?.years_experience || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                expert_settings: {
                                                    ...siteConfig.expert_settings,
                                                    years_experience: parseInt(e.target.value) || 0
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveSite}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Save Expert Info
                                </button>
                            </div>
                        </div>
                    )
                }
                {
                    activeTab === 'trust' && (
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                                <h3 className="text-xl font-bold">Trust Signals & Social Proof</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Years in Business
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="15"
                                            value={siteConfig.trust_signals?.years_in_business || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                trust_signals: {
                                                    ...siteConfig.trust_signals,
                                                    years_in_business: parseInt(e.target.value) || 0
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Average Rating (out of 5)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            max="5"
                                            min="0"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="4.8"
                                            value={siteConfig.trust_signals?.average_rating || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                trust_signals: {
                                                    ...siteConfig.trust_signals,
                                                    average_rating: parseFloat(e.target.value) || 0
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Total Reviews
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="1247"
                                            value={siteConfig.trust_signals?.total_reviews || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                trust_signals: {
                                                    ...siteConfig.trust_signals,
                                                    total_reviews: parseInt(e.target.value) || 0
                                                }
                                            })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Projects Completed
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="5000"
                                            value={siteConfig.trust_signals?.projects_completed || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                trust_signals: {
                                                    ...siteConfig.trust_signals,
                                                    projects_completed: parseInt(e.target.value) || 0
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Warranty Details
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="10-Year Warranty on All Installations"
                                            value={siteConfig.trust_signals?.warranty_details || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                trust_signals: {
                                                    ...siteConfig.trust_signals,
                                                    warranty_details: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Service Guarantee
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="100% Satisfaction Guaranteed or Your Money Back"
                                            value={siteConfig.trust_signals?.service_guarantee || ''}
                                            onChange={(e) => setSiteConfig({
                                                ...siteConfig,
                                                trust_signals: {
                                                    ...siteConfig.trust_signals,
                                                    service_guarantee: e.target.value
                                                }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveSite}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Save Trust Signals
                                </button>
                            </div>
                        </div>
                    )
                }
                )
                {
                    activeTab === 'niches' && (
                        <div className="space-y-8">
                            <div className="flex gap-4 overflow-x-auto pb-4">
                                {niches.map(n => (
                                    <button
                                        key={n.slug}
                                        onClick={() => handleNicheSelect(n)}
                                        className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedNiche?.slug === n.slug ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'}`}
                                    >
                                        {n.name}
                                    </button>
                                ))}
                                <button
                                    onClick={handleAddNiche}
                                    className="px-6 py-2 rounded-full font-medium bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add Niche
                                </button>
                            </div>

                            {selectedNiche && (
                                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-bold">Edit Niche: {selectedNiche.name}</h2>
                                        <div className="flex gap-3">
                                            <button
                                                className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-100 transition-all disabled:opacity-50"
                                                onClick={handleAIGenerate}
                                                disabled={loading}
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                                                Generate with AI
                                            </button>
                                            <button className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-all" onClick={handleDeleteNiche}>
                                                <Trash2 size={20} /> Delete Niche
                                            </button>
                                            <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all" onClick={handleSaveNiche}>
                                                <Save size={20} /> Save Niche
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Niche Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedNiche.name}
                                                    onChange={(e) => setSelectedNiche({ ...selectedNiche, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Niche Slug (URL Identifier)</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                                    value={selectedNiche.slug}
                                                    onChange={(e) => setSelectedNiche({ ...selectedNiche, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Service</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedNiche.primary_service}
                                                    onChange={(e) => setSelectedNiche({ ...selectedNiche, primary_service: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-slate-700 mb-1">City Hero Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="https://i.ibb.co/Z6Wgrtzs/Premium-Gutter-Installation.png"
                                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                                        value={selectedNiche.city_hero_image || 'https://i.ibb.co/Z6Wgrtzs/Premium-Gutter-Installation.png'}
                                                        onChange={(e) => setSelectedNiche({ ...selectedNiche, city_hero_image: e.target.value })}
                                                    />
                                                    <CldUploadWidget
                                                        signatureEndpoint="/api/cloudinary-signature"
                                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                        onSuccess={(result: any) => {
                                                            if (result?.info?.secure_url) {
                                                                setSelectedNiche((prev: any) => ({ ...prev, city_hero_image: result.info.secure_url }))
                                                            }
                                                        }}
                                                    >
                                                        {({ open }) => (
                                                            <button
                                                                type="button"
                                                                onClick={() => open()}
                                                                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-bold flex items-center gap-2"
                                                            >
                                                                <Plus size={16} /> Upload
                                                            </button>
                                                        )}
                                                    </CldUploadWidget>
                                                </div>
                                                {selectedNiche.city_hero_image && (
                                                    <div className="mt-2 relative w-48 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                        <img src={selectedNiche.city_hero_image} alt="Hero Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => setSelectedNiche({ ...selectedNiche, city_hero_image: '' })}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-sm"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Keywords (Comma separated)</label>
                                                <textarea
                                                    className="w-full h-24 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={selectedNiche.keywords?.join(', ')}
                                                    onChange={(e) => setSelectedNiche({ ...selectedNiche, keywords: e.target.value.split(',').map((k: string) => k.trim()) })}
                                                />
                                            </div>
                                            <div className="pt-6 border-t border-slate-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-slate-900 border-l-4 border-blue-500 pl-3">FAQs</h4>
                                                    <button onClick={handleAddFAQ} className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                                                        <Plus size={16} /> Add FAQ
                                                    </button>
                                                </div>
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                                    {selectedNiche.faqs?.map((faq: any, index: number) => (
                                                        <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Question"
                                                                className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                                                                value={faq.question}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...selectedNiche.faqs]
                                                                    newFaqs[index].question = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, faqs: newFaqs })
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Answer"
                                                                className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs h-16"
                                                                value={faq.answer}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...selectedNiche.faqs]
                                                                    newFaqs[index].answer = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, faqs: newFaqs })
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newFaqs = selectedNiche.faqs.filter((_: any, i: number) => i !== index)
                                                                    setSelectedNiche({ ...selectedNiche, faqs: newFaqs })
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 mt-1"
                                                            >
                                                                <Trash2 size={12} /> Remove FAQ
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-slate-900 border-l-4 border-purple-500 pl-3">Home Page FAQs</h4>
                                                    <button onClick={() => setSelectedNiche({ ...selectedNiche, home_faqs: [...(selectedNiche.home_faqs || []), { question: 'New Question', answer: '' }] })} className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1">
                                                        <Plus size={16} /> Add Home FAQ
                                                    </button>
                                                </div>
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                                    {selectedNiche.home_faqs?.map((faq: any, index: number) => (
                                                        <div key={index} className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Question"
                                                                className="w-full px-3 py-1 bg-white border border-purple-200 rounded-lg text-sm font-bold"
                                                                value={faq.question}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...(selectedNiche.home_faqs || [])]
                                                                    newFaqs[index].question = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, home_faqs: newFaqs })
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Answer"
                                                                className="w-full px-3 py-1 bg-white border border-purple-200 rounded-lg text-xs h-16"
                                                                value={faq.answer}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...(selectedNiche.home_faqs || [])]
                                                                    newFaqs[index].answer = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, home_faqs: newFaqs })
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newFaqs = selectedNiche.home_faqs.filter((_: any, i: number) => i !== index)
                                                                    setSelectedNiche({ ...selectedNiche, home_faqs: newFaqs })
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 mt-1"
                                                            >
                                                                <Trash2 size={12} /> Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-slate-900 border-l-4 border-indigo-500 pl-3">State Page FAQs</h4>
                                                    <button onClick={() => setSelectedNiche({ ...selectedNiche, state_faqs: [...(selectedNiche.state_faqs || []), { question: 'New Question', answer: '' }] })} className="text-indigo-600 hover:text-indigo-700 text-sm font-bold flex items-center gap-1">
                                                        <Plus size={16} /> Add State FAQ
                                                    </button>
                                                </div>
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                                    {selectedNiche.state_faqs?.map((faq: any, index: number) => (
                                                        <div key={index} className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Question"
                                                                className="w-full px-3 py-1 bg-white border border-indigo-200 rounded-lg text-sm font-bold"
                                                                value={faq.question}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...(selectedNiche.state_faqs || [])]
                                                                    newFaqs[index].question = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, state_faqs: newFaqs })
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Answer"
                                                                className="w-full px-3 py-1 bg-white border border-indigo-200 rounded-lg text-xs h-16"
                                                                value={faq.answer}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...(selectedNiche.state_faqs || [])]
                                                                    newFaqs[index].answer = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, state_faqs: newFaqs })
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newFaqs = selectedNiche.state_faqs.filter((_: any, i: number) => i !== index)
                                                                    setSelectedNiche({ ...selectedNiche, state_faqs: newFaqs })
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 mt-1"
                                                            >
                                                                <Trash2 size={12} /> Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-slate-100">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-slate-900 border-l-4 border-cyan-500 pl-3">City Page FAQs</h4>
                                                    <button onClick={() => setSelectedNiche({ ...selectedNiche, city_faqs: [...(selectedNiche.city_faqs || []), { question: 'New Question', answer: '' }] })} className="text-cyan-600 hover:text-cyan-700 text-sm font-bold flex items-center gap-1">
                                                        <Plus size={16} /> Add City FAQ
                                                    </button>
                                                </div>
                                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                                    {selectedNiche.city_faqs?.map((faq: any, index: number) => (
                                                        <div key={index} className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100 space-y-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Question"
                                                                className="w-full px-3 py-1 bg-white border border-cyan-200 rounded-lg text-sm font-bold"
                                                                value={faq.question}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...(selectedNiche.city_faqs || [])]
                                                                    newFaqs[index].question = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, city_faqs: newFaqs })
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Answer"
                                                                className="w-full px-3 py-1 bg-white border border-cyan-200 rounded-lg text-xs h-16"
                                                                value={faq.answer}
                                                                onChange={(e) => {
                                                                    const newFaqs = [...(selectedNiche.city_faqs || [])]
                                                                    newFaqs[index].answer = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, city_faqs: newFaqs })
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    const newFaqs = selectedNiche.city_faqs.filter((_: any, i: number) => i !== index)
                                                                    setSelectedNiche({ ...selectedNiche, city_faqs: newFaqs })
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1 mt-1"
                                                            >
                                                                <Trash2 size={12} /> Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-slate-900 border-l-4 border-blue-500 pl-3">Services</h4>
                                                <button onClick={handleAddService} className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                                                    <Plus size={16} /> Add Service
                                                </button>
                                            </div>
                                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                                                {selectedNiche.services?.map((service: any, index: number) => (
                                                    <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Service Title"
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold"
                                                                value={service.title}
                                                                onChange={(e) => {
                                                                    const newServices = [...selectedNiche.services]
                                                                    newServices[index].title = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Icon (e.g. 🪠)"
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-center text-lg"
                                                                value={service.icon || ''}
                                                                onChange={(e) => {
                                                                    const newServices = [...selectedNiche.services]
                                                                    newServices[index].icon = e.target.value
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                            />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Slug (e.g. drain-cleaning)"
                                                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                                                            value={service.slug}
                                                            onChange={(e) => {
                                                                const newServices = [...selectedNiche.services]
                                                                newServices[index].slug = e.target.value
                                                                setSelectedNiche({ ...selectedNiche, services: newServices })
                                                            }}
                                                        />
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Hero Image URL (e.g. Unsplash URL)"
                                                                    className="flex-1 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                                                                    value={service.heroImage || service.hero_image || ''}
                                                                    onChange={(e) => {
                                                                        const newServices = [...selectedNiche.services]
                                                                        newServices[index].heroImage = e.target.value
                                                                        setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                    }}
                                                                />
                                                                <CldUploadWidget
                                                                    signatureEndpoint="/api/cloudinary-signature"
                                                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                                    onSuccess={(result: any) => {
                                                                        if (result?.info?.secure_url) {
                                                                            setSelectedNiche((prev: any) => {
                                                                                const newServices = [...prev.services]
                                                                                newServices[index].heroImage = result.info.secure_url
                                                                                return { ...prev, services: newServices }
                                                                            })
                                                                        }
                                                                    }}
                                                                >
                                                                    {({ open }) => (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => open()}
                                                                            className="px-2 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 transition-all text-[10px] font-bold"
                                                                        >
                                                                            Upload
                                                                        </button>
                                                                    )}
                                                                </CldUploadWidget>
                                                            </div>
                                                            {(service.heroImage || service.hero_image) && (
                                                                <div className="relative w-20 h-12 bg-slate-100 rounded overflow-hidden border border-slate-200">
                                                                    <img src={service.heroImage || service.hero_image} alt="Service Preview" className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <textarea
                                                            placeholder="Short Description"
                                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs h-16"
                                                            value={service.description}
                                                            onChange={(e) => {
                                                                const newServices = [...selectedNiche.services]
                                                                newServices[index].description = e.target.value
                                                                setSelectedNiche({ ...selectedNiche, services: newServices })
                                                            }}
                                                        />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <textarea
                                                                placeholder="Key Features (one per line)"
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] h-24 font-mono"
                                                                value={Array.isArray(service.features) ? service.features.join('\n') : ''}
                                                                onChange={(e) => {
                                                                    const newServices = [...selectedNiche.services]
                                                                    newServices[index].features = e.target.value.split('\n').filter(Boolean)
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Benefits (one per line)"
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] h-24 font-mono"
                                                                value={Array.isArray(service.benefits) ? service.benefits.join('\n') : ''}
                                                                onChange={(e) => {
                                                                    const newServices = [...selectedNiche.services]
                                                                    newServices[index].benefits = e.target.value.split('\n').filter(Boolean)
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <textarea
                                                                placeholder="Process Steps (one per line)"
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] h-24 font-mono"
                                                                value={Array.isArray(service.process) ? service.process.join('\n') : ''}
                                                                onChange={(e) => {
                                                                    const newServices = [...selectedNiche.services]
                                                                    newServices[index].process = e.target.value.split('\n').filter(Boolean)
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                            />
                                                            <textarea
                                                                placeholder="Materials (JSON: [{name, desc}])"
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] h-24 font-mono"
                                                                value={JSON.stringify(service.materials || [], null, 2)}
                                                                onChange={(e) => {
                                                                    try {
                                                                        const newServices = [...selectedNiche.services]
                                                                        newServices[index].materials = JSON.parse(e.target.value)
                                                                        setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                    } catch (err) { }
                                                                }}
                                                            />
                                                        </div>
                                                        {/* Service FAQs Field */}
                                                        <div className="mt-3">
                                                            <label className="text-[10px] font-medium text-slate-600 mb-1 block">Service FAQs (one Q:A per line, format: Question | Answer)</label>
                                                            <textarea
                                                                placeholder="How much does this cost? | Pricing varies based on scope..."
                                                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[10px] h-32 font-mono"
                                                                value={
                                                                    Array.isArray(service.faqs)
                                                                        ? service.faqs.map((f: any) => `${f.question || f.q} | ${f.answer || f.a}`).join('\n')
                                                                        : ''
                                                                }
                                                                onChange={(e) => {
                                                                    const newServices = [...selectedNiche.services]
                                                                    newServices[index].faqs = e.target.value.split('\n').filter(Boolean).map(line => {
                                                                        const [q, a] = line.split('|').map(s => s.trim())
                                                                        return { question: q || '', answer: a || '' }
                                                                    })
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <button
                                                                onClick={() => {
                                                                    const newServices = selectedNiche.services.filter((_: any, i: number) => i !== index)
                                                                    setSelectedNiche({ ...selectedNiche, services: newServices })
                                                                }}
                                                                className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
                                                            >
                                                                <Trash2 size={12} /> Remove Service
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            </main >
        </div >
    )
}
