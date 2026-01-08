// src/app/api/clients/[id]/route.ts

import {
  changeState,
  deleteClient,
  getClientById,
  updateClient,
} from "@/app/backend/services/clientServices";
import { GetClient, UpdateClient } from "@/app/backend/types/models/entity";
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
  return {
    message: "Errores de validación",
    errors: error.errors.map((err) => ({
      path: err.path.map(String),
      message: err.message,
    })),
  };
}

// ===== UTILIDAD PARA DETERMINAR CÓDIGO DE ESTADO =====
function getErrorStatusCode(error: Error): number {
  const message = error.message.toLowerCase();

  if (message.includes("no encontrado") || message.includes("not found")) {
    return 404;
  }

  if (
    message.includes("ya existe") ||
    message.includes("duplicado") ||
    message.includes("no se puede eliminar") ||
    message.includes("tiene datos relacionados")
  ) {
    return 409; // Conflict
  }

  if (message.includes("inválido") || message.includes("invalid")) {
    return 400;
  }

  return 500;
}

// ===== GET - OBTENER CLIENTE POR ID =====
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetClient | ErrorResponse>> {
  const { id } = await context.params;

  try {
    const client = await getClientById(id);

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error(`Error en GET /api/clients/${id}:`, error);

    if (error instanceof Error) {
      const statusCode = getErrorStatusCode(error);
      return NextResponse.json(
        { message: error.message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { message: "Ha ocurrido un error interno" },
      { status: 500 }
    );
  }
}

// ===== DELETE - ELIMINAR CLIENTE =====
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  const { id } = await context.params;

  try {
    const deleteSuccess = await deleteClient(id);

    return NextResponse.json(
      { success: deleteSuccess },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error en DELETE /api/clients/${id}:`, error);

    if (error instanceof Error) {
      const statusCode = getErrorStatusCode(error);
      return NextResponse.json(
        { message: error.message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { message: "Ha ocurrido un error interno" },
      { status: 500 }
    );
  }
}

// ===== PUT - ACTUALIZAR CLIENTE =====
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetClient | ErrorResponse>> {
  const { id } = await context.params;

  try {
    const newData: UpdateClient = await req.json();

    const clientUpdated = await updateClient(id, newData);

    return NextResponse.json(clientUpdated, { status: 200 });
  } catch (error) {
    console.error(`Error en PUT /api/clients/${id}:`, error);

    // Error de validación de Zod
    if (error instanceof ZodError) {
      return NextResponse.json(formatZodError(error), { status: 400 });
    }

    // Otros errores
    if (error instanceof Error) {
      const statusCode = getErrorStatusCode(error);
      return NextResponse.json(
        { message: error.message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { message: "Ha ocurrido un error interno" },
      { status: 500 }
    );
  }
}

// ===== PATCH - CAMBIAR ESTADO DEL CLIENTE =====
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetClient | ErrorResponse>> {
  const { id } = await context.params;

  try {
    const data: Record<string, boolean> = await req.json();

    const clientUpdate = await changeState(id, data);

    return NextResponse.json(clientUpdate, { status: 200 });
  } catch (error) {
    console.error(`Error en PATCH /api/clients/${id}:`, error);

    // Error de validación de Zod
    if (error instanceof ZodError) {
      return NextResponse.json(formatZodError(error), { status: 400 });
    }

    // Otros errores
    if (error instanceof Error) {
      const statusCode = getErrorStatusCode(error);
      return NextResponse.json(
        { message: error.message },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { message: "Ha ocurrido un error interno" },
      { status: 500 }
    );
  }
}