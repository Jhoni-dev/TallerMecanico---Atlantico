import { ClientVehicle, Prisma } from '@prisma/client';
import { CreateClient, CreateClientChecklist } from "../types/models/entity";

export function toClientCreateInput(data: CreateClient | CreateClientChecklist) {
    const { clientContact, clientVehicle } = data;

    const prismaData: Prisma.ClientCreateInput = {
        fullName: data.fullName as string,
        fullSurname: data.fullSurname as string,
        identified: data.identified as string,
        ...(clientContact ? {
            clientContact: {
                create: {
                    phoneNumber: clientContact.phoneNumber as string,
                    email: clientContact.email as string,
                    ...('address' in clientContact ? {
                        address: clientContact.address as string
                    } : {})
                }
            },
        } : {})
    }

    return prismaData ?? {};
}