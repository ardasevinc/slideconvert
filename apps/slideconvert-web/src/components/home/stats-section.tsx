'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { StatCounter } from '@/components/ui';

export function StatsSection() {
  const stats = [
    {
      value: '10,000+',
      label: 'Files Converted',
    },
    {
      value: '2.3s',
      label: 'Average Time',
    },
    {
      value: '100%',
      label: 'Satisfaction',
    },
  ];

  return (
    <motion.div
      className='mt-16 flex flex-wrap justify-center gap-8 text-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      {stats.map((stat, index) => (
        <StatCounter key={index} value={stat.value} label={stat.label} />
      ))}
    </motion.div>
  );
}
