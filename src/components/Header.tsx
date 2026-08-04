'use client';

import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Master } from '@/types/planner';
import { MasterSelectDropdown } from './MasterSelectDropdown';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedMasterId: string;
  onMasterChange: (id: string) => void;
  viewMode: 'day' | 'week';
  onViewModeChange: (mode: 'day' | 'week') => void;
  masters: Master[];
  onOpenQuickCall: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onDateChange,
  selectedMasterId,
  onMasterChange,
  viewMode,
  onViewModeChange,
  masters,
  onOpenQuickCall,
  onResetData,
}) => {
  const dateObj = new Date(selectedDate + 'T00:00:00');

  const formattedDate = dateObj.toLocaleDateString('uk-UA', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePrev = () => {
    const newDate = new Date(dateObj);
    newDate.setDate(newDate.getDate() - (viewMode === 'week' ? 7 : 1));
    onDateChange(formatDateToYYYYMMDD(newDate));
  };

  const handleNext = () => {
    const newDate = new Date(dateObj);
    newDate.setDate(newDate.getDate() + (viewMode === 'week' ? 7 : 1));
    onDateChange(formatDateToYYYYMMDD(newDate));
  };

  const handleToday = () => {
    onDateChange(formatDateToYYYYMMDD(new Date()));
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        {/* Top Row: Brand + Reset Action Button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-rose-300 bg-clip-text text-transparent">
                Bagira Planner
              </h1>
              <p className="text-xs text-slate-400 font-medium">Планувальник сеансів салону</p>
            </div>
          </div>

          <button
            onClick={onResetData}
            className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
            title="Скинути дані до початкових"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Controls (Date Bar) */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handlePrev}
            className="h-12 w-12 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition active:scale-95 shrink-0"
            title="Попередній період"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleToday}
            className="flex-1 h-12 bg-slate-800 border border-slate-700 rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-700 transition active:scale-98 flex items-center justify-center gap-2 px-3"
          >
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] uppercase font-extrabold border border-rose-500/30">
              Сьогодні
            </span>
            <span>{formattedDate}</span>
          </button>

          <button
            onClick={handleNext}
            className="h-12 w-12 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition active:scale-95 shrink-0"
            title="Наступний період"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* View Controls: Custom Master Dropdown + Day/Week Selector */}
        <div className="flex items-center gap-2.5">
          <MasterSelectDropdown
            selectedMasterId={selectedMasterId}
            onMasterChange={onMasterChange}
            masters={masters}
          />

          <div className="flex bg-slate-800 rounded-xl border border-slate-700/80 p-1 h-12 shrink-0">
            {['day', 'week'].map((m) => (
              <button
                key={m}
                onClick={() => onViewModeChange(m as 'day' | 'week')}
                className={`px-4 sm:px-6 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  viewMode === m
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m === 'day' ? 'День' : 'Тиждень'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
