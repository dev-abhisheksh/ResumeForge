import { API } from "@/lib/axios";
import { LoginBody, RegisterBody } from "@/types/auth.types";


export const login = (data: LoginBody) => API.post("/auth/login", data);
export const register = (data: RegisterBody) => API.post("/auth/register", data)