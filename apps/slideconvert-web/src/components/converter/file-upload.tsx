'use client';

import React, { useState } from 'react';
import Dropzone, { type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';
import { cn, formatBytes } from '@/lib/utils';
import { UploadIcon } from '@/components/icons';
import { Button } from '@/components/ui';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
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
        disabled={disabled || !!selectedFile}
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
              selectedFile && 'pointer-events-none',
            )}
          >
            <input {...getInputProps()} />

            {!selectedFile ? (
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
                    {isDragReject ? 'Use .ppt or .pptx files only' : 'or'}
                  </p>
                </div>
                <Button variant='outline' className='mt-2'>
                  Choose file
                </Button>
                <p className='text-xs text-muted-foreground mt-2'>
                  Supports .ppt, .pptx files up to {formatBytes(maxSize)}
                </p>
              </div>
            ) : (
              <div className='w-full'>
                <div className='bg-white/5 rounded-lg p-4 mb-4'>
                  <div className='flex items-center justify-between'>
                    <div className='text-lg font-medium'>
                      {selectedFile.name}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      {formatBytes(selectedFile.size)}
                    </div>
                  </div>
                </div>
                <div className='flex justify-between gap-4'>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className='flex-1'
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilesAccepted([selectedFile]);
                    }}
                    className='flex-1'
                  >
                    Convert
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}
