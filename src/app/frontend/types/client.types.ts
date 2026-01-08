// src/types/client.types.ts

export interface ClientContact {
    phoneNumber: string;
    email: string;
    address?: string;
}

export interface ClientVehicle {
    id: number;
    brand: string;
    model: string;
    year: number;
    engineDisplacement: number;
    plates?: string;
    description?: string;
}

export interface Client {
    id?: number;
    fullName: string;
    fullSurname: string;
    identified: string;
    clientState: boolean;
    clientContact: ClientContact[];
    clientVehicle: ClientVehicle[];
}

export interface CreateClientPayload {
    fullName: string;
    fullSurname: string;
    identified: string;
    clientContact: {
        phoneNumber: string;
        email: string;
        address?: string;
    };
}

export interface CreateVehiclePayload {
    brand: string;
    model: string;
    year: number;
    engineDisplacement: number;
    plates: string;
    description?: string;
    clientId: number;
}

export interface UpdateVehiclePayload {
    brand: string;
    model: string;
    year: number;
    engineDisplacement: number;
    plates: string;
    description?: string;
}

export interface ClientFormData {
    fullName: string;
    fullSurname: string;
    identified: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export interface ContactFormData {
    phoneNumber: string;
    email: string;
    address: string;
}

export interface VehicleFormData {
    brand: string;
    model: string;
    year: string;
    engineDisplacement: string;
    plates: string;
    description: string;
    clientId: number | null;
}