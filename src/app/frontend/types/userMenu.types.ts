// components/nav-user/types.ts

export interface UserData {
  id: number;
  name: string;
  identificacion: string;
  email: string;
  phoneNumber: string;
  role: "MECANICO" | "ADMINISTRADOR";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}