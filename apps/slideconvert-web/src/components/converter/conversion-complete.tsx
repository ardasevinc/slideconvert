import React from 'react';
import { Button } from '@/components/ui';
import { PdfIcon, CheckIcon } from '@/components/icons';

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
      <div className='flex flex-col items-center justify-center gap-6 p-8 border rounded-lg bg-white/5'>
        <div className='relative'>
          <div className='p-4 bg-white/5 rounded-lg'>
            <PdfIcon className='w-16 h-16' />
          </div>
          <div className='absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1'>
            <CheckIcon className='w-5 h-5 text-white' />
          </div>
        </div>
        <p className='text-xl font-medium'>File converted successfully!</p>
        <div className='flex gap-4 w-full'>
          <Button
            variant='outline'
            onClick={onConvertAnother}
            className='flex-1'
          >
            Convert another
          </Button>
          <Button asChild className='flex-1 bg-primary'>
            <a href={fileUrl} download='converted.pdf'>
              Download file
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
