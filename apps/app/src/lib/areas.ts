import { Car, Home, MapPin, School, TrendingUp } from "lucide-react";
import { siteMediaPaths, wpMediaUrl } from "@/lib/wpMediaUrl";

const areaHeroImage = wpMediaUrl(siteMediaPaths.heroOrangeCounty);

export const AREAS = {
  "long-beach": {
    name: "Long Beach",
    county: "Los Angeles County",
    zipCodes: ["90804", "90803", "90815", "90807", "90806"],
    heroImage: areaHeroImage,
    tagline: "Where the Coast Meets Community",
    description:
      "Long Beach is California's seventh-largest city, with a diverse housing stock that ranges from coastal condos and Belmont Shore homes to value-driven duplexes and investment properties near CSULB and downtown.",
    cardDescription:
      "From Belmont Shore to Signal Hill, Long Beach offers a vibrant coastal real estate market with diverse housing options for every lifestyle.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$685K-$1.1M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~5.2%" },
      { icon: MapPin, label: "Key Zip Codes", value: "90804, 90803, 90815" },
      { icon: School, label: "Schools", value: "Long Beach USD" },
    ],
    neighborhoods: [
      {
        name: "Belmont Shore / Belmont Heights",
        zip: "90803",
        description:
          "Walkable beachside living near Second Street dining, the Belmont Pier, and some of Long Beach's most desirable single-family and condo inventory.",
      },
      {
        name: "Central Long Beach",
        zip: "90804",
        description:
          "A strong value market with revitalization upside, rental demand, and classic bungalow plus duplex inventory for owner-occupants and investors.",
      },
      {
        name: "East Long Beach / Los Altos",
        zip: "90815",
        description:
          "Established streets, larger lots, respected schools, and move-up inventory that stays in demand with family buyers.",
      },
      {
        name: "Bixby Knolls",
        zip: "90807",
        description:
          "Known for architectural character, walkability, and a strong neighborhood identity that supports long-term value.",
      },
    ],
    whyBuy:
      "Long Beach gives buyers, landlords, and move-up families unusual flexibility: coastal lifestyle, strong rental fundamentals, and a lower entry point than many Orange County beach cities.",
    cityFilter: "long-beach",
  },
  "huntington-beach": {
    name: "Huntington Beach",
    county: "Orange County",
    zipCodes: ["92649", "92648", "92646", "92647"],
    heroImage: "/huntington-beach-coastal-home.jpg",
    tagline: "Surf City, USA",
    description:
      "Huntington Beach is one of Orange County's strongest coastal housing markets, combining lifestyle-driven demand, limited supply, and neighborhood variety from harbor homes to family-focused inland tracts.",
    cardDescription:
      "\"Surf City USA\" offers premier coastal living, top-rated schools, and a thriving real estate market driven by lifestyle and recreation.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$1.1M-$3.5M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~6.1%" },
      { icon: MapPin, label: "Key Zip Codes", value: "92649, 92648, 92646" },
      { icon: Car, label: "Commute", value: "30 min to Irvine, 45 min to LA" },
    ],
    neighborhoods: [
      {
        name: "Huntington Harbour",
        zip: "92649",
        description:
          "An exclusive waterfront market with docks, bay access, and some of Southern California's most desirable boating-oriented homes.",
      },
      {
        name: "Downtown / Main Street Corridor",
        zip: "92648",
        description:
          "High-demand beach-close condos and homes near the pier, Pacific City, and the walkable core of Huntington Beach.",
      },
      {
        name: "South Huntington Beach",
        zip: "92646",
        description:
          "A family-friendly submarket with strong schools, quiet residential tracts, and dependable long-term appreciation.",
      },
    ],
    whyBuy:
      "Coastal constraints, lifestyle demand, and durable owner-occupant appeal keep Huntington Beach among the stronger long-term holds in the region.",
    cityFilter: "huntington-beach",
  },
  "la-habra": {
    name: "La Habra",
    county: "Orange County",
    zipCodes: ["90631", "90632"],
    heroImage: areaHeroImage,
    tagline: "Value with Connectivity",
    description:
      "La Habra sits at the northern edge of Orange County and continues to attract buyers who want an Orange County address with more approachable pricing than nearby Fullerton, Brea, or coastal markets.",
    cardDescription:
      "Straddling Orange and Los Angeles Counties, La Habra provides excellent value with strong appreciation potential and a thriving community.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$750K-$1.1M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~4.8%" },
      { icon: MapPin, label: "Key Zip Code", value: "90631" },
      { icon: Car, label: "Freeway Access", value: "5, 57, 60 corridors" },
    ],
    neighborhoods: [
      {
        name: "Central La Habra",
        zip: "90631",
        description:
          "A practical move-up market with established neighborhoods, local retail, and strong value relative to much of Orange County.",
      },
      {
        name: "La Habra Heights Adjacent",
        zip: "90631",
        description:
          "Buyers seeking larger lots, extra privacy, and a semi-rural feel often focus on the neighborhoods near the La Habra Heights border.",
      },
    ],
    whyBuy:
      "La Habra remains one of the cleaner value plays in Orange County for buyers who want space, neighborhood stability, and solid long-term fundamentals.",
    cityFilter: "la-habra",
  },
  "la-mirada": {
    name: "La Mirada",
    county: "Los Angeles County",
    zipCodes: ["90638"],
    heroImage: areaHeroImage,
    tagline: "Family-Friendly and Well Located",
    description:
      "La Mirada attracts buyers looking for quiet residential neighborhoods, parks, and access to both Orange County and the broader Los Angeles employment base without the pricing pressure of closer-in LA markets.",
    cardDescription:
      "A family-friendly suburban gem with excellent schools, parks, and convenient freeway access to the greater Los Angeles metro area.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$820K-$1.1M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~4.5%" },
      { icon: MapPin, label: "Key Zip Code", value: "90638" },
      { icon: School, label: "Lifestyle", value: "Parks, schools, suburban streets" },
    ],
    neighborhoods: [
      {
        name: "Biola Area",
        zip: "90638",
        description:
          "Homes near Biola University draw buyers who want a stable residential environment with nearby amenities and strong commuter access.",
      },
      {
        name: "La Mirada Creek Park Area",
        zip: "90638",
        description:
          "Park-adjacent neighborhoods offer a more traditional suburban feel with larger family homes and good owner-occupant demand.",
      },
    ],
    whyBuy:
      "La Mirada is a strong fit for buyers prioritizing long-term livability, neighborhood stability, and access to both LA County and northern Orange County job centers.",
    cityFilter: "la-mirada",
  },
  anaheim: {
    name: "Anaheim",
    county: "Orange County",
    zipCodes: ["92801", "92802", "92804", "92805", "92806"],
    heroImage: areaHeroImage,
    tagline: "Central Orange County Access",
    description:
      "Anaheim combines major employment centers, entertainment demand, diverse housing stock, and broad price ranges, making it one of the most flexible markets in Orange County for buyers and investors.",
    cardDescription:
      "The heart of Orange County, from entertainment district condos to suburban single-family homes, Anaheim has something for every buyer.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$760K-$1.2M" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~5.0%" },
      { icon: MapPin, label: "Key Zip Codes", value: "92801, 92802, 92804" },
      { icon: Car, label: "Access", value: "5, 57, 91, and 22 nearby" },
    ],
    neighborhoods: [
      {
        name: "Platinum Triangle",
        zip: "92802",
        description:
          "A condo- and mixed-use-oriented submarket with proximity to Angel Stadium, Honda Center, and newer development activity.",
      },
      {
        name: "West Anaheim",
        zip: "92804",
        description:
          "A popular target for families and value-conscious buyers seeking established homes with strong freeway access.",
      },
      {
        name: "Anaheim Hills Adjacent Trade-Up Areas",
        zip: "92807",
        description:
          "Buyers looking for larger homes and a move-up feel often search the eastern side of the Anaheim market first.",
      },
    ],
    whyBuy:
      "Anaheim offers one of the deepest buyer pools in the county, plus employment and entertainment anchors that support both resale demand and rental resilience.",
    cityFilter: "anaheim",
  },
  riverside: {
    name: "Riverside",
    county: "Riverside County",
    zipCodes: ["92501", "92503", "92506", "92507"],
    heroImage: areaHeroImage,
    tagline: "Affordability with Growth",
    description:
      "Riverside continues to attract buyers and investors priced out of coastal counties, with larger homes, more land, and growth-driven demand tied to the Inland Empire's employment and logistics expansion.",
    cardDescription:
      "Growing fast with outstanding affordability and investment potential. Riverside is one of Southern California's hottest emerging markets.",
    highlights: [
      { icon: Home, label: "Median Sale Price", value: "$600K-$850K" },
      { icon: TrendingUp, label: "YoY Appreciation", value: "~5.6%" },
      { icon: MapPin, label: "Key Zip Codes", value: "92501, 92503, 92506" },
      { icon: Car, label: "Demand Driver", value: "Inland Empire growth corridor" },
    ],
    neighborhoods: [
      {
        name: "Canyon Crest",
        zip: "92507",
        description:
          "Known for stronger owner-occupant demand, larger homes, and proximity to UCR, shopping, and commuter routes.",
      },
      {
        name: "Orangecrest",
        zip: "92508",
        description:
          "A favored family market with newer housing stock, schools, and the kind of suburban product many coastal-county buyers move inland to find.",
      },
      {
        name: "Downtown / Wood Streets",
        zip: "92501",
        description:
          "Historic character, walkability, and architectural variety make this one of the more distinctive Riverside housing pockets.",
      },
    ],
    whyBuy:
      "Riverside appeals to both owner-occupants and investors because it pairs stronger affordability with population growth and durable rental demand.",
    cityFilter: "riverside",
  },
} as const;

export type AreaSlug = keyof typeof AREAS;

export const AREA_SLUGS = Object.keys(AREAS) as AreaSlug[];

function normalizeAreaKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const AREA_LINKS = AREA_SLUGS.map((slug) => ({
  slug,
  name: AREAS[slug].name,
  county: AREAS[slug].county,
  zipCodes: AREAS[slug].zipCodes,
  href: `/areas/${slug}`,
  listingsHref: `/listings?city=${AREAS[slug].cityFilter}`,
  description: AREAS[slug].cardDescription,
}));

export function getAreaSlugByCity(city?: string | null) {
  if (!city) return null;

  const normalizedCity = normalizeAreaKey(city);
  return AREA_SLUGS.find((slug) => slug === normalizedCity) || null;
}
