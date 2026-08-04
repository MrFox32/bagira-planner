'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Master } from '@/types/planner';
import { ChevronDown, Check, Users } from 'lucide-react';

interface MasterSelectDropdownProps {
  selectedMasterId: string;
  onMasterChange: (id: string) => void;
  masters: Master[];
}

export const MasterSelectDropdown: React.FC<MasterSelectDropdownProps> = ({
  selectedMasterId,
  onMasterChange,
  masters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedMaster = masters.find((m) => m.id === selectedMasterId);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-3.5 sm:px-4 bg-slate-800/90 hover:bg-slate-800 text-slate-100 rounded-xl border transition-all flex items-center justify-between gap-2 shadow-sm active:scale-[0.98] ${
          isOpen
            ? 'border-rose-500 ring-2 ring-rose-500/30'
            : 'border-slate-700/80 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedMaster ? (
            <>
              <img
                src={selectedMaster.avatar}
                alt={selectedMaster.name}
                className="w-7 h-7 rounded-full object-cover border-2 shrink-0"
                style={{ borderColor: selectedMaster.color }}
              />
              <span className="font-bold text-xs sm:text-sm text-white truncate">
                {selectedMaster.name}
              </span>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300 shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-white truncate">
                Усі майстри
              </span>
            </>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-rose-400' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-14 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {/* Option: All Masters */}
          <div
            onClick={() => {
              onMasterChange('all');
              setIsOpen(false);
            }}
            className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between ${
              selectedMasterId === 'all'
                ? 'bg-rose-500/15 text-white font-bold border border-rose-500/30'
                : 'hover:bg-slate-800/80 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center text-violet-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">Усі майстри</span>
                <span className="text-[10px] text-slate-400 block">Повний графік салону</span>
              </div>
            </div>
            {selectedMasterId === 'all' && (
              <Check className="w-4 h-4 text-rose-400 stroke-[3]" />
            )}
          </div>

          {/* Master Options */}
          {masters.map((m) => {
            const isSelected = selectedMasterId === m.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  onMasterChange(m.id);
                  setIsOpen(false);
                }}
                className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-500/15 text-white font-bold border border-rose-500/30'
                    : 'hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-7 h-7 rounded-full object-cover border-2 shrink-0"
                    style={{ borderColor: m.color }}
                  />
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-bold text-slate-100 block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">{m.role}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-rose-400 stroke-[3] shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
