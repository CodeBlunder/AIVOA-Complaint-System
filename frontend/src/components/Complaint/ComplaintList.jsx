import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints } from '../../store/slices/complaintSlice';
import ComplaintCard from './ComplaintCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';


export default function ComplaintList() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.complaints);

  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');


  useEffect(() => {
    dispatch(fetchComplaints());
  }, [dispatch]);


  const filtered = items.filter(c => {
    const matchSearch =
      !search ||
      c.complaint_number?.toLowerCase().includes(search.toLowerCase()) ||
      c.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.complainant_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.batch_number?.toLowerCase().includes(search.toLowerCase());

    const matchSeverity = !filterSeverity || c.severity === filterSeverity;
    const matchStatus   = !filterStatus   || c.status === filterStatus;

    return matchSearch && matchSeverity && matchStatus;
  });

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by number, product, batch, customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Severity filter */}
        <select
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="Major">Major</option>
          <option value="Minor">Minor</option>
        </select>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Pending CAPA">Pending CAPA</option>
          <option value="Closed">Closed</option>
        </select>

        <span className="text-xs text-slate-400 ml-auto">
          {filtered.length} of {items.length} records
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner label="Loading complaints..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <SlidersHorizontal size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No complaints found</p>
          <p className="text-xs mt-1">Try adjusting your filters or log a new complaint</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
