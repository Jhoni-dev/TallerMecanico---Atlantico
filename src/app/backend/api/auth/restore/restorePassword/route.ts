import { NextResponse } from "next/server";
import { passwordRestore } from "@/app/backend/services/restorePasswordServices";

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  try {
    const passwordSuccess = await passwordRestore(newPassword, token);

    return NextResponse.json(passwordSuccess, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Ha ocurrido un error interno";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}