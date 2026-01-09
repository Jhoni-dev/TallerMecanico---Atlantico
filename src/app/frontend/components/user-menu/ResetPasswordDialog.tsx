// components/nav-user/ResetPasswordDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconKey, IconLoader2, IconMail } from "@tabler/icons-react";
import { apiFetch } from "@/app/frontend/utils/apiFetch";
import { toast } from "sonner";
import type { UserData } from "../../types/userMenu.types";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  userData,
}: ResetPasswordDialogProps) {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!userData?.email) return;

    try {
      setIsResettingPassword(true);

      const response = await apiFetch("../auth/restore/requestNewPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al solicitar el restablecimiento de contraseña");
      }

      toast.success("Se ha enviado un correo para restablecer tu contraseña");
      onOpenChange(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al solicitar el restablecimiento"
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <IconKey className="h-6 w-6 text-primary" />
            Restablecer Contraseña
          </DialogTitle>
          <DialogDescription>
            Se enviará un correo electrónico a{" "}
            <span className="font-semibold text-foreground">
              {userData?.email}
            </span>{" "}
            con instrucciones para restablecer tu contraseña.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-400">
              <strong>Nota:</strong> El enlace de restablecimiento será válido
              por 1 hora. Revisa tu bandeja de entrada y spam.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isResettingPassword}
            className="h-11"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleResetPassword}
            disabled={isResettingPassword}
            className="h-11 shadow-sm"
          >
            {isResettingPassword ? (
              <>
                <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <IconMail className="h-4 w-4 mr-2" />
                Enviar correo
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
