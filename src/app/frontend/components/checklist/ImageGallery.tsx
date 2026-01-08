// src/components/checklist/ImageGallery.tsx

import { Badge } from "@/components/ui/badge";
import { ImageIcon, ZoomIn } from "lucide-react";
import { VehicleImageFromBackend } from "@/app/frontend/types/checklist.types";

interface ImageGalleryProps {
  images: VehicleImageFromBackend[];
  onImageClick: (imageUrl: string, index: number) => void;
}

export default function ImageGallery({
  images,
  onImageClick,
}: ImageGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Fotografías del Vehículo
        </h3>
        <Badge variant="secondary">
          {images.length} {images.length === 1 ? "foto" : "fotos"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative cursor-pointer"
            onClick={() => onImageClick(image.imageUrl, index)}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border dark:border-gray-700 bg-muted dark:bg-gray-800 shadow-sm hover:shadow-md transition-all hover:border-primary dark:hover:border-primary">
              <img
                src={image.imageUrl}
                alt={image.description || `Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/10 dark:group-hover:bg-black/20 transition-all duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary dark:bg-primary rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform">
                  <ZoomIn className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>

              <Badge
                variant="secondary"
                className="absolute top-2 left-2 text-xs"
              >
                {index + 1}
              </Badge>
            </div>

            {image.description && (
              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded text-xs">
                <p className="line-clamp-2 text-blue-900 dark:text-blue-200">
                  {image.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 flex items-center justify-center gap-1">
        <ZoomIn className="h-3 w-3" />
        Haz clic en cualquier imagen para ampliarla
      </p>
    </div>
  );
}
