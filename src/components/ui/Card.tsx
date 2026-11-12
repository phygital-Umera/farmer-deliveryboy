import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const Card: React.FC<CardProps> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`bg-pure-white rounded-[32px] border border-bg-light-mint shadow-sm hover:shadow-2xl hover:shadow-bg-light-mint transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;
