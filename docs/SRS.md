# Anurag Joshi Portfolio — Software Requirements Specification

Oct 13, 2026 · @Anurag Joshi

This SRS defines the functional and non-functional requirements for a personal portfolio website for Anurag Joshi, a final-year B.Tech CSE student and Java full-stack developer, built to support placement applications and freelance client outreach.

## 1. Introduction

**Purpose.** This document fixes what the portfolio must do before any code is written, so the build has a stable target instead of requirements that shift mid-way.

**Scope.** A single frontend site covering Navigation, Hero, About, Skills, Projects, Experience & Education, Achievements, and Contact — no backend, database, or CMS.

**Audience.** Anurag Joshi, as owner and developer; recruiters, hiring managers, and freelance clients as visitors.

**Conventions.** Functional requirements are tagged FR-\<section>-\<n>, non-functional ones NFR-\<n>. "Must" ships in v1; "Should" ships if time allows.

## 2. Overall Description

**Product perspective.** A new, standalone static site — not an extension of an existing product. It replaces a shared resume PDF or a bare GitHub profile as the main entry point for recruiters and clients.

| User class | Goal on the site | Key interaction |
| --- | --- | --- |
| Recruiter / hiring manager | Judge skill and fit quickly | Skills, Projects, resume download |
| Freelance client | Judge delivery quality, then reach Anurag | Projects, contact form |
| Anurag (owner) | Keep content current without touching layout code | Edits data files only |

**Operating environment.** Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on desktop and mobile, served as a static build from a CDN host.

**Constraints.** The backend (Spring Boot) and frontend (React) deploy and scale as two separate services; no fabricated testimonials, stats, or outcomes; real links only, with placeholders marked clearly where real data is still pending.

**Assumptions.** Anurag supplies a real email, GitHub, LinkedIn, and resume link before launch; project screenshots come from the actual repositories.

## 3. Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-NAV-1 | Sticky nav links to every section, with active-section highlighting | Must |
| FR-NAV-2 | Mobile hamburger menu opens, closes, and navigates correctly | Must |
| FR-HERO-1 | Hero states name, title, core strengths, and a next action in one screen | Must |
| FR-HERO-2 | Hero offers "View Projects," "Download Resume," and "Contact Me" actions | Must |
| FR-ABOUT-1 | About gives a concise background, interests, and career objective | Must |
| FR-SKILLS-1 | Skills are grouped by category (Languages, Backend, Frontend, Databases, Tools), real skills only | Must |
| FR-SKILLS-2 | No unexplained proficiency percentages on skill bars | Should |
| FR-DATA-1 | Profile, skills, projects, and education are fetched from the Spring Boot API, not hardcoded in the frontend | Must |
| FR-PROJ-1 | Each project card shows name, description, problem solved, tech stack, and GitHub/live links | Must |
| FR-PROJ-2 | Multi-Agent AI Platform and SocialSync are featured as real, linked projects | Must |
| FR-PROJ-3 | Project filtering, if implemented, actually filters the visible cards | Should |
| FR-EXP-1 | Education entry for B.Tech CSE at BBDU, Lucknow (2023–2027), real dates | Must |
| FR-ACH-1 | Achievements/certifications section stays hidden until real items exist | Should |
| FR-CONTACT-1 | Contact lists a working email, GitHub, and LinkedIn link | Must |
| FR-CONTACT-2 | Contact form posts to the Spring Boot `/api/contact` endpoint, which sends a real email and returns an honest success/error response | Must |
| FR-FOOTER-1 | Footer copyright year is generated dynamically, never hardcoded | Must |

## 4. System Architecture

&#91;embedded content: architecture · MySQL, Spring Boot API, React, two deployments\]

MySQL holds the data; the Spring Boot API serves it; the React app, deployed on Vercel, renders it for the visitor. The contact form posts straight to the same API, which sends you the email.

## 5. Non-Functional Requirements

| ID | Category | Target |
| --- | --- | --- |
| NFR-1 | Performance | Lighthouse performance score ≥ 90; largest contentful paint < 2.5s on mid-range 4G |
| NFR-2 | Accessibility | Practical WCAG AA: color contrast, keyboard navigation, alt text, visible focus states |
| NFR-3 | SEO | Title, meta description, Open Graph tags, canonical URL, and favicon on every page |
| NFR-4 | Security | No API keys or secrets in client-side code; service keys go through environment variables; Spring Boot restricts CORS to the frontend's domain |
| NFR-5 | Responsiveness | Correct layout at 360px, 768px, 1024px, and 1440px, no horizontal scroll |
| NFR-6 | Maintainability | Adding a project or skill means an insert into MySQL, no component changes |
| NFR-7 | Browser support | Latest two versions of Chrome, Edge, Firefox, and Safari |
| NFR-8 | API reliability | Backend returns a clear error response, not a silent failure, if MySQL or mail delivery is unavailable |

## 6. Technology Stack

You asked to use Spring Boot, so the backend below pairs it with the React frontend from the UI/UX sample.

| Layer | Technology | Reason |
| --- | --- | --- |
| Frontend framework | React 18 + TypeScript | Typed props, interactive UI |
| Frontend build tool | Vite | Fast dev server, minimal config |
| Frontend styling | CSS Modules | Scoped styles, no class-name collisions |
| Icons | Lucide React | Consistent, lightweight icon set |
| Backend framework | Spring Boot 3 (Java) | Matches your current Spring Boot roadmap; typed, testable REST layer |
| Backend data access | Spring Data JPA | Matches your current MySQL + JPA learning |
| Database | MySQL | Already set up locally (`spring_boot_db`) |
| Email delivery | Spring Mail (JavaMailSender) | Sends contact-form messages without a third-party form service |
| Backend build tool | Maven | Matches your existing environment |
| Frontend hosting | Vercel | Free tier, zero-config React/Vite deploys |
| Backend hosting | Render or Railway (free tier) | Runs a Java process; Vercel can't host Spring Boot |
| Version control | GitHub | Matches your existing workflow |

## 7. Content Data Model

Each entity is a JPA entity backed by a MySQL table, exposed through a REST endpoint the frontend fetches — so adding a project or skill means a database insert, not a redeploy.

| Entity | Fields | Endpoint | Drives |
| --- | --- | --- | --- |
| Profile | id, name, title, bio, location, email, resumeUrl, githubUrl, linkedinUrl | GET /api/profile | Hero, About, Contact |
| Skill | id, category, name | GET /api/skills | Skills |
| Project | id, name, description, problem, techStack, imageUrl, githubUrl, liveUrl, featured | GET /api/projects | Projects |
| Education | id, institution, degree, field, startYear, endYear, notes | GET /api/education | Experience & Education |
| Certification | id, name, issuer, date, verifyUrl | GET /api/certifications | Achievements (hidden if empty) |
| ContactMessage | id, name, email, message, submittedAt | POST /api/contact | Contact form submission |

## 8. Project Folder Structure

```
portfolio/
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/        # images, icons
│   │   ├── components/    # Navbar, Footer, ProjectCard, SkillBadge
│   │   ├── sections/       # Hero, About, Skills, Projects, Experience, Contact
│   │   ├── api/              # profile.ts, projects.ts, skills.ts — fetch calls
│   │   ├── hooks/            # useActiveSection, useTheme
│   │   ├── styles/            # globals.css, tokens.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── backend/
    ├── src/main/java/com/anuragjoshi/portfolio/
    │   ├── controller/      # ProfileController, ProjectController, ContactController
    │   ├── service/           # ContactService (sends mail)
    │   ├── repository/       # JPA repositories
    │   ├── model/              # Profile, Skill, Project, Education, ContactMessage
    │   ├── dto/                  # request/response DTOs
    │   ├── config/              # CorsConfig, MailConfig
    │   └── PortfolioApplication.java
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## 9. Implementation Phases

1. **Discovery** — confirm real content: bio, project links, resume, email.
2. **Planning** — lock this SRS and the UI/UX sample as the build reference.
3. **Foundation** — design tokens, global styles, shared Navbar and Footer; scaffold the Spring Boot project with a MySQL connection.
4. **Main development** — Hero, About, Skills, Projects, Experience, built from data fetched through the Spring Boot API.
5. **Interactions** — mobile menu, theme toggle, resume action, contact form wired to `/api/contact`.
6. **Responsive & accessibility pass** — test at 360/768/1024/1440px, keyboard navigation, focus states.
7. **QA** — run the frontend build and the backend tests; fix broken links, console errors, and failing endpoints.
8. **Deploy & document** — deploy the frontend to Vercel and the backend to Render, write the README, start sharing the link.

## 10. Acceptance Criteria

- [ ] Every nav link scrolls or routes to the right section
- [ ] Mobile menu opens, closes, and navigates
- [ ] All project cards link to real GitHub repos and live demos, or are clearly marked "in progress"
- [ ] Resume downloads or opens correctly
- [ ] Contact form posts to `/api/contact` and shows an honest success/error state
- [ ] No horizontal scroll or clipped content between 360px and 1440px
- [ ] Lighthouse performance and accessibility scores ≥ 90
- [ ] No console errors or broken imports
- [ ] `npm run build` and lint pass cleanly
- [ ] Footer year updates automatically
- [ ] Spring Boot starts cleanly and connects to MySQL
- [ ] Every endpoint (`/api/profile`, `/api/skills`, `/api/projects`, `/api/education`, `/api/contact`) returns the expected JSON
