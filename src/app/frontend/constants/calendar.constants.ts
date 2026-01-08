// src/constants/calendar.constants.ts

export const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
] as const;

export const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] as const;

export const DAY_NAMES_SHORT = ["D", "L", "M", "X", "J", "V", "S"] as const;

export const API_ENDPOINTS = {
    APPOINTMENTS: "/appointment",
} as const;