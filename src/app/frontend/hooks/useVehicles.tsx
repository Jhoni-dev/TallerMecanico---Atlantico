// src/hooks/useVehicles.ts

import { useState, useCallback, useMemo } from "react";
import { ClientVehicle, Client } from "@/app/frontend/types/client.types";
import { API_ENDPOINTS } from "@/app/frontend/constants/client.constants";
import { apiFetch } from "../utils/apiFetch";

export function useVehicles(clients: Client[]) {
    const [vehicles, setVehicles] = useState<ClientVehicle[]>([]);

    const fetchVehicles = useCallback(async () => {
        try {
            const response = await apiFetch(API_ENDPOINTS.VEHICLE);
            if (!response.ok) throw new Error("Error fetching vehicles");
            const data: ClientVehicle[] = await response.json();
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setVehicles([]);
        }
    }, []);

    const getClientVehiclesWithIds = useMemo(() => {
        return (clientId: number): ClientVehicle[] => {
            const client = clients.find((c) => c.id === clientId);
            if (!client) return [];

            return client.clientVehicle.map((clientVehicle, index) => {
                const vehicleWithId = vehicles.find(
                    (v) =>
                        v.brand === clientVehicle.brand &&
                        v.model === clientVehicle.model &&
                        v.year === clientVehicle.year &&
                        v.engineDisplacement === clientVehicle.engineDisplacement
                );

                return vehicleWithId
                    ? vehicleWithId
                    : {
                        ...clientVehicle,
                        id: -(clientId * 1000 + index + 1),
                    };
            });
        };
    }, [clients, vehicles]);

    return {
        vehicles,
        fetchVehicles,
        getClientVehiclesWithIds,
    };
}