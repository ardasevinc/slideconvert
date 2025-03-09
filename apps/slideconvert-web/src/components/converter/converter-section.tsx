'use client';

import React from 'react';
import { FileDropzone } from '@/components/converter';

export function ConverterSection() {
  return (
    <section
      id='converter-section'
      className='min-h-screen flex flex-col items-center justify-start py-20 px-4'
    >
      <h2 className='text-3xl md:text-4xl font-bold mb-8 text-center'>
        Start Converting
      </h2>
      <p className='text-lg mb-12 text-center max-w-2xl text-gray-700 dark:text-gray-200'>
        Drop your PowerPoint file below and we&apos;ll convert it to a
        high-quality PDF in seconds.
      </p>

      <FileDropzone />
    </section>
  );
}
