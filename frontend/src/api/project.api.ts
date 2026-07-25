import { API } from "@/lib/axios";
import { ProjectsItem } from "@/types/project.types";

export interface AddProjectPayload {
  title: string;
  techStack: string[];
  rawData: string;
}

export const fetchProjects = async (): Promise<ProjectsItem[]> => {
  const res = await API.get("/project/");
  return res.data?.projects || [];
};

export const addProject = (data: AddProjectPayload) =>
  API.post("/project/", data);

export const deleteProject = (projectId: string) =>
  API.delete(`/project/${projectId}`);
