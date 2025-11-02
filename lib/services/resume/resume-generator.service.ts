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
} from "@/lib/types/database";
import { formatResumeDate } from "@/lib/utils";

export interface ResumeGenerationParams {
  profile: Profile | null;
  skills: string[];
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

function buildSystemPromptVariables(params: ResumeGenerationParams) {
  const { mode, generationSettings } = params;

  return {
    summary_format: generationSettings.summary_format,
    summary_format_instructions:
      generationSettings.summary_format === "bullets"
        ? "- Create minumum 2-3 detailed bullet points that highlight key qualifications and match job requirements and each point should be atleast 200 words."
        : "- Create a concise, attractive paragraph (6-7 sentences minimum) that immediately catches attention and positions candidate as ideal fit",
    summary_format_type:
      generationSettings.summary_format === "bullets"
        ? 'Use array format: ["qualification 1", "qualification 2", ...]'
        : "Use detailed string format for concise paragraph",
    mode,
    mode_instructions:
      mode === "strict"
        ? `- Strict mode: Use ONLY the provided user information. You can rephrase and optimize for the job, but cannot invent new experiences, technologies, or achievements. Summary must be based strictly on user's actual background (20% job description influence maximum).`
        : `- Free mode: You can enhance and expand based on job requirements while keeping user's core experience intact. Can infer relevant technologies and skills that align with user's background (up to 80% job description influence allowed). and for this mode, you can also modify any project descriptions to better fit the job requirements.`,
    work_experience_format: generationSettings.work_experience_format,
    work_experience_format_type:
      generationSettings.work_experience_format === "bullets"
        ? 'Use array format: ["responsibility 1", "achievement 2", "technology used 3"]'
        : "Use detailed string format for flowing paragraph descriptions",
    projects_format: generationSettings.projects_format,
    projects_format_type:
      generationSettings.projects_format === "bullets"
        ? 'Use array format: ["feature 1", "technology 2", "outcome 3"] each sentence should be atleast 200 words'
        : "Use detailed string format for flowing paragraph descriptions write proper detailed description",
    highlight_instructions: generationSettings.highlight_important_content
      ? `
MANDATORY HIGHLIGHTING: You MUST use [HIGHLIGHT]text[/HIGHLIGHT] markers extensively throughout the resume.

WHAT TO HIGHLIGHT (be aggressive with highlighting):

IN SUMMARY SECTION - Highlight ALL of these:
- Years of experience (e.g., "[HIGHLIGHT]7+ years[/HIGHLIGHT]")
- Key technologies/skills matching job (e.g., "[HIGHLIGHT]full-stack development[/HIGHLIGHT]")
- Seniority level (e.g., "[HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT]")
- Specialized expertise (e.g., "[HIGHLIGHT]cloud architecture specialist[/HIGHLIGHT]")

IN WORK EXPERIENCE - For EACH job, highlight 4-6 items:
- Specific technologies matching the job description (e.g., "[HIGHLIGHT]React.js[/HIGHLIGHT]", "[HIGHLIGHT]Python[/HIGHLIGHT]", "[HIGHLIGHT]AWS[/HIGHLIGHT]")
- Scale/numbers from user data (e.g., "[HIGHLIGHT]serving 100K+ users[/HIGHLIGHT]")
- Methodologies matching job (e.g., "[HIGHLIGHT]Agile/Scrum[/HIGHLIGHT]", "[HIGHLIGHT]microservices architecture[/HIGHLIGHT]")
- Key achievements (e.g., "[HIGHLIGHT]reduced deployment time/HIGHLIGHT]" - only if in user data)

IN PROJECTS - For EACH project, highlight 4-5 items:
- Technologies used (especially ones matching job description)
- Your specific role/contribution
- Any Achivements
- Complexity

HIGHLIGHTING RULES:
1. Highlight 15-25 items TOTAL across the entire resume
2. If a technology appears in the job description AND user's background, ALWAYS highlight it
3. Highlight complete phrases (2-6 words), not single words
4. Every work experience entry MUST have at least 3 highlights
5. Summary MUST have at least 2 highlights
6. Only use data from the user's actual background - no fabrication

EXAMPLES:
Summary: "Experienced software engineer with [HIGHLIGHT]8+ years[/HIGHLIGHT] specializing in [HIGHLIGHT]full-stack web development[/HIGHLIGHT] and [HIGHLIGHT]cloud-based solutions[/HIGHLIGHT]."

Work Experience: "Developed [HIGHLIGHT]scalable microservices[/HIGHLIGHT] using [HIGHLIGHT]Node.js[/HIGHLIGHT] and [HIGHLIGHT]Docker[/HIGHLIGHT], serving [HIGHLIGHT]over 500K users[/HIGHLIGHT]. [HIGHLIGHT]Led architecture decisions[/HIGHLIGHT] for the platform."

IMPORTANT: Be generous with highlighting. When in doubt, highlight it if it's relevant to the job.`
      : "",
    summary_example:
      generationSettings.summary_format === "bullets"
        ? '["qualification 1", "qualification 2", "qualification 3", "qualification 4", "qualification 5"] (array of atleast 2-3 detailed strings)'
        : '"detailed string (concise, attention-grabbing 2-3 sentences)"',
    work_experience_example:
      generationSettings.work_experience_format === "bullets"
        ? '["responsibility/achievement 1", "technology/tool used 2", "meaningful accomplishment 3"] (array of atleast 5-6 detailed strings, NO fabricated percentages)'
        : '"detailed string (flowing paragraph describing role without fake metrics)"',
    projects_example:
      generationSettings.projects_format === "bullets"
        ? '["key feature/functionality 1", "technology stack used 2", "project outcome 3"] (array of detailed strings, NO fabricated metrics)"'
        : '"detailed string (flowing paragraph about project without fake statistics)"',
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

    const nameParts = resumeData.personalInfo?.name?.split(" ") || [];
    return {
      first_name: nameParts[0] || "",
      last_name: nameParts.slice(1).join(" ") || "",
      email: resumeData.personalInfo?.email || "",
      phone: resumeData.personalInfo?.phone || "",
      location: resumeData.personalInfo?.location || "",
      address: resumeData.personalInfo?.address || "",
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
  return {
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    address: [profile?.address_1, profile?.address_2, profile?.address_3]
      .filter(Boolean)
      .join(", "),
    skills: skills.join(", "),
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
