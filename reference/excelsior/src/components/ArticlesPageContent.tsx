'use client'

import { useState, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, Tag, Newspaper, X, Filter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import type { Article, Media } from '@/payload-types'
import { useContactDialog } from './ContactDialogProvider'
import Button from './ui/Button'
import FilterSidebar from './ui/FilterSidebar'

// Simplified type for what we fetch
export type CategoryListItem = {
  id: number;
  name: string;
  slug: string;
  icon?: 'code' | 'zap' | 'wrench' | 'building' | 'globe' | 'shield' | null;
};

export type TagListItem = {
  id: number;
  name: string;
  slug: string;
  color?: string | null;
};

interface ArticlesPageContentProps {
  articles: Article[]
  categories: CategoryListItem[]
  tags: TagListItem[]
}

// Helper to get media URL
function getMediaUrl(media: Media | number | null | undefined): string | undefined {
  if (!media || typeof media === 'number') return undefined
  return media.url || undefined
}

// Helper to format date
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default function ArticlesPageContent({ articles, categories, tags }: ArticlesPageContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 100])
  const { openContactDialog } = useContactDialog()

  const toggleTag = (slug: string) => {
    setActiveTags(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const clearFilters = () => {
    setActiveCategory(null)
    setActiveTags([])
  }

  // Filter articles by category and tags
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const categoryMatch = !activeCategory || (typeof article.category === 'object' && article.category?.slug === activeCategory)
      const tagsMatch = activeTags.length === 0 || activeTags.every(tagSlug => 
        Array.isArray(article.tags) && article.tags.some(t => typeof t === 'object' && t.slug === tagSlug)
      )
      return categoryMatch && tagsMatch
    })
  }, [articles, activeCategory, activeTags])

  // Get featured articles
  const featuredArticles = articles.filter((a) => a.featured).slice(0, 3)

  // Get counts for sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    articles.forEach(article => {
      if (typeof article.category === 'object' && article.category?.slug) {
        counts[article.category.slug] = (counts[article.category.slug] || 0) + 1
      }
    })
    return counts
  }, [articles])

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    articles.forEach(article => {
      if (Array.isArray(article.tags)) {
        article.tags.forEach(t => {
          if (typeof t === 'object' && t.slug) {
            counts[t.slug] = (counts[t.slug] || 0) + 1
          }
        })
      }
    })
    return counts
  }, [articles])

  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          style={{ y: heroY }}
          className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0"
        >
          <Image
            src="/services/tree.svg"
            alt=""
            aria-hidden="true"
            fill
            className="object-contain object-right"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-8"
          >
            <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#FF5722]">Articles</span>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,87,34,0.3)]">
                <Newspaper className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold uppercase font-oswald leading-[0.95]">
                Our <br />
                <span className="text-gradient">Articles</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-md">
              <p className="text-zinc-400 leading-relaxed border-l-2 border-[#FF5722]/30 pl-4">
                Expert insights on web development, emergency website solutions, and digital
                strategies for Orange County businesses. Stay informed with the latest
                trends and best practices.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      {!activeCategory && activeTags.length === 0 && featuredArticles.length > 0 && (
        <section className="py-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold uppercase font-oswald mb-8 flex items-center gap-3 text-zinc-900">
              <span className="w-8 h-[2px] bg-[#FF5722]" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArticles.map((article, index) => {
                const category = typeof article.category === 'object' ? article.category : null
                const imageUrl = getMediaUrl(article.featuredImage as Media)
                return (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/articles/${article.slug}`}>
                      <div className="relative aspect-[16/10] bg-zinc-200 overflow-hidden mb-4 rounded-lg">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Newspaper className="w-16 h-16 text-zinc-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          {category && (
                            <span className="inline-block px-3 py-1 bg-[#FF5722] text-white text-xs font-mono uppercase">
                              {category.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#FF5722] transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-zinc-600 text-sm line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area with Sidebar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filter */}
            <FilterSidebar 
              categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={categoryCounts}
              totalCount={articles.length}
              tags={tags}
              activeTags={activeTags}
              onTagToggle={toggleTag}
              tagCounts={tagCounts}
              onClearAll={clearFilters}
              hasActiveFilters={activeCategory !== null || activeTags.length > 0}
              ctaCard={
                <div className="bg-brand-dark-gray p-8 rounded-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold uppercase font-oswald text-white mb-4">Need a Fast Fix?</h4>
                    <p className="text-zinc-400 text-sm mb-6">Expert developers standing by for emergency website repair.</p>
                    <Button onClick={openContactDialog} className="w-full">Get Help Now</Button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                </div>
              }
            />

            {/* Articles Grid */}
            <main className="lg:w-3/4">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
                  Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
                </p>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredArticles.map((article, index) => {
                      const category = typeof article.category === 'object' ? article.category : null
                      const imageUrl = getMediaUrl(article.featuredImage as Media)
                      return (
                        <motion.article
                          layout
                          key={article.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="group bg-white border border-zinc-200 hover:border-[#FF5722]/30 transition-all shadow-sm hover:shadow-xl rounded-xl overflow-hidden flex flex-col"
                        >
                          <Link href={`/articles/${article.slug}`} className="flex flex-col h-full">
                            <div className="relative aspect-[16/9] bg-zinc-100 overflow-hidden">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={article.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Newspaper className="w-12 h-12 text-zinc-300" />
                                </div>
                              )}
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                              <div className="flex items-center gap-3 mb-4">
                                {category && (
                                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-tighter text-[#FF5722] uppercase">
                                    <Tag className="w-3 h-3" />
                                    {category.name}
                                  </span>
                                )}
                                <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(article.publishedAt)}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#FF5722] transition-colors mb-3 line-clamp-2 leading-tight uppercase font-oswald">
                                {article.title}
                              </h3>
                              <p className="text-zinc-600 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                                {article.excerpt}
                              </p>
                              
                              {/* Display Tags */}
                              {Array.isArray(article.tags) && article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-6">
                                  {article.tags.slice(0, 3).map((t) => {
                                    if (typeof t !== 'object') return null;
                                    return (
                                      <span key={t.id} className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-mono rounded-full border border-zinc-200 uppercase">
                                        {t.name}
                                      </span>
                                    );
                                  })}
                                  {article.tags.length > 3 && (
                                    <span className="text-[10px] font-mono text-zinc-400">+{article.tags.length - 3}</span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center gap-2 text-[#FF5722] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all mt-auto border-t border-zinc-100 pt-6">
                                <span>Read Full Article</span>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </Link>
                        </motion.article>
                      )
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
                  <Newspaper className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-zinc-600 mb-2">No articles match your filters</h3>
                  <p className="text-zinc-500 mb-8">Try selecting different categories or tags.</p>
                  <Button onClick={clearFilters} variant="secondary">Clear All Filters</Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-6xl font-bold uppercase font-oswald text-white mb-6">
                Need Help <span className="text-gradient">Right Now?</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                Whether you're facing a website emergency or planning your next project,
                our team is ready to help you succeed.
              </p>
              <Button onClick={openContactDialog}>Let's Cook</Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
