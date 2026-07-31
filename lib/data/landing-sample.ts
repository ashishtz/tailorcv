import type { GeneratedResumeData } from '@/lib/utils/normalize-resume'

/** Compact sample resume rendered by the landing-page template thumbnails. */
export const landingSampleResume: GeneratedResumeData = {
  contact: {
    name: 'Jordan Reyes',
    email: 'jordan.reyes@example.com',
    phone: '(555) 010-2938',
    location: 'Austin, TX',
  },
  summary:
    'Product-minded software engineer with 7 years of experience shipping data-heavy web applications. Led three consumer launches end to end and cut page-load times by 40%.',
  skills: [
    { category: 'Languages', skills: ['TypeScript', 'Python', 'SQL'] },
    { category: 'Frameworks', skills: ['React', 'Next.js', 'FastAPI'] },
    { category: 'Practices', skills: ['CI/CD', 'A/B testing', 'Accessibility'] },
  ],
  workExperience: [
    {
      company: 'Northwind Labs',
      position: 'Senior Software Engineer',
      location: 'Austin, TX',
      type: 'Full-Time',
      duration: 'Mar 2021 - Present',
      description: [
        'Led a team of four rebuilding the checkout flow, lifting conversion 12%',
        'Cut p95 page-load time 40% via route-level code splitting and caching',
      ],
    },
    {
      company: 'Brightline Studio',
      position: 'Software Engineer',
      location: 'Remote',
      type: 'Full-Time',
      duration: 'Jun 2018 - Feb 2021',
      description: [
        'Built the design-system component library used across 5 products',
        'Introduced end-to-end testing, reducing regression bugs 30%',
      ],
    },
  ],
  education: [
    {
      institution: 'University of Texas at Austin',
      degree: "Bachelor's",
      field: 'Computer Science',
      duration: '2014 - 2018',
    },
  ],
  projects: [
    {
      name: 'OpenShelf',
      role: 'Creator',
      description: 'Open-source reading tracker with 2k GitHub stars.',
      link: 'https://example.com',
    },
  ],
}
