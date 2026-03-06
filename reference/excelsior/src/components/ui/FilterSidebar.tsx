'use client'

import React from 'react'
import { X, Filter } from 'lucide-react'

type Category = {
  id: string | number;
  name: string;
  slug: string;
};

type Tag = {
  id: string | number;
  name: string;
  slug: string;
  color?: string | null;
};

type FilterSidebarProps = {
  // Primary filter (categories)
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
  
  // Optional secondary filter (tags)
  tags?: Tag[];
  activeTags?: string[];
  onTagToggle?: (slug: string) => void;
  tagCounts?: Record<string, number>;
  
  // Clear action
  onClearAll?: () => void;
  hasActiveFilters: boolean;
  
  // Optional CTA card slot
  ctaCard?: React.ReactNode;
};

export default function FilterSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts = {},
  totalCount = 0,
  tags = [],
  activeTags = [],
  onTagToggle,
  tagCounts = {},
  onClearAll,
  hasActiveFilters,
  ctaCard
}: FilterSidebarProps) {
  return (
    <aside className="lg:w-1/4 space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold uppercase font-oswald text-zinc-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#FF5722]" />
            Filters
          </h3>
          {hasActiveFilters && onClearAll && (
            <button 
              onClick={onClearAll}
              className="text-xs font-mono text-[#FF5722] hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">Categories</p>
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full flex items-center justify-between px-4 py-2 text-sm font-mono uppercase transition-all border ${
              activeCategory === null
                ? 'bg-[#FF5722] text-white border-[#FF5722]'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            <span>All</span>
            <span className="text-[10px] opacity-60">{totalCount}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm font-mono uppercase transition-all border ${
                activeCategory === category.slug
                  ? 'bg-[#FF5722] text-white border-[#FF5722]'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <span>{category.name}</span>
              <span className="text-[10px] opacity-60">{categoryCounts[category.slug] || 0}</span>
            </button>
          ))}
        </div>

        {/* Tags */}
        {tags.length > 0 && onTagToggle && (
          <div className="mt-10">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => onTagToggle(tag.slug)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase transition-all border rounded-full flex items-center gap-2 ${
                    activeTags.includes(tag.slug)
                      ? 'bg-[#FF5722] text-white border-[#FF5722]'
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  {tag.name}
                  <span className="text-[10px] opacity-60">({tagCounts[tag.slug] || 0})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Card Slot */}
      {ctaCard}
    </aside>
  )
}

