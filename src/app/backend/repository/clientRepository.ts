import { prisma, Prisma } from "@/lib/prisma";
import { CreateClient, CreateClientChecklist, GetClient, UpdateClient } from "../types/models/entity";
import { toClientCreateInput } from "../mappers/clientMapper";
import { buildDynamicSelect } from "../utils/filtersRepository";

export const clientRepository = {
  async findMany(): Promise<GetClient[] | []> {
    try {
      return await prisma.client.findMany({
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          fullName: true,
          fullSurname: true,
          identified: true,
          clientState: true,
          clientContact: {
            select: {
              phoneNumber: true,
              email: true,
              address: true,
            },
          },
          clientVehicle: {
            select: {
              brand: true,
              model: true,
              year: true,
              plates: true,
              engineDisplacement: true,
              description: true,
            },
          },
        },
      });
    } catch {
      throw new Error(
        "Ha ocurrido un error inesperado en la consulta de campos",
      );
    }
  },

  async findById(id: number): Promise<GetClient | null> {
    try {
      return await prisma.client.findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          fullSurname: true,
          identified: true,
          clientState: true,
          clientContact: {
            select: {
              phoneNumber: true,
              email: true,
              address: true,
            },
          },
          clientVehicle: {
            select: {
              brand: true,
              model: true,
              year: true,
              plates: true,
              engineDisplacement: true,
              description: true,
            },
          },
        },
      });
    } catch {
      throw new Error("Ha ocurrido un error inesperado en la consulta");
    }
  },

  async findByIdentified(identified: string): Promise<GetClient | null> {
    try {
      return await prisma.client.findUnique({
        where: { identified },
        select: {
          id: true,
          fullName: true,
          fullSurname: true,
          identified: true,
          clientState: true,
          clientContact: {
            select: {
              phoneNumber: true,
              email: true,
              address: true,
            },
          },
          clientVehicle: {
            select: {
              brand: true,
              model: true,
              year: true,
              plates: true,
              engineDisplacement: true,
              description: true,
            },
          },
        },
      });
    } catch {
      throw new Error("Ha ocurrido un error inesperado en la consulta");
    }
  },

  async create(data: CreateClient | CreateClientChecklist) {
    const prismaData = toClientCreateInput(data);

    try {
      const clientCreate = await prisma.client.create({
        data: prismaData,
        select: {
          id: true
        }
      });

      return clientCreate;
    } catch (error) {
      console.log(error)
      throw new Error(
        "Ha ocurrido un error inesperado en la insercion de datos",
      );
    }
  },

  async update(id: number, data: UpdateClient) {
    const clientData: Record<string, unknown> = {};
    const contactData: Record<string, unknown> = {};

    const allowedClientFields = ["clientState"];
    const allowedContactFields = ["phoneNumber", "email", "address"];

    for (const key in data) {
      if (key === "id") continue;

      if (allowedClientFields.includes(key)) {
        clientData[key] = data[key];
      }

      if (allowedContactFields.includes(key)) {
        contactData[key] = data[key];
      }
    }

    const prismaData: Prisma.ClientUpdateInput = {
      ...clientData,
      clientContact: Object.keys(contactData).length
        ? { updateMany: { where: { clientId: id }, data: contactData } }
        : undefined
    };

    const select = buildDynamicSelect({
      ...clientData,
      clientContact: contactData,
    });

    try {
      return await prisma.client.update({
        where: { id },
        data: prismaData,
        select,
      });
    } catch {
      throw new Error(
        "Ha ocurrido un error inesperado en la actualizacion de campos",
      );
    }
  },

  async delete(id: number): Promise<boolean> {
    try {
      const dropClient = await prisma.client.delete({
        where: { id },
      });

      return dropClient ? true : false;
    } catch {
      throw new Error(
        "Ha ocurrido un error inesperado en la eliminacion de campos",
      );
    }
  },
};

