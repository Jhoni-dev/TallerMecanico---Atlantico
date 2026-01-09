import { createClient, getAllClient } from "@/app/backend/services/clientServices";
import { CreateClient, GetClient } from "@/app/backend/types/models/entity";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(): Promise<NextResponse<GetClient[] | [] | { error: string }>> {
    try {
        const clients = await getAllClient();

        return NextResponse.json(
            clients,
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Ha ocurido un error interno";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const data: CreateClient = await req.json();

        const successCreate = await createClient(data);

        console.log(successCreate)
        return NextResponse.json(
            successCreate,
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                message: "Datos invalidos",
                errors: error.format()
            });
        }

        const errorMessage = error instanceof Error
            ? error.message
            : "Ha ocurido un error interno";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 },
        );
    }
}