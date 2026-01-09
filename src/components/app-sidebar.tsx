"use client";
import * as React from "react";
import Link from "next/link";
import {
  IconHome,
  IconPackage,
  IconFileText,
  IconCalendar,
  IconUsers,
  IconHelp,
  IconServicemark,
} from "@tabler/icons-react";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/app/frontend/components/user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/usercontext";
import Loader from "@/app/frontend/components/Loader";
import { apiFetch } from "@/app/frontend/utils/apiFetch";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<User | null>(null);
  const { user } = useAuth();

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await apiFetch(`/user/${user}`);

      if (!response.ok)
        throw new Error("Ha ocurrido un error en la captura del usuario");

      const data: User = await response.json();

      setUserData(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error inesperado"
      );
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!user) return;
    
    fetchUser();
  }, [user]);

  const data = {
    user: {
      name: userData?.name || "Invitado",
      email: userData?.email || "Sin sesión",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      { title: "Dashboard", url: "/dashboard", icon: IconHome },
      {
        title: "Inventario",
        url: "/dashboard/inventario",
        icon: IconPackage,
      },
      {
        title: "Servicios",
        url: "/dashboard/servicios",
        icon: IconServicemark,
      },
      { title: "Citas", url: "/dashboard/citas", icon: IconCalendar },
      { title: "Equipo", url: "/dashboard/equipo", icon: IconUsers },
    ],
    documents: [
      {
        name: "Gestion de documentos",
        url: "/dashboard/documentos",
        icon: IconFileText,
      },
    ],
    navSecondary: [{ title: "Guía", url: "/guia", icon: IconHelp }],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/foto.png"
                  alt="logo"
                  className="w-5 rounded-full shadow dark:grayscale"
                />
                <span className="text-base font-semibold">SwiftService</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* CONTENIDO PRINCIPAL */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments
          items={data.documents.map((item) => ({
            ...item,
            component: (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton>
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="!size-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          }))}
        />
        <NavSecondary
          items={data.navSecondary.map((item) => ({
            ...item,
            component: (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="!size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          }))}
          className="mt-auto"
        />
      </SidebarContent>
      {/* FOOTER */}
      <SidebarFooter>
        {loading ? <Loader className="flex justify-center items-center min-h-auto" size="md" /> : <NavUser user={data.user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
