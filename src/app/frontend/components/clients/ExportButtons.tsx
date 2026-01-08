// src/components/clients/ExportButtons.tsx

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Client, ClientVehicle } from "@/app/frontend/types/client.types";
import { exportToExcel } from "@/components/documentsExport/excel";

interface ExportButtonsProps {
  clients: Client[];
  vehicles: ClientVehicle[];
}

export function ExportButtons({ clients, vehicles }: ExportButtonsProps) {
  const handleExportClients = async () => {
    const exportClients = clients.flatMap((c) => {
      if (c.clientContact && c.clientContact.length > 0) {
        return c.clientContact.map((contact) => ({
          id: c.id,
          fullName: c.fullName,
          fullSurname: c.fullSurname,
          identified: c.identified,
          clientState: c.clientState ? "ACTIVO" : "INACTIVO",
          phoneNumber: contact.phoneNumber || "",
          email: contact.email || "",
          address: contact.address || "",
        }));
      } else {
        return [
          {
            id: c.id,
            fullName: c.fullName,
            fullSurname: c.fullSurname,
            identified: c.identified,
            clientState: c.clientState ? "ACTIVO" : "INACTIVO",
            phoneNumber: "",
            email: "",
            address: "",
          },
        ];
      }
    });

    await exportToExcel({
      data: exportClients,
      fileName: "clientes_{date}.xlsx",
      sheetName: "Clientes",
      title: "REPORTE DE CLIENTES",
      subtitle: `Generado el ${new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      autoFilter: true,
      freezeHeader: true,
      includeStatistics: true,
      pagination: {
        enabled: true,
        rowsPerPage: 100,
        createIndex: true,
      },
      statistics: [
        {
          title: "Total Clientes",
          value: clients.length,
          description: "Registrados",
          bgColor: "FFF3F4F6",
          textColor: "FF1F2937",
        },
        {
          title: "Activos",
          value: clients.filter((c) => c.clientState).length,
          description: "Habilitados",
          bgColor: "FFD1FAE5",
          textColor: "FF10B981",
        },
        {
          title: "Inactivos",
          value: clients.filter((c) => !c.clientState).length,
          description: "Deshabilitados",
          bgColor: "FFFEE2E2",
          textColor: "FFEF4444",
        },
        {
          title: "Con Vehículos",
          value: clients.filter(
            (c) => c.clientVehicle && c.clientVehicle.length > 0
          ).length,
          description: "Registrados",
          bgColor: "FFDBEAFE",
          textColor: "FF2563EB",
        },
      ],
      columns: [
        { header: "ID", key: "id", width: 8, alignment: "center" },
        { header: "Nombres", key: "fullName", width: 20 },
        { header: "Apellidos", key: "fullSurname", width: 20 },
        {
          header: "Identificación",
          key: "identified",
          width: 15,
          alignment: "center",
        },
        {
          header: "Estado",
          key: "clientState",
          width: 12,
          alignment: "center",
        },
        {
          header: "Teléfono",
          key: "phoneNumber",
          width: 15,
          alignment: "center",
        },
        { header: "Correo", key: "email", width: 30 },
        { header: "Dirección", key: "address", width: 35 },
      ],
      headerStyle: {
        bgColor: "FF374151",
        textColor: "FFFFFFFF",
        fontSize: 10,
      },
    });
  };

  const handleExportVehicles = async () => {
    const exportVehicles = clients.flatMap((c) => {
      if (c.clientVehicle && c.clientVehicle.length > 0) {
        return c.clientVehicle.map((vehicle) => ({
          id: c.id,
          fullName: c.fullName,
          fullSurname: c.fullSurname,
          identified: c.identified,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          plates: vehicle.plates,
          engineDisplacement: vehicle.engineDisplacement,
          description: vehicle.description || "",
        }));
      }
      return [];
    });

    if (exportVehicles.length === 0) {
      alert("No hay vehículos para exportar");
      return;
    }

    await exportToExcel({
      data: exportVehicles,
      fileName: "clientesVehiculos_{date}.xlsx",
      sheetName: "Vehiculos de Clientes",
      title: "REPORTE DE VEHICULOS",
      subtitle: `Generado el ${new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      autoFilter: true,
      freezeHeader: true,
      includeStatistics: true,
      pagination: {
        enabled: true,
        rowsPerPage: 100,
        createIndex: true,
      },
      statistics: [
        {
          title: "Total Clientes",
          value: clients.length,
          description: "Registrados",
          bgColor: "FFF3F4F6",
          textColor: "FF1F2937",
        },
        {
          title: "Total Vehiculos",
          value: vehicles.length,
          description: "Registrados",
          bgColor: "FFDBEAFE",
          textColor: "FF2563EB",
        },
      ],
      columns: [
        { header: "ID", key: "id", width: 8, alignment: "center" },
        { header: "Nombres", key: "fullName", width: 20, alignment: "center" },
        {
          header: "Apellidos",
          key: "fullSurname",
          width: 20,
          alignment: "center",
        },
        {
          header: "Identificación",
          key: "identified",
          width: 15,
          alignment: "center",
        },
        {
          header: "Marca",
          key: "brand",
          width: 15,
          alignment: "center",
        },
        { header: "Modelo", key: "model", width: 15, alignment: "center" },
        { header: "Año", key: "year", width: 10, alignment: "center" },
        { header: "Placas", key: "plates", width: 15, alignment: "center" },
        {
          header: "Cilindrada",
          key: "engineDisplacement",
          width: 15,
          alignment: "center",
        },
        {
          header: "Descripcion",
          key: "description",
          width: 50,
          alignment: "center",
        },
      ],
      headerStyle: {
        bgColor: "FF374151",
        textColor: "FFFFFFFF",
        fontSize: 10,
      },
    });
  };

  return (
    <>
      <Button variant="outline" onClick={handleExportClients} size="sm">
        <Download className="h-4 w-4 mr-2" />
        Exportar Clientes
      </Button>
      <Button variant="outline" onClick={handleExportVehicles} size="sm">
        <Download className="h-4 w-4 mr-2" />
        Exportar Vehículos
      </Button>
    </>
  );
}
