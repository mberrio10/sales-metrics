# Analytics Dashboard (Node.js + Express)

A professional-grade analytics dashboard built with **Node.js, Express, and MongoDB**, designed to showcase clean architecture, reproducible workflows, and automated CI/CD deployment.

---

## 🚀 Features
- **Modular Express setup** with EJS templates for clean, reusable views
- **Authentication & flash messaging** for secure, user-friendly sessions
- **Analytics normalization** and formatting utilities for consistent data
- **Chart.js integration** layered with text lists for validation and clarity
- **CI/CD pipeline** with GitHub Actions + Render
  - Runs automated tests on every push/PR
  - Deploys to Render only if tests pass
  - Health check endpoint ensures deploys are truly live

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Frontend:** EJS, Chart.js, custom CSS
- **Deployment:** Render
- **CI/CD:** GitHub Actions

---

## 🔑 CI/CD Workflow
1. **Push to `main`**
   - GitHub Actions runs `npm ci` and `npm test`.
   - If tests pass, a deploy is triggered on Render.
2. **Health Check**
   - Workflow waits until `/health` endpoint returns `200 OK`.
   - Ensures the app is fully live before marking deploy successful.
3. **Scalability**
   - Current setup: production deploys only.
   - Easily extendable to staging previews for pull requests by adding a second Render service.

---

## 📂 Project Structure
- .github/workflows/ # CI/CD 
- pipeline src/ # App source code 
- views/ # EJS templates 
- public/ # Static assets (CSS, JS) 
- server.js # Express entry point


---

## 🧪 Health Check Endpoint
```js
app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: "ok", db: "connected" });
  } else {
    res.status(500).json({ status: "error", db: "not connected" });
  }
});

```
## 📈 Future Enhancements
- Add staging environment for PR previews

- Expand health checks to include external services (cache, APIs)

- Add more data visualizations and export options

## 💡 About This Project
- This project is designed to demonstrate:

- Clear, reproducible workflows

- Professional CI/CD practices

- Incremental, modular development

- Readiness for real-world scaling

## 🔐 Session Secrets

This project uses **dynamic session secrets** for development and demo purposes.  
In production, you should always set a fixed `SESSION_SECRET` in your environment variables.  
But for local testing or quick clones, the app will **generate a random secret automatically** if none is provided.

### Example (server.js)

```js
const session = require("express-session");
const crypto = require("crypto");

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);
```
## 🚀 How to Deploy

This project is wired for **automatic deployment** using GitHub Actions and Render.  
Follow these steps to set it up for your own fork:

### 1. Fork or Clone the Repo
```bash
git clone https://github.com/your-username/analytics-dashboard.git
cd analytics-dashboard
```

# 2. Create a Render Web Service
- Go to Render → New → Web Service.

- Connect your GitHub repo.

- Set build command: npm install

- Set start command: npm start

- Copy the Service ID from the service’s Settings tab.

# 3. Generate a Render API Key
- In Render → Account Settings → API Keys.

- Create a new key and copy it.

# 4. Add GitHub Secrets
- In your GitHub repo → Settings → Secrets and variables → Actions:

- **RENDER_API_KEY =** your Render API key

- **RENDER_SERVICE_ID =** your Render service ID

# 5. Push to Main
  Any push to main will:

- Run tests **(npm test)**

- If tests pass, trigger a Render deploy

- Wait until the **/health** endpoint returns **200 OK**

# 6. Session Secrets
- For local testing, the app generates a random session secret if none is provided.

- For production, set **SESSION_SECRET** in Render’s Environment tab.

```js
const SESSION_SECRET = process.env.SESSION_SECRET 
  || require("crypto").randomBytes(32).toString("hex");
```

# 7. Verify Deployment
- Open your Render URL in the browser.

- Check **/health → should return { status: "ok", db: "connected" }**.