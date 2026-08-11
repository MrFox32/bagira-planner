'use client';

import React, { useState } from 'react';
import { Service, Master } from '@/types/planner';
import { Scissors, Users, Settings as SettingsIcon } from 'lucide-react';
import { ServicesSettingsTab } from './ServicesSettingsTab';
import { WorkersSettingsTab } from './WorkersSettingsTab';

interface SettingsViewProps {
  services: Service[];
  masters: Master[];
  onAddService: (serviceData: Omit<Service, 'id'>) => void;
  onUpdateService: (id: string, updated: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
  onAddMaster: (masterData: Omit<Master, 'id'>) => void;
  onUpdateMaster: (id: string, updated: Partial<Master>) => void;
  onDeleteMaster: (id: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  services,
  masters,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddMaster,
  onUpdateMaster,
  onDeleteMaster,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'workers'>('services');

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 overflow-y-auto overflow-x-hidden w-full max-w-full p-4 sm:p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/30 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/25 shrink-0">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
            Налаштування салону
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Керування послугами, цінами, тривалістю та кваліфікацією працівників
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('services')}
          className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
            activeTab === 'services'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Послуги та Прейскурант ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition ${
            activeTab === 'workers'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Працівники та Кваліфікації ({masters.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'services' ? (
        <ServicesSettingsTab
          services={services}
          onAddService={onAddService}
          onUpdateService={onUpdateService}
          onDeleteService={onDeleteService}
        />
      ) : (
        <WorkersSettingsTab
          masters={masters}
          allServices={services}
          onAddMaster={onAddMaster}
          onUpdateMaster={onUpdateMaster}
          onDeleteMaster={onDeleteMaster}
        />
      )}
    </div>
  );
};
