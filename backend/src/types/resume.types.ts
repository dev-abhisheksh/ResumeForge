interface UploadResumeBody {
  title: string;
  text?: string;
  jobDescription: string;
}

interface GetAiRecommendationsBody{
  jobDescription: string;
  company?: string;
  role?: string;
}

export { UploadResumeBody, GetAiRecommendationsBody };
