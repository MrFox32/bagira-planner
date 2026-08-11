'use client';

import React, { useState, useMemo } from 'react';
import { Service } from '@/types/planner';
import { Scissors, Plus, Search, Edit3, Trash2, Clock, ShieldAlert } from 'lucide-react';
import { ServiceModal } from './ServiceModal';
import { ConfirmModal } from '../ConfirmModal';

interface ServicesSettingsTabProps {
  services: Service[];
  onAddService: (serviceData: Omit<Service, 'id'>) => void;
  onUpdateService: (id: string, updated: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Всі послуги' },
  { id: 'hair', label: 'Зачіски' },
  { id: 'nails', label: 'Нігті' },
  { id: 'brows', label: 'Брови' },
  { id: 'cosmetology', label: 'Косметологія' },
  { id: 'massage', label: 'Масаж' },
];

export const ServicesSettingsTab: React.FC<ServicesSettingsTabProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
      const matchesSearch =
        srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setIsModalOpen(true);
  };

  const handleSave = (serviceData: any) => {
    if (serviceData.id) {
      onUpdateService(serviceData.id, serviceData);
    } else {
      onAddService(serviceData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingServiceId) {
      onDeleteService(deletingServiceId);
      setDeletingServiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Category Filters, Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Шукати послугу за назвою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 active:scale-95 transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Додати послугу</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg transition flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 to-violet-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    {srv.category}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                    title="Редагувати"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingServiceId(srv.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="Видалити"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-extrabold text-base text-white">{srv.title}</h3>
              {srv.description && (
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{srv.description}</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>{srv.durationMinutes} хв</span>
                <span className="text-slate-500">+ {srv.bufferMinutes} хв буфер</span>
              </div>
              <span className="font-extrabold text-emerald-400 text-base">{srv.price} ₴</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={editingService}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingServiceId}
        title="Видалити послугу?"
        message="Ви дійсно бажаєте видалити цю послугу з прейскуранту?"
        confirmText="Видалити"
        cancelText="Скасувати"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingServiceId(null)}
      />
    </div>
  );
};
