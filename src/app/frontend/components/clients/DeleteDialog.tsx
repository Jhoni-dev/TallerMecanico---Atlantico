// src/components/clients/DeleteDialog.tsx

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  type: "client" | "vehicle" | null;
  disabled?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  type,
  disabled = false,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Esta acción no se puede deshacer.{" "}
            {type === "client"
              ? "Se eliminará el cliente y todos sus vehículos asociados."
              : "Se eliminará este vehículo permanentemente."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800 w-full sm:w-auto"
            disabled={disabled}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
