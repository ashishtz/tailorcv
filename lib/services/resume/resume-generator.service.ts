import {
  createOpenRouterClient,
  extractJsonObject,
} from "../ai/openrouter.service";
import {
  resumeGenerationSystemPrompt,
  resumeGenerationUserPrompt,
} from "@/lib/prompts";
import type {
  Profile,
  WorkExperience,
  Education,
  Project,
  CategorizedSkill,
} from "@/lib/types/database";
import type { GeneratedResumeData } from "@/lib/utils/normalize-resume";
import { formatMonthYear } from "@/lib/utils";

interface ResumeGenerationParams {
  profile: Profile | null;
  skills: CategorizedSkill[];
  workExperiences: WorkExperience[];
  education: Education[];
  projects: Project[];
  jobTitle: string;
  jobDescription: string;
  mode: "strict" | "free";
  generationSettings: {
    summary_format: "paragraph" | "bullets";
    work_experience_format: "paragraph" | "bullets";
    projects_format: "paragraph" | "bullets";
    highlight_important_content: boolean;
  };
  /** Already normalized by the caller (app/api/resumes/generate/route.ts). */
  resumeContext?: {
    generated_data: GeneratedResumeData;
  };
}

/**
 * Generates a tailored resume using AI based on user data and job requirements
 * @param params Resume generation parameters
 * @returns Generated resume data in structured format
 */
export async function generateResume(params: ResumeGenerationParams) {
  const systemVars = buildSystemPromptVariables(params);
  const userVars = buildUserPromptVariables(params);

  const client = createOpenRouterClient({
    temperature: 0.7,
    maxTokens: 8000,
  });

  // formatMessages keeps proper message objects - .format() would flatten to a
  // buffer string with "System:"/"Human:" prefixes baked into the content.
  const systemMessages = await resumeGenerationSystemPrompt.formatMessages(systemVars);
  const userMessages = await resumeGenerationUserPrompt.formatMessages(userVars);

  const response = await client.invoke([...systemMessages, ...userMessages]);

  return extractJsonObject(response.text);
}

const resumeHighlightPrompt = `
## STRICT HIGHLIGHTING INSTRUCTION (REVISED)

You are transforming a resume into a version with clear emphasis using [HIGHLIGHT] markers.

Your single top priority:
Follow the highlighting rules exactly as stated below without skipping or softening them.

---

### GLOBAL HIGHLIGHT RULES

1. Use [HIGHLIGHT] and [/HIGHLIGHT] tags exactly like this: [HIGHLIGHT]text[/HIGHLIGHT].
2. Highlight complete phrases (2–6 words), not single words.
3. Highlight only from user-provided data (no invention or assumptions).
4. Create 8-10 highlights total in the entire resume.
5. If the same technology or keyword appears in both the user’s background and the job description, it must be highlighted every time it appears.
6. Never skip a required highlight, even if it feels repetitive.

---

### SUMMARY SECTION RULES

Highlight all of the following (minimum 3, maximum 4 highlights):

* Years of experience (e.g., [HIGHLIGHT]7+ years[/HIGHLIGHT])
* Seniority level (e.g., [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT])
* Primary technical expertise or domain (e.g., [HIGHLIGHT]full-stack web development[/HIGHLIGHT])
* Specialized focus or skill area (e.g., [HIGHLIGHT]cloud architecture[/HIGHLIGHT], [HIGHLIGHT]AI-driven solutions[/HIGHLIGHT])
* Any quantified result or scale mentioned

If any are missing, you must create at least two relevant highlights from the available text.

---

### WORK EXPERIENCE RULES

For each job entry, include at least 1 highlights.
Highlight the following categories:

* Key technologies used (e.g., [HIGHLIGHT]React.js[/HIGHLIGHT], [HIGHLIGHT]Python[/HIGHLIGHT], [HIGHLIGHT]AWS[/HIGHLIGHT])
* Methodologies or architectures (e.g., [HIGHLIGHT]Agile/Scrum[/HIGHLIGHT], [HIGHLIGHT]microservices architecture[/HIGHLIGHT])
* Measurable results or scale (e.g., [HIGHLIGHT]serving 200K+ users[/HIGHLIGHT], [HIGHLIGHT]reduced deployment time by 40%[/HIGHLIGHT])
* Leadership or key achievements (e.g., [HIGHLIGHT]led architecture design[/HIGHLIGHT], [HIGHLIGHT]mentored 5 engineers[/HIGHLIGHT])

No work experience section may have fewer than 3 highlights under any condition.

---

### PROJECTS SECTION RULES

For each project, include 2-3 highlights.
Highlight these:

* Core technologies used
* Your personal role or contribution
* Any performance metrics or achievements
* Complexity or uniqueness of the project

If a project lacks quantitative data, focus on the tools, your role, and complexity.

---

### FINAL CHECK

Before finalizing:

* Ensure every section (Summary, Work Experience, Projects) contains highlights.
* Total highlights across the resume = 15 to 25.
* If unsure whether to highlight something relevant to the job, highlight it.
* Generate only the Impact section for a professional experience summary. Do not include any “What I Did” or task-related details. Write in concise bullet points that show measurable or qualitative outcomes, organizational benefits, and improvements in scalability, security, efficiency, or collaboration. Maintain a professional tone suitable for a senior software engineer’s resume. Limit to 4–6 impactful points. Do not repeat job duties or use storytelling. Only focus on results and outcomes achieved for the organization.

---

### SAMPLE OUTPUT FORMAT

Summary:
"Experienced [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]8+ years[/HIGHLIGHT] of experience in [HIGHLIGHT]full-stack development[/HIGHLIGHT] and [HIGHLIGHT]cloud-native systems[/HIGHLIGHT]."

Experience:
"Built [HIGHLIGHT]microservices architecture[/HIGHLIGHT] using [HIGHLIGHT]Node.js[/HIGHLIGHT] and [HIGHLIGHT]Docker[/HIGHLIGHT], supporting [HIGHLIGHT]over 500K users[/HIGHLIGHT]."
"Improved [HIGHLIGHT]platform scalability[/HIGHLIGHT] by deploying a modular [HIGHLIGHT]Node.js[/HIGHLIGHT] and [HIGHLIGHT]Docker microservices architecture[/HIGHLIGHT] supporting over [HIGHLIGHT]500K active users[/HIGHLIGHT]."
"Enhanced [HIGHLIGHT]system reliability[/HIGHLIGHT] and [HIGHLIGHT]uptime[/HIGHLIGHT] through containerized [HIGHLIGHT]Node.js microservices[/HIGHLIGHT], enabling seamless [HIGHLIGHT]scaling under high traffic[/HIGHLIGHT]."
"Strengthened [HIGHLIGHT]data security[/HIGHLIGHT] and [HIGHLIGHT]regulatory compliance[/HIGHLIGHT] by integrating containerized [HIGHLIGHT]microservices[/HIGHLIGHT] within a controlled [HIGHLIGHT]deployment pipeline[/HIGHLIGHT]."
"Reduced [HIGHLIGHT]operational costs[/HIGHLIGHT] and [HIGHLIGHT]deployment time[/HIGHLIGHT] by automating [HIGHLIGHT]microservice orchestration[/HIGHLIGHT] with [HIGHLIGHT]Docker-based infrastructure[/HIGHLIGHT]."
"Increased [HIGHLIGHT]developer productivity[/HIGHLIGHT] by isolating [HIGHLIGHT]service components[/HIGHLIGHT], improving [HIGHLIGHT]test coverage[/HIGHLIGHT], and simplifying [HIGHLIGHT]continuous delivery[/HIGHLIGHT]."
"Enabled faster [HIGHLIGHT]feature rollouts[/HIGHLIGHT] and higher [HIGHLIGHT]platform resilience[/HIGHLIGHT] by adopting a [HIGHLIGHT]microservices-first architecture[/HIGHLIGHT] across product modules."
`;


function buildSystemPromptVariables(params: ResumeGenerationParams) {
  const { mode, generationSettings } = params;
  const summaryBullets = generationSettings.summary_format === "bullets";
  const workBullets = generationSettings.work_experience_format === "bullets";
  const projectBullets = generationSettings.projects_format === "bullets";

  return {
    summary_instructions: summaryBullets
      ? `- Summary format: bullets
- Create 2-3 detailed bullet points that highlight key qualifications and match job requirements. Each point should be 40-50 words.
- Use array format: ["qualification 1", "qualification 2", ...]`
      : `- Summary format: paragraph
- Create a concise, attractive paragraph (150-200 words) that immediately catches attention and positions candidate as ideal fit
- Use detailed string format for concise paragraph`,
    mode,
    mode_instructions:
      mode === "strict"
        ? `- Strict mode: Use ONLY the provided user information. You can rephrase and optimize for the job, but cannot invent new experiences, technologies, or achievements. Summary must be based strictly on user's actual background (15% job description influence maximum).
           Core elements that must remain unchanged:
           * Company names and employment dates
           * Job titles and locations
           * Key achievements with specific metrics
           * Primary technologies used
           * Team size and leadership roles`
        : `- Free mode: You can enhance and expand based on job requirements while keeping user's core experience intact. Can infer relevant technologies and skills that align with user's background (up to 70% job description influence allowed).
           Core elements that must remain unchanged:
           * Company names and employment dates
           * Job titles and locations
           * Any specific metrics or achievements
           * Team size and leadership roles
           Modifiable elements:
           * Technology stack (can add relevant technologies)
           * Project descriptions (can be enhanced)
           * Skill emphasis (can be adjusted)`,
    work_experience_instructions: workBullets
      ? `bullets - Use array format: ["responsibility 1", "achievement 2", "technology used 3"] (4-6 items, 40-50 words per point)`
      : `paragraph - Use detailed string format for flowing paragraph descriptions (200-600 words total)`,
    projects_instructions: projectBullets
      ? `bullets - Use array format: ["feature 1", "technology 2", "outcome 3"] (3-5 items, 30-40 words per point)`
      : `paragraph - Use detailed string format for flowing paragraph descriptions (150-375 words total)`,
    skills_instructions: `
      Skills Section Requirements:
      - Include all the skills with Category of user.
      - You can Re-order skils based on the below requirement but you can't remove any of the skills.
      - You can't re-order the Categories of skills, they are always going to be in same order. you can re-order the skills inside those categoreis.
      - Prioritization skill order(Must order skills in below provided instructions):
        1. Skills that appear in both job description and user's background
        2. Skills from job description that align with user's experience
        3. Most relevant skills from user's background`,
    highlight_instructions: generationSettings.highlight_important_content
      ? resumeHighlightPrompt
      : "",
    summary_example: summaryBullets
      ? '["qualification 1", "qualification 2", "qualification 3", "qualification 4", "qualification 5"]'
      : '"detailed paragraph summarizing key qualifications and fit for the job"',
    work_experience_example: workBullets
      ? '["responsibility/achievement 1", "technology/tool used 2", "meaningful accomplishment 3",...]'
      : '"detailed working paragraph (flowing description of role"',
    projects_example: projectBullets
      ? '["key feature/functionality 1", "technology stack used 2", "project outcome 3"]"'
      : '"detailed project description paragraph"',
  };
}

const joinContent = (value: string | string[]): string =>
  Array.isArray(value) ? value.join("\n  ") : value;

function buildUserPromptVariables(params: ResumeGenerationParams) {
  const {
    profile,
    skills,
    workExperiences,
    education,
    projects,
    jobTitle,
    jobDescription,
    resumeContext,
  } = params;

  // Existing-resume context is already normalized by the caller; profile data
  // is mapped into the same shape so one formatter serves both.
  const data: GeneratedResumeData = resumeContext?.generated_data ?? {
    contact: {
      name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" "),
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      address: [profile?.address_1, profile?.address_2, profile?.address_3]
        .filter(Boolean)
        .join(", "),
      socialLinks: {
        linkedin: profile?.linkedin_url || undefined,
        github: profile?.github_url || undefined,
        stackoverflow: profile?.stackoverflow_url || undefined,
      },
    },
    skills,
    workExperience: workExperiences.map((exp) => ({
      company: exp.company_name,
      position: exp.position_title,
      location: exp.location || "",
      type: exp.job_type || "",
      duration: `${formatMonthYear(exp.start_date)} to ${
        exp.is_current ? "Present" : formatMonthYear(exp.end_date)
      }`,
      description: exp.description || "",
    })),
    education: education.map((edu) => ({
      institution: edu.institution_name,
      degree: edu.degree || "",
      field: edu.field_of_study || "",
      duration: `${formatMonthYear(edu.start_date)} to ${formatMonthYear(edu.end_date)}`,
    })),
    projects: projects.map((proj) => ({
      name: proj.project_name,
      role: proj.role_title || "",
      description: proj.description || "",
      link: proj.link || undefined,
    })),
  };

  const nameParts = data.contact.name.split(" ").filter(Boolean);

  return {
    first_name: nameParts[0] || "",
    last_name: nameParts.slice(1).join(" "),
    email: data.contact.email,
    phone: data.contact.phone,
    location: data.contact.location,
    address: data.contact.address || "",
    linkedin_url: data.contact.socialLinks?.linkedin || "",
    github_url: data.contact.socialLinks?.github || "",
    stackoverflow_url: data.contact.socialLinks?.stackoverflow || "",
    skills: data.skills
      .map((skill) => `${skill.category}: ${skill.skills.join(", ")}`)
      .join("\n"),
    work_experiences: data.workExperience
      .map(
        (exp) => `
- Company: ${exp.company}
- Position: ${exp.position}
- Location: ${exp.location}
- Type: ${exp.type}
- Duration: ${exp.duration}
- Description: ${joinContent(exp.description)}`
      )
      .join("\n"),
    education: data.education
      .map(
        (edu) => `
- Institution: ${edu.institution}
- Degree: ${edu.degree}
- Field: ${edu.field}
- Duration: ${edu.duration}`
      )
      .join("\n"),
    projects: data.projects
      .map(
        (proj) => `
- Name: ${proj.name}
- Role: ${proj.role}
- Description: ${joinContent(proj.description)}
- Link: ${proj.link || ""}`
      )
      .join("\n"),
    job_title: jobTitle,
    job_description: jobDescription,
  };
}
