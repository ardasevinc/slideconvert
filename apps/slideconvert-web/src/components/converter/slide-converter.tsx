'use client';

import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { JobStatusResponse } from '@/lib/schemas/api.schema';

import { apiMutations, apiQueries } from '@/lib/api';
import { cn, formatBytes } from '@/lib/utils';
import { Button, Progress } from '@/components/ui';
import { FileDropzone } from './file-dropzone';
import { CheckIcon } from '@/components/icons/check-icon';
import { LoadingIndicatorIcon } from '@/components/icons/loading-indicator-icon';
import { PdfIcon } from '@/components/icons/pdf-icon';
import { UploadIcon } from '@/components/icons/upload-icon';

interface SlideConverterProps extends React.HTMLAttributes<HTMLDivElement> {
  maxFileSize?: number;
}

export function SlideConverter({
  maxFileSize = 52428800, // 50MB in bytes
  className,
  ...props
}: SlideConverterProps) {
  // State for tracking the conversion process
  const [file, setFile] = React.useState<File | null>(null);
  const [jobId, setJobId] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number>(0);

  // Mutation for converting PowerPoint files
  const convertMutation = useMutation({
    mutationFn: (file: File) => apiMutations.convertPowerPoint.mutationFn(file),
    onSuccess: (data) => {
      setJobId(data.job_id);
    },
    onError: (error) => {
      toast.error('Conversion failed. Please try again.');
      console.error('Conversion error:', error);
      resetState();
    },
  });

  // Query for checking conversion status
  const statusQuery = useQuery({
    queryKey: jobId ? ['conversion', jobId] : ['conversion'],
    queryFn: () =>
      jobId
        ? apiQueries.getConversionStatus(jobId).queryFn()
        : Promise.resolve(null),
    enabled: !!jobId,
    refetchInterval: (data) => {
      if (!data) return false;
      // Safe type assertion after null check
      return (data as unknown as JobStatusResponse)?.status === 'processing'
        ? 1000
        : false;
    },
  });

  // Handle status changes
  React.useEffect(() => {
    if (statusQuery.data) {
      // Safe type assertion after null check
      const data = statusQuery.data as unknown as JobStatusResponse;
      if (data.status === 'done') {
        toast.success('Conversion complete!');
      } else if (data.status === 'failed') {
        toast.error(`Conversion failed: ${data.error}`);
        resetState();
      }
    }
  }, [statusQuery.data]);

  // Reset all state
  const resetState = () => {
    setFile(null);
    setJobId(null);
    setUploadProgress(0);
  };

  // Handle file selection
  const handleFilesAccepted = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      // Simulate upload progress
      simulateUploadProgress();
    }
  };

  // Simulate upload progress for better UX
  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + Math.random() * 10;
        if (next >= 100) {
          clearInterval(interval);
          // Start conversion after "upload" is complete
          if (file) {
            convertMutation.mutate(file);
          }
          return 100;
        }
        return next;
      });
    }, 200);
  };

  // Handle file upload and conversion
  const handleUpload = async (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      // Actual conversion happens in the mutation
      await convertMutation.mutateAsync(files[0]);
    }
  };

  // Handle download of converted file
  const handleDownload = () => {
    if (statusQuery.data) {
      const data = statusQuery.data as unknown as JobStatusResponse;
      if (data.status === 'done') {
        window.open(data.url, '_blank');
      }
    }
  };

  // Handle starting a new conversion
  const handleConvertAnother = () => {
    resetState();
  };

  // Determine current state of the conversion process
  const isUploading = uploadProgress > 0 && uploadProgress < 100;
  const isConverting =
    convertMutation.isPending ||
    (statusQuery.data &&
      (statusQuery.data as unknown as JobStatusResponse).status ===
        'processing');
  const isComplete =
    statusQuery.data &&
    (statusQuery.data as unknown as JobStatusResponse).status === 'done';
  const hasError =
    convertMutation.isError ||
    (statusQuery.data &&
      (statusQuery.data as unknown as JobStatusResponse).status === 'failed');

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)} {...props}>
      {/* Initial state - File dropzone */}
      {!file && (
        <FileDropzone
          onFilesAccepted={handleFilesAccepted}
          onUpload={handleUpload}
          maxSize={maxFileSize}
          disabled={!!(isUploading || isConverting)}
        />
      )}

      {/* File selected state - Show file info and conversion options */}
      {file && !isConverting && !isComplete && (
        <div className='animate-enter-keyframes border rounded-lg p-6 shadow-sm'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium'>{file.name}</h3>
              <span className='text-sm text-muted-foreground'>
                {formatBytes(file.size)}
              </span>
            </div>

            <div className='border-t border-b py-4 my-2'>
              <div className='flex items-center gap-2 text-sm'>
                <div className='flex items-center gap-2 text-primary'>
                  <UploadIcon />
                  <span>Convert to PDF</span>
                </div>
                <span className='text-muted-foreground ml-1'>
                  Best quality, retains images and other assets.
                </span>
              </div>
            </div>

            {isUploading && (
              <Progress value={uploadProgress} className='h-1 mt-1' />
            )}

            <div className='flex justify-between gap-2'>
              <Button
                variant='outline'
                onClick={resetState}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => convertMutation.mutate(file)}
                disabled={isUploading}
              >
                Convert
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Converting state - Show progress */}
      {isConverting && (
        <div className='animate-enter-keyframes border rounded-lg p-6 shadow-sm'>
          <div className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='bg-primary rounded-full p-3'>
              <div className='animate-spin-pretty'>
                <LoadingIndicatorIcon />
              </div>
            </div>
            <div className='text-center'>
              <h3 className='text-lg font-medium'>Converting your file</h3>
              <p className='text-sm text-muted-foreground mt-1'>
                This may take a moment...
              </p>
            </div>
            <Button variant='outline' onClick={resetState} className='mt-4'>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Complete state - Show success and download options */}
      {isComplete && (
        <div className='animate-enter-keyframes border rounded-lg p-6 shadow-sm'>
          <div className='flex flex-col items-center justify-center gap-4 py-8'>
            <PdfIcon />
            <div className='flex items-center gap-2'>
              <CheckIcon />
              <h3 className='text-lg font-medium'>
                File converted successfully!
              </h3>
            </div>
            <div className='flex gap-2 mt-4'>
              <Button variant='outline' onClick={handleConvertAnother}>
                Convert another
              </Button>
              <Button onClick={handleDownload}>Download file</Button>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className='animate-enter-keyframes border border-destructive rounded-lg p-6 shadow-sm'>
          <div className='flex flex-col items-center justify-center gap-4 py-8'>
            <div className='text-center'>
              <h3 className='text-lg font-medium text-destructive'>
                Conversion failed
              </h3>
              <p className='text-sm text-muted-foreground mt-1'>
                {statusQuery.data &&
                (statusQuery.data as unknown as JobStatusResponse).status ===
                  'failed'
                  ? (
                      statusQuery.data as unknown as JobStatusResponse & {
                        error: string;
                      }
                    ).error
                  : 'There was an error converting your file. Please try again.'}
              </p>
            </div>
            <Button onClick={resetState} className='mt-4'>
              Try again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
