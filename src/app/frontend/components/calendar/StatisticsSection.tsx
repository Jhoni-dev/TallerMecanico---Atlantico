// src/components/calendar/StatisticsSection.tsx

import { AppointmentStats, AppointmentStatus } from "@/app/frontend/types/appointment.types";
import { StatCard } from "./StatCard";

interface StatisticsSectionProps {
  stats: AppointmentStats;
  activeFilters: AppointmentStatus[];
  onToggleFilter: (status: AppointmentStatus) => void;
}

export function StatisticsSection({
  stats,
  activeFilters,
  onToggleFilter,
}: StatisticsSectionProps) {
  const statuses: AppointmentStatus[] = [
    "ASIGNADA",
    "COMPLETADA",
    "PENDIENTE",
    "CANCELADA",
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
      {statuses.map((status) => (
        <StatCard
          key={status}
          status={status}
          count={stats[status.toLowerCase() as keyof AppointmentStats]}
          isActive={activeFilters.includes(status)}
          onClick={() => onToggleFilter(status)}
        />
      ))}
    </div>
  );
}
