import React from 'react';
import { Button } from '@/components/ui';
import { LoadingIndicatorIcon } from '@/components/icons';
import { formatBytes } from '@/lib/utils';

interface ConversionProgressProps {
  onCancel: () => void;
  filename: string;
  filesize: number;
}

export function ConversionProgressComponent({
  onCancel,
  filename,
  filesize,
}: ConversionProgressProps) {
  return (
    <div className='w-full max-w-2xl'>
      <div className='flex flex-col items-center justify-center gap-6 p-8 border rounded-lg bg-white/5'>
        <div className='w-full'>
          <div className='bg-white/5 rounded-lg p-4 mb-6'>
            <div className='flex items-center justify-between'>
              <div className='text-lg font-medium'>{filename}</div>
              <div className='text-sm text-muted-foreground'>
                {formatBytes(filesize)}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-3 mb-6'>
            <div className='rounded-full bg-primary/10 p-2'>
              <LoadingIndicatorIcon />
            </div>
            <span className='font-medium'>Converting your file</span>
          </div>

          <div className='flex justify-between'>
            <Button variant='outline' onClick={onCancel} className='w-full'>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
