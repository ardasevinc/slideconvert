'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/converter';

export function ConverterSection() {
  const [, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setProgress(0);
  };

  const handleUpload = async (files: File[]): Promise<void> => {
    if (files.length === 0) return;

    setIsConverting(true);

    // Simulate a conversion progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate an API request
    await new Promise((resolve) => setTimeout(resolve, 5000));

    clearInterval(interval);
    setProgress(100);
    setIsConverting(false);
  };

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

      <FileDropzone
        onFilesAccepted={handleFilesAccepted}
        onUpload={handleUpload}
        progress={progress}
        disabled={isConverting}
      />
    </section>
  );
}
