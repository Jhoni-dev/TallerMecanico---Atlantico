import { authRepository } from "../repository/authRepository";
import { hashed, verifyHash } from "../../../lib/argon";
import { generateToken } from "@/lib/jwt";
import { cleanData } from "../utils/cleanData";
import { CreateSession, GetSession, UpdateUser } from "../types/models/entity";
import { toLowerCaseDeepRecord } from "../utils/filtersRepository"
import { sendWelcomeEmail } from "@/lib/email";
import { isOnlyNumbers, isValidEmail } from "../utils/entryData";

export async function getAllSessions(): Promise<GetSession[] | null> {
    const users = await authRepository.findMany();

    if (!users) throw new Error("No hay usuarios disponibles");

    return users;
}

export async function getSessionById(id: string): Promise<GetSession | null> {
    const parseId = parseInt(id, 10);

    const user = await authRepository.findUser(parseId);

    if (!user) throw new Error("No se ha encontrado el usuario solicitado");

    return user;
}

export async function getSessionByEmail(email: string, password: string): Promise<Record<string, unknown>> {
    const user = await authRepository.findByEmail(email);

    if (!user) {
        throw new Error("No se encontro el usuario asociado");
    }

    if (!user.credentials) {
        throw new Error("El usuario no tiene credenciales asociadas");
    }

    const parsePass = await verifyHash(user.credentials.password, password);

    if (!parsePass) {
        throw new Error("Contraseña incorrecta");
    }

    const { credentials, ...userWithoutPassword } = user;

    const parseInformation = (data: Record<string, unknown>) => {
        return {
            id: data.id
        }
    }

    const dataForToken = parseInformation(userWithoutPassword);

    const token = await generateToken(dataForToken);

    return { token };
}

export async function sessionExist(emailSession: string): Promise<boolean> {
    const success = await authRepository.existSessionByEmail(emailSession);

    if (!success) {
        throw new Error("No se encontro el usuario consultado");
    }

    return success;
}

export async function createSession(newSession: CreateSession) {
    const sessionCreate = await newSession;

    if (!sessionCreate) throw new Error("No se encontraron campos");

    if (!sessionCreate.email || !sessionCreate.email.trim()) {
        throw new Error("El correo es requerido");
    }

    if (!isValidEmail(sessionCreate.email)) {
        throw new Error("El correo digitado no es válido");
    }

    const sessionExist = await authRepository.findByEmail(sessionCreate.email);

    if (sessionExist) {
        throw new Error("El correo digitado ya se encuentra asociado a una cuenta");
    }

    if (!isOnlyNumbers(sessionCreate.identificacion)) {
        throw new Error("La identificación no es válida");
    }

    if (!sessionCreate.password || typeof sessionCreate.password !== "string") {
        throw new Error("La contraseña es requerida");
    }
    if (sessionCreate.password.length < 8) {
        throw new Error("La contraseña debe tener mínimo 8 caracteres");
    }

    if (!/\d/.test(sessionCreate.password)) {
        throw new Error("La contraseña debe contener al menos un número");
    }

    const passHashed = await hashed(sessionCreate.password);
    sessionCreate.password = passHashed;

    const accountCreate = await authRepository.createSession(sessionCreate);

    if (!accountCreate) {
        throw new Error("No se ha podido crear correctamente el usuario");
    }

    await sendWelcomeEmail(accountCreate.email, accountCreate.rol, accountCreate.name);

    return accountCreate;
}

export async function updateById(id: number, input: UpdateUser): Promise<boolean> {
    const data = cleanData.arrays(input);

    if (Object.keys(data).length === 0) {
        throw new Error("No se proporcionaron campos para actualizar");
    }

    if (data.identificacion && !isOnlyNumbers(data.identificacion)) throw new Error("La identificacion no es valida");

    if (data.email && !isValidEmail(data.email)) throw new Error("El correo digitado no es valido");

    if (data.email) {
        const sessionExist = await authRepository.findByEmail(data.email);

        if (sessionExist) throw new Error("El correo digitado ya se encuentra asociado a una cuenta");
    }

    if (data.password && typeof data.password === "string") {
        data.password = await hashed(data.password);
    }

    return await authRepository.update(id, data);
}

export async function deleteById(id: string): Promise<boolean> {
    if (!id) {
        throw new Error("No se ha suministrado un parametro valido");
    }

    if (isNaN(Number(id))) {
        throw new Error("Identificador no valido para la eliminacion de campos");
    }

    const parseId = parseInt(id, 10);

    const sessionExists = await authRepository.existSessionById(parseId);

    if (!sessionExists) {
        throw new Error("El perfil seleccionado no se encuentra disponible");
    }

    const eliminated = authRepository.delete(parseId);

    if (!eliminated) {
        throw new Error("No se ha podido eliminar el usuario seleccionado");
    }

    return eliminated;
}