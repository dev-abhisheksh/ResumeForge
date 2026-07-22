import { AnalyzePayload, analyzeWithAi } from "@/api/resumeAnalysis.api"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"


export const useAnalyzeWithAi = ()=>{
  const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({data, resumeId}: {data: AnalyzePayload, resumeId: string})=>
            analyzeWithAi({data, resumeId}),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["recent-analysis"]})
        }
    })
}