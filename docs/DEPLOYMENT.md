# Deployment

Three pieces, deployed separately: a hosted **MySQL** database, the **Spring Boot API** (Render or Railway), and the **React site** (Vercel). Deploy them in that order: each one needs the address of the one before it.

## 1. Hosted MySQL

The MySQL on your computer can't be reached from Render or Railway, so the live site needs a cloud database. Options to compare (check each one's current free-tier terms before choosing):

- **Railway MySQL**: simplest if the API also runs on Railway.
- **Aiven for MySQL**: managed MySQL with a free plan.
- **TiDB Cloud Serverless**: MySQL-compatible with a free tier.

You need its host, port, database name, username, and password. On first start, Flyway creates the tables and loads the content, so there's nothing to import.

## 2. API on Render (or Railway)

**Render** has no native Java runtime, so it builds `backend/Dockerfile`:

1. New Web Service from the GitHub repository. Root directory: `backend`. Runtime: Docker.
2. Health check path: `/actuator/health`.
3. Environment variables (Render sets `PORT` itself):

| Variable | Value |
|---|---|
| `PORTFOLIO_DB_URL` | `jdbc:mysql://HOST:PORT/DATABASE?sslMode=REQUIRED` |
| `PORTFOLIO_DB_USERNAME` / `PORTFOLIO_DB_PASSWORD` | From the database provider |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Gmail address and Google app password |
| `CONTACT_RECIPIENT` | Inbox that receives contact messages |
| `FRONTEND_URL` | The Vercel address from step 3 (comma-separate several, e.g. a custom domain and the `vercel.app` one) |

**Railway** can build the Maven project without the Dockerfile; set the same variables.

Check `https://YOUR-API/actuator/health` shows `"db": {"status": "UP"}`.

## 3. Site on Vercel

1. Import the repository. Root directory: `frontend` (Vercel detects Vite: build `npm run build`, output `dist`).
2. Environment variable `VITE_API_URL` = the API address from step 2, no trailing slash. It's built into the bundle, so redeploy after changing it. It also turns on the profile preload in `index.html`, which cut the main content's load time by about 0.75 s in slow-4G tests.
3. Put the Vercel address (and any custom domain) into the API's `FRONTEND_URL`, then restart the API.

## 4. After deploying

- [ ] Every section loads on the live site, in light and dark themes.
- [ ] Send yourself a message through the form: it arrives, and replying goes to the visitor's address.
- [ ] **Rate limit sees real visitors.** Send 6 messages from your phone on mobile data (the 6th should be refused), then one from your laptop on Wi-Fi (it should go through). If the laptop is refused too, every visitor shares one limit because the host's proxy address isn't trusted: set `server.tomcat.remoteip.internal-proxies` to the host's documented proxy range.
- [ ] Run Lighthouse on the live URL (target: 90+ performance and accessibility, LCP under 2.5 s).
- [ ] Set up the keep-warm ping (next section).
- [ ] Add the live URL to the Open Graph and canonical tags in `frontend/index.html`, and to the resume header.

## Cold starts on Render's free tier

A free Render service sleeps after 15 minutes without traffic, and the next visitor waits up to about a minute while it starts. The site handles this honestly (loading placeholders, then a "server may be waking up" note after 5 seconds), but it hurts first impressions and the LCP target.

| Option | Cost | Notes |
|---|---|---|
| **GitHub Actions keep-warm** (`.github/workflows/keep-warm.yml`, already in the repo) | Free | Pings `/actuator/health` every 10 minutes. Turn it on by adding a `BACKEND_URL` repository variable. GitHub can delay scheduled runs at busy times, and disables them after 60 days without repository activity. One always-on service fits Render's 750 free instance-hours a month. |
| **UptimeRobot** (or a similar monitor) | Free account | Pings every 5 minutes and emails you if the API goes down. More punctual than GitHub's scheduler. |
| **Paid always-on instance** (Render paid plan, or Railway) | Monthly fee | No cold starts at all. |

**Recommendation:** start with the keep-warm workflow, add an UptimeRobot monitor for punctuality and downtime alerts, and move to a paid instance only if cold starts still show up.
