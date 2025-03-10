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
    [maxSize],
  );

  return (
    <div className='w-full max-w-2xl'>
      {!selectedFile ? (
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
                'group flex flex-col items-center justify-center h-56 w-full rounded-lg border-2 border-dashed px-8 py-10 text-center cursor-pointer transition',
                isDragActive
                  ? 'border-primary bg-white/5'
                  : isDragReject
                    ? 'border-destructive bg-destructive/5'
                    : 'border-muted-foreground/25 hover:bg-white/5',
                disabled && 'pointer-events-none opacity-60',
              )}
            >
              <input {...getInputProps()} />

              <div className='flex flex-col items-center gap-6'>
                <div
                  className={cn(
                    'rounded-full p-4 bg-white/5',
                    isDragReject ? 'bg-destructive/5' : '',
                  )}
                >
                  <UploadIcon />
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='font-medium'>
                    {isDragActive
                      ? isDragReject
                        ? 'Unsupported file type'
                        : 'Drop your file here'
                      : 'Drag and drop a PowerPoint file to convert to PDF'}
                  </p>
                  <p className='text-sm text-muted-foreground text-center'>
                    {isDragReject ? 'Use .ppt or .pptx files only' : 'or'}
                  </p>
                </div>
                <Button variant='outline' className='mt-1'>
                  Choose file
                </Button>
                <p className='text-xs text-muted-foreground'>
                  Supports .ppt, .pptx files up to {formatBytes(maxSize)}
                </p>
              </div>
            </div>
          )}
        </Dropzone>
      ) : (
        <div className='w-full p-6 bg-white/[0.01] rounded-lg border border-muted-foreground/10'>
          {/* File info card */}
          <div className='w-full border border-gray-200/20 rounded-lg p-6 text-center mb-3 bg-white/[0.02]'>
            <h3 className='text-base font-medium'>{selectedFile.name}</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              {formatBytes(selectedFile.size)}
            </p>
          </div>

          {/* Convert option card */}
          <div
            className='w-full border border-blue-500/30 rounded-lg bg-blue-500/[0.03] p-4 mb-4 cursor-pointer hover:bg-blue-500/[0.05] transition-colors'
            onClick={() => onFilesAccepted([selectedFile])}
          >
            <div className='flex items-center gap-3'>
              <div className='flex-shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center w-6 h-6'>
                <div className='w-3 h-3 rounded-full bg-blue-500'></div>
              </div>
              <div>
                <p className='text-base font-medium'>Convert to PDF</p>
                <p className='text-sm text-muted-foreground'>
                  Best quality, retains images and other assets.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className='flex gap-3'>
            <Button
              variant='outline'
              onClick={() => setSelectedFile(null)}
              className='flex-1 font-normal border-gray-200/20'
            >
              Cancel
            </Button>
            <Button
              onClick={() => onFilesAccepted([selectedFile])}
              className='flex-1 bg-blue-600 hover:bg-blue-700 font-medium'
            >
              Convert
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
