import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Spinner with optional label.
 * Usage:
 *   <LoadingSpinner />
 *   <LoadingSpinner label="Loading complaints..." size="lg" />
 */
export default function LoadingSpinner({ label = '', size = 'md', className = '' }) {
  const sizeMap = { sm: 16, md: 24, lg: 36 };
  const px = sizeMap[size] || 24;

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-2 py-8', className)}>
      <Loader2 size={px} className="text-blue-500 animate-spin" />
      {label && (
        <p className="text-sm text-slate-400 font-medium">{label}</p>
      )}
    </div>
  );
}