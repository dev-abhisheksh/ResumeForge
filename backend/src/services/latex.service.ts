import { ATS_LATEX_TEMPLATE } from "../templates/ats-resume.tex.js";

/**
 * Escapes special LaTeX characters to prevent compilation errors
 */
export function escapeLatex(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
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

export interface TailoredProjectItem {
  title: string;
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

export interface TailoredResumePayload {
  professionalSummary: string;
  skills: {
    languages?: string[];
    backend?: string[];
    databases?: string[];
    tools?: string[];
  };
  selectedProjects: TailoredProjectItem[];
  experience?: TailoredExperienceItem[];
}

/**
 * Injects tailored candidate data into the Master ATS LaTeX Template
 */
export function buildLatexResume(
  payload: TailoredResumePayload,
  user: UserDetails,
): string {
  let latex = ATS_LATEX_TEMPLATE;

  // 1. Candidate Contact Information
  latex = latex.replace(/\{\{FULL_NAME\}\}/g, escapeLatex(user.fullName || "Developer"));
  latex = latex.replace(/\{\{PHONE\}\}/g, escapeLatex(user.phone || "+91 9175563988"));
  latex = latex.replace(/\{\{EMAIL\}\}/g, escapeLatex(user.email || "developer@example.com"));
  latex = latex.replace(/\{\{LINKEDIN_URL\}\}/g, user.linkedinUrl || "https://linkedin.com");
  latex = latex.replace(/\{\{LINKEDIN_TEXT\}\}/g, escapeLatex(user.linkedinText || "linkedin.com/in/profile"));
  latex = latex.replace(/\{\{GITHUB_URL\}\}/g, user.githubUrl || "https://github.com");
  latex = latex.replace(/\{\{GITHUB_TEXT\}\}/g, escapeLatex(user.githubText || "github.com/profile"));

  // 2. Professional Summary
  latex = latex.replace(
    /\{\{PROFESSIONAL_SUMMARY\}\}/g,
    escapeLatex(payload.professionalSummary || "Motivated Full Stack Developer with hands-on experience building scalable applications."),
  );

  // 3. Technical Skills Section
  const languagesStr = payload.skills?.languages?.map(escapeLatex).join(", ") || "JavaScript, TypeScript, HTML5, CSS3";
  const backendStr = payload.skills?.backend?.map(escapeLatex).join(", ") || "Node.js, Express.js, REST APIs, Socket.IO, BullMQ";
  const dbStr = payload.skills?.databases?.map(escapeLatex).join(", ") || "MongoDB, Redis";
  const toolsStr = payload.skills?.tools?.map(escapeLatex).join(", ") || "Git, GitHub, Docker, Postman, Vercel";

  const skillsBlock = `\\textbf{Languages \\& Frontend}{: ${languagesStr}} \\\\
\\textbf{Backend \\& Real-Time}{: ${backendStr}} \\\\
\\textbf{Databases \\& Caching}{: ${dbStr}} \\\\
\\textbf{Tools \\& Concepts}{: ${toolsStr}}`;

  latex = latex.replace(/\{\{SKILLS_SECTION\}\}/g, skillsBlock);

  // 4. Projects Section (Swapped Vault Projects)
  const projectsBlocks = (payload.selectedProjects || [])
    .map((proj) => {
      const techStr = Array.isArray(proj.techStack)
        ? proj.techStack.map(escapeLatex).join(", ")
        : escapeLatex(proj.techStack || "");

      const bullets = (proj.bulletPoints || [])
        .map((b) => `      \\resumeItem{${escapeLatex(b)}}`)
        .join("\n");

      return [
        "    \\resumeProjectHeading",
        `      {\\textbf{${escapeLatex(proj.title)}}${techStr ? ` $|$ \\emph{${techStr}}` : ""}}{${escapeLatex(proj.date || "2026")}}`,
        "      \\resumeItemListStart",
        bullets,
        "      \\resumeItemListEnd",
        "      \\vspace{-13pt}",
      ].join("\n");
    })
    .join("\n\n");

  latex = latex.replace(/\{\{PROJECTS_SECTION\}\}/g, projectsBlocks);

  // 5. Experience Section
  const experienceBlocks = (payload.experience || [])
    .map((exp) => {
      const bullets = (exp.bulletPoints || [])
        .map((b) => `      \\resumeItem{${escapeLatex(b)}}`)
        .join("\n");

      return [
        "    \\resumeSubheading",
        `      {${escapeLatex(exp.role)}}{${escapeLatex(exp.dates)}}`,
        `      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location || "Remote")}}`,
        "      \\resumeItemListStart",
        bullets,
        "      \\resumeItemListEnd",
      ].join("\n");
    })
    .join("\n\n");

  const defaultExperience = [
    "    \\resumeSubheading",
    "      {WordPress Developer Intern}{September 2024 -- November 2024}",
    "      {Technuva}{Remote}",
    "      \\resumeItemListStart",
    "        \\resumeItem{Developed responsive sites using custom PHP themes; improved SEO and performance to 85+ PageSpeed score.}",
    "      \\resumeItemListEnd",
  ].join("\n");

  latex = latex.replace(
    /\{\{EXPERIENCE_SECTION\}\}/g,
    experienceBlocks || defaultExperience,
  );

  // 6. Education & Certifications Defaults
  const defaultEducation = [
    "    \\resumeSubheading",
    "      {Bachelor of Computer Applications (BCA)}{Expected 2026}",
    "      {Don Bosco College, Panjim, Goa}{Current SGPA: 8.35}",
  ].join("\n");

  latex = latex.replace(/\{\{EDUCATION_SECTION\}\}/g, defaultEducation);

  const defaultCertifications = [
    "\\textbf{Certification}{: The Complete Web Development Bootcamp -- Udemy} \\\\",
    "\\textbf{Interests}{: Full-Stack Architecture, Scalable Systems Design, Real-Time Applications} \\\\",
    "\\textbf{Languages}{: English, Hindi}",
  ].join("\n");

  latex = latex.replace(/\{\{CERTIFICATIONS_SECTION\}\}/g, defaultCertifications);

  return latex;
}
