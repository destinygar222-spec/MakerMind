import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  // Scrappy Base Styles: Thick border, uppercase font, bold
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all border-4 border-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";
  
  const variants = {
    // Primary: Hot Pink with hard shadow
    primary: "bg-rosa-500 text-white shadow-scrappy hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-scrappy-sm",
    // Secondary: Deep Marigold with hard shadow
    secondary: "bg-sol-500 text-black shadow-scrappy hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-scrappy-sm",
    // Outline: White with black border and shadow
    outline: "bg-white text-black shadow-scrappy hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-scrappy-sm hover:bg-azul-100",
    // Ghost: Just text, but bold hover
    ghost: "border-transparent hover:bg-white/50 text-black hover:border-black"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2",
    md: "px-8 py-4 text-sm",
    lg: "px-10 py-5 text-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};