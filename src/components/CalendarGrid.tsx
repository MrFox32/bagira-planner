'use client';

import React, { useState, useEffect } from 'react';
import { Master, Appointment } from '@/types/planner';
import { CheckCircle2, Clock, User, Sparkles } from 'lucide-react';

interface CalendarGridProps {
  selectedDate: string;
  selectedMasterId: string;
  viewMode: 'day' | 'week';
  masters: Master[];
  appointments: Appointment[];
  onSelectSlot: (masterId: string, timeStr: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  selectedMasterId,
  viewMode,
  masters,
  appointments,
  onSelectSlot,
  onSelectAppointment,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [selectedDate, selectedMasterId, viewMode]);

  const d = new Date();
  const todayLocalStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const isToday = selectedDate === todayLocalStr;

  // Active masters to render in columns
  const visibleMasters = selectedMasterId === 'all'
    ? masters.filter((m) => m.isActive)
    : masters.filter((m) => m.id === selectedMasterId && m.isActive);

  // Helper to compute top offset & height in percentages/pixels
  const getAppointmentPosition = (startTimeStr: string, endTimeStr: string) => {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);

    const startMin = start.getHours() * 60 + start.getMinutes();
    const endMin = end.getHours() * 60 + end.getMinutes();

    const dayStartMin = 8 * 60; // 08:00 AM
    const totalDayMin = 13 * 60; // 13 hours (08:00 to 21:00)

    const topPercent = Math.max(0, ((startMin - dayStartMin) / totalDayMin) * 100);
    const heightPercent = Math.max(3, ((endMin - startMin) / totalDayMin) * 100);

    return { top: `${topPercent}%`, height: `${heightPercent}%` };
  };

  // Compute current time position line
  const getCurrentTimePosition = () => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const dayStartMin = 8 * 60;
    const totalDayMin = 13 * 60;

    if (nowMin < dayStartMin || nowMin > dayStartMin + totalDayMin) return null;
    const topPercent = ((nowMin - dayStartMin) / totalDayMin) * 100;
    return `${topPercent}%`;
  };

  const currentTimeTop = (mounted && isToday) ? getCurrentTimePosition() : null;

  // For Week View: Generate 7 days starting from selectedDate (or start of week)
  const getWeekDays = () => {
    const start = new Date(selectedDate + 'T00:00:00');
    const dayOfWeek = start.getDay(); // 0 is Sun, 1 is Mon
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const mon = new Date(start);
    mon.setDate(mon.getDate() + diffToMon);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(d.getDate() + i);
      days.push({
        dateStr: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('uk-UA', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('uk-UA', { month: 'short' }),
      });
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto overflow-x-hidden relative no-scrollbar w-full max-w-full">
      <div className="w-full max-w-full">
        {/* DAY VIEW LAYOUT */}
        {viewMode === 'day' && (
          <div className="w-full max-w-full">
            {/* Header Columns: Masters */}
            <div className="flex border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-20 shadow-sm w-full">
              <div className="w-12 sm:w-16 shrink-0 py-3 text-center text-[10px] sm:text-xs font-semibold text-slate-500 border-r border-slate-800">
                Час
              </div>
              <div
                className="flex-1 grid divide-x divide-slate-800"
                style={{ gridTemplateColumns: `repeat(${visibleMasters.length}, minmax(0, 1fr))` }}
              >
                {visibleMasters.map((m) => (
                  <div key={m.id} className="p-1.5 sm:p-3 flex items-center justify-between bg-slate-900/40 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 shrink-0"
                        style={{ borderColor: m.color }}
                      />
                      <div className="min-w-0">
                        <h3 className="text-[11px] sm:text-sm font-bold text-slate-100 truncate">
                          {m.name.split(' ')[0]}
                        </h3>
                        <p className="text-[9px] sm:text-xs text-slate-400 truncate hidden sm:block">{m.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Grid Content */}
            <div className="flex relative min-h-[900px] w-full">
              {/* Left Time Axis */}
              <div className="w-12 sm:w-16 shrink-0 border-r border-slate-800 bg-slate-950 select-none">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[68px] text-[10px] sm:text-[11px] font-mono text-slate-400 text-center pt-1 border-b border-slate-900/60"
                  >
                    {String(hour).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Master Columns */}
              <div
                className="flex-1 grid divide-x divide-slate-800/60 relative w-full"
                style={{ gridTemplateColumns: `repeat(${visibleMasters.length}, minmax(0, 1fr))` }}
              >
                {/* Current Time Indicator */}
                {currentTimeTop && !isTransitioning && (
                  <div
                    className="absolute left-0 right-0 z-10 pointer-events-none flex items-center"
                    style={{ top: currentTimeTop }}
                  >
                    <div className="w-3 h-3 rounded-full bg-rose-500 -ml-1.5 shadow-md shadow-rose-500/50" />
                    <div className="h-[2px] w-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  </div>
                )}

                {visibleMasters.map((master) => {
                  const masterApts = appointments.filter((apt) => {
                    const aptDate = apt.startTime.split('T')[0];
                    return (
                      aptDate === selectedDate &&
                      apt.services.some((s) => s.masterId === master.id)
                    );
                  });

                  return (
                    <div key={master.id} className="relative h-full bg-slate-950/20 group">
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          onClick={() => onSelectSlot(master.id, `${String(hour).padStart(2, '0')}:00`)}
                          className="h-[68px] border-b border-slate-900/60 hover:bg-slate-900/40 cursor-pointer transition flex items-end justify-end p-1 text-[10px] text-slate-700 opacity-0 group-hover:opacity-100"
                        >
                          + {hour}:00
                        </div>
                      ))}

                      {masterApts.map((apt) => {
                        const { top, height } = getAppointmentPosition(apt.startTime, apt.endTime);

                        const isConfirmed = apt.status === 'confirmed';
                        const isCompleted = apt.status === 'completed';
                        const isCancelled = apt.status === 'cancelled';

                        const startFormatted = new Date(apt.startTime).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        const endFormatted = new Date(apt.endTime).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAppointment(apt);
                            }}
                            className={`absolute left-0.5 right-0.5 sm:left-1 sm:right-1 rounded-xl p-2 sm:p-3 text-xs sm:text-sm border shadow-xl backdrop-blur-md cursor-pointer transition transform hover:scale-[1.01] hover:z-20 overflow-hidden flex flex-col justify-between animate-in fade-in duration-200 ${
                              isCancelled
                                ? 'bg-rose-950/40 border-rose-900/60 text-slate-400 line-through'
                                : isCompleted
                                ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                                : 'bg-slate-900/90 border-violet-500/50 text-white shadow-violet-500/10'
                            }`}
                            style={{
                              top,
                              height,
                              borderLeftWidth: '4px',
                              borderLeftColor: master.color,
                            }}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-mono text-xs sm:text-sm font-extrabold text-slate-100 flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 inline shrink-0" />
                                  {startFormatted} - {endFormatted}
                                </span>
                                {isCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                )}
                                {isConfirmed && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                )}
                              </div>

                              <div className="font-extrabold text-xs sm:text-base text-slate-100 truncate flex items-center gap-1.5 mt-0.5">
                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                                <span>{apt.clientName}</span>
                              </div>

                              <div className="text-xs sm:text-sm text-rose-200 font-semibold leading-snug line-clamp-2 mt-1">
                                {apt.services.map((s) => s.serviceTitle).join(', ')}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-medium text-slate-400 pt-1.5 border-t border-slate-800/80 mt-1">
                              <span className="truncate">{apt.clientPhone}</span>
                              <span className="font-extrabold text-emerald-400 text-xs sm:text-sm shrink-0">{apt.totalPrice} ₴</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* WEEK VIEW LAYOUT */}
        {viewMode === 'week' && (
          <div className="w-full max-w-full">
            {/* Header Columns: Days of Week */}
            <div className="flex border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-20 shadow-sm w-full">
              <div className="w-12 sm:w-16 shrink-0 py-3 text-center text-[10px] sm:text-xs font-semibold text-slate-500 border-r border-slate-800">
                Час
              </div>
              <div className="flex-1 grid grid-cols-7 divide-x divide-slate-800">
                {weekDays.map((day) => {
                  const isDaySelected = day.dateStr === selectedDate;
                  const isDayToday = day.dateStr === todayLocalStr;

                  return (
                    <div
                      key={day.dateStr}
                      className={`p-1 sm:p-2 text-center transition ${
                        isDayToday
                          ? 'bg-rose-500/10'
                          : isDaySelected
                          ? 'bg-slate-800/40'
                          : 'bg-slate-900/40'
                      }`}
                    >
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block truncate">
                        {day.dayName}
                      </span>
                      <span
                        className={`text-xs sm:text-base font-bold inline-block w-6 h-6 sm:w-7 sm:h-7 leading-6 sm:leading-7 rounded-full ${
                          isDayToday
                            ? 'bg-rose-500 text-white'
                            : 'text-slate-200'
                        }`}
                      >
                        {day.dayNum}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time Grid Content for Week */}
            <div className="flex relative min-h-[900px] w-full">
              {/* Left Time Axis */}
              <div className="w-12 sm:w-16 shrink-0 border-r border-slate-800 bg-slate-950 select-none">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-[68px] text-[10px] sm:text-[11px] font-mono text-slate-400 text-center pt-1 border-b border-slate-900/60"
                  >
                    {String(hour).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              <div className="flex-1 grid grid-cols-7 divide-x divide-slate-800/60 relative w-full">
                {weekDays.map((day) => {
                  const dayApts = appointments.filter((apt) => {
                    const aptDate = apt.startTime.split('T')[0];
                    if (aptDate !== day.dateStr) return false;
                    if (selectedMasterId === 'all') return true;
                    return apt.services.some((s) => s.masterId === selectedMasterId);
                  });

                  return (
                    <div key={day.dateStr} className="relative h-full bg-slate-950/20 group">
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          onClick={() => onSelectSlot(selectedMasterId === 'all' ? masters[0].id : selectedMasterId, `${String(hour).padStart(2, '0')}:00`)}
                          className="h-[68px] border-b border-slate-900/60 hover:bg-slate-900/40 cursor-pointer transition"
                        />
                      ))}

                      {dayApts.map((apt) => {
                        const { top, height } = getAppointmentPosition(apt.startTime, apt.endTime);
                        const masterColor = visibleMasters.find((m) =>
                          apt.services.some((s) => s.masterId === m.id)
                        )?.color || '#8b5cf6';

                        return (
                          <div
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAppointment(apt);
                            }}
                            className="absolute left-0.5 right-0.5 rounded-lg p-1.5 bg-slate-900/90 border border-violet-500/40 text-white cursor-pointer hover:z-20 overflow-hidden shadow-md animate-in fade-in duration-200"
                            style={{
                              top,
                              height,
                              borderLeftWidth: '3px',
                              borderLeftColor: masterColor,
                            }}
                          >
                            <div className="font-extrabold text-xs sm:text-sm text-slate-100 truncate">{apt.clientName.split(' ')[0]}</div>
                            <div className="text-[10px] sm:text-xs text-rose-200 font-semibold truncate hidden sm:block">
                              {apt.services.map((s) => s.serviceTitle).join(', ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Central Loading Spinner Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 flex items-center justify-center animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 border-t-rose-500 animate-spin" />
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 animate-pulse" />
            </div>
            <span className="text-xs font-semibold text-slate-300">Оновлення...</span>
          </div>
        </div>
      )}
    </div>
  );
};
