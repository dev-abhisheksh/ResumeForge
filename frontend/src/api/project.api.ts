import { API } from "@/lib/axios";
import { ProjectsItem } from "@/types/project.types";

export const addProject = (data: FormData)=> API.post("/project/add", {data})

export const fetchProjects = async(): Promise<ProjectsItem[]>=>{
    const res = await API.get("/project/")
    return res.data?.projects
}
