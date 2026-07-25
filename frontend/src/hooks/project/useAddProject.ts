import { addProject } from "@/api/project.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddProject = ()=>{
    const useQuery = useQueryClient()
    return useMutation({
        mutationFn: addProject,
        onSuccess: ()=>{
            useQuery.invalidateQueries({queryKey: ["projects"]})
        }
    })
}