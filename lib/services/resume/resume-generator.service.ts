import {
  createOpenRouterClient,
  extractJsonObject,
  extractPartialJson,
} from "../ai/openrouter.service";
import { normalizeResumeData } from "@/lib/utils/normalize-resume";
import {
  resumeGenerationPrompt,
  MODE_RULES,
  SECTION_FORMATS,
  HIGHLIGHT_RULES,
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
 * Streams a tailored resume as it is generated. Yields normalized snapshots
 * of the partially-received JSON (safe to render in any template) and returns
 * the final raw parsed object for the caller to validate and save.
 */
export async function* streamResume(
  params: ResumeGenerationParams
): AsyncGenerator<GeneratedResumeData, unknown> {
  const client = createOpenRouterClient({
    temperature: 0.7,
    maxTokens: 8000,
  });

  const stream = await resumeGenerationPrompt
    .pipe(client)
    .stream(buildPromptVariables(params));

  let acc = "";
  let lastYield = 0;
  for await (const chunk of stream) {
    acc += chunk.text;
    // ponytail: time-based throttle; snapshot diffing if bandwidth ever matters
    if (Date.now() - lastYield < 250) continue;
    const partial = extractPartialJson(acc);
    if (partial && typeof partial === "object") {
      lastYield = Date.now();
      yield normalizeResumeData(partial);
    }
  }

  return extractJsonObject(acc);
}

const joinContent = (value: string | string[]): string =>
  Array.isArray(value) ? value.join("\n  ") : value;

/**
 * Maps generation params onto the prompt's template variables. All prompt
 * text lives in lib/prompts/resume-generation.prompt.ts — this function only
 * selects rule variants and formats data. Exported for the prompt-contract test.
 */
export function buildPromptVariables(params: ResumeGenerationParams) {
  const {
    profile,
    skills,
    workExperiences,
    education,
    projects,
    jobTitle,
    jobDescription,
    mode,
    generationSettings,
    resumeContext,
  } = params;

  const summary = SECTION_FORMATS.summary[generationSettings.summary_format];
  const work =
    SECTION_FORMATS.workExperience[generationSettings.work_experience_format];
  const project = SECTION_FORMATS.projects[generationSettings.projects_format];

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

  return {
    // System-message variables: rule variants selected by settings.
    mode_rules: MODE_RULES[mode],
    summary_format_rules: summary.rules,
    summary_example: summary.example,
    work_experience_format_rules: work.rules,
    work_experience_example: work.example,
    projects_format_rules: project.rules,
    projects_example: project.example,
    highlight_rules: generationSettings.highlight_important_content
      ? HIGHLIGHT_RULES
      : "",
    // User-message variables: candidate data and the target job.
    name: data.contact.name,
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
