import { createSession } from "@/app/backend/services/authServices";
import { CreateSession } from "@/app/backend/types/models/entity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body: CreateSession = await req.json();

        const data = await createSession(body);

        return NextResponse.json(
            data,
            { status: 201 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Ha ocurrido un error interno";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}