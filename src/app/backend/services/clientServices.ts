import z, { ZodError } from "zod";
import { clientRepository } from "../repository/clientRepository";
import { GetClient, CreateClient, UpdateClient } from "../types/models/entity";

export async function getClientById(id: string): Promise<GetClient | null> {
    const clientId = parseInt(id, 10);

    const data = await clientRepository.findById(clientId);

    if (!data) throw new Error("No se ha encontrado el cliente especificado");

    return data;
}

export async function getAllClient(): Promise<GetClient[] | []> {
    const data = await clientRepository.findMany();

    if (!data) throw new Error("No se ha encontrado clientes registrados");

    return data;
}

export async function createClient(data: CreateClient) {
    if (!data) throw new Error("No se encontraron campos");

    const validateEntryData = z.object({
        fullName: z.string().nonempty("Asegurate de llenar los campos requeridos").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Caracteres no validos en 'Nombres'"),
        fullSurname: z.string().nonempty("Asegurate de llenar los campos requeridos").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Caracteres no validos en 'Apellidos'"),
        identified: z.string().trim().nonempty("Asegurate de llenar los campos requeridos").regex(/^\d+$/, "Caracteres no validos en 'Identificacion'"),


        clientContact: z.object({
            phoneNumber: z.string().trim().nonempty("Asegurate de llenar los campos requeridos").regex(/^\d+$/, "Caracteres no validos en 'Telefono'"),
            email: z.string().trim().nonempty("Asegurate de llenar los campos requeridos").email("Asegurate de digitar un correo valido"),
            address: z.string().nullable()
        }).optional(),
    }).strict();

    const result = validateEntryData.safeParse(data);

    if (!result.success) return result.error;

    const clientExist = await clientRepository.findByIdentified(result.data.identified)

    if (clientExist) throw new Error("El cliente digitado ya se encuentra registrado");

    const clientCreate = await clientRepository.create(data);

    return clientCreate;
}

export async function deleteClient(id: string): Promise<boolean> {
    const clientId = parseInt(id, 10);

    const clientDelete = await clientRepository.delete(clientId);

    return clientDelete;
}

export async function updateClient(id: string, input: UpdateClient) {
    const clientId = parseInt(id, 10);

    if (!input) throw new Error("Asegurate de digitar los respectivos campos");

    const validateEntryData = z.object({
        phoneNumber: z.string().trim().nonempty("Asegurate de llenar los campos requeridos").regex(/^\d+$/, "Caracteres no validos en 'Telefono'"),
        email: z.string().trim().nonempty("Asegurate de llenar los campos requeridos").email("Asegurate de digitar un correo valido"),
        address: z.string().nullable()
    }).strict();

    const result = validateEntryData.safeParse(input);

    if (!result.success) return result.error;

    const clientExist = await clientRepository.findById(clientId)

    if (!clientExist) throw new Error("El cliente no se encuentra disponible");

    const updateClient = await clientRepository.update(clientId, result.data);

    if (!updateClient) throw new Error("No se ha podido actualizar correctamente el cliente");

    return updateClient;
}

export async function changeState(id: string, data: Record<string, boolean>) {
    const clientId = parseInt(id, 10);

    const validateEntryData = z.object({
        clientState: z.boolean()
    }).strict();

    const result = validateEntryData.safeParse(data);

    if (!result.success) throw new Error("Ha ocurrido un error inesperado en la actualizacion del estado");

    const clientExist = await clientRepository.findById(clientId)

    if (!clientExist) throw new Error("El cliente no se encuentra disponible");

    const clientState = await clientRepository.update(clientId, result.data.clientState);

    if (!clientState) throw new Error("No se ha podido cambiar el estado del cliente");

    return clientState;
}