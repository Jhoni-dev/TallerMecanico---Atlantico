import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

export interface AppJWTPayload extends JWTPayload {
  sub: string;
  id?: number;
  name?: string;
  identificacion?: string;
  email?: string;
  role?: string;
}

export async function generateToken(payload: AppJWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AppJWTPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AppJWTPayload;
  } catch (error) {
    console.log(error)
    throw new Error("Token inválido o expirado");
  }
}

export function decodeJWT<T = any>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  const payload = decodeJWT(token);
  return payload?.exp * 1000 < Date.now();
}