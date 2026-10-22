# Project: Anurag Joshi Portfolio

React (Vite + TypeScript) frontend + Spring Boot 3 (Java) backend + MySQL.
Two services, deployed separately (frontend → Vercel, backend → Render/Railway).
Full spec: @docs/SRS.md · Deployment: @docs/DEPLOYMENT.md

## Bash commands
- Frontend: `cd frontend && npm run dev` (dev server), `npm run build` (production build), `npm run lint`, `npm test` (Vitest)
- Backend: `cd backend && mvn spring-boot:run` (dev server, needs MySQL), `mvn spring-boot:test-run` (dev server on in-memory H2, no MySQL), `mvn test` (run tests), `mvn clean package` (build jar)
- MySQL database name: `spring_boot_db` (local, already running)

## Code style
- Frontend: TypeScript strict mode, functional components only, CSS Modules (`Component.module.css`) — no global CSS except `styles/globals.css` and `styles/tokens.css`
- Backend: standard layout under `com.anuragjoshi.portfolio` — controller → service → repository → model. Use DTOs for every request/response body; never expose JPA entities directly from a controller
- Icons: Lucide React only (it has no brand icons, so GitHub/LinkedIn use generic icons with text labels)
- Visual style is glassmorphism: make a panel glass with `composes: glass from global;` in its CSS Module (one definition in `globals.css`, with reduced-transparency, no-blur, and forced-colors fallbacks). Elements inside a glass panel use `--glass-tint`, never their own blur (nested backdrop blur can't see the page). Keep text on glass, not directly on the aurora background, so it holds WCAG AA contrast

## Workflow
- After any backend change, run `mvn test` before considering the task done
- After any frontend change, run `npm run build`, `npm run lint`, and `npm test`; fix all errors before stopping
- Content (profile, skills, projects, education) is fetched from the Spring Boot API — never hardcode it in React components
- Prefer running a single test file over the whole suite while iterating, for speed

## Architecture
- REST endpoints: `GET /api/profile`, `/api/skills`, `/api/projects`, `/api/education`, `/api/certifications`; `POST /api/contact`
- Errors are RFC 9457 problem responses with a readable `detail`; the frontend shows it as is
- CORS on the backend is restricted to the frontend's deployed domain — never open to `*`
- Contact form submissions send a real email via Spring Mail (`JavaMailSender`); no third-party form service. Rate-limited per visitor IP

## Gotchas
- Vercel cannot run the Spring Boot backend — it only hosts the frontend
- Don't commit real values for DB password or mail credentials in `application.properties` — use environment variables
- Footer copyright year must be generated at runtime (`new Date().getFullYear()`), never hardcoded
- Database env vars are `PORTFOLIO_DB_URL` / `PORTFOLIO_DB_USERNAME` / `PORTFOLIO_DB_PASSWORD`. Machine-wide `DB_USERNAME` / `DB_PASSWORD` exist for another project, and OS env vars override `backend/.env`
- Flyway owns the schema. Never edit an applied migration (startup fails on a checksum mismatch); add a new `V<n>__*.sql` instead
