const express = require("express");
const router = express.Router();
const { validateUser } = require("../services/authService");

// GET login page
router.get("/login", (req, res) => {
  res.render("login"); // views/login.ejs
});

// POST login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const isValid = await validateUser(username, password);

  if (!isValid) {
    req.flash("error", "Invalid credentials. Please try again.");
    return res.redirect("/login");
  }

  req.session.userId = "session-user"; // fake or real ID depending on mode
  req.session.username = username;
  req.flash("success", "Welcome back!");
  res.redirect("/dashboard");
});

// GET logout
router.get("/logout", (req, res, next) => {
  // Replace the current session with a fresh one
  req.session.regenerate((err) => {
    if (err) {
      console.error("Error regenerating session:", err);
      return res.redirect("/dashboard");
    }

    // Now that we have a fresh session, set the flash message
    req.flash("success", "You have been logged out successfully.");
    res.redirect("/login");
  });
});

module.exports = router;
