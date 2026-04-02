import Image from 'next/image'
import { Container } from '@/components/Container'
import { StructuredData } from '@/components/StructuredData'
import { generatePageMetadata } from '@/lib/metadata'
import { generateBreadcrumbSchema } from '@/lib/structured-data'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = generatePageMetadata({
  title: 'Meet Our Team | Momentum Realty Group',
  description:
    'Meet the Momentum Realty Group team — Karl Parize, Broker/Owner, and Esmeralda Novikoff, Real Estate & Foreclosure Specialist. Serving Orange County, LA County, and Riverside County.',
  path: '/about',
  keywords: [
    'Karl Parize',
    'Esmeralda Novikoff',
    'Momentum Realty Group team',
    'real estate team Orange County',
    'foreclosure specialist',
  ],
})

const team = [
  {
    name: 'Karl Parize',
    title: 'Broker / Owner',
    photo: 'https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg',
    dre: 'DRE #01364278',
    phone: '(714) 336-3375',
    email: 'kparize@momentumrg.com',
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

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <StructuredData
        data={generateBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      {/* Hero */}
      <section className="relative min-h-[420px] flex items-center py-24 overflow-hidden">
        <Image
          src="https://momentumrg.com/wp-content/uploads/2025/06/New-Project-1-scaled.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />

        <Container className="relative z-10">
          <div className="max-w-2xl">
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-display">
              Our Team
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-medium text-white mt-4 mb-6 leading-tight">
              The People Behind{' '}
              <span className="text-gold italic">Momentum</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              Two specialists. One shared mission: put the client first, find the right solution,
              and get results that last. Get to know the team.
            </p>
          </div>
        </Container>
      </section>

      {/* Team cards */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="flex items-start gap-6 p-8 border-b border-border">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gold/20 shadow-md relative">
                      <Image
                        src={member.photo}
                        alt={`${member.name} - ${member.title}, Momentum Realty Group`}
                        fill
                        className="object-cover"
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
                        className="text-xs bg-warm-gray text-foreground/70 px-3 py-1 rounded-full border border-border"
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
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold/80 transition-colors group"
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
              Why Momentum
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-white">
              Real Estate Built Around <span className="text-gold italic">You</span>
            </h2>
            <p className="text-white/60 mt-6 text-lg leading-relaxed">
              Momentum Realty Group was founded in 2009 on a simple idea: real estate should
              start with the client, not the commission. Whether you&apos;re buying your first
              home, navigating a foreclosure, or growing an investment portfolio — we bring the
              right expertise to your specific situation.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-charcoal font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
