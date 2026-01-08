// src/components/checklist/CreateChecklistWizard.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ProgressIndicator from "./ProgressIndicator";
import Step1Appointment from "./steps/Step1Appointment";
import Step2Service from "./steps/Step2Service";
import Step3Photos from "./steps/Step3Photos";
import Step4Items from "./steps/Step4Items";
import {
  VehicleChecklist,
  ChecklistItem,
  Appointment,
  Service,
  ServiceCategory,
  VehicleImageData,
  ManualTechnicianData,
  ManualClientData,
} from "@/app/frontend/types/checklist.types";
import { GetClient, GetSession } from "@/app/backend/types/models/entity";
import { apiFetch } from "../../utils/apiFetch";

interface GetVehicleClient {
  id: number;
  brand: string;
  model: string;
  year: number;
  engineDisplacement: number;
  description: string | null;
  plates: string;
}

interface ManualVehicleData {
  brand: string;
  model: string;
  year: number;
  plates: string;
  engineDisplacement?: number;
  description?: string;
}

interface CreateChecklistWizardProps {
  appointments: Appointment[];
  services: Service[];
  serviceCategories: ServiceCategory[];
  clients: GetClient[];
  mechanics: GetSession[];
  loadingAppointments: boolean;
  loadingServices: boolean;
  onCreateChecklist: (
    formData: VehicleChecklist,
    items: ChecklistItem[],
    images: VehicleImageData[]
  ) => Promise<void>;
  onCancel: () => void;
}

export default function CreateChecklistWizard({
  appointments,
  services,
  serviceCategories,
  clients,
  mechanics,
  loadingAppointments,
  loadingServices,
  onCreateChecklist,
  onCancel,
}: CreateChecklistWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<VehicleChecklist>({
    checkType: "",
    fuelLevel: 50,
    mileage: "",
    generalNotes: "",
    technicianName: "",
    appointmentId: 0,
  });

  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState<ChecklistItem>({
    label: "",
    category: "",
    checked: false,
    condition: "",
    notes: "",
  });

  // Estados para modo manual
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualClientData, setManualClientData] = useState<ManualClientData>({
    id: 0,
    fullName: "",
    fullSurname: "",
    identified: "",
    clientContact: {
      phoneNumber: "",
      email: "",
    },
  });
  const [manualTechnicianData, setManualTechnicianData] =
    useState<ManualTechnicianData>({
      id: 0,
      name: "",
      identification: "",
    });

  // Estados para vehículos
  const [clientVehicles, setClientVehicles] = useState<GetVehicleClient[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [isManualVehicle, setIsManualVehicle] = useState(false);
  const [manualVehicleData, setManualVehicleData] = useState<ManualVehicleData>(
    {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      plates: "",
      engineDisplacement: 0,
      description: "",
    }
  );

  const [vehicleImages, setVehicleImages] = useState<VehicleImageData[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedMechanicId, setSelectedMechanicId] = useState<number | null>(
    null
  );

  // Efecto para cargar vehículos cuando se selecciona un cliente
  useEffect(() => {
    const loadClientVehicles = async () => {
      // Obtener el ID del cliente (ya sea de cita o manual)
      let clientId: number | null = null;

      if (!isManualMode && formData.appointmentId) {
        // Modo cita: obtener clientId de la cita
        const selectedAppointment = appointments.find(
          (apt) => apt.id === formData.appointmentId
        );

        clientId = selectedAppointment?.author.id || null;
      } else if (isManualMode && selectedClientId) {
        // Modo manual: usar el clientId seleccionado
        clientId = selectedClientId;
      }

      if (!clientId) {
        setClientVehicles([]);
        return;
      }

      try {
        setLoadingVehicles(true);
        const response = await apiFetch(`clientVehicle/${clientId}`);

        if (!response.ok) {
          throw new Error("Error al cargar vehículos");
        }

        const vehicles = await response.json();

        setClientVehicles(Array.isArray(vehicles) ? vehicles : [vehicles]);
      } catch (error) {
        console.error("Error loading vehicles:", error);
        toast.error("Error al cargar los vehículos del cliente");
        setClientVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    };

    loadClientVehicles();
  }, [formData.appointmentId, selectedClientId, isManualMode, appointments]);

  // Validaciones
  const canAdvanceToStep2 = () => {
    if (isManualMode) {
      return (
        manualClientData.fullName.trim() !== "" &&
        manualClientData.fullSurname.trim() !== "" &&
        manualClientData.identified.trim() !== "" &&
        manualTechnicianData.name.trim() !== ""
      );
    }
    return formData.appointmentId !== undefined && formData.appointmentId > 0;
  };

  const canAdvanceToStep3 = () => {
    const hasService =
      formData.checkType !== "" &&
      formData.mileage !== "" &&
      formData.mileage.length > 0;

    // Validar que tenga un vehículo (seleccionado o manual)
    const hasVehicle = isManualVehicle
      ? manualVehicleData.brand.trim() !== "" &&
        manualVehicleData.model.trim() !== "" &&
        manualVehicleData.plates.trim() !== ""
      : selectedVehicleId !== null;

    return hasService && hasVehicle;
  };

  const canCreateChecklist = () => canAdvanceToStep2() && canAdvanceToStep3();

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      checkType: "",
      fuelLevel: 50,
      mileage: "",
      generalNotes: "",
      technicianName: "",
      appointmentId: 0,
    });
    setItems([]);
    setNewItem({
      label: "",
      category: "",
      checked: false,
      condition: "",
      notes: "",
    });
    setVehicleImages([]);
    setIsManualMode(false);
    setManualClientData({
      id: 0,
      fullName: "",
      fullSurname: "",
      identified: "",
      clientContact: {
        phoneNumber: "",
        email: "",
      },
    });
    setManualTechnicianData({
      id: 0,
      name: "",
      identification: "",
    });
    setSelectedClientId(null);
    setSelectedMechanicId(null);
    setClientVehicles([]);
    setSelectedVehicleId(null);
    setIsManualVehicle(false);
    setManualVehicleData({
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      plates: "",
      engineDisplacement: 0,
      description: "",
    });
  };

  // Handlers de navegación
  const handleNextStep = () => {
    if (currentStep === 1 && !canAdvanceToStep2()) {
      if (isManualMode) {
        toast.error(
          "Completa todos los campos requeridos del cliente y técnico"
        );
      } else {
        toast.error("Debes seleccionar una cita para continuar");
      }
      return;
    }
    if (currentStep === 2 && !canAdvanceToStep3()) {
      toast.error(
        "Completa el tipo de servicio, kilometraje y vehículo para continuar"
      );
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Handlers de imágenes
  const handleAddImages = (files: FileList) => {
    const newImages: VehicleImageData[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        newImages.push({
          file,
          previewUrl,
          description: "",
        });
      }
    });
    setVehicleImages((prev) => [...prev, ...newImages]);
    toast.success(`${newImages.length} imagen(es) agregada(s)`);
  };

  const handleRemoveImage = (index: number) => {
    setVehicleImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
    toast.success("Imagen eliminada");
  };

  const handleUpdateImageDescription = (index: number, description: string) => {
    setVehicleImages((prev) => {
      const updated = [...prev];
      updated[index].description = description;
      return updated;
    });
  };

  // Handlers de items
  const handleAddItem = () => {
    if (!newItem.label || !newItem.category) {
      toast.error("El item debe tener un nombre y categoría");
      return;
    }
    setItems([...items, { ...newItem, id: Date.now() }]);
    setNewItem({
      label: "",
      category: "",
      checked: false,
      condition: "",
      notes: "",
    });
    toast.success("Item agregado correctamente");
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
    toast.success("Item eliminado");
  };

  // Handler principal de creación
  // Handler principal de creación
  const handleSubmit = async () => {
    if (!canCreateChecklist()) {
      toast.error("Por favor complete todos los pasos obligatorios");
      return;
    }

    setLoading(true);
    try {
      // Preparar el payload según el modo
      let checklistPayload: any = {
        checkType: formData.checkType,
        fuelLevel: formData.fuelLevel,
        mileage: formData.mileage,
        generalNotes: formData.generalNotes,
        technicianName: isManualMode
          ? manualTechnicianData.name
          : appointments.find((apt) => apt.id === formData.appointmentId)
              ?.employedAuthor?.name || "Sin asignar",
        vehicleId: isManualVehicle ? 0 : selectedVehicleId || 0,
      };

      if (isManualMode) {
        // Modo manual: agregar manualClientData y manualTechnicianData
        checklistPayload.manualClientData = {
          id: manualClientData.id,
          fullName: manualClientData.fullName,
          fullSurname: manualClientData.fullSurname,
          identified: manualClientData.identified,
          clientContact: manualClientData.clientContact,
        };

        checklistPayload.manualTechnicianData = {
          id: manualTechnicianData.id,
          name: manualTechnicianData.name,
          identification: manualTechnicianData.identification,
        };

        // Agregar vehículo manual si aplica
        if (isManualVehicle) {
          checklistPayload.manualVehicleData = {
            brand: manualVehicleData.brand,
            model: manualVehicleData.model,
            year: manualVehicleData.year,
            plates: manualVehicleData.plates,
            engineDisplacement: manualVehicleData.engineDisplacement || 0,
            description: manualVehicleData.description || null,
          };
        }
      } else {
        // Modo cita: agregar appointmentId
        checklistPayload.appointmentId = formData.appointmentId;

        // Agregar vehículo manual si aplica (también en modo cita)
        if (isManualVehicle) {
          checklistPayload.manualVehicleData = {
            brand: manualVehicleData.brand,
            model: manualVehicleData.model,
            year: manualVehicleData.year,
            plates: manualVehicleData.plates,
            engineDisplacement: manualVehicleData.engineDisplacement || 0,
            description: manualVehicleData.description || null,
          };
        }
      }

      console.log("=== Payload desde Wizard ===");
      console.log(JSON.stringify(checklistPayload, null, 2));

      await onCreateChecklist(checklistPayload, items, vehicleImages);

      // Reset del formulario después de crear exitosamente
      resetForm();
      toast.success("Checklist creado exitosamente");
    } catch (error) {
      console.error("Error creating checklist:", error);
      toast.error("Error al crear el checklist");
    } finally {
      setLoading(false);
    }
  };
  
  // Obtener información del técnico
  const selectedAppointment = appointments.find(
    (apt) => apt.id === formData.appointmentId
  );

  const technicianName = isManualMode
    ? manualTechnicianData.name
    : selectedAppointment?.employedAuthor?.name || "Sin asignar";

  const stepLabels = ["Cliente", "Servicio", "Fotos", "Items"];

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">
          Crear Nuevo Checklist
        </CardTitle>

        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={4}
          stepLabels={stepLabels}
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Información del Cliente */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Step1Appointment
              appointments={appointments}
              selectedAppointmentId={
                isManualMode ? null : formData.appointmentId
              }
              onSelectAppointment={(id) => {
                if (id) {
                  setIsManualMode(false);
                  setFormData({ ...formData, appointmentId: id });
                  setSelectedClientId(null);
                  setSelectedMechanicId(null);
                  setSelectedVehicleId(null);
                  setIsManualVehicle(false);
                } else {
                  setIsManualMode(true);
                  setFormData({ ...formData, appointmentId: undefined });
                }
              }}
              clients={clients}
              mechanics={mechanics}
              selectedClientId={selectedClientId}
              onSelectClient={setSelectedClientId}
              selectedMechanicId={selectedMechanicId}
              onSelectMechanic={setSelectedMechanicId}
              manualClientData={manualClientData}
              onManualClientChange={(data) => {
                setIsManualMode(true);
                setManualClientData(data);
                setFormData({ ...formData, appointmentId: undefined });
              }}
              manualTechnicianData={manualTechnicianData}
              onManualTechnicianChange={(data) => {
                setIsManualMode(true);
                setManualTechnicianData(data);
              }}
              loading={loadingAppointments}
            />

            <div className="flex justify-between pt-4 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!canAdvanceToStep2() || loading}
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Servicio y Vehículo */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Step2Service
              services={services}
              serviceCategories={serviceCategories}
              selectedServiceName={formData.checkType}
              onSelectService={(name) =>
                setFormData({ ...formData, checkType: name })
              }
              mileage={formData.mileage}
              onMileageChange={(mileage) =>
                setFormData({ ...formData, mileage })
              }
              fuelLevel={formData.fuelLevel}
              onFuelLevelChange={(level) =>
                setFormData({ ...formData, fuelLevel: level })
              }
              generalNotes={formData.generalNotes}
              onGeneralNotesChange={(notes) =>
                setFormData({ ...formData, generalNotes: notes })
              }
              technicianName={technicianName}
              loading={loadingServices}
              // Props de vehículo
              clientVehicles={clientVehicles}
              loadingVehicles={loadingVehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
              isManualVehicle={isManualVehicle}
              onToggleManualVehicle={(value) => {
                setIsManualVehicle(value);
                if (value) {
                  setSelectedVehicleId(null);
                }
              }}
              manualVehicleData={manualVehicleData}
              onManualVehicleChange={setManualVehicleData}
            />

            <div className="flex justify-between pt-4 border-t dark:border-gray-700">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={loading}
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!canAdvanceToStep3() || loading}
              >
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Fotos */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Step3Photos
              images={vehicleImages}
              onAddImages={handleAddImages}
              onRemoveImage={handleRemoveImage}
              onUpdateDescription={handleUpdateImageDescription}
            />

            <div className="flex justify-between pt-4 border-t dark:border-gray-700">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={loading}
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              <Button onClick={handleNextStep} disabled={loading}>
                Siguiente
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Items */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Step4Items
              items={items}
              newItem={newItem}
              onNewItemChange={setNewItem}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t dark:border-gray-700">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={loading}
                className="sm:w-auto dark:bg-gray-800 dark:border-gray-700"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={loading}
                className="sm:w-auto dark:bg-gray-800 dark:border-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !canCreateChecklist()}
                className="flex-1 sm:flex-initial sm:ml-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando checklist...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Crear Checklist
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
