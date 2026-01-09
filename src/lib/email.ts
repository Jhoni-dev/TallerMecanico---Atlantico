import { Resend } from 'resend';
import { PasswordResetEmail } from "../components/email/PasswordResetEmail";
import { PasswordChangedEmail } from "../components/email/PasswordChangedEmail";
import { WelcomeEmail } from "../components/email/WelcomeEmail";
import React from "react";
import { InvoiceEmail } from "@/components/email/ClientInvoice";
import { GetInvoiceClient } from "@/app/backend/types/models/entity";
import { Decimal } from "@prisma/client/runtime/library";

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Convierte recursivamente todos los objetos Decimal (Prisma/decimal.js) a números
 * y las fechas a strings ISO
 */
export function convertDecimals(obj: any): any {
  // Detectar TODOS los decimals (Prisma o decimal.js)
  if (
    obj instanceof Decimal ||
    (typeof obj === "object" && obj?.constructor?.name === "Decimal") ||
    (Decimal.isDecimal && Decimal.isDecimal(obj))
  ) {
    return Number(obj.toString());
  }

  // Fechas → string ISO
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => convertDecimals(item));
  }

  // Objetos
  if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = convertDecimals(obj[key]);
    }
    return newObj;
  }

  // Primitivos
  return obj;
}

/**
 * Envía un email de recuperación de contraseña
 * @param email - Email del destinatario
 * @param token - Token de recuperación
 * @param userName - Nombre del usuario (opcional)
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  userName?: string
) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/confirmar?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Talleres del Atlántico <onboarding@resend.dev>',
      to: email,
      subject: '🔐 Recuperación de Contraseña - Talleres del Atlántico',
      react: React.createElement(PasswordResetEmail, { resetLink, userName }),
    });

    if (error) {
      console.error("Error al enviar email de recuperación:", error);
      throw new Error("Error al enviar el email de recuperación");
    }

    console.log(`Email de recuperación enviado a: ${email}`, data);
    return data;
  } catch (error) {
    console.error("Error al enviar email de recuperación:", error);
    throw new Error("Error al enviar el email de recuperación");
  }
}

/**
 * Envía un email de confirmación de cambio de contraseña
 * @param email - Email del destinatario
 * @param userName - Nombre del usuario
 */
export async function sendPasswordChangedEmail(
  email: string,
  userName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Talleres del Atlántico <onboarding@resend.dev>',
      to: email,
      subject: '✅ Contraseña Actualizada - Talleres del Atlántico',
      react: React.createElement(PasswordChangedEmail, {
        userName,
        changeDate: new Date()
      }),
    });

    if (error) {
      console.error("Error al enviar email de confirmación:", error);
      throw new Error("Error al enviar el email de confirmación");
    }

    console.log(`Email de confirmación enviado a: ${email}`, data);
    return data;
  } catch (error) {
    console.error("Error al enviar email de confirmación:", error);
    throw new Error("Error al enviar el email de confirmación");
  }
}

/**
 * Envía un email de bienvenida
 * @param email - Email del destinatario
 * @param rol - Rol del usuario
 * @param userName - Nombre del usuario
 */
export async function sendWelcomeEmail(
  email: string,
  rol: string,
  userName: string
) {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/login`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Talleres del Atlántico <onboarding@resend.dev>',
      to: email,
      subject: 'Bienvenido a Talleres del Atlántico',
      react: React.createElement(WelcomeEmail, { userName, rol, loginUrl }),
    });

    if (error) {
      console.error("Error al enviar email de bienvenida:", error);
      throw new Error("Error al enviar el email de bienvenida");
    }

    console.log(`Email de bienvenida enviado a: ${email}`, data);
    return data;
  } catch (error) {
    console.error("Error al enviar email de bienvenida:", error);
    throw new Error("Error al enviar el email de bienvenida");
  }
}

/**
 * Envía un email con la factura del cliente
 * @param invoiceData - Datos completos de la factura
 */
export async function sendInvoiceEmail(invoiceData: GetInvoiceClient) {
  // Validar que el cliente tenga al menos un email
  if (
    !invoiceData.author.clientContact ||
    invoiceData.author.clientContact.length === 0
  ) {
    throw new Error("El cliente no tiene un email registrado");
  }

  const clientEmail = invoiceData.author.clientContact[0].email;

  // Convertir todos los Decimals a números
  const converter = convertDecimals(invoiceData);

  // Extraer todas las piezas de todos los invoiceDetails
  const allPieces: any[] = [];
  const allServices: any[] = [];

  converter.invoiceDetail.forEach((detail: any) => {
    if (detail.pieces) {
      allPieces.push(detail.pieces);
    }
    if (detail.purchasedService) {
      allServices.push(detail.purchasedService);
    }
  });

  // Calcular subtotales
  const piecesSubtotal = allPieces.reduce(
    (sum, piece) => sum + (piece.price || 0),
    0
  );
  const servicesSubtotal = allServices.reduce(
    (sum, service) => sum + (service.price || 0),
    0
  );
  const subtotalGeneral = piecesSubtotal + servicesSubtotal;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Talleres del Atlántico <onboarding@resend.dev>',
      to: clientEmail,
      subject: `Tu Factura #${converter.id} - Talleres del Atlántico`,
      react: React.createElement(InvoiceEmail, {
        id: converter.id,
        clientName: converter.author.fullName,
        clientSurname: converter.author.fullSurname,
        clientIdentified: converter.author.identified,
        clientEmail: clientEmail,
        invoiceDate: new Date(converter.createAt),
        invoiceTotal: converter.total,
        invoiceSubtotal: subtotalGeneral,
        pieces: allPieces,
        purchasedService: allServices,
      }),
    });

    if (error) {
      console.error("Error al enviar factura por email:", error);
      throw new Error("Error al enviar la factura por email");
    }

    console.log(`Factura enviada por email a: ${clientEmail}`, data);
    return { success: true, email: clientEmail, data };
  } catch (error) {
    console.error("Error al enviar factura por email:", error);
    throw new Error("Error al enviar la factura por email");
  }
}