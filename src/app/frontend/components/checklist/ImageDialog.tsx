// src/components/checklist/ImageDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import { VehicleImage } from "@prisma/client";

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: VehicleImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function ImageDialog({
  open,
  onOpenChange,
  images,
  currentIndex,
  onIndexChange,
}: ImageDialogProps) {
  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    onIndexChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const handleDownload = () => {
    if (currentImage) {
      window.open(currentImage.imageUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 dark:bg-gray-900 dark:border-gray-800">
        <DialogTitle className="sr-only">
          Visualizador de Imágenes del Vehículo
        </DialogTitle>
        <DialogDescription className="sr-only">
          Galería de imágenes del checklist. Imagen {currentIndex + 1} de{" "}
          {images.length}
        </DialogDescription>

        <div className="relative bg-black dark:bg-gray-950">
          {/* Header del diálogo */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 dark:from-black/80 to-transparent z-10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">
                  Imagen {currentIndex + 1} de {images.length}
                </h3>
                {currentImage?.description && (
                  <p className="text-white/80 text-xs mt-1 line-clamp-2">
                    {currentImage.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20"
                  title="Abrir en nueva pestaña"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Imagen principal */}
          <div className="relative min-h-[60vh] max-h-[80vh] flex items-center justify-center">
            {currentImage && (
              <img
                src={currentImage.imageUrl}
                alt={currentImage.description || `Imagen ${currentIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
          </div>

          {/* Controles de navegación */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 dark:from-black/80 to-transparent p-4">
              <div className="flex gap-2 justify-center overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => onIndexChange(index)}
                    className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? "border-white scale-110"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    title={image.description || `Imagen ${index + 1}`}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.description || `Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
