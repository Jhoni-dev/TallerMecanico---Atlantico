// app/dashboard/page.tsx

"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { RoleGuard } from "@/components/RoleGuard";
import { Toaster } from "sonner";
import AppointmentsCalendar from "@/app/frontend/components/calendar/AppointmentsCalendar";
import AppointmentsTable from "@/components/table-test";
import ClientVehicleManager from "@/app/frontend/components/clients/ClientVehicleManager";
import VehicleChecklistManager from "@/app/frontend/components/checklist/VehicleChecklistManager";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  ClipboardCheck,
} from "lucide-react";

type TabId = "calendar" | "appointments" | "clients" | "checklists";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("calendar");

  const tabs = [
    {
      id: "calendar" as const,
      label: "Calendario",
      icon: CalendarIcon,
    },
    {
      id: "appointments" as const,
      label: "Citas",
      icon: Clock,
    },
    {
      id: "clients" as const,
      label: "Clientes",
      icon: Users,
    },
  ];

  return (
    <>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col bg-background min-h-0">
          {/* Tabs */}
          <div className="border-b border-border bg-background sticky top-0 z-10">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`
                      relative flex items-center gap-2 px-4 py-3 text-sm font-medium 
                      transition-colors hover:text-foreground whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    `}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === "calendar" && (
              <div className="p-0">
                <RoleGuard allowedRoles={["ADMINISTRADOR", "MECANICO"]}>
                  <AppointmentsCalendar />
                </RoleGuard>
              </div>
            )}

            {activeTab === "appointments" && (
              <div className="p-4">
                <RoleGuard allowedRoles={["ADMINISTRADOR"]}>
                  <AppointmentsTable />
                </RoleGuard>
              </div>
            )}

            {activeTab === "clients" && (
              <div className="p-4">
                <RoleGuard allowedRoles={["ADMINISTRADOR", "MECANICO"]}>
                  <ClientVehicleManager />
                </RoleGuard>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      <Toaster position="top-right" richColors closeButton duration={4000} />
    </>
  );
}
