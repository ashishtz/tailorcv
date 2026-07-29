# AI Resume Builder

A full-featured AI-powered resume builder application built with Next.js, Supabase, and OpenRouter API.

## Features

- 🔐 **User Authentication** - Secure login/registration with Supabase Auth
- 📝 **Multi-step Onboarding** - Collect personal info, skills, experience, education, and projects
- 🤖 **AI Resume Generation** - Generate tailored resumes using OpenRouter API
- 📄 **Multiple Templates** - Choose from Classic, Modern, and Minimal resume templates
- 💾 **Data Persistence** - Store all user data securely in Supabase
- 🖨️ **Print/Download** - Print or download resumes as PDF
- 👤 **Profile Management** - Update personal information and change passwords
- 🔒 **Row-Level Security** - Secure data access with Supabase RLS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenRouter API
- **UI Components**: Lucide React icons
- **Styling**: Tailwind CSS

## Setup Instructions

**Prerequisites:** Node.js 24+ (see `.nvmrc` — run `nvm use`).

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resume-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Apply the migrations in `supabase/migrations/` (e.g. `supabase db push`)

### 4. Set up OpenRouter

1. Create an account at [openrouter.ai](https://openrouter.ai)
2. Get your API key from the dashboard

### 5. Environment Variables

Update `.env.local` with your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── onboarding/        # Onboarding flow
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── onboarding/        # Onboarding step components
│   └── resume-templates/  # Resume template components
├── lib/                   # Utility functions and configurations
│   ├── contexts/          # React contexts
│   ├── supabase/          # Supabase client configurations
│   └── types/             # TypeScript type definitions
└── supabase/              # Database schema and migrations
```

## Database Schema

The application uses the following main tables:

- `profiles` - User profile information
- `skills` - Available skills database
- `user_skills` - User-selected skills
- `work_experiences` - Work experience entries
- `education` - Education entries
- `projects` - Project entries
- `resumes` - Generated resumes with AI data

## Resume Generation Modes

- **Strict Mode**: Uses only the information provided during onboarding, refined to match job requirements
- **Free Mode**: Allows AI to enhance and modify content based on job needs

## Resume Templates

1. **Classic**: Traditional professional format
2. **Modern**: Contemporary design with color accents
3. **Minimal**: Clean, minimalist layout

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
