import { CreateChecklist, CreateClientChecklist, CreateVehicle } from "../types/models/entity";
import { vehicleChecklistRepository } from "../repository/vehicleChecklistRepository";
import { clientRepository } from "../repository/clientRepository";
import { clientVehicleRepository } from "../repository/clientVehicleRepository";

async function existVehicle(clientId: number | unknown, data: CreateVehicle) {
  const id = Number(clientId);

  if (isNaN(id)) return;

  const exist = await clientVehicleRepository.findByPlates(data.plates);

  if (exist) return;

  const parseData = {
    ...data,
    clientId: id
  };

  console.error(`no existe. Creando... ${parseData}`)

  const vehicleCreate = await clientVehicleRepository.create(parseData);

  console.error(`creado! ${vehicleCreate}`)
  return vehicleCreate;
}

async function existClient(data: CreateClientChecklist) {
  const exist = await clientRepository.findByIdentified(data.identified);

  if (exist) return;

  console.error(`no existe. Creando... ${data}`)

  const clientCreate = await clientRepository.create(data);

  console.error(`creado! ${clientCreate}`)
  return clientCreate;
}

export const vehicleChecklistService = {
  create: async (input: CreateChecklist) => {
    const { manualClientData, manualVehicleData, manualTechnicianData } = input;
    let clientId;
    let vehicleId;

    if (manualClientData) {
      clientId = await existClient(manualClientData);
    }

    if (manualVehicleData) {
      vehicleId = await existVehicle(clientId?.id ?? manualClientData?.id, manualVehicleData);
    }

    console.log(vehicleId)

    const data = {
      checkType: input.checkType,
      fuelLevel: input.fuelLevel,
      mileage: input.mileage,
      generalNotes: input.generalNotes,
      technicianName: input.technicianName,
      vehicleId: vehicleId?.id ?? input.vehicleId,
      ...(input.appointmentId ? { appointmentId: input.appointmentId } : {}),
      ...(input.manualClientData ? { clientId: clientId?.id ?? input.manualClientData.id } : {}),
      ...(input.manualTechnicianData ? { mechanicId: input.manualTechnicianData.id } : {}),
    }

    console.log(`end data: ${data}`)

    return await vehicleChecklistRepository.create(data);
  },

  list: vehicleChecklistRepository.findAll,
  find: vehicleChecklistRepository.findById,
  update: vehicleChecklistRepository.update,
  delete: vehicleChecklistRepository.delete,
};