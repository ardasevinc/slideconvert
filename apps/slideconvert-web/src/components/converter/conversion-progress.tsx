import React from 'react';
import { Button } from '@/components/ui';
import { LoadingIndicatorIcon } from '@/components/icons';
import { formatBytes } from '@/lib/utils';

interface ConversionProgressProps {
  onCancel: () => void;
  filename: string;
  filesize: number;
  isUploading?: boolean;
}

export function ConversionProgressComponent({
  onCancel,
  filename,
  filesize,
  isUploading = false,
}: ConversionProgressProps) {
  return (
    <div className='w-full max-w-2xl'>
      <div className='flex flex-col gap-6 rounded-lg border border-muted-foreground/20 p-8'>
        {/* File card */}
        <div className='w-full rounded-lg p-4 flex items-center justify-between border border-muted-foreground/20 bg-white/[0.02]'>
          <div className='flex items-center gap-3'>
            <div className='flex-shrink-0 w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center'>
              <span className='text-xs font-medium'>.ppt</span>
            </div>
            <div className='text-left'>
              <h3 className='text-sm font-medium'>{filename}</h3>
              <p className='text-xs text-muted-foreground'>
                {formatBytes(filesize)}
              </p>
            </div>
          </div>
        </div>

        {/* Conversion status */}
        <div className='flex flex-col items-center gap-4'>
          <div className='rounded-full bg-primary/10 p-2'>
            <LoadingIndicatorIcon className='w-6 h-6' />
          </div>
          <span className='font-medium'>
            {isUploading ? 'Uploading your file...' : 'Converting your file...'}
          </span>
        </div>

        {/* Action button */}
        <Button
          variant='outline'
          onClick={onCancel}
          className='min-w-32 mx-auto'
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
