'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Link, Heading1, Heading2 } from 'lucide-react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Update content if value changes externally (e.g. AI generation)
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || ''
        }
    }, [value])

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value)
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    if (!isMounted) return <div className="h-64 bg-slate-50 animate-pulse rounded-xl" />

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Heading 2"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h3>')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Heading 3"
                >
                    <Heading2 size={18} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Italic"
                >
                    <Italic size={18} />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1" />
                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Enter URL:')
                        if (url) execCommand('createLink', url)
                    }}
                    className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"
                    title="Link"
                >
                    <Link size={18} />
                </button>
            </div>

            {/* Editable Area */}
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="p-4 min-h-[300px] outline-none prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-bold"
                data-placeholder={placeholder}
            />

            <style jsx global>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                    cursor: text;
                }
            `}</style>
        </div>
    )
}
