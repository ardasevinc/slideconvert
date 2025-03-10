'use client';

import React from 'react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';
import { cn, formatBytes } from '@/lib/utils';
import { UploadIcon } from '@/components/icons';

interface FileUploadProps {
  onFilesAccepted: (files: File[]) => void;
  maxSize?: number;
  disabled?: boolean;
}

export function FileUploadComponent({
  onFilesAccepted,
  maxSize = 52428800, // 50MB
  disabled = false,
}: FileUploadProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        onFilesAccepted(acceptedFiles);
      }
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          if (file.size > maxSize) {
            toast.error(
              `"${file.name}" exceeds the ${formatBytes(maxSize)} limit`,
            );
          } else {
            toast.error(`"${file.name}" must be a .ppt or .pptx file`);
          }
        });
      }
    },
    [onFilesAccepted, maxSize],
  );

  return (
    <div className='w-full max-w-2xl'>
      <Dropzone
        onDrop={onDrop}
        accept={{
          'application/vnd.ms-powerpoint': ['.ppt'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            ['.pptx'],
        }}
        maxSize={maxSize}
        maxFiles={1}
        multiple={false}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group flex flex-col items-center justify-center h-52 w-full rounded-lg border-2 border-dashed px-5 py-6 text-center cursor-pointer transition',
              isDragActive
                ? 'border-primary bg-white/5'
                : isDragReject
                  ? 'border-destructive bg-destructive/5'
                  : 'border-muted-foreground/25 hover:bg-white/5',
              disabled && 'pointer-events-none opacity-60',
            )}
          >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center gap-4'>
              <div
                className={cn(
                  'rounded-full p-4 bg-white/5',
                  isDragReject ? 'bg-destructive/5' : '',
                )}
              >
                <UploadIcon />
              </div>
              <div className='flex flex-col gap-1'>
                <p className='font-medium'>
                  {isDragActive
                    ? isDragReject
                      ? 'Unsupported file type'
                      : 'Drop your file here'
                    : 'Drag and drop a PowerPoint file to convert to PDF'}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {isDragReject
                    ? 'Use .ppt or .pptx files only'
                    : 'or click to choose a file'}
                </p>
              </div>
              <p className='text-xs text-muted-foreground mt-2'>
                Supports .ppt, .pptx files up to {formatBytes(maxSize)}
              </p>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
