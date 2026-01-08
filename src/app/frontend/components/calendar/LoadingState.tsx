// src/components/calendar/LoadingState.tsx

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Cargando citas...</p>
      </div>
    </div>
  );
}
