import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const CollapsibleHeader = ({ title, children, className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsCollapsed(position > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-10 transition-all duration-300',
        isCollapsed ? 'h-16' : 'h-32',
        className
      )}
    >
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50 
                    absolute inset-0 transition-opacity duration-300"
           style={{ opacity: Math.min(1, scrollPosition / 50) }}
      />
      <div className="relative h-full px-4 max-w-2xl mx-auto 
                    flex flex-col justify-center items-center">
        {children}
        <h1 className={cn(
          'font-bold transition-all duration-300',
          isCollapsed ? 'text-lg' : 'text-2xl'
        )}>
          {title}
        </h1>
      </div>
    </div>
  );
};

export default CollapsibleHeader;