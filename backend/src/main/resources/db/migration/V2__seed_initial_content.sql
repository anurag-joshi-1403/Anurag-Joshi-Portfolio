-- Initial portfolio content. Flyway runs this once per database.
--
-- Review every line BEFORE the first `mvn spring-boot:run` against MySQL: until then you can edit
-- this file freely. After it has run, never edit it (Flyway will refuse to start on a checksum
-- mismatch) - change content with plain SQL instead, e.g.
--   UPDATE profile SET github_url = 'https://github.com/<you>' WHERE id = 1;
--   INSERT INTO skill (category, name) VALUES ('Tools', 'Docker');
--
-- NULL means "not supplied yet": the site shows it as pending instead of rendering a broken link.

-- Pending: email, resume_url, github_url, linkedin_url.
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
    NULL,
    NULL,
    NULL,
    NULL
);

-- Real skills only (FR-SKILLS-1). Display order: Languages, Backend, Frontend, Databases, Tools,
-- then insertion order within a category.
INSERT INTO skill (category, name) VALUES
    ('Languages', 'Java'),
    ('Languages', 'TypeScript'),
    ('Languages', 'JavaScript'),
    ('Languages', 'SQL'),
    ('Backend', 'Spring Boot'),
    ('Backend', 'Spring Data JPA'),
    ('Backend', 'REST API design'),
    ('Frontend', 'React'),
    ('Frontend', 'HTML'),
    ('Frontend', 'CSS'),
    ('Databases', 'MySQL'),
    ('Tools', 'Git'),
    ('Tools', 'GitHub'),
    ('Tools', 'Maven');

-- Pending for every project: github_url, live_url, image_url (screenshots from the real repositories).
INSERT INTO project (name, description, problem, tech_stack, image_url, github_url, live_url, featured) VALUES
    (
        'Multi-Agent AI Platform',
        'A Spring Boot platform where specialised AI agents (coding, PDF, search, research, and a retrieval-augmented knowledge agent) each handle one kind of task behind a shared REST API.',
        'A single general-purpose assistant handles code, documents, and research equally loosely. Routing each request to an agent built for that task gives more focused, more reliable answers.',
        'Java, Spring Boot, REST APIs, LLM APIs, RAG',
        NULL, NULL, NULL, TRUE
    ),
    (
        'SocialSync',
        'B.Tech major project, built in a team of four: a web app where creators and small businesses generate AI captions and hashtags, schedule or publish posts to several platforms, and review engagement in a calendar and dashboard.',
        'Small businesses juggle captions, posting times, and per-platform analytics across separate tools. SocialSync puts drafting, scheduling, automatic publishing, and engagement review in one place.',
        'React, Node.js, Express, MongoDB',
        NULL, NULL, NULL, TRUE
    ),
    (
        'Portfolio Website',
        'This site: a React and TypeScript frontend that reads all of its content from a Spring Boot REST API backed by MySQL, with a contact form that emails me directly.',
        'A resume PDF or a bare GitHub profile says little about how I build software. A working full-stack site shows it, and new projects go live with a database insert instead of a code change.',
        'React, TypeScript, Spring Boot, Spring Data JPA, MySQL',
        NULL, NULL, NULL, FALSE
    );

INSERT INTO education (institution, degree, field, start_year, end_year, notes) VALUES
    ('Babu Banarasi Das University, Lucknow', 'B.Tech', 'Computer Science and Engineering', 2023, 2027, NULL);

-- No certifications yet: the Achievements section stays hidden while this table is empty (FR-ACH-1).
