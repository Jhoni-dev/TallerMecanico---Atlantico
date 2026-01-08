// src/components/checklist/VehicleSelector.tsx

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
import { Car, ChevronsUpDown, Check, CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/app/frontend/utils/checklist.utils";
import { toast } from "sonner";

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

interface VehicleSelectorProps {
  clientVehicles: GetVehicleClient[];
  loadingVehicles: boolean;
  selectedVehicleId: number | null;
  onSelectVehicle: (vehicleId: number | null) => void;
  isManualVehicle: boolean;
  onToggleManualVehicle: (value: boolean) => void;
  manualVehicleData: ManualVehicleData;
  onManualVehicleChange: (data: ManualVehicleData) => void;
}

export default function VehicleSelector({
  clientVehicles,
  loadingVehicles,
  selectedVehicleId,
  onSelectVehicle,
  isManualVehicle,
  onToggleManualVehicle,
  manualVehicleData,
  onManualVehicleChange,
}: VehicleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedVehicle = clientVehicles.find(
    (v) => v.id === selectedVehicleId
  );

  const filteredVehicles = clientVehicles.filter((vehicle) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.brand.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.plates.toLowerCase().includes(searchLower) ||
      vehicle.year.toString().includes(searchLower)
    );
  });

  const handleModeChange = (newMode: string) => {
    if (newMode === "existing") {
      onToggleManualVehicle(false);
    } else {
      onToggleManualVehicle(true);
      onSelectVehicle(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Vehículo del Cliente *
        </Label>

        <Tabs
          value={isManualVehicle ? "manual" : "existing"}
          onValueChange={handleModeChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
            <TabsTrigger
              value="existing"
              className="text-xs sm:text-sm dark:data-[state=active]:bg-gray-700"
              disabled={clientVehicles.length === 0 && !loadingVehicles}
            >
              <Car className="h-4 w-4 mr-2" />
              Vehículo Existente
            </TabsTrigger>
            <TabsTrigger
              value="manual"
              className="text-xs sm:text-sm dark:data-[state=active]:bg-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ingreso Manual
            </TabsTrigger>
          </TabsList>

          {/* Tab: Vehículo Existente */}
          <TabsContent value="existing" className="space-y-3 mt-4">
            {clientVehicles.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {loadingVehicles
                    ? "Cargando vehículos..."
                    : "Este cliente no tiene vehículos registrados"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Puedes agregar uno manualmente en la pestaña "Ingreso Manual"
                </p>
              </div>
            ) : (
              <>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between text-sm h-auto py-3 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                      {selectedVehicleId ? (
                        <span className="flex items-center gap-2 text-left">
                          <Car className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">
                            {selectedVehicle?.brand} {selectedVehicle?.model}{" "}
                            {selectedVehicle?.year} - {selectedVehicle?.plates}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Seleccionar vehículo...
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0 dark:bg-gray-800 dark:border-gray-700">
                    <Command className="dark:bg-gray-800">
                      <CommandInput
                        placeholder="Buscar por marca, modelo, placa..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        className="text-sm"
                      />
                      <CommandEmpty className="text-sm p-4 text-center">
                        {loadingVehicles
                          ? "Cargando vehículos..."
                          : "No se encontraron vehículos"}
                      </CommandEmpty>
                      <CommandList>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {filteredVehicles.map((vehicle) => (
                            <CommandItem
                              key={vehicle.id}
                              value={vehicle.id.toString()}
                              onSelect={() => {
                                onSelectVehicle(vehicle.id);
                                setOpen(false);
                                toast.success("Vehículo seleccionado");
                              }}
                              className="text-sm dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 flex-shrink-0",
                                  selectedVehicleId === vehicle.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">
                                    {vehicle.brand} {vehicle.model}{" "}
                                    {vehicle.year}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs dark:bg-gray-700"
                                  >
                                    {vehicle.plates}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {vehicle.engineDisplacement}cc
                                  {vehicle.description &&
                                    ` • ${vehicle.description}`}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedVehicle && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold text-green-900 dark:text-green-300">
                        Vehículo Seleccionado
                      </h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Vehículo:
                        </p>
                        <p className="text-green-900 dark:text-green-200 font-bold">
                          {selectedVehicle.brand} {selectedVehicle.model}{" "}
                          {selectedVehicle.year}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Placa:
                        </p>
                        <p className="text-green-900 dark:text-green-200 font-bold">
                          {selectedVehicle.plates}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Cilindraje:
                        </p>
                        <p className="text-green-900 dark:text-green-200">
                          {selectedVehicle.engineDisplacement}cc
                        </p>
                      </div>
                      {selectedVehicle.description && (
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-400">
                            Descripción:
                          </p>
                          <p className="text-green-900 dark:text-green-200">
                            {selectedVehicle.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Tab: Ingreso Manual */}
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-300">
                  Datos del Vehículo
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="vehicle-brand"
                    className="text-xs font-medium"
                  >
                    Marca *
                  </Label>
                  <Input
                    id="vehicle-brand"
                    placeholder="Ej: Toyota"
                    value={manualVehicleData.brand}
                    onChange={(e) =>
                      onManualVehicleChange({
                        ...manualVehicleData,
                        brand: e.target.value,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="vehicle-model"
                    className="text-xs font-medium"
                  >
                    Modelo *
                  </Label>
                  <Input
                    id="vehicle-model"
                    placeholder="Ej: Corolla"
                    value={manualVehicleData.model}
                    onChange={(e) =>
                      onManualVehicleChange({
                        ...manualVehicleData,
                        model: e.target.value,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vehicle-year" className="text-xs font-medium">
                    Año *
                  </Label>
                  <Input
                    id="vehicle-year"
                    type="number"
                    placeholder="Ej: 2020"
                    value={manualVehicleData.year}
                    onChange={(e) =>
                      onManualVehicleChange({
                        ...manualVehicleData,
                        year:
                          parseInt(e.target.value) || new Date().getFullYear(),
                      })
                    }
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="vehicle-plates"
                    className="text-xs font-medium"
                  >
                    Placa *
                  </Label>
                  <Input
                    id="vehicle-plates"
                    placeholder="Ej: ABC123"
                    value={manualVehicleData.plates}
                    onChange={(e) =>
                      onManualVehicleChange({
                        ...manualVehicleData,
                        plates: e.target.value.toUpperCase(),
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="vehicle-displacement"
                    className="text-xs font-medium"
                  >
                    Cilindraje (cc)
                  </Label>
                  <Input
                    id="vehicle-displacement"
                    type="number"
                    placeholder="Ej: 1500"
                    value={manualVehicleData.engineDisplacement || ""}
                    onChange={(e) =>
                      onManualVehicleChange({
                        ...manualVehicleData,
                        engineDisplacement: parseInt(e.target.value) || 0,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label
                    htmlFor="vehicle-description"
                    className="text-xs font-medium"
                  >
                    Descripción
                  </Label>
                  <Input
                    id="vehicle-description"
                    placeholder="Ej: Sedán color rojo"
                    value={manualVehicleData.description || ""}
                    onChange={(e) =>
                      onManualVehicleChange({
                        ...manualVehicleData,
                        description: e.target.value,
                      })
                    }
                    className="dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
