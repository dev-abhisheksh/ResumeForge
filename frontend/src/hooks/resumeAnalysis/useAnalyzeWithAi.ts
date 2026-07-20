import { analyzeWithAi } from "@/api/resumeAnalysis.api"
import { QueryClient, useMutation } from "@tanstack/react-query"

export const useAnalyzeWithAi = ()=>{
    const queryClient = new QueryClient()
    return useMutation({
        mutationFn: analyzeWithAi,
        // onSuccess: ()=>{
        //     queryClient.invalidateQueries.
        // }
    })
}