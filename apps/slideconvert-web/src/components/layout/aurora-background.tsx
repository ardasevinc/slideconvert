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
  const [isMobile, setIsMobile] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Detect mobile devices on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      // Check if device is mobile based on screen width and/or user agent
      const isMobileDevice =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      setIsMobile(isMobileDevice);
    };

    // Check initially
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Add touch event listeners to preemptively pause animation
  useEffect(() => {
    // Only set up touch listeners on mobile
    if (!isMobile) return;

    // Pause animation as soon as user touches the screen
    const handleTouchStart = () => {
      setIsTouching(true);
      controls.stop();
    };

    // Resume animation after touch ends (with delay)
    const handleTouchEnd = () => {
      setIsTouching(false);
      // Wait a bit longer before resuming animation
      setTimeout(() => {
        if (!isScrolling && !isTouching) {
          controls.start('animate');
        }
      }, 300);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, controls, isScrolling, isTouching]);

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

      // Only resume animation if not currently touching the screen
      if (!isTouching) {
        controls.start('animate');
      }
    }, 150);
  });

  // Effect to control animation based on scrolling state
  useEffect(() => {
    if (isScrolling || isTouching) {
      controls.stop(); // Pause animation during scroll or touch
    } else {
      controls.start('animate'); // Resume animation when not scrolling or touching
    }
  }, [isScrolling, isTouching, controls]);

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
                  // Throttle animation on mobile by increasing duration
                  duration: isMobile ? 120 : 60,
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
            ${isMobile ? 'filter blur-[5px]' : 'filter blur-[10px]'} invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:[background-position:inherit]
            ${isMobile ? 'after:opacity-80' : ''} after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] ${isMobile ? 'opacity-40' : 'opacity-50'}`,

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
