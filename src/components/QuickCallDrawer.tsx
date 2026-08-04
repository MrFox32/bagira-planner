'use client';

import React, { useState, useMemo } from 'react';
import { Master, Service, Client, RecommendedSlot, Appointment } from '@/types/planner';
import { findOptimalSlots } from '@/lib/slot-engine';
import { ConfirmModal } from './ConfirmModal';
import {
  X,
  PhoneCall,
  User,
  Scissors,
  Clock,
  Sparkles,
  Check,
  ChevronRight,
  AlertCircle,
  Calendar as CalendarIcon,
  Search,
  Zap,
} from 'lucide-react';

interface QuickCallDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  defaultMasterId?: string;
  defaultTime?: string;
  masters: Master[];
  services: Service[];
  clients: Client[];
  existingAppointments: Appointment[];
  onBookAppointment: (newAppointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  onAddClient: (clientData: Omit<Client, 'id'>) => Client;
}

export const QuickCallDrawer: React.FC<QuickCallDrawerProps> = ({
  isOpen,
  onClose,
  selectedDate,
  defaultMasterId = 'any',
  defaultTime,
  masters,
  services,
  clients,
  existingAppointments,
  onBookAppointment,
  onAddClient,
}) => {
  // Form State
  const [step, setStep] = useState<'info' | 'slots'>('info');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [preferredMasterId, setPreferredMasterId] = useState<string>(defaultMasterId);
  const [targetDate, setTargetDate] = useState<string>(selectedDate);

  const [recommendedSlots, setRecommendedSlots] = useState<RecommendedSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<RecommendedSlot | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Sync state when default props change
  React.useEffect(() => {
    setTargetDate(selectedDate);
  }, [selectedDate]);

  // Client Auto-complete
  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return [];
    const query = clientSearch.toLowerCase();
    return clients.filter(
      (c) => c.name.toLowerCase().includes(query) || c.phone.includes(query)
    );
  }, [clientSearch, clients]);

  const handleSelectExistingClient = (c: Client) => {
    setSelectedClientId(c.id);
    setClientName(c.name);
    setClientPhone(c.phone);
    setClientSearch('');
  };

  const handleToggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const selectedServicesObjects = useMemo(
    () => services.filter((s) => selectedServiceIds.includes(s.id)),
    [services, selectedServiceIds]
  );

  const totalDuration = selectedServicesObjects.reduce(
    (acc, s) => acc + s.durationMinutes,
    0
  );
  const totalBuffer = selectedServicesObjects.reduce(
    (acc, s) => acc + s.bufferMinutes,
    0
  );
  const totalPrice = selectedServicesObjects.reduce(
    (acc, s) => acc + s.price,
    0
  );

  // Step 1 -> Step 2: Calculate slots
  const handleCalculateSlots = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      setAlertMessage('Будь ласка, введіть ім’я та номер телефону клієнта');
      return;
    }
    if (selectedServiceIds.length === 0) {
      setAlertMessage('Будь ласка, оберіть хоча б одну послугу');
      return;
    }

    const calculated = findOptimalSlots({
      targetDate,
      selectedServiceIds,
      preferredMasterId,
      masters,
      services,
      existingAppointments,
    });

    setRecommendedSlots(calculated);
    if (calculated.length > 0) {
      setSelectedSlot(calculated[0]);
    } else {
      setSelectedSlot(null);
    }
    setStep('slots');
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    if (!selectedSlot) return;

    let clientId = selectedClientId;

    if (!clientId) {
      const existing = clients.find((c) => c.phone === clientPhone);
      if (existing) {
        clientId = existing.id;
      } else {
        const newC = onAddClient({
          name: clientName,
          phone: clientPhone,
          notes: notes,
          visitCount: 1,
        });
        clientId = newC.id;
      }
    }

    const startIso = `${targetDate}T${selectedSlot.startTime}:00`;
    const endIso = `${targetDate}T${selectedSlot.endTime}:00`;

    onBookAppointment({
      clientId: clientId!,
      clientName,
      clientPhone,
      startTime: startIso,
      endTime: endIso,
      status: 'confirmed',
      notificationStatus: 'pending',
      totalPrice,
      notes,
      services: selectedSlot.masterBreakdown.map((mb, i) => {
        const sObj = services.find((s) => s.id === mb.serviceId);
        return {
          id: `item-${Date.now()}-${i}`,
          serviceId: mb.serviceId,
          serviceTitle: mb.serviceTitle,
          masterId: mb.masterId,
          masterName: mb.masterName,
          startTime: `${targetDate}T${mb.startTime}:00`,
          endTime: `${targetDate}T${mb.endTime}:00`,
          price: sObj ? sObj.price : 0,
        };
      }),
    });

    onClose();
    setStep('info');
    setSelectedServiceIds([]);
    setClientName('');
    setClientPhone('');
    setSelectedClientId(null);
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-250">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                <PhoneCall className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Новий запис (Дзвінок)
                </h2>
                <p className="text-xs text-slate-400">
                  {step === 'info' ? 'Крок 1 з 2: Інформація та послуги' : 'Крок 2 з 2: Вибір оптимального вікна'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {step === 'info' && (
              <>
                {/* Client Search / Details */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-rose-400" />
                    Клієнт
                  </label>

                  {/* Auto-complete Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="Швидкий пошук існуючого клієнта..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none"
                    />

                    {filteredClients.length > 0 && (
                      <div className="absolute left-0 right-0 top-11 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-700/60">
                        {filteredClients.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectExistingClient(c)}
                            className="p-2.5 hover:bg-slate-700/60 cursor-pointer flex items-center justify-between text-xs transition"
                          >
                            <div>
                              <p className="font-bold text-slate-100">{c.name}</p>
                              <p className="text-[10px] text-slate-400">{c.phone}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                              {c.visitCount} візитів
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <input
                        type="text"
                        placeholder="Ім’я клієнта *"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Телефон *"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Date & Preferred Master */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-rose-400" />
                      Дата запису
                    </label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      Бажаний майстер
                    </label>
                    <select
                      value={preferredMasterId}
                      onChange={(e) => setPreferredMasterId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-2 focus:ring-rose-500 outline-none"
                    >
                      <option value="any">Будь-який вільний майстер</option>
                      {masters.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <Scissors className="w-4 h-4 text-rose-400" />
                      Оберіть послуги ({selectedServiceIds.length})
                    </label>
                    <span className="text-xs font-extrabold text-emerald-400">
                      Разом: {totalPrice} ₴
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {services.map((s) => {
                      const isSelected = selectedServiceIds.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleToggleService(s.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? 'bg-rose-500/15 border-rose-500/50 shadow-md shadow-rose-500/10'
                              : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="text-xs font-bold text-slate-100 truncate">{s.title}</p>
                            <p className="text-[10px] text-slate-400">
                              Тривалість: {s.durationMinutes} хв (+{s.bufferMinutes} хв прибирання)
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-extrabold text-emerald-400">
                              {s.price} ₴
                            </span>
                            <div
                              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                                isSelected
                                  ? 'bg-rose-500 border-rose-500 text-white'
                                  : 'border-slate-600 bg-slate-800'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    Примітки та побажання
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Наприклад: Алергія на фарбу, бажано каву з молоком..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </>
            )}

            {step === 'slots' && (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Клієнт:</span>
                    <span className="font-bold text-white">{clientName} ({clientPhone})</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Загальний час:</span>
                    <span className="font-bold text-rose-300">
                      {totalDuration} хв послуг + {totalBuffer} хв буфер
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-700 pt-2">
                    <span className="text-slate-400 font-medium">Сума:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">{totalPrice} ₴</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Рекомендовані вільні вікна ({recommendedSlots.length})
                  </label>

                  {recommendedSlots.length === 0 ? (
                    <div className="p-6 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-400 mx-auto opacity-80" />
                      <p className="text-xs font-bold text-slate-200">
                        На жаль, на обрану дату вільного часу не знайдено
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Спробуйте обрати іншого майстра або змінити дату запису
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {recommendedSlots.map((slot, index) => {
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                          <div
                            key={index}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                              isSelected
                                ? 'bg-rose-500/20 border-rose-500 shadow-lg shadow-rose-500/15'
                                : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-rose-400" />
                                <span className="font-extrabold text-sm text-white">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                                  Обрано
                                </span>
                              )}
                            </div>

                            {/* Service Allocation Breakdown */}
                            <div className="space-y-1 border-t border-slate-700/60 pt-2">
                              {slot.masterBreakdown.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-[11px] text-slate-300"
                                >
                                  <span className="font-medium truncate">{item.serviceTitle}</span>
                                  <span className="text-slate-400 font-bold">
                                    → {item.masterName} ({item.startTime}-{item.endTime})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90">
            {step === 'info' ? (
              <button
                onClick={handleCalculateSlots}
                className="w-full bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Розрахувати Оптимальні Вікна ➔</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('info')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  ← Назад
                </button>
                <button
                  disabled={!selectedSlot}
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Забронювати Слоти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Alert Modal */}
      <ConfirmModal
        isOpen={!!alertMessage}
        title="Заповніть дані"
        message={alertMessage || ''}
        confirmText="Зрозуміло"
        cancelText=""
        variant="warning"
        onConfirm={() => setAlertMessage(null)}
        onCancel={() => setAlertMessage(null)}
      />
    </>
  );
};
