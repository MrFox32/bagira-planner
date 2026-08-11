'use client';

import React, { useState, useEffect } from 'react';
import { Service } from '@/types/planner';
import { X, Scissors, Clock, DollarSign, FileText, Check } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (serviceData: any) => void;
}

const CATEGORIES = [
  { id: 'hair', label: 'Зачіски & Фарбування' },
  { id: 'nails', label: 'Нігтьовий сервіс' },
  { id: 'brows', label: 'Брови & Вії' },
  { id: 'cosmetology', label: 'Косметологія' },
  { id: 'massage', label: 'Масаж & Догляд' },
];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Service['category']>('hair');
  const [price, setPrice] = useState<number>(500);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [bufferMinutes, setBufferMinutes] = useState<number>(15);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (service) {
      setTitle(service.title);
      setCategory(service.category);
      setPrice(service.price);
      setDurationMinutes(service.durationMinutes);
      setBufferMinutes(service.bufferMinutes);
      setDescription(service.description || '');
    } else {
      setTitle('');
      setCategory('hair');
      setPrice(500);
      setDurationMinutes(60);
      setBufferMinutes(15);
      setDescription('');
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...(service ? { id: service.id } : {}),
      title: title.trim(),
      category,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      bufferMinutes: Number(bufferMinutes),
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 space-y-5 relative animate-in zoom-in-95 duration-150 overflow-x-hidden max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {service ? 'Редагувати послугу' : 'Створити нову послугу'}
              </h2>
              <p className="text-xs text-slate-400">Налаштування цін, тривалості та буферу</p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400">Назва послуги *</label>
            <input
              type="text"
              required
              placeholder="Наприклад: Жіноча стрижка + Укладка"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none scroll-mt-28"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400">Категорія</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              onFocus={handleInputFocus}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-rose-500 outline-none scroll-mt-28"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Ціна (₴) *</label>
              <input
                type="number"
                min={0}
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                onFocus={handleInputFocus}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-emerald-400 focus:ring-2 focus:ring-rose-500 outline-none scroll-mt-28"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Тривалість (хв) *</label>
              <input
                type="number"
                min={5}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                onFocus={handleInputFocus}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white focus:ring-2 focus:ring-rose-500 outline-none scroll-mt-28"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Буфер (хв) *</label>
              <input
                type="number"
                min={0}
                required
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                onFocus={handleInputFocus}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-rose-300 focus:ring-2 focus:ring-rose-500 outline-none scroll-mt-28"
                title="Час для дезінфекції та прибирання робочого місця"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-400">Опис послуги</label>
            <textarea
              rows={2}
              placeholder="Короткий опис або деталі процедури..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none scroll-mt-28"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
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
              <span>{service ? 'Зберегти зміни' : 'Створити послугу'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
