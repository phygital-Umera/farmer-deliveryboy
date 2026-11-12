import React from 'react';

interface GenericButtonProps {
  type?: 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const GenericResetButton: React.FC<GenericButtonProps> = ({
  type = 'reset',
  onClick,
  className = '',
  disabled = false,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`hover:bg-bg-light-mint mx-1 rounded border border-text-charcoal/30 bg-transparent px-8 py-2 text-text-charcoal font-medium transition-all duration-200 ease-in-out hover:border-text-charcoal disabled:cursor-not-allowed disabled:opacity-50 dark:border-bodydark dark:text-bodydark dark:hover:border-pure-white/50 ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default GenericResetButton;
