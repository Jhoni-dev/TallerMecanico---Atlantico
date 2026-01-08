// src/components/calendar/CalendarGrid.tsx

import { Appointment } from "@/app/frontend/types/appointment.types";
import { DAY_NAMES, DAY_NAMES_SHORT } from "@/app/frontend/constants/calendar.constants";
import { getDaysInMonth, formatDateKey, isToday } from "@/app/frontend/utils/calendar.utils";
import { CalendarDay } from "./CalendarDay";

interface CalendarGridProps {
  currentDate: Date;
  appointmentsByDate: Record<string, Appointment[]>;
  onDayClick: (day: number) => void;
}

export function CalendarGrid({
  currentDate,
  appointmentsByDate,
  onDayClick,
}: CalendarGridProps) {
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const renderCalendarDays = () => {
    const days: React.ReactNode[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 sm:h-24 border border-border bg-muted/30"
        />
      );
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const dayAppointments = appointmentsByDate[dateKey] || [];
      const isTodayDate = isToday(year, month, day);

      days.push(
        <CalendarDay
          key={day}
          day={day}
          appointments={dayAppointments}
          isToday={isTodayDate}
          onClick={() => onDayClick(day)}
        />
      );
    }

    return days;
  };

  return (
    <div>
      {/* Encabezado de días */}
      <div className="grid grid-cols-7 gap-0 mb-1 sm:mb-2">
        {/* Versión móvil */}
        <div className="sm:hidden contents">
          {DAY_NAMES_SHORT.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-xs py-1.5 bg-muted border border-border"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Versión desktop */}
        <div className="hidden sm:contents">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="text-center font-semibold py-2 bg-muted border border-border text-sm"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Grilla de días */}
      <div className="grid grid-cols-7 gap-0">{renderCalendarDays()}</div>
    </div>
  );
}
