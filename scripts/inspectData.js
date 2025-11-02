// scripts/inspectData.js
const mongoose = require("mongoose");
require("dotenv").config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    const data = await mongoose.connection.db
      .collection("dummy_data")
      .findOne();
    const role = await mongoose.connection.db
      .collection("dummy_roles")
      .findOne();

    console.log("Sample dummy_data:", data);
    console.log("Sample dummy_roles:", role);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
