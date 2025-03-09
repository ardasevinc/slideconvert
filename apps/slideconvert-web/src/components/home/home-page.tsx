'use client';

import React from 'react';
import { AuroraBackground } from '@/components/layout';
import { HeroSection, FeaturesSection, StatsSection } from '@/components/home';
import { ConverterSection } from '@/components/converter';

export function HomePage() {
  const scrollToConverter = () => {
    const converterSection = document.getElementById('converter-section');
    if (converterSection) {
      converterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuroraBackground>
      {/* Hero Section */}
      <section className='min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-16'>
        <HeroSection onConvertClick={scrollToConverter} />
        <FeaturesSection />
        <StatsSection />
      </section>

      {/* Converter Section */}
      <ConverterSection />
    </AuroraBackground>
  );
}
