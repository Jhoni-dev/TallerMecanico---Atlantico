// src/components/clients/ClientVehicleManager.tsx

"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useClients } from "@/app/frontend/hooks/useCients";
import { useVehicles } from "@/app/frontend/hooks/useVehicles";
import {
  API_ENDPOINTS,
  DEFAULT_ITEMS_PER_PAGE,
} from "@/app/frontend/constants/client.constants";
import {
  Client,
  ClientVehicle,
  ClientFormData,
  ContactFormData,
  VehicleFormData,
  CreateClientPayload,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from "@/app/frontend/types/client.types";
import { SearchBar } from "./SearchBar";
import { ClientList } from "./ClientList";
import { Pagination } from "./Pagination";
import { ClientModal } from "./ClientModal";
import { ContactModal } from "./ContactModal";
import { VehicleModal } from "./VehicleModal";
import { DeleteDialog } from "./DeleteDialog";
import { ExportButtons } from "./ExportButtons";
import { apiFetch } from "../../utils/apiFetch";

export default function ClientVehicleManager() {
  const { clients, loading, fetchClients } = useClients();
  const { vehicles, fetchVehicles, getClientVehiclesWithIds } =
    useVehicles(clients);

  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  // Estados de modales
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Estados de selección
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<ClientVehicle | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Estados de formularios
  const [clientForm, setClientForm] = useState<ClientFormData>({
    fullName: "",
    fullSurname: "",
    identified: "",
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [contactForm, setContactForm] = useState<ContactFormData>({
    phoneNumber: "",
    email: "",
    address: "",
  });

  const [vehicleForm, setVehicleForm] = useState<VehicleFormData>({
    brand: "",
    model: "",
    year: "",
    engineDisplacement: "",
    plates: "",
    description: "",
    clientId: null,
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchClients();
    fetchVehicles();
  }, []);

  // Resetear página cuando cambia búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // ===== FUNCIONES DE FILTRADO =====
  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.fullSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.identified.includes(searchTerm) ||
      client.clientContact.some((c) =>
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      client.clientVehicle.some((v) =>
        v.plates?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // ===== PAGINACIÓN =====
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  // ===== HANDLERS CRUD - CLIENTES =====
  const handleClientSubmit = async () => {
    try {
      if (selectedClient?.id) {
        toast.warning(
          "La edición de clientes se hace desde el modal de contacto"
        );
        setClientModalOpen(false);
        return;
      }

      const payload: CreateClientPayload = {
        fullName: clientForm.fullName,
        fullSurname: clientForm.fullSurname,
        identified: clientForm.identified,
        clientContact: {
          phoneNumber: clientForm.phoneNumber,
          email: clientForm.email,
          ...(clientForm.address && { address: clientForm.address }),
        },
      };

      const response = await apiFetch(API_ENDPOINTS.CLIENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error creating client");

      toast.success("Cliente creado exitosamente");
      await fetchClients();
      resetClientForm();
      setClientModalOpen(false);
    } catch (error) {
      console.error("Error en handleClientSubmit:", error);
      toast.error("Error al crear el cliente");
    }
  };

  // ===== HANDLERS CRUD - CONTACTO =====
  const handleContactSubmit = async () => {
    try {
      if (!selectedClient?.id) return;

      const updatePayload = {
        phoneNumber: contactForm.phoneNumber,
        email: contactForm.email,
        address: contactForm.address || null,
        clientState: true,
      };

      const response = await apiFetch(
        `${API_ENDPOINTS.CLIENT}/${selectedClient.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) throw new Error("Error updating contact");

      toast.success("Contacto actualizado exitosamente");
      await fetchClients();
      setContactModalOpen(false);
    } catch (error) {
      console.error("Error en handleContactSubmit:", error);
      toast.error("Error al actualizar el contacto");
    }
  };

  // ===== HANDLERS CRUD - VEHÍCULOS =====
  const handleVehicleSubmit = async () => {
    try {
      if (selectedVehicle?.id && selectedVehicle.id > 0) {
        const updatePayload: UpdateVehiclePayload = {
          brand: vehicleForm.brand,
          model: vehicleForm.model,
          year: parseInt(vehicleForm.year),
          engineDisplacement: parseInt(vehicleForm.engineDisplacement),
          plates: vehicleForm.plates,
          ...(vehicleForm.description && {
            description: vehicleForm.description,
          }),
        };

        const response = await apiFetch(
          `${API_ENDPOINTS.VEHICLE}/${selectedVehicle.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          }
        );

        if (!response.ok) throw new Error("Error updating vehicle");

        toast.success("Vehículo actualizado exitosamente");
      } else {
        const payload: CreateVehiclePayload = {
          brand: vehicleForm.brand,
          model: vehicleForm.model,
          year: parseInt(vehicleForm.year),
          engineDisplacement: parseInt(vehicleForm.engineDisplacement),
          plates: vehicleForm.plates,
          ...(vehicleForm.description && {
            description: vehicleForm.description,
          }),
          clientId: vehicleForm.clientId!,
        };

        const response = await apiFetch(API_ENDPOINTS.VEHICLE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error creating vehicle");

        toast.success("Vehículo creado exitosamente");
      }

      await fetchVehicles();
      await fetchClients();
      resetVehicleForm();
      setVehicleModalOpen(false);
    } catch (error) {
      console.error("Error en handleVehicleSubmit:", error);
      toast.error("Error al guardar el vehículo");
    }
  };

  // ===== HANDLER ELIMINACIÓN =====
  const handleDelete = async () => {
    try {
      if (deleteTarget.type === "client") {
        const response = await apiFetch(
          `${API_ENDPOINTS.CLIENT}/${deleteTarget.id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Error deleting client");

        toast.success("Cliente eliminado exitosamente");
        await fetchClients();
        await fetchVehicles();
      } else if (deleteTarget.type === "vehicle" && deleteTarget.id > 0) {
        const response = await apiFetch(
          `${API_ENDPOINTS.VEHICLE}/${deleteTarget.id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Error deleting vehicle");

        toast.success("Vehículo eliminado exitosamente");
        await fetchVehicles();
        await fetchClients();
      }

      setDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error en handleDelete:", error);
      toast.error("Error al eliminar");
    }
  };

  // ===== FUNCIONES AUXILIARES =====
  const resetClientForm = () => {
    setClientForm({
      fullName: "",
      fullSurname: "",
      identified: "",
      phoneNumber: "",
      email: "",
      address: "",
    });
    setSelectedClient(null);
  };

  const resetContactForm = () => {
    setContactForm({
      phoneNumber: "",
      email: "",
      address: "",
    });
  };

  const resetVehicleForm = () => {
    setVehicleForm({
      brand: "",
      model: "",
      year: "",
      engineDisplacement: "",
      plates: "",
      description: "",
      clientId: null,
    });
    setSelectedVehicle(null);
  };

  const editClient = (client: Client) => {
    setSelectedClient(client);
    const contact = client.clientContact[0] || {};
    setClientForm({
      fullName: client.fullName,
      fullSurname: client.fullSurname,
      identified: client.identified,
      phoneNumber: contact.phoneNumber || "",
      email: contact.email || "",
      address: contact.address || "",
    });
    setClientModalOpen(true);
  };

  const editContact = (client: Client) => {
    setSelectedClient(client);
    const contact = client.clientContact[0] || {};
    setContactForm({
      phoneNumber: contact.phoneNumber || "",
      email: contact.email || "",
      address: contact.address || "",
    });
    setContactModalOpen(true);
  };

  const editVehicle = (vehicle: ClientVehicle, clientId: number) => {
    setSelectedVehicle(vehicle);
    setVehicleForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      engineDisplacement: vehicle.engineDisplacement.toString(),
      plates: vehicle.plates || "",
      description: vehicle.description || "",
      clientId: clientId,
    });
    setVehicleModalOpen(true);
  };

  const openDeleteDialog = (target: any, type: string) => {
    if (!target.id || (type === "vehicle" && target.id <= 0)) {
      toast.error("No se puede eliminar este elemento");
      return;
    }

    setDeleteTarget({ ...target, type });
    setDeleteDialogOpen(true);
  };

  const handleAddVehicle = (clientId: number) => {
    resetVehicleForm();
    setVehicleForm({
      brand: "",
      model: "",
      year: "",
      engineDisplacement: "",
      plates: "",
      description: "",
      clientId: clientId,
    });
    setVehicleModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
          Gestión de Clientes y Vehículos
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Administra clientes y vehículos del taller
        </p>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl">Clientes</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Gestiona la información de tus clientes
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  resetClientForm;
                  setClientModalOpen(true); // ✅ Agregar esta línea
                }}
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Nuevo Cliente</span>
                <span className="sm:hidden">Nuevo</span>
              </Button>
              <ExportButtons clients={clients} vehicles={vehicles} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-6">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />

          <ClientList
            clients={currentClients}
            searchTerm={searchTerm}
            getClientVehicles={getClientVehiclesWithIds}
            onViewClient={editClient}
            onEditContact={editContact}
            onDeleteClient={(client) => openDeleteDialog(client, "client")}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={editVehicle}
            onDeleteVehicle={(vehicle) => openDeleteDialog(vehicle, "vehicle")}
          />

          {filteredClients.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredClients.length}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <ClientModal
        open={clientModalOpen}
        onOpenChange={(open) => {
          setClientModalOpen(open);
          if (!open) resetClientForm();
        }}
        client={selectedClient}
        formData={clientForm}
        onFormChange={(data) => setClientForm({ ...clientForm, ...data })}
        onSubmit={handleClientSubmit}
      />

      <ContactModal
        open={contactModalOpen}
        onOpenChange={(open) => {
          setContactModalOpen(open);
          if (!open) resetContactForm();
        }}
        formData={contactForm}
        onFormChange={(data) => setContactForm({ ...contactForm, ...data })}
        onSubmit={handleContactSubmit}
      />

      <VehicleModal
        open={vehicleModalOpen}
        onOpenChange={(open) => {
          setVehicleModalOpen(open);
          if (!open) resetVehicleForm();
        }}
        vehicle={selectedVehicle}
        formData={vehicleForm}
        onFormChange={(data) => setVehicleForm({ ...vehicleForm, ...data })}
        onSubmit={handleVehicleSubmit}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        type={deleteTarget?.type}
        disabled={
          deleteTarget?.type === "vehicle" &&
          (!deleteTarget?.id || deleteTarget?.id <= 0)
        }
      />
    </div>
  );
}
