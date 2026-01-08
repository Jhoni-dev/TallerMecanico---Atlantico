// src/components/clients/ContactModal.tsx

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
import { ContactFormData } from "@/app/frontend/types/client.types";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ContactFormData;
  onFormChange: (data: Partial<ContactFormData>) => void;
  onSubmit: () => void;
}

export function ContactModal({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
}: ContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Editar Contacto
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Actualiza la información de contacto del cliente
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="text-xs sm:text-sm">
              Teléfono *
            </Label>
            <Input
              id="contact-phone"
              value={formData.phoneNumber}
              onChange={(e) => onFormChange({ phoneNumber: e.target.value })}
              placeholder="3001234567"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-xs sm:text-sm">
              Email *
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange({ email: e.target.value })}
              placeholder="cliente@email.com"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-address" className="text-xs sm:text-sm">
              Dirección
            </Label>
            <Input
              id="contact-address"
              value={formData.address}
              onChange={(e) => onFormChange({ address: e.target.value })}
              placeholder="Calle 45 #23-12"
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
            Cancelar
          </Button>
          <Button type="button" onClick={onSubmit} className="w-full sm:w-auto">
            Actualizar Contacto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
