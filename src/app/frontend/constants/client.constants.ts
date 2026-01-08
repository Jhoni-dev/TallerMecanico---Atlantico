// src/constants/client.constants.ts

export const API_ENDPOINTS = {
    CLIENT: "clientPage",
    VEHICLE: "clientVehicle",
} as const;

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export const DEFAULT_ITEMS_PER_PAGE = 10;