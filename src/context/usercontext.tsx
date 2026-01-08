"use client";

import Loader from "@/app/frontend/components/Loader";
import { decodeJWT } from "@/lib/jwt";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: number | null;
  token: string | null;
  login: (token: string, id: number) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAIN_ROUTE = "/auth/login";
const PUBLIC_ROUTES = ["/auth/login", "/auth/restaurar", "/auth/confirmar"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const verifyAuth = async () => {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (isPublicRoute) {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem("token");

      if (
        !storedToken ||
        storedToken === "undefined" ||
        storedToken === "null"
      ) {
        setIsLoading(false);
        router.replace(MAIN_ROUTE);
        return;
      }

      try {
        const payload = decodeJWT<{ id: number; exp: number }>(storedToken);

        if (!payload) {
          throw new Error("Token inválido");
        }

        if (!payload.id) {
          throw new Error("ID de usuario no encontrado");
        }

        if (!payload.exp) {
          throw new Error("Token sin fecha de expiración");
        }

        if (payload.exp * 1000 < Date.now()) {
          throw new Error("Sesión expirada");
        }

        setUser(payload.id);
        setToken(storedToken);
      } catch (error) {
        console.error("Error verificando token:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);

        if (error instanceof Error) {
          toast.error(error.message);
        }

        if (!isPublicRoute) {
          router.replace(MAIN_ROUTE);
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [mounted, pathname, router]);

  const login = (newToken: string, userId: number) => {
    if (!newToken || !userId) {
      toast.error("Credenciales inválidas");
      return;
    }

    if (typeof newToken !== "string" || typeof userId !== "number") {
      toast.error("Datos inválidos");
      return;
    }

    setToken(newToken);
    setUser(userId);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userId));

    toast.success("Sesión iniciada correctamente");
    router.replace("/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Sesión cerrada");
    router.replace(MAIN_ROUTE);
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <Loader fullScreen size="xl" text="Verificando sesión..." />;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
