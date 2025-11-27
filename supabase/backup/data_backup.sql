WARNING:  database "postgres" has a collation version mismatch
DETAIL:  The database was created using collation version 153.120, but the operating system provides version 153.128.
HINT:  Rebuild all objects in this database that use the default collation and run ALTER DATABASE postgres REFRESH COLLATION VERSION, or build PostgreSQL with the right library version.
--
-- PostgreSQL database dump
--

\restrict tDpVleWO8YEV1kg9IQv59fyRkv7t9lWP1lU07uAYBKOebzqdeGdQdfSgmLil0LZ

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.profiles VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'Ashish', 'Patel', 'ashishtzdev@gmail.com', '2268082350', '1995-05-01', 'Kitchener, ON', '', '', '', '', '2025-10-27 22:31:01.644047+00', '2025-10-27 22:31:01.644047+00');


--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.education VALUES ('9d2509c8-fb98-4b4b-9ce2-5935b80ccdbb', '72e83701-5723-428c-b153-0a957cad5e78', 'KSV University', '2015-03-01', '2017-05-09', 'Master''s', 'Computer Science', '2025-10-29 02:50:02.258162+00', '2025-10-29 02:50:02.258162+00');


--
-- Data for Name: imported_resumes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.projects VALUES ('49ac38ee-6305-4d3b-93f2-f4dd9c6b9d3f', '72e83701-5723-428c-b153-0a957cad5e78', 'PlaySpace', 'Senior Software Engineer', 'Collaborated with the engineering team to implement modular, scalable backend and integration layers for the PlaySpace Next.js agentic application, enabling seamless partner platform integration. Designed and optimized real-time workflows and data pipelines, contributed to secure multi-tenant infrastructure on AWS EKS with Terraform, and implemented monitoring with CloudWatch. Guided peers on best practices for CI/CD, modular architecture, and secure coding, improving team efficiency and system reliability.', '', '2025-10-29 03:00:17.656255+00', '2025-10-29 03:00:17.656255+00');
INSERT INTO public.projects VALUES ('077c51c4-96b0-41b8-a846-6c45fe35eb62', '72e83701-5723-428c-b153-0a957cad5e78', 'Devdocs AI', 'Contract Software Engineer', 'Collaborated with the engineering team to develop and optimize the AI-powered DevDocs platform, enabling training of AI agents on user-connected resources and delivering context-aware responses via ChatGPT, Claude, and other AI services. Built and maintained resource ingestion pipelines, automated syncing of multiple knowledge sources, and vectorized storage to provide AI agents with structured context. Contributed to SDKs and reusable components for embedding AI workflows, while mentoring teammates on best practices for scalable, secure, and maintainable systems.', '', '2025-10-29 03:01:41.127502+00', '2025-10-29 03:01:41.127502+00');
INSERT INTO public.projects VALUES ('85a22c2f-3437-4a4e-8f38-19e457e3a7f7', '72e83701-5723-428c-b153-0a957cad5e78', 'LearnOtter', 'Project Lead & Full Stack engineer', 'Led the development of Learnotter, an online collaborative learning platform, as Senior Full Stack Developer, guiding the team in designing a dynamic frontend using React, Redux, and Gatsby. Architected and implemented real-time communication features with Express.js and Socket.IO to enable seamless collaboration among users. Oversaw secure and efficient data management using MySQL and MinIO, and led the deployment and scaling strategy with Docker and AWS EC2. Configured Nginx for optimized content delivery and worked closely with the team to enforce best practices for modular, maintainable, and high-performance code across the platform.', '', '2025-10-29 03:08:18.580838+00', '2025-10-29 03:08:18.580838+00');
INSERT INTO public.projects VALUES ('51f6c359-362e-445d-ac10-0c919dc726f6', '72e83701-5723-428c-b153-0a957cad5e78', 'SportsJaw', 'Senior Software Engineer', 'Contributed as a Full Stack Developer to SportsJaw, a web application delivering predictive insights for sports bettors. Developed and optimized frontend features using React and Apollo Client, integrating with Hasura-managed GraphQL APIs and leveraging GraphQL Code Generator to produce reusable hooks for consistent and efficient data fetching. Collaborated with cross-functional teams using Agile methodologies to iteratively design, develop, and deliver the platform, ensuring a seamless, responsive, and maintainable user experience.', '', '2025-10-29 03:10:34.996192+00', '2025-10-29 03:10:34.996192+00');


--
-- Data for Name: resumes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.resumes VALUES ('4afb4ef5-abdc-49ce-a2aa-eea96306e89a', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer - Full Stack', 'Why we’re looking for you

We are looking for a mission-driven senior engineer who is passionate about their craft and committed to building incredible products for our customers.


This role is 100% remote and can be based anywhere in the United States or Canada. For San Francisco-based candidates: we have a new HQ in the Presidio for optional in-person collaboration opportunities!


Our Tech Stack:

Frontend: [React, Next.js, Vue]
Backend: [Node.js, Mongo]
Typescript everywhere


💥 The impact you will have

Build new products and features 0 to 1
Take ownership of projects from conception all the way to shipping, ensuring modular, maintainable, and high-quality code
Deliver value to our end users across our entire system while considering performance, scale, security, and maintainability
Shape our product direction by talking to users and collaborating with other teammates in feature brainstorms/roadmap planning
Provide thoughtful code reviews and technical guidance to peers, helping to improve overall team quality
Help us build a great team — interview candidates, refer great engineers, etc.


✅ What we’re looking for

5+ years of experience building applications
Extensive Typescript experience
Experience scaling with frontend stack (React, Next.js, etc.) and/or our backend stack (Nodejs, Mongo, AWS)
Experience at product-focused startup/scale-up or technology company
High degree of cross-functional collaboration—past colleagues in product, design, and business would speak highly of your teamwork
Dedicated to continuous professional development and possessing a lifelong-learner mindset
Strong sense of ownership and drive, excellent communication, and a proactive approach to identifying and solving problems


🏆 Pay and benefits

The estimated starting base salary range for this role is $190K - $220K depending on level, location and experience, plus a generous pre-IPO equity package
Other benefits include comprehensive health coverage, work from anywhere (remote-first workplace), unlimited PTO - plus extra fun perks!', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["Node.js", "React", "Next.js", "Docker", "ExpressJs", "Typescript", "GraphQL", "AWS Services", "Jest", "PostgreSQL", "MongoDB", "Firebase", "CI/CD Automation", "Scalable Architectures", "Agile Methodologies"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with [HIGHLIGHT]7+ years[/HIGHLIGHT] experience in full stack development", "Expertise in [HIGHLIGHT]Node.js[/HIGHLIGHT], [HIGHLIGHT]React[/HIGHLIGHT], [HIGHLIGHT]Next.js[/HIGHLIGHT], and [HIGHLIGHT]Docker[/HIGHLIGHT]", "Proven track record in [HIGHLIGHT]designing scalable architectures[/HIGHLIGHT] and [HIGHLIGHT]implementing secure authentication systems[/HIGHLIGHT]", "Skilled in [HIGHLIGHT]mentoring teams[/HIGHLIGHT] on best practices and [HIGHLIGHT]CI/CD automation[/HIGHLIGHT]", "[HIGHLIGHT]Passionate[/HIGHLIGHT] about building innovative products and [HIGHLIGHT]collaborating[/HIGHLIGHT] across teams"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": ["Designed and optimized real-time workflows and data pipelines", "Contributed to secure multi-tenant infrastructure on AWS EKS with Terraform"]}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": ["Built and maintained resource ingestion pipelines", "Contributed to SDKs and reusable components for embedding AI workflows"]}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack engineer", "description": ["Led the team in designing a dynamic frontend using React, Redux, and Gatsby", "Oversaw secure data management using MySQL and MinIO"]}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": ["Developed frontend features using React and Apollo Client", "Collaborated with cross-functional teams using Agile methodologies"]}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Designed and developed a modular Next.js application for partner integration", "Implemented secure authentication with Auth0 for SOC 2 and HIPAA compliance", "Developed backend services with Node.js and microservices architecture", "Contributed to DevOps initiatives including deployment on AWS EKS"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Developed resource APIs for user-connected AI agents", "Implemented automated syncing pipelines and vector database storage", "Utilized AI services like ChatGPT and Claude APIs for context-aware responses"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": ["Designed scalable project architectures using React and Angular", "Led the team in building efficient CI/CD pipelines with Jenkins and Docker", "Optimized application performance with MySQL, PostgreSQL, and NoSQL databases"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": ["Motivated developers to follow industry best practices", "Conducted detailed code reviews and pull request reviews", "Managed project timelines efficiently while coordinating with clients"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Applied Agile methodologies in web development projects", "Assisted in maintaining and updating web applications with Laravel and Node.js", "Utilized Git for version control to ensure clean and maintainable code"]}]}', '2025-10-29 03:32:57.50466+00');
INSERT INTO public.resumes VALUES ('44fd4ccc-f841-4aa1-94b0-5577c2149ef3', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer - OWNR', 'Why we’re looking for you

We are looking for a mission-driven senior engineer who is passionate about their craft and committed to building incredible products for our customers.


This role is 100% remote and can be based anywhere in the United States or Canada. For San Francisco-based candidates: we have a new HQ in the Presidio for optional in-person collaboration opportunities!


Our Tech Stack:

Frontend: [React, Next.js, Vue]
Backend: [Node.js, Mongo]
Typescript everywhere


💥 The impact you will have

Build new products and features 0 to 1
Take ownership of projects from conception all the way to shipping, ensuring modular, maintainable, and high-quality code
Deliver value to our end users across our entire system while considering performance, scale, security, and maintainability
Shape our product direction by talking to users and collaborating with other teammates in feature brainstorms/roadmap planning
Provide thoughtful code reviews and technical guidance to peers, helping to improve overall team quality
Help us build a great team — interview candidates, refer great engineers, etc.


✅ What we’re looking for

5+ years of experience building applications
Extensive Typescript experience
Experience scaling with frontend stack (React, Next.js, etc.) and/or our backend stack (Nodejs, Mongo, AWS)
Experience at product-focused startup/scale-up or technology company
High degree of cross-functional collaboration—past colleagues in product, design, and business would speak highly of your teamwork
Dedicated to continuous professional development and possessing a lifelong-learner mindset
Strong sense of ownership and drive, excellent communication, and a proactive approach to identifying and solving problems


🏆 Pay and benefits

The estimated starting base salary range for this role is $190K - $220K depending on level, location and experience, plus a generous pre-IPO equity package
Other benefits include comprehensive health coverage, work from anywhere (remote-first workplace), unlimited PTO - plus extra fun perks!', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": false}', '{"skills": ["Node.js", "React", "Next.js", "Express.js", "Typescript", "AWS Services", "Docker", "GraphQL", "MongoDB", "PostgreSQL", "Jest", "Webpack", "MySQL", "Firebase", "Nginx"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with 8+ years of experience in designing and developing modular applications using Node.js, React, and Next.js", "Extensive expertise in secure authentication, microservices architecture, and DevOps practices, ensuring compliance with industry standards like SOC 2 and HIPAA", "Proven track record of mentoring teams, optimizing data flows, and integrating partner platforms for seamless user experiences", "Skilled in AWS services, CI/CD best practices, and backend development with Node.js, Express, and NestJS", "Passionate about building scalable, maintainable, and high-quality code while driving product innovation and cross-functional collaboration"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": ["Designed and optimized real-time workflows and data pipelines for the Next.js agentic application", "Contributed to secure multi-tenant infrastructure on AWS EKS with Terraform", "Guided team on best practices for CI/CD, modular architecture, and secure coding"]}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": ["Developed resource ingestion pipelines and automated syncing for AI-powered systems", "Built SDKs and reusable components for embedding AI workflows", "Mentored teammates on best practices for scalable, secure, and maintainable systems"]}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack Engineer", "description": ["Led the development of an online collaborative learning platform as Senior Full Stack Developer", "Architected real-time communication features with Express.js and Socket.IO", "Managed deployment and scaling strategy with Docker and AWS EC2"]}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": ["Developed and optimized frontend features using React and Apollo Client", "Integrated with Hasura-managed GraphQL APIs for efficient data fetching", "Collaborated with cross-functional teams to deliver a seamless user experience"]}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Designed and developed a modular Next.js agentic application for seamless partner platform integration", "Implemented secure authentication using Auth0, ensuring compliance with SOC 2 and HIPAA", "Contributed to DevOps initiatives on AWS EKS, Terraform infrastructure provisioning, and CI/CD best practices", "Optimized data flows and storage for sensitive client information, mentoring team members on secure coding"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Designed workflows for training AI agents using user-connected resources at DevDocs.ai", "Developed resource APIs for content syncing and storage, leveraging AI services like ChatGPT", "Authored SDKs and guides for embedding AI chat interfaces, ensuring scalability and reliability", "Collaborated with teams to optimize ingestion processes and maintain secure infrastructure"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": ["Led technical initiatives in scalable project architectures and full stack web application development", "Championed CI/CD pipelines using Jenkins and Docker for automated builds and deployments", "Guided the team in clean code practices, modular architecture, and Git workflows", "Conducted training sessions on advanced development patterns and secure coding practices"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": ["Motivated developers to follow best practices in React, Angular, and Node-based frameworks", "Managed project timelines efficiently, ensuring on-time milestone delivery", "Utilized AWS services for deployment and scalability, integrated Socket.IO for real-time communication", "Conducted detailed code reviews and pull requests to enhance code quality"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Applied Agile methodologies in web development projects using Angular, React, and Node.js", "Maintained and updated web applications with Laravel, MySQL, PostgreSQL, and other databases", "Ensured clean and maintainable code using Git version control", "Consistently delivered high-quality output in HTML, CSS, and JavaScript"]}]}', '2025-10-29 03:40:21.430186+00');
INSERT INTO public.resumes VALUES ('cd39e154-461a-44dd-9644-f1b9b6dc4840', '72e83701-5723-428c-b153-0a957cad5e78', 'OWNR - Senior Software Engineer', 'Why we’re looking for you

We are looking for a mission-driven senior engineer who is passionate about their craft and committed to building incredible products for our customers.


This role is 100% remote and can be based anywhere in the United States or Canada. For San Francisco-based candidates: we have a new HQ in the Presidio for optional in-person collaboration opportunities!


Our Tech Stack:

Frontend: [React, Next.js, Vue]
Backend: [Node.js, Mongo]
Typescript everywhere


💥 The impact you will have

Build new products and features 0 to 1
Take ownership of projects from conception all the way to shipping, ensuring modular, maintainable, and high-quality code
Deliver value to our end users across our entire system while considering performance, scale, security, and maintainability
Shape our product direction by talking to users and collaborating with other teammates in feature brainstorms/roadmap planning
Provide thoughtful code reviews and technical guidance to peers, helping to improve overall team quality
Help us build a great team — interview candidates, refer great engineers, etc.


✅ What we’re looking for

5+ years of experience building applications
Extensive Typescript experience
Experience scaling with frontend stack (React, Next.js, etc.) and/or our backend stack (Nodejs, Mongo, AWS)
Experience at product-focused startup/scale-up or technology company
High degree of cross-functional collaboration—past colleagues in product, design, and business would speak highly of your teamwork
Dedicated to continuous professional development and possessing a lifelong-learner mindset
Strong sense of ownership and drive, excellent communication, and a proactive approach to identifying and solving problems


🏆 Pay and benefits

The estimated starting base salary range for this role is $190K - $220K depending on level, location and experience, plus a generous pre-IPO equity package
Other benefits include comprehensive health coverage, work from anywhere (remote-first workplace), unlimited PTO - plus extra fun perks!', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "paragraph", "work_experience_format": "bullets", "highlight_important_content": false}', '{"skills": ["Node", "React", "NextJs", "ExpressJs", "TypeScript", "AWS Services", "GraphQL", "Jest", "MongoDB", "PostgreSQL", "Docker", "Auth0", "Firebase", "MySQL", "Nginx"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with extensive experience in designing scalable architectures using Node.js, React, and Next.js", "Proven track record of leading technical initiatives, optimizing data flows, and ensuring secure authentication and compliance", "Expertise in CI/CD best practices, DevOps, and cloud orchestration on AWS services", "Passionate about building modular, maintainable, and high-quality code while driving team efficiency and system reliability", "Dedicated to continuous professional development, lifelong learning, and cross-functional collaboration"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": "Implemented modular backend and integration layers for a Next.js application, designed real-time workflows, and optimized data pipelines. Guided team on CI/CD best practices and secure coding."}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": "Developed and optimized an AI-powered platform, enabling AI agent training on user-connected resources. Built resource ingestion pipelines and SDKs for AI chat interfaces."}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack Engineer", "description": "Led the development of an online collaborative learning platform, designed dynamic frontend with React and Gatsby, implemented real-time communication features, and oversaw secure data management."}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": "Contributed to a web application delivering predictive insights for sports bettors. Developed frontend features with React and Apollo Client, integrated with Hasura-managed GraphQL APIs, and collaborated using Agile methodologies."}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Designed and developed a modular Next.js application for seamless partner platform integration", "Implemented secure authentication and user permission systems using Auth0 for SOC 2 and HIPAA compliance", "Contributed to CI/CD best practices and deployment orchestration on AWS EKS", "Mentored team members on modular development and secure coding practices"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Developed resource APIs enabling AI agents to connect multiple knowledge sources", "Optimized AI-powered systems for performance, scalability, and reliability", "Authored SDKs and reusable components for AI chat interfaces", "Collaborated with engineering teams to optimize ingestion and retrieval processes"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": ["Led technical initiatives in Agile environment with React, Angular, and Node.js", "Championed CI/CD pipelines automation and optimized application performance", "Introduced reusable boilerplates and standardized development setups", "Conducted internal training sessions on scalable design principles and secure coding practices"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": ["Motivated developers to follow clean architecture and industry best practices", "Facilitated cross-functional collaboration for timely project delivery", "Managed project timelines efficiently and optimized AWS deployment", "Conducted detailed code reviews on projects with NestJS and GraphQL"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Applied Agile methodologies in web development projects with Angular and React", "Maintained and updated web applications using Laravel and Node.js", "Utilized Git for version control to ensure clean and maintainable code", "Consistently delivered high-quality output in HTML, CSS, and JavaScript"]}]}', '2025-10-29 03:41:20.7318+00');
INSERT INTO public.resumes VALUES ('9c1720a1-5069-440a-9524-b3dfbb4b485c', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer', 'About Us

Our mission at Wrapbook is to increase the prosperity of the project economy. A significant shift has occurred within the workforce recently and 50M Americans are now engaged in freelance or project-based work. The popularity of project based employment has introduced flexibility for both employers and employees but also added complexities from a compensation and administrative standpoint. Our vertical fintech platform enables companies to seamlessly onboard, pay and insure their workforces.

We’re building the best product for the entertainment industry but operate in a 50B market and have big goals we want to achieve. With legacy competition slow to react and over 30M raised from Andreessen Horowitz, Equal Ventures, Uncork Capital, Jeffrey Katzenberg and CAA co-founder Michael Ovitz, we are at an exciting stage of growth and there isn’t a better time to join!

The Opportunity – Software Engineer III (Remote - CANADA)

Wrapbook is looking for a Software Engineer III (Ruby on Rails) who will play a hands-on role in driving our mission to build an outstanding technology company. You will be working as part of a cross-functional team, significantly contributing to our core features from start to finish.

What You''ll Do

Collaborate with other developers, designers and product managers to provide elegant solutions to Wrapbook customer problems
Review code and have your code reviewed.
Write performant, scalable, and secure software
Ensure code is well-tested and well-architected

What You’ll Have

You have at least three years of experience building production web applications
You are eager to learn and level up your skills
You have experience writing SQL queries and a general understanding of SQL indices (PostgreSQL is a plus)
You are customer-focused and like to pay attention to detail and value quality
You have experience building Ruby on Rails applications and APIs

Our Tech Stack

Full stack Ruby on Rails (Frontend & Backend)
StimulusJS
Redis
Sidekiq
PostgreSQL
Kubernetes

Why Join Us

At Wrapbook, creativity meets technology — and not just in the product.

Benefits

In addition to a competitive salary and all the benefits you can expect from a fast-growing technology company, you’ll get access to a team of creative problem solvers and the chance to see your contributions make large impacts Benefits include:

Unlimited Paid Time Off
Work from anywhere in Canada and USA
Health and Dental benefits
Up to $1,500 USD/ $2,025 CAD towards IT set up for your home
Up to 2% matching RRSP / 401K
Learning and Development opportunities
Up to $50 USD/ $67.50 CAD towards Internet/Cell phone service

Our Pledge To Fostering An Inclusive And Safe Workplace

Wrapbook pledges to be a harassment- and discrimination-free space for everyone, regardless of age, disability, ethnicity, gender identity or expression, nationality, neurotype, personal appearance, political affiliation, professional background, race, religion, or sexual identity or orientation.

Apply Now

Have we got your attention? Submit your application today and a member of our Talent team will be in touch with you shortly!

Compensation Range: CA$105.2K - CA$143.3K
', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "paragraph", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["Node.js", "React", "GraphQL", "AWS Services", "Docker", "ExpressJs", "Jest", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "NextJs", "Typescript", "Webpack"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with 6+ years of experience specializing in scalable web application development and secure authentication systems", "Expertise in Node.js, React, GraphQL, and AWS services, ensuring SOC 2 and HIPAA compliance", "Proven track record in leading technical initiatives, mentoring team members, and optimizing CI/CD pipelines", "Skilled in designing modular architectures, optimizing data flows, and implementing DevOps best practices"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": "Implemented modular, scalable backend and integration layers for the PlaySpace Next.js agentic application. Designed real-time workflows, optimized data pipelines, and contributed to secure multi-tenant infrastructure on AWS EKS. Guided team members on CI/CD best practices and secure coding."}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": "Developed and optimized the AI-powered DevDocs platform, enabling training of AI agents on user-connected resources. Built resource ingestion pipelines, automated syncing of knowledge sources, and vectorized storage. Contributed to SDKs and reusable components for embedding AI workflows."}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack Engineer", "description": "Led the development of LearnOtter, an online collaborative learning platform, as Senior Full Stack Developer. Designed dynamic frontend with React, Redux, and Gatsby. Implemented real-time communication features with Express.js and Socket.IO, ensuring secure data management with MySQL and MinIO."}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": "Contributed as a Full Stack Developer to SportsJaw, a web application delivering predictive insights for sports bettors. Developed frontend features using React and Apollo Client, integrated with Hasura-managed GraphQL APIs, and collaborated with cross-functional teams to ensure a seamless user experience."}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["[HIGHLIGHT]Designed[/HIGHLIGHT] and [HIGHLIGHT]developed[/HIGHLIGHT] a modular Next.js application with seamless partner platform integration", "Implemented [HIGHLIGHT]secure authentication[/HIGHLIGHT] and [HIGHLIGHT]user permission systems[/HIGHLIGHT] using Auth0 for SOC 2 and HIPAA compliance", "Built and maintained [HIGHLIGHT]scalable[/HIGHLIGHT] backend services with Node.js and microservices architecture", "Contributed to [HIGHLIGHT]DevOps[/HIGHLIGHT] initiatives including deployment on AWS EKS and infrastructure provisioning with Terraform", "Mentored team members on [HIGHLIGHT]CI/CD best practices[/HIGHLIGHT] and [HIGHLIGHT]secure coding[/HIGHLIGHT]"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Specialized in creating detailed documentation and developing AI-powered systems at DevDocs.ai", "Developed resource APIs for connecting knowledge sources and automated syncing pipelines", "Leveraged AI services for accurate responses and context-aware interactions", "Authored SDKs and internal guides for embedding AI chat interfaces and automating knowledge updates"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": ["[HIGHLIGHT]Led technical initiatives[/HIGHLIGHT] by designing scalable project architectures and mentoring developers", "Defined technical roadmaps for full stack web applications using React and Angular", "Guided the team in building efficient CI/CD pipelines and optimized application performance with MySQL and PostgreSQL", "Conducted internal training sessions on advanced development patterns and secure coding practices"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": ["Motivated developers to follow best practices and provided mentorship on clean architecture", "Facilitated collaboration among teams to resolve technical challenges and improve task management", "Managed project timelines efficiently while leveraging AWS for deployment and scalability", "Conducted detailed code reviews on projects built with NestJS, Express, and GraphQL"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Collaborated in Agile web development projects using Angular, React, and Bootstrap", "Maintained web applications with Laravel and Node.js technologies", "Utilized Git for version control and adhered to web development best practices", "Consistently delivered high-quality output in HTML, CSS, and JavaScript"]}]}', '2025-10-29 19:33:53.281524+00');
INSERT INTO public.resumes VALUES ('b8e375f3-e806-43d8-b10c-0e0cf4efd099', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer', 'About Us

Our mission at Wrapbook is to increase the prosperity of the project economy. A significant shift has occurred within the workforce recently and 50M Americans are now engaged in freelance or project-based work. The popularity of project based employment has introduced flexibility for both employers and employees but also added complexities from a compensation and administrative standpoint. Our vertical fintech platform enables companies to seamlessly onboard, pay and insure their workforces.

We’re building the best product for the entertainment industry but operate in a 50B market and have big goals we want to achieve. With legacy competition slow to react and over 30M raised from Andreessen Horowitz, Equal Ventures, Uncork Capital, Jeffrey Katzenberg and CAA co-founder Michael Ovitz, we are at an exciting stage of growth and there isn’t a better time to join!

The Opportunity – Software Engineer III (Remote - CANADA)

Wrapbook is looking for a Software Engineer III (Ruby on Rails) who will play a hands-on role in driving our mission to build an outstanding technology company. You will be working as part of a cross-functional team, significantly contributing to our core features from start to finish.

What You''ll Do

Collaborate with other developers, designers and product managers to provide elegant solutions to Wrapbook customer problems
Review code and have your code reviewed.
Write performant, scalable, and secure software
Ensure code is well-tested and well-architected

What You’ll Have

You have at least three years of experience building production web applications
You are eager to learn and level up your skills
You have experience writing SQL queries and a general understanding of SQL indices (PostgreSQL is a plus)
You are customer-focused and like to pay attention to detail and value quality
You have experience building Ruby on Rails applications and APIs

Our Tech Stack

Full stack Ruby on Rails (Frontend & Backend)
StimulusJS
Redis
Sidekiq
PostgreSQL
Kubernetes

Why Join Us

At Wrapbook, creativity meets technology — and not just in the product.

Benefits

In addition to a competitive salary and all the benefits you can expect from a fast-growing technology company, you’ll get access to a team of creative problem solvers and the chance to see your contributions make large impacts Benefits include:

Unlimited Paid Time Off
Work from anywhere in Canada and USA
Health and Dental benefits
Up to $1,500 USD/ $2,025 CAD towards IT set up for your home
Up to 2% matching RRSP / 401K
Learning and Development opportunities
Up to $50 USD/ $67.50 CAD towards Internet/Cell phone service

Our Pledge To Fostering An Inclusive And Safe Workplace

Wrapbook pledges to be a harassment- and discrimination-free space for everyone, regardless of age, disability, ethnicity, gender identity or expression, nationality, neurotype, personal appearance, political affiliation, professional background, race, religion, or sexual identity or orientation.

Apply Now

Have we got your attention? Submit your application today and a member of our Talent team will be in touch with you shortly!

Compensation Range: CA$105.2K - CA$143.3K
', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["Node", "React", "Angular", "Docker", "NextJs", "ExpressJs", "Typescript", "GraphQL", "AWS Services", "Jest", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "Webpack"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with over 7 years of experience specializing in full-stack development using Node, React, Angular, and Docker", "Demonstrated expertise in designing and developing scalable microservices architectures with Node.js and implementing secure authentication systems using Auth0 and Next.js", "Proven track record in leading technical initiatives, mentoring team members, and optimizing CI/CD pipelines to enhance project delivery efficiency", "Experienced in cloud architecture and deployment on AWS, including EKS setup, infrastructure provisioning with Terraform, and monitoring with AWS CloudWatch", "Skilled in collaborating with cross-functional teams, defining architecture, and enforcing engineering standards to drive platform optimization and performance", "Proficient in a wide range of technologies including GraphQL, Jest, MySQL, PostgreSQL, MongoDB, and Firebase"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": ["Implemented modular, scalable backend and integration layers for the PlaySpace Next.js application", "Designed and optimized real-time workflows and data pipelines", "Contributed to secure multi-tenant infrastructure on AWS EKS with Terraform", "Guided team members on best practices for CI/CD and secure coding", "Improved team efficiency and system reliability"]}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": ["Developed and optimized the AI-powered DevDocs platform for training AI agents", "Built and maintained resource ingestion pipelines and automated syncing processes", "Contributed to SDKs and reusable components for embedding AI workflows", "Mentored team members on best practices for scalable, secure, and maintainable systems", "Ensured high performance and reliability across integrated systems"]}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack Engineer", "description": ["Led the development of LearnOtter, an online collaborative learning platform", "Architected real-time communication features with Express.js and Socket.IO", "Oversaw secure and efficient data management using MySQL and MinIO", "Led the deployment and scaling strategy with Docker and AWS EC2", "Enforced best practices for modular, maintainable, and high-performance code"]}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": ["Contributed as a Full Stack Developer to SportsJaw, a predictive insights web application", "Developed and optimized frontend features using React and Apollo Client", "Integrated with Hasura-managed GraphQL APIs for data fetching efficiency", "Collaborated with cross-functional teams to deliver a seamless user experience", "Utilized Agile methodologies for iterative design and development"]}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Designed and developed a modular Next.js application for seamless integration with partner platforms", "Implemented secure authentication using Auth0 for SOC 2 and HIPAA compliance", "Developed and maintained backend services with Node.js and microservices architecture", "Contributed to DevOps initiatives including deployment on AWS EKS and infrastructure provisioning with Terraform", "Mentored team members on CI/CD best practices and secure coding"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Specialized in creating technically detailed documentation and developing AI-powered systems at DevDocs.ai", "Implemented automated syncing pipelines and stored embeddings in vector databases for AI agents", "Collaborated with engineering teams to optimize AI-powered platform performance and scalability", "Authored SDKs and internal guides to help developers embed AI chat interfaces", "Contributed to scalable, secure, and reliable integrated systems"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": ["Designed and implemented scalable project architectures and performed in-depth code reviews", "Championed clean code practices, modular architecture, and consistent Git workflows", "Guided the team in building efficient CI/CD pipelines using Jenkins, Docker, and GitHub Actions", "Optimized application performance with MySQL, PostgreSQL, and NoSQL databases", "Conducted internal training sessions on advanced development patterns and secure coding practices"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": ["Motivated developers to follow industry best practices and provided mentorship", "Facilitated collaboration among cross-functional teams to resolve technical challenges", "Managed project timelines efficiently and coordinated with clients to align technical requirements", "Leveraged AWS services for deployment and scalability, integrating Socket.IO for real-time communication", "Conducted detailed code and pull request reviews to enhance code quality"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Collaborated closely with a senior developer to understand project requirements", "Assisted in maintaining and updating web applications using Laravel, Node.js, and databases", "Utilized Git for version control to ensure clean and maintainable code", "Adhered to web development best practices and completed tasks within timelines", "Participated in code reviews to enhance coding skills"]}]}', '2025-10-29 19:41:17.207282+00');
INSERT INTO public.resumes VALUES ('e173f94b-ce9a-44d2-a29f-16299484b4af', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior software engineer', 'Why we’re looking for you

We are looking for a mission-driven senior engineer who is passionate about their craft and committed to building incredible products for our customers.


This role is 100% remote and can be based anywhere in the United States or Canada. For San Francisco-based candidates: we have a new HQ in the Presidio for optional in-person collaboration opportunities!


Our Tech Stack:

Frontend: [React, Next.js, Vue]
Backend: [Node.js, Mongo]
Typescript everywhere


💥 The impact you will have

Build new products and features 0 to 1
Take ownership of projects from conception all the way to shipping, ensuring modular, maintainable, and high-quality code
Deliver value to our end users across our entire system while considering performance, scale, security, and maintainability
Shape our product direction by talking to users and collaborating with other teammates in feature brainstorms/roadmap planning
Provide thoughtful code reviews and technical guidance to peers, helping to improve overall team quality
Help us build a great team — interview candidates, refer great engineers, etc.


✅ What we’re looking for

5+ years of experience building applications
Extensive Typescript experience
Experience scaling with frontend stack (React, Next.js, etc.) and/or our backend stack (Nodejs, Mongo, AWS)
Experience at product-focused startup/scale-up or technology company
High degree of cross-functional collaboration—past colleagues in product, design, and business would speak highly of your teamwork
Dedicated to continuous professional development and possessing a lifelong-learner mindset
Strong sense of ownership and drive, excellent communication, and a proactive approach to identifying and solving problems


🏆 Pay and benefits

The estimated starting base salary range for this role is $190K - $220K depending on level, location and experience, plus a generous pre-IPO equity package
Other benefits include comprehensive health coverage, work from anywhere (remote-first workplace), unlimited PTO - plus extra fun perks!', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": [{"skills": ["TypeScript", "JavaScript", "Python", "Bash", "Shell Script", "PHP"], "category": "Programming Languages"}, {"skills": ["React", "Next.js", "Vue", "Angular", "Redux", "HTML/CSS", "Bootstrap", "Tailwind CSS"], "category": "Frontend Technologies"}, {"skills": ["Node.js", "Express.js", "NestJS", "GraphQL", "REST APIs", "Laravel", "HapiJS"], "category": "Backend & APIs"}, {"skills": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Elasticsearch"], "category": "Databases"}, {"skills": ["AWS Services", "Docker", "Kubernetes", "Terraform", "Jenkins", "Digital Ocean", "Vercel"], "category": "Cloud & DevOps"}, {"skills": ["Git", "Agile", "Scrum", "Jest", "Postman", "Figma"], "category": "Tools & Methodologies"}], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with [HIGHLIGHT]7+ years of experience[/HIGHLIGHT] building scalable applications using [HIGHLIGHT]React, Next.js, Node.js, and TypeScript[/HIGHLIGHT], specializing in [HIGHLIGHT]full-stack development[/HIGHLIGHT] and [HIGHLIGHT]product-focused environments[/HIGHLIGHT]", "Proven track record of [HIGHLIGHT]taking ownership of projects from conception to shipping[/HIGHLIGHT], leading cross-functional teams, and delivering [HIGHLIGHT]modular, maintainable, and high-quality code[/HIGHLIGHT] for platforms serving [HIGHLIGHT]500+ users and 10,000+ concurrent sessions[/HIGHLIGHT]", "Experienced in [HIGHLIGHT]startup and scale-up environments[/HIGHLIGHT] with strong [HIGHLIGHT]cross-functional collaboration[/HIGHLIGHT] skills, having worked directly with clients and stakeholders to deliver tailored solutions while [HIGHLIGHT]mentoring teammates and providing technical guidance[/HIGHLIGHT]"], "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Enhanced [HIGHLIGHT]platform scalability[/HIGHLIGHT] by architecting a secure appointment system using [HIGHLIGHT]React and Node.js[/HIGHLIGHT], supporting [HIGHLIGHT]10,000+ concurrent sessions[/HIGHLIGHT] for SOC 2 compliant digital therapy platform", "Accelerated [HIGHLIGHT]product delivery by 35%[/HIGHLIGHT] by leading [HIGHLIGHT]full platform rebuild[/HIGHLIGHT] with a [HIGHLIGHT]3-person team[/HIGHLIGHT] using [HIGHLIGHT]AI-powered development tools[/HIGHLIGHT] and [HIGHLIGHT]modern tech stack[/HIGHLIGHT]", "Strengthened [HIGHLIGHT]security posture[/HIGHLIGHT] by reducing vulnerabilities by [HIGHLIGHT]60%[/HIGHLIGHT] through comprehensive [HIGHLIGHT]AWS infrastructure audits[/HIGHLIGHT] and [HIGHLIGHT]HIPAA compliance implementation[/HIGHLIGHT]", "Improved [HIGHLIGHT]therapist activation rate by 25%[/HIGHLIGHT] through [HIGHLIGHT]AI-powered onboarding implementation[/HIGHLIGHT] and [HIGHLIGHT]partner integration architecture[/HIGHLIGHT] using [HIGHLIGHT]Auth0 and Supabase[/HIGHLIGHT]", "Enhanced [HIGHLIGHT]payment system reliability[/HIGHLIGHT] by architecting [HIGHLIGHT]provider-agnostic payment infrastructure[/HIGHLIGHT] reducing future integrations from days to hours", "Established [HIGHLIGHT]monitoring and analytics capabilities[/HIGHLIGHT] by integrating [HIGHLIGHT]PostHog for A/B testing[/HIGHLIGHT] across [HIGHLIGHT]20+ feature experiments[/HIGHLIGHT] and [HIGHLIGHT]AWS CloudWatch for audit logging[/HIGHLIGHT]"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Senior Software Engineer", "description": ["Built [HIGHLIGHT]AI-powered customer support platform[/HIGHLIGHT] using [HIGHLIGHT]Next.js, TypeScript, and LangChain[/HIGHLIGHT], reducing [HIGHLIGHT]query resolution time by 40%[/HIGHLIGHT] through [HIGHLIGHT]RAG pipeline optimization[/HIGHLIGHT]", "Accelerated [HIGHLIGHT]customer integration from days to under an hour[/HIGHLIGHT] by developing [HIGHLIGHT]React SDK and embeddable chat widget[/HIGHLIGHT] with [HIGHLIGHT]model-agnostic architecture[/HIGHLIGHT]", "Reduced [HIGHLIGHT]AI infrastructure costs by 30%[/HIGHLIGHT] through [HIGHLIGHT]runtime LLM switching architecture[/HIGHLIGHT] and [HIGHLIGHT]usage metering implementation[/HIGHLIGHT] for [HIGHLIGHT]subscription-based limits[/HIGHLIGHT]", "Enhanced [HIGHLIGHT]platform capabilities[/HIGHLIGHT] by developing [HIGHLIGHT]12+ integrations[/HIGHLIGHT] with GitHub, Notion, Salesforce, and other tools using [HIGHLIGHT]real-time sync capabilities[/HIGHLIGHT]", "Improved [HIGHLIGHT]team productivity and onboarding[/HIGHLIGHT] by [HIGHLIGHT]mentoring new team members[/HIGHLIGHT] and creating [HIGHLIGHT]comprehensive codebase documentation[/HIGHLIGHT]"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech Lead", "description": ["Led [HIGHLIGHT]multi-disciplinary teams of 25+ developers[/HIGHLIGHT] across [HIGHLIGHT]React, Angular, and Node.js projects[/HIGHLIGHT], improving [HIGHLIGHT]team productivity by 25%[/HIGHLIGHT] through [HIGHLIGHT]code review processes and coding standards[/HIGHLIGHT]", "Accelerated [HIGHLIGHT]project delivery by 30%[/HIGHLIGHT] by creating [HIGHLIGHT]reusable tech stack boilerplates[/HIGHLIGHT] and reducing [HIGHLIGHT]project setup time by 70%[/HIGHLIGHT] through [HIGHLIGHT]pre-built feature development[/HIGHLIGHT]", "Enhanced [HIGHLIGHT]client satisfaction by 20%[/HIGHLIGHT] through [HIGHLIGHT]direct client communication[/HIGHLIGHT] and [HIGHLIGHT]tailored solution delivery[/HIGHLIGHT], while [HIGHLIGHT]mentoring team members[/HIGHLIGHT] and ensuring [HIGHLIGHT]on-time delivery[/HIGHLIGHT]", "Expanded [HIGHLIGHT]company AI service offerings[/HIGHLIGHT] by building [HIGHLIGHT]first AI chatbot integration[/HIGHLIGHT] and implementing [HIGHLIGHT]ChatGPT-powered features[/HIGHLIGHT] for [HIGHLIGHT]text refinement and workflow automation[/HIGHLIGHT]", "Improved [HIGHLIGHT]deployment efficiency[/HIGHLIGHT] by supporting [HIGHLIGHT]AWS and DigitalOcean CI/CD implementation[/HIGHLIGHT] using [HIGHLIGHT]GitHub Actions and GitLab pipelines[/HIGHLIGHT], reducing [HIGHLIGHT]release errors[/HIGHLIGHT]", "Streamlined [HIGHLIGHT]development workflows[/HIGHLIGHT] by automating [HIGHLIGHT]daily standups and reporting[/HIGHLIGHT] processes, cutting [HIGHLIGHT]meeting overhead[/HIGHLIGHT] and improving [HIGHLIGHT]project visibility[/HIGHLIGHT]"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Web Developer", "description": ["Delivered [HIGHLIGHT]training management system[/HIGHLIGHT] reducing [HIGHLIGHT]manual work by 40%[/HIGHLIGHT] and [HIGHLIGHT]staff management effort by 30%[/HIGHLIGHT] through [HIGHLIGHT]automated dashboard implementation[/HIGHLIGHT]", "Enhanced [HIGHLIGHT]application functionality[/HIGHLIGHT] by implementing [HIGHLIGHT]third-party integrations[/HIGHLIGHT] and [HIGHLIGHT]Single Sign-On (SSO) solutions[/HIGHLIGHT] for improved [HIGHLIGHT]security and user accessibility[/HIGHLIGHT]", "Contributed to [HIGHLIGHT]FastFocus real-time market research platform[/HIGHLIGHT], improving [HIGHLIGHT]survey analytics and decision-making[/HIGHLIGHT] capabilities for [HIGHLIGHT]global clients[/HIGHLIGHT]", "Gained expertise in [HIGHLIGHT]full-stack technologies[/HIGHLIGHT] including [HIGHLIGHT]Laravel, React, Node.js, Angular, GraphQL[/HIGHLIGHT], and [HIGHLIGHT]AWS services[/HIGHLIGHT] like [HIGHLIGHT]EC2, S3, and Lambda[/HIGHLIGHT]"]}]}', '2025-11-25 18:29:43.256354+00');
INSERT INTO public.resumes VALUES ('871f69a4-af9b-49db-a5fd-be24597c2fd6', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Full Stack engineer', 'About Us

Our mission at Wrapbook is to increase the prosperity of the project economy. A significant shift has occurred within the workforce recently and 50M Americans are now engaged in freelance or project-based work. The popularity of project based employment has introduced flexibility for both employers and employees but also added complexities from a compensation and administrative standpoint. Our vertical fintech platform enables companies to seamlessly onboard, pay and insure their workforces.

We’re building the best product for the entertainment industry but operate in a 50B market and have big goals we want to achieve. With legacy competition slow to react and over 30M raised from Andreessen Horowitz, Equal Ventures, Uncork Capital, Jeffrey Katzenberg and CAA co-founder Michael Ovitz, we are at an exciting stage of growth and there isn’t a better time to join!

The Opportunity – Software Engineer III (Remote - CANADA)

Wrapbook is looking for a Software Engineer III (Ruby on Rails) who will play a hands-on role in driving our mission to build an outstanding technology company. You will be working as part of a cross-functional team, significantly contributing to our core features from start to finish.

What You''ll Do

Collaborate with other developers, designers and product managers to provide elegant solutions to Wrapbook customer problems
Review code and have your code reviewed.
Write performant, scalable, and secure software
Ensure code is well-tested and well-architected

What You’ll Have

You have at least three years of experience building production web applications
You are eager to learn and level up your skills
You have experience writing SQL queries and a general understanding of SQL indices (PostgreSQL is a plus)
You are customer-focused and like to pay attention to detail and value quality
You have experience building Ruby on Rails applications and APIs

Our Tech Stack

Full stack Ruby on Rails (Frontend & Backend)
StimulusJS
Redis
Sidekiq
PostgreSQL
Kubernetes

Why Join Us

At Wrapbook, creativity meets technology — and not just in the product.




', 'strict', 'minimal', '{"summary_format": "paragraph", "projects_format": "paragraph", "work_experience_format": "paragraph", "highlight_important_content": true}', '{"skills": ["Node.js", "React", "AWS Services", "CI/CD automation", "Microservices", "Next.js", "Express.js", "TypeScript", "GraphQL", "Jest", "MongoDB", "MySQL", "PostgreSQL", "Docker", "Auth0"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": "Collaborated to implement modular backend and integration layers for the PlaySpace Next.js application, optimized real-time workflows, and contributed to secure multi-tenant infrastructure on AWS EKS. Guided peers on CI/CD best practices and secure coding, enhancing team efficiency and system reliability."}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": "Developed the AI-powered DevDocs platform, enabling training of AI agents on user-connected resources and delivering context-aware responses. Built resource ingestion pipelines, automated syncing of knowledge sources, and contributed to SDKs for embedding AI workflows. Mentored teammates on best practices for scalable, secure systems."}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack Engineer", "description": "Led the development of LearnOtter, an online learning platform, as a Senior Full Stack Developer. Architected a dynamic frontend with React, Redux, and Gatsby, implemented real-time communication features, and ensured secure data management. Led deployment and scaling strategies with Docker and AWS EC2."}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": "Contributed as a Full Stack Developer to SportsJaw, delivering predictive insights for sports bettors. Developed frontend features using React and Apollo Client, integrated with Hasura-managed GraphQL APIs, and collaborated with cross-functional teams to design a seamless user experience."}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": "As a Senior Software Engineer, led the design and development of a modular Next.js application integrated with partner platforms. Implemented secure authentication using Auth0, developed backend services with Node.js and microservices architecture for optimized data flows. Contributed to DevOps initiatives on AWS EKS, mentored team members on CI/CD best practices, and collaborated with cross-functional teams to define architecture and performance optimization strategies."}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": "Specialized in AI-powered systems at DevDocs.ai, developing resource APIs and automated syncing pipelines for AI agents. Leveraged AI services like ChatGPT and Claude APIs for context-aware responses, authored SDKs and guides for embedding AI chat interfaces. Collaborated with engineering teams to optimize processes, infrastructure, and deliver real-time, intelligent responses."}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": "Led technical initiatives as Tech Lead, designing scalable architectures for full stack web applications using React, Angular, and Node.js frameworks. Implemented CI/CD pipelines with Jenkins, Docker, and GitHub Actions, optimized performance with MySQL, PostgreSQL, and NoSQL databases. Conducted internal training sessions to upskill developers on advanced patterns and secure coding practices."}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": "Motivated developers to follow best practices, conducted code reviews, and mentored teams to enhance code quality using React, Angular, and Node-based frameworks. Managed project timelines efficiently, coordinated with clients, and integrated Socket.IO for real-time communication in projects. Leveraged AWS services for deployment and scalability, ensuring high client satisfaction."}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": "Applied Agile methodologies in web development projects, participated in code reviews, and maintained web applications using Laravel, Node.js, and various databases. Utilized Git for version control, adhered to web development best practices, and consistently delivered high-quality output in HTML, CSS, and JavaScript."}]}', '2025-10-29 20:10:55.157358+00');
INSERT INTO public.resumes VALUES ('5f9d9e6c-caf7-4db3-b360-0dc876ca4e46', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Dev - Ashish', 'Why we’re looking for you

We are looking for a mission-driven senior engineer who is passionate about their craft and committed to building incredible products for our customers.


This role is 100% remote and can be based anywhere in the United States or Canada. For San Francisco-based candidates: we have a new HQ in the Presidio for optional in-person collaboration opportunities!


Our Tech Stack:

Frontend: [React, Next.js, Vue]
Backend: [Node.js, Mongo]
Typescript everywhere


💥 The impact you will have

Build new products and features 0 to 1
Take ownership of projects from conception all the way to shipping, ensuring modular, maintainable, and high-quality code
Deliver value to our end users across our entire system while considering performance, scale, security, and maintainability
Shape our product direction by talking to users and collaborating with other teammates in feature brainstorms/roadmap planning
Provide thoughtful code reviews and technical guidance to peers, helping to improve overall team quality
Help us build a great team — interview candidates, refer great engineers, etc.


✅ What we’re looking for

5+ years of experience building applications
Extensive Typescript experience
Experience scaling with frontend stack (React, Next.js, etc.) and/or our backend stack (Nodejs, Mongo, AWS)
Experience at product-focused startup/scale-up or technology company
High degree of cross-functional collaboration—past colleagues in product, design, and business would speak highly of your teamwork
Dedicated to continuous professional development and possessing a lifelong-learner mindset
Strong sense of ownership and drive, excellent communication, and a proactive approach to identifying and solving problems


🏆 Pay and benefits

The estimated starting base salary range for this role is $190K - $220K depending on level, location and experience, plus a generous pre-IPO equity package
Other benefits include comprehensive health coverage, work from anywhere (remote-first workplace), unlimited PTO - plus extra fun perks!', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["TypeScript", "React", "Next.js", "Node.js", "MongoDB", "AWS Services", "JavaScript", "Express.js", "GraphQL", "Docker", "Angular", "PostgreSQL", "MySQL", "Redis", "Webpack", "Jest", "Tailwind CSS", "Auth0", "Nginx", "Firebase", "React Native", "Supabase", "Hasura", "Terraform"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "summary": ["Seasoned [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]7+ years of experience[/HIGHLIGHT] building scalable applications using [HIGHLIGHT]React, Next.js, Node.js, and TypeScript[/HIGHLIGHT] across healthcare, AI, and SaaS platforms", "Proven track record of [HIGHLIGHT]taking ownership of projects from 0 to 1[/HIGHLIGHT], leading cross-functional teams, and delivering [HIGHLIGHT]modular, maintainable, and high-quality code[/HIGHLIGHT] in fast-paced startup environments", "Extensive experience with [HIGHLIGHT]modern tech stacks including MongoDB, AWS[/HIGHLIGHT], and building [HIGHLIGHT]scalable frontend and backend systems[/HIGHLIGHT] while mentoring engineers and establishing best practices"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": ["Implemented [HIGHLIGHT]modular, scalable backend and integration layers[/HIGHLIGHT] for the PlaySpace [HIGHLIGHT]Next.js agentic application[/HIGHLIGHT], enabling seamless partner platform integration", "Designed and optimized [HIGHLIGHT]real-time workflows and data pipelines[/HIGHLIGHT], contributed to secure multi-tenant infrastructure on [HIGHLIGHT]AWS EKS with Terraform[/HIGHLIGHT]", "[HIGHLIGHT]Guided peers on best practices[/HIGHLIGHT] for CI/CD, modular architecture, and secure coding, improving team efficiency and system reliability"]}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": ["Developed and optimized the [HIGHLIGHT]AI-powered DevDocs platform[/HIGHLIGHT], enabling training of AI agents on user-connected resources with [HIGHLIGHT]context-aware responses[/HIGHLIGHT]", "Built and maintained [HIGHLIGHT]resource ingestion pipelines[/HIGHLIGHT], automated syncing of knowledge sources, and vectorized storage for structured context", "[HIGHLIGHT]Contributed to SDKs and reusable components[/HIGHLIGHT] for embedding AI workflows while [HIGHLIGHT]mentoring teammates on scalable practices[/HIGHLIGHT]"]}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack engineer", "description": ["[HIGHLIGHT]Led development of collaborative learning platform[/HIGHLIGHT] as Senior Full Stack Developer, designing [HIGHLIGHT]dynamic frontend using React, Redux, and Gatsby[/HIGHLIGHT]", "[HIGHLIGHT]Architected real-time communication features[/HIGHLIGHT] with Express.js and Socket.IO to enable seamless user collaboration", "Oversaw [HIGHLIGHT]secure data management using MySQL[/HIGHLIGHT] and led deployment strategy with [HIGHLIGHT]Docker and AWS EC2[/HIGHLIGHT]"]}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": ["Developed and optimized [HIGHLIGHT]frontend features using React and Apollo Client[/HIGHLIGHT], integrating with [HIGHLIGHT]Hasura-managed GraphQL APIs[/HIGHLIGHT]", "Leveraged [HIGHLIGHT]GraphQL Code Generator[/HIGHLIGHT] to produce reusable hooks for consistent and efficient data fetching", "[HIGHLIGHT]Collaborated with cross-functional teams using Agile methodologies[/HIGHLIGHT] to iteratively design and deliver the platform"]}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Leading [HIGHLIGHT]backend and frontend development[/HIGHLIGHT] of PlaySpace, a therapeutic healthcare platform with [HIGHLIGHT]modular Next.js architecture[/HIGHLIGHT] supporting secure multi-tenant deployments", "Engineered [HIGHLIGHT]secure authentication and role-based access control using Auth0[/HIGHLIGHT], ensuring SOC 2 and HIPAA compliance for sensitive health data", "Built and optimized [HIGHLIGHT]backend microservices with Node.js[/HIGHLIGHT] to handle real-time workflows, enabling smooth collaboration between therapists and clients", "Developed [HIGHLIGHT]flexible APIs and integration layers[/HIGHLIGHT] allowing external partners to embed PlaySpace modules within their own systems", "Contributed to [HIGHLIGHT]DevOps initiatives including AWS EKS deployments[/HIGHLIGHT] and infrastructure provisioning with Terraform", "[HIGHLIGHT]Mentored engineers on modular development[/HIGHLIGHT], CI/CD best practices, and secure coding standards to maintain high code quality across projects"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["[HIGHLIGHT]Spearheaded full stack development[/HIGHLIGHT] of DevDocs.ai, an AI-powered documentation platform [HIGHLIGHT]built with Next.js and Supabase[/HIGHLIGHT]", "Designed and developed [HIGHLIGHT]resource APIs and syncing pipelines[/HIGHLIGHT] to ingest external data sources with automated embedding and vector storage", "Implemented [HIGHLIGHT]modular SDK providing three integration models[/HIGHLIGHT]: embedded widget, React hooks library, and direct API access for backend integration", "Integrated [HIGHLIGHT]OpenAI and OpenRouter APIs[/HIGHLIGHT] to power intelligent, context-aware agent responses across the platform", "Orchestrated [HIGHLIGHT]background operations and large-scale workflows[/HIGHLIGHT] using Trigger.dev and edge functions for improved scalability", "[HIGHLIGHT]Collaborated with product and engineering teams[/HIGHLIGHT] to enhance developer experience and maintain secure infrastructure"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["[HIGHLIGHT]Led design and development of multiple full stack applications[/HIGHLIGHT] from concept to deployment, working extensively with [HIGHLIGHT]React, Angular, Node.js[/HIGHLIGHT]", "[HIGHLIGHT]Served as technical lead for teams[/HIGHLIGHT] across React, Node, Angular, and React Native, [HIGHLIGHT]mentoring developers and establishing engineering standards[/HIGHLIGHT]", "[HIGHLIGHT]Architected and delivered end-to-end solutions[/HIGHLIGHT] including Tutorac Academy with AI-driven features and Restaurant SaaS Platform with modular architecture", "Improved project efficiency by [HIGHLIGHT]introducing Hasura for small-scale projects[/HIGHLIGHT], cutting backend setup time and enabling faster MVP delivery", "[HIGHLIGHT]Developed internal boilerplate framework[/HIGHLIGHT] with built-in authentication options and modular architecture, reducing new project initialization time", "[HIGHLIGHT]Directed CI/CD pipeline improvements[/HIGHLIGHT] using Jenkins, Bitbucket Pipelines, and GitHub Actions to streamline deployments across environments"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["[HIGHLIGHT]Collaborated with senior developers[/HIGHLIGHT] on web development projects while [HIGHLIGHT]applying Agile methodologies[/HIGHLIGHT] and participating in code reviews", "Worked with [HIGHLIGHT]front-end and back-end technologies including Angular, React[/HIGHLIGHT], Bootstrap, and modern JavaScript frameworks", "Assisted in maintaining web applications using [HIGHLIGHT]back-end technologies such as Laravel and Node.js[/HIGHLIGHT] with databases including [HIGHLIGHT]MySQL, PostgreSQL, MongoDB[/HIGHLIGHT]", "[HIGHLIGHT]Utilized Git for version control[/HIGHLIGHT] to ensure clean and maintainable code while adhering to web development best practices"]}]}', '2025-11-02 23:07:51.006427+00');
INSERT INTO public.resumes VALUES ('6d5ebe25-13a9-4e99-b228-3bd887ffd16e', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer - Test', 'About the job
👀 TL;DR

Elite team of FE engineers building complex AI accounting & fintech product
Huge momentum, growing fast, huge product & AI roadmap
High-speed development - one of the fastest teams on the planet 
Comp: $110k-$175k USD base + $40k USD equity ($150k-$215k USD total) 
Backed by top San Francisco & New York VCs 
Remote with in-person meetups & daily New York EST timezone overlap 
Founders built & exited prior company at 100M ARR and 350+ people


Why This Role Matters Now

We’re growing our Engineering team and hiring our next Staff Frontend Engineer to increase our product velocity, own features end-to-end and bring DualEntry’s AI-powered accounting platform to the world’s fastest-growing companies.


About DualEntry

Founded in 2024, DualEntry is one of NYC’s fastest-growing AI startups, backed by top-tier VCs and 30+ unicorn founders.


Our team previously built a $100M ARR business from scratch, scaled it to 300+ people, and led a successful exit. Now, we’re building a category-defining SaaS product to automate and modernize enterprise accounting — one of the most painful and outdated workflows in finance.


We move fast, build with precision, and care deeply about what we ship.


📍 Location: Remote-first. Preference for European time zones with overlap to US EST working hours.


Where You’ll Create Impact

Build, ship, and own major parts of the product UI in React + Next.js
Design and optimize interactive experiences that make complex workflows simple
Work closely with product, design, and backend to ensure seamless integration and clarity
Contribute to architecture, performance, accessibility, and responsiveness across browsers
Help define our frontend system and component library as we scale
Elevate the quality of the product through thoughtful details, polish, and user empathy


How You’ll Work

You’ll collaborate with:
Founders, to understand vision and user context
Product & Design, to shape intuitive, elegant workflows
Backend Engineering, to align on data structures and performance


You’ll operate with full ownership: deploy daily, make fast decisions, and always aim for clarity.


What Sets You Up for Success

8+ years of experience in frontend development with React (Next.js a strong plus)
Solid grasp of JavaScript and TypeScript: scoping, closures, context, prototypes, classes, etc.
Strong understanding of responsive UI, accessibility, and usability principles
Experience building and testing APIs; comfort with HTTP, Postman, and debugging
Clear product thinking, eye for polish, and attention to design details
Pragmatic mindset: you move forward, make calls, and optimize for impact
Curiosity and autonomy — you dig in, learn fast, and solve problems without waiting


Why You’ll Thrive Here

You’ll own large parts of the UI in a fast-growing product
You’ll work closely with experienced founders who value product and engineering equally
You’ll build systems, not just features — and see your work go live, fast
You’ll have freedom to do your best work, with a team that moves fast and thinks clearly


Compensation & Benefits

Base salary: $100K–$175K USD
Equity: ~$40K+ USD
Option for B2B or full-time permanent position
Remote-first setup
15 PTO days + 12 public holidays
Visa sponsorship option for relocation to NYC within 2+ years
High-trust, high-autonomy team with real ownership


We currently have only one remaining seat for a Senior/Staff Frontend Engineer.


If you''re looking to work on meaningful product challenges, ship product incredibly fast, contribute to a clean and ambitious codebase, and help shape how AI becomes usable at scale — we’d love to hear from you.', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Frontend Architecture", "Component Libraries", "React Native", "Angular", "Express.js", "GraphQL", "API Development", "AWS Services", "Docker", "Responsive Design", "Accessibility", "Performance Optimization", "Git", "CI/CD", "Agile Methodologies", "Tailwind CSS", "Jest", "Webpack"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Leading [HIGHLIGHT]backend and frontend development[/HIGHLIGHT] of PlaySpace, a therapeutic healthcare platform offering EHR capabilities and seamless third-party integration for partner healthcare systems.", "Engineered [HIGHLIGHT]modular Next.js architecture[/HIGHLIGHT] supporting secure multi-tenant deployments and real-time interactions across embedded modules.", "Designed and implemented secure authentication and [HIGHLIGHT]role-based access control[/HIGHLIGHT] using Auth0, ensuring SOC 2 and HIPAA compliance.", "Built and optimized [HIGHLIGHT]backend microservices with Node.js[/HIGHLIGHT] to handle sensitive health data and real-time workflows, enabling smooth collaboration between therapists and clients.", "Developed [HIGHLIGHT]flexible APIs and integration layers[/HIGHLIGHT] allowing external partners to embed PlaySpace modules or integrate PlaySpace features within their own systems.", "[HIGHLIGHT]Mentored engineers[/HIGHLIGHT] on modular development, CI/CD best practices, and secure coding standards to maintain high code quality across projects."]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Spearheaded [HIGHLIGHT]full stack development[/HIGHLIGHT] of DevDocs.ai, an AI-powered documentation and knowledge integration platform built with [HIGHLIGHT]Next.js[/HIGHLIGHT] and Supabase.", "Designed and developed [HIGHLIGHT]resource APIs[/HIGHLIGHT] and syncing pipelines to ingest and maintain external data sources, with automated embedding and vector storage for contextual retrieval.", "Implemented a [HIGHLIGHT]modular SDK[/HIGHLIGHT] providing three integration models: ready-to-use embedded widget with customizable branding, React hooks library for building custom chat interfaces, and direct API access for backend integration.", "Integrated [HIGHLIGHT]OpenAI and OpenRouter APIs[/HIGHLIGHT] to power intelligent, context-aware agent responses.", "Orchestrated background operations and large-scale workflows using Trigger.dev and edge functions for [HIGHLIGHT]improved scalability and reliability[/HIGHLIGHT].", "Authored internal documentation, [HIGHLIGHT]SDK guides, and reusable components[/HIGHLIGHT] that empowered other teams to build upon the platform seamlessly."]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["Led the [HIGHLIGHT]design and development[/HIGHLIGHT] of multiple full stack web applications from concept to deployment, working extensively with [HIGHLIGHT]React, Angular, Node.js[/HIGHLIGHT], and modern frameworks such as NestJS and Express.", "Served as the [HIGHLIGHT]technical lead for teams[/HIGHLIGHT] across React, Node, Angular, and React Native, [HIGHLIGHT]mentoring developers[/HIGHLIGHT] and establishing consistent engineering standards for scalable and maintainable codebases.", "Architected and delivered [HIGHLIGHT]end-to-end solutions[/HIGHLIGHT] for key projects including Tutorac Academy with AI-driven learning features, Restaurant SaaS Platform with modular architecture, and Online Piano Learning Portal with interactive features.", "Improved overall project efficiency by introducing Hasura for small-scale projects, cutting [HIGHLIGHT]backend setup time by nearly 40%[/HIGHLIGHT] and enabling faster MVP delivery.", "Developed an [HIGHLIGHT]internal boilerplate framework[/HIGHLIGHT] with built-in authentication options and modular architecture, reducing new project initialization time significantly.", "Directed [HIGHLIGHT]CI/CD pipeline improvements[/HIGHLIGHT] using Jenkins, Bitbucket Pipelines, and GitHub Actions to streamline deployments across multiple environments."]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Collaborated closely with senior developers to understand project requirements and applied [HIGHLIGHT]Agile methodologies[/HIGHLIGHT] in web development projects while participating in code reviews.", "Enhanced coding skills and troubleshooting capabilities in both [HIGHLIGHT]front-end and back-end code[/HIGHLIGHT] using Angular, React, Bootstrap, and other modern JavaScript frameworks.", "Assisted in maintaining and updating web applications by working with [HIGHLIGHT]back-end technologies[/HIGHLIGHT] such as Laravel and Node.js along with databases including MySQL, PostgreSQL, MongoDB, and Firebase.", "Utilized [HIGHLIGHT]Git for version control[/HIGHLIGHT] to ensure clean and maintainable code while adhering to web development best practices and consistently delivering high-quality output."]}]}', '2025-11-05 00:20:38.996515+00');
INSERT INTO public.resumes VALUES ('41258b8d-858a-4ad5-b6ef-f7017ff6a796', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer', 'About the job
👀 TL;DR

Elite team of FE engineers building complex AI accounting & fintech product
Huge momentum, growing fast, huge product & AI roadmap
High-speed development - one of the fastest teams on the planet 
Comp: $110k-$175k USD base + $40k USD equity ($150k-$215k USD total) 
Backed by top San Francisco & New York VCs 
Remote with in-person meetups & daily New York EST timezone overlap 
Founders built & exited prior company at 100M ARR and 350+ people


Why This Role Matters Now

We’re growing our Engineering team and hiring our next Staff Frontend Engineer to increase our product velocity, own features end-to-end and bring DualEntry’s AI-powered accounting platform to the world’s fastest-growing companies.


About DualEntry

Founded in 2024, DualEntry is one of NYC’s fastest-growing AI startups, backed by top-tier VCs and 30+ unicorn founders.


Our team previously built a $100M ARR business from scratch, scaled it to 300+ people, and led a successful exit. Now, we’re building a category-defining SaaS product to automate and modernize enterprise accounting — one of the most painful and outdated workflows in finance.


We move fast, build with precision, and care deeply about what we ship.


📍 Location: Remote-first. Preference for European time zones with overlap to US EST working hours.


Where You’ll Create Impact

Build, ship, and own major parts of the product UI in React + Next.js
Design and optimize interactive experiences that make complex workflows simple
Work closely with product, design, and backend to ensure seamless integration and clarity
Contribute to architecture, performance, accessibility, and responsiveness across browsers
Help define our frontend system and component library as we scale
Elevate the quality of the product through thoughtful details, polish, and user empathy


How You’ll Work

You’ll collaborate with:
Founders, to understand vision and user context
Product & Design, to shape intuitive, elegant workflows
Backend Engineering, to align on data structures and performance


You’ll operate with full ownership: deploy daily, make fast decisions, and always aim for clarity.


What Sets You Up for Success

8+ years of experience in frontend development with React (Next.js a strong plus)
Solid grasp of JavaScript and TypeScript: scoping, closures, context, prototypes, classes, etc.
Strong understanding of responsive UI, accessibility, and usability principles
Experience building and testing APIs; comfort with HTTP, Postman, and debugging
Clear product thinking, eye for polish, and attention to design details
Pragmatic mindset: you move forward, make calls, and optimize for impact
Curiosity and autonomy — you dig in, learn fast, and solve problems without waiting


Why You’ll Thrive Here

You’ll own large parts of the UI in a fast-growing product
You’ll work closely with experienced founders who value product and engineering equally
You’ll build systems, not just features — and see your work go live, fast
You’ll have freedom to do your best work, with a team that moves fast and thinks clearly


Compensation & Benefits

Base salary: $100K–$175K USD
Equity: ~$40K+ USD
Option for B2B or full-time permanent position
Remote-first setup
15 PTO days + 12 public holidays
Visa sponsorship option for relocation to NYC within 2+ years
High-trust, high-autonomy team with real ownership


We currently have only one remaining seat for a Senior/Staff Frontend Engineer.


If you''re looking to work on meaningful product challenges, ship product incredibly fast, contribute to a clean and ambitious codebase, and help shape how AI becomes usable at scale — we’d love to hear from you.', 'free', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express.js", "GraphQL", "React Native", "Angular", "Tailwind CSS", "Webpack", "Jest", "Docker", "AWS Services", "PostgreSQL", "MongoDB", "Firebase", "Redis", "Auth0", "KeyCloak", "Hasura", "Supabase", "GatsbyJS", "Remix.run"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "summary": ["Seasoned [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]8+ years of experience[/HIGHLIGHT] in [HIGHLIGHT]full-stack development[/HIGHLIGHT] specializing in [HIGHLIGHT]React and Next.js[/HIGHLIGHT] applications for complex enterprise platforms", "Proven track record of [HIGHLIGHT]building and shipping major UI components[/HIGHLIGHT] and [HIGHLIGHT]owning features end-to-end[/HIGHLIGHT] in fast-paced environments, with expertise in modern frontend architecture and performance optimization", "Strong experience in [HIGHLIGHT]AI-powered platforms[/HIGHLIGHT] and [HIGHLIGHT]fintech applications[/HIGHLIGHT], having led development of healthcare, documentation, and learning platforms with complex workflows and real-time interactions"], "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": ["Implemented [HIGHLIGHT]modular, scalable backend and integration layers[/HIGHLIGHT] for the PlaySpace [HIGHLIGHT]Next.js agentic application[/HIGHLIGHT], enabling seamless partner platform integration", "Designed and optimized [HIGHLIGHT]real-time workflows and data pipelines[/HIGHLIGHT], contributed to secure multi-tenant infrastructure on [HIGHLIGHT]AWS EKS with Terraform[/HIGHLIGHT]", "Guided peers on [HIGHLIGHT]best practices for CI/CD, modular architecture[/HIGHLIGHT], and secure coding, improving team efficiency and system reliability"]}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": ["Developed and optimized the [HIGHLIGHT]AI-powered DevDocs platform[/HIGHLIGHT], enabling training of AI agents on user-connected resources and delivering context-aware responses", "Built and maintained [HIGHLIGHT]resource ingestion pipelines[/HIGHLIGHT], automated syncing of multiple knowledge sources, and vectorized storage to provide AI agents with structured context", "Contributed to [HIGHLIGHT]SDKs and reusable components[/HIGHLIGHT] for embedding AI workflows, while mentoring teammates on best practices for scalable, secure systems"]}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack engineer", "description": ["Led development as [HIGHLIGHT]Senior Full Stack Developer[/HIGHLIGHT], guiding team in designing dynamic frontend using [HIGHLIGHT]React, Redux, and Gatsby[/HIGHLIGHT]", "Architected and implemented [HIGHLIGHT]real-time communication features[/HIGHLIGHT] with Express.js and Socket.IO to enable seamless collaboration among users", "Oversaw secure data management using [HIGHLIGHT]MySQL and MinIO[/HIGHLIGHT], led deployment strategy with [HIGHLIGHT]Docker and AWS EC2[/HIGHLIGHT], configured Nginx for optimized content delivery"]}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": ["Developed and optimized [HIGHLIGHT]frontend features using React[/HIGHLIGHT] and Apollo Client, integrating with [HIGHLIGHT]Hasura-managed GraphQL APIs[/HIGHLIGHT]", "Leveraged [HIGHLIGHT]GraphQL Code Generator[/HIGHLIGHT] to produce reusable hooks for consistent and efficient data fetching across the platform", "Collaborated with cross-functional teams using [HIGHLIGHT]Agile methodologies[/HIGHLIGHT] to iteratively design, develop, and deliver responsive user experience"]}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Leading [HIGHLIGHT]backend and frontend development[/HIGHLIGHT] of PlaySpace, a therapeutic healthcare platform with [HIGHLIGHT]EHR capabilities[/HIGHLIGHT] and seamless third-party integration for partner healthcare systems", "Engineered [HIGHLIGHT]modular Next.js architecture[/HIGHLIGHT] supporting secure multi-tenant deployments and [HIGHLIGHT]real-time interactions[/HIGHLIGHT] across embedded modules", "Designed and implemented [HIGHLIGHT]secure authentication and role-based access control[/HIGHLIGHT] using Auth0, ensuring SOC 2 and HIPAA compliance for sensitive health data", "Built and optimized [HIGHLIGHT]backend microservices with Node.js[/HIGHLIGHT] to handle sensitive health data and real-time workflows, enabling smooth collaboration between therapists and clients", "Developed [HIGHLIGHT]flexible APIs and integration layers[/HIGHLIGHT] allowing external partners to embed PlaySpace modules or integrate features within their own systems", "[HIGHLIGHT]Mentored engineers[/HIGHLIGHT] on modular development, CI/CD best practices, and secure coding standards to maintain high code quality across projects"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Spearheaded [HIGHLIGHT]full stack development[/HIGHLIGHT] of DevDocs.ai, an [HIGHLIGHT]AI-powered documentation platform[/HIGHLIGHT] built with [HIGHLIGHT]Next.js and Supabase[/HIGHLIGHT]", "Designed and developed [HIGHLIGHT]resource APIs and syncing pipelines[/HIGHLIGHT] to ingest and maintain external data sources, with automated embedding and vector storage for contextual retrieval", "Implemented a [HIGHLIGHT]modular SDK[/HIGHLIGHT] providing three integration models: ready-to-use embedded widget, React hooks library for custom interfaces, and direct API access", "Integrated [HIGHLIGHT]OpenAI and OpenRouter APIs[/HIGHLIGHT] to power intelligent, context-aware agent responses with seamless user experience", "Orchestrated [HIGHLIGHT]background operations and large-scale workflows[/HIGHLIGHT] using Trigger.dev and edge functions for improved scalability and reliability", "Authored [HIGHLIGHT]internal documentation, SDK guides[/HIGHLIGHT], and reusable components that empowered other teams to build upon the platform seamlessly"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["Led the [HIGHLIGHT]design and development of multiple full stack web applications[/HIGHLIGHT] from concept to deployment, working extensively with [HIGHLIGHT]React, Angular, Node.js[/HIGHLIGHT], and modern frameworks", "Served as [HIGHLIGHT]technical lead for teams[/HIGHLIGHT] across React, Node, Angular, and React Native, [HIGHLIGHT]mentoring developers[/HIGHLIGHT] and establishing consistent engineering standards for scalable codebases", "Architected and delivered [HIGHLIGHT]end-to-end solutions[/HIGHLIGHT] including AI-driven learning platform, restaurant SaaS platform with modular architecture, and interactive piano learning portal with real-time features", "Improved overall project efficiency by introducing [HIGHLIGHT]Hasura for small-scale projects[/HIGHLIGHT], cutting backend setup time by nearly 40% and enabling faster MVP delivery", "Developed an [HIGHLIGHT]internal boilerplate framework[/HIGHLIGHT] with built-in authentication options and modular architecture, reducing new project initialization time significantly", "Directed [HIGHLIGHT]CI/CD pipeline improvements[/HIGHLIGHT] using Jenkins, Bitbucket Pipelines, and GitHub Actions to streamline deployments across multiple environments"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Collaborated closely with senior developers applying [HIGHLIGHT]Agile methodologies[/HIGHLIGHT] in web development projects while participating in code reviews to enhance coding skills", "Troubleshot issues in both [HIGHLIGHT]front-end and back-end code[/HIGHLIGHT] using [HIGHLIGHT]Angular, React, Bootstrap[/HIGHLIGHT], and other modern JavaScript frameworks", "Assisted in maintaining and updating web applications working with [HIGHLIGHT]back-end technologies such as Laravel and Node.js[/HIGHLIGHT] along with databases including MySQL, PostgreSQL, MongoDB", "Utilized [HIGHLIGHT]Git for version control[/HIGHLIGHT] to ensure clean and maintainable code while adhering to web development best practices and consistently delivering high-quality output"]}]}', '2025-11-05 00:31:35.489508+00');
INSERT INTO public.resumes VALUES ('7a5bc8e2-1c7c-46f9-b341-738bddd37661', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior dev', 'About the job
👀 TL;DR

Elite team of FE engineers building complex AI accounting & fintech product
Huge momentum, growing fast, huge product & AI roadmap
High-speed development - one of the fastest teams on the planet 
Comp: $110k-$175k USD base + $40k USD equity ($150k-$215k USD total) 
Backed by top San Francisco & New York VCs 
Remote with in-person meetups & daily New York EST timezone overlap 
Founders built & exited prior company at 100M ARR and 350+ people


Why This Role Matters Now

We’re growing our Engineering team and hiring our next Staff Frontend Engineer to increase our product velocity, own features end-to-end and bring DualEntry’s AI-powered accounting platform to the world’s fastest-growing companies.


About DualEntry

Founded in 2024, DualEntry is one of NYC’s fastest-growing AI startups, backed by top-tier VCs and 30+ unicorn founders.


Our team previously built a $100M ARR business from scratch, scaled it to 300+ people, and led a successful exit. Now, we’re building a category-defining SaaS product to automate and modernize enterprise accounting — one of the most painful and outdated workflows in finance.


We move fast, build with precision, and care deeply about what we ship.


📍 Location: Remote-first. Preference for European time zones with overlap to US EST working hours.


Where You’ll Create Impact

Build, ship, and own major parts of the product UI in React + Next.js
Design and optimize interactive experiences that make complex workflows simple
Work closely with product, design, and backend to ensure seamless integration and clarity
Contribute to architecture, performance, accessibility, and responsiveness across browsers
Help define our frontend system and component library as we scale
Elevate the quality of the product through thoughtful details, polish, and user empathy


How You’ll Work

You’ll collaborate with:
Founders, to understand vision and user context
Product & Design, to shape intuitive, elegant workflows
Backend Engineering, to align on data structures and performance


You’ll operate with full ownership: deploy daily, make fast decisions, and always aim for clarity.


What Sets You Up for Success

8+ years of experience in frontend development with React (Next.js a strong plus)
Solid grasp of JavaScript and TypeScript: scoping, closures, context, prototypes, classes, etc.
Strong understanding of responsive UI, accessibility, and usability principles
Experience building and testing APIs; comfort with HTTP, Postman, and debugging
Clear product thinking, eye for polish, and attention to design details
Pragmatic mindset: you move forward, make calls, and optimize for impact
Curiosity and autonomy — you dig in, learn fast, and solve problems without waiting


Why You’ll Thrive Here

You’ll own large parts of the UI in a fast-growing product
You’ll work closely with experienced founders who value product and engineering equally
You’ll build systems, not just features — and see your work go live, fast
You’ll have freedom to do your best work, with a team that moves fast and thinks clearly


Compensation & Benefits

Base salary: $100K–$175K USD
Equity: ~$40K+ USD
Option for B2B or full-time permanent position
Remote-first setup
15 PTO days + 12 public holidays
Visa sponsorship option for relocation to NYC within 2+ years
High-trust, high-autonomy team with real ownership


We currently have only one remaining seat for a Senior/Staff Frontend Engineer.


If you''re looking to work on meaningful product challenges, ship product incredibly fast, contribute to a clean and ambitious codebase, and help shape how AI becomes usable at scale — we’d love to hear from you.


', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "GraphQL", "React Native", "Angular", "Express.js", "Docker", "AWS Services", "PostgreSQL", "MongoDB", "MySQL", "Redis", "Tailwind CSS", "Webpack", "Jest", "Auth0", "KeyCloak", "Supabase", "Hasura", "Firebase", "Nginx"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Enhanced [HIGHLIGHT]platform scalability[/HIGHLIGHT] by deploying a modular [HIGHLIGHT]Next.js architecture[/HIGHLIGHT] supporting [HIGHLIGHT]secure multi-tenant deployments[/HIGHLIGHT] and [HIGHLIGHT]real-time interactions[/HIGHLIGHT] across embedded modules.", "Strengthened [HIGHLIGHT]system security[/HIGHLIGHT] and [HIGHLIGHT]regulatory compliance[/HIGHLIGHT] by implementing [HIGHLIGHT]Auth0-based authentication[/HIGHLIGHT] and [HIGHLIGHT]role-based access control[/HIGHLIGHT] meeting SOC 2 and HIPAA standards.", "Improved [HIGHLIGHT]backend performance[/HIGHLIGHT] and [HIGHLIGHT]data handling[/HIGHLIGHT] through optimized [HIGHLIGHT]Node.js microservices[/HIGHLIGHT] managing sensitive health data and real-time workflows.", "Accelerated [HIGHLIGHT]partner integration[/HIGHLIGHT] by developing [HIGHLIGHT]flexible APIs[/HIGHLIGHT] and integration layers enabling external systems to embed PlaySpace modules seamlessly.", "Increased [HIGHLIGHT]system reliability[/HIGHLIGHT] and [HIGHLIGHT]performance visibility[/HIGHLIGHT] by implementing [HIGHLIGHT]AWS CloudWatch monitoring[/HIGHLIGHT] and observability pipelines.", "Enhanced [HIGHLIGHT]team productivity[/HIGHLIGHT] by [HIGHLIGHT]mentoring engineers[/HIGHLIGHT] on modular development, [HIGHLIGHT]CI/CD best practices[/HIGHLIGHT], and secure coding standards."]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Delivered [HIGHLIGHT]AI-powered platform[/HIGHLIGHT] architecture by spearheading full-stack development of DevDocs.ai using [HIGHLIGHT]Next.js and Supabase[/HIGHLIGHT] with intelligent documentation capabilities.", "Enhanced [HIGHLIGHT]data integration efficiency[/HIGHLIGHT] by designing [HIGHLIGHT]resource APIs[/HIGHLIGHT] and syncing pipelines with automated embedding and [HIGHLIGHT]vector storage[/HIGHLIGHT] for contextual retrieval.", "Accelerated [HIGHLIGHT]developer adoption[/HIGHLIGHT] by implementing a [HIGHLIGHT]modular SDK[/HIGHLIGHT] offering embedded widgets, [HIGHLIGHT]React hooks library[/HIGHLIGHT], and direct API access options.", "Improved [HIGHLIGHT]AI response quality[/HIGHLIGHT] by integrating [HIGHLIGHT]OpenAI and OpenRouter APIs[/HIGHLIGHT] for context-aware agent interactions and intelligent assistance.", "Increased [HIGHLIGHT]platform scalability[/HIGHLIGHT] by orchestrating [HIGHLIGHT]background operations[/HIGHLIGHT] using Trigger.dev and edge functions for large-scale workflows.", "Strengthened [HIGHLIGHT]developer experience[/HIGHLIGHT] by authoring comprehensive [HIGHLIGHT]SDK documentation[/HIGHLIGHT] and reusable components enabling seamless platform adoption."]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["Led [HIGHLIGHT]full-stack development[/HIGHLIGHT] of multiple web applications using [HIGHLIGHT]React, Angular, and Node.js[/HIGHLIGHT] with modern frameworks including [HIGHLIGHT]NestJS and Express[/HIGHLIGHT] from concept to deployment.", "Enhanced [HIGHLIGHT]team performance[/HIGHLIGHT] by serving as [HIGHLIGHT]technical lead[/HIGHLIGHT] across React, Node, Angular, and [HIGHLIGHT]React Native teams[/HIGHLIGHT], establishing scalable engineering standards.", "Accelerated [HIGHLIGHT]project delivery[/HIGHLIGHT] by introducing [HIGHLIGHT]Hasura integration[/HIGHLIGHT] for small-scale projects, reducing [HIGHLIGHT]backend setup time by 40%[/HIGHLIGHT] and enabling faster MVP delivery.", "Improved [HIGHLIGHT]deployment efficiency[/HIGHLIGHT] by developing internal [HIGHLIGHT]boilerplate framework[/HIGHLIGHT] with built-in authentication and modular architecture, significantly reducing project initialization time.", "Streamlined [HIGHLIGHT]development workflows[/HIGHLIGHT] by directing [HIGHLIGHT]CI/CD pipeline improvements[/HIGHLIGHT] using Jenkins, Bitbucket Pipelines, and [HIGHLIGHT]GitHub Actions[/HIGHLIGHT] across multiple environments.", "Enhanced [HIGHLIGHT]user experience[/HIGHLIGHT] by actively contributing to [HIGHLIGHT]web performance optimization[/HIGHLIGHT] and Core Web Vitals improvements across several products."]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Strengthened [HIGHLIGHT]frontend development skills[/HIGHLIGHT] by collaborating with senior developers on [HIGHLIGHT]React and Angular projects[/HIGHLIGHT] using modern JavaScript frameworks and Bootstrap.", "Enhanced [HIGHLIGHT]full-stack capabilities[/HIGHLIGHT] by working with [HIGHLIGHT]Laravel and Node.js[/HIGHLIGHT] backend technologies alongside [HIGHLIGHT]MySQL, PostgreSQL, and MongoDB[/HIGHLIGHT] databases.", "Improved [HIGHLIGHT]code quality[/HIGHLIGHT] by participating in code reviews, troubleshooting issues, and adhering to [HIGHLIGHT]web development best practices[/HIGHLIGHT] using Git version control.", "Maintained [HIGHLIGHT]project delivery standards[/HIGHLIGHT] by consistently completing tasks within timelines and delivering high-quality output in [HIGHLIGHT]HTML, CSS, and JavaScript[/HIGHLIGHT]."]}]}', '2025-11-05 00:40:46.021791+00');
INSERT INTO public.resumes VALUES ('7d0d3236-0fc8-4a7f-a4ed-b36d1fd61e6f', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior software Engineer - DualEntry', 'About the job
👀 TL;DR

Elite team of FE engineers building complex AI accounting & fintech product
Huge momentum, growing fast, huge product & AI roadmap
High-speed development - one of the fastest teams on the planet 
Comp: $110k-$175k USD base + $40k USD equity ($150k-$215k USD total) 
Backed by top San Francisco & New York VCs 
Remote with in-person meetups & daily New York EST timezone overlap 
Founders built & exited prior company at 100M ARR and 350+ people


Why This Role Matters Now

We’re growing our Engineering team and hiring our next Staff Frontend Engineer to increase our product velocity, own features end-to-end and bring DualEntry’s AI-powered accounting platform to the world’s fastest-growing companies.


About DualEntry

Founded in 2024, DualEntry is one of NYC’s fastest-growing AI startups, backed by top-tier VCs and 30+ unicorn founders.


Our team previously built a $100M ARR business from scratch, scaled it to 300+ people, and led a successful exit. Now, we’re building a category-defining SaaS product to automate and modernize enterprise accounting — one of the most painful and outdated workflows in finance.


We move fast, build with precision, and care deeply about what we ship.


📍 Location: Remote-first. Preference for European time zones with overlap to US EST working hours.


Where You’ll Create Impact

Build, ship, and own major parts of the product UI in React + Next.js
Design and optimize interactive experiences that make complex workflows simple
Work closely with product, design, and backend to ensure seamless integration and clarity
Contribute to architecture, performance, accessibility, and responsiveness across browsers
Help define our frontend system and component library as we scale
Elevate the quality of the product through thoughtful details, polish, and user empathy


How You’ll Work

You’ll collaborate with:
Founders, to understand vision and user context
Product & Design, to shape intuitive, elegant workflows
Backend Engineering, to align on data structures and performance


You’ll operate with full ownership: deploy daily, make fast decisions, and always aim for clarity.


What Sets You Up for Success

8+ years of experience in frontend development with React (Next.js a strong plus)
Solid grasp of JavaScript and TypeScript: scoping, closures, context, prototypes, classes, etc.
Strong understanding of responsive UI, accessibility, and usability principles
Experience building and testing APIs; comfort with HTTP, Postman, and debugging
Clear product thinking, eye for polish, and attention to design details
Pragmatic mindset: you move forward, make calls, and optimize for impact
Curiosity and autonomy — you dig in, learn fast, and solve problems without waiting


Why You’ll Thrive Here

You’ll own large parts of the UI in a fast-growing product
You’ll work closely with experienced founders who value product and engineering equally
You’ll build systems, not just features — and see your work go live, fast
You’ll have freedom to do your best work, with a team that moves fast and thinks clearly


Compensation & Benefits

Base salary: $100K–$175K USD
Equity: ~$40K+ USD
Option for B2B or full-time permanent position
Remote-first setup
15 PTO days + 12 public holidays
Visa sponsorship option for relocation to NYC within 2+ years
High-trust, high-autonomy team with real ownership


We currently have only one remaining seat for a Senior/Staff Frontend Engineer.


If you''re looking to work on meaningful product challenges, ship product incredibly fast, contribute to a clean and ambitious codebase, and help shape how AI becomes usable at scale — we’d love to hear from you.


', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express.js", "GraphQL", "Angular", "React Native", "Tailwind CSS", "Webpack", "Jest", "Docker", "AWS Services", "PostgreSQL", "MySQL", "MongoDB", "Firebase", "Redis", "Auth0", "KeyCloak", "Nginx", "Hasura", "Supabase"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "summary": ["Senior Software Engineer with [HIGHLIGHT]8+ years of experience[/HIGHLIGHT] in [HIGHLIGHT]React and Next.js[/HIGHLIGHT] development, specializing in building complex [HIGHLIGHT]AI-powered platforms[/HIGHLIGHT] and [HIGHLIGHT]enterprise-grade applications[/HIGHLIGHT]", "Proven track record of [HIGHLIGHT]owning features end-to-end[/HIGHLIGHT] and [HIGHLIGHT]shipping products fast[/HIGHLIGHT] in high-velocity environments, with expertise in [HIGHLIGHT]TypeScript[/HIGHLIGHT] and modern frontend architecture", "Technical leader with experience [HIGHLIGHT]mentoring engineering teams[/HIGHLIGHT] and establishing [HIGHLIGHT]scalable component libraries[/HIGHLIGHT], delivering [HIGHLIGHT]responsive UI[/HIGHLIGHT] solutions for fintech and healthcare platforms"], "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Enhanced [HIGHLIGHT]platform scalability[/HIGHLIGHT] by deploying a modular [HIGHLIGHT]Next.js architecture[/HIGHLIGHT] supporting [HIGHLIGHT]secure multi-tenant deployments[/HIGHLIGHT] and [HIGHLIGHT]real-time interactions[/HIGHLIGHT] across embedded modules", "Strengthened [HIGHLIGHT]system security[/HIGHLIGHT] and [HIGHLIGHT]compliance standards[/HIGHLIGHT] by implementing [HIGHLIGHT]role-based access control[/HIGHLIGHT] with Auth0, ensuring SOC 2 and HIPAA compliance for healthcare data", "Improved [HIGHLIGHT]backend performance[/HIGHLIGHT] and [HIGHLIGHT]workflow efficiency[/HIGHLIGHT] through optimized [HIGHLIGHT]Node.js microservices[/HIGHLIGHT] handling sensitive health data and real-time therapist-client interactions", "Increased [HIGHLIGHT]partner integration capabilities[/HIGHLIGHT] by developing [HIGHLIGHT]flexible APIs[/HIGHLIGHT] and integration layers enabling external systems to embed PlaySpace modules seamlessly", "Enhanced [HIGHLIGHT]system reliability[/HIGHLIGHT] and [HIGHLIGHT]performance visibility[/HIGHLIGHT] through [HIGHLIGHT]AWS CloudWatch monitoring[/HIGHLIGHT] and infrastructure provisioning with Terraform on AWS EKS", "Elevated [HIGHLIGHT]team productivity[/HIGHLIGHT] and [HIGHLIGHT]code quality[/HIGHLIGHT] by mentoring engineers on [HIGHLIGHT]modular development[/HIGHLIGHT], CI/CD best practices, and secure coding standards"]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Accelerated [HIGHLIGHT]product development velocity[/HIGHLIGHT] by spearheading [HIGHLIGHT]full stack development[/HIGHLIGHT] of DevDocs.ai, an [HIGHLIGHT]AI-powered platform[/HIGHLIGHT] built with [HIGHLIGHT]Next.js and Supabase[/HIGHLIGHT]", "Enhanced [HIGHLIGHT]developer experience[/HIGHLIGHT] and [HIGHLIGHT]platform adoption[/HIGHLIGHT] by implementing a [HIGHLIGHT]modular SDK[/HIGHLIGHT] with three integration models including embedded widgets and [HIGHLIGHT]React hooks library[/HIGHLIGHT]", "Improved [HIGHLIGHT]AI response accuracy[/HIGHLIGHT] and [HIGHLIGHT]contextual relevance[/HIGHLIGHT] by designing resource APIs with automated embedding and vector storage for intelligent data retrieval", "Increased [HIGHLIGHT]system scalability[/HIGHLIGHT] and [HIGHLIGHT]operational reliability[/HIGHLIGHT] by orchestrating background operations using Trigger.dev and edge functions for large-scale workflows", "Strengthened [HIGHLIGHT]team collaboration[/HIGHLIGHT] and [HIGHLIGHT]platform extensibility[/HIGHLIGHT] by authoring comprehensive SDK guides and reusable components for seamless development"]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["Led [HIGHLIGHT]end-to-end product development[/HIGHLIGHT] and [HIGHLIGHT]technical architecture[/HIGHLIGHT] for multiple [HIGHLIGHT]full stack applications[/HIGHLIGHT] using [HIGHLIGHT]React, Angular, and Node.js[/HIGHLIGHT] from concept to deployment", "Enhanced [HIGHLIGHT]team efficiency[/HIGHLIGHT] and [HIGHLIGHT]engineering standards[/HIGHLIGHT] by serving as technical lead for [HIGHLIGHT]React, Node, Angular, and React Native teams[/HIGHLIGHT], mentoring developers on scalable codebases", "Reduced [HIGHLIGHT]backend setup time by 40%[/HIGHLIGHT] and accelerated [HIGHLIGHT]MVP delivery[/HIGHLIGHT] by introducing Hasura for small-scale projects and developing internal boilerplate frameworks", "Improved [HIGHLIGHT]deployment efficiency[/HIGHLIGHT] and [HIGHLIGHT]system reliability[/HIGHLIGHT] by directing [HIGHLIGHT]CI/CD pipeline improvements[/HIGHLIGHT] using Jenkins, Bitbucket Pipelines, and GitHub Actions across multiple environments", "Enhanced [HIGHLIGHT]web performance[/HIGHLIGHT] and [HIGHLIGHT]user experience[/HIGHLIGHT] by actively contributing to Core Web Vitals improvements across several products, ensuring optimal loading and responsiveness", "Strengthened [HIGHLIGHT]project scalability[/HIGHLIGHT] and [HIGHLIGHT]business alignment[/HIGHLIGHT] by collaborating with stakeholders to define technical roadmaps and ensure long-term maintainability"]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Strengthened [HIGHLIGHT]frontend development skills[/HIGHLIGHT] and [HIGHLIGHT]code quality[/HIGHLIGHT] by collaborating with senior developers using [HIGHLIGHT]Angular, React, and Bootstrap[/HIGHLIGHT] while participating in comprehensive code reviews", "Enhanced [HIGHLIGHT]full stack capabilities[/HIGHLIGHT] and [HIGHLIGHT]database management[/HIGHLIGHT] by maintaining web applications with [HIGHLIGHT]Laravel and Node.js[/HIGHLIGHT] backends integrated with MySQL, PostgreSQL, and MongoDB", "Improved [HIGHLIGHT]development workflow[/HIGHLIGHT] and [HIGHLIGHT]code maintainability[/HIGHLIGHT] by utilizing Git for version control and adhering to web development best practices in [HIGHLIGHT]HTML, CSS, and JavaScript[/HIGHLIGHT]", "Demonstrated [HIGHLIGHT]reliable delivery[/HIGHLIGHT] and [HIGHLIGHT]quality output[/HIGHLIGHT] by consistently completing tasks within timelines while applying Agile methodologies across multiple projects"]}]}', '2025-11-05 01:12:58.010361+00');
INSERT INTO public.resumes VALUES ('8bac54e5-f526-4f7a-9488-bedc0451269e', '72e83701-5723-428c-b153-0a957cad5e78', 'Fullstack Engineer - Deel', 'About the job
Who We Are Is What We Do.

Deel is the all-in-one payroll and HR platform for global teams. Our vision is to unlock global opportunity for every person, team, and business. Built for the way the world works today, Deel combines HRIS, payroll, compliance, benefits, performance, and equipment management into one seamless platform. With AI-powered tools and a fully owned payroll infrastructure, Deel supports every worker type in 150+ countries—helping businesses scale smarter, faster, and more compliantly.

Among the largest globally distributed companies in the world, our team of 6,000 spans more than 100 countries, speaks 74 languages, and brings a connected and dynamic culture that drives continuous learning and innovation for our customers.

Why should you be part of our success story?

As the fastest-growing Software as a Service (SaaS) company in history, Deel is transforming how global talent connects with world-class companies – breaking down borders that have traditionally limited both hiring and career opportunities. We''re not just building software; we''re creating the infrastructure for the future of work, enabling a more diverse and inclusive global economy. In 2024 alone, we paid $11.2 billion to workers in nearly 100 currencies and provided healthcare and benefits to workers in 109 countries—ensuring people get paid and protected, no matter where they are.

Our momentum is reflected in our achievements and customer satisfaction: CNBC Disruptor 50, Forbes Cloud 100, Deloitte Fast 500, and repeated recognition on Y Combinator’s top companies list – all while maintaining a 4.83 average rating from 15,000 reviews across G2, Trustpilot, Captera, Apple and Google.

Your experience at Deel will be a career accelerator. At the forefront of the global work revolution, you''ll tackle complex challenges that impact millions of people''s working lives. With our momentum—backed by a $12 billion valuation and $1 B in Annual Recurring Revenue (ARR) in just over five years—you''ll drive meaningful impact while building expertise that makes you a sought-after leader in the transformation of global work.

Get ready to:

Be a part of a truly cross-functional team; Backend Engineers, Frontend Engineers, Product Teams, Designers and QA’s.
Participate in product planning (From discovery all the way to deployment); We want your input at all stages of the Software Development Lifecycle!
Collaborate! Our teams work together to develop robust new features, API’s, continuously improve our industry-leading products and find and fix any bugs at DeelSpeed.
Ensure our customers receive a white-glove experience with our products!
Fully own the development of features on the client, server, service, and database

The bits and bytes that you’ll bring to your new team:

You will develop high-quality, responsive web applications using TypeScript, Javascript, React, Express. Experience with NestJS, Vite, and Next.js is a plus.
You will design and implement server-side APIs, data models, and business logic using mainly Express framework
You will create client-side function-based React components, hooks, stories, and tests to interact with your server-side work
You will create and optimize database schemas, queries, and interactions with Postgres.
You will build reusable and modular components on both the front and back end that promote code reusability, maintainability, and scalability.
You will perform thorough testing, debugging, and troubleshooting of applications to ensure high-quality deliverables.
You will stay updated with emerging web development trends, frameworks, and best practices, and recommend improvements to enhance development processes.
You will participate in code reviews and provide constructive feedback to team members to maintain code quality standards.
You will communicate project progress, challenges, and solutions effectively to team members and stakeholders.
Contribute to the continuous improvement of development processes, methodologies, and tools.

You''re the Engineer we''re looking for if you:

At least 4 years of Full-Stack experience, with a focus on TypeScript development.
Expert in the art of designing, coding, testing, and maintaining applications using the tech listed above.
Thrive in a collaborative, remote-first work culture where teamwork and camaraderie are key.
Embrace independence and take ownership of your projects, yet also excel in a team setting and love to contribute.
Communicate complex ideas with ease and enjoy collaborating with diverse teams of technical and non-technical stakeholders.
Are passionate about solving customer problems with your coding superpowers, and are a natural at troubleshooting issues.
Take a business-focused approach to software development, with a keen eye on delivering high-value outcomes for our clients.
Obsess over details, and always keep the customer experience top of mind.

Extra brownie points if you:

Have experience with SaaS products running 24/7 on a major cloud vendor.
Solid understanding of RESTful APIs, microservices architecture, and asynchronous programming.
Experience with testing frameworks (Jest, Mocha, Chai, Storybook, React Testing Library) and automated testing methodologies (Cypress).
Knowledge of containerization technologies (Docker, Kubernetes)

Total Rewards

Our workforce deserves fair and competitive pay that meets them where they are. With scalable benefits, rewards, and perks, our total rewards programs reflect our commitment to inclusivity and access for all.

Some things you’ll enjoy

Stock grant opportunities dependent on your role, employment status and location
Additional perks and benefits based on your employment status and country
The flexibility of remote work, including optional WeWork access

At Deel, we’re an equal-opportunity employer that values diversity and positively encourage applications from suitably qualified and eligible candidates regardless of race, religion, sex, national origin, gender, sexual orientation, age, marital status, veteran status, disability status, pregnancy or maternity or other applicable legally protected characteristics.

Unless otherwise agreed, we will communicate with job applicants using Deel-specific emails, which include @deel.com and other acquired company emails like @payspace.com and @paygroup.com. You can view the most up-to-date job listings at Deel by visitingour careers page.

Deel is an equal-opportunity employer and is committed to cultivating a diverse and inclusive workplace that reflects different abilities, backgrounds, beliefs, experiences, identities and perspectives.

Deel will provide accommodation on request throughout the recruitment, selection and assessment process for applicants with disabilities. If you require accommodation, please inform our Talent Acquisition Team at recruiting@deel.com of the nature of the accommodation that you may require, to ensure your equal participation.

We use Covey as part of our hiring and/or promotional processes. As part of the evaluation process, we provide Covey with job requirements and candidate-submitted applications. Certain features of the platform may qualify it as an Automated Employment Decision Tool (AEDT) under applicable regulations. For positions in New York City, our use of Covey complies with NYC Local Law 144.', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["TypeScript", "JavaScript", "React", "Express.js", "Node.js", "NestJS", "Next.js", "PostgreSQL", "RESTful APIs", "Microservices Architecture", "Docker", "Jest", "React Testing Library", "AWS Services", "GraphQL", "Angular", "Redux", "MySQL", "MongoDB", "Firebase", "Redis", "Webpack", "Tailwind CSS", "Nginx"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": ["[HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]7+ years of experience[/HIGHLIGHT] in [HIGHLIGHT]full-stack development[/HIGHLIGHT] using [HIGHLIGHT]TypeScript, React, and Node.js[/HIGHLIGHT], specializing in scalable web applications and microservices architecture.", "Proven expertise in [HIGHLIGHT]Express.js and NestJS frameworks[/HIGHLIGHT] with extensive experience in [HIGHLIGHT]PostgreSQL database design[/HIGHLIGHT] and [HIGHLIGHT]RESTful API development[/HIGHLIGHT] for high-performance SaaS platforms.", "Strong background in [HIGHLIGHT]collaborative development[/HIGHLIGHT] and [HIGHLIGHT]cross-functional team leadership[/HIGHLIGHT], with demonstrated success in [HIGHLIGHT]mentoring engineers[/HIGHLIGHT] and delivering business-focused solutions in remote-first environments.", "Experience building [HIGHLIGHT]modular, reusable components[/HIGHLIGHT] and implementing [HIGHLIGHT]CI/CD pipelines[/HIGHLIGHT] with [HIGHLIGHT]Docker containerization[/HIGHLIGHT] for scalable, maintainable applications serving large user bases."], "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Enhanced [HIGHLIGHT]platform scalability[/HIGHLIGHT] by architecting [HIGHLIGHT]modular Next.js microservices[/HIGHLIGHT] supporting [HIGHLIGHT]multi-tenant deployments[/HIGHLIGHT] and [HIGHLIGHT]real-time interactions[/HIGHLIGHT] across therapeutic healthcare modules.", "Improved [HIGHLIGHT]system security and compliance[/HIGHLIGHT] by implementing [HIGHLIGHT]Auth0-based authentication[/HIGHLIGHT] and [HIGHLIGHT]role-based access control[/HIGHLIGHT] meeting [HIGHLIGHT]SOC 2 and HIPAA standards[/HIGHLIGHT].", "Increased [HIGHLIGHT]operational efficiency[/HIGHLIGHT] by building [HIGHLIGHT]optimized Node.js backend microservices[/HIGHLIGHT] for [HIGHLIGHT]sensitive health data processing[/HIGHLIGHT] and [HIGHLIGHT]real-time workflow management[/HIGHLIGHT].", "Strengthened [HIGHLIGHT]partner integration capabilities[/HIGHLIGHT] by developing [HIGHLIGHT]flexible APIs and integration layers[/HIGHLIGHT] enabling [HIGHLIGHT]seamless third-party system embedding[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]system reliability[/HIGHLIGHT] by implementing [HIGHLIGHT]AWS CloudWatch monitoring[/HIGHLIGHT] and contributing to [HIGHLIGHT]AWS EKS deployments[/HIGHLIGHT] with [HIGHLIGHT]Terraform infrastructure[/HIGHLIGHT].", "Improved [HIGHLIGHT]team productivity[/HIGHLIGHT] by [HIGHLIGHT]mentoring engineers[/HIGHLIGHT] on [HIGHLIGHT]modular development practices[/HIGHLIGHT] and [HIGHLIGHT]CI/CD best practices[/HIGHLIGHT]."]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Delivered [HIGHLIGHT]scalable AI-powered platform[/HIGHLIGHT] by spearheading [HIGHLIGHT]full-stack development[/HIGHLIGHT] of DevDocs.ai using [HIGHLIGHT]Next.js and Supabase[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]developer experience[/HIGHLIGHT] by designing [HIGHLIGHT]modular SDK architecture[/HIGHLIGHT] providing [HIGHLIGHT]embedded widgets, React hooks library, and direct API access[/HIGHLIGHT].", "Improved [HIGHLIGHT]system performance[/HIGHLIGHT] by orchestrating [HIGHLIGHT]background operations[/HIGHLIGHT] using [HIGHLIGHT]Trigger.dev and edge functions[/HIGHLIGHT] for [HIGHLIGHT]large-scale workflow processing[/HIGHLIGHT].", "Increased [HIGHLIGHT]platform adoption[/HIGHLIGHT] by integrating [HIGHLIGHT]OpenAI and OpenRouter APIs[/HIGHLIGHT] for [HIGHLIGHT]intelligent, context-aware responses[/HIGHLIGHT].", "Strengthened [HIGHLIGHT]team collaboration[/HIGHLIGHT] by authoring [HIGHLIGHT]comprehensive SDK documentation[/HIGHLIGHT] and [HIGHLIGHT]reusable components[/HIGHLIGHT] enabling seamless platform extension."]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["Led [HIGHLIGHT]cross-functional development teams[/HIGHLIGHT] across [HIGHLIGHT]React, Node.js, Angular, and React Native[/HIGHLIGHT] projects, establishing [HIGHLIGHT]engineering standards[/HIGHLIGHT] for [HIGHLIGHT]scalable codebases[/HIGHLIGHT].", "Improved [HIGHLIGHT]project delivery efficiency[/HIGHLIGHT] by [HIGHLIGHT]40%[/HIGHLIGHT] through [HIGHLIGHT]Hasura integration[/HIGHLIGHT] and developing [HIGHLIGHT]internal boilerplate frameworks[/HIGHLIGHT] with [HIGHLIGHT]built-in authentication[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]deployment reliability[/HIGHLIGHT] by implementing [HIGHLIGHT]CI/CD pipelines[/HIGHLIGHT] using [HIGHLIGHT]GitHub Actions, Jenkins, and Docker[/HIGHLIGHT] across [HIGHLIGHT]multiple environments[/HIGHLIGHT].", "Increased [HIGHLIGHT]user engagement[/HIGHLIGHT] by architecting [HIGHLIGHT]end-to-end solutions[/HIGHLIGHT] including [HIGHLIGHT]AI-driven learning features[/HIGHLIGHT] and [HIGHLIGHT]real-time collaboration platforms[/HIGHLIGHT].", "Strengthened [HIGHLIGHT]operational efficiency[/HIGHLIGHT] by implementing [HIGHLIGHT]automated standup processes[/HIGHLIGHT] and [HIGHLIGHT]performance optimization strategies[/HIGHLIGHT] improving [HIGHLIGHT]Core Web Vitals[/HIGHLIGHT].", "Improved [HIGHLIGHT]stakeholder alignment[/HIGHLIGHT] by defining [HIGHLIGHT]technical roadmaps[/HIGHLIGHT] ensuring [HIGHLIGHT]product scalability[/HIGHLIGHT] and [HIGHLIGHT]long-term business goal alignment[/HIGHLIGHT]."]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Enhanced [HIGHLIGHT]coding proficiency[/HIGHLIGHT] through [HIGHLIGHT]collaborative development[/HIGHLIGHT] with [HIGHLIGHT]senior developers[/HIGHLIGHT] and [HIGHLIGHT]code review participation[/HIGHLIGHT] using [HIGHLIGHT]Agile methodologies[/HIGHLIGHT].", "Improved [HIGHLIGHT]application reliability[/HIGHLIGHT] by troubleshooting [HIGHLIGHT]front-end and back-end issues[/HIGHLIGHT] using [HIGHLIGHT]Angular, React, and Bootstrap[/HIGHLIGHT] frameworks.", "Strengthened [HIGHLIGHT]database management skills[/HIGHLIGHT] by working with [HIGHLIGHT]Laravel and Node.js[/HIGHLIGHT] backends connected to [HIGHLIGHT]MySQL, PostgreSQL, MongoDB, and Firebase[/HIGHLIGHT].", "Maintained [HIGHLIGHT]code quality standards[/HIGHLIGHT] by utilizing [HIGHLIGHT]Git version control[/HIGHLIGHT] and adhering to [HIGHLIGHT]web development best practices[/HIGHLIGHT] for [HIGHLIGHT]timely project delivery[/HIGHLIGHT]."]}]}', '2025-11-09 20:49:32.166289+00');
INSERT INTO public.resumes VALUES ('04daf628-af84-4bac-9502-ade0cc3d6497', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Full stack engineer', 'Why we’re looking for you

We are looking for a mission-driven senior engineer who is passionate about their craft and committed to building incredible products for our customers.


This role is 100% remote and can be based anywhere in the United States or Canada. For San Francisco-based candidates: we have a new HQ in the Presidio for optional in-person collaboration opportunities!


Our Tech Stack:

Frontend: [React, Next.js, Vue]
Backend: [Node.js, Mongo]
Typescript everywhere


💥 The impact you will have

Build new products and features 0 to 1
Take ownership of projects from conception all the way to shipping, ensuring modular, maintainable, and high-quality code
Deliver value to our end users across our entire system while considering performance, scale, security, and maintainability
Shape our product direction by talking to users and collaborating with other teammates in feature brainstorms/roadmap planning
Provide thoughtful code reviews and technical guidance to peers, helping to improve overall team quality
Help us build a great team — interview candidates, refer great engineers, etc.


✅ What we’re looking for

5+ years of experience building applications
Extensive Typescript experience
Experience scaling with frontend stack (React, Next.js, etc.) and/or our backend stack (Nodejs, Mongo, AWS)
Experience at product-focused startup/scale-up or technology company
High degree of cross-functional collaboration—past colleagues in product, design, and business would speak highly of your teamwork
Dedicated to continuous professional development and possessing a lifelong-learner mindset
Strong sense of ownership and drive, excellent communication, and a proactive approach to identifying and solving problems


🏆 Pay and benefits

The estimated starting base salary range for this role is $190K - $220K depending on level, location and experience, plus a generous pre-IPO equity package
Other benefits include comprehensive health coverage, work from anywhere (remote-first workplace), unlimited PTO - plus extra fun perks!', 'strict', 'classic', '{"summary_format": "paragraph", "projects_format": "paragraph", "work_experience_format": "paragraph", "highlight_important_content": true}', '{"skills": ["Node.js", "React", "Docker", "Next.js", "AWS Services", "Express.js", "TypeScript", "GraphQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Jest", "Nginx", "Webpack"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "location": "Kitchener, ON"}, "summary": "Senior Software Engineer with over [HIGHLIGHT]7 years[/HIGHLIGHT] of experience in [HIGHLIGHT]full-stack development[/HIGHLIGHT] and [HIGHLIGHT]cloud architecture[/HIGHLIGHT]. Experienced in building scalable systems using [HIGHLIGHT]Node.js, React, Docker, Next.js[/HIGHLIGHT], and [HIGHLIGHT]AWS services[/HIGHLIGHT], ensuring high performance, security, and reliability.", "projects": [{"link": "", "name": "PlaySpace", "role": "Senior Software Engineer", "description": "Collaborated to implement modular, scalable backend and integration layers for the PlaySpace Next.js application. Guided peers on CI/CD best practices, designed real-time workflows, and optimized data pipelines. Contributed to secure multi-tenant infrastructure on AWS EKS and mentored team members."}, {"link": "", "name": "Devdocs AI", "role": "Contract Software Engineer", "description": "Developed and optimized the AI-powered DevDocs platform, enabling training of AI agents on user-connected resources. Built and maintained resource ingestion pipelines, automated syncing of knowledge sources, and contributed to SDKs for embedding AI workflows. Mentored teammates on best practices for scalable, secure systems."}, {"link": "", "name": "LearnOtter", "role": "Project Lead & Full Stack Engineer", "description": "Led the development of Learnotter, an online collaborative learning platform, designing a dynamic frontend with React, Redux, and Gatsby. Implemented real-time communication features with Express.js and Socket.IO, ensuring secure data management and leading deployment strategies with Docker and AWS EC2."}, {"link": "", "name": "SportsJaw", "role": "Senior Software Engineer", "description": "Contributed as a Full Stack Developer to SportsJaw, delivering predictive insights for sports bettors. Developed frontend features with React and Apollo Client, integrated with Hasura-managed GraphQL APIs, and collaborated using Agile methodologies to ensure a seamless user experience."}], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Nov 2025", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": "As a Senior Software Engineer, contributed to designing and developing a modular Next.js application for seamless partner platform integration. Implemented secure authentication using Auth0, maintained backend services with Node.js, and optimized data flows for sensitive client information. Led DevOps initiatives on AWS EKS, mentored team members, and collaborated with cross-functional teams to define architecture and enforce engineering standards."}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": "Specialized in creating detailed documentation and AI-powered systems at DevDocs.ai. Developed resource APIs, automated syncing pipelines, and stored embeddings for AI agents. Leveraged ChatGPT and Claude APIs to generate context-aware responses. Authored SDKs, reusable components, and internal guides, ensuring performance and scalability."}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "May 2022 - Jan 2024", "location": "Ahmedabad, IN", "position": "Tech Lead", "description": "Led technical initiatives as a Tech Lead, designing scalable project architectures and performing code reviews. Utilized React, Angular, and Node.js frameworks, championed clean code practices, and guided teams in building efficient CI/CD pipelines. Conducted internal training sessions to upskill developers and introduced standardized development setups."}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jun 2019 - Jun 2022", "location": "Ahmedabad, IN", "position": "Senior Software Engineer", "description": "Motivated developers to follow best practices and mentored on clean architecture and scalable solutions. Managed project timelines efficiently, leveraged AWS for deployment, and integrated Socket.IO for real-time communication. Conducted detailed code reviews and maintained high client satisfaction."}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Jan 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": "Collaborated in Agile web development projects using Angular, React, Bootstrap, Laravel, and Node.js. Assisted in maintaining web applications, utilized Git for version control, and delivered high-quality output in HTML, CSS, and JavaScript."}]}', '2025-10-29 03:33:59.367968+00');
INSERT INTO public.resumes VALUES ('e29aeb2c-d52a-4975-8303-3915f54e59e4', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer - Motion', 'About the job
We are partnering with a healthtech company that builds software to increase the capacity and efficiency of drug manufacturing. They are hiring a Senior Ful Stack Engineer to design and scale a secure, high-performing platform using Node and TypeScript. This is a full-time, hybrid role in Toronto.

You will join a small, highly collaborative team with significant ownership across architecture, product, and delivery. If you enjoy shaping engineering practices, choosing modern tooling, and shipping to production daily, this is a chance to have outsized impact on real-world outcomes, including cost reduction and safer bio and chemical manufacturing.

Required Skills & Experience

5+ years building production backends, with strong proficiency in Node, TypeScript, and Express 
Designing and implementing REST APIs, authentication, and secure data flows 
PostgreSQL schema design, query optimization, and performance tuning 
Caching with Redis, data sync strategies, and offline-tolerant patterns 
Cloud deployment experience and operational ownership, CI/CD, monitoring, and alerts 
Strong systems design, integration with third-party services, and product analytics instrumentation 
Clear written communication, Git hygiene, and a pragmatic approach to shipping quality code 

Desired Skills & Experience

Experience establishing longer-term cloud infrastructure and operations beyond Heroku 
Real-time collaboration features, websockets, and state sync patterns 
Frontend collaboration, implementing basic UI from Figma, familiarity with React and polished UX details 
Email delivery pipelines, transactional templates, and eventing 
Bachelor’s degree in Computer Science or related field from a reputable institution (considered a strong asset) 
Interest in productivity systems and a low-ego, solution-focused mindset 
Domain interest in healthcare, life sciences, or manufacturing 

What You Will Be Doing

Tech Breakdown

Backend development with Node.js & TypeScript, 50% 
Database & caching (PostgreSQL, Redis), 25% 
Cloud infrastructure & DevOps, 15% 
UI collaboration with React & design team, 10% 

Daily Responsibilities

Hands-on development and code reviews, 70% 
Architecture and technical design, 15% 
Cross-functional collaboration with design and product, 10% 
Operational duties, deployments, and observability, 5% 

The Offer

You Will Receive The Following Benefits

Competitive salary and equity options 
4 weeks paid vacation, paid sick leave, and paid parental leave 
Fully distributed team within North American and European time zones 
Company-paid co-working desk in your local community 
New MacBook Pro, external display, and professional accessories 

Applicants must be currently authorized to work in Canada on a full-time basis now and in the future.', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["Node.js", "TypeScript", "Express.js", "PostgreSQL", "Redis", "AWS Services", "REST APIs", "React", "Next.js", "Docker", "CI/CD", "Authentication", "GraphQL", "MongoDB", "MySQL", "Nginx", "Jest", "Angular", "Webpack", "Auth0", "Firebase", "Terraform", "CloudWatch", "Git"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "summary": ["Experienced [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]8+ years[/HIGHLIGHT] of expertise in [HIGHLIGHT]Node.js, TypeScript, and Express[/HIGHLIGHT], specializing in building [HIGHLIGHT]production backends[/HIGHLIGHT] and [HIGHLIGHT]scalable full-stack applications[/HIGHLIGHT] for healthcare and SaaS platforms.", "Proven track record in [HIGHLIGHT]PostgreSQL schema design[/HIGHLIGHT], [HIGHLIGHT]Redis caching[/HIGHLIGHT], and [HIGHLIGHT]cloud deployment[/HIGHLIGHT] with [HIGHLIGHT]AWS services[/HIGHLIGHT], including [HIGHLIGHT]CI/CD pipelines[/HIGHLIGHT] and [HIGHLIGHT]monitoring solutions[/HIGHLIGHT] for high-performance systems.", "Strong background in [HIGHLIGHT]REST API design[/HIGHLIGHT], [HIGHLIGHT]secure authentication[/HIGHLIGHT], and [HIGHLIGHT]real-time collaboration features[/HIGHLIGHT], with demonstrated leadership in [HIGHLIGHT]mentoring engineering teams[/HIGHLIGHT] and establishing [HIGHLIGHT]scalable architecture patterns[/HIGHLIGHT]."], "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Nov 2025", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Enhanced [HIGHLIGHT]platform scalability[/HIGHLIGHT] and [HIGHLIGHT]security compliance[/HIGHLIGHT] by architecting [HIGHLIGHT]modular Next.js[/HIGHLIGHT] and [HIGHLIGHT]Node.js microservices[/HIGHLIGHT] supporting [HIGHLIGHT]multi-tenant healthcare deployments[/HIGHLIGHT] with [HIGHLIGHT]SOC 2 and HIPAA compliance[/HIGHLIGHT].", "Improved [HIGHLIGHT]system reliability[/HIGHLIGHT] and [HIGHLIGHT]operational visibility[/HIGHLIGHT] through [HIGHLIGHT]AWS EKS deployments[/HIGHLIGHT], [HIGHLIGHT]Terraform infrastructure provisioning[/HIGHLIGHT], and [HIGHLIGHT]CloudWatch monitoring pipelines[/HIGHLIGHT] for real-time performance tracking.", "Strengthened [HIGHLIGHT]authentication security[/HIGHLIGHT] and [HIGHLIGHT]access control[/HIGHLIGHT] by implementing [HIGHLIGHT]Auth0-based role management[/HIGHLIGHT] and [HIGHLIGHT]secure API integrations[/HIGHLIGHT] for sensitive health data workflows.", "Increased [HIGHLIGHT]developer productivity[/HIGHLIGHT] and [HIGHLIGHT]code quality[/HIGHLIGHT] by [HIGHLIGHT]mentoring engineers[/HIGHLIGHT] on [HIGHLIGHT]modular development practices[/HIGHLIGHT], [HIGHLIGHT]CI/CD best practices[/HIGHLIGHT], and [HIGHLIGHT]secure coding standards[/HIGHLIGHT].", "Enabled seamless [HIGHLIGHT]third-party platform integration[/HIGHLIGHT] through [HIGHLIGHT]flexible API design[/HIGHLIGHT] and [HIGHLIGHT]embedded module architecture[/HIGHLIGHT], supporting external partner healthcare systems.", "Delivered enhanced [HIGHLIGHT]real-time collaboration capabilities[/HIGHLIGHT] for therapeutic interactions, enabling direct communication and interactive features within secure video sessions."]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Contract Software Engineer", "description": ["Accelerated [HIGHLIGHT]AI platform development[/HIGHLIGHT] by architecting [HIGHLIGHT]full-stack Next.js application[/HIGHLIGHT] with [HIGHLIGHT]Supabase backend[/HIGHLIGHT], enabling [HIGHLIGHT]contextual AI responses[/HIGHLIGHT] through [HIGHLIGHT]vector storage and embedding pipelines[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]developer integration experience[/HIGHLIGHT] by creating [HIGHLIGHT]modular SDK[/HIGHLIGHT] with [HIGHLIGHT]React hooks library[/HIGHLIGHT], [HIGHLIGHT]customizable widgets[/HIGHLIGHT], and [HIGHLIGHT]direct API access[/HIGHLIGHT] for multiple integration patterns.", "Improved [HIGHLIGHT]system scalability[/HIGHLIGHT] and [HIGHLIGHT]reliability[/HIGHLIGHT] through [HIGHLIGHT]background operations orchestration[/HIGHLIGHT] using [HIGHLIGHT]Trigger.dev[/HIGHLIGHT] and [HIGHLIGHT]edge functions[/HIGHLIGHT] for large-scale workflow processing.", "Strengthened [HIGHLIGHT]AI capabilities[/HIGHLIGHT] by integrating [HIGHLIGHT]OpenAI and OpenRouter APIs[/HIGHLIGHT] for intelligent, context-aware agent responses and automated knowledge base synchronization.", "Increased [HIGHLIGHT]team efficiency[/HIGHLIGHT] by authoring [HIGHLIGHT]comprehensive documentation[/HIGHLIGHT], [HIGHLIGHT]SDK guides[/HIGHLIGHT], and [HIGHLIGHT]reusable components[/HIGHLIGHT] enabling seamless platform extension and maintenance."]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech lead", "description": ["Led [HIGHLIGHT]technical architecture[/HIGHLIGHT] and [HIGHLIGHT]full-stack development[/HIGHLIGHT] of multiple applications using [HIGHLIGHT]React, Angular, Node.js[/HIGHLIGHT], and [HIGHLIGHT]NestJS[/HIGHLIGHT], delivering [HIGHLIGHT]end-to-end solutions[/HIGHLIGHT] from concept to production deployment.", "Enhanced [HIGHLIGHT]project delivery efficiency[/HIGHLIGHT] by [HIGHLIGHT]40%[/HIGHLIGHT] through [HIGHLIGHT]Hasura integration[/HIGHLIGHT] for rapid backend setup and implementing [HIGHLIGHT]internal boilerplate framework[/HIGHLIGHT] with [HIGHLIGHT]built-in authentication[/HIGHLIGHT] and [HIGHLIGHT]modular architecture[/HIGHLIGHT].", "Improved [HIGHLIGHT]deployment reliability[/HIGHLIGHT] and [HIGHLIGHT]team productivity[/HIGHLIGHT] by implementing [HIGHLIGHT]CI/CD pipelines[/HIGHLIGHT] using [HIGHLIGHT]Jenkins, GitHub Actions[/HIGHLIGHT], and [HIGHLIGHT]Docker[/HIGHLIGHT] across multiple environments and development workflows.", "Strengthened [HIGHLIGHT]engineering standards[/HIGHLIGHT] and [HIGHLIGHT]code quality[/HIGHLIGHT] by [HIGHLIGHT]mentoring development teams[/HIGHLIGHT] across [HIGHLIGHT]React, Node.js, Angular[/HIGHLIGHT], and [HIGHLIGHT]React Native[/HIGHLIGHT] while establishing [HIGHLIGHT]scalable coding practices[/HIGHLIGHT].", "Delivered [HIGHLIGHT]high-performance web applications[/HIGHLIGHT] including AI-driven learning platforms, restaurant SaaS systems, and collaborative learning portals with [HIGHLIGHT]real-time features[/HIGHLIGHT] and [HIGHLIGHT]optimized Core Web Vitals[/HIGHLIGHT].", "Streamlined [HIGHLIGHT]operational processes[/HIGHLIGHT] by implementing [HIGHLIGHT]automated standup reporting[/HIGHLIGHT] and [HIGHLIGHT]issue tracking integration[/HIGHLIGHT], reducing manual coordination overhead and improving project transparency."]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Pilot Web Developer", "description": ["Developed [HIGHLIGHT]foundational backend expertise[/HIGHLIGHT] working with [HIGHLIGHT]Node.js, Laravel[/HIGHLIGHT], and [HIGHLIGHT]database technologies[/HIGHLIGHT] including [HIGHLIGHT]MySQL, PostgreSQL, MongoDB[/HIGHLIGHT], and [HIGHLIGHT]Firebase[/HIGHLIGHT] while collaborating on [HIGHLIGHT]Agile development projects[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]full-stack development skills[/HIGHLIGHT] through hands-on experience with [HIGHLIGHT]Angular, React[/HIGHLIGHT], and [HIGHLIGHT]modern JavaScript frameworks[/HIGHLIGHT], participating in [HIGHLIGHT]code reviews[/HIGHLIGHT] and [HIGHLIGHT]troubleshooting[/HIGHLIGHT] both frontend and backend systems.", "Strengthened [HIGHLIGHT]development practices[/HIGHLIGHT] by utilizing [HIGHLIGHT]Git version control[/HIGHLIGHT], adhering to [HIGHLIGHT]web development best practices[/HIGHLIGHT], and consistently delivering [HIGHLIGHT]high-quality code[/HIGHLIGHT] within project timelines.", "Built [HIGHLIGHT]technical foundation[/HIGHLIGHT] in [HIGHLIGHT]HTML, CSS, JavaScript[/HIGHLIGHT] while gaining experience in [HIGHLIGHT]maintaining web applications[/HIGHLIGHT] and working with [HIGHLIGHT]senior developers[/HIGHLIGHT] to understand complex project requirements."]}]}', '2025-11-09 20:55:22.326832+00');
INSERT INTO public.resumes VALUES ('c66bbb20-247e-4139-8624-8f8239ebc211', '72e83701-5723-428c-b153-0a957cad5e78', 'Senior Software Engineer (Full-Stack, Backend-leaning)', 'About the job
Before we wrote this ad, we talked to our engineers and asked them what it’s really like working here. Here’s what they said.

At most companies, engineers wait.

Wait for approvals. Wait for dependencies. Wait while real problems go unsolved.

At Jerry.ai, we don’t wait.

If you have an idea, you can explain it, build it, and ship it — sometimes in days, not months. One engineer told us: “At other companies I made very little difference. Here, if I have a good idea, I can go do it.”

That sense of ownership is built into how we work. We move fast, and you’ll see your fingerprints on the product right away. Engineers here love being able to touch every layer of the stack, collaborate across teams, and see their work reflected in real customer behavior — sometimes the same week they ship. “Everything you do reflects immediately for the users,” said another. “And things move fast.”

We don’t do bureaucracy. We don’t do politics. Everyone here — from our CTO to our tech leads — writes code and sweats the details. “The leaders here lead by example,” one teammate shared. “They have very high standards. They don’t settle for just OK.”

It’s challenging work, but it’s meaningful. You’ll juggle new systems and old, context switch often, and learn constantly. You’ll also get more trust and autonomy than almost anywhere else. Engineers describe the culture as curious and collaborative: people step up to help, push each other to grow, and learn from every mistake. One teammate summed it up perfectly: “I once caused a bug that wasted $20K in AWS costs, but no one blamed me. They only cared about how to prevent it next time.”

We’re a remote-first, global team with engineers across North America and Asia. We collaborate asynchronously, meet regularly to share context, and connect in person at our global offsites. Our engineers joined for the impact and stayed for the people: talented, no ego, and genuinely kind.

So, what is Jerry.ai and why should you care?🤔

Your car and your home are the two most expensive things you’ll ever own — and the hardest to manage. At Jerry.ai, we’re building the first super app to help everyday Americans take control of both. From insurance to repairs to safety, we’re reimagining what it means to own and maintain your car and home. This is a $5 trillion+ problem and we’re the only company tackling it end-to-end. Our revenue has grown 60x in the last 5 years, we’re profitable, and our goal is to scale from 5M → 50M users next.

What You’ll Work On

Build automation systems that handle complex insurance servicing tasks end-to-end (policy endorsements, cancellations, document uploads, reinstatements) or reduce policy cancellations, improve renewals, and ensure users always have the best coverage. 
Fast sprint cycles: ship new automations in 1–2 weeks on average.
Compose backend business logic that drives automation while respecting complex insurance carrier rules.
Design backend pipelines that sync customer policy data, deliver timely alerts, and power seamless re-shopping experiences.
Optimize and scale our internal tools (think: in-house DocuSign for servicing) to reduce agent intervention to nearly zero.
Collaborate closely with product, data, and engineering ops to anticipate churn and improve customer retention.
Work asynchronously across time zones, with minimal meetings but strong collaboration through Asana and Slack.
Continuously improve our backend systems, APIs, and microservice architecture.

Our Tech Stack

Frontend & backend: TypeScript, Nest.js, Next.js, React, React Native, Expo
API: GraphQL
Data: Postgres, DynamoDB, Clickhouse, Redis
Infrastructure: AWS, microservices, containerized services on ECS/EKS, asynchronous processing on Lambda
Our business has grown more complex over time. We’re refactoring major parts of our code base — simplifying old systems, rebuilding core flows, and setting up the next three years of our platform’s growth. You’ll help build the foundation for that next phase.

What We’re Looking For

Experience: At least 5 years full stack engineering experience building production-grade software, ideally prior experience building large scale distributed systems for a fast-growing consumer-facing software
Technical strength: Strong foundations in data structures, algorithms, and systems design matter more than prior experience with our tech stack.
Problem solver: You enjoy tackling ambiguous problems, breaking them down into actionable code, and iterating quickly.
Ownership: You take responsibility for end-to-end outcomes and continuously improve the systems you build.
Collaboration: Comfortable working asynchronously with a global team, with excellent communication skills.
Curiosity + adaptability: You love learning, exploring new tools, and stepping outside your comfort zone to understand the bigger picture.

This isn’t another coding job. You’ll work in a flexible, fast-moving, and highly collaborative culture, where innovation is encouraged, your voice is heard, and the impact of your work is immediate. You’ll tackle meaningful challenges, learn, and grow alongside talented peers.

If this sounds like your kind of place, we’d love to meet you!

While we appreciate your interest and application, only applicants under consideration will be contacted.

Jerry.ai is proud to be an Equal Employment Opportunity employer. We prohibit discrimination based on race, religion, color, national origin, sex, pregnancy, reproductive health decisions or related medical conditions, sexual orientation, gender identity, gender expression, age, veteran status, disability, genetic information, or other characteristics protected by applicable local, state or federal laws. 

Jerry.ai is committed to providing reasonable accommodations for individuals with disabilities in our job application process. If you need assistance or an accommodation due to a disability, please contact us at recruiting@jerry.ai

The successful candidate’s starting pay will fall within the pay range listed on this job posting, determined based on job-related factors including, but not limited to, skills, experience, qualifications, work location, and market conditions. Ranges are market-dependent and may be modified in the future. In addition to base salary, the compensation may include opportunities for equity grants. 

We offer a comprehensive benefits package to regular employees, including health, dental, and vision coverage, paid time off, paid parental leave, 401(K) plan with employer matching, and wellness benefits, among others. Equity opportunities may also be part of your total rewards package. Part-time, contract, or freelance roles may not be eligible for certain benefits.

About Jerry.ai

Jerry.ai is America’s first and only super app to radically simplify car ownership. We are redefining how people manage owning a car, one of their most expensive and time-consuming assets.

Backed by artificial intelligence and machine learning, Jerry.ai simplifies and automates owning and maintaining a car while providing personalized services for all car owners'' needs. We spend every day innovating and improving our AI-powered app to provide the best possible experience for our customers. From car insurance and financing to maintenance and safety, Jerry.ai does it all.

We are the #1 rated and most downloaded app in our category with a 4.7 star rating in the App Store. We have more than 5 million customers — and we’re just getting started.

Jerry.ai was founded in 2017 by serial entrepreneurs and has raised more than $240 million in financing.

Join our team and work with passionate, curious and egoless people who love solving real-world problems. Help us build a revolutionary product that’s disrupting a massive market.

', 'strict', 'classic', '{"summary_format": "bullets", "projects_format": "bullets", "work_experience_format": "bullets", "highlight_important_content": true}', '{"skills": ["TypeScript", "Node.js", "React", "Next.js", "GraphQL", "AWS Services", "PostgreSQL", "Redis", "Docker", "Microservices", "Express.js", "MongoDB", "Angular", "React Native", "MySQL", "Firebase", "Nginx", "Jest", "Auth0", "Supabase", "LangChain", "Webpack", "Tailwind CSS", "GatsbyJS"], "contact": {"name": "Ashish Patel", "email": "ashishtzdev@gmail.com", "phone": "2268082350", "address": "", "location": "Kitchener, ON"}, "summary": ["Experienced [HIGHLIGHT]Senior Software Engineer[/HIGHLIGHT] with [HIGHLIGHT]8+ years[/HIGHLIGHT] of [HIGHLIGHT]full-stack development[/HIGHLIGHT] expertise, specializing in building [HIGHLIGHT]scalable distributed systems[/HIGHLIGHT] and [HIGHLIGHT]automation platforms[/HIGHLIGHT] for high-growth consumer-facing applications.", "Proven track record leading [HIGHLIGHT]fast-paced development cycles[/HIGHLIGHT] and shipping [HIGHLIGHT]end-to-end automation systems[/HIGHLIGHT], with experience managing [HIGHLIGHT]complex business logic[/HIGHLIGHT] and [HIGHLIGHT]microservice architectures[/HIGHLIGHT] in [HIGHLIGHT]AWS environments[/HIGHLIGHT].", "Strong background in [HIGHLIGHT]TypeScript[/HIGHLIGHT], [HIGHLIGHT]Node.js[/HIGHLIGHT], and [HIGHLIGHT]React[/HIGHLIGHT] development, with demonstrated ability to [HIGHLIGHT]take ownership[/HIGHLIGHT] of technical decisions, [HIGHLIGHT]mentor teams[/HIGHLIGHT], and [HIGHLIGHT]collaborate asynchronously[/HIGHLIGHT] across global organizations."], "projects": [], "education": [{"field": "Computer Science", "degree": "Master''s", "duration": "Feb 2015 - May 2017", "institution": "KSV University"}], "workExperience": [{"type": "Full-Time", "company": "Modern Health Canada Inc", "duration": "Feb 2025 - Present", "location": "Toronto, ON", "position": "Senior Software Engineer", "description": ["Accelerated [HIGHLIGHT]platform development by 35%[/HIGHLIGHT] using AI tools, delivering a complete rebuild in [HIGHLIGHT]10 weeks with a 3-person team[/HIGHLIGHT], demonstrating ability to [HIGHLIGHT]ship rapidly[/HIGHLIGHT] in [HIGHLIGHT]fast sprint cycles[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]system security and compliance[/HIGHLIGHT] by reducing vulnerabilities by [HIGHLIGHT]60%[/HIGHLIGHT] through [HIGHLIGHT]AWS infrastructure auditing[/HIGHLIGHT] and implementing [HIGHLIGHT]SOC 2 Type II compliance[/HIGHLIGHT] measures.", "Improved [HIGHLIGHT]scalability and performance[/HIGHLIGHT] by architecting appointment systems to handle [HIGHLIGHT]10,000+ concurrent sessions[/HIGHLIGHT] with real-time controls and secure video capabilities.", "Streamlined [HIGHLIGHT]payment system integration[/HIGHLIGHT] by designing a [HIGHLIGHT]provider-agnostic architecture[/HIGHLIGHT], reducing future integrations from days to hours and enabling [HIGHLIGHT]rapid business logic implementation[/HIGHLIGHT].", "Increased [HIGHLIGHT]user activation rates by 25%[/HIGHLIGHT] through AI-powered onboarding implementation and [HIGHLIGHT]partner integration architecture[/HIGHLIGHT] supporting multiple third-party platforms.", "Strengthened [HIGHLIGHT]monitoring and observability[/HIGHLIGHT] by implementing [HIGHLIGHT]AWS CloudWatch[/HIGHLIGHT] audit logging and configuring secure [HIGHLIGHT]EKS connectivity[/HIGHLIGHT] for development teams."]}, {"type": "Contract", "company": "Devdocs LLC", "duration": "Jan 2024 - Feb 2025", "location": "Texas, USA (Remote)", "position": "Senior Software Engineer", "description": ["Reduced [HIGHLIGHT]query resolution time by 40%[/HIGHLIGHT] by building [HIGHLIGHT]AI-powered automation systems[/HIGHLIGHT] with [HIGHLIGHT]RAG pipelines[/HIGHLIGHT] and vector database storage for customer support workflows.", "Accelerated [HIGHLIGHT]customer integration from days to under an hour[/HIGHLIGHT] by developing [HIGHLIGHT]React SDK[/HIGHLIGHT] and embeddable chat widgets, demonstrating expertise in [HIGHLIGHT]end-to-end automation[/HIGHLIGHT].", "Optimized [HIGHLIGHT]AI infrastructure costs by 30%[/HIGHLIGHT] through [HIGHLIGHT]model-agnostic architecture[/HIGHLIGHT] design supporting runtime LLM switching and [HIGHLIGHT]usage metering systems[/HIGHLIGHT].", "Enhanced [HIGHLIGHT]platform scalability[/HIGHLIGHT] by implementing [HIGHLIGHT]12+ third-party integrations[/HIGHLIGHT] with real-time sync capabilities across GitHub, Salesforce, Jira, and HubSpot.", "Improved [HIGHLIGHT]team productivity and knowledge transfer[/HIGHLIGHT] by mentoring new team members and establishing comprehensive [HIGHLIGHT]codebase documentation[/HIGHLIGHT] for smooth onboarding."]}, {"type": "Full-Time", "company": "Techuz Infoweb", "duration": "Jul 2019 - Feb 2024", "location": "Ahmedabad, IN", "position": "Senior Software Engineer / Tech Lead", "description": ["Increased [HIGHLIGHT]team productivity by 25%[/HIGHLIGHT] while leading [HIGHLIGHT]25+ developers[/HIGHLIGHT] across [HIGHLIGHT]React, Angular, and React Native[/HIGHLIGHT] projects, establishing [HIGHLIGHT]code review processes[/HIGHLIGHT] that reduced bugs by 30%.", "Accelerated [HIGHLIGHT]project delivery and setup time by 30%[/HIGHLIGHT] through creation of [HIGHLIGHT]reusable tech stack boilerplates[/HIGHLIGHT] and streamlined development workflows.", "Enhanced [HIGHLIGHT]user engagement by 25%[/HIGHLIGHT] and reduced support tickets by [HIGHLIGHT]40%[/HIGHLIGHT] by building the company''s first [HIGHLIGHT]AI chatbot[/HIGHLIGHT] with real-time product guidance capabilities.", "Improved [HIGHLIGHT]deployment efficiency by 40%[/HIGHLIGHT] by implementing [HIGHLIGHT]CI/CD pipelines[/HIGHLIGHT] using [HIGHLIGHT]GitHub Actions[/HIGHLIGHT] and supporting teams with [HIGHLIGHT]AWS and DigitalOcean[/HIGHLIGHT] platform adoption.", "Reduced [HIGHLIGHT]backend implementation time significantly[/HIGHLIGHT] by driving adoption of [HIGHLIGHT]Keycloak authentication[/HIGHLIGHT] and [HIGHLIGHT]Hasura GraphQL automation[/HIGHLIGHT] as core infrastructure components.", "Optimized [HIGHLIGHT]meeting overhead by 50%[/HIGHLIGHT] through automation of daily standups and reporting workflows using [HIGHLIGHT]Standuply and Trello[/HIGHLIGHT] integration."]}, {"type": "Full-Time", "company": "Creole Studios", "duration": "Feb 2017 - Jun 2019", "location": "Ahmedabad, IN", "position": "Web Developer", "description": ["Reduced [HIGHLIGHT]manual work by 40%[/HIGHLIGHT] and [HIGHLIGHT]staff management effort by 30%[/HIGHLIGHT] by developing online training management systems with automated dashboards and workflow optimization.", "Enhanced [HIGHLIGHT]application functionality and security[/HIGHLIGHT] through implementation of [HIGHLIGHT]Single Sign-On solutions[/HIGHLIGHT] and [HIGHLIGHT]third-party integrations[/HIGHLIGHT] for streamlined user accessibility.", "Contributed to [HIGHLIGHT]FastFocus market research platform[/HIGHLIGHT] development, improving [HIGHLIGHT]survey analytics and decision-making[/HIGHLIGHT] capabilities for global clients.", "Gained comprehensive [HIGHLIGHT]full-stack experience[/HIGHLIGHT] with [HIGHLIGHT]Laravel, React, Node.js, Angular[/HIGHLIGHT], and [HIGHLIGHT]AWS services[/HIGHLIGHT] including EC2, S3, and Lambda for scalable applications."]}]}', '2025-11-24 23:01:44.576001+00');


--
-- Data for Name: skill_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.skill_categories VALUES ('2a60f977-333d-4de6-ade2-75a8680d1bb7', 'Programming Languages', '2025-11-25 14:26:43.327479+00');
INSERT INTO public.skill_categories VALUES ('885b1a58-e4d1-4b0c-8319-42b2a3009cf7', 'Web Technologies/Framework', '2025-11-25 18:07:45.060512+00');
INSERT INTO public.skill_categories VALUES ('2aac0028-15e9-4dad-8e50-88cc7b8ee6be', 'Orchestration', '2025-11-25 18:14:03.514586+00');
INSERT INTO public.skill_categories VALUES ('ad464b88-6474-4bb2-9f4b-32b2e2252d35', 'Tools', '2025-11-25 18:15:02.337929+00');
INSERT INTO public.skill_categories VALUES ('1ea26792-ad01-4222-8e8e-52c317600c7c', 'Database', '2025-11-25 18:19:36.722657+00');
INSERT INTO public.skill_categories VALUES ('79427307-a692-46ea-9ef4-f91605c6f5ab', 'Methodologies', '2025-11-25 18:25:25.40121+00');
INSERT INTO public.skill_categories VALUES ('dc9d5213-b147-435d-be51-f3094fc0b079', 'Operating System', '2025-11-25 18:26:17.173506+00');


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.skills VALUES ('90eb77fe-039d-43b6-a27c-134125f5c39e', 'Node', '2025-10-27 22:31:40.897743+00');
INSERT INTO public.skills VALUES ('4ed08d6d-374b-481f-98bf-2a02d7b42ef8', 'React', '2025-10-27 22:31:45.660796+00');
INSERT INTO public.skills VALUES ('3c920545-3e8a-4487-82ee-8a2a910fd151', 'Angular', '2025-10-27 22:31:51.081162+00');
INSERT INTO public.skills VALUES ('b0a6fd21-f37c-43b7-b6ae-68ef708e3c3f', 'Docker', '2025-10-29 02:50:41.577231+00');
INSERT INTO public.skills VALUES ('e01a7c9a-0395-4e11-a415-f4c586c15e20', 'NextJs', '2025-10-29 02:51:08.143822+00');
INSERT INTO public.skills VALUES ('e82beb4f-4797-4003-8d74-b8ce066e70d2', 'ExpressJs', '2025-10-29 02:51:24.53418+00');
INSERT INTO public.skills VALUES ('6feff982-b473-4412-b780-1b62c70f8724', 'Typescript', '2025-10-29 02:51:47.880087+00');
INSERT INTO public.skills VALUES ('b12276c3-b89e-43d2-8003-330931b5587d', 'Bootstrap', '2025-10-29 02:52:03.826716+00');
INSERT INTO public.skills VALUES ('1b5b51ce-b1a0-45dd-888c-c04defb83194', 'Tailwind CSS', '2025-10-29 02:52:14.569949+00');
INSERT INTO public.skills VALUES ('74cf0df5-a4cc-4aac-b22f-df99f2cea975', 'Bootstrap CSS', '2025-10-29 02:52:26.793372+00');
INSERT INTO public.skills VALUES ('2db81617-8ef7-498b-9e03-90f1caaef5b5', 'GraphQL', '2025-10-29 02:52:48.504915+00');
INSERT INTO public.skills VALUES ('2e228b14-9fc2-4155-a525-0f0697ed7768', 'Webpack', '2025-10-29 02:52:59.553+00');
INSERT INTO public.skills VALUES ('431e93e0-2253-4c11-aa92-193a8deca6f8', 'KeyCloak', '2025-10-29 02:53:14.079307+00');
INSERT INTO public.skills VALUES ('1e0ef271-57f3-4b5b-aba1-2a40731c74da', 'Auth0', '2025-10-29 02:53:21.578698+00');
INSERT INTO public.skills VALUES ('8a7496b4-bf60-4606-8bed-f172fb9fa4a7', 'React native', '2025-10-29 02:53:36.516633+00');
INSERT INTO public.skills VALUES ('e1999244-5856-4033-85ef-b93d0445ecfb', 'Hasura', '2025-10-29 02:53:47.034023+00');
INSERT INTO public.skills VALUES ('7e0a8e36-c4eb-4cea-b90e-deee6323499c', 'Supabase', '2025-10-29 02:53:54.622407+00');
INSERT INTO public.skills VALUES ('d41e267c-1563-43eb-9606-dfd1b9c0423f', 'AWS Services', '2025-10-29 02:54:10.572222+00');
INSERT INTO public.skills VALUES ('04e97ed8-ca54-4143-949c-bf3dc0f653c9', 'Nginx', '2025-10-29 02:54:22.083245+00');
INSERT INTO public.skills VALUES ('e1e84b02-6212-4685-93d9-ff896c0a111e', 'Jest', '2025-10-29 02:54:34.700922+00');
INSERT INTO public.skills VALUES ('dfd65e26-062a-4889-8bd3-8144c45f35ac', 'GatsbyJS', '2025-10-29 02:54:48.212122+00');
INSERT INTO public.skills VALUES ('f3a88ac1-759f-465d-ab42-7119ddd94035', 'Remix.run', '2025-10-29 02:54:58.153804+00');
INSERT INTO public.skills VALUES ('7bb336a3-6019-41b2-add7-cec38c92b9a2', 'Capacitor', '2025-10-29 02:55:07.080129+00');
INSERT INTO public.skills VALUES ('f3792748-13e6-4ccd-b487-3c1e44721af6', 'ElectronJS', '2025-10-29 02:55:21.465075+00');
INSERT INTO public.skills VALUES ('835c5573-bf9e-449c-934f-12bedf87d551', 'LangChain', '2025-10-29 02:55:42.551738+00');
INSERT INTO public.skills VALUES ('58096514-5170-4ee8-a7a3-e37092ed9bcf', 'MySQL', '2025-10-29 02:55:57.028129+00');
INSERT INTO public.skills VALUES ('95a11ba0-4727-497c-885a-3f38fedcee6a', 'PostgreSQL', '2025-10-29 02:56:18.549842+00');
INSERT INTO public.skills VALUES ('e11e5a2d-0507-4a02-af31-e3ef45800ab6', 'MongoDB', '2025-10-29 02:56:30.106338+00');
INSERT INTO public.skills VALUES ('d5cddc4d-b156-463b-b6f9-391a7255547d', 'Firebase', '2025-10-29 02:56:45.283445+00');
INSERT INTO public.skills VALUES ('0b228e03-7ff0-48aa-bd26-7eecadf4cfc6', 'Redis', '2025-10-29 02:56:58.360316+00');
INSERT INTO public.skills VALUES ('8f3f1d34-3dd1-4450-bcce-011a6cd9f397', 'Javascript', '2025-11-25 14:27:36.479488+00');
INSERT INTO public.skills VALUES ('d6c578bd-a142-4d90-b422-2082d9f7bab6', 'Python', '2025-11-25 18:06:40.030979+00');
INSERT INTO public.skills VALUES ('d0680220-fc84-4d46-af0c-b9a49476ea1d', 'Bash', '2025-11-25 18:06:43.391958+00');
INSERT INTO public.skills VALUES ('6a16e618-700f-4a13-9a06-baa6c3e5abe9', 'Shell Script', '2025-11-25 18:06:48.069338+00');
INSERT INTO public.skills VALUES ('3409aafc-7355-46bd-8321-dd9616b41560', 'PHP', '2025-11-25 18:06:57.701899+00');
INSERT INTO public.skills VALUES ('fce90983-d395-4f29-aa4a-39b2e2eca909', 'NodeJS', '2025-11-25 18:07:45.188881+00');
INSERT INTO public.skills VALUES ('2b1a6eb5-08c2-426c-970c-31f498b8a5be', 'NestJS', '2025-11-25 18:07:55.598388+00');
INSERT INTO public.skills VALUES ('75e6651a-28d9-49ff-a6ad-be9497c4bb5e', 'HapiJS', '2025-11-25 18:07:59.212684+00');
INSERT INTO public.skills VALUES ('1a56dbd8-4c8b-4ee5-adb4-42b30499fc50', 'Laravel', '2025-11-25 18:09:13.261022+00');
INSERT INTO public.skills VALUES ('5d5cd8a2-2080-480a-bcec-6158e26c2385', 'HTML/CSS', '2025-11-25 18:09:27.638911+00');
INSERT INTO public.skills VALUES ('f793c84a-6a68-42d6-8084-fe4b7a9bde4a', 'JQuery', '2025-11-25 18:09:47.205275+00');
INSERT INTO public.skills VALUES ('df0a50d6-5a60-48ac-a3cd-037b650f6724', 'Yarn', '2025-11-25 18:10:01.187441+00');
INSERT INTO public.skills VALUES ('236f9479-77b9-4504-b718-160c8acd1e2c', 'NPM', '2025-11-25 18:10:04.755417+00');
INSERT INTO public.skills VALUES ('8a38d5aa-c3ff-47cd-bbcc-088b447e7df3', 'Mocha', '2025-11-25 18:10:24.545519+00');
INSERT INTO public.skills VALUES ('6c7bee81-e785-47fb-b9f0-e0ec83a5b1be', 'ES6/Ecmascript', '2025-11-25 18:10:35.718217+00');
INSERT INTO public.skills VALUES ('d3af6449-2502-4891-9686-7fb49cae672c', 'ReduxJs', '2025-11-25 18:11:03.228545+00');
INSERT INTO public.skills VALUES ('862aaa70-5cac-4685-a9a6-5780a8adc2ad', 'Thunk', '2025-11-25 18:11:09.058937+00');
INSERT INTO public.skills VALUES ('0d5001e0-be62-4d20-8717-6a564bfffb71', 'KeyClock', '2025-11-25 18:11:44.525782+00');
INSERT INTO public.skills VALUES ('4c3e02fc-f38e-4ee9-b181-0bd94c3acdf7', 'Kubernetes', '2025-11-25 18:14:03.580396+00');
INSERT INTO public.skills VALUES ('a7672271-f420-4935-851f-e9ecc8866594', 'Helm', '2025-11-25 18:14:03.607136+00');
INSERT INTO public.skills VALUES ('280cd7b2-2d1b-4355-a25b-ef3f10fd27d5', 'Jenkins', '2025-11-25 18:14:03.624147+00');
INSERT INTO public.skills VALUES ('47414950-03c8-4423-93dd-cc7e73aa6cba', 'Digital Ocean', '2025-11-25 18:14:03.659696+00');
INSERT INTO public.skills VALUES ('a9628532-3e03-4884-b7ca-112f69a20f0e', 'Heroku', '2025-11-25 18:14:03.690438+00');
INSERT INTO public.skills VALUES ('d371e0d0-bfe6-431b-8f48-f53fc659a033', 'Vercel', '2025-11-25 18:14:03.706928+00');
INSERT INTO public.skills VALUES ('53d271d1-e7ea-4af8-afc3-78b608934163', 'Caprover', '2025-11-25 18:14:03.727005+00');
INSERT INTO public.skills VALUES ('c68711fd-9e5e-49f1-884b-177acf0d8d9b', 'Figma', '2025-11-25 18:16:42.686515+00');
INSERT INTO public.skills VALUES ('239f1416-112c-463c-bd70-62688f4c5a1d', 'WireShark', '2025-11-25 18:16:47.251541+00');
INSERT INTO public.skills VALUES ('50bb2502-609c-45ab-b450-c459132fe45e', 'Git', '2025-11-25 18:17:02.574767+00');
INSERT INTO public.skills VALUES ('22cd3830-a0b3-480e-a8b5-bc83a43a397a', 'Postman', '2025-11-25 18:17:06.014386+00');
INSERT INTO public.skills VALUES ('8eb27eaf-0e79-4fff-8b78-fd65ceb08c32', 'Apache2', '2025-11-25 18:17:45.081613+00');
INSERT INTO public.skills VALUES ('05a67ef8-f5e7-4a4e-9c09-868a27bffe79', 'NoSQL', '2025-11-25 18:19:44.12223+00');
INSERT INTO public.skills VALUES ('4d3db10e-c521-44a0-a16a-9ed451cf771f', 'MsSQL', '2025-11-25 18:20:02.117267+00');
INSERT INTO public.skills VALUES ('c6aae149-2d7a-4c95-9a57-9e69db84fa73', 'Elastic Search', '2025-11-25 18:20:29.988999+00');
INSERT INTO public.skills VALUES ('8508db65-23bb-4603-9aa9-2da067e13bdc', 'Qdrant', '2025-11-25 18:24:47.219583+00');
INSERT INTO public.skills VALUES ('7417768b-86e0-4366-a5c7-a5fe14cdad65', 'Agile', '2025-11-25 18:25:26.431885+00');
INSERT INTO public.skills VALUES ('fec235ad-39a8-4d96-bab6-4995de4be08e', 'Scrum', '2025-11-25 18:25:28.172393+00');
INSERT INTO public.skills VALUES ('b2513a94-34db-4969-8679-984aa82b429d', 'Windows', '2025-11-25 18:26:17.474984+00');
INSERT INTO public.skills VALUES ('918e7660-8789-4f27-926a-6a540c725ac8', 'Linux/Unix', '2025-11-25 18:26:17.795943+00');
INSERT INTO public.skills VALUES ('1392f5e9-fa8e-4e5e-98a8-75d55d656cd3', 'Terraform', '2025-11-25 18:26:48.342309+00');


--
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '8f3f1d34-3dd1-4450-bcce-011a6cd9f397', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '6feff982-b473-4412-b780-1b62c70f8724', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'd6c578bd-a142-4d90-b422-2082d9f7bab6', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'd0680220-fc84-4d46-af0c-b9a49476ea1d', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '6a16e618-700f-4a13-9a06-baa6c3e5abe9', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '3409aafc-7355-46bd-8321-dd9616b41560', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '4ed08d6d-374b-481f-98bf-2a02d7b42ef8', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '3c920545-3e8a-4487-82ee-8a2a910fd151', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'e82beb4f-4797-4003-8d74-b8ce066e70d2', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '2b1a6eb5-08c2-426c-970c-31f498b8a5be', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'fce90983-d395-4f29-aa4a-39b2e2eca909', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '75e6651a-28d9-49ff-a6ad-be9497c4bb5e', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '1a56dbd8-4c8b-4ee5-adb4-42b30499fc50', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '5d5cd8a2-2080-480a-bcec-6158e26c2385', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'b12276c3-b89e-43d2-8003-330931b5587d', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '1b5b51ce-b1a0-45dd-888c-c04defb83194', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'f793c84a-6a68-42d6-8084-fe4b7a9bde4a', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'e1e84b02-6212-4685-93d9-ff896c0a111e', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'df0a50d6-5a60-48ac-a3cd-037b650f6724', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '236f9479-77b9-4504-b718-160c8acd1e2c', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '835c5573-bf9e-449c-934f-12bedf87d551', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '8a38d5aa-c3ff-47cd-bbcc-088b447e7df3', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '6c7bee81-e785-47fb-b9f0-e0ec83a5b1be', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '8a7496b4-bf60-4606-8bed-f172fb9fa4a7', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'd3af6449-2502-4891-9686-7fb49cae672c', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '862aaa70-5cac-4685-a9a6-5780a8adc2ad', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'e01a7c9a-0395-4e11-a415-f4c586c15e20', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'f3a88ac1-759f-465d-ab42-7119ddd94035', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'dfd65e26-062a-4889-8bd3-8144c45f35ac', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '2db81617-8ef7-498b-9e03-90f1caaef5b5', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '0d5001e0-be62-4d20-8717-6a564bfffb71', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'b0a6fd21-f37c-43b7-b6ae-68ef708e3c3f', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '4c3e02fc-f38e-4ee9-b181-0bd94c3acdf7', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'a7672271-f420-4935-851f-e9ecc8866594', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '280cd7b2-2d1b-4355-a25b-ef3f10fd27d5', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '47414950-03c8-4423-93dd-cc7e73aa6cba', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'd41e267c-1563-43eb-9606-dfd1b9c0423f', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'a9628532-3e03-4884-b7ca-112f69a20f0e', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'd371e0d0-bfe6-431b-8f48-f53fc659a033', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '53d271d1-e7ea-4af8-afc3-78b608934163', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'c68711fd-9e5e-49f1-884b-177acf0d8d9b', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '239f1416-112c-463c-bd70-62688f4c5a1d', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '50bb2502-609c-45ab-b450-c459132fe45e', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '22cd3830-a0b3-480e-a8b5-bc83a43a397a', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '04e97ed8-ca54-4143-949c-bf3dc0f653c9', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '8eb27eaf-0e79-4fff-8b78-fd65ceb08c32', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'e1999244-5856-4033-85ef-b93d0445ecfb', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '7e0a8e36-c4eb-4cea-b90e-deee6323499c', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '58096514-5170-4ee8-a7a3-e37092ed9bcf', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '05a67ef8-f5e7-4a4e-9c09-868a27bffe79', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '95a11ba0-4727-497c-885a-3f38fedcee6a', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '4d3db10e-c521-44a0-a16a-9ed451cf771f', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'e11e5a2d-0507-4a02-af31-e3ef45800ab6', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '0b228e03-7ff0-48aa-bd26-7eecadf4cfc6', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'd5cddc4d-b156-463b-b6f9-391a7255547d', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'c6aae149-2d7a-4c95-9a57-9e69db84fa73', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '8508db65-23bb-4603-9aa9-2da067e13bdc', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '7417768b-86e0-4366-a5c7-a5fe14cdad65', '79427307-a692-46ea-9ef4-f91605c6f5ab');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'fec235ad-39a8-4d96-bab6-4995de4be08e', '79427307-a692-46ea-9ef4-f91605c6f5ab');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', 'b2513a94-34db-4969-8679-984aa82b429d', 'dc9d5213-b147-435d-be51-f3094fc0b079');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '918e7660-8789-4f27-926a-6a540c725ac8', 'dc9d5213-b147-435d-be51-f3094fc0b079');
INSERT INTO public.user_skills VALUES ('72e83701-5723-428c-b153-0a957cad5e78', '1392f5e9-fa8e-4e5e-98a8-75d55d656cd3', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');


--
-- Data for Name: work_experiences; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.work_experiences VALUES ('cdeda558-fb95-44a5-8ea1-2c5807c94ebd', '72e83701-5723-428c-b153-0a957cad5e78', 'Devdocs LLC', 'Senior Software Engineer', 'Texas, USA (Remote)', 'Contract', '2024-02-01', '2025-02-13', false, 'Led full-stack development of an AI-powered customer support platform using Next.js, LangChain, Vercel AI SDK, Trigger.dev, Pipedream, Nango and some other automation and AI tools.

Built the core RAG pipeline with vector database storage and Neo4j graph memory, reducing average query resolution time by ~40%.

Developed 12+ integrations (GitHub, Notion, Salesforce, Jira, Confluence, HubSpot, etc.) with real-time sync capabilities.

Designed a model-agnostic architecture supporting runtime LLM switching, reducing AI infrastructure costs by ~30%.

Built a React SDK and embeddable chat widget, reducing customer integration time from days to under an hour.

Implemented usage metering and subscription-based limits for tokens, file syncing, and agent interactions.

Mentored new team members and documented the codebase for smooth onboarding.', '2025-10-29 02:38:28.971481+00', '2025-10-29 02:38:48.52+00');
INSERT INTO public.work_experiences VALUES ('aec37d46-885f-4810-b54d-a860f4d098b0', '72e83701-5723-428c-b153-0a957cad5e78', 'Creole Studios', 'Web Developer', 'Ahmedabad, IN', 'Full-Time', '2017-02-02', '2019-06-29', false, 'Developed an online training management system for a Kenyan client, reducing manual work by ~40% and staff/session management effort by ~30% through automated dashboards.

Implemented third-party integrations to streamline workflows and enhance application functionality.

Contributed to FastFocus, a real-time market research platform, improving survey analytics and decision-making for global clients.

Gained hands-on experience with Laravel, React, Node, Angular, GraphQL, MySQL, PostgreSQL, MongoDB, Firebase, and AWS services like EC2, S3, and Lambda.

Implemented Single Sign-On (SSO) solutions to enhance security and user accessibility across applications.

Collaborated in code reviews, debugged frontend and backend issues, and supported colleagues across projects to maintain high-quality application delivery.', '2025-10-29 02:21:46.272649+00', '2025-10-29 02:21:46.272649+00');
INSERT INTO public.work_experiences VALUES ('ea05b86e-b015-4414-91e0-f85f1c7c927e', '72e83701-5723-428c-b153-0a957cad5e78', 'Modern Health Canada Inc', 'Senior Software Engineer', 'Toronto, ON', 'Full-Time', '2025-02-14', NULL, true, 'Built and maintained features for PlaySpace, a SOC 2 Type II compliant digital therapy platform used by 500+ therapists for virtual sessions.

Drove technical decision-making across the stack, mentoring teammates through code reviews and guiding architectural decisions.

Led SOC 2 compliance by auditing AWS infrastructure and codebase, reducing security vulnerabilities by 60% and supporting ongoing HIPAA certification.

Designed a full-featured appointment system with secure video, calendar sync (Google/Outlook), and flexible scheduling, architected to handle 10,000+ concurrent sessions.

Built real-time session controls with movement tracking, navigation syncing, and therapist-to-patient control handoff.

Set up AWS CloudWatch and CloudTrail for audit logging and configured secure VPN access for developer EKS connectivity.

Rebuilt the entire platform in 10 weeks with a 3-person team, using AI tools like Claude Code and RooCode to accelerate delivery by ~35%.

Designed a partner-ready integration architecture using Auth0 and Supabase with RLS policies, onboarding 4 partners at launch.

Integrated PostHog for product analytics, feature flags, and A/B testing across 20+ feature experiments.

Led an urgent 2-day migration from Chargebee to Stripe, then architected a provider-agnostic payment system reducing future integrations from days to hours.

Implemented AI-powered onboarding using Frigade, improving therapist activation rate by ~25%.

Set up OpenAPI documentation using Redocly and containerized applications with Docker and Kubernetes.', '2025-10-29 02:49:00.32019+00', '2025-10-29 02:49:00.32019+00');
INSERT INTO public.work_experiences VALUES ('fe4d0aae-3682-445d-b077-79b0d00cf1d4', '72e83701-5723-428c-b153-0a957cad5e78', 'Techuz Infoweb', 'Senior Software Engineer / Tech lead', 'Ahmedabad, IN', 'Full-Time', '2019-07-09', '2024-02-14', false, 'As Senior software Engineer:

Led a team of 5+ developers across multiple projects, fostering collaboration, mentoring team members, and ensuring on-time delivery with high-quality standards.

Communicated directly with clients to understand requirements and deliver tailored solutions, improving client satisfaction by 20%. 

Developed a reusable project boilerplate with pre-built features, reducing project setup time by 70% and feature development time by 20%.

Guided the team on adopting modern tools, integration strategies, and workflow improvements, boosting overall team efficiency and project quality.

Established comprehensive coding guidelines, conducted regular code reviews, and ensured adherence to best practices, improving code quality and reducing bugs.

Supported the team in leveraging AWS and DigitalOcean platforms for CI/CD using GitHub Actions and GitLab pipelines, improving deployment efficiency and reducing release errors.

Implemented process improvements across projects, streamlining development cycles and increasing client satisfaction and retention.

As Tech Lead:
Led multi-disciplinary teams of 25+ developers across React, Angular, Laravel, React Native, and WordPress, establishing code review processes and coding standards that reduced bugs and improved team productivity by 25%.

Drove adoption of Keycloak (authentication/SSO) and Hasura (GraphQL automation) as core infrastructure, cutting backend implementation time significantly and enabling faster client delivery across multiple projects.

Built the company''s first AI chatbot for a client, integrating real-time product guidance that increased user engagement and reduced support tickets.

Introduced ChatGPT-powered features (text refinement, voice-to-text, workflow automation) into client products, reducing manual effort and expanding the company''s AI service offerings.

Created reusable tech stack boilerplates and streamlined project setup, reducing initial development time by 30% and enabling faster onboarding for new team members.

Automated daily standups and reporting workflows using Standuply and Trello, cutting meeting overhead and improving visibility into project status.
', '2025-10-29 02:30:04.625924+00', '2025-11-24 23:31:11.146+00');


--
-- PostgreSQL database dump complete
--

\unrestrict tDpVleWO8YEV1kg9IQv59fyRkv7t9lWP1lU07uAYBKOebzqdeGdQdfSgmLil0LZ

