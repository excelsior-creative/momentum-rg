import { generatePageMetadata } from "@/lib/metadata";
import { getProjectBySlug, getProjects } from "@/lib/payload";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetailContent from "./ProjectDetailContent";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return generatePageMetadata({
      title: "Project Not Found",
      description: "The requested project could not be found.",
      path: `/work/${slug}`,
    });
  }

  return generatePageMetadata({
    title: `${project.title} - Our Work`,
    description:
      project.summary || `Learn about our work with ${project.title}`,
    path: `/work/${slug}`,
    keywords: [
      project.title,
      project.category,
      ...(project.tags?.map((t) => t.tag) || []),
    ].filter(Boolean) as string[],
  });
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}
