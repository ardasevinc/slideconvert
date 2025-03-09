'use client';

import React from 'react';
import { Zap, Lock, Download, Globe } from 'lucide-react';
import { FeatureCard } from '@/components/ui';

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Fast conversion',
      description: 'Convert in seconds',
      iconBgClass: 'bg-blue-100 dark:bg-blue-900',
      iconColorClass: 'text-blue-600 dark:text-blue-300',
    },
    {
      icon: Lock,
      title: 'Secure files',
      description: 'Your data is safe',
      iconBgClass: 'bg-green-100 dark:bg-green-900',
      iconColorClass: 'text-green-600 dark:text-green-300',
    },
    {
      icon: Download,
      title: 'High quality',
      description: 'Perfect conversion',
      iconBgClass: 'bg-purple-100 dark:bg-purple-900',
      iconColorClass: 'text-purple-600 dark:text-purple-300',
    },
    {
      icon: Globe,
      title: 'No installation',
      description: 'Works in browser',
      iconBgClass: 'bg-orange-100 dark:bg-orange-900',
      iconColorClass: 'text-orange-600 dark:text-orange-300',
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto'>
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          iconBgClass={feature.iconBgClass}
          iconColorClass={feature.iconColorClass}
        />
      ))}
    </div>
  );
}
