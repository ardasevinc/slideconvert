'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, AnimatedIcons } from '@/components/ui';

interface HeroSectionProps {
  onConvertClick: () => void;
}

export function HeroSection({ onConvertClick }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='max-w-5xl mx-auto'
    >
      {/* Animated PowerPoint to PDF Icon */}
      <motion.div
        className='mb-8 flex justify-center'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatedIcons isHovered={isHovered} />
      </motion.div>

      <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300'>
        Convert your PowerPoint to PDF with ease
      </h1>

      <p className='text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-200'>
        SlideConvert is a simple tool that allows you to convert your PowerPoint
        to PDF with ease.
      </p>

      {/* Enhanced CTA Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className='mb-16'
      >
        <Button
          className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 px-8 rounded-full shadow-lg relative h-14 min-w-[180px]'
          onClick={onConvertClick}
        >
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className='absolute inset-0 flex items-center justify-center'
          >
            Convert now
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className='flex items-center justify-center gap-2 absolute inset-0'
          >
            Upload your PPT <ArrowRight className='w-4 h-4' />
          </motion.span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
