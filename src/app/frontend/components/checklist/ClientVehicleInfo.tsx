// src/components/checklist/ClientVehicleInfo.tsx

import {
  User,
  Car,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";
import { Appointment } from "@/app/frontend/types/checklist.types";

interface Client {
  id: number;
  fullName: string;
  fullSurname: string;
  identified: string;
  clientState: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: number;
  name: string;
  identificacion: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface ClientVehicleInfoProps {
  appointment?: Appointment;
  client?: Client | null;
  session?: Session | null;
}

export default function ClientVehicleInfo({
  appointment,
  client,
  session,
}: ClientVehicleInfoProps) {
  // Determinar si es modo cita o modo manual
  const isFromAppointment = !!appointment;
  const isManual = !isFromAppointment && (client || session);

  return (
    <div className="space-y-4">
      {/* Modo: Desde Cita */}
      {isFromAppointment && appointment && (
        <>
          {/* Información de la Cita */}
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
            <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Información de la Cita
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-purple-700 dark:text-purple-400 mb-0.5">
                  ID de Cita:
                </p>
                <p className="text-purple-900 dark:text-purple-200 font-bold">
                  #{appointment.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-purple-700 dark:text-purple-400 mb-0.5">
                  Estado:
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  {appointment.appointmentState}
                </span>
              </div>
              {appointment.appointmentDate && (
                <div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mb-0.5">
                    Fecha:
                  </p>
                  <p className="text-purple-900 dark:text-purple-200">
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              )}
              {appointment.ubicacion && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mb-0.5">
                      Ubicación:
                    </p>
                    <p className="text-purple-900 dark:text-purple-200">
                      {appointment.ubicacion}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Cliente desde Cita */}
            {appointment.author && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
                <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                      Nombre:
                    </p>
                    <p className="text-blue-900 dark:text-blue-200 font-semibold">
                      {appointment.author.fullName}{" "}
                      {appointment.author.fullSurname}
                    </p>
                  </div>
                  {appointment.author.identified && (
                    <div>
                      <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                        Identificación:
                      </p>
                      <p className="text-blue-900 dark:text-blue-200">
                        {appointment.author.identified}
                      </p>
                    </div>
                  )}
                  {appointment.author.email && (
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                          Email:
                        </p>
                        <p className="text-blue-900 dark:text-blue-200 break-all">
                          {appointment.author.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {appointment.author.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                          Teléfono:
                        </p>
                        <p className="text-blue-900 dark:text-blue-200">
                          {appointment.author.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vehículo desde Cita */}
            {appointment.vehicle && (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                <h3 className="font-semibold text-sm text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Información del Vehículo
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                      Vehículo:
                    </p>
                    <p className="text-green-900 dark:text-green-200 font-bold text-base">
                      {appointment.vehicle.brand} {appointment.vehicle.model}{" "}
                      {appointment.vehicle.year}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                        Placa:
                      </p>
                      <p className="text-green-900 dark:text-green-200 font-bold">
                        {appointment.vehicle.licensePlate}
                      </p>
                    </div>
                    {appointment.vehicle.color && (
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                          Color:
                        </p>
                        <p className="text-green-900 dark:text-green-200">
                          {appointment.vehicle.color}
                        </p>
                      </div>
                    )}
                  </div>
                  {appointment.vehicle.vin && (
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                        VIN:
                      </p>
                      <p className="text-green-900 dark:text-green-200 text-xs break-all font-mono">
                        {appointment.vehicle.vin}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modo: Manual */}
      {isManual && (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Cliente Manual */}
          {client && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
              <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Cliente (Ingreso Manual)
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                    Nombre:
                  </p>
                  <p className="text-blue-900 dark:text-blue-200 font-semibold">
                    {client.fullName} {client.fullSurname}
                  </p>
                </div>
                {client.identified && (
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                      Identificación:
                    </p>
                    <p className="text-blue-900 dark:text-blue-200">
                      {client.identified}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-0.5">
                    Estado:
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      client.clientState
                        ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {client.clientState ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mecánico Manual */}
          {session && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
              <h3 className="font-semibold text-sm text-amber-900 dark:text-amber-300 mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Mecánico Asignado
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-0.5">
                    Nombre:
                  </p>
                  <p className="text-amber-900 dark:text-amber-200 font-semibold">
                    {session.name}
                  </p>
                </div>
                {session.identificacion && (
                  <div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mb-0.5">
                      Identificación:
                    </p>
                    <p className="text-amber-900 dark:text-amber-200">
                      {session.identificacion}
                    </p>
                  </div>
                )}
                {session.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-700 dark:text-amber-400 mb-0.5">
                        Email:
                      </p>
                      <p className="text-amber-900 dark:text-amber-200 break-all">
                        {session.email}
                      </p>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-0.5">
                    Rol:
                  </p>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    {session.role}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mensaje cuando no hay información */}
      {!isFromAppointment && !isManual && (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No hay información de cliente disponible
          </p>
        </div>
      )}
    </div>
  );
}
