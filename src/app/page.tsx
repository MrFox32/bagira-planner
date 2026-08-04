'use client';

import React, { useState } from 'react';
import { usePlannerStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { QuickCallDrawer } from '@/components/QuickCallDrawer';
import { AppointmentDetailModal } from '@/components/AppointmentDetailModal';
import { Appointment } from '@/types/planner';
import { PhoneCall, Plus } from 'lucide-react';

export default function HomePage() {
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
    resetToInitialData,
  } = usePlannerStore();

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

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation & Controls */}
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
      />

      {/* Main Interactive Google-Calendar Grid */}
      <CalendarGrid
        selectedDate={selectedDate}
        selectedMasterId={selectedMasterId}
        viewMode={viewMode}
        masters={masters}
        appointments={appointments}
        onSelectSlot={handleSelectSlot}
        onSelectAppointment={setSelectedAppointment}
      />

      {/* Floating Action Button */}
      <button
        onClick={handleOpenQuickCall}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white font-semibold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
      >
        <Plus className="w-5 h-5" />
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
    </main>
  );
}
