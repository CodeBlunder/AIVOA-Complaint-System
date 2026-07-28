import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FilePlus,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & metrics',
  },
  {
    label: 'Log Complaint',
    to: '/complaints/new',
    icon: FilePlus,
    description: 'Create new complaint',
  },
  {
    label: 'All Complaints',
    to: '/complaints',
    icon: ClipboardList,
    description: 'View & manage records',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">AIVOA</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">QMS · Complaint Module</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>

        {NAV_ITEMS.map(({ label, to, icon: Icon, description }) => {
          const isActive = location.pathname === to ||
            (to === '/complaints' && location.pathname.startsWith('/complaints/') && location.pathname !== '/complaints/new');

          return (
            <NavLink
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-all duration-150',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon
                size={18}
                className={clsx(
                  'shrink-0',
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">{label}</p>
                <p className={clsx(
                  'text-[11px] mt-0.5 leading-none truncate',
                  isActive ? 'text-blue-500' : 'text-slate-400'
                )}>
                  {description}
                </p>
              </div>
              {isActive && (
                <ChevronRight size={14} className="text-blue-400 shrink-0" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Powered by LangGraph · Groq<br />
          <span className="text-slate-300">llama-3.3-70b-versatile · FastAPI</span>
        </p>
      </div>
    </aside>
  );
}