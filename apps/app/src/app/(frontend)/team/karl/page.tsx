import Image from 'next/image'
import { Container } from '@/components/Container'
import { StructuredData } from '@/components/StructuredData'
import { generatePageMetadata } from '@/lib/metadata'
import { buildAbsoluteUrl } from '@/lib/metadata'
import { combineSchemas, generateBreadcrumbSchema, generatePersonSchema } from '@/lib/structured-data'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = generatePageMetadata({
  title: 'Karl Parize | Broker & Owner, Momentum Realty Group',
  description:
    'Meet Karl Parize, Broker/Owner of Momentum Realty Group. 25+ years of real estate expertise across Orange County, LA County, and Riverside County. NMLS #313044.',
  path: '/team/karl',
  keywords: [
    'Karl Parize',
    'real estate broker Orange County',
    'Momentum Realty Group',
    'Long Beach realtor',
    'Orange County broker',
    'NMLS 313044',
    'CBRE 01364278',
  ],
})

export default function KarlPage() {
  const schema = combineSchemas(
    generatePersonSchema({
      name: 'Karl Parize',
      jobTitle: 'Broker / Owner',
      description:
        'Broker and Owner of Momentum Realty Group with 25+ years of real estate, mortgage, and financial planning expertise across Orange County, LA County, and Riverside County.',
      telephone: '+17143363375',
      email: 'karl@momentumrg.com',
      image: 'https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg',
      url: buildAbsoluteUrl('/team/karl'),
    }),
    generateBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
      { name: 'Karl Parize', path: '/team/karl' },
    ]),
  )

  return (
    <div className="flex flex-col">
      <StructuredData data={schema} />
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
            <Link
              href="/about"
              className="text-gold/70 text-xs font-semibold uppercase tracking-[0.3em] font-display hover:text-gold transition-colors"
            >
              ← Meet Our Team
            </Link>
            <h1 className="font-heading text-4xl md:text-6xl font-medium text-white mt-4 mb-6 leading-tight">
              Karl{' '}
              <span className="text-gold italic">Parize</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              Broker &amp; Owner of Momentum Realty Group — putting purpose behind every property
              for buyers, sellers, and investors across Southern California since 2009.
            </p>
          </div>
        </Container>
      </section>

      {/* Profile */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Photo + credentials */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <div className="w-52 h-52 rounded-2xl overflow-hidden border-4 border-gold/20 shadow-2xl mx-auto lg:mx-0 relative">
                  <Image
                    src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                    alt="Karl Parize - Broker/Owner, Momentum Realty Group"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 left-0 right-0 mx-auto lg:mx-0 w-20 h-1 bg-gold rounded-full" />
              </div>

              <div className="mt-8 space-y-1.5">
                <p className="font-heading text-2xl font-medium text-foreground">Karl Parize</p>
                <p className="text-gold font-display font-semibold uppercase tracking-wider text-sm">
                  Broker / Owner
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground justify-center lg:justify-start mt-1">
                  <span>NMLS #313044</span>
                  <span>·</span>
                  <span>CBRE #01364278</span>
                </div>
                <div className="pt-3 space-y-2">
                  <a
                    href="tel:7143363375"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-teal transition-colors justify-center lg:justify-start"
                  >
                    <span className="text-teal">📞</span>
                    (714) 336-3375
                  </a>
                  <a
                    href="mailto:karl@momentumrg.com"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-teal transition-colors justify-center lg:justify-start"
                  >
                    <span className="text-teal">✉</span>
                    karl@momentumrg.com
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2 space-y-5 text-muted-foreground leading-relaxed text-base">
              <p>
                Karl Parize is a Real Estate Broker and Owner of Momentum Realty Group — a true
                expert in the consumer services industry, having spent several committed years in
                financial planning, mortgage, and real estate. Being a real estate broker during
                tough economic climates, he is described as the guy who finds a way to offer an
                ideal solution that makes sense for the client.
              </p>
              <p>
                He operates every transaction with the utmost integrity. Because of his large
                circle of influence, it enables him to create positive results for most situations.
              </p>
              <p>
                Integrity and working knowledge of finance, mortgage, and real estate add to the
                power behind Momentum. Equally important is the attention to detail adhered to when
                finding the RIGHT solutions for clients.
              </p>
              <p>
                Karl&apos;s passion and enthusiasm for history provide extremely useful knowledge
                about geographical and neighborhood pasts, presents, and futures that — when tied
                to any transaction — prove priceless.
              </p>
              <p>
                First-time home buyers and seasoned investors alike experience unique service and
                results generated from the personal touch and understanding that Karl brings to
                each and every case.
              </p>
              <blockquote className="border-l-4 border-gold/60 pl-6 py-2 italic font-heading text-foreground text-lg bg-warm-gray rounded-r-xl">
                &ldquo;Clients looking to establish a relationship with an expert who will not only
                have their best interest at heart, but act as if it&apos;s his own, need look no
                further.&rdquo;
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-charcoal">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2009', label: 'Founded' },
              { value: '25+', label: 'Years Experience' },
              { value: '500+', label: 'Transactions' },
              { value: '3', label: 'Counties Served' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-heading text-4xl md:text-5xl font-medium text-gold">{s.value}</p>
                <p className="text-white/50 text-sm mt-2 font-display uppercase tracking-wide">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Our Mission
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
              Real Estate Built Around <span className="text-gold italic">People</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
              At Momentum Realty Group, we believe that real estate starts with property — but
              it doesn&apos;t end there. Every client deserves a broker who listens, a strategist
              who thinks creatively, and a partner who stays until the job is done right.
            </p>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              That&apos;s the Momentum standard. It&apos;s why our clients return, and why they
              refer their friends and family. We earn trust one transaction at a time.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-cta hover:bg-cta-light text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
