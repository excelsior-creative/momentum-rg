/**
 * SEO Keywords Configuration
 * Organized by category for better topic selection during article generation
 */

export type KeywordCategory = "emergency" | "development" | "fixes" | "local";

export type KeywordEntry = {
  keyword: string;
  category: KeywordCategory;
  location?: string;
};

export const seoKeywords: KeywordEntry[] = [
  // Emergency Services
  {
    keyword: "Emergency website repair",
    category: "emergency",
    location: "Orange County",
  },
  { keyword: "Urgent web fix", category: "emergency", location: "OC" },
  {
    keyword: "24/7 website support",
    category: "emergency",
    location: "Irvine",
  },
  {
    keyword: "Immediate hacked site recovery",
    category: "emergency",
    location: "Anaheim",
  },
  {
    keyword: "Fast website downtime fix",
    category: "emergency",
    location: "Santa Ana",
  },
  {
    keyword: "Emergency web update",
    category: "emergency",
    location: "Huntington Beach",
  },
  {
    keyword: "Quick SSL installation",
    category: "emergency",
    location: "Orange County",
  },
  {
    keyword: "Urgent e-commerce bug repair",
    category: "emergency",
    location: "OC",
  },
  {
    keyword: "Rapid website error fix",
    category: "emergency",
    location: "Irvine",
  },
  {
    keyword: "24-hour web security help",
    category: "emergency",
    location: "Anaheim",
  },
  {
    keyword: "Immediate mobile site repair",
    category: "emergency",
    location: "Santa Ana",
  },
  {
    keyword: "Urgent domain issue fix",
    category: "emergency",
    location: "Huntington Beach",
  },
  {
    keyword: "Fast website migration",
    category: "emergency",
    location: "Orange County",
  },

  // Web Development Services
  {
    keyword: "Web development services",
    category: "development",
    location: "Orange County",
  },
  { keyword: "Custom website design", category: "development", location: "OC" },
  {
    keyword: "E-commerce development",
    category: "development",
    location: "Irvine",
  },
  {
    keyword: "WordPress developer",
    category: "development",
    location: "Anaheim",
  },
  {
    keyword: "Shopify setup services",
    category: "development",
    location: "Santa Ana",
  },
  {
    keyword: "SEO web optimization",
    category: "development",
    location: "Huntington Beach",
  },
  {
    keyword: "Mobile app integration",
    category: "development",
    location: "Orange County",
  },
  { keyword: "CMS development", category: "development", location: "OC" },
  {
    keyword: "API integration services",
    category: "development",
    location: "Irvine",
  },
  {
    keyword: "Full-stack web development",
    category: "development",
    location: "Anaheim",
  },
  {
    keyword: "React.js developer",
    category: "development",
    location: "Santa Ana",
  },
  {
    keyword: "Payment gateway setup",
    category: "development",
    location: "Huntington Beach",
  },

  // Website Fixes & Repairs
  { keyword: "Fix slow website", category: "fixes", location: "Orange County" },
  { keyword: "Hacked website repair", category: "fixes", location: "OC" },
  { keyword: "Website not loading fix", category: "fixes", location: "Irvine" },
  { keyword: "Broken links repair", category: "fixes", location: "Anaheim" },
  {
    keyword: "Unresponsive mobile site fix",
    category: "fixes",
    location: "Santa Ana",
  },
  {
    keyword: "Outdated website redesign",
    category: "fixes",
    location: "Huntington Beach",
  },
  {
    keyword: "Database error fix",
    category: "fixes",
    location: "Orange County",
  },
  { keyword: "Web hosting issues repair", category: "fixes", location: "OC" },
  {
    keyword: "SSL certificate problems",
    category: "fixes",
    location: "Irvine",
  },
  {
    keyword: "E-commerce cart issues fix",
    category: "fixes",
    location: "Anaheim",
  },
  {
    keyword: "Website accessibility compliance",
    category: "fixes",
    location: "Santa Ana",
  },
  {
    keyword: "Email setup problems",
    category: "fixes",
    location: "Huntington Beach",
  },

  // Local Search / Agency Keywords
  {
    keyword: "Web developer near me",
    category: "local",
    location: "Orange County",
  },
  { keyword: "Hire web agency", category: "local", location: "OC" },
  { keyword: "Best web design company", category: "local", location: "Irvine" },
  { keyword: "Local web developer", category: "local", location: "Anaheim" },
  { keyword: "Web development firm", category: "local", location: "Santa Ana" },
  {
    keyword: "Professional website builder",
    category: "local",
    location: "Huntington Beach",
  },
  {
    keyword: "Affordable web services",
    category: "local",
    location: "Orange County",
  },
  { keyword: "Web agency quote", category: "local", location: "OC" },
  { keyword: "Top web developer", category: "local", location: "Irvine" },
  { keyword: "Custom web dev company", category: "local", location: "Anaheim" },
  { keyword: "Web design expert", category: "local", location: "Santa Ana" },
  {
    keyword: "Local e-commerce developer",
    category: "local",
    location: "Huntington Beach",
  },
  {
    keyword: "Web maintenance near me",
    category: "local",
    location: "Orange County",
  },
];

/**
 * Get keywords by category
 */
export function getKeywordsByCategory(
  category: KeywordCategory
): KeywordEntry[] {
  return seoKeywords.filter((k) => k.category === category);
}

/**
 * Get a random selection of keywords for topic research
 */
export function getRandomKeywords(count: number = 5): KeywordEntry[] {
  const shuffled = [...seoKeywords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get all unique locations
 */
export function getUniqueLocations(): string[] {
  const locations = seoKeywords
    .map((k) => k.location)
    .filter(Boolean) as string[];
  return [...new Set(locations)];
}

/**
 * Format keyword with location for SEO targeting
 */
export function formatKeywordWithLocation(entry: KeywordEntry): string {
  return entry.location ? `${entry.keyword} ${entry.location}` : entry.keyword;
}
