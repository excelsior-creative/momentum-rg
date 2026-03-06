'use client'

import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { NavSection } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, LucideIcon, Search } from 'lucide-react';
import Link from 'next/link';
import { useContactDialog } from './ContactDialogProvider';
import { useSearch } from './SearchProvider';
import { siteConfig } from '@/data/site-config';
import { services, iconMap } from '@/data/services';

interface NavigationProps {
  // Removed props as we'll handle state internally for better performance (Server Components)
}

const Navigation: React.FC<NavigationProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { openContactDialog } = useContactDialog();
  const { openSearch } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll Spy
      const sections = ['home', 'about', 'services', 'process', 'work', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use static siteConfig for nav items
  const navItems = siteConfig.navigation.mainMenu.map(item => ({
    label: item.label,
    href: item.href,
    hasDropdown: item.href === '/#services' || item.label.toLowerCase() === 'services',
  }));

  // Use static services for dropdown links
  const serviceLinks = services.map(service => ({
    label: service.title,
    href: `/services/${service.slug}`,
    icon: service.icon,
  }));

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-brand-dark-gray/70 backdrop-blur-lg py-4' 
            : 'bg-brand-dark-gray/40 backdrop-blur-md py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <Logo className="h-8 md:h-10" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map(item => (
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all overflow-hidden group inline-flex ${
                      currentSection === item.label.toLowerCase() ? 'text-black bg-white' : 'text-white hover:text-[#FF5722]'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      {item.label}
                      <ChevronDown className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                    </span>
                    
                    {currentSection !== item.label.toLowerCase() && (
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    )}
                  </Link>

                  {/* Services Dropdown */}
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
                      >
                        {/* Corner decorations */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF5722]" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF5722]" />
                        
                        <div className="py-2">
                          {serviceLinks.map((service) => {
                            const IconComponent = iconMap[service.icon as string];
                            return (
                              <Link
                                key={service.href}
                                href={service.href}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all group"
                              >
                                {IconComponent && <IconComponent className="w-4 h-4 text-[#FF5722] group-hover:scale-110 transition-transform" />}
                                <span>{service.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all overflow-hidden group ${
                    currentSection === item.label.toLowerCase() ? 'text-black bg-white' : 'text-white hover:text-[#FF5722]'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {item.label}
                  </span>
                  
                  {/* Hover Glitch Background */}
                  {currentSection !== item.label.toLowerCase() && (
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  )}
                </Link>
              )
            ))}
            
            <button
              onClick={openSearch}
              className="p-2 text-white hover:text-[#FF5722] transition-colors"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={openContactDialog}
              className="bg-gradient-brand px-6 py-2 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:shadow-[0_0_15px_#FF5722] transition-all flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              START
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white border border-white/20 p-2 hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-dark-gray backdrop-blur-xl flex flex-col justify-center items-center gap-6 overflow-y-auto py-20">
           <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
           {navItems.map(item => (
              item.hasDropdown ? (
                <div key={item.label} className="flex flex-col items-center">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="relative text-3xl font-oswald font-bold uppercase text-white hover:text-[#FF5722] group flex items-center gap-2"
                  >
                    {item.label}
                    <ChevronDown className={`w-6 h-6 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center gap-3 mt-4 overflow-hidden"
                      >
                        {serviceLinks.map(service => {
                          const IconComponent = iconMap[service.icon as string];
                          return (
                            <Link
                              key={service.href}
                              href={service.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-2 text-lg text-zinc-400 hover:text-[#FF5722] transition-colors"
                            >
                              {IconComponent && <IconComponent className="w-4 h-4" />}
                              <span>{service.label}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative text-3xl font-oswald font-bold uppercase text-white hover:text-[#FF5722] group"
                >
                  {item.label}
                </Link>
              )
            ))}
            
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSearch();
                }}
                className="p-3 text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Open search"
              >
                <Search className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openContactDialog();
                }}
                className="bg-gradient-brand px-8 py-3 text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_20px_#FF5722] transition-all flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                START
              </button>
            </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
