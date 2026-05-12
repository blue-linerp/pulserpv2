'use client';

import { motion } from 'framer-motion';

export function AnimatedPage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className={className}>
      {children}
    </motion.main>
  );
}
