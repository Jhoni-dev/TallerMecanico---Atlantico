// components/nav-user/NavUser.tsx

"use client";

import { useEffect, useState } from "react";
import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
  IconKey,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/usercontext";
import { ProfileDialog } from "./ProfileDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { useUserData } from "../../hooks/useUserData";
import type { NavUserProps } from "../../types/userMenu.types";

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  const {
    userData,
    formData,
    isLoading,
    isSaving,
    hasChanges,
    handleInputChange,
    handleSaveChanges,
    handleCancelEdit,
  } = useUserData();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setIsProfileOpen(true)}
                  className="cursor-pointer"
                >
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Configuración de perfil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsResetPasswordOpen(true)}
                  className="cursor-pointer"
                >
                  <IconKey className="mr-2 h-4 w-4" />
                  Restablecer contraseña
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-destructive data-[highlighted]:bg-red-600 data-[highlighted]:text-white"
              >
                <IconLogout className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Modales */}
      <ProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        userData={userData}
        formData={formData}
        isLoading={isLoading}
        isSaving={isSaving}
        hasChanges={hasChanges}
        onInputChange={handleInputChange}
        onSave={handleSaveChanges}
        onCancel={handleCancelEdit}
      />

      <ResetPasswordDialog
        open={isResetPasswordOpen}
        onOpenChange={setIsResetPasswordOpen}
        userData={userData}
      />
    </>
  );
}
