import React from 'react';
import Image from 'next/image';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <div className={`relative ${className}`}>
    <Image 
      src="/excelsior-creative-logo-white.svg" 
      alt="Excelsior Creative Logo" 
      width={522} 
      height={158}
      className="h-full w-auto object-contain"
      priority
    />
  </div>
);
