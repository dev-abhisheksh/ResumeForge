import groq from "../config/groq.js";
import { PROJECT_SUMMARY_PROMPT } from "../prompts/project-summary.js";
import { FormattedProjectAI } from "../types/project.types.js";

export const processProjectWithGroq = async (
  title: string,
  techStack: string[],
  rawData: string,
): Promise<FormattedProjectAI> => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: PROJECT_SUMMARY_PROMPT,
        },
        {
          role: "user",
          content: `
    Project Title: ${title}
    Tech Stack: ${techStack.join(", ")}
    Raw Project Description:
    ${rawData}
    `,
        },
      ],
    });

    const content = completion.choices[0]?.message.content;
    if (!content) {
      throw new Error("Groq returned an empty response.");
    }

    const parsed = JSON.parse(content);
    return {
      summary: parsed.summary || "",
      bulletPoints: Array.isArray(parsed.bulletPoints)
        ? parsed.bulletPoints
        : [],
    };
  } catch (error) {
    console.error("Error processing project with Groq:", error);
    // Safe fallback if Groq call fails
    return {
      summary: rawData.substring(0, 150),
      bulletPoints: [rawData.substring(0, 200)],
    };
  }
};
