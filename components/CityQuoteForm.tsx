'use client'

import { useState } from 'react'
import { Send, MapPin, Phone, User, Mail, FileText, CheckCircle2 } from 'lucide-react'

interface CityQuoteFormProps {
    city: string
    state: string
    stateCode: string
    serviceName: string
    brandName: string
    contactPhone?: string
}

/**
 * City-Specific Quote Form
 * 
 * Each city page gets a contact form that captures city/state context,
 * proving to Google this is a genuine landing page serving local users —
 * not a doorway page.
 */
export default function CityQuoteForm({ city, state, stateCode, serviceName, brandName, contactPhone }: CityQuoteFormProps) {
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        projectDetails: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In production, this would POST to an API endpoint
        console.log('Quote request submitted:', { ...formData, city, state, stateCode, serviceName })
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <section className="py-16 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-4">
                        Thank You!
                    </h3>
                    <p className="text-lg text-slate-600 mb-6">
                        Your {serviceName.toLowerCase()} quote request for {city}, {stateCode} has been received.
                        A local specialist will contact you within 24 hours.
                    </p>
                    {contactPhone && (
                        <p className="text-slate-500">
                            Need immediate assistance? Call us at{' '}
                            <a href={`tel:${contactPhone}`} className="text-blue-600 font-semibold hover:underline">
                                {contactPhone}
                            </a>
                        </p>
                    )}
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" id="quote">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Left Column: CTA Content */}
                    <div className="lg:col-span-2 text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-blue-300 text-sm font-bold mb-6">
                            <MapPin className="w-4 h-4" /> {city}, {stateCode}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            Get Your Free {serviceName} Estimate in {city}
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                            Tell us about your project and receive a detailed, no-obligation quote from our {state} team. Most estimates delivered within 24 hours.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span>Free, no-obligation estimate</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span>Response within 24 hours</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span>Licensed {stateCode} contractors</span>
                            </div>
                        </div>

                        {contactPhone && (
                            <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-sm text-slate-400 mb-2">Prefer to call?</p>
                                <a href={`tel:${contactPhone}`} className="flex items-center gap-3 text-white text-xl font-bold hover:text-blue-300 transition-colors">
                                    <Phone className="w-5 h-5" />
                                    {contactPhone}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/20">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">
                                Your {city} Project Details
                            </h3>

                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label htmlFor="quote-name" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            id="quote-name"
                                            name="name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Phone + Email */}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="quote-phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                id="quote-phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="(555) 123-4567"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="quote-email" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                id="quote-email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@email.com"
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Property Address */}
                                <div>
                                    <label htmlFor="quote-address" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Property Address in {city}
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            id="quote-address"
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder={`Street address in ${city}, ${stateCode}`}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Project Description */}
                                <div>
                                    <label htmlFor="quote-details" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Project Description
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                        <textarea
                                            id="quote-details"
                                            name="projectDetails"
                                            rows={4}
                                            value={formData.projectDetails}
                                            onChange={handleChange}
                                            placeholder={`Describe your ${serviceName.toLowerCase()} project...`}
                                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Hidden fields for tracking */}
                                <input type="hidden" name="city" value={city} />
                                <input type="hidden" name="state" value={state} />
                                <input type="hidden" name="stateCode" value={stateCode} />
                                <input type="hidden" name="service" value={serviceName} />

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                                >
                                    <Send className="w-5 h-5" />
                                    Get Your Free {city} Quote
                                </button>
                            </div>

                            <p className="text-xs text-slate-400 text-center mt-4">
                                No spam, no obligation. Your information is secure and only shared with your local {brandName} team.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
