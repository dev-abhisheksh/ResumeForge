export const RESUME_PARSE_PROMPT = `
You are an expert ATS resume parser.

Convert the resume into structured JSON.

Rules:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT wrap the response inside \`\`\`.
- Preserve all information.
- If a field is missing, return null or an empty array.

Return this schema:

{
  "personalInfo": {
    "name": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": [],
  "languages": []
}
`;
