# Claude Code Development Guidelines

## 🧠 Persistent Memory System — READ FIRST, ALWAYS

**MANDATORY for every Claude session, before any other work:**

1. **Read** `.claude/memory/STATUS.md` — current objectives, what's done / in progress / backlog, constraints.
2. **Read** `.claude/memory/WORKLOG.md` — detailed history of past sessions.
3. **Read** `.claude/memory/DECISIONS.md` — settled technical decisions (do not reverse without user approval).
4. Also read any feature docs referenced there (e.g. `.claude/memory/FRONTEND_AUDIT.md`, `.claude/memory/DESIGN_SYSTEM.md`).

**MANDATORY before ending any work chunk / session:**

- Update `STATUS.md` (move items between Done / In Progress / Backlog; refresh "Last updated").
- Append a detailed entry to `WORKLOG.md` (what changed, file paths, findings, next steps).
- Record any new significant decision in `DECISIONS.md`.
- Commit and push the memory updates together with (or right after) the code they describe.

This system is how work stays on track across sessions — treat it as part of the deliverable, not optional bookkeeping.

## Code Quality Standards

### TypeScript and ESLint Compliance

**IMPORTANT**: All code must be free from TypeScript and ESLint errors and warnings. This applies to:
- Newly written code
- Modified existing code
- Any code touched during development

### Required Actions

1. **Always run linting and type checking** after making changes:
   ```bash
   npm run lint
   npm run typecheck  # if available
   ```

2. **Fix all errors and warnings** - do not ignore them:
   - TypeScript errors must be properly resolved with correct types
   - ESLint warnings should be addressed, not suppressed
   - React Hook dependency warnings need proper resolution

### Professional Code Standards

1. **Never use `any` type** in TypeScript:
   - Use proper type definitions
   - Use `unknown` if type is truly unknown, then narrow it down
   - Create interfaces or type aliases for complex objects

2. **Handle React Hook dependencies properly**:
   - Include all dependencies in the dependency array
   - Use eslint-disable comment ONLY when absolutely necessary and justified
   - Prefer useCallback/useMemo when appropriate

3. **Fix HTML entity escaping**:
   - Use proper HTML entities for quotes and apostrophes
   - `'` should be `&apos;` or `&rsquo;`
   - `"` should be `&quot;`, `&ldquo;`, or `&rdquo;`

### Example Fixes

```typescript
// BAD - using any
onChange={(e) => setFormData({ ...formData, degree: e.target.value as any })}

// GOOD - proper typing
onChange={(e) => setFormData({ ...formData, degree: e.target.value as "Bachelor's" | "Master's" | null })}
```

```typescript
// BAD - missing dependency
useEffect(() => {
  loadData()
}, [])

// GOOD - dependency included with eslint comment when justified and also write a comment explaining why it was needed
useEffect(() => {
  loadData()
}, []) // eslint-disable-line react-hooks/exhaustive-deps
```

## Code Reusability Principles

### Always Think Reusability First

**IMPORTANT**: Before implementing any new feature or component:

1. **Search the existing codebase** for similar functionality
2. **Consider refactoring existing components** instead of creating new ones
3. **Make components reusable** with minimal modifications when possible

### Reusability Guidelines

1. **Before creating new components**:
   - Check if an existing component can be extended or modified
   - Look for similar patterns in the codebase
   - Consider if a slight modification would make an existing component work

2. **When modifying components**:
   - Think about making them more generic and reusable
   - Add props for customization rather than hardcoding values
   - Extract common logic into hooks or utilities

3. **Prefer composition over duplication**:
   - Use component composition to build complex UIs
   - Extract shared styles into utility classes or styled components
   - Create custom hooks for shared logic

### Example

```typescript
// AVOID - Creating duplicate components
// NewDocumentCard.tsx (unnecessary duplication)
// ExistingDocumentCard.tsx (already exists)

// PREFER - Extend existing component
// DocumentCard.tsx with a 'variant' prop
interface DocumentCardProps {
  variant?: 'default' | 'compact' | 'detailed'
  // ... other props
}
```

## Development Workflow

1. **Analyze existing code** for reusability opportunities
2. Make code changes (preferring reusability)
3. Run `npm run lint` to check for issues
4. Fix all reported issues
5. Test the application
6. Commit only when code is clean and functional

## AI Integration Standards

### OpenRouter API - STRICT REQUIREMENT

**CRITICAL**: This project uses OpenRouter API exclusively. NEVER use OpenAI API directly.

1. **Always use OpenRouter**:
   - Base URL: `https://openrouter.ai/api/v1`
   - API Key: `process.env.OPENROUTER_API_KEY`
   - Model format: `openai/gpt-3.5-turbo`, `openai/gpt-4`, or other OpenRouter-supported models

2. **Check for OpenAI references**:
   - Before any AI-related changes, search codebase for `openai.com` or `OPENAI_API_KEY`
   - Replace immediately with OpenRouter equivalents
   - Never use `https://api.openai.com` - always use `https://openrouter.ai/api/v1`

3. **LangChain Integration**:
   - Use `ChatOpenAI` from `@langchain/openai` package
   - Configure with OpenRouter baseURL and required headers:
     ```typescript
     new ChatOpenAI(
       {
         model: 'openai/gpt-3.5-turbo',
         temperature: 0.7,
         apiKey: process.env.OPENROUTER_API_KEY,
       },
       {
         baseURL: 'https://openrouter.ai/api/v1',
         defaultHeaders: {
           'HTTP-Referer': process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
           'X-Title': 'Resume Builder',
         },
       }
     )
     ```
   - **Always check LangChain documentation first** - never assume implementation details
   - When unsure, search LangChain docs at js.langchain.com before coding

### Prompt Management - STRICT REQUIREMENT

**IMPORTANT**: All AI prompts MUST be in separate files under `lib/prompts/` directory.

1. **One prompt per file**:
   - Each prompt gets its own `.prompt.ts` file
   - Use LangChain's `PromptTemplate` or `ChatPromptTemplate`
   - Support dynamic variables using template syntax `{variable_name}`
   - Export as named exports with descriptive names

2. **Naming convention**:
   - File: `{feature}-{purpose}.prompt.ts` (e.g., `work-experience-enhancement.prompt.ts`)
   - Export: `{feature}{Purpose}Prompt` (e.g., `workExperienceEnhancementPrompt`)

3. **Example structure**:
   ```typescript
   import { ChatPromptTemplate } from "@langchain/core/prompts"

   export const workExperienceEnhancementPrompt = ChatPromptTemplate.fromMessages([
     ["system", `You are a professional resume writer...`],
     ["user", "{text}"]
   ])
   ```

4. **Never ignore this rule**:
   - Prompts MUST NOT be inline strings in API routes or services
   - All prompts MUST be in separate files in `lib/prompts/`
   - Always use LangChain prompt templates for dynamic variable injection

### Code Organization

1. **Separation of concerns**:
   - API routes: Request validation and response handling only
   - Services (`lib/services/`): Business logic and AI interactions
   - Repositories (`lib/repositories/`): Database operations
   - Prompts (`lib/prompts/`): All AI prompt templates

2. **Never mix concerns**:
   - No business logic in API routes
   - No database queries in services (use repositories)
   - No inline prompts anywhere (use prompt files)

## Note

These standards ensure professional, maintainable code. Always fix issues properly rather than using quick workarounds or suppressions.