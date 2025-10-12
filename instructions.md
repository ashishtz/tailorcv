# AI Resume Builder Application Specification

## Overview
This is a full-fledged **AI-powered Resume Builder** application built using:

- **Next.js**: Full-stack framework for both frontend and backend
- **Supabase**: Handles authentication, database storage, and Row-Level Security (RLS)
- **OpenRouter API**: Provides AI-assisted resume content refinement and generation
- **Tailwind CSS**: Utility-first styling framework
- **shadcn/ui**: Component library for building accessible UI components

---

## User Journey & Workflow

### 1. Authentication
- Users can **register** or **log in** using Supabase Auth.
- Post-login behavior:
  - New users are redirected to **multi-step onboarding**.
  - Returning users are taken to their **dashboard**.

### 2. Onboarding Workflow
All data is stored in Supabase during each step.

#### Step 1: Personal Information
- First Name
- Last Name
- Email Address
- Phone Number
- Birthday
- Location
- Address (Optional: Address1, Address2, Address3)
- Postal Code (Optional)

#### Step 2: Skills Selection
- Select from a skills database
- If the skill does not exist, add it instantly to the database

#### Step 3: Work Experience
- Company Name
- Position Title
- Location
- Job Type: Part-Time, Full-Time, Contract
- Duration: Start (MMM-YYYY) to End (MMM-YYYY) or Currently working
- Description
- Can add **multiple experiences**

#### Step 4: Education
- College/University Name
- Duration: Start to End (MMM-YYYY)
- Degree: Bachelor’s or Master’s
- Field of Study: (e.g., Computer Science, Engineering)

#### Step 5: Projects & External Experience
- Project Name
- Role/Title
- Description
- Link (Optional)

---

### 3. Dashboard
- Shown after onboarding
- Simple **welcome message**
- Sidebar links:
  - **Dashboard**
  - **Documents** (generated resumes)
  - **Profile** (update user info & password)

---

### 4. Documents Section
- List of previously generated resumes
- Button to **Generate New Resume**

#### Resume Generation Workflow
- Opens a modal form:
  - Job Title
  - Job Description
  - Resume Mode: Strict or Free
  - Generate Button

- On submission:
  - Pulls user data from Supabase
  - Sends prompt to OpenRouter API:
    - Includes: Job info, User onboarding data, Mode
  - API responds with structured JSON resume data

---

### 5. Resume Templates & Rendering
- 2 to 3 clean, professional, sleek templates
- Filled using structured LLM-generated JSON
- Designed to be printable/downloadable

#### Resume Mode Behavior
- **Strict Mode**:
  - Stays within user-provided data
  - Refines content to match job requirements

- **Free Mode**:
  - Looser boundaries
  - Modifies/enhances content based on job needs

---

## OpenRouter LLM Integration

**Inputs:**
- Job Title
- Job Description
- User Data from Supabase
- Mode: `strict` or `free`

**Output:**
```json
{
  "contact": {},
  "skills": [],
  "workExperience": [],
  "education": [],
  "projects": []
}
```

- Used to populate resume templates
- Generation must respect the selected mode's logic

---

## UI & Component Strategy

- **Use Tailwind CSS** for styling
- **shadcn/ui** for ready-to-use accessible UI components
- **Enforce max 500 lines per file**
  - Divide UI into reusable chunks (form groups, resume sections, cards)
  - Avoid deeply nested components
  - Centralize repeated layouts or logic in `/components`

## More info

- Feel free to install any necessary npm libraries that are required into the project.
- Always follow eslint guidelines this project setup has.
- Make sure there are no console errors/warnings are there while installing any package/library
- Strictly not allowed to use `--legacy-peer-deps` to install npm libraries.