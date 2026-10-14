# Anurag Joshi — Portfolio

Personal portfolio site: a React + TypeScript frontend (Vite) that reads its content from a Spring Boot REST API backed by MySQL.

```
frontend/   React 18 + TypeScript + Vite, CSS Modules, Lucide icons
backend/    Spring Boot 3 (Java 21), Spring Data JPA, MySQL, Spring Mail
```

## Run locally

**Prerequisites:** JDK 21+, Maven 3.9+, Node 20+, MySQL 8 running locally.

### Backend (http://localhost:8080)

1. Copy `backend/.env.example` to `backend/.env` and set `DB_PASSWORD` to your MySQL password. For the contact form, also set `MAIL_USERNAME`, `MAIL_PASSWORD` (a Google app password for Gmail), and `CONTACT_RECIPIENT`.
2. Start the API from the `backend` folder:

   ```bash
   mvn spring-boot:run
   ```

3. Check http://localhost:8080/actuator/health. `"db": {"status": "UP"}` means MySQL is connected. On first run Flyway creates the tables in `spring_boot_db` and loads the initial content from `src/main/resources/db/migration`.

**Changing content:** after the first run, update content with SQL (`INSERT`/`UPDATE`) and never edit an applied migration file. Flyway refuses to start if an applied migration's checksum changes.

Tests use an in-memory H2 database, so `mvn test` needs no MySQL.

### Frontend (http://localhost:5173)

From the `frontend` folder:

```bash
npm install
npm run dev
```

`npm run lint` and `npm run build` must both pass before a commit.
