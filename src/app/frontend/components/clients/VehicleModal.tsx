// src/components/clients/VehicleModal.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientVehicle, VehicleFormData } from "@/app/frontend/types/client.types";

interface VehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: ClientVehicle | null;
  formData: VehicleFormData;
  onFormChange: (data: Partial<VehicleFormData>) => void;
  onSubmit: () => void;
}

export function VehicleModal({
  open,
  onOpenChange,
  vehicle,
  formData,
  onFormChange,
  onSubmit,
}: VehicleModalProps) {
  const isEditing = !!vehicle;

  const isFormValid =
    formData.brand.trim() !== "" &&
    formData.model.trim() !== "" &&
    formData.year.trim() !== "" &&
    formData.engineDisplacement.trim() !== "" &&
    formData.plates.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {isEditing
              ? `Editar Vehículo (ID: ${vehicle.id})`
              : "Nuevo Vehículo"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {isEditing
              ? "Actualiza los datos del vehículo"
              : "Registra un nuevo vehículo para este cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-xs sm:text-sm">
                Marca *
              </Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => onFormChange({ brand: e.target.value })}
                placeholder="Toyota"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model" className="text-xs sm:text-sm">
                Modelo *
              </Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => onFormChange({ model: e.target.value })}
                placeholder="Corolla"
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="year" className="text-xs sm:text-sm">
                Año *
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => onFormChange({ year: e.target.value })}
                placeholder="2020"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="engineDisplacement"
                className="text-xs sm:text-sm"
              >
                Cilindraje (cc) *
              </Label>
              <Input
                id="engineDisplacement"
                type="number"
                value={formData.engineDisplacement}
                onChange={(e) =>
                  onFormChange({ engineDisplacement: e.target.value })
                }
                placeholder="1800"
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plates" className="text-xs sm:text-sm">
              Placas *
            </Label>
            <Input
              id="plates"
              value={formData.plates}
              onChange={(e) =>
                onFormChange({ plates: e.target.value.toUpperCase() })
              }
              placeholder="ABC123"
              maxLength={6}
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">
              Descripción
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                onFormChange({ description: e.target.value })
              }
              placeholder="Sedán gris, buen estado general..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isFormValid}
            className="w-full sm:w-auto"
          >
            {isEditing ? "Actualizar" : "Agregar Vehículo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}