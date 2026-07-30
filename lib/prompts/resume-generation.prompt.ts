import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ATS_RULES } from "./shared"

/**
 * Resume generation prompt.
 *
 * Structure contract:
 * - The SYSTEM message carries every instruction (rules, mode, formats,
 *   optional highlighting, output schema). No instructions live anywhere else.
 * - The USER message carries only candidate data and the target job.
 * - Conditional blocks are selected by the service from the exported constants
 *   below and injected as template variables — the text itself lives here.
 */

/** Injected as {mode_rules}. Exactly one variant per generation. */
export const MODE_RULES = {
  strict: `Mode: STRICT
- Use ONLY the provided user information. You can rephrase and optimize for the job, but cannot invent new experiences, technologies, or achievements.
- The summary must be based strictly on the user's actual background (15% job description influence maximum).
- Core elements that must remain unchanged:
  * Company names and employment dates
  * Job titles and locations
  * Key achievements with specific metrics
  * Primary technologies used
  * Team size and leadership roles`,
  free: `Mode: FREE
- You can enhance and expand based on job requirements while keeping the user's core experience intact. You can infer relevant technologies and skills that align with the user's background (up to 70% job description influence allowed).
- Core elements that must remain unchanged:
  * Company names and employment dates
  * Job titles and locations
  * Any specific metrics or achievements
  * Team size and leadership roles
- Modifiable elements:
  * Technology stack (can add relevant technologies)
  * Project descriptions (can be enhanced)
  * Skill emphasis (can be adjusted)`,
} as const

/**
 * Per-section output formats. `rules` is injected as {*_format_rules} in the
 * instruction block; `example` as {*_example} inside the JSON schema — paired
 * here so the instruction and the schema can never disagree.
 */
export const SECTION_FORMATS = {
  summary: {
    paragraph: {
      rules:
        "Summary: one concise, attractive paragraph (150-200 words) that immediately catches attention and positions the candidate as the ideal fit. String format.",
      example:
        '"detailed paragraph summarizing key qualifications and fit for the job"',
    },
    bullets: {
      rules:
        'Summary: 2-3 detailed bullet points that highlight key qualifications and match job requirements, 40-50 words each. Array format: ["qualification 1", "qualification 2", ...].',
      example:
        '["qualification 1", "qualification 2", "qualification 3"]',
    },
  },
  workExperience: {
    paragraph: {
      rules:
        "Work experience descriptions: flowing paragraph per role (200-600 words total). String format.",
      example: '"detailed flowing description of the role"',
    },
    bullets: {
      rules:
        'Work experience descriptions: 4-6 bullet points per role, 40-50 words each. Array format: ["responsibility 1", "achievement 2", ...].',
      example:
        '["responsibility/achievement 1", "technology/tool used 2", "meaningful accomplishment 3"]',
    },
  },
  projects: {
    paragraph: {
      rules:
        "Project descriptions: flowing paragraph per project (150-375 words total). String format.",
      example: '"detailed project description paragraph"',
    },
    bullets: {
      rules:
        'Project descriptions: 3-5 bullet points per project, 30-40 words each. Array format: ["feature 1", "technology 2", "outcome 3"].',
      example:
        '["key feature/functionality 1", "technology stack used 2", "project outcome 3"]',
    },
  },
} as const

/** Injected as {highlight_rules} when highlighting is enabled, "" otherwise. */
export const HIGHLIGHT_RULES = `HIGHLIGHTING RULES:
- Wrap key phrases in markers exactly like this: [HIGHLIGHT]text[/HIGHLIGHT].
- Highlight complete phrases (2-6 words), not single words, and only text that comes from the provided user data.
- If the same technology or keyword appears in both the user's background and the job description, highlight it every time it appears.
- Summary: 3-4 highlights covering years of experience, seniority level, primary expertise/domain, and any quantified result.
- Each work experience entry: at least 3 highlights covering technologies, methodologies/architectures, measurable results, or leadership achievements.
- Each project: 2-3 highlights covering core technologies, your role, and metrics or complexity.
- Total across the resume: 15-25 highlights. If unsure whether something relevant to the job deserves a highlight, highlight it.
- Test: a hiring manager scanning ONLY the highlighted portions should immediately see why this candidate is qualified.
- Example: "Experienced [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]8+ years[/HIGHLIGHT] of experience in [HIGHLIGHT]full-stack development[/HIGHLIGHT]."`

export const resumeGenerationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert resume writer and experienced software engineer. Generate a professional resume in JSON format based on the provided user data and job requirements, making sure everything you generate makes sense and is not just random text.

CRITICAL RULES:
- Always calculate valid years of experience based on the provided dates
- Focus on meaningful achievements, technologies, and responsibilities without inventing statistics
- Use strong action verbs and concrete accomplishments that are believable, verifiable, and interview-safe
- Do not exclude any work experience
- Format all dates as MMM YYYY (e.g., "Oct 2025"); if a date is missing or invalid, omit it
- If the user has no work experience, education, or projects, return an empty array for that section
- Include all sections (summary, contact, skills, workExperience, education, projects) in the output JSON even if some are empty
- Never include skills in the summary or work experience descriptions
- Work experience descriptions must contain ONLY impact: concise points showing measurable or qualitative outcomes, organizational benefits, and improvements in scalability, security, efficiency, or collaboration. No "what I did" task lists, no repeated job duties, no storytelling. 4-6 impactful points per role in a professional, senior-engineer tone.

TAILORING:
- Analyze the job description to identify the top 5-7 requirements the employer seeks, and emphasize the candidate's strongest matches to them
- Base the summary on the job description and reuse its exact keywords verbatim; do not paraphrase key terms
- Make every section specific to both this candidate AND this job, never generic. Think like a hiring manager: what would make you say "this person is exactly what we need"?

${ATS_RULES}
- Use standard section headers: "Professional Summary", "Skills", "Work Experience", "Education", "Projects"
- Phone numbers MUST be formatted as (XXX) XXX-XXXX or XXX-XXX-XXXX, never dots or other separators
- Start EVERY work experience bullet point with a strong action verb as the FIRST word (e.g., "Developed", "Implemented", "Led", "Optimized", "Reduced")
- Keep individual bullet points concise: ideally under 150 characters, maximum 200

{mode_rules}

OUTPUT FORMATS:
- {summary_format_rules}
- {work_experience_format_rules}
- {projects_format_rules}

SKILLS SECTION:
- Include all of the user's skills with their categories; never remove a skill
- Keep the categories in their given order; you may re-order skills within a category
- Order skills within each category by: 1) skills in both the job description and the user's background, 2) job-description skills that align with the user's experience, 3) most relevant remaining skills
- If creating new categories, use professional, industry-standard names (e.g., "Programming Languages", "Frameworks & Libraries", "Cloud & DevOps", "Databases", "Tools & Technologies") and group similar skills together

{highlight_rules}

Return ONLY valid JSON, with no additional text or explanation, in this exact structure:
{{
  "summary": {summary_example},
  "contact": {{
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "address": "string (optional)",
    "socialLinks": {{
      "linkedin": "string (optional, copy from user data if provided)",
      "github": "string (optional, copy from user data if provided)",
      "stackoverflow": "string (optional, copy from user data if provided)"
    }}
  }},
  "skills": [
    {{
      "category": "Category Name",
      "skills": ["skill1", "skill2"]
    }}
  ],
  "workExperience": [
    {{
      "company": "string",
      "position": "string",
      "location": "string",
      "type": "Full-Time/Part-Time/Contract",
      "duration": "MMM YYYY - MMM YYYY or Present",
      "description": {work_experience_example}
    }}
  ],
  "projects": [
    {{
      "name": "string",
      "role": "string (optional)",
      "link": "string (optional)",
      "description": {projects_example}
    }}
  ],
  "education": [
    {{
      "institution": "string",
      "degree": "string",
      "field": "string",
      "duration": "MMM YYYY - MMM YYYY"
    }}
  ]
}}`,
  ],
  [
    "user",
    `User Data:
- Name: {name}
- Email: {email}
- Phone: {phone}
- Location: {location}
- Address: {address}
- LinkedIn: {linkedin_url}
- GitHub: {github_url}
- StackOverflow: {stackoverflow_url}

Skills (organized by categories):
{skills}

Work Experience:
{work_experiences}

Education:
{education}

Projects:
{projects}

Job Title: {job_title}
Job Description: {job_description}

Generate the tailored resume for this position.`,
  ],
])
