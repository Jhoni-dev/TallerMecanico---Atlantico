// src/types/checklist.types.ts

import { VehicleImage } from "@prisma/client";

export type TypeAccount = "MECANICO" | "ADMINISTRADOR";

export interface ChecklistItem {
    id?: number;
    label: string;
    category: string;
    checked: boolean;
    condition?: string;
    notes?: string;
    checklistId?: number;
}

export interface Vehicle {
    id: number;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    color?: string;
    vin?: string;
}

export interface Appointment {
    id: number;
    appointmentDate: Date;
    ubicacion: string;
    appointmentState: string;
    details: string | null;
    author: {
        id: number;
        fullName: string;
        fullSurname: string;
        identified: string;
        email?: string;
        phone?: string;
    };
    employedAuthor: {
        id: number;
        name: string;
        identificacion: string;
        role: string;
    } | null;
    vehicle?: Vehicle;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    guarantee: string;
    createAt: Date;
    author: {
        id: number;
        name: string;
    };
    categoryId?: number;
    serviceCategory?: {
        id: number;
        name: string;
    };
}

export interface ServiceCategory {
    id: number;
    name: string;
    description: string;
    createAt: Date;
}

// src/app/frontend/types/checklist.types.ts

// ... (otros tipos)

export interface VehicleChecklist {
    id?: number;
    checkType: string;
    fuelLevel: number;
    mileage: string;
    generalNotes: string;
    technicianName: string;
    completedAt?: Date;
    appointmentId?: number;
    clientId?: number | null;
    mechanicId?: number | null;
    sessionId?: number | null;
    vehicleId?: number | null;
    appointment?: Appointment;
    items?: ChecklistItem[];
    vehicleImage?: VehicleImage[] | [];

    // Datos del backend cuando es modo manual
    client?: {
        id: number;
        fullName: string;
        fullSurname: string;
        identified: string;
        clientState: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null;

    session?: {
        id: number;
        name: string;
        identificacion: string;
        email: string;
        role: string;
        createdAt: Date;
    } | null;

    // Vehículo del checklist
    clientVehicle?: {
        id: number;
        brand: string;
        model: string;
        year: number;
        engineDisplacement: number;
        description: string | null;
        plates: string;
    } | null;

    // Datos temporales para el frontend (antes de enviar al backend)
    manualClientData?: ManualClientData;
    manualTechnicianData?: ManualTechnicianData;
    manualVehicleData?: ManualVehicleData;
}

// Agregar este tipo si no existe
export interface ManualVehicleData {
    brand: string;
    model: string;
    year: number;
    plates: string;
    engineDisplacement?: number;
    description?: string;
}

export interface VehicleImageData {
    file: File;
    previewUrl: string;
    description: string;
}

export interface VehicleImageFromBackend {
    id: number;
    checkList_id: number;
    imageUrl: string;
    description: string | null;
    createAt: string;
}

// Agregar estos tipos

// Asegúrate de que estos tipos estén exportados

export interface ManualClientData {
    id: number;
    fullName: string;
    fullSurname: string;
    identified: string;
    clientContact?: {
        phoneNumber?: string;
        email?: string;
    }
}

export interface ManualTechnicianData {
    id: number;
    name: string;
    identification?: string;
}

export const ITEM_CATEGORIES = [
    "Exterior",
    "Interior",
    "Motor",
    "Frenos",
    "Suspensión",
    "Eléctrico",
    "Neumáticos",
    "Fluidos",
    "Seguridad",
] as const;

export const CONDITIONS = [
    "Excelente",
    "Bueno",
    "Regular",
    "Malo",
    "Requiere Atención",
] as const;