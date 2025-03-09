'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  FileType,
  Lock,
  Zap,
  Globe,
  FileUp,
  Download,
} from 'lucide-react';

export function AuroraBackgroundDemo() {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToConverter = () => {
    // Implement smooth scrolling to the converter section
    const converterSection = document.getElementById('converter-section');
    if (converterSection) {
      converterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AuroraBackground>
      {/* Hero Section */}
      <section className='min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-16'>
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
          </motion.div>

          <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300'>
            Convert your PowerPoint to PDF with ease
          </h1>

          <p className='text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-200'>
            SlideConvert is a simple tool that allows you to convert your
            PowerPoint to PDF with ease.
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
              onClick={scrollToConverter}
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

          {/* Feature highlights */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto'>
            <motion.div
              className='flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800'
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className='p-2 rounded-full bg-blue-100 dark:bg-blue-900 mb-3'>
                <Zap className='h-6 w-6 text-blue-600 dark:text-blue-300' />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Fast conversion
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-1'>
                Convert in seconds
              </p>
            </motion.div>

            <motion.div
              className='flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800'
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className='p-2 rounded-full bg-green-100 dark:bg-green-900 mb-3'>
                <Lock className='h-6 w-6 text-green-600 dark:text-green-300' />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Secure files
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-1'>
                Your data is safe
              </p>
            </motion.div>

            <motion.div
              className='flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800'
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className='p-2 rounded-full bg-purple-100 dark:bg-purple-900 mb-3'>
                <Download className='h-6 w-6 text-purple-600 dark:text-purple-300' />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                High quality
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-1'>
                Perfect conversion
              </p>
            </motion.div>

            <motion.div
              className='flex flex-col items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-gray-800'
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className='p-2 rounded-full bg-orange-100 dark:bg-orange-900 mb-3'>
                <Globe className='h-6 w-6 text-orange-600 dark:text-orange-300' />
              </div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                No installation
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-1'>
                Works in browser
              </p>
            </motion.div>
          </div>

          {/* Stats Counter */}
          <motion.div
            className='mt-16 flex flex-wrap justify-center gap-8 text-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className='px-4'>
              <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                10,000+
              </div>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Files Converted
              </div>
            </div>
            <div className='px-4'>
              <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                2.3s
              </div>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Average Time
              </div>
            </div>
            <div className='px-4'>
              <div className='text-3xl font-bold text-gray-900 dark:text-white'>
                100%
              </div>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                Satisfaction
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Converter Tool Section - Placeholder for your react-dropzone component */}
      <section
        id='converter-section'
        className='min-h-screen flex flex-col items-center justify-start py-20 px-4'
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-3xl'
        >
          <h2 className='text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white'>
            Start Converting
          </h2>
          <p className='text-center text-gray-600 dark:text-gray-300 mb-12'>
            Drop your PowerPoint file below and we&apos;ll convert it to a
            high-quality PDF in seconds.
          </p>

          {/* Placeholder for your react-dropzone component */}
          <div className='border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center bg-white/20 dark:bg-black/20 backdrop-blur-sm'>
            <div className='flex flex-col items-center justify-center'>
              <FileUp className='h-12 w-12 text-gray-400 dark:text-gray-500 mb-4' />
              <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                Drag & drop your PowerPoint file here
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                or click to browse your files
              </p>
              <Button className='mt-6 bg-blue-600 hover:bg-blue-700'>
                Select File
              </Button>
              <p className='text-xs text-gray-500 dark:text-gray-400 mt-4'>
                Supports .ppt, .pptx files up to 50MB
              </p>
            </div>
          </div>

          <div className='mt-6 text-center'>
            <button className='text-blue-600 dark:text-blue-400 text-sm underline'>
              Try with sample file
            </button>
          </div>
        </motion.div>
      </section>
    </AuroraBackground>
  );
}
