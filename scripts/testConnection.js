const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// bring in your models
require("../models/Data");
require("../models/Role");

const Data = mongoose.model("Data");
const Role = mongoose.model("Role");

const app = express();

// connect once at startup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

/**
 * Test route
 * GET http://localhost:4000/test-data
 */
app.get("/test-data", async (req, res) => {
  try {
    const sampleData = await Data.findOne();
    const sampleRole = await Role.findOne();

    res.json({
      message: "Collections are wired correctly",
      sampleData,
      sampleRole,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// run this test server on a different port (e.g. 4000)
app.listen(4000, () => {
  console.log("🚀 Test server running at http://localhost:4000/test-data");
});

// async function run() {
//   try {
//     // connect using the URI in your .env
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     // list all databases this user can see
//     const admin = mongoose.connection.db.admin();
//     const dbs = await admin.listDatabases();
//     console.log(
//       "Databases available:",
//       dbs.databases.map((d) => d.name)
//     );

//     // try to read from dummy_data and dummy_roles
//     const dataSample = await mongoose.connection.db
//       .collection("dummy_data")
//       .findOne();
//     const roleSample = await mongoose.connection.db
//       .collection("dummy_roles")
//       .findOne();

//     console.log("Sample from dummy_data:", dataSample);
//     console.log("Sample from dummy_roles:", roleSample);

//     process.exit();
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     process.exit(1);
//   }
// }

// run();
