const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");

const path = require("path");

require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout"); // default layout file

// Session for login
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

// Flash middleware
app.use(flash());

// Expose session to views
app.use((req, res, next) => {
  res.locals.session = req.session; // makes session available in all views
  res.locals.currentPath = req.path; // expose current path
  next();
});

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.getMessages = () => ({
    error: req.flash("error"),
    success: req.flash("success"),
  });
  next();
});

const authRoutes = require("./routes/auth");
const metricsRoutes = require("./routes/metrics");
const requireLogin = require("./middleware/auth");

app.use("/", authRoutes);
app.use("/", metricsRoutes);

// Protect dashboard
// Protect dashboard
app.get("/dashboard", requireLogin, (req, res) => {
  res.redirect("/metrics");
});

// app.get("/dashboard", requireLogin, (req, res) => {
//   res.render("dashboard", { username: req.session.username }); // views/dashboard.ejs
// });

// DB connection
const connectDB = require("./config/db");
connectDB();

// Routes placeholder
app.get("/", (req, res) => res.redirect("/login"));

// Health check route
app.get("/health", async (req, res) => {
  try {
    // Check DB connection state
    const dbState = mongoose.connection.readyState;
    // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting

    if (dbState === 1) {
      res.status(200).json({ status: "ok", db: "connected" });
    } else {
      res.status(500).json({ status: "error", db: "not connected" });
    }
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
