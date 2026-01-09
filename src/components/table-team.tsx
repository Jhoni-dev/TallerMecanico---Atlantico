"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreVertical,
  Loader2,
  Users,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit2,
  Trash2,
  UserPlus,
  Mail,
  IdCard,
  User,
  Key,
  Shield,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/app/frontend/utils/apiFetch";

type TypeAccount = "MECANICO" | "ADMINISTRADOR";

type Session = {
  id: number;
  name: string;
  identificacion: string;
  email: string;
  role: TypeAccount;
  createdAt: string;
};

type NewMemberInput = {
  name: string;
  identificacion: string;
  email: string;
  role: TypeAccount;
  password: string;
};

const RoleBadge = ({ role }: { role: TypeAccount }) => {
  const config = {
    ADMINISTRADOR: {
      className:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
      label: "Administrador",
      icon: Shield,
    },
    MECANICO: {
      className:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900",
      label: "Mecánico",
      icon: Settings,
    },
  };

  const { className, label, icon: Icon } = config[role];

  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

export default function TeamMembers() {
  const [members, setMembers] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState<Session | null>(null);
  const [originalMember, setOriginalMember] = useState<Session | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [newMember, setNewMember] = useState<NewMemberInput>({
    name: "",
    identificacion: "",
    email: "",
    role: "MECANICO",
    password: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("user");
      if (!response.ok) throw new Error("Error al cargar miembros");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los miembros del equipo");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Filtrar miembros
  const filteredMembers = useMemo(() => {
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.identificacion.includes(searchTerm)
    );
  }, [members, searchTerm]);

  // Paginación
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = (page: number) =>
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));

  const handleAddMember = async () => {
    try {
      setIsSubmitting(true);

      const response = await apiFetch("user/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMember.name,
          identificacion: newMember.identificacion,
          email: newMember.email,
          rol: newMember.role,
          password: newMember.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear miembro");
      }

      setMembers((prevMembers) => [...prevMembers, data]);
      setIsAddDialogOpen(false);
      setNewMember({
        name: "",
        identificacion: "",
        email: "",
        role: "MECANICO",
        password: "",
      });

      toast.success(`${data.name} ha sido agregado exitosamente`);
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo agregar el miembro"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este miembro?")) return;

    try {
      const response = await apiFetch(`user/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar miembro");

      setMembers((prevMembers) => prevMembers.filter((m) => m.id !== id));
      toast.success("El miembro ha sido eliminado exitosamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el miembro");
    }
  };

  const handleEditMember = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    setOriginalMember({ ...member });
    setEditMember({ ...member });
    setIsEditDialogOpen(true);
  };

  const getChangedFields = () => {
    if (!editMember || !originalMember) return null;

    const changes: Partial<Session> = {};
    let hasChanges = false;

    if (editMember.name !== originalMember.name) {
      changes.name = editMember.name;
      hasChanges = true;
    }

    if (editMember.identificacion !== originalMember.identificacion) {
      changes.identificacion = editMember.identificacion;
      hasChanges = true;
    }

    if (editMember.email !== originalMember.email) {
      changes.email = editMember.email;
      hasChanges = true;
    }

    if (editMember.role !== originalMember.role) {
      changes.role = editMember.role;
      hasChanges = true;
    }

    return hasChanges ? { id: editMember.id, ...changes } : null;
  };

  const hasChanges = () => {
    if (!editMember || !originalMember) return false;

    return (
      editMember.name !== originalMember.name ||
      editMember.identificacion !== originalMember.identificacion ||
      editMember.email !== originalMember.email ||
      editMember.role !== originalMember.role
    );
  };

  const handleUpdateMember = async () => {
    if (!editMember || !originalMember) return;

    const changedFields = getChangedFields();

    if (!changedFields) {
      toast.warning("No se han realizado cambios");
      return;
    }

    try {
      setIsEditing(true);

      const response = await apiFetch(`user/${editMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changedFields),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar");
      }

      setMembers((prevMembers) =>
        prevMembers.map((m) => (m.id === data.id ? data : m))
      );

      setIsEditDialogOpen(false);
      setEditMember(null);
      setOriginalMember(null);
      toast.success("Miembro actualizado correctamente");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se ha podido actualizar el respectivo usuario"
      );
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Cargando equipo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Equipo de Trabajo
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Gestiona los miembros de tu equipo •{" "}
                <span className="font-semibold text-foreground">
                  {members.length}
                </span>{" "}
                {members.length === 1 ? "miembro" : "miembros"}
              </p>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              size="default"
              className="w-full sm:w-auto shadow-sm"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Agregar Personal
            </Button>
          </div>
        </div>

        {/* Búsqueda */}
        <Card className="mb-6 border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email o identificación..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de miembros */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            {paginatedMembers.length === 0 ? (
              <div className="p-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-semibold mb-2">
                  {searchTerm
                    ? "No se encontraron miembros"
                    : "No hay miembros en el equipo"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? "Intenta con otro término de búsqueda"
                    : "Agrega el primer miembro al equipo"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {paginatedMembers.map((member) => {
                  if (!member.id) {
                    console.warn("Member without valid id:", member);
                    return null;
                  }

                  return (
                    <div
                      key={`member-${member.id}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 hover:bg-muted/50 transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Avatar className="h-14 w-14 flex-shrink-0 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                            alt={member.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base truncate mb-1">
                            {member.name}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <IdCard className="h-3 w-3" />
                            <span>ID: {member.identificacion}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 mt-4 sm:mt-0 sm:ml-4">
                        <RoleBadge role={member.role} />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 hover:bg-muted"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleEditMember(member.id)}
                              className="cursor-pointer"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMember(member.id)}
                              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginación */}
        {filteredMembers.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <span className="text-sm text-muted-foreground font-medium">
              Mostrando{" "}
              <span className="font-bold text-foreground">
                {currentPage * itemsPerPage + 1}
              </span>{" "}
              -{" "}
              <span className="font-bold text-foreground">
                {Math.min(
                  (currentPage + 1) * itemsPerPage,
                  filteredMembers.length
                )}
              </span>{" "}
              de{" "}
              <span className="font-bold text-foreground">
                {filteredMembers.length}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(0)}
                disabled={currentPage === 0}
                className="h-9 w-9 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <span className="text-sm font-semibold whitespace-nowrap">
                  Página {currentPage + 1} de {totalPages || 1}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1 || totalPages === 0}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages - 1)}
                disabled={currentPage === totalPages - 1 || totalPages === 0}
                className="h-9 w-9 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialog para editar miembro */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit2 className="h-6 w-6 text-primary" />
              Editar Miembro
            </DialogTitle>
            <DialogDescription>
              Modifica la información del miembro del equipo
            </DialogDescription>
          </DialogHeader>

          {editMember && (
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="font-semibold">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-name"
                    value={editMember.name}
                    onChange={(e) =>
                      setEditMember({ ...editMember, name: e.target.value })
                    }
                    disabled={isEditing}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-identificacion" className="font-semibold">
                  Identificación
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-identificacion"
                    value={editMember.identificacion}
                    onChange={(e) =>
                      setEditMember({
                        ...editMember,
                        identificacion: e.target.value,
                      })
                    }
                    disabled={isEditing}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email" className="font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-email"
                    type="email"
                    value={editMember.email}
                    onChange={(e) =>
                      setEditMember({ ...editMember, email: e.target.value })
                    }
                    disabled={isEditing}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role" className="font-semibold">
                  Rol
                </Label>
                <Select
                  value={editMember.role}
                  onValueChange={(v: TypeAccount) =>
                    setEditMember({ ...editMember, role: v })
                  }
                  disabled={isEditing}
                >
                  <SelectTrigger id="edit-role" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MECANICO">Mecánico</SelectItem>
                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasChanges() && (
                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-md">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    Tienes cambios sin guardar
                  </span>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditMember(null);
                setOriginalMember(null);
              }}
              disabled={isEditing}
              className="h-11"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleUpdateMember}
              disabled={isEditing || !hasChanges()}
              className="h-11 shadow-sm"
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar miembro */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Agregar Nuevo Miembro
            </DialogTitle>
            <DialogDescription>
              Completa la información para agregar un nuevo miembro al equipo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">
                Nombre Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  placeholder="Juan Pérez"
                  disabled={isSubmitting}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identificacion" className="font-semibold">
                Identificación
              </Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identificacion"
                  value={newMember.identificacion}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      identificacion: e.target.value,
                    })
                  }
                  placeholder="1234567890"
                  disabled={isSubmitting}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  placeholder="juan@example.com"
                  disabled={isSubmitting}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold">
                Contraseña
              </Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={newMember.password}
                  onChange={(e) =>
                    setNewMember({ ...newMember, password: e.target.value })
                  }
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="font-semibold">
                Rol
              </Label>
              <Select
                value={newMember.role}
                onValueChange={(value: TypeAccount) =>
                  setNewMember({ ...newMember, role: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="role" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MECANICO">Mecánico</SelectItem>
                  <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSubmitting}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={
                !newMember.name ||
                !newMember.email ||
                !newMember.identificacion ||
                !newMember.password ||
                isSubmitting
              }
              className="h-11 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar Miembro
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
