// components/ui/loader.tsx

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  /** Tamaño del spinner */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Texto opcional a mostrar debajo del spinner */
  text?: string;
  /** Posición del loader */
  position?: "center" | "inline" | "fixed" | "absolute";
  /** Mostrar en fullscreen */
  fullScreen?: boolean;
  /** Color del spinner */
  variant?: "primary" | "secondary" | "white" | "muted";
  /** Velocidad de rotación */
  speed?: "slow" | "normal" | "fast";
  /** Overlay con fondo oscuro */
  overlay?: boolean;
  /** Clase adicional para el contenedor */
  className?: string;
  /** Clase adicional para el spinner */
  spinnerClassName?: string;
}

const sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const variantClasses = {
  primary: "text-primary",
  secondary: "text-secondary",
  white: "text-white",
  muted: "text-muted-foreground",
};

const speedClasses = {
  slow: "animate-spin-slow",
  normal: "animate-spin",
  fast: "animate-spin-fast",
};

const positionClasses = {
  center: "flex items-center justify-center min-h-[200px]",
  inline: "inline-flex items-center gap-2",
  fixed: "fixed inset-0 flex items-center justify-center z-50",
  absolute: "absolute inset-0 flex items-center justify-center",
};

export default function Loader({
  size = "md",
  text,
  position = "center",
  fullScreen = false,
  variant = "primary",
  speed = "normal",
  overlay = false,
  className,
  spinnerClassName,
}: LoaderProps) {
  const containerPosition = fullScreen ? "fixed" : position;

  return (
    <div
      className={cn(
        positionClasses[containerPosition],
        overlay && "bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className={cn(
            sizeClasses[size],
            variantClasses[variant],
            speedClasses[speed],
            spinnerClassName
          )}
        />
        {text && (
          <p
            className={cn(
              "text-sm",
              variant === "white" ? "text-white" : "text-muted-foreground"
            )}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
