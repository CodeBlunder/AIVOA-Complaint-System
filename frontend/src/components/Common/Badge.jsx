import React from 'react';
import { getSeverityClasses, getStatusClasses } from '../../utils/helpers';
import { clsx } from 'clsx';

/**
 * Badge component for Severity (Critical/Major/Minor) and Status labels.
 * Usage:
 *   <Badge type="severity" value="Critical" />
 *   <Badge type="status" value="Open" />
 *   <Badge type="category" value="Quality" />
 */
export default function Badge({ type = 'severity', value, className = '' }) {
  if (!value) return null;

  const baseClasses = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';

  const classes = type === 'severity'
    ? getSeverityClasses(value)
    : type === 'status'
    ? getStatusClasses(value)
    : 'bg-slate-100 text-slate-600 border border-slate-200';

  return (
    <span className={clsx(baseClasses, classes, className)}>
      {value}
    </span>
  );
}