'use client';

import React from 'react';
import { Calendar, Settings, X, Scissors, Users, Sparkles, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentView: 'calendar' | 'settings';
  onViewChange: (view: 'calendar' | 'settings') => void;
  isOpen: boolean;
  onClose: () => void;
  totalServicesCount?: number;
  totalMastersCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen,
  onClose,
  totalServicesCount = 0,
  totalMastersCount = 0,
}) => {
  const handleNavClick = (view: 'calendar' | 'settings') => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-white tracking-wide">
                  Bagira Planner
                </h1>
                <p className="text-[11px] text-rose-300 font-medium">Beauty Salon Admin</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider mb-2">
              Навігація
            </p>

            <button
              onClick={() => handleNavClick('calendar')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                currentView === 'calendar'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 shrink-0" />
                <span>Планувальник</span>
              </div>
              {currentView === 'calendar' && <ChevronRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                currentView === 'settings'
                  ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 shrink-0" />
                <span>Налаштування</span>
              </div>
              {currentView === 'settings' && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Footer Quick Info */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 m-4 rounded-2xl space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Статистика каталогу
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-rose-400" />
              Послуг:
            </span>
            <span className="font-extrabold text-white">{totalServicesCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              Майстрів:
            </span>
            <span className="font-extrabold text-white">{totalMastersCount}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
