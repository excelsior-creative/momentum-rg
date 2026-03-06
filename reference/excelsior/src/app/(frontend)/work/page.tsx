import { getProjects } from '@/lib/payload'
import WorkPageContent from './WorkPageContent'
import type { Media } from '@/payload-types'
import type { PortfolioProject, ProjectCategory } from '@/components/FilterablePortfolio'
import { generatePageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

// Revalidate page every 60 seconds
export const revalidate = 60

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Work - Portfolio',
  description:
    'Explore our portfolio of web development projects for nonprofits and professional organizations across Orange County. Custom websites, AI solutions, and digital experiences that drive real results.',
  path: '/work',
  keywords: [
    "web development portfolio",
    "custom software case studies",
    "nonprofit website examples",
    "Next.js project portfolio",
    "AI solution implementations",
    "enterprise web applications",
  ],
})

// Helper to get image URL from Payload media
function getMediaUrl(media: number | Media | null | undefined): string | undefined {
  if (!media) return undefined;
  if (typeof media === 'number') return undefined;
  return media.url || undefined;
}

// Type for what getProjects returns (partial project data)
type ProjectListItem = {
  id: number;
  title: string;
  slug: string;
  category: string;
  filterCategory: 'nonprofit' | 'professional';
  image?: number | Media | null;
  imagePath?: string | null;
  link?: string | null;
};

// Transform project to PortfolioProject
function transformProject(project: ProjectListItem): PortfolioProject {
  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    category: project.category,
    filterCategory: project.filterCategory as ProjectCategory,
    image: getMediaUrl(project.image) || project.imagePath || undefined,
    link: project.link || undefined,
    isPlaceholder: false,
  }
}

export default async function WorkPage() {
  const projects = await getProjects()
  
  // Transform Payload projects to PortfolioProject format
  const transformedProjects: PortfolioProject[] = projects.map(transformProject)

  return <WorkPageContent projects={transformedProjects} />
}
