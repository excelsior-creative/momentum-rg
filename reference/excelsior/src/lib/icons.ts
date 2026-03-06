import {
  Code2,
  Bot,
  Server,
  Palette,
  Cpu,
  Globe,
  Zap,
  Shield,
  Gauge,
  Search,
  Smartphone,
  Accessibility,
  Layers,
  Database,
  Cloud,
  Lock,
  Wrench,
  AlertTriangle,
  Bug,
  Building,
  Clock,
  Check,
  Star,
  Rocket,
  LucideIcon,
} from 'lucide-react'

// Map icon string values from Payload CMS to Lucide React components
export const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  bot: Bot,
  server: Server,
  palette: Palette,
  cpu: Cpu,
  globe: Globe,
  zap: Zap,
  shield: Shield,
  gauge: Gauge,
  search: Search,
  smartphone: Smartphone,
  accessibility: Accessibility,
  layers: Layers,
  database: Database,
  cloud: Cloud,
  lock: Lock,
  wrench: Wrench,
  alert: AlertTriangle,
  bug: Bug,
  building: Building,
  clock: Clock,
  check: Check,
  star: Star,
  rocket: Rocket,
}

export function getIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName) return Code2
  return iconMap[iconName] || Code2
}

export type IconName = keyof typeof iconMap

