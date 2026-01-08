// src/components/calendar/CalendarControls.tsx

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { MONTH_NAMES } from "@/app/frontend/constants/calendar.constants";
import { isCurrentMonth } from "@/app/frontend/utils/calendar.utils";

interface CalendarControlsProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
}

export function CalendarControls({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onGoToToday,
}: CalendarControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <CardTitle className="text-base sm:text-xl md:text-2xl text-center">
          <span className="hidden sm:inline">
            {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <span className="sm:hidden">
            {MONTH_NAMES[currentDate.getMonth()].substring(0, 3)}{" "}
            {currentDate.getFullYear()}
          </span>
        </CardTitle>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {!isCurrentMonth(currentDate) && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onGoToToday}
            className="gap-1 text-xs h-8"
          >
            <Calendar className="h-3 w-3" />
            <span className="hidden sm:inline">Hoy</span>
          </Button>
        </div>
      )}
    </div>
  );
}
