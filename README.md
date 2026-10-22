# Anurag Joshi — Personal Portfolio

[![CI](https://github.com/anurag-joshi-1403/Anurag-Joshi-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/anurag-joshi-1403/Anurag-Joshi-Portfolio/actions/workflows/ci.yml)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-purple?logo=vite)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker)

A production-grade, full-stack personal portfolio platform for **Anurag Joshi** (Java Full-Stack Developer & B.Tech CSE student at Babu Banarasi Das University, Lucknow).

Unlike typical static portfolio websites with hardcoded JSON files, this application is engineered as a decoupled, microservice-ready system: a modern **React 18 + TypeScript** frontend with a responsive glassmorphic design system communicating with a resilient **Spring Boot 3 REST API** backed by **MySQL** and version-controlled via **Flyway** migrations.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [REST API Reference](#-rest-api-reference)
- [Local Development & Setup](#-local-development--setup)
  - [Prerequisites](#prerequisites)
  - [Option A: Zero-MySQL Quick Start (H2 In-Memory)](#option-a-zero-mysql-quick-start-h2-in-memory)
  - [Option B: Full Setup with MySQL & Spring Mail](#option-b-full-setup-with-mysql--spring-mail)
  - [Frontend Setup](#frontend-setup)
- [Environment Configuration](#-environment-configuration)
- [Database Migrations & Content Updates](#-database-migrations--content-updates)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Guide](#-deployment-guide)
- [Documentation Links](#-documentation-links)
- [About the Author](#-about-the-author)

---

## 🏛 Architectural Overview

```
                                      +------------------------------------+
                                      |            Web Browser             |
                                      |   (Desktop / Tablet / Mobile)      |
                                      +-----------------+------------------+
                                                        |
                                          HTTP Requests | (REST / JSON)
                                                        v
+-------------------------------+             +------------------------------------+
|        Frontend Layer         |             |           Backend Layer            |
|       (Hosted on Vercel)      |             |     (Hosted on Render / Docker)    |
|                               |             |                                    |
| - React 18 + TypeScript       |             | - Spring Boot 3.5 (Java 21)        |
| - Vite Build System           |             | - Spring Data JPA & Hibernate      |
| - Vanilla CSS Tokens & Modules|             | - Spring Boot Actuator             |
| - Light / Dark Theme Engine   |             | - In-Memory IP Rate Limiter        |
| - Cold-Start UX Awareness     |             | - RFC 9457 Problem Details Handler |
+-------------------------------+             +-----------------+------------------+
                                                                |
                                             +------------------+------------------+
                                             |                                     |
                                             v                                     v
                              +------------------------------+      +------------------------------+
                              |        Database Layer        |      |         Email Service        |
                              |  (MySQL 8 / TiDB / Railway)  |      |         (Spring Mail)        |
                              |                              |      |                              |
                              | - Schema & Data via Flyway   |      | - JavaMailSender via SMTP    |
                              | - H2 for Zero-Setup Dev/Tests|      | - Real-time Form Submissions |
                              +------------------------------+      +------------------------------+
```

---

## ✨ Key Features

- **Decoupled Dynamic Content Engine**: Profile bio, skills taxonomy, featured projects, educational records, and summer training certifications are all served via the REST API rather than baked into static bundles.
- **Dynamic Glassmorphism Design System**:
  - Pure CSS Tokens and CSS Modules (`composes: glass from global;`).
  - Dual aurora ambient backdrop glow with strict WCAG AA contrast compliance (minimum 5.5:1 text contrast).
  - Seamless light/dark mode switcher honoring system defaults (`color-scheme: light dark`), switchable via navbar and persisted in `localStorage`.
  - Zero-Flash Theme Bootstrapping (`index.html` inline script applies stored theme before first paint).
- **Secure & Rate-Limited Contact System**:
  - Submissions post to `/api/contact` and trigger genuine delivery via `JavaMailSender` (no third-party forms).
  - Sliding-window in-memory IP rate limiter (`ContactRateLimiter`: max 5 requests per hour per visitor IP).
  - Reverse-proxy friendly (`server.forward-headers-strategy=native` extracting genuine client IPs from `X-Forwarded-For`).
  - Form validation with Spring Bean Validation (`@Valid`) and RFC 9457 Problem Details error responses.
- **Cold-Start UX & Resilience**:
  - Graceful skeleton loading states.
  - Transparent notification if the backend is waking up on a free-tier host (Render/Railway 15-minute sleep cycle).
  - Built-in GitHub Actions Keep-Warm workflow (`.github/workflows/keep-warm.yml`) to ping `/actuator/health` periodically.
- **Smart Conditional Sections**:
  - Achievements / Certifications section automatically remains hidden until valid records are returned by the API (FR-ACH-1).
- **Zero-Setup Local Dev Mode**:
  - `mvn spring-boot:test-run` launches the backend against an in-memory H2 database seeded with all migrations, allowing frontend developers or evaluators to test without local MySQL.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: Vanilla CSS Modules + CSS Custom Properties (Tokens)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + [jsdom](https://github.com/jsdom/jsdom)
- **Code Quality**: ESLint 10 + TypeScript-ESLint

### Backend
- **Framework**: [Spring Boot 3.5](https://spring.io/projects/spring-boot) (Java 21)
- **Data Access**: Spring Data JPA + Hibernate ORM
- **Database**: [MySQL 8](https://www.mysql.com/) (Production/Dev), [H2 Database](https://www.h2database.com/) (Test & Zero-Setup Run)
- **Database Migrations**: [Flyway](https://flywaydb.org/)
- **Validation & Messaging**: Spring Validation (`jakarta.validation`), Spring Mail (`JavaMailSender`)
- **Observability**: Spring Boot Actuator (`/actuator/health`)
- **Testing**: JUnit 5, Mockito, MockMvc

### DevOps & Deployment
- **Frontend Hosting**: [Vercel](https://vercel.com/)
- **Backend Hosting**: [Render](https://render.com/) / [Railway](https://railway.app/) (Containerized with Docker)
- **Continuous Integration**: GitHub Actions (`.github/workflows/ci.yml`)

---

## 📂 Project Directory Structure

```
Anurag-Joshi-Portfolio/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated CI: Maven tests + Frontend lint, test, build
│       └── keep-warm.yml          # Scheduled cron ping preventing free-tier cold starts
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/anuragjoshi/portfolio/
│   │   │   │   ├── config/        # CorsConfig, MailConfig
│   │   │   │   ├── controller/    # REST Controllers & ApiExceptionHandler (RFC 9457)
│   │   │   │   ├── dto/           # Request/Response Data Transfer Objects
│   │   │   │   ├── model/         # JPA Entities (Profile, Skill, Project, Education, etc.)
│   │   │   │   ├── repository/    # Spring Data JPA Repositories
│   │   │   │   ├── service/       # ContactService & ContactRateLimiter
│   │   │   │   └── PortfolioApplication.java
│   │   │   └── resources/
│   │   │       ├── db/migration/  # Flyway schema (V1), seed (V2), and certification (V3)
│   │   │       └── application.properties
│   │   └── test/                  # Unit, slice, and integration tests (H2 in-memory)
│   ├── Dockerfile                 # Multi-stage build for containerized cloud deployment
│   ├── pom.xml                    # Maven configuration and dependencies
│   └── .env.example               # Backend environment variable template
├── frontend/
│   ├── public/                    # Favicon, robots.txt, static assets
│   ├── src/
│   │   ├── api/                   # Typed API clients (profile, projects, skills, contact)
│   │   ├── components/            # Navbar, Footer, ProjectCard, ContactForm, ThemeToggle
│   │   ├── hooks/                 # useApi, useTheme
│   │   ├── sections/              # Hero, About, Skills, Projects, Education, Achievements
│   │   ├── styles/                # globals.css, tokens.css (Glassmorphic design system)
│   │   ├── App.tsx                # App root with API orchestration
│   │   └── main.tsx               # Entry point
│   ├── package.json               # Frontend scripts and dependencies
│   ├── vite.config.ts             # Vite configuration with profile preload
│   └── .env.example               # Frontend environment variable template
├── docs/
│   ├── SRS.md                     # Software Requirements Specification
│   └── DEPLOYMENT.md              # Step-by-step production deployment guide
├── resume/                        # Anurag Joshi's verified resume documents (PDF, DOCX)
├── CLAUDE.md                      # Developer conventions, architecture rules, and notes
└── README.md                      # Project documentation
```

---

## 🔌 REST API Reference

All backend responses use JSON. Error responses follow the **RFC 9457 Problem Details** standard (`application/problem+json`).

| Method | Endpoint | Description | Sample Response / Request |
|---|---|---|---|
| `GET` | `/api/profile` | Fetches Anurag's profile, bio, social links, resume URL | `{"name": "Anurag Joshi", "title": "Java Full-Stack Developer", ...}` |
| `GET` | `/api/skills` | Returns skills categorized into Languages, Backend, Frontend, Databases, Tools | `[{"category": "Backend", "name": "Spring Boot"}, ...]` |
| `GET` | `/api/projects` | Retrieves list of projects with tech stack and repo/demo links | `[{"name": "Multi-Agent AI Platform", "featured": true, ...}]` |
| `GET` | `/api/education` | Returns educational history (B.Tech CSE at BBDU) | `[{"institution": "Babu Banarasi Das University", ...}]` |
| `GET` | `/api/certifications` | Returns verified certifications (e.g. GRAStech Summer Training) | `[{"name": "Core Java and Advanced Java...", "issuer": "GRAStech"}]` |
| `POST` | `/api/contact` | Submits a contact inquiry, validates, rate limits, and sends email | Body: `{"name": "Jane", "email": "jane@example.com", "message": "Hi!"}` |
| `GET` | `/actuator/health` | Spring Boot health check (reports DB connectivity) | `{"status": "UP", "components": {"db": {"status": "UP"}}}` |

---

## 🚀 Local Development & Setup

### Prerequisites
- **Java**: JDK 21 or later
- **Maven**: 3.9+ (or use IDE bundled Maven)
- **Node.js**: 20+ (Node 24 tested)
- **MySQL**: 8.0+ (Only required for Option B)

---

### Option A: Zero-MySQL Quick Start (H2 In-Memory)

If you just want to run the application locally without setting up MySQL or Gmail SMTP, use Spring Boot's test runner. It launches the exact same API on an in-memory H2 database pre-populated with Flyway seed data:

```bash
cd backend
mvn spring-boot:test-run
```

*Note: In this mode, database state resets on restart, and contact form email delivery will simulate an SMTP failure, allowing you to test client-side error handling.*

---

### Option B: Full Setup with MySQL & Spring Mail

#### 1. Setup Local MySQL Database
Create a database named `spring_boot_db` in your MySQL server:
```sql
CREATE DATABASE spring_boot_db;
```

#### 2. Configure Environment Variables
Copy `backend/.env.example` to `backend/.env` and update the parameters:
```env
PORTFOLIO_DB_URL=jdbc:mysql://localhost:3306/spring_boot_db?createDatabaseIfNotExist=true
PORTFOLIO_DB_USERNAME=root
PORTFOLIO_DB_PASSWORD=your_mysql_password

# For contact email delivery (Optional for local browsing):
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_google_app_password
CONTACT_RECIPIENT=your_inbox@gmail.com
FRONTEND_URL=http://localhost:5173
```

#### 3. Run Backend
```bash
cd backend
mvn spring-boot:run
```
Flyway automatically creates all database tables and inserts seed data. Verify at [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health).

---

### Frontend Setup

In a separate terminal window:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173). It connects to `http://localhost:8080` by default (defined in `frontend/.env.development`).

---

## ⚙ Environment Configuration

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP Server port | `8080` |
| `PORTFOLIO_DB_URL` | JDBC Connection URL | `jdbc:mysql://localhost:3306/spring_boot_db...` |
| `PORTFOLIO_DB_USERNAME` | Database username | `root` |
| `PORTFOLIO_DB_PASSWORD` | Database password | *(empty)* |
| `MAIL_HOST` | SMTP Host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP Port | `587` |
| `MAIL_USERNAME` | SMTP Login email | *(empty)* |
| `MAIL_PASSWORD` | SMTP App password | *(empty)* |
| `CONTACT_RECIPIENT` | Email address where messages are delivered | *(empty)* |
| `FRONTEND_URL` | Allowed CORS origin(s) | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the Spring Boot REST API | `http://localhost:8080` (dev) |

---

## 🗃 Database Migrations & Content Updates

Database schema and seed records are managed via **Flyway** in `backend/src/main/resources/db/migration`:

- `V1__create_content_tables.sql`: DDL defining `profile`, `skill`, `project`, `education`, `certification`, and `contact_message` tables.
- `V2__seed_initial_content.sql`: Production seed data for Anurag's profile, projects (Multi-Agent AI Platform, Student Management System, SocialSync, Portfolio), skills taxonomy, and education.
- `V3__add_grastech_java_certification.sql`: First accredited certification record for Core and Advanced Java 90-Hour summer training.

> [!IMPORTANT]
> **Flyway Checksum Rule**: Never modify an already-applied migration file (`V1`, `V2`, `V3`). Flyway calculates a SHA-256 checksum and will fail startup on mismatch. To add or update content, either execute standard SQL statements (`UPDATE`/`INSERT`) on your running database or create a new incremental migration file (`V4__...sql`).

---

## 🧪 Testing & Quality Assurance

Both frontend and backend include comprehensive automated test suites.

### Run Backend Tests (JUnit 5 + Mockito + MockMvc)
```bash
cd backend
mvn test
```
- Tests run against an isolated in-memory H2 database with the `test` profile.
- Covers controller endpoints, data models, exception handler RFC 9457 compliance, rate limiter sliding-window boundaries, and database outage recovery.

### Run Frontend Tests (Vitest + Testing Library)
```bash
cd frontend
npm test               # Run Vitest suite once
npm run test:watch     # Run in watch mode for development
npm run lint           # Run ESLint check
npm run build          # Typecheck & production bundle build
```
- Covers hook data lifecycles (`useApi`), client error handling, navbar active-section tracking, dynamic footer copyright year, glassmorphic theme toggling, and complete contact form UX.

---

## 🚢 Deployment Guide

The system is architected for separate deployment of the frontend and backend:

1. **Database**: Managed cloud MySQL (TiDB Cloud Serverless, Railway MySQL, or Aiven).
2. **Backend**: Deployed to **Render** or **Railway** using the included `backend/Dockerfile` with container port mapping and environment variables.
3. **Frontend**: Deployed to **Vercel** with `VITE_API_URL` pointing to the deployed backend address.

For detailed, step-by-step instructions on setting up cloud databases, configuring production environment variables, and handling cold starts, read the [Deployment Guide](docs/DEPLOYMENT.md).

---

## 📚 Documentation Links

- [Software Requirements Specification (SRS)](docs/SRS.md) — Comprehensive functional and non-functional requirements.
- [Production Deployment Guide](docs/DEPLOYMENT.md) — Step-by-step cloud hosting instructions.
- [Developer Guidelines (CLAUDE.md)](CLAUDE.md) — Code style, architectural rules, and gotchas.

---

## 👨‍💻 About the Author

**Anurag Joshi**
- **Role**: Java Full-Stack Developer
- **Education**: B.Tech in Computer Science and Engineering (2023–2027), Babu Banarasi Das University, Lucknow
- **GitHub**: [@anurag-joshi-1403](https://github.com/anurag-joshi-1403)
- **LinkedIn**: [Anurag Joshi](https://www.linkedin.com/in/anurag-joshi-49749229a/)
- **Email**: [anuragjoshi1403@gmail.com](mailto:anuragjoshi1403@gmail.com)
