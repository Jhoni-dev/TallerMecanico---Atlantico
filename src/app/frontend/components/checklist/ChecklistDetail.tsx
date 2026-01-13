// src/components/checklist/ChecklistDetail.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Eye, FileText, Loader2, Car } from "lucide-react";
import { VehicleChecklist } from "@/app/frontend/types/checklist.types";
import {
  formatDate,
  getFuelTextColor,
} from "@/app/frontend/utils/checklist.utils";
import ImageGallery from "./ImageGallery";
import ClientVehicleInfo from "./ClientVehicleInfo";
import VehicleEvaluation from "./VehicleEvaluation";
import ItemsByCategory from "./ItemsByCategory";

interface ChecklistDetailProps {
  checklist: VehicleChecklist | null;
  loading: boolean;
  onBack: () => void;
  onImageClick: (imageUrl: string, index: number) => void;
}

export default function ChecklistDetail({
  checklist,
  loading,
  onBack,
  onImageClick,
}: ChecklistDetailProps) {
  if (loading) {
    return (
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Cargando checklist...</p>
        </CardContent>
      </Card>
    );
  }

  if (!checklist) {
    return (
      <Card className="dark:bg-gray-900 dark:border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">
            Detalle del Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay checklist seleccionado
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ve a la lista y selecciona un checklist para ver sus detalles
            </p>
            <Button onClick={onBack}>
              <FileText className="mr-2 h-4 w-4" />
              Ver Lista de Checklists
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convertir las imágenes al formato esperado por ImageGallery
  const formattedImages =
    checklist.vehicleImage?.map((img) => ({
      ...img,
      createAt:
        img.createAt instanceof Date
          ? img.createAt.toISOString()
          : img.createAt,
    })) || [];

  return (
    <Card className="dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">
          Detalle del Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Header del checklist */}
          <div className="pb-4 border-b dark:border-gray-700">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold truncate">
                  {checklist.checkType}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ID: #{checklist.id} • Creado el{" "}
                  {formatDate(checklist.completedAt || new Date())}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-shrink-0"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </div>

            {/* Info rápida */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-muted dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Técnico</p>
                <p className="font-semibold text-sm truncate">
                  {checklist.technicianName}
                </p>
              </div>
              <div className="p-3 bg-muted dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Kilometraje
                </p>
                <p className="font-semibold text-sm">{checklist.mileage} km</p>
              </div>
              <div className="p-3 bg-muted dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">
                  Combustible
                </p>
                <p
                  className={`font-bold text-sm ${getFuelTextColor(checklist.fuelLevel)}`}
                >
                  {checklist.fuelLevel}%
                </p>
              </div>
              <div className="p-3 bg-muted dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Items</p>
                <p className="font-semibold text-sm">
                  {checklist.items?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Fotos del vehículo */}
          {formattedImages.length > 0 && (
            <ImageGallery
              images={formattedImages}
              onImageClick={onImageClick}
            />
          )}

          {/* Información del Cliente y Mecánico */}
          <ClientVehicleInfo
            appointment={checklist.appointment}
            client={checklist.client}
            session={checklist.session}
          />

          {/* Información del Vehículo */}
          {checklist.clientVehicle && (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
              <h3 className="font-semibold text-sm text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" />
                Información del Vehículo
              </h3>
              <div className="space-y-3 text-sm">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                      Vehículo:
                    </p>
                    <p className="text-green-900 dark:text-green-200 font-bold text-base">
                      {checklist.clientVehicle.brand}{" "}
                      {checklist.clientVehicle.model}{" "}
                      {checklist.clientVehicle.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                      Placa:
                    </p>
                    <p className="text-green-900 dark:text-green-200 font-bold text-base">
                      {checklist.clientVehicle.plates}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                      Cilindraje:
                    </p>
                    <p className="text-green-900 dark:text-green-200">
                      {checklist.clientVehicle.engineDisplacement} cc
                    </p>
                  </div>
                  {checklist.clientVehicle.description && (
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-400 mb-0.5">
                        Descripción:
                      </p>
                      <p className="text-green-900 dark:text-green-200">
                        {checklist.clientVehicle.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Estado del vehículo */}
          {checklist.items && checklist.items.length > 0 && (
            <VehicleEvaluation items={checklist.items} />
          )}

          {/* Notas generales */}
          {checklist.generalNotes && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas Generales
              </h3>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {checklist.generalNotes}
                </p>
              </div>
            </div>
          )}

          {/* Items del checklist */}
          {checklist.items && checklist.items.length > 0 && (
            <ItemsByCategory items={checklist.items} />
          )}

          {/* Botón volver */}
          <div className="pt-6 border-t dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a la Lista
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
