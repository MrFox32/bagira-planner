'use client';

import React, { useState } from 'react';
import { Appointment } from '@/types/planner';
import { ConfirmModal } from './ConfirmModal';
import {
  X,
  User,
  Phone,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  Play,
  Trash2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onDelete: (id: string) => void;
}

export const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!appointment) return null;

  const startFormatted = new Date(appointment.startTime).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endFormatted = new Date(appointment.endTime).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl text-slate-100 p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Деталі сеансу</h2>
              <p className="text-xs text-slate-400">Код сеансу: #{appointment.id.slice(0, 8)}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium">Статус запису:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize shadow-sm ${
                appointment.status === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : appointment.status === 'in_progress'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : appointment.status === 'cancelled'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
              }`}
            >
              {appointment.status === 'confirmed' && 'Підтверджено'}
              {appointment.status === 'in_progress' && 'В процесі'}
              {appointment.status === 'completed' && 'Завершено'}
              {appointment.status === 'cancelled' && 'Скасовано'}
            </span>
          </div>

          {/* Client & Time Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
              <User className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Клієнт</p>
                <p className="text-sm font-bold text-slate-100">{appointment.clientName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
              <Phone className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Телефон</p>
                <a
                  href={`tel:${appointment.clientPhone}`}
                  className="text-sm font-bold text-rose-300 hover:underline"
                >
                  {appointment.clientPhone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-slate-800">
              <Clock className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Час проведення</p>
                <p className="text-sm font-bold text-slate-100">
                  {startFormatted} - {endFormatted}
                </p>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-rose-400" />
              Обрані послуги
            </p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {appointment.services.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 text-xs border border-slate-700/60"
                >
                  <span className="font-semibold text-slate-200">{s.serviceTitle}</span>
                  <span className="text-emerald-400 font-bold">{s.price} ₴</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm">
              <span className="font-semibold text-slate-400">Загальна вартість:</span>
              <span className="font-extrabold text-emerald-400 text-base">
                {appointment.totalPrice} ₴
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-400">Змінити статус:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'in_progress');
                  onClose();
                }}
                className="flex items-center justify-center gap-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Почати</span>
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'completed');
                  onClose();
                }}
                className="flex items-center justify-center gap-1 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Завершити</span>
              </button>

              <button
                onClick={() => {
                  onUpdateStatus(appointment.id, 'cancelled');
                  onClose();
                }}
                className="flex items-center justify-center gap-1 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Скасувати</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-bold transition"
              >
                <Trash2 className="w-4 h-4" />
                <span>Видалити запис</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Видалити запис?"
        message={`Ви дійсно бажаєте видалити запис клієнта "${appointment.clientName}"? Цю дію неможливо скасувати.`}
        confirmText="Так, видалити"
        cancelText="Скасувати"
        variant="danger"
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(appointment.id);
          onClose();
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
