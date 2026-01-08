import { NextResponse, NextRequest } from "next/server";
import { generatePasswordResetToken } from "@/app/backend/services/restorePasswordServices";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        const data = await generatePasswordResetToken(email);

        return NextResponse.json(
            data,
            { status: 200 }
        )
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Ha ocurrido un error interno";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}