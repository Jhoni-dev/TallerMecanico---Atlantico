import { clientRepository } from "../repository/clientRepository";
import { GetClient, CreateClient, UpdateClient } from "../types/models/entity";

export async function getClientById(id: string): Promise<GetClient | null> {
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
        throw new Error("El ID proporcionado no es válido");
    }

    const data = await clientRepository.findById(clientId);

    if (!data) {
        throw new Error("No se ha encontrado el cliente especificado");
    }

    return data;
}

export async function getAllClient(): Promise<GetClient[] | []> {
    const data = await clientRepository.findMany();

    if (!data || data.length === 0) {
        throw new Error("No se han encontrado clientes registrados");
    }

    return data;
}

export async function createClient(data: CreateClient) {
    if (!data) {
        throw new Error("No se encontraron campos");
    }

    // Validar fullName
    if (!data.fullName || data.fullName.trim() === "") {
        throw new Error("El campo 'Nombres' es requerido");
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.fullName)) {
        throw new Error("Caracteres no válidos en 'Nombres'");
    }

    // Validar fullSurname
    if (!data.fullSurname || data.fullSurname.trim() === "") {
        throw new Error("El campo 'Apellidos' es requerido");
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(data.fullSurname)) {
        throw new Error("Caracteres no válidos en 'Apellidos'");
    }

    // Validar identified
    if (!data.identified || data.identified.trim() === "") {
        throw new Error("El campo 'Identificación' es requerido");
    }
    if (!/^\d+$/.test(data.identified.trim())) {
        throw new Error("Caracteres no válidos en 'Identificación'");
    }

    // Validar clientContact si existe
    if (data.clientContact) {
        if (!data.clientContact.phoneNumber || data.clientContact.phoneNumber.trim() === "") {
            throw new Error("El campo 'Teléfono' es requerido");
        }
        if (!/^\d+$/.test(data.clientContact.phoneNumber.trim())) {
            throw new Error("Caracteres no válidos en 'Teléfono'");
        }

        if (!data.clientContact.email || data.clientContact.email.trim() === "") {
            throw new Error("El campo 'Email' es requerido");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientContact.email.trim())) {
            throw new Error("Asegúrate de digitar un correo válido");
        }
    }

    const clientExist = await clientRepository.findByIdentified(data.identified.trim());

    if (clientExist) {
        throw new Error("El cliente digitado ya se encuentra registrado");
    }

    const clientCreate = await clientRepository.create(data);

    return clientCreate;
}

export async function deleteClient(id: string): Promise<boolean> {
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
        throw new Error("El ID proporcionado no es válido");
    }

    const clientExist = await clientRepository.findById(clientId);

    if (!clientExist) {
        throw new Error("El cliente no se encuentra disponible");
    }

    const clientDelete = await clientRepository.delete(clientId);

    return clientDelete;
}

export async function updateClient(id: string, input: UpdateClient) {
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
        throw new Error("El ID proporcionado no es válido");
    }

    if (!input) {
        throw new Error("Asegúrate de digitar los respectivos campos");
    }

    // Validar phoneNumber
    if (!input.phoneNumber || input.phoneNumber.trim() === "") {
        throw new Error("El campo 'Teléfono' es requerido");
    }
    if (!/^\d+$/.test(input.phoneNumber.trim())) {
        throw new Error("Caracteres no válidos en 'Teléfono'");
    }

    // Validar email
    if (!input.email || input.email.trim() === "") {
        throw new Error("El campo 'Email' es requerido");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
        throw new Error("Asegúrate de digitar un correo válido");
    }

    const clientExist = await clientRepository.findById(clientId);

    if (!clientExist) {
        throw new Error("El cliente no se encuentra disponible");
    }

    const updateClientData = await clientRepository.update(clientId, input);

    if (!updateClientData) {
        throw new Error("No se ha podido actualizar correctamente el cliente");
    }

    return updateClientData;
}

export async function changeState(id: string, data: Record<string, boolean>) {
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
        throw new Error("El ID proporcionado no es válido");
    }

    if (!data || typeof data.clientState !== 'boolean') {
        throw new Error("Ha ocurrido un error inesperado en la actualización del estado");
    }

    const clientExist = await clientRepository.findById(clientId);

    if (!clientExist) {
        throw new Error("El cliente no se encuentra disponible");
    }

    const clientState = await clientRepository.update(clientId, data.clientState);

    if (!clientState) {
        throw new Error("No se ha podido cambiar el estado del cliente");
    }

    return clientState;
}