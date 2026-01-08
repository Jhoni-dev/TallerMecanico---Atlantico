// src/components/checklist/steps/Step2Service.tsx

import { Info, Car } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ServiceSelector from "../ServiceSelector";
import FuelLevelControl from "../FuelLevelControl";
import VehicleSelector from "../VehicleSelector";
import { Service, ServiceCategory } from "@/app/frontend/types/checklist.types";

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

interface Step2ServiceProps {
  services: Service[];
  serviceCategories: ServiceCategory[];
  selectedServiceName: string;
  onSelectService: (serviceName: string) => void;
  mileage: string;
  onMileageChange: (mileage: string) => void;
  fuelLevel: number;
  onFuelLevelChange: (level: number) => void;
  generalNotes: string;
  onGeneralNotesChange: (notes: string) => void;
  technicianName: string;
  loading?: boolean;
  // Props de vehículo
  clientVehicles: GetVehicleClient[];
  loadingVehicles: boolean;
  selectedVehicleId: number | null;
  onSelectVehicle: (vehicleId: number | null) => void;
  isManualVehicle: boolean;
  onToggleManualVehicle: (value: boolean) => void;
  manualVehicleData: ManualVehicleData;
  onManualVehicleChange: (data: ManualVehicleData) => void;
}

export default function Step2Service({
  services,
  serviceCategories,
  selectedServiceName,
  onSelectService,
  mileage,
  onMileageChange,
  fuelLevel,
  onFuelLevelChange,
  generalNotes,
  onGeneralNotesChange,
  technicianName,
  loading = false,
  clientVehicles,
  loadingVehicles,
  selectedVehicleId,
  onSelectVehicle,
  isManualVehicle,
  onToggleManualVehicle,
  manualVehicleData,
  onManualVehicleChange,
}: Step2ServiceProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300">
            Paso 2: Información del Servicio y Vehículo
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Selecciona el tipo de servicio, el vehículo y completa los datos
          </p>
        </div>
      </div>

      {/* Tipo de Servicio */}
      <ServiceSelector
        services={services}
        serviceCategories={serviceCategories}
        selectedServiceName={selectedServiceName}
        onSelectService={onSelectService}
        loading={loading}
      />

      {/* Selector de Vehículo */}
      <VehicleSelector
        clientVehicles={clientVehicles}
        loadingVehicles={loadingVehicles}
        selectedVehicleId={selectedVehicleId}
        onSelectVehicle={onSelectVehicle}
        isManualVehicle={isManualVehicle}
        onToggleManualVehicle={onToggleManualVehicle}
        manualVehicleData={manualVehicleData}
        onManualVehicleChange={onManualVehicleChange}
      />

      {/* Kilometraje y Técnico */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage" className="text-base font-semibold">
            Kilometraje *
          </Label>
          <Input
            id="mileage"
            value={mileage}
            onChange={(e) => onMileageChange(e.target.value)}
            placeholder="Ej: 50000"
            className="text-sm dark:bg-gray-800 dark:border-gray-700"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="technicianName" className="text-base font-semibold">
            Técnico Asignado
          </Label>
          <Input
            id="technicianName"
            value={technicianName}
            className="bg-muted dark:bg-gray-800 text-sm"
            readOnly
            disabled
          />
        </div>
      </div>

      {/* Nivel de Combustible */}
      <FuelLevelControl fuelLevel={fuelLevel} onChange={onFuelLevelChange} />

      {/* Notas Generales */}
      <div className="space-y-2">
        <Label htmlFor="generalNotes" className="text-base font-semibold">
          Notas Generales (Opcional)
        </Label>
        <Textarea
          id="generalNotes"
          value={generalNotes}
          onChange={(e) => onGeneralNotesChange(e.target.value)}
          placeholder="Observaciones adicionales sobre el vehículo o el servicio..."
          rows={3}
          className="text-sm dark:bg-gray-800 dark:border-gray-700"
        />
      </div>
    </div>
  );
}
