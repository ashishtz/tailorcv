import { ChatPromptTemplate } from "@langchain/core/prompts"

export const resumeGenerationUserPrompt = ChatPromptTemplate.fromMessages([
  ["user", `User Data:
- Name: {first_name} {last_name}
- Email: {email}
- Phone: {phone}
- Location: {location}
- Address: {address}

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

Generate a tailored resume that strategically highlights the most relevant experience and skills for this position.

CRITICAL REQUIREMENTS:
1. INTELLIGENT CONTENT ANALYSIS:
   - Carefully analyze the job description to identify the TOP 5-7 requirements, skills, or qualifications the employer seeks
   - Review the candidate's background to find the STRONGEST matches to those requirements
   - Use highlighting markers to emphasize these critical connection points

2. PROFESSIONAL SUMMARY STRATEGY:
   - The summary is CRUCIAL - it must immediately grab attention
   - Highlight 2-4 key qualifications that directly match the job requirements
   - Make it specific to both this candidate AND this job, never generic
   - Example: "Software engineer with [HIGHLIGHT]8+ years of experience[/HIGHLIGHT] specializing in [HIGHLIGHT]scalable cloud architecture[/HIGHLIGHT]"

3. WORK EXPERIENCE HIGHLIGHTING:
   - For EACH work experience entry, identify 3-7 most relevant accomplishments or responsibilities
   - Highlight phrases that show direct relevance to the target job
   - Prioritize highlighting: years of experience, specific technologies matching the job, leadership indicators, quantifiable achievements
   - Ensure highlights create a clear visual path showing "this person can do this job"

4. AUTHENTICITY RULES:
   - Only highlight achievements and details that are EXPLICITLY provided in the user data
   - Focus on real technologies, actual responsibilities, and genuine accomplishments
   - Everything must be interview-safe and verifiable

5. HIGHLIGHTING EFFECTIVENESS:
   - If a hiring manager scans ONLY the highlighted portions, they should immediately see why this candidate is qualified
   - Highlights should create a compelling narrative: relevant experience → matching skills → proven impact
   - Balance: don't over-highlight (reduces impact) or under-highlight (misses opportunities)

Think like a hiring manager: What would make you say "This person is exactly what we need"? Highlight those elements.`]
])
