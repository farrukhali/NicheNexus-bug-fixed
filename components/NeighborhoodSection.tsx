import { MapPin, Building2, Info } from 'lucide-react'

interface NeighborhoodData {
    city: string
    state: string
    neighborhoods: string[]
    famous_buildings: string[]
    description: string
}

interface NeighborhoodSectionProps {
    data: NeighborhoodData
}

export default function NeighborhoodSection({ data }: NeighborhoodSectionProps) {
    if (!data) return null

    return (
        <section className="py-20 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Side: Content & Description */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider">
                            <MapPin size={16} /> Local Service Area
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                            Serving Every Corner of {data.city}, {data.state}
                        </h2>
                        <div className="prose prose-slate lg:prose-lg max-w-none">
                            <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-blue-500 pl-6 py-2">
                                {data.description}
                            </p>
                        </div>

                        {/* Famous Buildings / POIs */}
                        {data.famous_buildings && data.famous_buildings.length > 0 && (
                            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                    <Building2 size={120} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                    <Building2 className="text-blue-600" size={24} />
                                    Local Landmarks We Serve Near
                                </h3>
                                <div className="flex flex-wrap gap-2 relative z-10">
                                    {data.famous_buildings.map((building, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-xl border border-slate-200 shadow-sm"
                                        >
                                            {building}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Neighborhood Grid */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-[3rem] blur-3xl opacity-5 -rotate-6"></div>
                        <div className="relative bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-blue-900/5">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                    <Info size={20} />
                                </span>
                                Serviceable Neighborhoods
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {data.neighborhoods.map((area, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-2 h-2 rounded-full bg-blue-200 group-hover:bg-blue-500 transition-colors"></div>
                                        <span className="text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                                            {area}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 p-6 bg-blue-600 rounded-2xl text-white">
                                <p className="text-sm font-medium opacity-90">
                                    Don't see your neighborhood? We serve all zip codes in {data.city} and the surrounding metropolitan area!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
