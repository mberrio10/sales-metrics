const express = require("express");
const router = express.Router();
const {
  getTotalProfit,
  getProfitPerAgent,
  getProfitPerRole,
  getProfitByOutreach,
  getRecentJobs,
} = require("../services/analyticsService");
const requireLogin = require("../middleware/auth");

router.get("/metrics", requireLogin, async (req, res) => {
  try {
    const [
      totalProfit,
      profitPerAgent,
      profitPerRole,
      profitByOutreach,
      recentJobs,
    ] = await Promise.all([
      getTotalProfit(),
      getProfitPerAgent(),
      getProfitPerRole(),
      getProfitByOutreach(),
      getRecentJobs(),
    ]);

    res.render("dashboard", {
      username: req.session.username,
      totalProfit,
      profitPerAgent,
      profitPerRole,
      profitByOutreach,
      recentJobs,
    });
  } catch (err) {
    console.error("Error fetching metrics:", err);
    res.status(500).send("Error loading metrics");
  }
});

module.exports = router;
