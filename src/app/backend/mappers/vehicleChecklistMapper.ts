import { Prisma } from "@prisma/client";
import { CreateChecklistPersistenceFormat } from "../types/models/entity";

export function toVehicleChecklistMapper(data: CreateChecklistPersistenceFormat) {
    const prismaData: Prisma.VehicleChecklistCreateInput = {
        checkType: data.checkType as string,
        fuelLevel: data.fuelLevel as number,
        mileage: data.mileage as string,
        generalNotes: data.generalNotes as string,
        technicianName: data.technicianName as string,
        clientVehicle: {
            connect: { id: data.vehicleId },
        },

        client: data.clientId
            ? {
                connect: { id: data.clientId },
            }
            : undefined,

        session: data.mechanicId
            ? {
                connect: { id: data.mechanicId },
            } : undefined,

        appointment: data.appointmentId
            ? {
                connect: { id: data.appointmentId },
            }
            : undefined,
    };

    return prismaData ?? {};
}