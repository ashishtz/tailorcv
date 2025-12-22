import { createOpenRouterClient } from "../ai/openrouter.service";
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
import { formatResumeDate } from "@/lib/utils";

/**
 * Configuration interface for resume content formatting requirements
 */
interface ResumeFormatConfig {
  SUMMARY_MIN_BULLETS: number;
  SUMMARY_MAX_BULLETS: number;
  SUMMARY_MIN_WORDS_PER_POINT: number;
  SUMMARY_MAX_WORDS_PER_POINT: number;
  WORK_EXP_MIN_BULLETS: number;
  WORK_EXP_MAX_BULLETS: number;
  WORK_EXP_MIN_WORDS_PER_POINT: number;
  WORK_EXP_MAX_WORDS_PER_POINT: number;
  PROJECT_MIN_BULLETS: number;
  PROJECT_MAX_BULLETS: number;
  PROJECT_MIN_WORDS_PER_POINT: number;
  PROJECT_MAX_WORDS_PER_POINT: number;
  MIN_SKILLS: number;
  MAX_SKILLS: number;
  STRICT_MODE_JOB_INFLUENCE: number;
  FREE_MODE_JOB_INFLUENCE: number;
}

/**
 * Default configuration values for resume content formatting
 */
const DEFAULT_FORMAT_CONFIG: ResumeFormatConfig = {
  SUMMARY_MIN_BULLETS: 2,
  SUMMARY_MAX_BULLETS: 3,
  SUMMARY_MIN_WORDS_PER_POINT: 150,
  SUMMARY_MAX_WORDS_PER_POINT: 200,
  WORK_EXP_MIN_BULLETS: 4,
  WORK_EXP_MAX_BULLETS: 6,
  WORK_EXP_MIN_WORDS_PER_POINT: 50,
  WORK_EXP_MAX_WORDS_PER_POINT: 100,
  PROJECT_MIN_BULLETS: 3,
  PROJECT_MAX_BULLETS: 5,
  PROJECT_MIN_WORDS_PER_POINT: 50,
  PROJECT_MAX_WORDS_PER_POINT: 75,
  MIN_SKILLS: 15,
  MAX_SKILLS: 25,
  STRICT_MODE_JOB_INFLUENCE: 15,
  FREE_MODE_JOB_INFLUENCE: 70,
};

/**
 * Validates the resume format configuration values
 * @param config Configuration to validate
 * @throws Error if any validation rules are violated
 */
function validateFormatConfig(config: ResumeFormatConfig): void {
  const validations = [
    {
      condition: config.SUMMARY_MIN_BULLETS <= config.SUMMARY_MAX_BULLETS,
      message: "Summary min bullets must be less than or equal to max bullets",
    },
    {
      condition: config.SUMMARY_MIN_WORDS_PER_POINT <= config.SUMMARY_MAX_WORDS_PER_POINT,
      message: "Summary min words per point must be less than or equal to max words",
    },
    {
      condition: config.WORK_EXP_MIN_BULLETS <= config.WORK_EXP_MAX_BULLETS,
      message: "Work experience min bullets must be less than or equal to max bullets",
    },
    {
      condition: config.WORK_EXP_MIN_WORDS_PER_POINT <= config.WORK_EXP_MAX_WORDS_PER_POINT,
      message: "Work experience min words per point must be less than or equal to max words",
    },
    {
      condition: config.PROJECT_MIN_BULLETS <= config.PROJECT_MAX_BULLETS,
      message: "Project min bullets must be less than or equal to max bullets",
    },
    {
      condition: config.PROJECT_MIN_WORDS_PER_POINT <= config.PROJECT_MAX_WORDS_PER_POINT,
      message: "Project min words per point must be less than or equal to max words",
    },
    {
      condition: config.MIN_SKILLS <= config.MAX_SKILLS,
      message: "Min skills must be less than or equal to max skills",
    },
    {
      condition: config.STRICT_MODE_JOB_INFLUENCE >= 0 && config.STRICT_MODE_JOB_INFLUENCE <= 100,
      message: "Strict mode job influence must be between 0 and 100",
    },
    {
      condition: config.FREE_MODE_JOB_INFLUENCE >= 0 && config.FREE_MODE_JOB_INFLUENCE <= 100,
      message: "Free mode job influence must be between 0 and 100",
    },
  ];

  for (const validation of validations) {
    if (!validation.condition) {
      throw new Error(`Invalid format config: ${validation.message}`);
    }
  }
}

export interface ResumeGenerationParams {
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
  resumeContext?: {
    generated_data: unknown;
  };
}

/**
 * Generates a tailored resume using AI based on user data and job requirements
 * @param params Resume generation parameters
 * @returns Generated resume data in structured format
 */
export async function generateResume(params: ResumeGenerationParams) {
  console.log('params', params)
  const systemVars = buildSystemPromptVariables(params);
  const userVars = buildUserPromptVariables(params);

  const client = createOpenRouterClient({
    temperature: 0.7,
    maxTokens: 2000,
  });

  // Format prompts with variables
  const systemMessage = await resumeGenerationSystemPrompt.format(systemVars);
  const userMessage = await resumeGenerationUserPrompt.format(userVars);

  // Invoke AI with formatted messages
  const response = await client.invoke([
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage },
  ]);

  // Parse JSON response
  return parseResumeResponse(response.content as string);
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
  validateFormatConfig(DEFAULT_FORMAT_CONFIG);

  return {
    summary_format: generationSettings.summary_format,
    summary_format_instructions:
      generationSettings.summary_format === "bullets"
        ? `- Create ${DEFAULT_FORMAT_CONFIG.SUMMARY_MIN_BULLETS}-${DEFAULT_FORMAT_CONFIG.SUMMARY_MAX_BULLETS} detailed bullet points that highlight key qualifications and match job requirements. Each point should be 40-50 words.`
        : `- Create a concise, attractive paragraph (${DEFAULT_FORMAT_CONFIG.SUMMARY_MIN_WORDS_PER_POINT}-${DEFAULT_FORMAT_CONFIG.SUMMARY_MAX_WORDS_PER_POINT} words) that immediately catches attention and positions candidate as ideal fit`,
    summary_format_type:
      generationSettings.summary_format === "bullets"
        ? `Use array format: ["qualification 1", "qualification 2", ...]`
        : "Use detailed string format for concise paragraph",
    mode,
    mode_instructions:
      mode === "strict"
        ? `- Strict mode: Use ONLY the provided user information. You can rephrase and optimize for the job, but cannot invent new experiences, technologies, or achievements. Summary must be based strictly on user's actual background (${DEFAULT_FORMAT_CONFIG.STRICT_MODE_JOB_INFLUENCE}% job description influence maximum).
           Core elements that must remain unchanged:
           * Company names and employment dates
           * Job titles and locations
           * Key achievements with specific metrics
           * Primary technologies used
           * Team size and leadership roles`
        : `- Free mode: You can enhance and expand based on job requirements while keeping user's core experience intact. Can infer relevant technologies and skills that align with user's background (up to ${DEFAULT_FORMAT_CONFIG.FREE_MODE_JOB_INFLUENCE}% job description influence allowed).
           Core elements that must remain unchanged:
           * Company names and employment dates
           * Job titles and locations
           * Any specific metrics or achievements
           * Team size and leadership roles
           Modifiable elements:
           * Technology stack (can add relevant technologies)
           * Project descriptions (can be enhanced)
           * Skill emphasis (can be adjusted)`,
    work_experience_format: generationSettings.work_experience_format,
    work_experience_format_type:
      generationSettings.work_experience_format === "bullets"
        ? `Use array format: ["responsibility 1", "achievement 2", "technology used 3"] (${DEFAULT_FORMAT_CONFIG.WORK_EXP_MIN_BULLETS}-${DEFAULT_FORMAT_CONFIG.WORK_EXP_MAX_BULLETS} items, 40-50 words per point)`
        : `Use detailed string format for flowing paragraph descriptions (${DEFAULT_FORMAT_CONFIG.WORK_EXP_MIN_WORDS_PER_POINT * DEFAULT_FORMAT_CONFIG.WORK_EXP_MIN_BULLETS}-${DEFAULT_FORMAT_CONFIG.WORK_EXP_MAX_WORDS_PER_POINT * DEFAULT_FORMAT_CONFIG.WORK_EXP_MAX_BULLETS} words total)`,
    projects_format: generationSettings.projects_format,
    projects_format_type:
      generationSettings.projects_format === "bullets"
        ? `Use array format: ["feature 1", "technology 2", "outcome 3"] (${DEFAULT_FORMAT_CONFIG.PROJECT_MIN_BULLETS}-${DEFAULT_FORMAT_CONFIG.PROJECT_MAX_BULLETS} items, 30-40 words per point)`
        : `Use detailed string format for flowing paragraph descriptions (${DEFAULT_FORMAT_CONFIG.PROJECT_MIN_WORDS_PER_POINT * DEFAULT_FORMAT_CONFIG.PROJECT_MIN_BULLETS}-${DEFAULT_FORMAT_CONFIG.PROJECT_MAX_WORDS_PER_POINT * DEFAULT_FORMAT_CONFIG.PROJECT_MAX_BULLETS} words total)`,
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
    summary_example:
      generationSettings.summary_format === "bullets"
        ? '["qualification 1", "qualification 2", "qualification 3", "qualification 4", "qualification 5"]'
        : '"detailed paragraph summarizing key qualifications and fit for the job"',
    work_experience_example:
      generationSettings.work_experience_format === "bullets"
        ? '["responsibility/achievement 1", "technology/tool used 2", "meaningful accomplishment 3",...]'
        : '"detailed working paragraph (flowing description of role"',
    projects_example:
      generationSettings.projects_format === "bullets"
        ? '["key feature/functionality 1", "technology stack used 2", "project outcome 3"]"'
        : '"detailed project description paragraph"',
  };
}

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

  // If resume context is provided, use data from the existing resume
  if (resumeContext?.generated_data) {
    const resumeData = resumeContext.generated_data as {
      personalInfo?: {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
        address?: string;
      };
      contact?: {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
        address?: string;
        socialLinks?: {
          linkedin?: string;
          github?: string;
          stackoverflow?: string;
        };
      };
      skills?: string[];
      workExperience?: Array<{
        company?: string;
        position?: string;
        location?: string;
        type?: string;
        duration?: string;
        description?: string | string[];
      }>;
      education?: Array<{
        institution?: string;
        degree?: string;
        field?: string;
        duration?: string;
      }>;
      projects?: Array<{
        name?: string;
        role?: string;
        description?: string | string[];
        link?: string;
      }>;
    };

    const nameParts = (resumeData.contact?.name || resumeData.personalInfo?.name)?.split(" ") || [];
    const socialLinks = resumeData.contact?.socialLinks;
    return {
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      email: resumeData.contact?.email || resumeData.personalInfo?.email || "",
      phone: resumeData.contact?.phone || resumeData.personalInfo?.phone || "",
      location: resumeData.contact?.location || resumeData.personalInfo?.location || "",
      address: resumeData.contact?.address || resumeData.personalInfo?.address || "",
      linkedin_url: socialLinks?.linkedin || "",
      github_url: socialLinks?.github || "",
      stackoverflow_url: socialLinks?.stackoverflow || "",
      skills: Array.isArray(resumeData.skills)
        ? resumeData.skills.join(", ")
        : "",
      work_experiences: (resumeData.workExperience || [])
        .map(
          (exp) => `
- Company: ${exp.company || ""}
- Position: ${exp.position || ""}
- Location: ${exp.location || ""}
- Type: ${exp.type || ""}
- Duration: ${exp.duration || ""}
- Description: ${
            Array.isArray(exp.description)
              ? exp.description.join("\n  ")
              : exp.description || ""
          }`
        )
        .join("\n"),
      education: (resumeData.education || [])
        .map(
          (edu) => `
- Institution: ${edu.institution || ""}
- Degree: ${edu.degree || ""}
- Field: ${edu.field || ""}
- Duration: ${edu.duration || ""}`
        )
        .join("\n"),
      projects: (resumeData.projects || [])
        .map(
          (proj) => `
- Name: ${proj.name || ""}
- Role: ${proj.role || ""}
- Description: ${
            Array.isArray(proj.description)
              ? proj.description.join("\n  ")
              : proj.description || ""
          }
- Link: ${proj.link || ""}`
        )
        .join("\n"),
      job_title: jobTitle,
      job_description: jobDescription,
    };
  }

  // Otherwise, use profile data (original behavior)
  // Format categorized skills for prompt
  const formattedSkills = skills
    .map(cat => `${cat.category}: ${cat.skills.join(", ")}`)
    .join("\n");

  return {
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    address: [profile?.address_1, profile?.address_2, profile?.address_3]
      .filter(Boolean)
      .join(", "),
    linkedin_url: profile?.linkedin_url || "",
    github_url: profile?.github_url || "",
    stackoverflow_url: profile?.stackoverflow_url || "",
    skills: formattedSkills,
    work_experiences: workExperiences
      .map(
        (exp) => `
- Company: ${exp.company_name}
- Position: ${exp.position_title}
- Location: ${exp.location}
- Type: ${exp.job_type}
- Duration: ${formatResumeDate(exp.start_date)} to ${
          exp.is_current ? "Present" : formatResumeDate(exp.end_date)
        }
- Description: ${exp.description}`
      )
      .join("\n"),
    education: education
      .map(
        (edu) => `
- Institution: ${edu.institution_name}
- Degree: ${edu.degree}
- Field: ${edu.field_of_study}
- Duration: ${formatResumeDate(edu.start_date)} to ${formatResumeDate(
          edu.end_date
        )}`
      )
      .join("\n"),
    projects: projects
      .map(
        (proj) => `
- Name: ${proj.project_name}
- Role: ${proj.role_title}
- Description: ${proj.description}
- Link: ${proj.link}`
      )
      .join("\n"),
    job_title: jobTitle,
    job_description: jobDescription,
  };
}

function parseResumeResponse(content: string) {
  console.log("content", content);
  try {
    return JSON.parse(content);
  } catch {
    // If parsing fails, try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse AI response");
  }
}
