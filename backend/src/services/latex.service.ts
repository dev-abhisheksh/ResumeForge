import { ATS_LATEX_TEMPLATE } from "../templates/ats-resume.tex.js";

/**
 * Escapes special LaTeX characters to prevent compiler crashes.
 */
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

export interface UserDetails {
  fullName: string;
  phone?: string;
  email: string;
  linkedinUrl?: string;
  linkedinText?: string;
  githubUrl?: string;
  githubText?: string;
}

export interface ContactInfoPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  linkedinText?: string;
  linkedinUrl?: string;
  githubText?: string;
  githubUrl?: string;
}

export interface EducationItemPayload {
  institution: string;
  degree: string;
  dates?: string;
  details?: string;
}

export interface TailoredProjectItem {
  title: string;
  summary?: string;
  techStack?: string[] | string;
  date?: string;
  bulletPoints: string[];
}

export interface TailoredExperienceItem {
  role: string;
  company: string;
  dates: string;
  location?: string;
  bulletPoints: string[];
}

export interface CertificationAchievementPayload {
  title: string;
  details?: string;
}

export interface TailoredResumePayload {
  contactInfo?: ContactInfoPayload;
  professionalSummary: string;
  education?: EducationItemPayload[];
  skills: {
    languages?: string[];
    backend?: string[];
    databases?: string[];
    tools?: string[];
  };
  selectedProjects: TailoredProjectItem[];
  experience?: TailoredExperienceItem[];
  certificationsAndAchievements?: CertificationAchievementPayload[];
}

/**
 * Injects candidate data into the Master ATS LaTeX Template.
 * 100% Dynamic for ANY uploaded Master Resume (Sarthak, Abhishek, or any candidate)!
 */
export function buildLatexResume(
  payload: TailoredResumePayload,
  user: UserDetails,
): string {
  let latex = ATS_LATEX_TEMPLATE;

  // 1. Contact Information (Extracted from Uploaded Master Resume -> User Account -> Generic Fallback)
  const fullName = payload.contactInfo?.fullName || user.fullName || "Candidate";
  const phone = payload.contactInfo?.phone || user.phone || "";
  const email = payload.contactInfo?.email || user.email || "";
  const linkedinText = payload.contactInfo?.linkedinText || user.linkedinText || (payload.contactInfo?.linkedinUrl ? "linkedin.com/in/profile" : "");
  const linkedinUrl = payload.contactInfo?.linkedinUrl || user.linkedinUrl || "https://linkedin.com";
  const githubText = payload.contactInfo?.githubText || user.githubText || (payload.contactInfo?.githubUrl ? "github.com/profile" : "");
  const githubUrl = payload.contactInfo?.githubUrl || user.githubUrl || "https://github.com";

  latex = latex.replace(/\{\{FULL_NAME\}\}/g, escapeLatex(fullName));
  latex = latex.replace(/\{\{PHONE\}\}/g, escapeLatex(phone));
  latex = latex.replace(/\{\{EMAIL\}\}/g, escapeLatex(email));
  latex = latex.replace(/\{\{LINKEDIN_URL\}\}/g, linkedinUrl);
  latex = latex.replace(/\{\{LINKEDIN_TEXT\}\}/g, escapeLatex(linkedinText));
  latex = latex.replace(/\{\{GITHUB_URL\}\}/g, githubUrl);
  latex = latex.replace(/\{\{GITHUB_TEXT\}\}/g, escapeLatex(githubText));

  // 2. Professional Summary (Extracted from Uploaded Master Resume & JD-Aligned)
  latex = latex.replace(
    /\{\{PROFESSIONAL_SUMMARY\}\}/g,
    escapeLatex(payload.professionalSummary || ""),
  );

  // 3. Technical Skills (Extracted from Uploaded Master Resume)
  const languagesStr = payload.skills?.languages?.map(escapeLatex).join(", ") || "";
  const backendStr = payload.skills?.backend?.map(escapeLatex).join(", ") || "";
  const dbStr = payload.skills?.databases?.map(escapeLatex).join(", ") || "";
  const toolsStr = payload.skills?.tools?.map(escapeLatex).join(", ") || "";

  const skillsBlock = [
    languagesStr ? `\\textbf{Languages \\& Frontend}{: ${languagesStr}}` : "",
    backendStr ? `\\textbf{Backend \\& Real-Time}{: ${backendStr}}` : "",
    dbStr ? `\\textbf{Databases \\& Caching}{: ${dbStr}}` : "",
    toolsStr ? `\\textbf{Tools \\& Concepts}{: ${toolsStr}}` : "",
  ]
    .filter(Boolean)
    .join(" \\\\\n");

  latex = latex.replace(/\{\{SKILLS_SECTION\}\}/g, skillsBlock || "\\textbf{Skills}{: General Software Engineering}");

  // 4. Projects Section (Swapped Vault Projects with Metric Bullets & Overview)
  const projectsBlocks = (payload.selectedProjects || [])
    .slice(0, 3)
    .map((proj) => {
      const techStr = Array.isArray(proj.techStack)
        ? proj.techStack.map(escapeLatex).join(", ")
        : escapeLatex(proj.techStack || "");

      const summaryLine = proj.summary
        ? `      \\item\\small{\\textit{${escapeLatex(proj.summary)}}}`
        : "";

      const bullets = (proj.bulletPoints || [])
        .slice(0, 3)
        .map((b) => `      \\resumeItem{${escapeLatex(b)}}`)
        .join("\n");

      return [
        "    \\resumeProjectHeading",
        `      {\\textbf{${escapeLatex(proj.title)}}${techStr ? ` $|$ \\emph{${techStr}}` : ""}}{${escapeLatex(proj.date || "2026")}}`,
        summaryLine,
        "      \\resumeItemListStart",
        bullets,
        "      \\resumeItemListEnd",
        "      \\vspace{-13pt}",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  latex = latex.replace(/\{\{PROJECTS_SECTION\}\}/g, projectsBlocks);

  // 5. Experience Section (Extracted from Uploaded Master Resume)
  const experienceBlocks = (payload.experience || [])
    .slice(0, 3)
    .map((exp) => {
      const bullets = (exp.bulletPoints || [])
        .map((b) => `      \\resumeItem{${escapeLatex(b)}}`)
        .join("\n");

      return [
        "    \\resumeSubheading",
        `      {${escapeLatex(exp.role || "Developer")}}{${escapeLatex(exp.dates || "")}}`,
        `      {${escapeLatex(exp.company || "")}}{${escapeLatex(exp.location || "Remote")}}`,
        bullets ? "      \\resumeItemListStart" : "",
        bullets,
        bullets ? "      \\resumeItemListEnd" : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  latex = latex.replace(/\{\{EXPERIENCE_SECTION\}\}/g, experienceBlocks);

  // 6. Education Section (Extracted from Uploaded Master Resume)
  const educationBlocks = (payload.education || [])
    .map((edu) => [
      "    \\resumeSubheading",
      `      {${escapeLatex(edu.degree || "Education")}}{${escapeLatex(edu.dates || "")}}`,
      `      {${escapeLatex(edu.institution || "")}}{${escapeLatex(edu.details || "")}}`,
    ].join("\n"))
    .join("\n\n");

  latex = latex.replace(/\{\{EDUCATION_SECTION\}\}/g, educationBlocks);

  // 7. Certifications & Achievements (Extracted from Uploaded Master Resume)
  const certsBlock = (payload.certificationsAndAchievements || [])
    .map((c) =>
      `\\textbf{${escapeLatex(c.title)}}{${c.details ? `: ${escapeLatex(c.details)}` : ""}}`,
    )
    .join(" \\\\\n");

  latex = latex.replace(/\{\{CERTIFICATIONS_SECTION\}\}/g, certsBlock);

  return latex;
}
