import React from 'react';
import { Button } from '@/components/ui';
import { CheckIcon } from '@/components/icons';

interface ConversionCompleteProps {
  fileUrl: string;
  onConvertAnother: () => void;
}

export function ConversionCompleteComponent({
  fileUrl,
  onConvertAnother,
}: ConversionCompleteProps) {
  return (
    <div className='w-full max-w-2xl'>
      <div className='flex flex-col gap-8 rounded-lg border border-muted-foreground/20 p-8'>
        {/* File card */}
        <div className='w-full rounded-lg flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='relative flex-shrink-0'>
              {/* PDF icon matching the design */}
              <div className='w-14 h-14 bg-red-600 rounded flex items-center justify-center'>
                <span className='text-base font-bold text-white'>PDF</span>
                <div className='absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1'>
                  <CheckIcon className='w-3 h-3 text-white' />
                </div>
              </div>
            </div>
            <div className='text-left'>
              <h3 className='text-sm font-medium'>
                File converted successfully!
              </h3>
            </div>
          </div>
        </div>

        <div className='flex gap-4 justify-center'>
          <Button
            variant='outline'
            onClick={onConvertAnother}
            className='min-w-32'
          >
            Convert another
          </Button>
          <Button
            onClick={() => window.open(fileUrl, '_blank')}
            className='min-w-32'
          >
            Download file
          </Button>
        </div>
      </div>
    </div>
  );
}
