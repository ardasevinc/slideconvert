'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui';

export function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Handle file upload logic here
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);
    // Implement file processing logic
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Handle file upload logic here
      const files = Array.from(e.target.files);
      console.log('Files selected:', files);
      // Implement file processing logic
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <motion.div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700'
        } transition-colors duration-200`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        animate={{
          borderColor: isDragging ? '#3b82f6' : '#d1d5db',
          backgroundColor: isDragging
            ? 'rgba(59, 130, 246, 0.05)'
            : 'transparent',
        }}
      >
        <div className='flex flex-col items-center justify-center'>
          <div className='mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900'>
            <Upload className='h-8 w-8 text-blue-600 dark:text-blue-300' />
          </div>

          <h3 className='mb-2 text-xl font-medium text-gray-900 dark:text-white'>
            Drag & drop your PowerPoint file here
          </h3>

          <p className='mb-6 text-sm text-gray-500 dark:text-gray-400'>
            or click to browse your files
          </p>

          <input
            type='file'
            id='file-upload'
            className='hidden'
            accept='.ppt,.pptx'
            onChange={handleFileSelect}
          />

          <label htmlFor='file-upload'>
            <Button
              className='bg-blue-600 hover:bg-blue-700 text-white'
              type='button'
            >
              Select File
            </Button>
          </label>

          <p className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
            Supports .ppt, .pptx files up to 50MB
          </p>
        </div>
      </motion.div>
    </div>
  );
}
