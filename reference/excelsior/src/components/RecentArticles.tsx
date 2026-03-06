'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Newspaper, Tag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Article, Media } from '@/payload-types'
import Button from './ui/Button'

interface RecentArticlesProps {
  articles: Article[]
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

const RecentArticles: React.FC<RecentArticlesProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null

  return (
    <section id="recent-articles" className="py-32 relative bg-zinc-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-100 pointer-events-none" />
      
      {/* Gradient orb */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5722] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5722]"></span>
              </div>
              <div className="text-zinc-500 text-sm tracking-widest font-mono uppercase">LATEST_INSIGHTS</div>
            </div>
            <h2 className="text-5xl font-bold uppercase text-black font-oswald">
              Recent <span className="text-gradient">Articles</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/articles">
              <Button variant="secondary" className="group">
                View All Articles
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => {
            const category = typeof article.category === 'object' ? article.category : null
            const imageUrl = getMediaUrl(article.featuredImage as Media)

            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col bg-white border border-black/5 hover:border-[#FF5722]/30 transition-all shadow-sm hover:shadow-2xl hover:shadow-black/5"
              >
                <Link href={`/articles/${article.slug}`} className="flex flex-col h-full">
                  <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-zinc-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#FF5722] text-white text-[10px] font-mono uppercase tracking-wider">
                          {category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mb-4 uppercase tracking-widest">
                      <Calendar className="w-3 h-3 text-[#FF5722]" />
                      {formatDate(article.publishedAt)}
                    </div>
                    
                    <h3 className="text-xl font-bold text-black group-hover:text-[#FF5722] transition-colors mb-4 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    
                    <p className="text-zinc-600 text-sm line-clamp-3 mb-6 flex-1">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[#FF5722] text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all mt-auto">
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RecentArticles

