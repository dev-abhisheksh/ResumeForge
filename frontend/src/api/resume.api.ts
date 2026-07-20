import { API } from "@/lib/axios";

export const resumes = () => API.get("/resume/");

export const singleResume = (resumeId: string) =>
  API.get(`/resume/${resumeId}`);

export const deleteResume = (resumeId: string) =>
  API.delete(`/resume/${resumeId}`);

export const uploadMaterial = (data: FormData) =>
  API.post("/resume/upload", data);
