// src/components/checklist/AppointmentSelector.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Calendar,
  MapPin,
  ChevronsUpDown,
  Check,
  CheckCircle2,
  User,
  UserPlus,
  Briefcase,
} from "lucide-react";
import {
  Appointment,
  ManualClientData,
  ManualTechnicianData,
} from "@/app/frontend/types/checklist.types";
import { cn, formatDate } from "@/app/frontend/utils/checklist.utils";
import { toast } from "sonner";

interface GetClient {
  id: number;
  fullName: string;
  fullSurname: string;
  identified: string;
  clientState: boolean | null;
  clientContact: {
    address: string | null;
    email: string;
    phoneNumber: string;
  }[];
  clientVehicle: {
    description: string | null;
    year: number;
    model: string;
    brand: string;
    plates: string;
    engineDisplacement: number;
  }[];
}

interface GetSession {
  id: number;
  name: string;
  role: string;
  email: string;
  identificacion: string;
}

interface AppointmentSelectorProps {
  appointments: Appointment[];
  selectedAppointmentId: number | null;
  onSelectAppointment: (appointmentId: number | null) => void;
  manualClientData?: ManualClientData;
  onManualClientChange?: (data: ManualClientData) => void;
  manualTechnicianData?: ManualTechnicianData;
  onManualTechnicianChange?: (data: ManualTechnicianData) => void;
  clients: GetClient[];
  mechanics: GetSession[];
  selectedClientId?: number | null;
  onSelectClient?: (clientId: number | null) => void;
  selectedMechanicId?: number | null;
  onSelectMechanic?: (mechanicId: number | null) => void;
  loading?: boolean;
}

export default function AppointmentSelector({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  manualClientData,
  onManualClientChange,
  manualTechnicianData,
  onManualTechnicianChange,
  clients,
  mechanics,
  selectedClientId,
  onSelectClient,
  selectedMechanicId,
  onSelectMechanic,
  loading = false,
}: AppointmentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [openClient, setOpenClient] = useState(false);
  const [openMechanic, setOpenMechanic] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [searchMechanic, setSearchMechanic] = useState("");
  const [mode, setMode] = useState<"appointment" | "manual">(
    selectedAppointmentId ? "appointment" : "manual"
  );

  const selectedAppointment = appointments.find(
    (apt) => apt.id === selectedAppointmentId
  );

  const selectedClient = clients.find(
    (client) => client.id === selectedClientId
  );
  const selectedMechanic = mechanics.find(
    (mech) => mech.id === selectedMechanicId
  );

  const filteredAppointments = appointments.filter((apt) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      apt.id.toString().includes(searchLower) ||
      apt.author.fullName.toLowerCase().includes(searchLower) ||
      apt.author.fullSurname.toLowerCase().includes(searchLower) ||
      apt.author.identified.includes(searchLower) ||
      apt.ubicacion.toLowerCase().includes(searchLower)
    );
  });

  const filteredClients = clients.filter((client) => {
    if (!searchClient) return true;
    const searchLower = searchClient.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(searchLower) ||
      client.fullSurname.toLowerCase().includes(searchLower) ||
      client.identified.includes(searchLower)
    );
  });

  const filteredMechanics = mechanics.filter((mech) => {
    if (!searchMechanic) return true;
    const searchLower = searchMechanic.toLowerCase();
    return (
      mech.name.toLowerCase().includes(searchLower) ||
      mech.identificacion.includes(searchLower)
    );
  });

  const handleModeChange = (newMode: string) => {
    if (newMode === "appointment") {
      setMode("appointment");
      // Limpiar selecciones manuales
      onSelectClient?.(null);
      onSelectMechanic?.(null);
    } else {
      setMode("manual");
      // Limpiar selección de cita
      onSelectAppointment(null);
    }
  };

  const handleSelectClient = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    if (client && onSelectClient) {
      onSelectClient(clientId);

      // Auto-rellenar datos del cliente
      if (onManualClientChange) {
        const primaryContact = client.clientContact[0];
        onManualClientChange({
          id: client.id,
          fullName: client.fullName,
          fullSurname: client.fullSurname,
          identified: client.identified,
          clientContact: {
            phoneNumber: primaryContact?.phoneNumber || "",
            email: primaryContact?.email || "",
          },
        });
      }

      setOpenClient(false);
      toast.success("Cliente seleccionado");
    }
  };

  const handleSelectMechanic = (mechanicId: number) => {
    const mechanic = mechanics.find((m) => m.id === mechanicId);
    if (mechanic && onSelectMechanic) {
      onSelectMechanic(mechanicId);

      // Auto-rellenar datos del mecánico
      if (onManualTechnicianChange) {
        onManualTechnicianChange({
          id: mechanic.id,
          name: mechanic.name,
          identification: mechanic.identificacion,
        });
      }

      setOpenMechanic(false);
      toast.success("Mecánico seleccionado");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Información del Cliente
        </Label>

        <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger
              value="appointment"
              className="text-xs sm:text-sm dark:data-[state=active]:bg-gray-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Desde Cita
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="text-xs sm:text-sm dark:data-[state=active]:bg-gray-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ingreso Manual
            </TabsTrigger>
          </TabsList>

          {/* Tab: Selección de Cita */}
          <TabsContent value="appointment" className="space-y-3 mt-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between text-sm h-auto py-3 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  {selectedAppointmentId ? (
                    <span className="flex items-center gap-2 text-left">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        #{selectedAppointmentId} -{" "}
                        {selectedAppointment?.author.fullName}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Buscar y seleccionar cita...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0 dark:bg-gray-800 dark:border-gray-700">
                <Command className="dark:bg-gray-800">
                  <CommandInput
                    placeholder="Buscar por cliente, ID o ubicación..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                    className="text-sm"
                  />
                  <CommandEmpty className="text-sm p-4 text-center">
                    {loading
                      ? "Cargando citas..."
                      : "No se encontraron citas disponibles"}
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup className="max-h-60 overflow-auto">
                      {filteredAppointments.map((apt) => (
                        <CommandItem
                          key={apt.id}
                          value={apt.id.toString()}
                          onSelect={() => {
                            onSelectAppointment(apt.id);
                            setOpen(false);
                            toast.success("Cita seleccionada");
                          }}
                          className="text-sm dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 flex-shrink-0",
                              selectedAppointmentId === apt.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">#{apt.id}</span>
                              <span className="truncate">
                                {apt.author.fullName} {apt.author.fullSurname}
                              </span>
                              <Badge
                                variant="secondary"
                                className="text-xs dark:bg-gray-700"
                              >
                                {apt.appointmentState}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(apt.appointmentDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {apt.ubicacion}
                              </span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedAppointment && (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-900 dark:text-green-300">
                    Cita Seleccionada
                  </h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Cliente:
                    </span>
                    <p className="text-green-900 dark:text-green-200 font-semibold">
                      {selectedAppointment.author.fullName}{" "}
                      {selectedAppointment.author.fullSurname}
                    </p>
                    {selectedAppointment.author.identified && (
                      <p className="text-green-600 dark:text-green-400 text-xs">
                        ID: {selectedAppointment.author.identified}
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-green-700 dark:text-green-400 font-medium">
                      Ubicación:
                    </span>
                    <p className="text-green-900 dark:text-green-200">
                      {selectedAppointment.ubicacion}
                    </p>
                  </div>
                  {selectedAppointment.employedAuthor && (
                    <div>
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        Técnico:
                      </span>
                      <p className="text-green-900 dark:text-green-200">
                        {selectedAppointment.employedAuthor.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab: Ingreso Manual */}
          <TabsContent value="manual" className="space-y-4 mt-4">
            {/* Selector de Cliente desde BD */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Seleccionar Cliente Existente (Opcional)
              </Label>
              <Popover open={openClient} onOpenChange={setOpenClient}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openClient}
                    className="w-full justify-between text-sm h-auto py-3 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    {selectedClientId ? (
                      <span className="flex items-center gap-2 text-left">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {selectedClient?.fullName}{" "}
                          {selectedClient?.fullSurname}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Buscar cliente existente...
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0 dark:bg-gray-800 dark:border-gray-700">
                  <Command className="dark:bg-gray-800">
                    <CommandInput
                      placeholder="Buscar por nombre o identificación..."
                      value={searchClient}
                      onValueChange={setSearchClient}
                      className="text-sm"
                    />
                    <CommandEmpty className="text-sm p-4 text-center">
                      No se encontraron clientes
                    </CommandEmpty>
                    <CommandList>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {filteredClients.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.id.toString()}
                            onSelect={() => handleSelectClient(client.id)}
                            className="text-sm dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 flex-shrink-0",
                                selectedClientId === client.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">
                                  {client.fullName} {client.fullSurname}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                                <span>ID: {client.identified}</span>
                                {client.clientContact[0]?.email && (
                                  <span>{client.clientContact[0].email}</span>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedClient && (
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    ✓ Cliente seleccionado. Los datos se han rellenado
                    automáticamente.
                  </p>
                </div>
              )}
            </div>

            {/* Información del Cliente (Manual) */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                  Datos del Cliente
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="client-name" className="text-xs font-medium">
                    Nombre *
                  </Label>
                  <Input
                    id="client-name"
                    placeholder="Juan"
                    value={manualClientData?.fullName || ""}
                    onChange={(e) =>
                      onManualClientChange?.({
                        ...manualClientData!,
                        fullName: e.target.value,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="client-surname"
                    className="text-xs font-medium"
                  >
                    Apellido *
                  </Label>
                  <Input
                    id="client-surname"
                    placeholder="Pérez"
                    value={manualClientData?.fullSurname || ""}
                    onChange={(e) =>
                      onManualClientChange?.({
                        ...manualClientData!,
                        fullSurname: e.target.value,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="client-id" className="text-xs font-medium">
                    Identificación *
                  </Label>
                  <Input
                    id="client-id"
                    placeholder="1234567890"
                    value={manualClientData?.identified || ""}
                    onChange={(e) =>
                      onManualClientChange?.({
                        ...manualClientData!,
                        identified: e.target.value,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="client-phone" className="text-xs font-medium">
                    Teléfono
                  </Label>
                  <Input
                    id="client-phone"
                    placeholder="3001234567"
                    value={manualClientData?.clientContact?.phoneNumber || ""}
                    onChange={(e) =>
                      onManualClientChange?.({
                        ...manualClientData!,
                        clientContact: {
                          ...manualClientData?.clientContact,
                          phoneNumber: e.target.value,
                        },
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="client-email" className="text-xs font-medium">
                    Email
                  </Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={manualClientData?.clientContact?.email || ""}
                    onChange={(e) =>
                      onManualClientChange?.({
                        ...manualClientData!,
                        clientContact: {
                          ...manualClientData?.clientContact,
                          email: e.target.value,
                        },
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Selector de Mecánico desde BD - SOLO COMBOBOX */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-amber-900 dark:text-amber-300">
                  Seleccionar Mecánico *
                </h4>
              </div>

              <Popover open={openMechanic} onOpenChange={setOpenMechanic}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMechanic}
                    className="w-full justify-between text-sm h-auto py-3 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    {selectedMechanicId ? (
                      <span className="flex items-center gap-2 text-left">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {selectedMechanic?.name}
                        </span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Buscar y seleccionar mecánico...
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0 dark:bg-gray-800 dark:border-gray-700">
                  <Command className="dark:bg-gray-800">
                    <CommandInput
                      placeholder="Buscar por nombre o identificación..."
                      value={searchMechanic}
                      onValueChange={setSearchMechanic}
                      className="text-sm"
                    />
                    <CommandEmpty className="text-sm p-4 text-center">
                      No se encontraron mecánicos
                    </CommandEmpty>
                    <CommandList>
                      <CommandGroup className="max-h-60 overflow-auto">
                        {filteredMechanics.map((mech) => (
                          <CommandItem
                            key={mech.id}
                            value={mech.id.toString()}
                            onSelect={() => handleSelectMechanic(mech.id)}
                            className="text-sm dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 flex-shrink-0",
                                selectedMechanicId === mech.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium">{mech.name}</span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs dark:bg-gray-700"
                                >
                                  {mech.role}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                ID: {mech.identificacion}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {selectedMechanic && (
                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      <strong>{selectedMechanic.name}</strong> - ID:{" "}
                      {selectedMechanic.identificacion}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
