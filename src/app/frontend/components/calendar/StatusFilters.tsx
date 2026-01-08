// src/components/calendar/StatusFilters.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { AppointmentStatus } from "@/app/frontend/types/appointment.types";

interface StatusFiltersProps {
  activeFilters: AppointmentStatus[];
  onToggleFilter: (status: AppointmentStatus) => void;
  onClearAll: () => void;
}

const filterLabels: Record<AppointmentStatus, { full: string; short: string }> =
  {
    ASIGNADA: { full: "ASIGNADA", short: "Asig" },
    COMPLETADA: { full: "COMPLETADA", short: "Comp" },
    PENDIENTE: { full: "PENDIENTE", short: "Pend" },
    CANCELADA: { full: "CANCELADA", short: "Canc" },
  };

const filterColors: Record<AppointmentStatus, string> = {
  ASIGNADA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  COMPLETADA:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  PENDIENTE:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  CANCELADA: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export function StatusFilters({
  activeFilters,
  onToggleFilter,
  onClearAll,
}: StatusFiltersProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="gap-1 text-xs h-8 w-full sm:w-auto"
      >
        <Filter className="h-3 w-3" />
        <span className="hidden sm:inline">Limpiar filtros</span>
        <span className="sm:hidden">Limpiar</span>
        <span className="ml-1">({activeFilters.length})</span>
      </Button>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {activeFilters.map((filter) => (
          <Badge
            key={filter}
            variant="secondary"
            className={`gap-1 text-[10px] sm:text-xs ${filterColors[filter]}`}
          >
            <Filter className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span className="hidden sm:inline">
              {filterLabels[filter].full}
            </span>
            <span className="sm:hidden">{filterLabels[filter].short}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFilter(filter);
              }}
              className="ml-0.5 sm:ml-1 hover:bg-muted rounded-full px-0.5 sm:px-1 transition-colors"
            >
              <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
