export const dummyResumeData = {
  personal_info: {
    full_name: 'John Anderson',
    email: 'john.anderson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnanderson',
    portfolio: 'johnanderson.dev'
  },
  summary: 'Results-driven Full-Stack Software Engineer with 7+ years of experience designing and developing scalable web applications and cloud-based solutions. Proven expertise in leading cross-functional teams, architecting microservices, and delivering high-impact products that serve millions of users. Strong background in modern JavaScript frameworks including React and Next.js, backend development with Node.js and Python, and cloud infrastructure on AWS. Successfully led migration from monolithic architecture to microservices, improving system performance by 40% and reducing deployment time by 60%. Experienced in building RESTful and GraphQL APIs, implementing real-time features with WebSockets, and optimizing database performance across PostgreSQL and MongoDB. Passionate about writing clean, maintainable code and following best practices including comprehensive testing, CI/CD pipelines, and code reviews. Demonstrated ability to mentor junior developers, collaborate effectively with product and design teams, and deliver projects on time in fast-paced agile environments. Committed to continuous learning and staying current with emerging technologies and industry trends.',
  work_experience: [
    {
      company: 'Tech Solutions Inc',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      start_date: '2021-01',
      end_date: null,
      current: true,
      description: [
        'Led development of microservices architecture serving 1M+ active users with 99.9% uptime',
        'Architected and implemented real-time data pipeline processing 100K+ events per second using Kafka and Redis',
        'Improved application performance by 40% through code optimization and database query tuning',
        'Mentored team of 5 junior developers, conducting code reviews and pair programming sessions',
        'Spearheaded migration from monolith to microservices, reducing deployment time by 60%'
      ]
    },
    {
      company: 'StartUp Labs',
      position: 'Software Engineer',
      location: 'Remote',
      start_date: '2019-06',
      end_date: '2020-12',
      current: false,
      description: [
        'Built and deployed RESTful APIs using Node.js, Express, and PostgreSQL serving 50K+ daily requests',
        'Implemented responsive UI components with React and TypeScript, improving user engagement by 35%',
        'Reduced API response time by 60% through strategic caching implementation with Redis',
        'Collaborated with product team to define technical requirements and deliver features on time',
        'Implemented comprehensive test coverage achieving 85% code coverage with Jest and Cypress'
      ]
    },
    {
      company: 'Digital Innovations Corp',
      position: 'Junior Developer',
      location: 'Berkeley, CA',
      start_date: '2018-01',
      end_date: '2019-05',
      current: false,
      description: [
        'Developed and maintained client-facing web applications using React, HTML5, and CSS3',
        'Contributed to backend development with Python Django framework and MySQL database',
        'Participated in agile development process including sprint planning and daily standups',
        'Fixed 100+ bugs and implemented 20+ new features based on user feedback',
        'Collaborated with UX designers to implement pixel-perfect responsive designs'
      ]
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: "Bachelor's",
      field_of_study: 'Computer Science',
      location: 'Berkeley, CA',
      graduation_date: '2018-05',
      gpa: '3.8'
    },
    {
      institution: 'Stanford University',
      degree: 'Certificate',
      field_of_study: 'Machine Learning Specialization',
      location: 'Online',
      graduation_date: '2020-08',
      gpa: 'N/A'
    }
  ],
  skills: {
    technical: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
      'Next.js',
      'Express'
    ],
    soft: ['Team Leadership', 'Problem Solving', 'Communication', 'Agile']
  },
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and inventory management',
      technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      link: 'github.com/john/ecommerce',
      highlights: [
        'Processed $500K+ in transactions with zero downtime',
        'Implemented real-time inventory management with WebSocket integration',
        'Built admin dashboard for order tracking and analytics',
        'Integrated Stripe payment gateway with subscription management'
      ]
    },
    {
      name: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates',
      technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      link: 'github.com/john/taskmanager',
      highlights: [
        'Supports 10K+ concurrent users with real-time collaboration features',
        'Implemented drag-and-drop Kanban board with React Beautiful DnD',
        'Built notification system using WebSockets and push notifications',
        'Achieved 95+ Lighthouse performance score'
      ]
    },
    {
      name: 'AI Code Review Assistant',
      description: 'Machine learning powered tool for automated code review suggestions',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
      link: 'github.com/john/ai-reviewer',
      highlights: [
        'Trained model on 100K+ code reviews achieving 82% accuracy',
        'Reduced code review time by 30% for development teams',
        'Deployed using Docker and Kubernetes on AWS EKS',
        'Integrated with GitHub Actions for automated PR analysis'
      ]
    },
    {
      name: 'Real-Time Analytics Dashboard',
      description: 'Data visualization platform for business intelligence and reporting',
      technologies: ['React', 'D3.js', 'GraphQL', 'Redis'],
      link: 'github.com/john/analytics',
      highlights: [
        'Visualizes 50M+ data points with interactive charts and graphs',
        'Implemented real-time data streaming using WebSockets',
        'Reduced data query time by 70% with optimized caching layer',
        'Built custom charting components with D3.js for complex visualizations'
      ]
    },
    {
      name: 'Social Media Automation Tool',
      description: 'Multi-platform scheduling and analytics tool for content creators',
      technologies: ['Node.js', 'React', 'AWS Lambda', 'DynamoDB'],
      link: 'github.com/john/social-automation',
      highlights: [
        'Manages 100K+ scheduled posts across Twitter, LinkedIn, and Instagram',
        'Implemented OAuth integration with multiple social media platforms',
        'Built serverless architecture using AWS Lambda for cost efficiency',
        'Created analytics engine tracking engagement across 5 social platforms'
      ]
    },
    {
      name: 'Developer Portfolio Generator',
      description: 'CLI tool to auto-generate developer portfolios from GitHub data',
      technologies: ['Node.js', 'GitHub API', 'Handlebars', 'CLI'],
      link: 'github.com/john/portfolio-gen',
      highlights: [
        'Downloaded 50K+ times with 2K+ GitHub stars',
        'Fetches repository data and generates responsive portfolio sites',
        'Supports multiple themes and customization options',
        'Built with zero dependencies for lightweight distribution'
      ]
    },
    {
      name: 'Microservices Monitoring Platform',
      description: 'APM tool for monitoring distributed systems and microservices',
      technologies: ['Go', 'Prometheus', 'Grafana', 'Kubernetes'],
      link: 'github.com/john/apm-platform',
      highlights: [
        'Monitors 200+ microservices with sub-second latency tracking',
        'Implemented distributed tracing across service boundaries',
        'Built custom Grafana dashboards for service health visualization',
        'Integrated alerting system with PagerDuty and Slack'
      ]
    }
  ]
}
