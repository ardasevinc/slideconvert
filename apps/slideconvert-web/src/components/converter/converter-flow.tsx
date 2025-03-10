'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { FileUploadComponent } from './file-upload';
import { ConversionProgressComponent } from './conversion-progress';
import { ConversionCompleteComponent } from './conversion-complete';
import { convertFile } from '@/lib/convert-file';

type ConversionStep = 'upload' | 'converting' | 'completed';

export function ConverterFlow() {
  const [currentStep, setCurrentStep] = useState<ConversionStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setCurrentStep('converting');
      startConversion(acceptedFiles[0]);
    }
  };

  const startConversion = async (file: File) => {
    setIsConverting(true);
    abortControllerRef.current = new AbortController();
    try {
      const convertedBlob = await convertFile(
        file,
        abortControllerRef.current.signal,
      );
      const url = URL.createObjectURL(convertedBlob);
      setConvertedFileUrl(url);
      setCurrentStep('completed');
      toast.success('File converted successfully!');
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Conversion failed. Please try again.');
        setCurrentStep('upload');
      }
    } finally {
      setIsConverting(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setCurrentStep('upload');
  };

  const handleConvertAnother = () => {
    if (convertedFileUrl) {
      URL.revokeObjectURL(convertedFileUrl);
    }
    setFile(null);
    setConvertedFileUrl(null);
    setCurrentStep('upload');
  };

  useEffect(() => {
    return () => {
      if (convertedFileUrl) {
        URL.revokeObjectURL(convertedFileUrl);
      }
    };
  }, [convertedFileUrl]);

  return (
    <section
      id='converter-section'
      className='min-h-screen flex flex-col items-center justify-center py-20 px-4'
    >
      <h2 className='text-3xl md:text-4xl font-bold mb-8 text-center'>
        Start Converting
      </h2>
      <p className='text-lg mb-12 text-center max-w-2xl text-gray-700 dark:text-gray-200'>
        Drop your PowerPoint file below and we&apos;ll convert it to a
        high-quality PDF in seconds.
      </p>

      {currentStep === 'upload' && (
        <FileUploadComponent
          onFilesAccepted={handleFileAccepted}
          disabled={isConverting}
        />
      )}

      {currentStep === 'converting' && file && (
        <ConversionProgressComponent
          onCancel={handleCancel}
          filename={file.name}
          filesize={file.size}
        />
      )}

      {currentStep === 'completed' && convertedFileUrl && (
        <ConversionCompleteComponent
          fileUrl={convertedFileUrl}
          onConvertAnother={handleConvertAnother}
        />
      )}
    </section>
  );
}
