// components/nav-user/ProfileDialog.tsx

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
import {
  IconUser,
  IconMail,
  IconPhone,
  IconIdBadge2,
  IconLoader2,
  IconDeviceFloppy,
  IconX,
  IconSettings,
} from "@tabler/icons-react";
import type { UserData, UpdateUserData } from "../../types/userMenu.types";
import Loader from "../Loader";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
  formData: UpdateUserData;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  onInputChange: (field: keyof UpdateUserData, value: string) => void;
  onSave: () => Promise<boolean | undefined>;
  onCancel: () => void;
}

export function ProfileDialog({
  open,
  onOpenChange,
  userData,
  formData,
  isLoading,
  isSaving,
  hasChanges,
  onInputChange,
  onSave,
  onCancel,
}: ProfileDialogProps) {
  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <IconUser className="h-6 w-6 text-primary" />
            Configuración de Perfil
          </DialogTitle>
          <DialogDescription>
            Actualiza tu información personal. Los campos modificados se
            guardarán al hacer clic en "Guardar cambios".
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-5 py-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">
                Nombre completo
              </Label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => onInputChange("name", e.target.value)}
                  className="pl-10 h-11"
                  placeholder="Ingresa tu nombre"
                />
              </div>
            </div>

            {/* Identificación (Solo lectura) */}
            <div className="grid gap-2">
              <Label htmlFor="identificacion" className="font-semibold">
                Identificación
              </Label>
              <div className="relative">
                <IconIdBadge2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identificacion"
                  value={userData?.identificacion || ""}
                  disabled
                  className="pl-10 h-11 bg-muted cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                La identificación no se puede modificar
              </p>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold">
                Correo electrónico
              </Label>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => onInputChange("email", e.target.value)}
                  className="pl-10 h-11"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Indicador de cambios */}
            {hasChanges && (
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-md">
                <IconSettings className="h-3.5 w-3.5" />
                <span className="font-medium">Tienes cambios sin guardar</span>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="h-11"
          >
            <IconX className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || isLoading}
            className="h-11 shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader variant="muted" size="md" />
                Guardando...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="h-4 w-4 mr-2" />
                Guardar cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
