"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/usercontext";
import { toast } from "sonner";
import { apiFetch } from "@/app/frontend/utils/apiFetch";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectTo?: string;
}

interface User {
  role: "MECANICO" | "ADMINISTRADOR";
}

export function RoleGuard({
  allowedRoles,
  children,
  redirectTo = "/dashboard/acceso-denegado",
}: RoleGuardProps) {
  const [userData, setUserData] = React.useState<User | null>(null);
  const { user } = useAuth();

  const fetchUser = async () => {
    try {
      const response = await apiFetch(`user/${user}`);

      if (!response.ok)
        throw new Error("Ha ocurrido un error en la captura del usuario");

      const data: User = await response.json();

      setUserData(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado"
      );
    }
  };

  React.useEffect(() => {
    if (!user) return;

    fetchUser();
  }, [user]);

  const router = useRouter();

  useEffect(() => {
    if (!userData) return; // Espera que se cargue el usuario
    if (!allowedRoles.includes(userData.role)) {
      router.replace(redirectTo); // 🚫 Redirige si no tiene el rol permitido
    }
  }, [userData, router, allowedRoles, redirectTo]);

  if (!userData || !allowedRoles.includes(userData.role)) return null;

  return <>{children}</>;
}
