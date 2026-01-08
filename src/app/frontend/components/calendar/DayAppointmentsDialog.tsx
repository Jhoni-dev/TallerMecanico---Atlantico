// src/components/calendar/DayAppointmentsDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Appointment, SelectedDate } from "@/app/frontend/types/appointment.types";
import { MONTH_NAMES } from "@/app/frontend/constants/calendar.constants";
import { AppointmentCard } from "./AppointmentCard";

interface DayAppointmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: SelectedDate | null;
  appointments: Appointment[];
  activeFiltersCount: number;
  onToggleComplete: (id: number) => void;
}

export function DayAppointmentsDialog({
  open,
  onOpenChange,
  selectedDate,
  appointments,
  activeFiltersCount,
  onToggleComplete,
}: DayAppointmentsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {selectedDate
              ? `${selectedDate.day} de ${MONTH_NAMES[selectedDate.month]} ${selectedDate.year}`
              : "Selecciona una fecha"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {activeFiltersCount === 0
                  ? "No hay citas programadas para este día"
                  : activeFiltersCount === 1
                    ? "No hay citas con el filtro seleccionado para este día"
                    : "No hay citas con los filtros seleccionados para este día"}
              </p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {appointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
