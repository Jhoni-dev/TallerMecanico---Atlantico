import { NextResponse, NextRequest } from "next/server";
import { getSessionByEmail } from "@/app/backend/services/authServices";

export async function POST(request: NextRequest) {
    try {
        const getSession = await request.json();
        const email = await getSession.email as string;
        const pass = await getSession.password as string;
        const token = await getSessionByEmail(email, pass);

        return NextResponse.json(
            token,
            { status: 200 }
        );
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