"use client";
import React, { useEffect, useState } from "react";
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
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  // ✅ TODOS LOS HOOKS AL INICIO

  // Fetch del usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await apiFetch(`user/${user}`);

        if (!response.ok) {
          throw new Error("Ha ocurrido un error en la captura del usuario");
        }

        const data: User = await response.json();
        setUserData(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error inesperado"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  // Validación de roles
  useEffect(() => {
    if (isLoading || !userData) return;

    if (!allowedRoles.includes(userData.role)) {
      router.replace(redirectTo);
    }
  }, [userData, isLoading, router, allowedRoles, redirectTo]);

  // ✅ RETURNS CONDICIONALES AL FINAL (después de todos los hooks)

  if (isLoading) {
    return null;
  }

  if (!userData || !allowedRoles.includes(userData.role)) {
    return null;
  }

  return <>{children}</>;
}
