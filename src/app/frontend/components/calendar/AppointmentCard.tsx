// src/components/calendar/AppointmentCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, MapPin } from "lucide-react";
import { Appointment } from "@/app/frontend/types/appointment.types";
import { formatTime } from "@/app/frontend/utils/calendar.utils";
import { StatusBadge } from "./StatusBadge";

interface AppointmentCardProps {
  appointment: Appointment;
  onToggleComplete: (id: number) => void;
}

export function AppointmentCard({
  appointment,
  onToggleComplete,
}: AppointmentCardProps) {
  return (
    <Card
      className={
        appointment.appointmentState === "COMPLETADA" ? "opacity-75" : ""
      }
    >
      <CardContent className="p-3 sm:p-4">
        {/* Header con hora y estado */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
          <div className="flex items-center gap-2">
            <div className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatTime(appointment.appointmentDate)}
            </div>
            <StatusBadge status={appointment.appointmentState} />
          </div>

          <Button
            variant={
              appointment.appointmentState === "COMPLETADA"
                ? "outline"
                : "default"
            }
            size="sm"
            onClick={() => onToggleComplete(appointment.id)}
            disabled={appointment.appointmentState === "CANCELADA"}
            className="w-full sm:w-auto text-xs h-8"
          >
            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">
              {appointment.appointmentState === "COMPLETADA"
                ? "Completada"
                : "Marcar Completa"}
            </span>
            <span className="sm:hidden">
              {appointment.appointmentState === "COMPLETADA"
                ? "Completada"
                : "Completar"}
            </span>
          </Button>
        </div>

        {/* Información del cliente */}
        <div className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground truncate">
                {appointment.author.fullName} {appointment.author.fullSurname}
              </div>
              <div className="text-muted-foreground text-xs">
                ID: {appointment.author.identified}
              </div>
            </div>
          </div>

          {/* Información del técnico */}
          {appointment.employedAuthor && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate">
                  {appointment.employedAuthor.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  {appointment.employedAuthor.role}
                </div>
              </div>
            </div>
          )}

          {/* Ubicación */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-foreground break-words">
              {appointment.ubicacion}
            </div>
          </div>
        </div>

        {/* Detalles adicionales */}
        {appointment.details && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Detalles:</span>{" "}
              {appointment.details}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}