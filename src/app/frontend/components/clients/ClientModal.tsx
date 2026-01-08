// src/components/clients/ClientModal.tsx

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
import { Client, ClientFormData } from "@/app/frontend/types/client.types";

interface ClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  formData: ClientFormData;
  onFormChange: (data: Partial<ClientFormData>) => void;
  onSubmit: () => void;
}

export function ClientModal({
  open,
  onOpenChange,
  client,
  formData,
  onFormChange,
  onSubmit,
}: ClientModalProps) {
  const isEditing = !!client;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {isEditing ? "Información del Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {isEditing
              ? "Solo lectura - Para editar contacto use el botón 'Editar Contacto'"
              : "Ingresa los datos del nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs sm:text-sm">
                Nombres *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => onFormChange({ fullName: e.target.value })}
                placeholder="Juan Carlos"
                required
                disabled={isEditing}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullSurname" className="text-xs sm:text-sm">
                Apellidos *
              </Label>
              <Input
                id="fullSurname"
                value={formData.fullSurname}
                onChange={(e) => onFormChange({ fullSurname: e.target.value })}
                placeholder="Rodríguez Pérez"
                required
                disabled={isEditing}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identified" className="text-xs sm:text-sm">
              Identificación *
            </Label>
            <Input
              id="identified"
              value={formData.identified}
              onChange={(e) => onFormChange({ identified: e.target.value })}
              placeholder="1234567890"
              disabled={isEditing}
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-xs sm:text-sm">
                Teléfono *
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => onFormChange({ phoneNumber: e.target.value })}
                placeholder="3001234567"
                required
                disabled={isEditing}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange({ email: e.target.value })}
                placeholder="cliente@email.com"
                required
                disabled={isEditing}
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-xs sm:text-sm">
              Dirección
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFormChange({ address: e.target.value })}
              placeholder="Calle 45 #23-12"
              disabled={isEditing}
              className="text-sm"
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
            {isEditing ? "Cerrar" : "Cancelar"}
          </Button>
          {!isEditing && (
            <Button
              type="button"
              onClick={onSubmit}
              className="w-full sm:w-auto"
            >
              Crear Cliente
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
