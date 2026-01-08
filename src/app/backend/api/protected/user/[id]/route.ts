import { deleteById, getSessionById, updateById } from "@/app/backend/services/authServices";
import { GetSession, UpdateUser } from "@/app/backend/types/models/entity";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const userEliminated = deleteById(id);

    return NextResponse.json(userEliminated, { status: 200 });
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

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }): Promise<
  NextResponse<GetSession | null | { error: string }>
> {
  try {
    const { id } = await context.params;

    const user = await getSessionById(id);

    return NextResponse.json(user ?? null, { status: 200 });
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


export async function PUT(request: NextRequest) {
  try {
    const newSession: UpdateUser = await request.json();
    console.log(newSession)
    const email = await newSession.id;
    const data = await updateById(email, newSession);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error)
    const errorMessage = error instanceof Error
      ? error.message
      : "Ha ocurrido un error interno";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}

