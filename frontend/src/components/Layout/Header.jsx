import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Search, Wifi } from 'lucide-react';

// Maps route paths to human-readable page titles
const PAGE_TITLES = {
  '/dashboard':      { title: 'Dashboard', sub: 'Overview of complaint activity' },
  '/complaints/new': { title: 'Log Complaint', sub: 'AI-assisted complaint entry' },
  '/complaints':     { title: 'All Complaints', sub: 'Search and manage complaint records' },
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const complaints = useSelector(s => s.complaints.items);

  // Resolve page title – fallback for /complaints/:id routes
  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: 'Complaint Detail',
    sub: 'View and edit complaint record',
  };

  // Count open complaints for the badge
  const openCount = complaints.filter(c => c.status === 'Open').length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-base font-semibold text-slate-900 leading-none">
          {pageInfo.title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{pageInfo.sub}</p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* API Status indicator */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <Wifi size={11} />
          <span className="font-medium">API Connected</span>
        </div>

        {/* Notification bell with open complaint count */}
        {openCount > 0 && (
          <button
            onClick={() => navigate('/complaints')}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title={`${openCount} open complaints`}
          >
            <Bell size={18} className="text-slate-500" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {openCount > 9 ? '9+' : openCount}
            </span>
          </button>
        )}

        {/* Quick new complaint button */}
        <button
          onClick={() => navigate('/complaints/new')}
          className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Complaint
        </button>
      </div>
    </header>
  );
}