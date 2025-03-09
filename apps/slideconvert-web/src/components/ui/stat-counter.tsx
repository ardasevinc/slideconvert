'use client';

import React from 'react';

interface StatCounterProps {
  value: string;
  label: string;
}

export function StatCounter({ value, label }: StatCounterProps) {
  return (
    <div className='px-4'>
      <div className='text-3xl font-bold text-gray-900 dark:text-white'>
        {value}
      </div>
      <div className='text-sm text-gray-500 dark:text-gray-400'>{label}</div>
    </div>
  );
}
