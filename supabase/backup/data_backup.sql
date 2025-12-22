--
-- Data for Name: education; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.education VALUES ('9d2509c8-fb98-4b4b-9ce2-5935b80ccdbb', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'KSV University', '2015-03-01', '2017-05-09', 'Master''s', 'Computer Science', '2025-10-29 02:50:02.258162+00', '2025-10-29 02:50:02.258162+00');


--
-- Data for Name: imported_resumes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.projects VALUES ('49ac38ee-6305-4d3b-93f2-f4dd9c6b9d3f', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'PlaySpace', 'Senior Software Engineer', 'Collaborated with the engineering team to implement modular, scalable backend and integration layers for the PlaySpace Next.js agentic application, enabling seamless partner platform integration. Designed and optimized real-time workflows and data pipelines, contributed to secure multi-tenant infrastructure on AWS EKS with Terraform, and implemented monitoring with CloudWatch. Guided peers on best practices for CI/CD, modular architecture, and secure coding, improving team efficiency and system reliability.', '', '2025-10-29 03:00:17.656255+00', '2025-10-29 03:00:17.656255+00');
INSERT INTO public.projects VALUES ('077c51c4-96b0-41b8-a846-6c45fe35eb62', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'Devdocs AI', 'Contract Software Engineer', 'Collaborated with the engineering team to develop and optimize the AI-powered DevDocs platform, enabling training of AI agents on user-connected resources and delivering context-aware responses via ChatGPT, Claude, and other AI services. Built and maintained resource ingestion pipelines, automated syncing of multiple knowledge sources, and vectorized storage to provide AI agents with structured context. Contributed to SDKs and reusable components for embedding AI workflows, while mentoring teammates on best practices for scalable, secure, and maintainable systems.', '', '2025-10-29 03:01:41.127502+00', '2025-10-29 03:01:41.127502+00');
INSERT INTO public.projects VALUES ('85a22c2f-3437-4a4e-8f38-19e457e3a7f7', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'LearnOtter', 'Project Lead & Full Stack engineer', 'Led the development of Learnotter, an online collaborative learning platform, as Senior Full Stack Developer, guiding the team in designing a dynamic frontend using React, Redux, and Gatsby. Architected and implemented real-time communication features with Express.js and Socket.IO to enable seamless collaboration among users. Oversaw secure and efficient data management using MySQL and MinIO, and led the deployment and scaling strategy with Docker and AWS EC2. Configured Nginx for optimized content delivery and worked closely with the team to enforce best practices for modular, maintainable, and high-performance code across the platform.', '', '2025-10-29 03:08:18.580838+00', '2025-10-29 03:08:18.580838+00');
INSERT INTO public.projects VALUES ('51f6c359-362e-445d-ac10-0c919dc726f6', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'SportsJaw', 'Senior Software Engineer', 'Contributed as a Full Stack Developer to SportsJaw, a web application delivering predictive insights for sports bettors. Developed and optimized frontend features using React and Apollo Client, integrating with Hasura-managed GraphQL APIs and leveraging GraphQL Code Generator to produce reusable hooks for consistent and efficient data fetching. Collaborated with cross-functional teams using Agile methodologies to iteratively design, develop, and deliver the platform, ensuring a seamless, responsive, and maintainable user experience.', '', '2025-10-29 03:10:34.996192+00', '2025-10-29 03:10:34.996192+00');


--
-- Data for Name: resumes; Type: TABLE DATA; Schema: public; Owner: -
--

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

INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '8f3f1d34-3dd1-4450-bcce-011a6cd9f397', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '6feff982-b473-4412-b780-1b62c70f8724', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'd6c578bd-a142-4d90-b422-2082d9f7bab6', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'd0680220-fc84-4d46-af0c-b9a49476ea1d', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '6a16e618-700f-4a13-9a06-baa6c3e5abe9', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '3409aafc-7355-46bd-8321-dd9616b41560', '2a60f977-333d-4de6-ade2-75a8680d1bb7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '4ed08d6d-374b-481f-98bf-2a02d7b42ef8', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '3c920545-3e8a-4487-82ee-8a2a910fd151', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'e82beb4f-4797-4003-8d74-b8ce066e70d2', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '2b1a6eb5-08c2-426c-970c-31f498b8a5be', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'fce90983-d395-4f29-aa4a-39b2e2eca909', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '75e6651a-28d9-49ff-a6ad-be9497c4bb5e', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '1a56dbd8-4c8b-4ee5-adb4-42b30499fc50', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '5d5cd8a2-2080-480a-bcec-6158e26c2385', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'b12276c3-b89e-43d2-8003-330931b5587d', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '1b5b51ce-b1a0-45dd-888c-c04defb83194', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'f793c84a-6a68-42d6-8084-fe4b7a9bde4a', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'e1e84b02-6212-4685-93d9-ff896c0a111e', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'df0a50d6-5a60-48ac-a3cd-037b650f6724', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '236f9479-77b9-4504-b718-160c8acd1e2c', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '835c5573-bf9e-449c-934f-12bedf87d551', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '8a38d5aa-c3ff-47cd-bbcc-088b447e7df3', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '6c7bee81-e785-47fb-b9f0-e0ec83a5b1be', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '8a7496b4-bf60-4606-8bed-f172fb9fa4a7', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'd3af6449-2502-4891-9686-7fb49cae672c', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '862aaa70-5cac-4685-a9a6-5780a8adc2ad', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'e01a7c9a-0395-4e11-a415-f4c586c15e20', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'f3a88ac1-759f-465d-ab42-7119ddd94035', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'dfd65e26-062a-4889-8bd3-8144c45f35ac', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '2db81617-8ef7-498b-9e03-90f1caaef5b5', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '0d5001e0-be62-4d20-8717-6a564bfffb71', '885b1a58-e4d1-4b0c-8319-42b2a3009cf7');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'b0a6fd21-f37c-43b7-b6ae-68ef708e3c3f', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '4c3e02fc-f38e-4ee9-b181-0bd94c3acdf7', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'a7672271-f420-4935-851f-e9ecc8866594', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '280cd7b2-2d1b-4355-a25b-ef3f10fd27d5', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '47414950-03c8-4423-93dd-cc7e73aa6cba', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'd41e267c-1563-43eb-9606-dfd1b9c0423f', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'a9628532-3e03-4884-b7ca-112f69a20f0e', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'd371e0d0-bfe6-431b-8f48-f53fc659a033', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '53d271d1-e7ea-4af8-afc3-78b608934163', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'c68711fd-9e5e-49f1-884b-177acf0d8d9b', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '239f1416-112c-463c-bd70-62688f4c5a1d', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '50bb2502-609c-45ab-b450-c459132fe45e', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '22cd3830-a0b3-480e-a8b5-bc83a43a397a', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '04e97ed8-ca54-4143-949c-bf3dc0f653c9', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '8eb27eaf-0e79-4fff-8b78-fd65ceb08c32', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'e1999244-5856-4033-85ef-b93d0445ecfb', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '7e0a8e36-c4eb-4cea-b90e-deee6323499c', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '58096514-5170-4ee8-a7a3-e37092ed9bcf', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '05a67ef8-f5e7-4a4e-9c09-868a27bffe79', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '95a11ba0-4727-497c-885a-3f38fedcee6a', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '4d3db10e-c521-44a0-a16a-9ed451cf771f', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'e11e5a2d-0507-4a02-af31-e3ef45800ab6', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '0b228e03-7ff0-48aa-bd26-7eecadf4cfc6', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'd5cddc4d-b156-463b-b6f9-391a7255547d', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'c6aae149-2d7a-4c95-9a57-9e69db84fa73', '1ea26792-ad01-4222-8e8e-52c317600c7c');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '8508db65-23bb-4603-9aa9-2da067e13bdc', 'ad464b88-6474-4bb2-9f4b-32b2e2252d35');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '7417768b-86e0-4366-a5c7-a5fe14cdad65', '79427307-a692-46ea-9ef4-f91605c6f5ab');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'fec235ad-39a8-4d96-bab6-4995de4be08e', '79427307-a692-46ea-9ef4-f91605c6f5ab');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', 'b2513a94-34db-4969-8679-984aa82b429d', 'dc9d5213-b147-435d-be51-f3094fc0b079');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '918e7660-8789-4f27-926a-6a540c725ac8', 'dc9d5213-b147-435d-be51-f3094fc0b079');
INSERT INTO public.user_skills VALUES ('22c80349-417f-4226-ac7d-60f6cb7c6163', '1392f5e9-fa8e-4e5e-98a8-75d55d656cd3', '2aac0028-15e9-4dad-8e50-88cc7b8ee6be');


--
-- Data for Name: work_experiences; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.work_experiences VALUES ('cdeda558-fb95-44a5-8ea1-2c5807c94ebd', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'Devdocs LLC', 'Senior Software Engineer', 'Texas, USA (Remote)', 'Contract', '2024-02-01', '2025-02-13', false, 'Led full-stack development of an AI-powered customer support platform using Next.js, LangChain, Vercel AI SDK, Trigger.dev, Pipedream, Nango and some other automation and AI tools.

Built the core RAG pipeline with vector database storage and Neo4j graph memory, reducing average query resolution time by ~40%.

Developed 12+ integrations (GitHub, Notion, Salesforce, Jira, Confluence, HubSpot, etc.) with real-time sync capabilities.

Designed a model-agnostic architecture supporting runtime LLM switching, reducing AI infrastructure costs by ~30%.

Built a React SDK and embeddable chat widget, reducing customer integration time from days to under an hour.

Implemented usage metering and subscription-based limits for tokens, file syncing, and agent interactions.

Mentored new team members and documented the codebase for smooth onboarding.', '2025-10-29 02:38:28.971481+00', '2025-10-29 02:38:48.52+00');
INSERT INTO public.work_experiences VALUES ('aec37d46-885f-4810-b54d-a860f4d098b0', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'Creole Studios', 'Web Developer', 'Ahmedabad, IN', 'Full-Time', '2017-02-02', '2019-06-29', false, 'Developed an online training management system for a Kenyan client, reducing manual work by ~40% and staff/session management effort by ~30% through automated dashboards.

Implemented third-party integrations to streamline workflows and enhance application functionality.

Contributed to FastFocus, a real-time market research platform, improving survey analytics and decision-making for global clients.

Gained hands-on experience with Laravel, React, Node, Angular, GraphQL, MySQL, PostgreSQL, MongoDB, Firebase, and AWS services like EC2, S3, and Lambda.

Implemented Single Sign-On (SSO) solutions to enhance security and user accessibility across applications.

Collaborated in code reviews, debugged frontend and backend issues, and supported colleagues across projects to maintain high-quality application delivery.', '2025-10-29 02:21:46.272649+00', '2025-10-29 02:21:46.272649+00');
INSERT INTO public.work_experiences VALUES ('ea05b86e-b015-4414-91e0-f85f1c7c927e', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'Modern Health Canada Inc', 'Senior Software Engineer', 'Toronto, ON', 'Full-Time', '2025-02-14', NULL, true, 'Built and maintained features for PlaySpace, a SOC 2 Type II compliant digital therapy platform used by 500+ therapists for virtual sessions.

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
INSERT INTO public.work_experiences VALUES ('fe4d0aae-3682-445d-b077-79b0d00cf1d4', '22c80349-417f-4226-ac7d-60f6cb7c6163', 'Techuz Infoweb', 'Senior Software Engineer / Tech lead', 'Ahmedabad, IN', 'Full-Time', '2019-07-09', '2024-02-14', false, 'As Senior software Engineer:

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
