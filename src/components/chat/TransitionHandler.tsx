import React from 'react';

interface TransitionHandlerProps {
  children: React.ReactNode;
  isAnimating: boolean;
}

export function TransitionHandler({ children, isAnimating }: TransitionHandlerProps) {
  return (
    <div className={`transition-all duration-300 ease-out ${
      isAnimating 
        ? 'opacity-0 transform scale-95' 
        : 'opacity-100 transform scale-100'
    }`}>
      {children}
    </div>
  );
}