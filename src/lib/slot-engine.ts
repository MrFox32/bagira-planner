import { Master, Service, Appointment, RecommendedSlot } from '@/types/planner';

interface CalculateSlotsInput {
  targetDate: string; // "YYYY-MM-DD"
  selectedServiceIds: string[];
  preferredMasterId: string; // 'any' or specific master ID
  masters: Master[];
  services: Service[];
  existingAppointments: Appointment[];
}

export function findOptimalSlots({
  targetDate,
  selectedServiceIds,
  preferredMasterId,
  masters,
  services,
  existingAppointments,
}: CalculateSlotsInput): RecommendedSlot[] {
  if (selectedServiceIds.length === 0) return [];

  const targetServices = selectedServiceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is Service => Boolean(s));

  if (targetServices.length === 0) return [];

  // Filter available masters based on preferredMasterId
  const candidateMasters = preferredMasterId === 'any'
    ? masters.filter((m) => m.isActive)
    : masters.filter((m) => m.id === preferredMasterId && m.isActive);

  if (candidateMasters.length === 0) return [];

  // Working window (Salon open from 09:00 to 19:00 by default)
  const dayStartMinutes = 9 * 60; // 540 min (09:00)
  const dayEndMinutes = 19 * 60; // 1140 min (19:00)
  const slotIntervalMinutes = 15;

  // Filter existing appointments for targetDate
  const dayAppointments = existingAppointments.filter((apt) => {
    const aptDate = apt.startTime.split('T')[0];
    return aptDate === targetDate && apt.status !== 'cancelled';
  });

  const slots: RecommendedSlot[] = [];

  // 1. Try single master allocation first
  for (const master of candidateMasters) {
    // Check if master can do ALL selected services
    const canDoAll = targetServices.every((srv) => master.specialties.includes(srv.id));
    if (!canDoAll) continue;

    // Calculate total duration + buffer
    const totalDurationMinutes = targetServices.reduce(
      (sum, srv) => sum + srv.durationMinutes + srv.bufferMinutes,
      0
    );

    // Master work hours in minutes
    const [wStartH, wStartM] = master.workHours.start.split(':').map(Number);
    const [wEndH, wEndM] = master.workHours.end.split(':').map(Number);
    const masterStart = wStartH * 60 + wStartM;
    const masterEnd = wEndH * 60 + wEndM;

    // Master break in minutes
    let breakStart = -1;
    let breakEnd = -1;
    if (master.workHours.breakStart && master.workHours.breakEnd) {
      const [bStartH, bStartM] = master.workHours.breakStart.split(':').map(Number);
      const [bEndH, bEndM] = master.workHours.breakEnd.split(':').map(Number);
      breakStart = bStartH * 60 + bStartM;
      breakEnd = bEndH * 60 + bEndM;
    }

    // Step through available times
    for (let time = Math.max(dayStartMinutes, masterStart); time + totalDurationMinutes <= Math.min(dayEndMinutes, masterEnd); time += slotIntervalMinutes) {
      const timeEnd = time + totalDurationMinutes;

      // Check break overlap
      if (breakStart !== -1 && breakEnd !== -1) {
        if (time < breakEnd && timeEnd > breakStart) {
          continue; // Overlaps master break
        }
      }

      // Check appointment overlap for this master
      const hasConflict = dayAppointments.some((apt) => {
        return apt.services.some((item) => {
          if (item.masterId !== master.id) return false;
          const aStart = new Date(item.startTime);
          const aEnd = new Date(item.endTime);
          const aStartMin = aStart.getHours() * 60 + aStart.getMinutes();
          const aEndMin = aEnd.getHours() * 60 + aEnd.getMinutes();
          return time < aEndMin && timeEnd > aStartMin;
        });
      });

      if (!hasConflict) {
        // Calculate score/reasoning
        let isOptimal = false;
        let scoreReason = 'Вільне вікно у розкладі';

        // Check if directly adjacent to an existing appointment or master start
        const isRightAfterStart = time === masterStart;
        const isAdjacentToApt = dayAppointments.some((apt) => {
          return apt.services.some((item) => {
            if (item.masterId !== master.id) return false;
            const aEnd = new Date(item.endTime);
            const aEndMin = aEnd.getHours() * 60 + aEnd.getMinutes();
            return Math.abs(aEndMin - time) <= 15;
          });
        });

        if (isRightAfterStart) {
          isOptimal = true;
          scoreReason = 'Початок робочого дня майстра (без простою)';
        } else if (isAdjacentToApt) {
          isOptimal = true;
          scoreReason = 'Слідом за попереднім записом (оптимальне навантаження)';
        }

        // Build service breakdown
        let currentSrvTime = time;
        const breakdown = targetServices.map((srv) => {
          const srvStartMin = currentSrvTime;
          const srvEndMin = currentSrvTime + srv.durationMinutes + srv.bufferMinutes;
          currentSrvTime = srvEndMin;

          return {
            serviceId: srv.id,
            serviceTitle: srv.title,
            masterId: master.id,
            masterName: master.name,
            masterColor: master.color,
            startTime: minutesToHHMM(srvStartMin),
            endTime: minutesToHHMM(srvEndMin),
          };
        });

        slots.push({
          id: `slot-${master.id}-${time}`,
          date: targetDate,
          startTime: minutesToHHMM(time),
          endTime: minutesToHHMM(timeEnd),
          totalMinutes: totalDurationMinutes,
          isOptimal,
          scoreReason,
          masterBreakdown: breakdown,
        });
      }
    }
  }

  // 2. If no single master or 'any' requested with multiple services, try multi-master sequential allocation
  if (slots.length < 3 && targetServices.length > 1 && preferredMasterId === 'any') {
    // Try assigning Service 1 to Master A and Service 2 to Master B
    const srv1 = targetServices[0];
    const srv2 = targetServices[1];

    const masters1 = masters.filter((m) => m.isActive && m.specialties.includes(srv1.id));
    const masters2 = masters.filter((m) => m.isActive && m.specialties.includes(srv2.id));

    for (const m1 of masters1) {
      for (const m2 of masters2) {
        if (m1.id === m2.id) continue; // Different masters for multi-master search

        const dur1 = srv1.durationMinutes + srv1.bufferMinutes;
        const dur2 = srv2.durationMinutes + srv2.bufferMinutes;
        const totalDur = dur1 + dur2;

        for (let time = dayStartMinutes; time + totalDur <= dayEndMinutes; time += 30) {
          const t1End = time + dur1;
          const t2End = t1End + dur2;

          // Check conflict m1
          const conflict1 = dayAppointments.some((apt) =>
            apt.services.some((item) => {
              if (item.masterId !== m1.id) return false;
              const aStart = new Date(item.startTime);
              const aEnd = new Date(item.endTime);
              const aStartMin = aStart.getHours() * 60 + aStart.getMinutes();
              const aEndMin = aEnd.getHours() * 60 + aEnd.getMinutes();
              return time < aEndMin && t1End > aStartMin;
            })
          );

          // Check conflict m2
          const conflict2 = dayAppointments.some((apt) =>
            apt.services.some((item) => {
              if (item.masterId !== m2.id) return false;
              const aStart = new Date(item.startTime);
              const aEnd = new Date(item.endTime);
              const aStartMin = aStart.getHours() * 60 + aStart.getMinutes();
              const aEndMin = aEnd.getHours() * 60 + aEnd.getMinutes();
              return t1End < aEndMin && t2End > aStartMin;
            })
          );

          if (!conflict1 && !conflict2) {
            slots.push({
              id: `slot-multi-${m1.id}-${m2.id}-${time}`,
              date: targetDate,
              startTime: minutesToHHMM(time),
              endTime: minutesToHHMM(t2End),
              totalMinutes: totalDur,
              isOptimal: true,
              scoreReason: `Комбінований запис: ${m1.name} (послуга 1) → ${m2.name} (послуга 2)`,
              masterBreakdown: [
                {
                  serviceId: srv1.id,
                  serviceTitle: srv1.title,
                  masterId: m1.id,
                  masterName: m1.name,
                  masterColor: m1.color,
                  startTime: minutesToHHMM(time),
                  endTime: minutesToHHMM(t1End),
                },
                {
                  serviceId: srv2.id,
                  serviceTitle: srv2.title,
                  masterId: m2.id,
                  masterName: m2.name,
                  masterColor: m2.color,
                  startTime: minutesToHHMM(t1End),
                  endTime: minutesToHHMM(t2End),
                },
              ],
            });
          }
        }
      }
    }
  }

  // Sort slots: Optimal first, then earlier start time
  return slots.sort((a, b) => {
    if (a.isOptimal !== b.isOptimal) return a.isOptimal ? -1 : 1;
    return a.startTime.localeCompare(b.startTime);
  }).slice(0, 6); // Return top 6 candidates
}

function minutesToHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
