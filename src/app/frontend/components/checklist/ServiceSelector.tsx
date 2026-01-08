// src/components/checklist/ServiceSelector.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Settings, ChevronsUpDown, Check } from "lucide-react";
import { Service, ServiceCategory } from "@/app/frontend/types/checklist.types";
import { cn, formatCurrency } from "@/app/frontend/utils/checklist.utils";
import { toast } from "sonner";

interface ServiceSelectorProps {
  services: Service[];
  serviceCategories: ServiceCategory[];
  selectedServiceName: string;
  onSelectService: (serviceName: string) => void;
  loading?: boolean;
}

export default function ServiceSelector({
  services,
  serviceCategories,
  selectedServiceName,
  onSelectService,
  loading = false,
}: ServiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null
  >(null);

  const selectedService = services.find(
    (service) => service.name === selectedServiceName
  );

  const filteredServices = services.filter((service) => {
    // Filtro por categoría
    if (selectedCategoryFilter !== null) {
      const serviceCategoryId =
        service.author?.id || service.categoryId || service.serviceCategory?.id;
      if (serviceCategoryId !== selectedCategoryFilter) return false;
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.id.toString().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="checkType" className="text-base font-semibold">
        Tipo de Servicio *
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-sm h-auto py-3 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            {selectedServiceName ? (
              <span className="flex items-center gap-2 truncate">
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{selectedServiceName}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">
                Seleccionar servicio...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0 dark:bg-gray-800 dark:border-gray-700">
          <Command className="dark:bg-gray-800">
            <CommandInput
              placeholder="Buscar servicio..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="text-sm"
            />

            {serviceCategories.length > 0 && (
              <div className="p-2 border-b dark:border-gray-700">
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant={
                      selectedCategoryFilter === null ? "default" : "outline"
                    }
                    className="cursor-pointer text-xs dark:bg-gray-700"
                    onClick={() => setSelectedCategoryFilter(null)}
                  >
                    Todas
                  </Badge>
                  {serviceCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={
                        selectedCategoryFilter === category.id
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer text-xs dark:bg-gray-700"
                      onClick={() => setSelectedCategoryFilter(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <CommandEmpty className="text-sm p-4 text-center">
              {loading
                ? "Cargando servicios..."
                : "No se encontraron servicios"}
            </CommandEmpty>
            <CommandList>
              <CommandGroup className="max-h-60 overflow-auto">
                {filteredServices.map((service) => (
                  <CommandItem
                    key={service.id}
                    value={service.name}
                    onSelect={() => {
                      onSelectService(service.name);
                      setOpen(false);
                      toast.success("Servicio seleccionado");
                    }}
                    className="text-sm dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 flex-shrink-0",
                        selectedServiceName === service.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium truncate">
                        {service.name}
                      </span>
                      <p className="text-xs text-muted-foreground truncate">
                        {service.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedService && (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-green-700 dark:text-green-400 font-medium text-sm">
                Precio:
              </span>
              <p className="text-green-900 dark:text-green-200 font-bold text-lg">
                {formatCurrency(selectedService.price)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-green-700 dark:text-green-400 font-medium text-sm">
                Garantía:
              </span>
              <p className="text-green-900 dark:text-green-200">
                {selectedService.guarantee}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
