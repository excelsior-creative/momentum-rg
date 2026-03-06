import {
  Accessibility,
  Bot,
  Brain,
  Cloud,
  Code2,
  Cpu,
  Database,
  Gauge,
  Globe,
  Layers,
  Lock,
  LucideIcon,
  MessageSquare,
  Palette,
  Rocket,
  Search,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  TrendingUp,
  Share2,
  Workflow,
  Zap,
} from "lucide-react";

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  icon: string;
  heroImagePath: string;
  order: number;
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  approach: {
    number: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  ctaTitle: string;
  ctaDescription: string;
  relatedServices?: string[];
  hasCalculator?: boolean;
}

export const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  bot: Bot,
  cpu: Cpu,
  palette: Palette,
  server: Server,
  rocket: Rocket,
  zap: Zap,
  database: Database,
  layers: Layers,
  shield: Shield,
  gauge: Gauge,
  smartphone: Smartphone,
  accessibility: Accessibility,
  cloud: Cloud,
  search: Search,
  globe: Globe,
  lock: Lock,
  "message-square": MessageSquare,
  workflow: Workflow,
  brain: Brain,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  share: Share2,
};

export const services: ServiceData[] = [
  {
    id: "web-development",
    title: "Web Development",
    slug: "web-development",
    tagline: "Professional WordPress development and high-performance custom web solutions.",
    description:
      "We specialize in professional WordPress and Elementor development for businesses that need impact and speed. For complex, performance-critical applications, we build custom React and Next.js sites with AI-driven features and sub-second load times.",
    shortDescription:
      "Orange County web development agency specializing in professional WordPress & Elementor sites, alongside custom React and Next.js development and AI tool integration.",
    icon: "code",
    heroImagePath: "/services/horse.svg",
    order: 1,
    features: [
      {
        title: "WordPress & Elementor",
        description:
          "Professional WordPress development using Elementor Pro for flexible, high-conversion websites that are easy for your team to manage.",
        icon: "globe",
      },
      {
        title: "React & Next.js",
        description:
          "Advanced custom development for complex web applications. Next.js App Router, SSR, and SSG for ultimate performance and scalability.",
        icon: "code",
      },
      {
        title: "AI-Enhanced Development",
        description:
          "Integrating AI-powered tools, autonomous agents, and intelligent automation directly into your web presence to drive efficiency.",
        icon: "sparkles",
      },
      {
        title: "Performance Optimization",
        description:
          "Core Web Vitals optimization, lazy loading, and CDN deployment. We ensure your WordPress or React site loads in sub-seconds.",
        icon: "gauge",
      },
      {
        title: "Technical SEO",
        description:
          "SEO baked into every build. From WordPress schema to Next.js metadata, we ensure maximum visibility for your brand.",
        icon: "search",
      },
      {
        title: "Headless CMS Integration",
        description:
          "Flexible content solutions. Whether using WordPress as a headless CMS or Payload, Contentful, and Sanity, we build for your workflow.",
        icon: "layers",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Discovery & Strategy",
        description:
          "Deep dive into your goals, audience, and competitive landscape. We map user journeys and define success metrics.",
      },
      {
        number: "02",
        title: "Design & Prototype",
        description:
          "High-fidelity designs and interactive prototypes. We validate with real users before writing production code.",
      },
      {
        number: "03",
        title: "Development & Testing",
        description:
          "Agile sprints with continuous integration. Rigorous testing across browsers, devices, and accessibility tools.",
      },
      {
        number: "04",
        title: "Launch & Optimize",
        description:
          "Zero-downtime deployment with performance monitoring. Ongoing optimization based on real user data.",
      },
    ],
    faqs: [
      {
        question: "What technologies do you use for web development?",
        answer:
          "We lead with WordPress and Elementor for most business websites because of their flexibility and ease of use. For custom web applications, we specialize in React and Next.js. We also integrate AI-powered tools and agents to enhance functionality and automate workflows.",
      },
      {
        question: "How long does a typical website project take?",
        answer:
          "Project timelines vary based on complexity. A marketing website typically takes 6-10 weeks, while a full web application can range from 3-6 months. We'll provide a detailed timeline during our discovery phase.",
      },
      {
        question: "Do you provide ongoing maintenance and support?",
        answer:
          "Absolutely. We offer flexible maintenance packages including security updates, performance monitoring, content updates, and feature enhancements. Many clients retain us for ongoing optimization.",
      },
      {
        question: "Can you work with our existing design team?",
        answer:
          "Yes! We collaborate seamlessly with in-house designers, providing technical guidance on feasibility and implementation. We can also handle design end-to-end if needed.",
      },
      {
        question: "What makes your approach different from other agencies?",
        answer:
          "We're engineering-first. Every project is built with performance, accessibility, and scalability as core requirements—not afterthoughts. Our code is clean, documented, and built to last.",
      },
    ],
    ctaTitle: "Ready to Build Something Exceptional?",
    ctaDescription:
      "Let's discuss your web development project. We'll analyze your needs and show you exactly how we can help you dominate online.",
    relatedServices: ["web-hosting", "seo-services", "software-development"],
    hasCalculator: true,
  },
  {
    id: "agentic-solutions",
    title: "Agentic Solutions",
    slug: "agentic-solutions",
    tagline: "AI-powered agents that transform how business gets done.",
    description:
      "Deploy cutting-edge autonomous AI that thinks, learns, and executes. From intelligent chatbots to automated workflow systems, we build agentic AI solutions that free your team to focus on what matters most—growing your business.",
    shortDescription:
      "AI automation solutions for businesses—custom chatbots, autonomous agents, and intelligent workflow systems that reduce costs and scale operations.",
    icon: "bot",
    heroImagePath: "/services/lion.svg",
    order: 2,
    features: [
      {
        title: "AI Chatbots & Assistants",
        description:
          "Conversational AI that understands context, handles complex queries, and provides 24/7 customer support with human-like interactions.",
        icon: "bot",
      },
      {
        title: "Workflow Automation",
        description:
          "Intelligent agents that automate repetitive tasks, process documents, and orchestrate complex business workflows without human intervention.",
        icon: "zap",
      },
      {
        title: "LLM Integration",
        description:
          "Seamless integration with GPT-4, Claude, Gemini, and open-source models. Custom fine-tuning for your specific domain and use cases.",
        icon: "code",
      },
      {
        title: "RAG Systems",
        description:
          "Retrieval-Augmented Generation pipelines that ground AI responses in your proprietary data, documents, and knowledge base.",
        icon: "database",
      },
      {
        title: "Multi-Agent Orchestration",
        description:
          "Complex agent systems where specialized AI units collaborate, delegate, and complete sophisticated tasks autonomously.",
        icon: "layers",
      },
      {
        title: "Enterprise Security",
        description:
          "SOC 2 compliant deployments with data encryption, access controls, and audit logging. Your data stays yours.",
        icon: "shield",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Use Case Discovery",
        description:
          "Identify high-impact automation opportunities. We map your workflows and pinpoint where AI agents deliver maximum ROI.",
      },
      {
        number: "02",
        title: "Architecture Design",
        description:
          "Design scalable agent architectures. Select optimal models, define tool integrations, and plan data pipelines.",
      },
      {
        number: "03",
        title: "Build & Train",
        description:
          "Develop, fine-tune, and test AI agents. Rigorous evaluation with real-world scenarios and edge cases.",
      },
      {
        number: "04",
        title: "Deploy & Monitor",
        description:
          "Production deployment with observability. Continuous monitoring, feedback loops, and iterative improvement.",
      },
    ],
    faqs: [
      {
        question: "What's the difference between a chatbot and an AI agent?",
        answer:
          "Traditional chatbots follow scripts and decision trees. AI agents use large language models to understand intent, reason about problems, and take autonomous actions. They can access tools, query databases, and complete complex multi-step tasks.",
      },
      {
        question: "Which AI models do you work with?",
        answer:
          "We're model-agnostic and work with OpenAI (GPT-4), Anthropic (Claude), Google (Gemini), and open-source options like Llama and Mistral. We select the best model for your specific use case, cost requirements, and data privacy needs.",
      },
      {
        question: "How do you ensure AI responses are accurate?",
        answer:
          "We implement RAG (Retrieval-Augmented Generation) systems that ground AI responses in your verified data. Combined with guardrails, content filtering, and human-in-the-loop reviews for critical decisions.",
      },
      {
        question: "Can AI agents integrate with our existing systems?",
        answer:
          "Absolutely. We build agents that connect to your CRM, ERP, databases, APIs, and third-party tools. Custom integrations are our specialty—if it has an API, we can connect it.",
      },
      {
        question: "What about data privacy and security?",
        answer:
          "We take security seriously. Options include on-premise deployment, private cloud instances, and encrypted data handling. We can work within your compliance requirements (HIPAA, GDPR, SOC 2).",
      },
    ],
    ctaTitle: "Ready to Deploy AI That Actually Works?",
    ctaDescription:
      "Let's explore how autonomous AI agents can transform your operations. We'll identify quick wins and map your path to intelligent automation.",
    relatedServices: ["software-development", "web-development"],
    hasCalculator: true,
  },
  {
    id: "software-development",
    title: "Software Development",
    slug: "software-development",
    tagline: "Custom software architected for scale and built to last.",
    description:
      "From SaaS platforms to mobile applications, enterprise systems to API integrations—we engineer robust, maintainable code that drives operational efficiency and competitive advantage. Your vision, our engineering excellence.",
    shortDescription:
      "Full-stack software development in Orange County—custom SaaS platforms, mobile apps, and enterprise solutions engineered to scale with your business.",
    icon: "cpu",
    heroImagePath: "/services/wolf.svg",
    order: 3,
    features: [
      {
        title: "SaaS Platforms",
        description:
          "Multi-tenant architectures, subscription management, and scalable infrastructure. We build software products that grow with your business.",
        icon: "cloud",
      },
      {
        title: "Mobile Applications",
        description:
          "Native iOS/Android and cross-platform development with React Native. Beautiful, performant apps your users will love.",
        icon: "smartphone",
      },
      {
        title: "API Development",
        description:
          "RESTful and GraphQL APIs designed for reliability and developer experience. Clean documentation, versioning, and authentication.",
        icon: "code",
      },
      {
        title: "Enterprise Systems",
        description:
          "Internal tools, ERP integrations, and custom business software. Solutions that streamline operations and eliminate manual work.",
        icon: "layers",
      },
      {
        title: "Legacy Modernization",
        description:
          "Migrate aging systems to modern architectures. Reduce technical debt while preserving business logic and data integrity.",
        icon: "zap",
      },
      {
        title: "DevOps & Infrastructure",
        description:
          "CI/CD pipelines, containerization, and cloud architecture. Automated deployments and infrastructure as code.",
        icon: "cpu",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Technical Discovery",
        description:
          "Deep dive into requirements, constraints, and integration points. We map the technical landscape before writing code.",
      },
      {
        number: "02",
        title: "Architecture & Planning",
        description:
          "System design, technology selection, and sprint planning. Clear roadmap with milestones and deliverables.",
      },
      {
        number: "03",
        title: "Agile Development",
        description:
          "Two-week sprints with regular demos. You see progress constantly and can adjust priorities based on feedback.",
      },
      {
        number: "04",
        title: "Quality & Deployment",
        description:
          "Comprehensive testing, security audits, and production deployment. Documentation and knowledge transfer included.",
      },
    ],
    faqs: [
      {
        question: "What technologies do you specialize in?",
        answer:
          "Our core stack includes TypeScript, React, Node.js, and PostgreSQL. We also work with Go, Rust, and various cloud services (AWS, GCP, Azure). We choose technologies based on your specific requirements, not trends.",
      },
      {
        question: "How do you handle project management?",
        answer:
          "We use agile methodologies with two-week sprints. You'll have visibility into progress through regular standups, sprint demos, and a shared project board. We adapt our process to work with your existing workflows.",
      },
      {
        question: "What about intellectual property ownership?",
        answer:
          "You own 100% of the code and IP we create for you. We provide complete source code, documentation, and knowledge transfer. No vendor lock-in—your software is truly yours.",
      },
      {
        question: "Can you take over an existing codebase?",
        answer:
          "Yes, we regularly inherit and improve existing projects. We start with a code audit to assess quality, identify risks, and create a prioritized improvement plan. We'll be honest about what we find.",
      },
      {
        question: "How do you ensure code quality?",
        answer:
          "Every project includes code reviews, automated testing (unit, integration, e2e), CI/CD pipelines, and static analysis. We maintain high test coverage and follow industry best practices for security and performance.",
      },
    ],
    ctaTitle: "Ready to Build Something Powerful?",
    ctaDescription:
      "Let's discuss your software project. We'll help you define scope, choose the right technologies, and create a roadmap to launch.",
    relatedServices: ["agentic-solutions", "web-hosting"],
    hasCalculator: true,
  },
  {
    id: "brand-development",
    title: "Brand Development",
    slug: "brand-development",
    tagline: "Forge an identity that commands attention and earns respect.",
    description:
      "Your brand is your promise—we make it unforgettable. Strategic brand positioning, visual identity systems, messaging architecture, and comprehensive brand guidelines that ensure consistency across every touchpoint.",
    shortDescription:
      "Strategic brand development and visual identity design for nonprofits and mission-driven organizations that need to stand out and connect.",
    icon: "palette",
    heroImagePath: "/services/tree.svg",
    order: 4,
    features: [
      {
        title: "Brand Strategy",
        description:
          "Deep market research, competitive analysis, and positioning workshops. We define who you are, who you serve, and why you matter.",
        icon: "search",
      },
      {
        title: "Visual Identity",
        description:
          "Logo design, color systems, typography, and visual language that captures your essence and stands out in crowded markets.",
        icon: "layers",
      },
      {
        title: "Brand Guidelines",
        description:
          "Comprehensive documentation ensuring brand consistency. Usage rules, templates, and asset libraries your team can actually use.",
        icon: "layers",
      },
      {
        title: "Messaging Framework",
        description:
          "Voice and tone guidelines, key messages, taglines, and storytelling frameworks that connect emotionally with your audience.",
        icon: "code",
      },
      {
        title: "Brand Architecture",
        description:
          "Multi-brand strategy, sub-brand development, and portfolio organization for companies with complex offerings.",
        icon: "layers",
      },
      {
        title: "Brand Activation",
        description:
          "Launch strategy, brand rollout planning, and internal alignment workshops to bring your new brand to life.",
        icon: "zap",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Discovery & Research",
        description:
          "Stakeholder interviews, market analysis, and audience research. We understand your business inside and out.",
      },
      {
        number: "02",
        title: "Strategy Development",
        description:
          "Define positioning, personality, and promise. Create the strategic foundation that guides all creative decisions.",
      },
      {
        number: "03",
        title: "Creative Exploration",
        description:
          "Multiple creative directions, refined through collaborative feedback. We explore until we find the perfect expression.",
      },
      {
        number: "04",
        title: "System Design & Delivery",
        description:
          "Complete brand system with guidelines, assets, and templates. Everything your team needs to execute consistently.",
      },
    ],
    faqs: [
      {
        question: "How long does a branding project typically take?",
        answer:
          "A complete brand identity project typically takes 8-12 weeks, including strategy, design, and guidelines. Rebrands for larger organizations may take 4-6 months to ensure proper stakeholder alignment and rollout planning.",
      },
      {
        question: "What's included in brand guidelines?",
        answer:
          "Our brand guidelines cover logo usage, color specifications (RGB, CMYK, HEX, Pantone), typography hierarchy, photography style, iconography, tone of voice, and application examples across digital and print. You'll receive print and digital assets.",
      },
      {
        question: "Do you help with brand naming?",
        answer:
          "Yes! We offer naming services including creative exploration, linguistic analysis, trademark screening, and domain availability research. Great names are memorable, meaningful, and legally clear.",
      },
      {
        question: "Can you work with our existing brand elements?",
        answer:
          "Absolutely. Brand evolution doesn't always mean starting from scratch. We can refresh and systematize existing elements while building out missing components and creating proper documentation.",
      },
      {
        question: "How do you measure branding success?",
        answer:
          "We establish baseline metrics during discovery—brand awareness, perception scores, recall rates. Post-launch, we track these same metrics plus engagement rates, conversion improvements, and qualitative feedback.",
      },
    ],
    ctaTitle: "Ready to Build a Brand That Matters?",
    ctaDescription:
      "Let's create an identity that captures who you are and resonates with who you serve. Your brand story starts here.",
    relatedServices: ["web-development", "social-media", "launchpad"],
    hasCalculator: true,
  },
  {
    id: "web-hosting",
    title: "Managed Web Hosting",
    slug: "web-hosting",
    tagline: "Enterprise-grade infrastructure that never sleeps.",
    description:
      "Your digital presence deserves a fortress. We deliver lightning-fast load times, 99.99% uptime, comprehensive security, and proactive monitoring. Our managed hosting lets you focus on your business while we handle everything technical—updates, backups, security, and performance optimization.",
    shortDescription:
      "Managed WordPress and Next.js hosting with 99.99% uptime SLA, daily backups, security monitoring, and 24/7 expert support in Orange County.",
    icon: "server",
    heroImagePath: "/services/dragon.svg",
    order: 5,
    features: [
      {
        title: "SSD Hosting",
        description:
          "Platform-optimized solid-state drives deliver data 10x faster than traditional mechanical drives.",
        icon: "server",
      },
      {
        title: "Global CDN",
        description:
          "Content delivered from 200+ edge locations worldwide for blazing-fast load times everywhere.",
        icon: "globe",
      },
      {
        title: "4-Tier Caching",
        description:
          "Multi-tiered caching system ensures visitors get served cached content for maximum speed.",
        icon: "layers",
      },
      {
        title: "Image Optimization",
        description:
          "Automatic compression and WEBP conversion for images—the format Google developed for speed.",
        icon: "zap",
      },
      {
        title: "CloudFlare Firewall",
        description:
          "Years of refined firewall rules block 99% of bad actors before they reach your server.",
        icon: "shield",
      },
      {
        title: "SSL/TLS Certificates",
        description:
          "Free SSL certificates included. Your site shows the secure lock and encrypts all traffic.",
        icon: "lock",
      },
      {
        title: "Real-time Monitoring",
        description:
          "24/7 threat detection alerts us immediately if anyone tries to compromise your site.",
        icon: "shield",
      },
      {
        title: "Unlimited Patches",
        description:
          "We handle all theme, plugin, and platform security updates continuously—the #1 hack prevention.",
        icon: "code",
      },
      {
        title: "99.99% Uptime",
        description:
          "Redundant infrastructure with automatic failover ensures your site stays online when it matters.",
        icon: "server",
      },
      {
        title: "Nightly Backups",
        description:
          "Full website and database backups every night with granular recovery tools for peace of mind.",
        icon: "database",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Infrastructure Audit",
        description:
          "Analyze your current setup, traffic patterns, and performance requirements. Identify optimization opportunities and security gaps.",
      },
      {
        number: "02",
        title: "Architecture Planning",
        description:
          "Design a hosting architecture tailored to your needs. Select optimal platforms, regions, and scaling strategies.",
      },
      {
        number: "03",
        title: "Migration & Setup",
        description:
          "Zero-downtime migration to your new infrastructure. Configure monitoring, backups, caching, and security protocols.",
      },
      {
        number: "04",
        title: "24/7 Management",
        description:
          "Ongoing monitoring, maintenance, updates, and support. We respond to issues before they impact your business.",
      },
    ],
    faqs: [
      {
        question: "What hosting platforms do you work with?",
        answer:
          "We deploy on AWS, Google Cloud, Vercel, Netlify, and DigitalOcean—choosing the best platform for your specific needs. For WordPress, we often use our own managed infrastructure or WP Engine for specialized deployments.",
      },
      {
        question: "Can you migrate my existing website?",
        answer:
          "Yes! We handle complete migrations including DNS transfers, SSL setup, database migration, and content sync. We plan migrations carefully to ensure zero downtime during the transition.",
      },
      {
        question: "What makes your hosting different from cheaper options?",
        answer:
          "Cheap hosting often means slow servers, no security updates, and you're on your own when things break. Our managed hosting includes unlimited security patches, enterprise-grade infrastructure, proactive monitoring, and a team that responds to issues before they affect your business.",
      },
      {
        question: "How do you handle traffic spikes?",
        answer:
          "We configure auto-scaling infrastructure that automatically provisions additional resources during traffic spikes. Combined with our 4-tier caching system and global CDN, your site stays fast even under heavy load.",
      },
      {
        question: "What's your support response time?",
        answer:
          "Critical issues get immediate response 24/7. Standard requests are addressed within 4 hours during business hours. All clients have direct access to our engineering team—no ticket queues or offshore call centers.",
      },
    ],
    ctaTitle: "Ready for Hosting That Just Works?",
    ctaDescription:
      "Let's discuss your infrastructure needs. We'll audit your current setup and show you exactly how we can deliver better performance, better security, and better peace of mind.",
    relatedServices: ["web-development", "software-development"],
    hasCalculator: true,
  },
  {
    id: "launchpad",
    title: "Launchpad",
    slug: "launchpad",
    tagline:
      "From bold idea to market-ready product—we build ventures together.",
    description:
      "Launchpad is our startup incubation and venture partnership program for visionary entrepreneurs in Orange County and beyond. We invest our time, expertise, and technical resources to co-build transformative products—providing full-stack development, brand strategy, and go-to-market execution. This isn't a client relationship; it's a true partnership where we share the journey from concept to market domination.",
    shortDescription:
      "Startup incubation program and venture partnership for entrepreneurs ready to build and launch transformative technology products.",
    icon: "rocket",
    heroImagePath: "/services/tree.svg",
    order: 6,
    features: [
      {
        title: "Full-Stack Product Development",
        description:
          "From MVP to scale-ready platform, we architect and build your entire technical foundation. React, Next.js, mobile apps, APIs, databases—everything you need to launch and grow.",
        icon: "code",
      },
      {
        title: "Brand Strategy & Identity",
        description:
          "Craft a brand that commands attention. Logo design, visual identity systems, messaging frameworks, and brand guidelines that position you as a market leader from day one.",
        icon: "palette",
      },
      {
        title: "AI & Automation Integration",
        description:
          "Embed intelligent automation into your product DNA. LLM-powered features, workflow automation, and AI-driven insights that give you an unfair competitive advantage.",
        icon: "bot",
      },
      {
        title: "Go-to-Market Strategy",
        description:
          "Launch with precision. Marketing strategy, landing page optimization, SEO foundation, and growth frameworks designed to acquire your first 1,000 customers.",
        icon: "rocket",
      },
      {
        title: "Startup Advisory & Mentorship",
        description:
          "Access 10+ years of startup experience. Fundraising guidance, pitch deck development, investor introductions, and strategic advice from founders who've been there.",
        icon: "shield",
      },
      {
        title: "Equity Partnership Model",
        description:
          "Align incentives for mutual success. Our flexible partnership structures mean we're invested in your long-term growth, not just project completion.",
        icon: "zap",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Discovery & Validation",
        description:
          "We dive deep into your vision, market opportunity, and competitive landscape. Through intensive workshops, user research, and feasibility analysis, we validate your concept and define the product roadmap.",
      },
      {
        number: "02",
        title: "Partnership Structuring",
        description:
          "We formalize our collaboration with clear terms, equity arrangements, and milestone definitions. Our team is assembled, resources allocated, and we establish the communication cadence for rapid execution.",
      },
      {
        number: "03",
        title: "Build & Iterate",
        description:
          "Agile development sprints bring your product to life. We ship early, gather user feedback, and iterate relentlessly. Design, development, and testing happen in parallel for maximum velocity.",
      },
      {
        number: "04",
        title: "Launch & Scale",
        description:
          "Go-to-market execution with full throttle. Product launch, marketing campaigns, growth optimization, and ongoing technical support. We stay engaged as you scale and evolve.",
      },
    ],
    faqs: [
      {
        question: "What types of ventures does Launchpad support?",
        answer:
          "We focus on technology-driven ventures with high growth potential—particularly in AI/ML applications, SaaS platforms, health tech, and innovative B2B software. We're looking for founders with domain expertise and ideas that can genuinely disrupt markets. If your vision keeps you up at night and you're ready to execute, we want to hear from you.",
      },
      {
        question: "How is Launchpad different from hiring an agency?",
        answer:
          "Traditional agencies charge fees and deliver projects. Launchpad is fundamentally different—we become co-founders in your success. We take equity stakes, share risk, and invest our best resources because your success is our success. This alignment means we're as committed to your long-term growth as you are.",
      },
      {
        question: "What do I need to bring to the partnership?",
        answer:
          "You bring the vision, domain expertise, and entrepreneurial drive. Ideally, you have deep knowledge of your target market, initial customer validation, and the capacity to work closely with our team. We provide the technical execution, design capabilities, and startup experience to bring your vision to life.",
      },
      {
        question: "How are partnership terms structured?",
        answer:
          "Every partnership is unique. Terms depend on the stage of your venture, scope of work required, and growth potential. Typical arrangements include equity-for-services, hybrid models with reduced cash fees, or milestone-based structures. We discuss this transparently during our initial conversations.",
      },
      {
        question: "How long does a typical Launchpad engagement last?",
        answer:
          "MVP development typically takes 3-4 months. However, Launchpad is designed for long-term partnership—we stay engaged through your seed round, product iterations, and scaling phase. Many of our partners work with us for 1-2+ years as their ventures grow and evolve.",
      },
    ],
    ctaTitle: "Ready to Build Something Legendary?",
    ctaDescription:
      "If you have a transformative idea and the drive to see it through, we want to hear from you. Let's explore whether Launchpad is the right partnership for your venture.",
    relatedServices: ["software-development", "brand-development", "agentic-solutions"],
  },
  {
    id: "seo-services",
    title: "SEO Services",
    slug: "seo-services",
    tagline: "Dominate search results and drive sustainable organic growth.",
    description:
      "We combine technical excellence with strategic content optimization to ensure your brand is found by the right audience. Our data-driven SEO strategies focus on long-term visibility, high-intent traffic, and measurable ROI in a constantly evolving search landscape.",
    shortDescription:
      "Data-driven SEO strategies in Orange County—technical audits, content optimization, and local SEO designed to increase your organic visibility and drive growth.",
    icon: "trending-up",
    heroImagePath: "/services/wolf.svg",
    order: 7,
    features: [
      {
        title: "Technical SEO Audits",
        description:
          "In-depth analysis of site architecture, crawlability, and indexing. We fix the underlying technical issues that prevent your site from ranking.",
        icon: "server",
      },
      {
        title: "On-Page Optimization",
        description:
          "Strategic keyword integration, meta tag optimization, and content structuring. We ensure your pages are perfectly tuned for both users and search engines.",
        icon: "layers",
      },
      {
        title: "Local SEO Focus",
        description:
          "Dominate your local market. Google Business Profile optimization, local citations, and geo-targeted content to capture nearby customers.",
        icon: "globe",
      },
      {
        title: "Authority Building",
        description:
          "High-quality link building and PR outreach. We grow your domain authority through ethical, sustainable strategies that drive long-term value.",
        icon: "shield",
      },
      {
        title: "Performance Tracking",
        description:
          "Comprehensive reporting and analytics. We track rankings, organic traffic, and conversions to ensure your SEO investment delivers ROI.",
        icon: "gauge",
      },
      {
        title: "AI-Enhanced SEO",
        description:
          "Using advanced AI tools for keyword research, content gap analysis, and trend prediction. We stay ahead of algorithm changes with data-driven insights.",
        icon: "sparkles",
      },
    ],
    approach: [
      {
        number: "01",
        title: "SEO Audit & Strategy",
        description:
          "Comprehensive audit of your current visibility, technical health, and competitor landscape. We build a custom roadmap focused on high-impact wins.",
      },
      {
        number: "02",
        title: "Implementation & Optimization",
        description:
          "Executing technical fixes, on-page updates, and structural improvements. We lay the foundation for sustainable organic growth.",
      },
      {
        number: "03",
        title: "Growth & Content",
        description:
          "Ongoing content creation, authority building, and local optimization. We consistently expand your footprint across search results.",
      },
      {
        number: "04",
        title: "Monitoring & Analysis",
        description:
          "Continuous tracking of performance metrics. We refine our strategy based on real data to ensure maximum visibility and conversion.",
      },
    ],
    faqs: [
      {
        question: "How long does it take to see results from SEO?",
        answer:
          "SEO is a long-term investment. While some technical improvements can show results in weeks, significant organic growth typically takes 3-6 months. The timeline depends on your industry's competition and the current state of your website.",
      },
      {
        question: "Do you guarantee #1 rankings?",
        answer:
          "No ethical SEO agency can guarantee #1 rankings because search engines control the results. However, we have a proven track record of significantly increasing organic visibility, traffic, and conversions for our clients.",
      },
      {
        question: "What's your approach to link building?",
        answer:
          "We focus on high-quality, relevant links earned through content excellence, strategic outreach, and PR. We avoid 'black hat' techniques that can lead to penalties, focusing instead on sustainable authority growth.",
      },
      {
        question: "How important is technical SEO?",
        answer:
          "Crucial. If search engines can't crawl or index your site efficiently, even the best content won't rank. We prioritize technical health—speed, mobile-friendliness, and architecture—as the foundation of every SEO strategy.",
      },
      {
        question: "How does AI affect your SEO strategy?",
        answer:
          "We use AI to enhance our processes—from deep keyword research to identifying content gaps. However, we prioritize human-led strategy and authentic content creation, ensuring your brand resonates with real people while satisfying AI-driven search algorithms.",
      },
    ],
    ctaTitle: "Ready to Dominate Search?",
    ctaDescription:
      "Let's analyze your current visibility and map your path to the top of search results. Your organic growth starts with a conversation.",
    relatedServices: ["web-development", "brand-development", "social-media"],
    hasCalculator: true,
  },
  {
    id: "social-media",
    title: "Social Media Marketing",
    slug: "social-media",
    tagline: "Build a community, spark conversations, and command attention.",
    description:
      "Social media is where your brand lives and breathes. We create comprehensive social strategies that build authentic connections with your audience. From strategic content creation to community management and paid social advertising, we help you stay relevant and influential.",
    shortDescription:
      "Full-service social media management and strategy—content creation, community engagement, and paid social ads to build your brand and grow your community.",
    icon: "share",
    heroImagePath: "/services/lion.svg",
    order: 8,
    features: [
      {
        title: "Strategic Planning",
        description:
          "Custom social media roadmaps aligned with your business goals. We define your voice, choose the right platforms, and set measurable KPIs.",
        icon: "layers",
      },
      {
        title: "Content Creation",
        description:
          "High-impact visuals, compelling copy, and video content designed for engagement. We tell your brand story in a way that resonates and converts.",
        icon: "palette",
      },
      {
        title: "Community Management",
        description:
          "Proactive engagement with your audience. We handle comments, messages, and mentions to build brand loyalty and foster authentic community.",
        icon: "message-square",
      },
      {
        title: "Paid Social Advertising",
        description:
          "Targeted ad campaigns on Meta, LinkedIn, and more. We optimize spend to reach high-intent audiences and drive measurable business results.",
        icon: "zap",
      },
      {
        title: "Influencer Coordination",
        description:
          "Connecting your brand with the right voices. We manage outreach and partnerships to expand your reach through trusted community leaders.",
        icon: "globe",
      },
      {
        title: "Analytics & Reporting",
        description:
          "Data-driven insights into your social performance. We track engagement, growth, and conversions to continuously refine your strategy.",
        icon: "gauge",
      },
    ],
    approach: [
      {
        number: "01",
        title: "Discovery & Persona Mapping",
        description:
          "Deep dive into your audience's habits and preferences. We define your ideal customer personas and map the social channels they frequent.",
      },
      {
        number: "02",
        title: "Creative Strategy & Planning",
        description:
          "Developing your visual identity and content pillars. We create a content calendar that ensures consistency and maintains brand authority.",
      },
      {
        number: "03",
        title: "Execution & Engagement",
        description:
          "Launching campaigns and managing daily interactions. We keep your social presence active, responsive, and constantly evolving.",
      },
      {
        number: "04",
        title: "Optimization & Growth",
        description:
          "Analyzing performance data to refine content and targeting. We scale what works to maximize your reach and community impact.",
      },
    ],
    faqs: [
      {
        question: "Which social platforms should my business be on?",
        answer:
          "The best platforms depend on where your audience spends their time. We analyze your target market to determine if you should focus on LinkedIn for B2B, Instagram and Meta for B2C, or emerging platforms like TikTok.",
      },
      {
        question: "How often should we be posting?",
        answer:
          "Consistency is more important than frequency. We typically recommend 3-5 high-quality posts per week, but the optimal cadence depends on the platform and your specific audience engagement patterns.",
      },
      {
        question: "Do you handle negative comments and messages?",
        answer:
          "Yes. Our community management includes proactive monitoring and professional response protocols. we handle interactions according to your brand guidelines to maintain a positive reputation.",
      },
      {
        question: "Is paid social advertising necessary?",
        answer:
          "While organic growth is possible, paid social is the most effective way to reach new, targeted audiences quickly. We often recommend a hybrid approach to maximize both community building and lead generation.",
      },
      {
        question: "How do you measure social media success?",
        answer:
          "We track metrics that matter to your business: engagement rates, follower growth, website traffic from social channels, and direct conversions. Our reports focus on ROI, not just 'vanity' metrics.",
      },
    ],
    ctaTitle: "Ready to Spark a Conversation?",
    ctaDescription:
      "Let's build a social presence that commands attention and drives real community engagement. Your brand's next chapter starts here.",
    relatedServices: ["brand-development", "web-development", "seo-services"],
    hasCalculator: true,
  },
];
