'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, Play, BarChart3, CheckCircle, XCircle, RefreshCw, MapPin, Globe, Loader } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface CityContentStats {
    nicheSlug: string
    contentStats: {
        total: number
        published: number
        reviewed: number
        avgQuality: number
        byTier: Record<number, number>
    } | null
    totalCities: number
    totalByTier: Record<number, number>
    coverage: Record<string, string> | null
}

interface GenerationProgress {
    total: number
    completed: number
    failed: number
    skipped: number
    currentCity: string
    status: string
    errors: { city: string; error: string }[]
}

export default function CityContentManager() {
    const [stats, setStats] = useState<CityContentStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [progress, setProgress] = useState<GenerationProgress | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Generation options
    const [tier, setTier] = useState<number>(1)
    const [stateFilter, setStateFilter] = useState('')
    const [limit, setLimit] = useState(10)
    const [singleCity, setSingleCity] = useState('')
    const [singleState, setSingleState] = useState('')

    // Niche selection
    const [availableNiches, setAvailableNiches] = useState<{ slug: string; name: string }[]>([])
    const [selectedNiche, setSelectedNiche] = useState<string>('')

    // Generated cities list
    const [generatedCities, setGeneratedCities] = useState<any[]>([])
    const [citySearch, setCitySearch] = useState('')
    const [loadingCities, setLoadingCities] = useState(false)

    const authHeader = typeof window !== 'undefined'
        ? 'Basic ' + btoa(`${process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'}:${process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'niche2026!'}`)
        : ''

    // For admin we use hardcoded credentials from env
    const getAuthHeader = useCallback(() => {
        // Try reading from localStorage if set during login
        const username = localStorage.getItem('admin_username') || 'admin'
        const password = localStorage.getItem('admin_password') || 'niche2026!'
        return 'Basic ' + btoa(`${username}:${password}`)
    }, [])

    const fetchGeneratedCities = useCallback(async (nicheOverride?: string) => {
        const targetNiche = nicheOverride || selectedNiche
        if (!targetNiche) return

        setLoadingCities(true)
        try {
            const { data, error } = await supabase
                .from('city_content')
                .select('city, state_id, population_tier, content_quality_score, created_at')
                .eq('niche_slug', targetNiche)
                .order('created_at', { ascending: false })

            if (data && !error) {
                setGeneratedCities(data)
            }
        } catch (err) {
            console.error('Failed to fetch generated cities:', err)
        } finally {
            setLoadingCities(false)
        }
    }, [selectedNiche])

    const fetchStats = useCallback(async (nicheOverride?: string) => {
        setLoading(true)
        setError(null)
        try {
            const targetNiche = nicheOverride || selectedNiche
            let url = '/api/admin/city-content'
            if (targetNiche) {
                // We'll update the API to handle the niche query param for stats too
                url += `?niche=${targetNiche}`
            }

            const res = await fetch(url, {
                headers: { 'Authorization': getAuthHeader() }
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setStats(data)

            // If we don't have a selected niche yet, use the one from the first stats load
            if (!selectedNiche && data.nicheSlug) {
                setSelectedNiche(data.nicheSlug)
                fetchGeneratedCities(data.nicheSlug)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [getAuthHeader, selectedNiche, fetchGeneratedCities])

    // Load available niches
    useEffect(() => {
        const loadNiches = async () => {
            try {
                const { data, error } = await supabase
                    .from('niche_configs')
                    .select('slug, name')
                    .order('name')

                if (data && !error) {
                    setAvailableNiches(data)
                }
            } catch (err) {
                console.error('Failed to load niches:', err)
            }
        }
        loadNiches()
        fetchStats()
    }, [])

    const handleNicheChange = (newNiche: string) => {
        setSelectedNiche(newNiche)
        fetchStats(newNiche)
        fetchGeneratedCities(newNiche)
    }

    const handleBatchGenerate = async () => {
        setGenerating(true)
        setProgress(null)
        setError(null)

        try {
            const body: any = {
                action: 'batch',
                tier,
                limit,
                delayMs: 1500,
                overrideNicheSlug: selectedNiche,
            }
            if (stateFilter) body.stateId = stateFilter.toUpperCase()

            const res = await fetch('/api/admin/city-content', {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || `HTTP ${res.status}`)
            }

            const data = await res.json()
            // Refresh stats and cities
            await fetchStats()
            await fetchGeneratedCities()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setGenerating(false)
        }
    }

    const handleSingleGenerate = async () => {
        if (!singleCity || !singleState) {
            setError('Please enter both city and state')
            return
        }

        setGenerating(true)
        setProgress(null)
        setError(null)

        try {
            const res = await fetch('/api/admin/city-content', {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'single',
                    city: singleCity,
                    stateId: singleState.toUpperCase(),
                    overrideNicheSlug: selectedNiche,
                }),
            })

            if (!res.ok) {
                const errData = await res.json()
                throw new Error(errData.error || `HTTP ${res.status}`)
            }

            const data = await res.json()
            setProgress({
                total: 1,
                completed: 1,
                failed: 0,
                skipped: 0,
                currentCity: data.city,
                status: 'completed',
                errors: [],
            })
            // Refresh stats and cities
            await fetchStats()
            await fetchGeneratedCities()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setGenerating(false)
        }
    }

    const tierLabels: Record<number, { label: string; color: string; desc: string }> = {
        1: { label: 'Tier 1 — Flagship', color: 'bg-red-100 text-red-700 border-red-200', desc: 'Population ≥ 100K' },
        2: { label: 'Tier 2 — Priority', color: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'Population 25K–100K' },
        3: { label: 'Tier 3 — Standard', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', desc: 'Population 5K–25K' },
        4: { label: 'Tier 4 — Long-tail', color: 'bg-slate-100 text-slate-700 border-slate-200', desc: 'Population < 5K' },
    }

    return (
        <div className="space-y-8">
            {/* Niche Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Niche Selection</h3>
                        <p className="text-sm text-slate-500">Pick the niche you want to generate city content for.</p>
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={selectedNiche}
                            onChange={(e) => handleNicheChange(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                        >
                            <option value="">Select a niche...</option>
                            {availableNiches.map(n => (
                                <option key={n.slug} value={n.slug}>{n.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 size={22} className="text-blue-600" />
                        Content Generation Coverage
                    </h3>
                    <button
                        onClick={() => fetchStats()}
                        disabled={loading}
                        className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : stats ? (
                    <>
                        {/* Summary bar */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                                <div className="text-2xl font-bold text-blue-700">{stats.totalCities?.toLocaleString()}</div>
                                <div className="text-xs text-blue-600 mt-1">Total Cities</div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                                <div className="text-2xl font-bold text-green-700">{stats.contentStats?.total || 0}</div>
                                <div className="text-xs text-green-600 mt-1">Content Generated</div>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                                <div className="text-2xl font-bold text-amber-700">{stats.contentStats?.published || 0}</div>
                                <div className="text-xs text-amber-600 mt-1">Published</div>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                                <div className="text-2xl font-bold text-purple-700">
                                    {stats.contentStats?.avgQuality ? (stats.contentStats.avgQuality * 100).toFixed(0) + '%' : '—'}
                                </div>
                                <div className="text-xs text-purple-600 mt-1">Avg Quality</div>
                            </div>
                        </div>

                        {/* Tier breakdown */}
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(t => {
                                const total = stats.totalByTier?.[t] || 0
                                const generated = stats.contentStats?.byTier?.[t] || 0
                                const pct = total > 0 ? (generated / total * 100) : 0
                                const info = tierLabels[t]

                                return (
                                    <div key={t} className={`rounded-xl p-4 border ${info.color}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <span className="font-semibold text-sm">{info.label}</span>
                                                <span className="text-xs ml-2 opacity-70">({info.desc})</span>
                                            </div>
                                            <span className="font-mono text-sm">{generated} / {total}</span>
                                        </div>
                                        <div className="w-full bg-white/50 rounded-full h-2">
                                            <div
                                                className="bg-current rounded-full h-2 transition-all"
                                                style={{ width: `${Math.min(100, pct)}%`, opacity: 0.6 }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <p className="text-slate-500 text-center py-8">No stats available</p>
                )}
            </div>

            {/* Batch Generation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Play size={22} className="text-green-600" />
                    Batch Content Generation
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Population Tier</label>
                        <select
                            value={tier}
                            onChange={e => setTier(Number(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                        >
                            {[1, 2, 3, 4].map(t => (
                                <option key={t} value={t}>{tierLabels[t].label} ({tierLabels[t].desc})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">State Filter (optional)</label>
                        <input
                            type="text"
                            value={stateFilter}
                            onChange={e => setStateFilter(e.target.value)}
                            placeholder="e.g., PA"
                            maxLength={2}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm uppercase"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Cities</label>
                        <input
                            type="number"
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                            min={1}
                            max={100}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                    </div>
                </div>

                <button
                    onClick={handleBatchGenerate}
                    disabled={generating}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {generating ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            <Play size={18} /> Generate Batch
                        </>
                    )}
                </button>

                <p className="text-xs text-slate-400 mt-2">
                    Existing content will be skipped. Each city takes ~2 seconds. Cost: ~$0.01/city with GPT-4o-mini.
                </p>
            </div>

            {/* Single City Generation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">🎯 Single City Generation</h3>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">City Name</label>
                        <input
                            type="text"
                            value={singleCity}
                            onChange={e => setSingleCity(e.target.value)}
                            placeholder="e.g., Pittsburgh"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">State Code</label>
                        <input
                            type="text"
                            value={singleState}
                            onChange={e => setSingleState(e.target.value)}
                            placeholder="e.g., PA"
                            maxLength={2}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm uppercase"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleSingleGenerate}
                            disabled={generating || !singleCity || !singleState}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                        >
                            {generating ? <Loader2 size={16} className="animate-spin" /> : '✨'} Generate
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress / Results */}
            {progress && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                        {progress.status === 'completed' ? (
                            <span className="flex items-center gap-2 text-green-700">
                                <CheckCircle size={20} /> Generation Complete
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Loader2 size={20} className="animate-spin" /> Generating...
                            </span>
                        )}
                    </h3>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">{progress.total}</div>
                            <div className="text-xs text-slate-500">Total</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{progress.completed}</div>
                            <div className="text-xs text-green-600">Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">{progress.skipped}</div>
                            <div className="text-xs text-amber-600">Skipped</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                            <div className="text-xs text-red-600">Failed</div>
                        </div>
                    </div>

                    {progress.errors.length > 0 && (
                        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-1.5">
                                <XCircle size={14} /> Errors
                            </h4>
                            <ul className="text-xs text-red-700 space-y-1">
                                {progress.errors.map((e, i) => (
                                    <li key={i}><strong>{e.city}:</strong> {e.error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Generated Cities List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Globe size={22} className="text-indigo-600" />
                        Generated Cities List
                    </h3>
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search cities..."
                            value={citySearch}
                            onChange={e => setCitySearch(e.target.value)}
                            className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loadingCities ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-indigo-600" size={32} />
                        </div>
                    ) : generatedCities.length > 0 ? (
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white border-b border-slate-100">
                                    <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="py-3 px-2">City/State</th>
                                        <th className="py-3 px-2">Tier</th>
                                        <th className="py-3 px-2 text-center">Quality</th>
                                        <th className="py-3 px-2 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {generatedCities
                                        .filter(c => c.city.toLowerCase().includes(citySearch.toLowerCase()))
                                        .map((cityRec, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-2 font-medium text-slate-700">
                                                    {cityRec.city}, {cityRec.state_id}
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${cityRec.population_tier === 1 ? 'bg-red-50 text-red-600' :
                                                        cityRec.population_tier === 2 ? 'bg-orange-50 text-orange-600' :
                                                            cityRec.population_tier === 3 ? 'bg-yellow-50 text-yellow-600' :
                                                                'bg-slate-50 text-slate-600'
                                                        }`}>
                                                        T{cityRec.population_tier}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${cityRec.content_quality_score >= 0.8 ? 'bg-green-500' :
                                                                    cityRec.content_quality_score >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${(cityRec.content_quality_score || 0) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] text-slate-500">{(cityRec.content_quality_score || 0).toFixed(1)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-right text-xs text-slate-400">
                                                    {new Date(cityRec.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <MapPin className="mx-auto text-slate-300 mb-2" size={32} />
                            <p className="text-slate-500 font-medium">No content generated for this niche yet.</p>
                            <p className="text-xs text-slate-400">Use the panels above to start generating AI content.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    )
}
