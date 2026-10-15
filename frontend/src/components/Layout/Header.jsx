import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Wifi, LogOut, User, Sun, Moon } from 'lucide-react';
import useTheme from '../../utils/useTheme';

const PAGE_TITLES = {
  '/dashboard':      { title: 'Dashboard',      sub: 'Overview of complaint activity' },
  '/complaints/new': { title: 'Log Complaint',  sub: 'AI-assisted complaint entry' },
  '/complaints':     { title: 'All Complaints', sub: 'Search and manage complaint records' },
};

export default function Header() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const complaints = useSelector(s => s.complaints.items);
  const { theme, toggleTheme } = useTheme();

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: 'Complaint Detail',
    sub: 'View and edit complaint record',
  };

  const openCount = complaints.filter(c => c.status === 'Open').length;
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

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
        {/* API status */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <Wifi size={11} />
          <span className="font-medium">API Connected</span>
        </div>

        {/* Dark/Light toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Open complaints bell */}
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

        {/* New complaint */}
        <button
          onClick={() => navigate('/complaints/new')}
          className="text-xs font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Complaint
        </button>

        {/* User + logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={13} className="text-blue-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-700 leading-none">
                {user.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 capitalize">
                {user.role?.replace('_', ' ') || 'QA Officer'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors ml-1"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
