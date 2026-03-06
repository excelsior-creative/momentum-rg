import { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon; // Using LucideIcon component
}

export interface CaseStudy {
  id: string;
  client: string;
  category: string;
  image: string;
  result: string;
}

export enum NavSection {
  HOME = 'home',
  ABOUT = 'about',
  SERVICES = 'services',
  PROCESS = 'process',
  WORK = 'work',
  ARTICLES = 'articles',
  AI_LAB = 'ai-lab',
  CONTACT = 'contact'
}
