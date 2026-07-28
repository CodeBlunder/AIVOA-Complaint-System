import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchComplaints } from '../store/slices/complaintSlice';
import Badge from '../components/Common/Badge';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { formatDate, truncate } from '../utils/helpers';
import {
  ClipboardList, AlertTriangle, CheckCircle,
  Clock, TrendingUp, FilePlus, ArrowRight
} from 'lucide-react';

/**
 * Dashboard page – shows KPI cards and a recent complaints preview.
 */
export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(s => s.complaints);

  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);

  // Compute KPIs
  const total      = items.length;
  const open       = items.filter(c => c.status === 'Open').length;
  const critical   = items.filter(c => c.severity === 'Critical').length;
  const closed     = items.filter(c => c.status === 'Closed').length;
  const regReport  = items.filter(c => c.regulatory_reportable).length;

  const recent = [...items]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const KPI_CARDS = [
    { label: 'Total Complaints', value: total,    icon: ClipboardList, color: 'blue' },
    { label: 'Open',             value: open,     icon: Clock,          color: 'orange' },
    { label: 'Critical',         value: critical, icon: AlertTriangle,  color: 'red' },
    { label: 'Closed',           value: closed,   icon: CheckCircle,    color: 'green' },
  ];

  const colorMap = {
    blue:   'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    red:    'bg-red-50 text-red-600',
    green:  'bg-green-50 text-green-600',
  };

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                <Icon size={15} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Regulatory reportable alert */}
      {regReport > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              {regReport} complaint{regReport > 1 ? 's' : ''} require regulatory reporting
            </p>
            <p className="text-xs text-red-500">Review and submit to FDA/EMA as required by 21 CFR Part 211.198</p>
          </div>
          <button
            onClick={() => navigate('/complaints')}
            className="ml-auto text-xs font-medium text-red-700 hover:underline whitespace-nowrap"
          >
            View all →
          </button>
        </div>
      )}

      {/* Recent complaints table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            Recent Complaints
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/complaints/new')}
              className="flex items-center gap-1.5 text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              <FilePlus size={13} /> Log New
            </button>
            <button
              onClick={() => navigate('/complaints')}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading..." />
        ) : recent.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No complaints yet. Log your first one!
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="px-5 py-2.5 text-left font-medium">Number</th>
                <th className="px-5 py-2.5 text-left font-medium">Product</th>
                <th className="px-5 py-2.5 text-left font-medium">Customer</th>
                <th className="px-5 py-2.5 text-left font-medium">Severity</th>
                <th className="px-5 py-2.5 text-left font-medium">Status</th>
                <th className="px-5 py-2.5 text-left font-medium">Date</th>
                <th className="px-5 py-2.5 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent.map(c => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/complaints/${c.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">{c.complaint_number}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{truncate(c.product_name, 30)}</td>
                  <td className="px-5 py-3 text-slate-500">{c.complainant_name || '—'}</td>
                  <td className="px-5 py-3"><Badge type="severity" value={c.severity} /></td>
                  <td className="px-5 py-3"><Badge type="status" value={c.status} /></td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{formatDate(c.created_at)}</td>
                  <td className="px-5 py-3">
                    <ArrowRight size={14} className="text-slate-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}