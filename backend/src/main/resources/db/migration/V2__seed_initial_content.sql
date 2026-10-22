-- Initial portfolio content. Flyway runs this once per database.
--
-- Review every line BEFORE the first `mvn spring-boot:run` against MySQL: until then you can edit
-- this file freely. After it has run, never edit it (Flyway will refuse to start on a checksum
-- mismatch) - change content with plain SQL instead, e.g.
--   UPDATE profile SET github_url = 'https://github.com/<you>' WHERE id = 1;
--   INSERT INTO skill (category, name) VALUES ('Tools', 'Docker');
--
-- NULL means "not supplied yet": the site shows it as pending instead of rendering a broken link.

-- Pending: resume_url.
-- Draft wording to confirm: tagline, bio, interests, objective, location.
INSERT INTO profile (name, title, tagline, bio, interests, objective, location, email, resume_url, github_url, linkedin_url)
VALUES (
    'Anurag Joshi',
    'Java Full-Stack Developer',
    'I build REST APIs with Java and Spring Boot, and the React interfaces that use them.',
    'I''m a final-year B.Tech Computer Science and Engineering student at Babu Banarasi Das University, Lucknow. I build full-stack web applications: Spring Boot and Spring Data JPA on the backend, React and TypeScript on the frontend, and MySQL for storage.',
    'Backend design and clean REST APIs, and putting large language models to work in practical tools, which is where my Multi-Agent AI Platform and SocialSync projects come from.',
    'I''m looking for a full-time software developer role through campus placements, and I''m open to freelance web projects in the meantime.',
    'Lucknow, India',
    'anuragjoshi1403@gmail.com',
    NULL,
    'https://github.com/anurag-joshi-1403',
    'https://www.linkedin.com/in/anurag-joshi-49749229a/'
);

-- Real skills only (FR-SKILLS-1). Display order: Languages, Backend, Frontend, Databases, Tools,
-- then insertion order within a category.
INSERT INTO skill (category, name) VALUES
    ('Languages', 'Java'),
    ('Languages', 'JavaScript'),
    ('Languages', 'TypeScript'),
    ('Languages', 'SQL'),
    ('Backend', 'Spring Boot'),
    ('Backend', 'Spring Security'),
    ('Backend', 'Spring Data JPA'),
    ('Backend', 'REST APIs'),
    ('Backend', 'WebSocket (STOMP)'),
    ('Backend', 'JWT'),
    ('Frontend', 'React'),
    ('Frontend', 'Vite'),
    ('Frontend', 'UI/UX'),
    ('Databases', 'PostgreSQL'),
    ('Databases', 'MySQL'),
    ('Databases', 'Redis'),
    ('Tools', 'Git'),
    ('Tools', 'GitHub'),
    ('Tools', 'Docker'),
    ('Tools', 'GitHub Actions'),
    ('Tools', 'Maven'),
    ('Tools', 'Postman'),
    ('Tools', 'Swagger/OpenAPI');

-- Details taken from each repository's README on GitHub. Pending: image_url (screenshots), and
-- live_url wherever a project isn't deployed.
INSERT INTO project (name, description, problem, tech_stack, image_url, github_url, live_url, featured) VALUES
    (
        'Multi-Agent AI Platform',
        'A chat console for five specialised AI agents (coding, research, summarising, document Q&A, and general chat), backed by a Spring Boot API that fails over across five LLM providers. Each agent describes itself, so a new one appears in the console with no frontend changes.',
        'One general-purpose chatbot treats code, research, and documents the same way. Focused agents give better answers, and provider failover keeps them answering when one AI service is down or rate-limited.',
        'Java, Spring Boot, Spring AI, Spring Security, MongoDB, React, TypeScript, Vite',
        NULL, 'https://github.com/anurag-joshi-1403/Multi-Agent-AI-Platform', NULL, TRUE
    ),
    (
        'Student Management System',
        'A Spring Boot MVC web app that runs a college''s daily administration (students, teachers, courses, attendance, exams, results, and fees) behind role-based logins for admins, teachers, and students, with 55 automated tests run by GitHub Actions.',
        'Colleges still track admissions, attendance, and fees across spreadsheets and paper. This puts every record behind one login, with a live dashboard, PDF marksheets and receipts, and alerts for overdue fees and low attendance.',
        'Java, Spring Boot, Spring Security, Spring Data JPA, MySQL, Thymeleaf, Bootstrap, JUnit 5, GitHub Actions',
        NULL, 'https://github.com/anurag-joshi-1403/StudentManagementSystem', NULL, TRUE
    ),
    (
        'SocialSync',
        'B.Tech major project, built in a team of four: a web app where creators and small businesses generate captions with Google Gemini, schedule posts for Instagram, Facebook, X, and LinkedIn, and review engagement on a dashboard. Platform publishing is simulated.',
        'Small businesses juggle captions, posting times, and per-platform analytics across separate tools. SocialSync puts drafting, scheduling, automatic publishing, and engagement review in one place.',
        'React, Vite, Node.js, Express, MongoDB, Google Gemini',
        NULL, 'https://github.com/anurag-joshi-1403/Social_Sync_Webapp', 'https://social-sync-webapp.vercel.app', TRUE
    ),
    (
        'Portfolio Website',
        'This site: a React and TypeScript frontend that reads all of its content from a Spring Boot REST API backed by MySQL, with a contact form that emails me directly.',
        'A resume PDF or a bare GitHub profile says little about how I build software. A working full-stack site shows it, and new projects go live with a database insert instead of a code change.',
        'React, TypeScript, Spring Boot, Spring Data JPA, MySQL, Flyway',
        NULL, 'https://github.com/anurag-joshi-1403/Anurag-Joshi-Portfolio', NULL, FALSE
    );

INSERT INTO education (institution, degree, field, start_year, end_year, notes) VALUES
    ('Babu Banarasi Das University, Lucknow', 'B.Tech', 'Computer Science and Engineering', 2023, 2027, NULL);

-- Certifications are added by later migrations (V3 onward). While the table is empty, the
-- Achievements section stays hidden (FR-ACH-1).
