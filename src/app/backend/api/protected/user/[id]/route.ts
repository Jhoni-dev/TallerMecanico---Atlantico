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


export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const newSession: UpdateUser = await request.json();
    const { id } = await context.params;
    const objectId = await newSession.id;

    const selectId = objectId || parseInt(id, 10);

    const data = await updateById(selectId, newSession);

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

