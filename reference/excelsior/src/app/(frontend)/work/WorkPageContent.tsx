"use client";

import FilterablePortfolio, {
  PortfolioProject,
} from "@/components/FilterablePortfolio";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Button from "@/components/ui/Button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface WorkPageContentProps {
  projects: PortfolioProject[];
}

export default function WorkPageContent({ projects }: WorkPageContentProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="min-h-screen text-zinc-100 relative selection:bg-[#FF5722] selection:text-white bg-brand-dark-gray">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

        {/* Gradient orb */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5722]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero SVG Art */}
        <motion.div
          style={{ y: heroY }}
          className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none z-0"
        >
          <Image
            src="/services/wolf.svg"
            alt=""
            aria-hidden="true"
            fill
            sizes="50vw"
            className="object-contain object-right"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-mono text-zinc-400 mb-8"
          >
            <Link href="/" className="hover:text-[#FF5722] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#FF5722]">Work</span>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-gradient-to-br from-[#FF5722] to-[#E91E63] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,87,34,0.3)]"
              >
                <Briefcase className="w-10 h-10 text-white" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-bold uppercase font-oswald leading-[0.95]">
                Our <br />
                <span className="text-gradient">Work</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-md"
            >
              <p className="text-zinc-400 leading-relaxed border-l-2 border-[#FF5722]/30 pl-4">
                Every project represents a partnership built on trust, ambition,
                and the relentless pursuit of excellence. From nonprofits
                changing the world to professional services firms driving
                business forward.
              </p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient font-oswald">
                100+
              </div>
              <div className="text-zinc-400 font-mono text-xs mt-2 uppercase tracking-widest">
                Projects Delivered
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient font-oswald">
                40+
              </div>
              <div className="text-zinc-400 font-mono text-xs mt-2 uppercase tracking-widest">
                Happy Clients
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient font-oswald">
                12+
              </div>
              <div className="text-zinc-400 font-mono text-xs mt-2 uppercase tracking-widest">
                Years Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gradient font-oswald">
                5★
              </div>
              <div className="text-zinc-400 font-mono text-xs mt-2 uppercase tracking-widest">
                Client Rating
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid Section - Light Theme */}
      <section className="py-16 bg-zinc-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <FilterablePortfolio projects={projects} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5722]/5 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold uppercase font-oswald text-white mb-6">
              Ready to Join{" "}
              <span className="text-gradient">Our Portfolio?</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Let's create something remarkable together. Whether you're a
              nonprofit with a mission or a business ready to scale, we're here
              to help.
            </p>
            <Button as="link" href="/#contact">
              Start Your Project
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
