// components/nav-user/hooks/useUserData.tsx

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/frontend/utils/apiFetch";
import { toast } from "sonner";
import { useAuth } from "@/context/usercontext";
import type { UserData, UpdateUserData } from "../types/userMenu.types";

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch(`user/${user}`);

        if (!response.ok) {
          throw new Error("Error al cargar los datos del usuario");
        }

        const data: UserData = await response.json();
        setUserData(data);
        setFormData({
          name: data.name,
          email: data.email
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al cargar los datos del usuario"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!userData) return;

    const changes =
      formData.name !== userData.name ||
      formData.email !== userData.email

    setHasChanges(changes);
  }, [formData, userData]);

  const handleInputChange = (field: keyof UpdateUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!userData || !hasChanges) return;

    try {
      setIsSaving(true);

      const updateData: UpdateUserData = {};
      if (formData.name !== userData.name) updateData.name = formData.name;
      if (formData.email !== userData.email) updateData.email = formData.email;

      const response = await apiFetch(`user/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los datos");
      }

      const updatedData: UserData = await response.json();
      setUserData(updatedData);
      setFormData({
        name: updatedData.name,
        email: updatedData.email
      });

      toast.success("Datos actualizados correctamente");
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar los datos"
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (!userData) return;

    setFormData({
      name: userData.name,
      email: userData.email
    });
  };

  return {
    userData,
    formData,
    isLoading,
    isSaving,
    hasChanges,
    handleInputChange,
    handleSaveChanges,
    handleCancelEdit,
  };
}
