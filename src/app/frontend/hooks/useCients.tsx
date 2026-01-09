// src/hooks/useClients.ts

import { useState, useCallback } from "react";
import { Client } from "@/app/frontend/types/client.types";
import { API_ENDPOINTS } from "@/app/frontend/constants/client.constants";
import { apiFetch } from "../utils/apiFetch";

export function useClients() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const response = await apiFetch(API_ENDPOINTS.CLIENT);
            if (!response.ok) throw new Error("Error fetching clients");
            const data: Client[] = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            setClients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        clients,
        loading,
        fetchClients,
    };
}