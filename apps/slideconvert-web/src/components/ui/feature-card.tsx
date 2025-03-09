'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgClass: string;
  iconColorClass: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBgClass,
  iconColorClass,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      className='flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800'
      whileHover={{
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
    >
      <div className={`p-2 rounded-full ${iconBgClass} mb-3`}>
        <Icon className={`h-6 w-6 ${iconColorClass}`} />
      </div>
      <h3 className='font-semibold text-gray-900 dark:text-white'>{title}</h3>
      <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-1'>
        {description}
      </p>
    </motion.div>
  );
}
