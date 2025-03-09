'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { ArrowRight, FileType, FileUp } from 'lucide-react';

interface AnimatedIconsProps {
  isHovered: boolean;
}

export function AnimatedIcons({ isHovered }: AnimatedIconsProps) {
  return (
    <div className='relative h-20 w-64 flex items-center justify-center'>
      <motion.div
        className='absolute flex items-center'
        initial={{ x: -40 }}
        animate={{ x: isHovered ? -60 : -40 }}
        transition={{ duration: 0.5 }}
      >
        <div className='bg-blue-100 dark:bg-blue-900 p-3 rounded-lg'>
          <FileType className='h-8 w-8 text-blue-600 dark:text-blue-300' />
        </div>
      </motion.div>

      <motion.div
        className='absolute'
        animate={{
          rotate: isHovered ? [0, 180, 360] : 0,
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.7,
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 1,
        }}
      >
        <ArrowRight className='h-6 w-6 text-gray-600 dark:text-gray-300' />
      </motion.div>

      <motion.div
        className='absolute flex items-center'
        initial={{ x: 40 }}
        animate={{ x: isHovered ? 60 : 40 }}
        transition={{ duration: 0.5 }}
      >
        <div className='bg-red-100 dark:bg-red-900 p-3 rounded-lg'>
          <FileUp className='h-8 w-8 text-red-600 dark:text-red-300' />
        </div>
      </motion.div>
    </div>
  );
}
