'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, Check, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl text-slate-100 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Banner */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              variant === 'danger'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-rose-500/10'
                : variant === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-amber-500/10'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-blue-500/10'
            }`}
          >
            {variant === 'danger' && <Trash2 className="w-6 h-6 animate-pulse" />}
            {variant === 'warning' && <AlertTriangle className="w-6 h-6 animate-bounce" />}
            {variant === 'info' && <Info className="w-6 h-6" />}
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {cancelText && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition active:scale-95 border border-slate-700"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 text-white rounded-xl text-xs font-bold transition active:scale-95 shadow-lg ${
              variant === 'danger'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-rose-500/25'
                : variant === 'warning'
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold shadow-amber-500/25'
                : 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/25'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
