'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroSection, FeaturesSection, StatsSection } from '@/components/home';

// Dynamically import heavy client components with SSR disabled
const AuroraBackground = dynamic(
  () => import('@/components/layout').then((mod) => mod.AuroraBackground),
  { ssr: false },
);

const ConverterFlow = dynamic(
  () => import('@/components/converter').then((mod) => mod.ConverterFlow),
  {
    ssr: false,
    loading: () => (
      <div className='min-h-[300px] flex items-center justify-center'>
        Loading converter...
      </div>
    ),
  },
);

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
      <Suspense
        fallback={
          <div className='min-h-[300px] flex items-center justify-center'>
            Loading converter...
          </div>
        }
      >
        <ConverterFlow />
      </Suspense>
    </AuroraBackground>
  );
}
