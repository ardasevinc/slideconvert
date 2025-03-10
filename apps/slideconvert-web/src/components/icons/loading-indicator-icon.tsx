import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  className?: string;
}

const LoadingIndicatorIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={cn('animate-spin', className)}
  >
    <path
      d='M12 2.25V4.75M12 18.25V22.25M4.75 12H2.25M22.25 12H18.25M19.07 5.43L17.31 7.19M6.69 17.81L4.93 19.57M19.07 19.57L17.31 17.81M6.69 7.19L4.93 5.43'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export { LoadingIndicatorIcon };
