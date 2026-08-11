'use client';

import { useState, useEffect } from 'react';
import { Master, Service, Client, Appointment } from '@/types/planner';
import { INITIAL_MASTERS, INITIAL_SERVICES, INITIAL_CLIENTS, INITIAL_APPOINTMENTS } from './initialData';
import { supabase } from './supabase';

const LOCAL_STORAGE_KEY = 'bagira_planner_state_v1';

interface PlannerStoreState {
  masters: Master[];
  services: Service[];
  clients: Client[];
  appointments: Appointment[];
  selectedDate: string; // "YYYY-MM-DD"
  selectedMasterId: string; // 'all' or specific masterId
  viewMode: 'day' | 'week';
  isSyncedWithSupabase: boolean;
}

const getLocalTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function usePlannerStore() {
  const [state, setState] = useState<PlannerStoreState>(() => {
    return {
      masters: INITIAL_MASTERS,
      services: INITIAL_SERVICES,
      clients: INITIAL_CLIENTS,
      appointments: INITIAL_APPOINTMENTS,
      selectedDate: getLocalTodayStr(),
      selectedMasterId: 'all',
      viewMode: 'day',
      isSyncedWithSupabase: false,
    };
  });

  // Fetch initial data from Supabase if available
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: dbMasters, error: mErr } = await supabase.from('masters').select('*');
        const { data: dbServices, error: sErr } = await supabase.from('services').select('*');
        const { data: dbClients, error: cErr } = await supabase.from('clients').select('*');
        const { data: dbApts, error: aErr } = await supabase.from('appointments').select('*, appointment_services(*)');

        if (!mErr && dbMasters && dbMasters.length > 0) {
          const formattedMasters: Master[] = dbMasters.map((m) => ({
            id: m.id,
            name: m.name,
            avatar: m.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
            phone: m.phone,
            color: m.color || '#8b5cf6',
            role: m.role || 'Стиліст',
            isActive: m.is_active ?? true,
            specialties: ['srv-1', 'srv-2', 'srv-3'],
            workHours: {
              start: m.work_start ? m.work_start.slice(0, 5) : '09:00',
              end: m.work_end ? m.work_end.slice(0, 5) : '19:00',
              breakStart: m.break_start ? m.break_start.slice(0, 5) : undefined,
              breakEnd: m.break_end ? m.break_end.slice(0, 5) : undefined,
            },
          }));

          setState((prev) => ({
            ...prev,
            masters: formattedMasters,
            isSyncedWithSupabase: true,
          }));
        }

        if (!sErr && dbServices && dbServices.length > 0) {
          const formattedServices: Service[] = dbServices.map((s) => ({
            id: s.id,
            category: s.category || 'hair',
            title: s.title,
            durationMinutes: s.duration_minutes,
            bufferMinutes: s.buffer_minutes,
            price: Number(s.price),
            description: s.description,
          }));

          setState((prev) => ({
            ...prev,
            services: formattedServices,
          }));
        }

        if (!cErr && dbClients && dbClients.length > 0) {
          const formattedClients: Client[] = dbClients.map((c) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            notes: c.notes,
            visitCount: c.visit_count,
            totalSpent: Number(c.total_spent),
          }));

          setState((prev) => ({
            ...prev,
            clients: formattedClients,
          }));
        }
      } catch (e) {
        console.warn('Supabase sync skipped, running in optimistic offline mode:', e);
      }
    }

    loadSupabaseData();
  }, []);

  const setSelectedDate = (date: string) => {
    setState((prev) => ({ ...prev, selectedDate: date }));
  };

  const setSelectedMasterId = (masterId: string) => {
    setState((prev) => ({ ...prev, selectedMasterId: masterId }));
  };

  const setViewMode = (mode: 'day' | 'week') => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  };

  const addAppointment = (newAppointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const created: Appointment = {
      ...newAppointment,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      appointments: [...prev.appointments, created],
    }));

    // Async push to Supabase if connected
    supabase.from('appointments').insert({
      client_name: newAppointment.clientName,
      client_phone: newAppointment.clientPhone,
      start_time: newAppointment.startTime,
      end_time: newAppointment.endTime,
      status: newAppointment.status,
      notification_status: newAppointment.notificationStatus,
      total_price: newAppointment.totalPrice,
      notes: newAppointment.notes,
    }).then(({ error }) => {
      if (error) console.warn('Supabase async insert note:', error.message);
    });

    return created;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      ),
    }));

    supabase.from('appointments').update({ status }).eq('id', id);
  };

  const deleteAppointment = (id: string) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((apt) => apt.id !== id),
    }));

    supabase.from('appointments').delete().eq('id', id);
  };

  const addClient = (clientData: Omit<Client, 'id'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      visitCount: 1,
      totalSpent: 0,
    };

    setState((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));

    supabase.from('clients').insert({
      name: clientData.name,
      phone: clientData.phone,
      notes: clientData.notes,
    });

    return newClient;
  };

  const resetToInitialData = () => {
    const defaultState: PlannerStoreState = {
      masters: INITIAL_MASTERS,
      services: INITIAL_SERVICES,
      clients: INITIAL_CLIENTS,
      appointments: INITIAL_APPOINTMENTS,
      selectedDate: getLocalTodayStr(),
      selectedMasterId: 'all',
      viewMode: 'day',
      isSyncedWithSupabase: state.isSyncedWithSupabase,
    };
    setState(defaultState);
  };

  return {
    ...state,
    setSelectedDate,
    setSelectedMasterId,
    setViewMode,
    addAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    addClient,
    resetToInitialData,
  };
}
