// src/components/clients/ClientCard.tsx

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  MoreVertical,
  Car,
  Plus,
} from "lucide-react";
import { Client, ClientVehicle } from "@/app/frontend/types/client.types";
import { VehicleList } from "./VehicleList";

interface ClientCardProps {
  client: Client;
  vehicles: ClientVehicle[];
  onViewClient: (client: Client) => void;
  onEditContact: (client: Client) => void;
  onDeleteClient: (client: Client) => void;
  onAddVehicle: (clientId: number) => void;
  onEditVehicle: (vehicle: ClientVehicle, clientId: number) => void;
  onDeleteVehicle: (vehicle: ClientVehicle) => void;
}

export function ClientCard({
  client,
  vehicles,
  onViewClient,
  onEditContact,
  onDeleteClient,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
}: ClientCardProps) {
  const contact = client.clientContact[0] || {};

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/50 border-b p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
              <CardTitle className="text-sm sm:text-base md:text-lg truncate">
                {client.fullName} {client.fullSurname}
              </CardTitle>
              <Badge
                variant={client.clientState ? "default" : "secondary"}
                className="text-xs"
              >
                {client.clientState ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1 truncate">
                <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{client.identified}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{contact.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.address && (
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{contact.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción - Desktop */}
          <div className="hidden sm:flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewClient(client)}
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditContact(client)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteClient(client)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Menú móvil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewClient(client)}>
                <User className="mr-2 h-4 w-4" />
                Ver Cliente
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditContact(client)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Editar Contacto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClient(client)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
          <h4 className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <Car className="w-4 h-4" />
            Vehículos ({vehicles.length})
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddVehicle(client.id!)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="text-xs sm:text-sm">Agregar Vehículo</span>
          </Button>
        </div>

        <VehicleList
          vehicles={vehicles}
          clientId={client.id!}
          onEdit={onEditVehicle}
          onDelete={onDeleteVehicle}
        />
      </CardContent>
    </Card>
  );
}
