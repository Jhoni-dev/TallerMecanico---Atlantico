import { prisma } from "@/lib/prisma";
import { CreateChecklist, CreateChecklistPersistenceFormat, UpdateChecklist } from "../types/models/entity";
import { toVehicleChecklistMapper } from "../mappers/vehicleChecklistMapper";

export const vehicleChecklistRepository = {
    async create(input: CreateChecklistPersistenceFormat) {
        try {
            const prismaData = toVehicleChecklistMapper(input);

            return await prisma.vehicleChecklist.create({
                data: prismaData
            });
        } catch (error) {
            console.log(error);
            throw new Error("Error de persistencia en checklist");

        }
    },

    async findAll() {
        return await prisma.vehicleChecklist.findMany({
            orderBy: {
                id: 'asc'
            },
            include: { items: true, appointment: true, clientVehicle: true, session: true, client: true, vehicleImage: true }
        });
    },

    async findById(id: number) {
        return await prisma.vehicleChecklist.findUnique({
            where: { id },
            include: { items: true, appointment: true, clientVehicle: true, session: true, client: true, vehicleImage: true }
        });
    },

    async update(id: number, data: Partial<UpdateChecklist>) {
        return await prisma.vehicleChecklist.update({
            where: { id },
            data
        });
    },

    async delete(id: number) {
        return await prisma.vehicleChecklist.delete({
            where: { id }
        });
    },
};