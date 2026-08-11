'use client';

import React, { useState } from 'react';
import { Master, Service } from '@/types/planner';
import { User, Plus, Edit3, Trash2, Clock, Check, Scissors, Phone } from 'lucide-react';
import { WorkerModal } from './WorkerModal';
import { ConfirmModal } from '../ConfirmModal';

interface WorkersSettingsTabProps {
  masters: Master[];
  allServices: Service[];
  onAddMaster: (masterData: Omit<Master, 'id'>) => void;
  onUpdateMaster: (id: string, updated: Partial<Master>) => void;
  onDeleteMaster: (id: string) => void;
}

export const WorkersSettingsTab: React.FC<WorkersSettingsTabProps> = ({
  masters,
  allServices,
  onAddMaster,
  onUpdateMaster,
  onDeleteMaster,
}) => {
  const [editingMaster, setEditingMaster] = useState<Master | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingMasterId, setDeletingMasterId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingMaster(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Master) => {
    setEditingMaster(m);
    setIsModalOpen(true);
  };

  const handleToggleActive = (m: Master) => {
    onUpdateMaster(m.id, { isActive: !m.isActive });
  };

  const handleSave = (masterData: any) => {
    if (masterData.id) {
      onUpdateMaster(masterData.id, masterData);
    } else {
      onAddMaster(masterData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingMasterId) {
      onDeleteMaster(deletingMasterId);
      setDeletingMasterId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
        <div>
          <h2 className="font-extrabold text-base text-white">Команда майстрів салону</h2>
          <p className="text-xs text-slate-400">Налаштуйте спеціалізацію та графіки роботи</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center gap-2 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Додати працівника</span>
        </button>
      </div>

      {/* Workers Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {masters.map((master) => {
          const masterSpecialties = allServices.filter((s) =>
            master.specialties.includes(s.id)
          );

          return (
            <div
              key={master.id}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-lg transition space-y-4 ${
                master.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={master.avatar}
                      alt={master.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 shrink-0 shadow-md"
                      style={{ borderColor: master.color }}
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                        master.isActive ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white">{master.name}</h3>
                    <p className="text-xs text-rose-300 font-semibold">{master.role}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {master.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(master)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border transition ${
                      master.isActive
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {master.isActive ? 'Активний' : 'Війшов'}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(master)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                    title="Редагувати"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingMasterId(master.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Видалити"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Working Hours & Break */}
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  Зміна: {master.workHours.start} - {master.workHours.end}
                </span>
                {master.workHours.breakStart && master.workHours.breakEnd && (
                  <span className="text-[11px] font-bold text-rose-300">
                    Перерва: {master.workHours.breakStart}-{master.workHours.breakEnd}
                  </span>
                )}
              </div>

              {/* Specialization List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5 text-violet-400" />
                    Кваліфікація ({masterSpecialties.length} послуг)
                  </span>
                  <button
                    onClick={() => handleOpenEdit(master)}
                    className="text-[11px] text-rose-400 hover:underline font-semibold"
                  >
                    Змінити ➔
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {masterSpecialties.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 text-[11px] font-medium"
                    >
                      {s.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit/Add Master Modal */}
      <WorkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        master={editingMaster}
        allServices={allServices}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingMasterId}
        title="Видалити майстра?"
        message="Ви дійсно бажаєте видалити цього працівника зі списку?"
        confirmText="Видалити"
        cancelText="Скасувати"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMasterId(null)}
      />
    </div>
  );
};
