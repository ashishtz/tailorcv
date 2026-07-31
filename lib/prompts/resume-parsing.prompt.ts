import { ChatPromptTemplate } from "@langchain/core/prompts"

/**
 * Resume parsing prompt. System message = task + schema + rules;
 * user message = the raw resume text, nothing else.
 */
export const resumeParsingPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a resume parser. Parse the resume text provided by the user and extract structured data in JSON format. Return ONLY valid JSON without any markdown formatting or explanations.

Extract all relevant information. If a field is not available, use null or an empty array as appropriate.

The JSON must have this exact structure:
{{
  "contact": {{
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State/Country",
    "address": "full address if available"
  }},
  "summary": "Professional summary paragraph",
  "skills": ["skill1", "skill2", "skill3"],
  "workExperience": [
    {{
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "type": "Full-Time/Part-Time/Contract",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "Job description and accomplishments"
    }}
  ],
  "education": [
    {{
      "institution": "University Name",
      "degree": "Bachelor's/Master's/PhD",
      "field": "Field of Study",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM"
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "role": "Your Role",
      "description": "Project description",
      "link": "project link if available"
    }}
  ]
}}`,
  ],
  ["user", "{resume_text}"],
])
