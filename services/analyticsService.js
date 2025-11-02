const DummyData = require("../models/Data");
const DummyRoles = require("../models/Role");

// Total profit across all jobs
async function getTotalProfit() {
  const result = await DummyData.aggregate([
    { $group: { _id: null, totalProfit: { $sum: "$profit" } } },
  ]).exec();
  return result[0]?.totalProfit || 0;
}

// Profit per agent
async function getProfitPerAgent() {
  return DummyData.aggregate([
    { $group: { _id: "$agent", totalProfit: { $sum: "$profit" } } },
    { $sort: { totalProfit: -1 } },
  ]).exec();
}

// Profit per role
async function getProfitPerRole() {
  return DummyData.aggregate([
    {
      $lookup: {
        from: "dummy_roles", // collection name in MongoDB
        localField: "agent",
        foreignField: "agent",
        as: "roleInfo",
      },
    },
    { $unwind: "$roleInfo" },
    {
      $group: {
        _id: "$roleInfo.role",
        totalProfit: { $sum: "$profit" },
      },
    },
    { $sort: { totalProfit: -1 } },
  ]).exec();
}

// Profit grouped by outreach method (lead)
async function getProfitByOutreach() {
  return DummyData.aggregate([
    { $group: { _id: "$lead", totalProfit: { $sum: "$profit" } } },
    { $sort: { totalProfit: -1 } },
  ]).exec();
}

// Recent jobs
async function getRecentJobs(limit = 5) {
  return DummyData.find().sort({ timestamp: -1 }).limit(limit).lean().exec();
}

module.exports = {
  getTotalProfit,
  getProfitPerAgent,
  getProfitPerRole,
  getProfitByOutreach,
  getRecentJobs,
};
