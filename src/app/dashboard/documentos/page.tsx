// app/checklists/page.tsx

import { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import VehicleChecklistManager from "@/app/frontend/components/checklist/VehicleChecklistManager";
import { RoleGuard } from "@/components/RoleGuard";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Inspecciones de Vehículos | Sistema de Gestión",
  description: "Gestión de checklists de inspección vehicular",
};

export default function ChecklistsPage() {
  return (
    <>
      <RoleGuard allowedRoles={["ADMINISTRADOR", "MECANICO"]}>
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col min-h-0">
            {/* Contenedor con scroll para el contenido */}
            <div className="flex-1 overflow-auto">
              <VehicleChecklistManager />
            </div>
          </div>
        </SidebarInset>
      </RoleGuard>

      {/* Sistema de notificaciones */}
      <Toaster position="top-right" richColors closeButton duration={4000} />
    </>
  );
}
