import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  ...props 
}) => {
  const baseStyles = "rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary-navy text-pure-white hover:bg-primary-navy shadow-lg shadow-blue-200",
    secondary: "bg-text-charcoal text-pure-white hover:bg-text-charcoal shadow-lg shadow-bg-light-mint",
    outline: "bg-transparent border-2 border-bg-light-mint text-text-charcoal hover:border-primary-navy hover:text-primary-navy",
    ghost: "bg-transparent text-text-charcoal hover:bg-bg-light-mint",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export default Button;
