'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface MiniCalendarPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export const MiniCalendarPopover: React.FC<MiniCalendarPopoverProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view date
  const [viewDate, setViewDate] = useState<Date>(() => {
    return selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  });

  useEffect(() => {
    if (selectedDate && isOpen) {
      setViewDate(new Date(selectedDate + 'T00:00:00'));
    }
  }, [selectedDate, isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const yearStr = today.getFullYear();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${yearStr}-${monthStr}-${dayStr}`;
    onSelectDate(todayFormatted);
    onClose();
  };

  // Generate days matrix
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Ukrainian week starts on Monday (1). Sunday is 0 -> 6
  let startingDayOfWeek = firstDayOfMonth.getDay();
  startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  const totalDaysInMonth = lastDayOfMonth.getDate();

  const days: Array<{
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }> = [];

  // Helper date formatters
  const formatDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const checkIsToday = (d: Date): boolean => {
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDate(prevDate);
    days.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
      isToday: checkIsToday(prevDate),
      isSelected: dateStr === selectedDate,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const currDate = new Date(year, month, d);
    const dateStr = formatDate(currDate);
    days.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: checkIsToday(currDate),
      isSelected: dateStr === selectedDate,
    });
  }

  // Next month leading days to complete grid (42 cells = 6 rows)
  const remainingCells = 42 - days.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextDate = new Date(year, month + 1, d);
    const dateStr = formatDate(nextDate);
    days.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
      isToday: checkIsToday(nextDate),
      isSelected: dateStr === selectedDate,
    });
  }

  const monthName = viewDate.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });

  return (
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-80 sm:w-84 bg-slate-900/95 border border-slate-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-slate-100"
    >
      {/* Mini Calendar Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition active:scale-95"
          title="Попередній місяць"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="font-bold text-sm capitalize text-slate-100 flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-rose-400" />
          {monthName}
        </span>

        <button
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition active:scale-95"
          title="Наступний місяць"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center mb-2">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            {w}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((item, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDate(item.dateStr);
              onClose();
            }}
            className={`h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative ${
              item.isSelected
                ? 'bg-gradient-to-tr from-rose-600 to-violet-600 text-white shadow-lg shadow-rose-500/25 scale-105 z-10'
                : item.isToday
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : item.isCurrentMonth
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-slate-800/50'
            }`}
          >
            {item.dayNum}
          </button>
        ))}
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
        <button
          onClick={handleToday}
          className="text-xs font-bold text-rose-400 hover:text-rose-300 transition py-1 px-2.5 rounded-lg hover:bg-rose-500/10"
        >
          Сьогодні
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 transition py-1 px-2.5 rounded-lg hover:bg-slate-800"
        >
          Закрити
        </button>
      </div>
    </div>
  );
};
