// src/app/api/clients/[id]/route.ts

import {
  changeState,
  deleteClient,
  getClientById,
  updateClient,
} from "@/app/backend/services/clientServices";
import { GetClient, UpdateClient } from "@/app/backend/types/models/entity";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodIssue } from "zod";

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
    errors: error.issues.map((err: ZodIssue) => ({
      path: err.path.map(String),
      message: err.message,
    })),
  };
}

// ===== UTILIDAD PARA DETERMINAR CÓDIGO DE ESTADO =====
function getErrorStatusCode(error: Error): number {
  const message = error.message.toLowerCase();

  if (message.includes("no encontrado") || message.includes("not found") || message.includes("no se ha encontrado") || message.includes("no se encuentra disponible")) {
    return 404;
  }

  if (
    message.includes("ya existe") ||
    message.includes("duplicado") ||
    message.includes("ya se encuentra registrado") ||
    message.includes("no se puede eliminar") ||
    message.includes("tiene datos relacionados")
  ) {
    return 409; // Conflict
  }

  if (
    message.includes("inválido") ||
    message.includes("invalid") ||
    message.includes("no es válido") ||
    message.includes("caracteres no válidos") ||
    message.includes("es requerido") ||
    message.includes("asegúrate de digitar") ||
    message.includes("no se encontraron campos")
  ) {
    return 400;
  }

  return 500;
}

// ===== MANEJADOR CENTRALIZADO DE ERRORES =====
function handleError(error: unknown, context: string): NextResponse<ErrorResponse> {
  console.error(`Error en ${context}:`, error);

  // Error de validación de Zod
  if (error instanceof ZodError) {
    return NextResponse.json(formatZodError(error), { status: 400 });
  }

  // Error estándar de JavaScript
  if (error instanceof Error) {
    const statusCode = getErrorStatusCode(error);
    return NextResponse.json(
      { message: error.message },
      { status: statusCode }
    );
  }

  // Error desconocido (strings, objetos, etc.)
  if (typeof error === 'string') {
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }

  // Cualquier otro tipo de error
  return NextResponse.json(
    { message: "Ha ocurrido un error interno" },
    { status: 500 }
  );
}

// ===== GET - OBTENER CLIENTE POR ID =====
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetClient | ErrorResponse | null>> {
  const { id } = await context.params;

  try {
    const client = await getClientById(id);
    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    return handleError(error, `GET /api/clients/${id}`);
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
    return handleError(error, `DELETE /api/clients/${id}`);
  }
}

// ===== PUT - ACTUALIZAR CLIENTE =====
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetClient | ErrorResponse | {}>> {
  const { id } = await context.params;

  try {
    const newData: UpdateClient = await req.json();
    const clientUpdated = await updateClient(id, newData);
    return NextResponse.json(clientUpdated, { status: 200 });
  } catch (error) {
    return handleError(error, `PUT /api/clients/${id}`);
  }
}

// ===== PATCH - CAMBIAR ESTADO DEL CLIENTE =====
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<GetClient | ErrorResponse | {}>> {
  const { id } = await context.params;

  try {
    const data: Record<string, boolean> = await req.json();
    const clientUpdate = await changeState(id, data);
    return NextResponse.json(clientUpdate, { status: 200 });
  } catch (error) {
    return handleError(error, `PATCH /api/clients/${id}`);
  }
}