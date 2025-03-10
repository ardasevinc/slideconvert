'use client';

import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileUploadComponent } from './file-upload';
import { ConversionProgressComponent } from './conversion-progress';
import { ConversionCompleteComponent } from './conversion-complete';
import { apiQueries, convertPowerPoint, ApiError } from '@/lib/api';
import type { JobStatusResponse } from '@/lib/schemas/api.schema';

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

  // Get job ID returned by the mutation
  const jobId = convertMutation.data?.job_id;

  // Job status query with callbacks for side effects
  const statusQuery = useQuery<JobStatusResponse>({
    queryKey: ['conversion', jobId || ''],
    queryFn: async () => {
      if (!jobId) throw new Error('Job ID is required');
      return await getConversionStatus(jobId);
    },
    enabled: !!jobId && !convertMutation.isPending,
    refetchInterval: (query) => {
      if (query.state.data?.status === 'processing') {
        return 1000;
      }
      return false;
    },
    gcTime: 0, // Don't keep the data in cache
  });

  // Handle status changes with side effects
  const currentStatus = statusQuery.data?.status;

  // Show notifications when status changes
  if (currentStatus === 'failed' && statusQuery.isSuccess) {
    toast.error(statusQuery.data.error || 'Conversion failed');
  } else if (currentStatus === 'done' && statusQuery.isSuccess) {
    toast.success('File converted successfully!');
  }

  if (statusQuery.isError) {
    toast.error('Failed to check conversion status');
  }

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
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      convertMutation.mutate(selectedFile);
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

// Helper function to get conversion status directly
async function getConversionStatus(jobId: string) {
  return await apiQueries.getConversionStatus(jobId).queryFn();
}
