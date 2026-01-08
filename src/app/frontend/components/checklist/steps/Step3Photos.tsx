// src/components/checklist/steps/Step3Photos.tsx

import { Info } from "lucide-react";
import ImageManager from "../ImageManager";
import { VehicleImageData } from "@/app/frontend/types/checklist.types";

interface Step3PhotosProps {
  images: VehicleImageData[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onUpdateDescription: (index: number, description: string) => void;
}

export default function Step3Photos({
  images,
  onAddImages,
  onRemoveImage,
  onUpdateDescription,
}: Step3PhotosProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-300">
            Paso 3: Fotografías del Vehículo (Opcional)
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Toma o sube fotos del estado actual del vehículo. Puedes agregar
            descripciones a cada imagen.
          </p>
        </div>
      </div>

      <ImageManager
        images={images}
        onAddImages={onAddImages}
        onRemoveImage={onRemoveImage}
        onUpdateDescription={onUpdateDescription}
      />
    </div>
  );
}
