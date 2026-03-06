'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, X, ArrowRight, FileText, Briefcase, Globe, Command } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearch } from './SearchProvider'

interface SearchResult {
  id: string
  title: string
  excerpt?: string
  priority?: number
  doc: {
    relationTo: string
    value: string | any
  }
}

const SearchModal: React.FC = () => {
  const { isOpen, closeSearch } = useSearch()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await res.json()
          setResults(data.results || [])
          setSelectedIndex(0)
        } catch (error) {
          console.error('Search error:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1))
    } else if (e.key === 'Enter') {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    }
  }

  const handleSelect = (result: SearchResult) => {
    const { doc } = result
    let url = '/'
    
    // Determine URL based on collection
    if (doc.relationTo === 'articles') {
      url = `/articles/${typeof doc.value === 'object' ? doc.value.slug : doc.value}`
    } else if (doc.relationTo === 'projects') {
      url = `/work/${typeof doc.value === 'object' ? doc.value.slug : doc.value}`
    } else if (doc.relationTo === 'industry-landing-pages') {
      url = `/industries/${typeof doc.value === 'object' ? doc.value.slug : doc.value}`
    }

    router.push(url)
    closeSearch()
  }

  const getIcon = (relationTo: string) => {
    switch (relationTo) {
      case 'articles': return <FileText className="w-4 h-4" />
      case 'projects': return <Briefcase className="w-4 h-4" />
      case 'industry-landing-pages': return <Globe className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getLabel = (relationTo: string) => {
    switch (relationTo) {
      case 'articles': return 'Article'
      case 'projects': return 'Project'
      case 'industry-landing-pages': return 'Industry'
      default: return 'Content'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeSearch}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF5722]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF5722]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF5722]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF5722]" />

            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <SearchIcon className="w-5 h-5 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search articles, projects, and industries..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 text-lg"
              />
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-zinc-500 font-mono">
                  <Command className="w-2.5 h-2.5" /> K
                </div>
                <button
                  onClick={closeSearch}
                  className="p-1 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-3 flex items-start gap-4 transition-colors ${
                        index === selectedIndex ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className={`mt-1 p-2 rounded bg-zinc-800 ${
                        index === selectedIndex ? 'text-[#FF5722]' : 'text-zinc-500'
                      }`}>
                        {getIcon(result.doc.relationTo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                            {getLabel(result.doc.relationTo)}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold truncate ${
                          index === selectedIndex ? 'text-white' : 'text-zinc-300'
                        }`}>
                          {result.title}
                        </h3>
                        {result.excerpt && (
                          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                      <ArrowRight className={`w-4 h-4 mt-2 transition-transform ${
                        index === selectedIndex ? 'translate-x-0 text-[#FF5722] opacity-100' : '-translate-x-2 opacity-0'
                      }`} />
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-12 text-center text-zinc-500">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-zinc-500 text-sm mb-4">Try searching for things like:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['SaaS', 'Marketing', 'Automation', 'Web Design'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-[#FF5722] transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-zinc-950/50 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="px-1 py-0.5 rounded bg-zinc-800 border border-white/10 text-zinc-400">ESC</span> to close
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="px-1 py-0.5 rounded bg-zinc-800 border border-white/10 text-zinc-400">↵</span> to select
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#FF5722]">
                Excelsior Search
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SearchModal

