'use client';
import { cn } from '@/lib/utils';
import React, { ReactNode, useEffect, useState, useRef } from 'react';
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Handle scroll events to pause animation
  useMotionValueEvent(scrollY, 'change', () => {
    // Set scrolling state to true
    setIsScrolling(true);

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a timeout to mark scrolling as finished after 150ms of no scroll events
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  });

  // Effect to control animation based on scrolling state
  useEffect(() => {
    if (isScrolling) {
      controls.stop(); // Pause animation during scroll
    } else {
      controls.start('animate'); // Resume animation when not scrolling
    }
  }, [isScrolling, controls]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className='min-h-screen w-full'>
      <div
        className={cn(
          'relative flex flex-col min-h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg',
          className,
        )}
        {...props}
      >
        <div className='absolute inset-0 overflow-hidden'>
          <motion.div
            initial='initial'
            animate={controls}
            variants={{
              initial: { backgroundPosition: '50% 50%, 50% 50%' },
              animate: {
                backgroundPosition: '350% 50%, 350% 50%',
                transition: {
                  duration: 60,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'loop',
                },
              },
            }}
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:[background-position:inherit]
            after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_40%,var(--transparent)_70%)]`,
            )}
          ></motion.div>
        </div>
        <div className='relative z-10 w-full'>{children}</div>
      </div>
    </main>
  );
};
