import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();

  try {
    const payload = await verifyToken(token);

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.sub);

    return response;

  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: "Token inválido o expirado" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/backend/api/protected/:path*"]
};
