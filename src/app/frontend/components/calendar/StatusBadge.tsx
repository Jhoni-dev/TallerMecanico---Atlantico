// src/components/calendar/StatusBadge.tsx

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { AppointmentStatus } from "@/app/frontend/types/appointment.types";

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = {
    ASIGNADA: {
      icon: CheckCircle2,
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      label: "Asignada",
    },
    COMPLETADA: {
      icon: CheckCircle2,
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      label: "Completada",
    },
    PENDIENTE: {
      icon: Clock,
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      label: "Pendiente",
    },
    CANCELADA: {
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      label: "Cancelada",
    },
  };

  const { icon: Icon, className, label } = config[status];
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3 w-3";
  const textSize = size === "sm" ? "text-xs" : "text-xs";

  return (
    <Badge variant="secondary" className={`gap-1 ${textSize} ${className}`}>
      <Icon className={iconSize} />
      {label}
    </Badge>
  );
}
