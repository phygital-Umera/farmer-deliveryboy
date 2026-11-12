import React from 'react';

interface GenericButtonProps {
  type?: 'button' | 'submit';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'cancel' | 'orange' | 'navy' | 'back';
  fullWidth?: boolean; // Add fullWidth prop
  size?: 'sm' | 'md' | 'lg'; // Add size prop
}

const GenericButton: React.FC<GenericButtonProps> = ({
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  children,
  label,
  variant = 'primary',
  fullWidth = false,
  size = 'md',
}) => {
  // Size variants
  const sizeStyles = {
    sm: 'text-xs px-2 py-1 sm:px-2.5 sm:py-1.5',
    md: 'text-xs px-2.5 py-1.5 sm:px-3 sm:py-2',
    lg: 'text-sm px-4 py-2 sm:px-5 sm:py-2.5',
  };

  // Base styles with responsive design
  const baseStyles = `
    rounded 
    flex 
    flex-row 
    items-center 
    justify-center 
    font-medium 
    transition 
    duration-300 
    ease-in-out 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-1 
    disabled:cursor-not-allowed 
    disabled:opacity-50 
    whitespace-nowrap 
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${sizeStyles[size] || sizeStyles.md}
  `;

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
    cancel: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
    orange: 'bg-orange-500 text-white hover:bg-orange-500/90 focus:ring-orange-500',
    navy: 'bg-primary-navy text-white hover:bg-primary-navy/90 focus:ring-primary-navy/50',
    back: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 border border-gray-200',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default GenericButton;