// src/components/clients/ClientCard.tsx

import { useState } from "react";
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
  IdCard,
  Loader2,
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
  const hasContact = contact.phoneNumber || contact.email || contact.address;

  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const isActionInProgress =
    isViewing || isEditing || isDeleting || isAddingVehicle;

  const handleViewClient = async () => {
    setIsViewing(true);
    try {
      await onViewClient(client);
    } finally {
      setIsViewing(false);
    }
  };

  const handleEditContact = async () => {
    setIsEditing(true);
    try {
      await onEditContact(client);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    try {
      await onDeleteClient(client);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddVehicle = async () => {
    setIsAddingVehicle(true);
    try {
      await onAddVehicle(client.id!);
    } finally {
      setIsAddingVehicle(false);
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <CardHeader className="bg-muted/30 border-b border-border/50 p-4 sm:p-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Nombre y Badge */}
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0 ring-2 ring-primary/5">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <CardTitle className="text-base sm:text-lg md:text-xl font-bold truncate">
                    {client.fullName} {client.fullSurname}
                  </CardTitle>
                  <Badge
                    variant={client.clientState ? "default" : "secondary"}
                    className={`text-xs font-semibold ${
                      client.clientState
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900"
                        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                    }`}
                  >
                    {client.clientState ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                    <IdCard className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="font-medium">{client.identified}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            {hasContact && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 pt-3 border-t border-border/30">
                {contact.phoneNumber && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm group/item">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="truncate font-medium text-foreground/80">
                      {contact.phoneNumber}
                    </span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm group/item">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
                      <Mail className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="truncate font-medium text-foreground/80">
                      {contact.email}
                    </span>
                  </div>
                )}
                {contact.address && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm group/item sm:col-span-2 lg:col-span-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/30">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="truncate font-medium text-foreground/80">
                      {contact.address}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botones de acción - Desktop */}
          <div className="hidden sm:flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewClient}
              disabled={isActionInProgress}
              className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary hover:border-primary/30 disabled:opacity-50"
            >
              {isViewing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditContact}
              disabled={isActionInProgress}
              className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 disabled:opacity-50"
            >
              {isEditing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Edit2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClient}
              disabled={isActionInProgress}
              className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Menú móvil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                disabled={isActionInProgress}
                className="h-9 w-9 p-0 flex-shrink-0 hover:bg-muted disabled:opacity-50"
              >
                {isActionInProgress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleViewClient}
                disabled={isActionInProgress}
              >
                {isViewing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <User className="mr-2 h-4 w-4" />
                )}
                Ver Cliente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleEditContact}
                disabled={isActionInProgress}
              >
                {isEditing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Edit2 className="mr-2 h-4 w-4" />
                )}
                Editar Contacto
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClient}
                disabled={isActionInProgress}
                className="text-red-600 focus:text-red-600 dark:text-red-400"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 bg-background">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h4 className="text-sm sm:text-base font-bold flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Car className="w-4 h-4 text-primary" />
            </div>
            <span>
              Vehículos{" "}
              <span className="inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-primary/20 text-primary text-xs font-bold ml-1">
                {vehicles.length}
              </span>
            </span>
          </h4>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddVehicle}
            disabled={isActionInProgress}
            className="w-full sm:w-auto h-9 hover:bg-primary hover:text-primary-foreground hover:border-primary shadow-sm transition-all disabled:opacity-50"
          >
            {isAddingVehicle ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-xs sm:text-sm font-semibold">
                  Agregando...
                </span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                <span className="text-xs sm:text-sm font-semibold">
                  Agregar Vehículo
                </span>
              </>
            )}
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
