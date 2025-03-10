'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileUploadComponent } from './file-upload';
import { ConversionProgressComponent } from './conversion-progress';
import { ConversionCompleteComponent } from './conversion-complete';
import { apiQueries, convertPowerPoint, ApiError } from '@/lib/api';
import { JobStatusResponse } from '@/lib/schemas/api.schema';
import { z } from 'zod';

type ConversionStep = 'upload' | 'converting' | 'completed';

export function ConverterFlow() {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Create an AbortController ref for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  // Convert PowerPoint mutation with abort signal
  const convertMutation = useMutation({
    mutationFn: async (file: File) => {
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        // Pass signal to the API function
        return await convertPowerPoint(file, signal);
      } catch (error) {
        // Don't throw AbortError - it's expected
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Conversion cancelled');
          return null;
        }
        throw error;
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Failed to start conversion';
      toast.error(message);
    },
  });

  // Get job status query - only enabled when we have a jobId
  const jobId = convertMutation.data?.job_id;

  // Define the query with proper typing
  const statusQuery = useQuery<z.infer<typeof JobStatusResponse>, Error>({
    queryKey: ['conversion', jobId || ''],
    queryFn: () => {
      if (!jobId) throw new Error('Job ID is required');
      return apiQueries.getConversionStatus(jobId).queryFn();
    },
    enabled: !!jobId && !convertMutation.isPending,
    refetchInterval: 1000, // Poll every second
    refetchIntervalInBackground: true,
    // Stop polling when the job is done or failed
    refetchOnMount: true,
    gcTime: 0, // Don't keep the data in cache
  });

  // Add success and error effects
  React.useEffect(() => {
    if (statusQuery.data?.status === 'failed') {
      toast.error(statusQuery.data.error || 'Conversion failed');
      // Stop polling when job fails
      queryClient.cancelQueries({ queryKey: ['conversion', jobId] });
    } else if (statusQuery.data?.status === 'done') {
      toast.success('File converted successfully!');
      // Stop polling when job is done
      queryClient.cancelQueries({ queryKey: ['conversion', jobId] });
    }
  }, [statusQuery.data, jobId, queryClient]);

  // Handle error
  React.useEffect(() => {
    if (statusQuery.error) {
      toast.error('Failed to check conversion status');
    }
  }, [statusQuery.error]);

  // Determine current step based on query states
  const getCurrentStep = (): ConversionStep => {
    if (convertMutation.isPending) return 'converting';
    if (statusQuery.data?.status === 'processing') return 'converting';
    if (statusQuery.data?.status === 'done') return 'completed';
    return 'upload';
  };

  const currentStep = getCurrentStep();

  // Handle file acceptance
  const handleFileAccepted = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      convertMutation.mutate(file);
    }
  };

  // Handle cancellation
  const handleCancel = () => {
    // Cancel in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset mutation and query state
    convertMutation.reset();

    // Remove query data to stop polling
    if (jobId) {
      queryClient.removeQueries({ queryKey: ['conversion', jobId] });
    }

    setFile(null);
  };

  // Handle "convert another"
  const handleConvertAnother = () => {
    // Reset all state
    convertMutation.reset();
    if (jobId) {
      queryClient.removeQueries({ queryKey: ['conversion', jobId] });
    }
    setFile(null);
  };

  // Get download URL from completed job
  const downloadUrl =
    statusQuery.data?.status === 'done' ? statusQuery.data.url : null;

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
          disabled={convertMutation.isPending}
        />
      )}

      {currentStep === 'converting' && file && (
        <ConversionProgressComponent
          onCancel={handleCancel}
          filename={file.name}
          filesize={file.size}
          isUploading={convertMutation.isPending}
        />
      )}

      {currentStep === 'completed' && downloadUrl && (
        <ConversionCompleteComponent
          fileUrl={downloadUrl}
          onConvertAnother={handleConvertAnother}
        />
      )}
    </section>
  );
}
