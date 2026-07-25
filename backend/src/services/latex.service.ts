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
 * Injects candidate data into the Master ATS LaTeX Template.
 * Strictly preserves candidate's authentic summary, contact links, skills & experience while swapping projects!
 */
export function buildLatexResume(
  payload: TailoredResumePayload,
  user: UserDetails,
): string {
  let latex = ATS_LATEX_TEMPLATE;

  // 1. Candidate Contact Information (Dynamic per logged-in user)
  latex = latex.replace(/\{\{FULL_NAME\}\}/g, escapeLatex(user.fullName || "Candidate"));
  latex = latex.replace(/\{\{PHONE\}\}/g, escapeLatex(user.phone || ""));
  latex = latex.replace(/\{\{EMAIL\}\}/g, escapeLatex(user.email || "candidate@example.com"));
  latex = latex.replace(/\{\{LINKEDIN_URL\}\}/g, user.linkedinUrl || "https://linkedin.com");
  latex = latex.replace(/\{\{LINKEDIN_TEXT\}\}/g, escapeLatex(user.linkedinText || "linkedin.com/in/candidate"));
  latex = latex.replace(/\{\{GITHUB_URL\}\}/g, user.githubUrl || "https://github.com");
  latex = latex.replace(/\{\{GITHUB_TEXT\}\}/g, escapeLatex(user.githubText || "github.com/candidate"));

  // 2. Professional Summary (Preserve Authentic Master Summary)
  const defaultSummary = "Motivated Full Stack Developer with hands-on experience building web applications using React.js, Node.js, and MongoDB. Skilled in developing responsive UIs with Tailwind CSS, building RESTful APIs with Express.js, implementing JWT authentication, Redis caching, BullMQ, and Socket.IO. Passionate about writing clean, scalable code and continuously learning modern technologies.";
  
  latex = latex.replace(
    /\{\{PROFESSIONAL_SUMMARY\}\}/g,
    escapeLatex(payload.professionalSummary || defaultSummary),
  );

  // 3. Technical Skills Section (Authentic Master Skills)
  const languagesStr = payload.skills?.languages?.map(escapeLatex).join(", ") || "JavaScript (ES6+), React.js, HTML5, CSS3, Tailwind CSS";
  const backendStr = payload.skills?.backend?.map(escapeLatex).join(", ") || "Node.js, NestJS (Familiar), Express.js, Socket.IO, WebSockets, BullMQ, GenAI";
  const dbStr = payload.skills?.databases?.map(escapeLatex).join(", ") || "MongoDB (Aggregation, Indexing, Schema Design), Redis";
  const toolsStr = payload.skills?.tools?.map(escapeLatex).join(", ") || "JWT, RBAC, REST APIs, Swagger, Git, GitHub, Postman, Vercel, Render, Docker";

  const skillsBlock = `\\textbf{Languages \\& Frontend}{: ${languagesStr}} \\\\
\\textbf{Backend \\& Real-Time}{: ${backendStr}} \\\\
\\textbf{Databases \\& Caching}{: ${dbStr}} \\\\
\\textbf{Tools \\& Concepts}{: ${toolsStr}}`;

  latex = latex.replace(/\{\{SKILLS_SECTION\}\}/g, skillsBlock);

  // 4. Projects Section (Swapped Vault Projects with Metric Bullets & Definition)
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

  // 5. Experience Section (Authentic Internships Verbatim)
  const experienceBlocks = (payload.experience || [])
    .slice(0, 2)
    .map((exp) => {
      const bullets = (exp.bulletPoints || [])
        .slice(0, 2)
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
    "        \\resumeItem{Developed 5+ responsive WordPress sites using custom PHP themes; improved SEO and performance to 85+ PageSpeed score.}",
    "      \\resumeItemListEnd",
    "    \\resumeSubheading",
    "      {AI Intern}{May 2024 -- July 2024}",
    "      {Lenovo Leap \\& Motorola}{Remote}",
    "      \\resumeItemListStart",
    "        \\resumeItem{Collaborated on enterprise AI solutions focusing on machine learning implementation and data analysis.}",
    "      \\resumeItemListEnd",
  ].join("\n");

  latex = latex.replace(
    /\{\{EXPERIENCE_SECTION\}\}/g,
    experienceBlocks || defaultExperience,
  );

  // 6. Education & Certifications (Authentic Master Data)
  const defaultEducation = [
    "    \\resumeSubheading",
    "      {Bachelor of Computer Applications (BCA)}{Expected 2026}",
    "      {Don Bosco College, Panjim, Goa}{Current SGPA: 8.35 (Sem 5)}",
  ].join("\n");

  latex = latex.replace(/\{\{EDUCATION_SECTION\}\}/g, defaultEducation);

  const defaultCertifications = [
    "\\textbf{Certification}{: The Complete Web Development Bootcamp -- Dr. Angela Yu, Udemy (2024)} \\\\",
    "\\textbf{Interests}{: Full-Stack Architecture, Scalable Systems Design, Real-Time Applications} \\\\",
    "\\textbf{Languages}{: English (Intermediate), Hindi (Native)}",
  ].join("\n");

  latex = latex.replace(/\{\{CERTIFICATIONS_SECTION\}\}/g, defaultCertifications);

  return latex;
}
