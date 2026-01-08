// src/components/checklist/ChecklistCard.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Trash2,
  User,
  Settings,
  Clock,
  Car,
  CheckSquare,
  Calendar,
  MapPin,
} from "lucide-react";
import { VehicleChecklist } from "@/app/frontend/types/checklist.types";
import {
  formatDate,
  getFuelTextColor,
} from "@/app/frontend/utils/checklist.utils";

interface ChecklistCardProps {
  checklist: VehicleChecklist;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ChecklistCard({
  checklist,
  onView,
  onDelete,
}: ChecklistCardProps) {
  const isFromAppointment =
    checklist.appointmentId !== null && checklist.appointmentId !== undefined;
  const isManual =
    !isFromAppointment && (checklist.client || checklist.clientId);

  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-card dark:bg-gray-800 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">
              {checklist.checkType}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className="text-xs dark:bg-gray-700 dark:border-gray-600"
              >
                ID: {checklist.id}
              </Badge>
              <Badge variant="secondary" className="text-xs dark:bg-gray-700">
                <User className="h-3 w-3 mr-1" />
                {checklist.technicianName}
              </Badge>
              {/* Badge para indicar el tipo de checklist */}
              {isFromAppointment ? (
                <Badge variant="default" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Desde Cita #{checklist.appointmentId}
                </Badge>
              ) : isManual ? (
                <Badge
                  variant="secondary"
                  className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  Manual
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  Sin Cliente
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(checklist.id!)}
              className="h-9 px-3 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Ver</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(checklist.id!)}
              className="h-9 px-3 text-red-600 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Info del checklist */}
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="h-4 w-4 flex-shrink-0" />
            <span>{checklist.mileage} km</span>
            <span
              className={`font-bold ${getFuelTextColor(checklist.fuelLevel)}`}
            >
              {checklist.fuelLevel}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>{formatDate(checklist.completedAt || new Date())}</span>
          </div>
        </div>

        {/* Información de Cita */}
        {isFromAppointment && checklist.appointment && (
          <div className="pt-2 border-t dark:border-gray-700">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Cita:
                </p>
                <p className="font-medium">
                  {formatDate(checklist.appointment.appointmentDate)}
                </p>
                <Badge
                  variant="secondary"
                  className="text-xs mt-1 dark:bg-gray-700"
                >
                  {checklist.appointment.appointmentState}
                </Badge>
              </div>

              {checklist.appointment.ubicacion && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Ubicación:
                  </p>
                  <p className="font-medium truncate">
                    {checklist.appointment.ubicacion}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cliente y Vehículo - Desde Cita (cuando están disponibles) */}
        {checklist.appointment?.author && (
          <div className="pt-2 border-t dark:border-gray-700">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Cliente:</p>
                <p className="font-medium truncate">
                  {checklist.appointment.author.fullName}{" "}
                  {checklist.appointment.author.fullSurname}
                </p>
                {checklist.appointment.author.identified && (
                  <p className="text-xs text-muted-foreground">
                    ID: {checklist.appointment.author.identified}
                  </p>
                )}
              </div>

              {checklist.appointment.vehicle && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Vehículo:
                  </p>
                  <p className="font-medium truncate flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    {checklist.appointment.vehicle.brand}{" "}
                    {checklist.appointment.vehicle.model}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Placa: {checklist.appointment.vehicle.licensePlate}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cliente - Modo Manual (usando client y session del backend) */}
        {isManual && checklist.client && (
          <div className="pt-2 border-t dark:border-gray-700">
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Cliente (Manual):
                </p>
                <p className="font-medium truncate">
                  {checklist.client.fullName} {checklist.client.fullSurname}
                </p>
                {checklist.client.identified && (
                  <p className="text-xs text-muted-foreground">
                    ID: {checklist.client.identified}
                  </p>
                )}
              </div>

              {checklist.session && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Mecánico:
                  </p>
                  <p className="font-medium truncate">
                    {checklist.session.name}
                  </p>
                  {checklist.session.identificacion && (
                    <p className="text-xs text-muted-foreground">
                      ID: {checklist.session.identificacion}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items count */}
        {checklist.items && checklist.items.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t dark:border-gray-700">
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {checklist.items.filter((i) => i.checked).length} de{" "}
              {checklist.items.length} items verificados
            </span>
          </div>
        )}

        {/* Número de imágenes */}
        {checklist.vehicleImage && checklist.vehicleImage.length > 0 && (
          <div className="pt-2 border-t dark:border-gray-700">
            <Badge variant="outline" className="text-xs">
              📸 {checklist.vehicleImage.length}{" "}
              {checklist.vehicleImage.length === 1 ? "imagen" : "imágenes"}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
