import { NextResponse, NextRequest } from "next/server";
import {
  getAllSessions,
  sessionExist,
} from "@/app/backend/services/authServices";
import { GetSession } from "@/app/backend/types/models/entity";

export async function POST(request: NextRequest) {
  try {
    const getSession = await request.json();
    const email = (await getSession.email) as string;
    const user = await sessionExist(email);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Ha ocurrido un error interno";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<
  NextResponse<GetSession[] | { error: string }>
> {
  try {
    const users = await getAllSessions();

    return NextResponse.json(users ?? [], { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : "Ha ocurrido un error interno";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}