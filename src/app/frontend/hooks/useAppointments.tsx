// src/hooks/useAppointments.ts

import { useState, useCallback, useMemo } from "react";
import { Appointment, AppointmentStats, AppointmentStatus } from "@/app/frontend/types/appointment.types";
import { API_ENDPOINTS } from "@/app/frontend/constants/calendar.constants";
import { formatDateKey } from "@/app/frontend/utils/calendar.utils";
import { apiFetch } from "../utils/apiFetch";

export function useAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await apiFetch(API_ENDPOINTS.APPOINTMENTS);

            if (!response.ok) {
                throw new Error("Error al cargar las citas");
            }

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAppointmentStatus = useCallback(
        async (appointmentId: number, newStatus: AppointmentStatus) => {
            try {
                const response = await apiFetch(
                    `${API_ENDPOINTS.APPOINTMENTS}/${appointmentId}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            appointmentState: newStatus,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al actualizar la cita");
                }

                setAppointments((prev) =>
                    prev.map((apt) =>
                        apt.id === appointmentId
                            ? { ...apt, appointmentState: newStatus }
                            : apt
                    )
                );
            } catch (error) {
                console.error("Error updating appointment:", error);
                throw error;
            }
        },
        []
    );

    const appointmentStats = useMemo<AppointmentStats>(() => {
        return {
            asignadas: appointments.filter((apt) => apt.appointmentState === "ASIGNADA").length,
            completadas: appointments.filter((apt) => apt.appointmentState === "COMPLETADA").length,
            pendientes: appointments.filter((apt) => apt.appointmentState === "PENDIENTE").length,
            canceladas: appointments.filter((apt) => apt.appointmentState === "CANCELADA").length,
        };
    }, [appointments]);

    const getAppointmentsByDate = useCallback(
        (filteredAppointments: Appointment[]) => {
            const grouped: Record<string, Appointment[]> = {};

            filteredAppointments.forEach((apt) => {
                const date = new Date(apt.appointmentDate);
                const dateKey = formatDateKey(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );

                if (!grouped[dateKey]) grouped[dateKey] = [];
                grouped[dateKey].push(apt);
            });

            Object.keys(grouped).forEach((date) => {
                grouped[date].sort((a, b) => {
                    const timeA = new Date(a.appointmentDate).getTime();
                    const timeB = new Date(b.appointmentDate).getTime();
                    return timeA - timeB;
                });
            });

            return grouped;
        },
        []
    );

    return {
        appointments,
        loading,
        appointmentStats,
        fetchAppointments,
        updateAppointmentStatus,
        getAppointmentsByDate,
    };
}