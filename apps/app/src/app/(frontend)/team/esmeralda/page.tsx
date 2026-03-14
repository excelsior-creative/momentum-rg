import Image from 'next/image'
import { Container } from '@/components/Container'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const revalidate = 3600

export const metadata = generatePageMetadata({
  title: 'Esmeralda Novikoff | Real Estate & Foreclosure Specialist',
  description:
    'Meet Esmeralda Novikoff, CA DRE #01409881. Certified Seniors Real Estate Specialist and Short Sale & Foreclosure Resource at Momentum Realty Group. Hablamos Español.',
  path: '/team/esmeralda',
  keywords: [
    'Esmeralda Novikoff',
    'foreclosure specialist Orange County',
    'short sale specialist',
    'seniors real estate specialist',
    'DRE 01409881',
    'Momentum Realty Group',
    'hablamos espanol real estate',
  ],
})

const credentials = [
  { label: 'CA DRE#', value: '01409881' },
  { label: 'Licensed', value: '2004' },
  { label: 'Certifications', value: 'SRES · SFR' },
  { label: 'Languages', value: 'English · Spanish' },
]

const specialties = [
  'Short Sales & Foreclosures',
  'Loan Modification Negotiation',
  'Probate Sales',
  'Escrow & Title Processing',
  'Transaction Coordination',
  'Seniors Real Estate (SRES)',
]

export default function EsmeraldaPage() {
  return (
    <div className="flex flex-col">
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
              Esmeralda{' '}
              <span className="text-gold italic">Novikoff</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl">
              Real Estate &amp; Foreclosure Specialist — helping homeowners navigate complex
              situations with knowledge, compassion, and proven results since 2004.
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
                    src="/esmeralda-novikoff.jpg"
                    alt="Esmeralda Novikoff - Real Estate & Foreclosure Specialist, Momentum Realty Group"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 left-0 right-0 mx-auto lg:mx-0 w-20 h-1 bg-gold rounded-full" />
              </div>

              <div className="mt-8 space-y-1.5">
                <p className="font-heading text-2xl font-medium text-foreground">Esmeralda Novikoff</p>
                <p className="text-gold font-display font-semibold uppercase tracking-wider text-sm">
                  Real Estate &amp; Foreclosure Specialist
                </p>

                {/* Credential grid */}
                <div className="mt-4 space-y-2 text-sm">
                  {credentials.map((c) => (
                    <div key={c.label} className="flex items-baseline gap-2">
                      <span className="text-muted-foreground text-xs uppercase tracking-wide w-24 shrink-0">
                        {c.label}
                      </span>
                      <span className="text-foreground font-medium">{c.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 space-y-2">
                  <a
                    href="tel:8778862699"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-teal transition-colors justify-center lg:justify-start"
                  >
                    <span className="text-teal">📞</span>
                    (877) 886-2699
                  </a>
                  <a
                    href="mailto:esmenovi@yahoo.com"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-teal transition-colors justify-center lg:justify-start"
                  >
                    <span className="text-teal">✉</span>
                    esmenovi@yahoo.com
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-2 space-y-5 text-muted-foreground leading-relaxed text-base">
              <p>
                Esmeralda Novikoff obtained her Real Estate license in 2004 and has spent over two
                decades building deep expertise across nearly every corner of the real estate world.
                She has worked as a Transaction Coordinator, Title Insurance Processor, and Escrow
                professional — experience that gives her clients a distinct advantage when navigating
                complex closings.
              </p>
              <p>
                Today, Esmeralda focuses on what she does best: helping homeowners facing foreclosure
                find a clear path forward. Foreclosures are a multi-phased legal process with a
                strict timeline — and time is never on the homeowner&apos;s side. Esmeralda brings
                calm, experience, and a real plan to every situation.
              </p>
              <p>
                She is a certified <strong className="text-foreground">Seniors Real Estate
                Specialist (SRES)</strong> and a <strong className="text-foreground">Short Sale
                &amp; Foreclosure Resource (SFR)</strong> — credentials that reflect her commitment
                to serving clients at every stage of life and in every financial circumstance.
              </p>
              <blockquote className="border-l-4 border-gold/60 pl-6 py-2 italic font-heading text-foreground text-lg bg-warm-gray rounded-r-xl">
                &ldquo;Together, we can find a perfect, personalized solution for your unique
                situation. Our goal is to save your home and your equity.&rdquo;
              </blockquote>
              <p>
                Esmeralda is fully bilingual — fluent in English and Spanish (reading and
                writing) — making her an invaluable resource for the diverse communities of Orange
                County and beyond. <em className="text-foreground/80">Hablamos Español.</em>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Specialties */}
      <section className="py-16 bg-warm-gray">
        <Container>
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Areas of Expertise
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-foreground">
              What Esmeralda <span className="text-gold italic">Specializes In</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {specialties.map((s) => (
              <div
                key={s}
                className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 shadow-sm border border-border"
              >
                <span className="text-gold text-lg">✓</span>
                <span className="text-sm font-medium text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Foreclosure CTA */}
      <section className="py-20 bg-charcoal">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold font-display">
              Free Consultation
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-medium mt-3 text-white">
              Facing Foreclosure? <span className="text-gold italic">Let&apos;s Talk.</span>
            </h2>
            <p className="text-white/60 mt-6 text-lg leading-relaxed">
              At Momentum Realty Group we offer FREE, no-obligation help and advice to give you
              the best options available for your situation. Knowledge is power — and Esmeralda
              has both.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:8778862699"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-charcoal font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                📞 Call (877) 886-2699
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-white/20"
              >
                Send a Message
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
