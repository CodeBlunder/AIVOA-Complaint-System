import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, truncate, timeAgo } from '../../utils/helpers';
import Badge from '../Common/Badge';
import { ArrowRight, Package, Calendar, User } from 'lucide-react';

/**
 * Single complaint summary card used in the list view.
 * Clicking it navigates to the detail/edit page.
 */
export default function ComplaintCard({ complaint }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/complaints/${complaint.id}`)}
      className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer
                 hover:border-blue-300 hover:shadow-md transition-all duration-150 group"
    >
      {/* Top row: complaint number + badges */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-mono text-slate-400">{complaint.complaint_number}</span>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge type="severity" value={complaint.severity} />
            <Badge type="status" value={complaint.status} />
            {complaint.regulatory_reportable && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                REG. REPORT
              </span>
            )}
          </div>
        </div>
        <ArrowRight
          size={16}
          className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1"
        />
      </div>

      {/* Product info */}
      <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium mb-1">
        <Package size={13} className="text-slate-400 shrink-0" />
        {complaint.product_name || 'Unnamed Product'}
      </div>

      {/* Description preview */}
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        {truncate(complaint.description, 100)}
      </p>

      {/* Footer meta */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <User size={11} />
          <span>{complaint.complainant_name || 'Unknown'}</span>
          {complaint.complainant_company && (
            <span className="text-slate-300">· {complaint.complainant_company}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={11} />
          <span>{timeAgo(complaint.created_at)}</span>
        </div>
      </div>

      {/* Batch number */}
      {complaint.batch_number && (
        <div className="mt-2 text-[10px] font-mono text-slate-400">
          Batch: {complaint.batch_number}
        </div>
      )}
    </div>
  );
}