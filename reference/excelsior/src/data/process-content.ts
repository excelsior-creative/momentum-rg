export const processContent = {
  hero: {
    icon: "target",
    badge: "BATTLE_TESTED_METHODOLOGY",
    headline: "Our",
    headlineAccent: "Process",
    subheadline:
      "From vision to victory. Our proven methodology delivers exceptional results, on time, every time.",
    description:
      "After 10+ years and 150+ projects, we've refined our process into a precision instrument. No guesswork, no wasted effort—just a clear path from concept to launch that consistently exceeds expectations.",
    ctaText: "Start Your Project",
    ctaLink: "/#contact",
    imagePath: "/services/lion.svg",
  },
  phases: {
    sectionBadge: "The_Five_Phases",
    headline: "How We",
    headlineAccent: "Deliver",
    description:
      "Each phase is designed to build on the last, creating momentum and ensuring nothing falls through the cracks. Here's exactly what happens at each stage.",
    steps: [
      {
        number: "01",
        icon: "search",
        title: "Discovery",
        tagline: "// Understanding your landscape",
        description:
          "Before we write a single line of code or sketch a single wireframe, we immerse ourselves in your world. Discovery is where we align on vision, uncover opportunities, and build the strategic foundation for everything that follows.",
        details: [
          "Stakeholder interviews and workshops",
          "Business goals and KPI definition",
          "Target audience research and personas",
          "Competitive landscape analysis",
          "Technical requirements gathering",
          "Content audit and strategy",
        ],
        deliverables: [
          "Discovery brief document",
          "User personas and journey maps",
          "Competitive analysis report",
          "Project roadmap and timeline",
          "Technical specification draft",
        ],
      },
      {
        number: "02",
        icon: "palette",
        title: "Design",
        tagline: "// Visualizing the vision",
        description:
          "Design isn't just about making things look good—it's about solving problems visually. We create intuitive, beautiful interfaces that guide users toward their goals while embodying your brand's essence.",
        details: [
          "Information architecture and sitemaps",
          "Low-fidelity wireframes and user flows",
          "High-fidelity UI design in Figma",
          "Interactive prototypes for testing",
          "Design system creation",
          "Accessibility review (WCAG)",
        ],
        deliverables: [
          "Complete wireframe set",
          "High-fidelity mockups (all breakpoints)",
          "Interactive clickable prototype",
          "Design system documentation",
          "Asset library and style guide",
        ],
        links: [
          { label: "Brand Development", href: "/services/brand-development" },
        ],
      },
      {
        number: "03",
        icon: "code",
        title: "Development",
        tagline: "// Building with precision",
        description:
          "This is where designs become reality. Our development process emphasizes clean, maintainable code, modern frameworks, and continuous collaboration. No black boxes—you'll see progress every step of the way.",
        details: [
          "Frontend development (React, Next.js)",
          "Backend and API development",
          "CMS integration and setup",
          "Third-party integrations",
          "Performance optimization",
          "Code reviews and documentation",
        ],
        deliverables: [
          "Production-ready codebase",
          "CMS training and documentation",
          "API documentation",
          "Version-controlled repository",
          "Development environment access",
        ],
        links: [
          { label: "Web Development", href: "/services/web-development" },
          {
            label: "Software Development",
            href: "/services/software-development",
          },
        ],
      },
      {
        number: "04",
        icon: "test-tube",
        title: "Testing",
        tagline: "// Ensuring excellence",
        description:
          "Quality isn't negotiable. Our rigorous testing process catches issues before they reach your users, ensuring a flawless experience across all devices, browsers, and user scenarios.",
        details: [
          "Cross-browser compatibility testing",
          "Mobile and responsive testing",
          "Performance and load testing",
          "Accessibility compliance testing",
          "Security vulnerability scanning",
          "User acceptance testing (UAT)",
        ],
        deliverables: [
          "QA test results documentation",
          "Performance audit report",
          "Accessibility compliance report",
          "Security assessment summary",
          "Bug fix verification log",
        ],
      },
      {
        number: "05",
        icon: "rocket",
        title: "Launch",
        tagline: "// Going live and beyond",
        description:
          "Launch day is just the beginning. We ensure a smooth deployment with zero downtime, then stick around to monitor, optimize, and support your continued success.",
        details: [
          "Deployment planning and execution",
          "DNS and SSL configuration",
          "Analytics and tracking setup",
          "SEO optimization and submission",
          "Monitoring and alerting setup",
          "Team training and handoff",
        ],
        deliverables: [
          "Live production website",
          "Monitoring dashboard access",
          "Training session recordings",
          "Maintenance documentation",
          "30-day post-launch support",
        ],
        links: [
          { label: "Managed Web Hosting", href: "/services/web-hosting" },
        ],
      },
    ],
  },
  differentiators: {
    sectionBadge: "Why_It_Works",
    headline: "Our",
    headlineAccent: "Differentiators",
    description:
      "A process is only as good as the principles behind it. Here's what makes our approach consistently deliver results others can't match.",
    items: [
      {
        icon: "shield",
        title: "No Shortcuts",
        description:
          "We never skip steps to meet deadlines. Every phase gets the attention it deserves, which is why our projects stand the test of time.",
      },
      {
        icon: "message-square",
        title: "Radical Transparency",
        description:
          "You'll always know exactly where your project stands. Weekly updates, shared project boards, and open communication at every stage.",
      },
      {
        icon: "users",
        title: "Collaborative Spirit",
        description:
          "We work with you, not for you. Your insights and feedback are essential ingredients in creating something truly exceptional.",
      },
      {
        icon: "zap",
        title: "Agile Efficiency",
        description:
          "Sprint-based development with regular check-ins means we can adapt to feedback quickly without derailing the timeline.",
      },
    ],
  },
  expectations: {
    sectionBadge: "What_To_Expect",
    headline: "Working",
    headlineAccent: "With Us",
    description:
      "We believe in setting clear expectations from day one. Here's what every client can count on throughout our engagement.",
    items: [
      {
        icon: "clock",
        title: "Realistic Timelines",
        description:
          "Most website projects take 8-12 weeks. Complex web applications can take 3-6 months. We'll give you an honest estimate upfront and keep you updated if anything changes.",
      },
      {
        icon: "message-square",
        title: "Weekly Check-ins",
        description:
          "Every week you'll receive a progress update and have the opportunity to provide feedback. We use shared project boards so you can see status anytime.",
      },
      {
        icon: "file-check",
        title: "Clear Milestones",
        description:
          "Your project is broken into distinct phases with approval gates. You'll sign off on each phase before we move forward, ensuring alignment every step of the way.",
      },
      {
        icon: "users",
        title: "Dedicated Team",
        description:
          "You'll have a dedicated project manager as your single point of contact, plus direct access to designers and developers when needed.",
      },
    ],
    timeline: [
      { phase: "Discovery", duration: "1-2 weeks" },
      { phase: "Design", duration: "2-4 weeks" },
      { phase: "Development", duration: "4-8 weeks" },
      { phase: "Testing", duration: "1-2 weeks" },
      { phase: "Launch", duration: "1 week" },
    ],
    timelineNote:
      "Total: 8-16 weeks depending on project scope. Enterprise and custom software projects may require additional time.",
  },
};
