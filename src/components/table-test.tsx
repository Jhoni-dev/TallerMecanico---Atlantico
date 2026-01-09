"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  MapPin,
  Loader2,
  Check,
  ChevronsUpDown,
  CheckCheck,
  RefreshCw,
  GripVertical,
  Download,
  User,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { exportToExcel } from "./documentsExport/excel";
import { apiFetch } from "@/app/frontend/utils/apiFetch";
import { GetSession } from "@/app/backend/types/models/entity";
import { toast } from "sonner";

type AppointmentState = "ASIGNADA" | "COMPLETADA" | "PENDIENTE" | "CANCELADA";

interface Client {
  id: number;
  fullName: string;
  fullSurname: string;
  identified: string;
}

interface AppointmentItem {
  id: number;
  appointmentDate: Date | string;
  ubicacion: string;
  appointmentState: AppointmentState;
  details: string | null;
  author: {
    id: number;
    fullName: string;
    fullSurname: string;
    identified: string;
  };
  employedAuthor: {
    id: number;
    name: string;
    identificacion: string;
    role: string;
  } | null;
}

interface StatusBadgeProps {
  status: AppointmentState;
}

// Utility function para clases condicionales
function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    ASIGNADA: {
      icon: CheckCircle2,
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
      label: "Asignada",
    },
    COMPLETADA: {
      icon: CheckCircle2,
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
      label: "Completada",
    },
    PENDIENTE: {
      icon: Clock,
      className:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
      label: "Pendiente",
    },
    CANCELADA: {
      icon: AlertCircle,
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900",
      label: "Cancelada",
    },
  };

  const { icon: Icon, className, label } = config[status];

  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      {label}
    </Badge>
  );
};

interface TableRowProps {
  item: AppointmentItem;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (item: AppointmentItem) => void;
  onCancel: (id: number) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onEdit,
  onCancel,
  onComplete,
  onDelete,
}) => {
  const formatDate = (dateInput: Date | string) => {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateInput: Date | string) => {
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      const localDateString = dateInput.replace("col", "");
      date = new Date(localDateString);
    }

    return date.toLocaleTimeString("es-CO", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <tr
      className={cn(
        "border-b border-border transition-all hover:bg-muted/60",
        isSelected && "bg-muted/80"
      )}
    >
      <td className="px-4 py-3.5">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(item.id)}
          aria-label={`Select ${item.author.fullName}`}
        />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {item.author.fullName} {item.author.fullSurname}
            </span>
            <span className="text-xs text-muted-foreground">
              ID: {item.author.identified}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {formatDate(item.appointmentDate)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTime(item.appointmentDate)}
            </span>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">{item.ubicacion}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={item.appointmentState} />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-col">
          {item.employedAuthor ? (
            <>
              <span className="text-sm font-semibold">
                {item.employedAuthor.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {item.employedAuthor.role}
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Sin asignar
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-sm text-muted-foreground line-clamp-2">
          {item.details || (
            <span className="italic text-muted-foreground/70">
              Sin detalles
            </span>
          )}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 hover:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              Ver/Editar Detalles
            </DropdownMenuItem>
            {item.appointmentState !== "COMPLETADA" &&
              item.appointmentState !== "CANCELADA" && (
                <DropdownMenuItem onClick={() => onComplete(item.id)}>
                  Marcar como Completada
                </DropdownMenuItem>
              )}
            {item.appointmentState !== "CANCELADA" &&
              item.appointmentState !== "COMPLETADA" && (
                <DropdownMenuItem onClick={() => onCancel(item.id)}>
                  Cancelar Cita
                </DropdownMenuItem>
              )}
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-red-600 focus:text-red-600 dark:text-red-400"
            >
              Eliminar Cita
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

const AppointmentsTable: React.FC = () => {
  const [data, setData] = useState<AppointmentItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employeds, setEmployeds] = useState<GetSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingEmployed, setLoadingEmployed] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  // Estados para el diálogo de edición
  const [editDialog, setEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<AppointmentItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    ubicacion: "",
    details: "",
    appointmentState: "" as AppointmentState,
    employedId: "",
    appointmentDate: "",
    appointmentTime: "",
  });
  const [saving, setSaving] = useState(false);

  // Estados para el diálogo de creación
  const [createDialog, setCreateDialog] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    clientId: "",
    clientName: "",
    employedId: "",
    employedName: "",
    appointmentDate: "",
    appointmentTime: "",
    ubicacion: "",
    details: "",
  });
  const [creating, setCreating] = useState(false);
  const [openClientCombobox, setOpenClientCombobox] = useState(false);
  const [openEmployedCombobox, setOpenEmployedCombobox] = useState(false);

  // Estado para confirmación de eliminación
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiFetch("appointment");

      if (!response.ok) {
        throw new Error("Error al cargar las citas");
      }

      const appointments = await response.json();
      setData(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar clientes
  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await apiFetch("clientPage");

      if (!response.ok) {
        throw new Error("Error al cargar los clientes");
      }

      const clientsData = await response.json();
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Error al cargar la lista de clientes");
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchEmployed = async () => {
    try {
      setLoadingEmployed(true);
      const response = await apiFetch("user");

      if (!response.ok) {
        throw new Error("Error al cargar empleados");
      }

      const employedData = await response.json();
      setEmployeds(employedData);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de empleados"
      );
    } finally {
      setLoadingEmployed(false);
    }
  };

  useEffect(() => {
    if (createDialog) {
      fetchEmployed();
    }
  }, [createDialog]);

  const filterEmployeds = (searchQuery: string) => {
    if (!searchQuery) return employeds;

    return employeds.filter(
      (employed) =>
        employed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employed.identificacion.includes(searchQuery)
    );
  };

  // Efecto para cargar clientes cuando se abre el diálogo de creación
  useEffect(() => {
    if (createDialog) {
      fetchClients();
    }
  }, [createDialog]);

  // Función para filtrar clientes localmente basado en la búsqueda
  const filterClients = (searchQuery: string) => {
    if (!searchQuery) return clients;

    return clients.filter(
      (client) =>
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.fullSurname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.identified.includes(searchQuery)
    );
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.author.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.fullSurname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.author.identified.includes(searchTerm) ||
        item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || item.appointmentState === filterStatus;
      const matchesLocation =
        filterLocation === "all" || item.ubicacion === filterLocation;
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [data, searchTerm, filterStatus, filterLocation]);

  const locations = useMemo(
    () => [...new Set(data.map((item) => item.ubicacion))],
    [data]
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleEdit = (item: AppointmentItem) => {
    setEditingItem(item);

    const date = new Date(item.appointmentDate);
    const dateStr = date.toISOString().split("T")[0];
    const timeStr = date.toTimeString().slice(0, 5);

    setEditFormData({
      ubicacion: item.ubicacion,
      details: item.details || "",
      appointmentState: item.appointmentState,
      employedId: item.employedAuthor?.id.toString() || "",
      appointmentDate: dateStr,
      appointmentTime: timeStr,
    });
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      setSaving(true);

      const updateData: any = {
        ubicacion: editFormData.ubicacion,
        details: editFormData.details,
        appointmentState: editFormData.appointmentState,
      };

      if (editFormData.employedId) {
        updateData.employedId = parseInt(editFormData.employedId);
      }

      if (editFormData.appointmentDate || editFormData.appointmentTime) {
        updateData.time = {
          appointmentDate: editFormData.appointmentDate || null,
          appointmentTime: editFormData.appointmentTime || null,
        };
      }

      const response = await apiFetch(`appointment/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la cita");
      }

      await fetchAppointments();
      setEditDialog(false);
      setEditingItem(null);
      toast.success("Cita actualizada correctamente");
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Error al actualizar la cita");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateAppointment = async () => {
    if (
      !createFormData.clientId ||
      !createFormData.appointmentDate ||
      !createFormData.appointmentTime ||
      !createFormData.ubicacion
    ) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setCreating(true);

      const dateTimeStr = `${createFormData.appointmentDate}T${createFormData.appointmentTime}:00`;
      const appointmentDate = new Date(dateTimeStr);

      const newAppointment = {
        clientId: parseInt(createFormData.clientId),
        employedId: createFormData.employedId
          ? parseInt(createFormData.employedId)
          : undefined,
        appointmentDate: appointmentDate.toISOString(),
        ubicacion: createFormData.ubicacion,
        details: createFormData.details || undefined,
      };

      const response = await apiFetch("appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        throw new Error("Error al crear la cita");
      }

      await fetchAppointments();
      setCreateDialog(false);
      setCreateFormData({
        clientId: "",
        clientName: "",
        employedId: "",
        employedName: "",
        appointmentDate: "",
        appointmentTime: "",
        ubicacion: "",
        details: "",
      });
      toast.success("Cita creada exitosamente");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Error al crear la cita");
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      const response = await apiFetch(`appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentState: "CANCELADA",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al cancelar la cita");
      }

      await fetchAppointments();
      toast.success("Cita cancelada");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Error al cancelar la cita");
    }
  };

  const handleComplete = async (id: number) => {
    try {
      const response = await apiFetch(`appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentState: "COMPLETADA",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al completar la cita");
      }

      await fetchAppointments();
      toast.success("Cita completada");
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Error al completar la cita");
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;

    try {
      setDeleting(true);
      const response = await apiFetch(`appointment/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la cita");
      }

      await fetchAppointments();
      setDeleteDialog(false);
      setDeletingId(null);
      toast.success("Cita eliminada");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Error al eliminar la cita");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (selected.size === paginatedData.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginatedData.map((item) => item.id)));
    }
  };

  const handleToggleSelect = (id: number) => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  const handlePageChange = (page: number) =>
    setCurrentPage(Math.max(0, Math.min(totalPages - 1, page)));

  const handleExportExcel = async () => {
    const exportData = filteredData.map((appointment) => {
      const clienteNombre = appointment.author?.fullName || "";
      const clienteApellido = appointment.author?.fullSurname || "";
      const clienteCedula = appointment.author?.identified || "";

      const mecanicoNombre = appointment.employedAuthor?.name || "";
      const mecanicoCedula = appointment.employedAuthor?.identificacion || "";
      const mecanicoRol = appointment.employedAuthor?.role || "";

      return {
        id: appointment.id,
        fecha: appointment.appointmentDate,
        cliente: `${clienteNombre} ${clienteApellido}`.trim(),
        cedula_cliente: clienteCedula,
        mecanico: mecanicoNombre,
        cedula_mecanico: mecanicoCedula,
        rol: mecanicoRol,
        estado: appointment.appointmentState,
        ubicacion: appointment.ubicacion,
        detalles: appointment.details,
      };
    });

    await exportToExcel({
      data: exportData,
      fileName: "citas_{date}.xlsx",
      sheetName: "Registro de Citas",

      title: "REPORTE DE CITAS",
      subtitle: `Generado el ${new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,

      autoFilter: true,
      freezeHeader: true,
      includeStatistics: true,
      includeCharts: true,

      pagination: {
        enabled: true,
        rowsPerPage: 100,
        createIndex: true,
      },

      statistics: [
        {
          title: "Total",
          value: stats.total,
          description: "Registradas",
          bgColor: "FFF9FAFB",
        },
        {
          title: "Asignadas",
          value: stats.asignadas,
          description: "En proceso",
          bgColor: "FFDBEAFE",
          textColor: "FF2563EB",
        },
        {
          title: "Pendientes",
          value: stats.pendientes,
          description: "Por asignar",
          bgColor: "FFFEF3C7",
          textColor: "FFF59E0B",
        },
        {
          title: "Completadas",
          value: stats.completadas,
          description: "Finalizadas",
          bgColor: "FFD1FAE5",
          textColor: "FF10B981",
        },
      ],

      charts: [
        {
          title: "Distribución de Citas",
          type: "column",
          categories: ["Asignadas", "Pendientes", "Completadas", "Canceladas"],
          values: [
            stats.asignadas,
            stats.pendientes,
            stats.completadas,
            stats.canceladas,
          ],
        },
      ],

      columns: [
        { header: "ID", key: "id", width: 15 },
        {
          header: "Fecha",
          key: "fecha",
          width: 35,
          isDate: true,
          dateFormat: "datetime",
        },
        { header: "Cliente", key: "cliente", width: 50 },
        { header: "Cédula", key: "cedula_cliente", width: 30 },
        { header: "Mecánico", key: "mecanico", width: 50 },
        { header: "Cédula Mec.", key: "cedula_mecanico", width: 30 },
        { header: "Rol", key: "rol", width: 25 },
        { header: "Estado", key: "estado", width: 30 },
        { header: "Ubicación", key: "ubicacion", width: 30 },
      ],
    });
  };

  const stats = useMemo(() => {
    return {
      total: data.length,
      asignadas: data.filter((item) => item.appointmentState === "ASIGNADA")
        .length,
      pendientes: data.filter((item) => item.appointmentState === "PENDIENTE")
        .length,
      completadas: data.filter((item) => item.appointmentState === "COMPLETADA")
        .length,
      canceladas: data.filter((item) => item.appointmentState === "CANCELADA")
        .length,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Cargando citas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Gestión de Citas
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Administra las citas de tus clientes •{" "}
                <span className="font-semibold text-foreground">
                  {data.length}
                </span>{" "}
                citas registradas
              </p>
            </div>

            {/* Botones principales - Desktop */}
            <div className="hidden lg:flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAppointments}
                className="hover:bg-primary/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setCreateDialog(true)}
                size="sm"
                className="shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
              <Button
                variant="outline"
                onClick={handleExportExcel}
                size="sm"
                className="hover:bg-primary/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>

            {/* Botones principales - Mobile/Tablet */}
            <div className="flex lg:hidden gap-2">
              <Button
                onClick={() => setCreateDialog(true)}
                size="sm"
                className="flex-1 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Cita
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    <Button
                      onClick={fetchAppointments}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleExportExcel}
                      className="w-full justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Excel
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-semibold">
                Total
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <CheckCheck className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Citas registradas
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200/50 shadow-sm hover:shadow-md transition-shadow dark:border-blue-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-semibold">
                Asignadas
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.asignadas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">En proceso</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200/50 shadow-sm hover:shadow-md transition-shadow dark:border-amber-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-semibold">
                Pendientes
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.pendientes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Por asignar</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow dark:border-emerald-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-semibold">
                Completadas
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.completadas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Finalizadas</p>
            </CardContent>
          </Card>

          <Card className="border-red-200/50 shadow-sm hover:shadow-md transition-shadow dark:border-red-900/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs md:text-sm font-semibold">
                Canceladas
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.canceladas}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Anuladas</p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda y filtros */}
        <Card className="mb-6 border-border/50 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar por cliente, ID o ubicación..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="pl-10 h-10"
                  />
                </div>
              </div>

              <div className="w-full md:w-52">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Estado
                </label>
                <Select
                  value={filterStatus}
                  onValueChange={(value) => {
                    setFilterStatus(value);
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="ASIGNADA">Asignada</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="COMPLETADA">Completada</SelectItem>
                    <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-52">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Ubicación
                </label>
                <Select
                  value={filterLocation}
                  onValueChange={(value) => {
                    setFilterLocation(value);
                    setCurrentPage(0);
                  }}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Todas las ubicaciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ubicaciones</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-auto">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 md:opacity-0">
                  Limpiar
                </label>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setFilterLocation("all");
                    setCurrentPage(0);
                  }}
                  className="w-full md:w-auto h-10"
                >
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vista de tabla para desktop */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-border/50 shadow-sm bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="w-12 px-4 py-4">
                  <Checkbox
                    checked={
                      selected.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onCheckedChange={handleToggleSelectAll}
                    aria-label="Select all items"
                  />
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Cliente
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Fecha y Hora
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Ubicación
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Estado
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Empleado Asignado
                  </span>
                </th>
                <th className="px-4 py-4 text-left">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Detalles
                  </span>
                </th>
                <th className="px-4 py-4 text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Acciones
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-full bg-muted p-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="font-medium">No hay citas registradas</p>
                      <p className="text-sm">
                        Crea una nueva cita para comenzar
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    item={item}
                    isSelected={selected.has(item.id)}
                    onToggleSelect={handleToggleSelect}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                    onComplete={handleComplete}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Vista de tarjetas para móvil */}
        <div className="md:hidden space-y-3">
          {paginatedData.length === 0 ? (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-muted p-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">
                    No hay citas registradas
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Crea una nueva cita para comenzar
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            paginatedData.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "border-border/50 shadow-sm transition-all hover:shadow-md",
                  selected.has(item.id) &&
                    "border-primary bg-primary/5 ring-1 ring-primary/20"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        checked={selected.has(item.id)}
                        onCheckedChange={() => handleToggleSelect(item.id)}
                        aria-label={`Select ${item.author.fullName}`}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">
                          {item.author.fullName} {item.author.fullSurname}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          ID: {item.author.identified}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-md">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">
                              {new Date(
                                item.appointmentDate
                              ).toLocaleDateString("es-ES")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs bg-muted px-2 py-1 rounded-md">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">
                              {item.ubicacion}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={item.appointmentState} />
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          Ver/Editar
                        </DropdownMenuItem>
                        {item.appointmentState !== "COMPLETADA" &&
                          item.appointmentState !== "CANCELADA" && (
                            <DropdownMenuItem
                              onClick={() => handleComplete(item.id)}
                            >
                              Completar
                            </DropdownMenuItem>
                          )}
                        {item.appointmentState !== "CANCELADA" &&
                          item.appointmentState !== "COMPLETADA" && (
                            <DropdownMenuItem
                              onClick={() => handleCancel(item.id)}
                            >
                              Cancelar
                            </DropdownMenuItem>
                          )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-600 focus:text-red-600 dark:text-red-400"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {item.details && (
                    <p className="text-xs text-muted-foreground line-clamp-2 pt-3 border-t">
                      {item.details}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Paginación */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <span className="text-xs md:text-sm text-muted-foreground font-medium">
            <span className="font-bold text-foreground">{selected.size}</span>{" "}
            de{" "}
            <span className="font-bold text-foreground">
              {filteredData.length}
            </span>{" "}
            seleccionados
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
      </div>

      {/* Diálogo de Creación */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Nueva Cita</DialogTitle>
            <DialogDescription>
              Completa la información para crear una nueva cita
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2.5">
              <Label htmlFor="create-client" className="font-semibold">
                Cliente <span className="text-red-500">*</span>
              </Label>
              <Popover
                open={openClientCombobox}
                onOpenChange={setOpenClientCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openClientCombobox}
                    className="w-full justify-between h-11"
                  >
                    {createFormData.clientName || "Seleccionar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente por nombre o ID..." />
                    <CommandEmpty>
                      {loadingClients
                        ? "Cargando clientes..."
                        : "No se encontraron clientes."}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {filterClients("").map((client) => (
                        <CommandItem
                          key={client.id}
                          value={`${client.fullName} ${client.fullSurname} - ${client.identified}`}
                          onSelect={() => {
                            setCreateFormData({
                              ...createFormData,
                              clientId: client.id.toString(),
                              clientName: `${client.fullName} ${client.fullSurname} (ID: ${client.identified})`,
                            });
                            setOpenClientCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              createFormData.clientId === client.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {client.fullName} {client.fullSurname}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ID: {client.identified}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {createFormData.clientId && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-1 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    Cliente seleccionado: ID {createFormData.clientId}
                  </span>
                </div>
              )}
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor="create-employed" className="font-semibold">
                Empleado{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (opcional)
                </span>
              </Label>
              <Popover
                open={openEmployedCombobox}
                onOpenChange={setOpenEmployedCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openEmployedCombobox}
                    className="w-full justify-between h-11"
                  >
                    {createFormData.employedName || "Seleccionar empleado..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar empleado por nombre o ID..." />
                    <CommandEmpty>
                      {loadingEmployed
                        ? "Cargando empleados..."
                        : "No se encontraron empleados."}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {filterEmployeds("").map((employed) => (
                        <CommandItem
                          key={employed.id}
                          value={`${employed.name} - ${employed.identificacion}`}
                          onSelect={() => {
                            setCreateFormData({
                              ...createFormData,
                              employedId: employed.id.toString(),
                              employedName: `${employed.name} (ID: ${employed.identificacion})`,
                            });
                            setOpenEmployedCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              createFormData.employedId ===
                                employed.id.toString()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">{employed.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ID: {employed.identificacion}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {createFormData.employedId && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-1 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="font-medium">
                    Empleado seleccionado: ID {createFormData.employedId}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2.5">
                <Label htmlFor="create-date" className="font-semibold">
                  Fecha <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-date"
                  type="date"
                  value={createFormData.appointmentDate}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      appointmentDate: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="create-time" className="font-semibold">
                  Hora <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-time"
                  type="time"
                  value={createFormData.appointmentTime}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      appointmentTime: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor="create-ubicacion" className="font-semibold">
                Ubicación <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-ubicacion"
                placeholder="Ej: Taller Central - Zona A"
                value={createFormData.ubicacion}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    ubicacion: e.target.value,
                  })
                }
                className="h-11"
              />
            </div>

            <div className="grid gap-2.5">
              <Label htmlFor="create-details" className="font-semibold">
                Detalles{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (opcional)
                </span>
              </Label>
              <Textarea
                id="create-details"
                placeholder="Describe el servicio o trabajo a realizar..."
                value={createFormData.details}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    details: e.target.value,
                  })
                }
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialog(false);
                setCreateFormData({
                  clientId: "",
                  clientName: "",
                  employedId: "",
                  employedName: "",
                  appointmentDate: "",
                  appointmentTime: "",
                  ubicacion: "",
                  details: "",
                });
              }}
              disabled={creating}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateAppointment}
              disabled={creating || !createFormData.clientId}
              className="h-11 shadow-sm"
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear Cita"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Edición */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Editar Cita
            </DialogTitle>
            <DialogDescription>
              Modifica los detalles de la cita seleccionada
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2.5">
                <Label htmlFor="edit-date" className="font-semibold">
                  Fecha
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editFormData.appointmentDate}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      appointmentDate: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="edit-time" className="font-semibold">
                  Hora
                </Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editFormData.appointmentTime}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      appointmentTime: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="edit-ubicacion" className="font-semibold">
                Ubicación
              </Label>
              <Input
                id="edit-ubicacion"
                value={editFormData.ubicacion}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    ubicacion: e.target.value,
                  })
                }
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2.5">
                <Label htmlFor="edit-estado" className="font-semibold">
                  Estado
                </Label>
                <Select
                  value={editFormData.appointmentState}
                  onValueChange={(value: AppointmentState) =>
                    setEditFormData({
                      ...editFormData,
                      appointmentState: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-estado" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASIGNADA">Asignada</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="COMPLETADA">Completada</SelectItem>
                    <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="edit-employedId" className="font-semibold">
                  ID del Empleado
                </Label>
                <Input
                  id="edit-employedId"
                  type="number"
                  placeholder="ID del empleado"
                  value={editFormData.employedId}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      employedId: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="edit-details" className="font-semibold">
                Detalles
              </Label>
              <Textarea
                id="edit-details"
                value={editFormData.details}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, details: e.target.value })
                }
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditDialog(false)}
              disabled={saving}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={saving}
              className="h-11 shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              ¿Eliminar cita?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Esta acción no se puede deshacer. La cita será eliminada
              permanentemente del sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              disabled={deleting}
              className="h-11"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="h-11"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsTable;
