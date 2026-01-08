// src/components/clients/VehicleList.tsx

import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { ClientVehicle } from "@/app/frontend/types/client.types";

interface VehicleListProps {
  vehicles: ClientVehicle[];
  clientId: number;
  onEdit: (vehicle: ClientVehicle, clientId: number) => void;
  onDelete: (vehicle: ClientVehicle) => void;
}

export function VehicleList({
  vehicles,
  clientId,
  onEdit,
  onDelete,
}: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <p className="text-center text-xs sm:text-sm text-muted-foreground py-4">
        No hay vehículos registrados
      </p>
    );
  }

  return (
    <div className="grid gap-2">
      {vehicles.map((vehicle, index) => (
        <div
          key={
            vehicle.id > 0
              ? vehicle.id
              : `vehicle-${clientId}-${vehicle.brand}-${vehicle.model}-${vehicle.year}-${index}`
          }
          className="flex justify-between items-start gap-2 p-2 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-medium truncate">
              {vehicle.brand} {vehicle.model} - {vehicle.year}
              {vehicle.plates && ` • ${vehicle.plates}`}
              {vehicle.id <= 0 && " (ID pendiente)"}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {vehicle.engineDisplacement}cc
              {vehicle.description && ` • ${vehicle.description}`}
              {vehicle.id > 0 && ` • ID: ${vehicle.id}`}
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(vehicle, clientId)}
              disabled={vehicle.id <= 0}
              className="h-7 w-7 p-0 sm:h-8 sm:w-8"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(vehicle)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-7 w-7 p-0 sm:h-8 sm:w-8"
              disabled={vehicle.id <= 0}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
