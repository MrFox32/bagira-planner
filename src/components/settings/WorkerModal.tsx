'use client';

import React, { useState, useEffect } from 'react';
import { Master, Service } from '@/types/planner';
import { X, User, Phone, Scissors, Check, Sparkles, Clock, Palette } from 'lucide-react';

interface WorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  master: Master | null;
  allServices: Service[];
  onSave: (masterData: any) => void;
}

const PRESET_COLORS = [
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#a855f7', // Purple
  '#f43f5e', // Rose
];

export const WorkerModal: React.FC<WorkerModalProps> = ({
  isOpen,
  onClose,
  master,
  allServices,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [avatar, setAvatar] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('19:00');
  const [breakStart, setBreakStart] = useState('13:00');
  const [breakEnd, setBreakEnd] = useState('13:30');

  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    if (master) {
      setName(master.name);
      setRole(master.role);
      setPhone(master.phone);
      setColor(master.color || '#8b5cf6');
      setAvatar(master.avatar || '');
      setIsActive(master.isActive);
      setWorkStart(master.workHours.start || '09:00');
      setWorkEnd(master.workHours.end || '19:00');
      setBreakStart(master.workHours.breakStart || '');
      setBreakEnd(master.workHours.breakEnd || '');
      setSpecialties(master.specialties || []);
    } else {
      setName('');
      setRole('Стиліст');
      setPhone('+380 ');
      setColor('#8b5cf6');
      setAvatar('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
      setIsActive(true);
      setWorkStart('09:00');
      setWorkEnd('19:00');
      setBreakStart('13:00');
      setBreakEnd('13:30');
      setSpecialties(allServices.map((s) => s.id));
    }
  }, [master, isOpen, allServices]);

  if (!isOpen) return null;

  const handleToggleSpecialty = (serviceId: string) => {
    setSpecialties((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleSelectAllSpecialties = () => {
    setSpecialties(allServices.map((s) => s.id));
  };

  const handleDeselectAllSpecialties = () => {
    setSpecialties([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...(master ? { id: master.id } : {}),
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      color,
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isActive,
      specialties,
      workHours: {
        start: workStart,
        end: workEnd,
        breakStart: breakStart ? breakStart : undefined,
        breakEnd: breakEnd ? breakEnd : undefined,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-6 relative animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {master ? 'Редагувати майстра' : 'Додати нового працівника'}
              </h2>
              <p className="text-xs text-slate-400">Профіль, графік роботи та кваліфікація</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Ім’я та Прізвище *</label>
              <input
                type="text"
                required
                placeholder="Олена Ковальчук"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Посада / Роль *</label>
              <input
                type="text"
                required
                placeholder="Топ-Стиліст / Колорист"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Телефон</label>
              <input
                type="text"
                placeholder="+380 67 111 22 33"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Колір у графіку</label>
              <div className="flex items-center gap-2 pt-0.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-xl transition transform ${
                      color === c ? 'scale-110 ring-2 ring-white shadow-lg' : 'hover:scale-105 opacity-80'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Work Hours & Break */}
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-400" />
              Графік зміни та перерва
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Початок роботи</span>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white text-center"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Кінець роботи</span>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs font-mono text-white text-center"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Перерва з</span>
                <input
                  type="time"
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs font-mono text-rose-300 text-center"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Перерва до</span>
                <input
                  type="time"
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs font-mono text-rose-300 text-center"
                />
              </div>
            </div>
          </div>

          {/* Specialization Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-violet-400" />
                Спеціалізація ({specialties.length} послуг)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllSpecialties}
                  className="text-[10px] font-bold text-rose-400 hover:underline"
                >
                  Обрати всі
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleDeselectAllSpecialties}
                  className="text-[10px] font-bold text-slate-400 hover:underline"
                >
                  Очистити
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {allServices.map((srv) => {
                const isChecked = specialties.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => handleToggleSpecialty(srv.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                      isChecked
                        ? 'bg-violet-500/15 border-violet-500/50 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-semibold truncate">{srv.title}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-violet-600 border-violet-600 text-white' : 'border-slate-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 transition"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{master ? 'Зберегти зміни' : 'Додати працівника'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
