'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, 
  Layers, 
  Briefcase, 
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Button from './ui/Button'
import SectionBadge from './ui/SectionBadge'
import FilterSidebar from './ui/FilterSidebar'
import type { IndustryLandingPage, Media } from '@/payload-types'

interface IndustriesPageContentProps {
  industries: Partial<IndustryLandingPage>[]
}

const CATEGORIES = [
  { id: 'all', name: 'All Industries' },
  { id: 'professional', name: 'Professional Services', keywords: ['consultant', 'coach', 'agency', 'marketing', 'it', 'career', 'business', 'travel', 'management'] },
  { id: 'finance', name: 'Finance & Insurance', keywords: ['insurance', 'lender', 'mortgage', 'accounting', 'tax', 'bookkeeper', 'financial', 'investor', 'title', 'credit', 'bankruptcy'] },
  { id: 'healthcare', name: 'Healthcare', keywords: ['dental', 'chiropractor', 'dermatologist', 'medical', 'optometrist', 'clinic', 'health', 'wellness', 'nutrition', 'hair loss'] },
  { id: 'legal', name: 'Legal', keywords: ['lawyer', 'attorney', 'defense', 'immigration', 'family', 'personal injury', 'compensation'] },
  { id: 'home', name: 'Home Services', keywords: ['hvac', 'plumber', 'electrician', 'roofing', 'landscaping', 'inspector', 'housekeeper', 'locksmith', 'pressure washing', 'construction', 'interior design'] },
  { id: 'beauty', name: 'Beauty & Wellness', keywords: ['spa', 'salon', 'yoga', 'wellness', 'weight loss', 'barber', 'eyelash', 'groomer'] },
  { id: 'automotive', name: 'Automotive', keywords: ['auto', 'tire', 'brake', 'mechanic', 'towing', 'rv', 'detailing'] },
  { id: 'food', name: 'Food & Beverage', keywords: ['bakery', 'coffee', 'restaurant', 'bistro', 'steakhouse', 'shop', 'ice cream'] },
  { id: 'creative', name: 'Creative & Tech', keywords: ['design', 'video', 'content', 'web', 'graphic', 'producer', 'modeling', 'saas', 'software'] },
]

export default function IndustriesPageContent({ industries }: IndustriesPageContentProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Get category for an industry
  const getIndustryCategory = (name: string) => {
    const lowerName = name.toLowerCase()
    for (const cat of CATEGORIES) {
      if (cat.id === 'all') continue
      if (cat.keywords?.some(kw => lowerName.includes(kw))) {
        return cat.id
      }
    }
    return 'other'
  }

  // Filter industries
  const filteredIndustries = useMemo(() => {
    return industries.filter((industry) => {
      const name = industry.industryName || ''
      const matchesCategory = activeCategory === null || getIndustryCategory(name) === activeCategory
      return matchesCategory
    })
  }, [industries, activeCategory])

  // Group by category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    industries.forEach(ind => {
      const cat = getIndustryCategory(ind.industryName || '')
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [industries])

  const resetFilters = () => {
    setActiveCategory(null)
  }

  const sidebarCategories = CATEGORIES.filter(c => c.id !== 'all').map(c => ({
    id: c.id,
    name: c.name,
    slug: c.id
  }))

  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF5722]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-[#E91E63]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-8"
            >
              <Link href="/" className="hover:text-[#FF5722] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#FF5722]">Industries</span>
            </motion.div>

            <SectionBadge className="mb-6">Industry_Network</SectionBadge>
            <h1 className="text-5xl md:text-7xl font-bold uppercase font-oswald leading-[0.95] mb-8">
              Explore Our <br />
              <span className="text-gradient">Expertise</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed border-l-2 border-[#FF5722]/30 pl-6">
              We've built specialized solutions for over 90 industries. 
              Find your sector to see how we can transform your digital presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-zinc-50 py-20 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filter */}
            <FilterSidebar 
              categories={sidebarCategories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={categoryCounts}
              totalCount={industries.length}
              onClearAll={resetFilters}
              hasActiveFilters={activeCategory !== null}
              ctaCard={
                <div className="bg-brand-dark-gray p-8 rounded-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-xl font-bold uppercase font-oswald text-white mb-4">Need a Fast Fix?</h4>
                    <p className="text-zinc-400 text-sm mb-6">Expert developers standing by for emergency website repair.</p>
                    <Button as="link" href="/#contact" className="w-full">Get Help Now</Button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5722]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                </div>
              }
            />

            {/* Main Grid */}
            <main className="lg:w-3/4">
              <AnimatePresence mode="popLayout">
                {filteredIndustries.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {filteredIndustries.map((industry, index) => (
                      <IndustryCard 
                        key={industry.id || industry.slug} 
                        industry={industry} 
                        index={index} 
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-40 text-center"
                  >
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                      <Filter className="w-10 h-10 text-zinc-300" />
                    </div>
                    <h3 className="text-2xl font-bold font-oswald text-zinc-900 mb-2 uppercase">
                      No industries found
                    </h3>
                    <p className="text-zinc-500 mb-8 max-w-sm">
                      We couldn't find any industries in this category.
                    </p>
                    <Button variant="secondary" onClick={resetFilters}>
                      View All Industries
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF5722]/5 rounded-full blur-[150px]" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-12 h-12 text-[#FF5722] mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-bold uppercase font-oswald text-white mb-6">
              Don't See Your <span className="text-gradient">Industry?</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Our expertise spans far beyond this list. We specialize in building custom solutions for unique business models and complex challenges.
            </p>
            <Button as="link" href="/#contact" showFlame>
              Let's Discuss Your Project
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function IndustryCard({ industry, index }: { industry: Partial<IndustryLandingPage>, index: number }) {
  const featuredImage = industry.featuredImage as Media | undefined
  const imageUrl = featuredImage?.url || null
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5) }}
      className="group relative bg-white border border-zinc-200 overflow-hidden hover:shadow-2xl hover:shadow-[#FF5722]/10 transition-all duration-500 flex flex-col h-full"
    >
      {/* Card Header/Image */}
      <Link href={`/industries/${industry.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={industry.industryName || ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
            <Layers className="w-12 h-12 text-zinc-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Hover Label */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest">
          View Industry Details <ChevronRight className="w-4 h-4" />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-2xl font-bold uppercase font-oswald text-zinc-900 group-hover:text-[#FF5722] transition-colors line-clamp-1">
            {industry.industryName}
          </h3>
          <div className="h-1 w-12 bg-gradient-to-r from-[#FF5722] to-[#E91E63] mt-2 group-hover:w-full transition-all duration-500" />
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
          {industry.hero?.description}
        </p>

        <div className="pt-6 border-t border-zinc-100 flex items-center justify-between mt-auto">
          <Link 
            href={`/industries/${industry.slug}`}
            className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5722] font-bold flex items-center gap-2 group/btn"
          >
            Explore Solutions
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
            <Briefcase className="w-3 h-3 text-zinc-400" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

