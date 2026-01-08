// src/components/checklist/VehicleChecklistManager.tsx

"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import CreateChecklistWizard from "./CreateChecklistWizard";
import ChecklistsList from "./ChecklistList";
import ChecklistDetail from "./ChecklistDetail";
import ImageDialog from "./ImageDialog";
import DeleteDialog from "./DeleteDialog";
import {
  VehicleChecklist,
  ChecklistItem,
  Appointment,
  Service,
  ServiceCategory,
  VehicleImageData,
  ManualClientData,
  ManualTechnicianData,
} from "@/app/frontend/types/checklist.types";
import { GetClient, GetSession } from "@/app/backend/types/models/entity";
import { apiFetch } from "../../utils/apiFetch";

export default function VehicleChecklistManager() {
  // Estados principales
  const [activeTab, setActiveTab] = useState("create");
  const [wizardKey, setWizardKey] = useState(0);
  const [checklists, setChecklists] = useState<VehicleChecklist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [clients, setClients] = useState<GetClient[]>([]);
  const [mechanics, setMechanics] = useState<GetSession[]>([]);
  const [selectedChecklist, setSelectedChecklist] =
    useState<VehicleChecklist | null>(null);

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingMechanics, setLoadingMechanics] = useState(false);

  // Estados para diálogos
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imageDialog, setImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  // ===== EFECTOS =====
  useEffect(() => {
    loadChecklists();
  }, []);

  useEffect(() => {
    if (activeTab === "create") {
      if (appointments.length === 0) fetchAppointments();
      if (services.length === 0) fetchServices();
      if (serviceCategories.length === 0) fetchServiceCategories();
      if (clients.length === 0) fetchClients();
      if (mechanics.length === 0) fetchMechanics();
    }
  }, [activeTab]);

  // ===== FUNCIONES DE API =====
  const fetchAppointments = async () => {
    try {
      setLoadingAppointments(true);
      const response = await apiFetch("appointment");
      if (!response.ok) throw new Error("Error al cargar las citas");

      const data = await response.json();
      const availableAppointments = data.filter(
        (apt: Appointment) =>
          apt.appointmentState === "ASIGNADA" ||
          apt.appointmentState === "PENDIENTE"
      );
      setAppointments(availableAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Error al cargar las citas disponibles");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await apiFetch("servicesPage");
      if (!response.ok) throw new Error("Error al cargar los servicios");

      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Error al cargar los servicios disponibles");
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const response = await apiFetch("servicesCategory");
      if (!response.ok) throw new Error("Error al cargar las categorías");

      const data = await response.json();
      setServiceCategories(data);
    } catch (err) {
      console.error("Error fetching service categories:", err);
    }
  };

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await apiFetch("clientPage");
      if (!response.ok) throw new Error("Error al cargar los clientes");

      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast.error("Error al cargar los clientes disponibles");
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchMechanics = async () => {
    try {
      setLoadingMechanics(true);
      const response = await apiFetch("user");
      if (!response.ok) throw new Error("Error al cargar los mecánicos");

      const data = await response.json();
      // Filtrar solo los usuarios con role MECANICO
      const mechanicsOnly = data.filter(
        (user: GetSession) => user.role === "MECANICO"
      );
      setMechanics(mechanicsOnly);
    } catch (err) {
      console.error("Error fetching mechanics:", err);
      toast.error("Error al cargar los mecánicos disponibles");
    } finally {
      setLoadingMechanics(false);
    }
  };

  const loadChecklists = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("checklist/vehicleCheck", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al cargar checklists");

      let data = await response.json();

      // Cargar appointments si no vienen en la respuesta
      if (data.length > 0 && !data[0].appointment && data[0].appointmentId) {
        try {
          const appointmentsResponse = await apiFetch("appointment");
          if (appointmentsResponse.ok) {
            const allAppointments = await appointmentsResponse.json();
            data = data.map((checklist: VehicleChecklist) => {
              if (checklist.appointmentId) {
                const appointment = allAppointments.find(
                  (apt: Appointment) => apt.id === checklist.appointmentId
                );
                return { ...checklist, appointment };
              }
              return checklist;
            });
          }
        } catch (err) {
          console.error("Error al cargar appointments:", err);
        }
      }

      setChecklists(data);
    } catch (err) {
      console.error("Error al cargar checklists:", err);
      toast.error("Error al cargar los checklists");
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLERS =====
  const handleCreateChecklist = async (
    formData: any,
    items: ChecklistItem[],
    vehicleImages: VehicleImageData[]
  ) => {
    try {
      // Construir el payload según el tipo CreateChecklist del backend
      const checklistPayload: any = {
        checkType: formData.checkType,
        fuelLevel: formData.fuelLevel,
        mileage: formData.mileage,
        generalNotes: formData.generalNotes,
        technicianName: formData.technicianName || "Sin asignar",
        vehicleId: formData.vehicleId || 0, // vehicleId es obligatorio en el tipo
      };

      // Agregar appointmentId si existe (modo cita)
      if (formData.appointmentId) {
        const selectedAppointment = appointments.find(
          (apt) => apt.id === formData.appointmentId
        );

        checklistPayload.appointmentId = formData.appointmentId;
        checklistPayload.technicianName =
          selectedAppointment?.employedAuthor?.name || "Sin asignar";
      }

      // Agregar manualVehicleData si existe
      if (formData.manualVehicleData) {
        checklistPayload.manualVehicleData = {
          brand: formData.manualVehicleData.brand,
          model: formData.manualVehicleData.model,
          year: formData.manualVehicleData.year,
          plates: formData.manualVehicleData.plates,
          engineDisplacement:
            formData.manualVehicleData.engineDisplacement || 0,
          description: formData.manualVehicleData.description || null,
        };
        // Si hay vehículo manual, vehicleId debe ser 0
        checklistPayload.vehicleId = 0;
      }

      // Agregar manualClientData si existe (modo manual)
      if (formData.manualClientData) {
        checklistPayload.manualClientData = {
          id: formData.manualClientData.id,
          fullName: formData.manualClientData.fullName,
          fullSurname: formData.manualClientData.fullSurname,
          identified: formData.manualClientData.identified,
          clientContact: formData.manualClientData.clientContact || undefined,
        };
      }

      // Agregar manualTechnicianData si existe (modo manual)
      if (formData.manualTechnicianData) {
        checklistPayload.manualTechnicianData = {
          id: formData.manualTechnicianData.id,
          name: formData.manualTechnicianData.name,
          identification: formData.manualTechnicianData.identification,
        };
        checklistPayload.technicianName = formData.manualTechnicianData.name;
      }

      console.log("=== Payload a enviar al backend ===");
      console.log(JSON.stringify(checklistPayload, null, 2));

      // Crear checklist
      const checklistResponse = await apiFetch("checklist/vehicleCheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checklistPayload),
      });

      if (!checklistResponse.ok) {
        const errorData = await checklistResponse.json();
        throw new Error(errorData.error || "Error al crear checklist");
      }

      const createdChecklist = await checklistResponse.json();
      console.log("✅ Checklist creado:", createdChecklist);

      // Subir imágenes
      if (vehicleImages.length > 0) {
        try {
          await uploadVehicleImages(createdChecklist.id, vehicleImages);
        } catch (imgError) {
          console.error("Error al subir imágenes:", imgError);
          toast.warning(
            "Checklist creado, pero hubo un error al subir algunas imágenes"
          );
        }
      }

      // Guardar items
      if (items.length > 0) {
        for (const item of items) {
          try {
            const itemPayload = {
              label: item.label,
              category: item.category,
              checked: item.checked,
              condition: item.condition || "",
              notes: item.notes || "",
              checklistId: createdChecklist.id,
            };

            await apiFetch("checklist/itemCheck", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(itemPayload),
            });
          } catch (itemError) {
            console.error("Error al guardar item:", itemError);
          }
        }
      }

      toast.success("¡Checklist creado exitosamente!");
      loadChecklists();
      setActiveTab("list");
    } catch (err) {
      console.error("❌ Error completo:", err);
      toast.error(
        err instanceof Error ? err.message : "Error al crear checklist"
      );
      throw err;
    }
  };

  const uploadVehicleImages = async (
    checklistId: number,
    vehicleImages: VehicleImageData[]
  ) => {
    if (vehicleImages.length === 0) return true;

    for (const imageData of vehicleImages) {
      const formData = new FormData();
      formData.append("id", checklistId.toString());
      formData.append("image", imageData.file);
      if (imageData.description) {
        formData.append("description", imageData.description);
      }

      const response = await apiFetch("checklist/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir imagen: ${imageData.file.name}`);
      }
    }

    return true;
  };

  const handleViewChecklist = async (id: number) => {
    try {
      setLoading(true);
      const response = await apiFetch(`checklist/vehicleCheck/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al cargar checklist");

      const data = await response.json();
      console.log("Checklist detalle:", data);
      setSelectedChecklist(data);
      setActiveTab("view");
    } catch (err) {
      toast.error("Error al cargar el checklist");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);
      const response = await apiFetch(`checklist/vehicleCheck/${deletingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Error al eliminar checklist");

      toast.success("Checklist eliminado exitosamente");
      loadChecklists();
      setDeleteDialog(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Error al eliminar checklist");
    } finally {
      setDeleting(false);
    }
  };

  const handleOpenImage = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setImageIndex(index);
    setImageDialog(true);
  };

  const handleResetForm = () => {
    setWizardKey((prev) => prev + 1);
    setActiveTab("create");
  };

  return (
    <div className="w-full min-h-screen bg-background dark:bg-gray-950 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Inspecciones de Vehículos
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Crea y gestiona checklists de inspección
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 h-auto dark:bg-gray-900 dark:border-gray-800">
            <TabsTrigger
              value="create"
              className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-3 dark:data-[state=active]:bg-gray-800"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Crear Nuevo</span>
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-3 dark:data-[state=active]:bg-gray-800"
            >
              <FileText className="h-5 w-5" />
              <span className="text-sm font-medium">Ver Checklists</span>
            </TabsTrigger>
            <TabsTrigger
              value="view"
              className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-3 dark:data-[state=active]:bg-gray-800"
              disabled={!selectedChecklist}
            >
              <Eye className="h-5 w-5" />
              <span className="text-sm font-medium">Detalle</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB: CREAR CHECKLIST */}
          <TabsContent value="create">
            <CreateChecklistWizard
              key={wizardKey}
              appointments={appointments}
              services={services}
              serviceCategories={serviceCategories}
              clients={clients}
              mechanics={mechanics}
              loadingAppointments={loadingAppointments}
              loadingServices={loadingServices}
              onCreateChecklist={handleCreateChecklist}
              onCancel={handleResetForm}
            />
          </TabsContent>

          {/* TAB: LISTA DE CHECKLISTS */}
          <TabsContent value="list">
            <ChecklistsList
              checklists={checklists}
              loading={loading}
              onView={handleViewChecklist}
              onDelete={handleDeleteClick}
              onCreateNew={() => setActiveTab("create")}
            />
          </TabsContent>

          {/* TAB: DETALLE DEL CHECKLIST */}
          <TabsContent value="view">
            <ChecklistDetail
              checklist={selectedChecklist}
              loading={loading}
              onBack={() => setActiveTab("list")}
              onImageClick={handleOpenImage}
            />
          </TabsContent>
        </Tabs>

        {/* Diálogo de visualización de imagen */}
        <ImageDialog
          open={imageDialog}
          onOpenChange={setImageDialog}
          images={selectedChecklist?.vehicleImage || []}
          currentIndex={imageIndex}
          onIndexChange={setImageIndex}
        />

        {/* Diálogo de eliminación */}
        <DeleteDialog
          open={deleteDialog}
          onOpenChange={setDeleteDialog}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      </div>
    </div>
  );
}
