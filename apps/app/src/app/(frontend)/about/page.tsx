import { Container } from '@/components/Container'
import { generatePageMetadata } from '@/lib/metadata'

export const revalidate = 3600

export const metadata = generatePageMetadata({
  title: 'About Karl Parize',
  description: 'Meet Karl Parize, Broker/Owner of Momentum Realty Group. Over a decade of real estate expertise across Orange County, LA County, and Riverside County.',
  path: '/about',
  keywords: ['Karl Parize', 'real estate broker', 'Momentum Realty Group', 'Newport Beach realtor', 'Orange County broker'],
})

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 md:py-32 bg-brand relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
        <Container>
          <div className="max-w-3xl">
            <span className="text-gold text-sm font-semibold uppercase tracking-widest">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
              Putting Purpose Behind{' '}
              <span className="text-gold">Every Property</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Momentum Realty Group was founded by Karl in 2009 to help others achieve the dream
              of ownership and peace of mind. With over a decade&apos;s worth of experience in
              real estate, Karl designed Momentum to break the mold of the traditional brokerage
              model and put primary focus of all transactions on the &ldquo;why&rdquo; of his clientele.
            </p>
          </div>
        </Container>
      </section>

      {/* Karl Bio */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Photo + credentials */}
            <div className="text-center md:text-left">
              <div className="w-48 h-48 rounded-2xl bg-brand/10 border border-border mx-auto md:mx-0 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://momentumrg.com/wp-content/uploads/2022/03/Karl-Parize-Realtor-1.jpg"
                  alt="Karl Parize - Broker/Owner, Momentum Realty Group"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-6 space-y-1">
                <p className="text-2xl font-bold text-foreground">Karl Parize</p>
                <p className="text-brand font-semibold">Broker / Owner</p>
                <p className="text-sm text-muted-foreground">BRE# 01364278</p>
                <a
                  href="tel:7143363375"
                  className="block text-sm text-brand hover:underline mt-2"
                >
                  (714) 336-3375
                </a>
                <a
                  href="mailto:karl@momentumrg.com"
                  className="block text-sm text-brand hover:underline"
                >
                  karl@momentumrg.com
                </a>
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
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
                finding the RIGHT solutions for clients. &ldquo;Success begets success when you
                seek to not only know the history, but the true desired outcome of your
                clients.&rdquo;
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
              <blockquote className="border-l-4 border-gold pl-6 italic text-foreground text-lg">
                &ldquo;Clients looking to establish a relationship with an expert who will not only
                have their best interest at heart, but act as if it&apos;s his own, need look no
                further.&rdquo;
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-brand">2009</p>
              <p className="text-sm text-muted-foreground mt-1">Founded</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand">25+</p>
              <p className="text-sm text-muted-foreground mt-1">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand">3</p>
              <p className="text-sm text-muted-foreground mt-1">Counties Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand">100%</p>
              <p className="text-sm text-muted-foreground mt-1">Client Focused</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
