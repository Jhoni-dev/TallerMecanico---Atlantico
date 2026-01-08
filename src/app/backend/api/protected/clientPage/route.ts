// src/app/api/clients/route.ts (o donde tengas tu ruta)

import { createClient, getAllClient } from "@/app/backend/services/clientServices";
import { CreateClient, GetClient } from "@/app/backend/types/models/entity";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// ===== TIPOS DE RESPUESTA =====
interface ErrorResponse {
    message: string;
    errors?: Array<{
        path: string[];
        message: string;
    }>;
}

// ===== UTILIDAD PARA FORMATEAR ERRORES DE ZOD =====
function formatZodError(error: ZodError): ErrorResponse {
    // Verificar que error.errors existe y es un array
    if (!error.errors || !Array.isArray(error.errors)) {
        console.error("Error de Zod malformado:", error);
        return {
            message: "Error de validación",
            errors: [
                {
                    path: ["unknown"],
                    message: "Error de validación desconocido",
                },
            ],
        };
    }

    return {
        message: "Errores de validación",
        errors: error.errors.map((err) => ({
            path: Array.isArray(err.path) ? err.path.map(String) : ["unknown"],
            message: err.message || "Error desconocido",
        })),
    };
}

// ===== GET - OBTENER TODOS LOS CLIENTES =====
export async function GET(): Promise<NextResponse<GetClient[] | ErrorResponse>> {
    try {
        const clients = await getAllClient();

        return NextResponse.json(clients, { status: 200 });
    } catch (error) {
        console.error("Error en GET /api/clients:", error);

        // Error de Zod
        if (error instanceof ZodError) {
            return NextResponse.json(formatZodError(error), { status: 400 });
        }

        // Error genérico
        const errorMessage =
            error instanceof Error ? error.message : "Ha ocurrido un error interno";

        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

// ===== POST - CREAR CLIENTE =====
export async function POST(
    req: NextRequest
): Promise<NextResponse<GetClient | ErrorResponse>> {
    try {
        const data: CreateClient = await req.json();

        console.log("Datos recibidos:", data);

        const newClient = await createClient(data);

        return NextResponse.json(newClient, { status: 201 });
    } catch (error) {
        console.error("Error en POST /api/clients:", error);

        // Verificar si es realmente un ZodError
        if (error instanceof ZodError) {
            console.log("Error de Zod detectado:", error);
            return NextResponse.json(formatZodError(error), { status: 400 });
        }

        // Errores de negocio
        if (error instanceof Error) {
            // Cliente duplicado
            if (
                error.message.includes("ya existe") ||
                error.message.includes("ya se encuentra registrado")
            ) {
                return NextResponse.json({ message: error.message }, { status: 409 });
            }

            // Otros errores controlados
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        // Error desconocido
        return NextResponse.json(
            { message: "Ha ocurrido un error interno" },
            { status: 500 }
        );
    }
}