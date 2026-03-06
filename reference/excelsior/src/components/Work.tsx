"use client";

import type { Media } from "@/payload-types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { FeaturedProject } from "./MainContent";
import Button from "./ui/Button";
import CommentText from "./ui/CommentText";

// Helper to get image URL from Payload media
function getMediaUrl(
  media: number | Media | null | undefined
): string | undefined {
  if (!media) return undefined;
  if (typeof media === "number") return undefined;
  return media.url || undefined;
}

interface ProjectCardProps {
  project: FeaturedProject;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  // Use uploaded media URL, or fall back to static path
  const imageUrl = getMediaUrl(project.image) || project.imagePath || undefined;
  const displayId = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
    >
      <Link
        href={`/work/${project.slug}`}
        className={`hover-trigger group block relative aspect-[8/5] w-full bg-zinc-900 border border-white/10 overflow-hidden ${
          index % 2 !== 0 ? "md:translate-y-24" : ""
        }`}
      >
        {/* Slit Scan Effect Layers - CSS Trickery */}
        <div className="absolute inset-0 z-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${project.title} - ${project.category} project by Excelsior Creative`}
              fill
              priority={index < 2}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <span className="text-zinc-600 font-mono text-xs">
                PROJECT_{String(displayId).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-0 transition-opacity duration-500"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 z-20 transition-opacity duration-500">
          <h3 className="text-5xl font-bold uppercase italic text-white group-hover:opacity-0 transition-all duration-500">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
};

interface WorkProps {
  projects: FeaturedProject[];
}

const Work: React.FC<WorkProps> = ({ projects }) => {
  // Featured projects are already sorted by the query
  const sortedProjects = projects;

  return (
    <section id="work" className="py-32 bg-brand-dark-gray relative text-white">
      {/* Background Noise Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </div>
              <div className="text-[#FF5722] text-sm tracking-widest font-mono uppercase">
                CLIENT_SUCCESS
              </div>
            </div>
            <h2 className="text-6xl md:text-8xl font-bold uppercase leading-none">
              Featured <br />
              <span className="text-gradient hover-trigger">Work</span>
            </h2>
          </div>
          <CommentText
            lines={["PRIDE IN EVERY PROJECT", "ORANGE COUNTY & BEYOND"]}
            variant="dark"
            className="hidden md:block max-w-md text-right"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {sortedProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="mt-32 text-center">
          <Button as="link" href="/work">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Work;
