// src/components/calendar/AppointmentsCalendar.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppointments } from "@/app/frontend/hooks/useAppointments";
import { AppointmentStatus, SelectedDate } from "@/app/frontend/types/appointment.types";
import { formatDateKey } from "@/app/frontend/utils/calendar.utils";
import { LoadingState } from "./LoadingState";
import { StatisticsSection } from "./StatisticsSection";
import { CalendarControls } from "./CalendarControls";
import { StatusFilters } from "./StatusFilters";
import { CalendarGrid } from "./CalendarGrid";
import { DayAppointmentsDialog } from "./DayAppointmentsDialog";

export default function AppointmentsCalendar() {
  const {
    appointments,
    loading,
    appointmentStats,
    fetchAppointments,
    updateAppointmentStatus,
    getAppointmentsByDate,
  } = useAppointments();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<AppointmentStatus[]>([]);

  // Cargar citas al montar
  useEffect(() => {
    fetchAppointments().catch(() => {
      toast.error("Error al cargar las citas");
    });
  }, [fetchAppointments]);

  // Filtrar citas por estado
  const filteredAppointments = useMemo(() => {
    if (statusFilters.length === 0) {
      return appointments;
    }
    return appointments.filter((apt) =>
      statusFilters.includes(apt.appointmentState)
    );
  }, [appointments, statusFilters]);

  // Agrupar citas por fecha
  const appointmentsByDate = useMemo(
    () => getAppointmentsByDate(filteredAppointments),
    [filteredAppointments, getAppointmentsByDate]
  );

  // Handlers
  const toggleStatusFilter = (status: AppointmentStatus) => {
    setStatusFilters((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const clearAllFilters = () => {
    setStatusFilters([]);
  };

  const handleDayClick = (day: number) => {
    setSelectedDate({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
      day,
    });
    setIsDialogOpen(true);
  };

  const handleToggleComplete = async (appointmentId: number) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (!appointment) return;

    const newStatus: AppointmentStatus =
      appointment.appointmentState === "COMPLETADA" ? "ASIGNADA" : "COMPLETADA";

    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      toast.success(
        newStatus === "COMPLETADA"
          ? "Cita marcada como completada"
          : "Cita marcada como asignada"
      );
    } catch (error) {
      toast.error("Error al actualizar la cita");
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleGoToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtener citas del día seleccionado
  const selectedDateKey = selectedDate
    ? formatDateKey(selectedDate.year, selectedDate.month, selectedDate.day)
    : null;
  const selectedDateAppointments = selectedDateKey
    ? appointmentsByDate[selectedDateKey] || []
    : [];

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground">
            Calendario de Citas
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Visualiza y gestiona las citas programadas
          </p>
        </div>

        {/* Estadísticas */}
        <StatisticsSection
          stats={appointmentStats}
          activeFilters={statusFilters}
          onToggleFilter={toggleStatusFilter}
        />

        {/* Calendario */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <CalendarControls
              currentDate={currentDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onGoToToday={handleGoToToday}
            />

            {/* Filtros activos */}
            {statusFilters.length > 0 && (
              <div className="mt-3">
                <StatusFilters
                  activeFilters={statusFilters}
                  onToggleFilter={toggleStatusFilter}
                  onClearAll={clearAllFilters}
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="p-2 sm:p-6">
            <CalendarGrid
              currentDate={currentDate}
              appointmentsByDate={appointmentsByDate}
              onDayClick={handleDayClick}
            />
          </CardContent>
        </Card>

        {/* Diálogo de citas del día */}
        <DayAppointmentsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedDate={selectedDate}
          appointments={selectedDateAppointments}
          activeFiltersCount={statusFilters.length}
          onToggleComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}
