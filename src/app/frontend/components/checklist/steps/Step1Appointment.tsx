// src/components/checklist/steps/Step1Appointment.tsx

import { Info } from "lucide-react";
import AppointmentSelector from "../AppointmentSelector";
import {
  Appointment,
  ManualClientData,
  ManualTechnicianData,
} from "@/app/frontend/types/checklist.types";
import { GetClient, GetSession } from "@/app/backend/types/models/entity";

interface Step1AppointmentProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  onSelectAppointment: (appointmentId: number | null) => void;
  clients: GetClient[];
  mechanics: GetSession[];
  selectedClientId?: number | null;
  onSelectClient?: (clientId: number | null) => void;
  selectedMechanicId?: number | null;
  onSelectMechanic?: (mechanicId: number | null) => void;
  manualClientData?: ManualClientData;
  onManualClientChange?: (data: ManualClientData) => void;
  manualTechnicianData?: ManualTechnicianData;
  onManualTechnicianChange?: (data: ManualTechnicianData) => void;
  loading?: boolean;
}

export default function Step1Appointment({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  clients,
  mechanics,
  selectedClientId,
  onSelectClient,
  selectedMechanicId,
  onSelectMechanic,
  manualClientData,
  onManualClientChange,
  manualTechnicianData,
  onManualTechnicianChange,
  loading = false,
}: Step1AppointmentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300">
            Paso 1: Información del Cliente y Técnico
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Selecciona una cita existente o ingresa los datos manualmente
          </p>
        </div>
      </div>

      <AppointmentSelector
        appointments={appointments}
        selectedAppointmentId={selectedAppointmentId}
        onSelectAppointment={onSelectAppointment}
        clients={clients}
        mechanics={mechanics}
        selectedClientId={selectedClientId}
        onSelectClient={onSelectClient}
        selectedMechanicId={selectedMechanicId}
        onSelectMechanic={onSelectMechanic}
        manualClientData={manualClientData}
        onManualClientChange={onManualClientChange}
        manualTechnicianData={manualTechnicianData}
        onManualTechnicianChange={onManualTechnicianChange}
        loading={loading}
      />
    </div>
  );
}
