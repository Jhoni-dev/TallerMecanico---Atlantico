// src/components/clients/ClientList.tsx

import { User } from "lucide-react";
import { Client, ClientVehicle } from "@/app/frontend/types/client.types";
import { ClientCard } from "./ClientCard";

interface ClientListProps {
  clients: Client[];
  searchTerm: string;
  getClientVehicles: (clientId: number) => ClientVehicle[];
  onViewClient: (client: Client) => void;
  onEditContact: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onAddVehicle: (clientId: number) => void;
  onEditVehicle: (vehicle: ClientVehicle, clientId: number) => void;
  onDeleteVehicle: (vehicle: ClientVehicle) => void;
}

export function ClientList({
  clients,
  searchTerm,
  getClientVehicles,
  onViewClient,
  onEditContact,
  onDeleteClient,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
}: ClientListProps) {
  if (clients.length === 0 && !searchTerm) {
    return (
      <div className="text-center py-12">
        <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm sm:text-base text-muted-foreground font-medium mb-2">
          No hay clientes registrados
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Comienza agregando tu primer cliente
        </p>
      </div>
    );
  }

  if (clients.length === 0 && searchTerm) {
    return (
      <div className="text-center py-12">
        <User className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm sm:text-base text-muted-foreground">
          No se encontraron clientes con "{searchTerm}"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          vehicles={getClientVehicles(client.id!)}
          onViewClient={onViewClient}
          onEditContact={onEditContact}
          onDeleteClient={onDeleteClient}
          onAddVehicle={onAddVehicle}
          onEditVehicle={onEditVehicle}
          onDeleteVehicle={onDeleteVehicle}
        />
      ))}
    </div>
  );
}
