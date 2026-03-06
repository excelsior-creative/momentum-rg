import { Container } from '@/components/Container'
import { Button } from '@/components/ui/button'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = generatePageMetadata({
  title: 'About Momentum Realty Group',
  description:
    'Learn about Momentum Realty Group, the brokerage founded by Karl Parize in 2009 to serve buyers, sellers, investors, and property owners across Orange County, LA County, and Riverside County.',
  path: '/about',
  keywords: [
    'about Momentum Realty Group',
    'Momentum Realty Group',
    'Orange County real estate brokerage',
    'Karl Parize broker',
    'property management Orange County',
  ],
})

const team = [
  {
    name: 'Karl Parize',
    title: 'Broker / Owner',
    photo: 'https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg',
    dre: 'CBRE #01364278 · NMLS #313044',
    phone: '(714) 336-3375',
    email: 'karl@momentumrg.com',
    href: '/team/karl',
    bio: 'Karl Parize is the Broker and Owner of Momentum Realty Group, with 25+ years of expertise in real estate, mortgage, and financial planning across Orange County, LA County, and Riverside County. He founded Momentum in 2009 on one core belief: every client deserves a broker who acts as if the outcome is their own.',
    tags: ['Residential Sales', 'Investment Properties', 'Property Management', 'Short Sales'],
  },
  {
    name: 'Esmeralda Novikoff',
    title: 'Real Estate & Foreclosure Specialist',
    photo: '/esmeralda-novikoff.jpg',
    dre: 'CA DRE #01409881',
    phone: '(877) 886-2699',
    email: 'esmenovi@yahoo.com',
    href: '/team/esmeralda',
    bio: 'Esmeralda Novikoff has been licensed since 2004 and is a certified Seniors Real Estate Specialist (SRES) and Short Sale & Foreclosure Resource (SFR). She brings deep experience in foreclosures, probate sales, loan modifications, and escrow — and she\'s fully bilingual in English and Spanish.',
    tags: ['Foreclosure', 'Short Sales', 'Probate', 'Loan Modification', 'Hablamos Español'],
  },
]

const brandPillars = [
  {
    title: 'Broker-Led Strategy',
    description:
      'Momentum is led by Karl Parize, a broker with experience across real estate, mortgage, and financial planning, so clients get advice that connects the whole picture.',
  },
  {
    title: 'Creative Problem Solving',
    description:
      'From first-time buyers to distressed-property owners and investors, we focus on solutions that fit the situation instead of forcing everyone through the same process.',
  },
  {
    title: 'Local Market Judgment',
    description:
      'We work across Orange County, LA County, and Riverside County with a practical understanding of neighborhood pricing, inventory, and long-term value drivers.',
  },
]

const serviceFootprint = [
  'Residential buying and selling',
  'Investment property guidance',
  'Property management',
  'Foreclosure and short-sale support',
  'Probate and complex transaction strategy',
  'Orange County, LA County, and Riverside County coverage',
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[420px] flex items-center py-24 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about-team-california-home.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <Container className="relative z-10">
          <div className="max-w-2xl text-left">
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
              About Momentum Realty Group
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-medium text-white mt-4 mb-6 leading-tight">
              Real Estate Built Around{' '}
              <span className="text-gold italic">Momentum</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              We&apos;re a Southern California brokerage founded to give clients strategic advice,
              honest communication, and solutions that actually fit the property, the market, and
              the outcome they want.
            </p>
          </div>
        </Container>
      </section>

      {/* Brand positioning */}
      <section className="py-20 md:py-24 border-b border-border bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
                Who We Are
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
                A brokerage focused on outcomes, not just transactions.
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Momentum Realty Group was founded in 2009 on a simple belief: clients deserve
                  more than a salesperson opening doors or posting listings. They deserve a partner
                  who can think strategically, move quickly, and guide the full decision with their
                  best interests in mind.
                </p>
                <p>
                  That shows up in every part of the business, from buyer representation and
                  listings to investment guidance, property management, foreclosure support, and
                  high-friction situations that require calm judgment.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-warm-gray p-8">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
                What Clients Rely On
              </span>
              <div className="mt-6 space-y-5">
                {brandPillars.map((pillar) => (
                  <div key={pillar.title}>
                    <h3 className="font-heading text-lg font-medium text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Service footprint */}
      <section className="py-16 bg-warm-gray border-b border-border">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
                Service Footprint
              </span>
              <h2 className="font-heading text-3xl font-medium mt-3 text-foreground">
                Where Momentum adds value
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                We serve clients across Southern California with a mix of brokerage, investment,
                and property-operations expertise that helps keep decisions grounded in the real
                numbers and the real market.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceFootprint.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Leadership */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Leadership Team
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
              Meet the specialists behind the brokerage
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:border-brand/25 hover:shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold/80 to-transparent opacity-80" />
                {/* Card header */}
                <div className="flex items-start gap-6 border-b border-brand/10 p-8">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gold/20 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.photo}
                        alt={`${member.name} - ${member.title}, Momentum Realty Group`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gold border-2 border-white" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-medium text-foreground">{member.name}</p>
                    <p className="text-gold font-display font-semibold uppercase tracking-wider text-xs mt-0.5">
                      {member.title}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">{member.dre}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <a
                        href={`tel:${member.phone.replace(/\D/g, '')}`}
                        className="text-xs text-foreground/70 hover:text-teal transition-colors"
                      >
                        📞 {member.phone}
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-xs text-foreground/70 hover:text-teal transition-colors"
                      >
                        ✉ {member.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="px-8 py-6 flex-1">
                  <p className="text-muted-foreground leading-relaxed text-sm">{member.bio}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand-dark"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                  <Link
                    href={member.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-brand-dark group"
                  >
                    Learn More
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16 bg-charcoal">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Why Clients Stay
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-white">
              Advice that stays anchored to the <span className="text-gold italic">right outcome</span>
            </h2>
            <p className="text-white/60 mt-6 text-lg leading-relaxed">
              Real estate gets complicated fast when financing, timing, tenants, legal constraints,
              or market uncertainty enter the picture. Our job is to simplify the decision-making,
              protect your leverage, and keep the strategy aligned with what matters most to you.
            </p>
            <p className="text-white/60 mt-4 text-lg leading-relaxed">
              That is the standard behind Momentum, whether we are helping someone buy a home,
              exit a property, improve an investment, or navigate a problem that needs more than a
              generic answer.
            </p>
            <div className="mt-8">
              <Button asChild variant="cta" size="marketing">
                <Link href="/contact">Talk With Our Team</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
