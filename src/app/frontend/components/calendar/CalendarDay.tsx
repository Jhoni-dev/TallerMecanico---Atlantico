// src/components/calendar/CalendarDay.tsx

import { Appointment } from "@/app/frontend/types/appointment.types";
import { formatTime } from "@/app/frontend/utils/calendar.utils";

interface CalendarDayProps {
  day: number;
  appointments: Appointment[];
  isToday: boolean;
  onClick: () => void;
}

export function CalendarDay({
  day,
  appointments,
  isToday,
  onClick,
}: CalendarDayProps) {
  const getAppointmentColor = (status: string) => {
    switch (status) {
      case "COMPLETADA":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "ASIGNADA":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "PENDIENTE":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "CANCELADA":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`h-16 sm:h-24 border border-border p-1 sm:p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
        isToday
          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700"
          : "bg-background"
      }`}
    >
      <div
        className={`font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 ${
          isToday ? "text-blue-600 dark:text-blue-400" : "text-foreground"
        }`}
      >
        {day}
      </div>
      <div className="space-y-0.5 sm:space-y-1 overflow-hidden">
        {appointments.slice(0, 1).map((apt) => (
          <div
            key={apt.id}
            className={`text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate ${getAppointmentColor(apt.appointmentState)}`}
          >
            <span className="hidden sm:inline">
              {formatTime(apt.appointmentDate)} - {apt.author.fullName}
            </span>
            <span className="sm:hidden">{formatTime(apt.appointmentDate)}</span>
          </div>
        ))}
        {appointments.length > 1 && (
          <div className="text-[10px] sm:text-xs text-muted-foreground">
            +{appointments.length - 1} más
          </div>
        )}
      </div>
    </div>
  );
}