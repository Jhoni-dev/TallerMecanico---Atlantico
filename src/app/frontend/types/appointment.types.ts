// src/types/appointment.types.ts

export type AppointmentStatus = "ASIGNADA" | "COMPLETADA" | "PENDIENTE" | "CANCELADA";

export interface AppointmentAuthor {
    id: number;
    fullName: string;
    fullSurname: string;
    identified: string;
}

export interface AppointmentEmployee {
    id: number;
    name: string;
    identificacion: string;
    role: string;
}

export interface Appointment {
    id: number;
    appointmentDate: Date | string;
    ubicacion: string;
    appointmentState: AppointmentStatus;
    details: string | null;
    author: AppointmentAuthor;
    employedAuthor: AppointmentEmployee | null;
}

export interface AppointmentStats {
    asignadas: number;
    completadas: number;
    pendientes: number;
    canceladas: number;
}

export interface SelectedDate {
    year: number;
    month: number;
    day: number;
}