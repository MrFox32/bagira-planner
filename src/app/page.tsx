'use client';

import React, { useState } from 'react';
import { usePlannerStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { CalendarGrid } from '@/components/CalendarGrid';
import { SettingsView } from '@/components/settings/SettingsView';
import { QuickCallDrawer } from '@/components/QuickCallDrawer';
import { AppointmentDetailModal } from '@/components/AppointmentDetailModal';
import { Appointment } from '@/types/planner';
import { Plus } from 'lucide-react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    masters,
    services,
    clients,
    appointments,
    selectedDate,
    selectedMasterId,
    viewMode,
    setSelectedDate,
    setSelectedMasterId,
    setViewMode,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    addClient,
    addService,
    updateService,
    deleteService,
    addMaster,
    updateMaster,
    deleteMaster,
    resetToInitialData,
  } = usePlannerStore();

  // Navigation View State
  const [currentView, setCurrentView] = useState<'calendar' | 'settings'>('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Drawer / Modal states
  const [isQuickCallOpen, setIsQuickCallOpen] = useState(false);
  const [quickCallDefaultMaster, setQuickCallDefaultMaster] = useState<string>('any');
  const [quickCallDefaultTime, setQuickCallDefaultTime] = useState<string | undefined>(undefined);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleSelectSlot = (masterId: string, timeStr: string) => {
    setQuickCallDefaultMaster(masterId);
    setQuickCallDefaultTime(timeStr);
    setIsQuickCallOpen(true);
  };

  const handleOpenQuickCall = () => {
    setQuickCallDefaultMaster('any');
    setQuickCallDefaultTime(undefined);
    setIsQuickCallOpen(true);
  };

  if (!mounted) {
    return (
      <main className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Завантаження Bagira Planner...</span>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        totalServicesCount={services.length}
        totalMastersCount={masters.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedMasterId={selectedMasterId}
          onMasterChange={setSelectedMasterId}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          masters={masters}
          onOpenQuickCall={handleOpenQuickCall}
          onResetData={resetToInitialData}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* View Switcher: Calendar Grid vs Settings */}
        {currentView === 'calendar' ? (
          <CalendarGrid
            selectedDate={selectedDate}
            selectedMasterId={selectedMasterId}
            viewMode={viewMode}
            masters={masters}
            appointments={appointments}
            onSelectSlot={handleSelectSlot}
            onSelectAppointment={setSelectedAppointment}
          />
        ) : (
          <SettingsView
            services={services}
            masters={masters}
            onAddService={addService}
            onUpdateService={updateService}
            onDeleteService={deleteService}
            onAddMaster={addMaster}
            onUpdateMaster={updateMaster}
            onDeleteMaster={deleteMaster}
          />
        )}
      </div>

      {/* Floating Action Button for Quick Booking */}
      <button
        onClick={handleOpenQuickCall}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-500 to-violet-600 hover:from-rose-600 hover:to-violet-700 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 z-30 shadow-rose-500/30"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
        <span>Новий запис</span>
      </button>

      {/* Quick Booking Drawer */}
      <QuickCallDrawer
        isOpen={isQuickCallOpen}
        onClose={() => setIsQuickCallOpen(false)}
        selectedDate={selectedDate}
        defaultMasterId={quickCallDefaultMaster}
        defaultTime={quickCallDefaultTime}
        masters={masters}
        services={services}
        clients={clients}
        existingAppointments={appointments}
        onBookAppointment={addAppointment}
        onAddClient={addClient}
      />

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={updateAppointmentStatus}
        onDelete={deleteAppointment}
      />
    </div>
  );
}
