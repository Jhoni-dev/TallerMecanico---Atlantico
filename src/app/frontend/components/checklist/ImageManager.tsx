// src/components/checklist/ImageManager.tsx

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, ImageIcon } from "lucide-react";
import { VehicleImageData } from "@/app/frontend/types/checklist.types";

interface ImageManagerProps {
  images: VehicleImageData[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
  onUpdateDescription: (index: number, description: string) => void;
  disabled?: boolean;
}

export default function ImageManager({
  images,
  onAddImages,
  onRemoveImage,
  onUpdateDescription,
  disabled = false,
}: ImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      onAddImages(files);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Agregar Fotografías</Label>
        {images.length > 0 && (
          <Badge variant="secondary" className="text-sm dark:bg-gray-700">
            {images.length} {images.length === 1 ? "foto" : "fotos"}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="gap-2 h-auto py-4 sm:hidden dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <Camera className="h-5 w-5" />
          <span>Tomar Foto</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="gap-2 h-auto py-4 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <Upload className="h-5 w-5" />
          <span className="hidden sm:inline">Subir desde Galería</span>
          <span className="sm:hidden">Galería</span>
        </Button>
      </div>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />

      {images.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/50 dark:bg-gray-800/50">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            No hay imágenes agregadas
          </p>
          <p className="text-xs text-muted-foreground">
            Puedes omitir este paso o agregar fotos usando los botones de arriba
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Puedes agregar una descripción opcional a cada foto
          </p>
          {images.map((imageData, index) => (
            <div
              key={index}
              className="relative border dark:border-gray-700 rounded-lg p-3 bg-card dark:bg-gray-800"
            >
              <div className="flex gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={imageData.previewUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemoveImage(index)}
                    disabled={disabled}
                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Badge
                    variant="secondary"
                    className="absolute bottom-1 left-1 text-xs"
                  >
                    {index + 1}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Descripción (opcional)
                  </Label>
                  <Textarea
                    placeholder="Ej: Daño en puerta trasera derecha"
                    value={imageData.description}
                    onChange={(e) => onUpdateDescription(index, e.target.value)}
                    disabled={disabled}
                    rows={2}
                    className="text-xs dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}