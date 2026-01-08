// src/components/checklist/ChecklistsList.tsx

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  FileText,
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ChecklistCard from "./ChecklistCard";
import { VehicleChecklist } from "@/app/frontend/types/checklist.types";

interface ChecklistsListProps {
  checklists: VehicleChecklist[];
  loading: boolean;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  onCreateNew: () => void;
}

export default function ChecklistsList({
  checklists,
  loading,
  onView,
  onDelete,
  onCreateNew,
}: ChecklistsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrado
  const filteredChecklists = useMemo(() => {
    if (!searchTerm.trim()) return checklists;

    const searchLower = searchTerm.toLowerCase();

    return checklists.filter((checklist) => {
      if (checklist.checkType.toLowerCase().includes(searchLower)) return true;
      if (checklist.id?.toString().includes(searchLower)) return true;
      if (checklist.technicianName.toLowerCase().includes(searchLower))
        return true;
      if (checklist.mileage.toLowerCase().includes(searchLower)) return true;

      if (checklist.appointment) {
        const { author, vehicle } = checklist.appointment;

        if (author.fullName.toLowerCase().includes(searchLower)) return true;
        if (author.fullSurname.toLowerCase().includes(searchLower)) return true;
        if (author.identified.toLowerCase().includes(searchLower)) return true;

        if (vehicle) {
          if (vehicle.brand.toLowerCase().includes(searchLower)) return true;
          if (vehicle.model.toLowerCase().includes(searchLower)) return true;
          if (vehicle.licensePlate.toLowerCase().includes(searchLower))
            return true;
          if (vehicle.color?.toLowerCase().includes(searchLower)) return true;
        }
      }

      return false;
    });
  }, [checklists, searchTerm]);

  // Paginación
  const { paginatedChecklists, totalPages, startIndex, endIndex } =
    useMemo(() => {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const paginated = filteredChecklists.slice(
        indexOfFirstItem,
        indexOfLastItem
      );
      const total = Math.ceil(filteredChecklists.length / itemsPerPage);

      return {
        paginatedChecklists: paginated,
        totalPages: total,
        startIndex: indexOfFirstItem + 1,
        endIndex: Math.min(indexOfLastItem, filteredChecklists.length),
      };
    }, [filteredChecklists, currentPage, itemsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-4 space-y-4">
        <CardTitle className="text-xl font-bold">
          Checklists Registrados
        </CardTitle>

        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cliente, vehículo, placa, técnico..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 text-sm dark:bg-gray-800 dark:border-gray-700"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {searchTerm && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-3 w-3" />
            <span>
              {filteredChecklists.length === 0 ? (
                "No se encontraron resultados"
              ) : (
                <>
                  Mostrando{" "}
                  <span className="font-medium">
                    {filteredChecklists.length}
                  </span>{" "}
                  {filteredChecklists.length === 1 ? "resultado" : "resultados"}
                </>
              )}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">
              Cargando checklists...
            </p>
          </div>
        ) : checklists.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay checklists registrados
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comienza creando tu primer checklist de inspección
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Checklist
            </Button>
          </div>
        ) : filteredChecklists.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              No hay checklists que coincidan con "{searchTerm}"
            </p>
            <Button variant="outline" onClick={handleClearSearch}>
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Info de paginación */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b dark:border-gray-700">
              <span>
                Mostrando <span className="font-medium">{startIndex}</span> a{" "}
                <span className="font-medium">{endIndex}</span> de{" "}
                <span className="font-medium">{filteredChecklists.length}</span>{" "}
                checklists
              </span>
              <Badge
                variant="outline"
                className="text-xs dark:bg-gray-800 dark:border-gray-700"
              >
                Página {currentPage} de {totalPages}
              </Badge>
            </div>

            {/* Lista */}
            <div className="space-y-3">
              {paginatedChecklists.map((checklist) => (
                <ChecklistCard
                  key={checklist.id}
                  checklist={checklist}
                  onView={onView}
                  onDelete={onDelete}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="gap-1 dark:bg-gray-800 dark:border-gray-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>

                <div className="flex items-center gap-1">
                  {currentPage > 2 && (
                    <>
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="h-9 w-9 p-0 dark:bg-gray-800 dark:border-gray-700"
                      >
                        1
                      </Button>
                      {currentPage > 3 && (
                        <span className="text-muted-foreground px-1">...</span>
                      )}
                    </>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === currentPage ||
                        page === currentPage - 1 ||
                        page === currentPage + 1
                    )
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="h-9 w-9 p-0 dark:bg-gray-800 dark:border-gray-700"
                      >
                        {page}
                      </Button>
                    ))}

                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <span className="text-muted-foreground px-1">...</span>
                      )}
                      <Button
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                        className="h-9 w-9 p-0 dark:bg-gray-800 dark:border-gray-700"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="gap-1 dark:bg-gray-800 dark:border-gray-700"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
