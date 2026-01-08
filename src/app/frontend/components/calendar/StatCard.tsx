// src/components/calendar/StatCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertCircle, LucideIcon } from "lucide-react";
import { AppointmentStatus } from "@/app/frontend/types/appointment.types";

interface StatCardProps {
  status: AppointmentStatus;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    icon: LucideIcon;
    colors: { text: string; bg: string; ring: string };
  }
> = {
  ASIGNADA: {
    label: "Asignadas",
    icon: CheckCircle2,
    colors: {
      text: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      ring: "ring-blue-500",
    },
  },
  COMPLETADA: {
    label: "Completadas",
    icon: CheckCircle2,
    colors: {
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      ring: "ring-green-500",
    },
  },
  PENDIENTE: {
    label: "Pendientes",
    icon: Clock,
    colors: {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      ring: "ring-amber-500",
    },
  },
  CANCELADA: {
    label: "Canceladas",
    icon: AlertCircle,
    colors: {
      text: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-950/30",
      ring: "ring-red-500",
    },
  },
};

export function StatCard({ status, count, isActive, onClick }: StatCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isActive
          ? `ring-2 ${config.colors.ring} ${config.colors.bg}`
          : `hover:${config.colors.bg.replace("dark:", "dark:hover:")}`
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {config.label}
            </p>
            <p
              className={`text-xl sm:text-2xl font-bold ${config.colors.text}`}
            >
              {count}
            </p>
          </div>
          <Icon
            className={`h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 ml-2 ${
              isActive
                ? config.colors.text
                : config.colors.text
                    .replace("600", "400")
                    .replace("dark:text-blue-400", "dark:text-blue-500")
            }`}
          />
        </div>
        {isActive && (
          <div
            className={`mt-2 text-[10px] sm:text-xs ${config.colors.text} font-medium`}
          >
            ✓ Activo
          </div>
        )}
      </CardContent>
    </Card>
  );
}
