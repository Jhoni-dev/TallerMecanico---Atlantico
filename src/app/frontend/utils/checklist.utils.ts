// src/utils/checklist.utils.ts

import { ChecklistItem } from "@/app/frontend/types/checklist.types";

export function cn(...classes: (string | undefined | null | boolean)[]) {
    return classes.filter(Boolean).join(" ");
}

export const getFuelColor = (level: number): string => {
    if (level <= 25) return "bg-red-500 dark:bg-red-600";
    if (level <= 50) return "bg-amber-500 dark:bg-amber-600";
    return "bg-green-500 dark:bg-green-600";
};

export const getFuelTextColor = (level: number): string => {
    if (level <= 25) return "text-red-600 dark:text-red-400";
    if (level <= 50) return "text-amber-600 dark:text-amber-400";
    return "text-green-600 dark:text-green-400";
};

export const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(amount);
};

export const evaluateVehicleCondition = (items: ChecklistItem[]) => {
    if (!items || items.length === 0) {
        return {
            status: "Sin evaluar",
            color: "gray",
            percentage: 0,
            details: {
                excelente: 0,
                bueno: 0,
                regular: 0,
                malo: 0,
                requiereAtencion: 0,
                sinCondicion: 0,
            },
            recommendation: "No hay items para evaluar",
        };
    }

    const details = {
        excelente: items.filter((i) => i.condition === "Excelente").length,
        bueno: items.filter((i) => i.condition === "Bueno").length,
        regular: items.filter((i) => i.condition === "Regular").length,
        malo: items.filter((i) => i.condition === "Malo").length,
        requiereAtencion: items.filter((i) => i.condition === "Requiere Atención")
            .length,
        sinCondicion: items.filter((i) => !i.condition || i.condition === "")
            .length,
    };

    const totalEvaluated = items.length - details.sinCondicion;

    const score =
        (details.excelente * 100 +
            details.bueno * 75 +
            details.regular * 50 +
            details.malo * 25 +
            details.requiereAtencion * 0) /
        totalEvaluated || 0;

    let status = "";
    let color = "";
    let recommendation = "";

    if (score >= 90) {
        status = "Excelente";
        color = "green";
        recommendation =
            "El vehículo está en excelentes condiciones. Continúe con el mantenimiento preventivo.";
    } else if (score >= 75) {
        status = "Muy Bueno";
        color = "lime";
        recommendation =
            "El vehículo está en muy buenas condiciones. Monitoree los puntos señalados.";
    } else if (score >= 60) {
        status = "Bueno";
        color = "blue";
        recommendation =
            "El vehículo está en buenas condiciones. Considere atender algunos puntos menores.";
    } else if (score >= 40) {
        status = "Regular";
        color = "amber";
        recommendation =
            "El vehículo requiere atención. Priorice las reparaciones necesarias.";
    } else if (score >= 20) {
        status = "Malo";
        color = "orange";
        recommendation =
            "El vehículo necesita reparaciones importantes. Atienda los problemas urgentemente.";
    } else {
        status = "Crítico";
        color = "red";
        recommendation =
            "El vehículo está en estado crítico. Se requiere intervención inmediata.";
    }

    if (details.requiereAtencion > 0) {
        recommendation += ` Hay ${details.requiereAtencion} ${details.requiereAtencion === 1 ? "item que requiere" : "items que requieren"} atención urgente.`;
    }

    return {
        status,
        color,
        percentage: Math.round(score),
        details,
        recommendation,
    };
};