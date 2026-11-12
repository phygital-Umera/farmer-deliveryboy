import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'outline';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className }) => {
  const variants = {
    primary: "bg-bg-light-mint text-primary-navy",
    secondary: "bg-bg-light-mint text-text-charcoal",
    success: "bg-green-50 text-accent-teal",
    outline: "bg-transparent border border-bg-light-mint text-text-charcoal",
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
