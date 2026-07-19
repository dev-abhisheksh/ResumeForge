import { API } from "@/lib/axios";
import { LoginBody, RegisterBody } from "@/types/auth.types";


export const login = (data: LoginBody) => API.post("/auth/login", data);
export const registerUser = (data: RegisterBody) => API.post("/auth/register", data)
export const getCurrentUser = ()=> API.get("/auth/me")
export const logout = ()=> API.post("/auth/logout")