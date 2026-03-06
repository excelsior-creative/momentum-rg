"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export type ProjectCategory = "all" | "nonprofit" | "professional";

export interface PortfolioProject {
  id: number;
  title: string;
  slug: string;
  category: string;
  filterCategory: ProjectCategory;
  image?: string;
  link?: string;
  isPlaceholder?: boolean;
}

interface FilterablePortfolioProps {
  projects: PortfolioProject[];
}

const categoryLabels: Record<ProjectCategory, string> = {
  all: "All Projects",
  nonprofit: "Nonprofits",
  professional: "Professional Services",
};

// Project Card Component
const ProjectCard: React.FC<{ project: PortfolioProject; index: number }> = ({
  project,
  index,
}) => {
  if (project.isPlaceholder) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.02 }}
        className="group relative aspect-[8/5] w-full bg-zinc-900 border border-white/5 overflow-hidden"
      >
        {/* Placeholder pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[length:20px_20px]" />

        {/* Coming soon overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border border-white/10 rounded-lg flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white/10 font-oswald">
              {String(project.id).padStart(2, "0")}
            </span>
          </div>
          <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">
            Coming Soon
          </span>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover:border-[#FF5722] transition-colors z-10" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover:border-[#FF5722] transition-colors z-10" />
      </motion.div>
    );
  }

  return (
    <Link href={`/work/${project.slug}`} passHref legacyBehavior>
      <motion.a
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, delay: index * 0.02 }}
        className="hover-trigger group block relative aspect-[8/5] w-full bg-zinc-900 border border-white/10 overflow-hidden cursor-pointer"
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover:border-[#FF5722] transition-colors z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover:border-[#FF5722] transition-colors z-30" />

        {/* Image */}
        <div className="absolute inset-0 z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0">
          {project.image && (
            <Image
              src={project.image}
              alt={`${project.title} - ${project.category || 'Web Development'} project by Excelsior Creative`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000"
            />
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-0 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-20 transition-opacity duration-500">
          <h3 className="text-3xl md:text-4xl font-bold uppercase italic text-white group-hover:opacity-0 transition-all duration-500">
            {project.title}
          </h3>
        </div>
      </motion.a>
    </Link>
  );
};

// Filter Tab Component
const FilterTab: React.FC<{
  category: ProjectCategory;
  isActive: boolean;
  count: number;
  onClick: () => void;
}> = ({ category, isActive, count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-3 font-mono text-sm uppercase tracking-widest transition-all ${
        isActive ? "text-white" : "text-zinc-600 hover:text-zinc-900"
      }`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {categoryLabels[category]}
        <span
          className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
            isActive ? "bg-[#FF5722] text-white" : "bg-zinc-200 text-zinc-600"
          }`}
        >
          {count}
        </span>
      </span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-zinc-900 border border-zinc-900"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
};

const FilterablePortfolio: React.FC<FilterablePortfolioProps> = ({
  projects,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.filterCategory === activeCategory);
  }, [projects, activeCategory]);

  const categoryCounts = useMemo(() => {
    return {
      all: projects.length,
      nonprofit: projects.filter((p) => p.filterCategory === "nonprofit")
        .length,
      professional: projects.filter((p) => p.filterCategory === "professional")
        .length,
    };
  }, [projects]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {(Object.keys(categoryLabels) as ProjectCategory[]).map((category) => (
          <FilterTab
            key={category}
            category={category}
            isActive={activeCategory === category}
            count={categoryCounts[category]}
            onClick={() => setActiveCategory(category)}
          />
        ))}
      </div>

      {/* Project Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Results count */}
      <div className="mt-12 text-center">
        <p className="text-zinc-600 font-mono text-sm">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
      </div>
    </div>
  );
};

export default FilterablePortfolio;
