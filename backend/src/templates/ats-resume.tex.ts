export const ATS_LATEX_TEMPLATE = `%-------------------------
% Resume in LaTeX
% ATS-Optimized One-Page Version
%------------------------

\\documentclass[letterpaper,10.5pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins for strict single-page layout
\\addtolength{\\oddsidemargin}{-0.65in}
\\addtolength{\\evensidemargin}{-0.65in}
\\addtolength{\\textwidth}{1.3in}
\\addtolength{\\topmargin}{-.8in}
\\addtolength{\\textheight}{1.6in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-6pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-6pt}
}

\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-4pt}}

%-------------------------------------------
\\begin{document}

%----------HEADING----------
\\begin{center}
    {\\Huge \\scshape {{FULL_NAME}}} \\\\ \\vspace{1pt}
    \\small
    \\raisebox{-0.1\\height}\\faPhone\\ {{PHONE}} ~
    \\href{mailto:{{EMAIL}}}{\\raisebox{-0.2\\height}\\faEnvelope\\  \\underline{{{EMAIL}}}} ~
    \\href{{{LINKEDIN_URL}}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{{{LINKEDIN_TEXT}}}}  ~
    \\href{{{GITHUB_URL}}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{{{GITHUB_TEXT}}}}
    \\vspace{-8pt}
\\end{center}

%-----------SUMMARY-----------
\\section*{Professional Summary}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
{{PROFESSIONAL_SUMMARY}}
}}
\\end{itemize}
\\vspace{-12pt}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
{{EDUCATION_SECTION}}
  \\resumeSubHeadingListEnd
\\vspace{-6pt}

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
{{SKILLS_SECTION}}
    }}
 \\end{itemize}
 \\vspace{-14pt}

%-----------PROJECTS-----------
\\section{Projects}
    \\vspace{-5pt}
    \\resumeSubHeadingListStart
{{PROJECTS_SECTION}}
    \\resumeSubHeadingListEnd
\\vspace{-4pt}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
{{EXPERIENCE_SECTION}}
  \\resumeSubHeadingListEnd
\\vspace{-4pt}

%-----------CERTIFICATIONS & ADDITIONAL-----------
\\section{Certifications \\& Additional Information}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
{{CERTIFICATIONS_SECTION}}
    }}
 \\end{itemize}

\\end{document}
`;
